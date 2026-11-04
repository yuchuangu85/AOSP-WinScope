"use strict";

const definitions = [
  {
    platform: "darwin",
    arch: "x64",
    goos: "darwin",
    goarch: "amd64",
    archive: "darwin",
    suffix: "",
    runner: "macos-26-intel",
    captureArch: "x64",
    adbArch: "universal",
    formats: ["dmg", "pkg"],
  },
  {
    platform: "darwin",
    arch: "arm64",
    goos: "darwin",
    goarch: "arm64",
    archive: "darwin",
    suffix: "",
    runner: "macos-26",
    captureArch: "arm64",
    adbArch: "universal",
    formats: ["dmg", "pkg"],
  },
  {
    platform: "win32",
    arch: "x64",
    goos: "windows",
    goarch: "amd64",
    archive: "windows",
    suffix: ".exe",
    runner: "windows-2025",
    captureArch: "x64",
    adbArch: "ia32",
    formats: ["exe", "msi"],
  },
  {
    platform: "linux",
    arch: "x64",
    goos: "linux",
    goarch: "amd64",
    archive: "linux",
    suffix: "",
    runner: "ubuntu-22.04",
    captureArch: "x64",
    adbArch: "x64",
    formats: ["deb", "rpm"],
  },
  {
    platform: "linux",
    arch: "arm64",
    goos: "linux",
    goarch: "arm64",
    archive: null,
    suffix: "",
    runner: "ubuntu-24.04-arm",
    captureArch: "arm64",
    adbArch: "arm64",
    adbSource: "ubuntu-24.04",
    formats: ["deb", "rpm"],
  },
];

const targets = Object.freeze(
  definitions.map((value) =>
    Object.freeze({
      ...value,
      key: `${value.platform}-${value.arch}`,
      formats: Object.freeze(value.formats),
    }),
  ),
);

function targetFor(platform = process.platform, arch = process.arch) {
  const target = targets.find(
    (value) => value.platform === platform && value.arch === arch,
  );
  if (!target)
    throw new Error(`Unsupported native runtime target: ${platform}-${arch}`);
  return target;
}

function matrix() {
  return {
    include: targets.map((value) => ({
      platform: value.platform,
      arch: value.arch,
      runner: value.runner,
      python: value.captureArch,
      target: value.key,
    })),
  };
}

module.exports = { targets, targetFor, matrix };
