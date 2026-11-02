"""Portable data/host-tool fixture tests; no ARM executables are run."""

import copy
import datetime
import hashlib
import importlib.util
import io
import json
import lzma
import os
from pathlib import Path
import stat
import struct
import subprocess
import tarfile
import tempfile
import unittest
from unittest import mock


HERE = Path(__file__).resolve().parent
SPEC = importlib.util.spec_from_file_location("linux_adb_bundler", HERE / "bundle-linux-adb.py")
adb = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(adb)


def hashed(data):
    return {"sha256": hashlib.sha256(data).hexdigest(), "size": len(data)}


def elf_header(machine=183, bits=2, endian=1):
    data = bytearray(64)
    data[:6] = b"\x7fELF" + bytes([bits, endian])
    struct.pack_into("<H", data, 18, machine)
    return bytes(data)


def elf_text(needed=("libc.so.6",), soname=None, interpreter=None, version="GLIBC_2.38"):
    lines = ["0x1 (NEEDED) Shared library: [" + name + "]" for name in needed]
    if soname:
        lines.append("0xe (SONAME) Library soname: [" + soname + "]")
    if interpreter:
        lines.append("[Requesting program interpreter: " + interpreter + "]")
    lines.append("0x0010: Name: " + version + " Flags: none Version: 2")
    return "\n".join(lines)


def archive(entries):
    stream = io.BytesIO()
    with tarfile.open(fileobj=stream, mode="w") as tar:
        for name, value in entries:
            member = tarfile.TarInfo(name)
            if isinstance(value, bytes):
                member.size = len(value)
                tar.addfile(member, io.BytesIO(value))
            else:
                member.type, member.linkname = value
                tar.addfile(member)
    stream.seek(0)
    return stream


def release_text(indexes=None, **changes):
    values = {"Origin": "Ubuntu", "Suite": "noble", "Codename": "noble",
              "Architectures": "amd64 arm64", "Date": "Thu, 25 Apr 2024 15:10:33 UTC"}
    values.update(changes)
    text = "\n".join(k + ": " + v for k, v in values.items()) + "\nSHA256:\n"
    for name, record in (indexes or {"main/binary-arm64/Packages.xz": hashed(b"index")}).items():
        text += " " + record["sha256"] + " " + str(record["size"]) + " " + name + "\n"
    return text


class TemporaryTest(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)


