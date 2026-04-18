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
exports.KeyboardNavigationHandler = exports.KeyMapping = void 0;
const disposable_stack_1 = require("../../base/disposable_stack");
const dom_utils_1 = require("../../base/dom_utils");
const animation_1 = require("../animation");
// When first starting to pan or zoom, move at least this many units.
const INITIAL_PAN_STEP_PX = 50;
const INITIAL_ZOOM_STEP = 0.1;
// The snappiness (spring constant) of pan and zoom animations [0..1].
const SNAP_FACTOR = 0.4;
// How much the velocity of a pan or zoom animation increases per millisecond.
const ACCELERATION_PER_MS = 1 / 50;
// The default duration of a pan or zoom animation. The animation may run longer
// if the user keeps holding the respective button down or shorter if the button
// is released. This value so chosen so that it is longer than the typical key
// repeat timeout to avoid breaks in the animation.
const DEFAULT_ANIMATION_DURATION = 700;
// The minimum number of units to pan or zoom per frame (before the
// ACCELERATION_PER_MS multiplier is applied).
const ZOOM_RATIO_PER_FRAME = 0.008;
const KEYBOARD_PAN_PX_PER_FRAME = 8;
// Use key mapping based on the 'KeyboardEvent.code' property vs the
// 'KeyboardEvent.key', because the former corresponds to the physical key
// position rather than the glyph printed on top of it, and is unaffected by
// the user's keyboard layout.
// For example, 'KeyW' always corresponds to the key at the physical location of
// the 'w' key on an English QWERTY keyboard, regardless of the user's keyboard
// layout, or at least the layout they have configured in their OS.
// Seeing as most users use the keys in the English QWERTY "WASD" position for
// controlling kb+mouse applications like games, it's a good bet that these are
// the keys most poeple are going to find natural for navigating the UI.
// See https://www.w3.org/TR/uievents-code/#key-alphanumeric-writing-system
var KeyMapping;
(function (KeyMapping) {
    KeyMapping["KEY_PAN_LEFT"] = "KeyA";
    KeyMapping["KEY_PAN_RIGHT"] = "KeyD";
    KeyMapping["KEY_ZOOM_IN"] = "KeyW";
    KeyMapping["KEY_ZOOM_OUT"] = "KeyS";
})(KeyMapping || (exports.KeyMapping = KeyMapping = {}));
var Pan;
(function (Pan) {
    Pan[Pan["None"] = 0] = "None";
    Pan[Pan["Left"] = -1] = "Left";
    Pan[Pan["Right"] = 1] = "Right";
})(Pan || (Pan = {}));
function keyToPan(e) {
    if (e.code === KeyMapping.KEY_PAN_LEFT)
        return Pan.Left;
    if (e.code === KeyMapping.KEY_PAN_RIGHT)
        return Pan.Right;
    return Pan.None;
}
var Zoom;
(function (Zoom) {
    Zoom[Zoom["None"] = 0] = "None";
    Zoom[Zoom["In"] = 1] = "In";
    Zoom[Zoom["Out"] = -1] = "Out";
})(Zoom || (Zoom = {}));
function keyToZoom(e) {
    if (e.code === KeyMapping.KEY_ZOOM_IN)
        return Zoom.In;
    if (e.code === KeyMapping.KEY_ZOOM_OUT)
        return Zoom.Out;
    return Zoom.None;
}
/**
 * Enables horizontal pan and zoom with WASD navigation.
 */
