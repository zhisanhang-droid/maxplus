import { createApp } from "vue";
import App from "./App.vue";
import { reveal, syncRevealVisibility } from "./directives/reveal";
import { router } from "./router";
import { loadPublicData } from "./composables/usePublicData";
import "../styles-sporting.css";

async function startApp() {
  try {
    await loadPublicData();
  } catch (error) {
    console.warn("[web] failed to preload public data, using fallback content", error);
  }

  const app = createApp(App);

  app.use(router);
  app.directive("reveal", reveal);

  router.afterEach(() => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        syncRevealVisibility();
      });
    });
  });

  app.mount("#app");
}

void startApp();
