import { useState } from 'react'

const Settings = () => {
  const [formData, setFormData] = useState({
    username: '',
    profileName: '',
    wallets: [],
  })
  const { username, profileName } = formData

  const onSubmit = () => {}
  const onChange = () => {}

  return (
    <>
      <section className='heading'>
        <h1>Edit your profile</h1>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          {/* TODO: changing username should be unique or not allowed at all */}
          {/* <div className='form-group'>
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
          </div> */}
          <div className='form-group'>
            <label htmlFor='profileName'>profile name</label>
            <input
              type='text'
              className='form-control'
              id='profileName'
              name='profileName'
              value={profileName}
              placeholder='profileName'
              onChange={onChange}
            />
          </div>

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
