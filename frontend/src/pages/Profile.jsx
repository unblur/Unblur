import { useEffect } from 'react'
import { FaPen } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { getSelf, reset } from '../features/auth/authSlice'
import { toast } from 'react-toastify'

const Profile = () => {
  const dispatch = useDispatch()
  const { self, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (!self) {
      dispatch(getSelf())
    }
  }, [dispatch])

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isError || isSuccess) {
      dispatch(reset())
    }
  }, [isError, isSuccess, message, dispatch])

  // TODO: update loading screen
  if (isLoading || !self) {
    return (
      <>
        <div>loading...</div>
      </>
    )
  }

  return (
    <>
      <section className='heading left-align'>
        <h1>
          {`${self.profileName || self.username}'s Profile`}

          <Link to='/settings' className='reset-text-styles'>
            {' '}
            <FaPen size={30} className='edit-icon' />
          </Link>
        </h1>
        <div className='profile-username light-text'>@{self.username}</div>
      </section>

      {/* TODO: filter cards by type */}
      {/* TODO: display cards based on artworkIDs and transactionIDs (contains artworkID, but can't duplicate it). pass info to CardsContainer and that componenet will render depending on the information passed to it. Or make a new component called ProfileCardsContainer and ProfileCard to make code more clean */}
    </>
  )
}

export default Profile
