"use strict";
// Copyright (C) 2018 The Android Open Source Project
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
exports.ViewerPage = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const disposable_stack_1 = require("../../base/disposable_stack");
const dom_utils_1 = require("../../base/dom_utils");
const time_scale_1 = require("../../base/time_scale");
const app_impl_1 = require("../../core/app_impl");
const feature_flags_1 = require("../../core/feature_flags");
const raf_scheduler_1 = require("../../core/raf_scheduler");
const overview_timeline_panel_1 = require("./overview_timeline_panel");
const tab_panel_1 = require("./tab_panel");
const timeline_header_1 = require("./timeline_header");
const track_tree_view_1 = require("./track_tree_view");
const wasd_navigation_handler_1 = require("./wasd_navigation_handler");
const track_manager_1 = require("../../core/track_manager");
const OVERVIEW_PANEL_FLAG = feature_flags_1.featureFlags.register({
    id: 'overviewVisible',
    name: 'Overview Panel',
    description: 'Show the panel providing an overview of the trace',
    defaultValue: true,
});
class ViewerPage {
    trash = new disposable_stack_1.DisposableStack();
    timelineBounds;
    view({ attrs }) {
        const { trace } = attrs;
        return (0, mithril_1.default)('.pf-viewer-page.page', (0, mithril_1.default)(tab_panel_1.TabPanel, { trace }, OVERVIEW_PANEL_FLAG.get() &&
            (0, mithril_1.default)(overview_timeline_panel_1.OverviewTimeline, {
                trace,
                className: 'pf-viewer-page__overview',
            }), (0, mithril_1.default)(timeline_header_1.TimelineHeader, {
            trace,
            className: 'pf-viewer-page__header',
            // There are three independent canvases on this page which we could
            // use keep track of the timeline width, but we use the header one
            // because it's always rendered.
            onTimelineBoundsChange: (rect) => (this.timelineBounds = rect),
        }), 
        // Hide tracks while the trace is loading to prevent thrashing.
        !app_impl_1.AppImpl.instance.isLoadingTrace && [
            // Don't render pinned tracks if we have none.
            trace.workspace.pinnedTracks.length > 0 &&
                (0, mithril_1.default)(track_tree_view_1.TrackTreeView, {
                    trace,
                    className: 'pf-viewer-page__pinned-track-tree',
                    rootNode: trace.workspace.pinnedTracksNode,
                    canReorderNodes: true,
                    scrollToNewTracks: true,
                }),
            (0, mithril_1.default)(track_tree_view_1.TrackTreeView, {
                trace,
                className: 'pf-viewer-page__scrolling-track-tree',
                rootNode: trace.workspace.tracks,
                canReorderNodes: trace.workspace.userEditable,
                canRemoveNodes: trace.workspace.userEditable,
                trackFilter: (track) => (0, track_manager_1.trackMatchesFilter)(trace, track),
            }),
        ]));
    }
    oncreate(vnode) {
        const { attrs, dom } = vnode;
        // Handles WASD keybindings to pan & zoom
        const panZoomHandler = new wasd_navigation_handler_1.KeyboardNavigationHandler({
            element: (0, dom_utils_1.toHTMLElement)(dom),
            onPanned: (pannedPx) => {
                if (!this.timelineBounds)
                    return;
                const timeline = attrs.trace.timeline;
                const timescale = new time_scale_1.TimeScale(timeline.visibleWindow, this.timelineBounds);
                const tDelta = timescale.pxToDuration(pannedPx);
                timeline.panVisibleWindow(tDelta);
                raf_scheduler_1.raf.scheduleCanvasRedraw();
            },
            onZoomed: (zoomedPositionPx, zoomRatio) => {
                if (!this.timelineBounds)
                    return;
                const timeline = attrs.trace.timeline;
                const zoomPx = zoomedPositionPx - this.timelineBounds.left;
                const centerPoint = zoomPx / this.timelineBounds.width;
                timeline.zoomVisibleWindow(1 - zoomRatio, centerPoint);
                raf_scheduler_1.raf.scheduleCanvasRedraw();
            },
        });
        this.trash.use(panZoomHandler);
        this.onupdate(vnode);
    }
    onupdate({ attrs }) {
        // TODO(stevegolton): It's assumed that the TrackStacks will call into
        // trace.tracks.getTrackRenderer() in their view() functions which will mark
        // track renderers as used. We call flushOldTracks() here as it's guaranteed
        // to be called after view() on all child elements, and is only called once
        // per render cycle. However, this approach involves a bit too much magic.
        // The TODO is to sort this out and make it so the track flushing is
        // consolidated into one place.
        attrs.trace.tracks.flushOldTracks();
    }
    onremove() {
        this.trash.dispose();
    }
}
exports.ViewerPage = ViewerPage;
//# sourceMappingURL=viewer_page.js.map