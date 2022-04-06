import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

// TODO: update place user is stored
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: user ? user : null,
  self: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  statusCode: 0,
}

// Sign up
export const signUp = createAsyncThunk(
  'auth/signup',
  async (user, thunkAPI) => {
    try {
      return await authService.signUp(user)
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
  }
)

// Sign in
export const signIn = createAsyncThunk(
  'auth/signin',
  async (user, thunkAPI) => {
    try {
      return await authService.signIn(user)
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
  }
)

// Sign out
export const signOut = createAsyncThunk('auth/signout', async () => {
  await authService.signOut()
})

// Verify email request
export const verifyEmailRequest = createAsyncThunk(
  'auth/verifyemailrequest',
  async (email, thunkAPI) => {
    try {
      return await authService.verifyEmailRequest(email)
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
  }
)

// Verify email
export const verifyEmail = createAsyncThunk(
  'auth/verifyemail',
  async (data, thunkAPI) => {
    try {
      return await authService.verifyEmail(data)
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
  }
)

// Reset password request
export const resetPasswordRequest = createAsyncThunk(
  'auth/resetpasswordrequest',
  async (email, thunkAPI) => {
    try {
      return await authService.resetPasswordRequest(email)
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
  }
)

// Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetpassword',
  async (data, thunkAPI) => {
    try {
      return await authService.resetPassword(data)
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
  }
)

// Get self
export const getSelf = createAsyncThunk('auth/getself', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await authService.getSelf(token)
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error))
  }
})

// Update self
export const updateSelf = createAsyncThunk(
  'auth/updateself',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await authService.updateSelf(token, data)
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

export const authSlice = createSlice({
  name: 'auth',
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
      .addCase(signUp.pending, (state) => {
        state.isLoading = true
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = action.payload.message
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })

      // Sign in
      .addCase(signIn.pending, (state) => {
        state.isLoading = true
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })

      // Sign out
      .addCase(signOut.fulfilled, (state) => {
        state.user = null
        state.self = null
      })

      // Verify email request
      .addCase(verifyEmailRequest.pending, (state) => {
        state.isLoading = true
      })
      .addCase(verifyEmailRequest.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = action.payload.message
      })
      .addCase(verifyEmailRequest.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // Verify email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = action.payload.message
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // Reset password request
      .addCase(resetPasswordRequest.pending, (state) => {
        state.isLoading = true
      })
      .addCase(resetPasswordRequest.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = action.payload.message
      })
      .addCase(resetPasswordRequest.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = action.payload.message
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // Get self
      .addCase(getSelf.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getSelf.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.self = action.payload
      })
      .addCase(getSelf.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        // state.message = action.payload
      })

      // Update self
      .addCase(updateSelf.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateSelf.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.self = action.payload
        state.message = action.payload.message
      })
      .addCase(updateSelf.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.statusCode = action.payload.statusCode
      })
  },
})

export const { reset } = authSlice.actions
export default authSlice.reducer
