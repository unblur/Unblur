const mongoose = require('mongoose')

const commentSchema = mongoose.Schema(
  {
    userID: mongoose.Schema.Types.ObjectId,
    content: String,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Comment', commentSchema)
