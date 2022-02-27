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
    // TODO: decide whether or not to introduce a new model for comments
    // TODO: use Date.now as the default date
    comments: {
      type: [
        {
          userID: mongoose.Schema.Types.ObjectId,
          content: String,
          date: Date,
        },
      ],
    },
    transactionIDs: {
      type: [mongoose.Schema.Types.ObjectId],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Artwork', artworkSchema)
