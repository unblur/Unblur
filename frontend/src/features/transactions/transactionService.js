import axios from 'axios'

// TODO: update API_URL
const API_URL = `http://unblur-final.azurewebsites.net/api/transactions`

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
