import json
import os
import re
import subprocess
import tempfile
import textwrap
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT / ".github/workflows/electron.yml"


class ElectronWorkflowTest(unittest.TestCase):
    def setUp(self):
        self.workflow = WORKFLOW.read_text(encoding="utf-8")

    def job(self, name):
        match = re.search(
            rf"^  {re.escape(name)}:\n(.*?)(?=^  [\w-]+:|\Z)",
            self.workflow,
            re.MULTILINE | re.DOTALL,
        )
        self.assertIsNotNone(match, name)
        return match.group(1)

    def step(self, job, marker):
        matches = [
            step for step in re.split(r"(?=^      - )", job, flags=re.MULTILINE)
            if marker in step
        ]
        self.assertEqual(len(matches), 1, marker)
        return matches[0]

    def test_manual_pr_and_reusable_triggers_expose_optional_inputs_and_verified_output(self):
        triggers = self.workflow.split("\npermissions:", 1)[0]
        for trigger in ("workflow_dispatch:", "pull_request:", "workflow_call:"):
            self.assertIn(trigger, triggers)
        for name in ("release-version", "shared-artifact"):
            self.assertIn(
                f'{name}:\n        type: string\n        required: false\n        default: ""',
                triggers,
            )
        self.assertIn("value: ${{ jobs.bundle.outputs.publication-artifact }}", triggers)
        self.assertIn(".github/workflows/official-release.yml", triggers)
        self.assertIn("tests/test_electron_workflow.py", triggers)
        self.assertNotIn("push:", triggers)
        self.assertNotIn("pull_request_target:", triggers)

    def test_actions_are_immutable_and_every_job_is_read_only_without_credentials(self):
        self.assertIn("permissions:\n  contents: read", self.workflow)
        uses = re.findall(r"^\s+(?:- )?uses: ([^\s]+)", self.workflow, re.MULTILINE)
        self.assertGreater(len(uses), 5)
        for action in uses:
            self.assertRegex(action, r"^[^@]+@[0-9a-f]{40}$")
        for forbidden in (
            ": write", "secrets.", "secrets: inherit", "GH_TOKEN", "GITHUB_TOKEN",
            "gh release", "actions/attest@", "git push", "--publish always",
            "--publish onTag", "--publish onTagOrDraft",
        ):
            self.assertNotIn(forbidden, self.workflow)
        checkouts = re.findall(r"uses: actions/checkout@", self.workflow)
        self.assertEqual(len(checkouts), self.workflow.count("persist-credentials: false"))
        self.assertIn('CSC_IDENTITY_AUTO_DISCOVERY: "false"', self.job("native"))

    def test_plan_always_checks_out_and_uses_cli_outputs_before_native_work(self):
        plan = self.job("plan")
        self.assertNotIn("    if:", plan)
        self.assertLess(plan.index("actions/checkout@"), plan.index("actions/setup-node@"))
        self.assertLess(plan.index("actions/setup-node@"), plan.index("node desktop/release.mjs plan"))
        for output in ("version", "matrix", "publication-artifact"):
            self.assertIn(f"{output}: ${{{{ steps.plan.outputs.{output} }}}}", plan)
        self.assertIn("RELEASE_VERSION: ${{ inputs.release-version }}", plan)
        self.assertNotIn("npm ci", plan)
        self.assertNotIn("npm run build", plan)

    def test_plan_forwards_optional_version_to_cli_gate_as_a_single_argument(self):
        step = self.step(self.job("plan"), "id: plan")
        script = textwrap.dedent(step.split("        run: |\n", 1)[1])
        for version in ("", "17.0.1", "17.0.999", "invalid version; exit 90"):
            with self.subTest(version=version):
                result = subprocess.run(
                    ["bash", "-c", 'node() { printf "%s\\0" "$@"; }\n' + script],
                    cwd=ROOT,
                    env={**os.environ, "RELEASE_VERSION": version, "GITHUB_SHA": "a" * 40,
                         "GITHUB_OUTPUT": "workflow outputs"},
                    capture_output=True,
                    text=True,
                    check=True,
                )
                arguments = result.stdout.rstrip("\0").split("\0")
                expected = ["desktop/release.mjs", "plan", "--commit", "a" * 40,
                            "--github-output", "workflow outputs"]
                if version:
                    expected += ["--version", version]
                self.assertEqual(arguments, expected)

    def test_five_native_targets_come_from_ssot_with_native_python_on_every_arm(self):
        result = subprocess.run(
            ["node", "-e", 'console.log(JSON.stringify(require("./desktop/app/targets.cjs").matrix()))'],
            cwd=ROOT, capture_output=True, text=True, check=True,
        )
        matrix = json.loads(result.stdout)
        expected_runners = {
            "darwin-x64": "macos-15-intel", "darwin-arm64": "macos-15",
            "win32-x64": "windows-2025",
            "linux-x64": "ubuntu-22.04", "linux-arm64": "ubuntu-24.04-arm",
        }
        self.assertEqual(len(matrix["include"]), 5)
        self.assertEqual({row["target"]: row["runner"] for row in matrix["include"]}, expected_runners)
        for row in matrix["include"]:
            self.assertEqual(row["target"], f'{row["platform"]}-{row["arch"]}')
            self.assertEqual(row["python"], row["arch"])
        native = self.job("native")
        self.assertIn("matrix: ${{ fromJSON(needs.plan.outputs.matrix) }}", native)
        self.assertIn("runs-on: ${{ matrix.runner }}", native)
        self.assertNotIn("include:", native)
        self.assertNotIn("- runner:", native)

    def test_shared_build_runs_once_only_without_a_supplied_artifact(self):
        shared = self.job("shared")
        self.assertIn("needs: plan", shared)
        self.assertIn("if: inputs.shared-artifact == ''", shared)
        for command in ("npm run build:prod", "npm run ai:build"):
            self.assertEqual(self.workflow.count(command), 1)
            self.assertIn(command, shared)
        bundler_tests = "python3 -m unittest discover -s desktop -p '*_test.py'"
        self.assertEqual(shared.count(bundler_tests), 1)
        self.assertLess(shared.index(bundler_tests), shared.index("name: electron-shared-${{ github.sha }}"))
        self.assertIn("name: electron-shared-${{ github.sha }}", shared)
        self.assertIn("path: |\n            dist/prod\n            ai/dist", shared)
        native = self.job("native")
        self.assertIn("needs: [plan, shared]", native)
        self.assertIn(
            "if: ${{ always() && needs.plan.result == 'success' && "
            "(needs.shared.result == 'success' || needs.shared.result == 'skipped') }}",
            native,
        )
        restore = self.step(native, "actions/download-artifact@")
        self.assertIn("name: ${{ inputs.shared-artifact || format('electron-shared-{0}', github.sha) }}", restore)
        self.assertIn("path: .", restore)
        for cross_run_option in ("run-id:", "github-token:", "repository:"):
            self.assertNotIn(cross_run_option, restore)
        self.assertIn("node desktop/prepare.mjs --skip-web-build", native)
        self.assertNotIn("npm run build:prod", native)
        self.assertNotIn("npm run ai:build", native)

    def test_native_toolchains_and_host_checks_match_the_planned_target(self):
        native = self.job("native")
        self.assertIn("architecture: ${{ matrix.arch }}", self.step(native, "actions/setup-node@"))
        self.assertIn("architecture: ${{ matrix.python }}", self.step(native, "actions/setup-python@"))
        for value in (
            "DESKTOP_TARGET: ${{ matrix.target }}",
            "DESKTOP_VERSION: ${{ needs.plan.outputs.version }}",
            "assert.equal(process.platform, process.env.DESKTOP_PLATFORM)",
            "assert.equal(process.arch, process.env.DESKTOP_ARCH)",
            "assert.equal(pkg.version, process.env.DESKTOP_VERSION)",
        ):
            self.assertIn(value, native)
        self.assertIn('[[ "$DESKTOP_ARCH" == x64 ]] || suffix="-$DESKTOP_ARCH"', native)
        self.assertIn('app="$output/win${suffix}-unpacked"', native)
        self.assertIn('app="$output/linux${suffix}-unpacked"', native)

    def test_unpacked_resolver_selects_x64_and_arm64_apps_without_windows_helper_guessing(self):
        resolver = self.step(self.job("native"), "name: Resolve the actual unpacked application executable")
        script = textwrap.dedent(resolver.split("        run: |\n", 1)[1])
        self.assertIn('apps=("$output"/mac*/*.app)', resolver)
        self.assertIn('from "./desktop/electron-builder.cjs"', resolver)
        self.assertNotIn('"$app"/*.exe', resolver)
        for platform, arch, exists, override in (
            ("Windows", "x64", True, False), ("Windows", "arm64", True, False),
            ("Linux", "x64", True, False), ("Linux", "arm64", True, False),
            ("Windows", "x64", False, False), ("Windows", "arm64", False, False),
            ("Linux", "x64", False, False), ("Linux", "arm64", False, False),
            ("Windows", "arm64", True, True),
        ):
            with self.subTest(platform=platform, arch=arch, exists=exists, override=override):
                with tempfile.TemporaryDirectory(prefix="winscope unpacked ") as temporary:
                    root = Path(temporary)
                    config = {"productName": "AOSP WinScope"}
                    if override:
                        config["win"] = {"executableName": "Trace Inspector"}
                    (root / "desktop").mkdir()
                    (root / "desktop/electron-builder.cjs").write_text(
                        "module.exports = async () => (" + json.dumps(config) + ");\n",
                        encoding="utf-8",
                    )
                    expected_name = (
                        ("Trace Inspector.exe" if override else "AOSP WinScope.exe")
                        if platform == "Windows" else "aosp-winscope-desktop"
                    )
                    for fixture_arch in ("x64", "arm64"):
                        suffix = "" if fixture_arch == "x64" else "-arm64"
                        prefix = "win" if platform == "Windows" else "linux"
                        app = root / f"dist/desktop/packages/{prefix}{suffix}-unpacked"
                        app.mkdir(parents=True)
                        helpers = (
                            ("chrome_crashpad_handler.exe", "elevate.exe", "unrelated.exe", "AOSP-WinScope.exe")
                            if platform == "Windows" else ("chrome_crashpad_handler", "chrome-sandbox", "libEGL.so", "libtest.so.1")
                        )
                        for filename in (*helpers, *((expected_name,) if exists else ())):
                            (app / filename).write_bytes(b"fixture")
                            (app / filename).chmod(0o755)
                    output = root / "github-output"
                    result = subprocess.run(
                        ["bash", "-c", script], cwd=root,
                        env={**os.environ, "RUNNER_OS": platform, "DESKTOP_ARCH": arch,
                             "GITHUB_OUTPUT": str(output)},
                        capture_output=True, text=True, check=False,
                    )
                    if not exists:
                        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                        self.assertIn(
                            "Missing packaged application executable" if platform == "Windows"
                            else "Expected one unpacked Linux application executable",
                            result.stderr,
                        )
                        self.assertFalse(output.exists())
                        continue
                    self.assertEqual(result.returncode, 0, result.stderr)
                    prefix = "win" if platform == "Windows" else "linux"
                    suffix = "" if arch == "x64" else "-arm64"
                    expected_app = f"dist/desktop/packages/{prefix}{suffix}-unpacked"
                    self.assertEqual(
                        output.read_text(encoding="utf-8"),
                        f"app={expected_app}\nexecutable={expected_app}/{expected_name}\n",
                    )

    def test_linux_prerequisites_precede_prepare_and_packaged_smoke_retains_sandbox(self):
        native = self.job("native")
        tools = self.step(native, "name: Install Linux packaging and smoke tools")
        self.assertIn("if: runner.os == 'Linux'", tools)
        self.assertLess(tools.index("sudo apt-get update"), tools.index("sudo apt-get install"))
        self.assertIn("sudo apt-get install -y binutils gpgv xz-utils rpm xvfb", tools)
        self.assertNotIn("install -y adb", native)
        self.assertLess(native.index("sudo apt-get install"), native.index("assert.equal(process.platform"))
        self.assertLess(native.index("sudo apt-get install"), native.index("node desktop/prepare.mjs"))
        smoke = self.step(native, "name: Smoke the packaged runtime under Xvfb")
        self.assertIn('sudo chown root:root "$sandbox"', smoke)
        self.assertIn('sudo chmod 4755 "$sandbox"', smoke)
        self.assertIn('xvfb-run -a node desktop/smoke.mjs --executable "$PACKAGED_EXECUTABLE"', smoke)
        self.assertNotIn("--no-sandbox", native)

    def test_linux_prerequisites_select_audio_for_supported_ubuntu_only(self):
        tools = self.step(self.job("native"), "name: Install Linux packaging and smoke tools")
        script = textwrap.dedent(tools.split("        run: |\n", 1)[1])
        self.assertEqual(script.count(". /etc/os-release"), 1)
        script = script.replace(". /etc/os-release", '. "$OS_RELEASE_FIXTURE"')
        stub = 'sudo() { printf "%s\\0" "$@"; }\n'
        expected_packages = {
            "binutils", "gpgv", "xz-utils", "rpm", "xvfb", "ubuntu-keyring", "base-files", "dpkg",
            "libgtk-3-0", "libnss3", "libgbm1", "libxss1", "libdrm2", "libxkbcommon0",
            "libnotify4", "libatspi2.0-0",
        }
        for distro, version, audio in (
            ("ubuntu", "22.04", "libasound2"), ("ubuntu", "24.04", "libasound2t64"),
            ("ubuntu", "26.04", None), ("debian", "24.04", None),
        ):
            with self.subTest(distro=distro, version=version):
                with tempfile.TemporaryDirectory(prefix="winscope ubuntu ") as temporary:
                    fixture = Path(temporary) / "os-release"
                    fixture.write_text(f'ID={distro}\nVERSION_ID="{version}"\n', encoding="utf-8")
                    result = subprocess.run(
                        ["bash", "-c", stub + script], cwd=temporary,
                        env={**os.environ, "OS_RELEASE_FIXTURE": str(fixture)},
                        capture_output=True, text=True, check=False,
                    )
                if audio is None:
                    self.assertEqual(result.returncode, 1, result.stderr)
                    self.assertIn("Unsupported Linux distribution", result.stderr)
                    self.assertEqual(result.stdout, "")
                    continue
                self.assertEqual(result.returncode, 0, result.stderr)
                arguments = result.stdout.rstrip("\0").split("\0")
                self.assertEqual(arguments[:5], ["apt-get", "update", "apt-get", "install", "-y"])
                self.assertCountEqual(arguments[5:], expected_packages | {audio})

    def test_record_follows_both_smoke_paths_and_all_installers_before_delivery_only_upload(self):
        native = self.job("native")
        positions = [native.index(marker) for marker in (
            "name: Package the unpacked application first",
            "name: Smoke the packaged runtime under Xvfb",
            "name: Smoke the packaged runtime natively",
            "name: Create installers from the smoke-tested unpacked app",
            "node desktop/release.mjs record",
            "name: Upload recorded installers without release publication",
        )]
        self.assertEqual(positions, sorted(positions))
        self.assertEqual(native.count("--publish never"), 2)
        record = self.step(native, "node desktop/release.mjs record")
        for argument in (
            '--target "$DESKTOP_TARGET"', '--version "$DESKTOP_VERSION"',
            '--commit "$GITHUB_SHA"', "--packages dist/desktop/packages",
            '--runtime "dist/desktop/runtime/$DESKTOP_TARGET"',
            "--evidence dist/validation/electron/packaged", "--output dist/desktop/delivery",
        ):
            self.assertIn(argument, record)
        self.assertNotIn("if:", record)
        self.assertNotIn("continue-on-error:", native)
        upload = self.step(native, "name: Upload recorded installers without release publication")
        self.assertIn("name: electron-installers-${{ matrix.target }}-${{ github.sha }}", upload)
        self.assertIn("path: dist/desktop/delivery", upload)
        self.assertIn("if-no-files-found: error", upload)
        self.assertNotIn("dist/desktop/packages", upload)
        self.assertNotIn("if:", upload)

    def test_privileged_file_mutations_only_touch_the_generated_packaged_sandbox(self):
        native = self.job("native")
        resolve = self.step(native, "name: Resolve the actual unpacked application executable")
        self.assertIn("output=dist/desktop/packages", resolve)
        self.assertIn('app="$output/linux${suffix}-unpacked"', resolve)
        smoke = self.step(native, "name: Smoke the packaged runtime under Xvfb")
        self.assertIn('sandbox="$(dirname "$PACKAGED_EXECUTABLE")/chrome-sandbox"', smoke)
        privileged = [line.strip() for line in self.workflow.splitlines() if line.strip().startswith("sudo ")]
        self.assertEqual(privileged, [
            "sudo apt-get update",
            "sudo apt-get install -y binutils gpgv xz-utils rpm xvfb \\",
            'sudo chown root:root "$sandbox"',
            'sudo chmod 4755 "$sandbox"',
        ])
        record = self.step(native, "node desktop/release.mjs record")
        self.assertNotIn("sudo", record)
        self.assertNotIn("git ", record)
        self.assertIn("--output dist/desktop/delivery", record)

    def test_bundle_requires_success_and_collects_separate_deliveries_then_reverifies(self):
        bundle = self.job("bundle")
        self.assertIn("needs: [native, plan]", bundle)
        self.assertIn(
            "if: ${{ always() && !cancelled() && needs.plan.result == 'success' && "
            "needs.native.result == 'success' }}",
            bundle,
        )
        self.assertNotIn("continue-on-error:", bundle)
        self.assertIn("publication-artifact: ${{ needs.plan.outputs.publication-artifact }}", bundle)
        download = self.step(bundle, "actions/download-artifact@")
        self.assertIn("pattern: electron-installers-*-${{ github.sha }}", download)
        self.assertIn("merge-multiple: false", download)
        self.assertIn("path: dist/desktop/downloaded", download)
        self.assertLess(bundle.index("node desktop/release.mjs collect"), bundle.index("node desktop/release.mjs verify"))
        self.assertLess(bundle.index("node desktop/release.mjs verify"), bundle.index("actions/upload-artifact@"))
        for argument in (
            "--artifacts dist/desktop/downloaded", '--output "$DESKTOP_PUBLICATION_DIR"',
            '--directory "$DESKTOP_PUBLICATION_DIR"', '--version "$DESKTOP_VERSION"',
            '--commit "$GITHUB_SHA"',
        ):
            self.assertIn(argument, bundle)
        upload = self.step(bundle, "actions/upload-artifact@")
        self.assertIn("name: ${{ needs.plan.outputs.publication-artifact }}", upload)
        self.assertIn("path: ${{ env.DESKTOP_PUBLICATION_DIR }}", upload)
        self.assertIn("if-no-files-found: error", upload)

    def test_bundle_condition_runs_after_skipped_shared_but_blocks_failure_and_cancellation(self):
        expressions = {}
        for name in ("native", "bundle"):
            match = re.search(r"^    if: \$\{\{ (.+) \}\}$", self.job(name), re.MULTILINE)
            self.assertIsNotNone(match, name)
            expressions[name] = match.group(1)
        scenarios = (
            ("local shared build", "success", "success", "success", False, True),
            ("provided artifact skips shared", "success", "skipped", "success", False, True),
            ("native failure with provided artifact", "success", "skipped", "failure", False, False),
            ("native cancelled with provided artifact", "success", "skipped", "cancelled", False, False),
            ("native skipped", "success", "skipped", "skipped", False, False),
            ("shared failure", "success", "failure", "skipped", False, False),
            ("shared cancelled", "success", "cancelled", "skipped", False, False),
            ("plan failure", "failure", "skipped", "skipped", False, False),
            ("plan cancelled", "cancelled", "skipped", "skipped", False, False),
            ("plan skipped", "skipped", "skipped", "skipped", False, False),
            ("workflow cancelled after native success", "success", "success", "success", True, False),
            ("provided artifact workflow cancelled", "success", "skipped", "success", True, False),
        )
        contexts = [
            {"needs": {"plan": {"result": plan}, "shared": {"result": shared},
                       "native": {"result": native}}, "cancelled": cancelled}
            for _, plan, shared, native, cancelled, _ in scenarios
        ]
        # These workflow predicates use the JavaScript-compatible boolean subset.
        script = textwrap.dedent('''\
            const vm = require("node:vm");
            const {expressions, contexts} = JSON.parse(require("node:fs").readFileSync(0, "utf8"));
            const predicates = Object.fromEntries(Object.entries(expressions).map(
              ([name, expression]) => [name, new vm.Script(expression)]
            ));
            const results = contexts.map(context => Object.fromEntries(
              Object.entries(predicates).map(([name, predicate]) => [name, predicate.runInNewContext({
                needs: context.needs,
                always: () => true,
                cancelled: () => context.cancelled,
              }, {timeout: 1000})])
            ));
            console.log(JSON.stringify(results));
        ''')
        result = subprocess.run(
            ["node", "-e", script], cwd=ROOT,
            input=json.dumps({"expressions": expressions, "contexts": contexts}),
            capture_output=True, text=True, check=True,
        )
        results = json.loads(result.stdout)
        self.assertEqual(len(results), len(scenarios))
        for scenario, actual in zip(scenarios, results):
            label, plan, shared, _, _, expected_bundle = scenario
            with self.subTest(scenario=label):
                self.assertIs(actual["native"], plan == "success" and shared in ("success", "skipped"))
                self.assertIs(actual["bundle"], expected_bundle)


if __name__ == "__main__":
    unittest.main()
