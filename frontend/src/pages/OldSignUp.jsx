import { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import authActions from '../state/actions/authActions'
import { setAuthErrors } from '../state/reducers/actions'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const SignUpPage = (state) => {
  const [{ email, password, confirmPassword }, setEmailPassword] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const dispatch = useDispatch()
  const { errors, messages } = useSelector((state) => state.auth)
  const { signUp } = bindActionCreators(authActions, dispatch)

  const passwordsMatch = password === confirmPassword

  // useEffect(() => {
  //   if (errors) {
  //     toast.error(errors)
  //   }

  //   if (messages) {
  //     toast.warning(messages)
  //   }
  // }, [errors, messages])

  const onChangeForm = (event) => {
    const { value, name } = event.target
    setEmailPassword({ email, password, confirmPassword, [name]: value })
  }

  const onSignUp = () => {
    if (!passwordsMatch) {
      toast.error('Passwords do not match.')
      return
    }

    dispatch({
      type: setAuthErrors,
      payload: [],
    })
    signUp(email, password, () => {
      setEmailPassword({ email: '', password: '', confirmPassword: '' })
    })
  }

  return (
    <div>
      {errors.map((e) => (
        <p>{e}</p>
      ))}
      {messages.map((e) => (
        <p>{e}</p>
      ))}
      {/* {!passwordsMatch && <p>Passwords don't match</p>} */}
      <h1>Sign Up</h1>
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
      <p>Confirm Password</p>
      <input
        type='password'
        value={confirmPassword}
        onChange={onChangeForm}
        name='confirmPassword'
      ></input>
      <br />
      {
        // passwordsMatch &&
        <button onClick={onSignUp}>sign up</button>
      }
      <br />
      <Link to='/signin'>already have an account?</Link>
    </div>
  )
}

export default SignUpPage
