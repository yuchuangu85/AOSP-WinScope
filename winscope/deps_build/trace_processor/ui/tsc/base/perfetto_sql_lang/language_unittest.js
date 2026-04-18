"use strict";
// Copyright (C) 2025 The Android Open Source Project
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
const language_js_1 = require("./language.js");
// Helper function to pretty-print the CST
function printCST(cursor, source, indent = 0) {
    const nodeName = cursor.name;
    const nodeText = source.substring(cursor.from, cursor.to);
    console.log(`${'  '.repeat(indent)}${nodeName}: "${nodeText}"`);
    if (cursor.firstChild()) {
        do {
            printCST(cursor, source, indent + 1);
        } while (cursor.nextSibling());
        cursor.parent(); // Important: Move back up to the parent
    }
}
describe('perfettoSqlLang', () => {
    test('simple', () => {
        const code = 'select * from slice limit 100';
        const tree = language_js_1.language.parser.parse(code);
        const cursor = tree.cursor();
        const spec = ['Keyword', 'identifier', 'Keyword', 'identifier'];
        console.log(printCST(cursor, code), spec);
    });
});
//# sourceMappingURL=language_unittest.js.map