const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { ok } = require("../utils/response");
const { getKeyPair } = require("../security/keypair");

const router = express.Router();

router.post(
  "/public-key",
  asyncHandler(async (req, res) => {
    const { publicKeyPem, keyId } = getKeyPair();
    return ok(res, { publicKeyPem, keyId });
  })
);

module.exports = router;
