import type { Pinia } from "pinia";
import { useCatalogStore } from "../stores/catalog";
import { useCrmStore } from "../stores/crm";
import { useSessionStore } from "../stores/session";
import { useSettingsStore } from "../stores/settings";
import { useSystemStore } from "../stores/system";
import type { AdminBootstrapPayload } from "../types/admin";
import { apiPost } from "./http";

export async function bootstrapAdminData(pinia?: Pinia) {
  const sessionStore = useSessionStore(pinia);

  if (!sessionStore.token) {
    return null;
  }

  const data = await apiPost<AdminBootstrapPayload>("/admin/bootstrap", {}, { token: sessionStore.token });

  sessionStore.setSession(data.session);
  useCatalogStore(pinia).hydrate(data);
  useCrmStore(pinia).hydrate(data);
  useSettingsStore(pinia).hydrate(data);
  useSystemStore(pinia).hydrate(data.logs);

  return data;
}
