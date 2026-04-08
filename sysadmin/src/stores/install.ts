import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { fetchInstallStatus, submitInstallSetup, testInstallDatabase } from "../services/install";
import type {
  InstallDatabaseState,
  InstallSetupPayload,
  InstallSetupResult,
  InstallStatus,
  InstallTestResult
} from "../types/install";

export const useInstallStore = defineStore("install", () => {
  const status = ref<InstallStatus | null>(null);
  const loading = ref(false);
  const checked = ref(false);
  const lastError = ref<string>("");
  let pendingRequest: Promise<InstallStatus | null> | null = null;

  const isReady = computed(() => status.value?.ready === true);
  const needsInstall = computed(() => status.value?.needsInstall ?? true);

  const ensureStatus = async (force = false) => {
    if (loading.value && pendingRequest) {
      return pendingRequest;
    }

    if (checked.value && !force && status.value) {
      return status.value;
    }

    loading.value = true;
    pendingRequest = fetchInstallStatus()
      .then((result) => {
        status.value = result;
        lastError.value = "";
        checked.value = true;
        return status.value;
      })
      .catch((error) => {
        lastError.value = error instanceof Error ? error.message : "无法获取安装状态。";
        checked.value = true;
        throw error;
      })
      .finally(() => {
        loading.value = false;
        pendingRequest = null;
      });

    return pendingRequest;
  };

  const testDatabase = async (payload: InstallDatabaseState) => {
    const result = await testInstallDatabase(payload);
    await ensureStatus(true).catch(() => null);
    return result as InstallTestResult;
  };

  const submit = async (payload: InstallSetupPayload) => {
    const result = await submitInstallSetup(payload);
    status.value = result.status;
    lastError.value = "";
    checked.value = true;
    return result as InstallSetupResult;
  };

  return {
    status,
    loading,
    checked,
    lastError,
    isReady,
    needsInstall,
    ensureStatus,
    testDatabase,
    submit
  };
});
