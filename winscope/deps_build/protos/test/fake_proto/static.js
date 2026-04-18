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
    var $root = $protobuf.roots.testfake_proto || ($protobuf.roots.testfake_proto = {});
    
    $root.winscope = (function() {
    
        /**
         * Namespace winscope.
         * @exports winscope
         * @namespace
         */
        var winscope = {};
    
        winscope.test = (function() {
    
            /**
             * Namespace test.
             * @memberof winscope
             * @namespace
             */
            var test = {};
    
            test.RootMessage = (function() {
    
                /**
                 * Properties of a RootMessage.
                 * @memberof winscope.test
                 * @interface IRootMessage
                 * @property {winscope.test.IEntry|null} [entry] RootMessage entry
                 */
    
                /**
                 * Constructs a new RootMessage.
                 * @memberof winscope.test
                 * @classdesc Represents a RootMessage.
                 * @implements IRootMessage
                 * @constructor
                 * @param {winscope.test.IRootMessage=} [properties] Properties to set
                 */
                function RootMessage(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * RootMessage entry.
                 * @member {winscope.test.IEntry|null|undefined} entry
                 * @memberof winscope.test.RootMessage
                 * @instance
                 */
                RootMessage.prototype.entry = null;
    
                /**
                 * Creates a new RootMessage instance using the specified properties.
                 * @function create
                 * @memberof winscope.test.RootMessage
                 * @static
                 * @param {winscope.test.IRootMessage=} [properties] Properties to set
                 * @returns {winscope.test.RootMessage} RootMessage instance
                 */
                RootMessage.create = function create(properties) {
                    return new RootMessage(properties);
                };
    
                /**
                 * Encodes the specified RootMessage message. Does not implicitly {@link winscope.test.RootMessage.verify|verify} messages.
                 * @function encode
                 * @memberof winscope.test.RootMessage
                 * @static
                 * @param {winscope.test.IRootMessage} message RootMessage message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                RootMessage.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.entry != null && Object.hasOwnProperty.call(message, "entry"))
                        $root.winscope.test.Entry.encode(message.entry, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified RootMessage message, length delimited. Does not implicitly {@link winscope.test.RootMessage.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof winscope.test.RootMessage
                 * @static
                 * @param {winscope.test.IRootMessage} message RootMessage message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                RootMessage.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a RootMessage message from the specified reader or buffer.
                 * @function decode
                 * @memberof winscope.test.RootMessage
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {winscope.test.RootMessage} RootMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                RootMessage.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.winscope.test.RootMessage();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.entry = $root.winscope.test.Entry.decode(reader, reader.uint32());
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
                 * Decodes a RootMessage message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof winscope.test.RootMessage
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {winscope.test.RootMessage} RootMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                RootMessage.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a RootMessage message.
                 * @function verify
                 * @memberof winscope.test.RootMessage
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                RootMessage.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.entry != null && message.hasOwnProperty("entry")) {
                        var error = $root.winscope.test.Entry.verify(message.entry);
                        if (error)
                            return "entry." + error;
                    }
                    return null;
                };
    
                /**
                 * Creates a RootMessage message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof winscope.test.RootMessage
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {winscope.test.RootMessage} RootMessage
                 */
                RootMessage.fromObject = function fromObject(object) {
                    if (object instanceof $root.winscope.test.RootMessage)
                        return object;
                    var message = new $root.winscope.test.RootMessage();
                    if (object.entry != null) {
                        if (typeof object.entry !== "object")
                            throw TypeError(".winscope.test.RootMessage.entry: object expected");
                        message.entry = $root.winscope.test.Entry.fromObject(object.entry);
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from a RootMessage message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof winscope.test.RootMessage
                 * @static
                 * @param {winscope.test.RootMessage} message RootMessage
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                RootMessage.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.entry = null;
                    if (message.entry != null && message.hasOwnProperty("entry"))
                        object.entry = $root.winscope.test.Entry.toObject(message.entry, options);
                    return object;
                };
    
                /**
                 * Converts this RootMessage to JSON.
                 * @function toJSON
                 * @memberof winscope.test.RootMessage
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                RootMessage.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for RootMessage
                 * @function getTypeUrl
                 * @memberof winscope.test.RootMessage
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                RootMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/winscope.test.RootMessage";
                };
    
                return RootMessage;
            })();
    
            /**
             * Enum0 enum.
             * @name winscope.test.Enum0
             * @enum {number}
             * @property {number} ENUM0_VALUE_ZERO=0 ENUM0_VALUE_ZERO value
             * @property {number} ENUM0_VALUE_ONE=1 ENUM0_VALUE_ONE value
             */
            test.Enum0 = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "ENUM0_VALUE_ZERO"] = 0;
                values[valuesById[1] = "ENUM0_VALUE_ONE"] = 1;
                return values;
            })();
    
            test.Entry = (function() {
    
                /**
                 * Properties of an Entry.
                 * @memberof winscope.test
                 * @interface IEntry
                 * @property {winscope.test.Enum0|null} [enum0] Entry enum0
                 * @property {winscope.test.Entry.Enum1|null} [enum1] Entry enum1
                 * @property {Array.<number>|null} [array] Entry array
                 * @property {number|null} [number_32bit] Entry number_32bit
                 * @property {Long|null} [number_64bit] Entry number_64bit
                 * @property {Long|null} [_case_64bit] Entry _case_64bit
                 * @property {Long|null} [case_64bit] Entry case_64bit
                 * @property {Long|null} [case_64bitLsb] Entry case_64bitLsb
                 * @property {Long|null} [case_64Bit] Entry case_64Bit
                 * @property {Long|null} [case_64BitLsb] Entry case_64BitLsb
                 * @property {boolean|null} [boolValue] Entry boolValue
                 */
    
                /**
                 * Constructs a new Entry.
                 * @memberof winscope.test
                 * @classdesc Represents an Entry.
                 * @implements IEntry
                 * @constructor
                 * @param {winscope.test.IEntry=} [properties] Properties to set
                 */
                function Entry(properties) {
                    this.array = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Entry enum0.
                 * @member {winscope.test.Enum0} enum0
                 * @memberof winscope.test.Entry
                 * @instance
                 */
                Entry.prototype.enum0 = 0;
    
                /**
                 * Entry enum1.
                 * @member {winscope.test.Entry.Enum1} enum1
                 * @memberof winscope.test.Entry
                 * @instance
                 */
                Entry.prototype.enum1 = 0;
    
                /**
                 * Entry array.
                 * @member {Array.<number>} array
                 * @memberof winscope.test.Entry
                 * @instance
                 */
                Entry.prototype.array = $util.emptyArray;
    
                /**
                 * Entry number_32bit.
                 * @member {number} number_32bit
                 * @memberof winscope.test.Entry
                 * @instance
                 */
                Entry.prototype.number_32bit = 0;
    
                /**
                 * Entry number_64bit.
                 * @member {Long} number_64bit
                 * @memberof winscope.test.Entry
                 * @instance
                 */
                Entry.prototype.number_64bit = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * Entry _case_64bit.
                 * @member {Long} _case_64bit
                 * @memberof winscope.test.Entry
                 * @instance
                 */
                Entry.prototype._case_64bit = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * Entry case_64bit.
                 * @member {Long} case_64bit
                 * @memberof winscope.test.Entry
                 * @instance
                 */
                Entry.prototype.case_64bit = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * Entry case_64bitLsb.
                 * @member {Long} case_64bitLsb
                 * @memberof winscope.test.Entry
                 * @instance
                 */
                Entry.prototype.case_64bitLsb = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * Entry case_64Bit.
                 * @member {Long} case_64Bit
                 * @memberof winscope.test.Entry
                 * @instance
                 */
                Entry.prototype.case_64Bit = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * Entry case_64BitLsb.
                 * @member {Long} case_64BitLsb
                 * @memberof winscope.test.Entry
                 * @instance
                 */
                Entry.prototype.case_64BitLsb = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * Entry boolValue.
                 * @member {boolean} boolValue
                 * @memberof winscope.test.Entry
                 * @instance
                 */
                Entry.prototype.boolValue = false;
    
                /**
                 * Creates a new Entry instance using the specified properties.
                 * @function create
                 * @memberof winscope.test.Entry
                 * @static
                 * @param {winscope.test.IEntry=} [properties] Properties to set
                 * @returns {winscope.test.Entry} Entry instance
                 */
                Entry.create = function create(properties) {
                    return new Entry(properties);
                };
    
                /**
                 * Encodes the specified Entry message. Does not implicitly {@link winscope.test.Entry.verify|verify} messages.
                 * @function encode
                 * @memberof winscope.test.Entry
                 * @static
                 * @param {winscope.test.IEntry} message Entry message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Entry.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.enum0 != null && Object.hasOwnProperty.call(message, "enum0"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.enum0);
                    if (message.enum1 != null && Object.hasOwnProperty.call(message, "enum1"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.enum1);
                    if (message.array != null && message.array.length)
                        for (var i = 0; i < message.array.length; ++i)
                            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.array[i]);
                    if (message.number_32bit != null && Object.hasOwnProperty.call(message, "number_32bit"))
                        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.number_32bit);
                    if (message.number_64bit != null && Object.hasOwnProperty.call(message, "number_64bit"))
                        writer.uint32(/* id 5, wireType 0 =*/40).int64(message.number_64bit);
                    if (message._case_64bit != null && Object.hasOwnProperty.call(message, "_case_64bit"))
                        writer.uint32(/* id 6, wireType 0 =*/48).int64(message._case_64bit);
                    if (message.case_64bit != null && Object.hasOwnProperty.call(message, "case_64bit"))
                        writer.uint32(/* id 7, wireType 0 =*/56).int64(message.case_64bit);
                    if (message.case_64bitLsb != null && Object.hasOwnProperty.call(message, "case_64bitLsb"))
                        writer.uint32(/* id 8, wireType 0 =*/64).int64(message.case_64bitLsb);
                    if (message.case_64Bit != null && Object.hasOwnProperty.call(message, "case_64Bit"))
                        writer.uint32(/* id 9, wireType 0 =*/72).int64(message.case_64Bit);
                    if (message.case_64BitLsb != null && Object.hasOwnProperty.call(message, "case_64BitLsb"))
                        writer.uint32(/* id 10, wireType 0 =*/80).int64(message.case_64BitLsb);
                    if (message.boolValue != null && Object.hasOwnProperty.call(message, "boolValue"))
                        writer.uint32(/* id 11, wireType 0 =*/88).bool(message.boolValue);
                    return writer;
                };
    
                /**
                 * Encodes the specified Entry message, length delimited. Does not implicitly {@link winscope.test.Entry.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof winscope.test.Entry
                 * @static
                 * @param {winscope.test.IEntry} message Entry message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Entry.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an Entry message from the specified reader or buffer.
                 * @function decode
                 * @memberof winscope.test.Entry
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {winscope.test.Entry} Entry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Entry.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.winscope.test.Entry();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.enum0 = reader.int32();
                                break;
                            }
                        case 2: {
                                message.enum1 = reader.int32();
                                break;
                            }
                        case 3: {
                                if (!(message.array && message.array.length))
                                    message.array = [];
                                if ((tag & 7) === 2) {
                                    var end2 = reader.uint32() + reader.pos;
                                    while (reader.pos < end2)
                                        message.array.push(reader.int32());
                                } else
                                    message.array.push(reader.int32());
                                break;
                            }
                        case 4: {
                                message.number_32bit = reader.int32();
                                break;
                            }
                        case 5: {
                                message.number_64bit = reader.int64();
                                break;
                            }
                        case 6: {
                                message._case_64bit = reader.int64();
                                break;
                            }
                        case 7: {
                                message.case_64bit = reader.int64();
                                break;
                            }
                        case 8: {
                                message.case_64bitLsb = reader.int64();
                                break;
                            }
                        case 9: {
                                message.case_64Bit = reader.int64();
                                break;
                            }
                        case 10: {
                                message.case_64BitLsb = reader.int64();
                                break;
                            }
                        case 11: {
                                message.boolValue = reader.bool();
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
                 * Decodes an Entry message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof winscope.test.Entry
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {winscope.test.Entry} Entry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Entry.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies an Entry message.
                 * @function verify
                 * @memberof winscope.test.Entry
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Entry.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.enum0 != null && message.hasOwnProperty("enum0"))
                        switch (message.enum0) {
                        default:
                            return "enum0: enum value expected";
                        case 0:
                        case 1:
                            break;
                        }
                    if (message.enum1 != null && message.hasOwnProperty("enum1"))
                        switch (message.enum1) {
                        default:
                            return "enum1: enum value expected";
                        case 0:
                        case 1:
                            break;
                        }
                    if (message.array != null && message.hasOwnProperty("array")) {
                        if (!Array.isArray(message.array))
                            return "array: array expected";
                        for (var i = 0; i < message.array.length; ++i)
                            if (!$util.isInteger(message.array[i]))
                                return "array: integer[] expected";
                    }
                    if (message.number_32bit != null && message.hasOwnProperty("number_32bit"))
                        if (!$util.isInteger(message.number_32bit))
                            return "number_32bit: integer expected";
                    if (message.number_64bit != null && message.hasOwnProperty("number_64bit"))
                        if (!$util.isInteger(message.number_64bit) && !(message.number_64bit && $util.isInteger(message.number_64bit.low) && $util.isInteger(message.number_64bit.high)))
                            return "number_64bit: integer|Long expected";
                    if (message._case_64bit != null && message.hasOwnProperty("_case_64bit"))
                        if (!$util.isInteger(message._case_64bit) && !(message._case_64bit && $util.isInteger(message._case_64bit.low) && $util.isInteger(message._case_64bit.high)))
                            return "_case_64bit: integer|Long expected";
                    if (message.case_64bit != null && message.hasOwnProperty("case_64bit"))
                        if (!$util.isInteger(message.case_64bit) && !(message.case_64bit && $util.isInteger(message.case_64bit.low) && $util.isInteger(message.case_64bit.high)))
                            return "case_64bit: integer|Long expected";
                    if (message.case_64bitLsb != null && message.hasOwnProperty("case_64bitLsb"))
                        if (!$util.isInteger(message.case_64bitLsb) && !(message.case_64bitLsb && $util.isInteger(message.case_64bitLsb.low) && $util.isInteger(message.case_64bitLsb.high)))
                            return "case_64bitLsb: integer|Long expected";
                    if (message.case_64Bit != null && message.hasOwnProperty("case_64Bit"))
                        if (!$util.isInteger(message.case_64Bit) && !(message.case_64Bit && $util.isInteger(message.case_64Bit.low) && $util.isInteger(message.case_64Bit.high)))
                            return "case_64Bit: integer|Long expected";
                    if (message.case_64BitLsb != null && message.hasOwnProperty("case_64BitLsb"))
                        if (!$util.isInteger(message.case_64BitLsb) && !(message.case_64BitLsb && $util.isInteger(message.case_64BitLsb.low) && $util.isInteger(message.case_64BitLsb.high)))
                            return "case_64BitLsb: integer|Long expected";
                    if (message.boolValue != null && message.hasOwnProperty("boolValue"))
                        if (typeof message.boolValue !== "boolean")
                            return "boolValue: boolean expected";
                    return null;
                };
    
                /**
                 * Creates an Entry message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof winscope.test.Entry
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {winscope.test.Entry} Entry
                 */
                Entry.fromObject = function fromObject(object) {
                    if (object instanceof $root.winscope.test.Entry)
                        return object;
                    var message = new $root.winscope.test.Entry();
                    switch (object.enum0) {
                    default:
                        if (typeof object.enum0 === "number") {
                            message.enum0 = object.enum0;
                            break;
                        }
                        break;
                    case "ENUM0_VALUE_ZERO":
                    case 0:
                        message.enum0 = 0;
                        break;
                    case "ENUM0_VALUE_ONE":
                    case 1:
                        message.enum0 = 1;
                        break;
                    }
                    switch (object.enum1) {
                    default:
                        if (typeof object.enum1 === "number") {
                            message.enum1 = object.enum1;
                            break;
                        }
                        break;
                    case "ENUM1_VALUE_ZERO":
                    case 0:
                        message.enum1 = 0;
                        break;
                    case "ENUM1_VALUE_ONE":
                    case 1:
                        message.enum1 = 1;
                        break;
                    }
                    if (object.array) {
                        if (!Array.isArray(object.array))
                            throw TypeError(".winscope.test.Entry.array: array expected");
                        message.array = [];
                        for (var i = 0; i < object.array.length; ++i)
                            message.array[i] = object.array[i] | 0;
                    }
                    if (object.number_32bit != null)
                        message.number_32bit = object.number_32bit | 0;
                    if (object.number_64bit != null)
                        if ($util.Long)
                            (message.number_64bit = $util.Long.fromValue(object.number_64bit)).unsigned = false;
                        else if (typeof object.number_64bit === "string")
                            message.number_64bit = parseInt(object.number_64bit, 10);
                        else if (typeof object.number_64bit === "number")
                            message.number_64bit = object.number_64bit;
                        else if (typeof object.number_64bit === "object")
                            message.number_64bit = new $util.LongBits(object.number_64bit.low >>> 0, object.number_64bit.high >>> 0).toNumber();
                    if (object._case_64bit != null)
                        if ($util.Long)
                            (message._case_64bit = $util.Long.fromValue(object._case_64bit)).unsigned = false;
                        else if (typeof object._case_64bit === "string")
                            message._case_64bit = parseInt(object._case_64bit, 10);
                        else if (typeof object._case_64bit === "number")
                            message._case_64bit = object._case_64bit;
                        else if (typeof object._case_64bit === "object")
                            message._case_64bit = new $util.LongBits(object._case_64bit.low >>> 0, object._case_64bit.high >>> 0).toNumber();
                    if (object.case_64bit != null)
                        if ($util.Long)
                            (message.case_64bit = $util.Long.fromValue(object.case_64bit)).unsigned = false;
                        else if (typeof object.case_64bit === "string")
                            message.case_64bit = parseInt(object.case_64bit, 10);
                        else if (typeof object.case_64bit === "number")
                            message.case_64bit = object.case_64bit;
                        else if (typeof object.case_64bit === "object")
                            message.case_64bit = new $util.LongBits(object.case_64bit.low >>> 0, object.case_64bit.high >>> 0).toNumber();
                    if (object.case_64bitLsb != null)
                        if ($util.Long)
                            (message.case_64bitLsb = $util.Long.fromValue(object.case_64bitLsb)).unsigned = false;
                        else if (typeof object.case_64bitLsb === "string")
                            message.case_64bitLsb = parseInt(object.case_64bitLsb, 10);
                        else if (typeof object.case_64bitLsb === "number")
                            message.case_64bitLsb = object.case_64bitLsb;
                        else if (typeof object.case_64bitLsb === "object")
                            message.case_64bitLsb = new $util.LongBits(object.case_64bitLsb.low >>> 0, object.case_64bitLsb.high >>> 0).toNumber();
                    if (object.case_64Bit != null)
                        if ($util.Long)
                            (message.case_64Bit = $util.Long.fromValue(object.case_64Bit)).unsigned = false;
                        else if (typeof object.case_64Bit === "string")
                            message.case_64Bit = parseInt(object.case_64Bit, 10);
                        else if (typeof object.case_64Bit === "number")
                            message.case_64Bit = object.case_64Bit;
                        else if (typeof object.case_64Bit === "object")
                            message.case_64Bit = new $util.LongBits(object.case_64Bit.low >>> 0, object.case_64Bit.high >>> 0).toNumber();
                    if (object.case_64BitLsb != null)
                        if ($util.Long)
                            (message.case_64BitLsb = $util.Long.fromValue(object.case_64BitLsb)).unsigned = false;
                        else if (typeof object.case_64BitLsb === "string")
                            message.case_64BitLsb = parseInt(object.case_64BitLsb, 10);
                        else if (typeof object.case_64BitLsb === "number")
                            message.case_64BitLsb = object.case_64BitLsb;
                        else if (typeof object.case_64BitLsb === "object")
                            message.case_64BitLsb = new $util.LongBits(object.case_64BitLsb.low >>> 0, object.case_64BitLsb.high >>> 0).toNumber();
                    if (object.boolValue != null)
                        message.boolValue = Boolean(object.boolValue);
                    return message;
                };
    
                /**
                 * Creates a plain object from an Entry message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof winscope.test.Entry
                 * @static
                 * @param {winscope.test.Entry} message Entry
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Entry.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.array = [];
                    if (options.defaults) {
                        object.enum0 = options.enums === String ? "ENUM0_VALUE_ZERO" : 0;
                        object.enum1 = options.enums === String ? "ENUM1_VALUE_ZERO" : 0;
                        object.number_32bit = 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.number_64bit = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.number_64bit = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object._case_64bit = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object._case_64bit = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.case_64bit = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.case_64bit = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.case_64bitLsb = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.case_64bitLsb = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.case_64Bit = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.case_64Bit = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.case_64BitLsb = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.case_64BitLsb = options.longs === String ? "0" : 0;
                        object.boolValue = false;
                    }
                    if (message.enum0 != null && message.hasOwnProperty("enum0"))
                        object.enum0 = options.enums === String ? $root.winscope.test.Enum0[message.enum0] === undefined ? message.enum0 : $root.winscope.test.Enum0[message.enum0] : message.enum0;
                    if (message.enum1 != null && message.hasOwnProperty("enum1"))
                        object.enum1 = options.enums === String ? $root.winscope.test.Entry.Enum1[message.enum1] === undefined ? message.enum1 : $root.winscope.test.Entry.Enum1[message.enum1] : message.enum1;
                    if (message.array && message.array.length) {
                        object.array = [];
                        for (var j = 0; j < message.array.length; ++j)
                            object.array[j] = message.array[j];
                    }
                    if (message.number_32bit != null && message.hasOwnProperty("number_32bit"))
                        object.number_32bit = message.number_32bit;
                    if (message.number_64bit != null && message.hasOwnProperty("number_64bit"))
                        if (typeof message.number_64bit === "number")
                            object.number_64bit = options.longs === String ? String(message.number_64bit) : message.number_64bit;
                        else
                            object.number_64bit = options.longs === String ? $util.Long.prototype.toString.call(message.number_64bit) : options.longs === Number ? new $util.LongBits(message.number_64bit.low >>> 0, message.number_64bit.high >>> 0).toNumber() : message.number_64bit;
                    if (message._case_64bit != null && message.hasOwnProperty("_case_64bit"))
                        if (typeof message._case_64bit === "number")
                            object._case_64bit = options.longs === String ? String(message._case_64bit) : message._case_64bit;
                        else
                            object._case_64bit = options.longs === String ? $util.Long.prototype.toString.call(message._case_64bit) : options.longs === Number ? new $util.LongBits(message._case_64bit.low >>> 0, message._case_64bit.high >>> 0).toNumber() : message._case_64bit;
                    if (message.case_64bit != null && message.hasOwnProperty("case_64bit"))
                        if (typeof message.case_64bit === "number")
                            object.case_64bit = options.longs === String ? String(message.case_64bit) : message.case_64bit;
                        else
                            object.case_64bit = options.longs === String ? $util.Long.prototype.toString.call(message.case_64bit) : options.longs === Number ? new $util.LongBits(message.case_64bit.low >>> 0, message.case_64bit.high >>> 0).toNumber() : message.case_64bit;
                    if (message.case_64bitLsb != null && message.hasOwnProperty("case_64bitLsb"))
                        if (typeof message.case_64bitLsb === "number")
                            object.case_64bitLsb = options.longs === String ? String(message.case_64bitLsb) : message.case_64bitLsb;
                        else
                            object.case_64bitLsb = options.longs === String ? $util.Long.prototype.toString.call(message.case_64bitLsb) : options.longs === Number ? new $util.LongBits(message.case_64bitLsb.low >>> 0, message.case_64bitLsb.high >>> 0).toNumber() : message.case_64bitLsb;
                    if (message.case_64Bit != null && message.hasOwnProperty("case_64Bit"))
                        if (typeof message.case_64Bit === "number")
                            object.case_64Bit = options.longs === String ? String(message.case_64Bit) : message.case_64Bit;
                        else
                            object.case_64Bit = options.longs === String ? $util.Long.prototype.toString.call(message.case_64Bit) : options.longs === Number ? new $util.LongBits(message.case_64Bit.low >>> 0, message.case_64Bit.high >>> 0).toNumber() : message.case_64Bit;
                    if (message.case_64BitLsb != null && message.hasOwnProperty("case_64BitLsb"))
                        if (typeof message.case_64BitLsb === "number")
                            object.case_64BitLsb = options.longs === String ? String(message.case_64BitLsb) : message.case_64BitLsb;
                        else
                            object.case_64BitLsb = options.longs === String ? $util.Long.prototype.toString.call(message.case_64BitLsb) : options.longs === Number ? new $util.LongBits(message.case_64BitLsb.low >>> 0, message.case_64BitLsb.high >>> 0).toNumber() : message.case_64BitLsb;
                    if (message.boolValue != null && message.hasOwnProperty("boolValue"))
                        object.boolValue = message.boolValue;
                    return object;
                };
    
                /**
                 * Converts this Entry to JSON.
                 * @function toJSON
                 * @memberof winscope.test.Entry
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Entry.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for Entry
                 * @function getTypeUrl
                 * @memberof winscope.test.Entry
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Entry.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/winscope.test.Entry";
                };
    
                /**
                 * Enum1 enum.
                 * @name winscope.test.Entry.Enum1
                 * @enum {number}
                 * @property {number} ENUM1_VALUE_ZERO=0 ENUM1_VALUE_ZERO value
                 * @property {number} ENUM1_VALUE_ONE=1 ENUM1_VALUE_ONE value
                 */
                Entry.Enum1 = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "ENUM1_VALUE_ZERO"] = 0;
                    values[valuesById[1] = "ENUM1_VALUE_ONE"] = 1;
                    return values;
                })();
    
                return Entry;
            })();
    
            return test;
        })();
    
        return winscope;
    })();

    return $root;
});
