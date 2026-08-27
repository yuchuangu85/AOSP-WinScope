#!/usr/bin/env python3
"""Package an existing universal AOSP-WinScope release with host-native tools.

Run this script on the host that owns the native packaging toolchain. It packages
one explicitly requested target architecture and format set from one universal release directory:

* macOS: ``hdiutil`` and ``pkgbuild`` create DMG and PKG files for amd64/arm64.
* Windows: Inno Setup (``iscc``/``ISCC.exe``) and WiX (``wix``) create x64 EXE/MSI.
* Linux: ``dpkg-deb`` and ``rpmbuild`` create DEB/RPM files for amd64/arm64.

The input directory must be ``dist/release/aosp-winscope-<version>`` and must
already contain the embedded launchers produced by ``scripts/build-launchers.py``.
"""

from __future__ import annotations

import argparse
import dataclasses
import json
import os
import platform
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
import uuid
from pathlib import Path
from typing import Iterable, Sequence

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT_ROOT = ROOT / "dist" / "installers"
PRODUCT_NAME = "AOSP-WinScope"
PRODUCT_ID = "com.android.aosp-winscope"
LINUX_INSTALL_ROOT = Path("/opt/aosp-winscope")
LINUX_COMMAND = "aosp-winscope"
MACOS_ARCHITECTURES = ("amd64", "arm64")
LINUX_ARCHITECTURES = ("amd64", "arm64")
WINDOWS_ARCHITECTURES = ("amd64",)
VERSION_PATTERN = re.compile(
    r"^(?P<major>0|[1-9]\d*)\.(?P<minor>0|[1-9]\d*)\.(?P<patch>0|[1-9]\d*)"
    r"(?:-(?P<channel>alpha|beta|rc)\.(?P<ordinal>[1-9]\d*))?"
    r"(?:\+(?P<build>[0-9A-Za-z.-]+))?$"
)


@dataclasses.dataclass(frozen=True)
class PackageTarget:
    operating_system: str
    architecture: str

    @property
    def label(self) -> str:
        return f"{self.operating_system}-{self.architecture}"


@dataclasses.dataclass(frozen=True)
class ReleaseMetadata:
    directory: Path
    version: str


def host_platform(system: str | None = None) -> str:
    """Return the supported packaging platform corresponding to *system*."""
    value = (system or platform.system()).lower()
    aliases = {"darwin": "darwin", "windows": "windows", "linux": "linux"}
    try:
        return aliases[value]
    except KeyError as error:
        raise ValueError(f"unsupported packaging host: {system or platform.system()}") from error


def targets_for_platform(operating_system: str) -> tuple[PackageTarget, ...]:
    architectures = {
        "darwin": MACOS_ARCHITECTURES,
        "windows": WINDOWS_ARCHITECTURES,
        "linux": LINUX_ARCHITECTURES,
    }.get(operating_system)
    if architectures is None:
        raise ValueError(f"unsupported packaging platform: {operating_system}")
    return tuple(PackageTarget(operating_system, architecture) for architecture in architectures)


def infer_release_metadata(release_root: Path, version: str | None = None) -> ReleaseMetadata:
    """Locate one release directory and validate its ``aosp-winscope-<version>`` name."""
    release_root = release_root.resolve()
    if version is not None:
        candidates = [release_root / f"aosp-winscope-{version}"]
    else:
        candidates = sorted(
            path for path in release_root.glob("aosp-winscope-*") if path.is_dir()
        )
    if len(candidates) != 1:
        description = "none" if not candidates else ", ".join(str(path) for path in candidates)
        raise ValueError(
            "expected exactly one release directory named aosp-winscope-<version>; found "
            f"{description}"
        )
    directory = candidates[0]
    prefix = "aosp-winscope-"
    if not directory.name.startswith(prefix):
        raise ValueError(f"invalid release directory name: {directory.name}")
    inferred_version = directory.name.removeprefix(prefix)
    validate_version(inferred_version)
    return ReleaseMetadata(directory=directory, version=inferred_version)


def validate_version(version: str) -> None:
    if not VERSION_PATTERN.fullmatch(version):
        raise ValueError(f"unsupported release version: {version!r}")


def parsed_version(version: str) -> re.Match[str]:
    match = VERSION_PATTERN.fullmatch(version)
    if match is None:
        raise ValueError(f"unsupported release version: {version!r}")
    return match


