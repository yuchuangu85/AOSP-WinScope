/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots.transitionslatest || ($protobuf.roots.transitionslatest = {});
    
    $root.perfetto = (function() {
    
        /**
         * Namespace perfetto.
         * @exports perfetto
         * @namespace
         */
        var perfetto = {};
    
        perfetto.protos = (function() {
    
            /**
             * Namespace protos.
             * @memberof perfetto
             * @namespace
             */
            var protos = {};
    
            protos.ShellTransition = (function() {
    
                /**
                 * Properties of a ShellTransition.
                 * @memberof perfetto.protos
                 * @interface IShellTransition
                 * @property {number|null} [id] ShellTransition id
                 * @property {Long|null} [createTimeNs] ShellTransition createTimeNs
                 * @property {Long|null} [sendTimeNs] ShellTransition sendTimeNs
                 * @property {Long|null} [dispatchTimeNs] ShellTransition dispatchTimeNs
                 * @property {Long|null} [mergeTimeNs] ShellTransition mergeTimeNs
                 * @property {Long|null} [mergeRequestTimeNs] ShellTransition mergeRequestTimeNs
                 * @property {Long|null} [shellAbortTimeNs] ShellTransition shellAbortTimeNs
                 * @property {Long|null} [wmAbortTimeNs] ShellTransition wmAbortTimeNs
                 * @property {Long|null} [finishTimeNs] ShellTransition finishTimeNs
                 * @property {Long|null} [startTransactionId] ShellTransition startTransactionId
                 * @property {Long|null} [finishTransactionId] ShellTransition finishTransactionId
                 * @property {number|null} [handler] ShellTransition handler
                 * @property {number|null} [type] ShellTransition type
                 * @property {Array.<perfetto.protos.ShellTransition.ITarget>|null} [targets] ShellTransition targets
                 * @property {number|null} [mergeTarget] ShellTransition mergeTarget
                 * @property {number|null} [flags] ShellTransition flags
                 * @property {Long|null} [startingWindowRemoveTimeNs] ShellTransition startingWindowRemoveTimeNs
                 */
    
                /**
                 * Constructs a new ShellTransition.
                 * @memberof perfetto.protos
                 * @classdesc Represents a ShellTransition.
                 * @implements IShellTransition
                 * @constructor
                 * @param {perfetto.protos.IShellTransition=} [properties] Properties to set
                 */
                function ShellTransition(properties) {
                    this.targets = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ShellTransition id.
                 * @member {number} id
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 */
                ShellTransition.prototype.id = 0;
    
                /**
                 * ShellTransition createTimeNs.
                 * @member {Long} createTimeNs
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 */
                ShellTransition.prototype.createTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * ShellTransition sendTimeNs.
                 * @member {Long} sendTimeNs
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 */
                ShellTransition.prototype.sendTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * ShellTransition dispatchTimeNs.
                 * @member {Long} dispatchTimeNs
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 */
                ShellTransition.prototype.dispatchTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * ShellTransition mergeTimeNs.
                 * @member {Long} mergeTimeNs
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 */
                ShellTransition.prototype.mergeTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * ShellTransition mergeRequestTimeNs.
                 * @member {Long} mergeRequestTimeNs
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 */
                ShellTransition.prototype.mergeRequestTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * ShellTransition shellAbortTimeNs.
                 * @member {Long} shellAbortTimeNs
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 */
                ShellTransition.prototype.shellAbortTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * ShellTransition wmAbortTimeNs.
                 * @member {Long} wmAbortTimeNs
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 */
                ShellTransition.prototype.wmAbortTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * ShellTransition finishTimeNs.
                 * @member {Long} finishTimeNs
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 */
                ShellTransition.prototype.finishTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * ShellTransition startTransactionId.
                 * @member {Long} startTransactionId
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 */
                ShellTransition.prototype.startTransactionId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                /**
                 * ShellTransition finishTransactionId.
                 * @member {Long} finishTransactionId
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 */
                ShellTransition.prototype.finishTransactionId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                /**
                 * ShellTransition handler.
                 * @member {number} handler
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 */
                ShellTransition.prototype.handler = 0;
    
                /**
                 * ShellTransition type.
                 * @member {number} type
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 */
                ShellTransition.prototype.type = 0;
    
                /**
                 * ShellTransition targets.
                 * @member {Array.<perfetto.protos.ShellTransition.ITarget>} targets
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 */
                ShellTransition.prototype.targets = $util.emptyArray;
    
                /**
                 * ShellTransition mergeTarget.
                 * @member {number} mergeTarget
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 */
                ShellTransition.prototype.mergeTarget = 0;
    
                /**
                 * ShellTransition flags.
                 * @member {number} flags
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 */
                ShellTransition.prototype.flags = 0;
    
                /**
                 * ShellTransition startingWindowRemoveTimeNs.
                 * @member {Long} startingWindowRemoveTimeNs
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 */
                ShellTransition.prototype.startingWindowRemoveTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * Creates a new ShellTransition instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.ShellTransition
                 * @static
                 * @param {perfetto.protos.IShellTransition=} [properties] Properties to set
                 * @returns {perfetto.protos.ShellTransition} ShellTransition instance
                 */
                ShellTransition.create = function create(properties) {
                    return new ShellTransition(properties);
                };
    
                /**
                 * Encodes the specified ShellTransition message. Does not implicitly {@link perfetto.protos.ShellTransition.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.ShellTransition
                 * @static
                 * @param {perfetto.protos.IShellTransition} message ShellTransition message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ShellTransition.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
                    if (message.createTimeNs != null && Object.hasOwnProperty.call(message, "createTimeNs"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int64(message.createTimeNs);
                    if (message.sendTimeNs != null && Object.hasOwnProperty.call(message, "sendTimeNs"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int64(message.sendTimeNs);
                    if (message.dispatchTimeNs != null && Object.hasOwnProperty.call(message, "dispatchTimeNs"))
                        writer.uint32(/* id 4, wireType 0 =*/32).int64(message.dispatchTimeNs);
                    if (message.mergeTimeNs != null && Object.hasOwnProperty.call(message, "mergeTimeNs"))
                        writer.uint32(/* id 5, wireType 0 =*/40).int64(message.mergeTimeNs);
                    if (message.mergeRequestTimeNs != null && Object.hasOwnProperty.call(message, "mergeRequestTimeNs"))
                        writer.uint32(/* id 6, wireType 0 =*/48).int64(message.mergeRequestTimeNs);
                    if (message.shellAbortTimeNs != null && Object.hasOwnProperty.call(message, "shellAbortTimeNs"))
                        writer.uint32(/* id 7, wireType 0 =*/56).int64(message.shellAbortTimeNs);
                    if (message.wmAbortTimeNs != null && Object.hasOwnProperty.call(message, "wmAbortTimeNs"))
                        writer.uint32(/* id 8, wireType 0 =*/64).int64(message.wmAbortTimeNs);
                    if (message.finishTimeNs != null && Object.hasOwnProperty.call(message, "finishTimeNs"))
                        writer.uint32(/* id 9, wireType 0 =*/72).int64(message.finishTimeNs);
                    if (message.startTransactionId != null && Object.hasOwnProperty.call(message, "startTransactionId"))
                        writer.uint32(/* id 10, wireType 0 =*/80).uint64(message.startTransactionId);
                    if (message.finishTransactionId != null && Object.hasOwnProperty.call(message, "finishTransactionId"))
                        writer.uint32(/* id 11, wireType 0 =*/88).uint64(message.finishTransactionId);
                    if (message.handler != null && Object.hasOwnProperty.call(message, "handler"))
                        writer.uint32(/* id 12, wireType 0 =*/96).int32(message.handler);
                    if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                        writer.uint32(/* id 13, wireType 0 =*/104).int32(message.type);
                    if (message.targets != null && message.targets.length)
                        for (var i = 0; i < message.targets.length; ++i)
                            $root.perfetto.protos.ShellTransition.Target.encode(message.targets[i], writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
                    if (message.mergeTarget != null && Object.hasOwnProperty.call(message, "mergeTarget"))
                        writer.uint32(/* id 15, wireType 0 =*/120).int32(message.mergeTarget);
                    if (message.flags != null && Object.hasOwnProperty.call(message, "flags"))
                        writer.uint32(/* id 16, wireType 0 =*/128).int32(message.flags);
                    if (message.startingWindowRemoveTimeNs != null && Object.hasOwnProperty.call(message, "startingWindowRemoveTimeNs"))
                        writer.uint32(/* id 17, wireType 0 =*/136).int64(message.startingWindowRemoveTimeNs);
                    return writer;
                };
    
                /**
                 * Encodes the specified ShellTransition message, length delimited. Does not implicitly {@link perfetto.protos.ShellTransition.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.ShellTransition
                 * @static
                 * @param {perfetto.protos.IShellTransition} message ShellTransition message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ShellTransition.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a ShellTransition message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.ShellTransition
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.ShellTransition} ShellTransition
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ShellTransition.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.ShellTransition();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.id = reader.int32();
                                break;
                            }
                        case 2: {
                                message.createTimeNs = reader.int64();
                                break;
                            }
                        case 3: {
                                message.sendTimeNs = reader.int64();
                                break;
                            }
                        case 4: {
                                message.dispatchTimeNs = reader.int64();
                                break;
                            }
                        case 5: {
                                message.mergeTimeNs = reader.int64();
                                break;
                            }
                        case 6: {
                                message.mergeRequestTimeNs = reader.int64();
                                break;
                            }
                        case 7: {
                                message.shellAbortTimeNs = reader.int64();
                                break;
                            }
                        case 8: {
                                message.wmAbortTimeNs = reader.int64();
                                break;
                            }
                        case 9: {
                                message.finishTimeNs = reader.int64();
                                break;
                            }
                        case 10: {
                                message.startTransactionId = reader.uint64();
                                break;
                            }
                        case 11: {
                                message.finishTransactionId = reader.uint64();
                                break;
                            }
                        case 12: {
                                message.handler = reader.int32();
                                break;
                            }
                        case 13: {
                                message.type = reader.int32();
                                break;
                            }
                        case 14: {
                                if (!(message.targets && message.targets.length))
                                    message.targets = [];
                                message.targets.push($root.perfetto.protos.ShellTransition.Target.decode(reader, reader.uint32()));
                                break;
                            }
                        case 15: {
                                message.mergeTarget = reader.int32();
                                break;
                            }
                        case 16: {
                                message.flags = reader.int32();
                                break;
                            }
                        case 17: {
                                message.startingWindowRemoveTimeNs = reader.int64();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a ShellTransition message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.ShellTransition
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.ShellTransition} ShellTransition
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ShellTransition.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a ShellTransition message.
                 * @function verify
                 * @memberof perfetto.protos.ShellTransition
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ShellTransition.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isInteger(message.id))
                            return "id: integer expected";
                    if (message.createTimeNs != null && message.hasOwnProperty("createTimeNs"))
                        if (!$util.isInteger(message.createTimeNs) && !(message.createTimeNs && $util.isInteger(message.createTimeNs.low) && $util.isInteger(message.createTimeNs.high)))
                            return "createTimeNs: integer|Long expected";
                    if (message.sendTimeNs != null && message.hasOwnProperty("sendTimeNs"))
                        if (!$util.isInteger(message.sendTimeNs) && !(message.sendTimeNs && $util.isInteger(message.sendTimeNs.low) && $util.isInteger(message.sendTimeNs.high)))
                            return "sendTimeNs: integer|Long expected";
                    if (message.dispatchTimeNs != null && message.hasOwnProperty("dispatchTimeNs"))
                        if (!$util.isInteger(message.dispatchTimeNs) && !(message.dispatchTimeNs && $util.isInteger(message.dispatchTimeNs.low) && $util.isInteger(message.dispatchTimeNs.high)))
                            return "dispatchTimeNs: integer|Long expected";
                    if (message.mergeTimeNs != null && message.hasOwnProperty("mergeTimeNs"))
                        if (!$util.isInteger(message.mergeTimeNs) && !(message.mergeTimeNs && $util.isInteger(message.mergeTimeNs.low) && $util.isInteger(message.mergeTimeNs.high)))
                            return "mergeTimeNs: integer|Long expected";
                    if (message.mergeRequestTimeNs != null && message.hasOwnProperty("mergeRequestTimeNs"))
                        if (!$util.isInteger(message.mergeRequestTimeNs) && !(message.mergeRequestTimeNs && $util.isInteger(message.mergeRequestTimeNs.low) && $util.isInteger(message.mergeRequestTimeNs.high)))
                            return "mergeRequestTimeNs: integer|Long expected";
                    if (message.shellAbortTimeNs != null && message.hasOwnProperty("shellAbortTimeNs"))
                        if (!$util.isInteger(message.shellAbortTimeNs) && !(message.shellAbortTimeNs && $util.isInteger(message.shellAbortTimeNs.low) && $util.isInteger(message.shellAbortTimeNs.high)))
                            return "shellAbortTimeNs: integer|Long expected";
                    if (message.wmAbortTimeNs != null && message.hasOwnProperty("wmAbortTimeNs"))
                        if (!$util.isInteger(message.wmAbortTimeNs) && !(message.wmAbortTimeNs && $util.isInteger(message.wmAbortTimeNs.low) && $util.isInteger(message.wmAbortTimeNs.high)))
                            return "wmAbortTimeNs: integer|Long expected";
                    if (message.finishTimeNs != null && message.hasOwnProperty("finishTimeNs"))
                        if (!$util.isInteger(message.finishTimeNs) && !(message.finishTimeNs && $util.isInteger(message.finishTimeNs.low) && $util.isInteger(message.finishTimeNs.high)))
                            return "finishTimeNs: integer|Long expected";
                    if (message.startTransactionId != null && message.hasOwnProperty("startTransactionId"))
                        if (!$util.isInteger(message.startTransactionId) && !(message.startTransactionId && $util.isInteger(message.startTransactionId.low) && $util.isInteger(message.startTransactionId.high)))
                            return "startTransactionId: integer|Long expected";
                    if (message.finishTransactionId != null && message.hasOwnProperty("finishTransactionId"))
                        if (!$util.isInteger(message.finishTransactionId) && !(message.finishTransactionId && $util.isInteger(message.finishTransactionId.low) && $util.isInteger(message.finishTransactionId.high)))
                            return "finishTransactionId: integer|Long expected";
                    if (message.handler != null && message.hasOwnProperty("handler"))
                        if (!$util.isInteger(message.handler))
                            return "handler: integer expected";
                    if (message.type != null && message.hasOwnProperty("type"))
                        if (!$util.isInteger(message.type))
                            return "type: integer expected";
                    if (message.targets != null && message.hasOwnProperty("targets")) {
                        if (!Array.isArray(message.targets))
                            return "targets: array expected";
                        for (var i = 0; i < message.targets.length; ++i) {
                            var error = $root.perfetto.protos.ShellTransition.Target.verify(message.targets[i]);
                            if (error)
                                return "targets." + error;
                        }
                    }
                    if (message.mergeTarget != null && message.hasOwnProperty("mergeTarget"))
                        if (!$util.isInteger(message.mergeTarget))
                            return "mergeTarget: integer expected";
                    if (message.flags != null && message.hasOwnProperty("flags"))
                        if (!$util.isInteger(message.flags))
                            return "flags: integer expected";
                    if (message.startingWindowRemoveTimeNs != null && message.hasOwnProperty("startingWindowRemoveTimeNs"))
                        if (!$util.isInteger(message.startingWindowRemoveTimeNs) && !(message.startingWindowRemoveTimeNs && $util.isInteger(message.startingWindowRemoveTimeNs.low) && $util.isInteger(message.startingWindowRemoveTimeNs.high)))
                            return "startingWindowRemoveTimeNs: integer|Long expected";
                    return null;
                };
    
                /**
                 * Creates a ShellTransition message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.ShellTransition
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.ShellTransition} ShellTransition
                 */
                ShellTransition.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.ShellTransition)
                        return object;
                    var message = new $root.perfetto.protos.ShellTransition();
                    if (object.id != null)
                        message.id = object.id | 0;
                    if (object.createTimeNs != null)
                        if ($util.Long)
                            (message.createTimeNs = $util.Long.fromValue(object.createTimeNs)).unsigned = false;
                        else if (typeof object.createTimeNs === "string")
                            message.createTimeNs = parseInt(object.createTimeNs, 10);
                        else if (typeof object.createTimeNs === "number")
                            message.createTimeNs = object.createTimeNs;
                        else if (typeof object.createTimeNs === "object")
                            message.createTimeNs = new $util.LongBits(object.createTimeNs.low >>> 0, object.createTimeNs.high >>> 0).toNumber();
                    if (object.sendTimeNs != null)
                        if ($util.Long)
                            (message.sendTimeNs = $util.Long.fromValue(object.sendTimeNs)).unsigned = false;
                        else if (typeof object.sendTimeNs === "string")
                            message.sendTimeNs = parseInt(object.sendTimeNs, 10);
                        else if (typeof object.sendTimeNs === "number")
                            message.sendTimeNs = object.sendTimeNs;
                        else if (typeof object.sendTimeNs === "object")
                            message.sendTimeNs = new $util.LongBits(object.sendTimeNs.low >>> 0, object.sendTimeNs.high >>> 0).toNumber();
                    if (object.dispatchTimeNs != null)
                        if ($util.Long)
                            (message.dispatchTimeNs = $util.Long.fromValue(object.dispatchTimeNs)).unsigned = false;
                        else if (typeof object.dispatchTimeNs === "string")
                            message.dispatchTimeNs = parseInt(object.dispatchTimeNs, 10);
                        else if (typeof object.dispatchTimeNs === "number")
                            message.dispatchTimeNs = object.dispatchTimeNs;
                        else if (typeof object.dispatchTimeNs === "object")
                            message.dispatchTimeNs = new $util.LongBits(object.dispatchTimeNs.low >>> 0, object.dispatchTimeNs.high >>> 0).toNumber();
                    if (object.mergeTimeNs != null)
                        if ($util.Long)
                            (message.mergeTimeNs = $util.Long.fromValue(object.mergeTimeNs)).unsigned = false;
                        else if (typeof object.mergeTimeNs === "string")
                            message.mergeTimeNs = parseInt(object.mergeTimeNs, 10);
                        else if (typeof object.mergeTimeNs === "number")
                            message.mergeTimeNs = object.mergeTimeNs;
                        else if (typeof object.mergeTimeNs === "object")
                            message.mergeTimeNs = new $util.LongBits(object.mergeTimeNs.low >>> 0, object.mergeTimeNs.high >>> 0).toNumber();
                    if (object.mergeRequestTimeNs != null)
                        if ($util.Long)
                            (message.mergeRequestTimeNs = $util.Long.fromValue(object.mergeRequestTimeNs)).unsigned = false;
                        else if (typeof object.mergeRequestTimeNs === "string")
                            message.mergeRequestTimeNs = parseInt(object.mergeRequestTimeNs, 10);
                        else if (typeof object.mergeRequestTimeNs === "number")
                            message.mergeRequestTimeNs = object.mergeRequestTimeNs;
                        else if (typeof object.mergeRequestTimeNs === "object")
                            message.mergeRequestTimeNs = new $util.LongBits(object.mergeRequestTimeNs.low >>> 0, object.mergeRequestTimeNs.high >>> 0).toNumber();
                    if (object.shellAbortTimeNs != null)
                        if ($util.Long)
                            (message.shellAbortTimeNs = $util.Long.fromValue(object.shellAbortTimeNs)).unsigned = false;
                        else if (typeof object.shellAbortTimeNs === "string")
                            message.shellAbortTimeNs = parseInt(object.shellAbortTimeNs, 10);
                        else if (typeof object.shellAbortTimeNs === "number")
                            message.shellAbortTimeNs = object.shellAbortTimeNs;
                        else if (typeof object.shellAbortTimeNs === "object")
                            message.shellAbortTimeNs = new $util.LongBits(object.shellAbortTimeNs.low >>> 0, object.shellAbortTimeNs.high >>> 0).toNumber();
                    if (object.wmAbortTimeNs != null)
                        if ($util.Long)
                            (message.wmAbortTimeNs = $util.Long.fromValue(object.wmAbortTimeNs)).unsigned = false;
                        else if (typeof object.wmAbortTimeNs === "string")
                            message.wmAbortTimeNs = parseInt(object.wmAbortTimeNs, 10);
                        else if (typeof object.wmAbortTimeNs === "number")
                            message.wmAbortTimeNs = object.wmAbortTimeNs;
                        else if (typeof object.wmAbortTimeNs === "object")
                            message.wmAbortTimeNs = new $util.LongBits(object.wmAbortTimeNs.low >>> 0, object.wmAbortTimeNs.high >>> 0).toNumber();
                    if (object.finishTimeNs != null)
                        if ($util.Long)
                            (message.finishTimeNs = $util.Long.fromValue(object.finishTimeNs)).unsigned = false;
                        else if (typeof object.finishTimeNs === "string")
                            message.finishTimeNs = parseInt(object.finishTimeNs, 10);
                        else if (typeof object.finishTimeNs === "number")
                            message.finishTimeNs = object.finishTimeNs;
                        else if (typeof object.finishTimeNs === "object")
                            message.finishTimeNs = new $util.LongBits(object.finishTimeNs.low >>> 0, object.finishTimeNs.high >>> 0).toNumber();
                    if (object.startTransactionId != null)
                        if ($util.Long)
                            (message.startTransactionId = $util.Long.fromValue(object.startTransactionId)).unsigned = true;
                        else if (typeof object.startTransactionId === "string")
                            message.startTransactionId = parseInt(object.startTransactionId, 10);
                        else if (typeof object.startTransactionId === "number")
                            message.startTransactionId = object.startTransactionId;
                        else if (typeof object.startTransactionId === "object")
                            message.startTransactionId = new $util.LongBits(object.startTransactionId.low >>> 0, object.startTransactionId.high >>> 0).toNumber(true);
                    if (object.finishTransactionId != null)
                        if ($util.Long)
                            (message.finishTransactionId = $util.Long.fromValue(object.finishTransactionId)).unsigned = true;
                        else if (typeof object.finishTransactionId === "string")
                            message.finishTransactionId = parseInt(object.finishTransactionId, 10);
                        else if (typeof object.finishTransactionId === "number")
                            message.finishTransactionId = object.finishTransactionId;
                        else if (typeof object.finishTransactionId === "object")
                            message.finishTransactionId = new $util.LongBits(object.finishTransactionId.low >>> 0, object.finishTransactionId.high >>> 0).toNumber(true);
                    if (object.handler != null)
                        message.handler = object.handler | 0;
                    if (object.type != null)
                        message.type = object.type | 0;
                    if (object.targets) {
                        if (!Array.isArray(object.targets))
                            throw TypeError(".perfetto.protos.ShellTransition.targets: array expected");
                        message.targets = [];
                        for (var i = 0; i < object.targets.length; ++i) {
                            if (typeof object.targets[i] !== "object")
                                throw TypeError(".perfetto.protos.ShellTransition.targets: object expected");
                            message.targets[i] = $root.perfetto.protos.ShellTransition.Target.fromObject(object.targets[i]);
                        }
                    }
                    if (object.mergeTarget != null)
                        message.mergeTarget = object.mergeTarget | 0;
                    if (object.flags != null)
                        message.flags = object.flags | 0;
                    if (object.startingWindowRemoveTimeNs != null)
                        if ($util.Long)
                            (message.startingWindowRemoveTimeNs = $util.Long.fromValue(object.startingWindowRemoveTimeNs)).unsigned = false;
                        else if (typeof object.startingWindowRemoveTimeNs === "string")
                            message.startingWindowRemoveTimeNs = parseInt(object.startingWindowRemoveTimeNs, 10);
                        else if (typeof object.startingWindowRemoveTimeNs === "number")
                            message.startingWindowRemoveTimeNs = object.startingWindowRemoveTimeNs;
                        else if (typeof object.startingWindowRemoveTimeNs === "object")
                            message.startingWindowRemoveTimeNs = new $util.LongBits(object.startingWindowRemoveTimeNs.low >>> 0, object.startingWindowRemoveTimeNs.high >>> 0).toNumber();
                    return message;
                };
    
                /**
                 * Creates a plain object from a ShellTransition message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.ShellTransition
                 * @static
                 * @param {perfetto.protos.ShellTransition} message ShellTransition
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ShellTransition.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.targets = [];
                    if (options.defaults) {
                        object.id = 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.createTimeNs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.createTimeNs = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.sendTimeNs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.sendTimeNs = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.dispatchTimeNs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.dispatchTimeNs = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.mergeTimeNs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.mergeTimeNs = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.mergeRequestTimeNs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.mergeRequestTimeNs = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.shellAbortTimeNs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.shellAbortTimeNs = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.wmAbortTimeNs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.wmAbortTimeNs = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.finishTimeNs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.finishTimeNs = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.startTransactionId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.startTransactionId = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.finishTransactionId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.finishTransactionId = options.longs === String ? "0" : 0;
                        object.handler = 0;
                        object.type = 0;
                        object.mergeTarget = 0;
                        object.flags = 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.startingWindowRemoveTimeNs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.startingWindowRemoveTimeNs = options.longs === String ? "0" : 0;
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.createTimeNs != null && message.hasOwnProperty("createTimeNs"))
                        if (typeof message.createTimeNs === "number")
                            object.createTimeNs = options.longs === String ? String(message.createTimeNs) : message.createTimeNs;
                        else
                            object.createTimeNs = options.longs === String ? $util.Long.prototype.toString.call(message.createTimeNs) : options.longs === Number ? new $util.LongBits(message.createTimeNs.low >>> 0, message.createTimeNs.high >>> 0).toNumber() : message.createTimeNs;
                    if (message.sendTimeNs != null && message.hasOwnProperty("sendTimeNs"))
                        if (typeof message.sendTimeNs === "number")
                            object.sendTimeNs = options.longs === String ? String(message.sendTimeNs) : message.sendTimeNs;
                        else
                            object.sendTimeNs = options.longs === String ? $util.Long.prototype.toString.call(message.sendTimeNs) : options.longs === Number ? new $util.LongBits(message.sendTimeNs.low >>> 0, message.sendTimeNs.high >>> 0).toNumber() : message.sendTimeNs;
                    if (message.dispatchTimeNs != null && message.hasOwnProperty("dispatchTimeNs"))
                        if (typeof message.dispatchTimeNs === "number")
                            object.dispatchTimeNs = options.longs === String ? String(message.dispatchTimeNs) : message.dispatchTimeNs;
                        else
                            object.dispatchTimeNs = options.longs === String ? $util.Long.prototype.toString.call(message.dispatchTimeNs) : options.longs === Number ? new $util.LongBits(message.dispatchTimeNs.low >>> 0, message.dispatchTimeNs.high >>> 0).toNumber() : message.dispatchTimeNs;
                    if (message.mergeTimeNs != null && message.hasOwnProperty("mergeTimeNs"))
                        if (typeof message.mergeTimeNs === "number")
                            object.mergeTimeNs = options.longs === String ? String(message.mergeTimeNs) : message.mergeTimeNs;
                        else
                            object.mergeTimeNs = options.longs === String ? $util.Long.prototype.toString.call(message.mergeTimeNs) : options.longs === Number ? new $util.LongBits(message.mergeTimeNs.low >>> 0, message.mergeTimeNs.high >>> 0).toNumber() : message.mergeTimeNs;
                    if (message.mergeRequestTimeNs != null && message.hasOwnProperty("mergeRequestTimeNs"))
                        if (typeof message.mergeRequestTimeNs === "number")
                            object.mergeRequestTimeNs = options.longs === String ? String(message.mergeRequestTimeNs) : message.mergeRequestTimeNs;
                        else
                            object.mergeRequestTimeNs = options.longs === String ? $util.Long.prototype.toString.call(message.mergeRequestTimeNs) : options.longs === Number ? new $util.LongBits(message.mergeRequestTimeNs.low >>> 0, message.mergeRequestTimeNs.high >>> 0).toNumber() : message.mergeRequestTimeNs;
                    if (message.shellAbortTimeNs != null && message.hasOwnProperty("shellAbortTimeNs"))
                        if (typeof message.shellAbortTimeNs === "number")
                            object.shellAbortTimeNs = options.longs === String ? String(message.shellAbortTimeNs) : message.shellAbortTimeNs;
                        else
                            object.shellAbortTimeNs = options.longs === String ? $util.Long.prototype.toString.call(message.shellAbortTimeNs) : options.longs === Number ? new $util.LongBits(message.shellAbortTimeNs.low >>> 0, message.shellAbortTimeNs.high >>> 0).toNumber() : message.shellAbortTimeNs;
                    if (message.wmAbortTimeNs != null && message.hasOwnProperty("wmAbortTimeNs"))
                        if (typeof message.wmAbortTimeNs === "number")
                            object.wmAbortTimeNs = options.longs === String ? String(message.wmAbortTimeNs) : message.wmAbortTimeNs;
                        else
                            object.wmAbortTimeNs = options.longs === String ? $util.Long.prototype.toString.call(message.wmAbortTimeNs) : options.longs === Number ? new $util.LongBits(message.wmAbortTimeNs.low >>> 0, message.wmAbortTimeNs.high >>> 0).toNumber() : message.wmAbortTimeNs;
                    if (message.finishTimeNs != null && message.hasOwnProperty("finishTimeNs"))
                        if (typeof message.finishTimeNs === "number")
                            object.finishTimeNs = options.longs === String ? String(message.finishTimeNs) : message.finishTimeNs;
                        else
                            object.finishTimeNs = options.longs === String ? $util.Long.prototype.toString.call(message.finishTimeNs) : options.longs === Number ? new $util.LongBits(message.finishTimeNs.low >>> 0, message.finishTimeNs.high >>> 0).toNumber() : message.finishTimeNs;
                    if (message.startTransactionId != null && message.hasOwnProperty("startTransactionId"))
                        if (typeof message.startTransactionId === "number")
                            object.startTransactionId = options.longs === String ? String(message.startTransactionId) : message.startTransactionId;
                        else
                            object.startTransactionId = options.longs === String ? $util.Long.prototype.toString.call(message.startTransactionId) : options.longs === Number ? new $util.LongBits(message.startTransactionId.low >>> 0, message.startTransactionId.high >>> 0).toNumber(true) : message.startTransactionId;
                    if (message.finishTransactionId != null && message.hasOwnProperty("finishTransactionId"))
                        if (typeof message.finishTransactionId === "number")
                            object.finishTransactionId = options.longs === String ? String(message.finishTransactionId) : message.finishTransactionId;
                        else
                            object.finishTransactionId = options.longs === String ? $util.Long.prototype.toString.call(message.finishTransactionId) : options.longs === Number ? new $util.LongBits(message.finishTransactionId.low >>> 0, message.finishTransactionId.high >>> 0).toNumber(true) : message.finishTransactionId;
                    if (message.handler != null && message.hasOwnProperty("handler"))
                        object.handler = message.handler;
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = message.type;
                    if (message.targets && message.targets.length) {
                        object.targets = [];
                        for (var j = 0; j < message.targets.length; ++j)
                            object.targets[j] = $root.perfetto.protos.ShellTransition.Target.toObject(message.targets[j], options);
                    }
                    if (message.mergeTarget != null && message.hasOwnProperty("mergeTarget"))
                        object.mergeTarget = message.mergeTarget;
                    if (message.flags != null && message.hasOwnProperty("flags"))
                        object.flags = message.flags;
                    if (message.startingWindowRemoveTimeNs != null && message.hasOwnProperty("startingWindowRemoveTimeNs"))
                        if (typeof message.startingWindowRemoveTimeNs === "number")
                            object.startingWindowRemoveTimeNs = options.longs === String ? String(message.startingWindowRemoveTimeNs) : message.startingWindowRemoveTimeNs;
                        else
                            object.startingWindowRemoveTimeNs = options.longs === String ? $util.Long.prototype.toString.call(message.startingWindowRemoveTimeNs) : options.longs === Number ? new $util.LongBits(message.startingWindowRemoveTimeNs.low >>> 0, message.startingWindowRemoveTimeNs.high >>> 0).toNumber() : message.startingWindowRemoveTimeNs;
                    return object;
                };
    
                /**
                 * Converts this ShellTransition to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.ShellTransition
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ShellTransition.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for ShellTransition
                 * @function getTypeUrl
                 * @memberof perfetto.protos.ShellTransition
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                ShellTransition.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.ShellTransition";
                };
    
                ShellTransition.Target = (function() {
    
                    /**
                     * Properties of a Target.
                     * @memberof perfetto.protos.ShellTransition
                     * @interface ITarget
                     * @property {number|null} [mode] Target mode
                     * @property {number|null} [layerId] Target layerId
                     * @property {number|null} [windowId] Target windowId
                     * @property {number|null} [flags] Target flags
                     */
    
                    /**
                     * Constructs a new Target.
                     * @memberof perfetto.protos.ShellTransition
                     * @classdesc Represents a Target.
                     * @implements ITarget
                     * @constructor
                     * @param {perfetto.protos.ShellTransition.ITarget=} [properties] Properties to set
                     */
                    function Target(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * Target mode.
                     * @member {number} mode
                     * @memberof perfetto.protos.ShellTransition.Target
                     * @instance
                     */
                    Target.prototype.mode = 0;
    
                    /**
                     * Target layerId.
                     * @member {number} layerId
                     * @memberof perfetto.protos.ShellTransition.Target
                     * @instance
                     */
                    Target.prototype.layerId = 0;
    
                    /**
                     * Target windowId.
                     * @member {number} windowId
                     * @memberof perfetto.protos.ShellTransition.Target
                     * @instance
                     */
                    Target.prototype.windowId = 0;
    
                    /**
                     * Target flags.
                     * @member {number} flags
                     * @memberof perfetto.protos.ShellTransition.Target
                     * @instance
                     */
                    Target.prototype.flags = 0;
    
                    /**
                     * Creates a new Target instance using the specified properties.
                     * @function create
                     * @memberof perfetto.protos.ShellTransition.Target
                     * @static
                     * @param {perfetto.protos.ShellTransition.ITarget=} [properties] Properties to set
                     * @returns {perfetto.protos.ShellTransition.Target} Target instance
                     */
                    Target.create = function create(properties) {
                        return new Target(properties);
                    };
    
                    /**
                     * Encodes the specified Target message. Does not implicitly {@link perfetto.protos.ShellTransition.Target.verify|verify} messages.
                     * @function encode
                     * @memberof perfetto.protos.ShellTransition.Target
                     * @static
                     * @param {perfetto.protos.ShellTransition.ITarget} message Target message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Target.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.mode != null && Object.hasOwnProperty.call(message, "mode"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.mode);
                        if (message.layerId != null && Object.hasOwnProperty.call(message, "layerId"))
                            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.layerId);
                        if (message.windowId != null && Object.hasOwnProperty.call(message, "windowId"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.windowId);
                        if (message.flags != null && Object.hasOwnProperty.call(message, "flags"))
                            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.flags);
                        return writer;
                    };
    
                    /**
                     * Encodes the specified Target message, length delimited. Does not implicitly {@link perfetto.protos.ShellTransition.Target.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof perfetto.protos.ShellTransition.Target
                     * @static
                     * @param {perfetto.protos.ShellTransition.ITarget} message Target message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Target.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a Target message from the specified reader or buffer.
                     * @function decode
                     * @memberof perfetto.protos.ShellTransition.Target
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {perfetto.protos.ShellTransition.Target} Target
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Target.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.ShellTransition.Target();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1: {
                                    message.mode = reader.int32();
                                    break;
                                }
                            case 2: {
                                    message.layerId = reader.int32();
                                    break;
                                }
                            case 3: {
                                    message.windowId = reader.int32();
                                    break;
                                }
                            case 4: {
                                    message.flags = reader.int32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };
    
                    /**
                     * Decodes a Target message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof perfetto.protos.ShellTransition.Target
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {perfetto.protos.ShellTransition.Target} Target
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Target.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a Target message.
                     * @function verify
                     * @memberof perfetto.protos.ShellTransition.Target
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Target.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.mode != null && message.hasOwnProperty("mode"))
                            if (!$util.isInteger(message.mode))
                                return "mode: integer expected";
                        if (message.layerId != null && message.hasOwnProperty("layerId"))
                            if (!$util.isInteger(message.layerId))
                                return "layerId: integer expected";
                        if (message.windowId != null && message.hasOwnProperty("windowId"))
                            if (!$util.isInteger(message.windowId))
                                return "windowId: integer expected";
                        if (message.flags != null && message.hasOwnProperty("flags"))
                            if (!$util.isInteger(message.flags))
                                return "flags: integer expected";
                        return null;
                    };
    
                    /**
                     * Creates a Target message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof perfetto.protos.ShellTransition.Target
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {perfetto.protos.ShellTransition.Target} Target
                     */
                    Target.fromObject = function fromObject(object) {
                        if (object instanceof $root.perfetto.protos.ShellTransition.Target)
                            return object;
                        var message = new $root.perfetto.protos.ShellTransition.Target();
                        if (object.mode != null)
                            message.mode = object.mode | 0;
                        if (object.layerId != null)
                            message.layerId = object.layerId | 0;
                        if (object.windowId != null)
                            message.windowId = object.windowId | 0;
                        if (object.flags != null)
                            message.flags = object.flags | 0;
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a Target message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof perfetto.protos.ShellTransition.Target
                     * @static
                     * @param {perfetto.protos.ShellTransition.Target} message Target
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Target.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.mode = 0;
                            object.layerId = 0;
                            object.windowId = 0;
                            object.flags = 0;
                        }
                        if (message.mode != null && message.hasOwnProperty("mode"))
                            object.mode = message.mode;
                        if (message.layerId != null && message.hasOwnProperty("layerId"))
                            object.layerId = message.layerId;
                        if (message.windowId != null && message.hasOwnProperty("windowId"))
                            object.windowId = message.windowId;
                        if (message.flags != null && message.hasOwnProperty("flags"))
                            object.flags = message.flags;
                        return object;
                    };
    
                    /**
                     * Converts this Target to JSON.
                     * @function toJSON
                     * @memberof perfetto.protos.ShellTransition.Target
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Target.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    /**
                     * Gets the default type url for Target
                     * @function getTypeUrl
                     * @memberof perfetto.protos.ShellTransition.Target
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    Target.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/perfetto.protos.ShellTransition.Target";
                    };
    
                    return Target;
                })();
    
                return ShellTransition;
            })();
    
            protos.ShellHandlerMappings = (function() {
    
                /**
                 * Properties of a ShellHandlerMappings.
                 * @memberof perfetto.protos
                 * @interface IShellHandlerMappings
                 * @property {Array.<perfetto.protos.IShellHandlerMapping>|null} [mapping] ShellHandlerMappings mapping
                 */
    
                /**
                 * Constructs a new ShellHandlerMappings.
                 * @memberof perfetto.protos
                 * @classdesc Represents a ShellHandlerMappings.
                 * @implements IShellHandlerMappings
                 * @constructor
                 * @param {perfetto.protos.IShellHandlerMappings=} [properties] Properties to set
                 */
                function ShellHandlerMappings(properties) {
                    this.mapping = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ShellHandlerMappings mapping.
                 * @member {Array.<perfetto.protos.IShellHandlerMapping>} mapping
                 * @memberof perfetto.protos.ShellHandlerMappings
                 * @instance
                 */
                ShellHandlerMappings.prototype.mapping = $util.emptyArray;
    
                /**
                 * Creates a new ShellHandlerMappings instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.ShellHandlerMappings
                 * @static
                 * @param {perfetto.protos.IShellHandlerMappings=} [properties] Properties to set
                 * @returns {perfetto.protos.ShellHandlerMappings} ShellHandlerMappings instance
                 */
                ShellHandlerMappings.create = function create(properties) {
                    return new ShellHandlerMappings(properties);
                };
    
                /**
                 * Encodes the specified ShellHandlerMappings message. Does not implicitly {@link perfetto.protos.ShellHandlerMappings.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.ShellHandlerMappings
                 * @static
                 * @param {perfetto.protos.IShellHandlerMappings} message ShellHandlerMappings message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ShellHandlerMappings.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.mapping != null && message.mapping.length)
                        for (var i = 0; i < message.mapping.length; ++i)
                            $root.perfetto.protos.ShellHandlerMapping.encode(message.mapping[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified ShellHandlerMappings message, length delimited. Does not implicitly {@link perfetto.protos.ShellHandlerMappings.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.ShellHandlerMappings
                 * @static
                 * @param {perfetto.protos.IShellHandlerMappings} message ShellHandlerMappings message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ShellHandlerMappings.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a ShellHandlerMappings message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.ShellHandlerMappings
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.ShellHandlerMappings} ShellHandlerMappings
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ShellHandlerMappings.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.ShellHandlerMappings();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                if (!(message.mapping && message.mapping.length))
                                    message.mapping = [];
                                message.mapping.push($root.perfetto.protos.ShellHandlerMapping.decode(reader, reader.uint32()));
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a ShellHandlerMappings message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.ShellHandlerMappings
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.ShellHandlerMappings} ShellHandlerMappings
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ShellHandlerMappings.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a ShellHandlerMappings message.
                 * @function verify
                 * @memberof perfetto.protos.ShellHandlerMappings
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ShellHandlerMappings.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.mapping != null && message.hasOwnProperty("mapping")) {
                        if (!Array.isArray(message.mapping))
                            return "mapping: array expected";
                        for (var i = 0; i < message.mapping.length; ++i) {
                            var error = $root.perfetto.protos.ShellHandlerMapping.verify(message.mapping[i]);
                            if (error)
                                return "mapping." + error;
                        }
                    }
                    return null;
                };
    
                /**
                 * Creates a ShellHandlerMappings message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.ShellHandlerMappings
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.ShellHandlerMappings} ShellHandlerMappings
                 */
                ShellHandlerMappings.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.ShellHandlerMappings)
                        return object;
                    var message = new $root.perfetto.protos.ShellHandlerMappings();
                    if (object.mapping) {
                        if (!Array.isArray(object.mapping))
                            throw TypeError(".perfetto.protos.ShellHandlerMappings.mapping: array expected");
                        message.mapping = [];
                        for (var i = 0; i < object.mapping.length; ++i) {
                            if (typeof object.mapping[i] !== "object")
                                throw TypeError(".perfetto.protos.ShellHandlerMappings.mapping: object expected");
                            message.mapping[i] = $root.perfetto.protos.ShellHandlerMapping.fromObject(object.mapping[i]);
                        }
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from a ShellHandlerMappings message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.ShellHandlerMappings
                 * @static
                 * @param {perfetto.protos.ShellHandlerMappings} message ShellHandlerMappings
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ShellHandlerMappings.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.mapping = [];
                    if (message.mapping && message.mapping.length) {
                        object.mapping = [];
                        for (var j = 0; j < message.mapping.length; ++j)
                            object.mapping[j] = $root.perfetto.protos.ShellHandlerMapping.toObject(message.mapping[j], options);
                    }
                    return object;
                };
    
                /**
                 * Converts this ShellHandlerMappings to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.ShellHandlerMappings
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ShellHandlerMappings.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for ShellHandlerMappings
                 * @function getTypeUrl
                 * @memberof perfetto.protos.ShellHandlerMappings
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                ShellHandlerMappings.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.ShellHandlerMappings";
                };
    
                return ShellHandlerMappings;
            })();
    
            protos.ShellHandlerMapping = (function() {
    
                /**
                 * Properties of a ShellHandlerMapping.
                 * @memberof perfetto.protos
                 * @interface IShellHandlerMapping
                 * @property {number|null} [id] ShellHandlerMapping id
                 * @property {string|null} [name] ShellHandlerMapping name
                 */
    
                /**
                 * Constructs a new ShellHandlerMapping.
                 * @memberof perfetto.protos
                 * @classdesc Represents a ShellHandlerMapping.
                 * @implements IShellHandlerMapping
                 * @constructor
                 * @param {perfetto.protos.IShellHandlerMapping=} [properties] Properties to set
                 */
                function ShellHandlerMapping(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ShellHandlerMapping id.
                 * @member {number} id
                 * @memberof perfetto.protos.ShellHandlerMapping
                 * @instance
                 */
                ShellHandlerMapping.prototype.id = 0;
    
                /**
                 * ShellHandlerMapping name.
                 * @member {string} name
                 * @memberof perfetto.protos.ShellHandlerMapping
                 * @instance
                 */
                ShellHandlerMapping.prototype.name = "";
    
                /**
                 * Creates a new ShellHandlerMapping instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.ShellHandlerMapping
                 * @static
                 * @param {perfetto.protos.IShellHandlerMapping=} [properties] Properties to set
                 * @returns {perfetto.protos.ShellHandlerMapping} ShellHandlerMapping instance
                 */
                ShellHandlerMapping.create = function create(properties) {
                    return new ShellHandlerMapping(properties);
                };
    
                /**
                 * Encodes the specified ShellHandlerMapping message. Does not implicitly {@link perfetto.protos.ShellHandlerMapping.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.ShellHandlerMapping
                 * @static
                 * @param {perfetto.protos.IShellHandlerMapping} message ShellHandlerMapping message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ShellHandlerMapping.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                    return writer;
                };
    
                /**
                 * Encodes the specified ShellHandlerMapping message, length delimited. Does not implicitly {@link perfetto.protos.ShellHandlerMapping.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.ShellHandlerMapping
                 * @static
                 * @param {perfetto.protos.IShellHandlerMapping} message ShellHandlerMapping message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ShellHandlerMapping.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a ShellHandlerMapping message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.ShellHandlerMapping
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.ShellHandlerMapping} ShellHandlerMapping
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ShellHandlerMapping.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.ShellHandlerMapping();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.id = reader.int32();
                                break;
                            }
                        case 2: {
                                message.name = reader.string();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a ShellHandlerMapping message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.ShellHandlerMapping
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.ShellHandlerMapping} ShellHandlerMapping
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ShellHandlerMapping.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a ShellHandlerMapping message.
                 * @function verify
                 * @memberof perfetto.protos.ShellHandlerMapping
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ShellHandlerMapping.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isInteger(message.id))
                            return "id: integer expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    return null;
                };
    
                /**
                 * Creates a ShellHandlerMapping message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.ShellHandlerMapping
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.ShellHandlerMapping} ShellHandlerMapping
                 */
                ShellHandlerMapping.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.ShellHandlerMapping)
                        return object;
                    var message = new $root.perfetto.protos.ShellHandlerMapping();
                    if (object.id != null)
                        message.id = object.id | 0;
                    if (object.name != null)
                        message.name = String(object.name);
                    return message;
                };
    
                /**
                 * Creates a plain object from a ShellHandlerMapping message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.ShellHandlerMapping
                 * @static
                 * @param {perfetto.protos.ShellHandlerMapping} message ShellHandlerMapping
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ShellHandlerMapping.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.id = 0;
                        object.name = "";
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    return object;
                };
    
                /**
                 * Converts this ShellHandlerMapping to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.ShellHandlerMapping
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ShellHandlerMapping.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for ShellHandlerMapping
                 * @function getTypeUrl
                 * @memberof perfetto.protos.ShellHandlerMapping
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                ShellHandlerMapping.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.ShellHandlerMapping";
                };
    
                return ShellHandlerMapping;
            })();
    
            return protos;
        })();
    
        return perfetto;
    })();

    return $root;
});
