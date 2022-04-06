import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { signIn, getSelf, reset } from '../features/auth/authSlice'

const SignIn = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  })
  const { emailOrUsername, password } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      dispatch(getSelf())
      navigate('/browse')
    }

    if (isSuccess || isError || user) {
      dispatch(reset())
    }
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      emailOrUsername,
      password,
    }

    dispatch(signIn(userData))
  }

  // TODO: update loading screen
  if (isLoading) {
    return (
      <>
        <div>loading...</div>
      </>
    )
  }

  return (
    <>
      <section className='heading'>
        <h1>Sign In</h1>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label htmlFor='emailOrUsername'>email or username</label>
            <input
              type='text'
              className='form-control'
              id='emailOrUsername'
              name='emailOrUsername'
              value={emailOrUsername}
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
              autoComplete='off'
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
