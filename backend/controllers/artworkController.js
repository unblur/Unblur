const asyncHandler = require('express-async-handler')
const Artwork = require('../models/artworkModel')

// @desc    Get all artworks
// @route   GET /api/artworks
// @access  Public
const getArtworks = asyncHandler(async (req, res) => {
  const artworks = await Artwork.find()
  if (!artworks) {
    res.status(500)
    throw new Error('Server error')
  }

  res.status(200).json(artworks)
})

module.exports = {
  getArtworks,
}
