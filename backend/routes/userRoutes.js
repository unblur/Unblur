const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  updateSelf,
  getSelf,
  getUsers,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/update', protect, updateSelf)
router.get('/self', protect, getSelf)
router.get('/', getUsers)

module.exports = router
