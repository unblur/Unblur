const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    wallet: {
      type: String,
    },
    artworkIDs: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    transactionIDs: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    profilePicture: {
      type: String,
    },
    profileName: {
      type: String,
    },
    profileDescription: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
