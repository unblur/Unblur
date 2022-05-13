import axios from 'axios'
const port = process.env.PORT || 8080
const hostName = process.env.WEBSITE_HOSTNAME || "unblur-final.azurewebsites.net"
// TODO: update API_URL
const API_URL = `http://${hostName}:${port}`
// Add Transaction
const addTransaction = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(`${API_URL}/add`, data, config)

  return response.data
}

const transactionService = {
  addTransaction,
}

export default transactionService
