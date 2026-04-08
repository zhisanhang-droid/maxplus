import { apiPost } from "./http";
import type { AdminPasswordRecoveryPayload } from "../types/admin";

interface RecoveryResult {
  username: string;
  role: string;
}

export function resetAdminPassword(payload: AdminPasswordRecoveryPayload) {
  return apiPost<RecoveryResult>("/auth/recovery/reset", payload, {
    secure: true
  });
}
