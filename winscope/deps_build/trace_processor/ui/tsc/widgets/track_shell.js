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
exports.TrackShell = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const classnames_1 = require("../base/classnames");
const disposable_stack_1 = require("../base/disposable_stack");
const dom_utils_1 = require("../base/dom_utils");
const logging_1 = require("../base/logging");
const math_utils_1 = require("../base/math_utils");
const mithril_utils_1 = require("../base/mithril_utils");
const semantic_icons_1 = require("../base/semantic_icons");
const button_1 = require("./button");
const chip_1 = require("./chip");
const common_1 = require("./common");
const middle_ellipsis_1 = require("./middle_ellipsis");
const popup_1 = require("./popup");
const stack_1 = require("./stack");
class TrackShell {
    mouseDownPos;
    selectionOccurred = false;
    scrollIntoView = false;
    view(vnode) {
        const { attrs } = vnode;
        const { collapsible, collapsed, id, summary, heightPx, ref, depth = 0, stickyTop = 0, lite, } = attrs;
        const expanded = collapsible && !collapsed;
        const trackHeight = heightPx;
        return (0, mithril_1.default)('.pf-track', {
            id,
            style: {
                '--height': trackHeight,
                '--depth': (0, math_utils_1.clamp)(depth, 0, 16),
                '--sticky-top': Math.max(0, stickyTop),
            },
            ref,
        }, (0, mithril_1.default)('.pf-track__header', {
            className: (0, classnames_1.classNames)(summary && 'pf-track__header--summary', expanded && 'pf-track__header--expanded', summary && expanded && 'pf-track__header--expanded--summary'),
        }, this.renderShell(attrs), !lite && this.renderContent(attrs)), (0, mithril_utils_1.hasChildren)(vnode) && (0, mithril_1.default)('.pf-track__children', vnode.children));
    }
    oncreate({ dom, attrs }) {
        if (attrs.scrollToOnCreate) {
            dom.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    onupdate({ dom }) {
        if (this.scrollIntoView) {
            dom.scrollIntoView({ behavior: 'instant', block: 'nearest' });
            this.scrollIntoView = false;
        }
    }
    renderShell(attrs) {
        const { id, chips, collapsible, collapsed, reorderable = false, onMoveAfter = () => { }, onMoveBefore = () => { }, onMoveInside = () => { }, buttons, highlight, lite, summary, } = attrs;
        const block = 'pf-track';
        const blockElement = `${block}__shell`;
        const dragBeforeClassName = `${blockElement}--drag-before`;
        const dragInsideClassName = `${blockElement}--drag-inside`;
        const dragAfterClassName = `${blockElement}--drag-after`;
        function updateDragClassname(target, className) {
            // This is a bit brute-force, but gets the job done without triggering a
            // full mithril redraw every frame while dragging...
            target.classList.remove(dragBeforeClassName);
            target.classList.remove(dragAfterClassName);
            target.classList.remove(dragInsideClassName);
            target.classList.add(className);
        }
        return (0, mithril_1.default)(`.pf-track__shell`, {
            className: (0, classnames_1.classNames)(collapsible && 'pf-track__shell--clickable', highlight && 'pf-track__shell--highlight'),
            onclick: () => {
                collapsible && attrs.onCollapsedChanged?.(!collapsed);
                if (!collapsed) {
                    this.scrollIntoView = true;
                }
            },
            draggable: reorderable,
            ondragstart: (e) => {
                id && e.dataTransfer?.setData('text/plain', id);
            },
            ondragover: (e) => {
                if (!reorderable) {
                    return;
                }
                const target = e.currentTarget;
                const position = (0, dom_utils_1.currentTargetOffset)(e);
                if (summary) {
                    // For summary tracks, split the track into thirds, so it's
                    // possible to insert above, below and into.
                    const threshold = target.offsetHeight / 3;
                    if (position.y < threshold) {
                        // Hovering on the upper third, move before this node.
                        updateDragClassname(target, dragBeforeClassName);
                    }
                    else if (position.y < threshold * 2) {
                        // Hovering in the middle, move inside this node.
                        updateDragClassname(target, dragInsideClassName);
                    }
                    else {
                        // Hovering on the lower third, move after this node.
                        updateDragClassname(target, dragAfterClassName);
                    }
                }
                else {
                    // For non-summary tracks, split the track in half, as it's only
                    // possible to insert before and after.
                    const threshold = target.offsetHeight / 2;
                    if (position.y < threshold) {
                        updateDragClassname(target, dragBeforeClassName);
                    }
                    else {
                        updateDragClassname(target, dragAfterClassName);
                    }
                }
            },
            ondragleave: (e) => {
                if (!reorderable) {
                    return;
                }
                const target = e.currentTarget;
                const related = e.relatedTarget;
                if (related && !target.contains(related)) {
                    target.classList.remove(dragAfterClassName);
                    target.classList.remove(dragBeforeClassName);
                }
            },
            ondrop: (e) => {
                if (!reorderable) {
                    return;
                }
                const id = e.dataTransfer?.getData('text/plain');
                const target = e.currentTarget;
                const position = (0, dom_utils_1.currentTargetOffset)(e);
                if (id !== undefined) {
                    if (summary) {
                        // For summary tracks, split the track into thirds, so it's
                        // possible to insert above, below and into.
                        const threshold = target.offsetHeight / 3;
                        if (position.y < threshold) {
                            // Dropped on the upper third, move before this node.
                            onMoveBefore(id);
                        }
                        else if (position.y < threshold * 2) {
                            // Dropped in the middle, move inside this node.
                            onMoveInside(id);
                        }
                        else {
                            // Dropped on the lower third, move after this node.
                            onMoveAfter(id);
                        }
                    }
                    else {
                        // For non-summary tracks, split the track in half, as it's only
                        // possible to insert before and after.
                        const threshold = target.offsetHeight / 2;
                        if (position.y < threshold) {
                            onMoveBefore(id);
                        }
                        else {
                            onMoveAfter(id);
                        }
                    }
                }
                // Remove all the modifiers
                target.classList.remove(dragAfterClassName);
                target.classList.remove(dragInsideClassName);
                target.classList.remove(dragBeforeClassName);
            },
        }, lite
            ? attrs.title
            : (0, mithril_1.default)('.pf-track__menubar', collapsible
                ? (0, mithril_1.default)(button_1.Button, {
                    className: 'pf-track__collapse-button',
                    compact: true,
                    icon: collapsed ? semantic_icons_1.Icons.ExpandDown : semantic_icons_1.Icons.ExpandUp,
                })
                : (0, mithril_1.default)('.pf-track__title-spacer'), (0, mithril_1.default)(TrackTitle, { title: attrs.title }), chips &&
                (0, mithril_1.default)(stack_1.Stack, {
                    className: 'pf-track__chips',
                    spacing: 'small',
                    orientation: 'horizontal',
                }, chips.map((chip) => (0, mithril_1.default)(chip_1.Chip, { label: chip, compact: true, rounded: true }))), (0, mithril_1.default)(button_1.ButtonBar, {
                className: 'pf-track__buttons',
                // Block button clicks from hitting the shell's on click event
                onclick: (e) => e.stopPropagation(),
            }, buttons, 
            // Always render this one last
            attrs.error && renderCrashButton(attrs.error, attrs.pluginId)), attrs.subtitle &&
                !showSubtitleInContent(attrs) &&
                (0, mithril_1.default)('.pf-track__subtitle', (0, mithril_1.default)(middle_ellipsis_1.MiddleEllipsis, { text: attrs.subtitle }))));
    }
    renderContent(attrs) {
        const { onTrackContentMouseMove, onTrackContentMouseOut, onTrackContentClick, error, } = attrs;
        return (0, mithril_1.default)('.pf-track__canvas', {
            className: (0, classnames_1.classNames)(error && 'pf-track__canvas--error'),
            onmousemove: (e) => {
                e.redraw = false;
                onTrackContentMouseMove?.((0, dom_utils_1.currentTargetOffset)(e), getTargetContainerSize(e));
            },
            onmouseout: () => {
                onTrackContentMouseOut?.();
            },
            onmousedown: (e) => {
                this.mouseDownPos = (0, dom_utils_1.currentTargetOffset)(e);
            },
            onmouseup: (e) => {
                if (!this.mouseDownPos)
                    return;
                if (this.mouseDownPos.sub((0, dom_utils_1.currentTargetOffset)(e)).manhattanDistance > 1) {
                    this.selectionOccurred = true;
                }
                this.mouseDownPos = undefined;
            },
            onclick: (e) => {
                // This click event occurs after any selection mouse up/drag events
                // so we have to look if the mouse moved during this click to know
                // if a selection occurred.
                if (this.selectionOccurred) {
                    this.selectionOccurred = false;
                    return;
                }
                // Returns true if something was selected, so stop propagation.
                if (onTrackContentClick?.((0, dom_utils_1.currentTargetOffset)(e), getTargetContainerSize(e))) {
                    e.stopPropagation();
                }
            },
        }, attrs.subtitle &&
            showSubtitleInContent(attrs) &&
            (0, mithril_1.default)(middle_ellipsis_1.MiddleEllipsis, { text: attrs.subtitle }));
    }
}
exports.TrackShell = TrackShell;
function showSubtitleInContent(attrs) {
    return attrs.summary && !attrs.collapsed;
}
function getTargetContainerSize(event) {
    const target = event.target;
    return target.getBoundingClientRect();
}
function renderCrashButton(error, pluginId) {
    return (0, mithril_1.default)(popup_1.Popup, {
        trigger: (0, mithril_1.default)(button_1.Button, {
            icon: semantic_icons_1.Icons.Crashed,
            compact: true,
        }),
    }, (0, mithril_1.default)('.pf-track__crash-popup', (0, mithril_1.default)('span', 'This track has crashed.'), pluginId && (0, mithril_1.default)('span', `Owning plugin: ${pluginId}`), (0, mithril_1.default)(button_1.Button, {
        label: 'View & Report Crash',
        intent: common_1.Intent.Primary,
        variant: button_1.ButtonVariant.Filled,
        className: popup_1.Popup.DISMISS_POPUP_GROUP_CLASS,
        onclick: () => {
            throw error;
        },
    })));
}
class TrackTitle {
    trash = new disposable_stack_1.DisposableStack();
    view({ attrs }) {
        return (0, mithril_1.default)(middle_ellipsis_1.MiddleEllipsis, {
            className: 'pf-track__title',
            text: attrs.title,
        }, (0, mithril_1.default)('.pf-track__title-popup', attrs.title));
    }
    oncreate({ dom }) {
        const title = dom;
        const popup = (0, logging_1.assertExists)(dom.querySelector('.pf-track__title-popup'));
        const resizeObserver = new ResizeObserver(() => {
            // Determine whether to display a title popup based on ellipsization
            if (popup.clientWidth > title.clientWidth) {
                popup.classList.add('pf-track__title-popup--visible');
            }
            else {
                popup.classList.remove('pf-track__title-popup--visible');
            }
        });
        resizeObserver.observe(title);
        resizeObserver.observe(popup);
        this.trash.defer(() => resizeObserver.disconnect());
    }
    onremove() {
        this.trash.dispose();
    }
}
//# sourceMappingURL=track_shell.js.map