import { useState, useEffect } from 'react'
import axios from 'axios'

const Browse = () => {
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/artworks')
      .then((res) => {
        setArtworks(res.data)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
      })
  }, [])

  return (
    <div>
      {loading && <p>loading...</p>}
      {!loading &&
        artworks.map((artwork) => (
          <div>
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
        ))}
      {!loading && !!!artworks.length && <p>no artworks to show</p>}
    </div>
  )
}

export default Browse
