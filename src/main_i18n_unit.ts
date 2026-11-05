/* eslint-disable winscope/sort-imports */
// Zone testing must initialize before Angular. Exercise localized pages and
// shared UI without loading the full parser/Trace Processor fixture suite.
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
import './common/i18n_test';
import './common/display_scale_test';
import './app/shared/timeline/mini-timeline/slider_component_test';
import './common/store/persistent_store_test';
import './app/search/active_search_component_test';
import './app/search/search_list_component_test';
import './app/shared/shortcuts_panel/shortcuts_component_test';
import './app/trace_collection/trace_config_component_test';
import './app/trace_collection/winscope_proxy_setup_component_test';
import './app/trace_collection/warning_dialog_component_test';
import './app/trace_loading/load_progress_component_test';
import './app/shared/viewer_localization_test';
import './app/shared/viewer_header_layout_test';
import './app/shared/snackbar/snack_bar_component_test';
import './app/shared/snackbar/snack_bar_opener_test';
import './common/i18n_notifications_test';
import './app/shared/log_view/log_component_test';
import './app/trace_loading/upload_traces_component_test';
import './app/search/viewer_search_component_test';
import './app/trace_view_component_test';
import './app/app_component_test';
import './app/landing_layout_test';
import './app/input/viewer_input_component_test';
import './app/input_method/shared/coordinates_table_component_test';
import './app/input_method/shared/ime_additional_properties_component_test';
import './app/input_method/shared/viewer_input_method_component_test';
import './app/media_based/viewer_media_based_component_test';
import './app/shared/collapsible_sections/collapsed_sections_component_test';
import './app/shared/collapsible_sections/collapsible_section_title_component_test';
import './app/shared/hierarchy/hierarchy_component_test';
import './app/shared/hierarchy/hierarchy_tree_node_data_view_component_test';
import './app/shared/log_view/select_with_filter_component_test';
import './app/shared/properties/properties_component_test';
import './app/shared/rects/rects_component_test';
import './app/shared/resizer/resizer_component_test';
import './app/shared/search_box/search_box_component_test';
import './app/shared/timeline/expanded-timeline/expanded_timeline_component_test';
import './app/shared/timeline/expanded-timeline/transition_timeline_component_test';
import './app/shared/timeline/mini-timeline/mini_timeline_component_test';
import './app/shared/timeline/playback_component_test';
import './app/shared/timeline/timeline_component_test';
import './app/shared/user_options/user_options_component_test';
import './app/surface_flinger/surface_flinger_property_groups_component_test';
import './app/surface_flinger/transform_matrix_component_test';
import './app/surface_flinger/viewer_surface_flinger_component_test';
import './app/trace_collection/collect_traces_component_test';
import './app/trace_collection/wdp_setup_component_test';
import './app/transactions/viewer_transactions_component_test';
import './app/transitions/viewer_transitions_component_test';
import './app/view_capture/view_capture_property_groups_component_test';
import './app/view_capture/viewer_view_capture_component_test';
import './app/window_manager/viewer_window_manager_component_test';
