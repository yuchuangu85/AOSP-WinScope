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
    var $root = $protobuf.roots.viewcapturelatest || ($protobuf.roots.viewcapturelatest = {});
    
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
    
            protos.Wrapper = (function() {
    
                /**
                 * Properties of a Wrapper.
                 * @memberof perfetto.protos
                 * @interface IWrapper
                 * @property {perfetto.protos.IViewCapture|null} [viewcapture] Wrapper viewcapture
                 */
    
                /**
                 * Constructs a new Wrapper.
                 * @memberof perfetto.protos
                 * @classdesc Represents a Wrapper.
                 * @implements IWrapper
                 * @constructor
                 * @param {perfetto.protos.IWrapper=} [properties] Properties to set
                 */
                function Wrapper(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Wrapper viewcapture.
                 * @member {perfetto.protos.IViewCapture|null|undefined} viewcapture
                 * @memberof perfetto.protos.Wrapper
                 * @instance
                 */
                Wrapper.prototype.viewcapture = null;
    
                /**
                 * Creates a new Wrapper instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.Wrapper
                 * @static
                 * @param {perfetto.protos.IWrapper=} [properties] Properties to set
                 * @returns {perfetto.protos.Wrapper} Wrapper instance
                 */
                Wrapper.create = function create(properties) {
                    return new Wrapper(properties);
                };
    
                /**
                 * Encodes the specified Wrapper message. Does not implicitly {@link perfetto.protos.Wrapper.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.Wrapper
                 * @static
                 * @param {perfetto.protos.IWrapper} message Wrapper message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Wrapper.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.viewcapture != null && Object.hasOwnProperty.call(message, "viewcapture"))
                        $root.perfetto.protos.ViewCapture.encode(message.viewcapture, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified Wrapper message, length delimited. Does not implicitly {@link perfetto.protos.Wrapper.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.Wrapper
                 * @static
                 * @param {perfetto.protos.IWrapper} message Wrapper message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Wrapper.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Wrapper message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.Wrapper
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.Wrapper} Wrapper
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Wrapper.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.Wrapper();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.viewcapture = $root.perfetto.protos.ViewCapture.decode(reader, reader.uint32());
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
                 * Decodes a Wrapper message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.Wrapper
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.Wrapper} Wrapper
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Wrapper.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Wrapper message.
                 * @function verify
                 * @memberof perfetto.protos.Wrapper
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Wrapper.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.viewcapture != null && message.hasOwnProperty("viewcapture")) {
                        var error = $root.perfetto.protos.ViewCapture.verify(message.viewcapture);
                        if (error)
                            return "viewcapture." + error;
                    }
                    return null;
                };
    
                /**
                 * Creates a Wrapper message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.Wrapper
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.Wrapper} Wrapper
                 */
                Wrapper.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.Wrapper)
                        return object;
                    var message = new $root.perfetto.protos.Wrapper();
                    if (object.viewcapture != null) {
                        if (typeof object.viewcapture !== "object")
                            throw TypeError(".perfetto.protos.Wrapper.viewcapture: object expected");
                        message.viewcapture = $root.perfetto.protos.ViewCapture.fromObject(object.viewcapture);
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from a Wrapper message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.Wrapper
                 * @static
                 * @param {perfetto.protos.Wrapper} message Wrapper
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Wrapper.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.viewcapture = null;
                    if (message.viewcapture != null && message.hasOwnProperty("viewcapture"))
                        object.viewcapture = $root.perfetto.protos.ViewCapture.toObject(message.viewcapture, options);
                    return object;
                };
    
                /**
                 * Converts this Wrapper to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.Wrapper
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Wrapper.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for Wrapper
                 * @function getTypeUrl
                 * @memberof perfetto.protos.Wrapper
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Wrapper.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.Wrapper";
                };
    
                return Wrapper;
            })();
    
            protos.ViewCapture = (function() {
    
                /**
                 * Properties of a ViewCapture.
                 * @memberof perfetto.protos
                 * @interface IViewCapture
                 * @property {number|null} [packageNameIid] ViewCapture packageNameIid
                 * @property {number|null} [windowNameIid] ViewCapture windowNameIid
                 * @property {Array.<perfetto.protos.ViewCapture.IView>|null} [views] ViewCapture views
                 */
    
                /**
                 * Constructs a new ViewCapture.
                 * @memberof perfetto.protos
                 * @classdesc Represents a ViewCapture.
                 * @implements IViewCapture
                 * @constructor
                 * @param {perfetto.protos.IViewCapture=} [properties] Properties to set
                 */
                function ViewCapture(properties) {
                    this.views = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ViewCapture packageNameIid.
                 * @member {number} packageNameIid
                 * @memberof perfetto.protos.ViewCapture
                 * @instance
                 */
                ViewCapture.prototype.packageNameIid = 0;
    
                /**
                 * ViewCapture windowNameIid.
                 * @member {number} windowNameIid
                 * @memberof perfetto.protos.ViewCapture
                 * @instance
                 */
                ViewCapture.prototype.windowNameIid = 0;
    
                /**
                 * ViewCapture views.
                 * @member {Array.<perfetto.protos.ViewCapture.IView>} views
                 * @memberof perfetto.protos.ViewCapture
                 * @instance
                 */
                ViewCapture.prototype.views = $util.emptyArray;
    
                /**
                 * Creates a new ViewCapture instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.ViewCapture
                 * @static
                 * @param {perfetto.protos.IViewCapture=} [properties] Properties to set
                 * @returns {perfetto.protos.ViewCapture} ViewCapture instance
                 */
                ViewCapture.create = function create(properties) {
                    return new ViewCapture(properties);
                };
    
                /**
                 * Encodes the specified ViewCapture message. Does not implicitly {@link perfetto.protos.ViewCapture.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.ViewCapture
                 * @static
                 * @param {perfetto.protos.IViewCapture} message ViewCapture message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ViewCapture.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.packageNameIid != null && Object.hasOwnProperty.call(message, "packageNameIid"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.packageNameIid);
                    if (message.windowNameIid != null && Object.hasOwnProperty.call(message, "windowNameIid"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.windowNameIid);
                    if (message.views != null && message.views.length)
                        for (var i = 0; i < message.views.length; ++i)
                            $root.perfetto.protos.ViewCapture.View.encode(message.views[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified ViewCapture message, length delimited. Does not implicitly {@link perfetto.protos.ViewCapture.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.ViewCapture
                 * @static
                 * @param {perfetto.protos.IViewCapture} message ViewCapture message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ViewCapture.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a ViewCapture message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.ViewCapture
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.ViewCapture} ViewCapture
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ViewCapture.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.ViewCapture();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.packageNameIid = reader.int32();
                                break;
                            }
                        case 2: {
                                message.windowNameIid = reader.int32();
                                break;
                            }
                        case 3: {
                                if (!(message.views && message.views.length))
                                    message.views = [];
                                message.views.push($root.perfetto.protos.ViewCapture.View.decode(reader, reader.uint32()));
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
                 * Decodes a ViewCapture message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.ViewCapture
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.ViewCapture} ViewCapture
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ViewCapture.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a ViewCapture message.
                 * @function verify
                 * @memberof perfetto.protos.ViewCapture
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ViewCapture.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.packageNameIid != null && message.hasOwnProperty("packageNameIid"))
                        if (!$util.isInteger(message.packageNameIid))
                            return "packageNameIid: integer expected";
                    if (message.windowNameIid != null && message.hasOwnProperty("windowNameIid"))
                        if (!$util.isInteger(message.windowNameIid))
                            return "windowNameIid: integer expected";
                    if (message.views != null && message.hasOwnProperty("views")) {
                        if (!Array.isArray(message.views))
                            return "views: array expected";
                        for (var i = 0; i < message.views.length; ++i) {
                            var error = $root.perfetto.protos.ViewCapture.View.verify(message.views[i]);
                            if (error)
                                return "views." + error;
                        }
                    }
                    return null;
                };
    
                /**
                 * Creates a ViewCapture message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.ViewCapture
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.ViewCapture} ViewCapture
                 */
                ViewCapture.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.ViewCapture)
                        return object;
                    var message = new $root.perfetto.protos.ViewCapture();
                    if (object.packageNameIid != null)
                        message.packageNameIid = object.packageNameIid | 0;
                    if (object.windowNameIid != null)
                        message.windowNameIid = object.windowNameIid | 0;
                    if (object.views) {
                        if (!Array.isArray(object.views))
                            throw TypeError(".perfetto.protos.ViewCapture.views: array expected");
                        message.views = [];
                        for (var i = 0; i < object.views.length; ++i) {
                            if (typeof object.views[i] !== "object")
                                throw TypeError(".perfetto.protos.ViewCapture.views: object expected");
                            message.views[i] = $root.perfetto.protos.ViewCapture.View.fromObject(object.views[i]);
                        }
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from a ViewCapture message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.ViewCapture
                 * @static
                 * @param {perfetto.protos.ViewCapture} message ViewCapture
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ViewCapture.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.views = [];
                    if (options.defaults) {
                        object.packageNameIid = 0;
                        object.windowNameIid = 0;
                    }
                    if (message.packageNameIid != null && message.hasOwnProperty("packageNameIid"))
                        object.packageNameIid = message.packageNameIid;
                    if (message.windowNameIid != null && message.hasOwnProperty("windowNameIid"))
                        object.windowNameIid = message.windowNameIid;
                    if (message.views && message.views.length) {
                        object.views = [];
                        for (var j = 0; j < message.views.length; ++j)
                            object.views[j] = $root.perfetto.protos.ViewCapture.View.toObject(message.views[j], options);
                    }
                    return object;
                };
    
                /**
                 * Converts this ViewCapture to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.ViewCapture
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ViewCapture.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for ViewCapture
                 * @function getTypeUrl
                 * @memberof perfetto.protos.ViewCapture
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                ViewCapture.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.ViewCapture";
                };
    
                ViewCapture.View = (function() {
    
                    /**
                     * Properties of a View.
                     * @memberof perfetto.protos.ViewCapture
                     * @interface IView
                     * @property {number|null} [id] View id
                     * @property {number|null} [parentId] View parentId
                     * @property {number|null} [hashcode] View hashcode
                     * @property {number|null} [viewIdIid] View viewIdIid
                     * @property {number|null} [classNameIid] View classNameIid
                     * @property {number|null} [left] View left
                     * @property {number|null} [top] View top
                     * @property {number|null} [width] View width
                     * @property {number|null} [height] View height
                     * @property {number|null} [scrollX] View scrollX
                     * @property {number|null} [scrollY] View scrollY
                     * @property {number|null} [translationX] View translationX
                     * @property {number|null} [translationY] View translationY
                     * @property {number|null} [scaleX] View scaleX
                     * @property {number|null} [scaleY] View scaleY
                     * @property {number|null} [alpha] View alpha
                     * @property {boolean|null} [willNotDraw] View willNotDraw
                     * @property {boolean|null} [clipChildren] View clipChildren
                     * @property {number|null} [visibility] View visibility
                     * @property {number|null} [elevation] View elevation
                     */
    
                    /**
                     * Constructs a new View.
                     * @memberof perfetto.protos.ViewCapture
                     * @classdesc Represents a View.
                     * @implements IView
                     * @constructor
                     * @param {perfetto.protos.ViewCapture.IView=} [properties] Properties to set
                     */
                    function View(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * View id.
                     * @member {number} id
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.id = 0;
    
                    /**
                     * View parentId.
                     * @member {number} parentId
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.parentId = 0;
    
                    /**
                     * View hashcode.
                     * @member {number} hashcode
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.hashcode = 0;
    
                    /**
                     * View viewIdIid.
                     * @member {number} viewIdIid
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.viewIdIid = 0;
    
                    /**
                     * View classNameIid.
                     * @member {number} classNameIid
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.classNameIid = 0;
    
                    /**
                     * View left.
                     * @member {number} left
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.left = 0;
    
                    /**
                     * View top.
                     * @member {number} top
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.top = 0;
    
                    /**
                     * View width.
                     * @member {number} width
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.width = 0;
    
                    /**
                     * View height.
                     * @member {number} height
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.height = 0;
    
                    /**
                     * View scrollX.
                     * @member {number} scrollX
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.scrollX = 0;
    
                    /**
                     * View scrollY.
                     * @member {number} scrollY
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.scrollY = 0;
    
                    /**
                     * View translationX.
                     * @member {number} translationX
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.translationX = 0;
    
                    /**
                     * View translationY.
                     * @member {number} translationY
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.translationY = 0;
    
                    /**
                     * View scaleX.
                     * @member {number} scaleX
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.scaleX = 0;
    
                    /**
                     * View scaleY.
                     * @member {number} scaleY
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.scaleY = 0;
    
                    /**
                     * View alpha.
                     * @member {number} alpha
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.alpha = 0;
    
                    /**
                     * View willNotDraw.
                     * @member {boolean} willNotDraw
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.willNotDraw = false;
    
                    /**
                     * View clipChildren.
                     * @member {boolean} clipChildren
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.clipChildren = false;
    
                    /**
                     * View visibility.
                     * @member {number} visibility
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.visibility = 0;
    
                    /**
                     * View elevation.
                     * @member {number} elevation
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     */
                    View.prototype.elevation = 0;
    
                    /**
                     * Creates a new View instance using the specified properties.
                     * @function create
                     * @memberof perfetto.protos.ViewCapture.View
                     * @static
                     * @param {perfetto.protos.ViewCapture.IView=} [properties] Properties to set
                     * @returns {perfetto.protos.ViewCapture.View} View instance
                     */
                    View.create = function create(properties) {
                        return new View(properties);
                    };
    
                    /**
                     * Encodes the specified View message. Does not implicitly {@link perfetto.protos.ViewCapture.View.verify|verify} messages.
                     * @function encode
                     * @memberof perfetto.protos.ViewCapture.View
                     * @static
                     * @param {perfetto.protos.ViewCapture.IView} message View message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    View.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
                        if (message.parentId != null && Object.hasOwnProperty.call(message, "parentId"))
                            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.parentId);
                        if (message.hashcode != null && Object.hasOwnProperty.call(message, "hashcode"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.hashcode);
                        if (message.viewIdIid != null && Object.hasOwnProperty.call(message, "viewIdIid"))
                            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.viewIdIid);
                        if (message.classNameIid != null && Object.hasOwnProperty.call(message, "classNameIid"))
                            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.classNameIid);
                        if (message.left != null && Object.hasOwnProperty.call(message, "left"))
                            writer.uint32(/* id 6, wireType 0 =*/48).int32(message.left);
                        if (message.top != null && Object.hasOwnProperty.call(message, "top"))
                            writer.uint32(/* id 7, wireType 0 =*/56).int32(message.top);
                        if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                            writer.uint32(/* id 8, wireType 0 =*/64).int32(message.width);
                        if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                            writer.uint32(/* id 9, wireType 0 =*/72).int32(message.height);
                        if (message.scrollX != null && Object.hasOwnProperty.call(message, "scrollX"))
                            writer.uint32(/* id 10, wireType 0 =*/80).int32(message.scrollX);
                        if (message.scrollY != null && Object.hasOwnProperty.call(message, "scrollY"))
                            writer.uint32(/* id 11, wireType 0 =*/88).int32(message.scrollY);
                        if (message.translationX != null && Object.hasOwnProperty.call(message, "translationX"))
                            writer.uint32(/* id 12, wireType 5 =*/101).float(message.translationX);
                        if (message.translationY != null && Object.hasOwnProperty.call(message, "translationY"))
                            writer.uint32(/* id 13, wireType 5 =*/109).float(message.translationY);
                        if (message.scaleX != null && Object.hasOwnProperty.call(message, "scaleX"))
                            writer.uint32(/* id 14, wireType 5 =*/117).float(message.scaleX);
                        if (message.scaleY != null && Object.hasOwnProperty.call(message, "scaleY"))
                            writer.uint32(/* id 15, wireType 5 =*/125).float(message.scaleY);
                        if (message.alpha != null && Object.hasOwnProperty.call(message, "alpha"))
                            writer.uint32(/* id 16, wireType 5 =*/133).float(message.alpha);
                        if (message.willNotDraw != null && Object.hasOwnProperty.call(message, "willNotDraw"))
                            writer.uint32(/* id 17, wireType 0 =*/136).bool(message.willNotDraw);
                        if (message.clipChildren != null && Object.hasOwnProperty.call(message, "clipChildren"))
                            writer.uint32(/* id 18, wireType 0 =*/144).bool(message.clipChildren);
                        if (message.visibility != null && Object.hasOwnProperty.call(message, "visibility"))
                            writer.uint32(/* id 19, wireType 0 =*/152).int32(message.visibility);
                        if (message.elevation != null && Object.hasOwnProperty.call(message, "elevation"))
                            writer.uint32(/* id 20, wireType 5 =*/165).float(message.elevation);
                        return writer;
                    };
    
                    /**
                     * Encodes the specified View message, length delimited. Does not implicitly {@link perfetto.protos.ViewCapture.View.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof perfetto.protos.ViewCapture.View
                     * @static
                     * @param {perfetto.protos.ViewCapture.IView} message View message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    View.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a View message from the specified reader or buffer.
                     * @function decode
                     * @memberof perfetto.protos.ViewCapture.View
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {perfetto.protos.ViewCapture.View} View
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    View.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.ViewCapture.View();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1: {
                                    message.id = reader.int32();
                                    break;
                                }
                            case 2: {
                                    message.parentId = reader.int32();
                                    break;
                                }
                            case 3: {
                                    message.hashcode = reader.int32();
                                    break;
                                }
                            case 4: {
                                    message.viewIdIid = reader.int32();
                                    break;
                                }
                            case 5: {
                                    message.classNameIid = reader.int32();
                                    break;
                                }
                            case 6: {
                                    message.left = reader.int32();
                                    break;
                                }
                            case 7: {
                                    message.top = reader.int32();
                                    break;
                                }
                            case 8: {
                                    message.width = reader.int32();
                                    break;
                                }
                            case 9: {
                                    message.height = reader.int32();
                                    break;
                                }
                            case 10: {
                                    message.scrollX = reader.int32();
                                    break;
                                }
                            case 11: {
                                    message.scrollY = reader.int32();
                                    break;
                                }
                            case 12: {
                                    message.translationX = reader.float();
                                    break;
                                }
                            case 13: {
                                    message.translationY = reader.float();
                                    break;
                                }
                            case 14: {
                                    message.scaleX = reader.float();
                                    break;
                                }
                            case 15: {
                                    message.scaleY = reader.float();
                                    break;
                                }
                            case 16: {
                                    message.alpha = reader.float();
                                    break;
                                }
                            case 17: {
                                    message.willNotDraw = reader.bool();
                                    break;
                                }
                            case 18: {
                                    message.clipChildren = reader.bool();
                                    break;
                                }
                            case 19: {
                                    message.visibility = reader.int32();
                                    break;
                                }
                            case 20: {
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
                     * Decodes a View message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof perfetto.protos.ViewCapture.View
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {perfetto.protos.ViewCapture.View} View
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    View.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a View message.
                     * @function verify
                     * @memberof perfetto.protos.ViewCapture.View
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    View.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.id != null && message.hasOwnProperty("id"))
                            if (!$util.isInteger(message.id))
                                return "id: integer expected";
                        if (message.parentId != null && message.hasOwnProperty("parentId"))
                            if (!$util.isInteger(message.parentId))
                                return "parentId: integer expected";
                        if (message.hashcode != null && message.hasOwnProperty("hashcode"))
                            if (!$util.isInteger(message.hashcode))
                                return "hashcode: integer expected";
                        if (message.viewIdIid != null && message.hasOwnProperty("viewIdIid"))
                            if (!$util.isInteger(message.viewIdIid))
                                return "viewIdIid: integer expected";
                        if (message.classNameIid != null && message.hasOwnProperty("classNameIid"))
                            if (!$util.isInteger(message.classNameIid))
                                return "classNameIid: integer expected";
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
                     * Creates a View message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof perfetto.protos.ViewCapture.View
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {perfetto.protos.ViewCapture.View} View
                     */
                    View.fromObject = function fromObject(object) {
                        if (object instanceof $root.perfetto.protos.ViewCapture.View)
                            return object;
                        var message = new $root.perfetto.protos.ViewCapture.View();
                        if (object.id != null)
                            message.id = object.id | 0;
                        if (object.parentId != null)
                            message.parentId = object.parentId | 0;
                        if (object.hashcode != null)
                            message.hashcode = object.hashcode | 0;
                        if (object.viewIdIid != null)
                            message.viewIdIid = object.viewIdIid | 0;
                        if (object.classNameIid != null)
                            message.classNameIid = object.classNameIid | 0;
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
                     * Creates a plain object from a View message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof perfetto.protos.ViewCapture.View
                     * @static
                     * @param {perfetto.protos.ViewCapture.View} message View
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    View.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.id = 0;
                            object.parentId = 0;
                            object.hashcode = 0;
                            object.viewIdIid = 0;
                            object.classNameIid = 0;
                            object.left = 0;
                            object.top = 0;
                            object.width = 0;
                            object.height = 0;
                            object.scrollX = 0;
                            object.scrollY = 0;
                            object.translationX = 0;
                            object.translationY = 0;
                            object.scaleX = 0;
                            object.scaleY = 0;
                            object.alpha = 0;
                            object.willNotDraw = false;
                            object.clipChildren = false;
                            object.visibility = 0;
                            object.elevation = 0;
                        }
                        if (message.id != null && message.hasOwnProperty("id"))
                            object.id = message.id;
                        if (message.parentId != null && message.hasOwnProperty("parentId"))
                            object.parentId = message.parentId;
                        if (message.hashcode != null && message.hasOwnProperty("hashcode"))
                            object.hashcode = message.hashcode;
                        if (message.viewIdIid != null && message.hasOwnProperty("viewIdIid"))
                            object.viewIdIid = message.viewIdIid;
                        if (message.classNameIid != null && message.hasOwnProperty("classNameIid"))
                            object.classNameIid = message.classNameIid;
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
                     * Converts this View to JSON.
                     * @function toJSON
                     * @memberof perfetto.protos.ViewCapture.View
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    View.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    /**
                     * Gets the default type url for View
                     * @function getTypeUrl
                     * @memberof perfetto.protos.ViewCapture.View
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    View.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/perfetto.protos.ViewCapture.View";
                    };
    
                    return View;
                })();
    
                return ViewCapture;
            })();
    
            return protos;
        })();
    
        return perfetto;
    })();

    return $root;
});