def msi_numeric_version(version: str) -> str:
    """Map supported prereleases below their final Windows Installer version."""
    match = parsed_version(version)
    major = int(match["major"])
    minor = int(match["minor"])
    patch = int(match["patch"])
    if major > 255 or minor > 255 or patch > 64:
        raise ValueError(f"MSI version fields are out of range: {version!r}")
    channel = match["channel"]
    if channel is None:
        revision = patch * 1000 + 999
    else:
        ordinal = int(match["ordinal"])
        if ordinal > 99:
            raise ValueError(f"MSI prerelease ordinal must be at most 99: {version!r}")
        revision = patch * 1000 + {"alpha": 100, "beta": 300, "rc": 500}[channel] + ordinal
    return f"{major}.{minor}.{revision}"


def linux_package_version(version: str) -> str:
    """Use the Debian/RPM tilde operator so prereleases upgrade to stable releases."""
    match = parsed_version(version)
    base = ".".join(match[name] for name in ("major", "minor", "patch"))
    channel = match["channel"]
    return base if channel is None else f"{base}~{channel}.{match['ordinal']}"


def deb_architecture(architecture: str) -> str:
    return {"amd64": "amd64", "arm64": "arm64"}[architecture]


def rpm_architecture(architecture: str) -> str:
    return {"amd64": "x86_64", "arm64": "aarch64"}[architecture]


def windows_launcher_name(architecture: str) -> str:
    if architecture != "amd64":
        raise ValueError(f"Windows installer is only supported for amd64, not {architecture}")
    return "AOSP-WinScope.exe"


def embedded_launcher_relative_path(target: PackageTarget) -> Path:
    filename = "winscope-launcher.exe" if target.operating_system == "windows" else "winscope-launcher"
    return Path("bin") / target.label / filename


def validate_release_tree(release: ReleaseMetadata, targets: Iterable[PackageTarget]) -> None:
    required = [release.directory / embedded_launcher_relative_path(target) for target in targets]
    required.extend(
        [
            release.directory / "web" / "index.html",
            release.directory / "web" / "runtime-config.json",
        ]
    )
    for path in required:
        if not path.is_file():
            raise ValueError(f"release directory is missing required file: {path}")
    if any(target.operating_system == "windows" for target in targets):
        root_launcher = release.directory / windows_launcher_name("amd64")
        if not root_launcher.is_file():
            raise ValueError(f"release directory is missing required Windows launcher: {root_launcher}")


def release_metadata_from_input(directory: Path) -> ReleaseMetadata:
    """Validate a direct ``aosp-winscope-<version>`` release directory input."""
    directory = directory.resolve()
    if not directory.is_dir():
        raise ValueError(f"release input directory does not exist: {directory}")
    prefix = "aosp-winscope-"
    if not directory.name.startswith(prefix):
        raise ValueError(f"release input must be named aosp-winscope-<version>: {directory}")
    version = directory.name.removeprefix(prefix)
    validate_version(version)
    return ReleaseMetadata(directory=directory, version=version)


def artifact_path(output_root: Path, metadata: ReleaseMetadata, target: PackageTarget, extension: str) -> Path:
    return output_root.resolve() / f"aosp-winscope-{metadata.version}-{target.label}.{extension}"


def normalize_platform(value: str) -> str:
    return {"macos": "darwin", "darwin": "darwin", "windows": "windows", "linux": "linux"}[value]


def requested_formats(operating_system: str, formats: str) -> tuple[str, ...]:
    allowed = {
        "darwin": ("dmg", "pkg"),
        "windows": ("exe", "msi"),
        "linux": ("deb", "rpm"),
    }[operating_system]
    values = tuple(item.strip().lower() for item in formats.split(",") if item.strip())
    if not values:
        raise ValueError("--formats must contain at least one format")
    if len(values) != len(set(values)):
        raise ValueError("--formats must not contain duplicate formats")
    unsupported = [value for value in values if value not in allowed]
    if unsupported:
        raise ValueError(
            f"unsupported {operating_system} installer format(s): {', '.join(unsupported)}; "
            f"expected one or more of {', '.join(allowed)}"
        )
    return values


def macos_app_launcher_script(target: PackageTarget) -> str:
    launcher = Path("$APP_ROOT") / "bin" / target.label / "winscope-launcher"
    return "#!/bin/sh\nset -eu\nAPP_ROOT=$(CDPATH= cd -- \"$(dirname -- \"$0\")/../Resources/aosp-winscope\" && pwd)\nexec \"{}\" \"$@\"\n".format(launcher)


