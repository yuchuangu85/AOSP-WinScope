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
const async_lazy_1 = require("./async_lazy");
const deferred_1 = require("./deferred");
const result_1 = require("./result");
async function slowFactory(res) {
    const barrier = (0, deferred_1.defer)();
    setTimeout(() => barrier.resolve(), 0);
    await barrier;
    return isFinite(res) ? (0, result_1.okResult)(res) : (0, result_1.errResult)(`${res} is not a number`);
}
test('AsyncLazy', async () => {
    const alazy = new async_lazy_1.AsyncLazy();
    expect(alazy.value).toBeUndefined();
    // Failures during creation should not be cached.
    expect(await alazy.getOrCreate(() => slowFactory(NaN))).toEqual((0, result_1.errResult)('NaN is not a number'));
    expect(await alazy.getOrCreate(() => slowFactory(1 / 0))).toEqual((0, result_1.errResult)('Infinity is not a number'));
    const promises = [
        alazy.getOrCreate(() => slowFactory(42)),
        alazy.getOrCreate(() => slowFactory(1)),
        alazy.getOrCreate(() => slowFactory(2)),
    ];
    // Only the first promise will determine the result, which will be
    // subsequently cached.
    expect(await Promise.all(promises)).toEqual([
        (0, result_1.okResult)(42),
        (0, result_1.okResult)(42),
        (0, result_1.okResult)(42),
    ]);
    expect(alazy.value).toEqual(42);
    alazy.reset();
    expect(await alazy.getOrCreate(() => slowFactory(99))).toEqual((0, result_1.okResult)(99));
});
//# sourceMappingURL=async_lazy_unittest.js.map