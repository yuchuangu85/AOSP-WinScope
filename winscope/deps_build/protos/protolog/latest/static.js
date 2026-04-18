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
    var $root = $protobuf.roots.protologlatest || ($protobuf.roots.protologlatest = {});
    
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
    
            protos.ProtoLogMessage = (function() {
    
                /**
                 * Properties of a ProtoLogMessage.
                 * @memberof perfetto.protos
                 * @interface IProtoLogMessage
                 * @property {Long|null} [messageId] ProtoLogMessage messageId
                 * @property {Array.<number>|null} [strParamIids] ProtoLogMessage strParamIids
                 * @property {Array.<Long>|null} [sint64Params] ProtoLogMessage sint64Params
                 * @property {Array.<number>|null} [doubleParams] ProtoLogMessage doubleParams
                 * @property {Array.<number>|null} [booleanParams] ProtoLogMessage booleanParams
                 * @property {number|null} [stacktraceIid] ProtoLogMessage stacktraceIid
                 */
    
                /**
                 * Constructs a new ProtoLogMessage.
                 * @memberof perfetto.protos
                 * @classdesc Represents a ProtoLogMessage.
                 * @implements IProtoLogMessage
                 * @constructor
                 * @param {perfetto.protos.IProtoLogMessage=} [properties] Properties to set
                 */
                function ProtoLogMessage(properties) {
                    this.strParamIids = [];
                    this.sint64Params = [];
                    this.doubleParams = [];
                    this.booleanParams = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ProtoLogMessage messageId.
                 * @member {Long} messageId
                 * @memberof perfetto.protos.ProtoLogMessage
                 * @instance
                 */
                ProtoLogMessage.prototype.messageId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * ProtoLogMessage strParamIids.
                 * @member {Array.<number>} strParamIids
                 * @memberof perfetto.protos.ProtoLogMessage
                 * @instance
                 */
                ProtoLogMessage.prototype.strParamIids = $util.emptyArray;
    
                /**
                 * ProtoLogMessage sint64Params.
                 * @member {Array.<Long>} sint64Params
                 * @memberof perfetto.protos.ProtoLogMessage
                 * @instance
                 */
                ProtoLogMessage.prototype.sint64Params = $util.emptyArray;
    
                /**
                 * ProtoLogMessage doubleParams.
                 * @member {Array.<number>} doubleParams
                 * @memberof perfetto.protos.ProtoLogMessage
                 * @instance
                 */
                ProtoLogMessage.prototype.doubleParams = $util.emptyArray;
    
                /**
                 * ProtoLogMessage booleanParams.
                 * @member {Array.<number>} booleanParams
                 * @memberof perfetto.protos.ProtoLogMessage
                 * @instance
                 */
                ProtoLogMessage.prototype.booleanParams = $util.emptyArray;
    
                /**
                 * ProtoLogMessage stacktraceIid.
                 * @member {number} stacktraceIid
                 * @memberof perfetto.protos.ProtoLogMessage
                 * @instance
                 */
                ProtoLogMessage.prototype.stacktraceIid = 0;
    
                /**
                 * Creates a new ProtoLogMessage instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.ProtoLogMessage
                 * @static
                 * @param {perfetto.protos.IProtoLogMessage=} [properties] Properties to set
                 * @returns {perfetto.protos.ProtoLogMessage} ProtoLogMessage instance
                 */
                ProtoLogMessage.create = function create(properties) {
                    return new ProtoLogMessage(properties);
                };
    
                /**
                 * Encodes the specified ProtoLogMessage message. Does not implicitly {@link perfetto.protos.ProtoLogMessage.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.ProtoLogMessage
                 * @static
                 * @param {perfetto.protos.IProtoLogMessage} message ProtoLogMessage message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ProtoLogMessage.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                        writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.messageId);
                    if (message.strParamIids != null && message.strParamIids.length)
                        for (var i = 0; i < message.strParamIids.length; ++i)
                            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.strParamIids[i]);
                    if (message.sint64Params != null && message.sint64Params.length)
                        for (var i = 0; i < message.sint64Params.length; ++i)
                            writer.uint32(/* id 3, wireType 0 =*/24).sint64(message.sint64Params[i]);
                    if (message.doubleParams != null && message.doubleParams.length)
                        for (var i = 0; i < message.doubleParams.length; ++i)
                            writer.uint32(/* id 4, wireType 1 =*/33).double(message.doubleParams[i]);
                    if (message.booleanParams != null && message.booleanParams.length)
                        for (var i = 0; i < message.booleanParams.length; ++i)
                            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.booleanParams[i]);
                    if (message.stacktraceIid != null && Object.hasOwnProperty.call(message, "stacktraceIid"))
                        writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.stacktraceIid);
                    return writer;
                };
    
                /**
                 * Encodes the specified ProtoLogMessage message, length delimited. Does not implicitly {@link perfetto.protos.ProtoLogMessage.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.ProtoLogMessage
                 * @static
                 * @param {perfetto.protos.IProtoLogMessage} message ProtoLogMessage message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ProtoLogMessage.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a ProtoLogMessage message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.ProtoLogMessage
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.ProtoLogMessage} ProtoLogMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ProtoLogMessage.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.ProtoLogMessage();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.messageId = reader.fixed64();
                                break;
                            }
                        case 2: {
                                if (!(message.strParamIids && message.strParamIids.length))
                                    message.strParamIids = [];
                                if ((tag & 7) === 2) {
                                    var end2 = reader.uint32() + reader.pos;
                                    while (reader.pos < end2)
                                        message.strParamIids.push(reader.uint32());
                                } else
                                    message.strParamIids.push(reader.uint32());
                                break;
                            }
                        case 3: {
                                if (!(message.sint64Params && message.sint64Params.length))
                                    message.sint64Params = [];
                                if ((tag & 7) === 2) {
                                    var end2 = reader.uint32() + reader.pos;
                                    while (reader.pos < end2)
                                        message.sint64Params.push(reader.sint64());
                                } else
                                    message.sint64Params.push(reader.sint64());
                                break;
                            }
                        case 4: {
                                if (!(message.doubleParams && message.doubleParams.length))
                                    message.doubleParams = [];
                                if ((tag & 7) === 2) {
                                    var end2 = reader.uint32() + reader.pos;
                                    while (reader.pos < end2)
                                        message.doubleParams.push(reader.double());
                                } else
                                    message.doubleParams.push(reader.double());
                                break;
                            }
                        case 5: {
                                if (!(message.booleanParams && message.booleanParams.length))
                                    message.booleanParams = [];
                                if ((tag & 7) === 2) {
                                    var end2 = reader.uint32() + reader.pos;
                                    while (reader.pos < end2)
                                        message.booleanParams.push(reader.int32());
                                } else
                                    message.booleanParams.push(reader.int32());
                                break;
                            }
                        case 6: {
                                message.stacktraceIid = reader.uint32();
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
                 * Decodes a ProtoLogMessage message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.ProtoLogMessage
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.ProtoLogMessage} ProtoLogMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ProtoLogMessage.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a ProtoLogMessage message.
                 * @function verify
                 * @memberof perfetto.protos.ProtoLogMessage
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ProtoLogMessage.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.messageId != null && message.hasOwnProperty("messageId"))
                        if (!$util.isInteger(message.messageId) && !(message.messageId && $util.isInteger(message.messageId.low) && $util.isInteger(message.messageId.high)))
                            return "messageId: integer|Long expected";
                    if (message.strParamIids != null && message.hasOwnProperty("strParamIids")) {
                        if (!Array.isArray(message.strParamIids))
                            return "strParamIids: array expected";
                        for (var i = 0; i < message.strParamIids.length; ++i)
                            if (!$util.isInteger(message.strParamIids[i]))
                                return "strParamIids: integer[] expected";
                    }
                    if (message.sint64Params != null && message.hasOwnProperty("sint64Params")) {
                        if (!Array.isArray(message.sint64Params))
                            return "sint64Params: array expected";
                        for (var i = 0; i < message.sint64Params.length; ++i)
                            if (!$util.isInteger(message.sint64Params[i]) && !(message.sint64Params[i] && $util.isInteger(message.sint64Params[i].low) && $util.isInteger(message.sint64Params[i].high)))
                                return "sint64Params: integer|Long[] expected";
                    }
                    if (message.doubleParams != null && message.hasOwnProperty("doubleParams")) {
                        if (!Array.isArray(message.doubleParams))
                            return "doubleParams: array expected";
                        for (var i = 0; i < message.doubleParams.length; ++i)
                            if (typeof message.doubleParams[i] !== "number")
                                return "doubleParams: number[] expected";
                    }
                    if (message.booleanParams != null && message.hasOwnProperty("booleanParams")) {
                        if (!Array.isArray(message.booleanParams))
                            return "booleanParams: array expected";
                        for (var i = 0; i < message.booleanParams.length; ++i)
                            if (!$util.isInteger(message.booleanParams[i]))
                                return "booleanParams: integer[] expected";
                    }
                    if (message.stacktraceIid != null && message.hasOwnProperty("stacktraceIid"))
                        if (!$util.isInteger(message.stacktraceIid))
                            return "stacktraceIid: integer expected";
                    return null;
                };
    
                /**
                 * Creates a ProtoLogMessage message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.ProtoLogMessage
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.ProtoLogMessage} ProtoLogMessage
                 */
                ProtoLogMessage.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.ProtoLogMessage)
                        return object;
                    var message = new $root.perfetto.protos.ProtoLogMessage();
                    if (object.messageId != null)
                        if ($util.Long)
                            (message.messageId = $util.Long.fromValue(object.messageId)).unsigned = false;
                        else if (typeof object.messageId === "string")
                            message.messageId = parseInt(object.messageId, 10);
                        else if (typeof object.messageId === "number")
                            message.messageId = object.messageId;
                        else if (typeof object.messageId === "object")
                            message.messageId = new $util.LongBits(object.messageId.low >>> 0, object.messageId.high >>> 0).toNumber();
                    if (object.strParamIids) {
                        if (!Array.isArray(object.strParamIids))
                            throw TypeError(".perfetto.protos.ProtoLogMessage.strParamIids: array expected");
                        message.strParamIids = [];
                        for (var i = 0; i < object.strParamIids.length; ++i)
                            message.strParamIids[i] = object.strParamIids[i] >>> 0;
                    }
                    if (object.sint64Params) {
                        if (!Array.isArray(object.sint64Params))
                            throw TypeError(".perfetto.protos.ProtoLogMessage.sint64Params: array expected");
                        message.sint64Params = [];
                        for (var i = 0; i < object.sint64Params.length; ++i)
                            if ($util.Long)
                                (message.sint64Params[i] = $util.Long.fromValue(object.sint64Params[i])).unsigned = false;
                            else if (typeof object.sint64Params[i] === "string")
                                message.sint64Params[i] = parseInt(object.sint64Params[i], 10);
                            else if (typeof object.sint64Params[i] === "number")
                                message.sint64Params[i] = object.sint64Params[i];
                            else if (typeof object.sint64Params[i] === "object")
                                message.sint64Params[i] = new $util.LongBits(object.sint64Params[i].low >>> 0, object.sint64Params[i].high >>> 0).toNumber();
                    }
                    if (object.doubleParams) {
                        if (!Array.isArray(object.doubleParams))
                            throw TypeError(".perfetto.protos.ProtoLogMessage.doubleParams: array expected");
                        message.doubleParams = [];
                        for (var i = 0; i < object.doubleParams.length; ++i)
                            message.doubleParams[i] = Number(object.doubleParams[i]);
                    }
                    if (object.booleanParams) {
                        if (!Array.isArray(object.booleanParams))
                            throw TypeError(".perfetto.protos.ProtoLogMessage.booleanParams: array expected");
                        message.booleanParams = [];
                        for (var i = 0; i < object.booleanParams.length; ++i)
                            message.booleanParams[i] = object.booleanParams[i] | 0;
                    }
                    if (object.stacktraceIid != null)
                        message.stacktraceIid = object.stacktraceIid >>> 0;
                    return message;
                };
    
                /**
                 * Creates a plain object from a ProtoLogMessage message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.ProtoLogMessage
                 * @static
                 * @param {perfetto.protos.ProtoLogMessage} message ProtoLogMessage
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ProtoLogMessage.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.strParamIids = [];
                        object.sint64Params = [];
                        object.doubleParams = [];
                        object.booleanParams = [];
                    }
                    if (options.defaults) {
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.messageId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.messageId = options.longs === String ? "0" : 0;
                        object.stacktraceIid = 0;
                    }
                    if (message.messageId != null && message.hasOwnProperty("messageId"))
                        if (typeof message.messageId === "number")
                            object.messageId = options.longs === String ? String(message.messageId) : message.messageId;
                        else
                            object.messageId = options.longs === String ? $util.Long.prototype.toString.call(message.messageId) : options.longs === Number ? new $util.LongBits(message.messageId.low >>> 0, message.messageId.high >>> 0).toNumber() : message.messageId;
                    if (message.strParamIids && message.strParamIids.length) {
                        object.strParamIids = [];
                        for (var j = 0; j < message.strParamIids.length; ++j)
                            object.strParamIids[j] = message.strParamIids[j];
                    }
                    if (message.sint64Params && message.sint64Params.length) {
                        object.sint64Params = [];
                        for (var j = 0; j < message.sint64Params.length; ++j)
                            if (typeof message.sint64Params[j] === "number")
                                object.sint64Params[j] = options.longs === String ? String(message.sint64Params[j]) : message.sint64Params[j];
                            else
                                object.sint64Params[j] = options.longs === String ? $util.Long.prototype.toString.call(message.sint64Params[j]) : options.longs === Number ? new $util.LongBits(message.sint64Params[j].low >>> 0, message.sint64Params[j].high >>> 0).toNumber() : message.sint64Params[j];
                    }
                    if (message.doubleParams && message.doubleParams.length) {
                        object.doubleParams = [];
                        for (var j = 0; j < message.doubleParams.length; ++j)
                            object.doubleParams[j] = options.json && !isFinite(message.doubleParams[j]) ? String(message.doubleParams[j]) : message.doubleParams[j];
                    }
                    if (message.booleanParams && message.booleanParams.length) {
                        object.booleanParams = [];
                        for (var j = 0; j < message.booleanParams.length; ++j)
                            object.booleanParams[j] = message.booleanParams[j];
                    }
                    if (message.stacktraceIid != null && message.hasOwnProperty("stacktraceIid"))
                        object.stacktraceIid = message.stacktraceIid;
                    return object;
                };
    
                /**
                 * Converts this ProtoLogMessage to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.ProtoLogMessage
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ProtoLogMessage.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for ProtoLogMessage
                 * @function getTypeUrl
                 * @memberof perfetto.protos.ProtoLogMessage
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                ProtoLogMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.ProtoLogMessage";
                };
    
                return ProtoLogMessage;
            })();
    
            protos.ProtoLogViewerConfig = (function() {
    
                /**
                 * Properties of a ProtoLogViewerConfig.
                 * @memberof perfetto.protos
                 * @interface IProtoLogViewerConfig
                 * @property {Array.<perfetto.protos.ProtoLogViewerConfig.IMessageData>|null} [messages] ProtoLogViewerConfig messages
                 * @property {Array.<perfetto.protos.ProtoLogViewerConfig.IGroup>|null} [groups] ProtoLogViewerConfig groups
                 */
    
                /**
                 * Constructs a new ProtoLogViewerConfig.
                 * @memberof perfetto.protos
                 * @classdesc Represents a ProtoLogViewerConfig.
                 * @implements IProtoLogViewerConfig
                 * @constructor
                 * @param {perfetto.protos.IProtoLogViewerConfig=} [properties] Properties to set
                 */
                function ProtoLogViewerConfig(properties) {
                    this.messages = [];
                    this.groups = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ProtoLogViewerConfig messages.
                 * @member {Array.<perfetto.protos.ProtoLogViewerConfig.IMessageData>} messages
                 * @memberof perfetto.protos.ProtoLogViewerConfig
                 * @instance
                 */
                ProtoLogViewerConfig.prototype.messages = $util.emptyArray;
    
                /**
                 * ProtoLogViewerConfig groups.
                 * @member {Array.<perfetto.protos.ProtoLogViewerConfig.IGroup>} groups
                 * @memberof perfetto.protos.ProtoLogViewerConfig
                 * @instance
                 */
                ProtoLogViewerConfig.prototype.groups = $util.emptyArray;
    
                /**
                 * Creates a new ProtoLogViewerConfig instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.ProtoLogViewerConfig
                 * @static
                 * @param {perfetto.protos.IProtoLogViewerConfig=} [properties] Properties to set
                 * @returns {perfetto.protos.ProtoLogViewerConfig} ProtoLogViewerConfig instance
                 */
                ProtoLogViewerConfig.create = function create(properties) {
                    return new ProtoLogViewerConfig(properties);
                };
    
                /**
                 * Encodes the specified ProtoLogViewerConfig message. Does not implicitly {@link perfetto.protos.ProtoLogViewerConfig.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.ProtoLogViewerConfig
                 * @static
                 * @param {perfetto.protos.IProtoLogViewerConfig} message ProtoLogViewerConfig message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ProtoLogViewerConfig.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.messages != null && message.messages.length)
                        for (var i = 0; i < message.messages.length; ++i)
                            $root.perfetto.protos.ProtoLogViewerConfig.MessageData.encode(message.messages[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.groups != null && message.groups.length)
                        for (var i = 0; i < message.groups.length; ++i)
                            $root.perfetto.protos.ProtoLogViewerConfig.Group.encode(message.groups[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified ProtoLogViewerConfig message, length delimited. Does not implicitly {@link perfetto.protos.ProtoLogViewerConfig.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.ProtoLogViewerConfig
                 * @static
                 * @param {perfetto.protos.IProtoLogViewerConfig} message ProtoLogViewerConfig message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ProtoLogViewerConfig.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a ProtoLogViewerConfig message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.ProtoLogViewerConfig
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.ProtoLogViewerConfig} ProtoLogViewerConfig
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ProtoLogViewerConfig.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.ProtoLogViewerConfig();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                if (!(message.messages && message.messages.length))
                                    message.messages = [];
                                message.messages.push($root.perfetto.protos.ProtoLogViewerConfig.MessageData.decode(reader, reader.uint32()));
                                break;
                            }
                        case 2: {
                                if (!(message.groups && message.groups.length))
                                    message.groups = [];
                                message.groups.push($root.perfetto.protos.ProtoLogViewerConfig.Group.decode(reader, reader.uint32()));
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
                 * Decodes a ProtoLogViewerConfig message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.ProtoLogViewerConfig
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.ProtoLogViewerConfig} ProtoLogViewerConfig
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ProtoLogViewerConfig.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a ProtoLogViewerConfig message.
                 * @function verify
                 * @memberof perfetto.protos.ProtoLogViewerConfig
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ProtoLogViewerConfig.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.messages != null && message.hasOwnProperty("messages")) {
                        if (!Array.isArray(message.messages))
                            return "messages: array expected";
                        for (var i = 0; i < message.messages.length; ++i) {
                            var error = $root.perfetto.protos.ProtoLogViewerConfig.MessageData.verify(message.messages[i]);
                            if (error)
                                return "messages." + error;
                        }
                    }
                    if (message.groups != null && message.hasOwnProperty("groups")) {
                        if (!Array.isArray(message.groups))
                            return "groups: array expected";
                        for (var i = 0; i < message.groups.length; ++i) {
                            var error = $root.perfetto.protos.ProtoLogViewerConfig.Group.verify(message.groups[i]);
                            if (error)
                                return "groups." + error;
                        }
                    }
                    return null;
                };
    
                /**
                 * Creates a ProtoLogViewerConfig message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.ProtoLogViewerConfig
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.ProtoLogViewerConfig} ProtoLogViewerConfig
                 */
                ProtoLogViewerConfig.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.ProtoLogViewerConfig)
                        return object;
                    var message = new $root.perfetto.protos.ProtoLogViewerConfig();
                    if (object.messages) {
                        if (!Array.isArray(object.messages))
                            throw TypeError(".perfetto.protos.ProtoLogViewerConfig.messages: array expected");
                        message.messages = [];
                        for (var i = 0; i < object.messages.length; ++i) {
                            if (typeof object.messages[i] !== "object")
                                throw TypeError(".perfetto.protos.ProtoLogViewerConfig.messages: object expected");
                            message.messages[i] = $root.perfetto.protos.ProtoLogViewerConfig.MessageData.fromObject(object.messages[i]);
                        }
                    }
                    if (object.groups) {
                        if (!Array.isArray(object.groups))
                            throw TypeError(".perfetto.protos.ProtoLogViewerConfig.groups: array expected");
                        message.groups = [];
                        for (var i = 0; i < object.groups.length; ++i) {
                            if (typeof object.groups[i] !== "object")
                                throw TypeError(".perfetto.protos.ProtoLogViewerConfig.groups: object expected");
                            message.groups[i] = $root.perfetto.protos.ProtoLogViewerConfig.Group.fromObject(object.groups[i]);
                        }
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from a ProtoLogViewerConfig message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.ProtoLogViewerConfig
                 * @static
                 * @param {perfetto.protos.ProtoLogViewerConfig} message ProtoLogViewerConfig
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ProtoLogViewerConfig.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.messages = [];
                        object.groups = [];
                    }
                    if (message.messages && message.messages.length) {
                        object.messages = [];
                        for (var j = 0; j < message.messages.length; ++j)
                            object.messages[j] = $root.perfetto.protos.ProtoLogViewerConfig.MessageData.toObject(message.messages[j], options);
                    }
                    if (message.groups && message.groups.length) {
                        object.groups = [];
                        for (var j = 0; j < message.groups.length; ++j)
                            object.groups[j] = $root.perfetto.protos.ProtoLogViewerConfig.Group.toObject(message.groups[j], options);
                    }
                    return object;
                };
    
                /**
                 * Converts this ProtoLogViewerConfig to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.ProtoLogViewerConfig
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ProtoLogViewerConfig.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for ProtoLogViewerConfig
                 * @function getTypeUrl
                 * @memberof perfetto.protos.ProtoLogViewerConfig
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                ProtoLogViewerConfig.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.ProtoLogViewerConfig";
                };
    
                ProtoLogViewerConfig.MessageData = (function() {
    
                    /**
                     * Properties of a MessageData.
                     * @memberof perfetto.protos.ProtoLogViewerConfig
                     * @interface IMessageData
                     * @property {Long|null} [messageId] MessageData messageId
                     * @property {string|null} [message] MessageData message
                     * @property {perfetto.protos.ProtoLogLevel|null} [level] MessageData level
                     * @property {number|null} [groupId] MessageData groupId
                     * @property {string|null} [location] MessageData location
                     */
    
                    /**
                     * Constructs a new MessageData.
                     * @memberof perfetto.protos.ProtoLogViewerConfig
                     * @classdesc Represents a MessageData.
                     * @implements IMessageData
                     * @constructor
                     * @param {perfetto.protos.ProtoLogViewerConfig.IMessageData=} [properties] Properties to set
                     */
                    function MessageData(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * MessageData messageId.
                     * @member {Long} messageId
                     * @memberof perfetto.protos.ProtoLogViewerConfig.MessageData
                     * @instance
                     */
                    MessageData.prototype.messageId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                    /**
                     * MessageData message.
                     * @member {string} message
                     * @memberof perfetto.protos.ProtoLogViewerConfig.MessageData
                     * @instance
                     */
                    MessageData.prototype.message = "";
    
                    /**
                     * MessageData level.
                     * @member {perfetto.protos.ProtoLogLevel} level
                     * @memberof perfetto.protos.ProtoLogViewerConfig.MessageData
                     * @instance
                     */
                    MessageData.prototype.level = 0;
    
                    /**
                     * MessageData groupId.
                     * @member {number} groupId
                     * @memberof perfetto.protos.ProtoLogViewerConfig.MessageData
                     * @instance
                     */
                    MessageData.prototype.groupId = 0;
    
                    /**
                     * MessageData location.
                     * @member {string} location
                     * @memberof perfetto.protos.ProtoLogViewerConfig.MessageData
                     * @instance
                     */
                    MessageData.prototype.location = "";
    
                    /**
                     * Creates a new MessageData instance using the specified properties.
                     * @function create
                     * @memberof perfetto.protos.ProtoLogViewerConfig.MessageData
                     * @static
                     * @param {perfetto.protos.ProtoLogViewerConfig.IMessageData=} [properties] Properties to set
                     * @returns {perfetto.protos.ProtoLogViewerConfig.MessageData} MessageData instance
                     */
                    MessageData.create = function create(properties) {
                        return new MessageData(properties);
                    };
    
                    /**
                     * Encodes the specified MessageData message. Does not implicitly {@link perfetto.protos.ProtoLogViewerConfig.MessageData.verify|verify} messages.
                     * @function encode
                     * @memberof perfetto.protos.ProtoLogViewerConfig.MessageData
                     * @static
                     * @param {perfetto.protos.ProtoLogViewerConfig.IMessageData} message MessageData message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MessageData.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.messageId);
                        if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
                        if (message.level != null && Object.hasOwnProperty.call(message, "level"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.level);
                        if (message.groupId != null && Object.hasOwnProperty.call(message, "groupId"))
                            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.groupId);
                        if (message.location != null && Object.hasOwnProperty.call(message, "location"))
                            writer.uint32(/* id 5, wireType 2 =*/42).string(message.location);
                        return writer;
                    };
    
                    /**
                     * Encodes the specified MessageData message, length delimited. Does not implicitly {@link perfetto.protos.ProtoLogViewerConfig.MessageData.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof perfetto.protos.ProtoLogViewerConfig.MessageData
                     * @static
                     * @param {perfetto.protos.ProtoLogViewerConfig.IMessageData} message MessageData message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MessageData.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a MessageData message from the specified reader or buffer.
                     * @function decode
                     * @memberof perfetto.protos.ProtoLogViewerConfig.MessageData
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {perfetto.protos.ProtoLogViewerConfig.MessageData} MessageData
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MessageData.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.ProtoLogViewerConfig.MessageData();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1: {
                                    message.messageId = reader.fixed64();
                                    break;
                                }
                            case 2: {
                                    message.message = reader.string();
                                    break;
                                }
                            case 3: {
                                    message.level = reader.int32();
                                    break;
                                }
                            case 4: {
                                    message.groupId = reader.uint32();
                                    break;
                                }
                            case 5: {
                                    message.location = reader.string();
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
                     * Decodes a MessageData message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof perfetto.protos.ProtoLogViewerConfig.MessageData
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {perfetto.protos.ProtoLogViewerConfig.MessageData} MessageData
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MessageData.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a MessageData message.
                     * @function verify
                     * @memberof perfetto.protos.ProtoLogViewerConfig.MessageData
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    MessageData.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.messageId != null && message.hasOwnProperty("messageId"))
                            if (!$util.isInteger(message.messageId) && !(message.messageId && $util.isInteger(message.messageId.low) && $util.isInteger(message.messageId.high)))
                                return "messageId: integer|Long expected";
                        if (message.message != null && message.hasOwnProperty("message"))
                            if (!$util.isString(message.message))
                                return "message: string expected";
                        if (message.level != null && message.hasOwnProperty("level"))
                            switch (message.level) {
                            default:
                                return "level: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                                break;
                            }
                        if (message.groupId != null && message.hasOwnProperty("groupId"))
                            if (!$util.isInteger(message.groupId))
                                return "groupId: integer expected";
                        if (message.location != null && message.hasOwnProperty("location"))
                            if (!$util.isString(message.location))
                                return "location: string expected";
                        return null;
                    };
    
                    /**
                     * Creates a MessageData message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof perfetto.protos.ProtoLogViewerConfig.MessageData
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {perfetto.protos.ProtoLogViewerConfig.MessageData} MessageData
                     */
                    MessageData.fromObject = function fromObject(object) {
                        if (object instanceof $root.perfetto.protos.ProtoLogViewerConfig.MessageData)
                            return object;
                        var message = new $root.perfetto.protos.ProtoLogViewerConfig.MessageData();
                        if (object.messageId != null)
                            if ($util.Long)
                                (message.messageId = $util.Long.fromValue(object.messageId)).unsigned = false;
                            else if (typeof object.messageId === "string")
                                message.messageId = parseInt(object.messageId, 10);
                            else if (typeof object.messageId === "number")
                                message.messageId = object.messageId;
                            else if (typeof object.messageId === "object")
                                message.messageId = new $util.LongBits(object.messageId.low >>> 0, object.messageId.high >>> 0).toNumber();
                        if (object.message != null)
                            message.message = String(object.message);
                        switch (object.level) {
                        default:
                            if (typeof object.level === "number") {
                                message.level = object.level;
                                break;
                            }
                            break;
                        case "PROTOLOG_LEVEL_UNDEFINED":
                        case 0:
                            message.level = 0;
                            break;
                        case "PROTOLOG_LEVEL_DEBUG":
                        case 1:
                            message.level = 1;
                            break;
                        case "PROTOLOG_LEVEL_VERBOSE":
                        case 2:
                            message.level = 2;
                            break;
                        case "PROTOLOG_LEVEL_INFO":
                        case 3:
                            message.level = 3;
                            break;
                        case "PROTOLOG_LEVEL_WARN":
                        case 4:
                            message.level = 4;
                            break;
                        case "PROTOLOG_LEVEL_ERROR":
                        case 5:
                            message.level = 5;
                            break;
                        case "PROTOLOG_LEVEL_WTF":
                        case 6:
                            message.level = 6;
                            break;
                        }
                        if (object.groupId != null)
                            message.groupId = object.groupId >>> 0;
                        if (object.location != null)
                            message.location = String(object.location);
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a MessageData message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof perfetto.protos.ProtoLogViewerConfig.MessageData
                     * @static
                     * @param {perfetto.protos.ProtoLogViewerConfig.MessageData} message MessageData
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    MessageData.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.messageId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.messageId = options.longs === String ? "0" : 0;
                            object.message = "";
                            object.level = options.enums === String ? "PROTOLOG_LEVEL_UNDEFINED" : 0;
                            object.groupId = 0;
                            object.location = "";
                        }
                        if (message.messageId != null && message.hasOwnProperty("messageId"))
                            if (typeof message.messageId === "number")
                                object.messageId = options.longs === String ? String(message.messageId) : message.messageId;
                            else
                                object.messageId = options.longs === String ? $util.Long.prototype.toString.call(message.messageId) : options.longs === Number ? new $util.LongBits(message.messageId.low >>> 0, message.messageId.high >>> 0).toNumber() : message.messageId;
                        if (message.message != null && message.hasOwnProperty("message"))
                            object.message = message.message;
                        if (message.level != null && message.hasOwnProperty("level"))
                            object.level = options.enums === String ? $root.perfetto.protos.ProtoLogLevel[message.level] === undefined ? message.level : $root.perfetto.protos.ProtoLogLevel[message.level] : message.level;
                        if (message.groupId != null && message.hasOwnProperty("groupId"))
                            object.groupId = message.groupId;
                        if (message.location != null && message.hasOwnProperty("location"))
                            object.location = message.location;
                        return object;
                    };
    
                    /**
                     * Converts this MessageData to JSON.
                     * @function toJSON
                     * @memberof perfetto.protos.ProtoLogViewerConfig.MessageData
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    MessageData.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    /**
                     * Gets the default type url for MessageData
                     * @function getTypeUrl
                     * @memberof perfetto.protos.ProtoLogViewerConfig.MessageData
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    MessageData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/perfetto.protos.ProtoLogViewerConfig.MessageData";
                    };
    
                    return MessageData;
                })();
    
                ProtoLogViewerConfig.Group = (function() {
    
                    /**
                     * Properties of a Group.
                     * @memberof perfetto.protos.ProtoLogViewerConfig
                     * @interface IGroup
                     * @property {number|null} [id] Group id
                     * @property {string|null} [name] Group name
                     * @property {string|null} [tag] Group tag
                     */
    
                    /**
                     * Constructs a new Group.
                     * @memberof perfetto.protos.ProtoLogViewerConfig
                     * @classdesc Represents a Group.
                     * @implements IGroup
                     * @constructor
                     * @param {perfetto.protos.ProtoLogViewerConfig.IGroup=} [properties] Properties to set
                     */
                    function Group(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * Group id.
                     * @member {number} id
                     * @memberof perfetto.protos.ProtoLogViewerConfig.Group
                     * @instance
                     */
                    Group.prototype.id = 0;
    
                    /**
                     * Group name.
                     * @member {string} name
                     * @memberof perfetto.protos.ProtoLogViewerConfig.Group
                     * @instance
                     */
                    Group.prototype.name = "";
    
                    /**
                     * Group tag.
                     * @member {string} tag
                     * @memberof perfetto.protos.ProtoLogViewerConfig.Group
                     * @instance
                     */
                    Group.prototype.tag = "";
    
                    /**
                     * Creates a new Group instance using the specified properties.
                     * @function create
                     * @memberof perfetto.protos.ProtoLogViewerConfig.Group
                     * @static
                     * @param {perfetto.protos.ProtoLogViewerConfig.IGroup=} [properties] Properties to set
                     * @returns {perfetto.protos.ProtoLogViewerConfig.Group} Group instance
                     */
                    Group.create = function create(properties) {
                        return new Group(properties);
                    };
    
                    /**
                     * Encodes the specified Group message. Does not implicitly {@link perfetto.protos.ProtoLogViewerConfig.Group.verify|verify} messages.
                     * @function encode
                     * @memberof perfetto.protos.ProtoLogViewerConfig.Group
                     * @static
                     * @param {perfetto.protos.ProtoLogViewerConfig.IGroup} message Group message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Group.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
                        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                        if (message.tag != null && Object.hasOwnProperty.call(message, "tag"))
                            writer.uint32(/* id 3, wireType 2 =*/26).string(message.tag);
                        return writer;
                    };
    
                    /**
                     * Encodes the specified Group message, length delimited. Does not implicitly {@link perfetto.protos.ProtoLogViewerConfig.Group.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof perfetto.protos.ProtoLogViewerConfig.Group
                     * @static
                     * @param {perfetto.protos.ProtoLogViewerConfig.IGroup} message Group message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Group.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a Group message from the specified reader or buffer.
                     * @function decode
                     * @memberof perfetto.protos.ProtoLogViewerConfig.Group
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {perfetto.protos.ProtoLogViewerConfig.Group} Group
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Group.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.ProtoLogViewerConfig.Group();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1: {
                                    message.id = reader.uint32();
                                    break;
                                }
                            case 2: {
                                    message.name = reader.string();
                                    break;
                                }
                            case 3: {
                                    message.tag = reader.string();
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
                     * Decodes a Group message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof perfetto.protos.ProtoLogViewerConfig.Group
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {perfetto.protos.ProtoLogViewerConfig.Group} Group
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Group.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a Group message.
                     * @function verify
                     * @memberof perfetto.protos.ProtoLogViewerConfig.Group
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Group.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.id != null && message.hasOwnProperty("id"))
                            if (!$util.isInteger(message.id))
                                return "id: integer expected";
                        if (message.name != null && message.hasOwnProperty("name"))
                            if (!$util.isString(message.name))
                                return "name: string expected";
                        if (message.tag != null && message.hasOwnProperty("tag"))
                            if (!$util.isString(message.tag))
                                return "tag: string expected";
                        return null;
                    };
    
                    /**
                     * Creates a Group message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof perfetto.protos.ProtoLogViewerConfig.Group
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {perfetto.protos.ProtoLogViewerConfig.Group} Group
                     */
                    Group.fromObject = function fromObject(object) {
                        if (object instanceof $root.perfetto.protos.ProtoLogViewerConfig.Group)
                            return object;
                        var message = new $root.perfetto.protos.ProtoLogViewerConfig.Group();
                        if (object.id != null)
                            message.id = object.id >>> 0;
                        if (object.name != null)
                            message.name = String(object.name);
                        if (object.tag != null)
                            message.tag = String(object.tag);
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a Group message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof perfetto.protos.ProtoLogViewerConfig.Group
                     * @static
                     * @param {perfetto.protos.ProtoLogViewerConfig.Group} message Group
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Group.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.id = 0;
                            object.name = "";
                            object.tag = "";
                        }
                        if (message.id != null && message.hasOwnProperty("id"))
                            object.id = message.id;
                        if (message.name != null && message.hasOwnProperty("name"))
                            object.name = message.name;
                        if (message.tag != null && message.hasOwnProperty("tag"))
                            object.tag = message.tag;
                        return object;
                    };
    
                    /**
                     * Converts this Group to JSON.
                     * @function toJSON
                     * @memberof perfetto.protos.ProtoLogViewerConfig.Group
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Group.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    /**
                     * Gets the default type url for Group
                     * @function getTypeUrl
                     * @memberof perfetto.protos.ProtoLogViewerConfig.Group
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    Group.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/perfetto.protos.ProtoLogViewerConfig.Group";
                    };
    
                    return Group;
                })();
    
                return ProtoLogViewerConfig;
            })();
    
            /**
             * ProtoLogLevel enum.
             * @name perfetto.protos.ProtoLogLevel
             * @enum {number}
             * @property {number} PROTOLOG_LEVEL_UNDEFINED=0 PROTOLOG_LEVEL_UNDEFINED value
             * @property {number} PROTOLOG_LEVEL_DEBUG=1 PROTOLOG_LEVEL_DEBUG value
             * @property {number} PROTOLOG_LEVEL_VERBOSE=2 PROTOLOG_LEVEL_VERBOSE value
             * @property {number} PROTOLOG_LEVEL_INFO=3 PROTOLOG_LEVEL_INFO value
             * @property {number} PROTOLOG_LEVEL_WARN=4 PROTOLOG_LEVEL_WARN value
             * @property {number} PROTOLOG_LEVEL_ERROR=5 PROTOLOG_LEVEL_ERROR value
             * @property {number} PROTOLOG_LEVEL_WTF=6 PROTOLOG_LEVEL_WTF value
             */
            protos.ProtoLogLevel = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "PROTOLOG_LEVEL_UNDEFINED"] = 0;
                values[valuesById[1] = "PROTOLOG_LEVEL_DEBUG"] = 1;
                values[valuesById[2] = "PROTOLOG_LEVEL_VERBOSE"] = 2;
                values[valuesById[3] = "PROTOLOG_LEVEL_INFO"] = 3;
                values[valuesById[4] = "PROTOLOG_LEVEL_WARN"] = 4;
                values[valuesById[5] = "PROTOLOG_LEVEL_ERROR"] = 5;
                values[valuesById[6] = "PROTOLOG_LEVEL_WTF"] = 6;
                return values;
            })();
    
            return protos;
        })();
    
        return perfetto;
    })();

    return $root;
});
