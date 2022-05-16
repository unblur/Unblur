import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import CardsContainer from '../components/CardsContainer'

const User = () => {
  // TODO: optimize - move to redux state
  const [user, setUser] = useState({ isLoading: true })
  const [getUserError, setGetUserError] = useState(false)
  const [createdArtworks, setCreatedArtworks] = useState([])
  const [supportedArtworks, setSupportedArtworks] = useState([])

  const API_URL = `${process.env.REACT_APP_ROOT_PATH}/api`

  const { id } = useParams()

  /*const getUsers = async () => {
    const users = await axios.get(`${API_URL}/users`)
    console.log(users)
  }*/

  useEffect(() => {
    const getTransactions = async (user) => {
      const endpoints = user.transactionIDs.map(
        (transactionID) => `${API_URL}/transactions/${transactionID}`
      )

      // allSettled instead of all so one error does not reject all transactions
      const transactions = await Promise.allSettled(
        endpoints.map((endpoint) => axios.get(endpoint))
      ).then((transactionPromises) => {
        return transactionPromises
          .filter(
            (transactionPromise) => transactionPromise.status === 'fulfilled'
          )
          .map((transactionPromise) => transactionPromise.value.data)
      })

      return transactions
    }

    const getSupportedArtworks = async (transactions) => {
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

    const getCreatedArtworks = async (user) => {
      const endpoints = user.artworkIDs.map(
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

    const loadUser = async () => {
      let error = false
      const user = await axios
        .get(`${API_URL}/users/${id}`)
        .then((user) => {
          setUser(user.data)
          return user
        })
        .catch(() => {
          setGetUserError(true)
          error = true
        })
      if (error) return

      getTransactions(user.data)
        .then((transactions) => getSupportedArtworks(transactions))
        .then((supportedArtworks) => setSupportedArtworks(supportedArtworks))

      getCreatedArtworks(user.data).then((createdArtworks) =>
        setCreatedArtworks(createdArtworks)
      )
    }

    loadUser()
  }, [])

  // TODO: update loading screen
  if (getUserError) {
    return (
      <>
        <Navigate to='/browse' />
      </>
    )
  }

  if (user.isLoading) {
    return (
      <>
        <div>loading...</div>
      </>
    )
  }

  return (
    <>
      <section className='heading left-align'>
        <h1>{`${user.profileName || user.username}`}</h1>
        <div className='profile-username light-text'>@{user.username}</div>
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

export default User
