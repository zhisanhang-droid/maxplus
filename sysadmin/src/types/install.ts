export type InstallRuntimeMode = "install" | "ready" | "error";

export interface InstallDatabaseState {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  passwordConfigured?: boolean;
}

export interface InstallAdminState {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface InstallStatus {
  mode: InstallRuntimeMode;
  ready: boolean;
  needsInstall: boolean;
  installed: boolean;
  message: string;
  updatedAt: string;
  details: {
    reason?: string | null;
    code?: string | null;
  } | null;
  database: Omit<InstallDatabaseState, "password"> & {
    passwordConfigured: boolean;
  };
}

export interface InstallTestResult {
  connected: boolean;
  message: string;
}

export interface InstallSetupPayload {
  database: InstallDatabaseState;
  admin: InstallAdminState;
}

export interface InstallSetupResult {
  status: InstallStatus;
  loginPath: string;
}
