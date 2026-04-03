const crypto = require("crypto");
const { env } = require("../config/env");
const { getKeyPair } = require("./keypair");
const { HttpError } = require("../utils/errors");

function encodeBase64(value) {
  return Buffer.from(value).toString("base64");
}

function decodeBase64(value) {
  return Buffer.from(value, "base64");
}

function decryptEnvelope(envelope) {
  try {
    const { privateKeyPem } = getKeyPair();
    const encryptedKey = decodeBase64(envelope.encryptedKey);
    const iv = decodeBase64(envelope.iv);
    const ciphertext = decodeBase64(envelope.ciphertext);
    const tag = decodeBase64(envelope.tag);

    const aesKey = crypto.privateDecrypt(
      {
        key: privateKeyPem,
        oaepHash: "sha256",
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
      },
      encryptedKey
    );

    const decipher = crypto.createDecipheriv("aes-256-gcm", aesKey, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return JSON.parse(decrypted.toString("utf8"));
  } catch (error) {
    throw new HttpError(400, "加密载荷解密失败。");
  }
}

function encryptField(value) {
  if (!value) {
    return "";
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", env.dataEncryptionKey, iv);
  const ciphertext = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${encodeBase64(iv)}:${encodeBase64(tag)}:${encodeBase64(ciphertext)}`;
}

function decryptField(value) {
  if (!value) {
    return "";
  }

  const [ivBase64, tagBase64, ciphertextBase64] = String(value).split(":");

  if (!ivBase64 || !tagBase64 || !ciphertextBase64) {
    return "";
  }

  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      env.dataEncryptionKey,
      decodeBase64(ivBase64)
    );
    decipher.setAuthTag(decodeBase64(tagBase64));

    const plaintext = Buffer.concat([
      decipher.update(decodeBase64(ciphertextBase64)),
      decipher.final()
    ]);

    return plaintext.toString("utf8");
  } catch (error) {
    return "";
  }
}

module.exports = {
  decryptEnvelope,
  encryptField,
  decryptField
};
