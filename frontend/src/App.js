import { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import authActions from './state/actions/authActions'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import SignIn from './pages/SignIn'
import Browse from './pages/Browse'
import Profile from './pages/Profile'
import SignUpPage from './pages/SignUp'
import VerifyEmailRequest from './pages/VerifyEmailRequest'
import VerifyEmail from './pages/VerifyEmail'
import ResetPasswordRequest from './pages/ResetPasswordRequest'
import ResetPassword from './pages/ResetPassword'
import { UploadImage } from './pages/UploadImage'

function App() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    const { signInWithJWT } = bindActionCreators(authActions, dispatch)
    const token = localStorage.getItem('jwtToken')
    if (token) {
      signInWithJWT(token)
    }
  }, [dispatch])

  return (
    <>
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            {!user && (
              <>
                <Route path='/signin' element={<SignIn />} />
                <Route path='/signup' element={<SignUpPage />} />
                <Route
                  path='/verifyemailrequest'
                  element={<VerifyEmailRequest />}
                />
                <Route path='/verifyemail' element={<VerifyEmail />} />
                <Route
                  path='/resetpasswordrequest'
                  element={<ResetPasswordRequest />}
                />
                <Route path='/resetpassword' element={<ResetPassword />} />
              </>
            )}
            {user && (
              <>
                <Route path='/profile' element={<Profile />} />
                <Route path='/upload' element={<UploadImage />} />
              </>
            )}
            <Route path='/browse' element={<Browse />} />
            <Route path='*' element={<Navigate to='/browse' />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
