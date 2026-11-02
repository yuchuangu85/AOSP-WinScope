import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {translate, TranslatePipe} from '@common/i18n';
import {AiCatalog, AiProvider} from '@services/ai_gateway_client';

export interface AiModelSelection {
  agentId: string;
  providerId: string;
  modelId: string;
  customModel: string;
  reasoningLevel: string;
}

export interface AiProviderModelSelection {
  modelId: string;
  customModel: string;
  reasoningLevel: string;
}

export interface AiSettingsValue {
  selection: AiModelSelection;
  providerSelections: Record<string, AiProviderModelSelection>;
}

@Component({
  selector: 'ai-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './ai_settings_component.ng.html',
  styleUrls: ['./ai_settings_component.scss'],
})
export class AiSettingsComponent implements OnInit, OnChanges {
  @Input() catalog: AiCatalog = {providers: [], agents: [], skills: []};
  @Input() selection: AiModelSelection = {
    agentId: '',
    providerId: '',
    modelId: 'default',
    customModel: '',
    reasoningLevel: 'medium',
  };
  @Input() providerSelections: Record<string, AiProviderModelSelection> = {};
  @Input() running = false;
  @Input() loading = false;
  @Input() existingSession = false;
  @Input() importingProvider: 'codex' | 'claude' | '' = '';
  @Input() importErrors: Record<string, string> = {};
  @Input() importedProviders: Record<string, AiProvider> = {};
  @Output() readonly importRequested = new EventEmitter<'codex' | 'claude'>();
  @Output() readonly applied = new EventEmitter<AiSettingsValue>();

  draft: AiModelSelection = {...this.selection};
  providerDrafts: Record<string, AiProviderModelSelection> = {};
  error = '';
  errorProvider = '';
  readonly emptyModel: AiProviderModelSelection = {
    modelId: 'default',
    customModel: '',
    reasoningLevel: 'medium',
  };
  private initialized = false;
  private originalAgentId = '';
  private originalRouting = {agentId: '', providerId: ''};
  private originalProviders: Record<string, AiProviderModelSelection> = {};
  private previousImports: Record<string, AiProvider> = {};
  private errorProviderId = '';