class LockTests(TemporaryTest):
    def setUp(self):
        super().setUp()
        self.whole = json.loads((HERE / "runtime-lock.json").read_text())

    def load(self, whole):
        path = self.root / "lock.json"
        path.write_text(json.dumps(whole))
        return adb.load_lock(path)

    def test_real_lock_has_exact_packages_and_sources(self):
        lock = self.load(self.whole)
        self.assertEqual(len(lock["binaryPackages"]), 19)
        self.assertEqual(len(lock["sourcePackages"]), 13)
        self.assertEqual(sum(len(s["files"]) for s in lock["sourcePackages"]), 42)
        self.assertEqual(sum(f["size"] for s in lock["sourcePackages"] for f in s["files"]), 175541639)
        self.assertEqual(sum(p["size"] for p in lock["binaryPackages"])
                         + sum(f["size"] for s in lock["sourcePackages"] for f in s["files"]), 179466831)
        self.assertEqual(lock["providerVersion"], "34.0.4")

    def test_total_artifact_budget_is_enforced(self):
        with mock.patch.object(adb, "MAX_TOTAL_ARTIFACTS", 1024), self.assertRaisesRegex(adb.BundleError, "budget"):
            self.load(self.whole)

    def test_google_pins_are_unchanged_and_five_targets_are_explicit(self):
        self.assertEqual(self.whole["platformTools"]["version"], "37.0.1")
        expected = {"darwin": "ee39ad5967e95c2a07f04dbcbde96b1a0c916ba376096db5d2f498b7727a5d1d",
                    "windows": "45f4d63113e895ebde0c90f194099a4676b6ac653bd28d54314a9e022bbc1a99",
                    "linux": "d230f13842f60f782a8645f9c813f8f845bf36089ea7289f28c48f17979313f1"}
        self.assertEqual({k: v["sha256"] for k, v in self.whole["platformTools"]["archives"].items()}, expected)
        self.assertEqual(set(self.whole["supportedTargets"]), {
            "darwin-arm64", "darwin-x64", "win32-x64", "linux-arm64", "linux-x64"})

    def test_rejects_expanded_or_duplicate_package_allowlist(self):
        for change in (lambda b: b.append(copy.deepcopy(b[0])), lambda b: b.pop()):
            whole = copy.deepcopy(self.whole)
            change(whole["linuxArm64Adb"]["binaryPackages"])
            with self.assertRaises(adb.BundleError):
                self.load(whole)

    def test_rejects_missing_source_and_descriptor(self):
        whole = copy.deepcopy(self.whole)
        whole["linuxArm64Adb"]["sourcePackages"].pop()
        with self.assertRaises(adb.BundleError):
            self.load(whole)
        whole = copy.deepcopy(self.whole)
        source = whole["linuxArm64Adb"]["sourcePackages"][0]
        source["files"] = [f for f in source["files"] if not f["url"].endswith(".dsc")]
        with self.assertRaisesRegex(adb.BundleError, "descriptor"):
            self.load(whole)

    def test_rejects_untrusted_origin_bad_hash_size_and_architecture(self):
        for key, value in (("url", "https://example.com/adb.deb"), ("sha256", "0" * 63),
                           ("size", True), ("size", adb.MAX_ARTIFACT + 1), ("architecture", "amd64")):
            with self.subTest(key=key, value=value):
                whole = copy.deepcopy(self.whole)
                whole["linuxArm64Adb"]["binaryPackages"][0][key] = value
                with self.assertRaises(adb.BundleError):
                    self.load(whole)

    def test_rejects_signature_authority_change(self):
        self.whole["linuxArm64Adb"]["signingFingerprints"] = ["0" * 40]
        with self.assertRaises(adb.BundleError):
            self.load(self.whole)


class ArchiveTests(unittest.TestCase):
    def test_relative_links_and_parent_directory_links_are_materialized(self):
        tree = adb.PackageTree()
        tree.add_tar(archive([
            ("./usr/lib/real.so.1.2", b"ELF"),
            ("usr/lib/lib.so.1", (tarfile.SYMTYPE, "real.so.1.2")),
            ("usr/share/doc/base/copyright", b"license"),
            ("usr/share/doc/lib", (tarfile.SYMTYPE, "base")),
            ("usr/bin/adb", (tarfile.SYMTYPE, "../lib/real.so.1.2")),
        ]))
        self.assertEqual(tree.resolve("usr/lib/lib.so.1"), ("usr/lib/real.so.1.2", b"ELF"))
        self.assertEqual(tree.resolve("usr/share/doc/lib/copyright")[1], b"license")
        self.assertEqual(tree.resolve("usr/bin/adb")[1], b"ELF")

    def test_internal_hardlinks_are_resolved(self):
        tree = adb.PackageTree()
        tree.add_tar(archive([("a", b"value"), ("b", (tarfile.LNKTYPE, "a"))]))
        self.assertEqual(tree.resolve("b"), ("a", b"value"))

    def test_rejects_unsafe_archive_paths(self):
        for path in ("/absolute", "../escape", "a/../../b", "a//b", "a\\b", "a/./b", "a\nb"):
            with self.subTest(path=path), self.assertRaises(adb.BundleError):
                adb.PackageTree().add_tar(archive([(path, b"x")]))

    def test_rejects_absolute_escaping_cyclic_and_missing_links(self):
        for target in ("/etc/passwd", "../../escape", "a"):
            with self.subTest(target=target), self.assertRaises(adb.BundleError):
                tree = adb.PackageTree()
                tree.add_tar(archive([("a", (tarfile.SYMTYPE, target))]))
                tree.resolve("a")
        tree = adb.PackageTree()
        tree.add_tar(archive([("a", (tarfile.SYMTYPE, "missing"))]))
        with self.assertRaises(adb.BundleError):
            tree.resolve("a")

    def test_rejects_special_files_conflicts_and_directory_through_file(self):
        with self.assertRaises(adb.BundleError):
            adb.PackageTree().add_tar(archive([("fifo", (tarfile.FIFOTYPE, ""))]))
        tree = adb.PackageTree()
        tree.add_tar(archive([("a", b"first")]))
        with self.assertRaises(adb.BundleError):
            tree.add_tar(archive([("a", b"different")]))
        with self.assertRaises(adb.BundleError):
            tree.resolve("a/child")

    def test_entry_and_tree_budgets_are_enforced(self):
        with mock.patch.object(adb, "MAX_ENTRY", 2), self.assertRaises(adb.BundleError):
            adb.PackageTree().add_tar(archive([("a", b"abc")]))
        with mock.patch.object(adb, "MAX_TREE", 3), self.assertRaises(adb.BundleError):
            adb.PackageTree().add_tar(archive([("a", b"ab"), ("b", b"cd")]))


