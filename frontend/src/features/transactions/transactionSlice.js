import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import transactionService from './transactionService'

const initialState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  statusCode: 0,
}

// Add transaction
export const addTransaction = createAsyncThunk(
  'transaction/addtransaction',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await transactionService.addTransaction(token, data)
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
  }
)

// Helper to get error message
const getErrorMessage = (error) => {
  return (
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    error.toString()
  )
}

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
      state.statusCode = 0
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign up
      .addCase(addTransaction.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = action.payload.message
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = transactionSlice.actions
export default transactionSlice.reducer