def macos_info_plist(version: str) -> str:
    return f"""<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">
<plist version=\"1.0\"><dict>
  <key>CFBundleExecutable</key><string>AOSP-WinScope</string>
  <key>CFBundleIdentifier</key><string>{PRODUCT_ID}</string>
  <key>CFBundleName</key><string>{PRODUCT_NAME}</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleShortVersionString</key><string>{version}</string>
  <key>CFBundleVersion</key><string>{version}</string>
</dict></plist>
"""


def linux_command_script(target: PackageTarget) -> str:
    launcher = LINUX_INSTALL_ROOT / "bin" / target.label / "winscope-launcher"
    return f"#!/bin/sh\nset -eu\nexec {launcher} \"$@\"\n"


def inno_setup_script(metadata: ReleaseMetadata, stage: Path, output: Path) -> str:
    source = windows_path(stage)
    return f"""[Setup]
AppId={{{windows_upgrade_code()}}}
AppName={PRODUCT_NAME}
AppVersion={metadata.version}
DefaultDirName={{autopf}}\\{PRODUCT_NAME}
DefaultGroupName={PRODUCT_NAME}
DisableProgramGroupPage=yes
OutputDir={windows_path(output.parent)}
OutputBaseFilename={output.stem}
Compression=lzma2
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64

[Files]
Source: \"{source}\\*\"; DestDir: \"{{app}}\"; Flags: recursesubdirs ignoreversion

[Icons]
Name: \"{{autoprograms}}\\{PRODUCT_NAME}\"; Filename: \"{{app}}\\AOSP-WinScope.exe\"

[Run]
Filename: \"{{app}}\\AOSP-WinScope.exe\"; Description: \"Launch {PRODUCT_NAME}\"; Flags: nowait postinstall skipifsilent
"""


def wix_source(metadata: ReleaseMetadata, stage: Path) -> str:
    """Create WiX v4 XML that preserves the staged release directory layout."""
    component_index = 0

    def directory_id(relative: Path) -> str:
        if relative == Path("."):
            return "INSTALLFOLDER"
        return "Directory_" + "_".join(
            re.sub(r"[^A-Za-z0-9_]", "_", part) for part in relative.parts
        )

    def render_directory(relative: Path, indent: str) -> tuple[str, list[str]]:
        nonlocal component_index
        source_directory = stage / relative
        lines: list[str] = []
        component_refs: list[str] = []
        for child in sorted(source_directory.iterdir(), key=lambda path: path.name):
            if child.is_dir():
                child_relative = relative / child.name
                lines.append(
                    f'{indent}<Directory Id="{directory_id(child_relative)}" Name="{xml_escape(child.name)}">'
                )
                child_contents, child_refs = render_directory(child_relative, indent + "  ")
                lines.append(child_contents)
                lines.append(f"{indent}</Directory>")
                component_refs.extend(child_refs)
            elif child.is_file():
                component_id = f"FileComponent{component_index}"
                file_id = f"File{component_index}"
                component_index += 1
                lines.extend((
                    f'{indent}<Component Id="{component_id}" Guid="{uuid.uuid5(uuid.NAMESPACE_URL, PRODUCT_ID + "/" + (relative / child.name).as_posix())}">',
                    f'{indent}  <File Id="{file_id}" Source="{xml_escape(str(child.resolve()))}" KeyPath="yes" />',
                    f"{indent}</Component>",
                ))
                component_refs.append(component_id)
        return "\n".join(lines), component_refs

    contents, component_ids = render_directory(Path("."), "        ")
    component_refs = "\n".join(
        f'      <ComponentRef Id="{component_id}" />' for component_id in component_ids
    )
    return f"""<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<Wix xmlns=\"http://wixtoolset.org/schemas/v4/wxs\">
  <Package Name=\"{PRODUCT_NAME}\" Manufacturer=\"Android Open Source Project\" Version=\"{msi_numeric_version(metadata.version)}\" UpgradeCode=\"{windows_upgrade_code()}\" Scope=\"perMachine\">
    <MajorUpgrade DowngradeErrorMessage=\"A newer version of {PRODUCT_NAME} is already installed.\" />
    <MediaTemplate EmbedCab=\"yes\" />
    <StandardDirectory Id=\"ProgramFiles64Folder\">
      <Directory Id=\"INSTALLFOLDER\" Name=\"{PRODUCT_NAME}\">
{contents}
      </Directory>
    </StandardDirectory>
    <StandardDirectory Id=\"ProgramMenuFolder\">
      <Directory Id=\"ApplicationProgramsFolder\" Name=\"{PRODUCT_NAME}\">
        <Component Id=\"StartMenuShortcut\" Guid=\"{uuid.uuid5(uuid.NAMESPACE_URL, PRODUCT_ID + '/start-menu-shortcut')}\">
          <Shortcut Id=\"StartMenuShortcut\" Directory=\"ApplicationProgramsFolder\" Name=\"{PRODUCT_NAME}\" Target=\"[INSTALLFOLDER]AOSP-WinScope.exe\" />
          <RemoveFolder Id=\"RemoveApplicationProgramsFolder\" On=\"uninstall\" />
          <RegistryValue Root=\"HKLM\" Key=\"Software\\{PRODUCT_NAME}\" Name=\"installed\" Type=\"integer\" Value=\"1\" KeyPath=\"yes\" />
        </Component>
      </Directory>
    </StandardDirectory>
    <Feature Id=\"Complete\" Title=\"{PRODUCT_NAME}\" Level=\"1\">
      <ComponentRef Id=\"StartMenuShortcut\" />
{component_refs}
    </Feature>
  </Package>
</Wix>
"""


