import type { Directive } from "vue";

const observers = new WeakMap<HTMLElement, IntersectionObserver>();

export const reveal: Directive<HTMLElement> = {
  mounted(el) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );

    observer.observe(el);
    observers.set(el, observer);
  },
  unmounted(el) {
    const observer = observers.get(el);

    if (observer) {
      observer.disconnect();
      observers.delete(el);
    }
  }
};
