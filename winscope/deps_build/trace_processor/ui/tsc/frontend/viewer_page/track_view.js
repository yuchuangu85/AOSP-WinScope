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
exports.TrackView = void 0;
const tslib_1 = require("tslib");
/**
 * This module provides the TrackNodeTree mithril component, which is
 * responsible for rendering out a tree of tracks and drawing their content
 * onto the canvas.
 * - Rendering track panels and handling nested and sticky headers.
 * - Managing the virtual canvas & drawing the grid-lines, tracks and overlays
 *   onto the canvas.
 * - Handling track interaction events such as dragging, panning and scrolling.
 */
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const canvas_utils_1 = require("../../base/canvas_utils");
const classnames_1 = require("../../base/classnames");
const geom_1 = require("../../base/geom");
const semantic_icons_1 = require("../../base/semantic_icons");
const time_scale_1 = require("../../base/time_scale");
const perf_stats_1 = require("../../core/perf_stats");
const raf_scheduler_1 = require("../../core/raf_scheduler");
const workspace_1 = require("../../public/workspace");
const button_1 = require("../../widgets/button");
const menu_1 = require("../../widgets/menu");
const track_shell_1 = require("../../widgets/track_shell");
const tree_1 = require("../../widgets/tree");
const css_constants_1 = require("../css_constants");
const resolution_1 = require("./resolution");
const anchor_1 = require("../../widgets/anchor");
const modal_1 = require("../../widgets/modal");
const clipboard_1 = require("../../base/clipboard");
const TRACK_HEIGHT_MIN_PX = 18;
const TRACK_HEIGHT_DEFAULT_PX = 30;
function getTrackHeight(node, track) {
    // Headless tracks have an effective height of 0.
    if (node.headless)
        return 0;
    // Expanded summary tracks don't show any data, so make them a little more
    // compact to save space.
    if (node.isSummary && node.expanded)
        return TRACK_HEIGHT_DEFAULT_PX;
    const trackHeight = track?.getHeight();
    if (trackHeight === undefined)
        return TRACK_HEIGHT_DEFAULT_PX;
    // Limit the minimum height of a track, and also round up to the nearest
    // integer, as sub-integer DOM alignment can cause issues e.g. with sticky
    // positioning.
    return Math.ceil(Math.max(trackHeight, TRACK_HEIGHT_MIN_PX));
}
/**
 * The `TrackView` class is responsible for managing and rendering individual
 * tracks in the `TrackTreeView` Mithril component. It handles operations such
 * as:
 *
 * - Rendering track content in the DOM and virtual canvas.
 * - Managing user interactions like dragging, panning, scrolling, and area
 *   selection.
 * - Tracking and displaying rendering performance metrics.
 */
