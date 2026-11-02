import { readFile, readdir } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import {
  BindingPipe,
  Conditional,
  Interpolation,
  LiteralPrimitive,
  parseTemplate,
  TmplAstBoundText,
  TmplAstElement,
  TmplAstText,
} from "@angular/compiler";
import ts from "typescript";

const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TEXT_ATTRIBUTES = new Set([
  "alt",
  "aria-label",
  "aria-description",
  "aria-roledescription",
  "aria-valuetext",
  "title",
  "placeholder",
  "placeholderText",
  "matTooltip",
  "label",
  "groupLabel",
  "text",
  "message",
]);

/** Exact, language-independent tokens only. Never add a prose/sentence pattern. */
export const TECHNICAL_LITERALS = new Map([
  ["WinScope", "Product name"],
  ["Android", "Platform name"],
  ["SurfaceFlinger", "Android service name"],
  ["Surface Flinger", "Human-readable spelling of Android service name"],
  ["IME system_server", "Exact Android trace/process target"],
  ["Perfetto", "Trace tool name"],
  ["Winscope", "Legacy product capitalization"],
  ["AI", "Standard technical acronym"],
  ["VSYNC", "Display synchronization acronym"],
  ["VSync", "Display synchronization acronym"],
  ["VSYNC ID", "Display synchronization event identifier"],
  ["PID", "Process identifier acronym"],
  ["UID", "User identifier acronym"],
  ["SF", "SurfaceFlinger abbreviation"],
  ["WM", "WindowManager abbreviation"],
  ["IME", "Input method editor acronym"],
  ["PIP", "Picture-in-picture acronym"],
  ["FPS", "Frame rate unit"],
  ["fps", "Frame rate unit"],
  ["Hz", "Frequency unit"],
  ["ns", "Nanosecond unit"],
  ["µs", "Microsecond unit"],
  ["μs", "Microsecond unit"],
  ["us", "Microsecond unit"],
  ["ms", "Millisecond unit"],
  ["s", "Second unit"],
  ["px", "Pixel unit"],
  ["dp", "Density-independent pixel unit"],
  ["sp", "Scale-independent pixel unit"],
  ["KiB", "Binary size unit"],
  ["MiB", "Binary size unit"],
  ["GiB", "Binary size unit"],
  ["KB", "Size unit"],
  ["MB", "Size unit"],
  ["GB", "Size unit"],
  ["JSON", "Data format identifier"],
  ["HTML", "Report format identifier"],
  ["Markdown", "Report format identifier"],
  ["UTF-8", "Text encoding identifier"],
  ["--ai-url", "Launcher command-line argument"],
  [".zip", "Archive file extension"],
  ["null", "Literal missing-value marker in trace data"],
  ["undefined", "Literal missing-value marker in trace data"],
  ["WMState", "WindowManager trace structure name"],
  ["SFLayer", "SurfaceFlinger trace structure name"],
  [
    "IsLeashReadyForDispatching:",
    "Exact source property name from the IME trace",
  ],
  ["ZOrderRelativeOfId:", "Exact source property name from the IME trace"],
  ["Z:", "Exact Z-coordinate source property name"],
]);

/** Keyboard glyphs are exempt only in this specific keyboard-help template. */
const SCOPED_LITERALS = new Map([
  [
    "src/app/app_component.ng.html",
    new Map([["BETA", "Product prerelease badge, not UI prose"]]),
  ],
  [
    "src/app/shared/shortcuts_panel/shortcuts_component.ng.html",
    new Map([
      ["W", "Literal Zoom-in keyboard key"],
      ["S", "Literal Zoom-out keyboard key"],
      ["A", "Literal Move-left keyboard key"],
      ["D", "Literal Move-right keyboard key"],
    ]),
  ],
]);

