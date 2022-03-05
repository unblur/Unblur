const mongoose = require('mongoose')

const resetTokenSchema = mongoose.Schema({
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
    expires: 3600, // 1 hour
  },
})

module.exports = mongoose.model('ResetPasswordToken', resetTokenSchema)
