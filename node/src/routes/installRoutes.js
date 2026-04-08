const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { ok } = require("../utils/response");
const { resolveRequestPayload } = require("../utils/request");
const {
  buildInstallStatus,
  testDatabaseConnection,
  installSystem
} = require("../services/installService");

const router = express.Router();

router.post(
  "/status",
  asyncHandler(async (req, res) => {
    return ok(res, buildInstallStatus());
  })
);

router.post(
  "/database/test",
  asyncHandler(async (req, res) => {
    const payload = resolveRequestPayload(req);
    const data = await testDatabaseConnection(payload);
    return ok(res, data, "数据库连接成功。");
  })
);

router.post(
  "/setup",
  asyncHandler(async (req, res) => {
    const payload = resolveRequestPayload(req);
    const data = await installSystem(payload);
    return ok(res, data, "安装已完成。");
  })
);

module.exports = router;
