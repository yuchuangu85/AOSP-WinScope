#!/usr/bin/env python3
"""Cross-compile the standard-library Winscope launchers with CGO disabled."""

# Copyright (C) 2026 The Android Open Source Project
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.

from __future__ import annotations

import argparse
import os
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TARGETS = (
    ("windows", "amd64"),
    ("windows", "arm64"),
    ("darwin", "amd64"),
    ("darwin", "arm64"),
    ("linux", "amd64"),
    ("linux", "arm64"),
)


def main() -> int:
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument(
      "--output",
      type=Path,
      default=ROOT / "dist" / "launchers",
      help="directory receiving target-specific launcher binaries",
  )
  args = parser.parse_args()
  output = args.output.resolve()
  for operating_system, architecture in TARGETS:
    suffix = ".exe" if operating_system == "windows" else ""
    target = output / f"{operating_system}-{architecture}" / f"winscope-launcher{suffix}"
    target.parent.mkdir(parents=True, exist_ok=True)
    environment = os.environ | {
        "CGO_ENABLED": "0",
        "GOOS": operating_system,
        "GOARCH": architecture,
    }
    subprocess.run(
        ["go", "build", "-trimpath", "-o", str(target), "./cmd/launcher"],
        cwd=ROOT,
        env=environment,
        check=True,
    )
  return 0


if __name__ == "__main__":
  raise SystemExit(main())
