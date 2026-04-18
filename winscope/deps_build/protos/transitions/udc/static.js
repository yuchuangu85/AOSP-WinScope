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
    var $root = $protobuf.roots.transitionsudc || ($protobuf.roots.transitionsudc = {});
    
    $root.com = (function() {
    
        /**
         * Namespace com.
         * @exports com
         * @namespace
         */
        var com = {};
    
        com.android = (function() {
    
            /**
             * Namespace android.
             * @memberof com
             * @namespace
             */
            var android = {};
    
            android.server = (function() {
    
                /**
                 * Namespace server.
                 * @memberof com.android
                 * @namespace
                 */
                var server = {};
    
                server.wm = (function() {
    
                    /**
                     * Namespace wm.
                     * @memberof com.android.server
                     * @namespace
                     */
                    var wm = {};
    
                    wm.shell = (function() {
    
                        /**
                         * Namespace shell.
                         * @memberof com.android.server.wm
                         * @namespace
                         */
                        var shell = {};
    
                        shell.TransitionTraceProto = (function() {
    
                            /**
                             * Properties of a TransitionTraceProto.
                             * @memberof com.android.server.wm.shell
                             * @interface ITransitionTraceProto
                             * @property {Long} magicNumber TransitionTraceProto magicNumber
                             * @property {Array.<com.android.server.wm.shell.ITransition>|null} [transitions] TransitionTraceProto transitions
                             * @property {Long|null} [realToElapsedTimeOffsetNanos] TransitionTraceProto realToElapsedTimeOffsetNanos
                             */
    
                            /**
                             * Constructs a new TransitionTraceProto.
                             * @memberof com.android.server.wm.shell
                             * @classdesc Represents a TransitionTraceProto.
                             * @implements ITransitionTraceProto
                             * @constructor
                             * @param {com.android.server.wm.shell.ITransitionTraceProto=} [properties] Properties to set
                             */
                            function TransitionTraceProto(properties) {
                                this.transitions = [];
                                if (properties)
                                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null)
                                            this[keys[i]] = properties[keys[i]];
                            }
    
                            /**
                             * TransitionTraceProto magicNumber.
                             * @member {Long} magicNumber
                             * @memberof com.android.server.wm.shell.TransitionTraceProto
                             * @instance
                             */
                            TransitionTraceProto.prototype.magicNumber = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                            /**
                             * TransitionTraceProto transitions.
                             * @member {Array.<com.android.server.wm.shell.ITransition>} transitions
                             * @memberof com.android.server.wm.shell.TransitionTraceProto
                             * @instance
                             */
                            TransitionTraceProto.prototype.transitions = $util.emptyArray;
    
                            /**
                             * TransitionTraceProto realToElapsedTimeOffsetNanos.
                             * @member {Long} realToElapsedTimeOffsetNanos
                             * @memberof com.android.server.wm.shell.TransitionTraceProto
                             * @instance
                             */
                            TransitionTraceProto.prototype.realToElapsedTimeOffsetNanos = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                            /**
                             * Creates a new TransitionTraceProto instance using the specified properties.
                             * @function create
                             * @memberof com.android.server.wm.shell.TransitionTraceProto
                             * @static
                             * @param {com.android.server.wm.shell.ITransitionTraceProto=} [properties] Properties to set
                             * @returns {com.android.server.wm.shell.TransitionTraceProto} TransitionTraceProto instance
                             */
                            TransitionTraceProto.create = function create(properties) {
                                return new TransitionTraceProto(properties);
                            };
    
                            /**
                             * Encodes the specified TransitionTraceProto message. Does not implicitly {@link com.android.server.wm.shell.TransitionTraceProto.verify|verify} messages.
                             * @function encode
                             * @memberof com.android.server.wm.shell.TransitionTraceProto
                             * @static
                             * @param {com.android.server.wm.shell.ITransitionTraceProto} message TransitionTraceProto message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            TransitionTraceProto.encode = function encode(message, writer) {
                                if (!writer)
                                    writer = $Writer.create();
                                writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.magicNumber);
                                if (message.transitions != null && message.transitions.length)
                                    for (var i = 0; i < message.transitions.length; ++i)
                                        $root.com.android.server.wm.shell.Transition.encode(message.transitions[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                                if (message.realToElapsedTimeOffsetNanos != null && Object.hasOwnProperty.call(message, "realToElapsedTimeOffsetNanos"))
                                    writer.uint32(/* id 3, wireType 1 =*/25).fixed64(message.realToElapsedTimeOffsetNanos);
                                return writer;
                            };
    
                            /**
                             * Encodes the specified TransitionTraceProto message, length delimited. Does not implicitly {@link com.android.server.wm.shell.TransitionTraceProto.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof com.android.server.wm.shell.TransitionTraceProto
                             * @static
                             * @param {com.android.server.wm.shell.ITransitionTraceProto} message TransitionTraceProto message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            TransitionTraceProto.encodeDelimited = function encodeDelimited(message, writer) {
                                return this.encode(message, writer).ldelim();
                            };
    
                            /**
                             * Decodes a TransitionTraceProto message from the specified reader or buffer.
                             * @function decode
                             * @memberof com.android.server.wm.shell.TransitionTraceProto
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {com.android.server.wm.shell.TransitionTraceProto} TransitionTraceProto
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            TransitionTraceProto.decode = function decode(reader, length) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.android.server.wm.shell.TransitionTraceProto();
                                while (reader.pos < end) {
                                    var tag = reader.uint32();
                                    switch (tag >>> 3) {
                                    case 1: {
                                            message.magicNumber = reader.fixed64();
                                            break;
                                        }
                                    case 2: {
                                            if (!(message.transitions && message.transitions.length))
                                                message.transitions = [];
                                            message.transitions.push($root.com.android.server.wm.shell.Transition.decode(reader, reader.uint32()));
                                            break;
                                        }
                                    case 3: {
                                            message.realToElapsedTimeOffsetNanos = reader.fixed64();
                                            break;
                                        }
                                    default:
                                        reader.skipType(tag & 7);
                                        break;
                                    }
                                }
                                if (!message.hasOwnProperty("magicNumber"))
                                    throw $util.ProtocolError("missing required 'magicNumber'", { instance: message });
                                return message;
                            };
    
                            /**
                             * Decodes a TransitionTraceProto message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof com.android.server.wm.shell.TransitionTraceProto
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {com.android.server.wm.shell.TransitionTraceProto} TransitionTraceProto
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            TransitionTraceProto.decodeDelimited = function decodeDelimited(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.uint32());
                            };
    
                            /**
                             * Verifies a TransitionTraceProto message.
                             * @function verify
                             * @memberof com.android.server.wm.shell.TransitionTraceProto
                             * @static
                             * @param {Object.<string,*>} message Plain object to verify
                             * @returns {string|null} `null` if valid, otherwise the reason why it is not
                             */
                            TransitionTraceProto.verify = function verify(message) {
                                if (typeof message !== "object" || message === null)
                                    return "object expected";
                                if (!$util.isInteger(message.magicNumber) && !(message.magicNumber && $util.isInteger(message.magicNumber.low) && $util.isInteger(message.magicNumber.high)))
                                    return "magicNumber: integer|Long expected";
                                if (message.transitions != null && message.hasOwnProperty("transitions")) {
                                    if (!Array.isArray(message.transitions))
                                        return "transitions: array expected";
                                    for (var i = 0; i < message.transitions.length; ++i) {
                                        var error = $root.com.android.server.wm.shell.Transition.verify(message.transitions[i]);
                                        if (error)
                                            return "transitions." + error;
                                    }
                                }
                                if (message.realToElapsedTimeOffsetNanos != null && message.hasOwnProperty("realToElapsedTimeOffsetNanos"))
                                    if (!$util.isInteger(message.realToElapsedTimeOffsetNanos) && !(message.realToElapsedTimeOffsetNanos && $util.isInteger(message.realToElapsedTimeOffsetNanos.low) && $util.isInteger(message.realToElapsedTimeOffsetNanos.high)))
                                        return "realToElapsedTimeOffsetNanos: integer|Long expected";
                                return null;
                            };
    
                            /**
                             * Creates a TransitionTraceProto message from a plain object. Also converts values to their respective internal types.
                             * @function fromObject
                             * @memberof com.android.server.wm.shell.TransitionTraceProto
                             * @static
                             * @param {Object.<string,*>} object Plain object
                             * @returns {com.android.server.wm.shell.TransitionTraceProto} TransitionTraceProto
                             */
                            TransitionTraceProto.fromObject = function fromObject(object) {
                                if (object instanceof $root.com.android.server.wm.shell.TransitionTraceProto)
                                    return object;
                                var message = new $root.com.android.server.wm.shell.TransitionTraceProto();
                                if (object.magicNumber != null)
                                    if ($util.Long)
                                        (message.magicNumber = $util.Long.fromValue(object.magicNumber)).unsigned = false;
                                    else if (typeof object.magicNumber === "string")
                                        message.magicNumber = parseInt(object.magicNumber, 10);
                                    else if (typeof object.magicNumber === "number")
                                        message.magicNumber = object.magicNumber;
                                    else if (typeof object.magicNumber === "object")
                                        message.magicNumber = new $util.LongBits(object.magicNumber.low >>> 0, object.magicNumber.high >>> 0).toNumber();
                                if (object.transitions) {
                                    if (!Array.isArray(object.transitions))
                                        throw TypeError(".com.android.server.wm.shell.TransitionTraceProto.transitions: array expected");
                                    message.transitions = [];
                                    for (var i = 0; i < object.transitions.length; ++i) {
                                        if (typeof object.transitions[i] !== "object")
                                            throw TypeError(".com.android.server.wm.shell.TransitionTraceProto.transitions: object expected");
                                        message.transitions[i] = $root.com.android.server.wm.shell.Transition.fromObject(object.transitions[i]);
                                    }
                                }
                                if (object.realToElapsedTimeOffsetNanos != null)
                                    if ($util.Long)
                                        (message.realToElapsedTimeOffsetNanos = $util.Long.fromValue(object.realToElapsedTimeOffsetNanos)).unsigned = false;
                                    else if (typeof object.realToElapsedTimeOffsetNanos === "string")
                                        message.realToElapsedTimeOffsetNanos = parseInt(object.realToElapsedTimeOffsetNanos, 10);
                                    else if (typeof object.realToElapsedTimeOffsetNanos === "number")
                                        message.realToElapsedTimeOffsetNanos = object.realToElapsedTimeOffsetNanos;
                                    else if (typeof object.realToElapsedTimeOffsetNanos === "object")
                                        message.realToElapsedTimeOffsetNanos = new $util.LongBits(object.realToElapsedTimeOffsetNanos.low >>> 0, object.realToElapsedTimeOffsetNanos.high >>> 0).toNumber();
                                return message;
                            };
    
                            /**
                             * Creates a plain object from a TransitionTraceProto message. Also converts values to other types if specified.
                             * @function toObject
                             * @memberof com.android.server.wm.shell.TransitionTraceProto
                             * @static
                             * @param {com.android.server.wm.shell.TransitionTraceProto} message TransitionTraceProto
                             * @param {$protobuf.IConversionOptions} [options] Conversion options
                             * @returns {Object.<string,*>} Plain object
                             */
                            TransitionTraceProto.toObject = function toObject(message, options) {
                                if (!options)
                                    options = {};
                                var object = {};
                                if (options.arrays || options.defaults)
                                    object.transitions = [];
                                if (options.defaults) {
                                    if ($util.Long) {
                                        var long = new $util.Long(0, 0, false);
                                        object.magicNumber = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                    } else
                                        object.magicNumber = options.longs === String ? "0" : 0;
                                    if ($util.Long) {
                                        var long = new $util.Long(0, 0, false);
                                        object.realToElapsedTimeOffsetNanos = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                    } else
                                        object.realToElapsedTimeOffsetNanos = options.longs === String ? "0" : 0;
                                }
                                if (message.magicNumber != null && message.hasOwnProperty("magicNumber"))
                                    if (typeof message.magicNumber === "number")
                                        object.magicNumber = options.longs === String ? String(message.magicNumber) : message.magicNumber;
                                    else
                                        object.magicNumber = options.longs === String ? $util.Long.prototype.toString.call(message.magicNumber) : options.longs === Number ? new $util.LongBits(message.magicNumber.low >>> 0, message.magicNumber.high >>> 0).toNumber() : message.magicNumber;
                                if (message.transitions && message.transitions.length) {
                                    object.transitions = [];
                                    for (var j = 0; j < message.transitions.length; ++j)
                                        object.transitions[j] = $root.com.android.server.wm.shell.Transition.toObject(message.transitions[j], options);
                                }
                                if (message.realToElapsedTimeOffsetNanos != null && message.hasOwnProperty("realToElapsedTimeOffsetNanos"))
                                    if (typeof message.realToElapsedTimeOffsetNanos === "number")
                                        object.realToElapsedTimeOffsetNanos = options.longs === String ? String(message.realToElapsedTimeOffsetNanos) : message.realToElapsedTimeOffsetNanos;
                                    else
                                        object.realToElapsedTimeOffsetNanos = options.longs === String ? $util.Long.prototype.toString.call(message.realToElapsedTimeOffsetNanos) : options.longs === Number ? new $util.LongBits(message.realToElapsedTimeOffsetNanos.low >>> 0, message.realToElapsedTimeOffsetNanos.high >>> 0).toNumber() : message.realToElapsedTimeOffsetNanos;
                                return object;
                            };
    
                            /**
                             * Converts this TransitionTraceProto to JSON.
                             * @function toJSON
                             * @memberof com.android.server.wm.shell.TransitionTraceProto
                             * @instance
                             * @returns {Object.<string,*>} JSON object
                             */
                            TransitionTraceProto.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                            };
    
                            /**
                             * Gets the default type url for TransitionTraceProto
                             * @function getTypeUrl
                             * @memberof com.android.server.wm.shell.TransitionTraceProto
                             * @static
                             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                             * @returns {string} The default type url
                             */
                            TransitionTraceProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                if (typeUrlPrefix === undefined) {
                                    typeUrlPrefix = "type.googleapis.com";
                                }
                                return typeUrlPrefix + "/com.android.server.wm.shell.TransitionTraceProto";
                            };
    
                            /**
                             * MagicNumber enum.
                             * @name com.android.server.wm.shell.TransitionTraceProto.MagicNumber
                             * @enum {number}
                             * @property {number} INVALID=0 INVALID value
                             * @property {number} MAGIC_NUMBER_L=1414419028 MAGIC_NUMBER_L value
                             * @property {number} MAGIC_NUMBER_H=1162035538 MAGIC_NUMBER_H value
                             */
                            TransitionTraceProto.MagicNumber = (function() {
                                var valuesById = {}, values = Object.create(valuesById);
                                values[valuesById[0] = "INVALID"] = 0;
                                values[valuesById[1414419028] = "MAGIC_NUMBER_L"] = 1414419028;
                                values[valuesById[1162035538] = "MAGIC_NUMBER_H"] = 1162035538;
                                return values;
                            })();
    
                            return TransitionTraceProto;
                        })();
    
                        shell.Transition = (function() {
    
                            /**
                             * Properties of a Transition.
                             * @memberof com.android.server.wm.shell
                             * @interface ITransition
                             * @property {number} id Transition id
                             * @property {Long|null} [startTransactionId] Transition startTransactionId
                             * @property {Long|null} [finishTransactionId] Transition finishTransactionId
                             * @property {Long|null} [createTimeNs] Transition createTimeNs
                             * @property {Long|null} [sendTimeNs] Transition sendTimeNs
                             * @property {Long|null} [finishTimeNs] Transition finishTimeNs
                             * @property {number|null} [type] Transition type
                             * @property {Array.<com.android.server.wm.shell.ITarget>|null} [targets] Transition targets
                             * @property {number|null} [flags] Transition flags
                             * @property {Long|null} [abortTimeNs] Transition abortTimeNs
                             * @property {Long|null} [startingWindowRemoveTimeNs] Transition startingWindowRemoveTimeNs
                             */
    
                            /**
                             * Constructs a new Transition.
                             * @memberof com.android.server.wm.shell
                             * @classdesc Represents a Transition.
                             * @implements ITransition
                             * @constructor
                             * @param {com.android.server.wm.shell.ITransition=} [properties] Properties to set
                             */
                            function Transition(properties) {
                                this.targets = [];
                                if (properties)
                                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null)
                                            this[keys[i]] = properties[keys[i]];
                            }
    
                            /**
                             * Transition id.
                             * @member {number} id
                             * @memberof com.android.server.wm.shell.Transition
                             * @instance
                             */
                            Transition.prototype.id = 0;
    
                            /**
                             * Transition startTransactionId.
                             * @member {Long} startTransactionId
                             * @memberof com.android.server.wm.shell.Transition
                             * @instance
                             */
                            Transition.prototype.startTransactionId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                            /**
                             * Transition finishTransactionId.
                             * @member {Long} finishTransactionId
                             * @memberof com.android.server.wm.shell.Transition
                             * @instance
                             */
                            Transition.prototype.finishTransactionId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                            /**
                             * Transition createTimeNs.
                             * @member {Long} createTimeNs
                             * @memberof com.android.server.wm.shell.Transition
                             * @instance
                             */
                            Transition.prototype.createTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                            /**
                             * Transition sendTimeNs.
                             * @member {Long} sendTimeNs
                             * @memberof com.android.server.wm.shell.Transition
                             * @instance
                             */
                            Transition.prototype.sendTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                            /**
                             * Transition finishTimeNs.
                             * @member {Long} finishTimeNs
                             * @memberof com.android.server.wm.shell.Transition
                             * @instance
                             */
                            Transition.prototype.finishTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                            /**
                             * Transition type.
                             * @member {number} type
                             * @memberof com.android.server.wm.shell.Transition
                             * @instance
                             */
                            Transition.prototype.type = 0;
    
                            /**
                             * Transition targets.
                             * @member {Array.<com.android.server.wm.shell.ITarget>} targets
                             * @memberof com.android.server.wm.shell.Transition
                             * @instance
                             */
                            Transition.prototype.targets = $util.emptyArray;
    
                            /**
                             * Transition flags.
                             * @member {number} flags
                             * @memberof com.android.server.wm.shell.Transition
                             * @instance
                             */
                            Transition.prototype.flags = 0;
    
                            /**
                             * Transition abortTimeNs.
                             * @member {Long} abortTimeNs
                             * @memberof com.android.server.wm.shell.Transition
                             * @instance
                             */
                            Transition.prototype.abortTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                            /**
                             * Transition startingWindowRemoveTimeNs.
                             * @member {Long} startingWindowRemoveTimeNs
                             * @memberof com.android.server.wm.shell.Transition
                             * @instance
                             */
                            Transition.prototype.startingWindowRemoveTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                            /**
                             * Creates a new Transition instance using the specified properties.
                             * @function create
                             * @memberof com.android.server.wm.shell.Transition
                             * @static
                             * @param {com.android.server.wm.shell.ITransition=} [properties] Properties to set
                             * @returns {com.android.server.wm.shell.Transition} Transition instance
                             */
                            Transition.create = function create(properties) {
                                return new Transition(properties);
                            };
    
                            /**
                             * Encodes the specified Transition message. Does not implicitly {@link com.android.server.wm.shell.Transition.verify|verify} messages.
                             * @function encode
                             * @memberof com.android.server.wm.shell.Transition
                             * @static
                             * @param {com.android.server.wm.shell.ITransition} message Transition message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            Transition.encode = function encode(message, writer) {
                                if (!writer)
                                    writer = $Writer.create();
                                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
                                if (message.startTransactionId != null && Object.hasOwnProperty.call(message, "startTransactionId"))
                                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.startTransactionId);
                                if (message.finishTransactionId != null && Object.hasOwnProperty.call(message, "finishTransactionId"))
                                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.finishTransactionId);
                                if (message.createTimeNs != null && Object.hasOwnProperty.call(message, "createTimeNs"))
                                    writer.uint32(/* id 4, wireType 0 =*/32).int64(message.createTimeNs);
                                if (message.sendTimeNs != null && Object.hasOwnProperty.call(message, "sendTimeNs"))
                                    writer.uint32(/* id 5, wireType 0 =*/40).int64(message.sendTimeNs);
                                if (message.finishTimeNs != null && Object.hasOwnProperty.call(message, "finishTimeNs"))
                                    writer.uint32(/* id 6, wireType 0 =*/48).int64(message.finishTimeNs);
                                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                                    writer.uint32(/* id 7, wireType 0 =*/56).int32(message.type);
                                if (message.targets != null && message.targets.length)
                                    for (var i = 0; i < message.targets.length; ++i)
                                        $root.com.android.server.wm.shell.Target.encode(message.targets[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                                if (message.flags != null && Object.hasOwnProperty.call(message, "flags"))
                                    writer.uint32(/* id 9, wireType 0 =*/72).int32(message.flags);
                                if (message.abortTimeNs != null && Object.hasOwnProperty.call(message, "abortTimeNs"))
                                    writer.uint32(/* id 10, wireType 0 =*/80).int64(message.abortTimeNs);
                                if (message.startingWindowRemoveTimeNs != null && Object.hasOwnProperty.call(message, "startingWindowRemoveTimeNs"))
                                    writer.uint32(/* id 11, wireType 0 =*/88).int64(message.startingWindowRemoveTimeNs);
                                return writer;
                            };
    
                            /**
                             * Encodes the specified Transition message, length delimited. Does not implicitly {@link com.android.server.wm.shell.Transition.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof com.android.server.wm.shell.Transition
                             * @static
                             * @param {com.android.server.wm.shell.ITransition} message Transition message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            Transition.encodeDelimited = function encodeDelimited(message, writer) {
                                return this.encode(message, writer).ldelim();
                            };
    
                            /**
                             * Decodes a Transition message from the specified reader or buffer.
                             * @function decode
                             * @memberof com.android.server.wm.shell.Transition
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {com.android.server.wm.shell.Transition} Transition
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            Transition.decode = function decode(reader, length) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.android.server.wm.shell.Transition();
                                while (reader.pos < end) {
                                    var tag = reader.uint32();
                                    switch (tag >>> 3) {
                                    case 1: {
                                            message.id = reader.int32();
                                            break;
                                        }
                                    case 2: {
                                            message.startTransactionId = reader.uint64();
                                            break;
                                        }
                                    case 3: {
                                            message.finishTransactionId = reader.uint64();
                                            break;
                                        }
                                    case 4: {
                                            message.createTimeNs = reader.int64();
                                            break;
                                        }
                                    case 5: {
                                            message.sendTimeNs = reader.int64();
                                            break;
                                        }
                                    case 6: {
                                            message.finishTimeNs = reader.int64();
                                            break;
                                        }
                                    case 7: {
                                            message.type = reader.int32();
                                            break;
                                        }
                                    case 8: {
                                            if (!(message.targets && message.targets.length))
                                                message.targets = [];
                                            message.targets.push($root.com.android.server.wm.shell.Target.decode(reader, reader.uint32()));
                                            break;
                                        }
                                    case 9: {
                                            message.flags = reader.int32();
                                            break;
                                        }
                                    case 10: {
                                            message.abortTimeNs = reader.int64();
                                            break;
                                        }
                                    case 11: {
                                            message.startingWindowRemoveTimeNs = reader.int64();
                                            break;
                                        }
                                    default:
                                        reader.skipType(tag & 7);
                                        break;
                                    }
                                }
                                if (!message.hasOwnProperty("id"))
                                    throw $util.ProtocolError("missing required 'id'", { instance: message });
                                return message;
                            };
    
                            /**
                             * Decodes a Transition message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof com.android.server.wm.shell.Transition
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {com.android.server.wm.shell.Transition} Transition
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            Transition.decodeDelimited = function decodeDelimited(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.uint32());
                            };
    
                            /**
                             * Verifies a Transition message.
                             * @function verify
                             * @memberof com.android.server.wm.shell.Transition
                             * @static
                             * @param {Object.<string,*>} message Plain object to verify
                             * @returns {string|null} `null` if valid, otherwise the reason why it is not
                             */
                            Transition.verify = function verify(message) {
                                if (typeof message !== "object" || message === null)
                                    return "object expected";
                                if (!$util.isInteger(message.id))
                                    return "id: integer expected";
                                if (message.startTransactionId != null && message.hasOwnProperty("startTransactionId"))
                                    if (!$util.isInteger(message.startTransactionId) && !(message.startTransactionId && $util.isInteger(message.startTransactionId.low) && $util.isInteger(message.startTransactionId.high)))
                                        return "startTransactionId: integer|Long expected";
                                if (message.finishTransactionId != null && message.hasOwnProperty("finishTransactionId"))
                                    if (!$util.isInteger(message.finishTransactionId) && !(message.finishTransactionId && $util.isInteger(message.finishTransactionId.low) && $util.isInteger(message.finishTransactionId.high)))
                                        return "finishTransactionId: integer|Long expected";
                                if (message.createTimeNs != null && message.hasOwnProperty("createTimeNs"))
                                    if (!$util.isInteger(message.createTimeNs) && !(message.createTimeNs && $util.isInteger(message.createTimeNs.low) && $util.isInteger(message.createTimeNs.high)))
                                        return "createTimeNs: integer|Long expected";
                                if (message.sendTimeNs != null && message.hasOwnProperty("sendTimeNs"))
                                    if (!$util.isInteger(message.sendTimeNs) && !(message.sendTimeNs && $util.isInteger(message.sendTimeNs.low) && $util.isInteger(message.sendTimeNs.high)))
                                        return "sendTimeNs: integer|Long expected";
                                if (message.finishTimeNs != null && message.hasOwnProperty("finishTimeNs"))
                                    if (!$util.isInteger(message.finishTimeNs) && !(message.finishTimeNs && $util.isInteger(message.finishTimeNs.low) && $util.isInteger(message.finishTimeNs.high)))
                                        return "finishTimeNs: integer|Long expected";
                                if (message.type != null && message.hasOwnProperty("type"))
                                    if (!$util.isInteger(message.type))
                                        return "type: integer expected";
                                if (message.targets != null && message.hasOwnProperty("targets")) {
                                    if (!Array.isArray(message.targets))
                                        return "targets: array expected";
                                    for (var i = 0; i < message.targets.length; ++i) {
                                        var error = $root.com.android.server.wm.shell.Target.verify(message.targets[i]);
                                        if (error)
                                            return "targets." + error;
                                    }
                                }
                                if (message.flags != null && message.hasOwnProperty("flags"))
                                    if (!$util.isInteger(message.flags))
                                        return "flags: integer expected";
                                if (message.abortTimeNs != null && message.hasOwnProperty("abortTimeNs"))
                                    if (!$util.isInteger(message.abortTimeNs) && !(message.abortTimeNs && $util.isInteger(message.abortTimeNs.low) && $util.isInteger(message.abortTimeNs.high)))
                                        return "abortTimeNs: integer|Long expected";
                                if (message.startingWindowRemoveTimeNs != null && message.hasOwnProperty("startingWindowRemoveTimeNs"))
                                    if (!$util.isInteger(message.startingWindowRemoveTimeNs) && !(message.startingWindowRemoveTimeNs && $util.isInteger(message.startingWindowRemoveTimeNs.low) && $util.isInteger(message.startingWindowRemoveTimeNs.high)))
                                        return "startingWindowRemoveTimeNs: integer|Long expected";
                                return null;
                            };
    
                            /**
                             * Creates a Transition message from a plain object. Also converts values to their respective internal types.
                             * @function fromObject
                             * @memberof com.android.server.wm.shell.Transition
                             * @static
                             * @param {Object.<string,*>} object Plain object
                             * @returns {com.android.server.wm.shell.Transition} Transition
                             */
                            Transition.fromObject = function fromObject(object) {
                                if (object instanceof $root.com.android.server.wm.shell.Transition)
                                    return object;
                                var message = new $root.com.android.server.wm.shell.Transition();
                                if (object.id != null)
                                    message.id = object.id | 0;
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
                                if (object.finishTimeNs != null)
                                    if ($util.Long)
                                        (message.finishTimeNs = $util.Long.fromValue(object.finishTimeNs)).unsigned = false;
                                    else if (typeof object.finishTimeNs === "string")
                                        message.finishTimeNs = parseInt(object.finishTimeNs, 10);
                                    else if (typeof object.finishTimeNs === "number")
                                        message.finishTimeNs = object.finishTimeNs;
                                    else if (typeof object.finishTimeNs === "object")
                                        message.finishTimeNs = new $util.LongBits(object.finishTimeNs.low >>> 0, object.finishTimeNs.high >>> 0).toNumber();
                                if (object.type != null)
                                    message.type = object.type | 0;
                                if (object.targets) {
                                    if (!Array.isArray(object.targets))
                                        throw TypeError(".com.android.server.wm.shell.Transition.targets: array expected");
                                    message.targets = [];
                                    for (var i = 0; i < object.targets.length; ++i) {
                                        if (typeof object.targets[i] !== "object")
                                            throw TypeError(".com.android.server.wm.shell.Transition.targets: object expected");
                                        message.targets[i] = $root.com.android.server.wm.shell.Target.fromObject(object.targets[i]);
                                    }
                                }
                                if (object.flags != null)
                                    message.flags = object.flags | 0;
                                if (object.abortTimeNs != null)
                                    if ($util.Long)
                                        (message.abortTimeNs = $util.Long.fromValue(object.abortTimeNs)).unsigned = false;
                                    else if (typeof object.abortTimeNs === "string")
                                        message.abortTimeNs = parseInt(object.abortTimeNs, 10);
                                    else if (typeof object.abortTimeNs === "number")
                                        message.abortTimeNs = object.abortTimeNs;
                                    else if (typeof object.abortTimeNs === "object")
                                        message.abortTimeNs = new $util.LongBits(object.abortTimeNs.low >>> 0, object.abortTimeNs.high >>> 0).toNumber();
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
                             * Creates a plain object from a Transition message. Also converts values to other types if specified.
                             * @function toObject
                             * @memberof com.android.server.wm.shell.Transition
                             * @static
                             * @param {com.android.server.wm.shell.Transition} message Transition
                             * @param {$protobuf.IConversionOptions} [options] Conversion options
                             * @returns {Object.<string,*>} Plain object
                             */
                            Transition.toObject = function toObject(message, options) {
                                if (!options)
                                    options = {};
                                var object = {};
                                if (options.arrays || options.defaults)
                                    object.targets = [];
                                if (options.defaults) {
                                    object.id = 0;
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
                                        object.finishTimeNs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                    } else
                                        object.finishTimeNs = options.longs === String ? "0" : 0;
                                    object.type = 0;
                                    object.flags = 0;
                                    if ($util.Long) {
                                        var long = new $util.Long(0, 0, false);
                                        object.abortTimeNs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                    } else
                                        object.abortTimeNs = options.longs === String ? "0" : 0;
                                    if ($util.Long) {
                                        var long = new $util.Long(0, 0, false);
                                        object.startingWindowRemoveTimeNs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                    } else
                                        object.startingWindowRemoveTimeNs = options.longs === String ? "0" : 0;
                                }
                                if (message.id != null && message.hasOwnProperty("id"))
                                    object.id = message.id;
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
                                if (message.finishTimeNs != null && message.hasOwnProperty("finishTimeNs"))
                                    if (typeof message.finishTimeNs === "number")
                                        object.finishTimeNs = options.longs === String ? String(message.finishTimeNs) : message.finishTimeNs;
                                    else
                                        object.finishTimeNs = options.longs === String ? $util.Long.prototype.toString.call(message.finishTimeNs) : options.longs === Number ? new $util.LongBits(message.finishTimeNs.low >>> 0, message.finishTimeNs.high >>> 0).toNumber() : message.finishTimeNs;
                                if (message.type != null && message.hasOwnProperty("type"))
                                    object.type = message.type;
                                if (message.targets && message.targets.length) {
                                    object.targets = [];
                                    for (var j = 0; j < message.targets.length; ++j)
                                        object.targets[j] = $root.com.android.server.wm.shell.Target.toObject(message.targets[j], options);
                                }
                                if (message.flags != null && message.hasOwnProperty("flags"))
                                    object.flags = message.flags;
                                if (message.abortTimeNs != null && message.hasOwnProperty("abortTimeNs"))
                                    if (typeof message.abortTimeNs === "number")
                                        object.abortTimeNs = options.longs === String ? String(message.abortTimeNs) : message.abortTimeNs;
                                    else
                                        object.abortTimeNs = options.longs === String ? $util.Long.prototype.toString.call(message.abortTimeNs) : options.longs === Number ? new $util.LongBits(message.abortTimeNs.low >>> 0, message.abortTimeNs.high >>> 0).toNumber() : message.abortTimeNs;
                                if (message.startingWindowRemoveTimeNs != null && message.hasOwnProperty("startingWindowRemoveTimeNs"))
                                    if (typeof message.startingWindowRemoveTimeNs === "number")
                                        object.startingWindowRemoveTimeNs = options.longs === String ? String(message.startingWindowRemoveTimeNs) : message.startingWindowRemoveTimeNs;
                                    else
                                        object.startingWindowRemoveTimeNs = options.longs === String ? $util.Long.prototype.toString.call(message.startingWindowRemoveTimeNs) : options.longs === Number ? new $util.LongBits(message.startingWindowRemoveTimeNs.low >>> 0, message.startingWindowRemoveTimeNs.high >>> 0).toNumber() : message.startingWindowRemoveTimeNs;
                                return object;
                            };
    
                            /**
                             * Converts this Transition to JSON.
                             * @function toJSON
                             * @memberof com.android.server.wm.shell.Transition
                             * @instance
                             * @returns {Object.<string,*>} JSON object
                             */
                            Transition.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                            };
    
                            /**
                             * Gets the default type url for Transition
                             * @function getTypeUrl
                             * @memberof com.android.server.wm.shell.Transition
                             * @static
                             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                             * @returns {string} The default type url
                             */
                            Transition.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                if (typeUrlPrefix === undefined) {
                                    typeUrlPrefix = "type.googleapis.com";
                                }
                                return typeUrlPrefix + "/com.android.server.wm.shell.Transition";
                            };
    
                            return Transition;
                        })();
    
                        shell.Target = (function() {
    
                            /**
                             * Properties of a Target.
                             * @memberof com.android.server.wm.shell
                             * @interface ITarget
                             * @property {number|null} [mode] Target mode
                             * @property {number|null} [layerId] Target layerId
                             * @property {number|null} [windowId] Target windowId
                             * @property {number|null} [flags] Target flags
                             */
    
                            /**
                             * Constructs a new Target.
                             * @memberof com.android.server.wm.shell
                             * @classdesc Represents a Target.
                             * @implements ITarget
                             * @constructor
                             * @param {com.android.server.wm.shell.ITarget=} [properties] Properties to set
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
                             * @memberof com.android.server.wm.shell.Target
                             * @instance
                             */
                            Target.prototype.mode = 0;
    
                            /**
                             * Target layerId.
                             * @member {number} layerId
                             * @memberof com.android.server.wm.shell.Target
                             * @instance
                             */
                            Target.prototype.layerId = 0;
    
                            /**
                             * Target windowId.
                             * @member {number} windowId
                             * @memberof com.android.server.wm.shell.Target
                             * @instance
                             */
                            Target.prototype.windowId = 0;
    
                            /**
                             * Target flags.
                             * @member {number} flags
                             * @memberof com.android.server.wm.shell.Target
                             * @instance
                             */
                            Target.prototype.flags = 0;
    
                            /**
                             * Creates a new Target instance using the specified properties.
                             * @function create
                             * @memberof com.android.server.wm.shell.Target
                             * @static
                             * @param {com.android.server.wm.shell.ITarget=} [properties] Properties to set
                             * @returns {com.android.server.wm.shell.Target} Target instance
                             */
                            Target.create = function create(properties) {
                                return new Target(properties);
                            };
    
                            /**
                             * Encodes the specified Target message. Does not implicitly {@link com.android.server.wm.shell.Target.verify|verify} messages.
                             * @function encode
                             * @memberof com.android.server.wm.shell.Target
                             * @static
                             * @param {com.android.server.wm.shell.ITarget} message Target message or plain object to encode
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
                             * Encodes the specified Target message, length delimited. Does not implicitly {@link com.android.server.wm.shell.Target.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof com.android.server.wm.shell.Target
                             * @static
                             * @param {com.android.server.wm.shell.ITarget} message Target message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            Target.encodeDelimited = function encodeDelimited(message, writer) {
                                return this.encode(message, writer).ldelim();
                            };
    
                            /**
                             * Decodes a Target message from the specified reader or buffer.
                             * @function decode
                             * @memberof com.android.server.wm.shell.Target
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {com.android.server.wm.shell.Target} Target
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            Target.decode = function decode(reader, length) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.android.server.wm.shell.Target();
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
                             * @memberof com.android.server.wm.shell.Target
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {com.android.server.wm.shell.Target} Target
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
                             * @memberof com.android.server.wm.shell.Target
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
                             * @memberof com.android.server.wm.shell.Target
                             * @static
                             * @param {Object.<string,*>} object Plain object
                             * @returns {com.android.server.wm.shell.Target} Target
                             */
                            Target.fromObject = function fromObject(object) {
                                if (object instanceof $root.com.android.server.wm.shell.Target)
                                    return object;
                                var message = new $root.com.android.server.wm.shell.Target();
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
                             * @memberof com.android.server.wm.shell.Target
                             * @static
                             * @param {com.android.server.wm.shell.Target} message Target
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
                             * @memberof com.android.server.wm.shell.Target
                             * @instance
                             * @returns {Object.<string,*>} JSON object
                             */
                            Target.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                            };
    
                            /**
                             * Gets the default type url for Target
                             * @function getTypeUrl
                             * @memberof com.android.server.wm.shell.Target
                             * @static
                             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                             * @returns {string} The default type url
                             */
                            Target.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                if (typeUrlPrefix === undefined) {
                                    typeUrlPrefix = "type.googleapis.com";
                                }
                                return typeUrlPrefix + "/com.android.server.wm.shell.Target";
                            };
    
                            return Target;
                        })();
    
                        return shell;
                    })();
    
                    return wm;
                })();
    
                return server;
            })();
    
            android.wm = (function() {
    
                /**
                 * Namespace wm.
                 * @memberof com.android
                 * @namespace
                 */
                var wm = {};
    
                wm.shell = (function() {
    
                    /**
                     * Namespace shell.
                     * @memberof com.android.wm
                     * @namespace
                     */
                    var shell = {};
    
                    shell.WmShellTransitionTraceProto = (function() {
    
                        /**
                         * Properties of a WmShellTransitionTraceProto.
                         * @memberof com.android.wm.shell
                         * @interface IWmShellTransitionTraceProto
                         * @property {Long} magicNumber WmShellTransitionTraceProto magicNumber
                         * @property {Array.<com.android.wm.shell.ITransition>|null} [transitions] WmShellTransitionTraceProto transitions
                         * @property {Array.<com.android.wm.shell.IHandlerMapping>|null} [handlerMappings] WmShellTransitionTraceProto handlerMappings
                         * @property {Long|null} [realToElapsedTimeOffsetNanos] WmShellTransitionTraceProto realToElapsedTimeOffsetNanos
                         */
    
                        /**
                         * Constructs a new WmShellTransitionTraceProto.
                         * @memberof com.android.wm.shell
                         * @classdesc Represents a WmShellTransitionTraceProto.
                         * @implements IWmShellTransitionTraceProto
                         * @constructor
                         * @param {com.android.wm.shell.IWmShellTransitionTraceProto=} [properties] Properties to set
                         */
                        function WmShellTransitionTraceProto(properties) {
                            this.transitions = [];
                            this.handlerMappings = [];
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * WmShellTransitionTraceProto magicNumber.
                         * @member {Long} magicNumber
                         * @memberof com.android.wm.shell.WmShellTransitionTraceProto
                         * @instance
                         */
                        WmShellTransitionTraceProto.prototype.magicNumber = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                        /**
                         * WmShellTransitionTraceProto transitions.
                         * @member {Array.<com.android.wm.shell.ITransition>} transitions
                         * @memberof com.android.wm.shell.WmShellTransitionTraceProto
                         * @instance
                         */
                        WmShellTransitionTraceProto.prototype.transitions = $util.emptyArray;
    
                        /**
                         * WmShellTransitionTraceProto handlerMappings.
                         * @member {Array.<com.android.wm.shell.IHandlerMapping>} handlerMappings
                         * @memberof com.android.wm.shell.WmShellTransitionTraceProto
                         * @instance
                         */
                        WmShellTransitionTraceProto.prototype.handlerMappings = $util.emptyArray;
    
                        /**
                         * WmShellTransitionTraceProto realToElapsedTimeOffsetNanos.
                         * @member {Long} realToElapsedTimeOffsetNanos
                         * @memberof com.android.wm.shell.WmShellTransitionTraceProto
                         * @instance
                         */
                        WmShellTransitionTraceProto.prototype.realToElapsedTimeOffsetNanos = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                        /**
                         * Creates a new WmShellTransitionTraceProto instance using the specified properties.
                         * @function create
                         * @memberof com.android.wm.shell.WmShellTransitionTraceProto
                         * @static
                         * @param {com.android.wm.shell.IWmShellTransitionTraceProto=} [properties] Properties to set
                         * @returns {com.android.wm.shell.WmShellTransitionTraceProto} WmShellTransitionTraceProto instance
                         */
                        WmShellTransitionTraceProto.create = function create(properties) {
                            return new WmShellTransitionTraceProto(properties);
                        };
    
                        /**
                         * Encodes the specified WmShellTransitionTraceProto message. Does not implicitly {@link com.android.wm.shell.WmShellTransitionTraceProto.verify|verify} messages.
                         * @function encode
                         * @memberof com.android.wm.shell.WmShellTransitionTraceProto
                         * @static
                         * @param {com.android.wm.shell.IWmShellTransitionTraceProto} message WmShellTransitionTraceProto message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        WmShellTransitionTraceProto.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.magicNumber);
                            if (message.transitions != null && message.transitions.length)
                                for (var i = 0; i < message.transitions.length; ++i)
                                    $root.com.android.wm.shell.Transition.encode(message.transitions[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            if (message.handlerMappings != null && message.handlerMappings.length)
                                for (var i = 0; i < message.handlerMappings.length; ++i)
                                    $root.com.android.wm.shell.HandlerMapping.encode(message.handlerMappings[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                            if (message.realToElapsedTimeOffsetNanos != null && Object.hasOwnProperty.call(message, "realToElapsedTimeOffsetNanos"))
                                writer.uint32(/* id 4, wireType 1 =*/33).fixed64(message.realToElapsedTimeOffsetNanos);
                            return writer;
                        };
    
                        /**
                         * Encodes the specified WmShellTransitionTraceProto message, length delimited. Does not implicitly {@link com.android.wm.shell.WmShellTransitionTraceProto.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.android.wm.shell.WmShellTransitionTraceProto
                         * @static
                         * @param {com.android.wm.shell.IWmShellTransitionTraceProto} message WmShellTransitionTraceProto message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        WmShellTransitionTraceProto.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes a WmShellTransitionTraceProto message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.android.wm.shell.WmShellTransitionTraceProto
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.android.wm.shell.WmShellTransitionTraceProto} WmShellTransitionTraceProto
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        WmShellTransitionTraceProto.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.android.wm.shell.WmShellTransitionTraceProto();
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.magicNumber = reader.fixed64();
                                        break;
                                    }
                                case 2: {
                                        if (!(message.transitions && message.transitions.length))
                                            message.transitions = [];
                                        message.transitions.push($root.com.android.wm.shell.Transition.decode(reader, reader.uint32()));
                                        break;
                                    }
                                case 3: {
                                        if (!(message.handlerMappings && message.handlerMappings.length))
                                            message.handlerMappings = [];
                                        message.handlerMappings.push($root.com.android.wm.shell.HandlerMapping.decode(reader, reader.uint32()));
                                        break;
                                    }
                                case 4: {
                                        message.realToElapsedTimeOffsetNanos = reader.fixed64();
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            if (!message.hasOwnProperty("magicNumber"))
                                throw $util.ProtocolError("missing required 'magicNumber'", { instance: message });
                            return message;
                        };
    
                        /**
                         * Decodes a WmShellTransitionTraceProto message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.android.wm.shell.WmShellTransitionTraceProto
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.android.wm.shell.WmShellTransitionTraceProto} WmShellTransitionTraceProto
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        WmShellTransitionTraceProto.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies a WmShellTransitionTraceProto message.
                         * @function verify
                         * @memberof com.android.wm.shell.WmShellTransitionTraceProto
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        WmShellTransitionTraceProto.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (!$util.isInteger(message.magicNumber) && !(message.magicNumber && $util.isInteger(message.magicNumber.low) && $util.isInteger(message.magicNumber.high)))
                                return "magicNumber: integer|Long expected";
                            if (message.transitions != null && message.hasOwnProperty("transitions")) {
                                if (!Array.isArray(message.transitions))
                                    return "transitions: array expected";
                                for (var i = 0; i < message.transitions.length; ++i) {
                                    var error = $root.com.android.wm.shell.Transition.verify(message.transitions[i]);
                                    if (error)
                                        return "transitions." + error;
                                }
                            }
                            if (message.handlerMappings != null && message.hasOwnProperty("handlerMappings")) {
                                if (!Array.isArray(message.handlerMappings))
                                    return "handlerMappings: array expected";
                                for (var i = 0; i < message.handlerMappings.length; ++i) {
                                    var error = $root.com.android.wm.shell.HandlerMapping.verify(message.handlerMappings[i]);
                                    if (error)
                                        return "handlerMappings." + error;
                                }
                            }
                            if (message.realToElapsedTimeOffsetNanos != null && message.hasOwnProperty("realToElapsedTimeOffsetNanos"))
                                if (!$util.isInteger(message.realToElapsedTimeOffsetNanos) && !(message.realToElapsedTimeOffsetNanos && $util.isInteger(message.realToElapsedTimeOffsetNanos.low) && $util.isInteger(message.realToElapsedTimeOffsetNanos.high)))
                                    return "realToElapsedTimeOffsetNanos: integer|Long expected";
                            return null;
                        };
    
                        /**
                         * Creates a WmShellTransitionTraceProto message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.android.wm.shell.WmShellTransitionTraceProto
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.android.wm.shell.WmShellTransitionTraceProto} WmShellTransitionTraceProto
                         */
                        WmShellTransitionTraceProto.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.android.wm.shell.WmShellTransitionTraceProto)
                                return object;
                            var message = new $root.com.android.wm.shell.WmShellTransitionTraceProto();
                            if (object.magicNumber != null)
                                if ($util.Long)
                                    (message.magicNumber = $util.Long.fromValue(object.magicNumber)).unsigned = false;
                                else if (typeof object.magicNumber === "string")
                                    message.magicNumber = parseInt(object.magicNumber, 10);
                                else if (typeof object.magicNumber === "number")
                                    message.magicNumber = object.magicNumber;
                                else if (typeof object.magicNumber === "object")
                                    message.magicNumber = new $util.LongBits(object.magicNumber.low >>> 0, object.magicNumber.high >>> 0).toNumber();
                            if (object.transitions) {
                                if (!Array.isArray(object.transitions))
                                    throw TypeError(".com.android.wm.shell.WmShellTransitionTraceProto.transitions: array expected");
                                message.transitions = [];
                                for (var i = 0; i < object.transitions.length; ++i) {
                                    if (typeof object.transitions[i] !== "object")
                                        throw TypeError(".com.android.wm.shell.WmShellTransitionTraceProto.transitions: object expected");
                                    message.transitions[i] = $root.com.android.wm.shell.Transition.fromObject(object.transitions[i]);
                                }
                            }
                            if (object.handlerMappings) {
                                if (!Array.isArray(object.handlerMappings))
                                    throw TypeError(".com.android.wm.shell.WmShellTransitionTraceProto.handlerMappings: array expected");
                                message.handlerMappings = [];
                                for (var i = 0; i < object.handlerMappings.length; ++i) {
                                    if (typeof object.handlerMappings[i] !== "object")
                                        throw TypeError(".com.android.wm.shell.WmShellTransitionTraceProto.handlerMappings: object expected");
                                    message.handlerMappings[i] = $root.com.android.wm.shell.HandlerMapping.fromObject(object.handlerMappings[i]);
                                }
                            }
                            if (object.realToElapsedTimeOffsetNanos != null)
                                if ($util.Long)
                                    (message.realToElapsedTimeOffsetNanos = $util.Long.fromValue(object.realToElapsedTimeOffsetNanos)).unsigned = false;
                                else if (typeof object.realToElapsedTimeOffsetNanos === "string")
                                    message.realToElapsedTimeOffsetNanos = parseInt(object.realToElapsedTimeOffsetNanos, 10);
                                else if (typeof object.realToElapsedTimeOffsetNanos === "number")
                                    message.realToElapsedTimeOffsetNanos = object.realToElapsedTimeOffsetNanos;
                                else if (typeof object.realToElapsedTimeOffsetNanos === "object")
                                    message.realToElapsedTimeOffsetNanos = new $util.LongBits(object.realToElapsedTimeOffsetNanos.low >>> 0, object.realToElapsedTimeOffsetNanos.high >>> 0).toNumber();
                            return message;
                        };
    
                        /**
                         * Creates a plain object from a WmShellTransitionTraceProto message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.android.wm.shell.WmShellTransitionTraceProto
                         * @static
                         * @param {com.android.wm.shell.WmShellTransitionTraceProto} message WmShellTransitionTraceProto
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        WmShellTransitionTraceProto.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.arrays || options.defaults) {
                                object.transitions = [];
                                object.handlerMappings = [];
                            }
                            if (options.defaults) {
                                if ($util.Long) {
                                    var long = new $util.Long(0, 0, false);
                                    object.magicNumber = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.magicNumber = options.longs === String ? "0" : 0;
                                if ($util.Long) {
                                    var long = new $util.Long(0, 0, false);
                                    object.realToElapsedTimeOffsetNanos = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.realToElapsedTimeOffsetNanos = options.longs === String ? "0" : 0;
                            }
                            if (message.magicNumber != null && message.hasOwnProperty("magicNumber"))
                                if (typeof message.magicNumber === "number")
                                    object.magicNumber = options.longs === String ? String(message.magicNumber) : message.magicNumber;
                                else
                                    object.magicNumber = options.longs === String ? $util.Long.prototype.toString.call(message.magicNumber) : options.longs === Number ? new $util.LongBits(message.magicNumber.low >>> 0, message.magicNumber.high >>> 0).toNumber() : message.magicNumber;
                            if (message.transitions && message.transitions.length) {
                                object.transitions = [];
                                for (var j = 0; j < message.transitions.length; ++j)
                                    object.transitions[j] = $root.com.android.wm.shell.Transition.toObject(message.transitions[j], options);
                            }
                            if (message.handlerMappings && message.handlerMappings.length) {
                                object.handlerMappings = [];
                                for (var j = 0; j < message.handlerMappings.length; ++j)
                                    object.handlerMappings[j] = $root.com.android.wm.shell.HandlerMapping.toObject(message.handlerMappings[j], options);
                            }
                            if (message.realToElapsedTimeOffsetNanos != null && message.hasOwnProperty("realToElapsedTimeOffsetNanos"))
                                if (typeof message.realToElapsedTimeOffsetNanos === "number")
                                    object.realToElapsedTimeOffsetNanos = options.longs === String ? String(message.realToElapsedTimeOffsetNanos) : message.realToElapsedTimeOffsetNanos;
                                else
                                    object.realToElapsedTimeOffsetNanos = options.longs === String ? $util.Long.prototype.toString.call(message.realToElapsedTimeOffsetNanos) : options.longs === Number ? new $util.LongBits(message.realToElapsedTimeOffsetNanos.low >>> 0, message.realToElapsedTimeOffsetNanos.high >>> 0).toNumber() : message.realToElapsedTimeOffsetNanos;
                            return object;
                        };
    
                        /**
                         * Converts this WmShellTransitionTraceProto to JSON.
                         * @function toJSON
                         * @memberof com.android.wm.shell.WmShellTransitionTraceProto
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        WmShellTransitionTraceProto.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        /**
                         * Gets the default type url for WmShellTransitionTraceProto
                         * @function getTypeUrl
                         * @memberof com.android.wm.shell.WmShellTransitionTraceProto
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        WmShellTransitionTraceProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.android.wm.shell.WmShellTransitionTraceProto";
                        };
    
                        /**
                         * MagicNumber enum.
                         * @name com.android.wm.shell.WmShellTransitionTraceProto.MagicNumber
                         * @enum {number}
                         * @property {number} INVALID=0 INVALID value
                         * @property {number} MAGIC_NUMBER_L=1414745431 MAGIC_NUMBER_L value
                         * @property {number} MAGIC_NUMBER_H=1162035538 MAGIC_NUMBER_H value
                         */
                        WmShellTransitionTraceProto.MagicNumber = (function() {
                            var valuesById = {}, values = Object.create(valuesById);
                            values[valuesById[0] = "INVALID"] = 0;
                            values[valuesById[1414745431] = "MAGIC_NUMBER_L"] = 1414745431;
                            values[valuesById[1162035538] = "MAGIC_NUMBER_H"] = 1162035538;
                            return values;
                        })();
    
                        return WmShellTransitionTraceProto;
                    })();
    
                    shell.Transition = (function() {
    
                        /**
                         * Properties of a Transition.
                         * @memberof com.android.wm.shell
                         * @interface ITransition
                         * @property {number} id Transition id
                         * @property {Long|null} [dispatchTimeNs] Transition dispatchTimeNs
                         * @property {number|null} [handler] Transition handler
                         * @property {Long|null} [mergeTimeNs] Transition mergeTimeNs
                         * @property {Long|null} [mergeRequestTimeNs] Transition mergeRequestTimeNs
                         * @property {number|null} [mergeTarget] Transition mergeTarget
                         * @property {Long|null} [abortTimeNs] Transition abortTimeNs
                         */
    
                        /**
                         * Constructs a new Transition.
                         * @memberof com.android.wm.shell
                         * @classdesc Represents a Transition.
                         * @implements ITransition
                         * @constructor
                         * @param {com.android.wm.shell.ITransition=} [properties] Properties to set
                         */
                        function Transition(properties) {
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * Transition id.
                         * @member {number} id
                         * @memberof com.android.wm.shell.Transition
                         * @instance
                         */
                        Transition.prototype.id = 0;
    
                        /**
                         * Transition dispatchTimeNs.
                         * @member {Long} dispatchTimeNs
                         * @memberof com.android.wm.shell.Transition
                         * @instance
                         */
                        Transition.prototype.dispatchTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                        /**
                         * Transition handler.
                         * @member {number} handler
                         * @memberof com.android.wm.shell.Transition
                         * @instance
                         */
                        Transition.prototype.handler = 0;
    
                        /**
                         * Transition mergeTimeNs.
                         * @member {Long} mergeTimeNs
                         * @memberof com.android.wm.shell.Transition
                         * @instance
                         */
                        Transition.prototype.mergeTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                        /**
                         * Transition mergeRequestTimeNs.
                         * @member {Long} mergeRequestTimeNs
                         * @memberof com.android.wm.shell.Transition
                         * @instance
                         */
                        Transition.prototype.mergeRequestTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                        /**
                         * Transition mergeTarget.
                         * @member {number} mergeTarget
                         * @memberof com.android.wm.shell.Transition
                         * @instance
                         */
                        Transition.prototype.mergeTarget = 0;
    
                        /**
                         * Transition abortTimeNs.
                         * @member {Long} abortTimeNs
                         * @memberof com.android.wm.shell.Transition
                         * @instance
                         */
                        Transition.prototype.abortTimeNs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                        /**
                         * Creates a new Transition instance using the specified properties.
                         * @function create
                         * @memberof com.android.wm.shell.Transition
                         * @static
                         * @param {com.android.wm.shell.ITransition=} [properties] Properties to set
                         * @returns {com.android.wm.shell.Transition} Transition instance
                         */
                        Transition.create = function create(properties) {
                            return new Transition(properties);
                        };
    
                        /**
                         * Encodes the specified Transition message. Does not implicitly {@link com.android.wm.shell.Transition.verify|verify} messages.
                         * @function encode
                         * @memberof com.android.wm.shell.Transition
                         * @static
                         * @param {com.android.wm.shell.ITransition} message Transition message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Transition.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
                            if (message.dispatchTimeNs != null && Object.hasOwnProperty.call(message, "dispatchTimeNs"))
                                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.dispatchTimeNs);
                            if (message.handler != null && Object.hasOwnProperty.call(message, "handler"))
                                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.handler);
                            if (message.mergeTimeNs != null && Object.hasOwnProperty.call(message, "mergeTimeNs"))
                                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.mergeTimeNs);
                            if (message.mergeRequestTimeNs != null && Object.hasOwnProperty.call(message, "mergeRequestTimeNs"))
                                writer.uint32(/* id 5, wireType 0 =*/40).int64(message.mergeRequestTimeNs);
                            if (message.mergeTarget != null && Object.hasOwnProperty.call(message, "mergeTarget"))
                                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.mergeTarget);
                            if (message.abortTimeNs != null && Object.hasOwnProperty.call(message, "abortTimeNs"))
                                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.abortTimeNs);
                            return writer;
                        };
    
                        /**
                         * Encodes the specified Transition message, length delimited. Does not implicitly {@link com.android.wm.shell.Transition.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.android.wm.shell.Transition
                         * @static
                         * @param {com.android.wm.shell.ITransition} message Transition message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Transition.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes a Transition message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.android.wm.shell.Transition
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.android.wm.shell.Transition} Transition
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Transition.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.android.wm.shell.Transition();
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.id = reader.int32();
                                        break;
                                    }
                                case 2: {
                                        message.dispatchTimeNs = reader.int64();
                                        break;
                                    }
                                case 3: {
                                        message.handler = reader.int32();
                                        break;
                                    }
                                case 4: {
                                        message.mergeTimeNs = reader.int64();
                                        break;
                                    }
                                case 5: {
                                        message.mergeRequestTimeNs = reader.int64();
                                        break;
                                    }
                                case 6: {
                                        message.mergeTarget = reader.int32();
                                        break;
                                    }
                                case 7: {
                                        message.abortTimeNs = reader.int64();
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            if (!message.hasOwnProperty("id"))
                                throw $util.ProtocolError("missing required 'id'", { instance: message });
                            return message;
                        };
    
                        /**
                         * Decodes a Transition message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.android.wm.shell.Transition
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.android.wm.shell.Transition} Transition
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Transition.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies a Transition message.
                         * @function verify
                         * @memberof com.android.wm.shell.Transition
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        Transition.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (!$util.isInteger(message.id))
                                return "id: integer expected";
                            if (message.dispatchTimeNs != null && message.hasOwnProperty("dispatchTimeNs"))
                                if (!$util.isInteger(message.dispatchTimeNs) && !(message.dispatchTimeNs && $util.isInteger(message.dispatchTimeNs.low) && $util.isInteger(message.dispatchTimeNs.high)))
                                    return "dispatchTimeNs: integer|Long expected";
                            if (message.handler != null && message.hasOwnProperty("handler"))
                                if (!$util.isInteger(message.handler))
                                    return "handler: integer expected";
                            if (message.mergeTimeNs != null && message.hasOwnProperty("mergeTimeNs"))
                                if (!$util.isInteger(message.mergeTimeNs) && !(message.mergeTimeNs && $util.isInteger(message.mergeTimeNs.low) && $util.isInteger(message.mergeTimeNs.high)))
                                    return "mergeTimeNs: integer|Long expected";
                            if (message.mergeRequestTimeNs != null && message.hasOwnProperty("mergeRequestTimeNs"))
                                if (!$util.isInteger(message.mergeRequestTimeNs) && !(message.mergeRequestTimeNs && $util.isInteger(message.mergeRequestTimeNs.low) && $util.isInteger(message.mergeRequestTimeNs.high)))
                                    return "mergeRequestTimeNs: integer|Long expected";
                            if (message.mergeTarget != null && message.hasOwnProperty("mergeTarget"))
                                if (!$util.isInteger(message.mergeTarget))
                                    return "mergeTarget: integer expected";
                            if (message.abortTimeNs != null && message.hasOwnProperty("abortTimeNs"))
                                if (!$util.isInteger(message.abortTimeNs) && !(message.abortTimeNs && $util.isInteger(message.abortTimeNs.low) && $util.isInteger(message.abortTimeNs.high)))
                                    return "abortTimeNs: integer|Long expected";
                            return null;
                        };
    
                        /**
                         * Creates a Transition message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.android.wm.shell.Transition
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.android.wm.shell.Transition} Transition
                         */
                        Transition.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.android.wm.shell.Transition)
                                return object;
                            var message = new $root.com.android.wm.shell.Transition();
                            if (object.id != null)
                                message.id = object.id | 0;
                            if (object.dispatchTimeNs != null)
                                if ($util.Long)
                                    (message.dispatchTimeNs = $util.Long.fromValue(object.dispatchTimeNs)).unsigned = false;
                                else if (typeof object.dispatchTimeNs === "string")
                                    message.dispatchTimeNs = parseInt(object.dispatchTimeNs, 10);
                                else if (typeof object.dispatchTimeNs === "number")
                                    message.dispatchTimeNs = object.dispatchTimeNs;
                                else if (typeof object.dispatchTimeNs === "object")
                                    message.dispatchTimeNs = new $util.LongBits(object.dispatchTimeNs.low >>> 0, object.dispatchTimeNs.high >>> 0).toNumber();
                            if (object.handler != null)
                                message.handler = object.handler | 0;
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
                            if (object.mergeTarget != null)
                                message.mergeTarget = object.mergeTarget | 0;
                            if (object.abortTimeNs != null)
                                if ($util.Long)
                                    (message.abortTimeNs = $util.Long.fromValue(object.abortTimeNs)).unsigned = false;
                                else if (typeof object.abortTimeNs === "string")
                                    message.abortTimeNs = parseInt(object.abortTimeNs, 10);
                                else if (typeof object.abortTimeNs === "number")
                                    message.abortTimeNs = object.abortTimeNs;
                                else if (typeof object.abortTimeNs === "object")
                                    message.abortTimeNs = new $util.LongBits(object.abortTimeNs.low >>> 0, object.abortTimeNs.high >>> 0).toNumber();
                            return message;
                        };
    
                        /**
                         * Creates a plain object from a Transition message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.android.wm.shell.Transition
                         * @static
                         * @param {com.android.wm.shell.Transition} message Transition
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        Transition.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.defaults) {
                                object.id = 0;
                                if ($util.Long) {
                                    var long = new $util.Long(0, 0, false);
                                    object.dispatchTimeNs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.dispatchTimeNs = options.longs === String ? "0" : 0;
                                object.handler = 0;
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
                                object.mergeTarget = 0;
                                if ($util.Long) {
                                    var long = new $util.Long(0, 0, false);
                                    object.abortTimeNs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.abortTimeNs = options.longs === String ? "0" : 0;
                            }
                            if (message.id != null && message.hasOwnProperty("id"))
                                object.id = message.id;
                            if (message.dispatchTimeNs != null && message.hasOwnProperty("dispatchTimeNs"))
                                if (typeof message.dispatchTimeNs === "number")
                                    object.dispatchTimeNs = options.longs === String ? String(message.dispatchTimeNs) : message.dispatchTimeNs;
                                else
                                    object.dispatchTimeNs = options.longs === String ? $util.Long.prototype.toString.call(message.dispatchTimeNs) : options.longs === Number ? new $util.LongBits(message.dispatchTimeNs.low >>> 0, message.dispatchTimeNs.high >>> 0).toNumber() : message.dispatchTimeNs;
                            if (message.handler != null && message.hasOwnProperty("handler"))
                                object.handler = message.handler;
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
                            if (message.mergeTarget != null && message.hasOwnProperty("mergeTarget"))
                                object.mergeTarget = message.mergeTarget;
                            if (message.abortTimeNs != null && message.hasOwnProperty("abortTimeNs"))
                                if (typeof message.abortTimeNs === "number")
                                    object.abortTimeNs = options.longs === String ? String(message.abortTimeNs) : message.abortTimeNs;
                                else
                                    object.abortTimeNs = options.longs === String ? $util.Long.prototype.toString.call(message.abortTimeNs) : options.longs === Number ? new $util.LongBits(message.abortTimeNs.low >>> 0, message.abortTimeNs.high >>> 0).toNumber() : message.abortTimeNs;
                            return object;
                        };
    
                        /**
                         * Converts this Transition to JSON.
                         * @function toJSON
                         * @memberof com.android.wm.shell.Transition
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        Transition.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        /**
                         * Gets the default type url for Transition
                         * @function getTypeUrl
                         * @memberof com.android.wm.shell.Transition
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        Transition.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.android.wm.shell.Transition";
                        };
    
                        return Transition;
                    })();
    
                    shell.HandlerMapping = (function() {
    
                        /**
                         * Properties of a HandlerMapping.
                         * @memberof com.android.wm.shell
                         * @interface IHandlerMapping
                         * @property {number} id HandlerMapping id
                         * @property {string} name HandlerMapping name
                         */
    
                        /**
                         * Constructs a new HandlerMapping.
                         * @memberof com.android.wm.shell
                         * @classdesc Represents a HandlerMapping.
                         * @implements IHandlerMapping
                         * @constructor
                         * @param {com.android.wm.shell.IHandlerMapping=} [properties] Properties to set
                         */
                        function HandlerMapping(properties) {
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * HandlerMapping id.
                         * @member {number} id
                         * @memberof com.android.wm.shell.HandlerMapping
                         * @instance
                         */
                        HandlerMapping.prototype.id = 0;
    
                        /**
                         * HandlerMapping name.
                         * @member {string} name
                         * @memberof com.android.wm.shell.HandlerMapping
                         * @instance
                         */
                        HandlerMapping.prototype.name = "";
    
                        /**
                         * Creates a new HandlerMapping instance using the specified properties.
                         * @function create
                         * @memberof com.android.wm.shell.HandlerMapping
                         * @static
                         * @param {com.android.wm.shell.IHandlerMapping=} [properties] Properties to set
                         * @returns {com.android.wm.shell.HandlerMapping} HandlerMapping instance
                         */
                        HandlerMapping.create = function create(properties) {
                            return new HandlerMapping(properties);
                        };
    
                        /**
                         * Encodes the specified HandlerMapping message. Does not implicitly {@link com.android.wm.shell.HandlerMapping.verify|verify} messages.
                         * @function encode
                         * @memberof com.android.wm.shell.HandlerMapping
                         * @static
                         * @param {com.android.wm.shell.IHandlerMapping} message HandlerMapping message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        HandlerMapping.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                            return writer;
                        };
    
                        /**
                         * Encodes the specified HandlerMapping message, length delimited. Does not implicitly {@link com.android.wm.shell.HandlerMapping.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.android.wm.shell.HandlerMapping
                         * @static
                         * @param {com.android.wm.shell.IHandlerMapping} message HandlerMapping message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        HandlerMapping.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes a HandlerMapping message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.android.wm.shell.HandlerMapping
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.android.wm.shell.HandlerMapping} HandlerMapping
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        HandlerMapping.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.android.wm.shell.HandlerMapping();
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
                            if (!message.hasOwnProperty("id"))
                                throw $util.ProtocolError("missing required 'id'", { instance: message });
                            if (!message.hasOwnProperty("name"))
                                throw $util.ProtocolError("missing required 'name'", { instance: message });
                            return message;
                        };
    
                        /**
                         * Decodes a HandlerMapping message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.android.wm.shell.HandlerMapping
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.android.wm.shell.HandlerMapping} HandlerMapping
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        HandlerMapping.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies a HandlerMapping message.
                         * @function verify
                         * @memberof com.android.wm.shell.HandlerMapping
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        HandlerMapping.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (!$util.isInteger(message.id))
                                return "id: integer expected";
                            if (!$util.isString(message.name))
                                return "name: string expected";
                            return null;
                        };
    
                        /**
                         * Creates a HandlerMapping message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.android.wm.shell.HandlerMapping
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.android.wm.shell.HandlerMapping} HandlerMapping
                         */
                        HandlerMapping.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.android.wm.shell.HandlerMapping)
                                return object;
                            var message = new $root.com.android.wm.shell.HandlerMapping();
                            if (object.id != null)
                                message.id = object.id | 0;
                            if (object.name != null)
                                message.name = String(object.name);
                            return message;
                        };
    
                        /**
                         * Creates a plain object from a HandlerMapping message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.android.wm.shell.HandlerMapping
                         * @static
                         * @param {com.android.wm.shell.HandlerMapping} message HandlerMapping
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        HandlerMapping.toObject = function toObject(message, options) {
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
                         * Converts this HandlerMapping to JSON.
                         * @function toJSON
                         * @memberof com.android.wm.shell.HandlerMapping
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        HandlerMapping.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        /**
                         * Gets the default type url for HandlerMapping
                         * @function getTypeUrl
                         * @memberof com.android.wm.shell.HandlerMapping
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        HandlerMapping.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.android.wm.shell.HandlerMapping";
                        };
    
                        return HandlerMapping;
                    })();
    
                    return shell;
                })();
    
                return wm;
            })();
    
            return android;
        })();
    
        return com;
    })();

    return $root;
});
