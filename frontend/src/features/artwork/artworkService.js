import axios from 'axios'

const API_URL = `https://unblur.cse356.compas.cs.stonybrook.edu/api/artworks`

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
