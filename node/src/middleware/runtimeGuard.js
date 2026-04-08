const { getRuntimeState, isRuntimeReady } = require("../config/runtime");
const { fail } = require("../utils/response");

function requireRuntimeReady(req, res, next) {
  if (isRuntimeReady()) {
    return next();
  }

  const runtimeState = getRuntimeState();
  const errorCode = runtimeState.mode === "install" ? "INSTALL_REQUIRED" : "BACKEND_NOT_READY";

  return fail(res, 503, runtimeState.message, runtimeState, errorCode);
}

module.exports = {
  requireRuntimeReady
};
