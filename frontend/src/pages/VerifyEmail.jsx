import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { verifyEmail, reset } from '../features/auth/authSlice'

const VerifyEmail = () => {
  const [searchParams, _] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isError, isSuccess, message } = useSelector((state) => state.auth)

  useEffect(() => {
    const data = {
      token: searchParams.get('token') || '',
      id: searchParams.get('id') || '',
    }
    dispatch(verifyEmail(data))
  }, [dispatch, searchParams])

  useEffect(() => {
    if (isError) {
      toast.error(message)
      navigate('/signin')
    }

    if (isSuccess) {
      toast.success(message)
      navigate('/signin')
    }

    dispatch(reset())
  }, [isError, isSuccess, message, dispatch, navigate])

  return (
    <>
      <div>verifying email...</div>
    </>
  )
}

export default VerifyEmail
