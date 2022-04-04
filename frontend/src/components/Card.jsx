import { Link } from 'react-router-dom'

const Card = (props) => {
  const { artwork } = props
  const { creatorID, title, description, transactionIDs } = artwork
  const artPage = `/art/${artwork._id}`

  const isCreator = false || artwork.isCreator
  const isSupporter = false || artwork.isSupporter

  // TODO: implement based on transactionIDs
  const getPercentageUnblurred = () => {
    const percent = 10

    return `${percent}%`
  }

  // TODO: get username from creatorID
  const getUsername = () => {
    return 'zharnite'
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
