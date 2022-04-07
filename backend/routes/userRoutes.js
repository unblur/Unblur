const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  updateSelf,
  getSelf,
  getUsers,
  getUser,
  resetPasswordRequest,
  resetPassword,
  verifyEmail,
  verifyEmailRequest,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/resetpasswordrequest', resetPasswordRequest)
router.post('/resetpassword', resetPassword)
router.post('/verifyemailrequest', verifyEmailRequest)
router.post('/verifyemail', verifyEmail)
router.post('/update', protect, updateSelf)
router.get('/self', protect, getSelf)
router.get('/', getUsers)
router.get('/:id', getUser)

module.exports = router
