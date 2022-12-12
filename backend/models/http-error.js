class HttpError extends Error {
  constructor(message, errorCode) {
    console.log(message)
    super(message)
    this.status = errorCode
  }
}

module.exports = HttpError
