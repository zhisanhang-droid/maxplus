const fs = require("fs/promises");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const { prepareRuntime } = require("../bootstrap/prepareRuntime");
const { ENV_FILE_PATH, env, applyEnvMap } = require("../config/env");
const { query } = require("../config/database");
const { getRuntimeState, isRuntimeReady } = require("../config/runtime");
const { HttpError, assert } = require("../utils/errors");
const { normalizeInteger, sanitizeString } = require("../utils/normalizers");

function readExistingEnvMap() {
  return fs
    .readFile(ENV_FILE_PATH, "utf8")
    .then((raw) => dotenv.parse(raw))
    .catch(() => ({}));
}

function buildInstallStatus() {
  const runtimeState = getRuntimeState();

  return {
    ...runtimeState,
    installed: env.appInstalled,
    database: {
      host: env.mysql.host,
      port: env.mysql.port,
      user: env.mysql.user,
      database: env.mysql.database,
      passwordConfigured: Boolean(env.mysql.password)
    }
  };
}

function resolveDatabaseInput(input = {}, options = {}) {
  const { allowEmptyPassword = false } = options;
  const host = sanitizeString(input.host, { max: 120 }) || env.mysql.host || "127.0.0.1";
  const port = normalizeInteger(input.port, { min: 1, max: 65535, defaultValue: env.mysql.port || 3306 });
  const user = sanitizeString(input.user, { max: 120 }) || env.mysql.user || "root";
  const database = sanitizeString(input.database, { max: 120 }) || env.mysql.database || "maxplus_cms";
  const submittedPassword = typeof input.password === "string" ? input.password : "";
  const password = submittedPassword || (allowEmptyPassword ? env.mysql.password : "");

  assert(host, 400, "数据库主机不能为空。");
  assert(user, 400, "数据库用户名不能为空。");
  assert(database, 400, "数据库名不能为空。");

  if (!allowEmptyPassword || !env.mysql.password) {
    assert(password !== "", 400, "数据库密码不能为空。");
  }

  return {
    host,
    port,
    user,
    password,
    database
  };
}

function resolveAdminInput(input = {}) {
  const username = sanitizeString(input.username, { max: 80 });
  const password = typeof input.password === "string" ? input.password.trim() : "";
  const confirmPassword = typeof input.confirmPassword === "string" ? input.confirmPassword.trim() : "";

  assert(username, 400, "管理员账号不能为空。");
  assert(/^[a-zA-Z0-9._-]{4,80}$/.test(username), 400, "管理员账号仅支持字母、数字、点、下划线和短横线，且至少 4 位。");
  assert(password.length >= 8, 400, "管理员密码至少 8 位。");
  assert(password === confirmPassword, 400, "两次输入的管理员密码不一致。");

  return {
    username,
    password
  };
}

function buildSecret(currentValue) {
  const normalized = sanitizeString(currentValue, { max: 255 });

  if (normalized && !normalized.startsWith("maxplus-dev-")) {
    return normalized;
  }

  return crypto.randomBytes(32).toString("hex");
}

function serializeEnvValue(value) {
  const normalized = String(value ?? "");

  if (!normalized) {
    return "\"\"";
  }

  if (/[\s#"'\u0060=]/.test(normalized)) {
    return JSON.stringify(normalized);
  }

  return normalized;
}

function serializeEnvMap(envMap) {
  return `${Object.entries(envMap)
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${serializeEnvValue(value)}`)
    .join("\n")}\n`;
}

async function writeEnvFile(envMap) {
  await fs.writeFile(ENV_FILE_PATH, serializeEnvMap(envMap), "utf8");
}

async function testDatabaseConnection(payload = {}) {
  const database = resolveDatabaseInput(payload.database || payload, {
    allowEmptyPassword: true
  });

  const connection = await mysql.createConnection({
    host: database.host,
    port: database.port,
    user: database.user,
    password: database.password,
    charset: "utf8mb4"
  });

  try {
    await connection.query("SELECT 1");
  } finally {
    await connection.end();
  }

  return {
    connected: true,
    message: "数据库连接成功。"
  };
}

function buildAdminUserId() {
  return `usr-${Date.now().toString(36)}-${crypto.randomBytes(4).toString("hex")}`.slice(0, 40);
}

async function ensureSuperAdminAccount(admin) {
  const rows = await query(
    `SELECT id
     FROM admin_users
     WHERE username = ?
     LIMIT 1`,
    [admin.username]
  );
  const passwordHash = await bcrypt.hash(admin.password, 10);
  const existingAdmin = rows[0];

  if (existingAdmin?.id) {
    await query(
      `UPDATE admin_users
       SET password_hash = ?, role = ?, status = 1
       WHERE id = ?`,
      [passwordHash, "super-admin", existingAdmin.id]
    );
    return;
  }

  await query(
    `INSERT INTO admin_users (id, username, password_hash, role, status)
     VALUES (?, ?, ?, ?, 1)`,
    [buildAdminUserId(), admin.username, passwordHash, "super-admin"]
  );
}

async function installSystem(payload = {}) {
  if (isRuntimeReady()) {
    throw new HttpError(403, "系统已完成安装，当前不允许再次执行安装。", null, "INSTALL_LOCKED");
  }

  const database = resolveDatabaseInput(payload.database, {
    allowEmptyPassword: true
  });
  const admin = resolveAdminInput(payload.admin);

  await testDatabaseConnection({
    database
  });

  const currentEnvMap = await readExistingEnvMap();
  const nextEnvMap = {
    ...currentEnvMap,
    APP_INSTALLED: "true",
    HOST: currentEnvMap.HOST || process.env.HOST || env.host,
    PORT: currentEnvMap.PORT || process.env.PORT || String(env.port),
    API_PREFIX: currentEnvMap.API_PREFIX || process.env.API_PREFIX || env.apiPrefix,
    CORS_ORIGINS: currentEnvMap.CORS_ORIGINS || process.env.CORS_ORIGINS || "*",
    JWT_EXPIRES_IN: currentEnvMap.JWT_EXPIRES_IN || process.env.JWT_EXPIRES_IN || env.jwtExpiresIn,
    JWT_SECRET: buildSecret(currentEnvMap.JWT_SECRET || process.env.JWT_SECRET),
    ADMIN_RECOVERY_KEY: buildSecret(
      currentEnvMap.ADMIN_RECOVERY_KEY || process.env.ADMIN_RECOVERY_KEY
    ),
    DATA_ENCRYPTION_KEY: buildSecret(
      currentEnvMap.DATA_ENCRYPTION_KEY || process.env.DATA_ENCRYPTION_KEY
    ),
    MYSQL_HOST: database.host,
    MYSQL_PORT: String(database.port),
    MYSQL_USER: database.user,
    MYSQL_PASSWORD: database.password,
    MYSQL_DATABASE: database.database
  };

  await writeEnvFile(nextEnvMap);
  applyEnvMap(nextEnvMap);

  const runtimeState = await prepareRuntime({
    adminUsers: [
      {
        username: admin.username,
        password: admin.password,
        role: "super-admin"
      }
    ]
  });

  assert(runtimeState.ready, 500, runtimeState.message, runtimeState, "INSTALL_FAILED");
  await ensureSuperAdminAccount(admin);

  return {
    status: buildInstallStatus(),
    loginPath: "/login"
  };
}

module.exports = {
  buildInstallStatus,
  testDatabaseConnection,
  installSystem
};
