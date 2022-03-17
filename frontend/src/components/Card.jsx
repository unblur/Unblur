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
    <div className='card-container'>
      <div className='card-image-container'>
        {/*This inline css is temporary*/}
        {/* <img
          src={`http://localhost:8000/files/${artwork.blurredImage}`}
          className='image'
        /> */}
        <div
          className='card-image'
          style={{
            background: `url(http://localhost:8000/files/${artwork.blurredImage}) no-repeat center center/cover`,
          }}
        ></div>
      </div>

      <div className='card-progress-description-container'>
        <div className='card-progress-bar'>
          <div style={{ width: getPercentageUnblurred() }}></div>
        </div>

        <div className='card-title'>
          {/* TODO: replace with actual title */}
          {/* Starry Night */}
          {title}
        </div>

        <div className='card-creator'>
          {/* TODO: replace with actual creator */}
          {getUsername()}
        </div>

        {/* TODO: fix spacing at the bottom */}
        <div className='card-description'>
          <span>{description}</span>
        </div>
      </div>
    </div>
  )
}

export default Card
