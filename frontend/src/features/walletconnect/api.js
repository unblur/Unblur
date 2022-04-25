import algosdk from 'algosdk'
import { formatJsonRpcRequest } from '@json-rpc-tools/utils'

const algodToken = `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
const algoServer = 'http://localhost'
const algodPort = 4001
const testNetClient = new algosdk.Algodv2(algodToken, algoServer, algodPort)
const numMicroAlgos = 1000000
const unblurPercentageFee = 0.01
const unblurWallet =
  'PHSKOSKMCORJVVBWNBGKISNAZLWHNOMOX3REKRNO3GRKETA65IM2O7X5YM'

export async function apiGetAccountBalance(address) {
  const accountInfo = await testNetClient.accountInformation(address).do()

  return accountInfo.amount / numMicroAlgos
}

export async function apiSubmitTransaction(
  fromAddress,
  toAddress,
  algos,
  receiverProfileName,
  connector
) {
  if (!fromAddress || !toAddress) {
    return null
  }

  // Construct the transaction
  let params = await testNetClient.getTransactionParams().do()
  // comment out the next two lines to use suggested fee
  params.fee = algosdk.ALGORAND_MIN_TX_FEE
  params.flatFee = true

  const enc = new TextEncoder()
  const donationNote = enc.encode(`Unblur donation to ${receiverProfileName}.`)
  const unblurFeeNote = enc.encode(`Unblur transaction fee.`)

  const orignalDonationInMicroAlgos = algos * numMicroAlgos
  const unblurFee = orignalDonationInMicroAlgos * unblurPercentageFee
  const donationInMicroAlgos = orignalDonationInMicroAlgos - unblurFee

  let donationTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: fromAddress,
    to: toAddress,
    amount: donationInMicroAlgos,
    note: donationNote,
    suggestedParams: params,
  })

  let donationTxId = donationTxn.txID().toString()

  let unblurFeeTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: fromAddress,
    to: unblurWallet,
    amount: unblurFee,
    note: unblurFeeNote,
    suggestedParams: params,
  })

  const unblurFeeTxId = unblurFeeTxn.txID().toString()

  const txns = [donationTxn, unblurFeeTxn]
  const txgroup = algosdk.assignGroupID(txns)

  const txnsToSign = txns.map((txn) => {
    const encodedTxn = Buffer.from(
      algosdk.encodeUnsignedTransaction(txn)
    ).toString('base64')

    return {
      txn: encodedTxn,
      message: 'Transaction of donation and unblur fee.',
    }
  })

  const requestParams = [txnsToSign]

  const request = await formatJsonRpcRequest('algo_signTxn', requestParams)

  // send request to bridge
  const result = await connector.sendCustomRequest(request)

  const decodedResult = result.map((element) => {
    return element ? new Uint8Array(Buffer.from(element, 'base64')) : null
  })

  let signedTxn = decodedResult

  let tx = await testNetClient.sendRawTransaction(signedTxn).do()

  let confirmedTxn = await algosdk.waitForConfirmation(
    testNetClient,
    tx.txId,
    4
  )

  if (confirmedTxn) {
    return donationTxId
  } else {
    return null
  }
}
