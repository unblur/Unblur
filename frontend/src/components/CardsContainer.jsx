import Card from './Card'

const CardsContainer = (props) => {
  const { artworks } = props

  return (
    <div className='cards-container'>
      {artworks.map((artwork) => (
        <Card key={artwork._id} artwork={artwork} />
      ))}
    </div>
  )
}

export default CardsContainer
