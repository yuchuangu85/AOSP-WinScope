"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const { PassThrough } = require("node:stream");
const {
  waitForLauncher,
  waitForGateway,
  stopLauncher,
  stopGateway,
} = require("./services.cjs");

test("launcher readiness handles split output and rejects early exit", async () => {
  const child = new EventEmitter();
  child.stdout = new PassThrough();
  const ready = waitForLauncher(child, 100);
  child.stdout.write("Winscope is available at http://127.");
  child.stdout.write("0.0.1:1234/\n");
  assert.equal(await ready, "http://127.0.0.1:1234");
  const failed = waitForLauncher(child, 100);
  child.emit("exit", 2);
  await assert.rejects(failed, /before startup/);
});

test("launcher readiness rejects unbounded output, invalid origin and timeout", async () => {
  for (const text of [
    "x".repeat(8193),
    "Winscope is available at https://evil.test/\n",
  ]) {
    const child = new EventEmitter();
    child.stdout = new PassThrough();
    const ready = waitForLauncher(child, 100);
    child.stdout.write(text);
    await assert.rejects(ready);
  }
  const child = new EventEmitter();
  child.stdout = new PassThrough();
  await assert.rejects(waitForLauncher(child, 5), /timed out/);
});

test("gateway readiness accepts only an assigned local port", async () => {
  const child = new EventEmitter();
  const ready = waitForGateway(child, 100);
  child.emit("message", { type: "ready", port: 7341 });
  assert.equal(await ready, "http://127.0.0.1:7341");
  for (const port of [0, 65536, "7341", 1.5]) {
    const result = waitForGateway(child, 100);
    child.emit("message", { type: "ready", port });
    await assert.rejects(result, /Invalid/);
  }
});

test("owned launcher shutdown closes its pipe rather than killing a process tree", async () => {
  const child = new EventEmitter();
  child.exitCode = null;
  child.signalCode = null;
  child.pid = 1;
  child.stdin = { end: () => setImmediate(() => child.emit("exit", 0)) };
  child.kill = () => assert.fail("graceful shutdown should not kill");
  await stopLauncher(child);
});

test("gateway shutdown uses a narrow owned message", async () => {
  const child = new EventEmitter();
  child.pid = 1;
  child.postMessage = (value) => {
    assert.deepEqual(value, { type: "shutdown" });
    setImmediate(() => child.emit("exit", 0));
  };
  await stopGateway(child);
});

test("failed termination has a hard bounded deadline", async () => {
  const child = new EventEmitter();
  child.pid = 123;
  child.exitCode = null;
  child.signalCode = null;
  child.stdin = { end() {} };
  let forced = false;
  await assert.rejects(
    stopLauncher(child, {
      graceMs: 1,
      forceMs: 5,
      forceKill: () => {
        forced = true;
      },
    }),
    /did not exit after forced termination/,
  );
  assert.equal(forced, true);
  assert.equal(child.listenerCount("exit"), 0);
});

test("forced gateway termination still waits for the owned exit event", async () => {
  const child = new EventEmitter();
  child.pid = 123;
  child.postMessage = () => {};
  let forced = false;
  await stopGateway(child, {
    graceMs: 1,
    forceMs: 100,
    forceKill: () => {
      forced = true;
      setImmediate(() => child.emit("exit", 0));
    },
  });
  assert.equal(forced, true);
});
