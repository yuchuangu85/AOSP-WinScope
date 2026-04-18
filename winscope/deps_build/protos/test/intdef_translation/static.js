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
                 * @property {winscope.test.IInputWindowInfoProto|null} [intdefMappingEntry] RootMessage intdefMappingEntry
                 * @property {winscope.test.IWindowLayoutParamsProto|null} [windowLayoutParams] RootMessage windowLayoutParams
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
                 * RootMessage intdefMappingEntry.
                 * @member {winscope.test.IInputWindowInfoProto|null|undefined} intdefMappingEntry
                 * @memberof winscope.test.RootMessage
                 * @instance
                 */
                RootMessage.prototype.intdefMappingEntry = null;
    
                /**
                 * RootMessage windowLayoutParams.
                 * @member {winscope.test.IWindowLayoutParamsProto|null|undefined} windowLayoutParams
                 * @memberof winscope.test.RootMessage
                 * @instance
                 */
                RootMessage.prototype.windowLayoutParams = null;
    
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
                    if (message.intdefMappingEntry != null && Object.hasOwnProperty.call(message, "intdefMappingEntry"))
                        $root.winscope.test.InputWindowInfoProto.encode(message.intdefMappingEntry, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.windowLayoutParams != null && Object.hasOwnProperty.call(message, "windowLayoutParams"))
                        $root.winscope.test.WindowLayoutParamsProto.encode(message.windowLayoutParams, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
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
                                message.intdefMappingEntry = $root.winscope.test.InputWindowInfoProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 2: {
                                message.windowLayoutParams = $root.winscope.test.WindowLayoutParamsProto.decode(reader, reader.uint32());
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
                    if (message.intdefMappingEntry != null && message.hasOwnProperty("intdefMappingEntry")) {
                        var error = $root.winscope.test.InputWindowInfoProto.verify(message.intdefMappingEntry);
                        if (error)
                            return "intdefMappingEntry." + error;
                    }
                    if (message.windowLayoutParams != null && message.hasOwnProperty("windowLayoutParams")) {
                        var error = $root.winscope.test.WindowLayoutParamsProto.verify(message.windowLayoutParams);
                        if (error)
                            return "windowLayoutParams." + error;
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
                    if (object.intdefMappingEntry != null) {
                        if (typeof object.intdefMappingEntry !== "object")
                            throw TypeError(".winscope.test.RootMessage.intdefMappingEntry: object expected");
                        message.intdefMappingEntry = $root.winscope.test.InputWindowInfoProto.fromObject(object.intdefMappingEntry);
                    }
                    if (object.windowLayoutParams != null) {
                        if (typeof object.windowLayoutParams !== "object")
                            throw TypeError(".winscope.test.RootMessage.windowLayoutParams: object expected");
                        message.windowLayoutParams = $root.winscope.test.WindowLayoutParamsProto.fromObject(object.windowLayoutParams);
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
                    if (options.defaults) {
                        object.intdefMappingEntry = null;
                        object.windowLayoutParams = null;
                    }
                    if (message.intdefMappingEntry != null && message.hasOwnProperty("intdefMappingEntry"))
                        object.intdefMappingEntry = $root.winscope.test.InputWindowInfoProto.toObject(message.intdefMappingEntry, options);
                    if (message.windowLayoutParams != null && message.hasOwnProperty("windowLayoutParams"))
                        object.windowLayoutParams = $root.winscope.test.WindowLayoutParamsProto.toObject(message.windowLayoutParams, options);
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
                InputWindowInfoProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.winscope.test.InputWindowInfoProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.layoutParamsFlags = reader.int32();
                                break;
                            }
                        case 2: {
                                message.inputConfig = reader.int32();
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
                    }
                    if (message.layoutParamsFlags != null && message.hasOwnProperty("layoutParamsFlags"))
                        object.layoutParamsFlags = message.layoutParamsFlags;
                    if (message.inputConfig != null && message.hasOwnProperty("inputConfig"))
                        object.inputConfig = message.inputConfig;
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
    
            test.WindowLayoutParamsProto = (function() {
    
                /**
                 * Properties of a WindowLayoutParamsProto.
                 * @memberof winscope.test
                 * @interface IWindowLayoutParamsProto
                 * @property {number|null} [type] WindowLayoutParamsProto type
                 * @property {number|null} [gravity] WindowLayoutParamsProto gravity
                 * @property {number|null} [softInputMode] WindowLayoutParamsProto softInputMode
                 * @property {number|null} [inputFeatureFlags] WindowLayoutParamsProto inputFeatureFlags
                 * @property {number|null} [flags] WindowLayoutParamsProto flags
                 * @property {number|null} [systemUiVisibilityFlags] WindowLayoutParamsProto systemUiVisibilityFlags
                 * @property {number|null} [subtreeSystemUiVisibilityFlags] WindowLayoutParamsProto subtreeSystemUiVisibilityFlags
                 * @property {number|null} [appearance] WindowLayoutParamsProto appearance
                 * @property {number|null} [behavior] WindowLayoutParamsProto behavior
                 */
    
                /**
                 * Constructs a new WindowLayoutParamsProto.
                 * @memberof winscope.test
                 * @classdesc Represents a WindowLayoutParamsProto.
                 * @implements IWindowLayoutParamsProto
                 * @constructor
                 * @param {winscope.test.IWindowLayoutParamsProto=} [properties] Properties to set
                 */
                function WindowLayoutParamsProto(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * WindowLayoutParamsProto type.
                 * @member {number} type
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @instance
                 */
                WindowLayoutParamsProto.prototype.type = 0;
    
                /**
                 * WindowLayoutParamsProto gravity.
                 * @member {number} gravity
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @instance
                 */
                WindowLayoutParamsProto.prototype.gravity = 0;
    
                /**
                 * WindowLayoutParamsProto softInputMode.
                 * @member {number} softInputMode
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @instance
                 */
                WindowLayoutParamsProto.prototype.softInputMode = 0;
    
                /**
                 * WindowLayoutParamsProto inputFeatureFlags.
                 * @member {number} inputFeatureFlags
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @instance
                 */
                WindowLayoutParamsProto.prototype.inputFeatureFlags = 0;
    
                /**
                 * WindowLayoutParamsProto flags.
                 * @member {number} flags
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @instance
                 */
                WindowLayoutParamsProto.prototype.flags = 0;
    
                /**
                 * WindowLayoutParamsProto systemUiVisibilityFlags.
                 * @member {number} systemUiVisibilityFlags
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @instance
                 */
                WindowLayoutParamsProto.prototype.systemUiVisibilityFlags = 0;
    
                /**
                 * WindowLayoutParamsProto subtreeSystemUiVisibilityFlags.
                 * @member {number} subtreeSystemUiVisibilityFlags
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @instance
                 */
                WindowLayoutParamsProto.prototype.subtreeSystemUiVisibilityFlags = 0;
    
                /**
                 * WindowLayoutParamsProto appearance.
                 * @member {number} appearance
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @instance
                 */
                WindowLayoutParamsProto.prototype.appearance = 0;
    
                /**
                 * WindowLayoutParamsProto behavior.
                 * @member {number} behavior
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @instance
                 */
                WindowLayoutParamsProto.prototype.behavior = 0;
    
                /**
                 * Creates a new WindowLayoutParamsProto instance using the specified properties.
                 * @function create
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @static
                 * @param {winscope.test.IWindowLayoutParamsProto=} [properties] Properties to set
                 * @returns {winscope.test.WindowLayoutParamsProto} WindowLayoutParamsProto instance
                 */
                WindowLayoutParamsProto.create = function create(properties) {
                    return new WindowLayoutParamsProto(properties);
                };
    
                /**
                 * Encodes the specified WindowLayoutParamsProto message. Does not implicitly {@link winscope.test.WindowLayoutParamsProto.verify|verify} messages.
                 * @function encode
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @static
                 * @param {winscope.test.IWindowLayoutParamsProto} message WindowLayoutParamsProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                WindowLayoutParamsProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                    if (message.gravity != null && Object.hasOwnProperty.call(message, "gravity"))
                        writer.uint32(/* id 8, wireType 0 =*/64).int32(message.gravity);
                    if (message.softInputMode != null && Object.hasOwnProperty.call(message, "softInputMode"))
                        writer.uint32(/* id 9, wireType 0 =*/72).int32(message.softInputMode);
                    if (message.inputFeatureFlags != null && Object.hasOwnProperty.call(message, "inputFeatureFlags"))
                        writer.uint32(/* id 19, wireType 0 =*/152).uint32(message.inputFeatureFlags);
                    if (message.flags != null && Object.hasOwnProperty.call(message, "flags"))
                        writer.uint32(/* id 24, wireType 0 =*/192).uint32(message.flags);
                    if (message.systemUiVisibilityFlags != null && Object.hasOwnProperty.call(message, "systemUiVisibilityFlags"))
                        writer.uint32(/* id 27, wireType 0 =*/216).uint32(message.systemUiVisibilityFlags);
                    if (message.subtreeSystemUiVisibilityFlags != null && Object.hasOwnProperty.call(message, "subtreeSystemUiVisibilityFlags"))
                        writer.uint32(/* id 28, wireType 0 =*/224).uint32(message.subtreeSystemUiVisibilityFlags);
                    if (message.appearance != null && Object.hasOwnProperty.call(message, "appearance"))
                        writer.uint32(/* id 29, wireType 0 =*/232).uint32(message.appearance);
                    if (message.behavior != null && Object.hasOwnProperty.call(message, "behavior"))
                        writer.uint32(/* id 30, wireType 0 =*/240).uint32(message.behavior);
                    return writer;
                };
    
                /**
                 * Encodes the specified WindowLayoutParamsProto message, length delimited. Does not implicitly {@link winscope.test.WindowLayoutParamsProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @static
                 * @param {winscope.test.IWindowLayoutParamsProto} message WindowLayoutParamsProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                WindowLayoutParamsProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a WindowLayoutParamsProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {winscope.test.WindowLayoutParamsProto} WindowLayoutParamsProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                WindowLayoutParamsProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.winscope.test.WindowLayoutParamsProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.type = reader.int32();
                                break;
                            }
                        case 8: {
                                message.gravity = reader.int32();
                                break;
                            }
                        case 9: {
                                message.softInputMode = reader.int32();
                                break;
                            }
                        case 19: {
                                message.inputFeatureFlags = reader.uint32();
                                break;
                            }
                        case 24: {
                                message.flags = reader.uint32();
                                break;
                            }
                        case 27: {
                                message.systemUiVisibilityFlags = reader.uint32();
                                break;
                            }
                        case 28: {
                                message.subtreeSystemUiVisibilityFlags = reader.uint32();
                                break;
                            }
                        case 29: {
                                message.appearance = reader.uint32();
                                break;
                            }
                        case 30: {
                                message.behavior = reader.uint32();
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
                 * Decodes a WindowLayoutParamsProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {winscope.test.WindowLayoutParamsProto} WindowLayoutParamsProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                WindowLayoutParamsProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a WindowLayoutParamsProto message.
                 * @function verify
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                WindowLayoutParamsProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.type != null && message.hasOwnProperty("type"))
                        if (!$util.isInteger(message.type))
                            return "type: integer expected";
                    if (message.gravity != null && message.hasOwnProperty("gravity"))
                        if (!$util.isInteger(message.gravity))
                            return "gravity: integer expected";
                    if (message.softInputMode != null && message.hasOwnProperty("softInputMode"))
                        if (!$util.isInteger(message.softInputMode))
                            return "softInputMode: integer expected";
                    if (message.inputFeatureFlags != null && message.hasOwnProperty("inputFeatureFlags"))
                        if (!$util.isInteger(message.inputFeatureFlags))
                            return "inputFeatureFlags: integer expected";
                    if (message.flags != null && message.hasOwnProperty("flags"))
                        if (!$util.isInteger(message.flags))
                            return "flags: integer expected";
                    if (message.systemUiVisibilityFlags != null && message.hasOwnProperty("systemUiVisibilityFlags"))
                        if (!$util.isInteger(message.systemUiVisibilityFlags))
                            return "systemUiVisibilityFlags: integer expected";
                    if (message.subtreeSystemUiVisibilityFlags != null && message.hasOwnProperty("subtreeSystemUiVisibilityFlags"))
                        if (!$util.isInteger(message.subtreeSystemUiVisibilityFlags))
                            return "subtreeSystemUiVisibilityFlags: integer expected";
                    if (message.appearance != null && message.hasOwnProperty("appearance"))
                        if (!$util.isInteger(message.appearance))
                            return "appearance: integer expected";
                    if (message.behavior != null && message.hasOwnProperty("behavior"))
                        if (!$util.isInteger(message.behavior))
                            return "behavior: integer expected";
                    return null;
                };
    
                /**
                 * Creates a WindowLayoutParamsProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {winscope.test.WindowLayoutParamsProto} WindowLayoutParamsProto
                 */
                WindowLayoutParamsProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.winscope.test.WindowLayoutParamsProto)
                        return object;
                    var message = new $root.winscope.test.WindowLayoutParamsProto();
                    if (object.type != null)
                        message.type = object.type | 0;
                    if (object.gravity != null)
                        message.gravity = object.gravity | 0;
                    if (object.softInputMode != null)
                        message.softInputMode = object.softInputMode | 0;
                    if (object.inputFeatureFlags != null)
                        message.inputFeatureFlags = object.inputFeatureFlags >>> 0;
                    if (object.flags != null)
                        message.flags = object.flags >>> 0;
                    if (object.systemUiVisibilityFlags != null)
                        message.systemUiVisibilityFlags = object.systemUiVisibilityFlags >>> 0;
                    if (object.subtreeSystemUiVisibilityFlags != null)
                        message.subtreeSystemUiVisibilityFlags = object.subtreeSystemUiVisibilityFlags >>> 0;
                    if (object.appearance != null)
                        message.appearance = object.appearance >>> 0;
                    if (object.behavior != null)
                        message.behavior = object.behavior >>> 0;
                    return message;
                };
    
                /**
                 * Creates a plain object from a WindowLayoutParamsProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @static
                 * @param {winscope.test.WindowLayoutParamsProto} message WindowLayoutParamsProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                WindowLayoutParamsProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.type = 0;
                        object.gravity = 0;
                        object.softInputMode = 0;
                        object.inputFeatureFlags = 0;
                        object.flags = 0;
                        object.systemUiVisibilityFlags = 0;
                        object.subtreeSystemUiVisibilityFlags = 0;
                        object.appearance = 0;
                        object.behavior = 0;
                    }
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = message.type;
                    if (message.gravity != null && message.hasOwnProperty("gravity"))
                        object.gravity = message.gravity;
                    if (message.softInputMode != null && message.hasOwnProperty("softInputMode"))
                        object.softInputMode = message.softInputMode;
                    if (message.inputFeatureFlags != null && message.hasOwnProperty("inputFeatureFlags"))
                        object.inputFeatureFlags = message.inputFeatureFlags;
                    if (message.flags != null && message.hasOwnProperty("flags"))
                        object.flags = message.flags;
                    if (message.systemUiVisibilityFlags != null && message.hasOwnProperty("systemUiVisibilityFlags"))
                        object.systemUiVisibilityFlags = message.systemUiVisibilityFlags;
                    if (message.subtreeSystemUiVisibilityFlags != null && message.hasOwnProperty("subtreeSystemUiVisibilityFlags"))
                        object.subtreeSystemUiVisibilityFlags = message.subtreeSystemUiVisibilityFlags;
                    if (message.appearance != null && message.hasOwnProperty("appearance"))
                        object.appearance = message.appearance;
                    if (message.behavior != null && message.hasOwnProperty("behavior"))
                        object.behavior = message.behavior;
                    return object;
                };
    
                /**
                 * Converts this WindowLayoutParamsProto to JSON.
                 * @function toJSON
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                WindowLayoutParamsProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for WindowLayoutParamsProto
                 * @function getTypeUrl
                 * @memberof winscope.test.WindowLayoutParamsProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                WindowLayoutParamsProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/winscope.test.WindowLayoutParamsProto";
                };
    
                return WindowLayoutParamsProto;
            })();
    
            return test;
        })();
    
        return winscope;
    })();

    return $root;
});
