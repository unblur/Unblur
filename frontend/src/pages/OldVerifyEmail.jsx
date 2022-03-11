import React, { useEffect, useState } from 'react'
import { useLocation, Navigate } from 'react-router'
import { bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'
import authActions from '../state/actions/authActions'

function useQuery() {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}

const VerifyEmail = () => {
  const [verificationDone, setVerificationDone] = useState(false)
  const dispatch = useDispatch()
  const query = useQuery()

  useEffect(() => {
    const { verifyEmail } = bindActionCreators(authActions, dispatch)
    const token = query.get('token') || ''
    const id = query.get('id') || ''
    console.log(token, id)
    verifyEmail(token, id, () => setVerificationDone(true))
  }, [query, dispatch])

  return (
    <>
      {verificationDone ? (
        <Navigate to='/signin' />
      ) : (
        <div>
          <p>verifying email</p>
        </div>
      )}
    </>
  )
}

export default VerifyEmail
