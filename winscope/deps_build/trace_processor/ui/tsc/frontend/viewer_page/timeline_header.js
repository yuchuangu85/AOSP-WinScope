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
exports.TimelineHeader = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const canvas_utils_1 = require("../../base/canvas_utils");
const disposable_stack_1 = require("../../base/disposable_stack");
const dom_utils_1 = require("../../base/dom_utils");
const geom_1 = require("../../base/geom");
const logging_1 = require("../../base/logging");
const time_scale_1 = require("../../base/time_scale");
const zoned_interaction_handler_1 = require("../../base/zoned_interaction_handler");
const virtual_overlay_canvas_1 = require("../../widgets/virtual_overlay_canvas");
const css_constants_1 = require("../css_constants");
const notes_panel_1 = require("./notes_panel");
const tickmark_panel_1 = require("./tickmark_panel");
const time_axis_panel_1 = require("./time_axis_panel");
const time_selection_panel_1 = require("./time_selection_panel");
const timeline_interactions_1 = require("./timeline_interactions");
/**
 * This component defines the header of the timeline and handles it's mouse
 * interactions.
 *
 * The timeline header contains:
 * - The axis (ticks) and time labels
 * - The selection bar
 * - The notes bar
 * - The tickmark bar (highlights that appear when searching)
 */
class TimelineHeader {
    trash = new disposable_stack_1.DisposableStack();
    trace;
    panels;
    interactions;
    constructor({ attrs }) {
        this.trace = attrs.trace;
        this.panels = [
            new time_axis_panel_1.TimeAxisPanel(attrs.trace),
            new time_selection_panel_1.TimeSelectionPanel(attrs.trace),
            new notes_panel_1.NotesPanel(attrs.trace),
            new tickmark_panel_1.TickmarkPanel(attrs.trace),
        ];
    }
    view({ attrs }) {
        return (0, mithril_1.default)('.pf-timeline-header', { className: attrs.className }, (0, mithril_1.default)(virtual_overlay_canvas_1.VirtualOverlayCanvas, {
            onMount: (redrawCanvas) => attrs.trace.raf.addCanvasRedrawCallback(redrawCanvas),
            disableCanvasRedrawOnMithrilUpdates: true,
            onCanvasRedraw: (ctx) => {
                const rect = new geom_1.Rect2D({
                    left: css_constants_1.TRACK_SHELL_WIDTH,
                    right: ctx.virtualCanvasSize.width,
                    top: 0,
                    bottom: 0,
                });
                attrs.onTimelineBoundsChange?.(rect);
                this.drawCanvas(ctx);
            },
        }, this.panels.map((p) => p.render())));
    }
    oncreate({ dom }) {
        const timelineHeaderElement = (0, dom_utils_1.toHTMLElement)(dom);
        this.interactions = new zoned_interaction_handler_1.ZonedInteractionHandler(timelineHeaderElement);
        this.trash.use(this.interactions);
    }
    onremove() {
        this.trash.dispose();
    }
    drawCanvas({ ctx, virtualCanvasSize, }) {
        let top = 0;
        for (const p of this.panels) {
            const env_1 = { stack: [], error: void 0, hasError: false };
            try {
                const _ = tslib_1.__addDisposableResource(env_1, (0, canvas_utils_1.canvasSave)(ctx), false);
                ctx.translate(0, top);
                p.renderCanvas(ctx, { width: virtualCanvasSize.width, height: p.height });
                top += p.height;
            }
            catch (e_1) {
                env_1.error = e_1;
                env_1.hasError = true;
            }
            finally {
                tslib_1.__disposeResources(env_1);
            }
        }
        const timelineRect = new geom_1.Rect2D({
            left: css_constants_1.TRACK_SHELL_WIDTH,
            top: 0,
            right: virtualCanvasSize.width,
            bottom: virtualCanvasSize.height,
        });
        // Always grab the latest visible window and create a timescale
        // out of it.
        const visibleWindow = this.trace.timeline.visibleWindow;
        const timescale = new time_scale_1.TimeScale(visibleWindow, timelineRect);
        (0, logging_1.assertExists)(this.interactions).update([
            (0, timeline_interactions_1.shiftDragPanInteraction)(this.trace, timelineRect, timescale),
            (0, timeline_interactions_1.wheelNavigationInteraction)(this.trace, timelineRect, timescale),
            {
                // Allow making area selections (no tracks) by dragging on the header
                // timeline.
                id: 'area-selection',
                area: timelineRect,
                drag: {
                    minDistance: 1,
                    cursorWhileDragging: 'text',
                    onDrag: (e) => {
                        this.trace.raf.scheduleCanvasRedraw();
                        const dragRect = geom_1.Rect2D.fromPoints(e.dragStart, e.dragCurrent);
                        const timeSpan = timescale
                            .pxSpanToHpTimeSpan(dragRect)
                            .toTimeSpan();
                        this.trace.timeline.selectedSpan = timeSpan;
                    },
                    onDragEnd: (e) => {
                        const dragRect = geom_1.Rect2D.fromPoints(e.dragStart, e.dragCurrent);
                        const timeSpan = timescale
                            .pxSpanToHpTimeSpan(dragRect)
                            .toTimeSpan();
                        this.trace.selection.selectArea({
                            start: timeSpan.start,
                            end: timeSpan.end,
                            trackUris: [],
                        });
                        this.trace.timeline.selectedSpan = undefined;
                    },
                },
            },
        ]);
    }
}
exports.TimelineHeader = TimelineHeader;
//# sourceMappingURL=timeline_header.js.map