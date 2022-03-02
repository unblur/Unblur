const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const PasswordRestToken = require('../models/passwordRestTokenModel')
const crypto = require('crypto')
const sendEmail = require('../utils/email/sendEmail')
const clientURL = process.env.CLIENT_URL

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400)
    throw new Error('Please enter all fields')
  }

  // Check if user exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
  })
  if (!user) {
    res.status(400)
    throw new Error('Invalid user data')
  }

  // Successful registration
  res.status(201).json({
    _id: user.id,
    email: user.email,
    token: generateToken(user._id),
  })
})

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check if user exists
  const user = await User.findOne({ email })
  if (!user) {
    res.status(400)
    throw new Error('Invalid credentials')
  }

  // Check password matches
  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    res.status(400)
    throw new Error('Invalid credentials')
  }

  // Successful login
  res.json({
    _id: user.id,
    email: user.email,
    token: generateToken(user._id),
  })
})

// @desc    Update user data
// @route   POST /api/users/update
// @access  Private
const updateSelf = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
})

// @desc    Get user data
// @route   GET /api/users/self
// @access  Private
const getSelf = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  res.json({
    _id: user.id,
    email: user.email,
    wallet: user.wallet,
    artworkIDs: user.artworkIDs,
    transactionIDs: user.transactionIDs,
    profilePicture: user.profilePicture,
    profileName: user.profileName,
    profileDescription: user.profileDescription,
  })
})

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password -createdAt -updatedAt -__v')
  if (!users) {
    res.status(500)
    throw new Error('Server error')
  }

  res.json(users)
})

// @desc    Create a rest user password request
// @route   POST /api/users/passwordresetrequest
// @access  Public
const resetPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })

  // Check if user doesn't exists
  if (!user) {
    res.status(400)
    throw new Error("User doesn't exists")
  }

  // Check if a password reset token already exists
  const pswdRestToken = await PasswordRestToken.findOne(user._id)

  if (pswdRestToken) {
    await pswdRestToken.deleteOne(pswdRestToken._id)
  }

  // Make new password rest token
  const salt = await bcrypt.genSalt(10)
  let resetToken = crypto.randomBytes(32).toString('hex')
  const hash = await bcrypt.hash(resetToken, Number(salt))

  // Store password reset token
  await new PasswordRestToken({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save()

  const link = `${clientURL}/passwordreset?token=${resetToken}&id=${user._id}`

  const sendStatus = await sendEmail(
    user.email,
    'Password Rest Request',
    { link: link },
    './templates/requestResetPassword.handlebars'
  )

  if (sendStatus.error) {
    res.status(500)
    throw new Error('Server error.')
  }

  res.json({ msg: 'Successfully sent email.' })
})

// @desc    Rest user's password
// @route   POST /api/users/passwordreset
// @access  Public
const restPassword = asyncHandler(async (req, res) => {
  const { token, userId, password } = req.body
  let restPasswordToken = await PasswordRestToken.findOne({ userId })

  // Check if a rest password token has been created (there's been a password rest request)
  if (!restPasswordToken) {
    res.status(400)
    throw new Error('No password reset requested')
  }

  const isValid = await bcrypt.compare(token, restPasswordToken.token)

  // Check if the rest password token being sent to us is the same we have in file for the specific user
  if (!isValid) {
    res.status(400)
    throw new Error('Invalid or expired rest password token')
  }

  // Everything was a success, hash the new password
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, Number(salt))

  // Update the user's password
  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  )

  const user = await User.findById(userId)
  sendEmail(
    user.email,
    'Password Reset Successfully',
    {},
    './templates/resetPassword.handlebars'
  )
  await restPasswordToken.deleteOne()

  res.json({ msg: 'Succesfully reset password.' })
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  updateSelf,
  getSelf,
  getUsers,
  resetPasswordRequest,
  restPassword,
}
