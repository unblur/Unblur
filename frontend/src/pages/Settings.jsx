import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaWallet } from 'react-icons/fa'
import WalletConnect from '@walletconnect/client'
import QRCodeModal from 'algorand-walletconnect-qrcode-modal'

const walletConnectInit = async (e) => {
  e.preventDefault()

  // bridge url
  const bridge = 'https://bridge.walletconnect.org'

  // create new connector
  const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal })

  // check if already connected
  if (!connector.connected) {
    // create new session
    console.log('hit')
    await connector.createSession()
  }
  connector.on('session_update', async (error, payload) => {
    console.log(`connector.on("session_update")`)

    if (error) {
      throw error
    }

    const { accounts } = payload.params[0]
    this.onSessionUpdate(accounts)
  })

  connector.on('connect', (error, payload) => {
    console.log(`connector.on("connect")`)

    if (error) {
      throw error
    }

    this.onConnect(payload)
  })

  connector.on('disconnect', (error, payload) => {
    console.log(`connector.on("disconnect")`)

    if (error) {
      throw error
    }

    this.onDisconnect()
  })
}
// ==================================================================
const Settings = () => {
  // TODO: populate user's state
  const [formData, setFormData] = useState({
    username: '',
    profileName: '',
  })
  const { username, profileName } = formData
  // const [wallets, setWallets] = useState([
  //   {
  //     walletName: '',
  //     walletID: '',
  //   },
  // ])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  // TODO: update wallets state when wallets are changed
  const onWalletChange = (e) => {}

  // TODO: Update the user's profile with new information
  const onSubmit = () => {}

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
            <button
              className='btn btn-wallet-connect'
              onClick={walletConnectInit}
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
