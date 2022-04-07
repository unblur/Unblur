import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

// TODO: update API_URL
const API_URL = `http://localhost:8000/api`

const Card = (props) => {
  const { artwork } = props
  const { creatorID, title, description, transactionIDs } = artwork
  const artPage = `/art/${artwork._id}`

  const isCreator = false || artwork.isCreator
  const isSupporter = false || artwork.isSupporter

  const [creator, setCreator] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${API_URL}/users/${creatorID}`)
      setCreator(response.data)
    }
    fetchData()
  }, [])

  // TODO: implement based on transactionIDs
  const getPercentageUnblurred = () => {
    const percent = 10

    return `${percent}%`
  }

  const getUsername = () => {
    return creator.username ?? ''
  }

  return (
    <Link to={artPage} state={artwork} className='reset-text-styles'>
      <div className='card-container'>
        {/* Card tags */}
        {isSupporter && (
          <div className='card-tag card-tag-supporter'>supporter</div>
        )}
        {isCreator && <div className='card-tag card-tag-creator'>creator</div>}

        <div className='card-image-container'>
          <div
            className='card-image'
            style={{
              backgroundImage: `url(http://localhost:8000/files/${artwork.blurredImage})`,
            }}
          ></div>
        </div>

        <div className='card-progress-description-container'>
          <div className='card-progress-bar'>
            <div style={{ width: getPercentageUnblurred() }}></div>
          </div>

          <div className='card-title truncate'>{title}</div>

          <div className='card-creator truncate'>{getUsername()}</div>

          <div className='card-description'>
            <span>{description}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Card
