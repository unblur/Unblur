import { NavLink, Link, useNavigate } from 'react-router-dom'
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
            <NavLink
              to='/browse'
              className={({ isActive }) =>
                `header-link ${isActive && 'header-link-active'}`
              }
            >
              browse
            </NavLink>
          </li>
          {user && (
            <>
              <li>
                <NavLink
                  to='/profile'
                  className={({ isActive }) =>
                    `header-link ${isActive && 'header-link-active'}`
                  }
                >
                  profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/upload'
                  className={({ isActive }) =>
                    `header-link ${isActive && 'header-link-active'}`
                  }
                >
                  upload
                </NavLink>
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
              <NavLink
                to='/signin'
                className={({ isActive }) =>
                  `header-link ${isActive && 'header-link-active'}`
                }
                style={{ whiteSpace: 'nowrap' }}
              >
                sign in
              </NavLink>
            )}
          </li>
        </ul>
      </header>
    </>
  )
}

export default Header
