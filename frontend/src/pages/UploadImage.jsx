import { useState } from 'react'
import axios from 'axios'
import { Navigate } from 'react-router-dom'

export const UploadImage = () => {
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)
  const [algosToUnblur, setAlgosToUnblur] = useState(10)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const onFormSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('image', file)
    formData.append('algosToUnblur', algosToUnblur)
    const token = localStorage.getItem('jwtToken')
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    }
    setLoading(true)
    axios
      .post('http://localhost:8000/api/artworks/upload', formData, config)
      .then((response) => {
        setLoading(false)
        setSuccess(true)
      })
      .catch((error) => {
        setLoading(false)
        setMessage('Something went wrong uploading the image')
      })
  }

  const onChange = (e) => {
    setFile(e.target.files[0])
  }

  if (loading) {
    return <p>Uploading this may take a second...</p>
  }

  if (success) {
    return <Navigate to='/browse' />
  }

  return (
    <div>
      <form onSubmit={onFormSubmit}>
        {message && <p>{message}</p>}
        <h1>Upload Image</h1>
        <input type='file' name='image' onChange={onChange} />
        <br />
        <input
          type='number'
          name='algosToUnblur'
          value={algosToUnblur}
          onChange={(e) => {
            setAlgosToUnblur(e.target.value)
          }}
        />
        <br />
        <button type='submit'>Upload</button>
      </form>
    </div>
  )
}
