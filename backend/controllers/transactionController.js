const asyncHandler = require('express-async-handler')
const Transaction = require('../models/transactionModel')

// @desc    Add new transaction
// @route   POST /api/transactions/add
// @access  Private
const addTransactions = asyncHandler(async (req, res) => {
  const { donatorID, receiverID, algos, artworkID } = req.body

  // Create transaction
  const txn = await Transaction.create({
    donatorID,
    receiverID,
    algos,
    artworkID,
  })
  if (!txn) {
    res.status(400)
    throw new Error('Server error adding transaction to database.')
  }

  res.status(200)
})

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
  addTransactions,
}
