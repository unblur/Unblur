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
  const [transactionList, setTransactionList] = useState({})

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
      const filteredTransactions = transactionRet.filter(transaction =>transaction.artworkID == artwork._id)
  
      setTransactionList(filteredTransactions)
    }
    fetchData()
    getArtworkTransactions()
  }, [])

  


  let isUnblurred = false

  // TODO: implement based on transactionIDs
  const getPercentageUnblurred = () => {
    // TODO: set isUnblurred = true if (amount accumulated from transactions) >= algosToUnblur
    const algos = artwork.algosToUnblur
    let total = 0
    for(let transaction in transactionList){
      total += transactionList[transaction].algos
    }

    const percent = (total/algos) * 100

    if(percent >= 100){
      isUnblurred = true
      percent = 100
    }
    return `${percent}%`
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
