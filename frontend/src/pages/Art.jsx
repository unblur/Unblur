import { useEffect } from 'react'

import { useLocation, Navigate } from 'react-router-dom'

const Art = () => {
  const { state } = useLocation()

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
  }

  // TODO: show unblurred image if (amount accumulated from transactions) >= algosToUnblur

  return (
    <>
      <div className='artwork-container'>
        {/* TODO: update image url */}
        <div className='artwork-image-container'>
          <img
            src={`http://localhost:8000/files/${blurredImage}`}
            className='artwork'
          />
        </div>

        <div className='artwork-info-container'>
          <h1>{title}</h1>

          {/* TODO: translate creatorID to creator's profile name or username if they don't have one */}
          <div className='artwork-creator light-text'>zharnite</div>

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
            <div>contributors: -1</div>
            <div>algos raised: -1</div>
            <div>algos needed: {algosToUnblur}</div>

            {/* TODO: button to contribute, new modal pops up */}
            <div>Button: contribute to the project</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Art
