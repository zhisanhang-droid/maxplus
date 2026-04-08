const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const ENV_FILE_PATH = path.resolve(process.cwd(), ".env");

if (fs.existsSync(ENV_FILE_PATH)) {
  const raw = fs.readFileSync(ENV_FILE_PATH, "utf8");
  const parsed = dotenv.parse(raw);

  for (const [key, value] of Object.entries(parsed)) {
    process.env[key] = value;
  }
}

function normalizeNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildDataEncryptionKey(secret) {
  return crypto.createHash("sha256").update(secret).digest();
}

function buildEnv(source = process.env) {
  const rawOrigins = source.CORS_ORIGINS?.trim() || "*";

  return {
    nodeEnv: source.NODE_ENV || "development",
    host: source.HOST || "0.0.0.0",
    port: normalizeNumber(source.PORT, 4000),
    apiPrefix: source.API_PREFIX || "/api",
    corsOrigins:
      rawOrigins === "*"
        ? "*"
        : rawOrigins
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
    mysql: {
      host: source.MYSQL_HOST || "127.0.0.1",
      port: normalizeNumber(source.MYSQL_PORT, 3306),
      user: source.MYSQL_USER || "root",
      password: source.MYSQL_PASSWORD || "",
      database: source.MYSQL_DATABASE || "maxplus_cms"
    },
    appInstalled: String(source.APP_INSTALLED || "").toLowerCase() === "true",
    jwtSecret: source.JWT_SECRET || "maxplus-dev-jwt-secret",
    adminRecoveryKey: source.ADMIN_RECOVERY_KEY || source.JWT_SECRET || "maxplus-dev-jwt-secret",
    jwtExpiresIn: source.JWT_EXPIRES_IN || "12h",
    dataEncryptionKey: buildDataEncryptionKey(
      source.DATA_ENCRYPTION_KEY || source.JWT_SECRET || "maxplus-dev-data-secret"
    ),
    rsaPrivateKey: source.RSA_PRIVATE_KEY || "",
    rsaPublicKey: source.RSA_PUBLIC_KEY || "",
    rateLimitWindowMs: normalizeNumber(source.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    rateLimitMax: normalizeNumber(source.RATE_LIMIT_MAX, 300),
    loginRateLimitMax: normalizeNumber(source.LOGIN_RATE_LIMIT_MAX, 20)
  };
}

const env = buildEnv();

function syncEnv(nextEnv) {
  env.nodeEnv = nextEnv.nodeEnv;
  env.host = nextEnv.host;
  env.port = nextEnv.port;
  env.apiPrefix = nextEnv.apiPrefix;
  env.corsOrigins = nextEnv.corsOrigins;
  env.mysql = nextEnv.mysql;
  env.appInstalled = nextEnv.appInstalled;
  env.jwtSecret = nextEnv.jwtSecret;
  env.adminRecoveryKey = nextEnv.adminRecoveryKey;
  env.jwtExpiresIn = nextEnv.jwtExpiresIn;
  env.dataEncryptionKey = nextEnv.dataEncryptionKey;
  env.rsaPrivateKey = nextEnv.rsaPrivateKey;
  env.rsaPublicKey = nextEnv.rsaPublicKey;
  env.rateLimitWindowMs = nextEnv.rateLimitWindowMs;
  env.rateLimitMax = nextEnv.rateLimitMax;
  env.loginRateLimitMax = nextEnv.loginRateLimitMax;
}

function applyEnvMap(values) {
  for (const [key, value] of Object.entries(values)) {
    process.env[key] = value == null ? "" : String(value);
  }

  syncEnv(buildEnv(process.env));
  return env;
}

module.exports = {
  env,
  ENV_FILE_PATH,
  applyEnvMap
};