def rpm_version(metadata: ReleaseMetadata) -> str:
    """Return the RPM-safe version corresponding to the release directory version."""
    return linux_package_version(metadata.version)


def rpm_spec(metadata: ReleaseMetadata, target: PackageTarget) -> str:
    return f"""Name:           aosp-winscope
Version:        {rpm_version(metadata)}
Release:        1%{{?dist}}
Summary:        AOSP WinScope trace viewer
License:        Apache-2.0
BuildArch:      {rpm_architecture(target.architecture)}
Source0:        aosp-winscope.tar.gz

%description
AOSP WinScope trace viewer with its embedded launcher and web application.

%prep
%setup -q

%install
rm -rf %{{buildroot}}
mkdir -p %{{buildroot}}
cp -a opt usr %{{buildroot}}/

%files
/opt/aosp-winscope
/usr/bin/aosp-winscope
"""


def windows_upgrade_code() -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_URL, PRODUCT_ID + "/installer"))


def xml_escape(value: str) -> str:
    return value.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;").replace(">", "&gt;")


def windows_path(path: Path) -> str:
    return str(path.resolve()).replace("/", "\\")


def command_for_macos_dmg(app: Path, artifact: Path) -> list[str]:
    return ["hdiutil", "create", "-volname", PRODUCT_NAME, "-srcfolder", str(app), "-ov", "-format", "UDZO", str(artifact)]


def command_for_macos_pkg(package_root: Path, metadata: ReleaseMetadata, artifact: Path) -> list[str]:
    return [
        "pkgbuild", "--root", str(package_root), "--identifier", PRODUCT_ID,
        "--version", metadata.version, "--install-location", "/Applications", str(artifact),
    ]


def command_for_inno(script: Path) -> list[str]:
    return [inno_compiler(), str(script)]


def command_for_wix(source: Path, artifact: Path) -> list[str]:
    return ["wix", "build", "-arch", "x64", "-o", str(artifact), str(source)]


def command_for_deb(stage: Path, artifact: Path) -> list[str]:
    return ["dpkg-deb", "--build", "--root-owner-group", str(stage), str(artifact)]


def command_for_rpm(topdir: Path, spec: Path) -> list[str]:
    return ["rpmbuild", "--define", f"_topdir {topdir}", "-bb", str(spec)]


def inno_compiler() -> str:
    if shutil.which("iscc"):
        return "iscc"
    if shutil.which("ISCC.exe"):
        return "ISCC.exe"
    # Keep the command useful in --dry-run and produce an actionable failure on execution.
    return "ISCC.exe" if os.name == "nt" else "iscc"


def ensure_tool(command: Sequence[str]) -> None:
    if shutil.which(command[0]) is None:
        raise RuntimeError(f"required host packaging tool is not available on PATH: {command[0]}")


def run(command: Sequence[str], *, cwd: Path | None = None) -> None:
    ensure_tool(command)
    subprocess.run(list(command), cwd=cwd, check=True)


