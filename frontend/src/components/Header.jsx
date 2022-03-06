import { Link } from 'react-router-dom'
import { FaCircle } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import authActions from '../state/actions/authActions'

const Header = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const { signOut } = bindActionCreators(authActions, dispatch)

  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/' className='btn'>
          <FaCircle /> <span>&nbsp; unblur</span>
        </Link>
      </div>
      <ul>
        <li>
          <Link to='/' className='btn'>
            browse
          </Link>
        </li>
        {user && (
          <li>
            <Link to='/profile' className='btn'>
              profile
            </Link>
          </li>
        )}
        <li>
          {user && (
            <button className='btn' onClick={() => signOut()}>
              sign out
            </button>
          )}
          {!user && (
            <Link to='/signin' className='btn'>
              sign in
            </Link>
          )}
        </li>
      </ul>
    </header>
  )
}

export default Header