/** Audited UI-owned records, not a blanket scan of arbitrary TypeScript strings. */
export const CURATED_TS_RULES = [
  {
    file: /^src\/(?:app\/mediator|trace_collection\/controller\/trace_collection_controller|ui\/trace_loading\/(?:file_loader|loaded_file_data|non_perfetto_parser_factory)|legacy_file_readers\/common\/legacy_file_reader_factory|parsers\/perfetto_parser_factory)\.ts$/,
    properties: new Set(),
    progressMessages: true,
    reason: "Application-owned progress labels rendered by load-progress",
  },
  {
    file: /^src\/app\/search\/search_view_factory_[^/]+\.ts$/,
    properties: new Set(["desc"]),
    reason:
      "SQL view documentation and example descriptions rendered through tr",
  },
  {
    file: /^src\/ui\/.*presenter[^/]*\.ts$/,
    properties: new Set(["name", "tooltip"]),
    requireSibling: new Set(["cssClass", "enabled"]),
    reason: "Static log column or user-option labels, not trace/provider names",
  },
  {
    file: /^src\/ui\/surface_flinger\/presenter\.ts$/,
    properties: new Set(["desc"]),
    reason: "Curated SurfaceFlinger summary help text",
  },
  {
    file: /^src\/ui\/shared\/rects\/rect_spec\.ts$/,
    properties: new Set(["desc"]),
    reason: "Static rectangle legend descriptions",
  },
];

const normalize = (text) => String(text).replace(/\s+/g, " ").trim();
const placeholders = (text) =>
  [
    ...new Set([...text.matchAll(/\{([a-zA-Z][\w]*)\}/g)].map((m) => m[1])),
  ].sort();
const sameList = (a, b) =>
  a.length === b.length && a.every((item, index) => item === b[index]);

