# Security response and release support

AOSP-WinScope publishes support state as release evidence. The launcher never
contacts an update or advisory service, and published bytes are immutable.
APS can retain and inspect the release index, advisory files, checksums, SBOM,
and provenance offline.

## Support states

`support.py` evaluates all stable release indexes supplied with `--index`:

- the latest patch of the newest baseline generation is `supported`;
- the latest patch of the immediately previous generation is
  `security-transition` for 90 days after the successor stable release;
- when Android 18 becomes stable, the latest Android 17 generation remains in
  `security-transition` for 12 months after that successor release;
- older or superseded patches are `eol`;
- alpha/RC releases are `prerelease` and receive no formal security support;
- a withdrawn release is `withdrawn` and retains its evidence.

The index records `baselineGeneration`, `track`, `securityUpdates`, and the
optional `securitySupportUntil` deadline. A withdrawn index also records a
reason and effective timestamp under `support.withdrawal`.

## Response targets

The signed release evidence uses this policy for confirmed findings:

- Critical: assess within 24 hours; fix or mitigate within 72 hours;
- High: assess within three working days; fix within seven working days.

The policy is recorded in `securityResponse.policy`; advisory references are
kept in `securityResponse.advisories`. An advisory is schema-versioned and
contains an identifier, severity, lifecycle status, publication time, summary,
affected versions, and a fixed version when resolved. Referenced artifacts
are basename-only and SHA-256 verified locally.

## Verification

`publishedAt` is an explicit release-event timestamp; `sourceDateEpoch`
continues to describe the reproducible source inputs. Verify one or more
release indexes without network access:

```sh
python3 scripts/support.py verify \
  --index dist/public/17.0.0-rc.1/release-index.json \
  --index dist/public/17.0.0/release-index.json \
  --json
```

Verify standalone advisory evidence:

```sh
python3 scripts/support.py verify-advisory \
  --advisory path/to/AWS-2026-0001.json --json
```
