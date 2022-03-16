const Card = (props) => {
  const { artwork } = props
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
          {/* TODO: update width */}
          <div style={{ width: '50%' }}></div>
        </div>

        <div className='card-title'>
          {/* TODO: replace with actual title */}
          Starry Night
        </div>

        <div className='card-creator'>
          {/* TODO: replace with actual creator */}
          zharnite
        </div>

        {/* TODO: fix spacing at the bottom */}
        <div className='card-description'>
          <span>
            Starry, starry night. Paint your palette blue and gray. Look out on
            a summer's day. With eyes that know the darkness in my soul.
          </span>
        </div>
      </div>
    </div>
  )
}

export default Card
