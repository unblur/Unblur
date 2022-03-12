const express = require('express')
const router = express.Router()
const {
  uploadWrapper,
  getArtworks,
  uploadArtwork,
} = require('../controllers/artworkController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', getArtworks)
router.post('/upload', protect, uploadWrapper, uploadArtwork)

module.exports = router
