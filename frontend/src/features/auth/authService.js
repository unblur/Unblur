import axios from 'axios'

// TODO: update API_URL
const API_URL = `http://localhost:8000/api/users`

// Sign up
const signUp = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData)

  console.log(response.data)

  return response.data
}

// Sign in
const signIn = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

const authService = {
  signUp,
  signIn,
}

export default authService
