#!/usr/bin/env python3

import hashlib
import importlib.util
import json
import os
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("release", ROOT / "scripts/release.py")
release = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(release)


class ReleaseEngineeringTest(unittest.TestCase):
    def make_inputs(self, root: Path) -> tuple[Path, Path, Path]:
        web = root / "web"
        web.mkdir()
        (web / "index.html").write_text('<base href="./">\n', encoding="utf-8")
        (web / "runtime-config.json").write_text('{"schemaVersion":1}\n', encoding="utf-8")
        (web / "main.abc.js").write_text("console.log('ok');\n", encoding="utf-8")

        launchers = root / "launchers"
        for operating_system, architecture, filename in release.LAUNCHER_TARGETS:
            path = launchers / f"{operating_system}-{architecture}" / filename
            path.parent.mkdir(parents=True)
            path.write_bytes(f"{operating_system}-{architecture}".encode())

        proxy = root / "winscope_proxy.py"
        proxy.write_text("#!/usr/bin/env python3\n", encoding="utf-8")
        return web, launchers, proxy

    def test_package_is_reproducible_and_contains_release_evidence(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            web, launchers, proxy = self.make_inputs(root)
            old_epoch = os.environ.get("SOURCE_DATE_EPOCH")
            os.environ["SOURCE_DATE_EPOCH"] = "1700000001"
            try:
                first = release.package_distribution("17.0.0", root / "first", web, launchers, proxy)
                second = release.package_distribution("17.0.0", root / "second", web, launchers, proxy)
            finally:
                if old_epoch is None:
                    os.environ.pop("SOURCE_DATE_EPOCH", None)
                else:
                    os.environ["SOURCE_DATE_EPOCH"] = old_epoch

            self.assertEqual(first["zipSha256"], second["zipSha256"])
            self.assertEqual(Path(first["zip"]).read_bytes(), Path(second["zip"]).read_bytes())
            verified = release.verify_package(Path(first["package"]))
            self.assertEqual(verified["filesVerified"], first["files"])
            verified_zip = release.verify_package(Path(first["zip"]))
            self.assertEqual(verified_zip["zipSha256"], first["zipSha256"])

            package = Path(first["package"])
            self.assertTrue((package / "LICENSES/sbom.spdx.json").is_file())
            self.assertTrue((package / "dependency-bundle/dependencies.lock.json").is_file())
            self.assertEqual(
                len(json.loads((package / "LICENSES/sbom.spdx.json").read_text())["packages"]),
                len(json.loads((ROOT / "build/dependencies.lock.json").read_text())["dependencies"]),
            )
            self.assertEqual(
                hashlib.sha256(Path(first["zip"]).read_bytes()).hexdigest(), first["zipSha256"]
            )

    def test_package_rejects_missing_launcher(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            web, launchers, proxy = self.make_inputs(root)
            (launchers / "linux-amd64/winscope-launcher").unlink()
            with self.assertRaisesRegex(ValueError, "missing launcher"):
                release.package_distribution("17.0.0", root / "release", web, launchers, proxy)


if __name__ == "__main__":
    unittest.main()
