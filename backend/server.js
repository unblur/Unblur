const express = require('express')
const path = require('path')
const dotenv = require('dotenv').config()
const cors = require('cors')
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleware')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const port = process.env.PORT || 8000

connectDB()

const app = express()

app.get('/', (req, res) => {
  res.send('unblur')
})

// CORS
app.use(cors())

// Serving images
// TODO: make sure fully unblurred images are blocked from being served statically


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "frontend", "build", "index.html"))); // change this if your dir structure is different
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.use(
  '/files',
  (req, res, next) => {
    console.log(req.url)
    if (!req.url.includes('-blurred')) {
      throw new Error('Access to that file is not allowed')
    }
    next()
  },
  express.static(path.join(__dirname, '..', 'uploads'))
)

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/artworks', require('./routes/artworkRoutes'))
app.use('/api/transactions', require('./routes/transactionRoutes'))

// API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Error handler
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server started on port: ${port}`)
})
