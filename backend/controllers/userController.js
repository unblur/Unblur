const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const PasswordResetToken = require('../models/passwordResetTokenModel')
const VerifyEmailToken = require('../models/verifyEmailTokenModel')
const crypto = require('crypto')
const sendEmail = require('../utils/email/sendEmail')
const clientURL = process.env.CLIENT_URL
const bcryptSalt = parseInt(process.env.SALT_ROUNDS)

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
  const salt = await bcrypt.genSalt(bcryptSalt)
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

  // Create email verification token
  const verificationToken = crypto.randomBytes(32).toString('hex')
  const saltForEmail = await bcrypt.genSalt(bcryptSalt)
  const hashedToken = await bcrypt.hash(verificationToken, Number(saltForEmail))

  // Store verification token
  await VerifyEmailToken.create({
    userID: user._id,
    token: hashedToken,
  })

  // Creating a link that will be sent to user's email. User will click the link activating a GET request. Need to create display page.
  const link = `${clientURL}/api/users/verifyemail?token=${verificationToken}&id=${user._id}`
  const sendStatus = await sendEmail(
    user.email,
    'Verify Email Address',
    { link },
    './templates/requestVerifyEmail.handlebars'
  )
  if (sendStatus.error) {
    res.status(500)
    throw new Error('Server error.')
  }

  // Successful registration
  res.status(201).json({
    _id: user.id,
    email: user.email,
    message: 'Successfully registered. Please verify your email to log in.',
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

  // Check if user is verified
  if (!user.verified) {
    res.status(400)
    throw new Error('User not verified')
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

// @desc    Verify user email
// @route   GET /api/users/verifyemail
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token, id } = req.query
  const verifyEmailToken = await VerifyEmailToken.findOne({ userID: id })

  // Check if a verify email token has been created (there's been a verify email request)
  if (!verifyEmailToken) {
    res.status(400)
    throw new Error('No email verification requested')
  }

  // Check if user exisits
  const user = await User.findOne({ _id: id })
  if (!user) {
    res.status(400)
    throw new Error('User not found')
  }

  // Check if user is already verified if not then compare the token coming in with the request to the one we have stored for the particular user
  if (user.verified) {
    res.json({
      message: 'User has been already verified. Please login.',
    })
    return
  }
  const isValid = await bcrypt.compare(token, verifyEmailToken.token)

  // Check if the verify email token being sent to us is the same we have in file for the specific user
  if (!isValid) {
    res.status(400)
    throw new Error('Invalid or expired verify email token')
  }

  // Update the user's verification status
  user.verified = true
  await user.save()

  const updatedUser = await User.findById(id)

  if (!updatedUser.verified) {
    res.status(500)
    throw new Error('Error verifying email')
  }

  sendEmail(
    updatedUser.email,
    'Successfully Verified Email',
    {},
    './templates/verifyEmail.handlebars'
  )
  await VerifyEmailToken.deleteOne({ _id: verifyEmailToken._id })

  // Display a succesfully verified email page instead of sending this json back
  res.json({ message: 'Succesfully verified email.' })
})

// @desc    Create a verify email request
// @route   POST /api/users/verifyemailrequest
// @access  Public
const verifyEmailRequest = asyncHandler(async (req, res) => {
  const { email } = req.body

  // Check if user exisits
  const user = await User.findOne({ email })
  if (!user) {
    res.status(400)
    throw new Error('User not found')
  }

  // Check if user is already verified
  if (user.verified) {
    res.json({ message: 'User has been already verified. Please login.' })
    return
  }

  const verifyEmailToken = await VerifyEmailToken.findOne({ userID: user._id })

  if (verifyEmailToken) {
    await VerifyEmailToken.deleteOne({ _id: verifyEmailToken._id })
  }

  // Make new verification token
  const verifyToken = crypto.randomBytes(32).toString('hex')
  const salt = await bcrypt.genSalt(bcryptSalt)
  const hashedToken = await bcrypt.hash(verifyToken, Number(salt))

  // Store password verification token
  await VerifyEmailToken.create({
    userID: user._id,
    token: hashedToken,
  })

  // Creating a link that will be sent to user's email. User will click the link activating a GET request. Need to create display page.
  const link = `${clientURL}/api/users/verifyemail?token=${verifyToken}&id=${user._id}`
  const sendStatus = await sendEmail(
    user.email,
    'Verify Email Address',
    { link },
    './templates/requestVerifyEmail.handlebars'
  )
  if (sendStatus.error) {
    res.status(500)
    throw new Error('Server error.')
  }

  res.json({ message: 'Successfully sent email.' })
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

// @desc    Create a password reset request
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
  const passwordResetToken = await PasswordResetToken.findOne({
    userID: user._id,
  })

  if (passwordResetToken) {
    await passwordResetToken.deleteOne(passwordResetToken._id)
  }

  // Make new password reset token
  const resetToken = crypto.randomBytes(32).toString('hex')
  const salt = await bcrypt.genSalt(bcryptSalt)
  const hash = await bcrypt.hash(resetToken, Number(salt))

  // Store password reset token
  await PasswordResetToken.create({
    userID: user._id,
    token: hash,
  })

  // Creating a link that will be sent to user's email. User will click the link activating a GET request to a webpage with a password input text box. The link below will then be sent along with password request body to hit the /api/users/passwordreset endpoint updating the user's password.
  const link = `${clientURL}/api/users/passwordreset?token=${resetToken}&id=${user._id}`

  const sendStatus = await sendEmail(
    user.email,
    'Password Reset Request',
    { link },
    './templates/requestResetPassword.handlebars'
  )

  if (sendStatus.error) {
    res.status(500)
    throw new Error('Server error.')
  }

  res.json({ message: 'Successfully sent email.' })
})

// @desc    Reset user's password
// @route   POST /api/users/passwordreset
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, id } = req.query
  const { password } = req.body
  const resetPasswordToken = await PasswordResetToken.findOne({ userID: id })

  // Check if a reset password token has been created (there's been a password reset request)
  if (!resetPasswordToken) {
    res.status(400)
    throw new Error('No password reset requested')
  }

  const isValid = await bcrypt.compare(token, resetPasswordToken.token)

  // Check if the reset password token being sent to us is the same we have in file for the specific user
  if (!isValid) {
    res.status(400)
    throw new Error('Invalid or expired reset password token')
  }

  // Everything was a success, hash the new password
  const salt = await bcrypt.genSalt(bcryptSalt)
  const hash = await bcrypt.hash(password, Number(salt))

  // Update the user's password
  const user = await User.findOne({ _id: id })
  user.password = hash
  await user.save()

  sendEmail(
    user.email,
    'Successfully Reset Password',
    {},
    './templates/resetPassword.handlebars'
  )
  await resetPasswordToken.deleteOne()

  res.json({ message: 'Succesfully reset password.' })
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
  resetPassword,
  verifyEmail,
  verifyEmailRequest,
}
