const crypto = require("crypto");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(process.cwd(), ".env")
});

function normalizeNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildDataEncryptionKey(secret) {
  return crypto.createHash("sha256").update(secret).digest();
}

const rawOrigins = process.env.CORS_ORIGINS?.trim() || "*";

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  host: process.env.HOST || "0.0.0.0",
  port: normalizeNumber(process.env.PORT, 4000),
  apiPrefix: process.env.API_PREFIX || "/api",
  corsOrigins:
    rawOrigins === "*"
      ? "*"
      : rawOrigins
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
  mysql: {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: normalizeNumber(process.env.MYSQL_PORT, 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "maxplus_cms"
  },
  jwtSecret: process.env.JWT_SECRET || "maxplus-dev-jwt-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "12h",
  dataEncryptionKey: buildDataEncryptionKey(
    process.env.DATA_ENCRYPTION_KEY || process.env.JWT_SECRET || "maxplus-dev-data-secret"
  ),
  rsaPrivateKey: process.env.RSA_PRIVATE_KEY || "",
  rsaPublicKey: process.env.RSA_PUBLIC_KEY || "",
  rateLimitWindowMs: normalizeNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  rateLimitMax: normalizeNumber(process.env.RATE_LIMIT_MAX, 300),
  loginRateLimitMax: normalizeNumber(process.env.LOGIN_RATE_LIMIT_MAX, 20)
};

module.exports = {
  env
};
