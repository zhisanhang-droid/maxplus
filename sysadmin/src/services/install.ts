import { apiPost } from "./http";
import type {
  InstallDatabaseState,
  InstallSetupPayload,
  InstallSetupResult,
  InstallStatus,
  InstallTestResult
} from "../types/install";

export function fetchInstallStatus() {
  return apiPost<InstallStatus>("/install/status", {});
}

export function testInstallDatabase(payload: InstallDatabaseState) {
  return apiPost<InstallTestResult>("/install/database/test", {
    database: payload
  });
}

export function submitInstallSetup(payload: InstallSetupPayload) {
  return apiPost<InstallSetupResult>("/install/setup", payload);
}
