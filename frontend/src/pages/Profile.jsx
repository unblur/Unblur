import { useEffect, useState } from 'react'
import { FaPen } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { getSelf, signOut, reset } from '../features/auth/authSlice'
import { toast } from 'react-toastify'
import axios from 'axios'
import CardsContainer from '../components/CardsContainer'

const Profile = () => {
  // TODO: optimize - move to redux state
  const [createdArtworks, setCreatedArtworks] = useState([])
  const [supportedArtworks, setSupportedArtworks] = useState([])
  const [transactions, setTransactions] = useState([])

  // TODO: update API_URL
  const API_URL = `http://unblur-final.azurewebsites.net/api`

  const dispatch = useDispatch()
  const { self, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  const getArtworksCreated = async () => {
    const endpoints = self.artworkIDs.map(
      (artworkID) => `${API_URL}/artworks/${artworkID}`
    )

    const artworks = await axios
      .all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then((artworks) => {
        return artworks.map((artwork) => {
          artwork.data.isCreator = true
          return artwork.data
        })
      })

    return artworks
  }

  const getTransactions = async () => {
    const endpoints = self.transactionIDs.map(
      (transactionID) => `${API_URL}/transactions/${transactionID}`
    )

    const transactions = await axios
      .all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then((transactions) => {
        return transactions.map((transaction) => transaction.data)
      })

    return transactions
  }

  const getArtworksSupported = async (transactions) => {
    const artworkIDs = [
      ...new Set(
        transactions.map((transaction) => {
          return transaction.artworkID
        })
      ),
    ]

    const endpoints = artworkIDs.map(
      (artworkID) => `${API_URL}/artworks/${artworkID}`
    )

    const artworks = await axios
      .all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then((artworks) => {
        return artworks.map((artwork) => {
          artwork.data.isSupporter = true
          return artwork.data
        })
      })

    return artworks
  }

  const loadProfileState = () => {
    getTransactions().then((transactions) => {
      setTransactions(transactions)

      // Get supported artworks from transactions
      getArtworksSupported(transactions).then((artworks) => {
        setSupportedArtworks(artworks)
      })
    })

    getArtworksCreated().then((artworks) => {
      setCreatedArtworks(artworks)
    })
  }

  useEffect(() => {
    if (!self) {
      dispatch(getSelf())
    }

    if (self) {
      loadProfileState()
    }
  }, [dispatch])

  useEffect(() => {
    if (isError) {
      toast.error(message)
      dispatch(signOut())
    }

    if (isSuccess) {
      loadProfileState()
    }

    if (isError || isSuccess) {
      dispatch(reset())
    }
  }, [isError, isSuccess, message, dispatch])

  // TODO: update loading screen
  if (isLoading || !self) {
    return (
      <>
        <div>loading...</div>
      </>
    )
  }

  return (
    <>
      <section className='heading left-align'>
        <h1>
          {`${self.profileName || self.username}'s Profile`}

          <Link to='/settings' className='reset-text-styles'>
            {' '}
            <FaPen size={30} className='edit-icon' />
          </Link>
        </h1>
        <div className='profile-username'>
          <span>
            <Link to={`/user/${self._id}`} className='light-text user-link'>
              @{self.username}
            </Link>
          </span>
        </div>
      </section>

      {/* TODO: filter cards by type */}
      {createdArtworks.length > 0 && (
        <CardsContainer artworks={createdArtworks} />
      )}
      {supportedArtworks.length > 0 && (
        <CardsContainer artworks={supportedArtworks} />
      )}
      {supportedArtworks.length + createdArtworks.length == 0 && (
        <p>This user hasn't been active.</p>
      )}
    </>
  )
}

export default Profile
