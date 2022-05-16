import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import WalletConnect from '@walletconnect/client'
import QRCodeModal from 'algorand-walletconnect-qrcode-modal'

const initialState = {
  accounts: [],
  address: '',
  assets: [],
  connected: false,
  connector: null,
  chain: 'testnet',
  fetching: false,
}

export const walletConnectSlice = createSlice({
  name: 'walletConnect',
  initialState,
  reducers: {
    setFetching(state, action) {
      state.fetching = action.payload
    },
    switchChain(state, action) {
      state.chain = action.payload
    },
    resetConnection: (state) => {
      state.accounts = []
      state.address = ''
      state.assets = []
      state.connected = false
      state.connector = null
    },
    walletConnectInit: (state) => {
      // Create a connector
      state.connector = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org',
        qrcodeModal: QRCodeModal,
      })
    },
    setConnected: (state, action) => {
      state.connected = action.payload
    },
    onConnect: (state, action) => {
      const { accounts } = action.payload.params[0]
      state.accounts = accounts
      state.address = accounts[0]
    },
    onSessionUpdate: (state, action) => {
      state.accounts = action.payload
      state.address = action.payload[0]
    },
    setAccountAssets: (state, action) => {
      state.assets = action.payload
    },
    killSession: (state) => {
      if (state.connected) {
        state.connector.killSession()
      }
    },
  },
})

// export const getAccountAssets = createAsyncThunk(
//   'walletConnect/getAccountAssets',
//   async (accountData) => {
//     const { chain, address } = accountData
//     const response = apiGetAccountAssets(chain, address)
//     return response
//   }
// )

export const selectFetching = (state) =>
  state.walletConnect && state.walletConnect.fetching
export const selectChain = (state) =>
  state.walletConnect && state.walletConnect.chain
export const selectConnected = (state) =>
  state.walletConnect && state.walletConnect.connected
export const selectConnector = (state) =>
  state.walletConnect && state.walletConnect.connector
export const selectAssets = (state) =>
  state.walletConnect && state.walletConnect.assets
export const selectAddress = (state) =>
  state.walletConnect && state.walletConnect.address

export const {
  setFetching,
  switchChain,
  resetConnection,
  walletConnectInit,
  setConnected,
  onConnect,
  onSessionUpdate,
  killSession,
} = walletConnectSlice.actions

export default walletConnectSlice.reducer
