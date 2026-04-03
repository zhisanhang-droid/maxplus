import { watchEffect, type MaybeRefOrGetter, toValue } from "vue";

interface PageMetaInput {
  title: string;
  description: string;
}

export function usePageMeta(meta: MaybeRefOrGetter<PageMetaInput | null | undefined>) {
  watchEffect(() => {
    const value = toValue(meta);

    if (!value) {
      return;
    }

    document.title = value.title;

    const metaDescription = document.querySelector('meta[name="description"]');
    metaDescription?.setAttribute("content", value.description);
  });
}
