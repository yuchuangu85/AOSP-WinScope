"use strict";

const path = require("node:path");
let gateway;
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  const forced = setTimeout(() => process.exit(1), 9000);
  forced.unref();
  try {
    await gateway?.close();
    process.exit(0);
  } catch {
    process.exit(1);
  }
}
process.parentPort.on("message", (event) => {
  if (event.data?.type === "shutdown") void stop();
});
process.on("SIGTERM", () => void stop());
process.on("SIGINT", () => void stop());
(async () => {
  const root = process.argv[2];
  const { AiGateway } = require(path.join(root, "gateway.js"));
  const { loadRuntime } = require(path.join(root, "config.js"));
  gateway = new AiGateway(await loadRuntime(process.env.WINSCOPE_AI_CONFIG));
  await gateway.listen(0);
  process.parentPort.postMessage({
    type: "ready",
    port: gateway.server.address().port,
  });
})().catch(() => {
  process.parentPort.postMessage({ type: "error" });
  process.exit(1);
});
