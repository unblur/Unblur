const express = require('express')
const router = express.Router()
const {
  getCommentsForArtwork,
  postComment,
} = require('../controllers/commentController')
const { protect } = require('../middleware/authMiddleware')

router.get('/artwork/:id', getCommentsForArtwork)
router.post('/artwork/:id', protect, postComment)

module.exports = router