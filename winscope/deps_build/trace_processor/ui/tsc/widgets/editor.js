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
const array_utils_1 = require("../base/array_utils");
const logging_1 = require("../base/logging");
const language_1 = require("../base/perfetto_sql_lang/language");
class Editor {
    editorView;
    latestText;
    focus() {
        this.editorView?.focus();
    }
    oncreate({ dom, attrs }) {
        const keymaps = [commands_1.indentWithTab];
        const onExecute = attrs.onExecute;
        const onSave = attrs.onSave;
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
        if (onSave) {
            keymaps.push({
                key: 'Mod-s',
                run: (_view) => {
                    onSave();
                    mithril_1.default.redraw();
                    return true;
                },
            });
        }
        const dispatch = (tr, view) => {
            // Maybe don't bother doing this if onUpdate is not defined...?
            view.update([tr]);
            const text = view.state.doc.toString();
            // Cache the latest text so that we don't immediately have to overwrite
            // this every time we make an edit to the doc if the caller just passes in
            // the exact same string again on the next redraw.
            this.latestText = text;
            if (onUpdate) {
                onUpdate(text);
                mithril_1.default.redraw();
            }
        };
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
            doc: attrs.text,
            extensions: (0, array_utils_1.removeFalsyValues)([
                view_1.keymap.of(keymaps),
                theme_one_dark_1.oneDark,
                codemirror_1.basicSetup,
                lang,
            ]),
            parent: dom,
            dispatch,
        });
        if (attrs.autofocus) {
            this.focus();
        }
    }
    onupdate({ attrs }) {
        // Uncontrolled mode: no need to do anything.
        if (attrs.text === undefined) {
            return;
        }
        const editorView = this.editorView;
        if (editorView && attrs.text !== this.latestText) {
            const state = editorView.state;
            editorView.dispatch(state.update({
                changes: { from: 0, to: state.doc.length, insert: attrs.text },
            }));
            this.latestText = attrs.text;
        }
    }
    onremove() {
        if (this.editorView) {
            this.editorView.destroy();
            this.editorView = undefined;
        }
    }
    view({ attrs }) {
        return (0, mithril_1.default)('.pf-editor', {
            className: attrs.className,
            ref: attrs.ref,
        });
    }
}
exports.Editor = Editor;
//# sourceMappingURL=editor.js.map