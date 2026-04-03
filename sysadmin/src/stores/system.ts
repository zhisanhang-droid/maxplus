import { ref } from "vue";
import { defineStore } from "pinia";
import type { LogRecord } from "../types/admin";

export const useSystemStore = defineStore("system", () => {
  const logs = ref<LogRecord[]>([]);

  const hydrate = (items: LogRecord[]) => {
    logs.value = items;
  };

  return {
    logs,
    hydrate
  };
});
