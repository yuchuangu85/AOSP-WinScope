import {ComponentFixture, TestBed} from '@angular/core/testing';
import {setLanguage} from '@common/i18n';
import {AiCatalog, AiProvider, AiProviderConfiguration} from '@services/ai_gateway_client';

import {AiModelSelection, AiProviderModelSelection, AiSettingsComponent, AiSettingsValue,} from './ai_settings_component';

const catalog: AiCatalog = {
  providers: [
    {
      id: 'codex',
      name: 'Codex',
      defaultModelId: 'gpt-default',
      models: [
        {id: 'gpt-default', name: 'GPT default'},
        {id: 'reasoner', name: 'Reasoner', levels: ['high']},
        {id: 'fixed', name: 'Fixed', levels: []},
      ],
      reasoningLevels: ['low', 'medium', 'high'],
      supportsCustomModel: true,
    },
    {
      id: 'claude',
      name: 'Claude',
      defaultModelId: 'sonnet',
      models: [
        {id: 'sonnet', name: 'Sonnet', levels: ['low', 'high']},
        {id: 'opus', name: 'Opus', levels: ['high', 'max']},
      ],
      reasoningLevels: ['low', 'high'],
      supportsCustomModel: true,
    },
    {
      id: 'browser-fixture',
      name: 'Browser fixture',
      defaultModelId: 'fixture-model',
      models: [{id: 'fixture-model', name: 'Fixture model'}],
      reasoningLevels: ['low', 'medium'],
      supportsCustomModel: true,
    },
    {id: 'ds', models: [{id: 'ds-model', name: 'DS model'}]},
  ],
  agents: [
    {id: 'display', name: 'Display analyst', providerId: 'codex'},
    {id: 'external', name: 'External analyst', providerId: 'browser-fixture'},
    {id: 'deterministic', name: 'Evidence only'},
  ],
  skills: [],
};
const selection: AiModelSelection = {
  agentId: 'display',
  providerId: '',
  modelId: 'gpt-default',
  customModel: '',
  reasoningLevel: 'medium',
};
const importError =
  'Could not read local configuration. Check the CLI configuration on the gateway machine and try again.';

function imported(
  id: 'codex' | 'claude',
  overrides: Partial<AiProvider> = {},
): AiProvider {
  return {
    ...catalog.providers.find((provider) => provider.id === id),
    id,
    defaultModelId: id + '-local',
    models: [{id: id + '-local', name: id + ' local', levels: ['low', 'high']}],
    localConfig: {
      baseUrl: 'https://' + id + '.example/v1',
      providerName: id + ' local service',
      authentication: id === 'codex' ? 'configured' : 'cli-managed',
      reasoningLevel: 'high',
    },
    ...overrides,
  };
}

