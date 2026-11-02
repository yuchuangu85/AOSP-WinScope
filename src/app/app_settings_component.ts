import {A11yModule} from '@angular/cdk/a11y';
import {CommonModule} from '@angular/common';
import {Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild,} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {language, setLanguage, SUPPORTED_LANGUAGES, TranslatePipe,} from '@common/i18n';
import {AiCatalog, AiGatewayClient, AiProvider,} from '@services/ai_gateway_client';

import {AiModelSelection, AiProviderModelSelection, AiSettingsComponent, AiSettingsValue,} from './ai_settings_component';

export {
  AiModelSelection,
  AiProviderModelSelection,
  AiSettingsValue,
} from './ai_settings_component';

type SettingsSection = 'general' | 'ai';
type ImportProvider = 'codex' | 'claude';
export type ThemeMode = 'system' | 'dark' | 'light';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    A11yModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslatePipe,
    AiSettingsComponent,
  ],
  templateUrl: './app_settings_component.ng.html',
  styleUrls: ['./app_settings_component.scss'],
})
export class AppSettingsComponent implements OnInit, OnChanges, OnDestroy {
  readonly language = language;
  readonly setLanguage = setLanguage;
  readonly supportedLanguages = SUPPORTED_LANGUAGES;

  @Input() endpoint?: string;
  @Input() section: SettingsSection = 'general';
  @Input() selection: AiModelSelection = {
    agentId: '',
    providerId: '',
    modelId: 'default',
    customModel: '',
    reasoningLevel: 'medium',
  };
  @Input() providerSelections: Record<string, AiProviderModelSelection> = {};
  @Input() running = false;
  @Input() loadingConversation = false;
  @Input() existingSession = false;
  @Input() themeMode: ThemeMode = 'system';
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly applied = new EventEmitter<AiSettingsValue>();
  @Output() readonly catalogChanged = new EventEmitter<AiCatalog>();
  @Output() readonly themeModeChanged = new EventEmitter<ThemeMode>();
  @ViewChild(AiSettingsComponent) aiSettings?: AiSettingsComponent;
  @ViewChild('generalTab') generalTab?: ElementRef<HTMLButtonElement>;
  @ViewChild('aiTab') aiTab?: ElementRef<HTMLButtonElement>;

  catalog: AiCatalog = {providers: [], agents: [], skills: []};
  catalogReady = false;
  loading = false;
  loadError = '';
  importingProvider: ImportProvider | '' = '';
  importErrors: Record<string, string> = {};
  importedProviders: Record<string, AiProvider> = {};

  private client?: AiGatewayClient;
  private catalogController?: AbortController;
  private importController?: AbortController;
  private initialized = false;
  private inactive = false;

  ngOnInit(): void {
    this.initialized = true;
    void this.loadCatalog();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized && changes['endpoint']) {
      void this.loadCatalog();
    }
    if (this.initialized && changes['section']) {
      (this.section === 'general'
        ? this.generalTab
        : this.aiTab
      )?.nativeElement.focus();
    }
    if (
      (changes['running'] && this.running) ||
      (changes['loadingConversation'] && this.loadingConversation)
    ) {
      this.abortImport();
    }
  }

  ngOnDestroy(): void {
    this.inactive = true;
    this.abortRequests();
  }

  get runtimeDisabled(): boolean {
    return (
      this.inactive ||
      this.running ||
      this.loadingConversation ||
      this.loading ||
      !!this.importingProvider
    );
  }

  get canConfigureAi(): boolean {
    return (
      !!this.client &&
      this.catalogReady &&
      !this.loadError &&
      this.catalog.agents.length > 0
    );
  }

  selectSection(section: SettingsSection): void {
    this.section = section;
  }

  onMenuKeydown(event: KeyboardEvent, section: SettingsSection): void {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    let next: SettingsSection;
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        next = section === 'general' ? 'ai' : 'general';
        break;
      case 'Home':
        next = 'general';
        break;
      case 'End':
        next = 'ai';
        break;
      default:
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.selectSection(next);
    (next === 'general' ? this.generalTab : this.aiTab)?.nativeElement.focus();
  }

  onEscape(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.close();
  }

  close(): void {
    if (this.inactive) return;
    this.inactive = true;
    this.abortRequests();
    this.closed.emit();
  }

  save(): void {
    if (this.runtimeDisabled) return;
    if (!this.canConfigureAi) {
      this.close();
      return;
    }
    this.aiSettings?.save();
  }

  applySettings(value: AiSettingsValue): void {
    if (this.runtimeDisabled || !this.canConfigureAi) return;
    this.applied.emit(value);
    this.close();
  }

  async importLocalConfig(providerId: ImportProvider): Promise<void> {
    if (!this.client || this.runtimeDisabled || !this.catalogReady) return;
    const client = this.client;
    const controller = new AbortController();
    this.importController = controller;
    this.importingProvider = providerId;
    this.importErrors = {...this.importErrors, [providerId]: ''};
    const importedProviders = {...this.importedProviders};
    delete importedProviders[providerId];
    this.importedProviders = importedProviders;
    const isCurrent = () =>
      !this.inactive &&
      !controller.signal.aborted &&
      this.importController === controller &&
      this.client === client;
    try {
      const provider = await client.importLocalConfig(
        providerId,
        controller.signal,
      );
      if (!isCurrent()) return;
      const catalog = await client.catalog(controller.signal);
      if (!isCurrent()) return;
      // Publish import success only after the refreshed catalog is available.
      this.catalog = catalog;
      this.loadError = '';
      this.importedProviders = {
        ...this.importedProviders,
        [providerId]: provider,
      };
      this.catalogChanged.emit(catalog);
    } catch {
      if (isCurrent()) {
        this.importErrors = {
          ...this.importErrors,
          [providerId]:
            'Could not read local configuration. Check the CLI configuration on the gateway machine and try again.',
        };
      }
    } finally {
      if (isCurrent()) {
        this.importingProvider = '';
        this.importController = undefined;
      }
    }
  }

  private async loadCatalog(): Promise<void> {
    if (this.inactive) return;
    this.abortRequests();
    this.catalog = {providers: [], agents: [], skills: []};
    this.catalogReady = false;
    this.loadError = '';
    this.importErrors = {};
    this.importedProviders = {};
    this.client = this.endpoint
      ? new AiGatewayClient(this.endpoint)
      : undefined;
    if (!this.client) {
      this.catalogReady = true;
      return;
    }
    const controller = new AbortController();
    this.catalogController = controller;
    this.loading = true;
    const isCurrent = () =>
      !this.inactive &&
      !controller.signal.aborted &&
      this.catalogController === controller;
    try {
      const catalog = await this.client.catalog(controller.signal);
      if (!isCurrent()) return;
      this.catalog = catalog;
      this.catalogChanged.emit(catalog);
    } catch {
      if (isCurrent()) {
        // Gateway failures can contain credentials or local filesystem paths.
        this.loadError =
          'Could not load AI settings. Close settings and try again.';
      }
    } finally {
      if (isCurrent()) {
        this.catalogReady = true;
        this.loading = false;
        this.catalogController = undefined;
      }
    }
  }

  private abortRequests(): void {
    this.catalogController?.abort();
    this.catalogController = undefined;
    this.loading = false;
    this.abortImport();
  }

  private abortImport(): void {
    this.importController?.abort();
    this.importController = undefined;
    this.importingProvider = '';
  }
}
