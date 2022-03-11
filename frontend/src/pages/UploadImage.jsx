import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { uploadArtwork, reset } from '../features/artwork/artworkSlice'

const UploadImage = () => {
  const [algosToUnblur, setAlgosToUnblur] = useState(10)
  const [file, setFile] = useState(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.artwork
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess) {
      toast.success(message)
      navigate('/browse')
    }

    dispatch(reset())
  }, [isError, isSuccess, message, dispatch, navigate])

  const onChange = (e) => {
    setFile(e.target.files[0])
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('image', file)
    formData.append('algosToUnblur', algosToUnblur)

    console.log(formData)

    dispatch(uploadArtwork(formData))
  }

  // TODO: update loading screen
  if (isLoading) {
    return (
      <>
        <div>uploading this may take a second...</div>
      </>
    )
  }

  return (
    <>
      <section className='heading'>
        <h1>Upload Image</h1>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label htmlFor='imageToUpload'>image to upload</label>
            <input
              type='file'
              name='image'
              className='form-control'
              onChange={onChange}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='algosToUnblur'>algos to unblur</label>
            <input
              type='number'
              name='algosToUnblur'
              className='form-control'
              id='algosToUnblur'
              value={algosToUnblur}
              onChange={(e) => {
                setAlgosToUnblur(e.target.value)
              }}
            />
          </div>

          <div className='form-group'>
            <button type='submit' className='btn btn-block btn-primary'>
              Upload
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default UploadImage
