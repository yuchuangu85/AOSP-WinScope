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
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const dev_perfetto_SqlModules_1 = tslib_1.__importDefault(require("../dev.perfetto.SqlModules"));
const explore_page_1 = require("./explore_page");
class default_1 {
    static id = 'dev.perfetto.ExplorePage';
    static dependencies = [dev_perfetto_SqlModules_1.default];
    // The following allows us to have persistent
    // state/charts for the lifecycle of a single
    // trace.
    state = {
        mode: explore_page_1.ExplorePageModes.QUERY_BUILDER,
        rootNodes: [],
    };
    async onTraceLoad(trace) {
        trace.pages.registerPage({
            route: '/explore',
            page: {
                view: ({ attrs }) => (0, mithril_1.default)(explore_page_1.ExplorePage, {
                    ...attrs,
                    state: this.state,
                    sqlModulesPlugin: attrs.trace.plugins.getPlugin(dev_perfetto_SqlModules_1.default),
                }),
            },
        });
        trace.sidebar.addMenuItem({
            section: 'current_trace',
            text: 'Explore',
            href: '#!/explore',
            icon: 'data_exploration',
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map