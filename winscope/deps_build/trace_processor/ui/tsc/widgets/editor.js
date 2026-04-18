"use strict";
// Copyright (C) 2023 The Android Open Source Project
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
exports.Editor = void 0;
const tslib_1 = require("tslib");
const commands_1 = require("@codemirror/commands");
const theme_one_dark_1 = require("@codemirror/theme-one-dark");
const view_1 = require("@codemirror/view");
const codemirror_1 = require("codemirror");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const logging_1 = require("../base/logging");
const drag_gesture_handler_1 = require("../base/drag_gesture_handler");
const disposable_stack_1 = require("../base/disposable_stack");
const language_1 = require("../base/perfetto_sql_lang/language");
const array_utils_1 = require("../base/array_utils");
class Editor {
    editorView;
    generation;
    trash = new disposable_stack_1.DisposableStack();
    oncreate({ dom, attrs }) {
        const keymaps = [commands_1.indentWithTab];
        const onExecute = attrs.onExecute;
        const onUpdate = attrs.onUpdate;
        if (onExecute) {
            keymaps.push({
                key: 'Mod-Enter',
                run: (view) => {
                    const state = view.state;
                    const selection = state.selection;
                    let text = state.doc.toString();
                    if (!selection.main.empty) {
                        let selectedText = '';
                        for (const r of selection.ranges) {
                            selectedText += text.slice(r.from, r.to);
                        }
                        text = selectedText;
                    }
                    onExecute(text);
                    mithril_1.default.redraw();
                    return true;
                },
            });
        }
        let dispatch;
        if (onUpdate) {
            dispatch = (tr, view) => {
                view.update([tr]);
                const text = view.state.doc.toString();
                onUpdate(text);
                mithril_1.default.redraw();
            };
        }
        this.generation = attrs.generation;
        const lang = (() => {
            switch (attrs.language) {
                case undefined:
                    return undefined;
                case 'perfetto-sql':
                    return (0, language_1.perfettoSql)();
                default:
                    (0, logging_1.assertUnreachable)(attrs.language);
            }
        })();
        this.editorView = new codemirror_1.EditorView({
            doc: attrs.initialText ?? '',
            extensions: (0, array_utils_1.removeFalsyValues)([
                view_1.keymap.of(keymaps),
                theme_one_dark_1.oneDark,
                codemirror_1.basicSetup,
                lang,
            ]),
            parent: dom,
            dispatch,
        });
        // Install the drag handler for the resize bar.
        let initialH = 0;
        this.trash.use(new drag_gesture_handler_1.DragGestureHandler((0, logging_1.assertExists)(dom.querySelector('.resize-handler')), 
        /* onDrag */
        (_x, y) => (dom.style.height = `${initialH + y}px`), 
        /* onDragStarted */
        () => (initialH = dom.clientHeight), 
        /* onDragFinished */
        () => { }));
    }
    onupdate({ attrs }) {
        const { initialText, generation } = attrs;
        const editorView = this.editorView;
        if (editorView && this.generation !== generation) {
            const state = editorView.state;
            editorView.dispatch(state.update({
                changes: { from: 0, to: state.doc.length, insert: initialText },
            }));
            this.generation = generation;
        }
    }
    onremove() {
        if (this.editorView) {
            this.editorView.destroy();
            this.editorView = undefined;
        }
        this.trash.dispose();
    }
    view({}) {
        return (0, mithril_1.default)('.pf-editor', (0, mithril_1.default)('.resize-handler'));
    }
}
exports.Editor = Editor;
//# sourceMappingURL=editor.js.map