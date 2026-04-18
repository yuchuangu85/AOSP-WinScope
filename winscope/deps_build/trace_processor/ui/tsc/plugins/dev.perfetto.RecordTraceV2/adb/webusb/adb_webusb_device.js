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
exports.AdbWebusbDevice = void 0;
const tslib_1 = require("tslib");
const deferred_1 = require("../../../../base/deferred");
const logging_1 = require("../../../../base/logging");
const object_utils_1 = require("../../../../base/object_utils");
const string_utils_1 = require("../../../../base/string_utils");
const utils_1 = require("../../../../base/utils");
const modal_1 = require("../../../../widgets/modal");
const adb_device_1 = require("../adb_device");
const adb_msg_1 = require("../adb_msg");
const adb_webusb_utils_1 = require("./adb_webusb_utils");
const result_1 = require("../../../../base/result");
const adb_webusb_stream_1 = require("./adb_webusb_stream");
const ADB_MSG_SIZE = 6 * 4; // 6 * int32.
const DEFAULT_MAX_PAYLOAD_BYTES = 256 * 1024;
const VERSION_WITH_CHECKSUM = 0x01000000;
const VERSION_NO_CHECKSUM = 0x01000001;
/**
 * This class implements the state machine required to communicate with an ADB
 * device over WebUsb. It takes a {@link USBDevice} in input and returns an
 * object suitable to run shell commands and create streams on it.
 */
