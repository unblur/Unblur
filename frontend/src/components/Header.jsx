import { Link } from 'react-router-dom'
import { FaCircle } from 'react-icons/fa'

const Header = () => {
  const onClick = () => {
    // TODO: Login/Register Modal
  }

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
        <li>
          <Link to='/profile' className='btn'>
            profile
          </Link>
        </li>
        <li>
          <button className='btn' onClick={onClick}>
            sign in
          </button>
        </li>
      </ul>
    </header>
  )
}

export default Header
