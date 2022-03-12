const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500

  res.status(statusCode)

  const message =
    statusCode === 500 && !err.message ? 'Server error' : err.message

  res.json({
    message,
    // message: err.stack,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}

module.exports = {
  errorHandler,
}
