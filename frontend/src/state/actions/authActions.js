import axios from 'axios'
import {
  setAuthErrors,
  setAuthUser,
  setAuthMessages,
} from '../reducers/actions'

const signIn = (email, password) => async (dispatch) => {
  try {
    const res = await axios.post(`http://localhost:8000/api/users/login`, {
      email,
      password,
    })
    dispatch({ type: setAuthUser, payload: res.data })
    dispatch({ type: setAuthErrors, payload: [] })
    dispatch({ type: setAuthMessages, payload: [] })
    localStorage.setItem('jwtToken', res.data.token)
  } catch (e) {
    dispatch({ type: setAuthErrors, payload: [e.response.data.message] })
  }
}

const signInWithJWT = (token) => async (dispatch) => {
  try {
    const config = {
      method: 'get',
      url: 'http://localhost:8000/api/users/self',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const res = await axios(config)
    dispatch({ type: setAuthUser, payload: res.data })
    localStorage.setItem('jwtToken', token)
  } catch (e) {
    localStorage.removeItem('jwtToken')
  }
}

const signUp = (email, password, onSuccess) => async (dispatch) => {
  try {
    const res = await axios.post(`http://localhost:8000/api/users/register`, {
      email,
      password,
    })
    dispatch({ type: setAuthMessages, payload: [res.data.message] })
    onSuccess()
  } catch (e) {
    dispatch({ type: setAuthErrors, payload: [e.response.data.message] })
  }
}

const verifyEmail = (token, id, onComplete) => async (dispatch) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/users/verifyemail?token=${token}&id=${id}`
    )
    dispatch({ type: setAuthMessages, payload: [res.data.message] })
  } catch (e) {
    console.log(e.response.data)
    dispatch({ type: setAuthErrors, payload: ['Invalid token'] })
  }
  onComplete()
}

const signOut = () => (dispatch) => {
  dispatch({
    type: setAuthUser,
    payload: null,
  })
  localStorage.removeItem('jwtToken')
}

const resetPasswordRequest = (email, onSuccess) => async (dispatch) => {
  try {
    const res = await axios.post(
      `http://localhost:8000/api/users/resetpasswordrequest`,
      {
        email,
      }
    )
    dispatch({ type: setAuthMessages, payload: [res.data.message] })
    onSuccess()
  } catch (e) {
    dispatch({ type: setAuthErrors, payload: [e.response.data.message] })
  }
}

const resetPassword = (token, id, password, onSuccess) => async (dispatch) => {
  try {
    const res = await axios.post(
      `http://localhost:8000/api/users/resetpassword?token=${token}&id=${id}`,
      {
        password,
      }
    )
    dispatch({ type: setAuthMessages, payload: [res.data.message] })
    onSuccess()
  } catch (e) {
    dispatch({ type: setAuthErrors, payload: [e.response.data.message] })
  }
}

const actions = {
  signIn,
  signUp,
  verifyEmail,
  signOut,
  signInWithJWT,
  resetPasswordRequest,
  resetPassword,
}

export default actions
