const express = require('express')
const router = express.Router()
const {
  getTransactions,
  getTransaction,
  addTransactions,
} = require('../controllers/transactionController')

router.get('/', getTransactions)
router.get('/:id', getTransaction)
router.post('/add', addTransactions)

module.exports = router
