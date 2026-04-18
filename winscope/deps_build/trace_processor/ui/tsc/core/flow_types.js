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
exports.ALL_CATEGORIES = void 0;
exports.getFlowCategories = getFlowCategories;
exports.ALL_CATEGORIES = '_all_';
function getFlowCategories(flow) {
    const categories = [];
    // v1 flows have their own categories
    if (flow.category) {
        categories.push(...flow.category.split(','));
        return categories;
    }
    const beginCats = flow.begin.sliceCategory.split(',');
    const endCats = flow.end.sliceCategory.split(',');
    categories.push(...new Set([...beginCats, ...endCats]));
    return categories;
}
//# sourceMappingURL=flow_types.js.map