describe('AiSettingsComponent', () => {
  let fixture: ComponentFixture<AiSettingsComponent>;
  let component: AiSettingsComponent;

  beforeEach(async () => {
    setLanguage('en');
    await TestBed.configureTestingModule({
      imports: [AiSettingsComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AiSettingsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('catalog', catalog);
    fixture.componentRef.setInput('selection', {...selection});
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

  function section(id: string): HTMLElement {
    return fixture.nativeElement.querySelector(
      '.provider-settings[data-provider="' + id + '"]',
    );
  }

  function field<T extends HTMLInputElement | HTMLSelectElement>(
    id: string,
    name: string,
  ): T {
    return section(id).querySelector('[data-field="' + name + '"]') as T;
  }

  function button(id: 'codex' | 'claude'): HTMLButtonElement {
    return section(id).querySelector('button') as HTMLButtonElement;
  }

  function selectProvider(id: string): void {
    const select = fixture.nativeElement.querySelector(
      'select[data-field="active-provider"]',
    ) as HTMLSelectElement;
    select.value = id;
    select.dispatchEvent(new Event('change', {bubbles: true}));
    fixture.detectChanges();
  }

  function editConfiguration(id: string, name: string, value: string): void {
    const input = field<HTMLInputElement>(id, name);
    input.value = value;
    input.dispatchEvent(new Event('input', {bubbles: true}));
    fixture.detectChanges();
  }

  function applyImport(provider: AiProvider): void {
    fixture.componentRef.setInput('catalog', {
      ...component.catalog,
      providers: component.catalog.providers.map((item) =>
        item.id === provider.id ? provider : item,
      ),
    });
    fixture.componentRef.setInput('importedProviders', {
      ...component.importedProviders,
      [provider.id]: provider,
    });
    fixture.detectChanges();
  }

  it('distinguishes saved settings from a missing authentication environment variable', async () => {
    await render();
    applyImport(imported('codex', {configured: true, localConfig: {authentication: 'not-configured'}}));
    await render();
    expect(section('codex').textContent).toContain('Already configured');
    expect(section('codex').querySelector('.authentication-status')?.textContent)
      .toContain('API key environment variable is not set');
    setLanguage('zh-CN');
    await render();
    expect(section('codex').textContent).toContain('尚未设置 API 密钥环境变量');
  });

  it('insets every AI dropdown arrow, including disabled controls', async () => {
    await render();
    for (const running of [false, true]) {
      fixture.componentRef.setInput('running', running);
      fixture.detectChanges();
      const selects: HTMLSelectElement[] = Array.from(
        fixture.nativeElement.querySelectorAll('select'),
      );
      expect(selects.length).toBe(4);
      for (const select of selects) {
        const arrow = select.parentElement?.querySelector('.settings-select-arrow');
        expect(arrow).not.toBeNull();
        expect(arrow?.getAttribute('aria-hidden')).toBe('true');
        expect(getComputedStyle(select).appearance).toBe('none');
        expect(getComputedStyle(select).paddingRight).toBe('36px');
        expect(getComputedStyle(select).height).toBe('32px');
        expect(getComputedStyle(arrow!).right).toBe('8px');
        expect(getComputedStyle(arrow!).pointerEvents).toBe('none');
        expect(getComputedStyle(arrow!).opacity).toBe(select.disabled ? '0.6' : '1');
      }
    }
  });

  it('is an embeddable body showing only the selected provider and no dialog chrome', async () => {
    await render();
    expect(section('codex')).not.toBeNull();
    expect(section('claude')).toBeNull();
    expect(
      fixture.nativeElement.querySelectorAll('.provider-settings').length,
    ).toBe(1);
    expect(
      fixture.nativeElement.querySelector(
        'header, footer, h2, [role="dialog"], .settings-card',
      ),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector('.interface-language-select'),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector('[aria-label="Interface language"]'),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector('[aria-label="Save AI settings"]'),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector('[aria-label="Cancel AI settings"]'),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector('[aria-label="Provider"]'),
    ).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('select[aria-label="Provider"]'),
    ).not.toBeNull();
    const providers = fixture.nativeElement.querySelector(
      'select[aria-label="Provider"]',
    ) as HTMLSelectElement;
    expect(Array.from(providers.options).map((option) => option.value)).toEqual(
      ['', 'codex', 'claude', 'browser-fixture', 'ds'],
    );
    expect(
      fixture.nativeElement.querySelector('[aria-label="Agent"]'),
    ).not.toBeNull();
    expect(button('codex').getAttribute('aria-label')).toBe(
      'Get Codex configuration',
    );
    expect(button('codex').textContent).toContain('Get configuration');
    selectProvider('claude');
    await render();
    expect(component.draft.providerId).toBe('claude');
    expect(section('codex')).toBeNull();
    expect(button('claude').getAttribute('aria-label')).toBe(
      'Get Claude configuration',
    );
  });

  it('waits for catalog and conversation loading before initializing drafts', async () => {
    fixture.componentRef.setInput('catalog', {
      providers: [],
      agents: [],
      skills: [],
    });
    fixture.componentRef.setInput('loading', true);
    await render();
    expect(component.providerDrafts).toEqual({});
    fixture.componentRef.setInput('catalog', catalog);
    fixture.componentRef.setInput('selection', {
      ...selection,
      providerId: 'claude',
      modelId: 'opus',
      reasoningLevel: 'max',
    });
    await render();
    expect(component.providerDrafts).toEqual({});
    fixture.componentRef.setInput('loading', false);
    await render();
    expect(component.provider?.id).toBe('claude');
    expect(field<HTMLSelectElement>('claude', 'model').value).toBe('opus');
    expect(component.providerDrafts['claude'].reasoningLevel).toBe('max');
  });

  it('uses the persisted catalog selection for a new conversation and marks configured providers', async () => {
    const saved = {
      ...selection,
      providerId: 'claude',
      modelId: 'opus',
      reasoningLevel: 'max',
    };
    fixture.componentRef.setInput('catalog', {
      ...catalog,
      selection: saved,
      providers: catalog.providers.map((provider) => ({
        ...provider,
        configured: provider.id === 'codex' || provider.id === 'claude',
      })),
    });
    await render();
    expect(component.draft).toEqual(saved);
    expect(component.selection).toEqual(selection);
    expect(section('codex')).toBeNull();
    expect(section('claude').querySelector('.configured-status')?.textContent)
      .toContain('Already configured');
    const providers = fixture.nativeElement.querySelector(
      'select[data-field="active-provider"]',
    ) as HTMLSelectElement;
    expect(providers.value).toBe('claude');
    expect(providers.selectedOptions[0].textContent).toContain('Already configured');
    expect(Array.from(providers.options).find((option) =>
      option.value === 'browser-fixture')?.textContent).not.toContain('Already configured');
  });

  it('falls back to the first configured provider only when no provider is selected', async () => {
    fixture.componentRef.setInput('catalog', {
      ...catalog,
      providers: catalog.providers.map((provider) => ({
        ...provider,
        configured: provider.id === 'claude' || provider.id === 'browser-fixture',
      })),
    });
    await render();
    expect(component.draft.providerId).toBe('claude');
    expect(component.draft.modelId).toBe('sonnet');
    expect(component.draft.reasoningLevel).toBe('low');
    expect(section('codex')).toBeNull();
    expect(section('claude').textContent).toContain('Already configured');
  });

  it('retains an explicit new-conversation provider when there is no persisted selection', async () => {
    fixture.componentRef.setInput('selection', {...selection, providerId: 'codex'});
    fixture.componentRef.setInput('catalog', {
      ...catalog,
      providers: catalog.providers.map((provider) => ({
        ...provider,
        configured: provider.id === 'claude',
      })),
    });
    await render();
    expect(component.draft.providerId).toBe('codex');
    expect(component.draft.modelId).toBe('gpt-default');
    expect(section('codex').querySelector('.configured-status')).toBeNull();
  });

  for (const providerId of ['', 'codex']) {
    it(`prioritizes the existing session selection (${providerId || 'agent default'}) over persisted and configured defaults`, async () => {
      const restored = {...selection, providerId};
      fixture.componentRef.setInput('existingSession', true);
      fixture.componentRef.setInput('selection', restored);
      fixture.componentRef.setInput('catalog', {
        ...catalog,
        selection: {...selection, providerId: 'claude', modelId: 'opus', reasoningLevel: 'max'},
        providers: catalog.providers.map((provider) => ({
          ...provider,
          configured: provider.id === 'claude',
        })),
      });
      await render();
      expect(component.draft).toEqual(restored);
      expect(component.provider?.id).toBe('codex');
      expect(section('claude')).toBeNull();
    });
  }

  it('clones incoming per-provider defaults and preserves saved edits on reopening', async () => {
    const saved: Record<string, AiProviderModelSelection> = {
      claude: {modelId: 'opus', customModel: 'keep', reasoningLevel: 'max'},
      offline: {
        modelId: '__custom__',
        customModel: 'offline/model',
        reasoningLevel: 'high',
      },
    };
    fixture.componentRef.setInput('providerSelections', saved);
    fixture.componentRef.setInput('importedProviders', {
      claude: {...catalog.providers[1]},
    });
    await render();
    expect(component.providerDrafts['claude']).toEqual(saved['claude']);
    expect(component.providerDrafts['claude']).not.toBe(saved['claude']);
    component.customModelChanged('claude', 'draft-only');
    expect(saved['claude'].customModel).toBe('keep');
    expect(component.providerDrafts['offline']).toEqual(saved['offline']);
  });

  it('keeps model/effort drafts independent across explicit provider switches', async () => {
    await render();
    selectProvider('claude');
    await render();
    const model = field<HTMLSelectElement>('claude', 'model');
    model.value = 'opus';
    model.dispatchEvent(new Event('change', {bubbles: true}));
    await render();
    const reasoning = field<HTMLSelectElement>('claude', 'reasoning');
    reasoning.value = 'max';
    reasoning.dispatchEvent(new Event('change', {bubbles: true}));
    await render();
    expect(component.providerDrafts['claude'].reasoningLevel).toBe('max');
    expect(component.providerDrafts['codex'].modelId).toBe('gpt-default');
    expect(component.providerDrafts['codex'].reasoningLevel).toBe('medium');
    expect(component.provider?.id).toBe('claude');
    component.providerChanged('codex');
    component.modelChanged('codex', 'reasoner');
    expect(component.providerDrafts['codex'].reasoningLevel).toBe('high');
    expect(component.provider?.id).toBe('codex');
    expect(component.draft.modelId).toBe('reasoner');
    expect(component.providerDrafts['claude'].modelId).toBe('opus');
    expect(component.providerDrafts['claude'].reasoningLevel).toBe('max');
    selectProvider('claude');
    await render();
    expect(field<HTMLSelectElement>('claude', 'model').value).toBe('opus');
    expect(field<HTMLSelectElement>('claude', 'reasoning').value).toBe('max');
    expect(section('codex')).toBeNull();
  });

  it('honors per-model effort restrictions including an explicit empty list', async () => {
    await render();
    component.modelChanged('codex', 'reasoner');
    expect(component.levelsFor('codex')).toEqual(['high']);
    component.modelChanged('codex', 'fixed');
    await render();
    expect(component.levelsFor('codex')).toEqual([]);
    expect(component.providerDrafts['codex'].reasoningLevel).toBe('medium');
    expect(field<HTMLSelectElement>('codex', 'reasoning').disabled).toBeTrue();
  });

  it('selects only the last successfully imported provider and fills its model and reasoning', async () => {
    await render();
    component.modelChanged('claude', 'opus');
    component.reasoningChanged('claude', 'max');
    const claudeDraft = {...component.providerDrafts['claude']};
    const applied = spyOn(component.applied, 'emit');
    applyImport(imported('codex'));
    expect(component.draft.providerId).toBe('codex');
    expect(component.provider?.id).toBe('codex');
    expect(component.providerDrafts['codex']).toEqual({
      modelId: 'codex-local',
      customModel: '',
      reasoningLevel: 'high',
    });
    expect(component.configurationDrafts['codex']).toEqual({
      baseUrl: 'https://codex.example/v1',
      providerName: 'codex local service',
      apiKeyEnv: '',
      timeoutMs: 120_000,
    });
    expect(component.providerDrafts['claude']).toEqual(claudeDraft);
    component.modelChanged('codex', '__custom__');
    component.customModelChanged('codex', 'keep-codex');
    const codexDraft = {...component.providerDrafts['codex']};
    applyImport(imported('claude'));
    await render();
    expect(component.providerDrafts['codex']).toEqual(codexDraft);
    expect(component.providerDrafts['claude']).toEqual({
      modelId: 'claude-local',
      customModel: '',
      reasoningLevel: 'high',
    });
    expect(component.draft.providerId).toBe('claude');
    expect(component.draft.modelId).toBe('claude-local');
    expect(section('codex')).toBeNull();
    expect(section('claude').getAttribute('data-active')).toBe('true');
    expect(
      (
        fixture.nativeElement.querySelector(
          '[data-field="active-provider"]',
        ) as HTMLSelectElement
      ).value,
    ).toBe('claude');
    component.save();
    expect(applied.calls.mostRecent().args[0]!.selection.providerId).toBe(
      'claude',
    );
    expect(
      Object.keys(applied.calls.mostRecent().args[0]!.providerSelections),
    ).toEqual(['claude']);
    applyImport(imported('codex'));
    component.save();
    expect(applied.calls.mostRecent().args[0]!.selection.providerId).toBe(
      'codex',
    );
    expect(
      Object.keys(applied.calls.mostRecent().args[0]!.providerSelections),
    ).toEqual(['codex']);
  });

  it('does not reapply an unchanged import identity when the map or catalog refreshes', async () => {
    await render();
    const provider = imported('codex');
    applyImport(provider);
    component.modelChanged('codex', '__custom__');
    component.customModelChanged('codex', 'my-unsaved-model');
    fixture.componentRef.setInput('importedProviders', {codex: provider});
    fixture.componentRef.setInput('catalog', {...component.catalog});
    await render();
    expect(component.providerDrafts['codex'].customModel).toBe(
      'my-unsaved-model',
    );
    expect(component.providerDrafts['codex'].modelId).toBe('__custom__');
    applyImport({...provider});
    expect(component.providerDrafts['codex'].modelId).toBe('codex-local');
  });

  it('keeps unlisted imported defaults selectable and falls back from unsupported local effort', async () => {
    await render();
    applyImport(
      imported('codex', {
        defaultModelId: 'quota/gpt-model[1m]',
        models: [{id: 'first', name: 'First'}],
        reasoningLevels: ['low', 'high'],
        localConfig: {
          authentication: 'cli-managed',
          reasoningLevel: 'unsupported',
        },
      }),
    );
    await render();
    expect(field<HTMLSelectElement>('codex', 'model').value).toBe(
      'quota/gpt-model[1m]',
    );
    expect(component.providerDrafts['codex'].reasoningLevel).toBe('low');
    const applied = spyOn(component.applied, 'emit');
    component.save();
    expect(applied.calls.mostRecent().args[0]!.selection.modelId).toBe(
      'quota/gpt-model[1m]',
    );
  });

  it('falls back to the first imported descriptor when no default is present', async () => {
    await render();
    applyImport(
      imported('claude', {
        defaultModelId: undefined,
        models: [{id: 'first[1m]', name: 'First', levels: ['max']}],
      }),
    );
    expect(component.providerDrafts['claude'].modelId).toBe('first[1m]');
    expect(component.providerDrafts['claude'].reasoningLevel).toBe('max');
    expect(component.draft.providerId).toBe('claude');
  });

  it('fills editable configuration drafts from imports without inventing URLs or exposing credentials', async () => {
    await render();
    expect(field<HTMLInputElement>('codex', 'base-url').value).toBe('');
    expect(field<HTMLInputElement>('codex', 'base-url').placeholder).toBe(
      'Provider default',
    );
    expect(section('codex').querySelector('.authentication-status')?.textContent)
      .toContain('Not read');
    applyImport(imported('codex'));
    applyImport(
      imported('claude', {localConfig: {authentication: 'cli-managed'}}),
    );
    await render();
    expect(field<HTMLInputElement>('claude', 'base-url').value).toBe('');
    expect(section('claude').querySelector('.authentication-status')?.textContent)
      .toContain('Managed by local CLI');
    selectProvider('codex');
    await render();
    const url = field<HTMLInputElement>('codex', 'base-url');
    expect(url.readOnly).toBeFalse();
    expect(url.value).toBe('https://codex.example/v1');
    expect(section('codex').querySelector('.authentication-status')?.textContent)
      .toContain('Credentials configured');
    expect(field<HTMLInputElement>('codex', 'provider-name').value).toBe(
      'codex local service',
    );
    expect(field<HTMLInputElement>('codex', 'api-key-env').value).toBe('');
    expect(
      fixture.nativeElement.querySelector('input[type="password"]'),
    ).toBeNull();
    expect(
      Array.from(
        fixture.nativeElement.querySelectorAll(
          'input:not([data-field="custom-model"])',
        ),
      ).every((input) => !(input as HTMLInputElement).readOnly),
    ).toBeTrue();
  });

  it('keeps manual configuration drafts independent and emits only the selected configuration without browser storage', async () => {
    await render();
    const stored = spyOn(Storage.prototype, 'setItem');
    const applied = spyOn(component.applied, 'emit');
    const codex: AiProviderConfiguration = {
      baseUrl: 'https://codex.example/v1',
      providerName: 'Private Codex',
      apiKeyEnv: 'CODEX_API_KEY',
      timeoutMs: 30_000,
    };
    editConfiguration('codex', 'base-url', codex.baseUrl);
    editConfiguration('codex', 'provider-name', codex.providerName);
    editConfiguration('codex', 'api-key-env', codex.apiKeyEnv);
    editConfiguration('codex', 'timeout', String(codex.timeoutMs));
    selectProvider('claude');
    await render();
    editConfiguration('claude', 'base-url', 'https://claude.example/v1');
    editConfiguration('claude', 'provider-name', 'Private Claude');
    editConfiguration('claude', 'api-key-env', 'CLAUDE_API_KEY');
    editConfiguration('claude', 'timeout', '45000');
    const claude = {...component.configurationDrafts['claude']};
    expect(component.configurationDrafts['codex']).toEqual(codex);
    selectProvider('codex');
    await render();
    expect(field<HTMLInputElement>('codex', 'base-url').value).toBe(codex.baseUrl);
    expect(field<HTMLInputElement>('codex', 'timeout').value).toBe('30000');
    component.save();
    const value = applied.calls.mostRecent().args[0]!;
    expect(value.configuration).toEqual(codex);
    expect(value.configuration).not.toBe(component.configurationDrafts['codex']);
    expect(Object.keys(value.configuration!).sort()).toEqual([
      'apiKeyEnv', 'baseUrl', 'providerName', 'timeoutMs',
    ]);
    expect(Object.keys(value.providerSelections)).toEqual(['codex']);
    expect(component.configurationDrafts['claude']).toEqual(claude);
    expect(catalog.providers[0].configuration).toBeUndefined();
    expect(fixture.nativeElement.querySelector('input[type="password"]')).toBeNull();
    expect(field<HTMLInputElement>('codex', 'api-key-env').autocomplete).toBe('off');
    expect(stored).not.toHaveBeenCalled();
  });

  it('allows descriptor-backed manual configuration for external providers but not unsupported providers', async () => {
    const configuration: AiProviderConfiguration = {
      baseUrl: 'http://localhost:8080/v1',
      providerName: 'Local model',
      apiKeyEnv: 'LOCAL_API_KEY',
      timeoutMs: 60_000,
    };
    fixture.componentRef.setInput('catalog', {
      ...catalog,
      providers: catalog.providers.map((provider) =>
        provider.id === 'browser-fixture' ? {...provider, configuration} : provider),
    });
    await render();
    selectProvider('browser-fixture');
    await render();
    expect(field<HTMLInputElement>('browser-fixture', 'base-url').readOnly).toBeFalse();
    expect(component.configurationDrafts['browser-fixture']).toEqual(configuration);
    expect(component.configurationDrafts['browser-fixture']).not.toBe(configuration);
    editConfiguration('browser-fixture', 'provider-name', 'Edited local model');
    const applied = spyOn(component.applied, 'emit');
    component.save();
    expect(applied.calls.mostRecent().args[0]!.configuration).toEqual({
      ...configuration, providerName: 'Edited local model',
    });
    expect(configuration.providerName).toBe('Local model');
    selectProvider('ds');
    await render();
    expect(section('ds').querySelector('[data-field="base-url"]')).toBeNull();
    component.configurationChanged('ds', 'baseUrl', 'https://ignored.test');
    expect(component.configurationDrafts['ds'].baseUrl).toBe('');
    component.save();
    expect(applied.calls.mostRecent().args[0]!.configuration).toBeUndefined();
  });

  const invalidConfigurations: Array<{
    key: keyof AiProviderConfiguration;
    value: string | number;
    error: string;
  }> = [
    ...[
      'not a URL', 'ftp://example.test', 'https://user:sk-secret@example.test',
      'https://example.test?api_key=sk-secret', 'https://example.test#secret',
      'https://exam ple.test', 'https://example.test/' + 'a'.repeat(2048),
    ].map((value) => ({key: 'baseUrl' as const, value, error: 'HTTP or HTTPS service URL'})),
    ...['sk-secret-token', '1_API_KEY', 'API KEY', 'A'.repeat(129)].map((value) =>
      ({key: 'apiKeyEnv' as const, value, error: 'environment variable name'})),
    ...[999, 600_001, 1500.5, Number.NaN].map((value) =>
      ({key: 'timeoutMs' as const, value, error: 'timeout between 1000 and 600000'})),
    ...['a'.repeat(129), 'bad\nname', 'bad\u007fname'].map((value) =>
      ({key: 'providerName' as const, value, error: 'provider name of up to 128 characters'})),
  ];

  for (const {key, value, error} of invalidConfigurations) {
    it(`validates manual ${key} (${String(value).slice(0, 35)}) without emitting or storing secrets`, async () => {
      await render();
      const stored = spyOn(Storage.prototype, 'setItem');
      const applied = spyOn(component.applied, 'emit');
      component.configurationChanged('codex', key, value);
      component.save();
      fixture.detectChanges();
      expect(component.error).toContain(error);
      expect(component.errorProvider).toBe('Codex');
      expect(component.configurationDrafts['codex'][key]).toEqual(value);
      expect(fixture.nativeElement.querySelector('[role="alert"]').textContent)
        .not.toContain('sk-secret');
      expect(applied).not.toHaveBeenCalled();
      expect(stored).not.toHaveBeenCalled();
      component.configurationChanged('codex', key, key === 'timeoutMs' ? 120_000 : '');
      expect(component.error).toBe('');
      component.save();
      expect(applied).toHaveBeenCalledTimes(1);
    });
  }

  for (const timeoutMs of [1000, 600_000]) {
    it(`accepts valid configuration boundaries at ${timeoutMs} milliseconds`, async () => {
      await render();
      component.configurationChanged('codex', 'apiKeyEnv', '_' + 'A'.repeat(127));
      component.configurationChanged('codex', 'providerName', 'a'.repeat(128));
      component.configurationChanged('codex', 'timeoutMs', timeoutMs);
      const applied = spyOn(component.applied, 'emit');
      component.save();
      expect(applied.calls.mostRecent().args[0]!.configuration).toEqual({
        baseUrl: '', providerName: 'a'.repeat(128),
        apiKeyEnv: '_' + 'A'.repeat(127), timeoutMs,
      });
    });
  }

  it('ignores invalid inactive configuration and preserves it through provider switching and imports', async () => {
    await render();
    component.configurationChanged('claude', 'baseUrl', 'invalid inactive');
    const applied = spyOn(component.applied, 'emit');
    component.save();
    expect(applied).toHaveBeenCalledTimes(1);
    expect(component.error).toBe('');
    component.providerChanged('claude');
    component.save();
    expect(component.error).toContain('HTTP or HTTPS');
    expect(applied).toHaveBeenCalledTimes(1);
    applyImport(imported('codex'));
    expect(component.configurationDrafts['claude'].baseUrl).toBe('invalid inactive');
    expect(component.draft.providerId).toBe('codex');
    component.providerChanged('claude');
    applyImport(imported('claude'));
    expect(component.configurationDrafts['claude'].baseUrl).toBe('https://claude.example/v1');
    component.save();
    expect(applied).toHaveBeenCalledTimes(2);
  });

  it('does not overwrite a manual configuration draft when a new selection input arrives', async () => {
    await render();
    component.configurationChanged('codex', 'baseUrl', 'https://draft.example/v1');
    fixture.componentRef.setInput('selection', {
      ...selection, providerId: 'claude', modelId: 'opus', reasoningLevel: 'max',
    });
    await render();
    expect(component.provider?.id).toBe('codex');
    expect(component.configurationDrafts['codex'].baseUrl).toBe('https://draft.example/v1');
    expect(field<HTMLInputElement>('codex', 'base-url').value).toBe('https://draft.example/v1');
  });

  it('isolates import errors, success and retries by provider', async () => {
    await render();
    const requested = spyOn(component.importRequested, 'emit');
    fixture.componentRef.setInput('importErrors', {codex: importError});
    applyImport(imported('claude'));
    await render();
    expect(section('codex')).toBeNull();
    expect(section('claude').querySelector('[role="alert"]')).toBeNull();
    expect(section('claude').textContent).toContain('Configuration read');
    selectProvider('codex');
    await render();
    expect(
      section('codex').querySelector('[role="alert"]')?.textContent,
    ).toContain('Could not read local configuration');
    button('codex').click();
    expect(requested).toHaveBeenCalledWith('codex');
    expect(component.provider?.id).toBe('codex');
    fixture.componentRef.setInput('importingProvider', 'codex');
    await render();
    expect(section('codex').getAttribute('aria-busy')).toBe('true');
    expect(section('codex').textContent).toContain(
      'Reading local configuration',
    );
    expect(section('codex').querySelector('[role="alert"]')).toBeNull();
    expect(section('claude')).toBeNull();
    expect(component.importedProviders['claude']).toBeDefined();
    fixture.componentRef.setInput('importingProvider', '');
    fixture.componentRef.setInput('importErrors', {codex: importError});
    await render();
    expect(component.provider?.id).toBe('codex');
    expect(component.draft.modelId).toBe('gpt-default');
    button('codex').click();
    expect(requested).toHaveBeenCalledTimes(2);
    fixture.componentRef.setInput('importErrors', {});
    applyImport(imported('codex'));
    expect(section('codex').querySelector('[role="alert"]')).toBeNull();
    expect(section('codex').textContent).toContain('Configuration read');
  });

  for (const busy of ['running', 'loading', 'importingProvider']) {
    it(
      'disables all runtime edits, imports and save while ' + busy,
      async () => {
        await render();
        component.modelChanged('codex', '__custom__');
        component.customModelChanged('codex', 'keep');
        fixture.componentRef.setInput(
          busy,
          busy === 'importingProvider' ? 'claude' : true,
        );
        await render();
        const applied = spyOn(component.applied, 'emit');
        const requested = spyOn(component.importRequested, 'emit');
        const before = {...component.providerDrafts['codex']};
        const configurationBefore = {...component.configurationDrafts['codex']};
        expect(
          Array.from(
            fixture.nativeElement.querySelectorAll(
              'select, input:not([readonly]), button',
            ),
          ).every((control) => (control as HTMLInputElement).disabled),
        ).toBeTrue();
        component.agentChanged('external');
        component.providerChanged('claude');
        component.modelChanged('codex', 'fixed');
        component.customModelChanged('codex', 'ignored');
        component.reasoningChanged('codex', 'low');
        component.configurationChanged('codex', 'baseUrl', 'https://ignored.test');
        component.readConfiguration('codex');
        component.save();
        expect(component.providerDrafts['codex']).toEqual(before);
        expect(component.configurationDrafts['codex']).toEqual(configurationBefore);
        expect(component.draft.providerId).toBe('');
        expect(applied).not.toHaveBeenCalled();
        expect(requested).not.toHaveBeenCalled();
      },
    );
  }

  it('omits absent CLI providers and ignores their Get actions and selection', async () => {
    fixture.componentRef.setInput('catalog', {
      ...catalog,
      providers: [catalog.providers[2]],
    });
    fixture.componentRef.setInput('selection', {
      ...selection,
      agentId: 'external',
      modelId: 'fixture-model',
    });
    await render();
    const requested = spyOn(component.importRequested, 'emit');
    expect(section('codex')).toBeNull();
    expect(section('claude')).toBeNull();
    expect(section('browser-fixture')).not.toBeNull();
    const providers = fixture.nativeElement.querySelector(
      'select[data-field="active-provider"]',
    ) as HTMLSelectElement;
    expect(Array.from(providers.options).map((option) => option.value)).toEqual(
      ['', 'browser-fixture'],
    );
    component.readConfiguration('codex');
    component.readConfiguration('claude');
    component.providerChanged('codex');
    expect(component.provider?.id).toBe('browser-fixture');
    expect(requested).not.toHaveBeenCalled();
  });

  it('does not request configuration or save without a loaded catalog', async () => {
    fixture.componentRef.setInput('catalog', {
      providers: [],
      agents: [],
      skills: [],
    });
    await render();
    const requested = spyOn(component.importRequested, 'emit');
    const applied = spyOn(component.applied, 'emit');
    component.readConfiguration('codex');
    component.save();
    expect(requested).not.toHaveBeenCalled();
    expect(applied).not.toHaveBeenCalled();
  });

  it('saves only the active provider and clones its valid model without saving inactive drafts', async () => {
    const saved: Record<string, AiProviderModelSelection> = {
      claude: {
        modelId: '__custom__',
        customModel: 'claude/custom[1m]',
        reasoningLevel: 'low',
      },
    };
    fixture.componentRef.setInput('providerSelections', saved);
    await render();
    const applied = spyOn(component.applied, 'emit');
    component.modelChanged('codex', '__custom__');
    component.customModelChanged('codex', '  local/model-v1:latest@[1m]  ');
    component.save();
    const value: AiSettingsValue = applied.calls.mostRecent().args[0]!;
    expect(value.selection).toEqual({
      ...selection,
      providerId: 'codex',
      modelId: '__custom__',
      customModel: 'local/model-v1:latest@[1m]',
    });
    expect(Object.keys(value.providerSelections)).toEqual(['codex']);
    expect(value.providerSelections['codex']).toEqual({
      modelId: '__custom__',
      customModel: value.selection.customModel,
      reasoningLevel: 'medium',
    });
    expect(value.selection).not.toBe(component.draft);
    expect(value.providerSelections['codex']).not.toBe(
      component.providerDrafts['codex'],
    );
    value.providerSelections['codex'].customModel = 'mutated-output';
    expect(component.providerDrafts['codex'].customModel).toBe(
      '  local/model-v1:latest@[1m]  ',
    );
    expect(saved['claude'].customModel).toBe('claude/custom[1m]');
    expect(component.selection).toEqual(selection);
  });

  it('ignores invalid inactive drafts and discards them from the saved provider selection', async () => {
    await render();
    component.modelChanged('claude', '__custom__');
    component.customModelChanged('claude', 'invalid inactive!');
    const applied = spyOn(component.applied, 'emit');
    component.save();
    expect(applied).toHaveBeenCalledTimes(1);
    expect(component.error).toBe('');
    expect(
      Object.keys(applied.calls.mostRecent().args[0]!.providerSelections),
    ).toEqual(['codex']);
    expect(component.providerDrafts['claude'].customModel).toBe(
      'invalid inactive!',
    );
    applyImport(imported('claude'));
    component.customModelChanged('claude', '');
    expect(component.draft.modelId).toBe('claude-local');
    component.save();
    expect(applied).toHaveBeenCalledTimes(2);
    expect(
      Object.keys(applied.calls.mostRecent().args[0]!.providerSelections),
    ).toEqual(['claude']);
  });

  it('blocks invalid active custom identifiers without losing any drafts', async () => {
    await render();
    const applied = spyOn(component.applied, 'emit');
    component.modelChanged('codex', '__custom__');
    const inactive = {...component.providerDrafts['claude']};
    for (const identifier of [
      '',
      'bad model!',
      'model;whoami',
      '$(model)',
      '-model',
      'a'.repeat(129),
    ]) {
      component.customModelChanged('codex', identifier);
      component.save();
      expect(component.error).toContain('valid model identifier');
      expect(component.providerDrafts['codex'].customModel).toBe(identifier);
    }
    expect(applied).not.toHaveBeenCalled();
    expect(component.providerDrafts['claude']).toEqual(inactive);
    component.customModelChanged('codex', 'a'.repeat(128));
    component.save();
    expect(applied).toHaveBeenCalledTimes(1);
  });

  it('validates agent, active provider, model and supported reasoning before emitting', async () => {
    await render();
    const applied = spyOn(component.applied, 'emit');
    component.draft.agentId = 'missing';
    component.save();
    expect(component.error).toBe('Choose an available agent.');
    component.draft.agentId = selection.agentId;
    component.draft.providerId = 'missing';
    component.save();
    expect(component.error).toBe('Choose an available provider.');
    component.draft.providerId = 'codex';
    component.providerDrafts['codex'].modelId = 'missing';
    component.save();
    expect(component.error).toBe('Choose an available model.');
    component.modelChanged('codex', 'reasoner');
    component.reasoningChanged('codex', 'low');
    component.save();
    expect(component.error).toBe('Choose a supported reasoning level.');
    expect(applied).not.toHaveBeenCalled();
  });

  it('locks an existing conversation agent while keeping models editable', async () => {
    fixture.componentRef.setInput('existingSession', true);
    await render();
    expect(
      fixture.nativeElement.querySelector('[aria-label="Agent"]').disabled,
    ).toBeTrue();
    expect(
      (
        fixture.nativeElement.querySelector(
          '[aria-label="Provider"]',
        ) as HTMLSelectElement
      ).disabled,
    ).toBeFalse();
    expect(field<HTMLSelectElement>('codex', 'model').disabled).toBeFalse();
    component.agentChanged('deterministic');
    expect(component.draft.agentId).toBe(selection.agentId);
    component.draft.agentId = 'deterministic';
    const applied = spyOn(component.applied, 'emit');
    component.save();
    expect(component.error).toContain('new conversation');
    expect(applied).not.toHaveBeenCalled();
  });

  it('accepts pristine restored selections when loading ends in the same update', async () => {
    await render();
    fixture.componentRef.setInput('loading', true);
    await render();
    fixture.componentRef.setInput('selection', {
      ...selection,
      providerId: 'claude',
      modelId: 'opus',
      reasoningLevel: 'max',
    });
    fixture.componentRef.setInput('loading', false);
    await render();
    expect(component.draft.providerId).toBe('claude');
    expect(component.providerDrafts['claude'].modelId).toBe('opus');
    expect(component.providerDrafts['claude'].reasoningLevel).toBe('max');
    expect(component.providerDrafts['codex'].modelId).toBe('gpt-default');
  });

  it('does not overwrite editable unsaved drafts when the selection input changes', async () => {
    await render();
    component.modelChanged('claude', 'opus');
    component.reasoningChanged('claude', 'max');
    fixture.componentRef.setInput('selection', {
      ...selection,
      providerId: 'claude',
      modelId: 'sonnet',
      reasoningLevel: 'low',
    });
    await render();
    expect(component.draft.providerId).toBe('');
    expect(component.providerDrafts['claude'].modelId).toBe('opus');
    expect(component.providerDrafts['claude'].reasoningLevel).toBe('max');
  });

  it('synchronizes a disabled restored active selection without wiping unrelated edits', async () => {
    await render();
    component.modelChanged('claude', '__custom__');
    component.customModelChanged('claude', 'keep-claude');
    const other = {...component.providerDrafts['claude']};
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('selection', {
      ...selection,
      modelId: 'reasoner',
      reasoningLevel: 'high',
    });
    await render();
    expect(component.providerDrafts['codex'].modelId).toBe('reasoner');
    expect(component.providerDrafts['claude']).toEqual(other);
  });

  it('merges updated saved provider inputs only into pristine provider drafts', async () => {
    await render();
    component.modelChanged('claude', '__custom__');
    component.customModelChanged('claude', 'keep-unsaved');
    fixture.componentRef.setInput('providerSelections', {
      codex: {modelId: 'reasoner', customModel: '', reasoningLevel: 'high'},
      claude: {modelId: 'opus', customModel: '', reasoningLevel: 'max'},
    });
    await render();
    expect(component.providerDrafts['codex'].modelId).toBe('reasoner');
    expect(component.providerDrafts['claude'].customModel).toBe('keep-unsaved');
  });

  it('represents providerless agents as deterministic while retaining independent provider drafts', async () => {
    fixture.componentRef.setInput('selection', {
      ...selection,
      agentId: 'deterministic',
    });
    await render();
    component.modelChanged('codex', '__custom__');
    component.customModelChanged('codex', 'valid/inactive');
    expect(component.provider).toBeUndefined();
    expect(fixture.nativeElement.textContent).toContain(
      'Only deterministic evidence skills',
    );
    const applied = spyOn(component.applied, 'emit');
    component.save();
    expect(applied.calls.mostRecent().args[0]!.selection).toEqual({
      ...selection,
      agentId: 'deterministic',
      modelId: 'default',
    });
    expect(applied.calls.mostRecent().args[0]!.providerSelections).toEqual({});
  });

  it('renders external provider controls without a Get action and routes the active draft on save', async () => {
    fixture.componentRef.setInput('selection', {
      ...selection,
      agentId: 'external',
      providerId: 'browser-fixture',
      modelId: 'fixture-model',
    });
    await render();
    expect(
      fixture.nativeElement.querySelectorAll('.provider-settings').length,
    ).toBe(1);
    expect(section('codex')).toBeNull();
    expect(section('claude')).toBeNull();
    expect(section('browser-fixture').querySelector('button')).toBeNull();
    expect(field<HTMLSelectElement>('browser-fixture', 'model').value).toBe(
      'fixture-model',
    );
    component.modelChanged('browser-fixture', '__custom__');
    component.customModelChanged('browser-fixture', 'external/model');
    component.reasoningChanged('browser-fixture', 'low');
    const applied = spyOn(component.applied, 'emit');
    component.save();
    expect(applied.calls.mostRecent().args[0]!.selection).toEqual({
      ...selection,
      agentId: 'external',
      providerId: 'browser-fixture',
      modelId: '__custom__',
      customModel: 'external/model',
      reasoningLevel: 'low',
    });
    expect(applied.calls.mostRecent().args[0]!.configuration).toBeUndefined();
    fixture.componentRef.setInput('selection', {
      ...selection,
      agentId: 'external',
      providerId: 'ds',
      modelId: 'ds-model',
    });
    fixture.componentRef.setInput('loading', true);
    await render();
    fixture.componentRef.setInput('loading', false);
    await render();
    expect(section('browser-fixture')).toBeNull();
    expect(section('ds').querySelector('button')).toBeNull();
    expect(field<HTMLSelectElement>('ds', 'reasoning').disabled).toBeTrue();
    component.save();
    expect(applied.calls.mostRecent().args[0]!.selection.providerId).toBe('ds');
    expect(applied.calls.mostRecent().args[0]!.selection.modelId).toBe(
      'ds-model',
    );
    expect(
      Object.keys(applied.calls.mostRecent().args[0]!.providerSelections),
    ).toEqual(['ds']);
  });

  it('restores a raw custom external model identifier without discarding it', async () => {
    fixture.componentRef.setInput('selection', {
      ...selection,
      providerId: 'browser-fixture',
      modelId: 'custom/restored[1m]',
    });
    await render();
    expect(component.providerDrafts['browser-fixture'].modelId).toBe(
      '__custom__',
    );
    expect(
      field<HTMLInputElement>('browser-fixture', 'custom-model').value,
    ).toBe('custom/restored[1m]');
  });

  it('localizes scoped fields, import errors and validation without translating provider data', async () => {
    fixture.componentRef.setInput('catalog', {
      ...catalog,
      providers: catalog.providers.map((provider) =>
        provider.id === 'codex'
          ? {...provider, models: [{id: 'gpt-default', name: 'Privacy'}]}
          : provider,
      ),
    });
    await render();
    component.modelChanged('codex', '__custom__');
    component.customModelChanged('codex', 'bad model!');
    component.save();
    fixture.componentRef.setInput('importErrors', {claude: importError});
    setLanguage('zh-CN');
    await render();
    expect(
      field<HTMLSelectElement>('codex', 'model').getAttribute('aria-label'),
    ).toBe('Codex 模型');
    expect(field<HTMLSelectElement>('codex', 'model').textContent).toContain(
      'Privacy',
    );
    expect(
      field<HTMLInputElement>('codex', 'base-url').getAttribute('aria-label'),
    ).toBe('Codex 服务地址');
    expect(field<HTMLInputElement>('codex', 'base-url').value).toBe('');
    expect(field<HTMLInputElement>('codex', 'base-url').placeholder).toBe(
      '提供方默认值',
    );
    expect(button('codex').getAttribute('aria-label')).toBe('获取 Codex 配置');
    expect(fixture.nativeElement.textContent).toContain(
      '请输入有效的模型标识符',
    );
    expect(component.providerDrafts['codex'].customModel).toBe('bad model!');
    selectProvider('claude');
    await render();
    expect(
      section('claude').querySelector('[role="alert"]')?.textContent,
    ).toContain('无法读取本地配置');
    expect(
      fixture.nativeElement.querySelector('.interface-language-select'),
    ).toBeNull();
  });
});
