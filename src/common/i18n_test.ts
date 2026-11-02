import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';

import { CHINESE_TRANSLATIONS, initializeLanguage, language, LANGUAGE_PREFERENCE_KEY, setLanguage, translate, TranslatePipe, } from './i18n';
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
    expect(language()).toBe('zh-CN');
    expect(document.documentElement.lang).toBe('zh-CN');
    setLanguage('en');
    expect(localStorage.getItem(LANGUAGE_PREFERENCE_KEY)).toBe('en');
    initializeLanguage(['zh-CN']);
    expect(language()).toBe('en');
  });

  it('falls back safely for unknown preferences and unsupported browser languages', () => {
    localStorage.setItem(LANGUAGE_PREFERENCE_KEY, 'unsupported');
    initializeLanguage(['ja-JP']);
    expect(language()).toBe('en');
    setLanguage('invalid' as 'en');
    expect(language()).toBe('en');
  });

  it('honors privacy mode without reading or writing the saved language', () => {
    localStorage.setItem(LANGUAGE_PREFERENCE_KEY, 'en');
    setPersistenceEnabledForTest(false);
    initializeLanguage(['zh-CN']);
    expect(language()).toBe('zh-CN');
    setLanguage('zh-CN');
    expect(localStorage.getItem(LANGUAGE_PREFERENCE_KEY)).toBe('en');
    clearPersistentState();
    expect(localStorage.getItem(LANGUAGE_PREFERENCE_KEY)).toBeNull();
  });

  it('continues when browser storage is unavailable', () => {
    spyOn(Storage.prototype, 'getItem').and.throwError('storage denied');
    spyOn(Storage.prototype, 'setItem').and.throwError('storage denied');
    expect(() => initializeLanguage(['zh-CN'])).not.toThrow();
    expect(language()).toBe('zh-CN');
    expect(() => setLanguage('en')).not.toThrow();
    expect(language()).toBe('en');
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
