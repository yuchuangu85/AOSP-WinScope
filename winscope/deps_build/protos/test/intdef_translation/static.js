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
    var $root = $protobuf.roots.testintdef_translation || ($protobuf.roots.testintdef_translation = {});
    
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
                 * @property {winscope.test.IInputWindowInfoProto|null} [inputWindowInfo] RootMessage inputWindowInfo
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
                 * RootMessage inputWindowInfo.
                 * @member {winscope.test.IInputWindowInfoProto|null|undefined} inputWindowInfo
                 * @memberof winscope.test.RootMessage
                 * @instance
                 */
                RootMessage.prototype.inputWindowInfo = null;
    
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
                    if (message.inputWindowInfo != null && Object.hasOwnProperty.call(message, "inputWindowInfo"))
                        $root.winscope.test.InputWindowInfoProto.encode(message.inputWindowInfo, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
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
                RootMessage.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.winscope.test.RootMessage();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.inputWindowInfo = $root.winscope.test.InputWindowInfoProto.decode(reader, reader.uint32());
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
                    if (message.inputWindowInfo != null && message.hasOwnProperty("inputWindowInfo")) {
                        var error = $root.winscope.test.InputWindowInfoProto.verify(message.inputWindowInfo);
                        if (error)
                            return "inputWindowInfo." + error;
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
                    if (object.inputWindowInfo != null) {
                        if (typeof object.inputWindowInfo !== "object")
                            throw TypeError(".winscope.test.RootMessage.inputWindowInfo: object expected");
                        message.inputWindowInfo = $root.winscope.test.InputWindowInfoProto.fromObject(object.inputWindowInfo);
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
                        object.inputWindowInfo = null;
                    if (message.inputWindowInfo != null && message.hasOwnProperty("inputWindowInfo"))
                        object.inputWindowInfo = $root.winscope.test.InputWindowInfoProto.toObject(message.inputWindowInfo, options);
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
    
            test.InputWindowInfoProto = (function() {
    
                /**
                 * Properties of an InputWindowInfoProto.
                 * @memberof winscope.test
                 * @interface IInputWindowInfoProto
                 * @property {number|null} [layoutParamsFlags] InputWindowInfoProto layoutParamsFlags
                 * @property {number|null} [inputConfig] InputWindowInfoProto inputConfig
                 * @property {number|null} [testAndroidTypedef] InputWindowInfoProto testAndroidTypedef
                 * @property {number|null} [testAndroidCommonTypedef] InputWindowInfoProto testAndroidCommonTypedef
                 */
    
                /**
                 * Constructs a new InputWindowInfoProto.
                 * @memberof winscope.test
                 * @classdesc Represents an InputWindowInfoProto.
                 * @implements IInputWindowInfoProto
                 * @constructor
                 * @param {winscope.test.IInputWindowInfoProto=} [properties] Properties to set
                 */
                function InputWindowInfoProto(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * InputWindowInfoProto layoutParamsFlags.
                 * @member {number} layoutParamsFlags
                 * @memberof winscope.test.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.layoutParamsFlags = 0;
    
                /**
                 * InputWindowInfoProto inputConfig.
                 * @member {number} inputConfig
                 * @memberof winscope.test.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.inputConfig = 0;
    
                /**
                 * InputWindowInfoProto testAndroidTypedef.
                 * @member {number} testAndroidTypedef
                 * @memberof winscope.test.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.testAndroidTypedef = 0;
    
                /**
                 * InputWindowInfoProto testAndroidCommonTypedef.
                 * @member {number} testAndroidCommonTypedef
                 * @memberof winscope.test.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.testAndroidCommonTypedef = 0;
    
                /**
                 * Creates a new InputWindowInfoProto instance using the specified properties.
                 * @function create
                 * @memberof winscope.test.InputWindowInfoProto
                 * @static
                 * @param {winscope.test.IInputWindowInfoProto=} [properties] Properties to set
                 * @returns {winscope.test.InputWindowInfoProto} InputWindowInfoProto instance
                 */
                InputWindowInfoProto.create = function create(properties) {
                    return new InputWindowInfoProto(properties);
                };
    
                /**
                 * Encodes the specified InputWindowInfoProto message. Does not implicitly {@link winscope.test.InputWindowInfoProto.verify|verify} messages.
                 * @function encode
                 * @memberof winscope.test.InputWindowInfoProto
                 * @static
                 * @param {winscope.test.IInputWindowInfoProto} message InputWindowInfoProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                InputWindowInfoProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.layoutParamsFlags != null && Object.hasOwnProperty.call(message, "layoutParamsFlags"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.layoutParamsFlags);
                    if (message.inputConfig != null && Object.hasOwnProperty.call(message, "inputConfig"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.inputConfig);
                    if (message.testAndroidTypedef != null && Object.hasOwnProperty.call(message, "testAndroidTypedef"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.testAndroidTypedef);
                    if (message.testAndroidCommonTypedef != null && Object.hasOwnProperty.call(message, "testAndroidCommonTypedef"))
                        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.testAndroidCommonTypedef);
                    return writer;
                };
    
                /**
                 * Encodes the specified InputWindowInfoProto message, length delimited. Does not implicitly {@link winscope.test.InputWindowInfoProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof winscope.test.InputWindowInfoProto
                 * @static
                 * @param {winscope.test.IInputWindowInfoProto} message InputWindowInfoProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                InputWindowInfoProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an InputWindowInfoProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof winscope.test.InputWindowInfoProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {winscope.test.InputWindowInfoProto} InputWindowInfoProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                InputWindowInfoProto.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.winscope.test.InputWindowInfoProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.layoutParamsFlags = reader.int32();
                                break;
                            }
                        case 2: {
                                message.inputConfig = reader.int32();
                                break;
                            }
                        case 3: {
                                message.testAndroidTypedef = reader.int32();
                                break;
                            }
                        case 4: {
                                message.testAndroidCommonTypedef = reader.int32();
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
                 * Decodes an InputWindowInfoProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof winscope.test.InputWindowInfoProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {winscope.test.InputWindowInfoProto} InputWindowInfoProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                InputWindowInfoProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies an InputWindowInfoProto message.
                 * @function verify
                 * @memberof winscope.test.InputWindowInfoProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                InputWindowInfoProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.layoutParamsFlags != null && message.hasOwnProperty("layoutParamsFlags"))
                        if (!$util.isInteger(message.layoutParamsFlags))
                            return "layoutParamsFlags: integer expected";
                    if (message.inputConfig != null && message.hasOwnProperty("inputConfig"))
                        if (!$util.isInteger(message.inputConfig))
                            return "inputConfig: integer expected";
                    if (message.testAndroidTypedef != null && message.hasOwnProperty("testAndroidTypedef"))
                        if (!$util.isInteger(message.testAndroidTypedef))
                            return "testAndroidTypedef: integer expected";
                    if (message.testAndroidCommonTypedef != null && message.hasOwnProperty("testAndroidCommonTypedef"))
                        if (!$util.isInteger(message.testAndroidCommonTypedef))
                            return "testAndroidCommonTypedef: integer expected";
                    return null;
                };
    
                /**
                 * Creates an InputWindowInfoProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof winscope.test.InputWindowInfoProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {winscope.test.InputWindowInfoProto} InputWindowInfoProto
                 */
                InputWindowInfoProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.winscope.test.InputWindowInfoProto)
                        return object;
                    var message = new $root.winscope.test.InputWindowInfoProto();
                    if (object.layoutParamsFlags != null)
                        message.layoutParamsFlags = object.layoutParamsFlags | 0;
                    if (object.inputConfig != null)
                        message.inputConfig = object.inputConfig | 0;
                    if (object.testAndroidTypedef != null)
                        message.testAndroidTypedef = object.testAndroidTypedef | 0;
                    if (object.testAndroidCommonTypedef != null)
                        message.testAndroidCommonTypedef = object.testAndroidCommonTypedef | 0;
                    return message;
                };
    
                /**
                 * Creates a plain object from an InputWindowInfoProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof winscope.test.InputWindowInfoProto
                 * @static
                 * @param {winscope.test.InputWindowInfoProto} message InputWindowInfoProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                InputWindowInfoProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.layoutParamsFlags = 0;
                        object.inputConfig = 0;
                        object.testAndroidTypedef = 0;
                        object.testAndroidCommonTypedef = 0;
                    }
                    if (message.layoutParamsFlags != null && message.hasOwnProperty("layoutParamsFlags"))
                        object.layoutParamsFlags = message.layoutParamsFlags;
                    if (message.inputConfig != null && message.hasOwnProperty("inputConfig"))
                        object.inputConfig = message.inputConfig;
                    if (message.testAndroidTypedef != null && message.hasOwnProperty("testAndroidTypedef"))
                        object.testAndroidTypedef = message.testAndroidTypedef;
                    if (message.testAndroidCommonTypedef != null && message.hasOwnProperty("testAndroidCommonTypedef"))
                        object.testAndroidCommonTypedef = message.testAndroidCommonTypedef;
                    return object;
                };
    
                /**
                 * Converts this InputWindowInfoProto to JSON.
                 * @function toJSON
                 * @memberof winscope.test.InputWindowInfoProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                InputWindowInfoProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for InputWindowInfoProto
                 * @function getTypeUrl
                 * @memberof winscope.test.InputWindowInfoProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                InputWindowInfoProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/winscope.test.InputWindowInfoProto";
                };
    
                return InputWindowInfoProto;
            })();
    
            return test;
        })();
    
        return winscope;
    })();

    return $root;
});
