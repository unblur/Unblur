const asyncHandler = require('express-async-handler')
const Transaction = require('../models/transactionModel')

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  // TODO: get only the user's transactions
  const transactions = []

  res.status(200).json(transactions)
})

module.exports = {
  getTransactions,
}
