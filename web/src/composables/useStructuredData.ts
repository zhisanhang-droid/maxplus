import { onBeforeUnmount, watchEffect, type MaybeRefOrGetter, toValue } from "vue";

export function useStructuredData(data: MaybeRefOrGetter<Record<string, unknown> | null | undefined>) {
  let scriptElement: HTMLScriptElement | null = null;

  const removeScript = () => {
    if (scriptElement?.parentNode) {
      scriptElement.parentNode.removeChild(scriptElement);
    }

    scriptElement = null;
  };

  watchEffect(() => {
    const value = toValue(data);

    removeScript();

    if (!value) {
      return;
    }

    scriptElement = document.createElement("script");
    scriptElement.type = "application/ld+json";
    scriptElement.textContent = JSON.stringify(value);
    document.head.appendChild(scriptElement);
  });

  onBeforeUnmount(() => {
    removeScript();
  });
}
