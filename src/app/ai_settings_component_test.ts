import {ComponentFixture, TestBed} from '@angular/core/testing';
import {setLanguage} from '@common/i18n';
import {AiCatalog, AiProvider} from '@services/ai_gateway_client';

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

  it('is an embeddable body with two unframed provider sections and no dialog chrome', async () => {
    await render();
    expect(section('codex')).not.toBeNull();
    expect(section('claude')).not.toBeNull();
    expect(
      fixture.nativeElement.querySelectorAll('.provider-settings').length,
    ).toBe(2);
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
    ).toBeNull();
    expect(
      (
        fixture.nativeElement.querySelector(
          '[aria-label="Provider"]',
        ) as HTMLInputElement
      ).readOnly,
    ).toBeTrue();
    expect(
      fixture.nativeElement.querySelector('[aria-label="Agent"]'),
    ).not.toBeNull();
    expect(button('codex').getAttribute('aria-label')).toBe(
      'Get Codex configuration',
    );
    expect(button('claude').getAttribute('aria-label')).toBe(
      'Get Claude configuration',
    );
    expect(button('codex').textContent).toContain('Get configuration');
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

  it('keeps model/effort drafts independent while only a successful import changes the provider', async () => {
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
    expect(component.provider?.id).toBe('codex');
    component.modelChanged('codex', 'reasoner');
    expect(component.providerDrafts['codex'].reasoningLevel).toBe('high');
    expect(component.provider?.id).toBe('codex');
    expect(component.draft.modelId).toBe('reasoner');
    expect(component.providerDrafts['claude'].modelId).toBe('opus');
    expect(component.providerDrafts['claude'].reasoningLevel).toBe('max');
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
    expect(component.providerDrafts['claude']).toEqual(claudeDraft);
    component.modelChanged('codex', '__custom__');
    component.customModelChanged('codex', 'keep-codex');
    const codexDraft = {...component.providerDrafts['codex']};
    applyImport(imported('claude'));
    expect(component.providerDrafts['codex']).toEqual(codexDraft);
    expect(component.providerDrafts['claude']).toEqual({
      modelId: 'claude-local',
      customModel: '',
      reasoningLevel: 'high',
    });
    expect(component.draft.providerId).toBe('claude');
    expect(component.draft.modelId).toBe('claude-local');
    expect(section('codex').getAttribute('data-active')).toBe('false');
    expect(section('claude').getAttribute('data-active')).toBe('true');
    expect(
      (
        fixture.nativeElement.querySelector(
          '[data-field="active-provider"]',
        ) as HTMLInputElement
      ).value,
    ).toBe('Claude');
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

  it('shows safe read-only source metadata and never invents a service URL', async () => {
    await render();
    expect(field<HTMLInputElement>('codex', 'base-url').value).toBe('Not read');
    expect(
      section('codex').querySelector<HTMLInputElement>(
        '[aria-label="Codex authentication"]',
      )?.value,
    ).toBe('Not read');
    applyImport(imported('codex'));
    applyImport(
      imported('claude', {localConfig: {authentication: 'cli-managed'}}),
    );
    await render();
    const url = field<HTMLInputElement>('codex', 'base-url');
    expect(url.readOnly).toBeTrue();
    expect(url.value).toBe('https://codex.example/v1');
    expect(field<HTMLInputElement>('claude', 'base-url').value).toBe(
      'Provider default',
    );
    expect(
      section('codex').querySelector<HTMLInputElement>(
        '[aria-label="Codex authentication"]',
      )?.value,
    ).toBe('Credentials configured');
    expect(
      section('claude').querySelector<HTMLInputElement>(
        '[aria-label="Claude authentication"]',
      )?.value,
    ).toBe('Managed by local CLI');
    expect(
      section('codex').querySelector<HTMLInputElement>(
        '[aria-label="Codex provider name"]',
      )?.value,
    ).toBe('codex local service');
    expect(
      fixture.nativeElement.querySelector('input[type="password"]'),
    ).toBeNull();
    expect(
      Array.from(
        fixture.nativeElement.querySelectorAll(
          'input:not([data-field="custom-model"])',
        ),
      ).every((input) => (input as HTMLInputElement).readOnly),
    ).toBeTrue();
  });

  it('isolates import errors, success and retries by provider', async () => {
    await render();
    const requested = spyOn(component.importRequested, 'emit');
    fixture.componentRef.setInput('importErrors', {codex: importError});
    applyImport(imported('claude'));
    await render();
    expect(
      section('codex').querySelector('[role="alert"]')?.textContent,
    ).toContain('Could not read local configuration');
    expect(section('claude').querySelector('[role="alert"]')).toBeNull();
    expect(
      section('claude').querySelector('[role="status"]')?.textContent,
    ).toContain('Configuration read');
    button('codex').click();
    expect(requested).toHaveBeenCalledWith('codex');
    expect(component.provider?.id).toBe('claude');
    fixture.componentRef.setInput('importingProvider', 'codex');
    await render();
    expect(section('codex').getAttribute('aria-busy')).toBe('true');
    expect(section('codex').textContent).toContain(
      'Reading local configuration',
    );
    expect(section('codex').querySelector('[role="alert"]')).toBeNull();
    expect(section('claude').textContent).toContain('Configuration read');
    fixture.componentRef.setInput('importingProvider', '');
    fixture.componentRef.setInput('importErrors', {codex: importError});
    await render();
    expect(component.provider?.id).toBe('claude');
    expect(component.draft.modelId).toBe('claude-local');
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
        expect(
          Array.from(
            fixture.nativeElement.querySelectorAll(
              'select, input:not([readonly]), button',
            ),
          ).every((control) => (control as HTMLInputElement).disabled),
        ).toBeTrue();
        component.agentChanged('external');
        component.modelChanged('codex', 'fixed');
        component.customModelChanged('codex', 'ignored');
        component.reasoningChanged('codex', 'low');
        component.readConfiguration('codex');
        component.save();
        expect(component.providerDrafts['codex']).toEqual(before);
        expect(component.draft.providerId).toBe('');
        expect(applied).not.toHaveBeenCalled();
        expect(requested).not.toHaveBeenCalled();
      },
    );
  }

  it('leaves absent CLI providers visible but disables their controls and Get actions', async () => {
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
    expect(button('codex').disabled).toBeTrue();
    expect(button('claude').disabled).toBeTrue();
    expect(field<HTMLSelectElement>('codex', 'model').disabled).toBeTrue();
    component.readConfiguration('codex');
    component.readConfiguration('claude');
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
        ) as HTMLInputElement
      ).readOnly,
    ).toBeTrue();
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
    ).toBe(3);
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
    expect(field<HTMLInputElement>('codex', 'base-url').value).toBe('未读取');
    expect(button('codex').getAttribute('aria-label')).toBe('获取 Codex 配置');
    expect(
      section('claude').querySelector('[role="alert"]')?.textContent,
    ).toContain('无法读取本地配置');
    expect(fixture.nativeElement.textContent).toContain(
      '请输入有效的模型标识符',
    );
    expect(component.providerDrafts['codex'].customModel).toBe('bad model!');
    expect(
      fixture.nativeElement.querySelector('.interface-language-select'),
    ).toBeNull();
  });
});