def reset_directory(path: Path) -> None:
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True, exist_ok=True)


def copy_release_tree(source: Path, destination: Path) -> None:
    """Copy release bytes and POSIX modes without Finder metadata or resource forks."""
    shutil.copytree(
        source,
        destination,
        dirs_exist_ok=True,
        copy_function=shutil.copy,
        ignore=shutil.ignore_patterns(".DS_Store", "._*", "__MACOSX"),
    )


def make_executable(path: Path) -> None:
    path.chmod(path.stat().st_mode | 0o111)


def stage_macos(release: ReleaseMetadata, target: PackageTarget, stage: Path) -> tuple[Path, Path]:
    reset_directory(stage)
    package_root = stage / "pkg-root"
    app = package_root / "Applications" / f"{PRODUCT_NAME}.app"
    macos = app / "Contents" / "MacOS"
    resources = app / "Contents" / "Resources" / "aosp-winscope"
    macos.mkdir(parents=True)
    copy_release_tree(release.directory, resources)
    launcher = macos / PRODUCT_NAME
    launcher.write_text(macos_app_launcher_script(target), encoding="utf-8")
    make_executable(launcher)
    plist = app / "Contents" / "Info.plist"
    plist.write_text(macos_info_plist(release.version), encoding="utf-8")
    return package_root, app


def stage_windows(release: ReleaseMetadata, stage: Path) -> Path:
    reset_directory(stage)
    copy_release_tree(release.directory, stage)
    return stage


def stage_linux(release: ReleaseMetadata, target: PackageTarget, stage: Path) -> Path:
    reset_directory(stage)
    install_root = stage / LINUX_INSTALL_ROOT.relative_to("/")
    copy_release_tree(release.directory, install_root)
    command = stage / "usr" / "bin" / LINUX_COMMAND
    command.parent.mkdir(parents=True)
    command.write_text(linux_command_script(target), encoding="utf-8")
    make_executable(command)
    control = stage / "DEBIAN" / "control"
    control.parent.mkdir(parents=True)
    control.write_text(
        "\n".join((
            "Package: aosp-winscope",
            f"Version: {linux_package_version(release.version)}",
            "Section: devel",
            "Priority: optional",
            f"Architecture: {deb_architecture(target.architecture)}",
            "Maintainer: Android Open Source Project",
            "Description: AOSP WinScope trace viewer",
            "",
        )),
        encoding="utf-8",
    )
    return stage


def create_rpm_source(stage: Path, source_archive: Path, metadata: ReleaseMetadata) -> None:
    with tarfile.open(source_archive, "w:gz") as archive:
        for top_level in ("opt", "usr"):
            path = stage / top_level
            archive.add(path, arcname=f"aosp-winscope-{rpm_version(metadata)}/{top_level}")


def package_macos(
    release: ReleaseMetadata,
    target: PackageTarget,
    output: Path,
    formats: tuple[str, ...],
    staging: Path,
    dry_run: bool,
) -> list[Path]:
    package_root, app = stage_macos(release, target, staging / "macos")
    artifacts: list[Path] = []
    commands: list[list[str]] = []
    if "dmg" in formats:
        artifact = artifact_path(output, release, target, "dmg")
        artifacts.append(artifact)
        commands.append(command_for_macos_dmg(app, artifact))
    if "pkg" in formats:
        artifact = artifact_path(output, release, target, "pkg")
        artifacts.append(artifact)
        commands.append(command_for_macos_pkg(package_root / "Applications", release, artifact))
    if not dry_run:
        for command in commands:
            run(command)
    return artifacts


def package_windows(
    release: ReleaseMetadata,
    target: PackageTarget,
    output: Path,
    formats: tuple[str, ...],
    staging: Path,
    dry_run: bool,
) -> list[Path]:
    stage = stage_windows(release, staging / "release")
    artifacts: list[Path] = []
    commands: list[list[str]] = []
    if "exe" in formats:
        artifact = artifact_path(output, release, target, "exe")
        inno = staging / "control" / "aosp-winscope.iss"
        inno.parent.mkdir(parents=True, exist_ok=True)
        inno.write_text(inno_setup_script(release, stage, artifact), encoding="utf-8")
        artifacts.append(artifact)
        commands.append(command_for_inno(inno))
    if "msi" in formats:
        artifact = artifact_path(output, release, target, "msi")
        wix = staging / "control" / "aosp-winscope.wxs"
        wix.parent.mkdir(parents=True, exist_ok=True)
        wix.write_text(wix_source(release, stage), encoding="utf-8")
        artifacts.append(artifact)
        commands.append(command_for_wix(wix, artifact))
    if not dry_run:
        for command in commands:
            run(command)
    return artifacts


