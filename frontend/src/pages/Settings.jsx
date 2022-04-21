import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaWallet } from 'react-icons/fa'
import WalletConnect from '@walletconnect/client'
import QRCodeModal from 'algorand-walletconnect-qrcode-modal'
import { toast } from 'react-toastify'
import { getSelf, reset, signOut, updateSelf } from '../features/auth/authSlice'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {
  walletConnectInit,
  onConnect,
  selectAddress,
  setConnected,
  onSessionUpdate,
  selectConnector,
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

  const { accounts, assets, connected, chain, fetching } = useSelector(
    (state) => state.walletConnect
  )

  const address = useSelector(selectAddress)
  const connector = useSelector(selectConnector)

  const loadProfileState = () => {
    setFormData(() => ({
      username: self.username,
      profileName: self.profileName || '',
    }))
    setWallet(self.wallet)
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
    console.log('useEffect of connector is hit.')
    console.log(connector)
    // Check if connection is already established
    if (connector) {
      console.log(connector)
      console.log('connector exists.')
      dispatch(setConnected(true))
      if (!connector.connected) {
        connector.createSession()
      }
      const { accounts } = connector
      dispatch(onSessionUpdate(accounts))
    }
  }, [connector])

  useEffect(() => {
    if (address) {
      setWallet(address)
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
    dispatch(walletConnectInit())
    console.log('walletConnectInit called.')
  }

  // const walletConnectInit = async (e) => {
  //   e.preventDefault()

  //   // bridge url
  //   const bridge = 'https://bridge.walletconnect.org'

  //   // create new connector
  //   const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal })

  //   // check if already connected
  //   if (!connector.connected) {
  //     // create new session
  //     await connector.createSession()
  //   }

  //   connector.on('connect', (error, payload) => {
  //     if (error) {
  //       throw error
  //     }

  //     const { accounts } = payload.params[0]
  //     setWallet(accounts[0])
  //     connector.killSession()
  //   })

  //   connector.on('disconnect', (error, payload) => {
  //     if (error) {
  //       throw error
  //     }
  //   })
  // }

  // TODO: Update the user's profile with new information
  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      username,
      profileName,
      wallet,
    }
    console.log('onSubmit called.')
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
