#!/usr/bin/env python3
"""Bundle pinned Ubuntu arm64 ADB without installing or executing packages."""

import argparse
import datetime
import email.utils
import hashlib
import io
import json
import lzma
import os
from pathlib import Path, PurePosixPath
import platform
import re
import shlex
import shutil
import stat
import struct
import subprocess
import sys
import tarfile
import tempfile
from urllib.parse import urlsplit


ROOT_URL = "https://ports.ubuntu.com/ubuntu-ports/"
KEYRING = Path("/usr/share/keyrings/ubuntu-archive-keyring.gpg")
SIGNER = "F6ECB3762474EDA9D21B7022871920D1991BC93C"
PACKAGES = frozenset({
    "adb", "android-libbase", "android-libboringssl", "android-libcutils",
    "android-liblog", "android-libziparchive", "libbrotli1", "liblz4-1",
    "libprotobuf32t64", "libusb-1.0-0", "libzstd1", "libudev1", "libcap2",
    "zlib1g", "libstdc++6", "libgcc-s1", "libbsd0", "libmd0", "gcc-14-base",
})
SOURCES = frozenset({
    "android-platform-tools", "android-platform-external-boringssl", "brotli",
    "lz4", "protobuf", "libusb-1.0", "libzstd", "systemd", "libcap2",
    "zlib", "gcc-14", "libbsd", "libmd",
})
HOST_LIBRARIES = frozenset({"libc.so.6", "libm.so.6", "ld-linux-aarch64.so.1"})
INTERPRETER = "/lib/ld-linux-aarch64.so.1"
COMMON_LICENSES = frozenset({
    "Apache-2.0", "Artistic", "BSD", "CC0-1.0", "GFDL", "GFDL-1.2",
    "GFDL-1.3", "GPL", "GPL-1", "GPL-2", "GPL-3", "LGPL", "LGPL-2",
    "LGPL-2.1", "LGPL-3", "MPL-1.1", "MPL-2.0",
})
MAX_ARTIFACT = 128 * 1024 * 1024
MAX_TOTAL_ARTIFACTS = 256 * 1024 * 1024
MAX_INDEX = 64 * 1024 * 1024
MAX_INDEX_EXPANDED = 192 * 1024 * 1024
MAX_DEB_TAR = 64 * 1024 * 1024
MAX_TREE = 128 * 1024 * 1024
MAX_ENTRY = 32 * 1024 * 1024
MAX_OUTPUT = 512 * 1024 * 1024
SHA256 = re.compile(r"[a-f0-9]{64}\Z")
SONAME = re.compile(r"[A-Za-z0-9_+.-]+\.so(?:\.[0-9]+)*\Z")


class BundleError(Exception):
    pass


def require(condition, message):
    if not condition:
        raise BundleError(message)


def safe_path(value):
    require(isinstance(value, str) and value and "\\" not in value,
            "Unsafe archive path")
    require(not any(ord(c) < 32 or ord(c) == 127 for c in value),
            "Control character in path")
    require(not value.startswith("/"), "Absolute archive path")
    parts = value.split("/")
    require(all(p and p not in (".", "..") for p in parts), "Unsafe path component")
    return value


def artifact_name(record):
    url = record.get("url", "")
    require(isinstance(url, str) and url.startswith(ROOT_URL + "pool/"),
            "Artifact must come from the official Ubuntu ports pool")
    parsed = urlsplit(url)
    require(not parsed.query and not parsed.fragment and "%" not in parsed.path,
            "Unexpected artifact URL")
    safe_path(parsed.path.removeprefix("/"))
    parts = parsed.path.split("/")
    require(len(parts) >= 5 and parts[3] in ("main", "universe"), "Unexpected pool component")
    name = parsed.path.rsplit("/", 1)[1]
    require(SHA256.fullmatch(record.get("sha256", "")) is not None,
            "Invalid artifact SHA256")
    size = record.get("size")
    require(type(size) is int and 0 < size <= MAX_ARTIFACT, "Invalid artifact size")
    return name


def index_identity(record):
    identity = record.get("index", {})
    require(identity.get("suite") in ("noble", "noble-updates", "noble-security")
            and identity.get("component") in ("main", "universe"), "Invalid APT index")
    return identity["suite"], identity["component"]


