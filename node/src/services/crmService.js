const { query } = require("../config/database");
const { decryptField, encryptField } = require("../security/hybridCrypto");
const {
  sanitizeString,
  sanitizeText,
  sanitizeEmail,
  maskEmail,
  normalizeEnum,
  ensureId
} = require("../utils/normalizers");
const { HttpError } = require("../utils/errors");

function mapInquiry(row) {
  return {
    id: row.id,
    source: row.source,
    customer: row.customer,
    email: decryptField(row.email_cipher),
    company: row.company,
    status: row.status,
    assignee: row.assignee,
    sourceDetail: row.source_detail,
    message: decryptField(row.message_cipher),
    createdAt: row.created_at
  };
}

function mapSubscriber(row) {
  return {
    id: row.id,
    email: decryptField(row.email_cipher),
    source: row.source,
    orderNumber: decryptField(row.order_number_cipher),
    createdAt: row.created_at
  };
}

async function listInquiries() {
  const rows = await query(
    `SELECT
       id,
       source,
       customer,
       email_cipher,
       company,
       status,
       assignee,
       source_detail,
       message_cipher,
       DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
     FROM inquiries
     ORDER BY created_at DESC`
  );

  return rows.map(mapInquiry);
}

async function updateInquiry(input) {
  const id = sanitizeString(input.id, { max: 40 });
  const status = normalizeEnum(input.status, ["new", "processing", "closed"], "new");
  const assignee = sanitizeString(input.assignee, {
    max: 120,
    defaultValue: "Unassigned"
  });

  if (!id) {
    throw new HttpError(400, "询盘 ID 不能为空。");
  }

  await query(`UPDATE inquiries SET status = ?, assignee = ? WHERE id = ?`, [
    status,
    assignee,
    id
  ]);

  const rows = await query(
    `SELECT
       id,
       source,
       customer,
       email_cipher,
       company,
       status,
       assignee,
       source_detail,
       message_cipher,
       DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
     FROM inquiries
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] ? mapInquiry(rows[0]) : null;
}

async function createInquiry(input) {
  const email = sanitizeEmail(input.email);
  const payload = {
    id: ensureId(input.id, "inq"),
    source: normalizeEnum(input.source, ["product", "contact", "wholesale"], "contact"),
    customer: sanitizeString(input.customer || input.name, { max: 120 }),
    email,
    company: sanitizeString(input.company, {
      max: 160,
      defaultValue: sanitizeString(input.interest, { max: 160 })
    }),
    status: "new",
    assignee: "Unassigned",
    sourceDetail: sanitizeString(input.sourceDetail, {
      max: 200,
      defaultValue: sanitizeString(input.interest, { max: 120 })
    }),
    message: sanitizeText(input.message, { max: 5000 })
  };

  if (!payload.customer || !payload.message) {
    throw new HttpError(400, "姓名、邮箱、留言为必填项。");
  }

  await query(
    `INSERT INTO inquiries (
       id,
       source,
       customer,
       email_cipher,
       email_mask,
       company,
       status,
       assignee,
       source_detail,
       message_cipher
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.id,
      payload.source,
      payload.customer,
      encryptField(payload.email),
      maskEmail(payload.email),
      payload.company || "Unknown",
      payload.status,
      payload.assignee,
      payload.sourceDetail || "",
      encryptField(payload.message)
    ]
  );

  return payload;
}

async function listSubscribers() {
  const rows = await query(
    `SELECT
       id,
       email_cipher,
       source,
       order_number_cipher,
       DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
     FROM subscribers
     ORDER BY created_at DESC`
  );

  return rows.map(mapSubscriber);
}

async function createSubscriber(input) {
  const email = sanitizeEmail(input.email);
  const orderNumber = sanitizeString(input.orderNumber, { max: 120 });
  const source = sanitizeString(input.source, {
    max: 120,
    defaultValue: "订阅弹窗"
  });

  if (!orderNumber) {
    throw new HttpError(400, "订单号不能为空。");
  }

  const payload = {
    id: ensureId(input.id, "sub"),
    email,
    source,
    orderNumber
  };

  await query(
    `INSERT INTO subscribers (id, email_cipher, email_mask, source, order_number_cipher)
     VALUES (?, ?, ?, ?, ?)`,
    [
      payload.id,
      encryptField(payload.email),
      maskEmail(payload.email),
      payload.source,
      encryptField(payload.orderNumber)
    ]
  );

  return payload;
}

module.exports = {
  listInquiries,
  updateInquiry,
  createInquiry,
  listSubscribers,
  createSubscriber
};
