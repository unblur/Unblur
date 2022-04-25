import { useEffect, useState } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

// TODO: update API_URL
const API_URL = `http://localhost:8000/api`

const Art = () => {
  const { state } = useLocation()
  const [creator, setCreator] = useState({})
  const [algos, setAlgos] = useState(0)
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${API_URL}/users/${state.creatorID}`)
      setCreator(response.data)
    }

    if (state.creatorID) {
      fetchData()
    }
  }, [])

  if (!state) {
    return <Navigate to='/browse' />
  }

  const {
    _id,
    creatorID,
    algosToUnblur,
    title,
    description,
    transactionIDs,
    blurredImage,
  } = state

  const isUnblurred = false

  // FIXME: temporary function to show percentage, will be changed after parseTransactions is implemented
  // TODO: computes the percentage based on algos raised, which is computed in parseTransactions
  // TODO: rename to computePercentageUnblurred to avoid confusion with getPercentageUnblurred in Card.jsx
  const getPercentageUnblurred = (algos) => {
    const percent = 10

    return `${percent}%`
  }

  // TODO: implement based on transactionIDs
  const parseTransactions = () => {
    // TODO: compute number of contributors (use a set?)
    // TODO: compute number of algos raised (sum)
    // TODO: compute unblur percentage based on number of algos raised (computePercentageUnblurred function above)
    // TODO: compute if the image should be unblurred. Show unblurred image if (amount accumulated from transactions) >= algosToUnblur. Set isUnblurred = true
  }

  const blurredImageLink = `http://localhost:8000/files/${blurredImage}`
  const index = blurredImage.indexOf('-')
  const unblurredImageLink = `http://localhost:8000/files/${blurredImage.substring(
    0,
    index
  )}${blurredImage.substring(index + 8)}`

  const onChange = (e) => {
    setAlgos(e.target.value)
  }

  const onContribute = (e) => {
    // TODO: User has a wallet connected, otherwise alert redirect

    // Non negative and non zero check
    if (algos <= 0) {
      toast.error('Please enter a valid number of algos.')
      return
    }

    // TODO: Check user has that amount in their wallet

    // Confirmation
    // TODO: make a better confirmation
    const result = window.confirm(
      `Are you sure you want to donate ${algos} algos?`
    )
    if (result) {
      // TODO: Make transaction and toast promise status
      return
    }
  }

  return (
    <>
      <div className='artwork-container'>
        {/* TODO: update image url */}
        <div className='artwork-image-container'>
          <img
            src={isUnblurred ? unblurredImageLink : blurredImageLink}
            className='artwork'
          />
        </div>

        <div className='artwork-info-container'>
          <h1>{title}</h1>

          {/* TODO: translate creatorID to creator's profile name or username if they don't have one */}
          <div className='artwork-creator light-text'>
            {creator.username ?? ''}
          </div>

          <div className='artwork-progress'>
            <div className='card-progress-bar'>
              <div style={{ width: getPercentageUnblurred() }}></div>
            </div>
            <div className='percentage-complete'>
              {getPercentageUnblurred()} complete
            </div>
          </div>

          <div className='artwork-description'>{description}</div>

          {/* TODO: update contributors and algos raised */}
          <div className='artwork-summary-box'>
            <div className='summary-numbers'>
              <div className='summary-number'>
                <div className='artwork-stat'>-1</div>
                <div className='artwork-stat-label'>contributors</div>
              </div>
              <div className='summary-number'>
                <div className='artwork-stat'>9767237238</div>
                <div className='artwork-stat-label'>algos raised</div>
              </div>
              <div className='summary-number'>
                <div className='artwork-stat'>{algosToUnblur}</div>
                <div className='artwork-stat-label'>algos needed</div>
              </div>
            </div>

            {/* TODO: button to contribute, new modal pops up */}
            <div className='form-group summary-button'>
              <input
                type='number'
                className='form-control'
                name='algos'
                placeholder='algos'
                value={algos}
                onChange={onChange}
              />
              <button className='btn btn-primary' onClick={onContribute}>
                contribute
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Art
