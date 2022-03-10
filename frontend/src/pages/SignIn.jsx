import { useState } from 'react'
import { Link } from 'react-router-dom'

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { email, password } = formData

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      email,
      password,
    }

    // dispatchEvent(signin(userData))
  }

  return (
    <>
      <section className='heading'>
        <h1>Sign In</h1>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label htmlFor='email'>email</label>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='john.doe@mail.com'
              onChange={onChange}
            />
            <Link to='/verifyemailrequest' className='link link-left'>
              resend verification email?
            </Link>
          </div>
          <div className='form-group'>
            <label htmlFor='password'>password</label>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='**************'
              onChange={onChange}
            />
            <Link to='/resetpasswordrequest' className='link link-left'>
              forgot your password?
            </Link>
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block btn-primary'>
              Sign In
            </button>
          </div>
          <div className='form-group'>
            <div className='link-description'>dont have an account?</div>
            <Link to='/signup' className='link'>
              sign up
            </Link>
          </div>
        </form>
      </section>
    </>
  )
}

export default SignIn
