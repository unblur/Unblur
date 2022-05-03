import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setArtwork } from '../features/artwork/artworkSlice'

// TODO: update API_URL
const API_URL = `http://localhost:8000/api`

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
  const index = artwork.blurredImage.indexOf('-')
  const unblurredImageLink = `http://localhost:8000/files/${artwork.blurredImage.substring(
    0,
    index
  )}${artwork.blurredImage.substring(index + 8)}`

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
              backgroundImage: `url(${
                percentageUnblurred() >= 100
                  ? unblurredImageLink
                  : blurredImageLink
              })`,
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
              <Link
                to={creator !== null ? `/user/${creator._id}` : `/browse`}
                className='light-text user-link'
              >
                {getUsername()}
              </Link>
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
