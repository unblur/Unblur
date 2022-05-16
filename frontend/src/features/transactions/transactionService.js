import axios from 'axios'

const API_URL = `${process.env.REACT_APP_ROOT_PATH}/api/transactions`

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
