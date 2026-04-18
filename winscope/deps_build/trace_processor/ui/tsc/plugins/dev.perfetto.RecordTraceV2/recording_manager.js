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
exports.CurrentTracingSession = exports.RecordingManager = void 0;
const logging_1 = require("../../base/logging");
const result_1 = require("../../base/result");
const config_manager_1 = require("./config/config_manager");
const serialization_schema_1 = require("./serialization_schema");
const uuid_1 = require("../../base/uuid");
const time_1 = require("../../base/time");
const LOCALSTORAGE_KEY = 'recordPlugin';
class RecordingManager {
    app;
    pages = new Map();
    providers = new Array();
    platform = 'ANDROID';
    provider;
    target;
    _tracingSession;
    recordConfig = new config_manager_1.ConfigManager();
    autoOpenTraceWhenTracingEnds = true;
    constructor(app) {
        this.app = app;
    }
    registerPage(...pages) {
        for (const page of pages) {
            (0, logging_1.assertTrue)(!this.pages.has(page.id) || this.pages.get(page.id) === page);
            this.pages.set(page.id, page);
            if (page.kind === 'PROBES_PAGE') {
                this.recordConfig.registerProbes(page.probes);
            }
        }
    }
    registerProvider(provider) {
        (0, logging_1.assertFalse)(this.providers.includes(provider));
        this.providers.push(provider);
    }
    get currentPlatform() {
        return this.platform;
    }
    setPlatform(platform) {
        this.platform = platform;
        this.provider = undefined;
        this.target = undefined;
        // If there is only one provider for the platform, auto-select that.
        const filteredProviders = this.listProvidersForCurrentPlatform();
        if (filteredProviders.length === 1) {
            this.provider = filteredProviders[0];
        }
    }
    listProvidersForCurrentPlatform() {
        return this.providers.filter((p) => p.supportedPlatforms.includes(this.platform));
    }
    get currentProvider() {
        return this.provider;
    }
    getProvider(id) {
        return this.providers.find((p) => p.id === id);
    }
    async setProvider(provider) {
        if (!provider.supportedPlatforms.includes(this.currentPlatform)) {
            // This can happen if the promise that calls refreshTargets() completes
            // after the user has switched to a different platform.
            return;
        }
        this.provider = provider;
        const targets = await provider.listTargets(this.currentPlatform);
        if (this.target && targets.includes(this.target)) {
            return; // The currently selected target is still valid, retain it.
        }
        this.target = targets.length > 0 ? targets[0] : undefined;
        this.app.raf.scheduleFullRedraw();
    }
    async listTargets() {
        if (this.provider === undefined)
            return [];
        return await this.provider.listTargets(this.currentPlatform);
    }
    get currentSession() {
        return this._tracingSession;
    }
    setTarget(target) {
        this.target = target;
    }
    get currentTarget() {
        return this.target;
    }
    genTraceConfig() {
        return this.recordConfig.genTraceConfig(this.currentPlatform);
    }
    async startTracing() {
        if (this._tracingSession !== undefined) {
            this._tracingSession.session?.cancel();
            this._tracingSession = undefined;
        }
        const traceCfg = this.genTraceConfig();
        const wrappedSession = new CurrentTracingSession(this, traceCfg);
        this._tracingSession = wrappedSession;
        return wrappedSession;
    }
    serializeSession() {
        // Initialize with default values.
        const state = serialization_schema_1.RECORD_SESSION_SCHEMA.parse({});
        for (const page of this.pages.values()) {
            if (page.kind === 'SESSION_PAGE') {
                page.serialize(state);
            }
        }
        // Serialize the state of each probe page and their settings.
        state.probes = this.recordConfig.serializeProbes();
        return state;
    }
    loadSession(state) {
        for (const page of this.pages.values()) {
            if (page.kind === 'SESSION_PAGE') {
                page.deserialize(state);
            }
        }
        this.recordConfig.deserializeProbes(state.probes);
    }
    persistIntoLocalStorage() {
        const state = serialization_schema_1.RECORD_PLUGIN_SCHEMA.parse({});
        state.lastSession = this.serializeSession();
        for (const page of this.pages.values()) {
            if (page.kind === 'GLOBAL_PAGE') {
                page.serialize(state);
            }
        }
        const json = JSON.stringify(state);
        localStorage.setItem(LOCALSTORAGE_KEY, json);
    }
    restorePluginStateFromLocalstorage() {
        const stateJson = localStorage.getItem(LOCALSTORAGE_KEY) ?? '{}';
        let parsedJson;
        try {
            parsedJson = JSON.parse(stateJson);
        }
        catch (e) {
            console.error('Record plugin: JSON parse failed', e);
            parsedJson = {};
        }
        const res = serialization_schema_1.RECORD_PLUGIN_SCHEMA.safeParse(parsedJson);
        if (!res.success) {
            throw new Error('Record plugin: deserialization failed', res.error);
        }
        const state = res.data;
        for (const page of this.pages.values()) {
            if (page.kind === 'GLOBAL_PAGE') {
                page.deserialize(state);
            }
        }
        if (state.lastSession !== undefined) {
            this.loadSession(state.lastSession);
        }
    }
    restoreSessionFromJson(json) {
        let parsedJson;
        try {
            parsedJson = JSON.parse(json);
        }
        catch (e) {
            return (0, result_1.errResult)(`JSON parser error: ${e.message}`);
        }
        const res = serialization_schema_1.RECORD_SESSION_SCHEMA.safeParse(parsedJson);
        if (!res.success) {
            return (0, result_1.errResult)(`Deserialization error: ${res.error}`);
        }
        this.loadSession(res.data);
        return (0, result_1.okResult)(undefined);
    }
    clearSession() {
        const emptySession = serialization_schema_1.RECORD_SESSION_SCHEMA.parse({});
        return this.loadSession(emptySession);
    }
}
exports.RecordingManager = RecordingManager;
class CurrentTracingSession {
    error;
    session;
    uuid = (0, uuid_1.uuidv4)();
    fileName;
    isCompressed;
    _expectedEndTime;
    recMgr;
    autoOpenedTriggered = false;
    constructor(recMgr, traceCfg) {
        this.recMgr = recMgr;
        const now = new Date();
        const ymd = `${now.getFullYear()}${now.getMonth()}${now.getDay()}`;
        const hms = `${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
        const platLowerCase = recMgr.currentPlatform.toLowerCase();
        this.fileName = `${platLowerCase}-${ymd}-${hms}.pftrace`;
        this.isCompressed = traceCfg.compressionType !== 0;
        if (recMgr.currentTarget === undefined) {
            this.error = 'No target selected';
            return;
        }
        if (recMgr.currentTarget.emitsCompressedtrace) {
            this.fileName += '.gz';
            this.isCompressed = true;
        }
        this.start(traceCfg, recMgr.currentTarget);
    }
    async start(traceCfg, target) {
        const res = await target.startTracing(traceCfg);
        this.recMgr.app.raf.scheduleFullRedraw();
        if (!res.ok) {
            this.error = res.error;
            return;
        }
        const session = (this.session = res.value);
        if (traceCfg.durationMs > 0) {
            this._expectedEndTime = performance.now() + traceCfg.durationMs;
        }
        session.onSessionUpdate.addListener(() => {
            this.recMgr.app.raf.scheduleFullRedraw();
            if (session.state === 'FINISHED' &&
                this.recMgr.autoOpenTraceWhenTracingEnds &&
                !this.autoOpenedTriggered) {
                this.autoOpenedTriggered = true;
                this.openTrace();
            }
        });
    }
    get state() {
        if (this.error !== undefined) {
            return `Error: ${this.error}`;
        }
        if (this.session === undefined) {
            return 'Initializing';
        }
        return this.session.state;
    }
    get eta() {
        if (this._expectedEndTime === undefined)
            return undefined;
        let remainingMs = Math.max(this._expectedEndTime - performance.now(), 0);
        if (['FINISHED', 'ERRORED'].includes(this.session?.state ?? '')) {
            remainingMs = 0;
        }
        return new time_1.Timecode(time_1.Time.fromMillis(remainingMs)).dhhmmss;
    }
    openTrace() {
        const traceData = this.session?.getTraceData();
        if (traceData === undefined)
            return;
        this.recMgr.app.openTraceFromBuffer({
            buffer: traceData,
            title: this.fileName,
            fileName: this.fileName,
        });
    }
    get isCompleted() {
        return this.session?.state === 'FINISHED';
    }
    get inProgress() {
        return ((this.session === undefined && this.error === undefined) ||
            this.session?.state === 'RECORDING' ||
            this.session?.state === 'STOPPING');
    }
}
exports.CurrentTracingSession = CurrentTracingSession;
//# sourceMappingURL=recording_manager.js.map