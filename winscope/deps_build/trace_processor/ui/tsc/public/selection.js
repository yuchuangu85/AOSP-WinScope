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
exports.areaSelectionsEqual = areaSelectionsEqual;
const array_utils_1 = require("../base/array_utils");
/**
 * Compare two area selections for equality. Returns true if the selections are
 * equivalent, false otherwise.
 */
function areaSelectionsEqual(a, b) {
    if (a.start !== b.start)
        return false;
    if (a.end !== b.end)
        return false;
    if (!(0, array_utils_1.arrayEquals)(a.trackUris, b.trackUris)) {
        return false;
    }
    return true;
}
//# sourceMappingURL=selection.js.map