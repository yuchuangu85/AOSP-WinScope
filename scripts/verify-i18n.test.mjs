import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  auditTemplate,
  auditTypeScriptUI,
  auditRepository,
  loadCatalog,
} from "./verify-i18n.mjs";

const dictionary = {
  Save: "保存",
  Cancel: "取消",
  "Your {name}": "您的 {name}",
  "Two words": "两个词",
};
const audit = (source, catalog = dictionary, file = "example.ng.html") =>
  auditTemplate(source, file, catalog);
const codes = (result) => result.issues.map((issue) => issue.code);

test("rejects visible prose and untranslated accessible attributes, including icon labels", () => {
  const result = audit(
    '<p>Save</p><input placeholder="Cancel"><mat-icon aria-label="Close window">close</mat-icon>',
  );
  assert.deepEqual(
    result.issues.map((issue) => issue.text),
    ["Save", "Cancel", "Close window"],
  );
  assert.ok(
    result.allowedLiterals.some(
      (item) => item.text === "close" && item.reason === "Material icon glyph",
    ),
  );
});

test("accepts both quote styles, normalized text, parameters and translated attribute values", () => {
  const result = audit(
    `<button [attr.aria-label]="'Save' | tr">{{ "Cancel" | tr }}</button><p>{{ 'Your {name}' | tr: {name: user.name} }}</p><span>{{ 'Two   words' | tr }}</span>`,
  );
  assert.deepEqual(result.issues, []);
  assert.equal(result.translationReferences, 4);
});

test("checks custom component labels and placeholders alongside native attributes", () => {
  const result = audit(
    `<viewer placeholderText="Saved queries will appear here." groupLabel="Windows" message="Nothing available"></viewer>`,
  );
  assert.deepEqual(
    result.issues.map((issue) => issue.text),
    ["Saved queries will appear here.", "Windows", "Nothing available"],
  );
});

test("requires a dictionary entry, preserves parameter names and checks supplied parameters", () => {
  assert.deepEqual(codes(audit(`{{ 'Missing phrase' | tr }}`)), [
    "missing_translation",
  ]);
  assert.deepEqual(codes(audit(`{{ 'Your {name}' | tr }}`)), [
    "missing_interpolation_parameter",
  ]);
  assert.deepEqual(
    audit(`{{ 'Your {name}' | tr: {name: 'Settings'} }}`).issues,
    [],
  );
});

test("checks rendered interpolation fragments and conditional branches, not conditions or event payloads", () => {
  const result = audit(
    `@if (state === 'running') {<button (click)="submit('not UI prose')">{{ state === 'running' ? 'Save' : 'Cancel' }}</button>}<p>Hello {{ user.name }}</p>`,
  );
  assert.deepEqual(
    result.issues.map((issue) => issue.text),
    ["Save", "Cancel", "Hello"],
  );
  assert.deepEqual(
    audit(`{{ (state === 'running' ? 'Save' : 'Cancel') | tr }}`).issues,
    [],
  );
});

test("visits nested control flow and ignores comments but not prose inside code/pre", () => {
  const result = audit(
    `<!-- This is not visible -->@for (x of xs; track x) {<code>--ai-url</code>} @empty {Missing items}@switch (x) { @case ('s') {<pre>Read these instructions</pre>} @default {<span>{{'Save' | tr}}</span>} }<code>trace.json</code>`,
  );
  assert.deepEqual(
    result.issues.map((issue) => issue.text),
    ["Missing items", "Read these instructions"],
  );
});

test("permits only explicit technical and numeric glyphs, not arbitrary English fallback", () => {
  const result = audit("<p>WinScope</p><p>64</p><p>ms</p><p>Privacy</p>");
  assert.deepEqual(
    result.issues.map((issue) => issue.text),
    ["Privacy"],
  );
  assert.deepEqual(audit(`{{ 'WinScope' | tr }}`).issues, []);
  assert.deepEqual(codes(audit("<p>A</p>")), ["untranslated_literal"]);
  assert.deepEqual(
    audit(
      "<p>A</p>",
      dictionary,
      "src/app/shared/shortcuts_panel/shortcuts_component.ng.html",
    ).issues,
    [],
  );
});

test("flags accidental translation of known user/provider/trace fields but allows localized fallback", () => {
  assert.deepEqual(codes(audit("{{ turn.response | tr }}")), [
    "data_translation",
  ]);
  assert.deepEqual(codes(audit("{{ provider.name | tr }}")), [
    "data_translation",
  ]);
  assert.deepEqual(audit(`{{ session.title || ('Save' | tr) }}`).issues, []);
  assert.deepEqual(
    audit(`{{ 'Your {name}' | tr: {name: attachment.name} }}`).issues,
    [],
  );
});

