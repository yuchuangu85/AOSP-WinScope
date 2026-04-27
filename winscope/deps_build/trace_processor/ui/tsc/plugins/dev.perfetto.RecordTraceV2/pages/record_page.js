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
exports.RecordPageV2 = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const icon_1 = require("../../../widgets/icon");
const config_interfaces_1 = require("../config/config_interfaces");
const probe_renderer_1 = require("./probe_renderer");
const button_1 = require("../../../widgets/button");
const classnames_1 = require("../../../base/classnames");
const modal_1 = require("../../../widgets/modal");
const gcs_uploader_1 = require("../../../base/gcs_uploader");
const utils_1 = require("../../../base/utils");
const config_sharing_1 = require("../config/config_sharing");
const callout_1 = require("../../../widgets/callout");
const common_1 = require("../../../widgets/common");
const semantic_icons_1 = require("../../../base/semantic_icons");
const stack_1 = require("../../../widgets/stack");
const anchor_1 = require("../../../widgets/anchor");
const DEFAULT_SUBPAGE = 'target';
const PERSIST_EVERY_MS = 1000;
class RecordPageV2 {
    recMgr;
    subpage = DEFAULT_SUBPAGE;
    persistTimer = undefined;
    constructor({ attrs }) {
        this.recMgr = attrs.getRecordingManager();
        if (attrs.subpage && attrs.subpage.startsWith('/' + config_sharing_1.SHARE_SUBPAGE)) {
            this.loadShared(attrs.subpage.substring(config_sharing_1.SHARE_SUBPAGE.length + 2));
        }
    }
    view({ attrs }) {
        if (this.persistTimer === undefined) {
            this.persistTimer = window.setTimeout(() => {
                this.recMgr.persistIntoLocalStorage();
                this.persistTimer = undefined;
            }, PERSIST_EVERY_MS);
        }
        this.subpage =
            (0, utils_1.exists)(attrs.subpage) && attrs.subpage.length > 0
                ? attrs.subpage.substring(1)
                : DEFAULT_SUBPAGE;
        const cmdlineUrl = 'https://perfetto.dev/docs/quickstart/android-tracing#perfetto-cmdline';
        return (0, mithril_1.default)('.pf-record-page', (0, mithril_1.default)(stack_1.Stack, { className: 'pf-record-page__container' }, this.recMgr.recordConfig.traceConfig.mode === 'LONG_TRACE' &&
            (0, mithril_1.default)(callout_1.Callout, { intent: common_1.Intent.Warning, icon: semantic_icons_1.Icons.Warning }, `
              Recording in long trace mode through the UI is not supported.
              Please copy the command and `, (0, mithril_1.default)(anchor_1.Anchor, { href: cmdlineUrl, target: '_blank' }, `collect the trace using ADB.`)), (0, mithril_1.default)('.pf-record-page__container-content', this.renderMenu(), //
        this.renderSubPage())));
    }
    onremove() {
        window.clearTimeout(this.persistTimer);
        this.recMgr.persistIntoLocalStorage();
    }
    renderSubPage() {
        const page = this.recMgr.pages.get(this.subpage);
        if (page === undefined) {
            return (0, mithril_1.default)('.pf-record-page__section.active', (0, mithril_1.default)('header', `Invalid subpage /record/${this.subpage}`));
        }
        return [
            (0, mithril_1.default)('.pf-record-page__section.active', { id: page.id, key: page.id }, this.renderSubpage(page)),
        ];
    }
    renderSubpage(page) {
        switch (page.kind) {
            case 'PROBES_PAGE':
                return page.probes
                    .filter((p) => (0, config_interfaces_1.supportsPlatform)(p, this.recMgr.currentPlatform))
                    .map((probe) => (0, mithril_1.default)(probe_renderer_1.Probe, { cfgMgr: this.recMgr.recordConfig, probe }));
            case 'GLOBAL_PAGE':
            case 'SESSION_PAGE':
                return page.render();
        }
    }
    renderMenu() {
        const pages = Array.from(this.recMgr.pages.values());
        return (0, mithril_1.default)('.pf-record-page__menu', (0, mithril_1.default)(RecordingCtl, { recMgr: this.recMgr }), (0, mithril_1.default)('header', 'Record settings', (0, mithril_1.default)(button_1.Button, {
            icon: 'share',
            title: 'Share current config',
            onclick: () => (0, config_sharing_1.shareRecordConfig)(this.recMgr.serializeSession()),
        })), (0, mithril_1.default)('ul', pages
            .filter((p) => ['SESSION_PAGE', 'GLOBAL_PAGE'].includes(p.kind))
            .map((rc) => this.renderMenuEntry(rc))), (0, mithril_1.default)('header', 'Probes', (0, mithril_1.default)(button_1.Button, {
            icon: 'delete_sweep',
            title: 'Clear current configuration',
            onclick: () => {
                if (confirm('The current config will be cleared. Are you sure?')) {
                    this.recMgr.clearSession();
                }
            },
        })), (0, mithril_1.default)('ul', pages
            .filter((p) => p.kind === 'PROBES_PAGE')
            .map((rc) => this.renderMenuEntry(rc))));
    }
    renderMenuEntry(rc) {
        let enabledProbes = 0;
        let availProbes = 0;
        let probeCountTxt = '';
        const probePage = this.recMgr.pages.get(rc.id);
        if (probePage?.kind === 'PROBES_PAGE') {
            for (const probe of probePage.probes) {
                if (!(0, config_interfaces_1.supportsPlatform)(probe, this.recMgr.currentPlatform))
                    continue;
                ++availProbes;
                if (!this.recMgr.recordConfig.isProbeEnabled(probe.id))
                    continue;
                ++enabledProbes;
            }
            probeCountTxt = `${enabledProbes > 0 ? enabledProbes : ''}`;
        }
        const disabled = availProbes === 0 && probePage?.kind === 'PROBES_PAGE';
        const className = (0, classnames_1.classNames)(this.subpage === rc.id && 'active', disabled && 'disabled');
        return (0, mithril_1.default)('a', { href: disabled ? undefined : `#!/record/${rc.id}` }, (0, mithril_1.default)('li', { className }, (0, mithril_1.default)(icon_1.Icon, { icon: rc.icon }), (0, mithril_1.default)('.title', rc.title, (0, mithril_1.default)('.probe-count', probeCountTxt)), (0, mithril_1.default)('.sub', rc.subtitle)));
    }
    async loadShared(hash) {
        const url = `https://storage.googleapis.com/${gcs_uploader_1.BUCKET_NAME}/${hash}`;
        const fetchData = await fetch(url);
        const json = await fetchData.text();
        const res = this.recMgr.restoreSessionFromJson(json);
        if (!res.ok) {
            (0, modal_1.showModal)({ title: 'Restore error', content: res.error });
            return;
        }
        this.recMgr.app.navigate('#!/record/cmdline');
    }
}
exports.RecordPageV2 = RecordPageV2;
class RecordingCtl {
    recMgr;
    lastTarget;
    constructor({ attrs }) {
        this.recMgr = attrs.recMgr;
    }
    view() {
        const target = this.recMgr.currentTarget;
        if (this.lastTarget !== target) {
            this.lastTarget = target;
        }
        const currentSession = this.recMgr.currentSession;
        const recordingInProgress = currentSession?.inProgress;
        if (recordingInProgress) {
            // Update the ETA if the recording is in progress.
            setTimeout(() => mithril_1.default.redraw(), 1000);
        }
        const eta = currentSession?.eta;
        return (0, mithril_1.default)('.record-ctl', (0, mithril_1.default)(button_1.Button, {
            icon: 'cable',
            title: 'Click to select another target',
            onclick: () => this.recMgr.app.navigate('#!/record/target'),
        }), (0, mithril_1.default)('.record-target', recordingInProgress
            ? `Recording${eta ? ', ETA ' + eta : ''}`
            : target?.name ?? 'No target selected'), recordingInProgress
            ? (0, mithril_1.default)(button_1.Button, {
                icon: 'stop',
                disabled: currentSession.state !== 'RECORDING',
                iconFilled: true,
                title: 'Stop',
                className: 'rec',
                onclick: () => {
                    currentSession.session?.stop();
                    this.recMgr.app.navigate('#!/record/target');
                },
            })
            : (0, mithril_1.default)(button_1.Button, {
                icon: 'not_started',
                disabled: target === undefined ||
                    this.recMgr.recordConfig.traceConfig.mode === 'LONG_TRACE',
                iconFilled: true,
                title: 'Start tracing',
                className: 'rec',
                onclick: () => {
                    this.recMgr.startTracing();
                    this.recMgr.app.navigate('#!/record/target');
                },
            }));
    }
}
//# sourceMappingURL=record_page.js.map