class TrackView {
    node;
    renderer;
    height;
    verticalBounds;
    trace;
    descriptor;
    constructor(trace, node, top) {
        this.trace = trace;
        this.node = node;
        if (node.uri) {
            this.descriptor = trace.tracks.getTrack(node.uri);
            this.renderer = this.trace.tracks.getTrackFSM(node.uri);
        }
        const heightPx = getTrackHeight(node, this.renderer?.track);
        this.height = heightPx;
        this.verticalBounds = { top, bottom: top + heightPx };
    }
    renderDOM(attrs, children) {
        const { scrollToOnCreate, reorderable = false, collapsible, removable, } = attrs;
        const { node, renderer, height } = this;
        const buttons = attrs.lite
            ? []
            : [
                renderer?.track.getTrackShellButtons?.(),
                (removable || node.removable) && this.renderCloseButton(),
                // We don't want summary tracks to be pinned as they rarely have
                // useful information.
                !node.isSummary && this.renderPinButton(),
                this.renderTrackMenuButton(),
                this.renderAreaSelectionCheckbox(),
            ];
        let scrollIntoView = false;
        const tracks = this.trace.tracks;
        if (tracks.scrollToTrackNodeId === node.id) {
            tracks.scrollToTrackNodeId = undefined;
            scrollIntoView = true;
        }
        function showTrackMoveErrorModal(msg) {
            (0, modal_1.showModal)({
                title: 'Error',
                content: msg,
                buttons: [{ text: 'OK' }],
            });
        }
        return (0, mithril_1.default)(track_shell_1.TrackShell, {
            id: node.id,
            title: node.title,
            subtitle: renderer?.desc.subtitle,
            ref: node.fullPath.join('/'),
            heightPx: height,
            error: renderer?.getError(),
            chips: renderer?.desc.chips,
            buttons,
            scrollToOnCreate: scrollToOnCreate || scrollIntoView,
            collapsible: collapsible && node.hasChildren,
            collapsed: collapsible && node.collapsed,
            highlight: this.isHighlighted(),
            summary: node.isSummary,
            reorderable,
            depth: attrs.depth,
            stickyTop: attrs.stickyTop,
            pluginId: renderer?.desc.pluginId,
            lite: attrs.lite,
            onCollapsedChanged: () => {
                node.hasChildren && node.toggleCollapsed();
            },
            onTrackContentMouseMove: (pos, bounds) => {
                const timescale = this.getTimescaleForBounds(bounds);
                renderer?.track.onMouseMove?.({
                    ...pos,
                    timescale,
                });
                raf_scheduler_1.raf.scheduleCanvasRedraw();
            },
            onTrackContentMouseOut: () => {
                renderer?.track.onMouseOut?.();
                raf_scheduler_1.raf.scheduleCanvasRedraw();
            },
            onTrackContentClick: (pos, bounds) => {
                const timescale = this.getTimescaleForBounds(bounds);
                raf_scheduler_1.raf.scheduleCanvasRedraw();
                return (renderer?.track.onMouseClick?.({
                    ...pos,
                    timescale,
                }) ?? false);
            },
            onupdate: () => {
                renderer?.track.onFullRedraw?.();
            },
            onMoveBefore: (nodeId) => {
                // We are the reference node (the one to be moved relative to), nodeId
                // references the target node (the one to be moved)
                const nodeToMove = node.workspace?.getTrackById(nodeId);
                const targetNode = this.node.parent;
                if (nodeToMove && targetNode) {
                    // Insert the target node before this one
                    const result = targetNode.addChildBefore(nodeToMove, node);
                    if (!result.ok) {
                        showTrackMoveErrorModal(result.error);
                    }
                }
            },
            onMoveInside: (nodeId) => {
                // This one moves the node inside this node & expand it if it's not
                // expanded already.
                const nodeToMove = node.workspace?.getTrackById(nodeId);
                if (nodeToMove) {
                    const result = this.node.addChildLast(nodeToMove);
                    if (result.ok) {
                        this.node.expand();
                    }
                    else {
                        showTrackMoveErrorModal(result.error);
                    }
                }
            },
            onMoveAfter: (nodeId) => {
                // We are the reference node (the one to be moved relative to), nodeId
                // references the target node (the one to be moved)
                const nodeToMove = node.workspace?.getTrackById(nodeId);
                const targetNode = this.node.parent;
                if (nodeToMove && targetNode) {
                    // Insert the target node after this one
                    const result = targetNode.addChildAfter(nodeToMove, node);
                    if (!result.ok) {
                        showTrackMoveErrorModal(result.error);
                    }
                }
            },
        }, children);
    }
    drawCanvas(ctx, rect, visibleWindow, perfStatsEnabled, trackPerfStats) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            // For each track we rendered in view(), render it to the canvas. We know the
            // vertical bounds, so we just need to combine it with the horizontal bounds
            // and we're golden.
            const { node, renderer, verticalBounds } = this;
            if (node.isSummary && node.expanded)
                return;
            if (renderer?.getError())
                return;
            const trackRect = new geom_1.Rect2D({
                ...rect,
                ...verticalBounds,
            });
            // Track renderers expect to start rendering at (0, 0), so we need to
            // translate the canvas and create a new timescale.
            const _ = tslib_1.__addDisposableResource(env_1, (0, canvas_utils_1.canvasSave)(ctx), false);
            (0, canvas_utils_1.canvasClip)(ctx, trackRect);
            ctx.translate(trackRect.left, trackRect.top);
            const timescale = new time_scale_1.TimeScale(visibleWindow, {
                left: 0,
                right: trackRect.width,
            });
            const start = performance.now();
            node.uri &&
                renderer?.render({
                    trackUri: node.uri,
                    visibleWindow,
                    size: trackRect,
                    resolution: (0, resolution_1.calculateResolution)(visibleWindow, trackRect.width),
                    ctx,
                    timescale,
                });
            this.highlightIfTrackInAreaSelection(ctx, timescale, trackRect);
            const renderTime = performance.now() - start;
            if (!perfStatsEnabled)
                return;
            this.updateAndRenderTrackPerfStats(ctx, trackRect, renderTime, trackPerfStats);
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            tslib_1.__disposeResources(env_1);
        }
    }
    renderCloseButton() {
        return (0, mithril_1.default)(button_1.Button, {
            // TODO(stevegolton): It probably makes sense to only show this button
            // when hovered for consistency with the other buttons, but hiding this
            // button currently breaks the tests as we wait for the buttons to become
            // available, enabled and visible before clicking on them.
            // className: 'pf-visible-on-hover',
            onclick: () => {
                this.node.remove();
            },
            icon: semantic_icons_1.Icons.Close,
            title: 'Remove track',
            compact: true,
        });
    }
    renderPinButton() {
        const isPinned = this.node.isPinned;
        return (0, mithril_1.default)(button_1.Button, {
            className: (0, classnames_1.classNames)(!isPinned && 'pf-visible-on-hover'),
            onclick: () => {
                isPinned ? this.node.unpin() : this.node.pin();
            },
            icon: semantic_icons_1.Icons.Pin,
            iconFilled: isPinned,
            title: isPinned ? 'Unpin' : 'Pin to top',
            compact: true,
        });
    }
    renderTrackMenuButton() {
        return (0, mithril_1.default)(menu_1.PopupMenu, {
            trigger: (0, mithril_1.default)(button_1.Button, {
                className: 'pf-visible-on-hover',
                icon: 'more_vert',
                compact: true,
                title: 'Track options',
            }),
        }, 
        // Putting these menu items inside a component means that view is only
        // called when the popup is actually open, which can improve DOM
        // render performance when we have thousands of tracks on screen.
        (0, mithril_1.default)(TrackPopupMenu, {
            trace: this.trace,
            node: this.node,
            descriptor: this.descriptor,
        }));
    }
    getTimescaleForBounds(bounds) {
        const timeWindow = this.trace.timeline.visibleWindow;
        return new time_scale_1.TimeScale(timeWindow, {
            left: 0,
            right: bounds.right - bounds.left,
        });
    }
    isHighlighted() {
        const { trace, node } = this;
        // The track should be highlighted if the current search result matches this
        // track or one of its children.
        const searchIndex = trace.search.resultIndex;
        const searchResults = trace.search.searchResults;
        if (searchIndex !== -1 && searchResults !== undefined) {
            // using _ = autoTimer();
            const uri = searchResults.trackUris[searchIndex];
            // Highlight if this or any children match the search results
            if (uri === node.uri || node.getTrackByUri(uri)) {
                return true;
            }
        }
        const curSelection = trace.selection;
        if (curSelection.selection.kind === 'track' &&
            curSelection.selection.trackUri === node.uri) {
            return true;
        }
        return false;
    }
    renderAreaSelectionCheckbox() {
        const { trace, node } = this;
        const selectionManager = trace.selection;
        const selection = selectionManager.selection;
        if (selection.kind === 'area') {
            if (node.isSummary) {
                const tracksWithUris = node.flatTracks.filter((t) => t.uri !== undefined);
                // Check if any nodes within are selected
                const childTracksInSelection = tracksWithUris.map((t) => selection.trackUris.includes(t.uri));
                function renderButton(icon, title) {
                    return (0, mithril_1.default)(button_1.Button, {
                        onclick: () => {
                            const uris = tracksWithUris.map((t) => t.uri);
                            selectionManager.toggleGroupAreaSelection(uris);
                        },
                        compact: true,
                        icon,
                        title,
                    });
                }
                if (childTracksInSelection.every((b) => b)) {
                    return renderButton(semantic_icons_1.Icons.Checkbox, 'Remove child tracks from selection');
                }
                else if (childTracksInSelection.some((b) => b)) {
                    return renderButton(semantic_icons_1.Icons.IndeterminateCheckbox, 'Add remaining child tracks to selection');
                }
                else {
                    return renderButton(semantic_icons_1.Icons.BlankCheckbox, 'Add child tracks to selection');
                }
            }
            else {
                const nodeUri = node.uri;
                if (nodeUri) {
                    return (selection.kind === 'area' &&
                        (0, mithril_1.default)(button_1.Button, {
                            onclick: () => {
                                selectionManager.toggleTrackAreaSelection(nodeUri);
                            },
                            compact: true,
                            ...(selection.trackUris.includes(nodeUri)
                                ? { icon: semantic_icons_1.Icons.Checkbox, title: 'Remove track' }
                                : { icon: semantic_icons_1.Icons.BlankCheckbox, title: 'Add track to selection' }),
                        }));
                }
            }
        }
        return undefined;
    }
    highlightIfTrackInAreaSelection(ctx, timescale, size) {
        const selection = this.trace.selection.selection;
        if (selection.kind !== 'area') {
            return;
        }
        let selected = false;
        if (this.node.isSummary) {
            // Summary tracks cannot themselves be area-selected. So, as a visual aid,
            // if this track is a summary track and some of its children are in the
            // area selecion, highlight this track as if it were in the area
            // selection too.
            selected = selection.trackUris.some((uri) => this.node.getTrackByUri(uri));
        }
        else {
            // For non-summary tracks, simply highlight this track if it's in the area
            // selection.
            if (this.node.uri !== undefined) {
                selected = selection.trackUris.includes(this.node.uri);
            }
        }
        if (selected) {
            const selectedAreaDuration = selection.end - selection.start;
            ctx.fillStyle = css_constants_1.SELECTION_FILL_COLOR;
            ctx.fillRect(timescale.timeToPx(selection.start), 0, timescale.durationToPx(selectedAreaDuration), size.height);
        }
    }
    updateAndRenderTrackPerfStats(ctx, size, renderTime, trackPerfStats) {
        let renderStats = trackPerfStats.get(this.node);
        if (renderStats === undefined) {
            renderStats = new perf_stats_1.PerfStats();
            trackPerfStats.set(this.node, renderStats);
        }
        renderStats.addValue(renderTime);
        // Draw a green box around the whole track
        ctx.strokeStyle = 'rgba(69, 187, 73, 0.5)';
        const lineWidth = 1;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(lineWidth / 2, lineWidth / 2, size.width - lineWidth, size.height - lineWidth);
        const statW = 300;
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'start';
        ctx.textBaseline = 'alphabetic';
        ctx.direction = 'inherit';
        ctx.fillStyle = 'hsl(97, 100%, 96%)';
        ctx.fillRect(size.width - statW, size.height - 20, statW, 20);
        ctx.fillStyle = 'hsla(122, 77%, 22%)';
        const statStr = `Track ${this.node.id} | ` + (0, perf_stats_1.runningStatStr)(renderStats);
        ctx.fillText(statStr, size.width - statW, size.height - 10);
    }
}
exports.TrackView = TrackView;
// This component contains the track menu items which are displayed inside a
// popup menu on each track. They're in a component to avoid having to render
// them every single mithril cycle.
const TrackPopupMenu = {
    view({ attrs }) {
        return [
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Select track',
                disabled: !attrs.node.uri,
                onclick: () => {
                    attrs.trace.selection.selectTrack(attrs.node.uri);
                },
                title: attrs.node.uri
                    ? 'Select track'
                    : 'Track has no URI and cannot be selected',
            }),
            (0, mithril_1.default)(menu_1.MenuItem, { label: 'Track details' }, renderTrackDetailsMenu(attrs.node, attrs.descriptor)),
            (0, mithril_1.default)(menu_1.MenuDivider),
            (0, mithril_1.default)(menu_1.MenuItem, { label: 'Copy to workspace' }, attrs.trace.workspaces.all.map((ws) => (0, mithril_1.default)(menu_1.MenuItem, {
                label: ws.title,
                disabled: !ws.userEditable,
                onclick: () => copyToWorkspace(attrs.trace, attrs.node, ws),
            })), (0, mithril_1.default)(menu_1.MenuDivider), (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'New workspace...',
                onclick: () => copyToWorkspace(attrs.trace, attrs.node),
            })),
            (0, mithril_1.default)(menu_1.MenuItem, { label: 'Copy & switch to workspace' }, attrs.trace.workspaces.all.map((ws) => (0, mithril_1.default)(menu_1.MenuItem, {
                label: ws.title,
                disabled: !ws.userEditable,
                onclick: async () => {
                    copyToWorkspace(attrs.trace, attrs.node, ws);
                    attrs.trace.workspaces.switchWorkspace(ws);
                },
            })), (0, mithril_1.default)(menu_1.MenuDivider), (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'New workspace...',
                onclick: async () => {
                    const ws = copyToWorkspace(attrs.trace, attrs.node);
                    attrs.trace.workspaces.switchWorkspace(ws);
                },
            })),
        ];
    },
};
function copyToWorkspace(trace, node, ws) {
    // If no workspace provided, create a new one.
    if (!ws) {
        ws = trace.workspaces.createEmptyWorkspace('Untitled Workspace');
    }
    // Deep clone makes sure all group's content is also copied
    const newNode = node.clone(true);
    newNode.removable = true;
    ws.addChildLast(newNode);
    return ws;
}
function renderTrackDetailsMenu(node, descriptor) {
    let parent = node.parent;
    let fullPath = [node.title];
    while (parent && parent instanceof workspace_1.TrackNode) {
        fullPath = [parent.title, ' \u2023 ', ...fullPath];
        parent = parent.parent;
    }
    const query = descriptor?.track.getDataset?.()?.query();
    return (0, mithril_1.default)('.pf-track__track-details-popup', (0, mithril_1.default)(tree_1.Tree, (0, mithril_1.default)(tree_1.TreeNode, { left: 'Track Node ID', right: node.id }), (0, mithril_1.default)(tree_1.TreeNode, { left: 'Collapsed', right: `${node.collapsed}` }), (0, mithril_1.default)(tree_1.TreeNode, { left: 'URI', right: node.uri }), (0, mithril_1.default)(tree_1.TreeNode, {
        left: 'Is Summary Track',
        right: `${node.isSummary}`,
    }), (0, mithril_1.default)(tree_1.TreeNode, {
        left: 'SortOrder',
        right: node.sortOrder ?? '0 (undefined)',
    }), (0, mithril_1.default)(tree_1.TreeNode, { left: 'Path', right: fullPath }), (0, mithril_1.default)(tree_1.TreeNode, { left: 'Title', right: node.title }), (0, mithril_1.default)(tree_1.TreeNode, {
        left: 'Workspace',
        right: node.workspace?.title ?? '[no workspace]',
    }), descriptor &&
        (0, mithril_1.default)(tree_1.TreeNode, {
            left: 'Plugin ID',
            right: descriptor.pluginId,
        }), query &&
        (0, mithril_1.default)(tree_1.TreeNode, {
            left: 'Track Query',
            right: (0, mithril_1.default)(anchor_1.Anchor, {
                onclick: () => {
                    (0, modal_1.showModal)({
                        title: 'Query for track',
                        content: (0, mithril_1.default)('pre', query),
                        buttons: [
                            {
                                text: 'Copy to clipboard',
                                action: () => (0, clipboard_1.copyToClipboard)(query),
                            },
                        ],
                    });
                },
            }, 'Show query'),
        }), descriptor &&
        (0, mithril_1.default)(tree_1.TreeNode, { left: 'Tags' }, descriptor.tags &&
            Object.entries(descriptor.tags).map(([key, value]) => {
                return (0, mithril_1.default)(tree_1.TreeNode, { left: key, right: value?.toString() });
            }))));
}
//# sourceMappingURL=track_view.js.map