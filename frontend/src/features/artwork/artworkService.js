import axios from 'axios'

// TODO: update API_URL
const API_URL = `http://localhost:8000/api/artworks`

// Get all artworks
const getArtworks = async (page) => {
  const response = await axios.get(`${API_URL}?page=${page}`)

  return {
    page,
    artworks: response.data,
  }
}

// Upload artworks
const uploadArtwork = async (artworkData, token) => {
  const config = {
    headers: {
      'content-type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(`${API_URL}/upload`, artworkData, config)

  return response.data
}

const artworkService = {
  getArtworks,
  uploadArtwork,
}

export default artworkService
