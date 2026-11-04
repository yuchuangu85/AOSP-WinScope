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
import './app/ai_markdown_component_test';
import './app/ai_code_block_component_test';
import './app/ai_math_component_test';
import './services/ai_markdown_test';
import './app/ai_settings_component_test';
import './app/app_settings_component_test';
import './app/app_component_test';
import './app/trace_collection/collect_traces_component_test';
import './trace_collection/ui/ui_trace_configuration_test';
import './app/shared/rects/rects_component_test';
import './app/shared/timeline/mini-timeline/slider_component_test';
import './common/i18n_test';
import './common/dom_test';
import './app/shared/timeline/timeline_keyboard_input_test';
import './common/display_scale_test';
import './common/store/persistent_store_test';
import './runtime/runtime_config_test';
import './services/display_evidence_builder_test';
import './services/winscope_trace_query_test';
import './services/ai_trace_query_validation_test';
import './services/ai_diagnostic_prompts_test';
import './services/desktop_files_test';
import './app/shared/collapsible_sections/collapsible_section_title_component_test';