function technicalReason(value, tag) {
  const text = normalize(value);
  if (!text) return "Whitespace";
  if (TECHNICAL_LITERALS.has(text)) return TECHNICAL_LITERALS.get(text);
  if (/^[\d\s.,:/()[\]{}%+−–—=<>×→←↑↓·…!?"'|&*\\-]+$/u.test(text))
    return "Numeric value or punctuation";
  if (
    (tag === "code" || tag === "pre") &&
    /^(?:--[a-z][\w-]*|[\w.-]+(?:[./:\\][\w.-]+)+|\.[a-z0-9]+)$/i.test(text)
  ) {
    return "Exact technical code/path token inside code or pre";
  }
  return undefined;
}

function location(node) {
  const start = node?.sourceSpan?.start;
  return { line: (start?.line ?? 0) + 1, column: (start?.col ?? 0) + 1 };
}

/** Audit only rendered values, not conditions, event handlers, keys or pipe arguments. */
export function auditTemplate(source, file, catalog) {
  const parsed = parseTemplate(source, file, { preserveWhitespaces: true });
  const issues = [];
  const dynamicTranslationSources = [];
  const allowedLiterals = [];
  let translationReferences = 0;
  function issue(code, text, node, detail) {
    issues.push({
      file,
      ...location(node),
      code,
      text: normalize(text),
      ...(detail ? { detail } : {}),
    });
  }
  for (const error of parsed.errors ?? [])
    issue("template_parse_error", error.msg, { sourceSpan: error.span });

  function literal(text, node, tag, translated) {
    const key = normalize(text);
    if (!key) return;
    if (translated) {
      translationReferences++;
      if (!Object.hasOwn(catalog, key) || !catalog[key]?.trim()) {
        const reason = technicalReason(text, tag);
        if (reason)
          allowedLiterals.push({ file, ...location(node), text: key, reason });
        else issue("missing_translation", text, node);
      }
    } else {
      const reason =
        tag === "mat-icon"
          ? "Material icon glyph"
          : (SCOPED_LITERALS.get(file)?.get(key) ?? technicalReason(text, tag));
      if (reason)
        allowedLiterals.push({ file, ...location(node), text: key, reason });
      else issue("untranslated_literal", text, node);
    }
  }

  function rendered(ast, node, tag, translated = false) {
    if (!ast) return;
    if (ast.ast) return rendered(ast.ast, node, tag, translated);
    if (ast instanceof BindingPipe) {
      if (ast.name === "tr") {
        rendered(ast.exp, node, tag, true);
        const input = source.slice(
          node.sourceSpan.start.offset + ast.exp.span.start,
          node.sourceSpan.start.offset + ast.exp.span.end,
        );
        // Match only known user/provider/trace data fields, not arbitrary UI labels.
        const displaySource =
          node.value?.source?.slice(ast.exp.span.start, ast.exp.span.end) ||
          input;
        if (
          /(?:turn|session|attachment|agent|provider|model|finding|link|event)\??\.(?:prompt|response|title|name|id|content|message|reason|skillId|providerId|modelId)\b/.test(
            displaySource,
          )
        ) {
          issue(
            "data_translation",
            displaySource,
            node,
            "User, provider or trace content must remain verbatim.",
          );
        }
        if (!(ast.exp instanceof LiteralPrimitive))
          dynamicTranslationSources.push({
            file,
            ...location(node),
            expression: displaySource,
          });
        if (
          ast.exp instanceof LiteralPrimitive &&
          typeof ast.exp.value === "string"
        ) {
          const required = placeholders(ast.exp.value);
          const provided = ast.args[0]?.keys?.map((key) => key.key) ?? [];
          if (
            required.length &&
            !required.every((key) => provided.includes(key))
          ) {
            issue(
              "missing_interpolation_parameter",
              ast.exp.value,
              node,
              `Required: ${required.join(", ")}`,
            );
          }
        }
        // Parameters are data, not translation sources. Do not scan their literals.
        return;
      }
      return rendered(ast.exp, node, tag, translated);
    }
    if (ast instanceof LiteralPrimitive) {
      if (typeof ast.value === "string")
        literal(ast.value, node, tag, translated);
      return;
    }
    if (ast instanceof Interpolation) {
      for (const text of ast.strings) literal(text, node, tag, translated);
      for (const expression of ast.expressions)
        rendered(expression, node, tag, translated);
      return;
    }
    if (ast instanceof Conditional) {
      rendered(ast.trueExp, node, tag, translated);
      rendered(ast.falseExp, node, tag, translated);
      return;
    }
    if (["+", "||", "??", "&&"].includes(ast.operation)) {
      rendered(ast.left, node, tag, translated);
      rendered(ast.right, node, tag, translated);
      return;
    }
    if (ast.elements && ast.expressions) {
      // Angular template literals, whose static segments are rendered text.
      for (const element of ast.elements)
        literal(element.text, node, tag, translated);
      for (const expression of ast.expressions)
        rendered(expression, node, tag, translated);
    }
  }

  // Even non-text bindings can explicitly contain a tr pipe. Validate those sources.
  function translatedBindings(ast, node, tag) {
    if (!ast || typeof ast !== "object") return;
    if (ast instanceof BindingPipe && ast.name === "tr") {
      rendered(ast, node, tag);
      return;
    }
    for (const [key, value] of Object.entries(ast)) {
      if (
        [
          "span",
          "sourceSpan",
          "nameSpan",
          "source",
          "location",
          "errors",
        ].includes(key)
      )
        continue;
      if (Array.isArray(value))
        value.forEach((child) => translatedBindings(child, node, tag));
      else if (value && typeof value === "object")
        translatedBindings(value, node, tag);
    }
  }

  function visit(node, inheritedTag) {
    const tag = node instanceof TmplAstElement ? node.name : inheritedTag;
    if (node instanceof TmplAstText) literal(node.value, node, tag, false);
    else if (node instanceof TmplAstBoundText) rendered(node.value, node, tag);
    for (const attribute of node.attributes ?? []) {
      if (TEXT_ATTRIBUTES.has(attribute.name))
        literal(attribute.value, attribute, undefined, false);
    }
    for (const input of node.inputs ?? []) {
      if (TEXT_ATTRIBUTES.has(input.name))
        rendered(input.value, input, undefined);
      else translatedBindings(input.value, input, tag);
    }
    for (const key of ["children", "branches", "cases"]) {
      for (const child of node[key] ?? []) visit(child, tag);
    }
    for (const key of ["empty", "placeholder", "loading", "error"]) {
      if (node[key]) visit(node[key], tag);
    }
  }
  parsed.nodes.forEach((node) => visit(node));
  return {
    issues,
    dynamicTranslationSources,
    allowedLiterals,
    translationReferences,
  };
}

export function auditTypeScriptUI(source, file, catalog) {
  const rules = CURATED_TS_RULES.filter((rule) => rule.file.test(file));
  if (!rules.length || /(?:_test|\.test|\/testing\/)/.test(file))
    return { issues: [], references: 0 };
  const parsed = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const issues = [];
  let references = 0;
  const propertyName = (node) =>
    node.name && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name))
      ? node.name.text
      : undefined;
  function checkLiteral(node, rule) {
    if (
      !node ||
      !(ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    )
      return;
    references++;
    const text = normalize(node.text);
    if (
      text &&
      (!Object.hasOwn(catalog, text) || !catalog[text]?.trim()) &&
      !technicalReason(text)
    ) {
      const start = parsed.getLineAndCharacterOfPosition(node.getStart(parsed));
      issues.push({
        file,
        line: start.line + 1,
        column: start.character + 1,
        code: "missing_translation",
        text,
        detail: rule.reason,
      });
    }
  }
  const progressRule = rules.find((rule) => rule.progressMessages);
  function visit(node) {
    if (progressRule) {
      if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.name.text === "onProgressUpdate"
      )
        checkLiteral(node.arguments[0], progressRule);
      if (
        ts.isVariableDeclaration(node) &&
        propertyName(node) === "progressMessage"
      )
        checkLiteral(node.initializer, progressRule);
    }
    if (
      ts.isPropertyAssignment(node) &&
      (ts.isStringLiteral(node.initializer) ||
        ts.isNoSubstitutionTemplateLiteral(node.initializer))
    ) {
      const key = propertyName(node);
      const siblings = new Set(node.parent.properties?.map(propertyName));
      const rule = rules.find(
        (candidate) =>
          candidate.properties.has(key) &&
          (!candidate.requireSibling ||
            [...candidate.requireSibling].some((name) => siblings.has(name))),
      );
      if (rule) checkLiteral(node.initializer, rule);
    }
    ts.forEachChild(node, visit);
  }
  visit(parsed);
  return { issues, references };
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

/** Catalogs are trusted, dependency-free TS data modules, run in an isolated VM. */
export async function loadCatalog(root) {
  const directory = join(root, "src/common");
  const files = (await readdir(directory)).filter((file) =>
    /^i18n_(?!.*test).*\.ts$/.test(file),
  );
  const catalog = {};
  const issues = [];
  for (const file of files.sort()) {
    const source = await readFile(join(directory, file), "utf8");
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    });
    const exports = {};
    runInNewContext(
      outputText,
      { exports, module: { exports } },
      { timeout: 1000, filename: file },
    );
    for (const dictionary of Object.values(exports)) {
      if (
        !dictionary ||
        typeof dictionary !== "object" ||
        Array.isArray(dictionary)
      )
        continue;
      for (const [key, value] of Object.entries(dictionary)) {
        if (typeof value !== "string" || !value.trim()) {
          issues.push({
            file: `src/common/${file}`,
            code: "invalid_translation",
            text: key,
          });
          continue;
        }
        const normalized = normalize(key);
        if (normalized === normalize(value) && !technicalReason(key)) {
          issues.push({
            file: `src/common/${file}`,
            code: "unchanged_translation",
            text: normalized,
          });
        }
        if (
          Object.hasOwn(catalog, normalized) &&
          catalog[normalized] !== value
        ) {
          issues.push({
            file: `src/common/${file}`,
            code: "conflicting_translation",
            text: normalized,
            detail: `${catalog[normalized]} / ${value}`,
          });
        }
        if (!sameList(placeholders(key), placeholders(value))) {
          issues.push({
            file: `src/common/${file}`,
            code: "placeholder_mismatch",
            text: key,
          });
        }
        catalog[normalized] = value;
      }
    }
  }
  return { catalog, issues, files };
}

