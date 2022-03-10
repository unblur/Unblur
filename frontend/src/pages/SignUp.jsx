import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { signUp, reset } from '../features/auth/authSlice'

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const { email, password, confirmPassword } = formData

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
      navigate('/')
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, dispatch, navigate])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    const userData = {
      email,
      password,
    }

    dispatch(signUp(userData))
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
        <h1>Sign Up</h1>
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
          </div>
          <div className='form-group'>
            <label htmlFor='confirmPassword'>confirm password</label>
            <input
              type='password'
              className='form-control'
              id='confirmPassword'
              name='confirmPassword'
              value={confirmPassword}
              placeholder='**************'
              onChange={onChange}
            />
          </div>
          {/* TODO: add support for username */}
          {/* <div className='form-group'>
            <label htmlFor='username'>username</label>
            <input
              type='text'
              className='form-control'
              id='username'
              name='username'
              value={username}
              placeholder='john_art'
              onChange={onChange}
            />
          </div> */}
          <div className='form-group'>
            <button type='submit' className='btn btn-block btn-primary'>
              Sign Up
            </button>
          </div>
          <div className='form-group'>
            <div className='link-description'>already have an account?</div>
            <Link to='/signin' className='link'>
              sign in
            </Link>
          </div>
        </form>
      </section>
    </>
  )
}

export default SignUp
