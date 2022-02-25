const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleware')
const port = 8000

connectDB()

const app = express()

app.get('/', (req, res) => {
  res.send('unblur')
})

// Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/artworks', require('./routes/artworkRoutes'))

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server started on port: ${port}`)
})
