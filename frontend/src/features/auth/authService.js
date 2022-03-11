import axios from 'axios'

// TODO: update API_URL
const API_URL = `http://localhost:8000/api/users`

// Sign up
const signUp = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData)

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

const signOut = () => {
  localStorage.removeItem('user')
}

// Send verify email request
const verifyEmailRequest = async (email) => {
  const response = await axios.post(`${API_URL}/verifyemailrequest`, { email })

  return response.data
}

// Verify email
const verifyEmail = async (data) => {
  const response = await axios.post(`${API_URL}/verifyemail`, data)

  return response.data
}

// Send reset password request
const resetPasswordRequest = async (email) => {
  const response = await axios.post(`${API_URL}/resetpasswordrequest`, {
    email,
  })

  return response.data
}

// Reset password
const resetPassword = async (data) => {
  const response = await axios.post(`${API_URL}/resetpassword`, data)

  return response.data
}

const authService = {
  signUp,
  signIn,
  signOut,
  verifyEmailRequest,
  verifyEmail,
  resetPasswordRequest,
  resetPassword,
}

export default authService
