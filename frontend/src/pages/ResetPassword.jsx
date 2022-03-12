import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword, reset } from '../features/auth/authSlice'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const { password, confirmPassword } = formData

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess) {
      toast.success(message)
      navigate('/signin')
    }

    dispatch(reset())
  }, [isError, isSuccess, message, dispatch, navigate])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const data = {
      token: searchParams.get('token') || '',
      id: searchParams.get('id') || '',
      password,
    }

    dispatch(resetPassword(data))
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
        <h1>Reset Password</h1>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
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
          <div className='form-group'>
            <button type='submit' className='btn btn-block btn-primary'>
              Send
            </button>
          </div>
          <div className='form-group'>
            <Link to='/signin' className='link'>
              back to sign in
            </Link>
          </div>
        </form>
      </section>
    </>
  )
}

export default ResetPassword
