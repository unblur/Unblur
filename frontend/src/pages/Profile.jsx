import { FaPen } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Profile = () => {
  return (
    <>
      <section className='heading left-align'>
        {/* TODO: replace with profileName */}
        <h1>
          Zhen's Profile
          <Link to='/settings' className='reset-text-styles'>
            {' '}
            <FaPen size={30} className='edit-icon' />
          </Link>
        </h1>
        {/* TODO: replace with username */}
        <div className='profile-username light-text'>@zharnite</div>
      </section>

      {/* TODO: everything else */}
    </>
  )
}

export default Profile