class ElfTests(unittest.TestCase):
    def test_native_header_and_readelf_fixture(self):
        adb.validate_elf_header(elf_header())
        result = adb.parse_readelf(elf_text(("libbase.so.0", "libc.so.6"), interpreter=adb.INTERPRETER), True)
        self.assertEqual(result["needed"], ["libbase.so.0", "libc.so.6"])
        self.assertEqual(result["glibcVersions"], ["GLIBC_2.38"])

    def test_rejects_x64_relabeling_wrong_class_endianness_and_truncation(self):
        for data in (elf_header(62), elf_header(bits=1), elf_header(endian=2), b"ELF", b"MZ" + bytes(64)):
            with self.subTest(data=data[:6]), self.assertRaises(adb.BundleError):
                adb.validate_elf_header(data)

    def test_rejects_unknown_abi_private_symbols_and_high_glibc(self):
        for version in ("GLIBC_2.39", "GLIBC_3.0", "GLIBC_PRIVATE", "GLIBC_FUTURE"):
            with self.subTest(version=version), self.assertRaises(adb.BundleError):
                adb.parse_readelf(elf_text(version=version))
        adb.parse_readelf(elf_text(version="GLIBC_ABI_DT_RELR"))

    def test_rejects_rpath_unsafe_needed_and_wrong_interpreter(self):
        for text in (elf_text() + "\n0x1 (RPATH) Library rpath: [/tmp]",
                     elf_text(("../../lib.so.1",)), elf_text(interpreter="/tmp/loader"),
                     elf_text() + "\n0x1 (RUNPATH) Library runpath: [$ORIGIN/elsewhere]"):
            with self.subTest(text=text), self.assertRaises(adb.BundleError):
                adb.parse_readelf(text)
        with self.assertRaises(adb.BundleError):
            adb.parse_readelf(elf_text(), True)
        adb.parse_readelf(elf_text() + "\n0x1 (RUNPATH) Library runpath: [/usr/lib/aarch64-linux-gnu/android]")

    def test_complete_transitive_closure_prunes_unused_libraries(self):
        libraries = {
            "liba.so.1": {"elf": {"needed": ["libb.so.1", "libc.so.6"]}},
            "libb.so.1": {"elf": {"needed": ["liba.so.1", "libm.so.6", "ld-linux-aarch64.so.1"]}},
            "unused.so.1": {"elf": {"needed": ["libc.so.6"]}},
        }
        self.assertEqual(set(adb.dependency_closure({"needed": ["liba.so.1"]}, libraries)),
                         {"liba.so.1", "libb.so.1"})

    def test_missing_dependency_does_not_fall_back_to_host_library(self):
        with self.assertRaisesRegex(adb.BundleError, "Unresolved"):
            adb.dependency_closure({"needed": ["libusb-1.0.so.0"]}, {})


