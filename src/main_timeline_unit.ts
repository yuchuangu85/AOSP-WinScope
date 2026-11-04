/* eslint-disable winscope/sort-imports */
import 'zone.js';
import 'zone.js/testing';
import {TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {Registry} from '@trace/proto_utils/tampered_message_type';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
beforeAll(async () => { await Registry.getInstance().loadDefaultDescriptors(); });

import './app/shared/timeline/common/timeline_drawer_helpers_test';
import './app/shared/timeline/mini-timeline/mini_timeline_component_test';
import './app/shared/timeline/mini-timeline/slider_component_test';
import './app/shared/timeline/expanded-timeline/default_timeline_row_component_test';
import './app/shared/timeline/expanded-timeline/transition_timeline_component_test';
import './app/shared/timeline/expanded-timeline/expanded_timeline_component_test';
import './app/shared/timeline/timeline_component_test';
import './app/shared/timeline/timeline_keyboard_input_test';
