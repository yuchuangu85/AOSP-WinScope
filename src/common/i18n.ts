import {registerLocaleData} from '@angular/common';
import chineseLocale from '@angular/common/locales/zh';
import {Pipe, PipeTransform, signal} from '@angular/core';

import {AI_TRANSLATIONS} from './i18n_ai';
import {CAPTURE_TRANSLATIONS} from './i18n_capture';
import {NOTIFICATION_TRANSLATIONS} from './i18n_notifications';
import {SHELL_TRANSLATIONS} from './i18n_shell';
import {VIEWER_TRANSLATIONS} from './i18n_viewers';
import {isPersistenceEnabled, PersistentStore} from './store/persistent_store';

export type Language = 'en' | 'zh-CN';
export type LanguagePreference = 'system' | Language;
export type TranslationParams = Readonly<Record<string, string | number>>;

export const LANGUAGE_PREFERENCE_KEY = 'language';
export const SUPPORTED_LANGUAGES: ReadonlyArray<{
  code: Language;
  name: string;
}> = [
  {code: 'en', name: 'English'},
  {code: 'zh-CN', name: '简体中文'},
];

/** UI language only. Trace values, identifiers and user content stay untouched. */
export const language = signal<Language>('en');
export const languagePreference = signal<LanguagePreference>('system');

let listeningForLanguageChanges = false;

export const CHINESE_TRANSLATIONS: Readonly<Record<string, string>> = {
  ...VIEWER_TRANSLATIONS,
  ...CAPTURE_TRANSLATIONS,
  ...AI_TRANSLATIONS,
  ...SHELL_TRANSLATIONS,
  ...NOTIFICATION_TRANSLATIONS,
};

registerLocaleData(chineseLocale, 'zh-CN');

function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'zh-CN';
}

function resolveSystemLanguage(browserLanguages: readonly string[]): Language {
  const detected = browserLanguages.find((value) => /^(en|zh)(-|$)/i.test(value));
  return detected?.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
}

function listenForLanguageChanges(): void {
  if (listeningForLanguageChanges || typeof window === 'undefined') return;
  window.addEventListener('languagechange', () => {
    if (languagePreference() === 'system') {
      applyLanguage(resolveSystemLanguage(navigator.languages));
    }
  });
  listeningForLanguageChanges = true;
}

/** Restore a display preference; storage failures never prevent app startup. */
export function initializeLanguage(
  browserLanguages: readonly string[] = navigator.languages,
): void {
  let preferred: string | undefined;
  if (isPersistenceEnabled()) {
    try {
      preferred = new PersistentStore().get(LANGUAGE_PREFERENCE_KEY);
    } catch {
      // Sandboxed/private browsers can deny localStorage access.
    }
  }
  const preference = isLanguage(preferred) ? preferred : 'system';
  languagePreference.set(preference);
  applyLanguage(
    preference === 'system' ? resolveSystemLanguage(browserLanguages) : preference,
  );
  listenForLanguageChanges();
}

function applyLanguage(value: Language): void {
  language.set(value);
  if (typeof document !== 'undefined') document.documentElement.lang = value;
}

/** Change language in place without recreating viewers or losing draft state. */
export function setLanguage(value: LanguagePreference): void {
  if (value !== 'system' && !isLanguage(value)) return;
  languagePreference.set(value);
  applyLanguage(
    value === 'system' ? resolveSystemLanguage(navigator.languages) : value,
  );
  listenForLanguageChanges();
  if (!isPersistenceEnabled()) return;
  try {
    new PersistentStore().add(LANGUAGE_PREFERENCE_KEY, value);
  } catch {
    // The in-memory choice still works when persistence is unavailable.
  }
}

/** Explicit English-source catalog lookup, never machine-translates trace data. */
export function translate(
  source: string,
  params: TranslationParams = {},
): string {
  const key = source.replace(/\s+/g, ' ').trim();
  const text =
    language() === 'zh-CN' && Object.hasOwn(CHINESE_TRANSLATIONS, key)
      ? CHINESE_TRANSLATIONS[key]
      : source;
  return text.replace(/\{([a-zA-Z][\w]*)\}/g, (match, name: string) =>
    Object.hasOwn(params, name) ? String(params[name]) : match,
  );
}

/** Impure so existing OnPush/dynamic views update with the shared signal. */
@Pipe({name: 'tr', standalone: true, pure: false})
export class TranslatePipe implements PipeTransform {
  transform(
    source: string | null | undefined,
    params?: TranslationParams,
  ): string {
    return source == null ? '' : translate(source, params);
  }
}
