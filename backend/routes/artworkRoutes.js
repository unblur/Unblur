const express = require('express')
const router = express.Router()
const { getArtworks } = require('../controllers/artworkController')

router.get('/', getArtworks)

module.exports = router
