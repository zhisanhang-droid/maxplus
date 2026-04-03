const { decryptEnvelope } = require("../security/hybridCrypto");

function resolveRequestPayload(req) {
  const body = req.body || {};

  if (body.envelope) {
    return decryptEnvelope(body.envelope);
  }

  return body;
}

module.exports = {
  resolveRequestPayload
};
