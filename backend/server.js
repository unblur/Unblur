const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleware')
const port = process.env.PORT || 8000

connectDB()

const app = express()

app.get('/', (req, res) => {
  res.send('unblur')
})

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/artworks', require('./routes/artworkRoutes'))
app.use('/api/transactions', require('./routes/transactionRoutes'))

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server started on port: ${port}`)
})
