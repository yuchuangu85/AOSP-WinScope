import datetime as dt
import unittest

from scripts.npm_audit_policy import blocking_advisories, validate


def report(severity="high"):
    return {
        "vulnerabilities": {
            "root": {"severity": severity, "via": ["leaf"]},
            "leaf": {
                "severity": severity,
                "via": [
                    {
                        "source": 123,
                        "dependency": "leaf",
                        "severity": severity,
                    }
                ],
            },
        }
    }


class NpmAuditPolicyTest(unittest.TestCase):
    def test_resolves_transitive_advisory(self):
        self.assertEqual({("leaf", 123)}, set(blocking_advisories(report())))

    def test_accepts_current_build_only_exception(self):
        result = validate(
            {"vulnerabilities": {}},
            report(),
            {
                "exceptions": [
                    {
                        "source": 123,
                        "package": "leaf",
                        "severity": "high",
                        "expires": "2026-09-01",
                        "reason": "Build-only dependency with a verified unreachable parser.",
                    }
                ]
            },
            dt.date(2026, 8, 21),
        )
        self.assertTrue(result["passed"])

    def test_rejects_runtime_vulnerability(self):
        with self.assertRaisesRegex(ValueError, "runtime"):
            validate(report(), report(), {"exceptions": []}, dt.date(2026, 8, 21))

    def test_rejects_expired_exception(self):
        with self.assertRaisesRegex(ValueError, "expired"):
            validate(
                {"vulnerabilities": {}},
                report(),
                {
                    "exceptions": [
                        {
                            "source": 123,
                            "package": "leaf",
                            "severity": "high",
                            "expires": "2026-08-20",
                            "reason": "Build-only dependency with a verified unreachable parser.",
                        }
                    ]
                },
                dt.date(2026, 8, 21),
            )


if __name__ == "__main__":
    unittest.main()
