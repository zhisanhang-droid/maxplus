const { HttpError } = require("../utils/errors");
const { fail } = require("../utils/response");

function notFoundHandler(req, res) {
  return fail(res, 404, "接口不存在。");
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof HttpError) {
    return fail(res, error.status, error.message, error.details, error.code);
  }

  if (error?.code === "CORS_NOT_ALLOWED") {
    return fail(
      res,
      Number(error.status || 403),
      error.message || "跨域来源不被允许。",
      error.details || null,
      "CORS_NOT_ALLOWED"
    );
  }

  if (error instanceof SyntaxError && "body" in error) {
    return fail(
      res,
      400,
      "请求体 JSON 格式错误。",
      {
        reason: error.message
      },
      "INVALID_JSON"
    );
  }

  console.error("[api-error]", error);
  return fail(
    res,
    500,
    "服务器内部错误。",
    {
      reason: error?.message || "Unknown error"
    },
    "INTERNAL_SERVER_ERROR"
  );
}

module.exports = {
  notFoundHandler,
  errorHandler
};
