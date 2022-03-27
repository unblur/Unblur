import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { verifyEmailRequest, reset } from '../features/auth/authSlice'

const VerifyEmailRequest = () => {
  const [email, setEmail] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess) {
      toast.success(message)
      navigate('/signin')
    }

    if (isSuccess || isError) {
      dispatch(reset())
    }
  }, [isError, isSuccess, message, dispatch, navigate])

  const onChange = (e) => {
    setEmail(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()

    dispatch(verifyEmailRequest(email))
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
        <h1>Send Verification Email</h1>
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

export default VerifyEmailRequest
