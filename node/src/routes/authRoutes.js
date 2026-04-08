const express = require("express");
const rateLimit = require("express-rate-limit");
const { env } = require("../config/env");
const { asyncHandler } = require("../utils/asyncHandler");
const { ok } = require("../utils/response");
const { resolveRequestPayload } = require("../utils/request");
const { login, resetPasswordWithRecovery } = require("../services/authService");
const { addLog } = require("../services/systemService");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.loginRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "登录尝试过于频繁，请稍后再试。"
  }
});

const recoveryLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "恢复尝试过于频繁，请稍后再试。"
  }
});

router.post(
  "/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const payload = resolveRequestPayload(req);
    const result = await login(payload);

    await addLog({
      type: "login",
      actor: result.session.username,
      role: result.session.role,
      message: "从后台登录页进入系统。"
    });

    return ok(res, result, "登录成功。");
  })
);

router.post(
  "/recovery/reset",
  recoveryLimiter,
  asyncHandler(async (req, res) => {
    const payload = resolveRequestPayload(req);
    const result = await resetPasswordWithRecovery(payload);

    await addLog({
      type: "operation",
      actor: result.username,
      role: result.role || "super-admin",
      message: "通过恢复密钥重置了后台登录密码。"
    });

    return ok(res, result, "密码已重置，请使用新密码登录。");
  })
);

module.exports = router;
