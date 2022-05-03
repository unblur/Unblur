const asyncHandler = require('express-async-handler')
const Transaction = require('../models/transactionModel')
const Artwork = require('../models/artworkModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')
const { blurImage } = require('./artworkController')

// @desc    Add new transaction
// @route   POST /api/transactions/add
// @access  Private
const addTransactions = asyncHandler(async (req, res) => {
  const { donatorID, receiverID, algos, artworkID, algoTxnID } = req.body

  // Check if the algorand transaction is already in the DB
  const txnInDB = await Transaction.findOne({ algoTxnID })
  if (txnInDB) {
    res.json({})
  }

  // Create transaction
  const txn = await Transaction.create({
    donatorID,
    receiverID,
    algos,
    artworkID,
    algoTxnID,
  })

  if (!txn) {
    res.status(400)
    console.log('newly created txn doesnt exist')
    throw new Error('Server error adding transaction to database.')
  }

  // Update donator transaction list
  const donator = await User.findById(donatorID)
  if (!donator) {
    res.status(400)
    throw new Error('Server error adding transaction to database.')
  }
  donator.transactionIDs.push(txn._id)
  await donator.save()

  // Update artwork transaction list
  const artwork = await Artwork.findById(artworkID)
  if (!artwork) {
    res.status(400)
    throw new Error('Server error adding transaction to database.')
  }
  artwork.transactionIDs.push(txn._id)
  await artwork.save()

  // Calculating new blur percentage
  const transactions = await Transaction.find({ artwork: artwork.id })
  const total = transactions.reduce(
    (curTotal, transaction) => curTotal + transaction.algos,
    0
  )
  const percentBlur = Math.max(
    (100 * (artwork.algosToUnblur - total)) / artwork.algosToUnblur,
    0
  )

  console.log(percentBlur)

  // Updating the image
  await blurImage(
    `./uploads/${artwork.image}`,
    `./uploads/${artwork.blurredImage}`,
    percentBlur
  )

  res.json({ message: 'Added transaction successfully.' })
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
