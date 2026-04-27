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
exports.PageManagerImpl = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const logging_1 = require("../base/logging");
const registry_1 = require("../base/registry");
const router_1 = require("./router");
const mithril_utils_1 = require("../base/mithril_utils");
class PageManagerImpl {
    registry = new registry_1.Registry((x) => x.route);
    previousPages = new Map();
    registerPage(pageHandler) {
        (0, logging_1.assertTrue)(/^\/\w*$/.exec(pageHandler.route) !== null);
        // The pluginId is injected by the proxy in AppImpl / TraceImpl. If this is
        // undefined somebody (tests) managed to call this method without proxy.
        (0, logging_1.assertExists)(pageHandler.pluginId);
        return this.registry.register(pageHandler);
    }
    // Called by index.ts upon the main frame redraw callback.
    renderPageForCurrentRoute() {
        const route = router_1.Router.parseFragment(location.hash);
        this.previousPages.set(route.page, {
            page: route.page,
            subpage: route.subpage,
        });
        // Render all pages, but display all inactive pages with display: none and
        // avoid calling their view functions. This makes sure DOM state such as
        // scrolling position is retained between page flips, which can be handy
        // when quickly switching between pages that have long scrolling content
        // such as the viewer page.
        return Array.from(this.previousPages.entries())
            .map(([key, { page, subpage }]) => {
            const maybeRenderedPage = this.renderPageForRoute(page, subpage);
            // If either the route doesn't exist or requires a trace but the trace
            // is not loaded, fall back on the default route.
            const renderedPage = maybeRenderedPage ?? (0, logging_1.assertExists)(this.renderPageForRoute('/', ''));
            return [key, renderedPage];
        })
            .map(([key, page]) => {
            return (0, mithril_1.default)(mithril_utils_1.Gate, { open: key === route.page }, page);
        });
    }
    // Will return undefined if either: (1) the route does not exist; (2) the
    // route exists, it requires a trace, but there is no trace loaded.
    renderPageForRoute(page, subpage) {
        const handler = this.registry.tryGet(page);
        if (handler === undefined) {
            return undefined;
        }
        return handler.render(subpage);
    }
}
exports.PageManagerImpl = PageManagerImpl;
//# sourceMappingURL=page_manager.js.map