def load_lock(path):
    with open(path, encoding="utf-8") as stream:
        whole = json.load(stream)
    lock = whole.get("linuxArm64Adb", {})
    require(lock.get("schemaVersion") == 1 and lock.get("provider") == "Ubuntu"
            and lock.get("providerVersion") == "34.0.4"
            and lock.get("architecture") == "arm64", "Invalid Ubuntu ADB provider")
    require(lock.get("distribution") == {
        "id": "ubuntu", "versionId": "24.04", "suite": "noble", "glibcMinimum": "2.38",
    }, "Unsupported distribution baseline")
    require(lock.get("signingFingerprints") == [SIGNER], "Unexpected APT signing authority")
    binaries, sources = lock.get("binaryPackages", []), lock.get("sourcePackages", [])
    require(len(binaries) == len(PACKAGES) and {p.get("name") for p in binaries} == PACKAGES,
            "Binary package set must match the fixed allowlist")
    require(len(sources) == len(SOURCES) and {p.get("name") for p in sources} == SOURCES,
            "Source package set must match the fixed allowlist")
    source_ids = {(p["name"], p.get("version")) for p in sources}
    records = []
    for binary in binaries:
        require(binary.get("architecture") == "arm64" and binary.get("version"),
                "Invalid binary architecture/version")
        require(artifact_name(binary).endswith("_arm64.deb"), "Not an arm64 Debian package")
        index_identity(binary)
        source = binary.get("source", {})
        require((source.get("name"), source.get("version")) in source_ids,
                "Missing matching source package")
        records.append(binary)
    for source in sources:
        index_identity(source)
        files = source.get("files", [])
        require(source.get("version") and 2 <= len(files) <= 16,
                "Incomplete source package")
        names = [artifact_name(f) for f in files]
        require(len(names) == len(set(names)) and sum(n.endswith(".dsc") for n in names) == 1
                and any(".tar." in n for n in names), "Missing source descriptor/archive")
        records.extend(files)
    require(sum(r["size"] for r in records) <= MAX_TOTAL_ARTIFACTS,
            "Pinned artifact set exceeds the bounded budget")
    return lock


def production_host():
    require(platform.system() == "Linux" and platform.machine() in ("aarch64", "arm64"),
            "Production bundling requires native Ubuntu 24.04 ARM64")
    values = {}
    for line in Path("/etc/os-release").read_text(encoding="utf-8").splitlines():
        if line and not line.startswith("#") and "=" in line:
            key, value = line.split("=", 1)
            parts = shlex.split(value)
            values[key] = parts[0] if len(parts) == 1 else ""
    require(values.get("ID") == "ubuntu" and values.get("VERSION_ID") == "24.04",
            "Production bundling requires Ubuntu 24.04")
    require(os.getuid() != 0, "Run the bundler as an unprivileged build user")
    for tool in ("dpkg-deb", "readelf", "gpgv", "curl"):
        require(shutil.which(tool), "Missing build tool: " + tool)
    keyring = KEYRING
    info = keyring.lstat()
    if stat.S_ISLNK(info.st_mode):
        # Some images ship the package keyring as a link to the installed file.
        # The link is only trustworthy while its own directory is root-owned and
        # not writable by the unprivileged build user.
        directory = keyring.parent.stat()
        require(stat.S_ISDIR(directory.st_mode) and directory.st_uid == 0
                and not directory.st_mode & 0o022,
                "Ubuntu keyring link must live in a root-owned, non-writable directory")
        keyring = keyring.resolve(strict=True)
        info = keyring.lstat()
    require(stat.S_ISREG(info.st_mode) and info.st_uid == 0 and not info.st_mode & 0o022,
            "Ubuntu keyring must be an installed, root-owned, non-writable regular file "
            f"(path={keyring}, type={stat.S_IFMT(info.st_mode):#o}, "
            f"uid={info.st_uid}, mode={stat.S_IMODE(info.st_mode):#o})")


def command(args, **kwargs):
    env = dict(os.environ, LC_ALL="C", LANG="C")
    for key in ("LD_LIBRARY_PATH", "LD_PRELOAD", "LD_AUDIT", "LD_LIBRARY_PATH_ORIG"):
        env.pop(key, None)
    result = subprocess.run(args, env=env, timeout=180, check=False, **kwargs)
    require(result.returncode == 0, "Build tool failed: " + str(args[0]))
    return result


