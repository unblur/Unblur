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
    comments: {
      type: [commentSchema],
    },
    transactionIDs: {
      type: [mongoose.Schema.Types.ObjectId],
    },
  },
  {
    timestamps: true,
  }
)

const commentSchema = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Artwork', artworkSchema)
