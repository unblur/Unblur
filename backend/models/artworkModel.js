const mongoose = require('mongoose')

const artworkSchema = mongoose.Schema(
  {
    creatorID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    image: {
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
