import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("..", import.meta.url));
const child = spawn(
  require("electron"),
  [fileURLToPath(new URL("./app", import.meta.url))],
  {
    cwd: root,
    stdio: "inherit",
    windowsHide: false,
  },
);
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
