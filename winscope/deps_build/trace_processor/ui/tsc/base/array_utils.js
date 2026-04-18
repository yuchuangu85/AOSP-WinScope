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
exports.range = range;
exports.allUnique = allUnique;
exports.arrayEquals = arrayEquals;
exports.isArrayOf = isArrayOf;
exports.removeFalsyValues = removeFalsyValues;
exports.moveArrayItem = moveArrayItem;
// A function similar to Python's `range`.
function range(n) {
    if (n < 0) {
        throw new Error('range size should be non-negative!');
    }
    const result = new Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = i;
    }
    return result;
}
// Checks whether all the strings in the array are unique.
function allUnique(x) {
    return x.length == new Set(x).size;
}
// Check whether two arrays are identical.
function arrayEquals(a, b) {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
function isArrayOf(predicate, xs) {
    return xs.every(predicate);
}
// Filter out falsy values from an array, leaving only the truthy ones
function removeFalsyValues(array) {
    return array.filter(Boolean);
}
// Move an item from a given index in the array (`from`) to a new index (`to`).
// `from`: index in the current array in [0, len(array) - 1] range.
// `to`: new location, in [0, len(array)] range. The element will be inserted
//       in the position before current element at `to` index.
function moveArrayItem(array, from, to) {
    if (from === to)
        return;
    const value = array[from];
    array.splice(from, 1);
    if (from < to) {
        // We have deleted an item, therefore we need to adjust the target index.
        --to;
    }
    array.splice(to, 0, value);
}
//# sourceMappingURL=array_utils.js.map