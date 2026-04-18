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
exports.Cpu = void 0;
exports.maybeMachineLabel = maybeMachineLabel;
class Cpu {
    ucpu;
    cpu;
    machine;
    constructor(ucpu, cpu, machine) {
        this.ucpu = ucpu;
        this.cpu = cpu;
        this.machine = machine;
    }
    maybeMachineLabel() {
        return this.machine > 0 ? ` (machine ${this.machine})` : '';
    }
    toString() {
        return `${this.cpu}${this.maybeMachineLabel()}`;
    }
}
exports.Cpu = Cpu;
function maybeMachineLabel(machine) {
    const m = machine ?? 0;
    return m > 0 ? ` (machine ${m})` : '';
}
//# sourceMappingURL=multi_machine_trace.js.map