import {CdkTrapFocus} from '@angular/cdk/a11y';
import {Component, EventEmitter, forwardRef, Input, OnInit, Output,} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {MatTooltip} from '@angular/material/tooltip';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import appMetadata from '@app-metadata';
import {initializeLanguage, language, LANGUAGE_PREFERENCE_KEY, languagePreference, setLanguage, translate} from '@common/i18n';
import {AiCatalog, AiGatewayClient, AiProvider, AiProviderConfiguration,} from '@services/ai_gateway_client';

import {AiModelSelection, AiProviderModelSelection, AiSettingsComponent, AiSettingsValue,} from './ai_settings_component';
import {AppSettingsComponent, ThemeMode} from './app_settings_component';

const codexProvider: AiProvider = {
  id: 'codex',
  models: [{id: 'codex-model', name: 'Codex model'}],
};
const claudeProvider: AiProvider = {
  id: 'claude',
  models: [{id: 'claude-model', name: 'Claude model'}],
};
const catalog: AiCatalog = {
  providers: [codexProvider, claudeProvider],
  agents: [{id: 'display', name: 'Display analyst', providerId: 'codex'}],
  skills: [],
};
const selection: AiModelSelection = {
  agentId: 'display',
  providerId: 'codex',
  modelId: 'codex-model',
  customModel: '',
  reasoningLevel: 'medium',
};

// Keep shell lifecycle coverage independent of the embedded form's internals.
@Component({
  selector: 'ai-settings',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: AiSettingsComponent,
      useExisting: forwardRef(() => AiSettingsFormStub),
    },
  ],
  template: `
    <input
      aria-label="Draft model"
      [(ngModel)]="draftModel"
      [disabled]="disabled" />
    <button
      type="button"
      data-provider="codex"
      [disabled]="disabled"
      (click)="importRequested.emit('codex')">Codex</button>
    <button
      type="button"
      data-provider="claude"
      [disabled]="disabled"
      (click)="importRequested.emit('claude')">Claude</button>
    <span class="codex-error">{{ importErrors['codex'] }}</span>
    <span class="claude-error">{{ importErrors['claude'] }}</span>
    <span class="codex-success">{{ importedProviders['codex']?.id }}</span>
    <span class="claude-success">{{ importedProviders['claude']?.id }}</span>
  `,
})
class AiSettingsFormStub implements OnInit {
  @Input() catalog: AiCatalog = {providers: [], agents: [], skills: []};
  @Input() selection: AiModelSelection = {...selection};
  @Input() providerSelections: Record<string, AiProviderModelSelection> = {};
  @Input() running = false;
  @Input() loading = false;
  @Input() existingSession = false;
  @Input() importingProvider: 'codex' | 'claude' | '' = '';
  @Input() importingAction: 'configuration' | 'models' | '' = '';
  @Input() importErrors: Record<string, string> = {};
  @Input() importedProviders: Record<string, AiProvider> = {};
  @Input() modelListProviders: Record<string, AiProvider> = {};
  @Output() readonly importRequested = new EventEmitter<'codex' | 'claude'>();
  @Output() readonly modelsRequested = new EventEmitter<'codex' | 'claude'>();
  @Output() readonly applied = new EventEmitter<AiSettingsValue>();
  draftModel = '';
  initializedAgentId = '';

  ngOnInit(): void {
    this.draftModel = this.selection.customModel;
    this.initializedAgentId =
      this.catalog.agents.find((agent) => agent.id === this.selection.agentId)
        ?.id ??
      this.catalog.agents[0]?.id ??
      '';
  }

  get disabled(): boolean {
    return this.running || this.loading || !!this.importingProvider;
  }

  save(): void {
    if (this.disabled) return;
    this.applied.emit({
      selection: {...this.selection, customModel: this.draftModel},
      providerSelections: this.providerSelections,
    });
  }
}

function deferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
} {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return {promise, resolve, reject};
}

