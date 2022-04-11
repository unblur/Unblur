import { NavLink, Link, useNavigate } from 'react-router-dom'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useDispatch, useSelector } from 'react-redux'
import { signOut, reset } from '../features/auth/authSlice'
import { useState } from 'react'

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onSignOut = () => {
    dispatch(signOut())
    dispatch(reset())
    navigate('/browse')
  }

  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  }

  return (
    <>
      <header className='header'>
        <div className='logo'>
          <Link to='/browse' className='header-link'>
            UNBLUR
          </Link>
        </div>

        <div 
          className='header-link header-hamburger' 
          onClick={toggleHamburger}
        >
          <GiHamburgerMenu size={25} />
        </div>

        <ul className={hamburgerOpen ? 'header-menu header-menu-open' : 'header-menu'}>
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
              <li>
                <NavLink
                  to='/settings'
                  className={({ isActive }) =>
                    `header-link ${isActive && 'header-link-active'}`
                  }
                >
                  settings
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
