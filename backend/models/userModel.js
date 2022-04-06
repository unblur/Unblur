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
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    wallets: [
      {
        walletID: String,
        walletName: String,
      },
    ],
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
