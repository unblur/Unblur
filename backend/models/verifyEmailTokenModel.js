const mongoose = require('mongoose')

const verifyTokenSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400000, // 24 hours
  },
})

module.exports = mongoose.model('VerifyEmailToken', verifyTokenSchema)
