import { ref } from "vue";

export function useDemoForm<T extends object>(
  createInitialState: () => T,
  getStatusMessage: () => string
) {
  const form = ref<T>(createInitialState());
  const status = ref("");

  const reset = () => {
    form.value = createInitialState();
  };

  const submit = () => {
    status.value = getStatusMessage();
    reset();
  };

  const syncStatus = () => {
    if (status.value) {
      status.value = getStatusMessage();
    }
  };

  return {
    form,
    status,
    submit,
    syncStatus
  };
}