def digest(path, limit=MAX_OUTPUT):
    fd = os.open(path, os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0))
    with os.fdopen(fd, "rb") as stream:
        info = os.fstat(stream.fileno())
        require(stat.S_ISREG(info.st_mode) and info.st_size <= limit,
                "Expected a bounded regular file: " + str(path))
        hashed, size = hashlib.sha256(), 0
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            size += len(block)
            require(size <= limit, "File exceeds size budget")
            hashed.update(block)
        return {"sha256": hashed.hexdigest(), "size": size}


def check_file(path, expected):
    actual = digest(path, expected["size"])
    require(actual == {"sha256": expected["sha256"], "size": expected["size"]},
            "SHA256/size mismatch: " + str(path))
    return actual


def cache_directory(root, relative):
    path = root
    for part in PurePosixPath(safe_path(relative)).parts:
        path = path / part
        try:
            path.mkdir(mode=0o700)
        except FileExistsError:
            require(not path.is_symlink() and path.is_dir(), "Unsafe cache directory")
    return path


def fetch(url, destination, maximum, expected=None):
    require(url.startswith(ROOT_URL) and "%" not in url and "?" not in url
            and "#" not in url, "Unofficial download URL")
    safe_path(url[len(ROOT_URL):])
    if destination.exists() or destination.is_symlink():
        if expected:
            check_file(destination, expected)
        else:
            digest(destination, maximum)
        return destination
    fd, temporary = tempfile.mkstemp(prefix=".download-", dir=destination.parent)
    os.close(fd)
    try:
        result = command([
            "curl", "--disable", "--fail", "--silent", "--show-error", "--proto", "=https",
            "--connect-timeout", "15", "--max-time", "150", "--max-filesize", str(maximum),
            "--output", temporary, "--write-out", "%{http_code}", url,
        ], stdout=subprocess.PIPE)
        require(result.stdout == b"200", "Download redirects/non-200 responses are forbidden")
        if expected:
            check_file(temporary, expected)
        else:
            digest(temporary, maximum)
        require(not destination.exists() and not destination.is_symlink(), "Cache race")
        os.replace(temporary, destination)
        return destination
    finally:
        Path(temporary).unlink(missing_ok=True)


def control_records(lines, maximum=MAX_INDEX_EXPANDED):
    fields, key, total, record_size = {}, None, 0, 0
    for raw in lines:
        total += len(raw.encode("utf-8"))
        record_size += len(raw)
        require(total <= maximum and record_size <= 1024 * 1024 and len(raw) <= 128 * 1024,
                "APT metadata exceeds parsing budget")
        line = raw.rstrip("\n")
        if not line:
            if fields:
                yield fields
            fields, key, record_size = {}, None, 0
        elif line.startswith((" ", "\t")):
            require(key is not None, "Unattached control continuation")
            fields[key] += "\n" + line[1:]
        else:
            match = re.fullmatch(r"([A-Za-z0-9-]+):(?: (.*))?", line)
            require(match is not None and match[1] not in fields, "Invalid/duplicate control field")
            key = match[1]
            fields[key] = match[2] or ""
    if fields:
        yield fields


def checksum_rows(value):
    rows = {}
    for line in value.strip().splitlines():
        parts = line.split()
        require(len(parts) == 3 and SHA256.fullmatch(parts[0]) and parts[1].isdigit(),
                "Invalid APT SHA256 entry")
        name = safe_path(parts[2])
        require(name not in rows, "Duplicate APT checksum entry")
        rows[name] = {"sha256": parts[0], "size": int(parts[1])}
    require(rows, "Empty APT checksums")
    return rows


