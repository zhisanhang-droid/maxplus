const runtimeState = {
  mode: "install",
  message: "系统尚未完成安装，请先访问 /install 完成部署配置。",
  details: null,
  updatedAt: new Date().toISOString()
};

function setRuntimeState(mode, message, details = null) {
  runtimeState.mode = mode;
  runtimeState.message = message;
  runtimeState.details = details;
  runtimeState.updatedAt = new Date().toISOString();
}

function markInstallRequired(message, details = null) {
  setRuntimeState("install", message, details);
}

function markRuntimeReady(message = "系统已就绪。", details = null) {
  setRuntimeState("ready", message, details);
}

function markRuntimeError(message, details = null) {
  setRuntimeState("error", message, details);
}

function getRuntimeState() {
  return {
    ...runtimeState,
    ready: runtimeState.mode === "ready",
    needsInstall: runtimeState.mode !== "ready"
  };
}

function isRuntimeReady() {
  return runtimeState.mode === "ready";
}

module.exports = {
  getRuntimeState,
  isRuntimeReady,
  markInstallRequired,
  markRuntimeReady,
  markRuntimeError
};
