const crypto = require("crypto");
const { env } = require("../config/env");

let cachedKeyPair;

function buildKeyId(publicKeyPem) {
  return crypto.createHash("sha256").update(publicKeyPem).digest("hex").slice(0, 16);
}

function getKeyPair() {
  if (cachedKeyPair) {
    return cachedKeyPair;
  }

  if (env.rsaPrivateKey && env.rsaPublicKey) {
    cachedKeyPair = {
      privateKeyPem: env.rsaPrivateKey,
      publicKeyPem: env.rsaPublicKey,
      keyId: buildKeyId(env.rsaPublicKey)
    };

    return cachedKeyPair;
  }

  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem"
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem"
    }
  });

  cachedKeyPair = {
    privateKeyPem: privateKey,
    publicKeyPem: publicKey,
    keyId: buildKeyId(publicKey)
  };

  return cachedKeyPair;
}

module.exports = {
  getKeyPair
};
