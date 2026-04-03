import { watchEffect, type ComputedRef, type Ref } from "vue";
import type { SiteContent } from "../types/content";

export function useDocumentMeta(locale: Ref<SiteContent> | ComputedRef<SiteContent>) {
  watchEffect(() => {
    const content = locale.value;

    if (!content) {
      return;
    }

    document.documentElement.lang = content.meta.htmlLang;
    document.title = content.meta.title;

    const metaDescription = document.querySelector('meta[name="description"]');
    metaDescription?.setAttribute("content", content.meta.description);
  });
}
