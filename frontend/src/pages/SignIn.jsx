import React, { useState } from 'react'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import authActions from '../state/actions/authActions'
import { setAuthErrors } from '../state/reducers/actions'
import { Link } from 'react-router-dom'

const SignInPage = (state) => {
  const [{ email, password }, setEmailPassword] = useState({
    email: '',
    password: '',
  })
  const dispatch = useDispatch()
  const { errors, messages } = useSelector((state) => state.auth)
  const { signIn } = bindActionCreators(authActions, dispatch)

  const onChangeForm = (event) => {
    const { value, name } = event.target
    setEmailPassword({ email, password, [name]: value })
  }

  const onSignUpButtonPress = () => {
    dispatch({
      type: setAuthErrors,
      payload: [],
    })
    signIn(email, password)
  }

  return (
    <div>
      {errors.map((e) => (
        <p>{e}</p>
      ))}
      {messages.map((e) => (
        <p>{e}</p>
      ))}
      <h1>Sign In</h1>
      <p>Email</p>
      <input
        type='email'
        value={email}
        onChange={onChangeForm}
        name='email'
      ></input>
      <p>Password</p>
      <input
        type='password'
        value={password}
        onChange={onChangeForm}
        name='password'
      ></input>
      <br />
      <button onClick={onSignUpButtonPress}>sign in</button>
      <br />
      <Link to='/signup'>dont have an account?</Link>
    </div>
  )
}

export default SignInPage
