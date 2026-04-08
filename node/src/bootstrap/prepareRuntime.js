const { initializeDatabase } = require("./initDatabase");
const { env } = require("../config/env");
const { resetPool } = require("../config/database");
const {
  getRuntimeState,
  markInstallRequired,
  markRuntimeReady,
  markRuntimeError
} = require("../config/runtime");

function buildErrorDetails(error) {
  return {
    reason: error?.message || "Unknown error",
    code: error?.code || null
  };
}

async function prepareRuntime(options = {}) {
  await resetPool();

  if (!env.appInstalled) {
    markInstallRequired("系统尚未完成安装，请先访问 /install 完成数据库和管理员配置。");
    return getRuntimeState();
  }

  try {
    await initializeDatabase(options);
    markRuntimeReady();
  } catch (error) {
    markRuntimeError("数据库初始化失败，请检查安装配置后重新安装。", buildErrorDetails(error));
  }

  return getRuntimeState();
}

module.exports = {
  prepareRuntime
};
