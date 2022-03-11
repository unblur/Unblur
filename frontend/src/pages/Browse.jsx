import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { reset as authReset } from '../features/auth/authSlice'

const Browse = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(authReset())
  }, [dispatch])

  return <div>this is the browse page</div>
}

export default Browse
