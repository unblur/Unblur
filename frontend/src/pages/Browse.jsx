import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { reset as authReset } from '../features/auth/authSlice'
import { getArtworks, reset } from '../features/artwork/artworkSlice'
import { toast } from 'react-toastify'
import CardsContainer from '../components/CardsContainer'

const Browse = () => {
  const [page, setPage] = useState(1)
  const dispatch = useDispatch()
  const { artworks, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.artwork
  )

  useEffect(() => {
    dispatch(authReset())
  }, [dispatch])

  useEffect(() => {
    dispatch(getArtworks(1))
  }, [dispatch])

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isError || isSuccess) {
      dispatch(reset())
    }
  }, [isError, isSuccess, message, dispatch])

  window.onscroll = function (ev) {
    const pageHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    )
    if (window.innerHeight + window.scrollY >= pageHeight) {
      dispatch(getArtworks(page + 1))
      setPage(page + 1)
    }
  }

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