class KeyboardNavigationHandler {
    mousePositionX = null;
    boundOnMouseMove = this.onMouseMove.bind(this);
    boundOnKeyDown = this.onKeyDown.bind(this);
    boundOnKeyUp = this.onKeyUp.bind(this);
    panning = Pan.None;
    panOffsetPx = 0;
    targetPanOffsetPx = 0;
    zooming = Zoom.None;
    zoomRatio = 0;
    targetZoomRatio = 0;
    panAnimation = new animation_1.Animation(this.onPanAnimationStep.bind(this));
    zoomAnimation = new animation_1.Animation(this.onZoomAnimationStep.bind(this));
    element;
    onPanned;
    onZoomed;
    trash;
    constructor({ element, onPanned, onZoomed, }) {
        this.element = element;
        this.onPanned = onPanned;
        this.onZoomed = onZoomed;
        this.trash = new disposable_stack_1.DisposableStack();
        document.body.addEventListener('keydown', this.boundOnKeyDown);
        document.body.addEventListener('keyup', this.boundOnKeyUp);
        this.element.addEventListener('mousemove', this.boundOnMouseMove);
        this.trash.defer(() => {
            this.element.removeEventListener('mousemove', this.boundOnMouseMove);
            document.body.removeEventListener('keyup', this.boundOnKeyUp);
            document.body.removeEventListener('keydown', this.boundOnKeyDown);
        });
    }
    [Symbol.dispose]() {
        this.trash.dispose();
    }
    onPanAnimationStep(msSinceStartOfAnimation) {
        const step = (this.targetPanOffsetPx - this.panOffsetPx) * SNAP_FACTOR;
        if (this.panning !== Pan.None) {
            const velocity = 1 + msSinceStartOfAnimation * ACCELERATION_PER_MS;
            // Pan at least as fast as the snapping animation to avoid a
            // discontinuity.
            const targetStep = Math.max(KEYBOARD_PAN_PX_PER_FRAME * velocity, step);
            this.targetPanOffsetPx += this.panning * targetStep;
        }
        this.panOffsetPx += step;
        if (Math.abs(step) > 1e-1) {
            this.onPanned(step);
        }
        else {
            this.panAnimation.stop();
        }
    }
    onZoomAnimationStep(msSinceStartOfAnimation) {
        if (this.mousePositionX === null)
            return;
        const step = (this.targetZoomRatio - this.zoomRatio) * SNAP_FACTOR;
        if (this.zooming !== Zoom.None) {
            const velocity = 1 + msSinceStartOfAnimation * ACCELERATION_PER_MS;
            // Zoom at least as fast as the snapping animation to avoid a
            // discontinuity.
            const targetStep = Math.max(ZOOM_RATIO_PER_FRAME * velocity, step);
            this.targetZoomRatio += this.zooming * targetStep;
        }
        this.zoomRatio += step;
        if (Math.abs(step) > 1e-6) {
            this.onZoomed(this.mousePositionX, step);
        }
        else {
            this.zoomAnimation.stop();
        }
    }
    onMouseMove(e) {
        this.mousePositionX = (0, dom_utils_1.currentTargetOffset)(e).x;
    }
    // Due to a bug in chrome, we get onKeyDown events fired where the payload is
    // not a KeyboardEvent when selecting an item from an autocomplete suggestion.
    // See https://issues.chromium.org/issues/41425904
    // Thus, we can't assume we get an KeyboardEvent and must check manually.
    onKeyDown(e) {
        if (e instanceof KeyboardEvent) {
            if ((0, dom_utils_1.elementIsEditable)(e.target))
                return;
            if (e.ctrlKey || e.metaKey)
                return;
            if (keyToPan(e) !== Pan.None) {
                if (this.panning !== keyToPan(e)) {
                    this.panAnimation.stop();
                    this.panOffsetPx = 0;
                    this.targetPanOffsetPx = keyToPan(e) * INITIAL_PAN_STEP_PX;
                }
                this.panning = keyToPan(e);
                this.panAnimation.start(DEFAULT_ANIMATION_DURATION);
            }
            if (keyToZoom(e) !== Zoom.None) {
                if (this.zooming !== keyToZoom(e)) {
                    this.zoomAnimation.stop();
                    this.zoomRatio = 0;
                    this.targetZoomRatio = keyToZoom(e) * INITIAL_ZOOM_STEP;
                }
                this.zooming = keyToZoom(e);
                this.zoomAnimation.start(DEFAULT_ANIMATION_DURATION);
            }
        }
    }
    onKeyUp(e) {
        if (e instanceof KeyboardEvent) {
            if (e.ctrlKey || e.metaKey)
                return;
            if (keyToPan(e) === this.panning) {
                this.panning = Pan.None;
            }
            if (keyToZoom(e) === this.zooming) {
                this.zooming = Zoom.None;
            }
        }
    }
}
exports.KeyboardNavigationHandler = KeyboardNavigationHandler;
//# sourceMappingURL=wasd_navigation_handler.js.map