class FetchTests(TemporaryTest):
    def test_verified_cached_artifact_never_calls_network(self):
        target = self.root / "cached"
        target.write_bytes(b"data")
        with mock.patch.object(adb, "command") as command:
            self.assertEqual(adb.fetch(adb.ROOT_URL + "pool/main/a/file", target, 4, hashed(b"data")), target)
        command.assert_not_called()

    def test_poisoned_cache_and_cache_symlinks_fail_closed(self):
        target = self.root / "cached"
        target.write_bytes(b"fake")
        with mock.patch.object(adb, "command") as command:
            with self.assertRaises(adb.BundleError):
                adb.fetch(adb.ROOT_URL + "pool/main/a/file", target, 4, hashed(b"real"))
            link = self.root / "link"
            link.symlink_to(target)
            with self.assertRaises(OSError):
                adb.fetch(adb.ROOT_URL + "pool/main/a/file", link, 4, hashed(b"fake"))
        command.assert_not_called()

    def test_download_verifies_bytes_and_rejects_redirects(self):
        def download(args, **kwargs):
            Path(args[args.index("--output") + 1]).write_bytes(b"data")
            self.assertNotIn("--location", args)
            return subprocess.CompletedProcess(args, 0, b"200")
        target = self.root / "good"
        with mock.patch.object(adb, "command", side_effect=download):
            adb.fetch(adb.ROOT_URL + "pool/main/a/file", target, 4, hashed(b"data"))
        self.assertEqual(target.read_bytes(), b"data")
        with mock.patch.object(adb, "command", return_value=subprocess.CompletedProcess([], 0, b"302")):
            with self.assertRaises(adb.BundleError):
                adb.fetch(adb.ROOT_URL + "pool/main/a/file", self.root / "redirect", 4)
        self.assertEqual(sorted(p.name for p in self.root.iterdir()), ["good"])

    def test_download_rejects_wrong_origin_and_wrong_bytes(self):
        with self.assertRaises(adb.BundleError):
            adb.fetch("https://example.com/file", self.root / "x", 4)
        def bad(args, **kwargs):
            Path(args[args.index("--output") + 1]).write_bytes(b"fake")
            return subprocess.CompletedProcess(args, 0, b"200")
        with mock.patch.object(adb, "command", side_effect=bad), self.assertRaises(adb.BundleError):
            adb.fetch(adb.ROOT_URL + "pool/main/a/file", self.root / "bad", 4, hashed(b"data"))
        self.assertEqual(list(self.root.iterdir()), [])


