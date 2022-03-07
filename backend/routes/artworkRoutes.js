const express = require('express')
const router = express.Router()
const {
  getArtworks,
  uploadArtwork,
} = require('../controllers/artworkController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', getArtworks)
router.post('/upload', protect, uploadArtwork)

module.exports = router
