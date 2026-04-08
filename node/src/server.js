const { createApp } = require("./app");
const { env } = require("./config/env");
const { prepareRuntime } = require("./bootstrap/prepareRuntime");

async function startServer() {
  await prepareRuntime();

  const app = createApp();

  app.listen(env.port, env.host, () => {
    console.log(`[maxplus-backend] listening on http://${env.host}:${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("[maxplus-backend] failed to start", error);
  process.exit(1);
});
