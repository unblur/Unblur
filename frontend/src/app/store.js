import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import artworkReducer from '../features/artwork/artworkSlice'
import walletConnectReducer from '../features/walletconnect/walletConnectSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    artwork: artworkReducer,
    walletConnect: walletConnectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
