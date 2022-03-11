import { useState } from 'react'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import authActions from '../state/actions/authActions'
import { Link } from 'react-router-dom'
import { setAuthErrors } from '../state/reducers/actions'
import { Navigate } from 'react-router-dom'

const VerifyEmailRequest = () => {
  const [sentEmailDone, setSentEmailDone] = useState(false)
  const [email, setEmail] = useState('')
  const dispatch = useDispatch()
  const { errors, messages } = useSelector((state) => state.auth)
  const { verifyEmailRequest } = bindActionCreators(authActions, dispatch)

  const onChange = (e) => {
    setEmail(e.target.value)
  }

  const onSubmit = () => {
    dispatch({
      type: setAuthErrors,
      payload: [],
    })
    verifyEmailRequest(email, () => setSentEmailDone(true))
  }

  return (
    <>
      {sentEmailDone ? (
        <Navigate to='/signin' />
      ) : (
        <div>
          {errors.map((e) => (
            <p>{e}</p>
          ))}
          {messages.map((e) => (
            <p>{e}</p>
          ))}
          <h1>Resend Email Verification</h1>
          <p>Enter your email: </p>
          <input type='email' name='email' value={email} onChange={onChange} />
          <br />
          <button onClick={onSubmit}>submit</button>
          <br />
          <Link to='/signin'>back to sign in</Link>
        </div>
      )}
    </>
  )
}

export default VerifyEmailRequest
