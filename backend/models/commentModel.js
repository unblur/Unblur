const mongoose = require('mongoose')

const commentSchema = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Comment', commentSchema)
