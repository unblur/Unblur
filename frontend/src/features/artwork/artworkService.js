import axios from 'axios'

// TODO: update API_URL
const port = process.env.PORT || 8080
const hostName = process.env.WEBSITE_HOSTNAME || "unblur-final.azurewebsites.net"
const API_URL = `http://${hostName}:${port}/api/artworks`

// Get all artworks
const getArtworks = async (page) => {
  const response = await axios.get(`${API_URL}?page=${page}`)

  return {
    page,
    artworks: response.data,
  }
}

// Get artwork by id
const getArtworkById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`)

  return {
    artwork: response.data,
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
  getArtworkById,
}

export default artworkService
