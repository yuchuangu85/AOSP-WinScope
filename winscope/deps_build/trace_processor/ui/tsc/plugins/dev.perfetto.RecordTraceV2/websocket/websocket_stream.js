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
exports.WebSocketStream = void 0;
const logging_1 = require("../../../base/logging");
const byte_stream_1 = require("../interfaces/byte_stream");
class WebSocketStream extends byte_stream_1.ByteStream {
    sock;
    constructor(sock) {
        super();
        this.sock = sock;
        sock.binaryType = 'arraybuffer';
        sock.onclose = () => this.onClose();
        sock.onmessage = async (e) => {
            (0, logging_1.assertTrue)(e.data instanceof ArrayBuffer);
            this.onData(new Uint8Array(e.data));
        };
    }
    get connected() {
        return this.sock.readyState === WebSocket.OPEN;
    }
    async write(data) {
        this.sock.send(data);
    }
    close() {
        this.sock.close();
    }
}
exports.WebSocketStream = WebSocketStream;
//# sourceMappingURL=websocket_stream.js.map