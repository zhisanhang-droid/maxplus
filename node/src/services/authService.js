const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../config/database");
const { env } = require("../config/env");
const { sanitizeString } = require("../utils/normalizers");
const { HttpError } = require("../utils/errors");

function buildSessionPayload(row) {
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    loggedInAt: new Date().toISOString()
  };
}

async function login(input) {
  const username = sanitizeString(input.username, { max: 80 });
  const password = typeof input.password === "string" ? input.password : "";
  const requestedRole = sanitizeString(input.role, { max: 40 });

  if (!username || !password) {
    throw new HttpError(400, "用户名和密码不能为空。");
  }

  const rows = await query(
    `SELECT id, username, password_hash, role, status
     FROM admin_users
     WHERE username = ?
     LIMIT 1`,
    [username]
  );

  const admin = rows[0];

  if (!admin || !admin.status) {
    throw new HttpError(401, "账号不存在或已被禁用。");
  }

  const matched = await bcrypt.compare(password, admin.password_hash);

  if (!matched) {
    throw new HttpError(401, "用户名或密码错误。");
  }

  if (requestedRole && requestedRole !== admin.role) {
    throw new HttpError(403, "所选角色与账号权限不匹配。");
  }

  await query(`UPDATE admin_users SET last_login_at = NOW() WHERE id = ?`, [admin.id]);

  const session = buildSessionPayload(admin);
  const token = jwt.sign(session, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

  return {
    token,
    session
  };
}

async function resetPasswordWithRecovery(input) {
  const username = sanitizeString(input.username, { max: 80 });
  const recoveryKey = typeof input.recoveryKey === "string" ? input.recoveryKey.trim() : "";
  const password = typeof input.password === "string" ? input.password.trim() : "";
  const confirmPassword =
    typeof input.confirmPassword === "string" ? input.confirmPassword.trim() : "";

  if (!username || !recoveryKey || !password || !confirmPassword) {
    throw new HttpError(400, "请完整填写账号、恢复密钥和新密码。");
  }

  if (password.length < 8) {
    throw new HttpError(400, "新密码至少 8 位。");
  }

  if (password !== confirmPassword) {
    throw new HttpError(400, "两次输入的新密码不一致。");
  }

  if (!env.adminRecoveryKey || recoveryKey !== env.adminRecoveryKey) {
    throw new HttpError(401, "恢复密钥错误。");
  }

  const rows = await query(
    `SELECT id, username, role
     FROM admin_users
     WHERE username = ?
     LIMIT 1`,
    [username]
  );
  const admin = rows[0];

  if (!admin) {
    throw new HttpError(404, "管理员账号不存在。");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await query(
    `UPDATE admin_users
     SET password_hash = ?, status = 1
     WHERE id = ?`,
    [passwordHash, admin.id]
  );

  return {
    username: admin.username,
    role: admin.role
  };
}

module.exports = {
  login,
  resetPasswordWithRecovery
};
