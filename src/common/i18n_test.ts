import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';

import { CHINESE_TRANSLATIONS, initializeLanguage, language, LANGUAGE_PREFERENCE_KEY, languagePreference, setLanguage, translate, TranslatePipe, } from './i18n';
import {clearPersistentState, setPersistenceEnabledForTest} from './store/persistent_store';

@Component({
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button [attr.aria-label]="'Save' | tr">{{ 'Save' | tr }}</button>
    <input value="SurfaceFlinger user draft <script>" />
    <p>{{ 'Query {number}' | tr: {number: 3} }}</p>`,
})
class TranslationHost {}

describe('UI localization', () => {
  beforeEach(() => {
    setPersistenceEnabledForTest(true);
    setLanguage('en');
    localStorage.removeItem(LANGUAGE_PREFERENCE_KEY);
  });
  afterEach(() => {
    setPersistenceEnabledForTest(true);
    setLanguage('en');
    localStorage.removeItem(LANGUAGE_PREFERENCE_KEY);
  });

  it('switches in place including OnPush labels and ARIA without replacing user inputs', async () => {
    await TestBed.configureTestingModule({imports: [TranslationHost]}).compileComponents();
    const fixture = TestBed.createComponent(TranslationHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'Save <b>technical user data</b>';
    setLanguage('zh-CN');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toBe('保存');
    expect(button.getAttribute('aria-label')).toBe('保存');
    expect(fixture.nativeElement.querySelector('p').textContent).toBe('查询 3');
    expect(fixture.nativeElement.querySelector('input')).toBe(input);
    expect(input.value).toBe('Save <b>technical user data</b>');
    setLanguage('en');
    fixture.detectChanges();
    expect(button.textContent).toBe('Save');
    fixture.destroy();
  });

  it('detects supported browser language, persists the explicit choice and restores it', () => {
    initializeLanguage(['fr-FR', 'zh-TW', 'en-US']);
    expect(languagePreference()).toBe('system');
    expect(language()).toBe('zh-CN');
    expect(document.documentElement.lang).toBe('zh-CN');
    setLanguage('en');
    expect(localStorage.getItem(LANGUAGE_PREFERENCE_KEY)).toBe('en');
    initializeLanguage(['zh-CN']);
    expect(languagePreference()).toBe('en');
    expect(language()).toBe('en');
  });

  it('persists system separately from the resolved language and restores it on restart', () => {
    const browserLanguages = spyOnProperty(navigator, 'languages', 'get')
      .and.returnValue(['zh-TW']);
    setLanguage('system');
    expect(languagePreference()).toBe('system');
    expect(language()).toBe('zh-CN');
    expect(document.documentElement.lang).toBe('zh-CN');
    expect(localStorage.getItem(LANGUAGE_PREFERENCE_KEY)).toBe('system');

    // Simulate a fresh in-memory state without changing the saved preference.
    setPersistenceEnabledForTest(false);
    setLanguage('zh-CN');
    setPersistenceEnabledForTest(true);
    browserLanguages.and.returnValue(['en-GB', 'zh-CN']);
    initializeLanguage();
    expect(languagePreference()).toBe('system');
    expect(language()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(localStorage.getItem(LANGUAGE_PREFERENCE_KEY)).toBe('system');
  });

  for (const preference of ['en', 'zh-CN'] as const) {
    it(`restores explicit ${preference} and ignores future system changes`, () => {
      setLanguage(preference);
      setPersistenceEnabledForTest(false);
      setLanguage('system');
      setPersistenceEnabledForTest(true);
      const otherLanguage = preference === 'en' ? 'zh-CN' : 'en';
      spyOnProperty(navigator, 'languages', 'get').and.returnValue([otherLanguage]);
      initializeLanguage();
      window.dispatchEvent(new Event('languagechange'));
      expect(languagePreference()).toBe(preference);
      expect(language()).toBe(preference);
      expect(document.documentElement.lang).toBe(preference);
      expect(localStorage.getItem(LANGUAGE_PREFERENCE_KEY)).toBe(preference);
    });
  }

  it('tracks system changes only once after repeated initialization without persisting resolved values', () => {
    const browserLanguages = spyOnProperty(navigator, 'languages', 'get')
      .and.returnValue(['en-US']);
    setLanguage('system');
    initializeLanguage();
    initializeLanguage();
    const update = spyOn(language, 'set').and.callThrough();
    const persist = spyOn(Storage.prototype, 'setItem').and.callThrough();
    for (const [locales, resolved] of [
      [['fr-FR', 'zh-HK', 'en-US'], 'zh-CN'],
      [['EN-au', 'zh-CN'], 'en'],
      [['ja-JP'], 'en'],
      [[], 'en'],
    ] as const) {
      browserLanguages.and.returnValue([...locales]);
      update.calls.reset();
      window.dispatchEvent(new Event('languagechange'));
      expect(update).toHaveBeenCalledOnceWith(resolved);
      expect(language()).toBe(resolved);
      expect(languagePreference()).toBe('system');
      expect(document.documentElement.lang).toBe(resolved);
    }
    expect(persist).not.toHaveBeenCalled();
    expect(localStorage.getItem(LANGUAGE_PREFERENCE_KEY)).toBe('system');
  });

  it('updates OnPush translations on system events without replacing user input', async () => {
    const browserLanguages = spyOnProperty(navigator, 'languages', 'get')
      .and.returnValue(['en-US']);
    initializeLanguage();
    await TestBed.configureTestingModule({imports: [TranslationHost]}).compileComponents();
    const fixture = TestBed.createComponent(TranslationHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'Unsent chat draft <b>Save</b>';
    browserLanguages.and.returnValue(['zh-CN']);
    window.dispatchEvent(new Event('languagechange'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button').textContent).toBe('保存');
    expect(fixture.nativeElement.querySelector('input')).toBe(input);
    expect(input.value).toBe('Unsent chat draft <b>Save</b>');
    fixture.destroy();
  });

  it('falls back safely for unknown preferences and unsupported browser languages', () => {
    localStorage.setItem(LANGUAGE_PREFERENCE_KEY, 'unsupported');
    initializeLanguage(['ja-JP']);
    expect(languagePreference()).toBe('system');
    expect(language()).toBe('en');
    initializeLanguage(['fr-FR', 'ZH-tw']);
    expect(languagePreference()).toBe('system');
    expect(language()).toBe('zh-CN');
    setLanguage('invalid' as 'en');
    expect(languagePreference()).toBe('system');
    expect(language()).toBe('zh-CN');
    expect(localStorage.getItem(LANGUAGE_PREFERENCE_KEY)).toBe('unsupported');
  });

  it('honors privacy mode without reading or writing the saved language', () => {
    localStorage.setItem(LANGUAGE_PREFERENCE_KEY, 'en');
    setPersistenceEnabledForTest(false);
    const read = spyOn(Storage.prototype, 'getItem').and.callThrough();
    const write = spyOn(Storage.prototype, 'setItem').and.callThrough();
    const browserLanguages = spyOnProperty(navigator, 'languages', 'get')
      .and.returnValue(['zh-CN']);
    initializeLanguage(['zh-CN']);
    expect(languagePreference()).toBe('system');
    expect(language()).toBe('zh-CN');
    setLanguage('zh-CN');
    setLanguage('system');
    browserLanguages.and.returnValue(['en-US']);
    window.dispatchEvent(new Event('languagechange'));
    expect(languagePreference()).toBe('system');
    expect(language()).toBe('en');
    expect(read).not.toHaveBeenCalled();
    expect(write).not.toHaveBeenCalled();
    expect(localStorage.getItem(LANGUAGE_PREFERENCE_KEY)).toBe('en');
    clearPersistentState();
    expect(localStorage.getItem(LANGUAGE_PREFERENCE_KEY)).toBeNull();
  });

  it('continues when browser storage is unavailable', () => {
    spyOn(Storage.prototype, 'getItem').and.throwError('storage denied');
    spyOn(Storage.prototype, 'setItem').and.throwError('storage denied');
    expect(() => initializeLanguage(['zh-CN'])).not.toThrow();
    expect(languagePreference()).toBe('system');
    expect(language()).toBe('zh-CN');
    expect(() => setLanguage('en')).not.toThrow();
    expect(languagePreference()).toBe('en');
    expect(language()).toBe('en');
    spyOnProperty(navigator, 'languages', 'get').and.returnValue(['zh-CN']);
    expect(() => setLanguage('system')).not.toThrow();
    expect(() => window.dispatchEvent(new Event('languagechange'))).not.toThrow();
    expect(languagePreference()).toBe('system');
    expect(language()).toBe('zh-CN');
    expect(document.documentElement.lang).toBe('zh-CN');
  });

  it('keeps unknown trace data verbatim and interpolates parameters only once', () => {
    setLanguage('zh-CN');
    expect(translate('surface_id=123 org.example.MainActivity')).toBe('surface_id=123 org.example.MainActivity');
    expect(translate('Query {number}', {number: '<script>{number}</script>'})).toBe('查询 <script>{number}</script>');
    expect(translate('toString')).toBe('toString');
    expect(translate('Save\n  ')).toBe('保存');
    expect(new TranslatePipe().transform(undefined)).toBe('');
  });

  it('retains named parameter contracts in every translation', () => {
    const placeholders = (value: string) => [...value.matchAll(/\{([a-zA-Z][\w]*)\}/g)].map((match) => match[1]).sort();
    for (const [source, translated] of Object.entries(CHINESE_TRANSLATIONS)) {
      expect(translated.trim().length).withContext(source).toBeGreaterThan(0);
      expect(placeholders(translated)).withContext(source).toEqual(placeholders(source));
    }
  });
});