describe('AppSettingsComponent', () => {
  let fixture: ComponentFixture<AppSettingsComponent>;
  let component: AppSettingsComponent;
  let catalogSpy: jasmine.Spy<AiGatewayClient['catalog']>;
  let importSpy: jasmine.Spy<AiGatewayClient['importLocalConfig']>;
  let saveSpy: jasmine.Spy<AiGatewayClient['saveSettings']>;

  beforeEach(async () => {
    setLanguage('en');
    catalogSpy = spyOn(AiGatewayClient.prototype, 'catalog').and.resolveTo(
      catalog,
    );
    importSpy = spyOn(
      AiGatewayClient.prototype,
      'importLocalConfig',
    ).and.callFake(async (providerId) =>
      providerId === 'codex' ? codexProvider : claudeProvider,
    );
    saveSpy = spyOn(AiGatewayClient.prototype, 'saveSettings').and.callFake(
      async (savedSelection) => ({selection: {...savedSelection}}),
    );
    await TestBed.configureTestingModule({
      imports: [AppSettingsComponent, NoopAnimationsModule],
    })
      .overrideComponent(AppSettingsComponent, {
        remove: {imports: [AiSettingsComponent]},
        add: {imports: [AiSettingsFormStub]},
      })
      .compileComponents();
    fixture = TestBed.createComponent(AppSettingsComponent);
    component = fixture.componentInstance;
    component.endpoint = 'http://gateway.test/';
    component.selection = {...selection};
  });

  afterEach(() => {
    fixture.destroy();
    setLanguage('en');
  });

  async function render(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function element<T extends HTMLElement = HTMLElement>(selector: string): T {
    return fixture.nativeElement.querySelector(selector) as T;
  }

  function form(): AiSettingsFormStub {
    return fixture.debugElement.query(By.directive(AiSettingsFormStub))
      .componentInstance as AiSettingsFormStub;
  }

  function selectSection(section: 'general' | 'ai' | 'about'): void {
    element(`.settings-menu button[data-section="${section}"]`).click();
    fixture.detectChanges();
  }

  function selectThemeMode(mode: ThemeMode): void {
    const select = element<HTMLSelectElement>('.theme-mode-select');
    select.value = mode;
    select.dispatchEvent(new Event('change', {bubbles: true}));
    fixture.detectChanges();
  }

  function selectDisplayScale(value: number): void {
    const select = element<HTMLSelectElement>('.display-scale-select');
    select.selectedIndex = Array.from(select.options).findIndex(
      (option) => option.textContent?.trim() === `${value}%`,
    );
    select.dispatchEvent(new Event('change', {bubbles: true}));
    fixture.detectChanges();
  }

  function displayScaleLabel(): string | undefined {
    return element<HTMLSelectElement>('.display-scale-select')
      .selectedOptions[0]?.textContent?.trim();
  }

  function resetConfirmation(): HTMLInputElement {
    return element<HTMLInputElement>(
      '.confirm-trace-reset input[type="checkbox"]',
    );
  }

  it('shows a checked reset confirmation under General without an AI endpoint', async () => {
    component.endpoint = undefined;
    await render();
    expect(element('.settings-confirmations h3').textContent).toBe(
      'Confirmations',
    );
    expect(element('.confirm-trace-reset label').textContent?.trim()).toBe(
      'Confirm before resetting trace data',
    );
    expect(resetConfirmation().getAttribute('aria-label')).toBe(
      'Confirm before resetting trace data',
    );
    expect(resetConfirmation().checked).toBeTrue();
    expect(resetConfirmation().disabled).toBeFalse();
    expect(element('#settings-ai-panel .confirm-trace-reset')).toBeNull();
    const changed = spyOn(component.confirmTraceResetChanged, 'emit');
    resetConfirmation().click();
    expect(changed).toHaveBeenCalledOnceWith(false);
    expect(component.confirmTraceReset).toBeTrue();
    expect(catalogSpy).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('emits reset confirmation changes immediately without changing inputs or AI drafts', async () => {
    await render();
    const child = form();
    child.draftModel = 'unsaved-model';
    const selectionInput = component.selection;
    const providerSelectionsInput = component.providerSelections;
    const changed = spyOn(component.confirmTraceResetChanged, 'emit');
    const applied = spyOn(component.applied, 'emit');
    const closed = spyOn(component.closed, 'emit');
    const save = spyOn(child, 'save');
    resetConfirmation().click();
    expect(changed).toHaveBeenCalledOnceWith(false);
    expect(component.confirmTraceReset).toBeTrue();
    fixture.componentRef.setInput('confirmTraceReset', false);
    await render();
    resetConfirmation().click();
    expect(changed.calls.allArgs()).toEqual([[false], [true]]);
    expect(component.confirmTraceReset).toBeFalse();
    expect(component.selection).toBe(selectionInput);
    expect(component.selection).toEqual(selection);
    expect(component.providerSelections).toBe(providerSelectionsInput);
    expect(form()).toBe(child);
    expect(child.draftModel).toBe('unsaved-model');
    expect(save).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
    expect(importSpy).not.toHaveBeenCalled();
    expect(catalogSpy).toHaveBeenCalledTimes(1);
    expect(applied).not.toHaveBeenCalled();
    expect(closed).not.toHaveBeenCalled();
  });

  it('reflects controlled reset confirmation updates without emitting', async () => {
    await render();
    const changed = spyOn(component.confirmTraceResetChanged, 'emit');
    for (const value of [false, true, false]) {
      fixture.componentRef.setInput('confirmTraceReset', value);
      await render();
      expect(resetConfirmation().checked).toBe(value);
    }
    expect(changed).not.toHaveBeenCalled();
  });

  it('localizes reset confirmation labels without changing confirmation or AI state', async () => {
    fixture.componentRef.setInput('confirmTraceReset', false);
    await render();
    const child = form();
    child.draftModel = 'unsaved-model';
    const changed = spyOn(component.confirmTraceResetChanged, 'emit');
    for (const locale of ['zh-CN', 'en'] as const) {
      setLanguage(locale);
      await render();
      if (locale === 'zh-CN') {
        expect(translate('Confirmations')).not.toBe('Confirmations');
        expect(translate('Confirm before resetting trace data')).not.toBe(
          'Confirm before resetting trace data',
        );
      }
      expect(element('.settings-confirmations').getAttribute('aria-label')).toBe(
        translate('Confirmations'),
      );
      expect(element('.settings-confirmations h3').textContent).toBe(
        translate('Confirmations'),
      );
      expect(element('.confirm-trace-reset label').textContent?.trim()).toBe(
        translate('Confirm before resetting trace data'),
      );
      expect(resetConfirmation().getAttribute('aria-label')).toBe(
        translate('Confirm before resetting trace data'),
      );
      expect(resetConfirmation().checked).toBeFalse();
      expect(component.confirmTraceReset).toBeFalse();
      expect(form()).toBe(child);
      expect(child.draftModel).toBe('unsaved-model');
      expect(component.selection).toEqual(selection);
    }
    expect(changed).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('preserves an immediate reset confirmation choice across tabs and Cancel', async () => {
    await render();
    const child = form();
    child.draftModel = 'unsaved-model';
    const changed = spyOn(component.confirmTraceResetChanged, 'emit');
    const closed = spyOn(component.closed, 'emit');
    resetConfirmation().click();
    fixture.componentRef.setInput('confirmTraceReset', false);
    await render();
    selectSection('ai');
    selectSection('general');
    expect(resetConfirmation().checked).toBeFalse();
    expect(form()).toBe(child);
    expect(child.draftModel).toBe('unsaved-model');
    element('.settings-cancel').click();
    expect(changed).toHaveBeenCalledOnceWith(false);
    expect(component.confirmTraceReset).toBeFalse();
    expect(closed).toHaveBeenCalledTimes(1);
    expect(saveSpy).not.toHaveBeenCalled();
  });

  for (const state of [
    'running',
    'loadingConversation',
    'loading',
    'saving',
  ] as const) {
    it(`keeps reset confirmation usable while AI is ${state}`, async () => {
      await render();
      component[state] = true;
      fixture.detectChanges();
      const changed = spyOn(component.confirmTraceResetChanged, 'emit');
      expect(element<HTMLButtonElement>('.settings-save').disabled).toBeTrue();
      expect(resetConfirmation().disabled).toBeFalse();
      resetConfirmation().click();
      expect(changed).toHaveBeenCalledOnceWith(false);
      expect(component.confirmTraceReset).toBeTrue();
      expect(saveSpy).not.toHaveBeenCalled();
    });
  }

  it('insets every General dropdown arrow without intercepting selection', async () => {
    await render();
    const selects: HTMLSelectElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.general-settings select'),
    );
    expect(selects.length).toBe(3);
    for (const select of selects) {
      const arrow = select.parentElement?.querySelector('.settings-select-arrow');
      expect(arrow).not.toBeNull();
      expect(arrow?.getAttribute('aria-hidden')).toBe('true');
      expect(getComputedStyle(select).appearance).toBe('none');
      expect(getComputedStyle(select).paddingRight).toBe('36px');
      expect(getComputedStyle(select).height).toBe('32px');
      expect(getComputedStyle(arrow!).right).toBe('8px');
      expect(getComputedStyle(arrow!).pointerEvents).toBe('none');
    }
  });

  it('opens General without a gateway or an AI workspace and leaves General usable', async () => {
    component.endpoint = undefined;
    await render();
    expect(element('.settings-dialog').getAttribute('role')).toBe('dialog');
    expect(element('.settings-dialog').getAttribute('aria-label')).toBe(
      'Settings',
    );
    expect(element('.settings-header h2').textContent).toBe('Settings');
    expect(element('ai-panel')).toBeNull();
    expect(element('.ai-sidebar')).toBeNull();
    expect(element('.ai-panel-header')).toBeNull();
    expect(catalogSpy).not.toHaveBeenCalled();
    expect(component.catalogReady).toBeTrue();
    expect(form().disabled).toBeTrue();
    expect(
      element<HTMLSelectElement>('.interface-language-select').disabled,
    ).toBeFalse();
    expect(
      element<HTMLSelectElement>('.theme-mode-select').disabled,
    ).toBeFalse();
    expect(element<HTMLSelectElement>('.theme-mode-select').value).toBe(
      'system',
    );
    expect(element<HTMLButtonElement>('.settings-save').disabled).toBeFalse();
    expect(element('#settings-general-panel').hidden).toBeFalse();
    expect(element('#settings-ai-panel').hidden).toBeTrue();
    expect(element('#settings-ai-panel .interface-language-select')).toBeNull();
    expect(element('#settings-ai-panel .theme-mode-select')).toBeNull();
    expect(element('#settings-ai-panel .display-scale-control')).toBeNull();
  });

  it('captures heading focus and traps focus between the close and save controls', async () => {
    await render();
    const trap = fixture.debugElement
      .query(By.directive(CdkTrapFocus))
      .injector.get(CdkTrapFocus);
    expect(trap.autoCapture).toBeTrue();
    expect(document.activeElement).toBe(element('.settings-header h2'));
    expect(trap.focusTrap.focusFirstTabbableElement()).toBeTrue();
    expect(document.activeElement).toBe(element('.settings-close-button'));
    expect(trap.focusTrap.focusLastTabbableElement()).toBeTrue();
    expect(document.activeElement).toBe(element('.settings-save'));
  });

  it('changes the interface language immediately without applying AI edits', async () => {
    await render();
    const applied = spyOn(component.applied, 'emit');
    const child = form();
    child.draftModel = 'unsaved-model';
    const select = element<HTMLSelectElement>('.interface-language-select');
    select.value = 'zh-CN';
    select.dispatchEvent(new Event('change', {bubbles: true}));
    await render();
    expect(language()).toBe('zh-CN');
    expect(element('.settings-header h2').textContent).toBe(
      translate('Settings'),
    );
    expect(select.value).toBe('zh-CN');
    expect(form()).toBe(child);
    expect(child.draftModel).toBe('unsaved-model');
    expect(component.selection).toEqual(selection);
    expect(applied).not.toHaveBeenCalled();
  });

  it('offers Follow system, English and Chinese and selects the restored system preference', async () => {
    localStorage.setItem(LANGUAGE_PREFERENCE_KEY, 'system');
    initializeLanguage(['en-US']);
    await render();
    const select = element<HTMLSelectElement>('.interface-language-select');
    expect(Array.from(select.options, (option) => [option.value, option.textContent]))
      .toEqual([
        ['system', 'Follow system'],
        ['en', 'English'],
        ['zh-CN', '简体中文'],
      ]);
    expect(languagePreference()).toBe('system');
    expect(language()).toBe('en');
    expect(select.value).toBe('system');
  });

  it('keeps Follow system selected and localized across system changes without applying or losing AI drafts', async () => {
    const browserLanguages = spyOnProperty(navigator, 'languages', 'get')
      .and.returnValue(['en-US']);
    await render();
    const child = form();
    const input = element<HTMLInputElement>('ai-settings input');
    input.value = 'unsaved-model';
    input.dispatchEvent(new Event('input', {bubbles: true}));
    await render();
    const applied = spyOn(component.applied, 'emit');
    const closed = spyOn(component.closed, 'emit');
    const save = spyOn(child, 'save');
    const selectionInput = component.selection;
    const select = element<HTMLSelectElement>('.interface-language-select');
    select.value = 'system';
    select.dispatchEvent(new Event('change', {bubbles: true}));
    await render();
    expect(localStorage.getItem(LANGUAGE_PREFERENCE_KEY)).toBe('system');
    expect(select.selectedOptions[0].textContent).toBe('Follow system');

    for (const [locales, resolved, label] of [
      [['zh-TW'], 'zh-CN', '跟随系统'],
      [['en-GB'], 'en', 'Follow system'],
    ] as const) {
      browserLanguages.and.returnValue([...locales]);
      window.dispatchEvent(new Event('languagechange'));
      await render();
      expect(language()).toBe(resolved);
      expect(document.documentElement.lang).toBe(resolved);
      expect(select.value).toBe('system');
      expect(select.selectedOptions[0].textContent).toBe(label);
      expect(element('.interface-language-select')).toBe(select);
      expect(form()).toBe(child);
      expect(element('ai-settings input')).toBe(input);
      expect(input.value).toBe('unsaved-model');
      expect(child.draftModel).toBe('unsaved-model');
      expect(component.selection).toBe(selectionInput);
    }
    selectSection('ai');
    expect(form()).toBe(child);
    expect(catalogSpy).toHaveBeenCalledTimes(1);
    expect(save).not.toHaveBeenCalled();
    expect(applied).not.toHaveBeenCalled();
    expect(closed).not.toHaveBeenCalled();
  });

  it('selects explicit interface overrides and ignores system events until Follow system is selected again', async () => {
    const browserLanguages = spyOnProperty(navigator, 'languages', 'get')
      .and.returnValue(['zh-CN']);
    await render();
    const select = element<HTMLSelectElement>('.interface-language-select');
    for (const preference of ['zh-CN', 'en'] as const) {
      select.value = preference;
      select.dispatchEvent(new Event('change', {bubbles: true}));
      browserLanguages.and.returnValue([preference === 'en' ? 'zh-CN' : 'en-US']);
      window.dispatchEvent(new Event('languagechange'));
      await render();
      expect(languagePreference()).toBe(preference);
      expect(language()).toBe(preference);
      expect(select.value).toBe(preference);
      expect(localStorage.getItem(LANGUAGE_PREFERENCE_KEY)).toBe(preference);
    }
    select.value = 'system';
    select.dispatchEvent(new Event('change', {bubbles: true}));
    await render();
    expect(languagePreference()).toBe('system');
    expect(language()).toBe('zh-CN');
    expect(select.value).toBe('system');
    expect(select.selectedOptions[0].textContent).toBe('跟随系统');
    expect(localStorage.getItem(LANGUAGE_PREFERENCE_KEY)).toBe('system');
  });

  it('emits all three theme modes without mutating the root-owned input or applying AI settings', async () => {
    component.endpoint = undefined;
    await render();
    const select = element<HTMLSelectElement>('.theme-mode-select');
    expect(select.value).toBe('system');
    expect(
      Array.from(select.options, (option) => [option.value, option.textContent]),
    ).toEqual([
      ['system', 'Follow system'],
      ['dark', 'Dark mode'],
      ['light', 'Light mode'],
    ]);
    const changed = spyOn(component.themeModeChanged, 'emit');
    const applied = spyOn(component.applied, 'emit');
    for (const mode of ['dark', 'light', 'system'] as const) {
      selectThemeMode(mode);
    }
    expect(changed.calls.allArgs()).toEqual([['dark'], ['light'], ['system']]);
    expect(component.themeMode).toBe('system');
    expect(applied).not.toHaveBeenCalled();
  });

  it('localizes the theme label and options while preserving the root-selected mode', async () => {
    await render();
    const changed = spyOn(component.themeModeChanged, 'emit');
    const select = element<HTMLSelectElement>('.theme-mode-select');
    for (const [locale, label, labels] of [
      ['en', 'Color theme', ['Follow system', 'Dark mode', 'Light mode']],
      ['zh-CN', '颜色主题', ['跟随系统', '暗色模式', '亮色模式']],
    ] as const) {
      setLanguage(locale);
      for (const [index, mode] of (['system', 'dark', 'light'] as const).entries()) {
        fixture.componentRef.setInput('themeMode', mode);
        await render();
        expect(select.getAttribute('aria-label')).toBe(label);
        expect(select.labels?.[0].querySelector('span')?.textContent).toBe(label);
        expect(Array.from(select.options, (option) => option.textContent)).toEqual(
          [...labels],
        );
        expect(select.value).toBe(mode);
        expect(select.selectedOptions[0].textContent).toBe(labels[index]);
      }
    }
    setLanguage('en');
    await render();
    expect(select.value).toBe('light');
    expect(select.selectedOptions[0].textContent).toBe('Light mode');
    expect(changed).not.toHaveBeenCalled();
  });

  it('changes theme immediately without applying AI drafts and does not undo the choice on Cancel', async () => {
    await render();
    const child = form();
    child.draftModel = 'unsaved-model';
    const changed = spyOn(component.themeModeChanged, 'emit');
    const applied = spyOn(component.applied, 'emit');
    const closed = spyOn(component.closed, 'emit');
    selectThemeMode('dark');
    expect(changed).toHaveBeenCalledOnceWith('dark');
    fixture.componentRef.setInput('themeMode', 'dark');
    await render();
    selectSection('ai');
    expect(form()).toBe(child);
    expect(child.draftModel).toBe('unsaved-model');
    expect(component.selection).toEqual(selection);
    expect(applied).not.toHaveBeenCalled();
    element('.settings-cancel').click();
    expect(changed).toHaveBeenCalledOnceWith('dark');
    expect(component.themeMode).toBe('dark');
    expect(applied).not.toHaveBeenCalled();
    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('renders a labeled preset selector and a disabled default reset', async () => {
    component.endpoint = undefined;
    await render();
    const select = element<HTMLSelectElement>('.display-scale-select');
    expect(select.tagName).toBe('SELECT');
    expect(Array.from(select.options).map((option) => option.textContent?.trim()))
      .toEqual(['80%', '90%', '100%', '110%', '120%', '130%', '140%']);
    expect(select.disabled).toBeFalse();
    expect(select.getAttribute('aria-label')).toBe('Display size');
    expect(select.labels?.[0].textContent?.trim()).toBe('Display size');
    expect(displayScaleLabel()).toBe('100%');
    expect(element('input[type="range"]')).toBeNull();
    const reset = element<HTMLButtonElement>('.display-scale-reset');
    expect(reset.disabled).toBeTrue();
    expect(reset.getAttribute('aria-label')).toBe('Reset display size');
    expect(reset.querySelector('mat-icon')?.textContent).toBe('restart_alt');
    const changed = spyOn(component.displayScaleChanged, 'emit');
    reset.click();
    expect(changed).not.toHaveBeenCalled();
  });

  it('emits numeric display size changes immediately without mutating inputs or saving AI drafts', async () => {
    await render();
    const child = form();
    child.draftModel = 'unsaved-model';
    const changed = spyOn(component.displayScaleChanged, 'emit');
    const applied = spyOn(component.applied, 'emit');
    const closed = spyOn(component.closed, 'emit');
    const save = spyOn(child, 'save');
    const selectionInput = component.selection;
    const providerSelectionsInput = component.providerSelections;
    for (const value of [80, 110, 140]) {
      selectDisplayScale(value);
    }
    expect(changed.calls.allArgs()).toEqual([[80], [110], [140]]);
    expect(component.displayScale).toBe(100);
    expect(component.selection).toBe(selectionInput);
    expect(component.selection).toEqual(selection);
    expect(component.providerSelections).toBe(providerSelectionsInput);
    expect(form()).toBe(child);
    expect(child.draftModel).toBe('unsaved-model');
    expect(save).not.toHaveBeenCalled();
    expect(applied).not.toHaveBeenCalled();
    expect(closed).not.toHaveBeenCalled();
  });

  it('rejects invalid display size events without changing the controlled value', async () => {
    await render();
    const changed = spyOn(component.displayScaleChanged, 'emit');
    const select = fixture.debugElement.query(By.css('.display-scale-select'));
    for (const value of [
      undefined,
      null,
      '',
      '110',
      false,
      {},
      [],
      NaN,
      Infinity,
      -Infinity,
      0,
      79,
      81,
      105,
      110.5,
      141,
    ]) {
      select.triggerEventHandler('ngModelChange', value);
    }
    fixture.detectChanges();
    expect(changed).not.toHaveBeenCalled();
    expect(component.displayScale).toBe(100);
    expect(displayScaleLabel()).toBe('100%');
  });

  it('reflects root display size updates in the selected preset and reset state without emitting', async () => {
    await render();
    const changed = spyOn(component.displayScaleChanged, 'emit');
    for (const value of [80, 110, 140, 100]) {
      fixture.componentRef.setInput('displayScale', value);
      await render();
      expect(displayScaleLabel()).toBe(`${value}%`);
      expect(element<HTMLButtonElement>('.display-scale-reset').disabled).toBe(
        value === 100,
      );
    }
    expect(changed).not.toHaveBeenCalled();
  });

  it('emits reset to 100 without applying AI edits or reverting the root value on Cancel', async () => {
    fixture.componentRef.setInput('displayScale', 140);
    await render();
    const changed = spyOn(component.displayScaleChanged, 'emit');
    const applied = spyOn(component.applied, 'emit');
    const closed = spyOn(component.closed, 'emit');
    const child = form();
    child.draftModel = 'unsaved-model';
    const save = spyOn(child, 'save');
    element('.display-scale-reset').click();
    expect(changed).toHaveBeenCalledOnceWith(100);
    expect(component.displayScale).toBe(140);
    fixture.componentRef.setInput('displayScale', 100);
    await render();
    selectDisplayScale(110);
    fixture.componentRef.setInput('displayScale', 110);
    await render();
    selectSection('ai');
    expect(form()).toBe(child);
    expect(child.draftModel).toBe('unsaved-model');
    element('.settings-cancel').click();
    expect(changed.calls.allArgs()).toEqual([[100], [110]]);
    expect(component.displayScale).toBe(110);
    expect(component.selection).toEqual(selection);
    expect(save).not.toHaveBeenCalled();
    expect(applied).not.toHaveBeenCalled();
    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('localizes display size and reset labels without changing the percentage', async () => {
    fixture.componentRef.setInput('displayScale', 110);
    await render();
    const changed = spyOn(component.displayScaleChanged, 'emit');
    for (const [locale, label, resetLabel] of [
      ['en', 'Display size', 'Reset display size'],
      ['zh-CN', '显示大小', '重置显示大小'],
    ] as const) {
      setLanguage(locale);
      await render();
      const select = element<HTMLSelectElement>('.display-scale-select');
      expect(select.getAttribute('aria-label')).toBe(label);
      expect(select.labels?.[0].textContent?.trim()).toBe(label);
      expect(element('.display-scale-reset').getAttribute('aria-label')).toBe(
        resetLabel,
      );
      expect(
        fixture.debugElement
          .query(By.css('.display-scale-reset'))
          .injector.get(MatTooltip).message,
      ).toBe(resetLabel);
      expect(displayScaleLabel()).toBe('110%');
    }
    expect(changed).not.toHaveBeenCalled();
  });

  it('keeps display size changes and reset available without an AI endpoint', async () => {
    component.endpoint = undefined;
    fixture.componentRef.setInput('displayScale', 110);
    await render();
    const changed = spyOn(component.displayScaleChanged, 'emit');
    expect(
      element<HTMLSelectElement>('.display-scale-select').disabled,
    ).toBeFalse();
    expect(
      element<HTMLButtonElement>('.display-scale-reset').disabled,
    ).toBeFalse();
    selectDisplayScale(80);
    element('.display-scale-reset').click();
    expect(changed.calls.allArgs()).toEqual([[80], [100]]);
    expect(catalogSpy).not.toHaveBeenCalled();
  });

  it('supports vertical roving tabs with Up, Down, Home and End', async () => {
    await render();
    expect(element('.settings-menu').getAttribute('role')).toBe('tablist');
    expect(element('.settings-menu').getAttribute('aria-orientation')).toBe(
      'vertical',
    );
    for (const [key, expected] of [
      ['ArrowDown', 'ai'],
      ['ArrowDown', 'about'],
      ['ArrowDown', 'general'],
      ['ArrowUp', 'about'],
      ['ArrowUp', 'ai'],
      ['Home', 'general'],
      ['End', 'about'],
      ['ArrowDown', 'general'],
      ['ArrowDown', 'ai'],
      ['ArrowUp', 'general'],
    ] as const) {
      const active = element(`button[data-section="${component.section}"]`);
      const event = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
      });
      active.dispatchEvent(event);
      fixture.detectChanges();
      const tab = element(`button[data-section="${expected}"]`);
      expect(event.defaultPrevented).toBeTrue();
      expect(tab.getAttribute('role')).toBe('tab');
      expect(tab.getAttribute('aria-selected')).toBe('true');
      expect(tab.tabIndex).toBe(0);
      expect(document.activeElement).toBe(tab);
      expect(element(`#settings-${expected}-panel`).hidden).toBeFalse();
      expect(
        element(`#settings-${expected}-panel`).getAttribute('aria-labelledby'),
      ).toBe(tab.id);
    }
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    element('button[data-section="general"]').dispatchEvent(event);
    expect(component.section).toBe('general');
    expect(event.defaultPrevented).toBeFalse();
  });

  it('honors the initial AI section and preserves the mounted form across menu changes', async () => {
    component.section = 'ai';
    await render();
    const child = form();
    const input = element<HTMLInputElement>('ai-settings input');
    input.value = 'provider-draft';
    input.dispatchEvent(new Event('input', {bubbles: true}));
    fixture.detectChanges();
    selectSection('general');
    expect(element('#settings-ai-panel').hidden).toBeTrue();
    selectSection('ai');
    expect(form()).toBe(child);
    expect(element('ai-settings input')).toBe(input);
    expect(input.value).toBe('provider-draft');
    expect(component.selection.customModel).toBe('');
    expect(catalogSpy).toHaveBeenCalledTimes(1);
  });

  it('shows the build version from package metadata in a localized About panel without a gateway', async () => {
    component.endpoint = undefined;
    await render();
    selectSection('about');
    expect(element('#settings-about-panel').hidden).toBeFalse();
    expect(element('#settings-general-panel').hidden).toBeTrue();
    expect(element('#settings-ai-panel').hidden).toBeTrue();
    expect(element('.app-version').textContent?.trim()).toBe(appMetadata.version);
    expect(element('.about-product').textContent).toBe('Winscope');
    expect(element('.about-details dt').textContent).toBe('Version');
    setLanguage('zh-CN');
    fixture.detectChanges();
    expect(element('#settings-about-tab').textContent).toBe('关于');
    expect(element('.about-details dt').textContent).toBe('版本号');
    expect(element('.app-version').textContent?.trim()).toBe(appMetadata.version);
    expect(catalogSpy).not.toHaveBeenCalled();
  });

  it('keeps the mounted AI draft when visiting About and focuses externally selected About', async () => {
    await render();
    const child = form();
    child.draftModel = 'unsaved-model';
    fixture.componentRef.setInput('section', 'about');
    fixture.detectChanges();
    expect(document.activeElement).toBe(element('#settings-about-tab'));
    expect(element('#settings-about-panel').hidden).toBeFalse();
    selectSection('ai');
    expect(form()).toBe(child);
    expect(child.draftModel).toBe('unsaved-model');
    expect(catalogSpy).toHaveBeenCalledTimes(1);
  });

  it('waits for catalog completion before initializing the embedded form', async () => {
    const request = deferred<AiCatalog>();
    catalogSpy.and.returnValue(request.promise);
    component.selection = {...selection, agentId: ''};
    fixture.componentRef.setInput('displayScale', 110);
    fixture.detectChanges();
    expect(element('ai-settings')).toBeNull();
    expect(component.catalogReady).toBeFalse();
    expect(element<HTMLButtonElement>('.settings-save').disabled).toBeTrue();
    expect(
      element<HTMLSelectElement>('.theme-mode-select').disabled,
    ).toBeFalse();
    const changed = spyOn(component.themeModeChanged, 'emit');
    selectThemeMode('light');
    expect(changed).toHaveBeenCalledOnceWith('light');
    const scaleChanged = spyOn(component.displayScaleChanged, 'emit');
    expect(
      element<HTMLSelectElement>('.display-scale-select').disabled,
    ).toBeFalse();
    expect(
      element<HTMLButtonElement>('.display-scale-reset').disabled,
    ).toBeFalse();
    selectDisplayScale(140);
    element('.display-scale-reset').click();
    expect(scaleChanged.calls.allArgs()).toEqual([[140], [100]]);
    request.resolve(catalog);
    await request.promise;
    await render();
    expect(component.catalogReady).toBeTrue();
    expect(form().initializedAgentId).toBe('display');
    expect(form().catalog).toBe(catalog);
  });

  it('honors root section changes while already open without remounting provider drafts', async () => {
    fixture.componentRef.setInput('section', 'general');
    await render();
    const child = form();
    child.draftModel = 'pending-provider-edit';
    fixture.componentRef.setInput('section', 'ai');
    fixture.detectChanges();
    expect(element('#settings-ai-panel').hidden).toBeFalse();
    expect(document.activeElement).toBe(element('button[data-section="ai"]'));
    fixture.componentRef.setInput('section', 'general');
    fixture.detectChanges();
    expect(element('#settings-general-panel').hidden).toBeFalse();
    expect(document.activeElement).toBe(
      element('button[data-section="general"]'),
    );
    expect(form()).toBe(child);
    expect(child.draftModel).toBe('pending-provider-edit');
    expect(catalogSpy).toHaveBeenCalledTimes(1);
  });

  it('publishes the initial catalog and forwards restored selection inputs', async () => {
    const changed = spyOn(component.catalogChanged, 'emit');
    await render();
    expect(changed).toHaveBeenCalledOnceWith(catalog);
    const restored = {
      ...selection,
      providerId: 'claude',
      modelId: 'claude-model',
    };
    const providerSelections = {
      codex: {
        modelId: 'codex-model',
        customModel: '',
        reasoningLevel: 'high',
      },
    };
    fixture.componentRef.setInput('selection', restored);
    fixture.componentRef.setInput('providerSelections', providerSelections);
    fixture.componentRef.setInput('existingSession', true);
    fixture.detectChanges();
    expect(form().selection).toBe(restored);
    expect(form().providerSelections).toBe(providerSelections);
    expect(form().existingSession).toBeTrue();
  });

  it('imports one provider at a time and publishes success only after catalog refresh', async () => {
    const changed = spyOn(component.catalogChanged, 'emit');
    await render();
    selectSection('ai');
    const child = form();
    child.draftModel = 'keep-this-draft';
    const imported = deferred<AiProvider>();
    const refreshed = deferred<AiCatalog>();
    importSpy.and.returnValue(imported.promise);
    catalogSpy.and.returnValue(refreshed.promise);
    const task = component.importLocalConfig('codex');
    fixture.detectChanges();
    const signal = importSpy.calls.mostRecent().args[1];
    expect(component.importingProvider).toBe('codex');
    expect(form().disabled).toBeTrue();
    expect(element<HTMLButtonElement>('.settings-save').disabled).toBeTrue();
    const save = spyOn(child, 'save');
    component.save();
    expect(save).not.toHaveBeenCalled();
    await component.importLocalConfig('claude');
    expect(importSpy).toHaveBeenCalledTimes(1);
    selectSection('general');
    expect(signal?.aborted).toBeFalse();
    imported.resolve(codexProvider);
    await imported.promise;
    expect(catalogSpy).toHaveBeenCalledTimes(2);
    expect(component.importedProviders['codex']).toBeUndefined();
    expect(component.importingProvider).toBe('codex');
    expect(changed).toHaveBeenCalledTimes(1);
    refreshed.resolve(catalog);
    await task;
    fixture.detectChanges();
    expect(catalogSpy.calls.mostRecent().args[0]).toBe(signal);
    expect(component.importedProviders['codex']).toBe(codexProvider);
    expect(component.importingProvider).toBe('');
    expect(changed).toHaveBeenCalledTimes(2);
    selectSection('ai');
    expect(form()).toBe(child);
    expect(form().draftModel).toBe('keep-this-draft');
    expect(form().importedProviders['codex']).toBe(codexProvider);
  });

  it('routes form import requests to their own providers and keeps statuses independent', async () => {
    await render();
    selectSection('ai');
    importSpy.and.rejectWith(new Error('/private/key sk-secret-import'));
    element('button[data-provider="codex"]').click();
    await render();
    expect(importSpy.calls.mostRecent().args[0]).toBe('codex');
    expect(component.importErrors['codex']).toContain(
      'Could not read local configuration.',
    );
    importSpy.and.resolveTo(claudeProvider);
    element('button[data-provider="claude"]').click();
    await render();
    expect(importSpy.calls.mostRecent().args[0]).toBe('claude');
    expect(component.importErrors['codex']).toContain(
      'Could not read local configuration.',
    );
    expect(component.importErrors['claude']).toBe('');
    expect(component.importedProviders['claude']).toBe(claudeProvider);
    expect(component.importedProviders['codex']).toBeUndefined();
    const text = fixture.nativeElement.textContent as string;
    expect(text).not.toContain('/private/key');
    expect(text).not.toContain('sk-secret-import');
  });

  it('retains one provider success when the other provider import fails', async () => {
    await render();
    await component.importLocalConfig('codex');
    importSpy.and.rejectWith(new Error('secret'));
    await component.importLocalConfig('claude');
    expect(component.importedProviders['codex']).toBe(codexProvider);
    expect(component.importErrors['codex']).toBe('');
    expect(component.importErrors['claude']).toContain(
      'Could not read local configuration.',
    );
    importSpy.and.resolveTo(claudeProvider);
    await component.importLocalConfig('claude');
    expect(component.importErrors['claude']).toBe('');
    expect(component.importedProviders['codex']).toBe(codexProvider);
    expect(component.importedProviders['claude']).toBe(claudeProvider);
  });

  it('does not publish a successful POST if the catalog refresh fails', async () => {
    const changed = spyOn(component.catalogChanged, 'emit');
    await render();
    catalogSpy.and.rejectWith(new Error('https://user:key@host/private/path'));
    await component.importLocalConfig('codex');
    fixture.detectChanges();
    expect(component.catalog).toBe(catalog);
    expect(component.importedProviders['codex']).toBeUndefined();
    expect(component.importErrors['codex']).toContain(
      'Could not read local configuration.',
    );
    expect(component.importingProvider).toBe('');
    expect(changed).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.textContent).not.toContain('user:key');
    expect(fixture.nativeElement.textContent).not.toContain('/private/path');
  });

  it('shows only a generic catalog error and still permits General settings', async () => {
    catalogSpy.and.rejectWith(
      new Error('/Users/private/config sk-catalog-key'),
    );
    component.section = 'ai';
    const changed = spyOn(component.catalogChanged, 'emit');
    await render();
    expect(element('.settings-error').textContent).toBe(
      'Could not load AI settings. Close settings and try again.',
    );
    expect(fixture.nativeElement.textContent).not.toContain('/Users/private');
    expect(fixture.nativeElement.textContent).not.toContain('sk-catalog-key');
    expect(component.catalogReady).toBeTrue();
    expect(form().disabled).toBeTrue();
    expect(changed).not.toHaveBeenCalled();
    selectSection('general');
    expect(
      element<HTMLSelectElement>('.interface-language-select').disabled,
    ).toBeFalse();
    const closed = spyOn(component.closed, 'emit');
    element('.settings-save').click();
    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('aborts the initial catalog on close and ignores its stale completion', async () => {
    const request = deferred<AiCatalog>();
    catalogSpy.and.returnValue(request.promise);
    const changed = spyOn(component.catalogChanged, 'emit');
    fixture.detectChanges();
    const signal = catalogSpy.calls.mostRecent().args[0];
    element('.settings-close-button').click();
    expect(signal?.aborted).toBeTrue();
    request.resolve(catalog);
    await request.promise;
    fixture.detectChanges();
    expect(component.catalog.agents).toEqual([]);
    expect(component.catalogReady).toBeFalse();
    expect(changed).not.toHaveBeenCalled();
  });

  it('aborts an import on cancel and ignores a late POST response', async () => {
    await render();
    const imported = deferred<AiProvider>();
    importSpy.and.returnValue(imported.promise);
    const changed = spyOn(component.catalogChanged, 'emit');
    const task = component.importLocalConfig('codex');
    const signal = importSpy.calls.mostRecent().args[1];
    element('.settings-cancel').click();
    expect(signal?.aborted).toBeTrue();
    imported.resolve(codexProvider);
    await task;
    expect(catalogSpy).toHaveBeenCalledTimes(1);
    expect(component.importedProviders).toEqual({});
    expect(changed).not.toHaveBeenCalled();
  });

  it('ignores an import refresh that completes after destroy', async () => {
    await render();
    const refreshed = deferred<AiCatalog>();
    catalogSpy.and.returnValue(refreshed.promise);
    const changed = spyOn(component.catalogChanged, 'emit');
    const task = component.importLocalConfig('claude');
    await Promise.resolve();
    const signal = catalogSpy.calls.mostRecent().args[0];
    fixture.destroy();
    expect(signal?.aborted).toBeTrue();
    refreshed.resolve({...catalog, agents: []});
    await task;
    expect(component.catalog).toBe(catalog);
    expect(component.importedProviders).toEqual({});
    expect(changed).not.toHaveBeenCalled();
  });

  it('ignores stale failures after close without publishing an error', async () => {
    await render();
    const imported = deferred<AiProvider>();
    importSpy.and.returnValue(imported.promise);
    const task = component.importLocalConfig('codex');
    component.close();
    imported.reject(new Error('/private/stale-secret'));
    await task;
    expect(component.importErrors['codex']).toBe('');
    expect(component.importedProviders).toEqual({});
  });

  it('ignores the old endpoint catalog after switching endpoints', async () => {
    const original = deferred<AiCatalog>();
    catalogSpy.and.returnValue(original.promise);
    fixture.componentRef.setInput('endpoint', 'http://old.test/');
    fixture.detectChanges();
    const signal = catalogSpy.calls.mostRecent().args[0];
    catalogSpy.and.resolveTo(catalog);
    fixture.componentRef.setInput('endpoint', 'http://new.test/');
    await render();
    expect(signal?.aborted).toBeTrue();
    original.resolve({...catalog, agents: []});
    await original.promise;
    fixture.detectChanges();
    expect(component.catalog).toBe(catalog);
    expect(form().catalog).toBe(catalog);
  });

  it('calls the form Save and persists its value before emitting and closing without mutating inputs', async () => {
    await render();
    const child = form();
    child.draftModel = 'unsaved-model';
    const request = deferred<Awaited<ReturnType<AiGatewayClient['saveSettings']>>>();
    saveSpy.and.returnValue(request.promise);
    const save = spyOn(child, 'save').and.callThrough();
    const applied = spyOn(component.applied, 'emit');
    const closed = spyOn(component.closed, 'emit');
    element('.settings-save').click();
    fixture.detectChanges();
    expect(save).toHaveBeenCalledTimes(1);
    const savedSelection = {...selection, customModel: 'unsaved-model'};
    expect(saveSpy).toHaveBeenCalledOnceWith(
      savedSelection, undefined, jasmine.any(AbortSignal),
    );
    expect(component.saving).toBeTrue();
    expect(component.runtimeDisabled).toBeTrue();
    expect(form().disabled).toBeTrue();
    expect(element<HTMLButtonElement>('.settings-save').disabled).toBeTrue();
    expect(applied).not.toHaveBeenCalled();
    expect(closed).not.toHaveBeenCalled();
    request.resolve({selection: savedSelection});
    await render();
    expect(applied).toHaveBeenCalledOnceWith({
      selection: savedSelection,
      providerSelections: {},
    });
    expect(closed).toHaveBeenCalledTimes(1);
    expect(component.selection).toEqual(selection);
  });

  it('forwards manual configuration and publishes the persisted selection and configured provider before closing', async () => {
    await render();
    const configuration: AiProviderConfiguration = {
      baseUrl: 'https://service.example/v1',
      providerName: 'Private provider',
      apiKeyEnv: 'CODEX_API_KEY',
      timeoutMs: 30_000,
    };
    const value: AiSettingsValue = {
      selection: {...selection, modelId: '__custom__', customModel: 'draft/model'},
      providerSelections: {
        codex: {modelId: '__custom__', customModel: 'draft/model', reasoningLevel: 'medium'},
      },
      configuration,
    };
    const persisted = {...value.selection, customModel: 'persisted/model'};
    const provider = {...codexProvider, configured: true, configuration};
    saveSpy.and.resolveTo({selection: persisted, provider});
    const order: string[] = [];
    const changed = spyOn(component.catalogChanged, 'emit').and.callFake(() => order.push('catalog'));
    const applied = spyOn(component.applied, 'emit').and.callFake(() => order.push('applied'));
    const closed = spyOn(component.closed, 'emit').and.callFake(() => order.push('closed'));
    await component.applySettings(value);
    expect(saveSpy).toHaveBeenCalledOnceWith(value.selection, configuration, jasmine.any(AbortSignal));
    expect(component.catalog.selection).toEqual(persisted);
    expect(component.catalog.providers).toEqual([provider, claudeProvider]);
    expect(changed).toHaveBeenCalledOnceWith(component.catalog);
    expect(applied).toHaveBeenCalledOnceWith({...value, selection: persisted});
    expect(closed).toHaveBeenCalledTimes(1);
    expect(order).toEqual(['catalog', 'applied', 'closed']);
    expect(component.selection).toEqual(selection);
    expect(value.selection.customModel).toBe('draft/model');
    expect(catalog.providers[0].configured).toBeUndefined();
  });

  it('shows a safe save error, retains drafts and remains open for a successful retry', async () => {
    await render();
    selectSection('ai');
    const child = form();
    child.draftModel = 'keep-after-failure';
    saveSpy.and.rejectWith(new Error('/Users/private/config https://user:sk-secret@host'));
    const changed = spyOn(component.catalogChanged, 'emit');
    const applied = spyOn(component.applied, 'emit');
    const closed = spyOn(component.closed, 'emit');
    element('.settings-save').click();
    await render();
    expect(component.saveError).toBe(
      'Could not save AI settings. Check the configuration and try again.',
    );
    expect(element('.settings-error').textContent).toBe(component.saveError);
    expect(fixture.nativeElement.textContent).not.toContain('/Users/private');
    expect(fixture.nativeElement.textContent).not.toContain('sk-secret');
    expect(component.saving).toBeFalse();
    expect(component.runtimeDisabled).toBeFalse();
    expect(child.disabled).toBeFalse();
    expect(child.draftModel).toBe('keep-after-failure');
    expect(element<HTMLButtonElement>('.settings-save').disabled).toBeFalse();
    expect(changed).not.toHaveBeenCalled();
    expect(applied).not.toHaveBeenCalled();
    expect(closed).not.toHaveBeenCalled();
    const request = deferred<Awaited<ReturnType<AiGatewayClient['saveSettings']>>>();
    saveSpy.and.returnValue(request.promise);
    element('.settings-save').click();
    fixture.detectChanges();
    expect(component.saveError).toBe('');
    expect(element('.settings-error')).toBeNull();
    const saved = {...selection, customModel: 'keep-after-failure'};
    expect(saveSpy.calls.mostRecent().args[0]).toEqual(saved);
    request.resolve({selection: saved});
    await render();
    expect(saveSpy).toHaveBeenCalledTimes(2);
    expect(applied).toHaveBeenCalledOnceWith({selection: saved, providerSelections: {}});
    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('blocks duplicate saves and imports while saving but leaves General and Cancel usable', async () => {
    fixture.componentRef.setInput('displayScale', 110);
    await render();
    const request = deferred<Awaited<ReturnType<AiGatewayClient['saveSettings']>>>();
    saveSpy.and.returnValue(request.promise);
    const value = {selection, providerSelections: {}};
    const task = component.applySettings(value);
    fixture.detectChanges();
    const save = spyOn(form(), 'save');
    component.save();
    await component.applySettings(value);
    await component.importLocalConfig('codex');
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(save).not.toHaveBeenCalled();
    expect(importSpy).not.toHaveBeenCalled();
    expect(form().disabled).toBeTrue();
    expect(element<HTMLInputElement>('ai-settings input').disabled).toBeTrue();
    expect(element<HTMLSelectElement>('.interface-language-select').disabled).toBeFalse();
    expect(element<HTMLSelectElement>('.theme-mode-select').disabled).toBeFalse();
    expect(element<HTMLSelectElement>('.display-scale-select').disabled).toBeFalse();
    expect(element<HTMLButtonElement>('.settings-cancel').disabled).toBeFalse();
    expect(element<HTMLButtonElement>('.settings-close-button').disabled).toBeFalse();
    const changed = spyOn(component.themeModeChanged, 'emit');
    selectThemeMode('light');
    expect(changed).toHaveBeenCalledOnceWith('light');
    const scaleChanged = spyOn(component.displayScaleChanged, 'emit');
    selectDisplayScale(140);
    expect(scaleChanged).toHaveBeenCalledOnceWith(140);
    element('.settings-cancel').click();
    request.resolve({selection});
    await task;
  });

  for (const control of ['.settings-cancel', '.settings-close-button', 'destroy']) {
    for (const outcome of ['success', 'failure']) {
      it(`aborts a save on ${control} and ignores its late ${outcome}`, async () => {
        await render();
        const request = deferred<Awaited<ReturnType<AiGatewayClient['saveSettings']>>>();
        saveSpy.and.returnValue(request.promise);
        const applied = spyOn(component.applied, 'emit');
        const changed = spyOn(component.catalogChanged, 'emit');
        const closed = spyOn(component.closed, 'emit');
        const task = component.applySettings({selection, providerSelections: {}});
        const signal = saveSpy.calls.mostRecent().args[2];
        if (control === 'destroy') fixture.destroy();
        else element(control).click();
        expect(signal?.aborted).toBeTrue();
        expect(component.saving).toBeFalse();
        if (outcome === 'success') {
          request.resolve({selection: {...selection, providerId: 'claude'}});
        } else {
          request.reject(new Error('/private/stale sk-secret'));
        }
        await task;
        expect(component.catalog).toBe(catalog);
        expect(component.saveError).toBe('');
        expect(applied).not.toHaveBeenCalled();
        expect(changed).not.toHaveBeenCalled();
        expect(closed).toHaveBeenCalledTimes(control === 'destroy' ? 0 : 1);
      });
    }
  }

  for (const outcome of ['success', 'failure']) {
    it(`ignores a stale save ${outcome} after an endpoint change without releasing a newer save`, async () => {
      fixture.componentRef.setInput('endpoint', 'http://old.test/');
      await render();
      const original = deferred<Awaited<ReturnType<AiGatewayClient['saveSettings']>>>();
      saveSpy.and.returnValue(original.promise);
      const oldTask = component.applySettings({selection, providerSelections: {}});
      const oldSignal = saveSpy.calls.mostRecent().args[2];
      const nextCatalog = {...catalog, selection: {...selection, providerId: 'claude'}};
      catalogSpy.and.resolveTo(nextCatalog);
      fixture.componentRef.setInput('endpoint', 'http://new.test/');
      await render();
      expect(oldSignal?.aborted).toBeTrue();
      expect(component.saving).toBeFalse();
      const current = deferred<Awaited<ReturnType<AiGatewayClient['saveSettings']>>>();
      saveSpy.and.returnValue(current.promise);
      const nextSelection = {...selection, providerId: 'claude', modelId: 'claude-model'};
      const newTask = component.applySettings({selection: nextSelection, providerSelections: {}});
      const newSignal = saveSpy.calls.mostRecent().args[2];
      const changed = spyOn(component.catalogChanged, 'emit');
      const applied = spyOn(component.applied, 'emit');
      const closed = spyOn(component.closed, 'emit');
      if (outcome === 'success') original.resolve({selection});
      else original.reject(new Error('stale secret'));
      await oldTask;
      expect(component.catalog).toBe(nextCatalog);
      expect(component.saveError).toBe('');
      expect(component.saving).toBeTrue();
      expect(newSignal?.aborted).toBeFalse();
      expect(changed).not.toHaveBeenCalled();
      expect(applied).not.toHaveBeenCalled();
      expect(closed).not.toHaveBeenCalled();
      current.resolve({selection: nextSelection});
      await newTask;
      expect(applied).toHaveBeenCalledOnceWith({selection: nextSelection, providerSelections: {}});
      expect(closed).toHaveBeenCalledTimes(1);
    });
  }

  it('keeps the shell open when the embedded form rejects Save', async () => {
    await render();
    const save = spyOn(form(), 'save');
    const applied = spyOn(component.applied, 'emit');
    const closed = spyOn(component.closed, 'emit');
    element('.settings-save').click();
    expect(save).toHaveBeenCalledTimes(1);
    expect(saveSpy).not.toHaveBeenCalled();
    expect(applied).not.toHaveBeenCalled();
    expect(closed).not.toHaveBeenCalled();
  });

  for (const control of ['.settings-cancel', '.settings-close-button']) {
    it(`closes via ${control} without applying provider drafts`, async () => {
      await render();
      form().draftModel = 'discard';
      const closed = spyOn(component.closed, 'emit');
      const applied = spyOn(component.applied, 'emit');
      element(control).click();
      expect(closed).toHaveBeenCalledTimes(1);
      expect(applied).not.toHaveBeenCalled();
      expect(component.selection).toEqual(selection);
    });
  }

  it('closes only Settings on Escape and stops bubbling to the AI workspace', async () => {
    await render();
    const closed = spyOn(component.closed, 'emit');
    const bubbled = jasmine.createSpy('ancestor keydown');
    fixture.nativeElement.addEventListener('keydown', bubbled);
    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    });
    element('.interface-language-select').dispatchEvent(event);
    expect(event.defaultPrevented).toBeTrue();
    expect(closed).toHaveBeenCalledTimes(1);
    expect(bubbled).not.toHaveBeenCalled();
    component.close();
    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('closes a General-only save when AI configuration is unavailable', async () => {
    component.endpoint = undefined;
    await render();
    const save = spyOn(form(), 'save');
    const applied = spyOn(component.applied, 'emit');
    const closed = spyOn(component.closed, 'emit');
    element('.settings-save').click();
    expect(closed).toHaveBeenCalledTimes(1);
    expect(save).not.toHaveBeenCalled();
    expect(applied).not.toHaveBeenCalled();
  });

  for (const state of ['running', 'loadingConversation'] as const) {
    for (const outcome of ['success', 'failure']) {
      it(`aborts an in-flight save when ${state} begins and ignores its late ${outcome}`, async () => {
        await render();
        const request = deferred<Awaited<ReturnType<AiGatewayClient['saveSettings']>>>();
        saveSpy.and.returnValue(request.promise);
        const task = component.applySettings({selection, providerSelections: {}});
        const signal = saveSpy.calls.mostRecent().args[2];
        const restored = {...selection, providerId: 'claude', modelId: 'claude-model'};
        fixture.componentRef.setInput('selection', restored);
        fixture.componentRef.setInput(state, true);
        fixture.detectChanges();
        expect(signal?.aborted).toBeTrue();
        expect(component.saving).toBeFalse();
        expect(component.runtimeDisabled).toBeTrue();
        const changed = spyOn(component.catalogChanged, 'emit');
        const applied = spyOn(component.applied, 'emit');
        const closed = spyOn(component.closed, 'emit');
        if (outcome === 'success') request.resolve({selection});
        else request.reject(new Error('stale secret'));
        await task;
        expect(component.selection).toEqual(restored);
        expect(form().selection).toEqual(restored);
        expect(component.saveError).toBe('');
        expect(changed).not.toHaveBeenCalled();
        expect(applied).not.toHaveBeenCalled();
        expect(closed).not.toHaveBeenCalled();
        fixture.componentRef.setInput(state, false);
        await render();
        expect(component.runtimeDisabled).toBeFalse();
      });
    }

    it(`ignores an import begun before ${state} locks the restored selection`, async () => {
      await render();
      const imported = deferred<AiProvider>();
      importSpy.and.returnValue(imported.promise);
      const task = component.importLocalConfig('codex');
      const signal = importSpy.calls.mostRecent().args[1];
      fixture.componentRef.setInput(state, true);
      fixture.detectChanges();
      expect(signal?.aborted).toBeTrue();
      imported.resolve(codexProvider);
      await task;
      expect(component.importedProviders).toEqual({});
      expect(component.importingProvider).toBe('');
      expect(catalogSpy).toHaveBeenCalledTimes(1);
    });

    it(`disables AI changes and Save while ${state}, without locking General or Cancel`, async () => {
      fixture.componentRef.setInput('displayScale', 110);
      await render();
      fixture.componentRef.setInput(state, true);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const save = spyOn(form(), 'save');
      const applied = spyOn(component.applied, 'emit');
      const closed = spyOn(component.closed, 'emit');
      expect(element<HTMLButtonElement>('.settings-save').disabled).toBeTrue();
      expect(form().disabled).toBeTrue();
      expect(
        element<HTMLInputElement>('ai-settings input').disabled,
      ).toBeTrue();
      expect(
        element<HTMLSelectElement>('.interface-language-select').disabled,
      ).toBeFalse();
      expect(
        element<HTMLButtonElement>('.settings-cancel').disabled,
      ).toBeFalse();
      expect(
        element<HTMLButtonElement>('.settings-close-button').disabled,
      ).toBeFalse();
      expect(
        element<HTMLSelectElement>('.theme-mode-select').disabled,
      ).toBeFalse();
      const changed = spyOn(component.themeModeChanged, 'emit');
      selectThemeMode('dark');
      expect(changed).toHaveBeenCalledOnceWith('dark');
      const scaleChanged = spyOn(component.displayScaleChanged, 'emit');
      expect(
        element<HTMLSelectElement>('.display-scale-select').disabled,
      ).toBeFalse();
      expect(
        element<HTMLButtonElement>('.display-scale-reset').disabled,
      ).toBeFalse();
      selectDisplayScale(140);
      element('.display-scale-reset').click();
      expect(scaleChanged.calls.allArgs()).toEqual([[140], [100]]);
      await component.importLocalConfig('codex');
      component.save();
      component.applySettings({selection, providerSelections: {}});
      expect(importSpy).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      expect(applied).not.toHaveBeenCalled();
      element('.settings-cancel').click();
      expect(closed).toHaveBeenCalledTimes(1);
    });
  }
});
