import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { reset as authReset } from '../features/auth/authSlice'
import { getArtworks, reset } from '../features/artwork/artworkSlice'
import { toast } from 'react-toastify'
import CardsContainer from '../components/CardsContainer'

const Browse = () => {
  const dispatch = useDispatch()
  const { artworks, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.artwork
  )

  useEffect(() => {
    dispatch(authReset())
    dispatch(getArtworks())
  }, [dispatch])

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    dispatch(reset())
  }, [isError, isSuccess, message, dispatch])

  return (
    <>
      <section className='heading'>
        <h1 className='left-align'>Browse</h1>
      </section>

      {/* TODO: update loading screen */}
      {isLoading && <div>loading...</div>}

      {!isLoading && <CardsContainer artworks={artworks} />}

      {!isLoading && !!!artworks.length && <div>no artworks to show</div>}
    </>
  )
}

export default Browse
