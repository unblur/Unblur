const Card = (props) => {
  const { artwork } = props
  return (
    <div className='card-container'>
      {/*This inline css is temporary*/}
      <img
        src={`http://localhost:8000/files/${artwork.blurredImage}`}
        style={{
          border: '1px solid black',
          padding: 5,
          maxWidth: 300,
          maxHeight: 300,
        }}
      />
    </div>
  )
}

export default Card
