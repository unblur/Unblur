const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc    Get all usser
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
  // TODO (zhen): Change access to private.
  // Only logged in users can see other users.

  const users = await User.find()
  if (!users) {
    res.status(500)
    throw new Error('Server error')
  }

  res.status(200).json(users)
})

module.exports = {
  getUsers,
}
