const mongoose = require('mongoose')

const artworkSchema = mongoose.Schema(
  {
    creatorID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // This is the unblurred image that is NOT statically served
    image: {
      type: String,
      required: true,
    },
    // This is the image that can be requested from the frontend
    blurredImage: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    algosToUnblur: {
      type: Number,
      required: true,
    },
    dateUnblurred: {
      type: Date,
    },
    commentIDs: [mongoose.Schema.Types.ObjectId],
    transactionIDs: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Artwork', artworkSchema)
