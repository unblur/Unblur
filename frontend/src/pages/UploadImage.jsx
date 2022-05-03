import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { uploadArtwork, reset } from '../features/artwork/artworkSlice'
import { selectAddress } from '../features/walletconnect/walletConnectSlice'

const UploadImage = () => {
  const [file, setFile] = useState(null)
  const [formData, setFormData] = useState({
    algosToUnblur: 10,
    title: '',
    description: '',
  })
  const { algosToUnblur, title, description } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.artwork
  )

  const walletAddress = useSelector(selectAddress)

  useEffect(() => {
    if (isError) {
      toast.error(message)
      setFile(null)
    }

    if (isSuccess) {
      toast.success(message)
      navigate('/browse')
    }

    if (isSuccess || isError) {
      dispatch(reset())
    }
  }, [isError, isSuccess, message, dispatch, navigate])

  // useEffect(() => {
  //   if (localStorage?.getItem('isWalletConnected') === 'true') {
  //     dispatch(walletConnectInit())
  //   }
  // }, [])

  const onChange = (e) => {
    setFile(e.target.files[0])
  }

  const onChangeForm = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (!file) {
      toast.error('Please upload an image.')
      return
    }

    if (algosToUnblur === '' || algosToUnblur < 0) {
      toast.error('Please enter valid algos to unblur.')
      return
    }

    if (!title.replace(/\s/g, '').length) {
      toast.error('Please enter a title.')
      return
    }

    if (
      localStorage.getItem('isWalletConnected') === null ||
      localStorage.getItem('isWalletConnected') === 'false'
    ) {
      toast.error('Please connect your wallet within the settings page.')
      return
    }

    const formData = new FormData()
    formData.append('image', file)
    formData.append('algosToUnblur', algosToUnblur)
    formData.append('title', title.trim())
    formData.append('description', description.trim())

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
              onChange={onChangeForm}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='title'>title</label>
            <input
              type='text'
              name='title'
              className='form-control'
              id='title'
              value={title}
              onChange={onChangeForm}
            />
          </div>

          {/* TODO: identify this as optional and other fields as required */}
          {/* TODO: change this to a textarea */}
          <div className='form-group'>
            <label htmlFor='description'>description</label>
            <input
              type='text'
              name='description'
              className='form-control'
              id='description'
              value={description}
              onChange={onChangeForm}
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
