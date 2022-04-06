const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500

  res.status(statusCode)

  const message = statusCode === 500 ? 'Server error' : err.message

  // Log server errors
  if (statusCode === 500) {
    console.log(`[Server Error]: ${err.stack}`)
  }

  res.json({
    message,
    // message: err.stack,
    statusCode,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}

module.exports = {
  errorHandler,
}
