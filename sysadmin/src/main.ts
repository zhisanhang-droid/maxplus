import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { installElement } from "./plugins/element";
import { router } from "./router";
import { bootstrapAdminData } from "./services/bootstrap";
import { useSessionStore } from "./stores/session";
import "./styles/index.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
installElement(app);

async function start() {
  const sessionStore = useSessionStore(pinia);

  if (sessionStore.token) {
    try {
      await bootstrapAdminData(pinia);
    } catch {
      sessionStore.logout();
    }
  }

  app.mount("#app");
}

void start();
