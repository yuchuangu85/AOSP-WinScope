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
    var $root = $protobuf.roots.surfaceflingerlatest || ($protobuf.roots.surfaceflingerlatest = {});
    
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
    
            protos.LayersTraceFileProto = (function() {
    
                /**
                 * Properties of a LayersTraceFileProto.
                 * @memberof perfetto.protos
                 * @interface ILayersTraceFileProto
                 * @property {Long|null} [magicNumber] LayersTraceFileProto magicNumber
                 * @property {Array.<perfetto.protos.ILayersSnapshotProto>|null} [entry] LayersTraceFileProto entry
                 * @property {Long|null} [realToElapsedTimeOffsetNanos] LayersTraceFileProto realToElapsedTimeOffsetNanos
                 */
    
                /**
                 * Constructs a new LayersTraceFileProto.
                 * @memberof perfetto.protos
                 * @classdesc Represents a LayersTraceFileProto.
                 * @implements ILayersTraceFileProto
                 * @constructor
                 * @param {perfetto.protos.ILayersTraceFileProto=} [properties] Properties to set
                 */
                function LayersTraceFileProto(properties) {
                    this.entry = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * LayersTraceFileProto magicNumber.
                 * @member {Long} magicNumber
                 * @memberof perfetto.protos.LayersTraceFileProto
                 * @instance
                 */
                LayersTraceFileProto.prototype.magicNumber = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * LayersTraceFileProto entry.
                 * @member {Array.<perfetto.protos.ILayersSnapshotProto>} entry
                 * @memberof perfetto.protos.LayersTraceFileProto
                 * @instance
                 */
                LayersTraceFileProto.prototype.entry = $util.emptyArray;
    
                /**
                 * LayersTraceFileProto realToElapsedTimeOffsetNanos.
                 * @member {Long} realToElapsedTimeOffsetNanos
                 * @memberof perfetto.protos.LayersTraceFileProto
                 * @instance
                 */
                LayersTraceFileProto.prototype.realToElapsedTimeOffsetNanos = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * Creates a new LayersTraceFileProto instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.LayersTraceFileProto
                 * @static
                 * @param {perfetto.protos.ILayersTraceFileProto=} [properties] Properties to set
                 * @returns {perfetto.protos.LayersTraceFileProto} LayersTraceFileProto instance
                 */
                LayersTraceFileProto.create = function create(properties) {
                    return new LayersTraceFileProto(properties);
                };
    
                /**
                 * Encodes the specified LayersTraceFileProto message. Does not implicitly {@link perfetto.protos.LayersTraceFileProto.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.LayersTraceFileProto
                 * @static
                 * @param {perfetto.protos.ILayersTraceFileProto} message LayersTraceFileProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LayersTraceFileProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.magicNumber != null && Object.hasOwnProperty.call(message, "magicNumber"))
                        writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.magicNumber);
                    if (message.entry != null && message.entry.length)
                        for (var i = 0; i < message.entry.length; ++i)
                            $root.perfetto.protos.LayersSnapshotProto.encode(message.entry[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    if (message.realToElapsedTimeOffsetNanos != null && Object.hasOwnProperty.call(message, "realToElapsedTimeOffsetNanos"))
                        writer.uint32(/* id 3, wireType 1 =*/25).fixed64(message.realToElapsedTimeOffsetNanos);
                    return writer;
                };
    
                /**
                 * Encodes the specified LayersTraceFileProto message, length delimited. Does not implicitly {@link perfetto.protos.LayersTraceFileProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.LayersTraceFileProto
                 * @static
                 * @param {perfetto.protos.ILayersTraceFileProto} message LayersTraceFileProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LayersTraceFileProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a LayersTraceFileProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.LayersTraceFileProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.LayersTraceFileProto} LayersTraceFileProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                LayersTraceFileProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.LayersTraceFileProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.magicNumber = reader.fixed64();
                                break;
                            }
                        case 2: {
                                if (!(message.entry && message.entry.length))
                                    message.entry = [];
                                message.entry.push($root.perfetto.protos.LayersSnapshotProto.decode(reader, reader.uint32()));
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
                    return message;
                };
    
                /**
                 * Decodes a LayersTraceFileProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.LayersTraceFileProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.LayersTraceFileProto} LayersTraceFileProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                LayersTraceFileProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a LayersTraceFileProto message.
                 * @function verify
                 * @memberof perfetto.protos.LayersTraceFileProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                LayersTraceFileProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.magicNumber != null && message.hasOwnProperty("magicNumber"))
                        if (!$util.isInteger(message.magicNumber) && !(message.magicNumber && $util.isInteger(message.magicNumber.low) && $util.isInteger(message.magicNumber.high)))
                            return "magicNumber: integer|Long expected";
                    if (message.entry != null && message.hasOwnProperty("entry")) {
                        if (!Array.isArray(message.entry))
                            return "entry: array expected";
                        for (var i = 0; i < message.entry.length; ++i) {
                            var error = $root.perfetto.protos.LayersSnapshotProto.verify(message.entry[i]);
                            if (error)
                                return "entry." + error;
                        }
                    }
                    if (message.realToElapsedTimeOffsetNanos != null && message.hasOwnProperty("realToElapsedTimeOffsetNanos"))
                        if (!$util.isInteger(message.realToElapsedTimeOffsetNanos) && !(message.realToElapsedTimeOffsetNanos && $util.isInteger(message.realToElapsedTimeOffsetNanos.low) && $util.isInteger(message.realToElapsedTimeOffsetNanos.high)))
                            return "realToElapsedTimeOffsetNanos: integer|Long expected";
                    return null;
                };
    
                /**
                 * Creates a LayersTraceFileProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.LayersTraceFileProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.LayersTraceFileProto} LayersTraceFileProto
                 */
                LayersTraceFileProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.LayersTraceFileProto)
                        return object;
                    var message = new $root.perfetto.protos.LayersTraceFileProto();
                    if (object.magicNumber != null)
                        if ($util.Long)
                            (message.magicNumber = $util.Long.fromValue(object.magicNumber)).unsigned = false;
                        else if (typeof object.magicNumber === "string")
                            message.magicNumber = parseInt(object.magicNumber, 10);
                        else if (typeof object.magicNumber === "number")
                            message.magicNumber = object.magicNumber;
                        else if (typeof object.magicNumber === "object")
                            message.magicNumber = new $util.LongBits(object.magicNumber.low >>> 0, object.magicNumber.high >>> 0).toNumber();
                    if (object.entry) {
                        if (!Array.isArray(object.entry))
                            throw TypeError(".perfetto.protos.LayersTraceFileProto.entry: array expected");
                        message.entry = [];
                        for (var i = 0; i < object.entry.length; ++i) {
                            if (typeof object.entry[i] !== "object")
                                throw TypeError(".perfetto.protos.LayersTraceFileProto.entry: object expected");
                            message.entry[i] = $root.perfetto.protos.LayersSnapshotProto.fromObject(object.entry[i]);
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
                 * Creates a plain object from a LayersTraceFileProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.LayersTraceFileProto
                 * @static
                 * @param {perfetto.protos.LayersTraceFileProto} message LayersTraceFileProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                LayersTraceFileProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.entry = [];
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
                    if (message.entry && message.entry.length) {
                        object.entry = [];
                        for (var j = 0; j < message.entry.length; ++j)
                            object.entry[j] = $root.perfetto.protos.LayersSnapshotProto.toObject(message.entry[j], options);
                    }
                    if (message.realToElapsedTimeOffsetNanos != null && message.hasOwnProperty("realToElapsedTimeOffsetNanos"))
                        if (typeof message.realToElapsedTimeOffsetNanos === "number")
                            object.realToElapsedTimeOffsetNanos = options.longs === String ? String(message.realToElapsedTimeOffsetNanos) : message.realToElapsedTimeOffsetNanos;
                        else
                            object.realToElapsedTimeOffsetNanos = options.longs === String ? $util.Long.prototype.toString.call(message.realToElapsedTimeOffsetNanos) : options.longs === Number ? new $util.LongBits(message.realToElapsedTimeOffsetNanos.low >>> 0, message.realToElapsedTimeOffsetNanos.high >>> 0).toNumber() : message.realToElapsedTimeOffsetNanos;
                    return object;
                };
    
                /**
                 * Converts this LayersTraceFileProto to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.LayersTraceFileProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                LayersTraceFileProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for LayersTraceFileProto
                 * @function getTypeUrl
                 * @memberof perfetto.protos.LayersTraceFileProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                LayersTraceFileProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.LayersTraceFileProto";
                };
    
                /**
                 * MagicNumber enum.
                 * @name perfetto.protos.LayersTraceFileProto.MagicNumber
                 * @enum {number}
                 * @property {number} INVALID=0 INVALID value
                 * @property {number} MAGIC_NUMBER_L=1414682956 MAGIC_NUMBER_L value
                 * @property {number} MAGIC_NUMBER_H=1162035538 MAGIC_NUMBER_H value
                 */
                LayersTraceFileProto.MagicNumber = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "INVALID"] = 0;
                    values[valuesById[1414682956] = "MAGIC_NUMBER_L"] = 1414682956;
                    values[valuesById[1162035538] = "MAGIC_NUMBER_H"] = 1162035538;
                    return values;
                })();
    
                return LayersTraceFileProto;
            })();
    
            protos.LayersSnapshotProto = (function() {
    
                /**
                 * Properties of a LayersSnapshotProto.
                 * @memberof perfetto.protos
                 * @interface ILayersSnapshotProto
                 * @property {Long|null} [elapsedRealtimeNanos] LayersSnapshotProto elapsedRealtimeNanos
                 * @property {string|null} [where] LayersSnapshotProto where
                 * @property {perfetto.protos.ILayersProto|null} [layers] LayersSnapshotProto layers
                 * @property {string|null} [hwcBlob] LayersSnapshotProto hwcBlob
                 * @property {boolean|null} [excludesCompositionState] LayersSnapshotProto excludesCompositionState
                 * @property {number|null} [missedEntries] LayersSnapshotProto missedEntries
                 * @property {Array.<perfetto.protos.IDisplayProto>|null} [displays] LayersSnapshotProto displays
                 * @property {Long|null} [vsyncId] LayersSnapshotProto vsyncId
                 */
    
                /**
                 * Constructs a new LayersSnapshotProto.
                 * @memberof perfetto.protos
                 * @classdesc Represents a LayersSnapshotProto.
                 * @implements ILayersSnapshotProto
                 * @constructor
                 * @param {perfetto.protos.ILayersSnapshotProto=} [properties] Properties to set
                 */
                function LayersSnapshotProto(properties) {
                    this.displays = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * LayersSnapshotProto elapsedRealtimeNanos.
                 * @member {Long} elapsedRealtimeNanos
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @instance
                 */
                LayersSnapshotProto.prototype.elapsedRealtimeNanos = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * LayersSnapshotProto where.
                 * @member {string} where
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @instance
                 */
                LayersSnapshotProto.prototype.where = "";
    
                /**
                 * LayersSnapshotProto layers.
                 * @member {perfetto.protos.ILayersProto|null|undefined} layers
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @instance
                 */
                LayersSnapshotProto.prototype.layers = null;
    
                /**
                 * LayersSnapshotProto hwcBlob.
                 * @member {string} hwcBlob
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @instance
                 */
                LayersSnapshotProto.prototype.hwcBlob = "";
    
                /**
                 * LayersSnapshotProto excludesCompositionState.
                 * @member {boolean} excludesCompositionState
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @instance
                 */
                LayersSnapshotProto.prototype.excludesCompositionState = false;
    
                /**
                 * LayersSnapshotProto missedEntries.
                 * @member {number} missedEntries
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @instance
                 */
                LayersSnapshotProto.prototype.missedEntries = 0;
    
                /**
                 * LayersSnapshotProto displays.
                 * @member {Array.<perfetto.protos.IDisplayProto>} displays
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @instance
                 */
                LayersSnapshotProto.prototype.displays = $util.emptyArray;
    
                /**
                 * LayersSnapshotProto vsyncId.
                 * @member {Long} vsyncId
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @instance
                 */
                LayersSnapshotProto.prototype.vsyncId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * Creates a new LayersSnapshotProto instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @static
                 * @param {perfetto.protos.ILayersSnapshotProto=} [properties] Properties to set
                 * @returns {perfetto.protos.LayersSnapshotProto} LayersSnapshotProto instance
                 */
                LayersSnapshotProto.create = function create(properties) {
                    return new LayersSnapshotProto(properties);
                };
    
                /**
                 * Encodes the specified LayersSnapshotProto message. Does not implicitly {@link perfetto.protos.LayersSnapshotProto.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @static
                 * @param {perfetto.protos.ILayersSnapshotProto} message LayersSnapshotProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LayersSnapshotProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.elapsedRealtimeNanos != null && Object.hasOwnProperty.call(message, "elapsedRealtimeNanos"))
                        writer.uint32(/* id 1, wireType 1 =*/9).sfixed64(message.elapsedRealtimeNanos);
                    if (message.where != null && Object.hasOwnProperty.call(message, "where"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.where);
                    if (message.layers != null && Object.hasOwnProperty.call(message, "layers"))
                        $root.perfetto.protos.LayersProto.encode(message.layers, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    if (message.hwcBlob != null && Object.hasOwnProperty.call(message, "hwcBlob"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.hwcBlob);
                    if (message.excludesCompositionState != null && Object.hasOwnProperty.call(message, "excludesCompositionState"))
                        writer.uint32(/* id 5, wireType 0 =*/40).bool(message.excludesCompositionState);
                    if (message.missedEntries != null && Object.hasOwnProperty.call(message, "missedEntries"))
                        writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.missedEntries);
                    if (message.displays != null && message.displays.length)
                        for (var i = 0; i < message.displays.length; ++i)
                            $root.perfetto.protos.DisplayProto.encode(message.displays[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                    if (message.vsyncId != null && Object.hasOwnProperty.call(message, "vsyncId"))
                        writer.uint32(/* id 8, wireType 0 =*/64).int64(message.vsyncId);
                    return writer;
                };
    
                /**
                 * Encodes the specified LayersSnapshotProto message, length delimited. Does not implicitly {@link perfetto.protos.LayersSnapshotProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @static
                 * @param {perfetto.protos.ILayersSnapshotProto} message LayersSnapshotProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LayersSnapshotProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a LayersSnapshotProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.LayersSnapshotProto} LayersSnapshotProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                LayersSnapshotProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.LayersSnapshotProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.elapsedRealtimeNanos = reader.sfixed64();
                                break;
                            }
                        case 2: {
                                message.where = reader.string();
                                break;
                            }
                        case 3: {
                                message.layers = $root.perfetto.protos.LayersProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 4: {
                                message.hwcBlob = reader.string();
                                break;
                            }
                        case 5: {
                                message.excludesCompositionState = reader.bool();
                                break;
                            }
                        case 6: {
                                message.missedEntries = reader.uint32();
                                break;
                            }
                        case 7: {
                                if (!(message.displays && message.displays.length))
                                    message.displays = [];
                                message.displays.push($root.perfetto.protos.DisplayProto.decode(reader, reader.uint32()));
                                break;
                            }
                        case 8: {
                                message.vsyncId = reader.int64();
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
                 * Decodes a LayersSnapshotProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.LayersSnapshotProto} LayersSnapshotProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                LayersSnapshotProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a LayersSnapshotProto message.
                 * @function verify
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                LayersSnapshotProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.elapsedRealtimeNanos != null && message.hasOwnProperty("elapsedRealtimeNanos"))
                        if (!$util.isInteger(message.elapsedRealtimeNanos) && !(message.elapsedRealtimeNanos && $util.isInteger(message.elapsedRealtimeNanos.low) && $util.isInteger(message.elapsedRealtimeNanos.high)))
                            return "elapsedRealtimeNanos: integer|Long expected";
                    if (message.where != null && message.hasOwnProperty("where"))
                        if (!$util.isString(message.where))
                            return "where: string expected";
                    if (message.layers != null && message.hasOwnProperty("layers")) {
                        var error = $root.perfetto.protos.LayersProto.verify(message.layers);
                        if (error)
                            return "layers." + error;
                    }
                    if (message.hwcBlob != null && message.hasOwnProperty("hwcBlob"))
                        if (!$util.isString(message.hwcBlob))
                            return "hwcBlob: string expected";
                    if (message.excludesCompositionState != null && message.hasOwnProperty("excludesCompositionState"))
                        if (typeof message.excludesCompositionState !== "boolean")
                            return "excludesCompositionState: boolean expected";
                    if (message.missedEntries != null && message.hasOwnProperty("missedEntries"))
                        if (!$util.isInteger(message.missedEntries))
                            return "missedEntries: integer expected";
                    if (message.displays != null && message.hasOwnProperty("displays")) {
                        if (!Array.isArray(message.displays))
                            return "displays: array expected";
                        for (var i = 0; i < message.displays.length; ++i) {
                            var error = $root.perfetto.protos.DisplayProto.verify(message.displays[i]);
                            if (error)
                                return "displays." + error;
                        }
                    }
                    if (message.vsyncId != null && message.hasOwnProperty("vsyncId"))
                        if (!$util.isInteger(message.vsyncId) && !(message.vsyncId && $util.isInteger(message.vsyncId.low) && $util.isInteger(message.vsyncId.high)))
                            return "vsyncId: integer|Long expected";
                    return null;
                };
    
                /**
                 * Creates a LayersSnapshotProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.LayersSnapshotProto} LayersSnapshotProto
                 */
                LayersSnapshotProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.LayersSnapshotProto)
                        return object;
                    var message = new $root.perfetto.protos.LayersSnapshotProto();
                    if (object.elapsedRealtimeNanos != null)
                        if ($util.Long)
                            (message.elapsedRealtimeNanos = $util.Long.fromValue(object.elapsedRealtimeNanos)).unsigned = false;
                        else if (typeof object.elapsedRealtimeNanos === "string")
                            message.elapsedRealtimeNanos = parseInt(object.elapsedRealtimeNanos, 10);
                        else if (typeof object.elapsedRealtimeNanos === "number")
                            message.elapsedRealtimeNanos = object.elapsedRealtimeNanos;
                        else if (typeof object.elapsedRealtimeNanos === "object")
                            message.elapsedRealtimeNanos = new $util.LongBits(object.elapsedRealtimeNanos.low >>> 0, object.elapsedRealtimeNanos.high >>> 0).toNumber();
                    if (object.where != null)
                        message.where = String(object.where);
                    if (object.layers != null) {
                        if (typeof object.layers !== "object")
                            throw TypeError(".perfetto.protos.LayersSnapshotProto.layers: object expected");
                        message.layers = $root.perfetto.protos.LayersProto.fromObject(object.layers);
                    }
                    if (object.hwcBlob != null)
                        message.hwcBlob = String(object.hwcBlob);
                    if (object.excludesCompositionState != null)
                        message.excludesCompositionState = Boolean(object.excludesCompositionState);
                    if (object.missedEntries != null)
                        message.missedEntries = object.missedEntries >>> 0;
                    if (object.displays) {
                        if (!Array.isArray(object.displays))
                            throw TypeError(".perfetto.protos.LayersSnapshotProto.displays: array expected");
                        message.displays = [];
                        for (var i = 0; i < object.displays.length; ++i) {
                            if (typeof object.displays[i] !== "object")
                                throw TypeError(".perfetto.protos.LayersSnapshotProto.displays: object expected");
                            message.displays[i] = $root.perfetto.protos.DisplayProto.fromObject(object.displays[i]);
                        }
                    }
                    if (object.vsyncId != null)
                        if ($util.Long)
                            (message.vsyncId = $util.Long.fromValue(object.vsyncId)).unsigned = false;
                        else if (typeof object.vsyncId === "string")
                            message.vsyncId = parseInt(object.vsyncId, 10);
                        else if (typeof object.vsyncId === "number")
                            message.vsyncId = object.vsyncId;
                        else if (typeof object.vsyncId === "object")
                            message.vsyncId = new $util.LongBits(object.vsyncId.low >>> 0, object.vsyncId.high >>> 0).toNumber();
                    return message;
                };
    
                /**
                 * Creates a plain object from a LayersSnapshotProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @static
                 * @param {perfetto.protos.LayersSnapshotProto} message LayersSnapshotProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                LayersSnapshotProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.displays = [];
                    if (options.defaults) {
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.elapsedRealtimeNanos = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.elapsedRealtimeNanos = options.longs === String ? "0" : 0;
                        object.where = "";
                        object.layers = null;
                        object.hwcBlob = "";
                        object.excludesCompositionState = false;
                        object.missedEntries = 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.vsyncId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.vsyncId = options.longs === String ? "0" : 0;
                    }
                    if (message.elapsedRealtimeNanos != null && message.hasOwnProperty("elapsedRealtimeNanos"))
                        if (typeof message.elapsedRealtimeNanos === "number")
                            object.elapsedRealtimeNanos = options.longs === String ? String(message.elapsedRealtimeNanos) : message.elapsedRealtimeNanos;
                        else
                            object.elapsedRealtimeNanos = options.longs === String ? $util.Long.prototype.toString.call(message.elapsedRealtimeNanos) : options.longs === Number ? new $util.LongBits(message.elapsedRealtimeNanos.low >>> 0, message.elapsedRealtimeNanos.high >>> 0).toNumber() : message.elapsedRealtimeNanos;
                    if (message.where != null && message.hasOwnProperty("where"))
                        object.where = message.where;
                    if (message.layers != null && message.hasOwnProperty("layers"))
                        object.layers = $root.perfetto.protos.LayersProto.toObject(message.layers, options);
                    if (message.hwcBlob != null && message.hasOwnProperty("hwcBlob"))
                        object.hwcBlob = message.hwcBlob;
                    if (message.excludesCompositionState != null && message.hasOwnProperty("excludesCompositionState"))
                        object.excludesCompositionState = message.excludesCompositionState;
                    if (message.missedEntries != null && message.hasOwnProperty("missedEntries"))
                        object.missedEntries = message.missedEntries;
                    if (message.displays && message.displays.length) {
                        object.displays = [];
                        for (var j = 0; j < message.displays.length; ++j)
                            object.displays[j] = $root.perfetto.protos.DisplayProto.toObject(message.displays[j], options);
                    }
                    if (message.vsyncId != null && message.hasOwnProperty("vsyncId"))
                        if (typeof message.vsyncId === "number")
                            object.vsyncId = options.longs === String ? String(message.vsyncId) : message.vsyncId;
                        else
                            object.vsyncId = options.longs === String ? $util.Long.prototype.toString.call(message.vsyncId) : options.longs === Number ? new $util.LongBits(message.vsyncId.low >>> 0, message.vsyncId.high >>> 0).toNumber() : message.vsyncId;
                    return object;
                };
    
                /**
                 * Converts this LayersSnapshotProto to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                LayersSnapshotProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for LayersSnapshotProto
                 * @function getTypeUrl
                 * @memberof perfetto.protos.LayersSnapshotProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                LayersSnapshotProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.LayersSnapshotProto";
                };
    
                return LayersSnapshotProto;
            })();
    
            protos.LayersProto = (function() {
    
                /**
                 * Properties of a LayersProto.
                 * @memberof perfetto.protos
                 * @interface ILayersProto
                 * @property {Array.<perfetto.protos.ILayerProto>|null} [layers] LayersProto layers
                 */
    
                /**
                 * Constructs a new LayersProto.
                 * @memberof perfetto.protos
                 * @classdesc Represents a LayersProto.
                 * @implements ILayersProto
                 * @constructor
                 * @param {perfetto.protos.ILayersProto=} [properties] Properties to set
                 */
                function LayersProto(properties) {
                    this.layers = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * LayersProto layers.
                 * @member {Array.<perfetto.protos.ILayerProto>} layers
                 * @memberof perfetto.protos.LayersProto
                 * @instance
                 */
                LayersProto.prototype.layers = $util.emptyArray;
    
                /**
                 * Creates a new LayersProto instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.LayersProto
                 * @static
                 * @param {perfetto.protos.ILayersProto=} [properties] Properties to set
                 * @returns {perfetto.protos.LayersProto} LayersProto instance
                 */
                LayersProto.create = function create(properties) {
                    return new LayersProto(properties);
                };
    
                /**
                 * Encodes the specified LayersProto message. Does not implicitly {@link perfetto.protos.LayersProto.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.LayersProto
                 * @static
                 * @param {perfetto.protos.ILayersProto} message LayersProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LayersProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.layers != null && message.layers.length)
                        for (var i = 0; i < message.layers.length; ++i)
                            $root.perfetto.protos.LayerProto.encode(message.layers[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified LayersProto message, length delimited. Does not implicitly {@link perfetto.protos.LayersProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.LayersProto
                 * @static
                 * @param {perfetto.protos.ILayersProto} message LayersProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LayersProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a LayersProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.LayersProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.LayersProto} LayersProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                LayersProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.LayersProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                if (!(message.layers && message.layers.length))
                                    message.layers = [];
                                message.layers.push($root.perfetto.protos.LayerProto.decode(reader, reader.uint32()));
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
                 * Decodes a LayersProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.LayersProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.LayersProto} LayersProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                LayersProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a LayersProto message.
                 * @function verify
                 * @memberof perfetto.protos.LayersProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                LayersProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.layers != null && message.hasOwnProperty("layers")) {
                        if (!Array.isArray(message.layers))
                            return "layers: array expected";
                        for (var i = 0; i < message.layers.length; ++i) {
                            var error = $root.perfetto.protos.LayerProto.verify(message.layers[i]);
                            if (error)
                                return "layers." + error;
                        }
                    }
                    return null;
                };
    
                /**
                 * Creates a LayersProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.LayersProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.LayersProto} LayersProto
                 */
                LayersProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.LayersProto)
                        return object;
                    var message = new $root.perfetto.protos.LayersProto();
                    if (object.layers) {
                        if (!Array.isArray(object.layers))
                            throw TypeError(".perfetto.protos.LayersProto.layers: array expected");
                        message.layers = [];
                        for (var i = 0; i < object.layers.length; ++i) {
                            if (typeof object.layers[i] !== "object")
                                throw TypeError(".perfetto.protos.LayersProto.layers: object expected");
                            message.layers[i] = $root.perfetto.protos.LayerProto.fromObject(object.layers[i]);
                        }
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from a LayersProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.LayersProto
                 * @static
                 * @param {perfetto.protos.LayersProto} message LayersProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                LayersProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.layers = [];
                    if (message.layers && message.layers.length) {
                        object.layers = [];
                        for (var j = 0; j < message.layers.length; ++j)
                            object.layers[j] = $root.perfetto.protos.LayerProto.toObject(message.layers[j], options);
                    }
                    return object;
                };
    
                /**
                 * Converts this LayersProto to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.LayersProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                LayersProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for LayersProto
                 * @function getTypeUrl
                 * @memberof perfetto.protos.LayersProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                LayersProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.LayersProto";
                };
    
                return LayersProto;
            })();
    
            protos.DisplayProto = (function() {
    
                /**
                 * Properties of a DisplayProto.
                 * @memberof perfetto.protos
                 * @interface IDisplayProto
                 * @property {Long|null} [id] DisplayProto id
                 * @property {string|null} [name] DisplayProto name
                 * @property {number|null} [layerStack] DisplayProto layerStack
                 * @property {perfetto.protos.ISizeProto|null} [size] DisplayProto size
                 * @property {perfetto.protos.IRectProto|null} [layerStackSpaceRect] DisplayProto layerStackSpaceRect
                 * @property {perfetto.protos.ITransformProto|null} [transform] DisplayProto transform
                 * @property {boolean|null} [isVirtual] DisplayProto isVirtual
                 * @property {number|null} [dpiX] DisplayProto dpiX
                 * @property {number|null} [dpiY] DisplayProto dpiY
                 */
    
                /**
                 * Constructs a new DisplayProto.
                 * @memberof perfetto.protos
                 * @classdesc Represents a DisplayProto.
                 * @implements IDisplayProto
                 * @constructor
                 * @param {perfetto.protos.IDisplayProto=} [properties] Properties to set
                 */
                function DisplayProto(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * DisplayProto id.
                 * @member {Long} id
                 * @memberof perfetto.protos.DisplayProto
                 * @instance
                 */
                DisplayProto.prototype.id = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                /**
                 * DisplayProto name.
                 * @member {string} name
                 * @memberof perfetto.protos.DisplayProto
                 * @instance
                 */
                DisplayProto.prototype.name = "";
    
                /**
                 * DisplayProto layerStack.
                 * @member {number} layerStack
                 * @memberof perfetto.protos.DisplayProto
                 * @instance
                 */
                DisplayProto.prototype.layerStack = 0;
    
                /**
                 * DisplayProto size.
                 * @member {perfetto.protos.ISizeProto|null|undefined} size
                 * @memberof perfetto.protos.DisplayProto
                 * @instance
                 */
                DisplayProto.prototype.size = null;
    
                /**
                 * DisplayProto layerStackSpaceRect.
                 * @member {perfetto.protos.IRectProto|null|undefined} layerStackSpaceRect
                 * @memberof perfetto.protos.DisplayProto
                 * @instance
                 */
                DisplayProto.prototype.layerStackSpaceRect = null;
    
                /**
                 * DisplayProto transform.
                 * @member {perfetto.protos.ITransformProto|null|undefined} transform
                 * @memberof perfetto.protos.DisplayProto
                 * @instance
                 */
                DisplayProto.prototype.transform = null;
    
                /**
                 * DisplayProto isVirtual.
                 * @member {boolean} isVirtual
                 * @memberof perfetto.protos.DisplayProto
                 * @instance
                 */
                DisplayProto.prototype.isVirtual = false;
    
                /**
                 * DisplayProto dpiX.
                 * @member {number} dpiX
                 * @memberof perfetto.protos.DisplayProto
                 * @instance
                 */
                DisplayProto.prototype.dpiX = 0;
    
                /**
                 * DisplayProto dpiY.
                 * @member {number} dpiY
                 * @memberof perfetto.protos.DisplayProto
                 * @instance
                 */
                DisplayProto.prototype.dpiY = 0;
    
                /**
                 * Creates a new DisplayProto instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.DisplayProto
                 * @static
                 * @param {perfetto.protos.IDisplayProto=} [properties] Properties to set
                 * @returns {perfetto.protos.DisplayProto} DisplayProto instance
                 */
                DisplayProto.create = function create(properties) {
                    return new DisplayProto(properties);
                };
    
                /**
                 * Encodes the specified DisplayProto message. Does not implicitly {@link perfetto.protos.DisplayProto.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.DisplayProto
                 * @static
                 * @param {perfetto.protos.IDisplayProto} message DisplayProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DisplayProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.id);
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                    if (message.layerStack != null && Object.hasOwnProperty.call(message, "layerStack"))
                        writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.layerStack);
                    if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                        $root.perfetto.protos.SizeProto.encode(message.size, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    if (message.layerStackSpaceRect != null && Object.hasOwnProperty.call(message, "layerStackSpaceRect"))
                        $root.perfetto.protos.RectProto.encode(message.layerStackSpaceRect, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                    if (message.transform != null && Object.hasOwnProperty.call(message, "transform"))
                        $root.perfetto.protos.TransformProto.encode(message.transform, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                    if (message.isVirtual != null && Object.hasOwnProperty.call(message, "isVirtual"))
                        writer.uint32(/* id 7, wireType 0 =*/56).bool(message.isVirtual);
                    if (message.dpiX != null && Object.hasOwnProperty.call(message, "dpiX"))
                        writer.uint32(/* id 8, wireType 1 =*/65).double(message.dpiX);
                    if (message.dpiY != null && Object.hasOwnProperty.call(message, "dpiY"))
                        writer.uint32(/* id 9, wireType 1 =*/73).double(message.dpiY);
                    return writer;
                };
    
                /**
                 * Encodes the specified DisplayProto message, length delimited. Does not implicitly {@link perfetto.protos.DisplayProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.DisplayProto
                 * @static
                 * @param {perfetto.protos.IDisplayProto} message DisplayProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DisplayProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a DisplayProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.DisplayProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.DisplayProto} DisplayProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                DisplayProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.DisplayProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.id = reader.uint64();
                                break;
                            }
                        case 2: {
                                message.name = reader.string();
                                break;
                            }
                        case 3: {
                                message.layerStack = reader.uint32();
                                break;
                            }
                        case 4: {
                                message.size = $root.perfetto.protos.SizeProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 5: {
                                message.layerStackSpaceRect = $root.perfetto.protos.RectProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 6: {
                                message.transform = $root.perfetto.protos.TransformProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 7: {
                                message.isVirtual = reader.bool();
                                break;
                            }
                        case 8: {
                                message.dpiX = reader.double();
                                break;
                            }
                        case 9: {
                                message.dpiY = reader.double();
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
                 * Decodes a DisplayProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.DisplayProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.DisplayProto} DisplayProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                DisplayProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a DisplayProto message.
                 * @function verify
                 * @memberof perfetto.protos.DisplayProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                DisplayProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                            return "id: integer|Long expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.layerStack != null && message.hasOwnProperty("layerStack"))
                        if (!$util.isInteger(message.layerStack))
                            return "layerStack: integer expected";
                    if (message.size != null && message.hasOwnProperty("size")) {
                        var error = $root.perfetto.protos.SizeProto.verify(message.size);
                        if (error)
                            return "size." + error;
                    }
                    if (message.layerStackSpaceRect != null && message.hasOwnProperty("layerStackSpaceRect")) {
                        var error = $root.perfetto.protos.RectProto.verify(message.layerStackSpaceRect);
                        if (error)
                            return "layerStackSpaceRect." + error;
                    }
                    if (message.transform != null && message.hasOwnProperty("transform")) {
                        var error = $root.perfetto.protos.TransformProto.verify(message.transform);
                        if (error)
                            return "transform." + error;
                    }
                    if (message.isVirtual != null && message.hasOwnProperty("isVirtual"))
                        if (typeof message.isVirtual !== "boolean")
                            return "isVirtual: boolean expected";
                    if (message.dpiX != null && message.hasOwnProperty("dpiX"))
                        if (typeof message.dpiX !== "number")
                            return "dpiX: number expected";
                    if (message.dpiY != null && message.hasOwnProperty("dpiY"))
                        if (typeof message.dpiY !== "number")
                            return "dpiY: number expected";
                    return null;
                };
    
                /**
                 * Creates a DisplayProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.DisplayProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.DisplayProto} DisplayProto
                 */
                DisplayProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.DisplayProto)
                        return object;
                    var message = new $root.perfetto.protos.DisplayProto();
                    if (object.id != null)
                        if ($util.Long)
                            (message.id = $util.Long.fromValue(object.id)).unsigned = true;
                        else if (typeof object.id === "string")
                            message.id = parseInt(object.id, 10);
                        else if (typeof object.id === "number")
                            message.id = object.id;
                        else if (typeof object.id === "object")
                            message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber(true);
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.layerStack != null)
                        message.layerStack = object.layerStack >>> 0;
                    if (object.size != null) {
                        if (typeof object.size !== "object")
                            throw TypeError(".perfetto.protos.DisplayProto.size: object expected");
                        message.size = $root.perfetto.protos.SizeProto.fromObject(object.size);
                    }
                    if (object.layerStackSpaceRect != null) {
                        if (typeof object.layerStackSpaceRect !== "object")
                            throw TypeError(".perfetto.protos.DisplayProto.layerStackSpaceRect: object expected");
                        message.layerStackSpaceRect = $root.perfetto.protos.RectProto.fromObject(object.layerStackSpaceRect);
                    }
                    if (object.transform != null) {
                        if (typeof object.transform !== "object")
                            throw TypeError(".perfetto.protos.DisplayProto.transform: object expected");
                        message.transform = $root.perfetto.protos.TransformProto.fromObject(object.transform);
                    }
                    if (object.isVirtual != null)
                        message.isVirtual = Boolean(object.isVirtual);
                    if (object.dpiX != null)
                        message.dpiX = Number(object.dpiX);
                    if (object.dpiY != null)
                        message.dpiY = Number(object.dpiY);
                    return message;
                };
    
                /**
                 * Creates a plain object from a DisplayProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.DisplayProto
                 * @static
                 * @param {perfetto.protos.DisplayProto} message DisplayProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                DisplayProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.id = options.longs === String ? "0" : 0;
                        object.name = "";
                        object.layerStack = 0;
                        object.size = null;
                        object.layerStackSpaceRect = null;
                        object.transform = null;
                        object.isVirtual = false;
                        object.dpiX = 0;
                        object.dpiY = 0;
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (typeof message.id === "number")
                            object.id = options.longs === String ? String(message.id) : message.id;
                        else
                            object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber(true) : message.id;
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.layerStack != null && message.hasOwnProperty("layerStack"))
                        object.layerStack = message.layerStack;
                    if (message.size != null && message.hasOwnProperty("size"))
                        object.size = $root.perfetto.protos.SizeProto.toObject(message.size, options);
                    if (message.layerStackSpaceRect != null && message.hasOwnProperty("layerStackSpaceRect"))
                        object.layerStackSpaceRect = $root.perfetto.protos.RectProto.toObject(message.layerStackSpaceRect, options);
                    if (message.transform != null && message.hasOwnProperty("transform"))
                        object.transform = $root.perfetto.protos.TransformProto.toObject(message.transform, options);
                    if (message.isVirtual != null && message.hasOwnProperty("isVirtual"))
                        object.isVirtual = message.isVirtual;
                    if (message.dpiX != null && message.hasOwnProperty("dpiX"))
                        object.dpiX = options.json && !isFinite(message.dpiX) ? String(message.dpiX) : message.dpiX;
                    if (message.dpiY != null && message.hasOwnProperty("dpiY"))
                        object.dpiY = options.json && !isFinite(message.dpiY) ? String(message.dpiY) : message.dpiY;
                    return object;
                };
    
                /**
                 * Converts this DisplayProto to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.DisplayProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                DisplayProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for DisplayProto
                 * @function getTypeUrl
                 * @memberof perfetto.protos.DisplayProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                DisplayProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.DisplayProto";
                };
    
                return DisplayProto;
            })();
    
            /**
             * HwcCompositionType enum.
             * @name perfetto.protos.HwcCompositionType
             * @enum {number}
             * @property {number} HWC_TYPE_UNSPECIFIED=0 HWC_TYPE_UNSPECIFIED value
             * @property {number} HWC_TYPE_CLIENT=1 HWC_TYPE_CLIENT value
             * @property {number} HWC_TYPE_DEVICE=2 HWC_TYPE_DEVICE value
             * @property {number} HWC_TYPE_SOLID_COLOR=3 HWC_TYPE_SOLID_COLOR value
             * @property {number} HWC_TYPE_CURSOR=4 HWC_TYPE_CURSOR value
             * @property {number} HWC_TYPE_SIDEBAND=5 HWC_TYPE_SIDEBAND value
             * @property {number} HWC_TYPE_DISPLAY_DECORATION=6 HWC_TYPE_DISPLAY_DECORATION value
             */
            protos.HwcCompositionType = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "HWC_TYPE_UNSPECIFIED"] = 0;
                values[valuesById[1] = "HWC_TYPE_CLIENT"] = 1;
                values[valuesById[2] = "HWC_TYPE_DEVICE"] = 2;
                values[valuesById[3] = "HWC_TYPE_SOLID_COLOR"] = 3;
                values[valuesById[4] = "HWC_TYPE_CURSOR"] = 4;
                values[valuesById[5] = "HWC_TYPE_SIDEBAND"] = 5;
                values[valuesById[6] = "HWC_TYPE_DISPLAY_DECORATION"] = 6;
                return values;
            })();
    
            protos.LayerProto = (function() {
    
                /**
                 * Properties of a LayerProto.
                 * @memberof perfetto.protos
                 * @interface ILayerProto
                 * @property {number|null} [id] LayerProto id
                 * @property {string|null} [name] LayerProto name
                 * @property {Array.<number>|null} [children] LayerProto children
                 * @property {Array.<number>|null} [relatives] LayerProto relatives
                 * @property {string|null} [type] LayerProto type
                 * @property {perfetto.protos.IRegionProto|null} [transparentRegion] LayerProto transparentRegion
                 * @property {perfetto.protos.IRegionProto|null} [visibleRegion] LayerProto visibleRegion
                 * @property {perfetto.protos.IRegionProto|null} [damageRegion] LayerProto damageRegion
                 * @property {number|null} [layerStack] LayerProto layerStack
                 * @property {number|null} [z] LayerProto z
                 * @property {perfetto.protos.IPositionProto|null} [position] LayerProto position
                 * @property {perfetto.protos.IPositionProto|null} [requestedPosition] LayerProto requestedPosition
                 * @property {perfetto.protos.ISizeProto|null} [size] LayerProto size
                 * @property {perfetto.protos.IRectProto|null} [crop] LayerProto crop
                 * @property {perfetto.protos.IRectProto|null} [finalCrop] LayerProto finalCrop
                 * @property {boolean|null} [isOpaque] LayerProto isOpaque
                 * @property {boolean|null} [invalidate] LayerProto invalidate
                 * @property {string|null} [dataspace] LayerProto dataspace
                 * @property {string|null} [pixelFormat] LayerProto pixelFormat
                 * @property {perfetto.protos.IColorProto|null} [color] LayerProto color
                 * @property {perfetto.protos.IColorProto|null} [requestedColor] LayerProto requestedColor
                 * @property {number|null} [flags] LayerProto flags
                 * @property {perfetto.protos.ITransformProto|null} [transform] LayerProto transform
                 * @property {perfetto.protos.ITransformProto|null} [requestedTransform] LayerProto requestedTransform
                 * @property {number|null} [parent] LayerProto parent
                 * @property {number|null} [zOrderRelativeOf] LayerProto zOrderRelativeOf
                 * @property {perfetto.protos.IActiveBufferProto|null} [activeBuffer] LayerProto activeBuffer
                 * @property {number|null} [queuedFrames] LayerProto queuedFrames
                 * @property {boolean|null} [refreshPending] LayerProto refreshPending
                 * @property {perfetto.protos.IRectProto|null} [hwcFrame] LayerProto hwcFrame
                 * @property {perfetto.protos.IFloatRectProto|null} [hwcCrop] LayerProto hwcCrop
                 * @property {number|null} [hwcTransform] LayerProto hwcTransform
                 * @property {number|null} [windowType] LayerProto windowType
                 * @property {number|null} [appId] LayerProto appId
                 * @property {perfetto.protos.HwcCompositionType|null} [hwcCompositionType] LayerProto hwcCompositionType
                 * @property {boolean|null} [isProtected] LayerProto isProtected
                 * @property {Long|null} [currFrame] LayerProto currFrame
                 * @property {Array.<perfetto.protos.IBarrierLayerProto>|null} [barrierLayer] LayerProto barrierLayer
                 * @property {perfetto.protos.ITransformProto|null} [bufferTransform] LayerProto bufferTransform
                 * @property {number|null} [effectiveScalingMode] LayerProto effectiveScalingMode
                 * @property {number|null} [cornerRadius] LayerProto cornerRadius
                 * @property {Object.<string,string>|null} [metadata] LayerProto metadata
                 * @property {perfetto.protos.ITransformProto|null} [effectiveTransform] LayerProto effectiveTransform
                 * @property {perfetto.protos.IFloatRectProto|null} [sourceBounds] LayerProto sourceBounds
                 * @property {perfetto.protos.IFloatRectProto|null} [bounds] LayerProto bounds
                 * @property {perfetto.protos.IFloatRectProto|null} [screenBounds] LayerProto screenBounds
                 * @property {perfetto.protos.IInputWindowInfoProto|null} [inputWindowInfo] LayerProto inputWindowInfo
                 * @property {perfetto.protos.IFloatRectProto|null} [cornerRadiusCrop] LayerProto cornerRadiusCrop
                 * @property {number|null} [shadowRadius] LayerProto shadowRadius
                 * @property {perfetto.protos.IColorTransformProto|null} [colorTransform] LayerProto colorTransform
                 * @property {boolean|null} [isRelativeOf] LayerProto isRelativeOf
                 * @property {number|null} [backgroundBlurRadius] LayerProto backgroundBlurRadius
                 * @property {number|null} [ownerUid] LayerProto ownerUid
                 * @property {Array.<perfetto.protos.IBlurRegion>|null} [blurRegions] LayerProto blurRegions
                 * @property {boolean|null} [isTrustedOverlay] LayerProto isTrustedOverlay
                 * @property {number|null} [requestedCornerRadius] LayerProto requestedCornerRadius
                 * @property {perfetto.protos.IRectProto|null} [destinationFrame] LayerProto destinationFrame
                 * @property {number|null} [originalId] LayerProto originalId
                 * @property {perfetto.protos.TrustedOverlay|null} [trustedOverlay] LayerProto trustedOverlay
                 */
    
                /**
                 * Constructs a new LayerProto.
                 * @memberof perfetto.protos
                 * @classdesc Represents a LayerProto.
                 * @implements ILayerProto
                 * @constructor
                 * @param {perfetto.protos.ILayerProto=} [properties] Properties to set
                 */
                function LayerProto(properties) {
                    this.children = [];
                    this.relatives = [];
                    this.barrierLayer = [];
                    this.metadata = {};
                    this.blurRegions = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * LayerProto id.
                 * @member {number} id
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.id = 0;
    
                /**
                 * LayerProto name.
                 * @member {string} name
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.name = "";
    
                /**
                 * LayerProto children.
                 * @member {Array.<number>} children
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.children = $util.emptyArray;
    
                /**
                 * LayerProto relatives.
                 * @member {Array.<number>} relatives
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.relatives = $util.emptyArray;
    
                /**
                 * LayerProto type.
                 * @member {string} type
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.type = "";
    
                /**
                 * LayerProto transparentRegion.
                 * @member {perfetto.protos.IRegionProto|null|undefined} transparentRegion
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.transparentRegion = null;
    
                /**
                 * LayerProto visibleRegion.
                 * @member {perfetto.protos.IRegionProto|null|undefined} visibleRegion
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.visibleRegion = null;
    
                /**
                 * LayerProto damageRegion.
                 * @member {perfetto.protos.IRegionProto|null|undefined} damageRegion
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.damageRegion = null;
    
                /**
                 * LayerProto layerStack.
                 * @member {number} layerStack
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.layerStack = 0;
    
                /**
                 * LayerProto z.
                 * @member {number} z
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.z = 0;
    
                /**
                 * LayerProto position.
                 * @member {perfetto.protos.IPositionProto|null|undefined} position
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.position = null;
    
                /**
                 * LayerProto requestedPosition.
                 * @member {perfetto.protos.IPositionProto|null|undefined} requestedPosition
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.requestedPosition = null;
    
                /**
                 * LayerProto size.
                 * @member {perfetto.protos.ISizeProto|null|undefined} size
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.size = null;
    
                /**
                 * LayerProto crop.
                 * @member {perfetto.protos.IRectProto|null|undefined} crop
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.crop = null;
    
                /**
                 * LayerProto finalCrop.
                 * @member {perfetto.protos.IRectProto|null|undefined} finalCrop
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.finalCrop = null;
    
                /**
                 * LayerProto isOpaque.
                 * @member {boolean} isOpaque
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.isOpaque = false;
    
                /**
                 * LayerProto invalidate.
                 * @member {boolean} invalidate
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.invalidate = false;
    
                /**
                 * LayerProto dataspace.
                 * @member {string} dataspace
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.dataspace = "";
    
                /**
                 * LayerProto pixelFormat.
                 * @member {string} pixelFormat
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.pixelFormat = "";
    
                /**
                 * LayerProto color.
                 * @member {perfetto.protos.IColorProto|null|undefined} color
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.color = null;
    
                /**
                 * LayerProto requestedColor.
                 * @member {perfetto.protos.IColorProto|null|undefined} requestedColor
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.requestedColor = null;
    
                /**
                 * LayerProto flags.
                 * @member {number} flags
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.flags = 0;
    
                /**
                 * LayerProto transform.
                 * @member {perfetto.protos.ITransformProto|null|undefined} transform
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.transform = null;
    
                /**
                 * LayerProto requestedTransform.
                 * @member {perfetto.protos.ITransformProto|null|undefined} requestedTransform
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.requestedTransform = null;
    
                /**
                 * LayerProto parent.
                 * @member {number} parent
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.parent = 0;
    
                /**
                 * LayerProto zOrderRelativeOf.
                 * @member {number} zOrderRelativeOf
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.zOrderRelativeOf = 0;
    
                /**
                 * LayerProto activeBuffer.
                 * @member {perfetto.protos.IActiveBufferProto|null|undefined} activeBuffer
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.activeBuffer = null;
    
                /**
                 * LayerProto queuedFrames.
                 * @member {number} queuedFrames
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.queuedFrames = 0;
    
                /**
                 * LayerProto refreshPending.
                 * @member {boolean} refreshPending
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.refreshPending = false;
    
                /**
                 * LayerProto hwcFrame.
                 * @member {perfetto.protos.IRectProto|null|undefined} hwcFrame
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.hwcFrame = null;
    
                /**
                 * LayerProto hwcCrop.
                 * @member {perfetto.protos.IFloatRectProto|null|undefined} hwcCrop
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.hwcCrop = null;
    
                /**
                 * LayerProto hwcTransform.
                 * @member {number} hwcTransform
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.hwcTransform = 0;
    
                /**
                 * LayerProto windowType.
                 * @member {number} windowType
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.windowType = 0;
    
                /**
                 * LayerProto appId.
                 * @member {number} appId
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.appId = 0;
    
                /**
                 * LayerProto hwcCompositionType.
                 * @member {perfetto.protos.HwcCompositionType} hwcCompositionType
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.hwcCompositionType = 0;
    
                /**
                 * LayerProto isProtected.
                 * @member {boolean} isProtected
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.isProtected = false;
    
                /**
                 * LayerProto currFrame.
                 * @member {Long} currFrame
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.currFrame = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                /**
                 * LayerProto barrierLayer.
                 * @member {Array.<perfetto.protos.IBarrierLayerProto>} barrierLayer
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.barrierLayer = $util.emptyArray;
    
                /**
                 * LayerProto bufferTransform.
                 * @member {perfetto.protos.ITransformProto|null|undefined} bufferTransform
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.bufferTransform = null;
    
                /**
                 * LayerProto effectiveScalingMode.
                 * @member {number} effectiveScalingMode
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.effectiveScalingMode = 0;
    
                /**
                 * LayerProto cornerRadius.
                 * @member {number} cornerRadius
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.cornerRadius = 0;
    
                /**
                 * LayerProto metadata.
                 * @member {Object.<string,string>} metadata
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.metadata = $util.emptyObject;
    
                /**
                 * LayerProto effectiveTransform.
                 * @member {perfetto.protos.ITransformProto|null|undefined} effectiveTransform
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.effectiveTransform = null;
    
                /**
                 * LayerProto sourceBounds.
                 * @member {perfetto.protos.IFloatRectProto|null|undefined} sourceBounds
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.sourceBounds = null;
    
                /**
                 * LayerProto bounds.
                 * @member {perfetto.protos.IFloatRectProto|null|undefined} bounds
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.bounds = null;
    
                /**
                 * LayerProto screenBounds.
                 * @member {perfetto.protos.IFloatRectProto|null|undefined} screenBounds
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.screenBounds = null;
    
                /**
                 * LayerProto inputWindowInfo.
                 * @member {perfetto.protos.IInputWindowInfoProto|null|undefined} inputWindowInfo
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.inputWindowInfo = null;
    
                /**
                 * LayerProto cornerRadiusCrop.
                 * @member {perfetto.protos.IFloatRectProto|null|undefined} cornerRadiusCrop
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.cornerRadiusCrop = null;
    
                /**
                 * LayerProto shadowRadius.
                 * @member {number} shadowRadius
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.shadowRadius = 0;
    
                /**
                 * LayerProto colorTransform.
                 * @member {perfetto.protos.IColorTransformProto|null|undefined} colorTransform
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.colorTransform = null;
    
                /**
                 * LayerProto isRelativeOf.
                 * @member {boolean} isRelativeOf
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.isRelativeOf = false;
    
                /**
                 * LayerProto backgroundBlurRadius.
                 * @member {number} backgroundBlurRadius
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.backgroundBlurRadius = 0;
    
                /**
                 * LayerProto ownerUid.
                 * @member {number} ownerUid
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.ownerUid = 0;
    
                /**
                 * LayerProto blurRegions.
                 * @member {Array.<perfetto.protos.IBlurRegion>} blurRegions
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.blurRegions = $util.emptyArray;
    
                /**
                 * LayerProto isTrustedOverlay.
                 * @member {boolean} isTrustedOverlay
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.isTrustedOverlay = false;
    
                /**
                 * LayerProto requestedCornerRadius.
                 * @member {number} requestedCornerRadius
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.requestedCornerRadius = 0;
    
                /**
                 * LayerProto destinationFrame.
                 * @member {perfetto.protos.IRectProto|null|undefined} destinationFrame
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.destinationFrame = null;
    
                /**
                 * LayerProto originalId.
                 * @member {number} originalId
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.originalId = 0;
    
                /**
                 * LayerProto trustedOverlay.
                 * @member {perfetto.protos.TrustedOverlay} trustedOverlay
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 */
                LayerProto.prototype.trustedOverlay = 0;
    
                /**
                 * Creates a new LayerProto instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.LayerProto
                 * @static
                 * @param {perfetto.protos.ILayerProto=} [properties] Properties to set
                 * @returns {perfetto.protos.LayerProto} LayerProto instance
                 */
                LayerProto.create = function create(properties) {
                    return new LayerProto(properties);
                };
    
                /**
                 * Encodes the specified LayerProto message. Does not implicitly {@link perfetto.protos.LayerProto.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.LayerProto
                 * @static
                 * @param {perfetto.protos.ILayerProto} message LayerProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LayerProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                    if (message.children != null && message.children.length) {
                        writer.uint32(/* id 3, wireType 2 =*/26).fork();
                        for (var i = 0; i < message.children.length; ++i)
                            writer.int32(message.children[i]);
                        writer.ldelim();
                    }
                    if (message.relatives != null && message.relatives.length) {
                        writer.uint32(/* id 4, wireType 2 =*/34).fork();
                        for (var i = 0; i < message.relatives.length; ++i)
                            writer.int32(message.relatives[i]);
                        writer.ldelim();
                    }
                    if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                        writer.uint32(/* id 5, wireType 2 =*/42).string(message.type);
                    if (message.transparentRegion != null && Object.hasOwnProperty.call(message, "transparentRegion"))
                        $root.perfetto.protos.RegionProto.encode(message.transparentRegion, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                    if (message.visibleRegion != null && Object.hasOwnProperty.call(message, "visibleRegion"))
                        $root.perfetto.protos.RegionProto.encode(message.visibleRegion, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                    if (message.damageRegion != null && Object.hasOwnProperty.call(message, "damageRegion"))
                        $root.perfetto.protos.RegionProto.encode(message.damageRegion, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                    if (message.layerStack != null && Object.hasOwnProperty.call(message, "layerStack"))
                        writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.layerStack);
                    if (message.z != null && Object.hasOwnProperty.call(message, "z"))
                        writer.uint32(/* id 10, wireType 0 =*/80).int32(message.z);
                    if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                        $root.perfetto.protos.PositionProto.encode(message.position, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                    if (message.requestedPosition != null && Object.hasOwnProperty.call(message, "requestedPosition"))
                        $root.perfetto.protos.PositionProto.encode(message.requestedPosition, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
                    if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                        $root.perfetto.protos.SizeProto.encode(message.size, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
                    if (message.crop != null && Object.hasOwnProperty.call(message, "crop"))
                        $root.perfetto.protos.RectProto.encode(message.crop, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
                    if (message.finalCrop != null && Object.hasOwnProperty.call(message, "finalCrop"))
                        $root.perfetto.protos.RectProto.encode(message.finalCrop, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
                    if (message.isOpaque != null && Object.hasOwnProperty.call(message, "isOpaque"))
                        writer.uint32(/* id 16, wireType 0 =*/128).bool(message.isOpaque);
                    if (message.invalidate != null && Object.hasOwnProperty.call(message, "invalidate"))
                        writer.uint32(/* id 17, wireType 0 =*/136).bool(message.invalidate);
                    if (message.dataspace != null && Object.hasOwnProperty.call(message, "dataspace"))
                        writer.uint32(/* id 18, wireType 2 =*/146).string(message.dataspace);
                    if (message.pixelFormat != null && Object.hasOwnProperty.call(message, "pixelFormat"))
                        writer.uint32(/* id 19, wireType 2 =*/154).string(message.pixelFormat);
                    if (message.color != null && Object.hasOwnProperty.call(message, "color"))
                        $root.perfetto.protos.ColorProto.encode(message.color, writer.uint32(/* id 20, wireType 2 =*/162).fork()).ldelim();
                    if (message.requestedColor != null && Object.hasOwnProperty.call(message, "requestedColor"))
                        $root.perfetto.protos.ColorProto.encode(message.requestedColor, writer.uint32(/* id 21, wireType 2 =*/170).fork()).ldelim();
                    if (message.flags != null && Object.hasOwnProperty.call(message, "flags"))
                        writer.uint32(/* id 22, wireType 0 =*/176).uint32(message.flags);
                    if (message.transform != null && Object.hasOwnProperty.call(message, "transform"))
                        $root.perfetto.protos.TransformProto.encode(message.transform, writer.uint32(/* id 23, wireType 2 =*/186).fork()).ldelim();
                    if (message.requestedTransform != null && Object.hasOwnProperty.call(message, "requestedTransform"))
                        $root.perfetto.protos.TransformProto.encode(message.requestedTransform, writer.uint32(/* id 24, wireType 2 =*/194).fork()).ldelim();
                    if (message.parent != null && Object.hasOwnProperty.call(message, "parent"))
                        writer.uint32(/* id 25, wireType 0 =*/200).int32(message.parent);
                    if (message.zOrderRelativeOf != null && Object.hasOwnProperty.call(message, "zOrderRelativeOf"))
                        writer.uint32(/* id 26, wireType 0 =*/208).int32(message.zOrderRelativeOf);
                    if (message.activeBuffer != null && Object.hasOwnProperty.call(message, "activeBuffer"))
                        $root.perfetto.protos.ActiveBufferProto.encode(message.activeBuffer, writer.uint32(/* id 27, wireType 2 =*/218).fork()).ldelim();
                    if (message.queuedFrames != null && Object.hasOwnProperty.call(message, "queuedFrames"))
                        writer.uint32(/* id 28, wireType 0 =*/224).int32(message.queuedFrames);
                    if (message.refreshPending != null && Object.hasOwnProperty.call(message, "refreshPending"))
                        writer.uint32(/* id 29, wireType 0 =*/232).bool(message.refreshPending);
                    if (message.hwcFrame != null && Object.hasOwnProperty.call(message, "hwcFrame"))
                        $root.perfetto.protos.RectProto.encode(message.hwcFrame, writer.uint32(/* id 30, wireType 2 =*/242).fork()).ldelim();
                    if (message.hwcCrop != null && Object.hasOwnProperty.call(message, "hwcCrop"))
                        $root.perfetto.protos.FloatRectProto.encode(message.hwcCrop, writer.uint32(/* id 31, wireType 2 =*/250).fork()).ldelim();
                    if (message.hwcTransform != null && Object.hasOwnProperty.call(message, "hwcTransform"))
                        writer.uint32(/* id 32, wireType 0 =*/256).int32(message.hwcTransform);
                    if (message.windowType != null && Object.hasOwnProperty.call(message, "windowType"))
                        writer.uint32(/* id 33, wireType 0 =*/264).int32(message.windowType);
                    if (message.appId != null && Object.hasOwnProperty.call(message, "appId"))
                        writer.uint32(/* id 34, wireType 0 =*/272).int32(message.appId);
                    if (message.hwcCompositionType != null && Object.hasOwnProperty.call(message, "hwcCompositionType"))
                        writer.uint32(/* id 35, wireType 0 =*/280).int32(message.hwcCompositionType);
                    if (message.isProtected != null && Object.hasOwnProperty.call(message, "isProtected"))
                        writer.uint32(/* id 36, wireType 0 =*/288).bool(message.isProtected);
                    if (message.currFrame != null && Object.hasOwnProperty.call(message, "currFrame"))
                        writer.uint32(/* id 37, wireType 0 =*/296).uint64(message.currFrame);
                    if (message.barrierLayer != null && message.barrierLayer.length)
                        for (var i = 0; i < message.barrierLayer.length; ++i)
                            $root.perfetto.protos.BarrierLayerProto.encode(message.barrierLayer[i], writer.uint32(/* id 38, wireType 2 =*/306).fork()).ldelim();
                    if (message.bufferTransform != null && Object.hasOwnProperty.call(message, "bufferTransform"))
                        $root.perfetto.protos.TransformProto.encode(message.bufferTransform, writer.uint32(/* id 39, wireType 2 =*/314).fork()).ldelim();
                    if (message.effectiveScalingMode != null && Object.hasOwnProperty.call(message, "effectiveScalingMode"))
                        writer.uint32(/* id 40, wireType 0 =*/320).int32(message.effectiveScalingMode);
                    if (message.cornerRadius != null && Object.hasOwnProperty.call(message, "cornerRadius"))
                        writer.uint32(/* id 41, wireType 5 =*/333).float(message.cornerRadius);
                    if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                        for (var keys = Object.keys(message.metadata), i = 0; i < keys.length; ++i)
                            writer.uint32(/* id 42, wireType 2 =*/338).fork().uint32(/* id 1, wireType 0 =*/8).int32(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.metadata[keys[i]]).ldelim();
                    if (message.effectiveTransform != null && Object.hasOwnProperty.call(message, "effectiveTransform"))
                        $root.perfetto.protos.TransformProto.encode(message.effectiveTransform, writer.uint32(/* id 43, wireType 2 =*/346).fork()).ldelim();
                    if (message.sourceBounds != null && Object.hasOwnProperty.call(message, "sourceBounds"))
                        $root.perfetto.protos.FloatRectProto.encode(message.sourceBounds, writer.uint32(/* id 44, wireType 2 =*/354).fork()).ldelim();
                    if (message.bounds != null && Object.hasOwnProperty.call(message, "bounds"))
                        $root.perfetto.protos.FloatRectProto.encode(message.bounds, writer.uint32(/* id 45, wireType 2 =*/362).fork()).ldelim();
                    if (message.screenBounds != null && Object.hasOwnProperty.call(message, "screenBounds"))
                        $root.perfetto.protos.FloatRectProto.encode(message.screenBounds, writer.uint32(/* id 46, wireType 2 =*/370).fork()).ldelim();
                    if (message.inputWindowInfo != null && Object.hasOwnProperty.call(message, "inputWindowInfo"))
                        $root.perfetto.protos.InputWindowInfoProto.encode(message.inputWindowInfo, writer.uint32(/* id 47, wireType 2 =*/378).fork()).ldelim();
                    if (message.cornerRadiusCrop != null && Object.hasOwnProperty.call(message, "cornerRadiusCrop"))
                        $root.perfetto.protos.FloatRectProto.encode(message.cornerRadiusCrop, writer.uint32(/* id 48, wireType 2 =*/386).fork()).ldelim();
                    if (message.shadowRadius != null && Object.hasOwnProperty.call(message, "shadowRadius"))
                        writer.uint32(/* id 49, wireType 5 =*/397).float(message.shadowRadius);
                    if (message.colorTransform != null && Object.hasOwnProperty.call(message, "colorTransform"))
                        $root.perfetto.protos.ColorTransformProto.encode(message.colorTransform, writer.uint32(/* id 50, wireType 2 =*/402).fork()).ldelim();
                    if (message.isRelativeOf != null && Object.hasOwnProperty.call(message, "isRelativeOf"))
                        writer.uint32(/* id 51, wireType 0 =*/408).bool(message.isRelativeOf);
                    if (message.backgroundBlurRadius != null && Object.hasOwnProperty.call(message, "backgroundBlurRadius"))
                        writer.uint32(/* id 52, wireType 0 =*/416).int32(message.backgroundBlurRadius);
                    if (message.ownerUid != null && Object.hasOwnProperty.call(message, "ownerUid"))
                        writer.uint32(/* id 53, wireType 0 =*/424).uint32(message.ownerUid);
                    if (message.blurRegions != null && message.blurRegions.length)
                        for (var i = 0; i < message.blurRegions.length; ++i)
                            $root.perfetto.protos.BlurRegion.encode(message.blurRegions[i], writer.uint32(/* id 54, wireType 2 =*/434).fork()).ldelim();
                    if (message.isTrustedOverlay != null && Object.hasOwnProperty.call(message, "isTrustedOverlay"))
                        writer.uint32(/* id 55, wireType 0 =*/440).bool(message.isTrustedOverlay);
                    if (message.requestedCornerRadius != null && Object.hasOwnProperty.call(message, "requestedCornerRadius"))
                        writer.uint32(/* id 56, wireType 5 =*/453).float(message.requestedCornerRadius);
                    if (message.destinationFrame != null && Object.hasOwnProperty.call(message, "destinationFrame"))
                        $root.perfetto.protos.RectProto.encode(message.destinationFrame, writer.uint32(/* id 57, wireType 2 =*/458).fork()).ldelim();
                    if (message.originalId != null && Object.hasOwnProperty.call(message, "originalId"))
                        writer.uint32(/* id 58, wireType 0 =*/464).uint32(message.originalId);
                    if (message.trustedOverlay != null && Object.hasOwnProperty.call(message, "trustedOverlay"))
                        writer.uint32(/* id 59, wireType 0 =*/472).int32(message.trustedOverlay);
                    return writer;
                };
    
                /**
                 * Encodes the specified LayerProto message, length delimited. Does not implicitly {@link perfetto.protos.LayerProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.LayerProto
                 * @static
                 * @param {perfetto.protos.ILayerProto} message LayerProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LayerProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a LayerProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.LayerProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.LayerProto} LayerProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                LayerProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.LayerProto(), key, value;
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
                        case 3: {
                                if (!(message.children && message.children.length))
                                    message.children = [];
                                if ((tag & 7) === 2) {
                                    var end2 = reader.uint32() + reader.pos;
                                    while (reader.pos < end2)
                                        message.children.push(reader.int32());
                                } else
                                    message.children.push(reader.int32());
                                break;
                            }
                        case 4: {
                                if (!(message.relatives && message.relatives.length))
                                    message.relatives = [];
                                if ((tag & 7) === 2) {
                                    var end2 = reader.uint32() + reader.pos;
                                    while (reader.pos < end2)
                                        message.relatives.push(reader.int32());
                                } else
                                    message.relatives.push(reader.int32());
                                break;
                            }
                        case 5: {
                                message.type = reader.string();
                                break;
                            }
                        case 6: {
                                message.transparentRegion = $root.perfetto.protos.RegionProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 7: {
                                message.visibleRegion = $root.perfetto.protos.RegionProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 8: {
                                message.damageRegion = $root.perfetto.protos.RegionProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 9: {
                                message.layerStack = reader.uint32();
                                break;
                            }
                        case 10: {
                                message.z = reader.int32();
                                break;
                            }
                        case 11: {
                                message.position = $root.perfetto.protos.PositionProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 12: {
                                message.requestedPosition = $root.perfetto.protos.PositionProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 13: {
                                message.size = $root.perfetto.protos.SizeProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 14: {
                                message.crop = $root.perfetto.protos.RectProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 15: {
                                message.finalCrop = $root.perfetto.protos.RectProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 16: {
                                message.isOpaque = reader.bool();
                                break;
                            }
                        case 17: {
                                message.invalidate = reader.bool();
                                break;
                            }
                        case 18: {
                                message.dataspace = reader.string();
                                break;
                            }
                        case 19: {
                                message.pixelFormat = reader.string();
                                break;
                            }
                        case 20: {
                                message.color = $root.perfetto.protos.ColorProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 21: {
                                message.requestedColor = $root.perfetto.protos.ColorProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 22: {
                                message.flags = reader.uint32();
                                break;
                            }
                        case 23: {
                                message.transform = $root.perfetto.protos.TransformProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 24: {
                                message.requestedTransform = $root.perfetto.protos.TransformProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 25: {
                                message.parent = reader.int32();
                                break;
                            }
                        case 26: {
                                message.zOrderRelativeOf = reader.int32();
                                break;
                            }
                        case 27: {
                                message.activeBuffer = $root.perfetto.protos.ActiveBufferProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 28: {
                                message.queuedFrames = reader.int32();
                                break;
                            }
                        case 29: {
                                message.refreshPending = reader.bool();
                                break;
                            }
                        case 30: {
                                message.hwcFrame = $root.perfetto.protos.RectProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 31: {
                                message.hwcCrop = $root.perfetto.protos.FloatRectProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 32: {
                                message.hwcTransform = reader.int32();
                                break;
                            }
                        case 33: {
                                message.windowType = reader.int32();
                                break;
                            }
                        case 34: {
                                message.appId = reader.int32();
                                break;
                            }
                        case 35: {
                                message.hwcCompositionType = reader.int32();
                                break;
                            }
                        case 36: {
                                message.isProtected = reader.bool();
                                break;
                            }
                        case 37: {
                                message.currFrame = reader.uint64();
                                break;
                            }
                        case 38: {
                                if (!(message.barrierLayer && message.barrierLayer.length))
                                    message.barrierLayer = [];
                                message.barrierLayer.push($root.perfetto.protos.BarrierLayerProto.decode(reader, reader.uint32()));
                                break;
                            }
                        case 39: {
                                message.bufferTransform = $root.perfetto.protos.TransformProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 40: {
                                message.effectiveScalingMode = reader.int32();
                                break;
                            }
                        case 41: {
                                message.cornerRadius = reader.float();
                                break;
                            }
                        case 42: {
                                if (message.metadata === $util.emptyObject)
                                    message.metadata = {};
                                var end2 = reader.uint32() + reader.pos;
                                key = 0;
                                value = "";
                                while (reader.pos < end2) {
                                    var tag2 = reader.uint32();
                                    switch (tag2 >>> 3) {
                                    case 1:
                                        key = reader.int32();
                                        break;
                                    case 2:
                                        value = reader.string();
                                        break;
                                    default:
                                        reader.skipType(tag2 & 7);
                                        break;
                                    }
                                }
                                message.metadata[key] = value;
                                break;
                            }
                        case 43: {
                                message.effectiveTransform = $root.perfetto.protos.TransformProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 44: {
                                message.sourceBounds = $root.perfetto.protos.FloatRectProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 45: {
                                message.bounds = $root.perfetto.protos.FloatRectProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 46: {
                                message.screenBounds = $root.perfetto.protos.FloatRectProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 47: {
                                message.inputWindowInfo = $root.perfetto.protos.InputWindowInfoProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 48: {
                                message.cornerRadiusCrop = $root.perfetto.protos.FloatRectProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 49: {
                                message.shadowRadius = reader.float();
                                break;
                            }
                        case 50: {
                                message.colorTransform = $root.perfetto.protos.ColorTransformProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 51: {
                                message.isRelativeOf = reader.bool();
                                break;
                            }
                        case 52: {
                                message.backgroundBlurRadius = reader.int32();
                                break;
                            }
                        case 53: {
                                message.ownerUid = reader.uint32();
                                break;
                            }
                        case 54: {
                                if (!(message.blurRegions && message.blurRegions.length))
                                    message.blurRegions = [];
                                message.blurRegions.push($root.perfetto.protos.BlurRegion.decode(reader, reader.uint32()));
                                break;
                            }
                        case 55: {
                                message.isTrustedOverlay = reader.bool();
                                break;
                            }
                        case 56: {
                                message.requestedCornerRadius = reader.float();
                                break;
                            }
                        case 57: {
                                message.destinationFrame = $root.perfetto.protos.RectProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 58: {
                                message.originalId = reader.uint32();
                                break;
                            }
                        case 59: {
                                message.trustedOverlay = reader.int32();
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
                 * Decodes a LayerProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.LayerProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.LayerProto} LayerProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                LayerProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a LayerProto message.
                 * @function verify
                 * @memberof perfetto.protos.LayerProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                LayerProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isInteger(message.id))
                            return "id: integer expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.children != null && message.hasOwnProperty("children")) {
                        if (!Array.isArray(message.children))
                            return "children: array expected";
                        for (var i = 0; i < message.children.length; ++i)
                            if (!$util.isInteger(message.children[i]))
                                return "children: integer[] expected";
                    }
                    if (message.relatives != null && message.hasOwnProperty("relatives")) {
                        if (!Array.isArray(message.relatives))
                            return "relatives: array expected";
                        for (var i = 0; i < message.relatives.length; ++i)
                            if (!$util.isInteger(message.relatives[i]))
                                return "relatives: integer[] expected";
                    }
                    if (message.type != null && message.hasOwnProperty("type"))
                        if (!$util.isString(message.type))
                            return "type: string expected";
                    if (message.transparentRegion != null && message.hasOwnProperty("transparentRegion")) {
                        var error = $root.perfetto.protos.RegionProto.verify(message.transparentRegion);
                        if (error)
                            return "transparentRegion." + error;
                    }
                    if (message.visibleRegion != null && message.hasOwnProperty("visibleRegion")) {
                        var error = $root.perfetto.protos.RegionProto.verify(message.visibleRegion);
                        if (error)
                            return "visibleRegion." + error;
                    }
                    if (message.damageRegion != null && message.hasOwnProperty("damageRegion")) {
                        var error = $root.perfetto.protos.RegionProto.verify(message.damageRegion);
                        if (error)
                            return "damageRegion." + error;
                    }
                    if (message.layerStack != null && message.hasOwnProperty("layerStack"))
                        if (!$util.isInteger(message.layerStack))
                            return "layerStack: integer expected";
                    if (message.z != null && message.hasOwnProperty("z"))
                        if (!$util.isInteger(message.z))
                            return "z: integer expected";
                    if (message.position != null && message.hasOwnProperty("position")) {
                        var error = $root.perfetto.protos.PositionProto.verify(message.position);
                        if (error)
                            return "position." + error;
                    }
                    if (message.requestedPosition != null && message.hasOwnProperty("requestedPosition")) {
                        var error = $root.perfetto.protos.PositionProto.verify(message.requestedPosition);
                        if (error)
                            return "requestedPosition." + error;
                    }
                    if (message.size != null && message.hasOwnProperty("size")) {
                        var error = $root.perfetto.protos.SizeProto.verify(message.size);
                        if (error)
                            return "size." + error;
                    }
                    if (message.crop != null && message.hasOwnProperty("crop")) {
                        var error = $root.perfetto.protos.RectProto.verify(message.crop);
                        if (error)
                            return "crop." + error;
                    }
                    if (message.finalCrop != null && message.hasOwnProperty("finalCrop")) {
                        var error = $root.perfetto.protos.RectProto.verify(message.finalCrop);
                        if (error)
                            return "finalCrop." + error;
                    }
                    if (message.isOpaque != null && message.hasOwnProperty("isOpaque"))
                        if (typeof message.isOpaque !== "boolean")
                            return "isOpaque: boolean expected";
                    if (message.invalidate != null && message.hasOwnProperty("invalidate"))
                        if (typeof message.invalidate !== "boolean")
                            return "invalidate: boolean expected";
                    if (message.dataspace != null && message.hasOwnProperty("dataspace"))
                        if (!$util.isString(message.dataspace))
                            return "dataspace: string expected";
                    if (message.pixelFormat != null && message.hasOwnProperty("pixelFormat"))
                        if (!$util.isString(message.pixelFormat))
                            return "pixelFormat: string expected";
                    if (message.color != null && message.hasOwnProperty("color")) {
                        var error = $root.perfetto.protos.ColorProto.verify(message.color);
                        if (error)
                            return "color." + error;
                    }
                    if (message.requestedColor != null && message.hasOwnProperty("requestedColor")) {
                        var error = $root.perfetto.protos.ColorProto.verify(message.requestedColor);
                        if (error)
                            return "requestedColor." + error;
                    }
                    if (message.flags != null && message.hasOwnProperty("flags"))
                        if (!$util.isInteger(message.flags))
                            return "flags: integer expected";
                    if (message.transform != null && message.hasOwnProperty("transform")) {
                        var error = $root.perfetto.protos.TransformProto.verify(message.transform);
                        if (error)
                            return "transform." + error;
                    }
                    if (message.requestedTransform != null && message.hasOwnProperty("requestedTransform")) {
                        var error = $root.perfetto.protos.TransformProto.verify(message.requestedTransform);
                        if (error)
                            return "requestedTransform." + error;
                    }
                    if (message.parent != null && message.hasOwnProperty("parent"))
                        if (!$util.isInteger(message.parent))
                            return "parent: integer expected";
                    if (message.zOrderRelativeOf != null && message.hasOwnProperty("zOrderRelativeOf"))
                        if (!$util.isInteger(message.zOrderRelativeOf))
                            return "zOrderRelativeOf: integer expected";
                    if (message.activeBuffer != null && message.hasOwnProperty("activeBuffer")) {
                        var error = $root.perfetto.protos.ActiveBufferProto.verify(message.activeBuffer);
                        if (error)
                            return "activeBuffer." + error;
                    }
                    if (message.queuedFrames != null && message.hasOwnProperty("queuedFrames"))
                        if (!$util.isInteger(message.queuedFrames))
                            return "queuedFrames: integer expected";
                    if (message.refreshPending != null && message.hasOwnProperty("refreshPending"))
                        if (typeof message.refreshPending !== "boolean")
                            return "refreshPending: boolean expected";
                    if (message.hwcFrame != null && message.hasOwnProperty("hwcFrame")) {
                        var error = $root.perfetto.protos.RectProto.verify(message.hwcFrame);
                        if (error)
                            return "hwcFrame." + error;
                    }
                    if (message.hwcCrop != null && message.hasOwnProperty("hwcCrop")) {
                        var error = $root.perfetto.protos.FloatRectProto.verify(message.hwcCrop);
                        if (error)
                            return "hwcCrop." + error;
                    }
                    if (message.hwcTransform != null && message.hasOwnProperty("hwcTransform"))
                        if (!$util.isInteger(message.hwcTransform))
                            return "hwcTransform: integer expected";
                    if (message.windowType != null && message.hasOwnProperty("windowType"))
                        if (!$util.isInteger(message.windowType))
                            return "windowType: integer expected";
                    if (message.appId != null && message.hasOwnProperty("appId"))
                        if (!$util.isInteger(message.appId))
                            return "appId: integer expected";
                    if (message.hwcCompositionType != null && message.hasOwnProperty("hwcCompositionType"))
                        switch (message.hwcCompositionType) {
                        default:
                            return "hwcCompositionType: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                            break;
                        }
                    if (message.isProtected != null && message.hasOwnProperty("isProtected"))
                        if (typeof message.isProtected !== "boolean")
                            return "isProtected: boolean expected";
                    if (message.currFrame != null && message.hasOwnProperty("currFrame"))
                        if (!$util.isInteger(message.currFrame) && !(message.currFrame && $util.isInteger(message.currFrame.low) && $util.isInteger(message.currFrame.high)))
                            return "currFrame: integer|Long expected";
                    if (message.barrierLayer != null && message.hasOwnProperty("barrierLayer")) {
                        if (!Array.isArray(message.barrierLayer))
                            return "barrierLayer: array expected";
                        for (var i = 0; i < message.barrierLayer.length; ++i) {
                            var error = $root.perfetto.protos.BarrierLayerProto.verify(message.barrierLayer[i]);
                            if (error)
                                return "barrierLayer." + error;
                        }
                    }
                    if (message.bufferTransform != null && message.hasOwnProperty("bufferTransform")) {
                        var error = $root.perfetto.protos.TransformProto.verify(message.bufferTransform);
                        if (error)
                            return "bufferTransform." + error;
                    }
                    if (message.effectiveScalingMode != null && message.hasOwnProperty("effectiveScalingMode"))
                        if (!$util.isInteger(message.effectiveScalingMode))
                            return "effectiveScalingMode: integer expected";
                    if (message.cornerRadius != null && message.hasOwnProperty("cornerRadius"))
                        if (typeof message.cornerRadius !== "number")
                            return "cornerRadius: number expected";
                    if (message.metadata != null && message.hasOwnProperty("metadata")) {
                        if (!$util.isObject(message.metadata))
                            return "metadata: object expected";
                        var key = Object.keys(message.metadata);
                        for (var i = 0; i < key.length; ++i) {
                            if (!$util.key32Re.test(key[i]))
                                return "metadata: integer key{k:int32} expected";
                            if (!$util.isString(message.metadata[key[i]]))
                                return "metadata: string{k:int32} expected";
                        }
                    }
                    if (message.effectiveTransform != null && message.hasOwnProperty("effectiveTransform")) {
                        var error = $root.perfetto.protos.TransformProto.verify(message.effectiveTransform);
                        if (error)
                            return "effectiveTransform." + error;
                    }
                    if (message.sourceBounds != null && message.hasOwnProperty("sourceBounds")) {
                        var error = $root.perfetto.protos.FloatRectProto.verify(message.sourceBounds);
                        if (error)
                            return "sourceBounds." + error;
                    }
                    if (message.bounds != null && message.hasOwnProperty("bounds")) {
                        var error = $root.perfetto.protos.FloatRectProto.verify(message.bounds);
                        if (error)
                            return "bounds." + error;
                    }
                    if (message.screenBounds != null && message.hasOwnProperty("screenBounds")) {
                        var error = $root.perfetto.protos.FloatRectProto.verify(message.screenBounds);
                        if (error)
                            return "screenBounds." + error;
                    }
                    if (message.inputWindowInfo != null && message.hasOwnProperty("inputWindowInfo")) {
                        var error = $root.perfetto.protos.InputWindowInfoProto.verify(message.inputWindowInfo);
                        if (error)
                            return "inputWindowInfo." + error;
                    }
                    if (message.cornerRadiusCrop != null && message.hasOwnProperty("cornerRadiusCrop")) {
                        var error = $root.perfetto.protos.FloatRectProto.verify(message.cornerRadiusCrop);
                        if (error)
                            return "cornerRadiusCrop." + error;
                    }
                    if (message.shadowRadius != null && message.hasOwnProperty("shadowRadius"))
                        if (typeof message.shadowRadius !== "number")
                            return "shadowRadius: number expected";
                    if (message.colorTransform != null && message.hasOwnProperty("colorTransform")) {
                        var error = $root.perfetto.protos.ColorTransformProto.verify(message.colorTransform);
                        if (error)
                            return "colorTransform." + error;
                    }
                    if (message.isRelativeOf != null && message.hasOwnProperty("isRelativeOf"))
                        if (typeof message.isRelativeOf !== "boolean")
                            return "isRelativeOf: boolean expected";
                    if (message.backgroundBlurRadius != null && message.hasOwnProperty("backgroundBlurRadius"))
                        if (!$util.isInteger(message.backgroundBlurRadius))
                            return "backgroundBlurRadius: integer expected";
                    if (message.ownerUid != null && message.hasOwnProperty("ownerUid"))
                        if (!$util.isInteger(message.ownerUid))
                            return "ownerUid: integer expected";
                    if (message.blurRegions != null && message.hasOwnProperty("blurRegions")) {
                        if (!Array.isArray(message.blurRegions))
                            return "blurRegions: array expected";
                        for (var i = 0; i < message.blurRegions.length; ++i) {
                            var error = $root.perfetto.protos.BlurRegion.verify(message.blurRegions[i]);
                            if (error)
                                return "blurRegions." + error;
                        }
                    }
                    if (message.isTrustedOverlay != null && message.hasOwnProperty("isTrustedOverlay"))
                        if (typeof message.isTrustedOverlay !== "boolean")
                            return "isTrustedOverlay: boolean expected";
                    if (message.requestedCornerRadius != null && message.hasOwnProperty("requestedCornerRadius"))
                        if (typeof message.requestedCornerRadius !== "number")
                            return "requestedCornerRadius: number expected";
                    if (message.destinationFrame != null && message.hasOwnProperty("destinationFrame")) {
                        var error = $root.perfetto.protos.RectProto.verify(message.destinationFrame);
                        if (error)
                            return "destinationFrame." + error;
                    }
                    if (message.originalId != null && message.hasOwnProperty("originalId"))
                        if (!$util.isInteger(message.originalId))
                            return "originalId: integer expected";
                    if (message.trustedOverlay != null && message.hasOwnProperty("trustedOverlay"))
                        switch (message.trustedOverlay) {
                        default:
                            return "trustedOverlay: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                            break;
                        }
                    return null;
                };
    
                /**
                 * Creates a LayerProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.LayerProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.LayerProto} LayerProto
                 */
                LayerProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.LayerProto)
                        return object;
                    var message = new $root.perfetto.protos.LayerProto();
                    if (object.id != null)
                        message.id = object.id | 0;
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.children) {
                        if (!Array.isArray(object.children))
                            throw TypeError(".perfetto.protos.LayerProto.children: array expected");
                        message.children = [];
                        for (var i = 0; i < object.children.length; ++i)
                            message.children[i] = object.children[i] | 0;
                    }
                    if (object.relatives) {
                        if (!Array.isArray(object.relatives))
                            throw TypeError(".perfetto.protos.LayerProto.relatives: array expected");
                        message.relatives = [];
                        for (var i = 0; i < object.relatives.length; ++i)
                            message.relatives[i] = object.relatives[i] | 0;
                    }
                    if (object.type != null)
                        message.type = String(object.type);
                    if (object.transparentRegion != null) {
                        if (typeof object.transparentRegion !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.transparentRegion: object expected");
                        message.transparentRegion = $root.perfetto.protos.RegionProto.fromObject(object.transparentRegion);
                    }
                    if (object.visibleRegion != null) {
                        if (typeof object.visibleRegion !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.visibleRegion: object expected");
                        message.visibleRegion = $root.perfetto.protos.RegionProto.fromObject(object.visibleRegion);
                    }
                    if (object.damageRegion != null) {
                        if (typeof object.damageRegion !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.damageRegion: object expected");
                        message.damageRegion = $root.perfetto.protos.RegionProto.fromObject(object.damageRegion);
                    }
                    if (object.layerStack != null)
                        message.layerStack = object.layerStack >>> 0;
                    if (object.z != null)
                        message.z = object.z | 0;
                    if (object.position != null) {
                        if (typeof object.position !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.position: object expected");
                        message.position = $root.perfetto.protos.PositionProto.fromObject(object.position);
                    }
                    if (object.requestedPosition != null) {
                        if (typeof object.requestedPosition !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.requestedPosition: object expected");
                        message.requestedPosition = $root.perfetto.protos.PositionProto.fromObject(object.requestedPosition);
                    }
                    if (object.size != null) {
                        if (typeof object.size !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.size: object expected");
                        message.size = $root.perfetto.protos.SizeProto.fromObject(object.size);
                    }
                    if (object.crop != null) {
                        if (typeof object.crop !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.crop: object expected");
                        message.crop = $root.perfetto.protos.RectProto.fromObject(object.crop);
                    }
                    if (object.finalCrop != null) {
                        if (typeof object.finalCrop !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.finalCrop: object expected");
                        message.finalCrop = $root.perfetto.protos.RectProto.fromObject(object.finalCrop);
                    }
                    if (object.isOpaque != null)
                        message.isOpaque = Boolean(object.isOpaque);
                    if (object.invalidate != null)
                        message.invalidate = Boolean(object.invalidate);
                    if (object.dataspace != null)
                        message.dataspace = String(object.dataspace);
                    if (object.pixelFormat != null)
                        message.pixelFormat = String(object.pixelFormat);
                    if (object.color != null) {
                        if (typeof object.color !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.color: object expected");
                        message.color = $root.perfetto.protos.ColorProto.fromObject(object.color);
                    }
                    if (object.requestedColor != null) {
                        if (typeof object.requestedColor !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.requestedColor: object expected");
                        message.requestedColor = $root.perfetto.protos.ColorProto.fromObject(object.requestedColor);
                    }
                    if (object.flags != null)
                        message.flags = object.flags >>> 0;
                    if (object.transform != null) {
                        if (typeof object.transform !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.transform: object expected");
                        message.transform = $root.perfetto.protos.TransformProto.fromObject(object.transform);
                    }
                    if (object.requestedTransform != null) {
                        if (typeof object.requestedTransform !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.requestedTransform: object expected");
                        message.requestedTransform = $root.perfetto.protos.TransformProto.fromObject(object.requestedTransform);
                    }
                    if (object.parent != null)
                        message.parent = object.parent | 0;
                    if (object.zOrderRelativeOf != null)
                        message.zOrderRelativeOf = object.zOrderRelativeOf | 0;
                    if (object.activeBuffer != null) {
                        if (typeof object.activeBuffer !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.activeBuffer: object expected");
                        message.activeBuffer = $root.perfetto.protos.ActiveBufferProto.fromObject(object.activeBuffer);
                    }
                    if (object.queuedFrames != null)
                        message.queuedFrames = object.queuedFrames | 0;
                    if (object.refreshPending != null)
                        message.refreshPending = Boolean(object.refreshPending);
                    if (object.hwcFrame != null) {
                        if (typeof object.hwcFrame !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.hwcFrame: object expected");
                        message.hwcFrame = $root.perfetto.protos.RectProto.fromObject(object.hwcFrame);
                    }
                    if (object.hwcCrop != null) {
                        if (typeof object.hwcCrop !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.hwcCrop: object expected");
                        message.hwcCrop = $root.perfetto.protos.FloatRectProto.fromObject(object.hwcCrop);
                    }
                    if (object.hwcTransform != null)
                        message.hwcTransform = object.hwcTransform | 0;
                    if (object.windowType != null)
                        message.windowType = object.windowType | 0;
                    if (object.appId != null)
                        message.appId = object.appId | 0;
                    switch (object.hwcCompositionType) {
                    default:
                        if (typeof object.hwcCompositionType === "number") {
                            message.hwcCompositionType = object.hwcCompositionType;
                            break;
                        }
                        break;
                    case "HWC_TYPE_UNSPECIFIED":
                    case 0:
                        message.hwcCompositionType = 0;
                        break;
                    case "HWC_TYPE_CLIENT":
                    case 1:
                        message.hwcCompositionType = 1;
                        break;
                    case "HWC_TYPE_DEVICE":
                    case 2:
                        message.hwcCompositionType = 2;
                        break;
                    case "HWC_TYPE_SOLID_COLOR":
                    case 3:
                        message.hwcCompositionType = 3;
                        break;
                    case "HWC_TYPE_CURSOR":
                    case 4:
                        message.hwcCompositionType = 4;
                        break;
                    case "HWC_TYPE_SIDEBAND":
                    case 5:
                        message.hwcCompositionType = 5;
                        break;
                    case "HWC_TYPE_DISPLAY_DECORATION":
                    case 6:
                        message.hwcCompositionType = 6;
                        break;
                    }
                    if (object.isProtected != null)
                        message.isProtected = Boolean(object.isProtected);
                    if (object.currFrame != null)
                        if ($util.Long)
                            (message.currFrame = $util.Long.fromValue(object.currFrame)).unsigned = true;
                        else if (typeof object.currFrame === "string")
                            message.currFrame = parseInt(object.currFrame, 10);
                        else if (typeof object.currFrame === "number")
                            message.currFrame = object.currFrame;
                        else if (typeof object.currFrame === "object")
                            message.currFrame = new $util.LongBits(object.currFrame.low >>> 0, object.currFrame.high >>> 0).toNumber(true);
                    if (object.barrierLayer) {
                        if (!Array.isArray(object.barrierLayer))
                            throw TypeError(".perfetto.protos.LayerProto.barrierLayer: array expected");
                        message.barrierLayer = [];
                        for (var i = 0; i < object.barrierLayer.length; ++i) {
                            if (typeof object.barrierLayer[i] !== "object")
                                throw TypeError(".perfetto.protos.LayerProto.barrierLayer: object expected");
                            message.barrierLayer[i] = $root.perfetto.protos.BarrierLayerProto.fromObject(object.barrierLayer[i]);
                        }
                    }
                    if (object.bufferTransform != null) {
                        if (typeof object.bufferTransform !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.bufferTransform: object expected");
                        message.bufferTransform = $root.perfetto.protos.TransformProto.fromObject(object.bufferTransform);
                    }
                    if (object.effectiveScalingMode != null)
                        message.effectiveScalingMode = object.effectiveScalingMode | 0;
                    if (object.cornerRadius != null)
                        message.cornerRadius = Number(object.cornerRadius);
                    if (object.metadata) {
                        if (typeof object.metadata !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.metadata: object expected");
                        message.metadata = {};
                        for (var keys = Object.keys(object.metadata), i = 0; i < keys.length; ++i)
                            message.metadata[keys[i]] = String(object.metadata[keys[i]]);
                    }
                    if (object.effectiveTransform != null) {
                        if (typeof object.effectiveTransform !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.effectiveTransform: object expected");
                        message.effectiveTransform = $root.perfetto.protos.TransformProto.fromObject(object.effectiveTransform);
                    }
                    if (object.sourceBounds != null) {
                        if (typeof object.sourceBounds !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.sourceBounds: object expected");
                        message.sourceBounds = $root.perfetto.protos.FloatRectProto.fromObject(object.sourceBounds);
                    }
                    if (object.bounds != null) {
                        if (typeof object.bounds !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.bounds: object expected");
                        message.bounds = $root.perfetto.protos.FloatRectProto.fromObject(object.bounds);
                    }
                    if (object.screenBounds != null) {
                        if (typeof object.screenBounds !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.screenBounds: object expected");
                        message.screenBounds = $root.perfetto.protos.FloatRectProto.fromObject(object.screenBounds);
                    }
                    if (object.inputWindowInfo != null) {
                        if (typeof object.inputWindowInfo !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.inputWindowInfo: object expected");
                        message.inputWindowInfo = $root.perfetto.protos.InputWindowInfoProto.fromObject(object.inputWindowInfo);
                    }
                    if (object.cornerRadiusCrop != null) {
                        if (typeof object.cornerRadiusCrop !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.cornerRadiusCrop: object expected");
                        message.cornerRadiusCrop = $root.perfetto.protos.FloatRectProto.fromObject(object.cornerRadiusCrop);
                    }
                    if (object.shadowRadius != null)
                        message.shadowRadius = Number(object.shadowRadius);
                    if (object.colorTransform != null) {
                        if (typeof object.colorTransform !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.colorTransform: object expected");
                        message.colorTransform = $root.perfetto.protos.ColorTransformProto.fromObject(object.colorTransform);
                    }
                    if (object.isRelativeOf != null)
                        message.isRelativeOf = Boolean(object.isRelativeOf);
                    if (object.backgroundBlurRadius != null)
                        message.backgroundBlurRadius = object.backgroundBlurRadius | 0;
                    if (object.ownerUid != null)
                        message.ownerUid = object.ownerUid >>> 0;
                    if (object.blurRegions) {
                        if (!Array.isArray(object.blurRegions))
                            throw TypeError(".perfetto.protos.LayerProto.blurRegions: array expected");
                        message.blurRegions = [];
                        for (var i = 0; i < object.blurRegions.length; ++i) {
                            if (typeof object.blurRegions[i] !== "object")
                                throw TypeError(".perfetto.protos.LayerProto.blurRegions: object expected");
                            message.blurRegions[i] = $root.perfetto.protos.BlurRegion.fromObject(object.blurRegions[i]);
                        }
                    }
                    if (object.isTrustedOverlay != null)
                        message.isTrustedOverlay = Boolean(object.isTrustedOverlay);
                    if (object.requestedCornerRadius != null)
                        message.requestedCornerRadius = Number(object.requestedCornerRadius);
                    if (object.destinationFrame != null) {
                        if (typeof object.destinationFrame !== "object")
                            throw TypeError(".perfetto.protos.LayerProto.destinationFrame: object expected");
                        message.destinationFrame = $root.perfetto.protos.RectProto.fromObject(object.destinationFrame);
                    }
                    if (object.originalId != null)
                        message.originalId = object.originalId >>> 0;
                    switch (object.trustedOverlay) {
                    default:
                        if (typeof object.trustedOverlay === "number") {
                            message.trustedOverlay = object.trustedOverlay;
                            break;
                        }
                        break;
                    case "UNSET":
                    case 0:
                        message.trustedOverlay = 0;
                        break;
                    case "DISABLED":
                    case 1:
                        message.trustedOverlay = 1;
                        break;
                    case "ENABLED":
                    case 2:
                        message.trustedOverlay = 2;
                        break;
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from a LayerProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.LayerProto
                 * @static
                 * @param {perfetto.protos.LayerProto} message LayerProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                LayerProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.children = [];
                        object.relatives = [];
                        object.barrierLayer = [];
                        object.blurRegions = [];
                    }
                    if (options.objects || options.defaults)
                        object.metadata = {};
                    if (options.defaults) {
                        object.id = 0;
                        object.name = "";
                        object.type = "";
                        object.transparentRegion = null;
                        object.visibleRegion = null;
                        object.damageRegion = null;
                        object.layerStack = 0;
                        object.z = 0;
                        object.position = null;
                        object.requestedPosition = null;
                        object.size = null;
                        object.crop = null;
                        object.finalCrop = null;
                        object.isOpaque = false;
                        object.invalidate = false;
                        object.dataspace = "";
                        object.pixelFormat = "";
                        object.color = null;
                        object.requestedColor = null;
                        object.flags = 0;
                        object.transform = null;
                        object.requestedTransform = null;
                        object.parent = 0;
                        object.zOrderRelativeOf = 0;
                        object.activeBuffer = null;
                        object.queuedFrames = 0;
                        object.refreshPending = false;
                        object.hwcFrame = null;
                        object.hwcCrop = null;
                        object.hwcTransform = 0;
                        object.windowType = 0;
                        object.appId = 0;
                        object.hwcCompositionType = options.enums === String ? "HWC_TYPE_UNSPECIFIED" : 0;
                        object.isProtected = false;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.currFrame = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.currFrame = options.longs === String ? "0" : 0;
                        object.bufferTransform = null;
                        object.effectiveScalingMode = 0;
                        object.cornerRadius = 0;
                        object.effectiveTransform = null;
                        object.sourceBounds = null;
                        object.bounds = null;
                        object.screenBounds = null;
                        object.inputWindowInfo = null;
                        object.cornerRadiusCrop = null;
                        object.shadowRadius = 0;
                        object.colorTransform = null;
                        object.isRelativeOf = false;
                        object.backgroundBlurRadius = 0;
                        object.ownerUid = 0;
                        object.isTrustedOverlay = false;
                        object.requestedCornerRadius = 0;
                        object.destinationFrame = null;
                        object.originalId = 0;
                        object.trustedOverlay = options.enums === String ? "UNSET" : 0;
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.children && message.children.length) {
                        object.children = [];
                        for (var j = 0; j < message.children.length; ++j)
                            object.children[j] = message.children[j];
                    }
                    if (message.relatives && message.relatives.length) {
                        object.relatives = [];
                        for (var j = 0; j < message.relatives.length; ++j)
                            object.relatives[j] = message.relatives[j];
                    }
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = message.type;
                    if (message.transparentRegion != null && message.hasOwnProperty("transparentRegion"))
                        object.transparentRegion = $root.perfetto.protos.RegionProto.toObject(message.transparentRegion, options);
                    if (message.visibleRegion != null && message.hasOwnProperty("visibleRegion"))
                        object.visibleRegion = $root.perfetto.protos.RegionProto.toObject(message.visibleRegion, options);
                    if (message.damageRegion != null && message.hasOwnProperty("damageRegion"))
                        object.damageRegion = $root.perfetto.protos.RegionProto.toObject(message.damageRegion, options);
                    if (message.layerStack != null && message.hasOwnProperty("layerStack"))
                        object.layerStack = message.layerStack;
                    if (message.z != null && message.hasOwnProperty("z"))
                        object.z = message.z;
                    if (message.position != null && message.hasOwnProperty("position"))
                        object.position = $root.perfetto.protos.PositionProto.toObject(message.position, options);
                    if (message.requestedPosition != null && message.hasOwnProperty("requestedPosition"))
                        object.requestedPosition = $root.perfetto.protos.PositionProto.toObject(message.requestedPosition, options);
                    if (message.size != null && message.hasOwnProperty("size"))
                        object.size = $root.perfetto.protos.SizeProto.toObject(message.size, options);
                    if (message.crop != null && message.hasOwnProperty("crop"))
                        object.crop = $root.perfetto.protos.RectProto.toObject(message.crop, options);
                    if (message.finalCrop != null && message.hasOwnProperty("finalCrop"))
                        object.finalCrop = $root.perfetto.protos.RectProto.toObject(message.finalCrop, options);
                    if (message.isOpaque != null && message.hasOwnProperty("isOpaque"))
                        object.isOpaque = message.isOpaque;
                    if (message.invalidate != null && message.hasOwnProperty("invalidate"))
                        object.invalidate = message.invalidate;
                    if (message.dataspace != null && message.hasOwnProperty("dataspace"))
                        object.dataspace = message.dataspace;
                    if (message.pixelFormat != null && message.hasOwnProperty("pixelFormat"))
                        object.pixelFormat = message.pixelFormat;
                    if (message.color != null && message.hasOwnProperty("color"))
                        object.color = $root.perfetto.protos.ColorProto.toObject(message.color, options);
                    if (message.requestedColor != null && message.hasOwnProperty("requestedColor"))
                        object.requestedColor = $root.perfetto.protos.ColorProto.toObject(message.requestedColor, options);
                    if (message.flags != null && message.hasOwnProperty("flags"))
                        object.flags = message.flags;
                    if (message.transform != null && message.hasOwnProperty("transform"))
                        object.transform = $root.perfetto.protos.TransformProto.toObject(message.transform, options);
                    if (message.requestedTransform != null && message.hasOwnProperty("requestedTransform"))
                        object.requestedTransform = $root.perfetto.protos.TransformProto.toObject(message.requestedTransform, options);
                    if (message.parent != null && message.hasOwnProperty("parent"))
                        object.parent = message.parent;
                    if (message.zOrderRelativeOf != null && message.hasOwnProperty("zOrderRelativeOf"))
                        object.zOrderRelativeOf = message.zOrderRelativeOf;
                    if (message.activeBuffer != null && message.hasOwnProperty("activeBuffer"))
                        object.activeBuffer = $root.perfetto.protos.ActiveBufferProto.toObject(message.activeBuffer, options);
                    if (message.queuedFrames != null && message.hasOwnProperty("queuedFrames"))
                        object.queuedFrames = message.queuedFrames;
                    if (message.refreshPending != null && message.hasOwnProperty("refreshPending"))
                        object.refreshPending = message.refreshPending;
                    if (message.hwcFrame != null && message.hasOwnProperty("hwcFrame"))
                        object.hwcFrame = $root.perfetto.protos.RectProto.toObject(message.hwcFrame, options);
                    if (message.hwcCrop != null && message.hasOwnProperty("hwcCrop"))
                        object.hwcCrop = $root.perfetto.protos.FloatRectProto.toObject(message.hwcCrop, options);
                    if (message.hwcTransform != null && message.hasOwnProperty("hwcTransform"))
                        object.hwcTransform = message.hwcTransform;
                    if (message.windowType != null && message.hasOwnProperty("windowType"))
                        object.windowType = message.windowType;
                    if (message.appId != null && message.hasOwnProperty("appId"))
                        object.appId = message.appId;
                    if (message.hwcCompositionType != null && message.hasOwnProperty("hwcCompositionType"))
                        object.hwcCompositionType = options.enums === String ? $root.perfetto.protos.HwcCompositionType[message.hwcCompositionType] === undefined ? message.hwcCompositionType : $root.perfetto.protos.HwcCompositionType[message.hwcCompositionType] : message.hwcCompositionType;
                    if (message.isProtected != null && message.hasOwnProperty("isProtected"))
                        object.isProtected = message.isProtected;
                    if (message.currFrame != null && message.hasOwnProperty("currFrame"))
                        if (typeof message.currFrame === "number")
                            object.currFrame = options.longs === String ? String(message.currFrame) : message.currFrame;
                        else
                            object.currFrame = options.longs === String ? $util.Long.prototype.toString.call(message.currFrame) : options.longs === Number ? new $util.LongBits(message.currFrame.low >>> 0, message.currFrame.high >>> 0).toNumber(true) : message.currFrame;
                    if (message.barrierLayer && message.barrierLayer.length) {
                        object.barrierLayer = [];
                        for (var j = 0; j < message.barrierLayer.length; ++j)
                            object.barrierLayer[j] = $root.perfetto.protos.BarrierLayerProto.toObject(message.barrierLayer[j], options);
                    }
                    if (message.bufferTransform != null && message.hasOwnProperty("bufferTransform"))
                        object.bufferTransform = $root.perfetto.protos.TransformProto.toObject(message.bufferTransform, options);
                    if (message.effectiveScalingMode != null && message.hasOwnProperty("effectiveScalingMode"))
                        object.effectiveScalingMode = message.effectiveScalingMode;
                    if (message.cornerRadius != null && message.hasOwnProperty("cornerRadius"))
                        object.cornerRadius = options.json && !isFinite(message.cornerRadius) ? String(message.cornerRadius) : message.cornerRadius;
                    var keys2;
                    if (message.metadata && (keys2 = Object.keys(message.metadata)).length) {
                        object.metadata = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.metadata[keys2[j]] = message.metadata[keys2[j]];
                    }
                    if (message.effectiveTransform != null && message.hasOwnProperty("effectiveTransform"))
                        object.effectiveTransform = $root.perfetto.protos.TransformProto.toObject(message.effectiveTransform, options);
                    if (message.sourceBounds != null && message.hasOwnProperty("sourceBounds"))
                        object.sourceBounds = $root.perfetto.protos.FloatRectProto.toObject(message.sourceBounds, options);
                    if (message.bounds != null && message.hasOwnProperty("bounds"))
                        object.bounds = $root.perfetto.protos.FloatRectProto.toObject(message.bounds, options);
                    if (message.screenBounds != null && message.hasOwnProperty("screenBounds"))
                        object.screenBounds = $root.perfetto.protos.FloatRectProto.toObject(message.screenBounds, options);
                    if (message.inputWindowInfo != null && message.hasOwnProperty("inputWindowInfo"))
                        object.inputWindowInfo = $root.perfetto.protos.InputWindowInfoProto.toObject(message.inputWindowInfo, options);
                    if (message.cornerRadiusCrop != null && message.hasOwnProperty("cornerRadiusCrop"))
                        object.cornerRadiusCrop = $root.perfetto.protos.FloatRectProto.toObject(message.cornerRadiusCrop, options);
                    if (message.shadowRadius != null && message.hasOwnProperty("shadowRadius"))
                        object.shadowRadius = options.json && !isFinite(message.shadowRadius) ? String(message.shadowRadius) : message.shadowRadius;
                    if (message.colorTransform != null && message.hasOwnProperty("colorTransform"))
                        object.colorTransform = $root.perfetto.protos.ColorTransformProto.toObject(message.colorTransform, options);
                    if (message.isRelativeOf != null && message.hasOwnProperty("isRelativeOf"))
                        object.isRelativeOf = message.isRelativeOf;
                    if (message.backgroundBlurRadius != null && message.hasOwnProperty("backgroundBlurRadius"))
                        object.backgroundBlurRadius = message.backgroundBlurRadius;
                    if (message.ownerUid != null && message.hasOwnProperty("ownerUid"))
                        object.ownerUid = message.ownerUid;
                    if (message.blurRegions && message.blurRegions.length) {
                        object.blurRegions = [];
                        for (var j = 0; j < message.blurRegions.length; ++j)
                            object.blurRegions[j] = $root.perfetto.protos.BlurRegion.toObject(message.blurRegions[j], options);
                    }
                    if (message.isTrustedOverlay != null && message.hasOwnProperty("isTrustedOverlay"))
                        object.isTrustedOverlay = message.isTrustedOverlay;
                    if (message.requestedCornerRadius != null && message.hasOwnProperty("requestedCornerRadius"))
                        object.requestedCornerRadius = options.json && !isFinite(message.requestedCornerRadius) ? String(message.requestedCornerRadius) : message.requestedCornerRadius;
                    if (message.destinationFrame != null && message.hasOwnProperty("destinationFrame"))
                        object.destinationFrame = $root.perfetto.protos.RectProto.toObject(message.destinationFrame, options);
                    if (message.originalId != null && message.hasOwnProperty("originalId"))
                        object.originalId = message.originalId;
                    if (message.trustedOverlay != null && message.hasOwnProperty("trustedOverlay"))
                        object.trustedOverlay = options.enums === String ? $root.perfetto.protos.TrustedOverlay[message.trustedOverlay] === undefined ? message.trustedOverlay : $root.perfetto.protos.TrustedOverlay[message.trustedOverlay] : message.trustedOverlay;
                    return object;
                };
    
                /**
                 * Converts this LayerProto to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.LayerProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                LayerProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for LayerProto
                 * @function getTypeUrl
                 * @memberof perfetto.protos.LayerProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                LayerProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.LayerProto";
                };
    
                return LayerProto;
            })();
    
            protos.PositionProto = (function() {
    
                /**
                 * Properties of a PositionProto.
                 * @memberof perfetto.protos
                 * @interface IPositionProto
                 * @property {number|null} [x] PositionProto x
                 * @property {number|null} [y] PositionProto y
                 */
    
                /**
                 * Constructs a new PositionProto.
                 * @memberof perfetto.protos
                 * @classdesc Represents a PositionProto.
                 * @implements IPositionProto
                 * @constructor
                 * @param {perfetto.protos.IPositionProto=} [properties] Properties to set
                 */
                function PositionProto(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * PositionProto x.
                 * @member {number} x
                 * @memberof perfetto.protos.PositionProto
                 * @instance
                 */
                PositionProto.prototype.x = 0;
    
                /**
                 * PositionProto y.
                 * @member {number} y
                 * @memberof perfetto.protos.PositionProto
                 * @instance
                 */
                PositionProto.prototype.y = 0;
    
                /**
                 * Creates a new PositionProto instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.PositionProto
                 * @static
                 * @param {perfetto.protos.IPositionProto=} [properties] Properties to set
                 * @returns {perfetto.protos.PositionProto} PositionProto instance
                 */
                PositionProto.create = function create(properties) {
                    return new PositionProto(properties);
                };
    
                /**
                 * Encodes the specified PositionProto message. Does not implicitly {@link perfetto.protos.PositionProto.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.PositionProto
                 * @static
                 * @param {perfetto.protos.IPositionProto} message PositionProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PositionProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                        writer.uint32(/* id 1, wireType 5 =*/13).float(message.x);
                    if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                        writer.uint32(/* id 2, wireType 5 =*/21).float(message.y);
                    return writer;
                };
    
                /**
                 * Encodes the specified PositionProto message, length delimited. Does not implicitly {@link perfetto.protos.PositionProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.PositionProto
                 * @static
                 * @param {perfetto.protos.IPositionProto} message PositionProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PositionProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a PositionProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.PositionProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.PositionProto} PositionProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                PositionProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.PositionProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.x = reader.float();
                                break;
                            }
                        case 2: {
                                message.y = reader.float();
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
                 * Decodes a PositionProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.PositionProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.PositionProto} PositionProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                PositionProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a PositionProto message.
                 * @function verify
                 * @memberof perfetto.protos.PositionProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                PositionProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.x != null && message.hasOwnProperty("x"))
                        if (typeof message.x !== "number")
                            return "x: number expected";
                    if (message.y != null && message.hasOwnProperty("y"))
                        if (typeof message.y !== "number")
                            return "y: number expected";
                    return null;
                };
    
                /**
                 * Creates a PositionProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.PositionProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.PositionProto} PositionProto
                 */
                PositionProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.PositionProto)
                        return object;
                    var message = new $root.perfetto.protos.PositionProto();
                    if (object.x != null)
                        message.x = Number(object.x);
                    if (object.y != null)
                        message.y = Number(object.y);
                    return message;
                };
    
                /**
                 * Creates a plain object from a PositionProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.PositionProto
                 * @static
                 * @param {perfetto.protos.PositionProto} message PositionProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                PositionProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.x = 0;
                        object.y = 0;
                    }
                    if (message.x != null && message.hasOwnProperty("x"))
                        object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
                    if (message.y != null && message.hasOwnProperty("y"))
                        object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
                    return object;
                };
    
                /**
                 * Converts this PositionProto to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.PositionProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                PositionProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for PositionProto
                 * @function getTypeUrl
                 * @memberof perfetto.protos.PositionProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                PositionProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.PositionProto";
                };
    
                return PositionProto;
            })();
    
            protos.FloatRectProto = (function() {
    
                /**
                 * Properties of a FloatRectProto.
                 * @memberof perfetto.protos
                 * @interface IFloatRectProto
                 * @property {number|null} [left] FloatRectProto left
                 * @property {number|null} [top] FloatRectProto top
                 * @property {number|null} [right] FloatRectProto right
                 * @property {number|null} [bottom] FloatRectProto bottom
                 */
    
                /**
                 * Constructs a new FloatRectProto.
                 * @memberof perfetto.protos
                 * @classdesc Represents a FloatRectProto.
                 * @implements IFloatRectProto
                 * @constructor
                 * @param {perfetto.protos.IFloatRectProto=} [properties] Properties to set
                 */
                function FloatRectProto(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * FloatRectProto left.
                 * @member {number} left
                 * @memberof perfetto.protos.FloatRectProto
                 * @instance
                 */
                FloatRectProto.prototype.left = 0;
    
                /**
                 * FloatRectProto top.
                 * @member {number} top
                 * @memberof perfetto.protos.FloatRectProto
                 * @instance
                 */
                FloatRectProto.prototype.top = 0;
    
                /**
                 * FloatRectProto right.
                 * @member {number} right
                 * @memberof perfetto.protos.FloatRectProto
                 * @instance
                 */
                FloatRectProto.prototype.right = 0;
    
                /**
                 * FloatRectProto bottom.
                 * @member {number} bottom
                 * @memberof perfetto.protos.FloatRectProto
                 * @instance
                 */
                FloatRectProto.prototype.bottom = 0;
    
                /**
                 * Creates a new FloatRectProto instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.FloatRectProto
                 * @static
                 * @param {perfetto.protos.IFloatRectProto=} [properties] Properties to set
                 * @returns {perfetto.protos.FloatRectProto} FloatRectProto instance
                 */
                FloatRectProto.create = function create(properties) {
                    return new FloatRectProto(properties);
                };
    
                /**
                 * Encodes the specified FloatRectProto message. Does not implicitly {@link perfetto.protos.FloatRectProto.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.FloatRectProto
                 * @static
                 * @param {perfetto.protos.IFloatRectProto} message FloatRectProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                FloatRectProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.left != null && Object.hasOwnProperty.call(message, "left"))
                        writer.uint32(/* id 1, wireType 5 =*/13).float(message.left);
                    if (message.top != null && Object.hasOwnProperty.call(message, "top"))
                        writer.uint32(/* id 2, wireType 5 =*/21).float(message.top);
                    if (message.right != null && Object.hasOwnProperty.call(message, "right"))
                        writer.uint32(/* id 3, wireType 5 =*/29).float(message.right);
                    if (message.bottom != null && Object.hasOwnProperty.call(message, "bottom"))
                        writer.uint32(/* id 4, wireType 5 =*/37).float(message.bottom);
                    return writer;
                };
    
                /**
                 * Encodes the specified FloatRectProto message, length delimited. Does not implicitly {@link perfetto.protos.FloatRectProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.FloatRectProto
                 * @static
                 * @param {perfetto.protos.IFloatRectProto} message FloatRectProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                FloatRectProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a FloatRectProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.FloatRectProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.FloatRectProto} FloatRectProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                FloatRectProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.FloatRectProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.left = reader.float();
                                break;
                            }
                        case 2: {
                                message.top = reader.float();
                                break;
                            }
                        case 3: {
                                message.right = reader.float();
                                break;
                            }
                        case 4: {
                                message.bottom = reader.float();
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
                 * Decodes a FloatRectProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.FloatRectProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.FloatRectProto} FloatRectProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                FloatRectProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a FloatRectProto message.
                 * @function verify
                 * @memberof perfetto.protos.FloatRectProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                FloatRectProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.left != null && message.hasOwnProperty("left"))
                        if (typeof message.left !== "number")
                            return "left: number expected";
                    if (message.top != null && message.hasOwnProperty("top"))
                        if (typeof message.top !== "number")
                            return "top: number expected";
                    if (message.right != null && message.hasOwnProperty("right"))
                        if (typeof message.right !== "number")
                            return "right: number expected";
                    if (message.bottom != null && message.hasOwnProperty("bottom"))
                        if (typeof message.bottom !== "number")
                            return "bottom: number expected";
                    return null;
                };
    
                /**
                 * Creates a FloatRectProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.FloatRectProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.FloatRectProto} FloatRectProto
                 */
                FloatRectProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.FloatRectProto)
                        return object;
                    var message = new $root.perfetto.protos.FloatRectProto();
                    if (object.left != null)
                        message.left = Number(object.left);
                    if (object.top != null)
                        message.top = Number(object.top);
                    if (object.right != null)
                        message.right = Number(object.right);
                    if (object.bottom != null)
                        message.bottom = Number(object.bottom);
                    return message;
                };
    
                /**
                 * Creates a plain object from a FloatRectProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.FloatRectProto
                 * @static
                 * @param {perfetto.protos.FloatRectProto} message FloatRectProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                FloatRectProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.left = 0;
                        object.top = 0;
                        object.right = 0;
                        object.bottom = 0;
                    }
                    if (message.left != null && message.hasOwnProperty("left"))
                        object.left = options.json && !isFinite(message.left) ? String(message.left) : message.left;
                    if (message.top != null && message.hasOwnProperty("top"))
                        object.top = options.json && !isFinite(message.top) ? String(message.top) : message.top;
                    if (message.right != null && message.hasOwnProperty("right"))
                        object.right = options.json && !isFinite(message.right) ? String(message.right) : message.right;
                    if (message.bottom != null && message.hasOwnProperty("bottom"))
                        object.bottom = options.json && !isFinite(message.bottom) ? String(message.bottom) : message.bottom;
                    return object;
                };
    
                /**
                 * Converts this FloatRectProto to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.FloatRectProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                FloatRectProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for FloatRectProto
                 * @function getTypeUrl
                 * @memberof perfetto.protos.FloatRectProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                FloatRectProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.FloatRectProto";
                };
    
                return FloatRectProto;
            })();
    
            protos.ActiveBufferProto = (function() {
    
                /**
                 * Properties of an ActiveBufferProto.
                 * @memberof perfetto.protos
                 * @interface IActiveBufferProto
                 * @property {number|null} [width] ActiveBufferProto width
                 * @property {number|null} [height] ActiveBufferProto height
                 * @property {number|null} [stride] ActiveBufferProto stride
                 * @property {number|null} [format] ActiveBufferProto format
                 * @property {Long|null} [usage] ActiveBufferProto usage
                 */
    
                /**
                 * Constructs a new ActiveBufferProto.
                 * @memberof perfetto.protos
                 * @classdesc Represents an ActiveBufferProto.
                 * @implements IActiveBufferProto
                 * @constructor
                 * @param {perfetto.protos.IActiveBufferProto=} [properties] Properties to set
                 */
                function ActiveBufferProto(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ActiveBufferProto width.
                 * @member {number} width
                 * @memberof perfetto.protos.ActiveBufferProto
                 * @instance
                 */
                ActiveBufferProto.prototype.width = 0;
    
                /**
                 * ActiveBufferProto height.
                 * @member {number} height
                 * @memberof perfetto.protos.ActiveBufferProto
                 * @instance
                 */
                ActiveBufferProto.prototype.height = 0;
    
                /**
                 * ActiveBufferProto stride.
                 * @member {number} stride
                 * @memberof perfetto.protos.ActiveBufferProto
                 * @instance
                 */
                ActiveBufferProto.prototype.stride = 0;
    
                /**
                 * ActiveBufferProto format.
                 * @member {number} format
                 * @memberof perfetto.protos.ActiveBufferProto
                 * @instance
                 */
                ActiveBufferProto.prototype.format = 0;
    
                /**
                 * ActiveBufferProto usage.
                 * @member {Long} usage
                 * @memberof perfetto.protos.ActiveBufferProto
                 * @instance
                 */
                ActiveBufferProto.prototype.usage = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                /**
                 * Creates a new ActiveBufferProto instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.ActiveBufferProto
                 * @static
                 * @param {perfetto.protos.IActiveBufferProto=} [properties] Properties to set
                 * @returns {perfetto.protos.ActiveBufferProto} ActiveBufferProto instance
                 */
                ActiveBufferProto.create = function create(properties) {
                    return new ActiveBufferProto(properties);
                };
    
                /**
                 * Encodes the specified ActiveBufferProto message. Does not implicitly {@link perfetto.protos.ActiveBufferProto.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.ActiveBufferProto
                 * @static
                 * @param {perfetto.protos.IActiveBufferProto} message ActiveBufferProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ActiveBufferProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.width);
                    if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                        writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.height);
                    if (message.stride != null && Object.hasOwnProperty.call(message, "stride"))
                        writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.stride);
                    if (message.format != null && Object.hasOwnProperty.call(message, "format"))
                        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.format);
                    if (message.usage != null && Object.hasOwnProperty.call(message, "usage"))
                        writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.usage);
                    return writer;
                };
    
                /**
                 * Encodes the specified ActiveBufferProto message, length delimited. Does not implicitly {@link perfetto.protos.ActiveBufferProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.ActiveBufferProto
                 * @static
                 * @param {perfetto.protos.IActiveBufferProto} message ActiveBufferProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ActiveBufferProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an ActiveBufferProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.ActiveBufferProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.ActiveBufferProto} ActiveBufferProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ActiveBufferProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.ActiveBufferProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.width = reader.uint32();
                                break;
                            }
                        case 2: {
                                message.height = reader.uint32();
                                break;
                            }
                        case 3: {
                                message.stride = reader.uint32();
                                break;
                            }
                        case 4: {
                                message.format = reader.int32();
                                break;
                            }
                        case 5: {
                                message.usage = reader.uint64();
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
                 * Decodes an ActiveBufferProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.ActiveBufferProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.ActiveBufferProto} ActiveBufferProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ActiveBufferProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies an ActiveBufferProto message.
                 * @function verify
                 * @memberof perfetto.protos.ActiveBufferProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ActiveBufferProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.width != null && message.hasOwnProperty("width"))
                        if (!$util.isInteger(message.width))
                            return "width: integer expected";
                    if (message.height != null && message.hasOwnProperty("height"))
                        if (!$util.isInteger(message.height))
                            return "height: integer expected";
                    if (message.stride != null && message.hasOwnProperty("stride"))
                        if (!$util.isInteger(message.stride))
                            return "stride: integer expected";
                    if (message.format != null && message.hasOwnProperty("format"))
                        if (!$util.isInteger(message.format))
                            return "format: integer expected";
                    if (message.usage != null && message.hasOwnProperty("usage"))
                        if (!$util.isInteger(message.usage) && !(message.usage && $util.isInteger(message.usage.low) && $util.isInteger(message.usage.high)))
                            return "usage: integer|Long expected";
                    return null;
                };
    
                /**
                 * Creates an ActiveBufferProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.ActiveBufferProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.ActiveBufferProto} ActiveBufferProto
                 */
                ActiveBufferProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.ActiveBufferProto)
                        return object;
                    var message = new $root.perfetto.protos.ActiveBufferProto();
                    if (object.width != null)
                        message.width = object.width >>> 0;
                    if (object.height != null)
                        message.height = object.height >>> 0;
                    if (object.stride != null)
                        message.stride = object.stride >>> 0;
                    if (object.format != null)
                        message.format = object.format | 0;
                    if (object.usage != null)
                        if ($util.Long)
                            (message.usage = $util.Long.fromValue(object.usage)).unsigned = true;
                        else if (typeof object.usage === "string")
                            message.usage = parseInt(object.usage, 10);
                        else if (typeof object.usage === "number")
                            message.usage = object.usage;
                        else if (typeof object.usage === "object")
                            message.usage = new $util.LongBits(object.usage.low >>> 0, object.usage.high >>> 0).toNumber(true);
                    return message;
                };
    
                /**
                 * Creates a plain object from an ActiveBufferProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.ActiveBufferProto
                 * @static
                 * @param {perfetto.protos.ActiveBufferProto} message ActiveBufferProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ActiveBufferProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.width = 0;
                        object.height = 0;
                        object.stride = 0;
                        object.format = 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.usage = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.usage = options.longs === String ? "0" : 0;
                    }
                    if (message.width != null && message.hasOwnProperty("width"))
                        object.width = message.width;
                    if (message.height != null && message.hasOwnProperty("height"))
                        object.height = message.height;
                    if (message.stride != null && message.hasOwnProperty("stride"))
                        object.stride = message.stride;
                    if (message.format != null && message.hasOwnProperty("format"))
                        object.format = message.format;
                    if (message.usage != null && message.hasOwnProperty("usage"))
                        if (typeof message.usage === "number")
                            object.usage = options.longs === String ? String(message.usage) : message.usage;
                        else
                            object.usage = options.longs === String ? $util.Long.prototype.toString.call(message.usage) : options.longs === Number ? new $util.LongBits(message.usage.low >>> 0, message.usage.high >>> 0).toNumber(true) : message.usage;
                    return object;
                };
    
                /**
                 * Converts this ActiveBufferProto to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.ActiveBufferProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ActiveBufferProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for ActiveBufferProto
                 * @function getTypeUrl
                 * @memberof perfetto.protos.ActiveBufferProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                ActiveBufferProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.ActiveBufferProto";
                };
    
                return ActiveBufferProto;
            })();
    
            protos.BarrierLayerProto = (function() {
    
                /**
                 * Properties of a BarrierLayerProto.
                 * @memberof perfetto.protos
                 * @interface IBarrierLayerProto
                 * @property {number|null} [id] BarrierLayerProto id
                 * @property {Long|null} [frameNumber] BarrierLayerProto frameNumber
                 */
    
                /**
                 * Constructs a new BarrierLayerProto.
                 * @memberof perfetto.protos
                 * @classdesc Represents a BarrierLayerProto.
                 * @implements IBarrierLayerProto
                 * @constructor
                 * @param {perfetto.protos.IBarrierLayerProto=} [properties] Properties to set
                 */
                function BarrierLayerProto(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * BarrierLayerProto id.
                 * @member {number} id
                 * @memberof perfetto.protos.BarrierLayerProto
                 * @instance
                 */
                BarrierLayerProto.prototype.id = 0;
    
                /**
                 * BarrierLayerProto frameNumber.
                 * @member {Long} frameNumber
                 * @memberof perfetto.protos.BarrierLayerProto
                 * @instance
                 */
                BarrierLayerProto.prototype.frameNumber = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                /**
                 * Creates a new BarrierLayerProto instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.BarrierLayerProto
                 * @static
                 * @param {perfetto.protos.IBarrierLayerProto=} [properties] Properties to set
                 * @returns {perfetto.protos.BarrierLayerProto} BarrierLayerProto instance
                 */
                BarrierLayerProto.create = function create(properties) {
                    return new BarrierLayerProto(properties);
                };
    
                /**
                 * Encodes the specified BarrierLayerProto message. Does not implicitly {@link perfetto.protos.BarrierLayerProto.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.BarrierLayerProto
                 * @static
                 * @param {perfetto.protos.IBarrierLayerProto} message BarrierLayerProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                BarrierLayerProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
                    if (message.frameNumber != null && Object.hasOwnProperty.call(message, "frameNumber"))
                        writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.frameNumber);
                    return writer;
                };
    
                /**
                 * Encodes the specified BarrierLayerProto message, length delimited. Does not implicitly {@link perfetto.protos.BarrierLayerProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.BarrierLayerProto
                 * @static
                 * @param {perfetto.protos.IBarrierLayerProto} message BarrierLayerProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                BarrierLayerProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a BarrierLayerProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.BarrierLayerProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.BarrierLayerProto} BarrierLayerProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                BarrierLayerProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.BarrierLayerProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.id = reader.int32();
                                break;
                            }
                        case 2: {
                                message.frameNumber = reader.uint64();
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
                 * Decodes a BarrierLayerProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.BarrierLayerProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.BarrierLayerProto} BarrierLayerProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                BarrierLayerProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a BarrierLayerProto message.
                 * @function verify
                 * @memberof perfetto.protos.BarrierLayerProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                BarrierLayerProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isInteger(message.id))
                            return "id: integer expected";
                    if (message.frameNumber != null && message.hasOwnProperty("frameNumber"))
                        if (!$util.isInteger(message.frameNumber) && !(message.frameNumber && $util.isInteger(message.frameNumber.low) && $util.isInteger(message.frameNumber.high)))
                            return "frameNumber: integer|Long expected";
                    return null;
                };
    
                /**
                 * Creates a BarrierLayerProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.BarrierLayerProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.BarrierLayerProto} BarrierLayerProto
                 */
                BarrierLayerProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.BarrierLayerProto)
                        return object;
                    var message = new $root.perfetto.protos.BarrierLayerProto();
                    if (object.id != null)
                        message.id = object.id | 0;
                    if (object.frameNumber != null)
                        if ($util.Long)
                            (message.frameNumber = $util.Long.fromValue(object.frameNumber)).unsigned = true;
                        else if (typeof object.frameNumber === "string")
                            message.frameNumber = parseInt(object.frameNumber, 10);
                        else if (typeof object.frameNumber === "number")
                            message.frameNumber = object.frameNumber;
                        else if (typeof object.frameNumber === "object")
                            message.frameNumber = new $util.LongBits(object.frameNumber.low >>> 0, object.frameNumber.high >>> 0).toNumber(true);
                    return message;
                };
    
                /**
                 * Creates a plain object from a BarrierLayerProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.BarrierLayerProto
                 * @static
                 * @param {perfetto.protos.BarrierLayerProto} message BarrierLayerProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                BarrierLayerProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.id = 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.frameNumber = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.frameNumber = options.longs === String ? "0" : 0;
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.frameNumber != null && message.hasOwnProperty("frameNumber"))
                        if (typeof message.frameNumber === "number")
                            object.frameNumber = options.longs === String ? String(message.frameNumber) : message.frameNumber;
                        else
                            object.frameNumber = options.longs === String ? $util.Long.prototype.toString.call(message.frameNumber) : options.longs === Number ? new $util.LongBits(message.frameNumber.low >>> 0, message.frameNumber.high >>> 0).toNumber(true) : message.frameNumber;
                    return object;
                };
    
                /**
                 * Converts this BarrierLayerProto to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.BarrierLayerProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                BarrierLayerProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for BarrierLayerProto
                 * @function getTypeUrl
                 * @memberof perfetto.protos.BarrierLayerProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                BarrierLayerProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.BarrierLayerProto";
                };
    
                return BarrierLayerProto;
            })();
    
            protos.RegionProto = (function() {
    
                /**
                 * Properties of a RegionProto.
                 * @memberof perfetto.protos
                 * @interface IRegionProto
                 * @property {Array.<perfetto.protos.IRectProto>|null} [rect] RegionProto rect
                 */
    
                /**
                 * Constructs a new RegionProto.
                 * @memberof perfetto.protos
                 * @classdesc Represents a RegionProto.
                 * @implements IRegionProto
                 * @constructor
                 * @param {perfetto.protos.IRegionProto=} [properties] Properties to set
                 */
                function RegionProto(properties) {
                    this.rect = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * RegionProto rect.
                 * @member {Array.<perfetto.protos.IRectProto>} rect
                 * @memberof perfetto.protos.RegionProto
                 * @instance
                 */
                RegionProto.prototype.rect = $util.emptyArray;
    
                /**
                 * Creates a new RegionProto instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.RegionProto
                 * @static
                 * @param {perfetto.protos.IRegionProto=} [properties] Properties to set
                 * @returns {perfetto.protos.RegionProto} RegionProto instance
                 */
                RegionProto.create = function create(properties) {
                    return new RegionProto(properties);
                };
    
                /**
                 * Encodes the specified RegionProto message. Does not implicitly {@link perfetto.protos.RegionProto.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.RegionProto
                 * @static
                 * @param {perfetto.protos.IRegionProto} message RegionProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                RegionProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.rect != null && message.rect.length)
                        for (var i = 0; i < message.rect.length; ++i)
                            $root.perfetto.protos.RectProto.encode(message.rect[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified RegionProto message, length delimited. Does not implicitly {@link perfetto.protos.RegionProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.RegionProto
                 * @static
                 * @param {perfetto.protos.IRegionProto} message RegionProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                RegionProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a RegionProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.RegionProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.RegionProto} RegionProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                RegionProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.RegionProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 2: {
                                if (!(message.rect && message.rect.length))
                                    message.rect = [];
                                message.rect.push($root.perfetto.protos.RectProto.decode(reader, reader.uint32()));
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
                 * Decodes a RegionProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.RegionProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.RegionProto} RegionProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                RegionProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a RegionProto message.
                 * @function verify
                 * @memberof perfetto.protos.RegionProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                RegionProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.rect != null && message.hasOwnProperty("rect")) {
                        if (!Array.isArray(message.rect))
                            return "rect: array expected";
                        for (var i = 0; i < message.rect.length; ++i) {
                            var error = $root.perfetto.protos.RectProto.verify(message.rect[i]);
                            if (error)
                                return "rect." + error;
                        }
                    }
                    return null;
                };
    
                /**
                 * Creates a RegionProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.RegionProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.RegionProto} RegionProto
                 */
                RegionProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.RegionProto)
                        return object;
                    var message = new $root.perfetto.protos.RegionProto();
                    if (object.rect) {
                        if (!Array.isArray(object.rect))
                            throw TypeError(".perfetto.protos.RegionProto.rect: array expected");
                        message.rect = [];
                        for (var i = 0; i < object.rect.length; ++i) {
                            if (typeof object.rect[i] !== "object")
                                throw TypeError(".perfetto.protos.RegionProto.rect: object expected");
                            message.rect[i] = $root.perfetto.protos.RectProto.fromObject(object.rect[i]);
                        }
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from a RegionProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.RegionProto
                 * @static
                 * @param {perfetto.protos.RegionProto} message RegionProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                RegionProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.rect = [];
                    if (message.rect && message.rect.length) {
                        object.rect = [];
                        for (var j = 0; j < message.rect.length; ++j)
                            object.rect[j] = $root.perfetto.protos.RectProto.toObject(message.rect[j], options);
                    }
                    return object;
                };
    
                /**
                 * Converts this RegionProto to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.RegionProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                RegionProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for RegionProto
                 * @function getTypeUrl
                 * @memberof perfetto.protos.RegionProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                RegionProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.RegionProto";
                };
    
                return RegionProto;
            })();
    
            protos.SizeProto = (function() {
    
                /**
                 * Properties of a SizeProto.
                 * @memberof perfetto.protos
                 * @interface ISizeProto
                 * @property {number|null} [w] SizeProto w
                 * @property {number|null} [h] SizeProto h
                 */
    
                /**
                 * Constructs a new SizeProto.
                 * @memberof perfetto.protos
                 * @classdesc Represents a SizeProto.
                 * @implements ISizeProto
                 * @constructor
                 * @param {perfetto.protos.ISizeProto=} [properties] Properties to set
                 */
                function SizeProto(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * SizeProto w.
                 * @member {number} w
                 * @memberof perfetto.protos.SizeProto
                 * @instance
                 */
                SizeProto.prototype.w = 0;
    
                /**
                 * SizeProto h.
                 * @member {number} h
                 * @memberof perfetto.protos.SizeProto
                 * @instance
                 */
                SizeProto.prototype.h = 0;
    
                /**
                 * Creates a new SizeProto instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.SizeProto
                 * @static
                 * @param {perfetto.protos.ISizeProto=} [properties] Properties to set
                 * @returns {perfetto.protos.SizeProto} SizeProto instance
                 */
                SizeProto.create = function create(properties) {
                    return new SizeProto(properties);
                };
    
                /**
                 * Encodes the specified SizeProto message. Does not implicitly {@link perfetto.protos.SizeProto.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.SizeProto
                 * @static
                 * @param {perfetto.protos.ISizeProto} message SizeProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SizeProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.w != null && Object.hasOwnProperty.call(message, "w"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.w);
                    if (message.h != null && Object.hasOwnProperty.call(message, "h"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.h);
                    return writer;
                };
    
                /**
                 * Encodes the specified SizeProto message, length delimited. Does not implicitly {@link perfetto.protos.SizeProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.SizeProto
                 * @static
                 * @param {perfetto.protos.ISizeProto} message SizeProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SizeProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a SizeProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.SizeProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.SizeProto} SizeProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                SizeProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.SizeProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.w = reader.int32();
                                break;
                            }
                        case 2: {
                                message.h = reader.int32();
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
                 * Decodes a SizeProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.SizeProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.SizeProto} SizeProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                SizeProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a SizeProto message.
                 * @function verify
                 * @memberof perfetto.protos.SizeProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                SizeProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.w != null && message.hasOwnProperty("w"))
                        if (!$util.isInteger(message.w))
                            return "w: integer expected";
                    if (message.h != null && message.hasOwnProperty("h"))
                        if (!$util.isInteger(message.h))
                            return "h: integer expected";
                    return null;
                };
    
                /**
                 * Creates a SizeProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.SizeProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.SizeProto} SizeProto
                 */
                SizeProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.SizeProto)
                        return object;
                    var message = new $root.perfetto.protos.SizeProto();
                    if (object.w != null)
                        message.w = object.w | 0;
                    if (object.h != null)
                        message.h = object.h | 0;
                    return message;
                };
    
                /**
                 * Creates a plain object from a SizeProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.SizeProto
                 * @static
                 * @param {perfetto.protos.SizeProto} message SizeProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                SizeProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.w = 0;
                        object.h = 0;
                    }
                    if (message.w != null && message.hasOwnProperty("w"))
                        object.w = message.w;
                    if (message.h != null && message.hasOwnProperty("h"))
                        object.h = message.h;
                    return object;
                };
    
                /**
                 * Converts this SizeProto to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.SizeProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                SizeProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for SizeProto
                 * @function getTypeUrl
                 * @memberof perfetto.protos.SizeProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                SizeProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.SizeProto";
                };
    
                return SizeProto;
            })();
    
            protos.TransformProto = (function() {
    
                /**
                 * Properties of a TransformProto.
                 * @memberof perfetto.protos
                 * @interface ITransformProto
                 * @property {number|null} [dsdx] TransformProto dsdx
                 * @property {number|null} [dtdx] TransformProto dtdx
                 * @property {number|null} [dsdy] TransformProto dsdy
                 * @property {number|null} [dtdy] TransformProto dtdy
                 * @property {number|null} [type] TransformProto type
                 */
    
                /**
                 * Constructs a new TransformProto.
                 * @memberof perfetto.protos
                 * @classdesc Represents a TransformProto.
                 * @implements ITransformProto
                 * @constructor
                 * @param {perfetto.protos.ITransformProto=} [properties] Properties to set
                 */
                function TransformProto(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * TransformProto dsdx.
                 * @member {number} dsdx
                 * @memberof perfetto.protos.TransformProto
                 * @instance
                 */
                TransformProto.prototype.dsdx = 0;
    
                /**
                 * TransformProto dtdx.
                 * @member {number} dtdx
                 * @memberof perfetto.protos.TransformProto
                 * @instance
                 */
                TransformProto.prototype.dtdx = 0;
    
                /**
                 * TransformProto dsdy.
                 * @member {number} dsdy
                 * @memberof perfetto.protos.TransformProto
                 * @instance
                 */
                TransformProto.prototype.dsdy = 0;
    
                /**
                 * TransformProto dtdy.
                 * @member {number} dtdy
                 * @memberof perfetto.protos.TransformProto
                 * @instance
                 */
                TransformProto.prototype.dtdy = 0;
    
                /**
                 * TransformProto type.
                 * @member {number} type
                 * @memberof perfetto.protos.TransformProto
                 * @instance
                 */
                TransformProto.prototype.type = 0;
    
                /**
                 * Creates a new TransformProto instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.TransformProto
                 * @static
                 * @param {perfetto.protos.ITransformProto=} [properties] Properties to set
                 * @returns {perfetto.protos.TransformProto} TransformProto instance
                 */
                TransformProto.create = function create(properties) {
                    return new TransformProto(properties);
                };
    
                /**
                 * Encodes the specified TransformProto message. Does not implicitly {@link perfetto.protos.TransformProto.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.TransformProto
                 * @static
                 * @param {perfetto.protos.ITransformProto} message TransformProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                TransformProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.dsdx != null && Object.hasOwnProperty.call(message, "dsdx"))
                        writer.uint32(/* id 1, wireType 5 =*/13).float(message.dsdx);
                    if (message.dtdx != null && Object.hasOwnProperty.call(message, "dtdx"))
                        writer.uint32(/* id 2, wireType 5 =*/21).float(message.dtdx);
                    if (message.dsdy != null && Object.hasOwnProperty.call(message, "dsdy"))
                        writer.uint32(/* id 3, wireType 5 =*/29).float(message.dsdy);
                    if (message.dtdy != null && Object.hasOwnProperty.call(message, "dtdy"))
                        writer.uint32(/* id 4, wireType 5 =*/37).float(message.dtdy);
                    if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.type);
                    return writer;
                };
    
                /**
                 * Encodes the specified TransformProto message, length delimited. Does not implicitly {@link perfetto.protos.TransformProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.TransformProto
                 * @static
                 * @param {perfetto.protos.ITransformProto} message TransformProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                TransformProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a TransformProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.TransformProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.TransformProto} TransformProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                TransformProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.TransformProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.dsdx = reader.float();
                                break;
                            }
                        case 2: {
                                message.dtdx = reader.float();
                                break;
                            }
                        case 3: {
                                message.dsdy = reader.float();
                                break;
                            }
                        case 4: {
                                message.dtdy = reader.float();
                                break;
                            }
                        case 5: {
                                message.type = reader.int32();
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
                 * Decodes a TransformProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.TransformProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.TransformProto} TransformProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                TransformProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a TransformProto message.
                 * @function verify
                 * @memberof perfetto.protos.TransformProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                TransformProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.dsdx != null && message.hasOwnProperty("dsdx"))
                        if (typeof message.dsdx !== "number")
                            return "dsdx: number expected";
                    if (message.dtdx != null && message.hasOwnProperty("dtdx"))
                        if (typeof message.dtdx !== "number")
                            return "dtdx: number expected";
                    if (message.dsdy != null && message.hasOwnProperty("dsdy"))
                        if (typeof message.dsdy !== "number")
                            return "dsdy: number expected";
                    if (message.dtdy != null && message.hasOwnProperty("dtdy"))
                        if (typeof message.dtdy !== "number")
                            return "dtdy: number expected";
                    if (message.type != null && message.hasOwnProperty("type"))
                        if (!$util.isInteger(message.type))
                            return "type: integer expected";
                    return null;
                };
    
                /**
                 * Creates a TransformProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.TransformProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.TransformProto} TransformProto
                 */
                TransformProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.TransformProto)
                        return object;
                    var message = new $root.perfetto.protos.TransformProto();
                    if (object.dsdx != null)
                        message.dsdx = Number(object.dsdx);
                    if (object.dtdx != null)
                        message.dtdx = Number(object.dtdx);
                    if (object.dsdy != null)
                        message.dsdy = Number(object.dsdy);
                    if (object.dtdy != null)
                        message.dtdy = Number(object.dtdy);
                    if (object.type != null)
                        message.type = object.type | 0;
                    return message;
                };
    
                /**
                 * Creates a plain object from a TransformProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.TransformProto
                 * @static
                 * @param {perfetto.protos.TransformProto} message TransformProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                TransformProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.dsdx = 0;
                        object.dtdx = 0;
                        object.dsdy = 0;
                        object.dtdy = 0;
                        object.type = 0;
                    }
                    if (message.dsdx != null && message.hasOwnProperty("dsdx"))
                        object.dsdx = options.json && !isFinite(message.dsdx) ? String(message.dsdx) : message.dsdx;
                    if (message.dtdx != null && message.hasOwnProperty("dtdx"))
                        object.dtdx = options.json && !isFinite(message.dtdx) ? String(message.dtdx) : message.dtdx;
                    if (message.dsdy != null && message.hasOwnProperty("dsdy"))
                        object.dsdy = options.json && !isFinite(message.dsdy) ? String(message.dsdy) : message.dsdy;
                    if (message.dtdy != null && message.hasOwnProperty("dtdy"))
                        object.dtdy = options.json && !isFinite(message.dtdy) ? String(message.dtdy) : message.dtdy;
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = message.type;
                    return object;
                };
    
                /**
                 * Converts this TransformProto to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.TransformProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                TransformProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for TransformProto
                 * @function getTypeUrl
                 * @memberof perfetto.protos.TransformProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                TransformProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.TransformProto";
                };
    
                return TransformProto;
            })();
    
            protos.ColorProto = (function() {
    
                /**
                 * Properties of a ColorProto.
                 * @memberof perfetto.protos
                 * @interface IColorProto
                 * @property {number|null} [r] ColorProto r
                 * @property {number|null} [g] ColorProto g
                 * @property {number|null} [b] ColorProto b
                 * @property {number|null} [a] ColorProto a
                 */
    
                /**
                 * Constructs a new ColorProto.
                 * @memberof perfetto.protos
                 * @classdesc Represents a ColorProto.
                 * @implements IColorProto
                 * @constructor
                 * @param {perfetto.protos.IColorProto=} [properties] Properties to set
                 */
                function ColorProto(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ColorProto r.
                 * @member {number} r
                 * @memberof perfetto.protos.ColorProto
                 * @instance
                 */
                ColorProto.prototype.r = 0;
    
                /**
                 * ColorProto g.
                 * @member {number} g
                 * @memberof perfetto.protos.ColorProto
                 * @instance
                 */
                ColorProto.prototype.g = 0;
    
                /**
                 * ColorProto b.
                 * @member {number} b
                 * @memberof perfetto.protos.ColorProto
                 * @instance
                 */
                ColorProto.prototype.b = 0;
    
                /**
                 * ColorProto a.
                 * @member {number} a
                 * @memberof perfetto.protos.ColorProto
                 * @instance
                 */
                ColorProto.prototype.a = 0;
    
                /**
                 * Creates a new ColorProto instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.ColorProto
                 * @static
                 * @param {perfetto.protos.IColorProto=} [properties] Properties to set
                 * @returns {perfetto.protos.ColorProto} ColorProto instance
                 */
                ColorProto.create = function create(properties) {
                    return new ColorProto(properties);
                };
    
                /**
                 * Encodes the specified ColorProto message. Does not implicitly {@link perfetto.protos.ColorProto.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.ColorProto
                 * @static
                 * @param {perfetto.protos.IColorProto} message ColorProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ColorProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.r != null && Object.hasOwnProperty.call(message, "r"))
                        writer.uint32(/* id 1, wireType 5 =*/13).float(message.r);
                    if (message.g != null && Object.hasOwnProperty.call(message, "g"))
                        writer.uint32(/* id 2, wireType 5 =*/21).float(message.g);
                    if (message.b != null && Object.hasOwnProperty.call(message, "b"))
                        writer.uint32(/* id 3, wireType 5 =*/29).float(message.b);
                    if (message.a != null && Object.hasOwnProperty.call(message, "a"))
                        writer.uint32(/* id 4, wireType 5 =*/37).float(message.a);
                    return writer;
                };
    
                /**
                 * Encodes the specified ColorProto message, length delimited. Does not implicitly {@link perfetto.protos.ColorProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.ColorProto
                 * @static
                 * @param {perfetto.protos.IColorProto} message ColorProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ColorProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a ColorProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.ColorProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.ColorProto} ColorProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ColorProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.ColorProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.r = reader.float();
                                break;
                            }
                        case 2: {
                                message.g = reader.float();
                                break;
                            }
                        case 3: {
                                message.b = reader.float();
                                break;
                            }
                        case 4: {
                                message.a = reader.float();
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
                 * Decodes a ColorProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.ColorProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.ColorProto} ColorProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ColorProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a ColorProto message.
                 * @function verify
                 * @memberof perfetto.protos.ColorProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ColorProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.r != null && message.hasOwnProperty("r"))
                        if (typeof message.r !== "number")
                            return "r: number expected";
                    if (message.g != null && message.hasOwnProperty("g"))
                        if (typeof message.g !== "number")
                            return "g: number expected";
                    if (message.b != null && message.hasOwnProperty("b"))
                        if (typeof message.b !== "number")
                            return "b: number expected";
                    if (message.a != null && message.hasOwnProperty("a"))
                        if (typeof message.a !== "number")
                            return "a: number expected";
                    return null;
                };
    
                /**
                 * Creates a ColorProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.ColorProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.ColorProto} ColorProto
                 */
                ColorProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.ColorProto)
                        return object;
                    var message = new $root.perfetto.protos.ColorProto();
                    if (object.r != null)
                        message.r = Number(object.r);
                    if (object.g != null)
                        message.g = Number(object.g);
                    if (object.b != null)
                        message.b = Number(object.b);
                    if (object.a != null)
                        message.a = Number(object.a);
                    return message;
                };
    
                /**
                 * Creates a plain object from a ColorProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.ColorProto
                 * @static
                 * @param {perfetto.protos.ColorProto} message ColorProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ColorProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.r = 0;
                        object.g = 0;
                        object.b = 0;
                        object.a = 0;
                    }
                    if (message.r != null && message.hasOwnProperty("r"))
                        object.r = options.json && !isFinite(message.r) ? String(message.r) : message.r;
                    if (message.g != null && message.hasOwnProperty("g"))
                        object.g = options.json && !isFinite(message.g) ? String(message.g) : message.g;
                    if (message.b != null && message.hasOwnProperty("b"))
                        object.b = options.json && !isFinite(message.b) ? String(message.b) : message.b;
                    if (message.a != null && message.hasOwnProperty("a"))
                        object.a = options.json && !isFinite(message.a) ? String(message.a) : message.a;
                    return object;
                };
    
                /**
                 * Converts this ColorProto to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.ColorProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ColorProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for ColorProto
                 * @function getTypeUrl
                 * @memberof perfetto.protos.ColorProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                ColorProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.ColorProto";
                };
    
                return ColorProto;
            })();
    
            protos.InputWindowInfoProto = (function() {
    
                /**
                 * Properties of an InputWindowInfoProto.
                 * @memberof perfetto.protos
                 * @interface IInputWindowInfoProto
                 * @property {number|null} [layoutParamsFlags] InputWindowInfoProto layoutParamsFlags
                 * @property {number|null} [layoutParamsType] InputWindowInfoProto layoutParamsType
                 * @property {perfetto.protos.IRectProto|null} [frame] InputWindowInfoProto frame
                 * @property {perfetto.protos.IRegionProto|null} [touchableRegion] InputWindowInfoProto touchableRegion
                 * @property {number|null} [surfaceInset] InputWindowInfoProto surfaceInset
                 * @property {boolean|null} [visible] InputWindowInfoProto visible
                 * @property {boolean|null} [canReceiveKeys] InputWindowInfoProto canReceiveKeys
                 * @property {boolean|null} [focusable] InputWindowInfoProto focusable
                 * @property {boolean|null} [hasWallpaper] InputWindowInfoProto hasWallpaper
                 * @property {number|null} [globalScaleFactor] InputWindowInfoProto globalScaleFactor
                 * @property {number|null} [windowXScale] InputWindowInfoProto windowXScale
                 * @property {number|null} [windowYScale] InputWindowInfoProto windowYScale
                 * @property {number|null} [cropLayerId] InputWindowInfoProto cropLayerId
                 * @property {boolean|null} [replaceTouchableRegionWithCrop] InputWindowInfoProto replaceTouchableRegionWithCrop
                 * @property {perfetto.protos.IRectProto|null} [touchableRegionCrop] InputWindowInfoProto touchableRegionCrop
                 * @property {perfetto.protos.ITransformProto|null} [transform] InputWindowInfoProto transform
                 * @property {number|null} [inputConfig] InputWindowInfoProto inputConfig
                 */
    
                /**
                 * Constructs a new InputWindowInfoProto.
                 * @memberof perfetto.protos
                 * @classdesc Represents an InputWindowInfoProto.
                 * @implements IInputWindowInfoProto
                 * @constructor
                 * @param {perfetto.protos.IInputWindowInfoProto=} [properties] Properties to set
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
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.layoutParamsFlags = 0;
    
                /**
                 * InputWindowInfoProto layoutParamsType.
                 * @member {number} layoutParamsType
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.layoutParamsType = 0;
    
                /**
                 * InputWindowInfoProto frame.
                 * @member {perfetto.protos.IRectProto|null|undefined} frame
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.frame = null;
    
                /**
                 * InputWindowInfoProto touchableRegion.
                 * @member {perfetto.protos.IRegionProto|null|undefined} touchableRegion
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.touchableRegion = null;
    
                /**
                 * InputWindowInfoProto surfaceInset.
                 * @member {number} surfaceInset
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.surfaceInset = 0;
    
                /**
                 * InputWindowInfoProto visible.
                 * @member {boolean} visible
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.visible = false;
    
                /**
                 * InputWindowInfoProto canReceiveKeys.
                 * @member {boolean} canReceiveKeys
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.canReceiveKeys = false;
    
                /**
                 * InputWindowInfoProto focusable.
                 * @member {boolean} focusable
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.focusable = false;
    
                /**
                 * InputWindowInfoProto hasWallpaper.
                 * @member {boolean} hasWallpaper
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.hasWallpaper = false;
    
                /**
                 * InputWindowInfoProto globalScaleFactor.
                 * @member {number} globalScaleFactor
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.globalScaleFactor = 0;
    
                /**
                 * InputWindowInfoProto windowXScale.
                 * @member {number} windowXScale
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.windowXScale = 0;
    
                /**
                 * InputWindowInfoProto windowYScale.
                 * @member {number} windowYScale
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.windowYScale = 0;
    
                /**
                 * InputWindowInfoProto cropLayerId.
                 * @member {number} cropLayerId
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.cropLayerId = 0;
    
                /**
                 * InputWindowInfoProto replaceTouchableRegionWithCrop.
                 * @member {boolean} replaceTouchableRegionWithCrop
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.replaceTouchableRegionWithCrop = false;
    
                /**
                 * InputWindowInfoProto touchableRegionCrop.
                 * @member {perfetto.protos.IRectProto|null|undefined} touchableRegionCrop
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.touchableRegionCrop = null;
    
                /**
                 * InputWindowInfoProto transform.
                 * @member {perfetto.protos.ITransformProto|null|undefined} transform
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.transform = null;
    
                /**
                 * InputWindowInfoProto inputConfig.
                 * @member {number} inputConfig
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.inputConfig = 0;
    
                /**
                 * Creates a new InputWindowInfoProto instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @static
                 * @param {perfetto.protos.IInputWindowInfoProto=} [properties] Properties to set
                 * @returns {perfetto.protos.InputWindowInfoProto} InputWindowInfoProto instance
                 */
                InputWindowInfoProto.create = function create(properties) {
                    return new InputWindowInfoProto(properties);
                };
    
                /**
                 * Encodes the specified InputWindowInfoProto message. Does not implicitly {@link perfetto.protos.InputWindowInfoProto.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @static
                 * @param {perfetto.protos.IInputWindowInfoProto} message InputWindowInfoProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                InputWindowInfoProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.layoutParamsFlags != null && Object.hasOwnProperty.call(message, "layoutParamsFlags"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.layoutParamsFlags);
                    if (message.layoutParamsType != null && Object.hasOwnProperty.call(message, "layoutParamsType"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.layoutParamsType);
                    if (message.frame != null && Object.hasOwnProperty.call(message, "frame"))
                        $root.perfetto.protos.RectProto.encode(message.frame, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    if (message.touchableRegion != null && Object.hasOwnProperty.call(message, "touchableRegion"))
                        $root.perfetto.protos.RegionProto.encode(message.touchableRegion, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    if (message.surfaceInset != null && Object.hasOwnProperty.call(message, "surfaceInset"))
                        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.surfaceInset);
                    if (message.visible != null && Object.hasOwnProperty.call(message, "visible"))
                        writer.uint32(/* id 6, wireType 0 =*/48).bool(message.visible);
                    if (message.canReceiveKeys != null && Object.hasOwnProperty.call(message, "canReceiveKeys"))
                        writer.uint32(/* id 7, wireType 0 =*/56).bool(message.canReceiveKeys);
                    if (message.focusable != null && Object.hasOwnProperty.call(message, "focusable"))
                        writer.uint32(/* id 8, wireType 0 =*/64).bool(message.focusable);
                    if (message.hasWallpaper != null && Object.hasOwnProperty.call(message, "hasWallpaper"))
                        writer.uint32(/* id 9, wireType 0 =*/72).bool(message.hasWallpaper);
                    if (message.globalScaleFactor != null && Object.hasOwnProperty.call(message, "globalScaleFactor"))
                        writer.uint32(/* id 10, wireType 5 =*/85).float(message.globalScaleFactor);
                    if (message.windowXScale != null && Object.hasOwnProperty.call(message, "windowXScale"))
                        writer.uint32(/* id 11, wireType 5 =*/93).float(message.windowXScale);
                    if (message.windowYScale != null && Object.hasOwnProperty.call(message, "windowYScale"))
                        writer.uint32(/* id 12, wireType 5 =*/101).float(message.windowYScale);
                    if (message.cropLayerId != null && Object.hasOwnProperty.call(message, "cropLayerId"))
                        writer.uint32(/* id 13, wireType 0 =*/104).int32(message.cropLayerId);
                    if (message.replaceTouchableRegionWithCrop != null && Object.hasOwnProperty.call(message, "replaceTouchableRegionWithCrop"))
                        writer.uint32(/* id 14, wireType 0 =*/112).bool(message.replaceTouchableRegionWithCrop);
                    if (message.touchableRegionCrop != null && Object.hasOwnProperty.call(message, "touchableRegionCrop"))
                        $root.perfetto.protos.RectProto.encode(message.touchableRegionCrop, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
                    if (message.transform != null && Object.hasOwnProperty.call(message, "transform"))
                        $root.perfetto.protos.TransformProto.encode(message.transform, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
                    if (message.inputConfig != null && Object.hasOwnProperty.call(message, "inputConfig"))
                        writer.uint32(/* id 17, wireType 0 =*/136).uint32(message.inputConfig);
                    return writer;
                };
    
                /**
                 * Encodes the specified InputWindowInfoProto message, length delimited. Does not implicitly {@link perfetto.protos.InputWindowInfoProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @static
                 * @param {perfetto.protos.IInputWindowInfoProto} message InputWindowInfoProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                InputWindowInfoProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an InputWindowInfoProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.InputWindowInfoProto} InputWindowInfoProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                InputWindowInfoProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.InputWindowInfoProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.layoutParamsFlags = reader.uint32();
                                break;
                            }
                        case 2: {
                                message.layoutParamsType = reader.int32();
                                break;
                            }
                        case 3: {
                                message.frame = $root.perfetto.protos.RectProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 4: {
                                message.touchableRegion = $root.perfetto.protos.RegionProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 5: {
                                message.surfaceInset = reader.int32();
                                break;
                            }
                        case 6: {
                                message.visible = reader.bool();
                                break;
                            }
                        case 7: {
                                message.canReceiveKeys = reader.bool();
                                break;
                            }
                        case 8: {
                                message.focusable = reader.bool();
                                break;
                            }
                        case 9: {
                                message.hasWallpaper = reader.bool();
                                break;
                            }
                        case 10: {
                                message.globalScaleFactor = reader.float();
                                break;
                            }
                        case 11: {
                                message.windowXScale = reader.float();
                                break;
                            }
                        case 12: {
                                message.windowYScale = reader.float();
                                break;
                            }
                        case 13: {
                                message.cropLayerId = reader.int32();
                                break;
                            }
                        case 14: {
                                message.replaceTouchableRegionWithCrop = reader.bool();
                                break;
                            }
                        case 15: {
                                message.touchableRegionCrop = $root.perfetto.protos.RectProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 16: {
                                message.transform = $root.perfetto.protos.TransformProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 17: {
                                message.inputConfig = reader.uint32();
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
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.InputWindowInfoProto} InputWindowInfoProto
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
                 * @memberof perfetto.protos.InputWindowInfoProto
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
                    if (message.layoutParamsType != null && message.hasOwnProperty("layoutParamsType"))
                        if (!$util.isInteger(message.layoutParamsType))
                            return "layoutParamsType: integer expected";
                    if (message.frame != null && message.hasOwnProperty("frame")) {
                        var error = $root.perfetto.protos.RectProto.verify(message.frame);
                        if (error)
                            return "frame." + error;
                    }
                    if (message.touchableRegion != null && message.hasOwnProperty("touchableRegion")) {
                        var error = $root.perfetto.protos.RegionProto.verify(message.touchableRegion);
                        if (error)
                            return "touchableRegion." + error;
                    }
                    if (message.surfaceInset != null && message.hasOwnProperty("surfaceInset"))
                        if (!$util.isInteger(message.surfaceInset))
                            return "surfaceInset: integer expected";
                    if (message.visible != null && message.hasOwnProperty("visible"))
                        if (typeof message.visible !== "boolean")
                            return "visible: boolean expected";
                    if (message.canReceiveKeys != null && message.hasOwnProperty("canReceiveKeys"))
                        if (typeof message.canReceiveKeys !== "boolean")
                            return "canReceiveKeys: boolean expected";
                    if (message.focusable != null && message.hasOwnProperty("focusable"))
                        if (typeof message.focusable !== "boolean")
                            return "focusable: boolean expected";
                    if (message.hasWallpaper != null && message.hasOwnProperty("hasWallpaper"))
                        if (typeof message.hasWallpaper !== "boolean")
                            return "hasWallpaper: boolean expected";
                    if (message.globalScaleFactor != null && message.hasOwnProperty("globalScaleFactor"))
                        if (typeof message.globalScaleFactor !== "number")
                            return "globalScaleFactor: number expected";
                    if (message.windowXScale != null && message.hasOwnProperty("windowXScale"))
                        if (typeof message.windowXScale !== "number")
                            return "windowXScale: number expected";
                    if (message.windowYScale != null && message.hasOwnProperty("windowYScale"))
                        if (typeof message.windowYScale !== "number")
                            return "windowYScale: number expected";
                    if (message.cropLayerId != null && message.hasOwnProperty("cropLayerId"))
                        if (!$util.isInteger(message.cropLayerId))
                            return "cropLayerId: integer expected";
                    if (message.replaceTouchableRegionWithCrop != null && message.hasOwnProperty("replaceTouchableRegionWithCrop"))
                        if (typeof message.replaceTouchableRegionWithCrop !== "boolean")
                            return "replaceTouchableRegionWithCrop: boolean expected";
                    if (message.touchableRegionCrop != null && message.hasOwnProperty("touchableRegionCrop")) {
                        var error = $root.perfetto.protos.RectProto.verify(message.touchableRegionCrop);
                        if (error)
                            return "touchableRegionCrop." + error;
                    }
                    if (message.transform != null && message.hasOwnProperty("transform")) {
                        var error = $root.perfetto.protos.TransformProto.verify(message.transform);
                        if (error)
                            return "transform." + error;
                    }
                    if (message.inputConfig != null && message.hasOwnProperty("inputConfig"))
                        if (!$util.isInteger(message.inputConfig))
                            return "inputConfig: integer expected";
                    return null;
                };
    
                /**
                 * Creates an InputWindowInfoProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.InputWindowInfoProto} InputWindowInfoProto
                 */
                InputWindowInfoProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.InputWindowInfoProto)
                        return object;
                    var message = new $root.perfetto.protos.InputWindowInfoProto();
                    if (object.layoutParamsFlags != null)
                        message.layoutParamsFlags = object.layoutParamsFlags >>> 0;
                    if (object.layoutParamsType != null)
                        message.layoutParamsType = object.layoutParamsType | 0;
                    if (object.frame != null) {
                        if (typeof object.frame !== "object")
                            throw TypeError(".perfetto.protos.InputWindowInfoProto.frame: object expected");
                        message.frame = $root.perfetto.protos.RectProto.fromObject(object.frame);
                    }
                    if (object.touchableRegion != null) {
                        if (typeof object.touchableRegion !== "object")
                            throw TypeError(".perfetto.protos.InputWindowInfoProto.touchableRegion: object expected");
                        message.touchableRegion = $root.perfetto.protos.RegionProto.fromObject(object.touchableRegion);
                    }
                    if (object.surfaceInset != null)
                        message.surfaceInset = object.surfaceInset | 0;
                    if (object.visible != null)
                        message.visible = Boolean(object.visible);
                    if (object.canReceiveKeys != null)
                        message.canReceiveKeys = Boolean(object.canReceiveKeys);
                    if (object.focusable != null)
                        message.focusable = Boolean(object.focusable);
                    if (object.hasWallpaper != null)
                        message.hasWallpaper = Boolean(object.hasWallpaper);
                    if (object.globalScaleFactor != null)
                        message.globalScaleFactor = Number(object.globalScaleFactor);
                    if (object.windowXScale != null)
                        message.windowXScale = Number(object.windowXScale);
                    if (object.windowYScale != null)
                        message.windowYScale = Number(object.windowYScale);
                    if (object.cropLayerId != null)
                        message.cropLayerId = object.cropLayerId | 0;
                    if (object.replaceTouchableRegionWithCrop != null)
                        message.replaceTouchableRegionWithCrop = Boolean(object.replaceTouchableRegionWithCrop);
                    if (object.touchableRegionCrop != null) {
                        if (typeof object.touchableRegionCrop !== "object")
                            throw TypeError(".perfetto.protos.InputWindowInfoProto.touchableRegionCrop: object expected");
                        message.touchableRegionCrop = $root.perfetto.protos.RectProto.fromObject(object.touchableRegionCrop);
                    }
                    if (object.transform != null) {
                        if (typeof object.transform !== "object")
                            throw TypeError(".perfetto.protos.InputWindowInfoProto.transform: object expected");
                        message.transform = $root.perfetto.protos.TransformProto.fromObject(object.transform);
                    }
                    if (object.inputConfig != null)
                        message.inputConfig = object.inputConfig >>> 0;
                    return message;
                };
    
                /**
                 * Creates a plain object from an InputWindowInfoProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @static
                 * @param {perfetto.protos.InputWindowInfoProto} message InputWindowInfoProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                InputWindowInfoProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.layoutParamsFlags = 0;
                        object.layoutParamsType = 0;
                        object.frame = null;
                        object.touchableRegion = null;
                        object.surfaceInset = 0;
                        object.visible = false;
                        object.canReceiveKeys = false;
                        object.focusable = false;
                        object.hasWallpaper = false;
                        object.globalScaleFactor = 0;
                        object.windowXScale = 0;
                        object.windowYScale = 0;
                        object.cropLayerId = 0;
                        object.replaceTouchableRegionWithCrop = false;
                        object.touchableRegionCrop = null;
                        object.transform = null;
                        object.inputConfig = 0;
                    }
                    if (message.layoutParamsFlags != null && message.hasOwnProperty("layoutParamsFlags"))
                        object.layoutParamsFlags = message.layoutParamsFlags;
                    if (message.layoutParamsType != null && message.hasOwnProperty("layoutParamsType"))
                        object.layoutParamsType = message.layoutParamsType;
                    if (message.frame != null && message.hasOwnProperty("frame"))
                        object.frame = $root.perfetto.protos.RectProto.toObject(message.frame, options);
                    if (message.touchableRegion != null && message.hasOwnProperty("touchableRegion"))
                        object.touchableRegion = $root.perfetto.protos.RegionProto.toObject(message.touchableRegion, options);
                    if (message.surfaceInset != null && message.hasOwnProperty("surfaceInset"))
                        object.surfaceInset = message.surfaceInset;
                    if (message.visible != null && message.hasOwnProperty("visible"))
                        object.visible = message.visible;
                    if (message.canReceiveKeys != null && message.hasOwnProperty("canReceiveKeys"))
                        object.canReceiveKeys = message.canReceiveKeys;
                    if (message.focusable != null && message.hasOwnProperty("focusable"))
                        object.focusable = message.focusable;
                    if (message.hasWallpaper != null && message.hasOwnProperty("hasWallpaper"))
                        object.hasWallpaper = message.hasWallpaper;
                    if (message.globalScaleFactor != null && message.hasOwnProperty("globalScaleFactor"))
                        object.globalScaleFactor = options.json && !isFinite(message.globalScaleFactor) ? String(message.globalScaleFactor) : message.globalScaleFactor;
                    if (message.windowXScale != null && message.hasOwnProperty("windowXScale"))
                        object.windowXScale = options.json && !isFinite(message.windowXScale) ? String(message.windowXScale) : message.windowXScale;
                    if (message.windowYScale != null && message.hasOwnProperty("windowYScale"))
                        object.windowYScale = options.json && !isFinite(message.windowYScale) ? String(message.windowYScale) : message.windowYScale;
                    if (message.cropLayerId != null && message.hasOwnProperty("cropLayerId"))
                        object.cropLayerId = message.cropLayerId;
                    if (message.replaceTouchableRegionWithCrop != null && message.hasOwnProperty("replaceTouchableRegionWithCrop"))
                        object.replaceTouchableRegionWithCrop = message.replaceTouchableRegionWithCrop;
                    if (message.touchableRegionCrop != null && message.hasOwnProperty("touchableRegionCrop"))
                        object.touchableRegionCrop = $root.perfetto.protos.RectProto.toObject(message.touchableRegionCrop, options);
                    if (message.transform != null && message.hasOwnProperty("transform"))
                        object.transform = $root.perfetto.protos.TransformProto.toObject(message.transform, options);
                    if (message.inputConfig != null && message.hasOwnProperty("inputConfig"))
                        object.inputConfig = message.inputConfig;
                    return object;
                };
    
                /**
                 * Converts this InputWindowInfoProto to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                InputWindowInfoProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for InputWindowInfoProto
                 * @function getTypeUrl
                 * @memberof perfetto.protos.InputWindowInfoProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                InputWindowInfoProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.InputWindowInfoProto";
                };
    
                return InputWindowInfoProto;
            })();
    
            protos.BlurRegion = (function() {
    
                /**
                 * Properties of a BlurRegion.
                 * @memberof perfetto.protos
                 * @interface IBlurRegion
                 * @property {number|null} [blurRadius] BlurRegion blurRadius
                 * @property {number|null} [cornerRadiusTl] BlurRegion cornerRadiusTl
                 * @property {number|null} [cornerRadiusTr] BlurRegion cornerRadiusTr
                 * @property {number|null} [cornerRadiusBl] BlurRegion cornerRadiusBl
                 * @property {number|null} [cornerRadiusBr] BlurRegion cornerRadiusBr
                 * @property {number|null} [alpha] BlurRegion alpha
                 * @property {number|null} [left] BlurRegion left
                 * @property {number|null} [top] BlurRegion top
                 * @property {number|null} [right] BlurRegion right
                 * @property {number|null} [bottom] BlurRegion bottom
                 */
    
                /**
                 * Constructs a new BlurRegion.
                 * @memberof perfetto.protos
                 * @classdesc Represents a BlurRegion.
                 * @implements IBlurRegion
                 * @constructor
                 * @param {perfetto.protos.IBlurRegion=} [properties] Properties to set
                 */
                function BlurRegion(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * BlurRegion blurRadius.
                 * @member {number} blurRadius
                 * @memberof perfetto.protos.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.blurRadius = 0;
    
                /**
                 * BlurRegion cornerRadiusTl.
                 * @member {number} cornerRadiusTl
                 * @memberof perfetto.protos.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.cornerRadiusTl = 0;
    
                /**
                 * BlurRegion cornerRadiusTr.
                 * @member {number} cornerRadiusTr
                 * @memberof perfetto.protos.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.cornerRadiusTr = 0;
    
                /**
                 * BlurRegion cornerRadiusBl.
                 * @member {number} cornerRadiusBl
                 * @memberof perfetto.protos.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.cornerRadiusBl = 0;
    
                /**
                 * BlurRegion cornerRadiusBr.
                 * @member {number} cornerRadiusBr
                 * @memberof perfetto.protos.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.cornerRadiusBr = 0;
    
                /**
                 * BlurRegion alpha.
                 * @member {number} alpha
                 * @memberof perfetto.protos.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.alpha = 0;
    
                /**
                 * BlurRegion left.
                 * @member {number} left
                 * @memberof perfetto.protos.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.left = 0;
    
                /**
                 * BlurRegion top.
                 * @member {number} top
                 * @memberof perfetto.protos.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.top = 0;
    
                /**
                 * BlurRegion right.
                 * @member {number} right
                 * @memberof perfetto.protos.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.right = 0;
    
                /**
                 * BlurRegion bottom.
                 * @member {number} bottom
                 * @memberof perfetto.protos.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.bottom = 0;
    
                /**
                 * Creates a new BlurRegion instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.BlurRegion
                 * @static
                 * @param {perfetto.protos.IBlurRegion=} [properties] Properties to set
                 * @returns {perfetto.protos.BlurRegion} BlurRegion instance
                 */
                BlurRegion.create = function create(properties) {
                    return new BlurRegion(properties);
                };
    
                /**
                 * Encodes the specified BlurRegion message. Does not implicitly {@link perfetto.protos.BlurRegion.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.BlurRegion
                 * @static
                 * @param {perfetto.protos.IBlurRegion} message BlurRegion message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                BlurRegion.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.blurRadius != null && Object.hasOwnProperty.call(message, "blurRadius"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.blurRadius);
                    if (message.cornerRadiusTl != null && Object.hasOwnProperty.call(message, "cornerRadiusTl"))
                        writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.cornerRadiusTl);
                    if (message.cornerRadiusTr != null && Object.hasOwnProperty.call(message, "cornerRadiusTr"))
                        writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.cornerRadiusTr);
                    if (message.cornerRadiusBl != null && Object.hasOwnProperty.call(message, "cornerRadiusBl"))
                        writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.cornerRadiusBl);
                    if (message.cornerRadiusBr != null && Object.hasOwnProperty.call(message, "cornerRadiusBr"))
                        writer.uint32(/* id 5, wireType 5 =*/45).float(message.cornerRadiusBr);
                    if (message.alpha != null && Object.hasOwnProperty.call(message, "alpha"))
                        writer.uint32(/* id 6, wireType 5 =*/53).float(message.alpha);
                    if (message.left != null && Object.hasOwnProperty.call(message, "left"))
                        writer.uint32(/* id 7, wireType 0 =*/56).int32(message.left);
                    if (message.top != null && Object.hasOwnProperty.call(message, "top"))
                        writer.uint32(/* id 8, wireType 0 =*/64).int32(message.top);
                    if (message.right != null && Object.hasOwnProperty.call(message, "right"))
                        writer.uint32(/* id 9, wireType 0 =*/72).int32(message.right);
                    if (message.bottom != null && Object.hasOwnProperty.call(message, "bottom"))
                        writer.uint32(/* id 10, wireType 0 =*/80).int32(message.bottom);
                    return writer;
                };
    
                /**
                 * Encodes the specified BlurRegion message, length delimited. Does not implicitly {@link perfetto.protos.BlurRegion.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.BlurRegion
                 * @static
                 * @param {perfetto.protos.IBlurRegion} message BlurRegion message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                BlurRegion.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a BlurRegion message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.BlurRegion
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.BlurRegion} BlurRegion
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                BlurRegion.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.BlurRegion();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.blurRadius = reader.uint32();
                                break;
                            }
                        case 2: {
                                message.cornerRadiusTl = reader.uint32();
                                break;
                            }
                        case 3: {
                                message.cornerRadiusTr = reader.uint32();
                                break;
                            }
                        case 4: {
                                message.cornerRadiusBl = reader.uint32();
                                break;
                            }
                        case 5: {
                                message.cornerRadiusBr = reader.float();
                                break;
                            }
                        case 6: {
                                message.alpha = reader.float();
                                break;
                            }
                        case 7: {
                                message.left = reader.int32();
                                break;
                            }
                        case 8: {
                                message.top = reader.int32();
                                break;
                            }
                        case 9: {
                                message.right = reader.int32();
                                break;
                            }
                        case 10: {
                                message.bottom = reader.int32();
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
                 * Decodes a BlurRegion message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.BlurRegion
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.BlurRegion} BlurRegion
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                BlurRegion.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a BlurRegion message.
                 * @function verify
                 * @memberof perfetto.protos.BlurRegion
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                BlurRegion.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.blurRadius != null && message.hasOwnProperty("blurRadius"))
                        if (!$util.isInteger(message.blurRadius))
                            return "blurRadius: integer expected";
                    if (message.cornerRadiusTl != null && message.hasOwnProperty("cornerRadiusTl"))
                        if (!$util.isInteger(message.cornerRadiusTl))
                            return "cornerRadiusTl: integer expected";
                    if (message.cornerRadiusTr != null && message.hasOwnProperty("cornerRadiusTr"))
                        if (!$util.isInteger(message.cornerRadiusTr))
                            return "cornerRadiusTr: integer expected";
                    if (message.cornerRadiusBl != null && message.hasOwnProperty("cornerRadiusBl"))
                        if (!$util.isInteger(message.cornerRadiusBl))
                            return "cornerRadiusBl: integer expected";
                    if (message.cornerRadiusBr != null && message.hasOwnProperty("cornerRadiusBr"))
                        if (typeof message.cornerRadiusBr !== "number")
                            return "cornerRadiusBr: number expected";
                    if (message.alpha != null && message.hasOwnProperty("alpha"))
                        if (typeof message.alpha !== "number")
                            return "alpha: number expected";
                    if (message.left != null && message.hasOwnProperty("left"))
                        if (!$util.isInteger(message.left))
                            return "left: integer expected";
                    if (message.top != null && message.hasOwnProperty("top"))
                        if (!$util.isInteger(message.top))
                            return "top: integer expected";
                    if (message.right != null && message.hasOwnProperty("right"))
                        if (!$util.isInteger(message.right))
                            return "right: integer expected";
                    if (message.bottom != null && message.hasOwnProperty("bottom"))
                        if (!$util.isInteger(message.bottom))
                            return "bottom: integer expected";
                    return null;
                };
    
                /**
                 * Creates a BlurRegion message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.BlurRegion
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.BlurRegion} BlurRegion
                 */
                BlurRegion.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.BlurRegion)
                        return object;
                    var message = new $root.perfetto.protos.BlurRegion();
                    if (object.blurRadius != null)
                        message.blurRadius = object.blurRadius >>> 0;
                    if (object.cornerRadiusTl != null)
                        message.cornerRadiusTl = object.cornerRadiusTl >>> 0;
                    if (object.cornerRadiusTr != null)
                        message.cornerRadiusTr = object.cornerRadiusTr >>> 0;
                    if (object.cornerRadiusBl != null)
                        message.cornerRadiusBl = object.cornerRadiusBl >>> 0;
                    if (object.cornerRadiusBr != null)
                        message.cornerRadiusBr = Number(object.cornerRadiusBr);
                    if (object.alpha != null)
                        message.alpha = Number(object.alpha);
                    if (object.left != null)
                        message.left = object.left | 0;
                    if (object.top != null)
                        message.top = object.top | 0;
                    if (object.right != null)
                        message.right = object.right | 0;
                    if (object.bottom != null)
                        message.bottom = object.bottom | 0;
                    return message;
                };
    
                /**
                 * Creates a plain object from a BlurRegion message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.BlurRegion
                 * @static
                 * @param {perfetto.protos.BlurRegion} message BlurRegion
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                BlurRegion.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.blurRadius = 0;
                        object.cornerRadiusTl = 0;
                        object.cornerRadiusTr = 0;
                        object.cornerRadiusBl = 0;
                        object.cornerRadiusBr = 0;
                        object.alpha = 0;
                        object.left = 0;
                        object.top = 0;
                        object.right = 0;
                        object.bottom = 0;
                    }
                    if (message.blurRadius != null && message.hasOwnProperty("blurRadius"))
                        object.blurRadius = message.blurRadius;
                    if (message.cornerRadiusTl != null && message.hasOwnProperty("cornerRadiusTl"))
                        object.cornerRadiusTl = message.cornerRadiusTl;
                    if (message.cornerRadiusTr != null && message.hasOwnProperty("cornerRadiusTr"))
                        object.cornerRadiusTr = message.cornerRadiusTr;
                    if (message.cornerRadiusBl != null && message.hasOwnProperty("cornerRadiusBl"))
                        object.cornerRadiusBl = message.cornerRadiusBl;
                    if (message.cornerRadiusBr != null && message.hasOwnProperty("cornerRadiusBr"))
                        object.cornerRadiusBr = options.json && !isFinite(message.cornerRadiusBr) ? String(message.cornerRadiusBr) : message.cornerRadiusBr;
                    if (message.alpha != null && message.hasOwnProperty("alpha"))
                        object.alpha = options.json && !isFinite(message.alpha) ? String(message.alpha) : message.alpha;
                    if (message.left != null && message.hasOwnProperty("left"))
                        object.left = message.left;
                    if (message.top != null && message.hasOwnProperty("top"))
                        object.top = message.top;
                    if (message.right != null && message.hasOwnProperty("right"))
                        object.right = message.right;
                    if (message.bottom != null && message.hasOwnProperty("bottom"))
                        object.bottom = message.bottom;
                    return object;
                };
    
                /**
                 * Converts this BlurRegion to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.BlurRegion
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                BlurRegion.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for BlurRegion
                 * @function getTypeUrl
                 * @memberof perfetto.protos.BlurRegion
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                BlurRegion.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.BlurRegion";
                };
    
                return BlurRegion;
            })();
    
            protos.ColorTransformProto = (function() {
    
                /**
                 * Properties of a ColorTransformProto.
                 * @memberof perfetto.protos
                 * @interface IColorTransformProto
                 * @property {Array.<number>|null} [val] ColorTransformProto val
                 */
    
                /**
                 * Constructs a new ColorTransformProto.
                 * @memberof perfetto.protos
                 * @classdesc Represents a ColorTransformProto.
                 * @implements IColorTransformProto
                 * @constructor
                 * @param {perfetto.protos.IColorTransformProto=} [properties] Properties to set
                 */
                function ColorTransformProto(properties) {
                    this.val = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ColorTransformProto val.
                 * @member {Array.<number>} val
                 * @memberof perfetto.protos.ColorTransformProto
                 * @instance
                 */
                ColorTransformProto.prototype.val = $util.emptyArray;
    
                /**
                 * Creates a new ColorTransformProto instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.ColorTransformProto
                 * @static
                 * @param {perfetto.protos.IColorTransformProto=} [properties] Properties to set
                 * @returns {perfetto.protos.ColorTransformProto} ColorTransformProto instance
                 */
                ColorTransformProto.create = function create(properties) {
                    return new ColorTransformProto(properties);
                };
    
                /**
                 * Encodes the specified ColorTransformProto message. Does not implicitly {@link perfetto.protos.ColorTransformProto.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.ColorTransformProto
                 * @static
                 * @param {perfetto.protos.IColorTransformProto} message ColorTransformProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ColorTransformProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.val != null && message.val.length) {
                        writer.uint32(/* id 1, wireType 2 =*/10).fork();
                        for (var i = 0; i < message.val.length; ++i)
                            writer.float(message.val[i]);
                        writer.ldelim();
                    }
                    return writer;
                };
    
                /**
                 * Encodes the specified ColorTransformProto message, length delimited. Does not implicitly {@link perfetto.protos.ColorTransformProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.ColorTransformProto
                 * @static
                 * @param {perfetto.protos.IColorTransformProto} message ColorTransformProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ColorTransformProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a ColorTransformProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.ColorTransformProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.ColorTransformProto} ColorTransformProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ColorTransformProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.ColorTransformProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                if (!(message.val && message.val.length))
                                    message.val = [];
                                if ((tag & 7) === 2) {
                                    var end2 = reader.uint32() + reader.pos;
                                    while (reader.pos < end2)
                                        message.val.push(reader.float());
                                } else
                                    message.val.push(reader.float());
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
                 * Decodes a ColorTransformProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.ColorTransformProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.ColorTransformProto} ColorTransformProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ColorTransformProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a ColorTransformProto message.
                 * @function verify
                 * @memberof perfetto.protos.ColorTransformProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ColorTransformProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.val != null && message.hasOwnProperty("val")) {
                        if (!Array.isArray(message.val))
                            return "val: array expected";
                        for (var i = 0; i < message.val.length; ++i)
                            if (typeof message.val[i] !== "number")
                                return "val: number[] expected";
                    }
                    return null;
                };
    
                /**
                 * Creates a ColorTransformProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.ColorTransformProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.ColorTransformProto} ColorTransformProto
                 */
                ColorTransformProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.ColorTransformProto)
                        return object;
                    var message = new $root.perfetto.protos.ColorTransformProto();
                    if (object.val) {
                        if (!Array.isArray(object.val))
                            throw TypeError(".perfetto.protos.ColorTransformProto.val: array expected");
                        message.val = [];
                        for (var i = 0; i < object.val.length; ++i)
                            message.val[i] = Number(object.val[i]);
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from a ColorTransformProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.ColorTransformProto
                 * @static
                 * @param {perfetto.protos.ColorTransformProto} message ColorTransformProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ColorTransformProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.val = [];
                    if (message.val && message.val.length) {
                        object.val = [];
                        for (var j = 0; j < message.val.length; ++j)
                            object.val[j] = options.json && !isFinite(message.val[j]) ? String(message.val[j]) : message.val[j];
                    }
                    return object;
                };
    
                /**
                 * Converts this ColorTransformProto to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.ColorTransformProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ColorTransformProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for ColorTransformProto
                 * @function getTypeUrl
                 * @memberof perfetto.protos.ColorTransformProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                ColorTransformProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.ColorTransformProto";
                };
    
                return ColorTransformProto;
            })();
    
            /**
             * TrustedOverlay enum.
             * @name perfetto.protos.TrustedOverlay
             * @enum {number}
             * @property {number} UNSET=0 UNSET value
             * @property {number} DISABLED=1 DISABLED value
             * @property {number} ENABLED=2 ENABLED value
             */
            protos.TrustedOverlay = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "UNSET"] = 0;
                values[valuesById[1] = "DISABLED"] = 1;
                values[valuesById[2] = "ENABLED"] = 2;
                return values;
            })();
    
            protos.RectProto = (function() {
    
                /**
                 * Properties of a RectProto.
                 * @memberof perfetto.protos
                 * @interface IRectProto
                 * @property {number|null} [left] RectProto left
                 * @property {number|null} [top] RectProto top
                 * @property {number|null} [right] RectProto right
                 * @property {number|null} [bottom] RectProto bottom
                 */
    
                /**
                 * Constructs a new RectProto.
                 * @memberof perfetto.protos
                 * @classdesc Represents a RectProto.
                 * @implements IRectProto
                 * @constructor
                 * @param {perfetto.protos.IRectProto=} [properties] Properties to set
                 */
                function RectProto(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * RectProto left.
                 * @member {number} left
                 * @memberof perfetto.protos.RectProto
                 * @instance
                 */
                RectProto.prototype.left = 0;
    
                /**
                 * RectProto top.
                 * @member {number} top
                 * @memberof perfetto.protos.RectProto
                 * @instance
                 */
                RectProto.prototype.top = 0;
    
                /**
                 * RectProto right.
                 * @member {number} right
                 * @memberof perfetto.protos.RectProto
                 * @instance
                 */
                RectProto.prototype.right = 0;
    
                /**
                 * RectProto bottom.
                 * @member {number} bottom
                 * @memberof perfetto.protos.RectProto
                 * @instance
                 */
                RectProto.prototype.bottom = 0;
    
                /**
                 * Creates a new RectProto instance using the specified properties.
                 * @function create
                 * @memberof perfetto.protos.RectProto
                 * @static
                 * @param {perfetto.protos.IRectProto=} [properties] Properties to set
                 * @returns {perfetto.protos.RectProto} RectProto instance
                 */
                RectProto.create = function create(properties) {
                    return new RectProto(properties);
                };
    
                /**
                 * Encodes the specified RectProto message. Does not implicitly {@link perfetto.protos.RectProto.verify|verify} messages.
                 * @function encode
                 * @memberof perfetto.protos.RectProto
                 * @static
                 * @param {perfetto.protos.IRectProto} message RectProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                RectProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.left != null && Object.hasOwnProperty.call(message, "left"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.left);
                    if (message.top != null && Object.hasOwnProperty.call(message, "top"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.top);
                    if (message.right != null && Object.hasOwnProperty.call(message, "right"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.right);
                    if (message.bottom != null && Object.hasOwnProperty.call(message, "bottom"))
                        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.bottom);
                    return writer;
                };
    
                /**
                 * Encodes the specified RectProto message, length delimited. Does not implicitly {@link perfetto.protos.RectProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof perfetto.protos.RectProto
                 * @static
                 * @param {perfetto.protos.IRectProto} message RectProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                RectProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a RectProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof perfetto.protos.RectProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {perfetto.protos.RectProto} RectProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                RectProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.perfetto.protos.RectProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.left = reader.int32();
                                break;
                            }
                        case 2: {
                                message.top = reader.int32();
                                break;
                            }
                        case 3: {
                                message.right = reader.int32();
                                break;
                            }
                        case 4: {
                                message.bottom = reader.int32();
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
                 * Decodes a RectProto message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof perfetto.protos.RectProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {perfetto.protos.RectProto} RectProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                RectProto.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a RectProto message.
                 * @function verify
                 * @memberof perfetto.protos.RectProto
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                RectProto.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.left != null && message.hasOwnProperty("left"))
                        if (!$util.isInteger(message.left))
                            return "left: integer expected";
                    if (message.top != null && message.hasOwnProperty("top"))
                        if (!$util.isInteger(message.top))
                            return "top: integer expected";
                    if (message.right != null && message.hasOwnProperty("right"))
                        if (!$util.isInteger(message.right))
                            return "right: integer expected";
                    if (message.bottom != null && message.hasOwnProperty("bottom"))
                        if (!$util.isInteger(message.bottom))
                            return "bottom: integer expected";
                    return null;
                };
    
                /**
                 * Creates a RectProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof perfetto.protos.RectProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {perfetto.protos.RectProto} RectProto
                 */
                RectProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.perfetto.protos.RectProto)
                        return object;
                    var message = new $root.perfetto.protos.RectProto();
                    if (object.left != null)
                        message.left = object.left | 0;
                    if (object.top != null)
                        message.top = object.top | 0;
                    if (object.right != null)
                        message.right = object.right | 0;
                    if (object.bottom != null)
                        message.bottom = object.bottom | 0;
                    return message;
                };
    
                /**
                 * Creates a plain object from a RectProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof perfetto.protos.RectProto
                 * @static
                 * @param {perfetto.protos.RectProto} message RectProto
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                RectProto.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.left = 0;
                        object.top = 0;
                        object.right = 0;
                        object.bottom = 0;
                    }
                    if (message.left != null && message.hasOwnProperty("left"))
                        object.left = message.left;
                    if (message.top != null && message.hasOwnProperty("top"))
                        object.top = message.top;
                    if (message.right != null && message.hasOwnProperty("right"))
                        object.right = message.right;
                    if (message.bottom != null && message.hasOwnProperty("bottom"))
                        object.bottom = message.bottom;
                    return object;
                };
    
                /**
                 * Converts this RectProto to JSON.
                 * @function toJSON
                 * @memberof perfetto.protos.RectProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                RectProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for RectProto
                 * @function getTypeUrl
                 * @memberof perfetto.protos.RectProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                RectProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/perfetto.protos.RectProto";
                };
    
                return RectProto;
            })();
    
            return protos;
        })();
    
        return perfetto;
    })();

    return $root;
});