  ngOnInit(): void {
    this.initialize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized) {
      this.initialize();
      return;
    }
    const pristine = this.isPristine();
    this.addProviderDrafts();
    if (changes['providerSelections']) {
      for (const [id, value] of Object.entries(this.providerSelections)) {
        if (this.providerIsPristine(id)) {
          this.providerDrafts[id] = this.normalizeModel(id, value);
          this.originalProviders[id] = {...this.providerDrafts[id]};
        }
      }
    }
    // Restoration may finish in the same update that enables the form.
    if (changes['selection'] && (this.runtimeDisabled || pristine)) {
      this.synchronizeSelection();
    }
    if (changes['importedProviders']) {
      for (const [id, provider] of Object.entries(this.importedProviders)) {
        if (
          provider.id === id &&
          provider !== this.previousImports[id] &&
          this.providerFor(id)
        ) {
          this.providerDrafts[id] = this.normalizeModel(id);
          this.draft.providerId = id;
          this.clearError();
        }
      }
      this.previousImports = {...this.importedProviders};
    }
    this.synchronizeActiveModel();
  }

  get runtimeDisabled(): boolean {
    return (
      !this.initialized ||
      this.running ||
      this.loading ||
      !!this.importingProvider
    );
  }

  get provider(): AiProvider | undefined {
    return this.providerFor(
      this.draft.providerId ||
        this.catalog.agents.find((agent) => agent.id === this.draft.agentId)
          ?.providerId ||
        '',
    );
  }

  get sections(): Array<{id: string; name: string}> {
    const sections = [
      {id: 'codex', name: 'Codex'},
      {id: 'claude', name: 'Claude'},
    ];
    const provider = this.provider;
    if (provider && !sections.some((section) => section.id === provider.id)) {
      sections.push({id: provider.id, name: provider.name || provider.id});
    }
    return sections;
  }

  get agentDescription(): string {
    return (
      this.catalog.agents.find((agent) => agent.id === this.draft.agentId)
        ?.description ??
      translate(
        'The agent defines the available analysis skills and its default provider.',
      )
    );
  }

  providerFor(id: string): AiProvider | undefined {
    const provider = this.catalog.providers.find((item) => item.id === id);
    return provider && this.importedProviders[id]?.id === id
      ? this.importedProviders[id]
      : provider;
  }

  modelsFor(id: string): Array<{id: string; name: string; levels?: string[]}> {
    const provider = this.providerFor(id);
    const models = provider?.models ?? [];
    const defaultModelId = provider?.defaultModelId;
    if (
      defaultModelId &&
      !models.some((model) => model.id === defaultModelId)
    ) {
      return [{id: defaultModelId, name: defaultModelId}, ...models];
    }
    return models.length ? models : [{id: 'default', name: 'Provider default'}];
  }

  levelsFor(id: string, modelId = this.providerDrafts[id]?.modelId): string[] {
    return (
      this.modelsFor(id).find((model) => model.id === modelId)?.levels ??
      this.providerFor(id)?.reasoningLevels ??
      []
    );
  }

  modelLabel(id: string, model: {name: string}): string {
    const provider = this.providerFor(id);
    return provider?.models?.length || provider?.defaultModelId
      ? model.name
      : translate(model.name);
  }

  authenticationLabel(id: string): string {
    switch (this.providerFor(id)?.localConfig?.authentication) {
      case 'configured':
        return 'Credentials configured';
      case 'cli-managed':
        return 'Managed by local CLI';
      default:
        return 'Not read';
    }
  }

  readConfiguration(providerId: string): void {
    if (
      !this.runtimeDisabled &&
      (providerId === 'codex' || providerId === 'claude') &&
      this.providerFor(providerId)
    ) {
      this.importRequested.emit(providerId);
    }
  }

  agentChanged(agentId: string): void {
    if (this.runtimeDisabled || this.existingSession) return;
    this.draft.agentId = agentId;
    this.clearError();
    this.synchronizeActiveModel();
  }

  modelChanged(id: string, modelId: string): void {
    if (this.runtimeDisabled || !this.providerFor(id)) return;
    const draft = this.providerDrafts[id];
    draft.modelId = modelId;
    const levels = this.levelsFor(id);
    if (!levels.includes(draft.reasoningLevel)) {
      draft.reasoningLevel = levels[0] ?? 'medium';
    }
    this.modelEdited(id);
  }

  customModelChanged(id: string, value: string): void {
    if (this.runtimeDisabled || !this.providerFor(id)) return;
    this.providerDrafts[id].customModel = value;
    this.modelEdited(id);
  }

  reasoningChanged(id: string, value: string): void {
    if (this.runtimeDisabled || !this.providerFor(id)) return;
    this.providerDrafts[id].reasoningLevel = value;
    this.modelEdited(id);
  }

  save(): void {
    if (this.runtimeDisabled) return;
    this.clearError();
    if (!this.catalog.agents.some((agent) => agent.id === this.draft.agentId)) {
      this.error = 'Choose an available agent.';
      return;
    }
    if (this.existingSession && this.draft.agentId !== this.originalAgentId) {
      this.error = 'Start a new conversation to change its agent.';
      return;
    }
    const provider = this.provider;
    if (this.draft.providerId && !provider) {
      this.error = 'Choose an available provider.';
      return;
    }
    const model = provider ? this.providerDrafts[provider.id] : this.emptyModel;
    if (provider) {
      const error = this.validateModel(provider, model);
      if (error) {
        this.error = error;
        this.errorProviderId = provider.id;
        this.errorProvider =
          provider.id === 'codex'
            ? 'Codex'
            : provider.id === 'claude'
              ? 'Claude'
              : provider.name || provider.id;
        return;
      }
    }
    const savedModel = {...model, customModel: model.customModel.trim()};
    this.applied.emit({
      selection: {
        ...this.draft,
        ...savedModel,
        providerId: provider?.id ?? '',
      },
      providerSelections: provider ? {[provider.id]: {...savedModel}} : {},
    });
  }

  private initialize(): void {
    if (this.initialized || this.loading || !this.catalog.agents.length) return;
    for (const [id, value] of Object.entries(this.providerSelections)) {
      this.providerDrafts[id] = this.normalizeModel(id, value);
      this.originalProviders[id] = {...this.providerDrafts[id]};
    }
    this.addProviderDrafts();
    this.synchronizeSelection();
    this.previousImports = {...this.importedProviders};
    this.initialized = true;
  }

  private addProviderDrafts(): void {
    for (const provider of this.catalog.providers) {
      if (!this.providerDrafts[provider.id]) {
        this.providerDrafts[provider.id] = this.normalizeModel(provider.id);
        this.originalProviders[provider.id] = {
          ...this.providerDrafts[provider.id],
        };
      }
    }
  }

  private synchronizeSelection(): void {
    this.draft = {...this.selection};
    this.originalAgentId = this.selection.agentId;
    if (
      !this.existingSession &&
      !this.catalog.agents.some((agent) => agent.id === this.draft.agentId)
    ) {
      this.draft.agentId = this.catalog.agents[0]?.id ?? '';
    }
    this.originalRouting = {
      agentId: this.draft.agentId,
      providerId: this.draft.providerId,
    };
    const provider = this.provider;
    if (provider) {
      this.providerDrafts[provider.id] = this.normalizeModel(
        provider.id,
        this.selection,
      );
      this.originalProviders[provider.id] = {
        ...this.providerDrafts[provider.id],
      };
    }
    this.clearError();
    this.synchronizeActiveModel();
  }

  private normalizeModel(
    id: string,
    value?: AiProviderModelSelection,
  ): AiProviderModelSelection {
    const provider = this.providerFor(id);
    if (!provider) return {...(value ?? this.emptyModel)};
    const models = this.modelsFor(id);
    const draft = value
      ? {
          modelId: value.modelId,
          customModel: value.customModel,
          reasoningLevel: value.reasoningLevel,
        }
      : {
          modelId: provider.defaultModelId ?? models[0].id,
          customModel: '',
          reasoningLevel: provider.localConfig?.reasoningLevel ?? 'medium',
        };
    if (
      draft.modelId !== '__custom__' &&
      !models.some((model) => model.id === draft.modelId)
    ) {
      if (provider.supportsCustomModel && draft.modelId !== 'default') {
        draft.customModel = draft.modelId;
        draft.modelId = '__custom__';
      } else {
        draft.modelId = provider.defaultModelId ?? models[0].id;
      }
    }
    const levels = this.levelsFor(id, draft.modelId);
    if (!levels.includes(draft.reasoningLevel)) {
      draft.reasoningLevel = levels[0] ?? 'medium';
    }
    return draft;
  }

  private modelEdited(id: string): void {
    if (
      this.errorProviderId === id ||
      (!this.errorProviderId && this.provider?.id === id)
    ) {
      this.clearError();
    }
    this.synchronizeActiveModel();
  }

  private clearError(): void {
    this.error = '';
    this.errorProvider = '';
    this.errorProviderId = '';
  }

  private validateModel(
    provider: AiProvider,
    model: AiProviderModelSelection,
  ): string {
    if (model.modelId === '__custom__') {
      if (
        !provider.supportsCustomModel ||
        !/^[a-zA-Z0-9][a-zA-Z0-9._:/@[\]-]{0,127}$/.test(
          model.customModel.trim(),
        )
      ) {
        return 'Enter a valid model identifier (1–128 letters, digits, periods, underscores, colons, slashes, @, brackets or hyphens).';
      }
    } else if (
      !this.modelsFor(provider.id).some((item) => item.id === model.modelId)
    ) {
      return 'Choose an available model.';
    }
    const levels = this.levelsFor(provider.id);
    return levels.length && !levels.includes(model.reasoningLevel)
      ? 'Choose a supported reasoning level.'
      : '';
  }

  private synchronizeActiveModel(): void {
    const provider = this.provider;
    Object.assign(
      this.draft,
      provider ? this.providerDrafts[provider.id] : this.emptyModel,
    );
  }

  private providerIsPristine(id: string): boolean {
    const draft = this.providerDrafts[id];
    const original = this.originalProviders[id];
    return (
      !draft ||
      (!!original &&
        draft.modelId === original.modelId &&
        draft.customModel === original.customModel &&
        draft.reasoningLevel === original.reasoningLevel)
    );
  }

  private isPristine(): boolean {
    return (
      this.draft.agentId === this.originalRouting.agentId &&
      this.draft.providerId === this.originalRouting.providerId &&
      Object.keys(this.providerDrafts).every((id) =>
        this.providerIsPristine(id),
      )
    );
  }
}
