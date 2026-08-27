#!/usr/bin/env python3

import importlib.util
import tempfile
import unittest
import sys
from unittest import mock
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "package_installers", ROOT / "scripts/package-installers.py"
)
package_installers = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = package_installers
assert SPEC.loader is not None
SPEC.loader.exec_module(package_installers)


class PackageInstallersTest(unittest.TestCase):
    def test_infers_release_metadata_and_validates_version(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release = root / "aosp-winscope-17.2.3-rc.1"
            release.mkdir()

            metadata = package_installers.infer_release_metadata(root)

        self.assertEqual(metadata.directory, release.resolve())
        self.assertEqual(metadata.version, "17.2.3-rc.1")
        self.assertEqual(package_installers.msi_numeric_version(metadata.version), "17.2.3501")

    def test_infer_release_requires_single_release_directory(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / "aosp-winscope-17.0.0").mkdir()
            (root / "aosp-winscope-17.1.0").mkdir()

            with self.assertRaisesRegex(ValueError, "exactly one"):
                package_installers.infer_release_metadata(root)

    def test_prerelease_versions_sort_before_their_stable_installers(self):
        alpha = package_installers.msi_numeric_version("17.0.0-alpha.1")
        release_candidate = package_installers.msi_numeric_version("17.0.0-rc.1")
        stable = package_installers.msi_numeric_version("17.0.0")
        self.assertLess(tuple(map(int, alpha.split("."))), tuple(map(int, release_candidate.split("."))))
        self.assertLess(tuple(map(int, release_candidate.split("."))), tuple(map(int, stable.split("."))))
        self.assertEqual(package_installers.linux_package_version("17.0.0-alpha.1"), "17.0.0~alpha.1")
        self.assertEqual(package_installers.linux_package_version("17.0.0-rc.1"), "17.0.0~rc.1")
        self.assertEqual(package_installers.linux_package_version("17.0.0"), "17.0.0")
        with self.assertRaisesRegex(ValueError, "out of range"):
            package_installers.msi_numeric_version("256.0.0")
        with self.assertRaisesRegex(ValueError, "ordinal"):
            package_installers.msi_numeric_version("17.0.0-rc.100")

    def test_target_metadata_uses_native_package_architectures(self):
        self.assertEqual(
            package_installers.targets_for_platform("darwin"),
            (
                package_installers.PackageTarget("darwin", "amd64"),
                package_installers.PackageTarget("darwin", "arm64"),
            ),
        )
        self.assertEqual(package_installers.deb_architecture("arm64"), "arm64")
        self.assertEqual(package_installers.rpm_architecture("amd64"), "x86_64")
        self.assertEqual(package_installers.windows_launcher_name("amd64"), "AOSP-WinScope.exe")

    def test_macos_staging_creates_app_wrapper_for_selected_launcher(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release_dir = self.make_release(root, "17.0.0")
            metadata = package_installers.ReleaseMetadata(release_dir, "17.0.0")
            target = package_installers.PackageTarget("darwin", "arm64")
            package_root, app = package_installers.stage_macos(metadata, target, root / "stage")

            wrapper = app / "Contents/MacOS/AOSP-WinScope"
            embedded = app / "Contents/Resources/aosp-winscope/bin/darwin-arm64/winscope-launcher"
            self.assertEqual(package_root, root / "stage/pkg-root")
            self.assertTrue(embedded.is_file())
            self.assertIn("bin/darwin-arm64/winscope-launcher", wrapper.read_text(encoding="utf-8"))
            self.assertTrue(wrapper.stat().st_mode & 0o111)
            self.assertIn("CFBundleIdentifier", (app / "Contents/Info.plist").read_text(encoding="utf-8"))
            self.assertFalse(any(path.name.startswith("._") or path.name == ".DS_Store" for path in app.rglob("*")))

    def test_linux_staging_installs_embedded_launcher_and_command(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release_dir = self.make_release(root, "17.0.0")
            metadata = package_installers.ReleaseMetadata(release_dir, "17.0.0")
            target = package_installers.PackageTarget("linux", "amd64")
            stage = package_installers.stage_linux(metadata, target, root / "stage")

            command = stage / "usr/bin/aosp-winscope"
            self.assertTrue((stage / "opt/aosp-winscope/bin/linux-amd64/winscope-launcher").is_file())
            self.assertIn("/opt/aosp-winscope/bin/linux-amd64/winscope-launcher", command.read_text(encoding="utf-8"))
            control = (stage / "DEBIAN/control").read_text(encoding="utf-8")
            self.assertIn("Architecture: amd64", control)
            rc_stage = package_installers.stage_linux(
                package_installers.ReleaseMetadata(release_dir, "17.0.0-rc.1"),
                target,
                root / "rc-stage",
            )
            self.assertIn("Version: 17.0.0~rc.1", (rc_stage / "DEBIAN/control").read_text(encoding="utf-8"))

    def test_native_tool_commands_are_argument_lists(self):
        metadata = package_installers.ReleaseMetadata(Path("/tmp/aosp-winscope-17.0.0"), "17.0.0")
        target = package_installers.PackageTarget("windows", "amd64")
        dmg = package_installers.command_for_macos_dmg(Path("/tmp/AOSP-WinScope.app"), Path("/tmp/out.dmg"))
        wix = package_installers.command_for_wix(Path("C:/stage/a.wxs"), Path("C:/out/a.msi"))
        deb = package_installers.command_for_deb(Path("/tmp/stage"), Path("/tmp/out.deb"))

        pkg = package_installers.command_for_macos_pkg(Path("/tmp/pkg-root/Applications"), metadata, Path("/tmp/out.pkg"))
        self.assertEqual(dmg[:2], ["hdiutil", "create"])
        self.assertEqual(pkg[pkg.index("--root") + 1], "/tmp/pkg-root/Applications")
        self.assertEqual(pkg[pkg.index("--install-location") + 1], "/Applications")
        self.assertEqual(wix[:4], ["wix", "build", "-arch", "x64"])
        self.assertEqual(deb[:3], ["dpkg-deb", "--build", "--root-owner-group"])
        self.assertIn("AOSP-WinScope.exe", package_installers.inno_setup_script(metadata, Path("C:/stage"), Path("C:/out.exe")))
        with tempfile.TemporaryDirectory() as temporary:
            stage = Path(temporary)
            (stage / "nested").mkdir()
            (stage / "AOSP-WinScope.exe").write_bytes(b"windows")
            (stage / "nested/file.txt").write_text("data", encoding="utf-8")
            wix_source = package_installers.wix_source(metadata, stage)
        self.assertIn('Target="[INSTALLFOLDER]AOSP-WinScope.exe"', wix_source)
        self.assertIn('StandardDirectory Id="ProgramMenuFolder"', wix_source)
        self.assertIn('Directory Id="ApplicationProgramsFolder"', wix_source)
        self.assertIn('Directory Id="Directory_nested"', wix_source)
        self.assertEqual(target.label, "windows-amd64")


    def test_ci_arguments_select_one_direct_input_target_and_formats(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release = self.make_release(root, "17.0.0")
            output = root / "installers"
            with mock.patch.object(package_installers, "host_platform", return_value="darwin"):
                result = package_installers.main([
                    "--input", str(release),
                    "--platform", "macos",
                    "--architecture", "arm64",
                    "--formats", "dmg",
                    "--output", str(output),
                    "--dry-run",
                    "--json",
                ])

            self.assertEqual(result, 0)
            self.assertTrue(output.is_dir())
            self.assertEqual(list(output.iterdir()), [])

    def test_requested_formats_rejects_platform_mismatch_and_duplicates(self):
        self.assertEqual(package_installers.requested_formats("darwin", "dmg,pkg"), ("dmg", "pkg"))
        with self.assertRaisesRegex(ValueError, "unsupported darwin"):
            package_installers.requested_formats("darwin", "msi")
        with self.assertRaisesRegex(ValueError, "duplicate"):
            package_installers.requested_formats("linux", "deb,deb")

    def test_direct_input_requires_release_directory_name(self):
        with tempfile.TemporaryDirectory() as temporary:
            invalid = Path(temporary) / "release"
            invalid.mkdir()
            with self.assertRaisesRegex(ValueError, "aosp-winscope-<version>"):
                package_installers.release_metadata_from_input(invalid)

    @staticmethod
    def make_release(root: Path, version: str) -> Path:
        release = root / f"aosp-winscope-{version}"
        (release / "web").mkdir(parents=True)
        (release / "web/index.html").write_text("<html></html>", encoding="utf-8")
        (release / "web/runtime-config.json").write_text("{}", encoding="utf-8")
        (release / "AOSP-WinScope.exe").write_bytes(b"windows")
        for operating_system, architecture in (
            ("darwin", "amd64"),
            ("darwin", "arm64"),
            ("linux", "amd64"),
            ("linux", "arm64"),
            ("windows", "amd64"),
        ):
            suffix = ".exe" if operating_system == "windows" else ""
            launcher = release / "bin" / f"{operating_system}-{architecture}" / f"winscope-launcher{suffix}"
            launcher.parent.mkdir(parents=True, exist_ok=True)
            launcher.write_bytes(b"launcher")
        return release


if __name__ == "__main__":
    unittest.main()
