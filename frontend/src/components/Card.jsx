const Card = (props) => {
  const { artwork } = props
  const { creatorID, title, description, transactionIDs } = artwork

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
    // TODO: clickable card container that brings you to the art page
    <div className='card-container'>
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
  )
}

export default Card
