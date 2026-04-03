const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { fail } = require("../utils/response");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return fail(res, 401, "未登录或登录已过期。");
  }

  const token = authHeader.slice(7);

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (error) {
    return fail(res, 401, "令牌无效，请重新登录。");
  }
}

module.exports = {
  requireAuth
};
