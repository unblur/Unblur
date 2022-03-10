import axios from 'axios'

// TODO: update API_URL
const API_URL = `http://localhost:8000/api/users`

// Sign up
const signUp = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

const authService = {
  signUp,
}

export default authService
