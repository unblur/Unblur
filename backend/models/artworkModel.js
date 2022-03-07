const mongoose = require('mongoose')

const artworkSchema = mongoose.Schema(
  {
    creatorID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
    algosToUnblur: {
      type: Number,
      required: true,
    },
    dateUnblurred: {
      type: Date,
    },
    commentIDs: [mongoose.Schema.Types.ObjectId],
    transactionIDs: [mongoose.Schema.Types.ObjectId],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Artwork', artworkSchema)
