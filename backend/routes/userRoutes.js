const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getSelf,
  getUsers,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/self', protect, getSelf)
router.get('/', getUsers)

module.exports = router
