import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaWallet } from 'react-icons/fa'
import { toast } from 'react-toastify'
import {
  getSelf,
  reset,
  signOut,
  updateSelf,
  updateWallet,
} from '../features/auth/authSlice'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {
  walletConnectInit,
  onConnect,
  selectAddress,
  setConnected,
  onSessionUpdate,
  selectConnector,
  resetConnection,
} from '../features/walletconnect/walletConnectSlice'

const Settings = () => {
  // TODO: populate user's state
  const [formData, setFormData] = useState({
    username: '',
    profileName: '',
  })
  const { username, profileName } = formData
  const [wallet, setWallet] = useState('')

  const dispatch = useDispatch()
  const { self, isLoading, isError, isSuccess, message, statusCode } =
    useSelector((state) => state.auth)

  const address = useSelector(selectAddress)
  const connector = useSelector(selectConnector)

  const loadProfileState = () => {
    setFormData(() => ({
      username: self.username,
      profileName: self.profileName || '',
    }))
    setWallet(self.wallet)
  }

  const subscribeToEvents = (connector) => {
    if (!connector) {
      return
    }
    // Subscribe to connection events
    connector.on('connect', (error, payload) => {
      if (error) {
        throw error
      }
      dispatch(onConnect(payload))
    })

    connector.on('session_update', (error, payload) => {
      if (error) {
        throw error
      }
      const { accounts } = payload.params[0]
      dispatch(onSessionUpdate(accounts))
    })

    connector.on('disconnect', (error, payload) => {
      if (error) {
        throw error
      }
      localStorage.setItem('isWalletConnected', false)
      const userData = {
        wallet: '',
      }
      dispatch(updateWallet(userData))
      toast.success('WalletConnect successfully disconnected.')
      dispatch(resetConnection())
    })
  }

  useEffect(() => {
    if (!self) {
      dispatch(getSelf())
    }

    if (self) {
      loadProfileState()
    }
  }, [dispatch])

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    // Log out if unauthorized
    if (isError && statusCode === 401) {
      dispatch(signOut())
    }

    // Load initial profile data
    if (isSuccess) {
      loadProfileState()
    }

    if (isSuccess && message) {
      toast.success(message)
    }

    if (isError || isSuccess) {
      dispatch(reset())
    }
  }, [isError, isSuccess, message, dispatch])

  useEffect(() => {
    // Check if connection is already established
    if (connector) {
      subscribeToEvents(connector)
      if (!connector.connected) {
        connector.createSession()
        localStorage.setItem('isWalletConnected', true)
        toast.success('WalletConnect successfully connected.')
      }
      const { accounts } = connector
      dispatch(onSessionUpdate(accounts))
    } else if (localStorage?.getItem('isWalletConnected') === 'true') {
      dispatch(walletConnectInit())
    }
  }, [connector])

  useEffect(() => {
    if (address) {
      setWallet(address)

      const userData = {
        wallet: address,
      }

      dispatch(updateWallet(userData))
    } else {
      setWallet('')
    }
  }, [address])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onWalletConnect = (e) => {
    e.preventDefault()
    if (!connector) {
      dispatch(walletConnectInit())
    } else {
      toast.error('WalletConnect session already exists please disconnect.')
    }
  }

  // TODO: Update the user's profile with new information
  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      username,
      profileName,
      wallet,
    }
    dispatch(updateSelf(userData))
  }

  return (
    <>
      <section className='heading'>
        <h1>Edit your profile</h1>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          {/* TODO: changing username should be unique or not allowed at all */}
          <div className='form-group'>
            <label htmlFor='username'>username</label>
            <input
              type='text'
              className='form-control'
              id='username'
              name='username'
              value={username}
              placeholder='username'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='profileName'>profile name</label>
            <input
              type='text'
              className='form-control'
              id='profileName'
              name='profileName'
              value={profileName}
              placeholder='profile name'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <label>connect wallet</label>
            <div className='wallet-address'>
              {wallet !== '' ? wallet : null}
            </div>
            <button
              className='btn btn-wallet-connect'
              onClick={onWalletConnect}
            >
              <FaWallet /> &nbsp; WalletConnect
            </button>
          </div>
          <div className='form-group'>
            <Link to='/resetpasswordrequest' className='link'>
              reset password
            </Link>
          </div>

          {/* TODO: List of wallets with walletName and walletID. Allows user to update and add new wallets */}

          <div className='form-group'>
            <button type='submit' className='btn btn-block btn-primary'>
              Save
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Settings
