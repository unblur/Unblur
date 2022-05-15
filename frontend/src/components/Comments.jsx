import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API_URL = `https://unblur.cse356.compas.cs.stonybrook.edu/api/comments/artwork`

export const Comments = ({ artworkId }) => {
  const auth = useSelector((state) => state.auth)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])

  useEffect(async () => {
    await getComments()
    setLoading(false)
  }, [])

  const getComments = async () => {
    const response = await axios.get(`${API_URL}/${artworkId}`)
    setComments(
      response.data.sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      )
    )
  }

  const postComment = async () => {
    if (!comment) return
    const token = auth.user.token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const data = {
      content: comment,
    }
    setComment('')
    const response = await axios.post(`${API_URL}/${artworkId}`, data, config)
    await getComments()

    return response.data
  }

  return (
    <div className='comment-container'>
      <h2 style={{ marginTop: '2rem' }}>Comments</h2>
      {auth.user && !loading && (
        <>
          <textarea
            className='comment-textarea'
            value={comment}
            onChange={(e) => {
              setComment(e.target.value)
            }}
          />
          {comment && (
            <button className='btn btn-primary' onClick={postComment}>
              post
            </button>
          )}
        </>
      )}
      <div style={{ marginTop: '1rem' }}>
        {loading && <p>loading...</p>}
        {!loading && !comments.length && <p>No comments</p>}
        {comments.map((comment) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'left',
              marginBottom: '1rem',
              border: '1px solid #e0e0e0',
              borderRadius: '.5rem',
              padding: '1rem',
            }}
          >
            <p>{comment.content}</p>
            <Link
              to={`/user/${comment.userID._id}`}
              className='light-text user-link'
            >
              {comment.userID.username}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
