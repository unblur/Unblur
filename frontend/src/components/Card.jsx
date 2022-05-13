import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setArtwork } from '../features/artwork/artworkSlice'
// TODO: update API_URL
const port = process.env.PORT || 8080
const hostName = process.env.WEBSITE_HOSTNAME || "unblur-final.azurewebsites.net"
const API_URL = `http://${hostName}:${port}`

const Card = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { artwork } = props
  const {
    algosToUnblur,
    title,
    description,
    transactionIDs: transactionsList,
    creatorID: creator,
  } = artwork
  const artPage = `/art/${artwork._id}`

  const isCreator = false || artwork.isCreator
  const isSupporter = false || artwork.isSupporter

  const percentageUnblurred = () => {
    const algos = algosToUnblur
    let total = 0
    transactionsList.forEach((transaction) => {
      total += transaction.algos
    })
    let percent = (total / algos) * 100

    if (percent >= 100 || algos == 0) {
      percent = 100
    }

    return percent
  }

  const getUsername = () => {
    return creator.username ?? ''
  }

  const blurredImageLink = `http://localhost:8000/files/${artwork.blurredImage}`

  const navigateToArtPage = () => {
    navigate(artPage)
    dispatch(setArtwork(artwork))
  }

  return (
    <div onClick={navigateToArtPage}>
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
              backgroundImage: `url(${blurredImageLink})`,
            }}
          ></div>
        </div>

        <div className='card-progress-description-container'>
          <div className='card-progress-bar'>
            <div style={{ width: `${percentageUnblurred()}%` }}></div>
          </div>

          <div className='card-title truncate'>{title}</div>

          <div className='card-creator truncate'>
            <span>
              <div className='light-text'>{getUsername()}</div>
            </span>
          </div>

          <div className='card-description'>
            <span>{description}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
