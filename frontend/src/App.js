import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Browse from './pages/Browse'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import VerifyEmailRequest from './pages/VerifyEmailRequest'
import VerifyEmail from './pages/VerifyEmail'
import ResetPasswordRequest from './pages/ResetPasswordRequest'
import ResetPassword from './pages/ResetPassword'
import UploadImage from './pages/UploadImage'
import Art from './pages/Art'

function App() {
  const { user } = useSelector((state) => state.auth)

  return (
    <>
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            {!user && (
              <>
                <Route path='/signin' element={<SignIn />} />
                <Route path='/signup' element={<SignUp />} />
                <Route
                  path='/verifyemailrequest'
                  element={<VerifyEmailRequest />}
                />
                <Route path='/verifyemail' element={<VerifyEmail />} />
              </>
            )}
            {user && (
              <>
                <Route path='/profile' element={<Profile />} />
                <Route path='/upload' element={<UploadImage />} />
                <Route path='/settings' element={<Settings />} />
              </>
            )}
            <Route path='/browse' element={<Browse />} />
            <Route path='/art/:id' element={<Art />} />
            <Route
              path='/resetpasswordrequest'
              element={<ResetPasswordRequest />}
            />
            <Route path='/resetpassword' element={<ResetPassword />} />
            <Route path='*' element={<Navigate to='/browse' />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
