import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { AdminRole, AdminSession } from "../types/admin";
import { readStorage, removeStorage, writeStorage } from "../utils/storage";
import { apiPost } from "../services/http";

const SESSION_KEY = "maxplus-sysadmin-session";
const TOKEN_KEY = "maxplus-sysadmin-token";

interface LoginPayload {
  token: string;
  session: AdminSession;
}

export const useSessionStore = defineStore("session", () => {
  const session = ref<AdminSession | null>(readStorage<AdminSession | null>(SESSION_KEY, null));
  const token = ref<string | null>(readStorage<string | null>(TOKEN_KEY, null));

  const isAuthenticated = computed(() => Boolean(session.value && token.value));

  const setSession = (value: AdminSession | null) => {
    session.value = value;

    if (value) {
      writeStorage(SESSION_KEY, value);
      return;
    }

    removeStorage(SESSION_KEY);
  };

  const setToken = (value: string | null) => {
    token.value = value;

    if (value) {
      writeStorage(TOKEN_KEY, value);
      return;
    }

    removeStorage(TOKEN_KEY);
  };

  const setAuth = (payload: LoginPayload) => {
    setToken(payload.token);
    setSession(payload.session);
  };

  const login = async (username: string, password: string, role: AdminRole) => {
    const result = await apiPost<LoginPayload>(
      "/auth/login",
      {
        username,
        password,
        role
      },
      {
        secure: true
      }
    );

    setAuth(result);
    return result;
  };

  const logout = () => {
    setToken(null);
    setSession(null);
  };

  return {
    session,
    token,
    isAuthenticated,
    setSession,
    setAuth,
    login,
    logout
  };
});
