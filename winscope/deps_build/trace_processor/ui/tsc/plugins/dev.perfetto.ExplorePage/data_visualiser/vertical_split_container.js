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
exports.VerticalSplitContainer = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const disposable_stack_1 = require("../../../base/disposable_stack");
const drag_gesture_handler_1 = require("../../../base/drag_gesture_handler");
const logging_1 = require("../../../base/logging");
class VerticalSplitContainer {
    // Note: For BEM class names (https://getbem.com/)
    leftPaneClassName = '.pf-vertical-split-container__left-pane';
    leftPaneResizeHandle = this.leftPaneClassName + '__resize-handle';
    rightPaneClassName = '.pf-vertical-split-container__right-pane';
    trash = new disposable_stack_1.DisposableStack();
    leftPaneWidth = 0;
    rightPaneWidth = 0;
    oncreate({ dom }) {
        const leftPane = (0, logging_1.assertExists)(dom.querySelector(this.leftPaneClassName));
        const rightPane = (0, logging_1.assertExists)(dom.querySelector(this.rightPaneClassName));
        this.trash.use(new drag_gesture_handler_1.DragGestureHandler((0, logging_1.assertExists)(dom.querySelector(this.leftPaneResizeHandle)), 
        /* onDrag */
        (x, _y) => {
            leftPane.style.width = `${this.leftPaneWidth + x}px`;
            rightPane.style.width = `${this.rightPaneWidth - x}px`;
        }, 
        /* onDragStarted */
        () => {
            this.leftPaneWidth = leftPane.clientWidth;
        }, 
        /* onDragFinished */
        () => { }));
    }
    onremove() {
        this.trash.dispose();
    }
    view({ attrs }) {
        return (0, mithril_1.default)('.pf-vertical-split-container', (0, mithril_1.default)(this.leftPaneClassName, (0, mithril_1.default)(this.leftPaneClassName + '__content', attrs.leftPane), (0, mithril_1.default)(this.leftPaneResizeHandle)), (0, mithril_1.default)(this.rightPaneClassName, attrs.rightPane));
    }
}
exports.VerticalSplitContainer = VerticalSplitContainer;
//# sourceMappingURL=vertical_split_container.js.map