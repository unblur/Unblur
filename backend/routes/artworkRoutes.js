const express = require('express')
const router = express.Router()
const {
  uploadWrapper,
  getArtworks,
  getArtwork,
  uploadArtwork,
} = require('../controllers/artworkController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', getArtworks)
router.get('/:id', getArtwork)
router.post('/upload', protect, uploadWrapper, uploadArtwork)

module.exports = router
