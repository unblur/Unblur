const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const port = 8000

connectDB()

const app = express()

app.get('/', (req, res) => {
  res.send('unblur')
})

app.listen(port, () => {
  console.log(`Server started on port: ${port}`)
})