test("validates tr sources in non-text bindings without treating their configuration literals as UI", () => {
  const result = audit(
    `<widget [options]="['not prose to display', ('Missing phrase' | tr)]"></widget>`,
  );
  assert.deepEqual(
    result.issues.map((issue) => issue.text),
    ["Missing phrase"],
  );
});

test("curated TS audit checks known UI records without treating SQL IDs, trace names or test fixtures as prose", () => {
  const factory =
    "const view = {name: 'sf_search', columns: [{name: 'state_id', desc: 'Missing description'}]};";
  const result = auditTypeScriptUI(
    factory,
    "src/app/search/search_view_factory_sf.ts",
    dictionary,
  );
  assert.deepEqual(
    result.issues.map((issue) => issue.text),
    ["Missing description"],
  );
  assert.equal(result.references, 1);
  const presenter =
    "const x = [{name:'Unknown user label', enabled:true}, {name:'Known',cssClass:'c'}, {name:'trace_name'}, {desc:'data'}];";
  assert.deepEqual(
    auditTypeScriptUI(presenter, "src/ui/window_manager/presenter.ts", {
      ...dictionary,
      Known: "已知",
    }).issues.map((issue) => issue.text),
    ["Unknown user label"],
  );
  assert.deepEqual(
    auditTypeScriptUI(
      presenter,
      "src/ui/window_manager/presenter_test.ts",
      dictionary,
    ).issues,
    [],
  );
  assert.deepEqual(
    auditTypeScriptUI(factory, "src/trace/trace.ts", dictionary).issues,
    [],
  );
});

test("reports Angular parse errors instead of silently skipping broken markup", () => {
  assert.ok(codes(audit("<div></span>")).includes("template_parse_error"));
});

test("audits literal progress messages without treating dynamic trace payloads or numeric progress as prose", () => {
  const source = `
    listener?.onProgressUpdate('Waiting for files...', undefined);
    listener.onProgressUpdate("Missing download label", 50);
    listener.onProgressUpdate(deviceError, 50);
    onProgressUpdate(42);
    const filename = 'Keep this raw filename';
  `;
  const result = auditTypeScriptUI(source, "src/app/mediator.ts", {
    ...dictionary,
    "Waiting for files...": "正在等待文件…",
  });
  assert.equal(result.references, 2);
  assert.deepEqual(
    result.issues.map((issue) => issue.text),
    ["Missing download label"],
  );
  assert.deepEqual(
    auditTypeScriptUI(source, "src/app/mediator_test.ts", dictionary).issues,
    [],
  );
  assert.equal(
    auditTypeScriptUI(
      "const progressMessage = 'Missing unzip label';",
      "src/ui/trace_loading/file_loader.ts",
      dictionary,
    ).issues[0]?.text,
    "Missing unzip label",
  );
});

test("loads trusted TS catalogs in isolation, detects conflicts and placeholder drift and scans all template subdirs", async () => {
  const root = await mkdtemp(join(tmpdir(), "winscope-i18n-audit-"));
  try {
    await mkdir(join(root, "src/common"), { recursive: true });
    await mkdir(join(root, "src/app/nested"), { recursive: true });
    await writeFile(
      join(root, "src/common/i18n_first.ts"),
      `export const FIRST: Record<string,string> = {'Save':'保存', 'Your {name}':'您的 {person}'};`,
    );
    await writeFile(
      join(root, "src/common/i18n_second.ts"),
      `export const SECOND: Record<string,string> = {'Save':'存储'};`,
    );
    await writeFile(
      join(root, "src/common/i18n_third.ts"),
      `export const THIRD: Record<string,string> = {'Cancel':'Cancel'};`,
    );
    await writeFile(
      join(root, "src/app/nested/page.ng.html"),
      `{{'Save' | tr}}`,
    );
    await writeFile(
      join(root, "src/app/mediator.ts"),
      "listener?.onProgressUpdate('Missing progress label', undefined);",
    );
    const loaded = await loadCatalog(root);
    assert.deepEqual(
      loaded.issues.map((issue) => issue.code),
      [
        "placeholder_mismatch",
        "conflicting_translation",
        "unchanged_translation",
      ],
    );
    const result = await auditRepository(root);
    assert.equal(result.templateFiles, 1);
    assert.equal(result.catalogFiles, 3);
    assert.equal(result.ok, false);
    assert.equal(result.translationReferences, 1);
    assert.equal(result.curatedTypeScriptReferences, 1);
    assert.ok(
      result.issues.some((issue) => issue.text === "Missing progress label"),
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
