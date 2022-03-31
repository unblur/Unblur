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

// TODO: update access to private
// @desc    Get a single transaction
// @route   GET /api/transaction/:id
// @access  Public
const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)

  if (!transaction) {
    res.status(500)
    throw new Error('Server error')
  }

  res.status(200).json(transaction)
})

module.exports = {
  getTransactions,
  getTransaction,
}
