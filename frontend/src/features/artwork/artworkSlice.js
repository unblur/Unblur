import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import artworkService from './artworkService'

const initialState = {
  artworks: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get all artworks
export const getArtworks = createAsyncThunk(
  'artwork/getall',
  async (_, thunkAPI) => {
    try {
      return await artworkService.getArtworks()
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
  }
)

export const uploadArtwork = createAsyncThunk(
  'artwork/uploadartwork',
  async (artworkData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await artworkService.uploadArtwork(artworkData, token)
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

export const artworkSlice = createSlice({
  name: 'artwork',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all artworks
      .addCase(getArtworks.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getArtworks.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.artworks = action.payload
      })
      .addCase(getArtworks.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // Upload artwork
      .addCase(uploadArtwork.pending, (state) => {
        state.isLoading = true
      })
      .addCase(uploadArtwork.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = action.payload.message
      })
      .addCase(uploadArtwork.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = artworkSlice.actions
export default artworkSlice.reducer