def package_linux(
    release: ReleaseMetadata,
    target: PackageTarget,
    output: Path,
    formats: tuple[str, ...],
    staging: Path,
    dry_run: bool,
) -> list[Path]:
    stage = stage_linux(release, target, staging / "deb-root")
    artifacts: list[Path] = []
    if "deb" in formats:
        artifact = artifact_path(output, release, target, "deb")
        if not dry_run:
            run(command_for_deb(stage, artifact))
        artifacts.append(artifact)
    if "rpm" in formats:
        artifact = artifact_path(output, release, target, "rpm")
        rpm_topdir = staging / "rpmbuild"
        reset_directory(rpm_topdir)
        source_directory = rpm_topdir / "SOURCES"
        spec_directory = rpm_topdir / "SPECS"
        source_directory.mkdir(parents=True)
        spec_directory.mkdir()
        create_rpm_source(stage, source_directory / "aosp-winscope.tar.gz", release)
        spec = spec_directory / "aosp-winscope.spec"
        spec.write_text(rpm_spec(release, target), encoding="utf-8")
        if not dry_run:
            run(command_for_rpm(rpm_topdir, spec))
            generated = sorted((rpm_topdir / "RPMS").glob("*/*.rpm"))
            if len(generated) != 1:
                description = "none" if not generated else ", ".join(str(path) for path in generated)
                raise RuntimeError(f"rpmbuild did not produce exactly one RPM artifact: {description}")
            shutil.copy2(generated[0], artifact)
        artifacts.append(artifact)
    return artifacts


def package_installers(
    release: ReleaseMetadata,
    output: Path,
    target: PackageTarget,
    formats: tuple[str, ...],
    dry_run: bool = False,
) -> list[Path]:
    host = host_platform()
    if target.operating_system != host:
        raise ValueError(
            f"{target.operating_system} packaging must run on a {target.operating_system} host; current host is {host}"
        )
    if target not in targets_for_platform(target.operating_system):
        raise ValueError(f"unsupported installer target: {target.label}")
    validate_release_tree(release, (target,))
    output.mkdir(parents=True, exist_ok=True)
    # Keep staging outside the upload directory: CI sees only requested artifacts.
    with tempfile.TemporaryDirectory(prefix=f"aosp-winscope-installers-{target.label}-") as temporary:
        staging = Path(temporary)
        if target.operating_system == "darwin":
            return package_macos(release, target, output, formats, staging, dry_run)
        if target.operating_system == "windows":
            return package_windows(release, target, output, formats, staging, dry_run)
        return package_linux(release, target, output, formats, staging, dry_run)


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True, help="direct aosp-winscope-<version> release directory")
    parser.add_argument("--platform", choices=("macos", "darwin", "windows", "linux"), required=True)
    parser.add_argument("--architecture", choices=("amd64", "arm64"), required=True)
    parser.add_argument("--formats", required=True, help="comma-separated requested formats, for example dmg,pkg")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_ROOT)
    parser.add_argument("--dry-run", action="store_true", help="stage inputs but do not invoke host packaging tools")
    parser.add_argument("--json", action="store_true", help="print a machine-readable artifact report")
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        metadata = release_metadata_from_input(args.input)
        selected_platform = normalize_platform(args.platform)
        target = PackageTarget(selected_platform, args.architecture)
        formats = requested_formats(selected_platform, args.formats)
        artifacts = package_installers(metadata, args.output.resolve(), target, formats, args.dry_run)
    except (OSError, RuntimeError, ValueError, subprocess.CalledProcessError) as error:
        print(f"package-installers: {error}", file=sys.stderr)
        return 1
    report = {
        "artifacts": [str(artifact) for artifact in artifacts],
        "architecture": args.architecture,
        "dryRun": args.dry_run,
        "formats": list(formats),
        "platform": args.platform,
        "release": str(metadata.directory),
        "version": metadata.version,
    }
    if args.json:
        print(json.dumps(report, sort_keys=True))
    else:
        for artifact in artifacts:
            print(artifact)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
