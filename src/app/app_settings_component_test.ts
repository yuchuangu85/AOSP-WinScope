import {CdkTrapFocus} from '@angular/cdk/a11y';
import {Component, EventEmitter, forwardRef, Input, OnInit, Output,} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {language, setLanguage, translate} from '@common/i18n';
import {AiCatalog, AiGatewayClient, AiProvider,} from '@services/ai_gateway_client';

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
  @Input() importErrors: Record<string, string> = {};
  @Input() importedProviders: Record<string, AiProvider> = {};
  @Output() readonly importRequested = new EventEmitter<'codex' | 'claude'>();
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

  function selectSection(section: 'general' | 'ai'): void {
    element(`.settings-menu button[data-section="${section}"]`).click();
    fixture.detectChanges();
  }

  function selectThemeMode(mode: ThemeMode): void {
    const select = element<HTMLSelectElement>('.theme-mode-select');
    select.value = mode;
    select.dispatchEvent(new Event('change', {bubbles: true}));
    fixture.detectChanges();
  }

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

  it('supports vertical roving tabs with Up, Down, Home and End', async () => {
    await render();
    expect(element('.settings-menu').getAttribute('role')).toBe('tablist');
    expect(element('.settings-menu').getAttribute('aria-orientation')).toBe(
      'vertical',
    );
    for (const [key, expected] of [
      ['ArrowDown', 'ai'],
      ['ArrowDown', 'general'],
      ['ArrowUp', 'ai'],
      ['Home', 'general'],
      ['End', 'ai'],
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

  it('waits for catalog completion before initializing the embedded form', async () => {
    const request = deferred<AiCatalog>();
    catalogSpy.and.returnValue(request.promise);
    component.selection = {...selection, agentId: ''};
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

  it('calls the form Save and emits its value without mutating incoming defaults', async () => {
    await render();
    const child = form();
    child.draftModel = 'unsaved-model';
    const save = spyOn(child, 'save').and.callThrough();
    const applied = spyOn(component.applied, 'emit');
    const closed = spyOn(component.closed, 'emit');
    element('.settings-save').click();
    expect(save).toHaveBeenCalledTimes(1);
    expect(applied).toHaveBeenCalledOnceWith({
      selection: {...selection, customModel: 'unsaved-model'},
      providerSelections: {},
    });
    expect(closed).toHaveBeenCalledTimes(1);
    expect(component.selection).toEqual(selection);
  });

  it('keeps the shell open when the embedded form rejects Save', async () => {
    await render();
    const save = spyOn(form(), 'save');
    const applied = spyOn(component.applied, 'emit');
    const closed = spyOn(component.closed, 'emit');
    element('.settings-save').click();
    expect(save).toHaveBeenCalledTimes(1);
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
