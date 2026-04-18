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
    var $root = $protobuf.roots.viewcaptureudc || ($protobuf.roots.viewcaptureudc = {});
    
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
    
            android.app = (function() {
    
                /**
                 * Namespace app.
                 * @memberof com.android
                 * @namespace
                 */
                var app = {};
    
                app.viewcapture = (function() {
    
                    /**
                     * Namespace viewcapture.
                     * @memberof com.android.app
                     * @namespace
                     */
                    var viewcapture = {};
    
                    viewcapture.data = (function() {
    
                        /**
                         * Namespace data.
                         * @memberof com.android.app.viewcapture
                         * @namespace
                         */
                        var data = {};
    
                        data.ExportedData = (function() {
    
                            /**
                             * Properties of an ExportedData.
                             * @memberof com.android.app.viewcapture.data
                             * @interface IExportedData
                             * @property {Long|null} [magicNumber] ExportedData magicNumber
                             * @property {Array.<com.android.app.viewcapture.data.IWindowData>|null} [windowData] ExportedData windowData
                             * @property {string|null} ["package"] ExportedData package
                             * @property {Array.<string>|null} [classname] ExportedData classname
                             * @property {Long|null} [realToElapsedTimeOffsetNanos] ExportedData realToElapsedTimeOffsetNanos
                             */
    
                            /**
                             * Constructs a new ExportedData.
                             * @memberof com.android.app.viewcapture.data
                             * @classdesc Represents an ExportedData.
                             * @implements IExportedData
                             * @constructor
                             * @param {com.android.app.viewcapture.data.IExportedData=} [properties] Properties to set
                             */
                            function ExportedData(properties) {
                                this.windowData = [];
                                this.classname = [];
                                if (properties)
                                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null)
                                            this[keys[i]] = properties[keys[i]];
                            }
    
                            /**
                             * ExportedData magicNumber.
                             * @member {Long} magicNumber
                             * @memberof com.android.app.viewcapture.data.ExportedData
                             * @instance
                             */
                            ExportedData.prototype.magicNumber = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                            /**
                             * ExportedData windowData.
                             * @member {Array.<com.android.app.viewcapture.data.IWindowData>} windowData
                             * @memberof com.android.app.viewcapture.data.ExportedData
                             * @instance
                             */
                            ExportedData.prototype.windowData = $util.emptyArray;
    
                            /**
                             * ExportedData package.
                             * @member {string} package
                             * @memberof com.android.app.viewcapture.data.ExportedData
                             * @instance
                             */
                            ExportedData.prototype["package"] = "";
    
                            /**
                             * ExportedData classname.
                             * @member {Array.<string>} classname
                             * @memberof com.android.app.viewcapture.data.ExportedData
                             * @instance
                             */
                            ExportedData.prototype.classname = $util.emptyArray;
    
                            /**
                             * ExportedData realToElapsedTimeOffsetNanos.
                             * @member {Long} realToElapsedTimeOffsetNanos
                             * @memberof com.android.app.viewcapture.data.ExportedData
                             * @instance
                             */
                            ExportedData.prototype.realToElapsedTimeOffsetNanos = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                            /**
                             * Creates a new ExportedData instance using the specified properties.
                             * @function create
                             * @memberof com.android.app.viewcapture.data.ExportedData
                             * @static
                             * @param {com.android.app.viewcapture.data.IExportedData=} [properties] Properties to set
                             * @returns {com.android.app.viewcapture.data.ExportedData} ExportedData instance
                             */
                            ExportedData.create = function create(properties) {
                                return new ExportedData(properties);
                            };
    
                            /**
                             * Encodes the specified ExportedData message. Does not implicitly {@link com.android.app.viewcapture.data.ExportedData.verify|verify} messages.
                             * @function encode
                             * @memberof com.android.app.viewcapture.data.ExportedData
                             * @static
                             * @param {com.android.app.viewcapture.data.IExportedData} message ExportedData message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            ExportedData.encode = function encode(message, writer) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (message.magicNumber != null && Object.hasOwnProperty.call(message, "magicNumber"))
                                    writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.magicNumber);
                                if (message.windowData != null && message.windowData.length)
                                    for (var i = 0; i < message.windowData.length; ++i)
                                        $root.com.android.app.viewcapture.data.WindowData.encode(message.windowData[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                                if (message["package"] != null && Object.hasOwnProperty.call(message, "package"))
                                    writer.uint32(/* id 3, wireType 2 =*/26).string(message["package"]);
                                if (message.classname != null && message.classname.length)
                                    for (var i = 0; i < message.classname.length; ++i)
                                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.classname[i]);
                                if (message.realToElapsedTimeOffsetNanos != null && Object.hasOwnProperty.call(message, "realToElapsedTimeOffsetNanos"))
                                    writer.uint32(/* id 5, wireType 1 =*/41).fixed64(message.realToElapsedTimeOffsetNanos);
                                return writer;
                            };
    
                            /**
                             * Encodes the specified ExportedData message, length delimited. Does not implicitly {@link com.android.app.viewcapture.data.ExportedData.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof com.android.app.viewcapture.data.ExportedData
                             * @static
                             * @param {com.android.app.viewcapture.data.IExportedData} message ExportedData message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            ExportedData.encodeDelimited = function encodeDelimited(message, writer) {
                                return this.encode(message, writer).ldelim();
                            };
    
                            /**
                             * Decodes an ExportedData message from the specified reader or buffer.
                             * @function decode
                             * @memberof com.android.app.viewcapture.data.ExportedData
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {com.android.app.viewcapture.data.ExportedData} ExportedData
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            ExportedData.decode = function decode(reader, length) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.android.app.viewcapture.data.ExportedData();
                                while (reader.pos < end) {
                                    var tag = reader.uint32();
                                    switch (tag >>> 3) {
                                    case 1: {
                                            message.magicNumber = reader.fixed64();
                                            break;
                                        }
                                    case 2: {
                                            if (!(message.windowData && message.windowData.length))
                                                message.windowData = [];
                                            message.windowData.push($root.com.android.app.viewcapture.data.WindowData.decode(reader, reader.uint32()));
                                            break;
                                        }
                                    case 3: {
                                            message["package"] = reader.string();
                                            break;
                                        }
                                    case 4: {
                                            if (!(message.classname && message.classname.length))
                                                message.classname = [];
                                            message.classname.push(reader.string());
                                            break;
                                        }
                                    case 5: {
                                            message.realToElapsedTimeOffsetNanos = reader.fixed64();
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
                             * Decodes an ExportedData message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof com.android.app.viewcapture.data.ExportedData
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {com.android.app.viewcapture.data.ExportedData} ExportedData
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            ExportedData.decodeDelimited = function decodeDelimited(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.uint32());
                            };
    
                            /**
                             * Verifies an ExportedData message.
                             * @function verify
                             * @memberof com.android.app.viewcapture.data.ExportedData
                             * @static
                             * @param {Object.<string,*>} message Plain object to verify
                             * @returns {string|null} `null` if valid, otherwise the reason why it is not
                             */
                            ExportedData.verify = function verify(message) {
                                if (typeof message !== "object" || message === null)
                                    return "object expected";
                                if (message.magicNumber != null && message.hasOwnProperty("magicNumber"))
                                    if (!$util.isInteger(message.magicNumber) && !(message.magicNumber && $util.isInteger(message.magicNumber.low) && $util.isInteger(message.magicNumber.high)))
                                        return "magicNumber: integer|Long expected";
                                if (message.windowData != null && message.hasOwnProperty("windowData")) {
                                    if (!Array.isArray(message.windowData))
                                        return "windowData: array expected";
                                    for (var i = 0; i < message.windowData.length; ++i) {
                                        var error = $root.com.android.app.viewcapture.data.WindowData.verify(message.windowData[i]);
                                        if (error)
                                            return "windowData." + error;
                                    }
                                }
                                if (message["package"] != null && message.hasOwnProperty("package"))
                                    if (!$util.isString(message["package"]))
                                        return "package: string expected";
                                if (message.classname != null && message.hasOwnProperty("classname")) {
                                    if (!Array.isArray(message.classname))
                                        return "classname: array expected";
                                    for (var i = 0; i < message.classname.length; ++i)
                                        if (!$util.isString(message.classname[i]))
                                            return "classname: string[] expected";
                                }
                                if (message.realToElapsedTimeOffsetNanos != null && message.hasOwnProperty("realToElapsedTimeOffsetNanos"))
                                    if (!$util.isInteger(message.realToElapsedTimeOffsetNanos) && !(message.realToElapsedTimeOffsetNanos && $util.isInteger(message.realToElapsedTimeOffsetNanos.low) && $util.isInteger(message.realToElapsedTimeOffsetNanos.high)))
                                        return "realToElapsedTimeOffsetNanos: integer|Long expected";
                                return null;
                            };
    
                            /**
                             * Creates an ExportedData message from a plain object. Also converts values to their respective internal types.
                             * @function fromObject
                             * @memberof com.android.app.viewcapture.data.ExportedData
                             * @static
                             * @param {Object.<string,*>} object Plain object
                             * @returns {com.android.app.viewcapture.data.ExportedData} ExportedData
                             */
                            ExportedData.fromObject = function fromObject(object) {
                                if (object instanceof $root.com.android.app.viewcapture.data.ExportedData)
                                    return object;
                                var message = new $root.com.android.app.viewcapture.data.ExportedData();
                                if (object.magicNumber != null)
                                    if ($util.Long)
                                        (message.magicNumber = $util.Long.fromValue(object.magicNumber)).unsigned = false;
                                    else if (typeof object.magicNumber === "string")
                                        message.magicNumber = parseInt(object.magicNumber, 10);
                                    else if (typeof object.magicNumber === "number")
                                        message.magicNumber = object.magicNumber;
                                    else if (typeof object.magicNumber === "object")
                                        message.magicNumber = new $util.LongBits(object.magicNumber.low >>> 0, object.magicNumber.high >>> 0).toNumber();
                                if (object.windowData) {
                                    if (!Array.isArray(object.windowData))
                                        throw TypeError(".com.android.app.viewcapture.data.ExportedData.windowData: array expected");
                                    message.windowData = [];
                                    for (var i = 0; i < object.windowData.length; ++i) {
                                        if (typeof object.windowData[i] !== "object")
                                            throw TypeError(".com.android.app.viewcapture.data.ExportedData.windowData: object expected");
                                        message.windowData[i] = $root.com.android.app.viewcapture.data.WindowData.fromObject(object.windowData[i]);
                                    }
                                }
                                if (object["package"] != null)
                                    message["package"] = String(object["package"]);
                                if (object.classname) {
                                    if (!Array.isArray(object.classname))
                                        throw TypeError(".com.android.app.viewcapture.data.ExportedData.classname: array expected");
                                    message.classname = [];
                                    for (var i = 0; i < object.classname.length; ++i)
                                        message.classname[i] = String(object.classname[i]);
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
                             * Creates a plain object from an ExportedData message. Also converts values to other types if specified.
                             * @function toObject
                             * @memberof com.android.app.viewcapture.data.ExportedData
                             * @static
                             * @param {com.android.app.viewcapture.data.ExportedData} message ExportedData
                             * @param {$protobuf.IConversionOptions} [options] Conversion options
                             * @returns {Object.<string,*>} Plain object
                             */
                            ExportedData.toObject = function toObject(message, options) {
                                if (!options)
                                    options = {};
                                var object = {};
                                if (options.arrays || options.defaults) {
                                    object.windowData = [];
                                    object.classname = [];
                                }
                                if (options.defaults) {
                                    if ($util.Long) {
                                        var long = new $util.Long(0, 0, false);
                                        object.magicNumber = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                    } else
                                        object.magicNumber = options.longs === String ? "0" : 0;
                                    object["package"] = "";
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
                                if (message.windowData && message.windowData.length) {
                                    object.windowData = [];
                                    for (var j = 0; j < message.windowData.length; ++j)
                                        object.windowData[j] = $root.com.android.app.viewcapture.data.WindowData.toObject(message.windowData[j], options);
                                }
                                if (message["package"] != null && message.hasOwnProperty("package"))
                                    object["package"] = message["package"];
                                if (message.classname && message.classname.length) {
                                    object.classname = [];
                                    for (var j = 0; j < message.classname.length; ++j)
                                        object.classname[j] = message.classname[j];
                                }
                                if (message.realToElapsedTimeOffsetNanos != null && message.hasOwnProperty("realToElapsedTimeOffsetNanos"))
                                    if (typeof message.realToElapsedTimeOffsetNanos === "number")
                                        object.realToElapsedTimeOffsetNanos = options.longs === String ? String(message.realToElapsedTimeOffsetNanos) : message.realToElapsedTimeOffsetNanos;
                                    else
                                        object.realToElapsedTimeOffsetNanos = options.longs === String ? $util.Long.prototype.toString.call(message.realToElapsedTimeOffsetNanos) : options.longs === Number ? new $util.LongBits(message.realToElapsedTimeOffsetNanos.low >>> 0, message.realToElapsedTimeOffsetNanos.high >>> 0).toNumber() : message.realToElapsedTimeOffsetNanos;
                                return object;
                            };
    
                            /**
                             * Converts this ExportedData to JSON.
                             * @function toJSON
                             * @memberof com.android.app.viewcapture.data.ExportedData
                             * @instance
                             * @returns {Object.<string,*>} JSON object
                             */
                            ExportedData.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                            };
    
                            /**
                             * Gets the default type url for ExportedData
                             * @function getTypeUrl
                             * @memberof com.android.app.viewcapture.data.ExportedData
                             * @static
                             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                             * @returns {string} The default type url
                             */
                            ExportedData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                if (typeUrlPrefix === undefined) {
                                    typeUrlPrefix = "type.googleapis.com";
                                }
                                return typeUrlPrefix + "/com.android.app.viewcapture.data.ExportedData";
                            };
    
                            /**
                             * MagicNumber enum.
                             * @name com.android.app.viewcapture.data.ExportedData.MagicNumber
                             * @enum {number}
                             * @property {number} INVALID=0 INVALID value
                             * @property {number} MAGIC_NUMBER_L=1703961976 MAGIC_NUMBER_L value
                             * @property {number} MAGIC_NUMBER_H=1751482995 MAGIC_NUMBER_H value
                             */
                            ExportedData.MagicNumber = (function() {
                                var valuesById = {}, values = Object.create(valuesById);
                                values[valuesById[0] = "INVALID"] = 0;
                                values[valuesById[1703961976] = "MAGIC_NUMBER_L"] = 1703961976;
                                values[valuesById[1751482995] = "MAGIC_NUMBER_H"] = 1751482995;
                                return values;
                            })();
    
                            return ExportedData;
                        })();
    
                        data.WindowData = (function() {
    
                            /**
                             * Properties of a WindowData.
                             * @memberof com.android.app.viewcapture.data
                             * @interface IWindowData
                             * @property {Array.<com.android.app.viewcapture.data.IFrameData>|null} [frameData] WindowData frameData
                             * @property {string|null} [title] WindowData title
                             */
    
                            /**
                             * Constructs a new WindowData.
                             * @memberof com.android.app.viewcapture.data
                             * @classdesc Represents a WindowData.
                             * @implements IWindowData
                             * @constructor
                             * @param {com.android.app.viewcapture.data.IWindowData=} [properties] Properties to set
                             */
                            function WindowData(properties) {
                                this.frameData = [];
                                if (properties)
                                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null)
                                            this[keys[i]] = properties[keys[i]];
                            }
    
                            /**
                             * WindowData frameData.
                             * @member {Array.<com.android.app.viewcapture.data.IFrameData>} frameData
                             * @memberof com.android.app.viewcapture.data.WindowData
                             * @instance
                             */
                            WindowData.prototype.frameData = $util.emptyArray;
    
                            /**
                             * WindowData title.
                             * @member {string} title
                             * @memberof com.android.app.viewcapture.data.WindowData
                             * @instance
                             */
                            WindowData.prototype.title = "";
    
                            /**
                             * Creates a new WindowData instance using the specified properties.
                             * @function create
                             * @memberof com.android.app.viewcapture.data.WindowData
                             * @static
                             * @param {com.android.app.viewcapture.data.IWindowData=} [properties] Properties to set
                             * @returns {com.android.app.viewcapture.data.WindowData} WindowData instance
                             */
                            WindowData.create = function create(properties) {
                                return new WindowData(properties);
                            };
    
                            /**
                             * Encodes the specified WindowData message. Does not implicitly {@link com.android.app.viewcapture.data.WindowData.verify|verify} messages.
                             * @function encode
                             * @memberof com.android.app.viewcapture.data.WindowData
                             * @static
                             * @param {com.android.app.viewcapture.data.IWindowData} message WindowData message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            WindowData.encode = function encode(message, writer) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (message.frameData != null && message.frameData.length)
                                    for (var i = 0; i < message.frameData.length; ++i)
                                        $root.com.android.app.viewcapture.data.FrameData.encode(message.frameData[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                                if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.title);
                                return writer;
                            };
    
                            /**
                             * Encodes the specified WindowData message, length delimited. Does not implicitly {@link com.android.app.viewcapture.data.WindowData.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof com.android.app.viewcapture.data.WindowData
                             * @static
                             * @param {com.android.app.viewcapture.data.IWindowData} message WindowData message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            WindowData.encodeDelimited = function encodeDelimited(message, writer) {
                                return this.encode(message, writer).ldelim();
                            };
    
                            /**
                             * Decodes a WindowData message from the specified reader or buffer.
                             * @function decode
                             * @memberof com.android.app.viewcapture.data.WindowData
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {com.android.app.viewcapture.data.WindowData} WindowData
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            WindowData.decode = function decode(reader, length) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.android.app.viewcapture.data.WindowData();
                                while (reader.pos < end) {
                                    var tag = reader.uint32();
                                    switch (tag >>> 3) {
                                    case 1: {
                                            if (!(message.frameData && message.frameData.length))
                                                message.frameData = [];
                                            message.frameData.push($root.com.android.app.viewcapture.data.FrameData.decode(reader, reader.uint32()));
                                            break;
                                        }
                                    case 2: {
                                            message.title = reader.string();
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
                             * Decodes a WindowData message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof com.android.app.viewcapture.data.WindowData
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {com.android.app.viewcapture.data.WindowData} WindowData
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            WindowData.decodeDelimited = function decodeDelimited(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.uint32());
                            };
    
                            /**
                             * Verifies a WindowData message.
                             * @function verify
                             * @memberof com.android.app.viewcapture.data.WindowData
                             * @static
                             * @param {Object.<string,*>} message Plain object to verify
                             * @returns {string|null} `null` if valid, otherwise the reason why it is not
                             */
                            WindowData.verify = function verify(message) {
                                if (typeof message !== "object" || message === null)
                                    return "object expected";
                                if (message.frameData != null && message.hasOwnProperty("frameData")) {
                                    if (!Array.isArray(message.frameData))
                                        return "frameData: array expected";
                                    for (var i = 0; i < message.frameData.length; ++i) {
                                        var error = $root.com.android.app.viewcapture.data.FrameData.verify(message.frameData[i]);
                                        if (error)
                                            return "frameData." + error;
                                    }
                                }
                                if (message.title != null && message.hasOwnProperty("title"))
                                    if (!$util.isString(message.title))
                                        return "title: string expected";
                                return null;
                            };
    
                            /**
                             * Creates a WindowData message from a plain object. Also converts values to their respective internal types.
                             * @function fromObject
                             * @memberof com.android.app.viewcapture.data.WindowData
                             * @static
                             * @param {Object.<string,*>} object Plain object
                             * @returns {com.android.app.viewcapture.data.WindowData} WindowData
                             */
                            WindowData.fromObject = function fromObject(object) {
                                if (object instanceof $root.com.android.app.viewcapture.data.WindowData)
                                    return object;
                                var message = new $root.com.android.app.viewcapture.data.WindowData();
                                if (object.frameData) {
                                    if (!Array.isArray(object.frameData))
                                        throw TypeError(".com.android.app.viewcapture.data.WindowData.frameData: array expected");
                                    message.frameData = [];
                                    for (var i = 0; i < object.frameData.length; ++i) {
                                        if (typeof object.frameData[i] !== "object")
                                            throw TypeError(".com.android.app.viewcapture.data.WindowData.frameData: object expected");
                                        message.frameData[i] = $root.com.android.app.viewcapture.data.FrameData.fromObject(object.frameData[i]);
                                    }
                                }
                                if (object.title != null)
                                    message.title = String(object.title);
                                return message;
                            };
    
                            /**
                             * Creates a plain object from a WindowData message. Also converts values to other types if specified.
                             * @function toObject
                             * @memberof com.android.app.viewcapture.data.WindowData
                             * @static
                             * @param {com.android.app.viewcapture.data.WindowData} message WindowData
                             * @param {$protobuf.IConversionOptions} [options] Conversion options
                             * @returns {Object.<string,*>} Plain object
                             */
                            WindowData.toObject = function toObject(message, options) {
                                if (!options)
                                    options = {};
                                var object = {};
                                if (options.arrays || options.defaults)
                                    object.frameData = [];
                                if (options.defaults)
                                    object.title = "";
                                if (message.frameData && message.frameData.length) {
                                    object.frameData = [];
                                    for (var j = 0; j < message.frameData.length; ++j)
                                        object.frameData[j] = $root.com.android.app.viewcapture.data.FrameData.toObject(message.frameData[j], options);
                                }
                                if (message.title != null && message.hasOwnProperty("title"))
                                    object.title = message.title;
                                return object;
                            };
    
                            /**
                             * Converts this WindowData to JSON.
                             * @function toJSON
                             * @memberof com.android.app.viewcapture.data.WindowData
                             * @instance
                             * @returns {Object.<string,*>} JSON object
                             */
                            WindowData.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                            };
    
                            /**
                             * Gets the default type url for WindowData
                             * @function getTypeUrl
                             * @memberof com.android.app.viewcapture.data.WindowData
                             * @static
                             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                             * @returns {string} The default type url
                             */
                            WindowData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                if (typeUrlPrefix === undefined) {
                                    typeUrlPrefix = "type.googleapis.com";
                                }
                                return typeUrlPrefix + "/com.android.app.viewcapture.data.WindowData";
                            };
    
                            return WindowData;
                        })();
    
                        data.MotionWindowData = (function() {
    
                            /**
                             * Properties of a MotionWindowData.
                             * @memberof com.android.app.viewcapture.data
                             * @interface IMotionWindowData
                             * @property {Array.<com.android.app.viewcapture.data.IFrameData>|null} [frameData] MotionWindowData frameData
                             * @property {Array.<string>|null} [classname] MotionWindowData classname
                             */
    
                            /**
                             * Constructs a new MotionWindowData.
                             * @memberof com.android.app.viewcapture.data
                             * @classdesc Represents a MotionWindowData.
                             * @implements IMotionWindowData
                             * @constructor
                             * @param {com.android.app.viewcapture.data.IMotionWindowData=} [properties] Properties to set
                             */
                            function MotionWindowData(properties) {
                                this.frameData = [];
                                this.classname = [];
                                if (properties)
                                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null)
                                            this[keys[i]] = properties[keys[i]];
                            }
    
                            /**
                             * MotionWindowData frameData.
                             * @member {Array.<com.android.app.viewcapture.data.IFrameData>} frameData
                             * @memberof com.android.app.viewcapture.data.MotionWindowData
                             * @instance
                             */
                            MotionWindowData.prototype.frameData = $util.emptyArray;
    
                            /**
                             * MotionWindowData classname.
                             * @member {Array.<string>} classname
                             * @memberof com.android.app.viewcapture.data.MotionWindowData
                             * @instance
                             */
                            MotionWindowData.prototype.classname = $util.emptyArray;
    
                            /**
                             * Creates a new MotionWindowData instance using the specified properties.
                             * @function create
                             * @memberof com.android.app.viewcapture.data.MotionWindowData
                             * @static
                             * @param {com.android.app.viewcapture.data.IMotionWindowData=} [properties] Properties to set
                             * @returns {com.android.app.viewcapture.data.MotionWindowData} MotionWindowData instance
                             */
                            MotionWindowData.create = function create(properties) {
                                return new MotionWindowData(properties);
                            };
    
                            /**
                             * Encodes the specified MotionWindowData message. Does not implicitly {@link com.android.app.viewcapture.data.MotionWindowData.verify|verify} messages.
                             * @function encode
                             * @memberof com.android.app.viewcapture.data.MotionWindowData
                             * @static
                             * @param {com.android.app.viewcapture.data.IMotionWindowData} message MotionWindowData message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            MotionWindowData.encode = function encode(message, writer) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (message.frameData != null && message.frameData.length)
                                    for (var i = 0; i < message.frameData.length; ++i)
                                        $root.com.android.app.viewcapture.data.FrameData.encode(message.frameData[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                                if (message.classname != null && message.classname.length)
                                    for (var i = 0; i < message.classname.length; ++i)
                                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.classname[i]);
                                return writer;
                            };
    
                            /**
                             * Encodes the specified MotionWindowData message, length delimited. Does not implicitly {@link com.android.app.viewcapture.data.MotionWindowData.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof com.android.app.viewcapture.data.MotionWindowData
                             * @static
                             * @param {com.android.app.viewcapture.data.IMotionWindowData} message MotionWindowData message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            MotionWindowData.encodeDelimited = function encodeDelimited(message, writer) {
                                return this.encode(message, writer).ldelim();
                            };
    
                            /**
                             * Decodes a MotionWindowData message from the specified reader or buffer.
                             * @function decode
                             * @memberof com.android.app.viewcapture.data.MotionWindowData
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {com.android.app.viewcapture.data.MotionWindowData} MotionWindowData
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            MotionWindowData.decode = function decode(reader, length) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.android.app.viewcapture.data.MotionWindowData();
                                while (reader.pos < end) {
                                    var tag = reader.uint32();
                                    switch (tag >>> 3) {
                                    case 1: {
                                            if (!(message.frameData && message.frameData.length))
                                                message.frameData = [];
                                            message.frameData.push($root.com.android.app.viewcapture.data.FrameData.decode(reader, reader.uint32()));
                                            break;
                                        }
                                    case 2: {
                                            if (!(message.classname && message.classname.length))
                                                message.classname = [];
                                            message.classname.push(reader.string());
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
                             * Decodes a MotionWindowData message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof com.android.app.viewcapture.data.MotionWindowData
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {com.android.app.viewcapture.data.MotionWindowData} MotionWindowData
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            MotionWindowData.decodeDelimited = function decodeDelimited(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.uint32());
                            };
    
                            /**
                             * Verifies a MotionWindowData message.
                             * @function verify
                             * @memberof com.android.app.viewcapture.data.MotionWindowData
                             * @static
                             * @param {Object.<string,*>} message Plain object to verify
                             * @returns {string|null} `null` if valid, otherwise the reason why it is not
                             */
                            MotionWindowData.verify = function verify(message) {
                                if (typeof message !== "object" || message === null)
                                    return "object expected";
                                if (message.frameData != null && message.hasOwnProperty("frameData")) {
                                    if (!Array.isArray(message.frameData))
                                        return "frameData: array expected";
                                    for (var i = 0; i < message.frameData.length; ++i) {
                                        var error = $root.com.android.app.viewcapture.data.FrameData.verify(message.frameData[i]);
                                        if (error)
                                            return "frameData." + error;
                                    }
                                }
                                if (message.classname != null && message.hasOwnProperty("classname")) {
                                    if (!Array.isArray(message.classname))
                                        return "classname: array expected";
                                    for (var i = 0; i < message.classname.length; ++i)
                                        if (!$util.isString(message.classname[i]))
                                            return "classname: string[] expected";
                                }
                                return null;
                            };
    
                            /**
                             * Creates a MotionWindowData message from a plain object. Also converts values to their respective internal types.
                             * @function fromObject
                             * @memberof com.android.app.viewcapture.data.MotionWindowData
                             * @static
                             * @param {Object.<string,*>} object Plain object
                             * @returns {com.android.app.viewcapture.data.MotionWindowData} MotionWindowData
                             */
                            MotionWindowData.fromObject = function fromObject(object) {
                                if (object instanceof $root.com.android.app.viewcapture.data.MotionWindowData)
                                    return object;
                                var message = new $root.com.android.app.viewcapture.data.MotionWindowData();
                                if (object.frameData) {
                                    if (!Array.isArray(object.frameData))
                                        throw TypeError(".com.android.app.viewcapture.data.MotionWindowData.frameData: array expected");
                                    message.frameData = [];
                                    for (var i = 0; i < object.frameData.length; ++i) {
                                        if (typeof object.frameData[i] !== "object")
                                            throw TypeError(".com.android.app.viewcapture.data.MotionWindowData.frameData: object expected");
                                        message.frameData[i] = $root.com.android.app.viewcapture.data.FrameData.fromObject(object.frameData[i]);
                                    }
                                }
                                if (object.classname) {
                                    if (!Array.isArray(object.classname))
                                        throw TypeError(".com.android.app.viewcapture.data.MotionWindowData.classname: array expected");
                                    message.classname = [];
                                    for (var i = 0; i < object.classname.length; ++i)
                                        message.classname[i] = String(object.classname[i]);
                                }
                                return message;
                            };
    
                            /**
                             * Creates a plain object from a MotionWindowData message. Also converts values to other types if specified.
                             * @function toObject
                             * @memberof com.android.app.viewcapture.data.MotionWindowData
                             * @static
                             * @param {com.android.app.viewcapture.data.MotionWindowData} message MotionWindowData
                             * @param {$protobuf.IConversionOptions} [options] Conversion options
                             * @returns {Object.<string,*>} Plain object
                             */
                            MotionWindowData.toObject = function toObject(message, options) {
                                if (!options)
                                    options = {};
                                var object = {};
                                if (options.arrays || options.defaults) {
                                    object.frameData = [];
                                    object.classname = [];
                                }
                                if (message.frameData && message.frameData.length) {
                                    object.frameData = [];
                                    for (var j = 0; j < message.frameData.length; ++j)
                                        object.frameData[j] = $root.com.android.app.viewcapture.data.FrameData.toObject(message.frameData[j], options);
                                }
                                if (message.classname && message.classname.length) {
                                    object.classname = [];
                                    for (var j = 0; j < message.classname.length; ++j)
                                        object.classname[j] = message.classname[j];
                                }
                                return object;
                            };
    
                            /**
                             * Converts this MotionWindowData to JSON.
                             * @function toJSON
                             * @memberof com.android.app.viewcapture.data.MotionWindowData
                             * @instance
                             * @returns {Object.<string,*>} JSON object
                             */
                            MotionWindowData.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                            };
    
                            /**
                             * Gets the default type url for MotionWindowData
                             * @function getTypeUrl
                             * @memberof com.android.app.viewcapture.data.MotionWindowData
                             * @static
                             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                             * @returns {string} The default type url
                             */
                            MotionWindowData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                if (typeUrlPrefix === undefined) {
                                    typeUrlPrefix = "type.googleapis.com";
                                }
                                return typeUrlPrefix + "/com.android.app.viewcapture.data.MotionWindowData";
                            };
    
                            return MotionWindowData;
                        })();
    
                        data.FrameData = (function() {
    
                            /**
                             * Properties of a FrameData.
                             * @memberof com.android.app.viewcapture.data
                             * @interface IFrameData
                             * @property {Long|null} [timestamp] FrameData timestamp
                             * @property {com.android.app.viewcapture.data.IViewNode|null} [node] FrameData node
                             */
    
                            /**
                             * Constructs a new FrameData.
                             * @memberof com.android.app.viewcapture.data
                             * @classdesc Represents a FrameData.
                             * @implements IFrameData
                             * @constructor
                             * @param {com.android.app.viewcapture.data.IFrameData=} [properties] Properties to set
                             */
                            function FrameData(properties) {
                                if (properties)
                                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null)
                                            this[keys[i]] = properties[keys[i]];
                            }
    
                            /**
                             * FrameData timestamp.
                             * @member {Long} timestamp
                             * @memberof com.android.app.viewcapture.data.FrameData
                             * @instance
                             */
                            FrameData.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                            /**
                             * FrameData node.
                             * @member {com.android.app.viewcapture.data.IViewNode|null|undefined} node
                             * @memberof com.android.app.viewcapture.data.FrameData
                             * @instance
                             */
                            FrameData.prototype.node = null;
    
                            /**
                             * Creates a new FrameData instance using the specified properties.
                             * @function create
                             * @memberof com.android.app.viewcapture.data.FrameData
                             * @static
                             * @param {com.android.app.viewcapture.data.IFrameData=} [properties] Properties to set
                             * @returns {com.android.app.viewcapture.data.FrameData} FrameData instance
                             */
                            FrameData.create = function create(properties) {
                                return new FrameData(properties);
                            };
    
                            /**
                             * Encodes the specified FrameData message. Does not implicitly {@link com.android.app.viewcapture.data.FrameData.verify|verify} messages.
                             * @function encode
                             * @memberof com.android.app.viewcapture.data.FrameData
                             * @static
                             * @param {com.android.app.viewcapture.data.IFrameData} message FrameData message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            FrameData.encode = function encode(message, writer) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.timestamp);
                                if (message.node != null && Object.hasOwnProperty.call(message, "node"))
                                    $root.com.android.app.viewcapture.data.ViewNode.encode(message.node, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                                return writer;
                            };
    
                            /**
                             * Encodes the specified FrameData message, length delimited. Does not implicitly {@link com.android.app.viewcapture.data.FrameData.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof com.android.app.viewcapture.data.FrameData
                             * @static
                             * @param {com.android.app.viewcapture.data.IFrameData} message FrameData message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            FrameData.encodeDelimited = function encodeDelimited(message, writer) {
                                return this.encode(message, writer).ldelim();
                            };
    
                            /**
                             * Decodes a FrameData message from the specified reader or buffer.
                             * @function decode
                             * @memberof com.android.app.viewcapture.data.FrameData
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {com.android.app.viewcapture.data.FrameData} FrameData
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            FrameData.decode = function decode(reader, length) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.android.app.viewcapture.data.FrameData();
                                while (reader.pos < end) {
                                    var tag = reader.uint32();
                                    switch (tag >>> 3) {
                                    case 1: {
                                            message.timestamp = reader.int64();
                                            break;
                                        }
                                    case 2: {
                                            message.node = $root.com.android.app.viewcapture.data.ViewNode.decode(reader, reader.uint32());
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
                             * Decodes a FrameData message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof com.android.app.viewcapture.data.FrameData
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {com.android.app.viewcapture.data.FrameData} FrameData
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            FrameData.decodeDelimited = function decodeDelimited(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.uint32());
                            };
    
                            /**
                             * Verifies a FrameData message.
                             * @function verify
                             * @memberof com.android.app.viewcapture.data.FrameData
                             * @static
                             * @param {Object.<string,*>} message Plain object to verify
                             * @returns {string|null} `null` if valid, otherwise the reason why it is not
                             */
                            FrameData.verify = function verify(message) {
                                if (typeof message !== "object" || message === null)
                                    return "object expected";
                                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                                    if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                                        return "timestamp: integer|Long expected";
                                if (message.node != null && message.hasOwnProperty("node")) {
                                    var error = $root.com.android.app.viewcapture.data.ViewNode.verify(message.node);
                                    if (error)
                                        return "node." + error;
                                }
                                return null;
                            };
    
                            /**
                             * Creates a FrameData message from a plain object. Also converts values to their respective internal types.
                             * @function fromObject
                             * @memberof com.android.app.viewcapture.data.FrameData
                             * @static
                             * @param {Object.<string,*>} object Plain object
                             * @returns {com.android.app.viewcapture.data.FrameData} FrameData
                             */
                            FrameData.fromObject = function fromObject(object) {
                                if (object instanceof $root.com.android.app.viewcapture.data.FrameData)
                                    return object;
                                var message = new $root.com.android.app.viewcapture.data.FrameData();
                                if (object.timestamp != null)
                                    if ($util.Long)
                                        (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                                    else if (typeof object.timestamp === "string")
                                        message.timestamp = parseInt(object.timestamp, 10);
                                    else if (typeof object.timestamp === "number")
                                        message.timestamp = object.timestamp;
                                    else if (typeof object.timestamp === "object")
                                        message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
                                if (object.node != null) {
                                    if (typeof object.node !== "object")
                                        throw TypeError(".com.android.app.viewcapture.data.FrameData.node: object expected");
                                    message.node = $root.com.android.app.viewcapture.data.ViewNode.fromObject(object.node);
                                }
                                return message;
                            };
    
                            /**
                             * Creates a plain object from a FrameData message. Also converts values to other types if specified.
                             * @function toObject
                             * @memberof com.android.app.viewcapture.data.FrameData
                             * @static
                             * @param {com.android.app.viewcapture.data.FrameData} message FrameData
                             * @param {$protobuf.IConversionOptions} [options] Conversion options
                             * @returns {Object.<string,*>} Plain object
                             */
                            FrameData.toObject = function toObject(message, options) {
                                if (!options)
                                    options = {};
                                var object = {};
                                if (options.defaults) {
                                    if ($util.Long) {
                                        var long = new $util.Long(0, 0, false);
                                        object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                    } else
                                        object.timestamp = options.longs === String ? "0" : 0;
                                    object.node = null;
                                }
                                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                                    if (typeof message.timestamp === "number")
                                        object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                                    else
                                        object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
                                if (message.node != null && message.hasOwnProperty("node"))
                                    object.node = $root.com.android.app.viewcapture.data.ViewNode.toObject(message.node, options);
                                return object;
                            };
    
                            /**
                             * Converts this FrameData to JSON.
                             * @function toJSON
                             * @memberof com.android.app.viewcapture.data.FrameData
                             * @instance
                             * @returns {Object.<string,*>} JSON object
                             */
                            FrameData.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                            };
    
                            /**
                             * Gets the default type url for FrameData
                             * @function getTypeUrl
                             * @memberof com.android.app.viewcapture.data.FrameData
                             * @static
                             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                             * @returns {string} The default type url
                             */
                            FrameData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                if (typeUrlPrefix === undefined) {
                                    typeUrlPrefix = "type.googleapis.com";
                                }
                                return typeUrlPrefix + "/com.android.app.viewcapture.data.FrameData";
                            };
    
                            return FrameData;
                        })();
    
                        data.ViewNode = (function() {
    
                            /**
                             * Properties of a ViewNode.
                             * @memberof com.android.app.viewcapture.data
                             * @interface IViewNode
                             * @property {number|null} [classnameIndex] ViewNode classnameIndex
                             * @property {number|null} [hashcode] ViewNode hashcode
                             * @property {Array.<com.android.app.viewcapture.data.IViewNode>|null} [children] ViewNode children
                             * @property {string|null} [id] ViewNode id
                             * @property {number|null} [left] ViewNode left
                             * @property {number|null} [top] ViewNode top
                             * @property {number|null} [width] ViewNode width
                             * @property {number|null} [height] ViewNode height
                             * @property {number|null} [scrollX] ViewNode scrollX
                             * @property {number|null} [scrollY] ViewNode scrollY
                             * @property {number|null} [translationX] ViewNode translationX
                             * @property {number|null} [translationY] ViewNode translationY
                             * @property {number|null} [scaleX] ViewNode scaleX
                             * @property {number|null} [scaleY] ViewNode scaleY
                             * @property {number|null} [alpha] ViewNode alpha
                             * @property {boolean|null} [willNotDraw] ViewNode willNotDraw
                             * @property {boolean|null} [clipChildren] ViewNode clipChildren
                             * @property {number|null} [visibility] ViewNode visibility
                             * @property {number|null} [elevation] ViewNode elevation
                             */
    
                            /**
                             * Constructs a new ViewNode.
                             * @memberof com.android.app.viewcapture.data
                             * @classdesc Represents a ViewNode.
                             * @implements IViewNode
                             * @constructor
                             * @param {com.android.app.viewcapture.data.IViewNode=} [properties] Properties to set
                             */
                            function ViewNode(properties) {
                                this.children = [];
                                if (properties)
                                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null)
                                            this[keys[i]] = properties[keys[i]];
                            }
    
                            /**
                             * ViewNode classnameIndex.
                             * @member {number} classnameIndex
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.classnameIndex = 0;
    
                            /**
                             * ViewNode hashcode.
                             * @member {number} hashcode
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.hashcode = 0;
    
                            /**
                             * ViewNode children.
                             * @member {Array.<com.android.app.viewcapture.data.IViewNode>} children
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.children = $util.emptyArray;
    
                            /**
                             * ViewNode id.
                             * @member {string} id
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.id = "";
    
                            /**
                             * ViewNode left.
                             * @member {number} left
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.left = 0;
    
                            /**
                             * ViewNode top.
                             * @member {number} top
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.top = 0;
    
                            /**
                             * ViewNode width.
                             * @member {number} width
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.width = 0;
    
                            /**
                             * ViewNode height.
                             * @member {number} height
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.height = 0;
    
                            /**
                             * ViewNode scrollX.
                             * @member {number} scrollX
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.scrollX = 0;
    
                            /**
                             * ViewNode scrollY.
                             * @member {number} scrollY
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.scrollY = 0;
    
                            /**
                             * ViewNode translationX.
                             * @member {number} translationX
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.translationX = 0;
    
                            /**
                             * ViewNode translationY.
                             * @member {number} translationY
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.translationY = 0;
    
                            /**
                             * ViewNode scaleX.
                             * @member {number} scaleX
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.scaleX = 1;
    
                            /**
                             * ViewNode scaleY.
                             * @member {number} scaleY
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.scaleY = 1;
    
                            /**
                             * ViewNode alpha.
                             * @member {number} alpha
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.alpha = 1;
    
                            /**
                             * ViewNode willNotDraw.
                             * @member {boolean} willNotDraw
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.willNotDraw = false;
    
                            /**
                             * ViewNode clipChildren.
                             * @member {boolean} clipChildren
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.clipChildren = false;
    
                            /**
                             * ViewNode visibility.
                             * @member {number} visibility
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.visibility = 0;
    
                            /**
                             * ViewNode elevation.
                             * @member {number} elevation
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             */
                            ViewNode.prototype.elevation = 0;
    
                            /**
                             * Creates a new ViewNode instance using the specified properties.
                             * @function create
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @static
                             * @param {com.android.app.viewcapture.data.IViewNode=} [properties] Properties to set
                             * @returns {com.android.app.viewcapture.data.ViewNode} ViewNode instance
                             */
                            ViewNode.create = function create(properties) {
                                return new ViewNode(properties);
                            };
    
                            /**
                             * Encodes the specified ViewNode message. Does not implicitly {@link com.android.app.viewcapture.data.ViewNode.verify|verify} messages.
                             * @function encode
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @static
                             * @param {com.android.app.viewcapture.data.IViewNode} message ViewNode message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            ViewNode.encode = function encode(message, writer) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (message.classnameIndex != null && Object.hasOwnProperty.call(message, "classnameIndex"))
                                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.classnameIndex);
                                if (message.hashcode != null && Object.hasOwnProperty.call(message, "hashcode"))
                                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.hashcode);
                                if (message.children != null && message.children.length)
                                    for (var i = 0; i < message.children.length; ++i)
                                        $root.com.android.app.viewcapture.data.ViewNode.encode(message.children[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.id);
                                if (message.left != null && Object.hasOwnProperty.call(message, "left"))
                                    writer.uint32(/* id 5, wireType 0 =*/40).int32(message.left);
                                if (message.top != null && Object.hasOwnProperty.call(message, "top"))
                                    writer.uint32(/* id 6, wireType 0 =*/48).int32(message.top);
                                if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                                    writer.uint32(/* id 7, wireType 0 =*/56).int32(message.width);
                                if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                                    writer.uint32(/* id 8, wireType 0 =*/64).int32(message.height);
                                if (message.scrollX != null && Object.hasOwnProperty.call(message, "scrollX"))
                                    writer.uint32(/* id 9, wireType 0 =*/72).int32(message.scrollX);
                                if (message.scrollY != null && Object.hasOwnProperty.call(message, "scrollY"))
                                    writer.uint32(/* id 10, wireType 0 =*/80).int32(message.scrollY);
                                if (message.translationX != null && Object.hasOwnProperty.call(message, "translationX"))
                                    writer.uint32(/* id 11, wireType 5 =*/93).float(message.translationX);
                                if (message.translationY != null && Object.hasOwnProperty.call(message, "translationY"))
                                    writer.uint32(/* id 12, wireType 5 =*/101).float(message.translationY);
                                if (message.scaleX != null && Object.hasOwnProperty.call(message, "scaleX"))
                                    writer.uint32(/* id 13, wireType 5 =*/109).float(message.scaleX);
                                if (message.scaleY != null && Object.hasOwnProperty.call(message, "scaleY"))
                                    writer.uint32(/* id 14, wireType 5 =*/117).float(message.scaleY);
                                if (message.alpha != null && Object.hasOwnProperty.call(message, "alpha"))
                                    writer.uint32(/* id 15, wireType 5 =*/125).float(message.alpha);
                                if (message.willNotDraw != null && Object.hasOwnProperty.call(message, "willNotDraw"))
                                    writer.uint32(/* id 16, wireType 0 =*/128).bool(message.willNotDraw);
                                if (message.clipChildren != null && Object.hasOwnProperty.call(message, "clipChildren"))
                                    writer.uint32(/* id 17, wireType 0 =*/136).bool(message.clipChildren);
                                if (message.visibility != null && Object.hasOwnProperty.call(message, "visibility"))
                                    writer.uint32(/* id 18, wireType 0 =*/144).int32(message.visibility);
                                if (message.elevation != null && Object.hasOwnProperty.call(message, "elevation"))
                                    writer.uint32(/* id 19, wireType 5 =*/157).float(message.elevation);
                                return writer;
                            };
    
                            /**
                             * Encodes the specified ViewNode message, length delimited. Does not implicitly {@link com.android.app.viewcapture.data.ViewNode.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @static
                             * @param {com.android.app.viewcapture.data.IViewNode} message ViewNode message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            ViewNode.encodeDelimited = function encodeDelimited(message, writer) {
                                return this.encode(message, writer).ldelim();
                            };
    
                            /**
                             * Decodes a ViewNode message from the specified reader or buffer.
                             * @function decode
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {com.android.app.viewcapture.data.ViewNode} ViewNode
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            ViewNode.decode = function decode(reader, length) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.android.app.viewcapture.data.ViewNode();
                                while (reader.pos < end) {
                                    var tag = reader.uint32();
                                    switch (tag >>> 3) {
                                    case 1: {
                                            message.classnameIndex = reader.int32();
                                            break;
                                        }
                                    case 2: {
                                            message.hashcode = reader.int32();
                                            break;
                                        }
                                    case 3: {
                                            if (!(message.children && message.children.length))
                                                message.children = [];
                                            message.children.push($root.com.android.app.viewcapture.data.ViewNode.decode(reader, reader.uint32()));
                                            break;
                                        }
                                    case 4: {
                                            message.id = reader.string();
                                            break;
                                        }
                                    case 5: {
                                            message.left = reader.int32();
                                            break;
                                        }
                                    case 6: {
                                            message.top = reader.int32();
                                            break;
                                        }
                                    case 7: {
                                            message.width = reader.int32();
                                            break;
                                        }
                                    case 8: {
                                            message.height = reader.int32();
                                            break;
                                        }
                                    case 9: {
                                            message.scrollX = reader.int32();
                                            break;
                                        }
                                    case 10: {
                                            message.scrollY = reader.int32();
                                            break;
                                        }
                                    case 11: {
                                            message.translationX = reader.float();
                                            break;
                                        }
                                    case 12: {
                                            message.translationY = reader.float();
                                            break;
                                        }
                                    case 13: {
                                            message.scaleX = reader.float();
                                            break;
                                        }
                                    case 14: {
                                            message.scaleY = reader.float();
                                            break;
                                        }
                                    case 15: {
                                            message.alpha = reader.float();
                                            break;
                                        }
                                    case 16: {
                                            message.willNotDraw = reader.bool();
                                            break;
                                        }
                                    case 17: {
                                            message.clipChildren = reader.bool();
                                            break;
                                        }
                                    case 18: {
                                            message.visibility = reader.int32();
                                            break;
                                        }
                                    case 19: {
                                            message.elevation = reader.float();
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
                             * Decodes a ViewNode message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {com.android.app.viewcapture.data.ViewNode} ViewNode
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            ViewNode.decodeDelimited = function decodeDelimited(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.uint32());
                            };
    
                            /**
                             * Verifies a ViewNode message.
                             * @function verify
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @static
                             * @param {Object.<string,*>} message Plain object to verify
                             * @returns {string|null} `null` if valid, otherwise the reason why it is not
                             */
                            ViewNode.verify = function verify(message) {
                                if (typeof message !== "object" || message === null)
                                    return "object expected";
                                if (message.classnameIndex != null && message.hasOwnProperty("classnameIndex"))
                                    if (!$util.isInteger(message.classnameIndex))
                                        return "classnameIndex: integer expected";
                                if (message.hashcode != null && message.hasOwnProperty("hashcode"))
                                    if (!$util.isInteger(message.hashcode))
                                        return "hashcode: integer expected";
                                if (message.children != null && message.hasOwnProperty("children")) {
                                    if (!Array.isArray(message.children))
                                        return "children: array expected";
                                    for (var i = 0; i < message.children.length; ++i) {
                                        var error = $root.com.android.app.viewcapture.data.ViewNode.verify(message.children[i]);
                                        if (error)
                                            return "children." + error;
                                    }
                                }
                                if (message.id != null && message.hasOwnProperty("id"))
                                    if (!$util.isString(message.id))
                                        return "id: string expected";
                                if (message.left != null && message.hasOwnProperty("left"))
                                    if (!$util.isInteger(message.left))
                                        return "left: integer expected";
                                if (message.top != null && message.hasOwnProperty("top"))
                                    if (!$util.isInteger(message.top))
                                        return "top: integer expected";
                                if (message.width != null && message.hasOwnProperty("width"))
                                    if (!$util.isInteger(message.width))
                                        return "width: integer expected";
                                if (message.height != null && message.hasOwnProperty("height"))
                                    if (!$util.isInteger(message.height))
                                        return "height: integer expected";
                                if (message.scrollX != null && message.hasOwnProperty("scrollX"))
                                    if (!$util.isInteger(message.scrollX))
                                        return "scrollX: integer expected";
                                if (message.scrollY != null && message.hasOwnProperty("scrollY"))
                                    if (!$util.isInteger(message.scrollY))
                                        return "scrollY: integer expected";
                                if (message.translationX != null && message.hasOwnProperty("translationX"))
                                    if (typeof message.translationX !== "number")
                                        return "translationX: number expected";
                                if (message.translationY != null && message.hasOwnProperty("translationY"))
                                    if (typeof message.translationY !== "number")
                                        return "translationY: number expected";
                                if (message.scaleX != null && message.hasOwnProperty("scaleX"))
                                    if (typeof message.scaleX !== "number")
                                        return "scaleX: number expected";
                                if (message.scaleY != null && message.hasOwnProperty("scaleY"))
                                    if (typeof message.scaleY !== "number")
                                        return "scaleY: number expected";
                                if (message.alpha != null && message.hasOwnProperty("alpha"))
                                    if (typeof message.alpha !== "number")
                                        return "alpha: number expected";
                                if (message.willNotDraw != null && message.hasOwnProperty("willNotDraw"))
                                    if (typeof message.willNotDraw !== "boolean")
                                        return "willNotDraw: boolean expected";
                                if (message.clipChildren != null && message.hasOwnProperty("clipChildren"))
                                    if (typeof message.clipChildren !== "boolean")
                                        return "clipChildren: boolean expected";
                                if (message.visibility != null && message.hasOwnProperty("visibility"))
                                    if (!$util.isInteger(message.visibility))
                                        return "visibility: integer expected";
                                if (message.elevation != null && message.hasOwnProperty("elevation"))
                                    if (typeof message.elevation !== "number")
                                        return "elevation: number expected";
                                return null;
                            };
    
                            /**
                             * Creates a ViewNode message from a plain object. Also converts values to their respective internal types.
                             * @function fromObject
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @static
                             * @param {Object.<string,*>} object Plain object
                             * @returns {com.android.app.viewcapture.data.ViewNode} ViewNode
                             */
                            ViewNode.fromObject = function fromObject(object) {
                                if (object instanceof $root.com.android.app.viewcapture.data.ViewNode)
                                    return object;
                                var message = new $root.com.android.app.viewcapture.data.ViewNode();
                                if (object.classnameIndex != null)
                                    message.classnameIndex = object.classnameIndex | 0;
                                if (object.hashcode != null)
                                    message.hashcode = object.hashcode | 0;
                                if (object.children) {
                                    if (!Array.isArray(object.children))
                                        throw TypeError(".com.android.app.viewcapture.data.ViewNode.children: array expected");
                                    message.children = [];
                                    for (var i = 0; i < object.children.length; ++i) {
                                        if (typeof object.children[i] !== "object")
                                            throw TypeError(".com.android.app.viewcapture.data.ViewNode.children: object expected");
                                        message.children[i] = $root.com.android.app.viewcapture.data.ViewNode.fromObject(object.children[i]);
                                    }
                                }
                                if (object.id != null)
                                    message.id = String(object.id);
                                if (object.left != null)
                                    message.left = object.left | 0;
                                if (object.top != null)
                                    message.top = object.top | 0;
                                if (object.width != null)
                                    message.width = object.width | 0;
                                if (object.height != null)
                                    message.height = object.height | 0;
                                if (object.scrollX != null)
                                    message.scrollX = object.scrollX | 0;
                                if (object.scrollY != null)
                                    message.scrollY = object.scrollY | 0;
                                if (object.translationX != null)
                                    message.translationX = Number(object.translationX);
                                if (object.translationY != null)
                                    message.translationY = Number(object.translationY);
                                if (object.scaleX != null)
                                    message.scaleX = Number(object.scaleX);
                                if (object.scaleY != null)
                                    message.scaleY = Number(object.scaleY);
                                if (object.alpha != null)
                                    message.alpha = Number(object.alpha);
                                if (object.willNotDraw != null)
                                    message.willNotDraw = Boolean(object.willNotDraw);
                                if (object.clipChildren != null)
                                    message.clipChildren = Boolean(object.clipChildren);
                                if (object.visibility != null)
                                    message.visibility = object.visibility | 0;
                                if (object.elevation != null)
                                    message.elevation = Number(object.elevation);
                                return message;
                            };
    
                            /**
                             * Creates a plain object from a ViewNode message. Also converts values to other types if specified.
                             * @function toObject
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @static
                             * @param {com.android.app.viewcapture.data.ViewNode} message ViewNode
                             * @param {$protobuf.IConversionOptions} [options] Conversion options
                             * @returns {Object.<string,*>} Plain object
                             */
                            ViewNode.toObject = function toObject(message, options) {
                                if (!options)
                                    options = {};
                                var object = {};
                                if (options.arrays || options.defaults)
                                    object.children = [];
                                if (options.defaults) {
                                    object.classnameIndex = 0;
                                    object.hashcode = 0;
                                    object.id = "";
                                    object.left = 0;
                                    object.top = 0;
                                    object.width = 0;
                                    object.height = 0;
                                    object.scrollX = 0;
                                    object.scrollY = 0;
                                    object.translationX = 0;
                                    object.translationY = 0;
                                    object.scaleX = 1;
                                    object.scaleY = 1;
                                    object.alpha = 1;
                                    object.willNotDraw = false;
                                    object.clipChildren = false;
                                    object.visibility = 0;
                                    object.elevation = 0;
                                }
                                if (message.classnameIndex != null && message.hasOwnProperty("classnameIndex"))
                                    object.classnameIndex = message.classnameIndex;
                                if (message.hashcode != null && message.hasOwnProperty("hashcode"))
                                    object.hashcode = message.hashcode;
                                if (message.children && message.children.length) {
                                    object.children = [];
                                    for (var j = 0; j < message.children.length; ++j)
                                        object.children[j] = $root.com.android.app.viewcapture.data.ViewNode.toObject(message.children[j], options);
                                }
                                if (message.id != null && message.hasOwnProperty("id"))
                                    object.id = message.id;
                                if (message.left != null && message.hasOwnProperty("left"))
                                    object.left = message.left;
                                if (message.top != null && message.hasOwnProperty("top"))
                                    object.top = message.top;
                                if (message.width != null && message.hasOwnProperty("width"))
                                    object.width = message.width;
                                if (message.height != null && message.hasOwnProperty("height"))
                                    object.height = message.height;
                                if (message.scrollX != null && message.hasOwnProperty("scrollX"))
                                    object.scrollX = message.scrollX;
                                if (message.scrollY != null && message.hasOwnProperty("scrollY"))
                                    object.scrollY = message.scrollY;
                                if (message.translationX != null && message.hasOwnProperty("translationX"))
                                    object.translationX = options.json && !isFinite(message.translationX) ? String(message.translationX) : message.translationX;
                                if (message.translationY != null && message.hasOwnProperty("translationY"))
                                    object.translationY = options.json && !isFinite(message.translationY) ? String(message.translationY) : message.translationY;
                                if (message.scaleX != null && message.hasOwnProperty("scaleX"))
                                    object.scaleX = options.json && !isFinite(message.scaleX) ? String(message.scaleX) : message.scaleX;
                                if (message.scaleY != null && message.hasOwnProperty("scaleY"))
                                    object.scaleY = options.json && !isFinite(message.scaleY) ? String(message.scaleY) : message.scaleY;
                                if (message.alpha != null && message.hasOwnProperty("alpha"))
                                    object.alpha = options.json && !isFinite(message.alpha) ? String(message.alpha) : message.alpha;
                                if (message.willNotDraw != null && message.hasOwnProperty("willNotDraw"))
                                    object.willNotDraw = message.willNotDraw;
                                if (message.clipChildren != null && message.hasOwnProperty("clipChildren"))
                                    object.clipChildren = message.clipChildren;
                                if (message.visibility != null && message.hasOwnProperty("visibility"))
                                    object.visibility = message.visibility;
                                if (message.elevation != null && message.hasOwnProperty("elevation"))
                                    object.elevation = options.json && !isFinite(message.elevation) ? String(message.elevation) : message.elevation;
                                return object;
                            };
    
                            /**
                             * Converts this ViewNode to JSON.
                             * @function toJSON
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @instance
                             * @returns {Object.<string,*>} JSON object
                             */
                            ViewNode.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                            };
    
                            /**
                             * Gets the default type url for ViewNode
                             * @function getTypeUrl
                             * @memberof com.android.app.viewcapture.data.ViewNode
                             * @static
                             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                             * @returns {string} The default type url
                             */
                            ViewNode.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                if (typeUrlPrefix === undefined) {
                                    typeUrlPrefix = "type.googleapis.com";
                                }
                                return typeUrlPrefix + "/com.android.app.viewcapture.data.ViewNode";
                            };
    
                            return ViewNode;
                        })();
    
                        return data;
                    })();
    
                    return viewcapture;
                })();
    
                return app;
            })();
    
            return android;
        })();
    
        return com;
    })();

    return $root;
});