def verify_release(inrelease, verified, home, suite, now=None):
    result = command([
        "gpgv", "--homedir", str(home), "--keyring", str(KEYRING), "--status-fd", "1",
        "--output", str(verified), str(inrelease),
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    signatures = [l.split() for l in result.stdout.decode("utf-8").splitlines()
                  if l.startswith("[GNUPG:] VALIDSIG ")]
    require(any(len(s) >= 3 and s[2] == SIGNER for s in signatures),
            "Ubuntu archive signature does not match the pinned authority")
    require(verified.stat().st_size <= 1024 * 1024, "Oversized signed Release")
    records = list(control_records(io.StringIO(verified.read_text(encoding="utf-8")), 1024 * 1024))
    require(len(records) == 1, "Invalid signed Release")
    release = records[0]
    require(release.get("Origin") == "Ubuntu" and release.get("Suite") == suite
            and release.get("Codename") == "noble"
            and "arm64" in release.get("Architectures", "").split(), "Unexpected APT release identity")
    now = now or datetime.datetime.now(datetime.timezone.utc)
    date = email.utils.parsedate_to_datetime(release["Date"])
    require(date.tzinfo is not None and date <= now + datetime.timedelta(days=1),
            "Future/invalid APT release date")
    if release.get("Valid-Until"):
        until = email.utils.parsedate_to_datetime(release["Valid-Until"])
        require(until.tzinfo is not None and until >= now, "Expired APT metadata")
    return release, checksum_rows(release.get("SHA256", ""))


def source_identity(fields):
    match = re.fullmatch(r"([^ ]+)(?: \(([^)]+)\))?", fields.get("Source", fields.get("Package", "")))
    require(match is not None, "Invalid binary Source identity")
    return {"name": match[1], "version": match[2] or fields.get("Version")}


def authenticate(lock, cache, work):
    groups = {}
    for kind, records in (("binary", lock["binaryPackages"]), ("source", lock["sourcePackages"])):
        for record in records:
            groups.setdefault((*index_identity(record), kind), []).append(record)
    releases, evidence = {}, []
    for suite in sorted({key[0] for key in groups}):
        directory = cache_directory(cache, "metadata/" + suite)
        signed = fetch(ROOT_URL + "dists/" + suite + "/InRelease", directory / "InRelease", 1024 * 1024)
        release, checksums = verify_release(signed, work / (suite + ".Release"), work, suite)
        releases[suite] = checksums
        evidence.append({"path": signed, "output": "apt/" + suite + "/InRelease",
                         "url": ROOT_URL + "dists/" + suite + "/InRelease",
                         "signer": SIGNER, "date": release["Date"], **digest(signed, 1024 * 1024)})
    for (suite, component, kind), records in sorted(groups.items()):
        subpath = component + ("/binary-arm64/Packages.xz" if kind == "binary" else "/source/Sources.xz")
        expected = releases[suite].get(subpath)
        require(expected and 0 < expected["size"] <= MAX_INDEX, "Missing/oversized signed index")
        directory = cache_directory(cache, "indexes")
        archive = fetch(ROOT_URL + "dists/" + suite + "/" + subpath,
                        directory / (expected["sha256"] + ".xz"), MAX_INDEX, expected)
        evidence.append({"path": archive, "output": "apt/" + suite + "/" + subpath,
                         "url": ROOT_URL + "dists/" + suite + "/" + subpath, **expected})
        wanted = {(r["name"], r["version"]): r for r in records}
        found = set()
        with lzma.open(archive, "rt", encoding="utf-8") as stream:
            for fields in control_records(stream):
                identity = fields.get("Package"), fields.get("Version")
                if identity not in wanted:
                    continue
                require(identity not in found, "Duplicate pinned package in signed index")
                record = wanted[identity]
                if kind == "binary":
                    require(fields.get("Architecture") == "arm64"
                            and source_identity(fields) == record["source"]
                            and ROOT_URL + fields.get("Filename", "") == record["url"]
                            and fields.get("SHA256") == record["sha256"]
                            and fields.get("Size") == str(record["size"])
                            and " ".join(fields.get("Depends", "").split())
                            == " ".join(record.get("depends", "").split()),
                            "Pinned binary disagrees with signed APT metadata: " + record["name"])
                else:
                    rows = checksum_rows(fields.get("Checksums-Sha256", ""))
                    actual = {ROOT_URL + fields["Directory"] + "/" + name: value
                              for name, value in rows.items()}
                    pinned = {f["url"]: {"sha256": f["sha256"], "size": f["size"]}
                              for f in record["files"]}
                    require(actual == pinned, "Incomplete/mismatched signed source package: " + record["name"])
                found.add(identity)
        require(found == set(wanted), "Pinned versions no longer occur in signed metadata; refresh the lock explicitly")
    return evidence


class PackageTree:
    """Resolve links in a virtual package tree; never extract archive paths to disk."""

    def __init__(self):
        self.entries = {}
        self.size = 0
        self.count = 0

    def add_tar(self, stream):
        with tarfile.open(fileobj=stream, mode="r|") as archive:
            for entry in archive:
                self.count += 1
                require(self.count <= 30000, "Too many package entries")
                name = entry.name.removeprefix("./").rstrip("/")
                if name in ("", ".") and entry.isdir():
                    continue
                safe_path(name)
                if entry.isdir():
                    value = ("dir", None)
                elif entry.isfile():
                    require(0 <= entry.size <= MAX_ENTRY, "Oversized package entry")
                    self.size += entry.size
                    require(self.size <= MAX_TREE, "Expanded packages exceed budget")
                    content = archive.extractfile(entry).read(entry.size + 1)
                    require(len(content) == entry.size, "Truncated package entry")
                    value = ("file", content)
                elif entry.issym() or entry.islnk():
                    target = entry.linkname
                    require(target and not target.startswith("/") and "\\" not in target
                            and not any(ord(c) < 32 or ord(c) == 127 for c in target), "Unsafe package link")
                    parts = [] if entry.islnk() else name.split("/")[:-1]
                    for part in target.split("/"):
                        if part == "..":
                            require(parts, "Package link escapes approved root")
                            parts.pop()
                        elif part not in ("", "."):
                            parts.append(part)
                    require(parts, "Link to package root")
                    value = ("link", "/".join(parts))
                else:
                    raise BundleError("Special package entries are forbidden")
                require(name not in self.entries or self.entries[name] == value,
                        "Conflicting package entries: " + name)
                self.entries[name] = value

    def resolve(self, name):
        safe_path(name)
        for _ in range(41):
            parts = name.split("/")
            for index in range(1, len(parts) + 1):
                prefix = "/".join(parts[:index])
                value = self.entries.get(prefix)
                if value and value[0] == "link":
                    name = "/".join([value[1], *parts[index:]])
                    break
                if index < len(parts):
                    require(value is None or value[0] == "dir", "File used as archive directory")
            else:
                require(name in self.entries and self.entries[name][0] == "file",
                        "Missing package file: " + name)
                return name, self.entries[name][1]
        raise BundleError("Cyclic/excessive package links")


def read_package(path, tree):
    with tempfile.TemporaryFile() as stream:
        command(["dpkg-deb", "--fsys-tarfile", str(path)], stdout=stream, stderr=subprocess.PIPE)
        require(stream.tell() <= MAX_DEB_TAR, "Expanded Debian archive exceeds budget")
        stream.seek(0)
        tree.add_tar(stream)


def validate_elf_header(data):
    require(len(data) >= 64 and data[:6] == b"\x7fELF\x02\x01"
            and struct.unpack_from("<H", data, 18)[0] == 183,
            "Expected a real ELF64 little-endian AArch64 binary")


def parse_readelf(text, executable=False):
    needed = re.findall(r"\(NEEDED\).*?\[([^\]\n]+)\]", text)
    names = re.findall(r"\(SONAME\).*?\[([^\]\n]+)\]", text)
    require(len(names) <= 1 and all(SONAME.fullmatch(n) for n in needed + names),
            "Unsafe ELF dependency/SONAME")
    require(not re.search(r"\(RPATH\)", text), "DT_RPATH would bypass the bounded leaf library path")
    runpaths = re.findall(r"\(RUNPATH\).*?\[([^\]\n]+)\]", text)
    require(all(p == "/usr/lib/aarch64-linux-gnu/android" for p in runpaths), "Unexpected ELF RUNPATH")
    interpreters = re.findall(r"Requesting program interpreter:\s*([^\]\n]+)", text)
    require(all(p == INTERPRETER for p in interpreters)
            and (not executable or interpreters == [INTERPRETER]), "Unexpected ELF interpreter")
    versions = set(re.findall(r"\bName:\s+(GLIBC_[A-Za-z0-9_.]+)", text))
    for version in versions:
        if version == "GLIBC_ABI_DT_RELR":
            continue  # Supported since glibc 2.36, below this provider's 2.38 floor.
        match = re.fullmatch(r"GLIBC_(\d+)\.(\d+)", version)
        require(match and (int(match[1]), int(match[2])) <= (2, 38),
                "Unsupported glibc requirement: " + version)
    require(needed, "Missing ELF dynamic dependency information")
    return {"needed": sorted(set(needed)), "soname": names[0] if names else None,
            "glibcVersions": sorted(versions), "runpaths": runpaths}


def inspect_elf(path, executable=False):
    with open(path, "rb") as stream:
        validate_elf_header(stream.read(64))
    result = command(["readelf", "--wide", "--program-headers", "--dynamic", "--version-info", str(path)],
                     stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    require(len(result.stdout) <= 8 * 1024 * 1024, "Oversized readelf output")
    return parse_readelf(result.stdout.decode("utf-8"), executable)


def dependency_closure(adb, libraries):
    selected, pending = {}, list(adb["needed"])
    while pending:
        name = pending.pop()
        if name in HOST_LIBRARIES or name in selected:
            continue
        require(name in libraries, "Unresolved non-baseline ELF dependency: " + name)
        selected[name] = libraries[name]
        pending.extend(libraries[name]["elf"]["needed"])
    return selected


def write_bytes(output, relative, data, executable=False):
    destination = output.joinpath(*PurePosixPath(safe_path(relative)).parts)
    destination.parent.mkdir(parents=True, exist_ok=True)
    with open(destination, "xb") as stream:
        stream.write(data)
    destination.chmod(0o755 if executable else 0o644)
    return destination


def copy_checked(output, relative, source, expected):
    destination = output.joinpath(*PurePosixPath(safe_path(relative)).parts)
    destination.parent.mkdir(parents=True, exist_ok=True)
    fd = os.open(source, os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0))
    with os.fdopen(fd, "rb") as src, open(destination, "xb") as dst:
        info = os.fstat(src.fileno())
        require(stat.S_ISREG(info.st_mode) and info.st_size == expected["size"],
                "Artifact changed before copy")
        size = 0
        for block in iter(lambda: src.read(1024 * 1024), b""):
            size += len(block)
            require(size <= expected["size"], "Artifact grew during copy")
            dst.write(block)
    destination.chmod(0o644)
    check_file(destination, expected)
    return destination


def copy_licenses(tree, binaries, output, common_root=Path("/usr/share/common-licenses")):
    notices, references = [], set()
    for package in binaries:
        name = package["name"]
        _, data = tree.resolve("usr/share/doc/" + name + "/copyright")
        text = data.decode("utf-8")
        write_bytes(output, "licenses/" + name + "/copyright", data)
        notices.append("===== " + name + " " + package["version"] + " =====\n" + text)
        references.update(n.rstrip(".") for n in re.findall(
            r"/usr/share/common-licenses/([A-Za-z0-9][A-Za-z0-9.+-]*)", text))
    for name in sorted(references):
        require(name in COMMON_LICENSES, "Unapproved common license reference: " + name)
        source = (common_root / name).resolve(strict=True)
        require(source.is_relative_to(common_root.resolve()), "Common license escapes trusted root")
        digest(source, 1024 * 1024)
        write_bytes(output, "licenses/common/" + name, source.read_bytes())
    write_bytes(output, "NOTICE.txt", ("Ubuntu-provided ADB and support libraries.\n"
                "Licenses are not uniformly Apache-2.0. See licenses/ and sources/.\n\n"
                + "\n\n".join(notices)).encode("utf-8"))


def assemble(lock, output, cache, evidence, artifact_paths, work):
    tree = PackageTree()
    for record in lock["binaryPackages"]:
        name = artifact_name(record)
        local = copy_checked(output, "packages/" + name, artifact_paths[record["url"]], record)
        read_package(local, tree)
    adb_path, adb = tree.resolve("usr/lib/android-sdk/platform-tools/adb")
    executable = write_bytes(output, "adb", adb, executable=True)
    adb_elf = inspect_elf(executable, executable=True)
    libraries = {}
    inspected = set()
    for name in sorted(tree.entries):
        if not re.fullmatch(r"usr/lib/aarch64-linux-gnu/(?:android/)?[^/]+\.so(?:\.[0-9]+)*", name):
            continue
        resolved, data = tree.resolve(name)
        if resolved in inspected:
            continue
        inspected.add(resolved)
        temporary = write_bytes(work, "elf/" + str(len(inspected)), data)
        elf = inspect_elf(temporary)
        soname = elf["soname"]
        require(soname and soname not in HOST_LIBRARIES and soname not in libraries,
                "Missing/duplicate/reserved library SONAME")
        libraries[soname] = {"archivePath": resolved, "elf": elf, "data": data}
    selected = dependency_closure(adb_elf, libraries)
    for soname, value in sorted(selected.items()):
        write_bytes(output, "lib64/" + soname, value["data"])
    for source in lock["sourcePackages"]:
        for record in source["files"]:
            copy_checked(output, "sources/" + source["name"] + "/" + artifact_name(record),
                         artifact_paths[record["url"]], record)
    copy_licenses(tree, lock["binaryPackages"], output)
    instructions = Path(__file__).with_name("linux-adb-licenses.md")
    write_bytes(output, "licenses/REBUILD.md", instructions.read_bytes())
    write_bytes(output, "sources/bundler/bundle-linux-adb.py", Path(__file__).read_bytes())
    write_bytes(output, "sources/bundler/provider-lock.json",
                (json.dumps({"linuxArm64Adb": lock}, indent=2) + "\n").encode())
    write_bytes(output, "sources/bundler/linux-adb-licenses.md", instructions.read_bytes())
    for record in evidence:
        copy_checked(output, record["output"], record["path"], record)
    write_bytes(output, "source.properties", b"Pkg.Revision=34.0.4\nPkg.Provider=Ubuntu\n"
                b"Pkg.ProviderVersion=1:34.0.4-1build3\nPkg.Architecture=arm64\n")
    files = []
    for path in sorted(output.rglob("*")):
        require(not path.is_symlink(), "Output links are forbidden")
        if path.is_file():
            files.append({"path": path.relative_to(output).as_posix(), **digest(path)})
    require(sum(f["size"] for f in files) <= MAX_OUTPUT, "Bundle exceeds output budget")
    provenance = {
        "schemaVersion": 1, "provider": "Ubuntu", "providerVersion": "34.0.4",
        "architecture": "arm64", "distribution": lock["distribution"],
        "authentication": {"method": "gpgv InRelease -> SHA256 index -> pinned binary/source artifact",
                           "keyring": str(KEYRING), "signerFingerprint": SIGNER,
                           "metadata": [{k: v for k, v in e.items() if k != "path"} for e in evidence]},
        "binaryPackages": lock["binaryPackages"], "sourcePackages": lock["sourcePackages"],
        "elf": {"adb": {"archivePath": adb_path, **adb_elf},
                "libraries": {n: {k: v for k, v in x.items() if k != "data"}
                              for n, x in sorted(selected.items())},
                "hostLibraries": sorted(HOST_LIBRARIES), "interpreter": INTERPRETER},
        "licensing": {"uniformApache2": False, "sourceDelivery": "complete signed-index source packages retained",
                      "applicationRelinking": "parent release must supply a compatible rebuild/relink or replacement path"},
        "files": files,
    }
    write_bytes(output, "provenance.json", (json.dumps(provenance, indent=2) + "\n").encode())
    return provenance


def bundle(output, cache, lock_path):
    production_host()
    lock = load_lock(lock_path)
    require(not output.exists() and not output.is_symlink(), "Output must be a fresh root")
    require(output.parent.is_dir(), "Output parent must already exist")
    require(not cache.is_symlink(), "Cache root must not be a symlink")
    cache.mkdir(parents=True, exist_ok=True)
    cache = cache.resolve(strict=True)
    output = output.parent.resolve(strict=True) / output.name
    require(not cache.is_relative_to(output) and not output.is_relative_to(cache),
            "Cache and output must be separate trees")
    with tempfile.TemporaryDirectory(prefix=".ubuntu-adb-", dir=cache) as temporary:
        work = Path(temporary)
        evidence = authenticate(lock, cache, work)
        directory = cache_directory(cache, "artifacts")
        records = lock["binaryPackages"] + [f for s in lock["sourcePackages"] for f in s["files"]]
        artifacts = {}
        for record in records:
            destination = directory / (record["sha256"] + "-" + artifact_name(record))
            artifacts[record["url"]] = fetch(record["url"], destination, record["size"], record)
        output.mkdir(mode=0o755)
        identity = output.stat()
        try:
            provenance = assemble(lock, output, cache, evidence, artifacts, work)
            print(json.dumps({"output": str(output), "provider": "Ubuntu", "version": "34.0.4",
                              "libraries": len(provenance["elf"]["libraries"]),
                              "sourcePackages": len(lock["sourcePackages"])}))
        except BaseException:
            current = output.lstat()
            if stat.S_ISDIR(current.st_mode) and (current.st_dev, current.st_ino) == (identity.st_dev, identity.st_ino):
                shutil.rmtree(output)
            raise


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--cache", type=Path, required=True)
    parser.add_argument("--lock", type=Path, required=True)
    args = parser.parse_args(argv)
    try:
        bundle(args.output, args.cache, args.lock)
    except (BundleError, OSError, ValueError, KeyError, lzma.LZMAError,
            tarfile.TarError, subprocess.SubprocessError) as error:
        print("Ubuntu arm64 ADB bundling failed: " + str(error), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
