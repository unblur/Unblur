import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signOut, reset } from '../features/auth/authSlice'

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onSignOut = () => {
    dispatch(signOut())
    dispatch(reset())
    navigate('/browse')
  }

  return (
    <>
      <header className='header'>
        <div className='logo'>
          <Link to='/browse' className='header-link'>
            UNBLUR
          </Link>
        </div>

        <ul>
          <li>
            <Link to='/browse' className='header-link'>
              browse
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link to='/profile' className='header-link'>
                  profile
                </Link>
              </li>
              <li>
                <Link to='/upload' className='header-link'>
                  upload
                </Link>
              </li>
            </>
          )}
          <li>
            {user && (
              <button
                className='header-link'
                style={{ whiteSpace: 'nowrap' }}
                onClick={onSignOut}
              >
                sign out
              </button>
            )}
            {!user && (
              <Link
                to='/signin'
                className='header-link'
                style={{ whiteSpace: 'nowrap' }}
              >
                sign in
              </Link>
            )}
          </li>
        </ul>
      </header>
    </>
  )
}

export default Header
