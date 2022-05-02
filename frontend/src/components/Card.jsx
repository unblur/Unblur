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
  const [isUnblurred, setUnblurred] = useState(false)
  const [percentageUnblurred, setPercentageUnblurred] = useState('0')

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${API_URL}/users/${creatorID}`)
      setCreator(response.data)
    }
    const getArtworkTransactions = async () => {
      const endpoints = transactionIDs.map(
        (transactionID) => `${API_URL}/transactions/${transactionID}`
      )

      const transactionRet = await axios
        .all(endpoints.map((endpoint) => axios.get(endpoint)))
        .then((transactions) => {
          return transactions.map((transaction) => transaction.data)
        })

      getPercentageUnblurred(transactionRet)
    }
    fetchData()
    getArtworkTransactions()
  }, [])

  const getPercentageUnblurred = (transactionsList) => {
    const algos = artwork.algosToUnblur
    let total = 0
    transactionsList.forEach((transaction) => {
      total += transaction.algos
    })
    let percent = (total / algos) * 100

    if (percent >= 100 || algos == 0) {
      percent = 100
      setUnblurred(true)
    }
    setPercentageUnblurred(`${percent}%`)
  }

  const getUsername = () => {
    return creator.username ?? ''
  }

  const blurredImageLink = `http://localhost:8000/files/${artwork.blurredImage}`
  const index = artwork.blurredImage.indexOf('-')
  const unblurredImageLink = `http://localhost:8000/files/${artwork.blurredImage.substring(
    0,
    index
  )}${artwork.blurredImage.substring(index + 8)}`

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
              backgroundImage: `url(${
                isUnblurred ? unblurredImageLink : blurredImageLink
              })`,
            }}
          ></div>
        </div>

        <div className='card-progress-description-container'>
          <div className='card-progress-bar'>
            <div style={{ width: percentageUnblurred }}></div>
          </div>

          <div className='card-title truncate'>{title}</div>

          <div className='card-creator truncate'>
            <span>
              <Link to={creator !== null ? `/user/${creator._id}` : `/browse`} className='light-text user-link'>
                {getUsername()}
              </Link>
            </span>
          </div>

          <div className='card-description'>
            <span>{description}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Card
