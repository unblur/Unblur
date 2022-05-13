import axios from 'axios'

// TODO: update API_URL
const port = process.env.PORT || 8080
const hostName = process.env.WEBSITE_HOSTNAME || "unblur-final.azurewebsites.net"
const API_URL = `http://${hostName}:${port}`

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

// Get self
const getSelf = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(`${API_URL}/self`, config)

  return response.data
}

// Update self
const updateSelf = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(`${API_URL}/update`, data, config)

  return response.data
}

// Update wallet
const updateWallet = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(`${API_URL}/wallet`, data, config)

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
  getSelf,
  updateSelf,
  updateWallet,
}

export default authService