export async function auditRepository(root = DEFAULT_ROOT) {
  const { catalog, issues, files: catalogFiles } = await loadCatalog(root);
  const files = (await walk(join(root, "src/app"))).filter((file) =>
    file.endsWith(".ng.html"),
  );
  const dynamicTranslationSources = [];
  const allowedLiterals = [];
  let translationReferences = 0;
  for (const file of files) {
    const result = auditTemplate(
      await readFile(file, "utf8"),
      relative(root, file),
      catalog,
    );
    issues.push(...result.issues);
    dynamicTranslationSources.push(...result.dynamicTranslationSources);
    allowedLiterals.push(...result.allowedLiterals);
    translationReferences += result.translationReferences;
  }
  const optionalWalk = async (directory) =>
    walk(directory).catch((error) =>
      error.code === "ENOENT" ? [] : Promise.reject(error),
    );
  const curatedTypeScriptFiles = [
    ...(await optionalWalk(join(root, "src/app"))),
    ...(await optionalWalk(join(root, "src/ui"))),
    ...(await optionalWalk(join(root, "src/trace_collection/controller"))),
    ...(await optionalWalk(join(root, "src/legacy_file_readers/common"))),
    ...(await optionalWalk(join(root, "src/parsers"))),
  ].filter(
    (file) =>
      file.endsWith(".ts") &&
      !/(?:_test|\.test|\/testing\/)/.test(file) &&
      CURATED_TS_RULES.some((rule) => rule.file.test(relative(root, file))),
  );
  let curatedTypeScriptReferences = 0;
  for (const file of curatedTypeScriptFiles) {
    const result = auditTypeScriptUI(
      await readFile(file, "utf8"),
      relative(root, file),
      catalog,
    );
    issues.push(...result.issues);
    curatedTypeScriptReferences += result.references;
  }
  return {
    ok: issues.length === 0,
    templateFiles: files.length,
    catalogFiles: catalogFiles.length,
    catalogEntries: Object.keys(catalog).length,
    translationReferences,
    curatedTypeScriptFiles: curatedTypeScriptFiles.length,
    curatedTypeScriptReferences,
    issues,
    dynamicTranslationSources,
    allowedLiterals,
    limitations: [
      "Templates and explicitly curated TypeScript UI records only; other dynamic labels require code review and browser tests.",
      "Known content-field translation checks are a safety net, not full data-flow analysis.",
      "Reference/trace/user/provider content is intentionally not machine-translated.",
    ],
  };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2);
  const rootIndex = args.indexOf("--root");
  const result = await auditRepository(
    rootIndex >= 0 ? resolve(args[rootIndex + 1]) : DEFAULT_ROOT,
  );
  if (args.includes("--json")) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(
      `i18n template audit: ${result.ok ? "PASS" : "FAIL"} (${result.templateFiles} templates, ${result.catalogEntries} catalog entries, ${result.issues.length} issues)`,
    );
    for (const issue of result.issues)
      console.log(
        `${issue.file}:${issue.line ?? 1}:${issue.column ?? 1} [${issue.code}] ${issue.text}${issue.detail ? ` — ${issue.detail}` : ""}`,
      );
  }
  process.exitCode = result.ok ? 0 : 1;
}
