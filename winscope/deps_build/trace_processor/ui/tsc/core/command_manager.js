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
exports.CommandManagerImpl = exports.commandInvocationArraySchema = exports.commandInvocationSchema = void 0;
exports.parseUrlCommands = parseUrlCommands;
const zod_1 = require("zod");
const fuzzy_1 = require("../base/fuzzy");
const registry_1 = require("../base/registry");
const raf_scheduler_1 = require("./raf_scheduler");
/**
 * Zod schema for a single command invocation.
 * Used for programmatic command execution like startup commands.
 */
exports.commandInvocationSchema = zod_1.z.object({
    /** The command ID to execute (e.g., 'perfetto.CoreCommands#RunQueryAllProcesses'). */
    id: zod_1.z.string(),
    /** Arguments to pass to the command. */
    args: zod_1.z.array(zod_1.z.string()),
});
/**
 * Zod schema for validating CommandInvocation arrays.
 * Used by settings that store lists of commands to execute.
 */
exports.commandInvocationArraySchema = zod_1.z.array(exports.commandInvocationSchema);
/**
 * Parses URL commands parameter from route args.
 * @param commandsParam URL commands parameter (JSON-encoded string)
 * @returns Parsed commands array or undefined if parsing fails
 */
function parseUrlCommands(commandsParam) {
    if (!commandsParam) {
        return undefined;
    }
    try {
        const parsed = JSON.parse(commandsParam);
        return exports.commandInvocationArraySchema.parse(parsed);
    }
    catch {
        return undefined;
    }
}
class CommandManagerImpl {
    registry = new registry_1.Registry((cmd) => cmd.id);
    getCommand(commandId) {
        return this.registry.get(commandId);
    }
    hasCommand(commandId) {
        return this.registry.has(commandId);
    }
    get commands() {
        return Array.from(this.registry.values());
    }
    registerCommand(cmd) {
        return this.registry.register(cmd);
    }
    runCommand(id, ...args) {
        const cmd = this.registry.get(id);
        const res = cmd.callback(...args);
        Promise.resolve(res).finally(() => raf_scheduler_1.raf.scheduleFullRedraw());
        return res;
    }
    // Returns a list of commands that match the search term, along with a list
    // of segments which describe which parts of the command name match and
    // which don't.
    fuzzyFilterCommands(searchTerm) {
        const finder = new fuzzy_1.FuzzyFinder(this.commands, ({ name }) => name);
        return finder.find(searchTerm).map((result) => {
            return { segments: result.segments, ...result.item };
        });
    }
    hasStartupCommands() {
        // This should never be called on the global CommandManager.
        // Startup commands should only be checked in trace context.
        throw new Error('hasStartupCommands() should only be called on trace command manager');
    }
    async runStartupCommands() {
        // This should never be called on the global CommandManager.
        // Startup commands should only be executed in trace context.
        throw new Error('runStartupCommands() should only be called on trace command manager');
    }
}
exports.CommandManagerImpl = CommandManagerImpl;
//# sourceMappingURL=command_manager.js.map