const { query } = require("../config/database");
const { safeParseJson, stringifyJson } = require("../utils/json");

function mapLog(row) {
  return {
    id: row.id,
    type: row.type,
    actor: row.actor,
    role: row.role,
    message: row.message,
    metadata: safeParseJson(row.metadata_json, null),
    createdAt: row.created_at
  };
}

async function addLog({ id, type, actor, role, message, metadata = null }) {
  await query(
    `INSERT INTO logs (id, type, actor, role, message, metadata_json)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id || `log-${Date.now()}`,
      type,
      actor,
      role,
      message,
      metadata ? stringifyJson(metadata) : null
    ]
  );
}

async function listLogs() {
  const rows = await query(
    `SELECT id, type, actor, role, message, metadata_json, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
     FROM logs
     ORDER BY created_at DESC`
  );

  return rows.map(mapLog);
}

async function getDashboardSummary() {
  const [products] = await query(`SELECT COUNT(*) AS count FROM products WHERE status = 'published'`);
  const [videos] = await query(`SELECT COUNT(*) AS count FROM videos WHERE status = 'published'`);
  const [blogs] = await query(`SELECT COUNT(*) AS count FROM blogs WHERE status = 'published'`);
  const [inquiries] = await query(
    `SELECT COUNT(*) AS count FROM inquiries WHERE status IN ('new', 'processing')`
  );

  return {
    publishedProducts: Number(products.count || 0),
    publishedVideos: Number(videos.count || 0),
    publishedBlogs: Number(blogs.count || 0),
    pendingInquiries: Number(inquiries.count || 0)
  };
}

module.exports = {
  addLog,
  listLogs,
  getDashboardSummary
};
