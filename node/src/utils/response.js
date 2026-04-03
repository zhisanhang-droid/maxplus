function ok(res, data = null, message = "OK") {
  return res.json({
    success: true,
    message,
    data
  });
}

function fail(res, status, message, details = null, errorCode = null) {
  return res.status(status).json({
    success: false,
    message,
    errorCode,
    details
  });
}

module.exports = {
  ok,
  fail
};
