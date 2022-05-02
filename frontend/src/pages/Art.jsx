import { useEffect, useState } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getSelf } from '../features/auth/authSlice'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {
  apiGetAccountBalance,
  apiSubmitTransaction,
} from '../features/walletconnect/api'
import {
  selectConnector,
  walletConnectInit,
} from '../features/walletconnect/walletConnectSlice'
import { addTransaction } from '../features/transactions/transactionSlice'

// TODO: update API_URL
const API_URL = `http://localhost:8000/api`

const Art = () => {
  const { state } = useLocation()
  const [creator, setCreator] = useState({})
  const [algos, setAlgos] = useState(0)

  const dispatch = useDispatch()
  const { self } = useSelector((state) => state.auth)
  const [isUnblurred, setUnblurred] = useState(false)
  const [percentageUnblurred, setPercentageUnblurred] = useState('0')
  const [contributorsNum, setcontributorsNum] = useState('0')
  const [algosRaised, setAlgosRaised] = useState('0')
  const connector = useSelector(selectConnector)

  // const { isError, isSuccess } = useSelector((state) => state.transactions)

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${API_URL}/users/${state.creatorID}`)
      setCreator(response.data)
    }
    const getArtworkTransactions = async () => {
      const endpoints = transactionIDs.map(
        (transactionID) => `${API_URL}/transactions/${transactionID}`
      )

      const transactionRet = await axios
        .all(endpoints.map((endpoint) => axios.get(endpoint)))
        .then((transactions) => {
          return transactions.map((transaction) => transaction.data)
        })
      const filteredTransactions = transactionRet.filter(
        (transaction) => transaction.artworkID == _id
      )

      getPercentageUnblurred(filteredTransactions)
    }

    if (state.creatorID) {
      fetchData()
    }
    if (state.transactionIDs) {
      getArtworkTransactions()
      setcontributorsNum(Object.keys(state.transactionIDs).length)
    }
  }, [])

  useEffect(() => {
    if (!self) {
      dispatch(getSelf())
    }
  }, [self])

  useEffect(() => {
    if (
      (connector === undefined || connector === null) &&
      localStorage?.getItem('isWalletConnected') === 'true'
    ) {
      dispatch(walletConnectInit())
    }
  }, [connector])

  // useEffect(() => {
  //   if (isSuccess) {
  //     dispatch(reset())
  //   }
  // }, [isSuccess])

  if (!state) {
    return <Navigate to='/browse' />
  }

  const {
    _id,
    creatorID,
    algosToUnblur,
    title,
    description,
    transactionIDs,
    blurredImage,
  } = state

  // FIXME: temporary function to show percentage, will be changed after parseTransactions is implemented
  // TODO: computes the percentage based on algos raised, which is computed in parseTransactions
  // TODO: rename to computePercentageUnblurred to avoid confusion with getPercentageUnblurred in Card.jsx
  const getPercentageUnblurred = (transactionsList) => {
    // TODO: set isUnblurred = true if (amount accumulated from transactions) >= algosToUnblur
    let total = 0
    for (let transaction in transactionsList) {
      total += transactionsList[transaction].algos
    }

    let percent = (total / algos) * 100

    if (percent >= 100) {
      percent = '100'
      setUnblurred(true)
    }
    setAlgosRaised(`${total}`)
    setPercentageUnblurred(`${percent}%`)
  }

  const blurredImageLink = `http://localhost:8000/files/${blurredImage}`
  const index = blurredImage.indexOf('-')
  const unblurredImageLink = `http://localhost:8000/files/${blurredImage.substring(
    0,
    index
  )}${blurredImage.substring(index + 8)}`

  const onChange = (e) => {
    setAlgos(e.target.value)
  }

  const onContribute = async (e) => {
    // TODO: User has a wallet connected, otherwise alert redirect

    // Non negative and non zero check
    if (algos <= 0) {
      toast.error('Please enter a valid number of algos.')
      return
    }

    if (
      localStorage.getItem('isWalletConnected') === null ||
      localStorage.getItem('isWalletConnected') === 'false'
    ) {
      toast.error('Please first connect a wallet.')
      return
    }

    if (!creator.wallet) {
      toast.error('Creator no longer accepting donations.')
      return
    }

    if (!self?.wallet) {
      toast.error('Please first connect a wallet.')
      return
    }

    const userBalance = await apiGetAccountBalance(self.wallet)

    if (userBalance < algos) {
      toast.error('You do not have enough algos within your wallet.')
      return
    }

    // Confirmation
    // TODO: make a better confirmation
    const result = window.confirm(
      `Are you sure you want to donate ${algos} algos?`
    )
    if (result) {
      const confirmData = await apiSubmitTransaction(
        self.wallet,
        creator.wallet,
        algos,
        creator.profileName,
        connector
      )
      if (confirmData) {
        toast.success('Transaction made succesfully.')

        const transactionData = {
          donatorID: self._id,
          receiverID: creatorID,
          algos,
          artworkID: _id,
          algoTxnID: confirmData,
        }
        dispatch(addTransaction(transactionData))
      } else {
        toast.error('An issue occured with the transaction.')
      }
      return
    }
  }

  return (
    <>
      <div className='artwork-container'>
        {/* TODO: update image url */}
        <div className='artwork-image-container'>
          <img
            src={isUnblurred ? unblurredImageLink : blurredImageLink}
            className='artwork'
          />
        </div>

        <div className='artwork-info-container'>
          <h1>{title}</h1>

          {/* TODO: translate creatorID to creator's profile name or username if they don't have one */}
          <div className='artwork-creator light-text'>
            {creator.username ?? ''}
          </div>

          <div className='artwork-progress'>
            <div className='card-progress-bar'>
              <div style={{ width: percentageUnblurred }}></div>
            </div>
            <div className='percentage-complete'>
              {percentageUnblurred} complete
            </div>
          </div>

          <div className='artwork-description'>{description}</div>

          {/* TODO: update contributors and algos raised */}
          <div className='artwork-summary-box'>
            <div className='summary-numbers'>
              <div className='summary-number'>
                <div className='artwork-stat'>{contributorsNum}</div>
                <div className='artwork-stat-label'>contributors</div>
              </div>
              <div className='summary-number'>
                <div className='artwork-stat'>{algosRaised}</div>
                <div className='artwork-stat-label'>algos raised</div>
              </div>
              <div className='summary-number'>
                <div className='artwork-stat'>{algosToUnblur}</div>
                <div className='artwork-stat-label'>algos needed</div>
              </div>
            </div>

            {/* TODO: button to contribute, new modal pops up */}
            <div className='form-group summary-button'>
              <input
                type='number'
                className='form-control'
                name='algos'
                placeholder='algos'
                value={algos}
                onChange={onChange}
              />
              <button className='btn btn-primary' onClick={onContribute}>
                contribute
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Art
