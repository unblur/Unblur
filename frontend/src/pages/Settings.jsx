import { useState } from 'react'

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

          {/* TODO: List of wallets with walletName and walletID. Allows user to update and add new wallets */}

          {/* TODO: reset password by sending a password reset link to their email */}
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
