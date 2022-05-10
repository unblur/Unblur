import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import artworkService from './artworkService'

const initialState = {
  artworks: [],
  artwork: null,
  artworkLoading: true,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get all artworks
export const getArtworks = createAsyncThunk(
  'artwork/getall',
  async (page, thunkAPI) => {
    try {
      return await artworkService.getArtworks(page)
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
  }
)

// Get artwork by ID
export const getArtworkById = createAsyncThunk(
  'artwork/getbyid',
  async (id, thunkAPI) => {
    try {
      return await artworkService.getArtworkById(id)
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
    setArtwork: (state, action) => {
      state.artwork = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all artworks
      .addCase(getArtworks.pending, (state, action) => {
        state.isLoading = action.meta.arg === 1
      })
      .addCase(getArtworks.fulfilled, (state, action) => {
        const { artworks, page } = action.payload
        state.isLoading = false
        state.isSuccess = true
        if (page > 1) {
          state.artworks = [...state.artworks, ...artworks]
        } else {
          state.artworks = artworks
        }
      })
      .addCase(getArtworks.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get artwork by id
      .addCase(getArtworkById.pending, (state, action) => {
        state.artworkLoading = true
      })
      .addCase(getArtworkById.fulfilled, (state, action) => {
        state.artworkLoading = false
        state.artwork = action.payload.artwork
      })
      .addCase(getArtworkById.rejected, (state, action) => {
        state.artworkLoading = false
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

export const { reset, setArtwork } = artworkSlice.actions
export default artworkSlice.reducer