class MetadataTests(TemporaryTest):
    def signed_command(self, text, signer=adb.SIGNER, returncode=0):
        def run(args, **kwargs):
            if returncode:
                raise adb.BundleError("gpgv failed")
            Path(args[args.index("--output") + 1]).write_text(text)
            return subprocess.CompletedProcess(args, 0, ("[GNUPG:] VALIDSIG " + signer + " 2024-04-25\n").encode())
        return run

    def verify(self, text, **kwargs):
        with mock.patch.object(adb, "command", side_effect=self.signed_command(text, **kwargs)):
            return adb.verify_release(self.root / "InRelease", self.root / "Release", self.root, "noble",
                                      datetime.datetime(2026, 11, 2, tzinfo=datetime.timezone.utc))

    def test_gpg_status_and_release_identity_are_required(self):
        fields, hashes = self.verify(release_text())
        self.assertEqual(fields["Origin"], "Ubuntu")
        self.assertIn("main/binary-arm64/Packages.xz", hashes)
        for changes in ({"signer": "0" * 40}, {"returncode": 1}):
            with self.assertRaises(adb.BundleError):
                self.verify(release_text(), **changes)
        for changes in ({"Origin": "Other"}, {"Suite": "jammy"}, {"Codename": "jammy"},
                        {"Architectures": "amd64"}, {"Date": "Thu, 25 Apr 2030 15:10:33 UTC"},
                        {"Valid-Until": "Thu, 25 Apr 2024 15:10:33 UTC"}):
            with self.subTest(changes=changes), self.assertRaises(adb.BundleError):
                self.verify(release_text(**changes))

    def fixture(self):
        binary_data = b"deb"
        binary = {"name": "adb", "version": "1:34.0.4-1build3", "architecture": "arm64",
                  "url": adb.ROOT_URL + "pool/main/a/adb_34.0.4-1build3_arm64.deb",
                  **hashed(binary_data), "depends": "libc6 (>= 2.38)",
                  "source": {"name": "android-platform-tools", "version": "34.0.4-1build3"},
                  "index": {"suite": "noble", "component": "main"}}
        files = [{"url": adb.ROOT_URL + "pool/main/a/" + name, **hashed(name.encode())}
                 for name in ("source.dsc", "source.orig.tar.xz", "source.debian.tar.xz")]
        source = {"name": "android-platform-tools", "version": "34.0.4-1build3",
                  "index": binary["index"], "files": files}
        binary_text = ("Package: adb\nVersion: " + binary["version"] + "\nArchitecture: arm64\n"
                       "Source: android-platform-tools (34.0.4-1build3)\nFilename: pool/main/a/adb_34.0.4-1build3_arm64.deb\n"
                       "SHA256: " + binary["sha256"] + "\nSize: 3\nDepends: libc6 (>= 2.38)\n")
        source_text = "Package: android-platform-tools\nVersion: 34.0.4-1build3\nDirectory: pool/main/a\nChecksums-Sha256:\n"
        for f in files:
            source_text += " " + f["sha256"] + " " + str(f["size"]) + " " + adb.artifact_name(f) + "\n"
        indexes = {"main/binary-arm64/Packages.xz": lzma.compress(binary_text.encode()),
                   "main/source/Sources.xz": lzma.compress(source_text.encode())}
        directory = self.root / "metadata/noble"
        directory.mkdir(parents=True)
        (directory / "InRelease").write_bytes(b"synthetic signature - command is mocked")
        (self.root / "indexes").mkdir()
        for data in indexes.values():
            (self.root / "indexes" / (hashed(data)["sha256"] + ".xz")).write_bytes(data)
        return {"binaryPackages": [binary], "sourcePackages": [source]}, release_text(
            {name: hashed(data) for name, data in indexes.items()})

    def test_signed_binary_and_full_source_chain_fixture(self):
        lock, text = self.fixture()
        with mock.patch.object(adb, "command", side_effect=self.signed_command(text)) as run:
            evidence = adb.authenticate(lock, self.root, self.root)
        self.assertEqual(len(evidence), 3)
        self.assertEqual(run.call_count, 1)
        self.assertEqual(evidence[0]["signer"], adb.SIGNER)

    def test_metadata_hash_mismatch_is_rejected_before_parsing(self):
        lock, text = self.fixture()
        next((self.root / "indexes").iterdir()).write_bytes(b"tampered")
        with mock.patch.object(adb, "command", side_effect=self.signed_command(text)):
            with self.assertRaises(adb.BundleError):
                adb.authenticate(lock, self.root, self.root)

    def test_incomplete_sources_or_binary_identity_fail_closed(self):
        lock, text = self.fixture()
        lock["sourcePackages"][0]["files"].pop()
        with mock.patch.object(adb, "command", side_effect=self.signed_command(text)):
            with self.assertRaisesRegex(adb.BundleError, "source package"):
                adb.authenticate(lock, self.root, self.root)
        lock["binaryPackages"][0]["source"]["version"] = "different"
        with mock.patch.object(adb, "command", side_effect=self.signed_command(text)):
            with self.assertRaisesRegex(adb.BundleError, "binary"):
                adb.authenticate(lock, self.root, self.root)

    def test_missing_locked_version_is_not_silently_upgraded(self):
        lock, text = self.fixture()
        lock["binaryPackages"][0]["version"] = "new-version"
        with mock.patch.object(adb, "command", side_effect=self.signed_command(text)):
            with self.assertRaisesRegex(adb.BundleError, "refresh the lock"):
                adb.authenticate(lock, self.root, self.root)

    def test_control_parser_rejects_duplicates_unattached_lines_and_budgets(self):
        for text in ("Package: a\nPackage: b\n", " continuation\n", "invalid\n"):
            with self.subTest(text=text), self.assertRaises(adb.BundleError):
                list(adb.control_records(io.StringIO(text)))
        with self.assertRaises(adb.BundleError):
            list(adb.control_records(io.StringIO("Package: abc\n"), maximum=3))

    def test_real_universe_index_sized_line_fits_bounded_parser(self):
        text = "Package: librust-winapi-dev\nProvides: " + "a" * 71000 + "\n"
        self.assertEqual(next(adb.control_records(io.StringIO(text)))["Package"], "librust-winapi-dev")
        with self.assertRaises(adb.BundleError):
            list(adb.control_records(io.StringIO("Package: a\nProvides: " + "a" * (129 * 1024))))


