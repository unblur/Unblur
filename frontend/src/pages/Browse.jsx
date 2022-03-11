import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { reset as authReset } from '../features/auth/authSlice'
import { getArtworks, reset } from '../features/artwork/artworkSlice'
import { toast } from 'react-toastify'

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
        <h1>Browse</h1>
      </section>

      {/* TODO: update loading screen */}
      {isLoading && <div>loading...</div>}

      {!isLoading &&
        artworks.map((artwork) => (
          // TODO: Make component for artwork
          // TODO: Test if this works
          <div key={artwork._id}>
            {/*This inline css is temporary*/}
            <img
              src={`http://localhost:8000/files/${artwork.blurredImage}`}
              style={{
                border: '1px solid black',
                padding: 5,
                maxWidth: 300,
                maxHeight: 300,
              }}
            />
          </div>
        ))}

      {!isLoading && !!!artworks.length && <div>no artworks to show</div>}
    </>
  )
}

export default Browse
