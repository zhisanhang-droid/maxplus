const { assert } = require("./errors");

function sanitizeString(value, options = {}) {
  const { max = 255, defaultValue = "" } = options;

  if (typeof value !== "string") {
    return defaultValue;
  }

  return value.trim().slice(0, max);
}

function sanitizeText(value, options = {}) {
  const { max = 5000, defaultValue = "" } = options;

  if (typeof value !== "string") {
    return defaultValue;
  }

  return value.trim().slice(0, max);
}

function sanitizeEmail(value, required = true) {
  const email = sanitizeString(value, { max: 160 });
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    assert(!required, 400, "邮箱不能为空。");
    return "";
  }

  assert(pattern.test(email), 400, "邮箱格式不正确。");
  return email.toLowerCase();
}

function maskEmail(email) {
  const [account, domain = ""] = String(email).split("@");

  if (!account) {
    return "";
  }

  if (account.length === 1) {
    return `${account}***@${domain}`;
  }

  return `${account.slice(0, 2)}***@${domain}`;
}

function normalizeBoolean(value, defaultValue = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true" || value === "1" || value === 1) {
    return true;
  }

  if (value === "false" || value === "0" || value === 0) {
    return false;
  }

  return defaultValue;
}

function normalizeNumber(value, options = {}) {
  const { min = 0, max = Number.MAX_SAFE_INTEGER, defaultValue = 0 } = options;
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return defaultValue;
  }

  if (parsed < min) {
    return min;
  }

  if (parsed > max) {
    return max;
  }

  return parsed;
}

function normalizeInteger(value, options = {}) {
  return Math.round(normalizeNumber(value, options));
}

function normalizeStringArray(value, options = {}) {
  const { maxItems = 20, maxItemLength = 120 } = options;

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => sanitizeString(item, { max: maxItemLength }))
    .filter(Boolean)
    .slice(0, maxItems);
}

function normalizeEnum(value, allowedValues, defaultValue) {
  return allowedValues.includes(value) ? value : defaultValue;
}

function slugify(value, fallback = "") {
  const normalized = sanitizeString(value, { max: 180 })
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || fallback;
}

function ensureId(value, prefix) {
  const cleaned = sanitizeString(value, { max: 60 });
  return cleaned || `${prefix}-${Date.now()}`;
}

module.exports = {
  sanitizeString,
  sanitizeText,
  sanitizeEmail,
  maskEmail,
  normalizeBoolean,
  normalizeNumber,
  normalizeInteger,
  normalizeStringArray,
  normalizeEnum,
  slugify,
  ensureId
};
