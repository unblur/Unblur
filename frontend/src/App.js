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
import Header from './components/Header'
import SignIn from './pages/SignIn'
import Browse from './pages/Browse'
import Profile from './pages/Profile'
import SignUpPage from './pages/SignUp'
import VerifyEmail from './pages/VerifyEmail'

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
                <Route path='/verifyemail' element={<VerifyEmail />} />
              </>
            )}
            {user && (
              <>
                <Route path='/profile' element={<Profile />} />
              </>
            )}
            <Route path='/browse' element={<Browse />} />
            <Route path='*' element={<Navigate to='/browse' />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
