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

module.exports = {
  login
};
