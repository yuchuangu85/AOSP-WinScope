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
exports.PacketStream = exports.TracingProtocol = void 0;
const tslib_1 = require("tslib");
const minimal_1 = tslib_1.__importDefault(require("protobufjs/minimal"));
const protos_1 = tslib_1.__importDefault(require("../../../protos"));
const proto_ring_buffer_1 = require("../../../trace_processor/proto_ring_buffer");
const deferred_1 = require("../../../base/deferred");
const utils_1 = require("../../../base/utils");
const logging_1 = require("../../../base/logging");
const packet_assembler_1 = require("./packet_assembler");
const resizable_array_buffer_1 = require("../../../base/resizable_array_buffer");
/**
 * Implements the Consumer side of the Perfetto Tracing Protocol.
 * https://perfetto.dev/docs/design-docs/api-and-abi#socket-protocol
 *
 * The passed stream must be a byte stream to the traced consumer port,
 * e.g. obatained by connecting adb to the /dev/socket/traced_consumer.
 */
class TracingProtocol {
    stream;
    serviceId;
    boundMethods;
    rxBuf = new proto_ring_buffer_1.ProtoRingBuffer('FIXED_SIZE');
    pendingInvokes = new Map();
    // Wire protocol request ID. After each request it is increased. It is needed
    // to keep track of the type of request, and parse the response correctly.
    // We start from 2 because the static create() method takes the first one
    // for binding the service.
    requestId = 2;
    onClose = () => { };
    // We have a separate factory method to await the initial service binding, so
    // we can return an object that is functional (methods can be invoked) and
    // avoid buffering.
    static async create(stream) {
        // Send the bindService request. This is a one-off request to connect to the
        // consumer port and list the RPC methods available.
        const requestId = 1;
        const txFrame = new protos_1.default.IPCFrame({
            requestId,
            msgBindService: new protos_1.default.IPCFrame.BindService({
                serviceName: 'ConsumerPort',
            }),
        });
        const repsponsePromise = (0, deferred_1.defer)();
        const rxFrameBuf = new proto_ring_buffer_1.ProtoRingBuffer('FIXED_SIZE');
        stream.onData = (data) => {
            rxFrameBuf.append(data);
            const rxFrame = rxFrameBuf.readMessage();
            rxFrame && repsponsePromise.resolve(rxFrame);
        };
        TracingProtocol.sendFrame(stream, txFrame);
        // Wait for the IPC reply. There is no state machine or queueing needed at
        // this point (not just yet) because this is 1 req -> 1 reply.
        const frameData = await repsponsePromise;
        const rxFrame = protos_1.default.IPCFrame.decode(frameData);
        (0, logging_1.assertTrue)(rxFrame.msg === 'msgBindServiceReply');
        const replyMsg = (0, logging_1.assertExists)(rxFrame.msgBindServiceReply);
        const boundMethods = new Map();
        (0, logging_1.assertTrue)(replyMsg.success === true);
        const serviceId = (0, logging_1.assertExists)(replyMsg.serviceId);
        for (const m of (0, logging_1.assertExists)(replyMsg.methods)) {
            boundMethods.set((0, logging_1.assertExists)(m.name), (0, logging_1.assertExists)(m.id));
        }
        // Now that the details of the RPC methods are known, build and return the
        // TracingProtocol object, so the caller can finally make calls.
        return new TracingProtocol(stream, serviceId, boundMethods);
    }
    constructor(stream, serviceId, boundMethods) {
        this.stream = stream;
        this.serviceId = serviceId;
        this.boundMethods = boundMethods;
        stream.onData = this.onStreamData.bind(this);
        stream.onClose = () => this.close();
    }
    async invoke(methodName, req) {
        const method = RPC_METHODS[methodName];
        const resultPromise = (0, deferred_1.defer)();
        const pendingInvoke = {
            methodName,
            failSilently: 'failSilently' in method && method.failSilently,
            onResponse: (data, hasMore) => {
                (0, logging_1.assertFalse)(hasMore); // Should have used invokeStreaming instead.
                const response = (0, utils_1.exists)(data)
                    ? method.respType.decode(data)
                    : method.respType.create();
                resultPromise.resolve(response);
            },
        };
        this.beginInvoke(methodName, req, pendingInvoke);
        return resultPromise;
    }
    invokeStreaming(methodName, req) {
        const method = RPC_STREAMING_METHODS[methodName];
        const streamDecoder = method.respType.createStreamingDecoder();
        const pendingInvoke = {
            methodName,
            onResponse: (data, hasMore) => {
                streamDecoder.decode(data, hasMore);
            },
        };
        this.beginInvoke(methodName, req, pendingInvoke);
        return streamDecoder;
    }
    // This call can arrive from two plaes:
    // 1. The user clicking on Stop/Cancel. In this case ConsumerIpcTracingSession
    //    calls this.consumerIpc.close().
    // 2. Stream disconnected is detected (e.g. the user pulls the cable). In this
    //    case we get here via stream.onClose = () => this.close().
    close() {
        if (this.stream.connected) {
            this.stream.close();
        }
        this.pendingInvokes.clear();
        this.onClose();
    }
    get connected() {
        return this.stream.connected;
    }
    [Symbol.dispose]() {
        this.close();
    }
    beginInvoke(methodName, req, pendingInvoke) {
        const methodId = this.boundMethods.get(methodName);
        if (methodId === undefined) {
            throw new Error(`RPC Error: method ${methodName} not supported`);
        }
        const requestId = this.requestId++;
        const argType = methodName in RPC_METHODS
            ? RPC_METHODS[methodName].argType
            : RPC_STREAMING_METHODS[methodName].argType;
        const argsProto = argType.encode(req).finish();
        const frame = new protos_1.default.IPCFrame({
            requestId,
            msgInvokeMethod: new protos_1.default.IPCFrame.InvokeMethod({
                serviceId: this.serviceId,
                methodId: methodId,
                argsProto,
            }),
        });
        TracingProtocol.sendFrame(this.stream, frame);
        this.pendingInvokes.set(requestId, pendingInvoke);
    }
    onStreamData(data) {
        this.rxBuf.append(data);
        for (;;) {
            const frameData = this.rxBuf.readMessage();
            if (frameData === undefined)
                break;
            this.parseFrame(frameData);
        }
    }
    parseFrame(frameData) {
        // Get a copy of the ArrayBuffer to avoid the original being overriden.
        // See 170256902#comment21
        const frame = protos_1.default.IPCFrame.decode(frameData.slice());
        if (frame.msg === 'msgInvokeMethodReply') {
            const reply = (0, logging_1.assertExists)(frame.msgInvokeMethodReply);
            const pendInvoke = (0, logging_1.assertExists)(this.pendingInvokes.get(frame.requestId));
            // We process messages without a `replyProto` field (for instance
            // `FreeBuffers` does not have `replyProto`). However, we ignore messages
            // without a valid 'success' field.
            if (reply.success === false && !pendInvoke.failSilently) {
                throw new Error(`Tracing Protocol: ${pendInvoke.methodName} failed`);
            }
            pendInvoke.onResponse(reply.replyProto ?? undefined, Boolean(reply.hasMore));
            if (!reply.hasMore) {
                this.pendingInvokes.delete(frame.requestId);
            }
        }
        else {
            throw new Error(`Tracing protocol: unrecognized frame ${frame.msg}`);
        }
    }
    static sendFrame(stream, frame) {
        const writer = minimal_1.default.Writer.create();
        writer.fixed32(0); // Reserve space for the 4 bytes header (frame len).
        const frameData = protos_1.default.IPCFrame.encode(frame, writer).finish().slice();
        const frameLen = frameData.length - 4;
        const dv = new DataView(frameData.buffer);
        dv.setUint32(0, frameLen, /* littleEndian */ true); // Write the header.
        return stream.write(frameData);
    }
}
exports.TracingProtocol = TracingProtocol;
class PacketStream {
    static createStreamingDecoder() {
        return new PacketStream();
    }
    traceBuf = new packet_assembler_1.PacketAssembler();
    onTraceData = () => { };
    decode(data, hasMore) {
        if (data === undefined) {
            this.onTraceData(new Uint8Array(), hasMore);
            return;
        }
        // ReadBuffers returns 1+ slices. They can form 1 packet (usually),
        // >1 packet, or a fraction of a packet.
        const rdresp = protos_1.default.ReadBuffersResponse.decode(data);
        const packets = this.traceBuf.pushSlices(rdresp);
        this.onTraceData(packets, hasMore);
    }
}
exports.PacketStream = PacketStream;
// QueryServiceStateResponse can be split in several chunks if the service state
// exceeds the 128KB ipc limit. This class simply merges them and exposes the
// merged result once hasMore = false.
class ServiceStateMerger {
    static createStreamingDecoder() {
        return new ServiceStateMerger();
    }
    rxBuf = new resizable_array_buffer_1.ResizableArrayBuffer();
    promise = (0, deferred_1.defer)();
    decode(data, hasMore) {
        if (data !== undefined) {
            this.rxBuf.append(data);
        }
        if (!hasMore) {
            const msg = protos_1.default.QueryServiceStateResponse.decode(this.rxBuf.get());
            this.rxBuf.clear();
            this.promise.resolve(msg);
        }
    }
}
const RPC_METHODS = {
    EnableTracing: {
        argType: protos_1.default.EnableTracingRequest,
        respType: protos_1.default.EnableTracingResponse,
    },
    DisableTracing: {
        argType: protos_1.default.DisableTracingRequest,
        respType: protos_1.default.DisableTracingResponse,
    },
    Flush: {
        argType: protos_1.default.FlushRequest,
        respType: protos_1.default.FlushResponse,
        failSilently: true,
    },
    FreeBuffers: {
        argType: protos_1.default.FreeBuffersRequest,
        respType: protos_1.default.FreeBuffersResponse,
    },
    GetTraceStats: {
        argType: protos_1.default.GetTraceStatsRequest,
        respType: protos_1.default.GetTraceStatsResponse,
    },
};
const RPC_STREAMING_METHODS = {
    ReadBuffers: {
        argType: protos_1.default.ReadBuffersRequest,
        respType: PacketStream,
    },
    QueryServiceState: {
        argType: protos_1.default.QueryServiceStateRequest,
        respType: ServiceStateMerger,
    },
};
//# sourceMappingURL=tracing_protocol.js.map