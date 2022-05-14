import { useEffect, useState } from 'react'
import { useLocation, Navigate, Link, useParams } from 'react-router-dom'
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
import { getArtworkById } from '../features/artwork/artworkSlice'
import { Comments } from '../components/Comments'
// TODO: update API_URL
const port = process.env.PORT || 8080
const hostName =
  process.env.WEBSITE_HOSTNAME || 'unblur-final.azurewebsites.net'
const API_URL = `https://${hostName}:${port}/api`

const Art = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { artwork, artworkLoading } = useSelector((state) => state.artwork)
  const connector = useSelector(selectConnector)
  const { self } = useSelector((state) => state.auth)
  const [algos, setAlgos] = useState('0')

  useEffect(() => {
    if (!artwork) {
      // Means we are going directly to this url so we have to make a network request
      dispatch(getArtworkById(id))
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

  if (!artworkLoading && !artwork) {
    return <Navigate to='/browse' />
  }

  if (!artwork) {
    return <div>loading...</div>
  }
  const port = process.env.PORT || 8080
  const hostName =
    process.env.WEBSITE_HOSTNAME || 'unblur-final.azurewebsites.net'
  const API_URL = `https://${hostName}:${port}`
  const blurredImageLink = `${API_URL}/files/${artwork.blurredImage}`

  const algosRaised = () => {
    // Compute total algos raised
    let total = 0
    artwork.transactionIDs.forEach((transaction) => {
      total += transaction.algos
    })
    return total
  }

  const percentUnblurred = () => {
    // Compute percentage unblurred and set whether image is unblurred
    const algosToUnblur = artwork.algosToUnblur
    let percent = (algosRaised() / algosToUnblur) * 100
    if (algosToUnblur === 0 || percent >= 100) {
      percent = 100
    }
    return percent.toFixed(1)
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
    if (!artwork.creatorID.wallet) {
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
        artwork.creatorID.wallet,
        algos,
        artwork.creatorID.profileName,
        connector
      )
      if (confirmData) {
        toast.success(
          'Transaction made succesfully. Page will automatically refresh once updated image is ready.'
        )
        const transactionData = {
          donatorID: self._id,
          receiverID: artwork.creatorID._id,
          algos,
          artworkID: artwork._id,
          algoTxnID: confirmData,
        }
        dispatch(addTransaction(transactionData))
      } else {
        toast.error('An issue occured with the transaction.')
      }
      return
    }
  }

  const contributorsNum = () => {
    const contributorsSet = new Set()
    artwork.transactionIDs.forEach((transaction) => {
      contributorsSet.add(transaction.donatorID)
    })
    return contributorsSet.size
  }

  return (
    <>
      <div className='artwork-container'>
        {/* TODO: update image url */}
        <div className='artwork-image-container'>
          <img src={blurredImageLink} className='artwork' />
        </div>
        <div className='artwork-info-container'>
          <h1>{artwork.title}</h1>
          {/* TODO: translate creatorID to creator's profile name or username if they don't have one */}
          <div className='artwork-creator'>
            <span>
              <Link
                to={`/user/${artwork.creatorID._id}`}
                className='light-text user-link'
              >
                {artwork.creatorID.username ?? ''}
              </Link>
            </span>
          </div>
          <div className='artwork-progress'>
            <div className='card-progress-bar'>
              <div style={{ width: `${percentUnblurred()}%` }}></div>
            </div>
            <div className='percentage-complete'>
              {percentUnblurred()}% complete
            </div>
          </div>
          <div className='artwork-description'>{artwork.description}</div>
          <div className='artwork-summary-box'>
            <div className='summary-numbers'>
              <div className='summary-number'>
                <div className='artwork-stat'>{contributorsNum()}</div>
                <div className='artwork-stat-label'>contributors</div>
              </div>
              <div className='summary-number'>
                <div className='artwork-stat'>{algosRaised()}</div>
                <div className='artwork-stat-label'>algos raised</div>
              </div>
              <div className='summary-number'>
                <div className='artwork-stat'>{artwork.algosToUnblur}</div>
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
                onChange={(e) => setAlgos(e.target.value)}
              />
              <button className='btn btn-primary' onClick={onContribute}>
                contribute
              </button>
            </div>
          </div>
        </div>
      </div>
      <Comments artworkId={artwork._id} />
    </>
  )
}

export default Art