class AdbWebusbDevice extends adb_device_1.AdbDevice {
    usb;
    maxPayload;
    useChecksum;
    lastStreamId = 0;
    _connected = true;
    rxLoopRunning = false;
    streams = new Map();
    pendingStreams = new Map();
    txQueue = new Array();
    txPending = false;
    /** Use {@link connect()} to obtain an instance of this class. */
    constructor(usb, maxPayload, useChecksum) {
        super();
        this.usb = usb;
        this.maxPayload = maxPayload;
        this.useChecksum = useChecksum;
        this.usb = usb;
        // Deliberately not awaited, the rx looop will loop forever in the
        // background until we disconnect.
        this.usbRxLoop();
    }
    /**
     * Creates a new instance of this class.
     * @param usbdev the device obtained via {@link navigator.usb.requestDevice}.
     * @param adbKeyMgr an instance of the key manager.
     */
    static async connect(usbdev, adbKeyMgr) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const usb = (0, adb_webusb_utils_1.getAdbWebUsbInterface)(usbdev);
            if (usb === undefined) {
                return (0, result_1.errResult)('Could not find the USB Interface. ' +
                    'Try disconnecting and reconnecting the device.');
            }
            if (usbdev.opened) {
                await usbdev.close();
            }
            await usbdev.open();
            const autoClose = tslib_1.__addDisposableResource(env_1, new CloseDeviceWhenOutOfScope(usbdev), false);
            await usbdev.selectConfiguration(usb.configurationValue);
            try {
                await usbdev.claimInterface(usb.usbInterfaceNumber);
            }
            catch (err) {
                console.error(err);
                return (0, result_1.errResult)('Failed to claim USB interface. Try `adb kill-server` or ' +
                    'close other profiling tools and try again');
            }
            const keyRes = await adbKeyMgr.getOrCreateKey();
            if (!keyRes.ok)
                return keyRes;
            const key = keyRes.value;
            await AdbWebusbDevice.send(usb, 'CNXN', VERSION_NO_CHECKSUM, DEFAULT_MAX_PAYLOAD_BYTES, 'host:1:WebUsb');
            // At this point there are two options:
            // 1. The device accepts the key and responds with a CNXN msg.
            // 2. The device doesn't recognize us, and responds with another AUTH msg.
            // We need to have some tolerance from queued messages from previous
            // sessions, hence the 10 attempts to deal with spurious messages.
            let authAttempts = 0;
            const modalKey = 'adbauth';
            for (let attempt = 0; attempt < 10; attempt++) {
                const msg = await this.recvMsg(usb);
                if (msg.cmd === 'CNXN') {
                    // Success, the device authenticated us.
                    (0, modal_1.closeModal)(modalKey);
                    const maxPayload = msg.arg1;
                    const ver = msg.arg0;
                    if (ver !== VERSION_WITH_CHECKSUM && ver !== VERSION_NO_CHECKSUM) {
                        return (0, result_1.errResult)(`ADB version ${ver} not supported`);
                    }
                    const useChecksum = ver === VERSION_WITH_CHECKSUM;
                    autoClose.keepOpen = true;
                    return (0, result_1.okResult)(new AdbWebusbDevice(usb, maxPayload, useChecksum));
                }
                if (msg.cmd !== 'AUTH') {
                    logSpuriousMsg(msg);
                    continue;
                }
                (0, logging_1.assertTrue)(msg.arg0 === AuthCmd.TOKEN);
                const authAttempt = authAttempts++;
                if (authAttempt === 0) {
                    // Case 1: we are presented with a nonce to sign. If the device has
                    // previously received our public key, the dialog asking for user
                    // confirmation will NOT be displayed.
                    const signedNonce = key.sign(msg.data);
                    await this.send(usb, 'AUTH', AuthCmd.SIGNATURE, 0, signedNonce);
                    continue;
                }
                if (authAttempt === 1) {
                    // Case 2: present our public key. This will prompt the dialog.
                    await this.send(usb, 'AUTH', AuthCmd.PUBKEY, 0, key.getPublicKey());
                    (0, modal_1.showModal)({
                        key: modalKey,
                        title: 'ADB Authorization required',
                        content: 'Please unlock the device and authorize the ADB connection',
                    });
                    continue;
                }
                break;
            }
            return (0, result_1.errResult)('ADB authorization failed');
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            tslib_1.__disposeResources(env_1);
        }
    }
    async createStream(svc) {
        const ps = {
            promise: (0, deferred_1.defer)(),
            localId: ++this.lastStreamId,
            svc,
        };
        this.pendingStreams.set(ps.localId, ps);
        this.send('OPEN', ps.localId, 0, svc);
        return ps.promise;
    }
    close() {
        this._connected = false;
        this.usb.dev.opened && this.usb.dev.close();
        this.streams.forEach((stream) => this.streamClose(stream));
    }
    get connected() {
        return this._connected;
    }
    streamWrite(stream, data) {
        const promise = (0, deferred_1.defer)();
        const raw = (0, object_utils_1.isString)(data) ? (0, string_utils_1.utf8Encode)(data) : data;
        let sent = 0;
        while (sent < raw.byteLength) {
            const chunkLen = Math.min(this.maxPayload, raw.byteLength - sent);
            const chunk = raw.subarray(sent, sent + chunkLen);
            sent += chunkLen;
            const tx = {
                stream,
                data: chunk,
                // This is the last chunk. Attach the promise only to the last chunk.
                promise: sent === raw.byteLength ? promise : undefined,
            };
            this.txQueue.push(tx);
            if (!this.txPending) {
                (0, logging_1.assertTrue)(this.txQueue.length === 1);
                this.streamWriteFromQueue(tx);
            }
        }
        return promise;
    }
    streamClose(stream) {
        // Remove any pending entry from the tx queue.
        this.txQueue = this.txQueue.filter((tx) => tx.stream !== stream);
        this.send('CLSE', stream.localId, stream.remoteId);
        this.streams.delete(stream.localId);
        stream.notifyClose();
    }
    streamWriteFromQueue(tx) {
        (0, logging_1.assertFalse)(this.txPending);
        this.txPending = true;
        this.send('WRTE', tx.stream.localId, tx.stream.remoteId, tx.data);
    }
    async usbRxLoop() {
        (0, logging_1.assertFalse)(this.rxLoopRunning);
        this.rxLoopRunning = true;
        try {
            while (this._connected) {
                await this.usbRxLoopInner();
            }
        }
        catch (e) {
            // We allow the transferIn() in recv() to fail if we disconnected. That
            // will naturally happen in the [Symbol.dispose].
            const transferInAborted = e instanceof Error && e.message.includes('transfer was cancelled');
            if (!(transferInAborted && !this._connected)) {
                throw e;
            }
        }
        finally {
            this.rxLoopRunning = false;
            this._connected = false;
        }
    }
    async usbRxLoopInner() {
        const msg = await AdbWebusbDevice.recvMsg(this.usb);
        if (msg.cmd === 'OKAY') {
            // There are two cases here:
            // 1) This is an ACK to an OPEN (new stream).
            // 2) This is an ACK to a WRTE on an existing stream.
            const remoteStreamId = msg.arg0;
            const localStreamId = msg.arg1;
            const pendingStream = this.pendingStreams.get(localStreamId);
            if (pendingStream !== undefined) {
                // Case 1.
                this.pendingStreams.delete(localStreamId);
                const stream = new adb_webusb_stream_1.AdbWebusbStream(this, localStreamId, remoteStreamId);
                this.streams.set(localStreamId, stream);
                pendingStream.promise.resolve((0, result_1.okResult)(stream));
            }
            else {
                // Case 2.
                const queuedEntry = this.popFromTxQueue(localStreamId, remoteStreamId);
                if (queuedEntry === undefined) {
                    return logSpuriousMsg(msg);
                }
                this.txPending = false;
                queuedEntry.promise?.resolve();
                const next = this.txQueue[0];
                next !== undefined && this.streamWriteFromQueue(next);
            }
            return;
        }
        else if (msg.cmd === 'WRTE') {
            const localStreamId = msg.arg1;
            const stream = this.streams.get(localStreamId);
            if (stream === undefined) {
                return logSpuriousMsg(msg);
            }
            await this.send('OKAY', stream.localId, stream.remoteId);
            stream.onData(msg.data);
        }
        else if (msg.cmd === 'CLSE') {
            // Close a stream.
            const localStreamId = msg.arg1;
            // If the stream has not been opened yet, this is a failure while opening.
            const ps = this.pendingStreams.get(localStreamId);
            if (ps !== undefined) {
                this.pendingStreams.delete(localStreamId);
                ps.promise.resolve((0, result_1.errResult)(`Stream ${ps.svc} failed to connect`));
                return;
            }
            // Otherwise the service is telling us about a stream getting closed from
            // their end (e.g. the shell:xxx command terminated).
            const stream = this.streams.get(localStreamId);
            // If we initiate the closure, the stream entry is already removed.
            if (stream !== undefined) {
                this.streams.delete(localStreamId);
                stream.notifyClose();
            }
        }
        else {
            console.error(`Unexpected ADB cmd ${msg.cmd} ${msg.arg0} ${msg.arg1}`);
        }
    }
    popFromTxQueue(localStreamId, remoteStreamId) {
        for (let i = 0; i < this.txQueue.length; i++) {
            const tx = this.txQueue[i];
            if (tx.stream.localId !== localStreamId)
                continue;
            if (tx.stream.remoteId !== remoteStreamId)
                continue;
            return this.txQueue.splice(i, 1)[0];
        }
        throw new WebusbTransportError(`Could not find ADB queue entry L=${localStreamId}, ` +
            `R=${remoteStreamId}, TxLen=${this.txQueue.length}`);
    }
    static async recv(usb, len) {
        const res = await usb.dev.transferIn(usb.rx, len);
        if (!(0, utils_1.exists)(res.data) || res.status !== 'ok') {
            throw new WebusbTransportError(`res: ${res.status}, data: ${!!res.data}`);
        }
        return res.data;
    }
    static async recvMsg(usb) {
        const hdrData = await this.recv(usb, ADB_MSG_SIZE);
        if (hdrData.byteLength !== ADB_MSG_SIZE) {
            const arr = new Uint8Array(hdrData.buffer);
            throw new WebusbTransportError(`RX spurious: ${(0, string_utils_1.hexEncode)(arr)} ${(0, string_utils_1.utf8Decode)(arr)}`);
        }
        const hdr = (0, adb_msg_1.parseAdbMsgHdr)(hdrData);
        let payload = new Uint8Array();
        if (hdr.dataLen > 0) {
            const payloadData = await this.recv(usb, hdr.dataLen);
            payload = new Uint8Array(payloadData.buffer, payloadData.byteOffset, payloadData.byteLength).slice();
        }
        return { ...hdr, data: payload };
    }
    send(cmd, arg0, arg1, data) {
        if (!this.connected)
            return Promise.resolve();
        const useCksum = this.useChecksum;
        return AdbWebusbDevice.send(this.usb, cmd, arg0, arg1, data, useCksum);
    }
    static async send(usb, cmd, arg0, arg1, data, useChecksum = false) {
        const payload = (0, adb_msg_1.encodeAdbData)(data);
        const header = (0, adb_msg_1.encodeAdbMsg)(cmd, arg0, arg1, payload, useChecksum);
        // The header and the message data must be sent consecutively. In order to
        // avoid interleaving ([hdr1] [hdr2] [data1] [data2]), we chain promises.
        const sendPromises = [usb.dev.transferOut(usb.tx, header.buffer)];
        if (payload.length > 0) {
            sendPromises.push(usb.dev.transferOut(usb.tx, payload.buffer));
            if (payload.length % usb.txPacketSize === 0) {
                // if the number of bytes transferred fits exactly into packets then
                // we need an extra zero length packet at the end.
                sendPromises.push(usb.dev.transferOut(usb.tx, new Uint8Array(0)));
            }
        }
        await Promise.all(sendPromises);
    }
}
exports.AdbWebusbDevice = AdbWebusbDevice;
var AuthCmd;
(function (AuthCmd) {
    AuthCmd[AuthCmd["TOKEN"] = 1] = "TOKEN";
    AuthCmd[AuthCmd["SIGNATURE"] = 2] = "SIGNATURE";
    AuthCmd[AuthCmd["PUBKEY"] = 3] = "PUBKEY";
})(AuthCmd || (AuthCmd = {}));
class WebusbTransportError extends Error {
    constructor(message) {
        super(message);
        this.name = 'WebusbTransportError';
    }
}
// These log messages are non-fatal because we need to tolerate the fact that
// adbd can buffer messages from previous connections (e.g. if reloading a tab)
// and won't clear the queue when we restart the flow (as one would expect).
function logSpuriousMsg(msg) {
    console.log('Spurious ADB message', (0, adb_msg_1.adbMsgToString)(msg));
}
class CloseDeviceWhenOutOfScope {
    usbdev;
    constructor(usbdev) {
        this.usbdev = usbdev;
    }
    keepOpen = false;
    [Symbol.dispose]() {
        if (this.keepOpen)
            return;
        if (this.usbdev.opened) {
            this.usbdev.close();
        }
    }
}
//# sourceMappingURL=adb_webusb_device.js.map