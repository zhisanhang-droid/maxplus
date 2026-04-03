class HttpError extends Error {
  constructor(status, message, details = null, code = null) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.details = details;
    this.code = code;
  }
}

function assert(condition, status, message, details = null, code = null) {
  if (!condition) {
    throw new HttpError(status, message, details, code);
  }
}

module.exports = {
  HttpError,
  assert
};
