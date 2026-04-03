const { createApp } = require("./app");
const { env } = require("./config/env");
const { initializeDatabase } = require("./bootstrap/initDatabase");

async function startServer() {
  await initializeDatabase();

  const app = createApp();

  app.listen(env.port, env.host, () => {
    console.log(`[maxplus-backend] listening on http://${env.host}:${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("[maxplus-backend] failed to start", error);
  process.exit(1);
});
