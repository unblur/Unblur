const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      // TODO: @angel implement
      // required: true,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    wallet: String,
    artworkIDs: [mongoose.Schema.Types.ObjectId],
    transactionIDs: [mongoose.Schema.Types.ObjectId],
    profilePicture: String,
    profileName: String,
    profileDescription: String,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
