import importlib.util
import json
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("support", ROOT / "scripts/support.py")
support = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(support)


class SupportTest(unittest.TestCase):
    def write_index(self, root, version, status, track, updates, published_at, withdrawn=False, security_until=None, advisories=None):
        value = {
            "schemaVersion": 1,
            "product": "aosp-winscope",
            "version": version,
            "publishedAt": published_at,
            "support": {
                "status": status,
                "securityUpdates": updates,
                "baselineGeneration": int(version.split(".")[1]),
                "track": track,
                "securitySupportUntil": security_until if status == "security-transition" else None,
                "withdrawn": withdrawn,
                "withdrawal": {"reason": "test withdrawal", "effectiveAt": published_at} if withdrawn else None,
            },
            "securityResponse": {
                "schemaVersion": 1,
                "policy": support.POLICY,
                "advisories": advisories or [],
            },
        }
        path = root / f"{version}.json"
        path.write_text(json.dumps(value), encoding="utf-8")
        return path

    def test_current_and_previous_generation_policy(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            current = self.write_index(root, "17.1.0", "supported", "current", True, "2026-08-01T00:00:00Z")
            previous = self.write_index(root, "17.0.1", "security-transition", "previous", True, "2026-07-01T00:00:00Z", security_until="2026-10-30T00:00:00Z")
            old = self.write_index(root, "17.0.0", "eol", "eol", False, "2026-06-01T00:00:00Z")
            result = support.verify_policy(
                [current, previous, old],
                datetime(2026, 8, 20, tzinfo=timezone.utc),
            )
            self.assertEqual(result["statuses"]["17.1.0"], "supported")
            self.assertEqual(result["statuses"]["17.0.1"], "security-transition")
            self.assertEqual(result["statuses"]["17.0.0"], "eol")

    def test_withdrawn_release_is_not_supported(self):
        with tempfile.TemporaryDirectory() as temporary:
            path = self.write_index(
                Path(temporary), "17.0.0", "withdrawn", "withdrawn", False,
                "2026-08-01T00:00:00Z", withdrawn=True,
            )
            result = support.verify_policy([path], datetime.now(timezone.utc))
            self.assertEqual(result["statuses"]["17.0.0"], "withdrawn")

    def test_withdrawn_latest_previous_patch_does_not_block_older_patch(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            current = self.write_index(root, "17.1.0", "supported", "current", True, "2026-08-01T00:00:00Z")
            withdrawn = self.write_index(root, "17.0.1", "withdrawn", "withdrawn", False, "2026-07-01T00:00:00Z", withdrawn=True)
            previous = self.write_index(root, "17.0.0", "security-transition", "previous", True, "2026-06-01T00:00:00Z", security_until="2026-10-30T00:00:00Z")
            result = support.verify_policy([current, withdrawn, previous], datetime(2026, 8, 20, tzinfo=timezone.utc))
            self.assertEqual(result["statuses"]["17.0.0"], "security-transition")
            self.assertEqual(result["statuses"]["17.0.1"], "withdrawn")

    def test_withdrawing_first_successor_does_not_restart_transition_window(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            withdrawn = self.write_index(root, "17.1.0", "withdrawn", "withdrawn", False, "2026-08-01T00:00:00Z", withdrawn=True)
            current = self.write_index(root, "17.1.1", "supported", "current", True, "2026-09-01T00:00:00Z")
            previous = self.write_index(root, "17.0.0", "eol", "eol", False, "2026-07-01T00:00:00Z")
            result = support.verify_policy([withdrawn, current, previous], datetime(2026, 11, 1, tzinfo=timezone.utc))
            self.assertEqual(result["statuses"]["17.0.0"], "eol")

    def test_transition_ends_at_the_ninetieth_day(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            current = self.write_index(root, "17.1.0", "supported", "current", True, "2026-08-01T00:00:00Z")
            previous = self.write_index(root, "17.0.0", "eol", "eol", False, "2026-07-01T00:00:00Z")
            result = support.verify_policy([current, previous], datetime(2026, 10, 30, tzinfo=timezone.utc))
            self.assertEqual(result["statuses"]["17.0.0"], "eol")

    def test_successor_patch_does_not_restart_transition_window(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            first = self.write_index(root, "17.1.0", "eol", "eol", False, "2026-08-01T00:00:00Z")
            latest = self.write_index(root, "17.1.1", "supported", "current", True, "2026-09-01T00:00:00Z")
            previous = self.write_index(root, "17.0.0", "eol", "eol", False, "2026-07-01T00:00:00Z")
            result = support.verify_policy([first, latest, previous], datetime(2026, 11, 1, tzinfo=timezone.utc))
            self.assertEqual(result["statuses"]["17.0.0"], "eol")

    def test_release_index_requires_explicit_publication_time(self):
        with tempfile.TemporaryDirectory() as temporary:
            path = self.write_index(Path(temporary), "17.0.0", "supported", "current", True, "2026-08-01T00:00:00Z")
            value = json.loads(path.read_text())
            value.pop("publishedAt")
            value["sourceDateEpoch"] = 1
            path.write_text(json.dumps(value), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "publishedAt"):
                support.verify_policy([path], datetime(2026, 8, 20, tzinfo=timezone.utc))

    def test_android_eighteen_keeps_last_android_seventeen_generation_for_a_year(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            current = self.write_index(root, "18.0.0", "supported", "current", True, "2026-08-01T00:00:00Z")
            previous = self.write_index(root, "17.1.0", "security-transition", "previous", True, "2026-07-01T00:00:00Z", security_until="2027-08-01T00:00:00Z")
            result = support.verify_policy([current, previous], datetime(2027, 1, 1, tzinfo=timezone.utc))
            self.assertEqual(result["statuses"]["17.1.0"], "security-transition")

    def test_advisory_reference_is_digest_checked(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            advisory_path = root / "AWS-2026-0001.json"
            advisory_path.write_text(json.dumps({
                "schemaVersion": 1,
                "id": "AWS-2026-0001",
                "severity": "high",
                "status": "open",
                "publishedAt": "2026-08-01T00:00:00Z",
                "summary": "bounded test advisory",
                "affectedVersions": ["17.0.0"],
            }), encoding="utf-8")
            import hashlib
            reference = {"path": advisory_path.name, "sha256": hashlib.sha256(advisory_path.read_bytes()).hexdigest()}
            index = self.write_index(root, "17.0.0", "supported", "current", True, "2026-08-01T00:00:00Z", advisories=[reference])
            support.verify_policy([index], datetime(2026, 8, 20, tzinfo=timezone.utc))
            advisory_path.write_text(advisory_path.read_text() + "tamper", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "digest mismatch"):
                support.verify_policy([index], datetime(2026, 8, 20, tzinfo=timezone.utc))

    def test_advisory_rejects_non_object_artifact(self):
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "advisory.json"
            path.write_text(json.dumps({
                "schemaVersion": 1,
                "id": "AWS-2026-0001",
                "severity": "high",
                "status": "open",
                "publishedAt": "2026-08-01T00:00:00Z",
                "summary": "bounded test advisory",
                "affectedVersions": ["17.0.0"],
                "artifacts": ["bad"],
            }), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "artifact entry"):
                support.verify_advisory(path)

    def test_advisory_requires_fixed_version_when_resolved(self):
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "advisory.json"
            path.write_text(json.dumps({
                "schemaVersion": 1,
                "id": "AWS-2026-0001",
                "severity": "high",
                "status": "fixed",
                "publishedAt": "2026-08-01T00:00:00Z",
                "summary": "bounded test advisory",
                "affectedVersions": ["17.0.0"],
            }), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "fixedVersion"):
                support.verify_advisory(path)


if __name__ == "__main__":
    unittest.main()
