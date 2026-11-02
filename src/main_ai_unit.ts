/* eslint-disable winscope/sort-imports */
// Zone testing must initialize before Angular. Keep the focused AI suite
// independent of the full parser/Trace Processor fixture suite.
import 'zone.js';
import 'zone.js/testing';
import {TestBed} from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
import './services/ai_gateway_client_test';
import './services/ai_conversation_test';
import './app/ai_panel_component_test';
import './app/ai_settings_component_test';
import './app/app_settings_component_test';
import './app/app_component_test';
import './common/i18n_test';
import './common/store/persistent_store_test';
import './runtime/runtime_config_test';
import './services/display_evidence_builder_test';