class OutputTests(TemporaryTest):
    def test_package_reader_only_requests_data_tar_no_install_or_maintainer_execution(self):
        def data_tool(args, **kwargs):
            self.assertEqual(args, ["dpkg-deb", "--fsys-tarfile", "fixture.deb"])
            kwargs["stdout"].write(archive([("usr/lib/file", b"data")]).getvalue())
            return subprocess.CompletedProcess(args, 0)
        tree = adb.PackageTree()
        with mock.patch.object(adb, "command", side_effect=data_tool):
            adb.read_package(Path("fixture.deb"), tree)
        self.assertEqual(tree.resolve("usr/lib/file")[1], b"data")

    def test_elf_inspection_does_not_execute_the_arm_binary(self):
        binary = self.root / "adb"
        binary.write_bytes(elf_header())
        result = subprocess.CompletedProcess([], 0, elf_text(interpreter=adb.INTERPRETER).encode())
        with mock.patch.object(adb, "command", return_value=result) as command:
            info = adb.inspect_elf(binary, executable=True)
        self.assertEqual(command.call_args.args[0][0], "readelf")
        self.assertEqual(command.call_args.args[0][-1], str(binary))
        self.assertEqual(info["needed"], ["libc.so.6"])

    def test_copy_rejects_links_and_modified_original_artifacts(self):
        source = self.root / "source"
        source.write_bytes(b"original")
        link = self.root / "link"
        link.symlink_to(source)
        output = self.root / "output"
        output.mkdir()
        with self.assertRaises(OSError):
            adb.copy_checked(output, "copy", link, hashed(b"original"))
        with self.assertRaises(adb.BundleError):
            adb.copy_checked(output, "different", source, hashed(b"tampered"))

    def test_fixture_assembly_preserves_sources_notices_aliases_and_provenance(self):
        output, work, common = self.root / "output", self.root / "work", self.root / "common"
        output.mkdir()
        work.mkdir()
        common.mkdir()
        (common / "GPL-2").write_text("full common license fixture")
        binary_data, source_data = b"deb bytes", b"compressed source fixture"
        binary_file, source_file = self.root / "binary", self.root / "source"
        binary_file.write_bytes(binary_data)
        source_file.write_bytes(source_data)
        binary = {"name": "adb", "version": "1:34.0.4-1build3", **hashed(binary_data),
                  "url": adb.ROOT_URL + "pool/main/a/adb_34.0.4-1build3_arm64.deb"}
        source = {"url": adb.ROOT_URL + "pool/main/a/source.orig.tar.xz", **hashed(source_data)}
        lock = {"binaryPackages": [binary], "sourcePackages": [{"name": "source", "files": [source]}],
                "distribution": {"id": "ubuntu", "versionId": "24.04", "glibcMinimum": "2.38"}}
        def read_package(path, tree):
            tree.add_tar(archive([
                ("usr/lib/android-sdk/platform-tools/adb", elf_header()),
                ("usr/lib/aarch64-linux-gnu/android/libbase.so.0.0", elf_header() + b"library"),
                ("usr/lib/aarch64-linux-gnu/android/libbase.so.0", (tarfile.SYMTYPE, "libbase.so.0.0")),
                ("usr/share/doc/adb/copyright", b"License: GPL-2\nSee /usr/share/common-licenses/GPL-2\n"),
            ]))
        def inspect(path, executable=False):
            return adb.parse_readelf(elf_text(
                ("libbase.so.0", "libc.so.6") if executable else ("libc.so.6",),
                soname=None if executable else "libbase.so.0",
                interpreter=adb.INTERPRETER if executable else None), executable)
        copy_licenses = adb.copy_licenses
        with mock.patch.object(adb, "read_package", side_effect=read_package), \
                mock.patch.object(adb, "inspect_elf", side_effect=inspect), \
                mock.patch.object(adb, "copy_licenses", side_effect=lambda t, b, o: copy_licenses(t, b, o, common)):
            result = adb.assemble(lock, output, self.root, [],
                                  {binary["url"]: binary_file, source["url"]: source_file}, work)
        self.assertEqual((output / "adb").read_bytes(), elf_header())
        self.assertTrue((output / "adb").stat().st_mode & stat.S_IXUSR)
        self.assertFalse((output / "lib64/libbase.so.0").is_symlink())
        self.assertEqual((output / "sources/source/source.orig.tar.xz").read_bytes(), source_data)
        self.assertIn("GPL-2", (output / "NOTICE.txt").read_text())
        self.assertEqual((output / "licenses/common/GPL-2").read_text(), "full common license fixture")
        self.assertFalse(result["licensing"]["uniformApache2"])
        self.assertIn("Pkg.Revision=34.0.4", (output / "source.properties").read_text())
        self.assertEqual(json.loads((output / "sources/bundler/provider-lock.json").read_text())["linuxArm64Adb"], lock)
        self.assertTrue((output / "sources/bundler/linux-adb-licenses.md").is_file())
        for record in result["files"]:
            self.assertEqual(adb.digest(output / record["path"]), {k: record[k] for k in ("size", "sha256")})

    def test_unknown_common_license_and_escaping_license_symlink_are_rejected(self):
        for name in ("unknown", "GPL-2"):
            tree = adb.PackageTree()
            tree.add_tar(archive([("usr/share/doc/adb/copyright", (
                "See /usr/share/common-licenses/" + name).encode())]))
            output = self.root / name
            output.mkdir()
            common = self.root / "common"
            common.mkdir(exist_ok=True)
            if name == "GPL-2":
                (common / name).symlink_to(self.root / "outside")
                (self.root / "outside").write_text("not a trusted common license")
            with self.subTest(name=name), self.assertRaises(adb.BundleError):
                adb.copy_licenses(tree, [{"name": "adb", "version": "fixture"}], output, common)

    def test_host_guard_blocks_before_any_cache_or_output_creation(self):
        with mock.patch.object(adb.platform, "system", return_value="Darwin"):
            with self.assertRaisesRegex(adb.BundleError, "native Ubuntu"):
                adb.bundle(self.root / "output", self.root / "cache", self.root / "lock")
        self.assertEqual(list(self.root.iterdir()), [])

    def test_existing_output_is_preserved(self):
        output = self.root / "output"
        output.mkdir()
        (output / "user-data").write_text("preserve")
        with mock.patch.object(adb, "production_host"), mock.patch.object(adb, "load_lock", return_value={}):
            with self.assertRaisesRegex(adb.BundleError, "fresh root"):
                adb.bundle(output, self.root / "cache", self.root / "lock")
        self.assertEqual((output / "user-data").read_text(), "preserve")

    def test_failed_assembly_removes_only_the_owned_fresh_output(self):
        output = self.root / "output"
        cache = self.root / "cache"
        lock = {"binaryPackages": [], "sourcePackages": []}
        def fail(*args):
            (output / "partial").write_text("partial")
            raise adb.BundleError("incomplete source")
        with mock.patch.object(adb, "production_host"), mock.patch.object(adb, "load_lock", return_value=lock), \
                mock.patch.object(adb, "authenticate", return_value=[]), mock.patch.object(adb, "assemble", side_effect=fail):
            with self.assertRaisesRegex(adb.BundleError, "incomplete source"):
                adb.bundle(output, cache, self.root / "lock")
        self.assertFalse(output.exists())
        self.assertTrue(cache.is_dir())

    def test_host_tool_environment_is_sanitized_without_global_mutation(self):
        with mock.patch.dict(os.environ, {"LD_LIBRARY_PATH": "unsafe", "LD_PRELOAD": "preload",
                                         "LD_AUDIT": "audit", "LD_LIBRARY_PATH_ORIG": "orig"}):
            with mock.patch.object(adb.subprocess, "run", return_value=subprocess.CompletedProcess([], 0)) as run:
                adb.command(["readelf", "fixture"])
            child = run.call_args.kwargs["env"]
            self.assertFalse(any(name in child for name in (
                "LD_LIBRARY_PATH", "LD_PRELOAD", "LD_AUDIT", "LD_LIBRARY_PATH_ORIG")))
            self.assertEqual(child["LC_ALL"], "C")
            self.assertEqual(os.environ["LD_LIBRARY_PATH"], "unsafe")


if __name__ == "__main__":
    unittest.main()
