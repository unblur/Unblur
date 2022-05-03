const asyncHandler = require('express-async-handler')
const Comment = require('../models/commentModel')
const Artwork = require('../models/artworkModel')

// @desc    Get all comments for an artwork
// @route   GET /api/comments/artwork/:id
// @access  Public
const getCommentsForArtwork = asyncHandler(async (req, res) => {
  const artwork = await Artwork.findById(req.params.id)
    .populate('commentIDs')
    .select('+commentIDs')

  if (!artwork) {
    res.status(404)
    throw new Error('Artwork does not exist.')
  }

  res.status(200).json(artwork.commentIDs)
})

// @desc    Post a comment to a given artwork
// @route   POST /api/comments/artwork/:id
// @access  Private
const postComment = asyncHandler(async (req, res) => {
  const artwork = await Artwork.findById(req.params.id)
  if (!artwork) {
    res.status(404)
    throw new Error('Artwork does not exist.')
  }

  const comment = await Comment.create({
    userID: req.user.id,
    content: req.body.content
  })
  if (!comment) {
    res.status(400)
    throw new Error('Invalid comment data.')
  }

  artwork.commentIDs.push(comment.id)
  await artwork.save()

  res.json({
    message: 'Successfully posted comment.'
  })
})

module.exports = {
  getCommentsForArtwork,
  postComment
}