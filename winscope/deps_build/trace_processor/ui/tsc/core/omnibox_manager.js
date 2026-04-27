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
exports.OmniboxManagerImpl = exports.OmniboxMode = void 0;
const raf_scheduler_1 = require("./raf_scheduler");
var OmniboxMode;
(function (OmniboxMode) {
    OmniboxMode[OmniboxMode["Search"] = 0] = "Search";
    OmniboxMode[OmniboxMode["Query"] = 1] = "Query";
    OmniboxMode[OmniboxMode["Command"] = 2] = "Command";
    OmniboxMode[OmniboxMode["Prompt"] = 3] = "Prompt";
})(OmniboxMode || (exports.OmniboxMode = OmniboxMode = {}));
const defaultMode = OmniboxMode.Search;
class OmniboxManagerImpl {
    _mode = defaultMode;
    _focusOmniboxNextRender = false;
    _pendingCursorPlacement;
    _pendingPrompt;
    _omniboxSelectionIndex = 0;
    _forceShortTextSearch = false;
    _text = '';
    _statusMessageContainer = {};
    _promptsDisabled = false;
    get mode() {
        return this._mode;
    }
    get pendingPrompt() {
        return this._pendingPrompt;
    }
    get text() {
        return this._text;
    }
    get selectionIndex() {
        return this._omniboxSelectionIndex;
    }
    get focusOmniboxNextRender() {
        return this._focusOmniboxNextRender;
    }
    get pendingCursorPlacement() {
        return this._pendingCursorPlacement;
    }
    get forceShortTextSearch() {
        return this._forceShortTextSearch;
    }
    setText(value) {
        this._text = value;
    }
    setSelectionIndex(index) {
        this._omniboxSelectionIndex = index;
    }
    focus(cursorPlacement) {
        this._focusOmniboxNextRender = true;
        this._pendingCursorPlacement = cursorPlacement;
    }
    clearFocusFlag() {
        this._focusOmniboxNextRender = false;
        this._pendingCursorPlacement = undefined;
    }
    setMode(mode, focus = true) {
        this._mode = mode;
        this._focusOmniboxNextRender = focus;
        this._omniboxSelectionIndex = 0;
        this._text = '';
        this.rejectPendingPrompt();
    }
    showStatusMessage(msg, durationMs = 2000) {
        const statusMessageContainer = { msg };
        if (durationMs > 0) {
            setTimeout(() => {
                statusMessageContainer.msg = undefined;
                raf_scheduler_1.raf.scheduleFullRedraw();
            }, durationMs);
        }
        this._statusMessageContainer = statusMessageContainer;
    }
    get statusMessage() {
        return this._statusMessageContainer.msg;
    }
    prompt(text, choicesOrDefaultValue) {
        if (this._promptsDisabled) {
            return Promise.resolve(undefined);
        }
        this._mode = OmniboxMode.Prompt;
        this._omniboxSelectionIndex = 0;
        this.rejectPendingPrompt();
        this._focusOmniboxNextRender = true;
        // Handle PromptChoices<T> case
        if (choicesOrDefaultValue !== undefined &&
            typeof choicesOrDefaultValue === 'object' &&
            'getName' in choicesOrDefaultValue) {
            const choices = choicesOrDefaultValue;
            return new Promise((resolve) => {
                const choiceMap = new Map(choices.values.map((choice) => [choices.getName(choice), choice]));
                this._pendingPrompt = {
                    text,
                    options: Array.from(choiceMap.keys()).map((key) => ({
                        key,
                        displayName: key,
                    })),
                    resolve: (key) => resolve(choiceMap.get(key)),
                };
            });
        }
        // Handle ReadonlyArray<string> choices case
        if (choicesOrDefaultValue !== undefined &&
            Array.isArray(choicesOrDefaultValue)) {
            const choices = choicesOrDefaultValue;
            return new Promise((resolve) => {
                this._pendingPrompt = {
                    text,
                    options: choices.map((value) => ({ key: value, displayName: value })),
                    resolve,
                };
            });
        }
        // Handle free-form input (with or without default value)
        const defaultValue = typeof choicesOrDefaultValue === 'string'
            ? choicesOrDefaultValue
            : undefined;
        return new Promise((resolve) => {
            if (defaultValue !== undefined) {
                this.setText(defaultValue);
            }
            this._pendingPrompt = {
                text,
                resolve,
            };
        });
    }
    // Resolve the pending prompt with a value to return to the prompter.
    resolvePrompt(value) {
        if (this._pendingPrompt) {
            this._pendingPrompt.resolve(value);
            this._pendingPrompt = undefined;
        }
        this.setMode(OmniboxMode.Search);
    }
    // Reject the prompt outright. Doing this will force the owner of the prompt
    // promise to catch, so only do this when things go seriously wrong.
    // Use |resolvePrompt(null)| to indicate cancellation.
    rejectPrompt() {
        this.rejectPendingPrompt();
        this.setMode(OmniboxMode.Search);
    }
    reset(focus = true) {
        this.setMode(defaultMode, focus);
        this._omniboxSelectionIndex = 0;
        this._statusMessageContainer = {};
    }
    disablePrompts() {
        this._promptsDisabled = true;
        this.rejectPendingPrompt();
    }
    enablePrompts() {
        this._promptsDisabled = false;
    }
    rejectPendingPrompt() {
        if (this._pendingPrompt) {
            this._pendingPrompt.resolve(undefined);
            this._pendingPrompt = undefined;
        }
    }
}
exports.OmniboxManagerImpl = OmniboxManagerImpl;
//# sourceMappingURL=omnibox_manager.js.map