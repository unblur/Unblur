import { useParams } from 'react-router-dom'

const Art = () => {
  const params = useParams()

  return (
    <div>
      <h1>this is the art page</h1>

      {/* TODO: validate the id is an actual artwork in the database, otherwise redirect to browse. */}
      <h2>artworkID: {params.id}</h2>
    </div>
  )
}

export default Art
