import {Injectable} from '@angular/core';
import {createCssVariablesTheme, createHighlighterCoreSync, HighlighterCore, LanguageRegistration} from 'shiki/dist/core.mjs';
import {createJavaScriptRegexEngine} from 'shiki/dist/engine-javascript.mjs';

export interface AiCodeToken {
  text: string;
  color?: string;
  fontStyle?: number;
}

export type AiCodeLine = AiCodeToken[];

type GrammarModule = {default: LanguageRegistration[]};

// String assertions bypass legacy tsc subpath resolution; emitted imports remain
// explicit literals for Webpack. Every module is narrowed to Shiki's grammar API.
const BOOT_GRAMMARS = [
  () => import('@shikijs/langs/typescript' as string) as Promise<GrammarModule>,
  () => import('@shikijs/langs/shellscript' as string) as Promise<GrammarModule>,
  () => import('@shikijs/langs/json' as string) as Promise<GrammarModule>,
];

const LAZY_GRAMMARS = new Map<string, () => Promise<GrammarModule>>([
  ['python', () => import('@shikijs/langs/python' as string) as Promise<GrammarModule>],
  ['java', () => import('@shikijs/langs/java' as string) as Promise<GrammarModule>],
  ['kotlin', () => import('@shikijs/langs/kotlin' as string) as Promise<GrammarModule>],
  ['cpp', () => import('@shikijs/langs/cpp' as string) as Promise<GrammarModule>],
  ['c', () => import('@shikijs/langs/c' as string) as Promise<GrammarModule>],
  ['xml', () => import('@shikijs/langs/xml' as string) as Promise<GrammarModule>],
  ['yaml', () => import('@shikijs/langs/yaml' as string) as Promise<GrammarModule>],
  ['sql', () => import('@shikijs/langs/sql' as string) as Promise<GrammarModule>],
  ['log', () => import('@shikijs/langs/log' as string) as Promise<GrammarModule>],
  ['diff', () => import('@shikijs/langs/diff' as string) as Promise<GrammarModule>],
]);

const ALIASES = new Map<string, string>([
  ['typescript', 'typescript'], ['ts', 'typescript'], ['tsx', 'typescript'],
  ['javascript', 'typescript'], ['js', 'typescript'], ['jsx', 'typescript'],
  ['shellscript', 'shellscript'], ['bash', 'shellscript'], ['sh', 'shellscript'],
  ['shell', 'shellscript'], ['zsh', 'shellscript'], ['json', 'json'],
  ['python', 'python'], ['py', 'python'], ['java', 'java'],
  ['kotlin', 'kotlin'], ['kt', 'kotlin'], ['kts', 'kotlin'],
  ['cpp', 'cpp'], ['c++', 'cpp'], ['cc', 'cpp'], ['c', 'c'],
  ['xml', 'xml'], ['yaml', 'yaml'], ['yml', 'yaml'], ['sql', 'sql'],
  ['log', 'log'], ['diff', 'diff'], ['patch', 'diff'],
]);

@Injectable({providedIn: 'root'})
export class AiCodeHighlighter {
  private core?: Promise<HighlighterCore>;
  private readonly loading = new Map<string, Promise<void>>();

  async highlight(code: string, language?: string): Promise<AiCodeLine[] | undefined> {
    const grammar = ALIASES.get(language?.trim().toLowerCase() ?? '');
    if (!grammar || code.length > 64 * 1024) return undefined;
    try {
      if (new TextEncoder().encode(code).byteLength > 64 * 1024) return undefined;
      const core = await (this.core ??= Promise.all(BOOT_GRAMMARS.map((load) => load())).then((modules) =>
        createHighlighterCoreSync({
          themes: [createCssVariablesTheme({name: 'css-variables', variablePrefix: '--shiki-', fontStyle: true})],
          langs: modules.flatMap((module) => module.default),
          engine: createJavaScriptRegexEngine({forgiving: true}),
        }),
      ));
      const load = LAZY_GRAMMARS.get(grammar);
      if (load && !core.getLoadedLanguages().includes(grammar)) {
        let pending = this.loading.get(grammar);
        if (!pending) {
          pending = load().then((module) => core.loadLanguageSync(module.default));
          this.loading.set(grammar, pending);
        }
        try {
          await pending;
        } finally {
          this.loading.delete(grammar);
        }
      }
      const {tokens} = core.codeToTokens(code, {
        lang: grammar,
        theme: 'css-variables',
        tokenizeMaxLineLength: 1000,
        tokenizeTimeLimit: 20,
      });
      const lines = tokens.map((line) => line.map((token) => ({
        text: token.content, color: token.color, fontStyle: token.fontStyle,
      })));
      // A tokenizer must never normalize line endings or lose source characters.
      return lines.map((line) => line.map((token) => token.text).join('')).join('\n') === code
        ? lines : undefined;
    } catch {
      return undefined;
    }
  }
}
