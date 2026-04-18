"use strict";
// Copyright (C) 2024 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentSelectionTab = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const raf_scheduler_1 = require("../../core/raf_scheduler");
const details_shell_1 = require("../../widgets/details_shell");
const empty_state_1 = require("../../widgets/empty_state");
const grid_layout_1 = require("../../widgets/grid_layout");
const section_1 = require("../../widgets/section");
const tree_1 = require("../../widgets/tree");
const logging_1 = require("../../base/logging");
const button_1 = require("../../widgets/button");
const note_editor_1 = require("../note_editor");
class CurrentSelectionTab {
    fadeContext = new FadeContext();
    currentAreaSubTabId;
    view({ attrs }) {
        const section = this.renderCurrentSelectionTabContent(attrs.trace);
        if (section.isLoading) {
            return (0, mithril_1.default)(FadeIn, section.content);
        }
        else {
            return (0, mithril_1.default)(FadeOut, { context: this.fadeContext }, section.content);
        }
    }
    renderCurrentSelectionTabContent(trace) {
        const selection = trace.selection.selection;
        const selectionKind = selection.kind;
        switch (selectionKind) {
            case 'empty':
                return this.renderEmptySelection('Nothing selected');
            case 'track':
                return this.renderTrackSelection(trace, selection);
            case 'track_event':
                return this.renderTrackEventSelection(trace);
            case 'area':
                return this.renderAreaSelection(trace, selection);
            case 'note':
                return this.renderNoteSelection(trace, selection);
            default:
                (0, logging_1.assertUnreachable)(selectionKind);
        }
    }
    renderEmptySelection(message) {
        return {
            isLoading: false,
            content: (0, mithril_1.default)(empty_state_1.EmptyState, {
                className: 'pf-noselection',
                title: message,
            }),
        };
    }
    renderTrackSelection(trace, selection) {
        return {
            isLoading: false,
            content: this.renderTrackDetailsPanel(trace, selection.trackUri),
        };
    }
    renderTrackEventSelection(trace) {
        // The selection panel has already loaded the details panel for us... let's
        // hope it's the right one!
        const detailsPanel = trace.selection.getDetailsPanelForSelection();
        if (detailsPanel) {
            return {
                isLoading: detailsPanel.isLoading,
                content: detailsPanel.render(),
            };
        }
        else {
            return {
                isLoading: true,
                content: 'Loading...',
            };
        }
    }
    renderAreaSelection(trace, selection) {
        const tabs = trace.selection.areaSelectionTabs.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
        const renderedTabs = tabs
            .map((tab) => [tab, tab.render(selection)])
            .filter(([_, content]) => content !== undefined);
        if (renderedTabs.length === 0) {
            return this.renderEmptySelection('No details available for selection');
        }
        // Find the active tab or just pick the first one if that selected tab is
        // not available.
        const [activeTab, tabContent] = renderedTabs.find(([tab]) => tab.id === this.currentAreaSubTabId) ??
            renderedTabs[0];
        return {
            isLoading: tabContent?.isLoading ?? false,
            content: (0, mithril_1.default)(details_shell_1.DetailsShell, {
                title: 'Area Selection',
                description: (0, mithril_1.default)(button_1.ButtonBar, renderedTabs.map(([tab]) => (0, mithril_1.default)(button_1.Button, {
                    label: tab.name,
                    key: tab.id,
                    active: activeTab === tab,
                    onclick: () => (this.currentAreaSubTabId = tab.id),
                }))),
            }, tabContent?.content),
        };
    }
    renderNoteSelection(trace, selection) {
        return {
            isLoading: false,
            content: (0, mithril_1.default)(note_editor_1.NoteEditor, { trace, selection }),
        };
    }
    renderTrackDetailsPanel(trace, trackUri) {
        const track = trace.tracks.getTrack(trackUri);
        if (track) {
            return (0, mithril_1.default)(details_shell_1.DetailsShell, { title: 'Track', description: track.title }, (0, mithril_1.default)(grid_layout_1.GridLayout, (0, mithril_1.default)(grid_layout_1.GridLayoutColumn, (0, mithril_1.default)(section_1.Section, { title: 'Details' }, (0, mithril_1.default)(tree_1.Tree, (0, mithril_1.default)(tree_1.TreeNode, { left: 'Name', right: track.title }), (0, mithril_1.default)(tree_1.TreeNode, { left: 'URI', right: track.uri }), (0, mithril_1.default)(tree_1.TreeNode, { left: 'Plugin ID', right: track.pluginId }), (0, mithril_1.default)(tree_1.TreeNode, { left: 'Tags' }, track.tags &&
                Object.entries(track.tags).map(([key, value]) => {
                    return (0, mithril_1.default)(tree_1.TreeNode, { left: key, right: value?.toString() });
                })))))));
        }
        else {
            return undefined; // TODO show something sensible here
        }
    }
}
exports.CurrentSelectionTab = CurrentSelectionTab;
const FADE_TIME_MS = 50;
class FadeContext {
    resolver = () => { };
    putResolver(res) {
        this.resolver = res;
    }
    resolve() {
        this.resolver();
        this.resolver = () => { };
    }
}
class FadeOut {
    onbeforeremove({ attrs }) {
        return new Promise((res) => {
            attrs.context.putResolver(res);
            setTimeout(res, FADE_TIME_MS);
        });
    }
    oncreate({ attrs }) {
        attrs.context.resolve();
    }
    view(vnode) {
        return vnode.children;
    }
}
class FadeIn {
    show = false;
    oncreate(_) {
        setTimeout(() => {
            this.show = true;
            raf_scheduler_1.raf.scheduleFullRedraw();
        }, FADE_TIME_MS);
    }
    view(vnode) {
        return this.show ? vnode.children : undefined;
    }
}
//# sourceMappingURL=current_selection_tab.js.map