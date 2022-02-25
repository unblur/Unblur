const mongoose = require('mongoose')

const transactionSchema = mongoose.Schema(
  {
    donatorID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiverID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    algos: {
      type: Number,
      required: true,
      min: 0,
    },
    artworkID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Transaction', transactionSchema)
