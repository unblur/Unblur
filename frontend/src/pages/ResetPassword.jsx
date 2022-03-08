import { useState } from 'react'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import authActions from '../state/actions/authActions'
import { setAuthErrors } from '../state/reducers/actions'
import { Link, useSearchParams } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

const ResetPassword = () => {
  const [resetDone, setResetDone] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [{ password, confirmPassword }, setPassword] = useState({
    password: '',
    confirmPassword: '',
  })
  const dispatch = useDispatch()
  const { errors, messages } = useSelector((state) => state.auth)
  const { resetPassword } = bindActionCreators(authActions, dispatch)

  const passwordsMatch = password === confirmPassword

  const onChange = (e) => {
    const { name, value } = e.target
    setPassword((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const onSubmit = (e) => {
    if (!passwordsMatch) {
      return
    }

    dispatch({
      type: setAuthErrors,
      payload: [],
    })

    const token = searchParams.get('token') || ''
    const id = searchParams.get('id') || ''
    console.log(token, id)
    resetPassword(token, id, password, () => {
      setPassword({ password: '', confirmPassword: '' })
      setResetDone(true)
    })
  }

  return (
    <>
      {resetDone ? (
        <Navigate to='/signin' />
      ) : (
        <div>
          {errors.map((e) => (
            <p>{e}</p>
          ))}
          {messages.map((e) => (
            <p>{e}</p>
          ))}
          {!passwordsMatch && <p>Passwords don't match</p>}
          <h1>Reset Password</h1>
          <p>New Password</p>
          <input
            type='password'
            value={password}
            onChange={onChange}
            name='password'
          ></input>
          <p>Confirm Password</p>
          <input
            type='password'
            value={confirmPassword}
            onChange={onChange}
            name='confirmPassword'
          ></input>
          <br />
          {passwordsMatch && <button onClick={onSubmit}>reset password</button>}
          <br />
          <Link to='/signin'>back to sign in</Link>
        </div>
      )}
    </>
  )
}

export default ResetPassword
