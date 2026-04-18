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
    var $root = $protobuf.roots.transactionsudc || ($protobuf.roots.transactionsudc = {});
    
    $root.android = (function() {
    
        /**
         * Namespace android.
         * @exports android
         * @namespace
         */
        var android = {};
    
        android.surfaceflinger = (function() {
    
            /**
             * Namespace surfaceflinger.
             * @memberof android
             * @namespace
             */
            var surfaceflinger = {};
    
            surfaceflinger.proto = (function() {
    
                /**
                 * Namespace proto.
                 * @memberof android.surfaceflinger
                 * @namespace
                 */
                var proto = {};
    
                proto.TransactionTraceFile = (function() {
    
                    /**
                     * Properties of a TransactionTraceFile.
                     * @memberof android.surfaceflinger.proto
                     * @interface ITransactionTraceFile
                     * @property {Long|null} [magicNumber] TransactionTraceFile magicNumber
                     * @property {Array.<android.surfaceflinger.proto.ITransactionTraceEntry>|null} [entry] TransactionTraceFile entry
                     * @property {Long|null} [realToElapsedTimeOffsetNanos] TransactionTraceFile realToElapsedTimeOffsetNanos
                     * @property {number|null} [version] TransactionTraceFile version
                     */
    
                    /**
                     * Constructs a new TransactionTraceFile.
                     * @memberof android.surfaceflinger.proto
                     * @classdesc Represents a TransactionTraceFile.
                     * @implements ITransactionTraceFile
                     * @constructor
                     * @param {android.surfaceflinger.proto.ITransactionTraceFile=} [properties] Properties to set
                     */
                    function TransactionTraceFile(properties) {
                        this.entry = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * TransactionTraceFile magicNumber.
                     * @member {Long} magicNumber
                     * @memberof android.surfaceflinger.proto.TransactionTraceFile
                     * @instance
                     */
                    TransactionTraceFile.prototype.magicNumber = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                    /**
                     * TransactionTraceFile entry.
                     * @member {Array.<android.surfaceflinger.proto.ITransactionTraceEntry>} entry
                     * @memberof android.surfaceflinger.proto.TransactionTraceFile
                     * @instance
                     */
                    TransactionTraceFile.prototype.entry = $util.emptyArray;
    
                    /**
                     * TransactionTraceFile realToElapsedTimeOffsetNanos.
                     * @member {Long} realToElapsedTimeOffsetNanos
                     * @memberof android.surfaceflinger.proto.TransactionTraceFile
                     * @instance
                     */
                    TransactionTraceFile.prototype.realToElapsedTimeOffsetNanos = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                    /**
                     * TransactionTraceFile version.
                     * @member {number} version
                     * @memberof android.surfaceflinger.proto.TransactionTraceFile
                     * @instance
                     */
                    TransactionTraceFile.prototype.version = 0;
    
                    /**
                     * Creates a new TransactionTraceFile instance using the specified properties.
                     * @function create
                     * @memberof android.surfaceflinger.proto.TransactionTraceFile
                     * @static
                     * @param {android.surfaceflinger.proto.ITransactionTraceFile=} [properties] Properties to set
                     * @returns {android.surfaceflinger.proto.TransactionTraceFile} TransactionTraceFile instance
                     */
                    TransactionTraceFile.create = function create(properties) {
                        return new TransactionTraceFile(properties);
                    };
    
                    /**
                     * Encodes the specified TransactionTraceFile message. Does not implicitly {@link android.surfaceflinger.proto.TransactionTraceFile.verify|verify} messages.
                     * @function encode
                     * @memberof android.surfaceflinger.proto.TransactionTraceFile
                     * @static
                     * @param {android.surfaceflinger.proto.ITransactionTraceFile} message TransactionTraceFile message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TransactionTraceFile.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.magicNumber != null && Object.hasOwnProperty.call(message, "magicNumber"))
                            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.magicNumber);
                        if (message.entry != null && message.entry.length)
                            for (var i = 0; i < message.entry.length; ++i)
                                $root.android.surfaceflinger.proto.TransactionTraceEntry.encode(message.entry[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        if (message.realToElapsedTimeOffsetNanos != null && Object.hasOwnProperty.call(message, "realToElapsedTimeOffsetNanos"))
                            writer.uint32(/* id 3, wireType 1 =*/25).fixed64(message.realToElapsedTimeOffsetNanos);
                        if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.version);
                        return writer;
                    };
    
                    /**
                     * Encodes the specified TransactionTraceFile message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.TransactionTraceFile.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof android.surfaceflinger.proto.TransactionTraceFile
                     * @static
                     * @param {android.surfaceflinger.proto.ITransactionTraceFile} message TransactionTraceFile message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TransactionTraceFile.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a TransactionTraceFile message from the specified reader or buffer.
                     * @function decode
                     * @memberof android.surfaceflinger.proto.TransactionTraceFile
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {android.surfaceflinger.proto.TransactionTraceFile} TransactionTraceFile
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TransactionTraceFile.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.proto.TransactionTraceFile();
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
                                    message.entry.push($root.android.surfaceflinger.proto.TransactionTraceEntry.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 3: {
                                    message.realToElapsedTimeOffsetNanos = reader.fixed64();
                                    break;
                                }
                            case 4: {
                                    message.version = reader.uint32();
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
                     * Decodes a TransactionTraceFile message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof android.surfaceflinger.proto.TransactionTraceFile
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {android.surfaceflinger.proto.TransactionTraceFile} TransactionTraceFile
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TransactionTraceFile.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a TransactionTraceFile message.
                     * @function verify
                     * @memberof android.surfaceflinger.proto.TransactionTraceFile
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    TransactionTraceFile.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.magicNumber != null && message.hasOwnProperty("magicNumber"))
                            if (!$util.isInteger(message.magicNumber) && !(message.magicNumber && $util.isInteger(message.magicNumber.low) && $util.isInteger(message.magicNumber.high)))
                                return "magicNumber: integer|Long expected";
                        if (message.entry != null && message.hasOwnProperty("entry")) {
                            if (!Array.isArray(message.entry))
                                return "entry: array expected";
                            for (var i = 0; i < message.entry.length; ++i) {
                                var error = $root.android.surfaceflinger.proto.TransactionTraceEntry.verify(message.entry[i]);
                                if (error)
                                    return "entry." + error;
                            }
                        }
                        if (message.realToElapsedTimeOffsetNanos != null && message.hasOwnProperty("realToElapsedTimeOffsetNanos"))
                            if (!$util.isInteger(message.realToElapsedTimeOffsetNanos) && !(message.realToElapsedTimeOffsetNanos && $util.isInteger(message.realToElapsedTimeOffsetNanos.low) && $util.isInteger(message.realToElapsedTimeOffsetNanos.high)))
                                return "realToElapsedTimeOffsetNanos: integer|Long expected";
                        if (message.version != null && message.hasOwnProperty("version"))
                            if (!$util.isInteger(message.version))
                                return "version: integer expected";
                        return null;
                    };
    
                    /**
                     * Creates a TransactionTraceFile message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof android.surfaceflinger.proto.TransactionTraceFile
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {android.surfaceflinger.proto.TransactionTraceFile} TransactionTraceFile
                     */
                    TransactionTraceFile.fromObject = function fromObject(object) {
                        if (object instanceof $root.android.surfaceflinger.proto.TransactionTraceFile)
                            return object;
                        var message = new $root.android.surfaceflinger.proto.TransactionTraceFile();
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
                                throw TypeError(".android.surfaceflinger.proto.TransactionTraceFile.entry: array expected");
                            message.entry = [];
                            for (var i = 0; i < object.entry.length; ++i) {
                                if (typeof object.entry[i] !== "object")
                                    throw TypeError(".android.surfaceflinger.proto.TransactionTraceFile.entry: object expected");
                                message.entry[i] = $root.android.surfaceflinger.proto.TransactionTraceEntry.fromObject(object.entry[i]);
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
                        if (object.version != null)
                            message.version = object.version >>> 0;
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a TransactionTraceFile message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof android.surfaceflinger.proto.TransactionTraceFile
                     * @static
                     * @param {android.surfaceflinger.proto.TransactionTraceFile} message TransactionTraceFile
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    TransactionTraceFile.toObject = function toObject(message, options) {
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
                            object.version = 0;
                        }
                        if (message.magicNumber != null && message.hasOwnProperty("magicNumber"))
                            if (typeof message.magicNumber === "number")
                                object.magicNumber = options.longs === String ? String(message.magicNumber) : message.magicNumber;
                            else
                                object.magicNumber = options.longs === String ? $util.Long.prototype.toString.call(message.magicNumber) : options.longs === Number ? new $util.LongBits(message.magicNumber.low >>> 0, message.magicNumber.high >>> 0).toNumber() : message.magicNumber;
                        if (message.entry && message.entry.length) {
                            object.entry = [];
                            for (var j = 0; j < message.entry.length; ++j)
                                object.entry[j] = $root.android.surfaceflinger.proto.TransactionTraceEntry.toObject(message.entry[j], options);
                        }
                        if (message.realToElapsedTimeOffsetNanos != null && message.hasOwnProperty("realToElapsedTimeOffsetNanos"))
                            if (typeof message.realToElapsedTimeOffsetNanos === "number")
                                object.realToElapsedTimeOffsetNanos = options.longs === String ? String(message.realToElapsedTimeOffsetNanos) : message.realToElapsedTimeOffsetNanos;
                            else
                                object.realToElapsedTimeOffsetNanos = options.longs === String ? $util.Long.prototype.toString.call(message.realToElapsedTimeOffsetNanos) : options.longs === Number ? new $util.LongBits(message.realToElapsedTimeOffsetNanos.low >>> 0, message.realToElapsedTimeOffsetNanos.high >>> 0).toNumber() : message.realToElapsedTimeOffsetNanos;
                        if (message.version != null && message.hasOwnProperty("version"))
                            object.version = message.version;
                        return object;
                    };
    
                    /**
                     * Converts this TransactionTraceFile to JSON.
                     * @function toJSON
                     * @memberof android.surfaceflinger.proto.TransactionTraceFile
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    TransactionTraceFile.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    /**
                     * Gets the default type url for TransactionTraceFile
                     * @function getTypeUrl
                     * @memberof android.surfaceflinger.proto.TransactionTraceFile
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    TransactionTraceFile.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/android.surfaceflinger.proto.TransactionTraceFile";
                    };
    
                    /**
                     * MagicNumber enum.
                     * @name android.surfaceflinger.proto.TransactionTraceFile.MagicNumber
                     * @enum {number}
                     * @property {number} INVALID=0 INVALID value
                     * @property {number} MAGIC_NUMBER_L=1415073364 MAGIC_NUMBER_L value
                     * @property {number} MAGIC_NUMBER_H=1162035538 MAGIC_NUMBER_H value
                     */
                    TransactionTraceFile.MagicNumber = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "INVALID"] = 0;
                        values[valuesById[1415073364] = "MAGIC_NUMBER_L"] = 1415073364;
                        values[valuesById[1162035538] = "MAGIC_NUMBER_H"] = 1162035538;
                        return values;
                    })();
    
                    return TransactionTraceFile;
                })();
    
                proto.TransactionTraceEntry = (function() {
    
                    /**
                     * Properties of a TransactionTraceEntry.
                     * @memberof android.surfaceflinger.proto
                     * @interface ITransactionTraceEntry
                     * @property {Long|null} [elapsedRealtimeNanos] TransactionTraceEntry elapsedRealtimeNanos
                     * @property {Long|null} [vsyncId] TransactionTraceEntry vsyncId
                     * @property {Array.<android.surfaceflinger.proto.ITransactionState>|null} [transactions] TransactionTraceEntry transactions
                     * @property {Array.<android.surfaceflinger.proto.ILayerCreationArgs>|null} [addedLayers] TransactionTraceEntry addedLayers
                     * @property {Array.<number>|null} [destroyedLayers] TransactionTraceEntry destroyedLayers
                     * @property {Array.<android.surfaceflinger.proto.IDisplayState>|null} [addedDisplays] TransactionTraceEntry addedDisplays
                     * @property {Array.<number>|null} [removedDisplays] TransactionTraceEntry removedDisplays
                     * @property {Array.<number>|null} [destroyedLayerHandles] TransactionTraceEntry destroyedLayerHandles
                     * @property {boolean|null} [displaysChanged] TransactionTraceEntry displaysChanged
                     * @property {Array.<android.surfaceflinger.proto.IDisplayInfo>|null} [displays] TransactionTraceEntry displays
                     */
    
                    /**
                     * Constructs a new TransactionTraceEntry.
                     * @memberof android.surfaceflinger.proto
                     * @classdesc Represents a TransactionTraceEntry.
                     * @implements ITransactionTraceEntry
                     * @constructor
                     * @param {android.surfaceflinger.proto.ITransactionTraceEntry=} [properties] Properties to set
                     */
                    function TransactionTraceEntry(properties) {
                        this.transactions = [];
                        this.addedLayers = [];
                        this.destroyedLayers = [];
                        this.addedDisplays = [];
                        this.removedDisplays = [];
                        this.destroyedLayerHandles = [];
                        this.displays = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * TransactionTraceEntry elapsedRealtimeNanos.
                     * @member {Long} elapsedRealtimeNanos
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @instance
                     */
                    TransactionTraceEntry.prototype.elapsedRealtimeNanos = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                    /**
                     * TransactionTraceEntry vsyncId.
                     * @member {Long} vsyncId
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @instance
                     */
                    TransactionTraceEntry.prototype.vsyncId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                    /**
                     * TransactionTraceEntry transactions.
                     * @member {Array.<android.surfaceflinger.proto.ITransactionState>} transactions
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @instance
                     */
                    TransactionTraceEntry.prototype.transactions = $util.emptyArray;
    
                    /**
                     * TransactionTraceEntry addedLayers.
                     * @member {Array.<android.surfaceflinger.proto.ILayerCreationArgs>} addedLayers
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @instance
                     */
                    TransactionTraceEntry.prototype.addedLayers = $util.emptyArray;
    
                    /**
                     * TransactionTraceEntry destroyedLayers.
                     * @member {Array.<number>} destroyedLayers
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @instance
                     */
                    TransactionTraceEntry.prototype.destroyedLayers = $util.emptyArray;
    
                    /**
                     * TransactionTraceEntry addedDisplays.
                     * @member {Array.<android.surfaceflinger.proto.IDisplayState>} addedDisplays
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @instance
                     */
                    TransactionTraceEntry.prototype.addedDisplays = $util.emptyArray;
    
                    /**
                     * TransactionTraceEntry removedDisplays.
                     * @member {Array.<number>} removedDisplays
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @instance
                     */
                    TransactionTraceEntry.prototype.removedDisplays = $util.emptyArray;
    
                    /**
                     * TransactionTraceEntry destroyedLayerHandles.
                     * @member {Array.<number>} destroyedLayerHandles
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @instance
                     */
                    TransactionTraceEntry.prototype.destroyedLayerHandles = $util.emptyArray;
    
                    /**
                     * TransactionTraceEntry displaysChanged.
                     * @member {boolean} displaysChanged
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @instance
                     */
                    TransactionTraceEntry.prototype.displaysChanged = false;
    
                    /**
                     * TransactionTraceEntry displays.
                     * @member {Array.<android.surfaceflinger.proto.IDisplayInfo>} displays
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @instance
                     */
                    TransactionTraceEntry.prototype.displays = $util.emptyArray;
    
                    /**
                     * Creates a new TransactionTraceEntry instance using the specified properties.
                     * @function create
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @static
                     * @param {android.surfaceflinger.proto.ITransactionTraceEntry=} [properties] Properties to set
                     * @returns {android.surfaceflinger.proto.TransactionTraceEntry} TransactionTraceEntry instance
                     */
                    TransactionTraceEntry.create = function create(properties) {
                        return new TransactionTraceEntry(properties);
                    };
    
                    /**
                     * Encodes the specified TransactionTraceEntry message. Does not implicitly {@link android.surfaceflinger.proto.TransactionTraceEntry.verify|verify} messages.
                     * @function encode
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @static
                     * @param {android.surfaceflinger.proto.ITransactionTraceEntry} message TransactionTraceEntry message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TransactionTraceEntry.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.elapsedRealtimeNanos != null && Object.hasOwnProperty.call(message, "elapsedRealtimeNanos"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.elapsedRealtimeNanos);
                        if (message.vsyncId != null && Object.hasOwnProperty.call(message, "vsyncId"))
                            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.vsyncId);
                        if (message.transactions != null && message.transactions.length)
                            for (var i = 0; i < message.transactions.length; ++i)
                                $root.android.surfaceflinger.proto.TransactionState.encode(message.transactions[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                        if (message.addedLayers != null && message.addedLayers.length)
                            for (var i = 0; i < message.addedLayers.length; ++i)
                                $root.android.surfaceflinger.proto.LayerCreationArgs.encode(message.addedLayers[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                        if (message.destroyedLayers != null && message.destroyedLayers.length) {
                            writer.uint32(/* id 5, wireType 2 =*/42).fork();
                            for (var i = 0; i < message.destroyedLayers.length; ++i)
                                writer.uint32(message.destroyedLayers[i]);
                            writer.ldelim();
                        }
                        if (message.addedDisplays != null && message.addedDisplays.length)
                            for (var i = 0; i < message.addedDisplays.length; ++i)
                                $root.android.surfaceflinger.proto.DisplayState.encode(message.addedDisplays[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                        if (message.removedDisplays != null && message.removedDisplays.length) {
                            writer.uint32(/* id 7, wireType 2 =*/58).fork();
                            for (var i = 0; i < message.removedDisplays.length; ++i)
                                writer.int32(message.removedDisplays[i]);
                            writer.ldelim();
                        }
                        if (message.destroyedLayerHandles != null && message.destroyedLayerHandles.length) {
                            writer.uint32(/* id 8, wireType 2 =*/66).fork();
                            for (var i = 0; i < message.destroyedLayerHandles.length; ++i)
                                writer.uint32(message.destroyedLayerHandles[i]);
                            writer.ldelim();
                        }
                        if (message.displaysChanged != null && Object.hasOwnProperty.call(message, "displaysChanged"))
                            writer.uint32(/* id 9, wireType 0 =*/72).bool(message.displaysChanged);
                        if (message.displays != null && message.displays.length)
                            for (var i = 0; i < message.displays.length; ++i)
                                $root.android.surfaceflinger.proto.DisplayInfo.encode(message.displays[i], writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                        return writer;
                    };
    
                    /**
                     * Encodes the specified TransactionTraceEntry message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.TransactionTraceEntry.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @static
                     * @param {android.surfaceflinger.proto.ITransactionTraceEntry} message TransactionTraceEntry message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TransactionTraceEntry.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a TransactionTraceEntry message from the specified reader or buffer.
                     * @function decode
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {android.surfaceflinger.proto.TransactionTraceEntry} TransactionTraceEntry
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TransactionTraceEntry.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.proto.TransactionTraceEntry();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1: {
                                    message.elapsedRealtimeNanos = reader.int64();
                                    break;
                                }
                            case 2: {
                                    message.vsyncId = reader.int64();
                                    break;
                                }
                            case 3: {
                                    if (!(message.transactions && message.transactions.length))
                                        message.transactions = [];
                                    message.transactions.push($root.android.surfaceflinger.proto.TransactionState.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 4: {
                                    if (!(message.addedLayers && message.addedLayers.length))
                                        message.addedLayers = [];
                                    message.addedLayers.push($root.android.surfaceflinger.proto.LayerCreationArgs.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 5: {
                                    if (!(message.destroyedLayers && message.destroyedLayers.length))
                                        message.destroyedLayers = [];
                                    if ((tag & 7) === 2) {
                                        var end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.destroyedLayers.push(reader.uint32());
                                    } else
                                        message.destroyedLayers.push(reader.uint32());
                                    break;
                                }
                            case 6: {
                                    if (!(message.addedDisplays && message.addedDisplays.length))
                                        message.addedDisplays = [];
                                    message.addedDisplays.push($root.android.surfaceflinger.proto.DisplayState.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 7: {
                                    if (!(message.removedDisplays && message.removedDisplays.length))
                                        message.removedDisplays = [];
                                    if ((tag & 7) === 2) {
                                        var end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.removedDisplays.push(reader.int32());
                                    } else
                                        message.removedDisplays.push(reader.int32());
                                    break;
                                }
                            case 8: {
                                    if (!(message.destroyedLayerHandles && message.destroyedLayerHandles.length))
                                        message.destroyedLayerHandles = [];
                                    if ((tag & 7) === 2) {
                                        var end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.destroyedLayerHandles.push(reader.uint32());
                                    } else
                                        message.destroyedLayerHandles.push(reader.uint32());
                                    break;
                                }
                            case 9: {
                                    message.displaysChanged = reader.bool();
                                    break;
                                }
                            case 10: {
                                    if (!(message.displays && message.displays.length))
                                        message.displays = [];
                                    message.displays.push($root.android.surfaceflinger.proto.DisplayInfo.decode(reader, reader.uint32()));
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
                     * Decodes a TransactionTraceEntry message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {android.surfaceflinger.proto.TransactionTraceEntry} TransactionTraceEntry
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TransactionTraceEntry.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a TransactionTraceEntry message.
                     * @function verify
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    TransactionTraceEntry.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.elapsedRealtimeNanos != null && message.hasOwnProperty("elapsedRealtimeNanos"))
                            if (!$util.isInteger(message.elapsedRealtimeNanos) && !(message.elapsedRealtimeNanos && $util.isInteger(message.elapsedRealtimeNanos.low) && $util.isInteger(message.elapsedRealtimeNanos.high)))
                                return "elapsedRealtimeNanos: integer|Long expected";
                        if (message.vsyncId != null && message.hasOwnProperty("vsyncId"))
                            if (!$util.isInteger(message.vsyncId) && !(message.vsyncId && $util.isInteger(message.vsyncId.low) && $util.isInteger(message.vsyncId.high)))
                                return "vsyncId: integer|Long expected";
                        if (message.transactions != null && message.hasOwnProperty("transactions")) {
                            if (!Array.isArray(message.transactions))
                                return "transactions: array expected";
                            for (var i = 0; i < message.transactions.length; ++i) {
                                var error = $root.android.surfaceflinger.proto.TransactionState.verify(message.transactions[i]);
                                if (error)
                                    return "transactions." + error;
                            }
                        }
                        if (message.addedLayers != null && message.hasOwnProperty("addedLayers")) {
                            if (!Array.isArray(message.addedLayers))
                                return "addedLayers: array expected";
                            for (var i = 0; i < message.addedLayers.length; ++i) {
                                var error = $root.android.surfaceflinger.proto.LayerCreationArgs.verify(message.addedLayers[i]);
                                if (error)
                                    return "addedLayers." + error;
                            }
                        }
                        if (message.destroyedLayers != null && message.hasOwnProperty("destroyedLayers")) {
                            if (!Array.isArray(message.destroyedLayers))
                                return "destroyedLayers: array expected";
                            for (var i = 0; i < message.destroyedLayers.length; ++i)
                                if (!$util.isInteger(message.destroyedLayers[i]))
                                    return "destroyedLayers: integer[] expected";
                        }
                        if (message.addedDisplays != null && message.hasOwnProperty("addedDisplays")) {
                            if (!Array.isArray(message.addedDisplays))
                                return "addedDisplays: array expected";
                            for (var i = 0; i < message.addedDisplays.length; ++i) {
                                var error = $root.android.surfaceflinger.proto.DisplayState.verify(message.addedDisplays[i]);
                                if (error)
                                    return "addedDisplays." + error;
                            }
                        }
                        if (message.removedDisplays != null && message.hasOwnProperty("removedDisplays")) {
                            if (!Array.isArray(message.removedDisplays))
                                return "removedDisplays: array expected";
                            for (var i = 0; i < message.removedDisplays.length; ++i)
                                if (!$util.isInteger(message.removedDisplays[i]))
                                    return "removedDisplays: integer[] expected";
                        }
                        if (message.destroyedLayerHandles != null && message.hasOwnProperty("destroyedLayerHandles")) {
                            if (!Array.isArray(message.destroyedLayerHandles))
                                return "destroyedLayerHandles: array expected";
                            for (var i = 0; i < message.destroyedLayerHandles.length; ++i)
                                if (!$util.isInteger(message.destroyedLayerHandles[i]))
                                    return "destroyedLayerHandles: integer[] expected";
                        }
                        if (message.displaysChanged != null && message.hasOwnProperty("displaysChanged"))
                            if (typeof message.displaysChanged !== "boolean")
                                return "displaysChanged: boolean expected";
                        if (message.displays != null && message.hasOwnProperty("displays")) {
                            if (!Array.isArray(message.displays))
                                return "displays: array expected";
                            for (var i = 0; i < message.displays.length; ++i) {
                                var error = $root.android.surfaceflinger.proto.DisplayInfo.verify(message.displays[i]);
                                if (error)
                                    return "displays." + error;
                            }
                        }
                        return null;
                    };
    
                    /**
                     * Creates a TransactionTraceEntry message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {android.surfaceflinger.proto.TransactionTraceEntry} TransactionTraceEntry
                     */
                    TransactionTraceEntry.fromObject = function fromObject(object) {
                        if (object instanceof $root.android.surfaceflinger.proto.TransactionTraceEntry)
                            return object;
                        var message = new $root.android.surfaceflinger.proto.TransactionTraceEntry();
                        if (object.elapsedRealtimeNanos != null)
                            if ($util.Long)
                                (message.elapsedRealtimeNanos = $util.Long.fromValue(object.elapsedRealtimeNanos)).unsigned = false;
                            else if (typeof object.elapsedRealtimeNanos === "string")
                                message.elapsedRealtimeNanos = parseInt(object.elapsedRealtimeNanos, 10);
                            else if (typeof object.elapsedRealtimeNanos === "number")
                                message.elapsedRealtimeNanos = object.elapsedRealtimeNanos;
                            else if (typeof object.elapsedRealtimeNanos === "object")
                                message.elapsedRealtimeNanos = new $util.LongBits(object.elapsedRealtimeNanos.low >>> 0, object.elapsedRealtimeNanos.high >>> 0).toNumber();
                        if (object.vsyncId != null)
                            if ($util.Long)
                                (message.vsyncId = $util.Long.fromValue(object.vsyncId)).unsigned = false;
                            else if (typeof object.vsyncId === "string")
                                message.vsyncId = parseInt(object.vsyncId, 10);
                            else if (typeof object.vsyncId === "number")
                                message.vsyncId = object.vsyncId;
                            else if (typeof object.vsyncId === "object")
                                message.vsyncId = new $util.LongBits(object.vsyncId.low >>> 0, object.vsyncId.high >>> 0).toNumber();
                        if (object.transactions) {
                            if (!Array.isArray(object.transactions))
                                throw TypeError(".android.surfaceflinger.proto.TransactionTraceEntry.transactions: array expected");
                            message.transactions = [];
                            for (var i = 0; i < object.transactions.length; ++i) {
                                if (typeof object.transactions[i] !== "object")
                                    throw TypeError(".android.surfaceflinger.proto.TransactionTraceEntry.transactions: object expected");
                                message.transactions[i] = $root.android.surfaceflinger.proto.TransactionState.fromObject(object.transactions[i]);
                            }
                        }
                        if (object.addedLayers) {
                            if (!Array.isArray(object.addedLayers))
                                throw TypeError(".android.surfaceflinger.proto.TransactionTraceEntry.addedLayers: array expected");
                            message.addedLayers = [];
                            for (var i = 0; i < object.addedLayers.length; ++i) {
                                if (typeof object.addedLayers[i] !== "object")
                                    throw TypeError(".android.surfaceflinger.proto.TransactionTraceEntry.addedLayers: object expected");
                                message.addedLayers[i] = $root.android.surfaceflinger.proto.LayerCreationArgs.fromObject(object.addedLayers[i]);
                            }
                        }
                        if (object.destroyedLayers) {
                            if (!Array.isArray(object.destroyedLayers))
                                throw TypeError(".android.surfaceflinger.proto.TransactionTraceEntry.destroyedLayers: array expected");
                            message.destroyedLayers = [];
                            for (var i = 0; i < object.destroyedLayers.length; ++i)
                                message.destroyedLayers[i] = object.destroyedLayers[i] >>> 0;
                        }
                        if (object.addedDisplays) {
                            if (!Array.isArray(object.addedDisplays))
                                throw TypeError(".android.surfaceflinger.proto.TransactionTraceEntry.addedDisplays: array expected");
                            message.addedDisplays = [];
                            for (var i = 0; i < object.addedDisplays.length; ++i) {
                                if (typeof object.addedDisplays[i] !== "object")
                                    throw TypeError(".android.surfaceflinger.proto.TransactionTraceEntry.addedDisplays: object expected");
                                message.addedDisplays[i] = $root.android.surfaceflinger.proto.DisplayState.fromObject(object.addedDisplays[i]);
                            }
                        }
                        if (object.removedDisplays) {
                            if (!Array.isArray(object.removedDisplays))
                                throw TypeError(".android.surfaceflinger.proto.TransactionTraceEntry.removedDisplays: array expected");
                            message.removedDisplays = [];
                            for (var i = 0; i < object.removedDisplays.length; ++i)
                                message.removedDisplays[i] = object.removedDisplays[i] | 0;
                        }
                        if (object.destroyedLayerHandles) {
                            if (!Array.isArray(object.destroyedLayerHandles))
                                throw TypeError(".android.surfaceflinger.proto.TransactionTraceEntry.destroyedLayerHandles: array expected");
                            message.destroyedLayerHandles = [];
                            for (var i = 0; i < object.destroyedLayerHandles.length; ++i)
                                message.destroyedLayerHandles[i] = object.destroyedLayerHandles[i] >>> 0;
                        }
                        if (object.displaysChanged != null)
                            message.displaysChanged = Boolean(object.displaysChanged);
                        if (object.displays) {
                            if (!Array.isArray(object.displays))
                                throw TypeError(".android.surfaceflinger.proto.TransactionTraceEntry.displays: array expected");
                            message.displays = [];
                            for (var i = 0; i < object.displays.length; ++i) {
                                if (typeof object.displays[i] !== "object")
                                    throw TypeError(".android.surfaceflinger.proto.TransactionTraceEntry.displays: object expected");
                                message.displays[i] = $root.android.surfaceflinger.proto.DisplayInfo.fromObject(object.displays[i]);
                            }
                        }
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a TransactionTraceEntry message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @static
                     * @param {android.surfaceflinger.proto.TransactionTraceEntry} message TransactionTraceEntry
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    TransactionTraceEntry.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.arrays || options.defaults) {
                            object.transactions = [];
                            object.addedLayers = [];
                            object.destroyedLayers = [];
                            object.addedDisplays = [];
                            object.removedDisplays = [];
                            object.destroyedLayerHandles = [];
                            object.displays = [];
                        }
                        if (options.defaults) {
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.elapsedRealtimeNanos = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.elapsedRealtimeNanos = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.vsyncId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.vsyncId = options.longs === String ? "0" : 0;
                            object.displaysChanged = false;
                        }
                        if (message.elapsedRealtimeNanos != null && message.hasOwnProperty("elapsedRealtimeNanos"))
                            if (typeof message.elapsedRealtimeNanos === "number")
                                object.elapsedRealtimeNanos = options.longs === String ? String(message.elapsedRealtimeNanos) : message.elapsedRealtimeNanos;
                            else
                                object.elapsedRealtimeNanos = options.longs === String ? $util.Long.prototype.toString.call(message.elapsedRealtimeNanos) : options.longs === Number ? new $util.LongBits(message.elapsedRealtimeNanos.low >>> 0, message.elapsedRealtimeNanos.high >>> 0).toNumber() : message.elapsedRealtimeNanos;
                        if (message.vsyncId != null && message.hasOwnProperty("vsyncId"))
                            if (typeof message.vsyncId === "number")
                                object.vsyncId = options.longs === String ? String(message.vsyncId) : message.vsyncId;
                            else
                                object.vsyncId = options.longs === String ? $util.Long.prototype.toString.call(message.vsyncId) : options.longs === Number ? new $util.LongBits(message.vsyncId.low >>> 0, message.vsyncId.high >>> 0).toNumber() : message.vsyncId;
                        if (message.transactions && message.transactions.length) {
                            object.transactions = [];
                            for (var j = 0; j < message.transactions.length; ++j)
                                object.transactions[j] = $root.android.surfaceflinger.proto.TransactionState.toObject(message.transactions[j], options);
                        }
                        if (message.addedLayers && message.addedLayers.length) {
                            object.addedLayers = [];
                            for (var j = 0; j < message.addedLayers.length; ++j)
                                object.addedLayers[j] = $root.android.surfaceflinger.proto.LayerCreationArgs.toObject(message.addedLayers[j], options);
                        }
                        if (message.destroyedLayers && message.destroyedLayers.length) {
                            object.destroyedLayers = [];
                            for (var j = 0; j < message.destroyedLayers.length; ++j)
                                object.destroyedLayers[j] = message.destroyedLayers[j];
                        }
                        if (message.addedDisplays && message.addedDisplays.length) {
                            object.addedDisplays = [];
                            for (var j = 0; j < message.addedDisplays.length; ++j)
                                object.addedDisplays[j] = $root.android.surfaceflinger.proto.DisplayState.toObject(message.addedDisplays[j], options);
                        }
                        if (message.removedDisplays && message.removedDisplays.length) {
                            object.removedDisplays = [];
                            for (var j = 0; j < message.removedDisplays.length; ++j)
                                object.removedDisplays[j] = message.removedDisplays[j];
                        }
                        if (message.destroyedLayerHandles && message.destroyedLayerHandles.length) {
                            object.destroyedLayerHandles = [];
                            for (var j = 0; j < message.destroyedLayerHandles.length; ++j)
                                object.destroyedLayerHandles[j] = message.destroyedLayerHandles[j];
                        }
                        if (message.displaysChanged != null && message.hasOwnProperty("displaysChanged"))
                            object.displaysChanged = message.displaysChanged;
                        if (message.displays && message.displays.length) {
                            object.displays = [];
                            for (var j = 0; j < message.displays.length; ++j)
                                object.displays[j] = $root.android.surfaceflinger.proto.DisplayInfo.toObject(message.displays[j], options);
                        }
                        return object;
                    };
    
                    /**
                     * Converts this TransactionTraceEntry to JSON.
                     * @function toJSON
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    TransactionTraceEntry.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    /**
                     * Gets the default type url for TransactionTraceEntry
                     * @function getTypeUrl
                     * @memberof android.surfaceflinger.proto.TransactionTraceEntry
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    TransactionTraceEntry.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/android.surfaceflinger.proto.TransactionTraceEntry";
                    };
    
                    return TransactionTraceEntry;
                })();
    
                proto.DisplayInfo = (function() {
    
                    /**
                     * Properties of a DisplayInfo.
                     * @memberof android.surfaceflinger.proto
                     * @interface IDisplayInfo
                     * @property {number|null} [layerStack] DisplayInfo layerStack
                     * @property {number|null} [displayId] DisplayInfo displayId
                     * @property {number|null} [logicalWidth] DisplayInfo logicalWidth
                     * @property {number|null} [logicalHeight] DisplayInfo logicalHeight
                     * @property {android.surfaceflinger.proto.ITransform|null} [transformInverse] DisplayInfo transformInverse
                     * @property {android.surfaceflinger.proto.ITransform|null} [transform] DisplayInfo transform
                     * @property {boolean|null} [receivesInput] DisplayInfo receivesInput
                     * @property {boolean|null} [isSecure] DisplayInfo isSecure
                     * @property {boolean|null} [isPrimary] DisplayInfo isPrimary
                     * @property {boolean|null} [isVirtual] DisplayInfo isVirtual
                     * @property {number|null} [rotationFlags] DisplayInfo rotationFlags
                     * @property {number|null} [transformHint] DisplayInfo transformHint
                     */
    
                    /**
                     * Constructs a new DisplayInfo.
                     * @memberof android.surfaceflinger.proto
                     * @classdesc Represents a DisplayInfo.
                     * @implements IDisplayInfo
                     * @constructor
                     * @param {android.surfaceflinger.proto.IDisplayInfo=} [properties] Properties to set
                     */
                    function DisplayInfo(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * DisplayInfo layerStack.
                     * @member {number} layerStack
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @instance
                     */
                    DisplayInfo.prototype.layerStack = 0;
    
                    /**
                     * DisplayInfo displayId.
                     * @member {number} displayId
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @instance
                     */
                    DisplayInfo.prototype.displayId = 0;
    
                    /**
                     * DisplayInfo logicalWidth.
                     * @member {number} logicalWidth
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @instance
                     */
                    DisplayInfo.prototype.logicalWidth = 0;
    
                    /**
                     * DisplayInfo logicalHeight.
                     * @member {number} logicalHeight
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @instance
                     */
                    DisplayInfo.prototype.logicalHeight = 0;
    
                    /**
                     * DisplayInfo transformInverse.
                     * @member {android.surfaceflinger.proto.ITransform|null|undefined} transformInverse
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @instance
                     */
                    DisplayInfo.prototype.transformInverse = null;
    
                    /**
                     * DisplayInfo transform.
                     * @member {android.surfaceflinger.proto.ITransform|null|undefined} transform
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @instance
                     */
                    DisplayInfo.prototype.transform = null;
    
                    /**
                     * DisplayInfo receivesInput.
                     * @member {boolean} receivesInput
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @instance
                     */
                    DisplayInfo.prototype.receivesInput = false;
    
                    /**
                     * DisplayInfo isSecure.
                     * @member {boolean} isSecure
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @instance
                     */
                    DisplayInfo.prototype.isSecure = false;
    
                    /**
                     * DisplayInfo isPrimary.
                     * @member {boolean} isPrimary
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @instance
                     */
                    DisplayInfo.prototype.isPrimary = false;
    
                    /**
                     * DisplayInfo isVirtual.
                     * @member {boolean} isVirtual
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @instance
                     */
                    DisplayInfo.prototype.isVirtual = false;
    
                    /**
                     * DisplayInfo rotationFlags.
                     * @member {number} rotationFlags
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @instance
                     */
                    DisplayInfo.prototype.rotationFlags = 0;
    
                    /**
                     * DisplayInfo transformHint.
                     * @member {number} transformHint
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @instance
                     */
                    DisplayInfo.prototype.transformHint = 0;
    
                    /**
                     * Creates a new DisplayInfo instance using the specified properties.
                     * @function create
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @static
                     * @param {android.surfaceflinger.proto.IDisplayInfo=} [properties] Properties to set
                     * @returns {android.surfaceflinger.proto.DisplayInfo} DisplayInfo instance
                     */
                    DisplayInfo.create = function create(properties) {
                        return new DisplayInfo(properties);
                    };
    
                    /**
                     * Encodes the specified DisplayInfo message. Does not implicitly {@link android.surfaceflinger.proto.DisplayInfo.verify|verify} messages.
                     * @function encode
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @static
                     * @param {android.surfaceflinger.proto.IDisplayInfo} message DisplayInfo message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DisplayInfo.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.layerStack != null && Object.hasOwnProperty.call(message, "layerStack"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.layerStack);
                        if (message.displayId != null && Object.hasOwnProperty.call(message, "displayId"))
                            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.displayId);
                        if (message.logicalWidth != null && Object.hasOwnProperty.call(message, "logicalWidth"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.logicalWidth);
                        if (message.logicalHeight != null && Object.hasOwnProperty.call(message, "logicalHeight"))
                            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.logicalHeight);
                        if (message.transformInverse != null && Object.hasOwnProperty.call(message, "transformInverse"))
                            $root.android.surfaceflinger.proto.Transform.encode(message.transformInverse, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                        if (message.transform != null && Object.hasOwnProperty.call(message, "transform"))
                            $root.android.surfaceflinger.proto.Transform.encode(message.transform, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                        if (message.receivesInput != null && Object.hasOwnProperty.call(message, "receivesInput"))
                            writer.uint32(/* id 7, wireType 0 =*/56).bool(message.receivesInput);
                        if (message.isSecure != null && Object.hasOwnProperty.call(message, "isSecure"))
                            writer.uint32(/* id 8, wireType 0 =*/64).bool(message.isSecure);
                        if (message.isPrimary != null && Object.hasOwnProperty.call(message, "isPrimary"))
                            writer.uint32(/* id 9, wireType 0 =*/72).bool(message.isPrimary);
                        if (message.isVirtual != null && Object.hasOwnProperty.call(message, "isVirtual"))
                            writer.uint32(/* id 10, wireType 0 =*/80).bool(message.isVirtual);
                        if (message.rotationFlags != null && Object.hasOwnProperty.call(message, "rotationFlags"))
                            writer.uint32(/* id 11, wireType 0 =*/88).int32(message.rotationFlags);
                        if (message.transformHint != null && Object.hasOwnProperty.call(message, "transformHint"))
                            writer.uint32(/* id 12, wireType 0 =*/96).int32(message.transformHint);
                        return writer;
                    };
    
                    /**
                     * Encodes the specified DisplayInfo message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.DisplayInfo.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @static
                     * @param {android.surfaceflinger.proto.IDisplayInfo} message DisplayInfo message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DisplayInfo.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a DisplayInfo message from the specified reader or buffer.
                     * @function decode
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {android.surfaceflinger.proto.DisplayInfo} DisplayInfo
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DisplayInfo.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.proto.DisplayInfo();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1: {
                                    message.layerStack = reader.uint32();
                                    break;
                                }
                            case 2: {
                                    message.displayId = reader.int32();
                                    break;
                                }
                            case 3: {
                                    message.logicalWidth = reader.int32();
                                    break;
                                }
                            case 4: {
                                    message.logicalHeight = reader.int32();
                                    break;
                                }
                            case 5: {
                                    message.transformInverse = $root.android.surfaceflinger.proto.Transform.decode(reader, reader.uint32());
                                    break;
                                }
                            case 6: {
                                    message.transform = $root.android.surfaceflinger.proto.Transform.decode(reader, reader.uint32());
                                    break;
                                }
                            case 7: {
                                    message.receivesInput = reader.bool();
                                    break;
                                }
                            case 8: {
                                    message.isSecure = reader.bool();
                                    break;
                                }
                            case 9: {
                                    message.isPrimary = reader.bool();
                                    break;
                                }
                            case 10: {
                                    message.isVirtual = reader.bool();
                                    break;
                                }
                            case 11: {
                                    message.rotationFlags = reader.int32();
                                    break;
                                }
                            case 12: {
                                    message.transformHint = reader.int32();
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
                     * Decodes a DisplayInfo message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {android.surfaceflinger.proto.DisplayInfo} DisplayInfo
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DisplayInfo.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a DisplayInfo message.
                     * @function verify
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    DisplayInfo.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.layerStack != null && message.hasOwnProperty("layerStack"))
                            if (!$util.isInteger(message.layerStack))
                                return "layerStack: integer expected";
                        if (message.displayId != null && message.hasOwnProperty("displayId"))
                            if (!$util.isInteger(message.displayId))
                                return "displayId: integer expected";
                        if (message.logicalWidth != null && message.hasOwnProperty("logicalWidth"))
                            if (!$util.isInteger(message.logicalWidth))
                                return "logicalWidth: integer expected";
                        if (message.logicalHeight != null && message.hasOwnProperty("logicalHeight"))
                            if (!$util.isInteger(message.logicalHeight))
                                return "logicalHeight: integer expected";
                        if (message.transformInverse != null && message.hasOwnProperty("transformInverse")) {
                            var error = $root.android.surfaceflinger.proto.Transform.verify(message.transformInverse);
                            if (error)
                                return "transformInverse." + error;
                        }
                        if (message.transform != null && message.hasOwnProperty("transform")) {
                            var error = $root.android.surfaceflinger.proto.Transform.verify(message.transform);
                            if (error)
                                return "transform." + error;
                        }
                        if (message.receivesInput != null && message.hasOwnProperty("receivesInput"))
                            if (typeof message.receivesInput !== "boolean")
                                return "receivesInput: boolean expected";
                        if (message.isSecure != null && message.hasOwnProperty("isSecure"))
                            if (typeof message.isSecure !== "boolean")
                                return "isSecure: boolean expected";
                        if (message.isPrimary != null && message.hasOwnProperty("isPrimary"))
                            if (typeof message.isPrimary !== "boolean")
                                return "isPrimary: boolean expected";
                        if (message.isVirtual != null && message.hasOwnProperty("isVirtual"))
                            if (typeof message.isVirtual !== "boolean")
                                return "isVirtual: boolean expected";
                        if (message.rotationFlags != null && message.hasOwnProperty("rotationFlags"))
                            if (!$util.isInteger(message.rotationFlags))
                                return "rotationFlags: integer expected";
                        if (message.transformHint != null && message.hasOwnProperty("transformHint"))
                            if (!$util.isInteger(message.transformHint))
                                return "transformHint: integer expected";
                        return null;
                    };
    
                    /**
                     * Creates a DisplayInfo message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {android.surfaceflinger.proto.DisplayInfo} DisplayInfo
                     */
                    DisplayInfo.fromObject = function fromObject(object) {
                        if (object instanceof $root.android.surfaceflinger.proto.DisplayInfo)
                            return object;
                        var message = new $root.android.surfaceflinger.proto.DisplayInfo();
                        if (object.layerStack != null)
                            message.layerStack = object.layerStack >>> 0;
                        if (object.displayId != null)
                            message.displayId = object.displayId | 0;
                        if (object.logicalWidth != null)
                            message.logicalWidth = object.logicalWidth | 0;
                        if (object.logicalHeight != null)
                            message.logicalHeight = object.logicalHeight | 0;
                        if (object.transformInverse != null) {
                            if (typeof object.transformInverse !== "object")
                                throw TypeError(".android.surfaceflinger.proto.DisplayInfo.transformInverse: object expected");
                            message.transformInverse = $root.android.surfaceflinger.proto.Transform.fromObject(object.transformInverse);
                        }
                        if (object.transform != null) {
                            if (typeof object.transform !== "object")
                                throw TypeError(".android.surfaceflinger.proto.DisplayInfo.transform: object expected");
                            message.transform = $root.android.surfaceflinger.proto.Transform.fromObject(object.transform);
                        }
                        if (object.receivesInput != null)
                            message.receivesInput = Boolean(object.receivesInput);
                        if (object.isSecure != null)
                            message.isSecure = Boolean(object.isSecure);
                        if (object.isPrimary != null)
                            message.isPrimary = Boolean(object.isPrimary);
                        if (object.isVirtual != null)
                            message.isVirtual = Boolean(object.isVirtual);
                        if (object.rotationFlags != null)
                            message.rotationFlags = object.rotationFlags | 0;
                        if (object.transformHint != null)
                            message.transformHint = object.transformHint | 0;
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a DisplayInfo message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @static
                     * @param {android.surfaceflinger.proto.DisplayInfo} message DisplayInfo
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    DisplayInfo.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.layerStack = 0;
                            object.displayId = 0;
                            object.logicalWidth = 0;
                            object.logicalHeight = 0;
                            object.transformInverse = null;
                            object.transform = null;
                            object.receivesInput = false;
                            object.isSecure = false;
                            object.isPrimary = false;
                            object.isVirtual = false;
                            object.rotationFlags = 0;
                            object.transformHint = 0;
                        }
                        if (message.layerStack != null && message.hasOwnProperty("layerStack"))
                            object.layerStack = message.layerStack;
                        if (message.displayId != null && message.hasOwnProperty("displayId"))
                            object.displayId = message.displayId;
                        if (message.logicalWidth != null && message.hasOwnProperty("logicalWidth"))
                            object.logicalWidth = message.logicalWidth;
                        if (message.logicalHeight != null && message.hasOwnProperty("logicalHeight"))
                            object.logicalHeight = message.logicalHeight;
                        if (message.transformInverse != null && message.hasOwnProperty("transformInverse"))
                            object.transformInverse = $root.android.surfaceflinger.proto.Transform.toObject(message.transformInverse, options);
                        if (message.transform != null && message.hasOwnProperty("transform"))
                            object.transform = $root.android.surfaceflinger.proto.Transform.toObject(message.transform, options);
                        if (message.receivesInput != null && message.hasOwnProperty("receivesInput"))
                            object.receivesInput = message.receivesInput;
                        if (message.isSecure != null && message.hasOwnProperty("isSecure"))
                            object.isSecure = message.isSecure;
                        if (message.isPrimary != null && message.hasOwnProperty("isPrimary"))
                            object.isPrimary = message.isPrimary;
                        if (message.isVirtual != null && message.hasOwnProperty("isVirtual"))
                            object.isVirtual = message.isVirtual;
                        if (message.rotationFlags != null && message.hasOwnProperty("rotationFlags"))
                            object.rotationFlags = message.rotationFlags;
                        if (message.transformHint != null && message.hasOwnProperty("transformHint"))
                            object.transformHint = message.transformHint;
                        return object;
                    };
    
                    /**
                     * Converts this DisplayInfo to JSON.
                     * @function toJSON
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    DisplayInfo.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    /**
                     * Gets the default type url for DisplayInfo
                     * @function getTypeUrl
                     * @memberof android.surfaceflinger.proto.DisplayInfo
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    DisplayInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/android.surfaceflinger.proto.DisplayInfo";
                    };
    
                    return DisplayInfo;
                })();
    
                proto.LayerCreationArgs = (function() {
    
                    /**
                     * Properties of a LayerCreationArgs.
                     * @memberof android.surfaceflinger.proto
                     * @interface ILayerCreationArgs
                     * @property {number|null} [layerId] LayerCreationArgs layerId
                     * @property {string|null} [name] LayerCreationArgs name
                     * @property {number|null} [flags] LayerCreationArgs flags
                     * @property {number|null} [parentId] LayerCreationArgs parentId
                     * @property {number|null} [mirrorFromId] LayerCreationArgs mirrorFromId
                     * @property {boolean|null} [addToRoot] LayerCreationArgs addToRoot
                     * @property {number|null} [layerStackToMirror] LayerCreationArgs layerStackToMirror
                     */
    
                    /**
                     * Constructs a new LayerCreationArgs.
                     * @memberof android.surfaceflinger.proto
                     * @classdesc Represents a LayerCreationArgs.
                     * @implements ILayerCreationArgs
                     * @constructor
                     * @param {android.surfaceflinger.proto.ILayerCreationArgs=} [properties] Properties to set
                     */
                    function LayerCreationArgs(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * LayerCreationArgs layerId.
                     * @member {number} layerId
                     * @memberof android.surfaceflinger.proto.LayerCreationArgs
                     * @instance
                     */
                    LayerCreationArgs.prototype.layerId = 0;
    
                    /**
                     * LayerCreationArgs name.
                     * @member {string} name
                     * @memberof android.surfaceflinger.proto.LayerCreationArgs
                     * @instance
                     */
                    LayerCreationArgs.prototype.name = "";
    
                    /**
                     * LayerCreationArgs flags.
                     * @member {number} flags
                     * @memberof android.surfaceflinger.proto.LayerCreationArgs
                     * @instance
                     */
                    LayerCreationArgs.prototype.flags = 0;
    
                    /**
                     * LayerCreationArgs parentId.
                     * @member {number} parentId
                     * @memberof android.surfaceflinger.proto.LayerCreationArgs
                     * @instance
                     */
                    LayerCreationArgs.prototype.parentId = 0;
    
                    /**
                     * LayerCreationArgs mirrorFromId.
                     * @member {number} mirrorFromId
                     * @memberof android.surfaceflinger.proto.LayerCreationArgs
                     * @instance
                     */
                    LayerCreationArgs.prototype.mirrorFromId = 0;
    
                    /**
                     * LayerCreationArgs addToRoot.
                     * @member {boolean} addToRoot
                     * @memberof android.surfaceflinger.proto.LayerCreationArgs
                     * @instance
                     */
                    LayerCreationArgs.prototype.addToRoot = false;
    
                    /**
                     * LayerCreationArgs layerStackToMirror.
                     * @member {number} layerStackToMirror
                     * @memberof android.surfaceflinger.proto.LayerCreationArgs
                     * @instance
                     */
                    LayerCreationArgs.prototype.layerStackToMirror = 0;
    
                    /**
                     * Creates a new LayerCreationArgs instance using the specified properties.
                     * @function create
                     * @memberof android.surfaceflinger.proto.LayerCreationArgs
                     * @static
                     * @param {android.surfaceflinger.proto.ILayerCreationArgs=} [properties] Properties to set
                     * @returns {android.surfaceflinger.proto.LayerCreationArgs} LayerCreationArgs instance
                     */
                    LayerCreationArgs.create = function create(properties) {
                        return new LayerCreationArgs(properties);
                    };
    
                    /**
                     * Encodes the specified LayerCreationArgs message. Does not implicitly {@link android.surfaceflinger.proto.LayerCreationArgs.verify|verify} messages.
                     * @function encode
                     * @memberof android.surfaceflinger.proto.LayerCreationArgs
                     * @static
                     * @param {android.surfaceflinger.proto.ILayerCreationArgs} message LayerCreationArgs message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    LayerCreationArgs.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.layerId != null && Object.hasOwnProperty.call(message, "layerId"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.layerId);
                        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                        if (message.flags != null && Object.hasOwnProperty.call(message, "flags"))
                            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.flags);
                        if (message.parentId != null && Object.hasOwnProperty.call(message, "parentId"))
                            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.parentId);
                        if (message.mirrorFromId != null && Object.hasOwnProperty.call(message, "mirrorFromId"))
                            writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.mirrorFromId);
                        if (message.addToRoot != null && Object.hasOwnProperty.call(message, "addToRoot"))
                            writer.uint32(/* id 6, wireType 0 =*/48).bool(message.addToRoot);
                        if (message.layerStackToMirror != null && Object.hasOwnProperty.call(message, "layerStackToMirror"))
                            writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.layerStackToMirror);
                        return writer;
                    };
    
                    /**
                     * Encodes the specified LayerCreationArgs message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.LayerCreationArgs.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof android.surfaceflinger.proto.LayerCreationArgs
                     * @static
                     * @param {android.surfaceflinger.proto.ILayerCreationArgs} message LayerCreationArgs message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    LayerCreationArgs.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a LayerCreationArgs message from the specified reader or buffer.
                     * @function decode
                     * @memberof android.surfaceflinger.proto.LayerCreationArgs
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {android.surfaceflinger.proto.LayerCreationArgs} LayerCreationArgs
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    LayerCreationArgs.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.proto.LayerCreationArgs();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1: {
                                    message.layerId = reader.uint32();
                                    break;
                                }
                            case 2: {
                                    message.name = reader.string();
                                    break;
                                }
                            case 3: {
                                    message.flags = reader.uint32();
                                    break;
                                }
                            case 4: {
                                    message.parentId = reader.uint32();
                                    break;
                                }
                            case 5: {
                                    message.mirrorFromId = reader.uint32();
                                    break;
                                }
                            case 6: {
                                    message.addToRoot = reader.bool();
                                    break;
                                }
                            case 7: {
                                    message.layerStackToMirror = reader.uint32();
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
                     * Decodes a LayerCreationArgs message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof android.surfaceflinger.proto.LayerCreationArgs
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {android.surfaceflinger.proto.LayerCreationArgs} LayerCreationArgs
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    LayerCreationArgs.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a LayerCreationArgs message.
                     * @function verify
                     * @memberof android.surfaceflinger.proto.LayerCreationArgs
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    LayerCreationArgs.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.layerId != null && message.hasOwnProperty("layerId"))
                            if (!$util.isInteger(message.layerId))
                                return "layerId: integer expected";
                        if (message.name != null && message.hasOwnProperty("name"))
                            if (!$util.isString(message.name))
                                return "name: string expected";
                        if (message.flags != null && message.hasOwnProperty("flags"))
                            if (!$util.isInteger(message.flags))
                                return "flags: integer expected";
                        if (message.parentId != null && message.hasOwnProperty("parentId"))
                            if (!$util.isInteger(message.parentId))
                                return "parentId: integer expected";
                        if (message.mirrorFromId != null && message.hasOwnProperty("mirrorFromId"))
                            if (!$util.isInteger(message.mirrorFromId))
                                return "mirrorFromId: integer expected";
                        if (message.addToRoot != null && message.hasOwnProperty("addToRoot"))
                            if (typeof message.addToRoot !== "boolean")
                                return "addToRoot: boolean expected";
                        if (message.layerStackToMirror != null && message.hasOwnProperty("layerStackToMirror"))
                            if (!$util.isInteger(message.layerStackToMirror))
                                return "layerStackToMirror: integer expected";
                        return null;
                    };
    
                    /**
                     * Creates a LayerCreationArgs message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof android.surfaceflinger.proto.LayerCreationArgs
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {android.surfaceflinger.proto.LayerCreationArgs} LayerCreationArgs
                     */
                    LayerCreationArgs.fromObject = function fromObject(object) {
                        if (object instanceof $root.android.surfaceflinger.proto.LayerCreationArgs)
                            return object;
                        var message = new $root.android.surfaceflinger.proto.LayerCreationArgs();
                        if (object.layerId != null)
                            message.layerId = object.layerId >>> 0;
                        if (object.name != null)
                            message.name = String(object.name);
                        if (object.flags != null)
                            message.flags = object.flags >>> 0;
                        if (object.parentId != null)
                            message.parentId = object.parentId >>> 0;
                        if (object.mirrorFromId != null)
                            message.mirrorFromId = object.mirrorFromId >>> 0;
                        if (object.addToRoot != null)
                            message.addToRoot = Boolean(object.addToRoot);
                        if (object.layerStackToMirror != null)
                            message.layerStackToMirror = object.layerStackToMirror >>> 0;
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a LayerCreationArgs message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof android.surfaceflinger.proto.LayerCreationArgs
                     * @static
                     * @param {android.surfaceflinger.proto.LayerCreationArgs} message LayerCreationArgs
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    LayerCreationArgs.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.layerId = 0;
                            object.name = "";
                            object.flags = 0;
                            object.parentId = 0;
                            object.mirrorFromId = 0;
                            object.addToRoot = false;
                            object.layerStackToMirror = 0;
                        }
                        if (message.layerId != null && message.hasOwnProperty("layerId"))
                            object.layerId = message.layerId;
                        if (message.name != null && message.hasOwnProperty("name"))
                            object.name = message.name;
                        if (message.flags != null && message.hasOwnProperty("flags"))
                            object.flags = message.flags;
                        if (message.parentId != null && message.hasOwnProperty("parentId"))
                            object.parentId = message.parentId;
                        if (message.mirrorFromId != null && message.hasOwnProperty("mirrorFromId"))
                            object.mirrorFromId = message.mirrorFromId;
                        if (message.addToRoot != null && message.hasOwnProperty("addToRoot"))
                            object.addToRoot = message.addToRoot;
                        if (message.layerStackToMirror != null && message.hasOwnProperty("layerStackToMirror"))
                            object.layerStackToMirror = message.layerStackToMirror;
                        return object;
                    };
    
                    /**
                     * Converts this LayerCreationArgs to JSON.
                     * @function toJSON
                     * @memberof android.surfaceflinger.proto.LayerCreationArgs
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    LayerCreationArgs.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    /**
                     * Gets the default type url for LayerCreationArgs
                     * @function getTypeUrl
                     * @memberof android.surfaceflinger.proto.LayerCreationArgs
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    LayerCreationArgs.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/android.surfaceflinger.proto.LayerCreationArgs";
                    };
    
                    return LayerCreationArgs;
                })();
    
                proto.Transform = (function() {
    
                    /**
                     * Properties of a Transform.
                     * @memberof android.surfaceflinger.proto
                     * @interface ITransform
                     * @property {number|null} [dsdx] Transform dsdx
                     * @property {number|null} [dtdx] Transform dtdx
                     * @property {number|null} [dtdy] Transform dtdy
                     * @property {number|null} [dsdy] Transform dsdy
                     * @property {number|null} [tx] Transform tx
                     * @property {number|null} [ty] Transform ty
                     */
    
                    /**
                     * Constructs a new Transform.
                     * @memberof android.surfaceflinger.proto
                     * @classdesc Represents a Transform.
                     * @implements ITransform
                     * @constructor
                     * @param {android.surfaceflinger.proto.ITransform=} [properties] Properties to set
                     */
                    function Transform(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * Transform dsdx.
                     * @member {number} dsdx
                     * @memberof android.surfaceflinger.proto.Transform
                     * @instance
                     */
                    Transform.prototype.dsdx = 0;
    
                    /**
                     * Transform dtdx.
                     * @member {number} dtdx
                     * @memberof android.surfaceflinger.proto.Transform
                     * @instance
                     */
                    Transform.prototype.dtdx = 0;
    
                    /**
                     * Transform dtdy.
                     * @member {number} dtdy
                     * @memberof android.surfaceflinger.proto.Transform
                     * @instance
                     */
                    Transform.prototype.dtdy = 0;
    
                    /**
                     * Transform dsdy.
                     * @member {number} dsdy
                     * @memberof android.surfaceflinger.proto.Transform
                     * @instance
                     */
                    Transform.prototype.dsdy = 0;
    
                    /**
                     * Transform tx.
                     * @member {number} tx
                     * @memberof android.surfaceflinger.proto.Transform
                     * @instance
                     */
                    Transform.prototype.tx = 0;
    
                    /**
                     * Transform ty.
                     * @member {number} ty
                     * @memberof android.surfaceflinger.proto.Transform
                     * @instance
                     */
                    Transform.prototype.ty = 0;
    
                    /**
                     * Creates a new Transform instance using the specified properties.
                     * @function create
                     * @memberof android.surfaceflinger.proto.Transform
                     * @static
                     * @param {android.surfaceflinger.proto.ITransform=} [properties] Properties to set
                     * @returns {android.surfaceflinger.proto.Transform} Transform instance
                     */
                    Transform.create = function create(properties) {
                        return new Transform(properties);
                    };
    
                    /**
                     * Encodes the specified Transform message. Does not implicitly {@link android.surfaceflinger.proto.Transform.verify|verify} messages.
                     * @function encode
                     * @memberof android.surfaceflinger.proto.Transform
                     * @static
                     * @param {android.surfaceflinger.proto.ITransform} message Transform message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Transform.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.dsdx != null && Object.hasOwnProperty.call(message, "dsdx"))
                            writer.uint32(/* id 1, wireType 5 =*/13).float(message.dsdx);
                        if (message.dtdx != null && Object.hasOwnProperty.call(message, "dtdx"))
                            writer.uint32(/* id 2, wireType 5 =*/21).float(message.dtdx);
                        if (message.dtdy != null && Object.hasOwnProperty.call(message, "dtdy"))
                            writer.uint32(/* id 3, wireType 5 =*/29).float(message.dtdy);
                        if (message.dsdy != null && Object.hasOwnProperty.call(message, "dsdy"))
                            writer.uint32(/* id 4, wireType 5 =*/37).float(message.dsdy);
                        if (message.tx != null && Object.hasOwnProperty.call(message, "tx"))
                            writer.uint32(/* id 5, wireType 5 =*/45).float(message.tx);
                        if (message.ty != null && Object.hasOwnProperty.call(message, "ty"))
                            writer.uint32(/* id 6, wireType 5 =*/53).float(message.ty);
                        return writer;
                    };
    
                    /**
                     * Encodes the specified Transform message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.Transform.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof android.surfaceflinger.proto.Transform
                     * @static
                     * @param {android.surfaceflinger.proto.ITransform} message Transform message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Transform.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a Transform message from the specified reader or buffer.
                     * @function decode
                     * @memberof android.surfaceflinger.proto.Transform
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {android.surfaceflinger.proto.Transform} Transform
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Transform.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.proto.Transform();
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
                                    message.dtdy = reader.float();
                                    break;
                                }
                            case 4: {
                                    message.dsdy = reader.float();
                                    break;
                                }
                            case 5: {
                                    message.tx = reader.float();
                                    break;
                                }
                            case 6: {
                                    message.ty = reader.float();
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
                     * Decodes a Transform message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof android.surfaceflinger.proto.Transform
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {android.surfaceflinger.proto.Transform} Transform
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Transform.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a Transform message.
                     * @function verify
                     * @memberof android.surfaceflinger.proto.Transform
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Transform.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.dsdx != null && message.hasOwnProperty("dsdx"))
                            if (typeof message.dsdx !== "number")
                                return "dsdx: number expected";
                        if (message.dtdx != null && message.hasOwnProperty("dtdx"))
                            if (typeof message.dtdx !== "number")
                                return "dtdx: number expected";
                        if (message.dtdy != null && message.hasOwnProperty("dtdy"))
                            if (typeof message.dtdy !== "number")
                                return "dtdy: number expected";
                        if (message.dsdy != null && message.hasOwnProperty("dsdy"))
                            if (typeof message.dsdy !== "number")
                                return "dsdy: number expected";
                        if (message.tx != null && message.hasOwnProperty("tx"))
                            if (typeof message.tx !== "number")
                                return "tx: number expected";
                        if (message.ty != null && message.hasOwnProperty("ty"))
                            if (typeof message.ty !== "number")
                                return "ty: number expected";
                        return null;
                    };
    
                    /**
                     * Creates a Transform message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof android.surfaceflinger.proto.Transform
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {android.surfaceflinger.proto.Transform} Transform
                     */
                    Transform.fromObject = function fromObject(object) {
                        if (object instanceof $root.android.surfaceflinger.proto.Transform)
                            return object;
                        var message = new $root.android.surfaceflinger.proto.Transform();
                        if (object.dsdx != null)
                            message.dsdx = Number(object.dsdx);
                        if (object.dtdx != null)
                            message.dtdx = Number(object.dtdx);
                        if (object.dtdy != null)
                            message.dtdy = Number(object.dtdy);
                        if (object.dsdy != null)
                            message.dsdy = Number(object.dsdy);
                        if (object.tx != null)
                            message.tx = Number(object.tx);
                        if (object.ty != null)
                            message.ty = Number(object.ty);
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a Transform message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof android.surfaceflinger.proto.Transform
                     * @static
                     * @param {android.surfaceflinger.proto.Transform} message Transform
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Transform.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.dsdx = 0;
                            object.dtdx = 0;
                            object.dtdy = 0;
                            object.dsdy = 0;
                            object.tx = 0;
                            object.ty = 0;
                        }
                        if (message.dsdx != null && message.hasOwnProperty("dsdx"))
                            object.dsdx = options.json && !isFinite(message.dsdx) ? String(message.dsdx) : message.dsdx;
                        if (message.dtdx != null && message.hasOwnProperty("dtdx"))
                            object.dtdx = options.json && !isFinite(message.dtdx) ? String(message.dtdx) : message.dtdx;
                        if (message.dtdy != null && message.hasOwnProperty("dtdy"))
                            object.dtdy = options.json && !isFinite(message.dtdy) ? String(message.dtdy) : message.dtdy;
                        if (message.dsdy != null && message.hasOwnProperty("dsdy"))
                            object.dsdy = options.json && !isFinite(message.dsdy) ? String(message.dsdy) : message.dsdy;
                        if (message.tx != null && message.hasOwnProperty("tx"))
                            object.tx = options.json && !isFinite(message.tx) ? String(message.tx) : message.tx;
                        if (message.ty != null && message.hasOwnProperty("ty"))
                            object.ty = options.json && !isFinite(message.ty) ? String(message.ty) : message.ty;
                        return object;
                    };
    
                    /**
                     * Converts this Transform to JSON.
                     * @function toJSON
                     * @memberof android.surfaceflinger.proto.Transform
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Transform.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    /**
                     * Gets the default type url for Transform
                     * @function getTypeUrl
                     * @memberof android.surfaceflinger.proto.Transform
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    Transform.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/android.surfaceflinger.proto.Transform";
                    };
    
                    return Transform;
                })();
    
                proto.TransactionState = (function() {
    
                    /**
                     * Properties of a TransactionState.
                     * @memberof android.surfaceflinger.proto
                     * @interface ITransactionState
                     * @property {number|null} [pid] TransactionState pid
                     * @property {number|null} [uid] TransactionState uid
                     * @property {Long|null} [vsyncId] TransactionState vsyncId
                     * @property {number|null} [inputEventId] TransactionState inputEventId
                     * @property {Long|null} [postTime] TransactionState postTime
                     * @property {Long|null} [transactionId] TransactionState transactionId
                     * @property {Array.<android.surfaceflinger.proto.ILayerState>|null} [layerChanges] TransactionState layerChanges
                     * @property {Array.<android.surfaceflinger.proto.IDisplayState>|null} [displayChanges] TransactionState displayChanges
                     * @property {Array.<Long>|null} [mergedTransactionIds] TransactionState mergedTransactionIds
                     */
    
                    /**
                     * Constructs a new TransactionState.
                     * @memberof android.surfaceflinger.proto
                     * @classdesc Represents a TransactionState.
                     * @implements ITransactionState
                     * @constructor
                     * @param {android.surfaceflinger.proto.ITransactionState=} [properties] Properties to set
                     */
                    function TransactionState(properties) {
                        this.layerChanges = [];
                        this.displayChanges = [];
                        this.mergedTransactionIds = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * TransactionState pid.
                     * @member {number} pid
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @instance
                     */
                    TransactionState.prototype.pid = 0;
    
                    /**
                     * TransactionState uid.
                     * @member {number} uid
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @instance
                     */
                    TransactionState.prototype.uid = 0;
    
                    /**
                     * TransactionState vsyncId.
                     * @member {Long} vsyncId
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @instance
                     */
                    TransactionState.prototype.vsyncId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                    /**
                     * TransactionState inputEventId.
                     * @member {number} inputEventId
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @instance
                     */
                    TransactionState.prototype.inputEventId = 0;
    
                    /**
                     * TransactionState postTime.
                     * @member {Long} postTime
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @instance
                     */
                    TransactionState.prototype.postTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                    /**
                     * TransactionState transactionId.
                     * @member {Long} transactionId
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @instance
                     */
                    TransactionState.prototype.transactionId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                    /**
                     * TransactionState layerChanges.
                     * @member {Array.<android.surfaceflinger.proto.ILayerState>} layerChanges
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @instance
                     */
                    TransactionState.prototype.layerChanges = $util.emptyArray;
    
                    /**
                     * TransactionState displayChanges.
                     * @member {Array.<android.surfaceflinger.proto.IDisplayState>} displayChanges
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @instance
                     */
                    TransactionState.prototype.displayChanges = $util.emptyArray;
    
                    /**
                     * TransactionState mergedTransactionIds.
                     * @member {Array.<Long>} mergedTransactionIds
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @instance
                     */
                    TransactionState.prototype.mergedTransactionIds = $util.emptyArray;
    
                    /**
                     * Creates a new TransactionState instance using the specified properties.
                     * @function create
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @static
                     * @param {android.surfaceflinger.proto.ITransactionState=} [properties] Properties to set
                     * @returns {android.surfaceflinger.proto.TransactionState} TransactionState instance
                     */
                    TransactionState.create = function create(properties) {
                        return new TransactionState(properties);
                    };
    
                    /**
                     * Encodes the specified TransactionState message. Does not implicitly {@link android.surfaceflinger.proto.TransactionState.verify|verify} messages.
                     * @function encode
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @static
                     * @param {android.surfaceflinger.proto.ITransactionState} message TransactionState message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TransactionState.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.pid != null && Object.hasOwnProperty.call(message, "pid"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.pid);
                        if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.uid);
                        if (message.vsyncId != null && Object.hasOwnProperty.call(message, "vsyncId"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int64(message.vsyncId);
                        if (message.inputEventId != null && Object.hasOwnProperty.call(message, "inputEventId"))
                            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.inputEventId);
                        if (message.postTime != null && Object.hasOwnProperty.call(message, "postTime"))
                            writer.uint32(/* id 5, wireType 0 =*/40).int64(message.postTime);
                        if (message.transactionId != null && Object.hasOwnProperty.call(message, "transactionId"))
                            writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.transactionId);
                        if (message.layerChanges != null && message.layerChanges.length)
                            for (var i = 0; i < message.layerChanges.length; ++i)
                                $root.android.surfaceflinger.proto.LayerState.encode(message.layerChanges[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                        if (message.displayChanges != null && message.displayChanges.length)
                            for (var i = 0; i < message.displayChanges.length; ++i)
                                $root.android.surfaceflinger.proto.DisplayState.encode(message.displayChanges[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                        if (message.mergedTransactionIds != null && message.mergedTransactionIds.length) {
                            writer.uint32(/* id 9, wireType 2 =*/74).fork();
                            for (var i = 0; i < message.mergedTransactionIds.length; ++i)
                                writer.uint64(message.mergedTransactionIds[i]);
                            writer.ldelim();
                        }
                        return writer;
                    };
    
                    /**
                     * Encodes the specified TransactionState message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.TransactionState.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @static
                     * @param {android.surfaceflinger.proto.ITransactionState} message TransactionState message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TransactionState.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a TransactionState message from the specified reader or buffer.
                     * @function decode
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {android.surfaceflinger.proto.TransactionState} TransactionState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TransactionState.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.proto.TransactionState();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1: {
                                    message.pid = reader.int32();
                                    break;
                                }
                            case 2: {
                                    message.uid = reader.int32();
                                    break;
                                }
                            case 3: {
                                    message.vsyncId = reader.int64();
                                    break;
                                }
                            case 4: {
                                    message.inputEventId = reader.int32();
                                    break;
                                }
                            case 5: {
                                    message.postTime = reader.int64();
                                    break;
                                }
                            case 6: {
                                    message.transactionId = reader.uint64();
                                    break;
                                }
                            case 7: {
                                    if (!(message.layerChanges && message.layerChanges.length))
                                        message.layerChanges = [];
                                    message.layerChanges.push($root.android.surfaceflinger.proto.LayerState.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 8: {
                                    if (!(message.displayChanges && message.displayChanges.length))
                                        message.displayChanges = [];
                                    message.displayChanges.push($root.android.surfaceflinger.proto.DisplayState.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 9: {
                                    if (!(message.mergedTransactionIds && message.mergedTransactionIds.length))
                                        message.mergedTransactionIds = [];
                                    if ((tag & 7) === 2) {
                                        var end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.mergedTransactionIds.push(reader.uint64());
                                    } else
                                        message.mergedTransactionIds.push(reader.uint64());
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
                     * Decodes a TransactionState message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {android.surfaceflinger.proto.TransactionState} TransactionState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TransactionState.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a TransactionState message.
                     * @function verify
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    TransactionState.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.pid != null && message.hasOwnProperty("pid"))
                            if (!$util.isInteger(message.pid))
                                return "pid: integer expected";
                        if (message.uid != null && message.hasOwnProperty("uid"))
                            if (!$util.isInteger(message.uid))
                                return "uid: integer expected";
                        if (message.vsyncId != null && message.hasOwnProperty("vsyncId"))
                            if (!$util.isInteger(message.vsyncId) && !(message.vsyncId && $util.isInteger(message.vsyncId.low) && $util.isInteger(message.vsyncId.high)))
                                return "vsyncId: integer|Long expected";
                        if (message.inputEventId != null && message.hasOwnProperty("inputEventId"))
                            if (!$util.isInteger(message.inputEventId))
                                return "inputEventId: integer expected";
                        if (message.postTime != null && message.hasOwnProperty("postTime"))
                            if (!$util.isInteger(message.postTime) && !(message.postTime && $util.isInteger(message.postTime.low) && $util.isInteger(message.postTime.high)))
                                return "postTime: integer|Long expected";
                        if (message.transactionId != null && message.hasOwnProperty("transactionId"))
                            if (!$util.isInteger(message.transactionId) && !(message.transactionId && $util.isInteger(message.transactionId.low) && $util.isInteger(message.transactionId.high)))
                                return "transactionId: integer|Long expected";
                        if (message.layerChanges != null && message.hasOwnProperty("layerChanges")) {
                            if (!Array.isArray(message.layerChanges))
                                return "layerChanges: array expected";
                            for (var i = 0; i < message.layerChanges.length; ++i) {
                                var error = $root.android.surfaceflinger.proto.LayerState.verify(message.layerChanges[i]);
                                if (error)
                                    return "layerChanges." + error;
                            }
                        }
                        if (message.displayChanges != null && message.hasOwnProperty("displayChanges")) {
                            if (!Array.isArray(message.displayChanges))
                                return "displayChanges: array expected";
                            for (var i = 0; i < message.displayChanges.length; ++i) {
                                var error = $root.android.surfaceflinger.proto.DisplayState.verify(message.displayChanges[i]);
                                if (error)
                                    return "displayChanges." + error;
                            }
                        }
                        if (message.mergedTransactionIds != null && message.hasOwnProperty("mergedTransactionIds")) {
                            if (!Array.isArray(message.mergedTransactionIds))
                                return "mergedTransactionIds: array expected";
                            for (var i = 0; i < message.mergedTransactionIds.length; ++i)
                                if (!$util.isInteger(message.mergedTransactionIds[i]) && !(message.mergedTransactionIds[i] && $util.isInteger(message.mergedTransactionIds[i].low) && $util.isInteger(message.mergedTransactionIds[i].high)))
                                    return "mergedTransactionIds: integer|Long[] expected";
                        }
                        return null;
                    };
    
                    /**
                     * Creates a TransactionState message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {android.surfaceflinger.proto.TransactionState} TransactionState
                     */
                    TransactionState.fromObject = function fromObject(object) {
                        if (object instanceof $root.android.surfaceflinger.proto.TransactionState)
                            return object;
                        var message = new $root.android.surfaceflinger.proto.TransactionState();
                        if (object.pid != null)
                            message.pid = object.pid | 0;
                        if (object.uid != null)
                            message.uid = object.uid | 0;
                        if (object.vsyncId != null)
                            if ($util.Long)
                                (message.vsyncId = $util.Long.fromValue(object.vsyncId)).unsigned = false;
                            else if (typeof object.vsyncId === "string")
                                message.vsyncId = parseInt(object.vsyncId, 10);
                            else if (typeof object.vsyncId === "number")
                                message.vsyncId = object.vsyncId;
                            else if (typeof object.vsyncId === "object")
                                message.vsyncId = new $util.LongBits(object.vsyncId.low >>> 0, object.vsyncId.high >>> 0).toNumber();
                        if (object.inputEventId != null)
                            message.inputEventId = object.inputEventId | 0;
                        if (object.postTime != null)
                            if ($util.Long)
                                (message.postTime = $util.Long.fromValue(object.postTime)).unsigned = false;
                            else if (typeof object.postTime === "string")
                                message.postTime = parseInt(object.postTime, 10);
                            else if (typeof object.postTime === "number")
                                message.postTime = object.postTime;
                            else if (typeof object.postTime === "object")
                                message.postTime = new $util.LongBits(object.postTime.low >>> 0, object.postTime.high >>> 0).toNumber();
                        if (object.transactionId != null)
                            if ($util.Long)
                                (message.transactionId = $util.Long.fromValue(object.transactionId)).unsigned = true;
                            else if (typeof object.transactionId === "string")
                                message.transactionId = parseInt(object.transactionId, 10);
                            else if (typeof object.transactionId === "number")
                                message.transactionId = object.transactionId;
                            else if (typeof object.transactionId === "object")
                                message.transactionId = new $util.LongBits(object.transactionId.low >>> 0, object.transactionId.high >>> 0).toNumber(true);
                        if (object.layerChanges) {
                            if (!Array.isArray(object.layerChanges))
                                throw TypeError(".android.surfaceflinger.proto.TransactionState.layerChanges: array expected");
                            message.layerChanges = [];
                            for (var i = 0; i < object.layerChanges.length; ++i) {
                                if (typeof object.layerChanges[i] !== "object")
                                    throw TypeError(".android.surfaceflinger.proto.TransactionState.layerChanges: object expected");
                                message.layerChanges[i] = $root.android.surfaceflinger.proto.LayerState.fromObject(object.layerChanges[i]);
                            }
                        }
                        if (object.displayChanges) {
                            if (!Array.isArray(object.displayChanges))
                                throw TypeError(".android.surfaceflinger.proto.TransactionState.displayChanges: array expected");
                            message.displayChanges = [];
                            for (var i = 0; i < object.displayChanges.length; ++i) {
                                if (typeof object.displayChanges[i] !== "object")
                                    throw TypeError(".android.surfaceflinger.proto.TransactionState.displayChanges: object expected");
                                message.displayChanges[i] = $root.android.surfaceflinger.proto.DisplayState.fromObject(object.displayChanges[i]);
                            }
                        }
                        if (object.mergedTransactionIds) {
                            if (!Array.isArray(object.mergedTransactionIds))
                                throw TypeError(".android.surfaceflinger.proto.TransactionState.mergedTransactionIds: array expected");
                            message.mergedTransactionIds = [];
                            for (var i = 0; i < object.mergedTransactionIds.length; ++i)
                                if ($util.Long)
                                    (message.mergedTransactionIds[i] = $util.Long.fromValue(object.mergedTransactionIds[i])).unsigned = true;
                                else if (typeof object.mergedTransactionIds[i] === "string")
                                    message.mergedTransactionIds[i] = parseInt(object.mergedTransactionIds[i], 10);
                                else if (typeof object.mergedTransactionIds[i] === "number")
                                    message.mergedTransactionIds[i] = object.mergedTransactionIds[i];
                                else if (typeof object.mergedTransactionIds[i] === "object")
                                    message.mergedTransactionIds[i] = new $util.LongBits(object.mergedTransactionIds[i].low >>> 0, object.mergedTransactionIds[i].high >>> 0).toNumber(true);
                        }
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a TransactionState message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @static
                     * @param {android.surfaceflinger.proto.TransactionState} message TransactionState
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    TransactionState.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.arrays || options.defaults) {
                            object.layerChanges = [];
                            object.displayChanges = [];
                            object.mergedTransactionIds = [];
                        }
                        if (options.defaults) {
                            object.pid = 0;
                            object.uid = 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.vsyncId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.vsyncId = options.longs === String ? "0" : 0;
                            object.inputEventId = 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.postTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.postTime = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, true);
                                object.transactionId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.transactionId = options.longs === String ? "0" : 0;
                        }
                        if (message.pid != null && message.hasOwnProperty("pid"))
                            object.pid = message.pid;
                        if (message.uid != null && message.hasOwnProperty("uid"))
                            object.uid = message.uid;
                        if (message.vsyncId != null && message.hasOwnProperty("vsyncId"))
                            if (typeof message.vsyncId === "number")
                                object.vsyncId = options.longs === String ? String(message.vsyncId) : message.vsyncId;
                            else
                                object.vsyncId = options.longs === String ? $util.Long.prototype.toString.call(message.vsyncId) : options.longs === Number ? new $util.LongBits(message.vsyncId.low >>> 0, message.vsyncId.high >>> 0).toNumber() : message.vsyncId;
                        if (message.inputEventId != null && message.hasOwnProperty("inputEventId"))
                            object.inputEventId = message.inputEventId;
                        if (message.postTime != null && message.hasOwnProperty("postTime"))
                            if (typeof message.postTime === "number")
                                object.postTime = options.longs === String ? String(message.postTime) : message.postTime;
                            else
                                object.postTime = options.longs === String ? $util.Long.prototype.toString.call(message.postTime) : options.longs === Number ? new $util.LongBits(message.postTime.low >>> 0, message.postTime.high >>> 0).toNumber() : message.postTime;
                        if (message.transactionId != null && message.hasOwnProperty("transactionId"))
                            if (typeof message.transactionId === "number")
                                object.transactionId = options.longs === String ? String(message.transactionId) : message.transactionId;
                            else
                                object.transactionId = options.longs === String ? $util.Long.prototype.toString.call(message.transactionId) : options.longs === Number ? new $util.LongBits(message.transactionId.low >>> 0, message.transactionId.high >>> 0).toNumber(true) : message.transactionId;
                        if (message.layerChanges && message.layerChanges.length) {
                            object.layerChanges = [];
                            for (var j = 0; j < message.layerChanges.length; ++j)
                                object.layerChanges[j] = $root.android.surfaceflinger.proto.LayerState.toObject(message.layerChanges[j], options);
                        }
                        if (message.displayChanges && message.displayChanges.length) {
                            object.displayChanges = [];
                            for (var j = 0; j < message.displayChanges.length; ++j)
                                object.displayChanges[j] = $root.android.surfaceflinger.proto.DisplayState.toObject(message.displayChanges[j], options);
                        }
                        if (message.mergedTransactionIds && message.mergedTransactionIds.length) {
                            object.mergedTransactionIds = [];
                            for (var j = 0; j < message.mergedTransactionIds.length; ++j)
                                if (typeof message.mergedTransactionIds[j] === "number")
                                    object.mergedTransactionIds[j] = options.longs === String ? String(message.mergedTransactionIds[j]) : message.mergedTransactionIds[j];
                                else
                                    object.mergedTransactionIds[j] = options.longs === String ? $util.Long.prototype.toString.call(message.mergedTransactionIds[j]) : options.longs === Number ? new $util.LongBits(message.mergedTransactionIds[j].low >>> 0, message.mergedTransactionIds[j].high >>> 0).toNumber(true) : message.mergedTransactionIds[j];
                        }
                        return object;
                    };
    
                    /**
                     * Converts this TransactionState to JSON.
                     * @function toJSON
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    TransactionState.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    /**
                     * Gets the default type url for TransactionState
                     * @function getTypeUrl
                     * @memberof android.surfaceflinger.proto.TransactionState
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    TransactionState.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/android.surfaceflinger.proto.TransactionState";
                    };
    
                    return TransactionState;
                })();
    
                proto.LayerState = (function() {
    
                    /**
                     * Properties of a LayerState.
                     * @memberof android.surfaceflinger.proto
                     * @interface ILayerState
                     * @property {number|null} [layerId] LayerState layerId
                     * @property {Long|null} [what] LayerState what
                     * @property {number|null} [x] LayerState x
                     * @property {number|null} [y] LayerState y
                     * @property {number|null} [z] LayerState z
                     * @property {number|null} [w] LayerState w
                     * @property {number|null} [h] LayerState h
                     * @property {number|null} [layerStack] LayerState layerStack
                     * @property {number|null} [flags] LayerState flags
                     * @property {number|null} [mask] LayerState mask
                     * @property {android.surfaceflinger.proto.LayerState.IMatrix22|null} [matrix] LayerState matrix
                     * @property {number|null} [cornerRadius] LayerState cornerRadius
                     * @property {number|null} [backgroundBlurRadius] LayerState backgroundBlurRadius
                     * @property {number|null} [parentId] LayerState parentId
                     * @property {number|null} [relativeParentId] LayerState relativeParentId
                     * @property {number|null} [alpha] LayerState alpha
                     * @property {android.surfaceflinger.proto.LayerState.IColor3|null} [color] LayerState color
                     * @property {android.surfaceflinger.IRegionProto|null} [transparentRegion] LayerState transparentRegion
                     * @property {number|null} [transform] LayerState transform
                     * @property {boolean|null} [transformToDisplayInverse] LayerState transformToDisplayInverse
                     * @property {android.surfaceflinger.IRectProto|null} [crop] LayerState crop
                     * @property {android.surfaceflinger.proto.LayerState.IBufferData|null} [bufferData] LayerState bufferData
                     * @property {number|null} [api] LayerState api
                     * @property {boolean|null} [hasSidebandStream] LayerState hasSidebandStream
                     * @property {android.surfaceflinger.IColorTransformProto|null} [colorTransform] LayerState colorTransform
                     * @property {Array.<android.surfaceflinger.IBlurRegion>|null} [blurRegions] LayerState blurRegions
                     * @property {android.surfaceflinger.proto.LayerState.IWindowInfo|null} [windowInfoHandle] LayerState windowInfoHandle
                     * @property {number|null} [bgColorAlpha] LayerState bgColorAlpha
                     * @property {number|null} [bgColorDataspace] LayerState bgColorDataspace
                     * @property {boolean|null} [colorSpaceAgnostic] LayerState colorSpaceAgnostic
                     * @property {number|null} [shadowRadius] LayerState shadowRadius
                     * @property {number|null} [frameRateSelectionPriority] LayerState frameRateSelectionPriority
                     * @property {number|null} [frameRate] LayerState frameRate
                     * @property {number|null} [frameRateCompatibility] LayerState frameRateCompatibility
                     * @property {number|null} [changeFrameRateStrategy] LayerState changeFrameRateStrategy
                     * @property {number|null} [fixedTransformHint] LayerState fixedTransformHint
                     * @property {Long|null} [frameNumber] LayerState frameNumber
                     * @property {boolean|null} [autoRefresh] LayerState autoRefresh
                     * @property {boolean|null} [isTrustedOverlay] LayerState isTrustedOverlay
                     * @property {android.surfaceflinger.IRectProto|null} [bufferCrop] LayerState bufferCrop
                     * @property {android.surfaceflinger.IRectProto|null} [destinationFrame] LayerState destinationFrame
                     * @property {android.surfaceflinger.proto.LayerState.DropInputMode|null} [dropInputMode] LayerState dropInputMode
                     */
    
                    /**
                     * Constructs a new LayerState.
                     * @memberof android.surfaceflinger.proto
                     * @classdesc Represents a LayerState.
                     * @implements ILayerState
                     * @constructor
                     * @param {android.surfaceflinger.proto.ILayerState=} [properties] Properties to set
                     */
                    function LayerState(properties) {
                        this.blurRegions = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * LayerState layerId.
                     * @member {number} layerId
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.layerId = 0;
    
                    /**
                     * LayerState what.
                     * @member {Long} what
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.what = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                    /**
                     * LayerState x.
                     * @member {number} x
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.x = 0;
    
                    /**
                     * LayerState y.
                     * @member {number} y
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.y = 0;
    
                    /**
                     * LayerState z.
                     * @member {number} z
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.z = 0;
    
                    /**
                     * LayerState w.
                     * @member {number} w
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.w = 0;
    
                    /**
                     * LayerState h.
                     * @member {number} h
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.h = 0;
    
                    /**
                     * LayerState layerStack.
                     * @member {number} layerStack
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.layerStack = 0;
    
                    /**
                     * LayerState flags.
                     * @member {number} flags
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.flags = 0;
    
                    /**
                     * LayerState mask.
                     * @member {number} mask
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.mask = 0;
    
                    /**
                     * LayerState matrix.
                     * @member {android.surfaceflinger.proto.LayerState.IMatrix22|null|undefined} matrix
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.matrix = null;
    
                    /**
                     * LayerState cornerRadius.
                     * @member {number} cornerRadius
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.cornerRadius = 0;
    
                    /**
                     * LayerState backgroundBlurRadius.
                     * @member {number} backgroundBlurRadius
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.backgroundBlurRadius = 0;
    
                    /**
                     * LayerState parentId.
                     * @member {number} parentId
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.parentId = 0;
    
                    /**
                     * LayerState relativeParentId.
                     * @member {number} relativeParentId
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.relativeParentId = 0;
    
                    /**
                     * LayerState alpha.
                     * @member {number} alpha
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.alpha = 0;
    
                    /**
                     * LayerState color.
                     * @member {android.surfaceflinger.proto.LayerState.IColor3|null|undefined} color
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.color = null;
    
                    /**
                     * LayerState transparentRegion.
                     * @member {android.surfaceflinger.IRegionProto|null|undefined} transparentRegion
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.transparentRegion = null;
    
                    /**
                     * LayerState transform.
                     * @member {number} transform
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.transform = 0;
    
                    /**
                     * LayerState transformToDisplayInverse.
                     * @member {boolean} transformToDisplayInverse
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.transformToDisplayInverse = false;
    
                    /**
                     * LayerState crop.
                     * @member {android.surfaceflinger.IRectProto|null|undefined} crop
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.crop = null;
    
                    /**
                     * LayerState bufferData.
                     * @member {android.surfaceflinger.proto.LayerState.IBufferData|null|undefined} bufferData
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.bufferData = null;
    
                    /**
                     * LayerState api.
                     * @member {number} api
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.api = 0;
    
                    /**
                     * LayerState hasSidebandStream.
                     * @member {boolean} hasSidebandStream
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.hasSidebandStream = false;
    
                    /**
                     * LayerState colorTransform.
                     * @member {android.surfaceflinger.IColorTransformProto|null|undefined} colorTransform
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.colorTransform = null;
    
                    /**
                     * LayerState blurRegions.
                     * @member {Array.<android.surfaceflinger.IBlurRegion>} blurRegions
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.blurRegions = $util.emptyArray;
    
                    /**
                     * LayerState windowInfoHandle.
                     * @member {android.surfaceflinger.proto.LayerState.IWindowInfo|null|undefined} windowInfoHandle
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.windowInfoHandle = null;
    
                    /**
                     * LayerState bgColorAlpha.
                     * @member {number} bgColorAlpha
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.bgColorAlpha = 0;
    
                    /**
                     * LayerState bgColorDataspace.
                     * @member {number} bgColorDataspace
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.bgColorDataspace = 0;
    
                    /**
                     * LayerState colorSpaceAgnostic.
                     * @member {boolean} colorSpaceAgnostic
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.colorSpaceAgnostic = false;
    
                    /**
                     * LayerState shadowRadius.
                     * @member {number} shadowRadius
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.shadowRadius = 0;
    
                    /**
                     * LayerState frameRateSelectionPriority.
                     * @member {number} frameRateSelectionPriority
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.frameRateSelectionPriority = 0;
    
                    /**
                     * LayerState frameRate.
                     * @member {number} frameRate
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.frameRate = 0;
    
                    /**
                     * LayerState frameRateCompatibility.
                     * @member {number} frameRateCompatibility
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.frameRateCompatibility = 0;
    
                    /**
                     * LayerState changeFrameRateStrategy.
                     * @member {number} changeFrameRateStrategy
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.changeFrameRateStrategy = 0;
    
                    /**
                     * LayerState fixedTransformHint.
                     * @member {number} fixedTransformHint
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.fixedTransformHint = 0;
    
                    /**
                     * LayerState frameNumber.
                     * @member {Long} frameNumber
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.frameNumber = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                    /**
                     * LayerState autoRefresh.
                     * @member {boolean} autoRefresh
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.autoRefresh = false;
    
                    /**
                     * LayerState isTrustedOverlay.
                     * @member {boolean} isTrustedOverlay
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.isTrustedOverlay = false;
    
                    /**
                     * LayerState bufferCrop.
                     * @member {android.surfaceflinger.IRectProto|null|undefined} bufferCrop
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.bufferCrop = null;
    
                    /**
                     * LayerState destinationFrame.
                     * @member {android.surfaceflinger.IRectProto|null|undefined} destinationFrame
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.destinationFrame = null;
    
                    /**
                     * LayerState dropInputMode.
                     * @member {android.surfaceflinger.proto.LayerState.DropInputMode} dropInputMode
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     */
                    LayerState.prototype.dropInputMode = 0;
    
                    /**
                     * Creates a new LayerState instance using the specified properties.
                     * @function create
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @static
                     * @param {android.surfaceflinger.proto.ILayerState=} [properties] Properties to set
                     * @returns {android.surfaceflinger.proto.LayerState} LayerState instance
                     */
                    LayerState.create = function create(properties) {
                        return new LayerState(properties);
                    };
    
                    /**
                     * Encodes the specified LayerState message. Does not implicitly {@link android.surfaceflinger.proto.LayerState.verify|verify} messages.
                     * @function encode
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @static
                     * @param {android.surfaceflinger.proto.ILayerState} message LayerState message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    LayerState.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.layerId != null && Object.hasOwnProperty.call(message, "layerId"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.layerId);
                        if (message.what != null && Object.hasOwnProperty.call(message, "what"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.what);
                        if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                            writer.uint32(/* id 3, wireType 5 =*/29).float(message.x);
                        if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                            writer.uint32(/* id 4, wireType 5 =*/37).float(message.y);
                        if (message.z != null && Object.hasOwnProperty.call(message, "z"))
                            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.z);
                        if (message.w != null && Object.hasOwnProperty.call(message, "w"))
                            writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.w);
                        if (message.h != null && Object.hasOwnProperty.call(message, "h"))
                            writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.h);
                        if (message.layerStack != null && Object.hasOwnProperty.call(message, "layerStack"))
                            writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.layerStack);
                        if (message.flags != null && Object.hasOwnProperty.call(message, "flags"))
                            writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.flags);
                        if (message.mask != null && Object.hasOwnProperty.call(message, "mask"))
                            writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.mask);
                        if (message.matrix != null && Object.hasOwnProperty.call(message, "matrix"))
                            $root.android.surfaceflinger.proto.LayerState.Matrix22.encode(message.matrix, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                        if (message.cornerRadius != null && Object.hasOwnProperty.call(message, "cornerRadius"))
                            writer.uint32(/* id 12, wireType 5 =*/101).float(message.cornerRadius);
                        if (message.backgroundBlurRadius != null && Object.hasOwnProperty.call(message, "backgroundBlurRadius"))
                            writer.uint32(/* id 13, wireType 0 =*/104).uint32(message.backgroundBlurRadius);
                        if (message.parentId != null && Object.hasOwnProperty.call(message, "parentId"))
                            writer.uint32(/* id 14, wireType 0 =*/112).uint32(message.parentId);
                        if (message.relativeParentId != null && Object.hasOwnProperty.call(message, "relativeParentId"))
                            writer.uint32(/* id 15, wireType 0 =*/120).uint32(message.relativeParentId);
                        if (message.alpha != null && Object.hasOwnProperty.call(message, "alpha"))
                            writer.uint32(/* id 16, wireType 5 =*/133).float(message.alpha);
                        if (message.color != null && Object.hasOwnProperty.call(message, "color"))
                            $root.android.surfaceflinger.proto.LayerState.Color3.encode(message.color, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
                        if (message.transparentRegion != null && Object.hasOwnProperty.call(message, "transparentRegion"))
                            $root.android.surfaceflinger.RegionProto.encode(message.transparentRegion, writer.uint32(/* id 18, wireType 2 =*/146).fork()).ldelim();
                        if (message.transform != null && Object.hasOwnProperty.call(message, "transform"))
                            writer.uint32(/* id 19, wireType 0 =*/152).uint32(message.transform);
                        if (message.transformToDisplayInverse != null && Object.hasOwnProperty.call(message, "transformToDisplayInverse"))
                            writer.uint32(/* id 20, wireType 0 =*/160).bool(message.transformToDisplayInverse);
                        if (message.crop != null && Object.hasOwnProperty.call(message, "crop"))
                            $root.android.surfaceflinger.RectProto.encode(message.crop, writer.uint32(/* id 21, wireType 2 =*/170).fork()).ldelim();
                        if (message.bufferData != null && Object.hasOwnProperty.call(message, "bufferData"))
                            $root.android.surfaceflinger.proto.LayerState.BufferData.encode(message.bufferData, writer.uint32(/* id 22, wireType 2 =*/178).fork()).ldelim();
                        if (message.api != null && Object.hasOwnProperty.call(message, "api"))
                            writer.uint32(/* id 23, wireType 0 =*/184).int32(message.api);
                        if (message.hasSidebandStream != null && Object.hasOwnProperty.call(message, "hasSidebandStream"))
                            writer.uint32(/* id 24, wireType 0 =*/192).bool(message.hasSidebandStream);
                        if (message.colorTransform != null && Object.hasOwnProperty.call(message, "colorTransform"))
                            $root.android.surfaceflinger.ColorTransformProto.encode(message.colorTransform, writer.uint32(/* id 25, wireType 2 =*/202).fork()).ldelim();
                        if (message.blurRegions != null && message.blurRegions.length)
                            for (var i = 0; i < message.blurRegions.length; ++i)
                                $root.android.surfaceflinger.BlurRegion.encode(message.blurRegions[i], writer.uint32(/* id 26, wireType 2 =*/210).fork()).ldelim();
                        if (message.windowInfoHandle != null && Object.hasOwnProperty.call(message, "windowInfoHandle"))
                            $root.android.surfaceflinger.proto.LayerState.WindowInfo.encode(message.windowInfoHandle, writer.uint32(/* id 27, wireType 2 =*/218).fork()).ldelim();
                        if (message.bgColorAlpha != null && Object.hasOwnProperty.call(message, "bgColorAlpha"))
                            writer.uint32(/* id 28, wireType 5 =*/229).float(message.bgColorAlpha);
                        if (message.bgColorDataspace != null && Object.hasOwnProperty.call(message, "bgColorDataspace"))
                            writer.uint32(/* id 29, wireType 0 =*/232).int32(message.bgColorDataspace);
                        if (message.colorSpaceAgnostic != null && Object.hasOwnProperty.call(message, "colorSpaceAgnostic"))
                            writer.uint32(/* id 30, wireType 0 =*/240).bool(message.colorSpaceAgnostic);
                        if (message.shadowRadius != null && Object.hasOwnProperty.call(message, "shadowRadius"))
                            writer.uint32(/* id 31, wireType 5 =*/253).float(message.shadowRadius);
                        if (message.frameRateSelectionPriority != null && Object.hasOwnProperty.call(message, "frameRateSelectionPriority"))
                            writer.uint32(/* id 32, wireType 0 =*/256).int32(message.frameRateSelectionPriority);
                        if (message.frameRate != null && Object.hasOwnProperty.call(message, "frameRate"))
                            writer.uint32(/* id 33, wireType 5 =*/269).float(message.frameRate);
                        if (message.frameRateCompatibility != null && Object.hasOwnProperty.call(message, "frameRateCompatibility"))
                            writer.uint32(/* id 34, wireType 0 =*/272).int32(message.frameRateCompatibility);
                        if (message.changeFrameRateStrategy != null && Object.hasOwnProperty.call(message, "changeFrameRateStrategy"))
                            writer.uint32(/* id 35, wireType 0 =*/280).int32(message.changeFrameRateStrategy);
                        if (message.fixedTransformHint != null && Object.hasOwnProperty.call(message, "fixedTransformHint"))
                            writer.uint32(/* id 36, wireType 0 =*/288).uint32(message.fixedTransformHint);
                        if (message.frameNumber != null && Object.hasOwnProperty.call(message, "frameNumber"))
                            writer.uint32(/* id 37, wireType 0 =*/296).uint64(message.frameNumber);
                        if (message.autoRefresh != null && Object.hasOwnProperty.call(message, "autoRefresh"))
                            writer.uint32(/* id 38, wireType 0 =*/304).bool(message.autoRefresh);
                        if (message.isTrustedOverlay != null && Object.hasOwnProperty.call(message, "isTrustedOverlay"))
                            writer.uint32(/* id 39, wireType 0 =*/312).bool(message.isTrustedOverlay);
                        if (message.bufferCrop != null && Object.hasOwnProperty.call(message, "bufferCrop"))
                            $root.android.surfaceflinger.RectProto.encode(message.bufferCrop, writer.uint32(/* id 40, wireType 2 =*/322).fork()).ldelim();
                        if (message.destinationFrame != null && Object.hasOwnProperty.call(message, "destinationFrame"))
                            $root.android.surfaceflinger.RectProto.encode(message.destinationFrame, writer.uint32(/* id 41, wireType 2 =*/330).fork()).ldelim();
                        if (message.dropInputMode != null && Object.hasOwnProperty.call(message, "dropInputMode"))
                            writer.uint32(/* id 42, wireType 0 =*/336).int32(message.dropInputMode);
                        return writer;
                    };
    
                    /**
                     * Encodes the specified LayerState message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.LayerState.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @static
                     * @param {android.surfaceflinger.proto.ILayerState} message LayerState message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    LayerState.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a LayerState message from the specified reader or buffer.
                     * @function decode
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {android.surfaceflinger.proto.LayerState} LayerState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    LayerState.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.proto.LayerState();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1: {
                                    message.layerId = reader.uint32();
                                    break;
                                }
                            case 2: {
                                    message.what = reader.uint64();
                                    break;
                                }
                            case 3: {
                                    message.x = reader.float();
                                    break;
                                }
                            case 4: {
                                    message.y = reader.float();
                                    break;
                                }
                            case 5: {
                                    message.z = reader.int32();
                                    break;
                                }
                            case 6: {
                                    message.w = reader.uint32();
                                    break;
                                }
                            case 7: {
                                    message.h = reader.uint32();
                                    break;
                                }
                            case 8: {
                                    message.layerStack = reader.uint32();
                                    break;
                                }
                            case 9: {
                                    message.flags = reader.uint32();
                                    break;
                                }
                            case 10: {
                                    message.mask = reader.uint32();
                                    break;
                                }
                            case 11: {
                                    message.matrix = $root.android.surfaceflinger.proto.LayerState.Matrix22.decode(reader, reader.uint32());
                                    break;
                                }
                            case 12: {
                                    message.cornerRadius = reader.float();
                                    break;
                                }
                            case 13: {
                                    message.backgroundBlurRadius = reader.uint32();
                                    break;
                                }
                            case 14: {
                                    message.parentId = reader.uint32();
                                    break;
                                }
                            case 15: {
                                    message.relativeParentId = reader.uint32();
                                    break;
                                }
                            case 16: {
                                    message.alpha = reader.float();
                                    break;
                                }
                            case 17: {
                                    message.color = $root.android.surfaceflinger.proto.LayerState.Color3.decode(reader, reader.uint32());
                                    break;
                                }
                            case 18: {
                                    message.transparentRegion = $root.android.surfaceflinger.RegionProto.decode(reader, reader.uint32());
                                    break;
                                }
                            case 19: {
                                    message.transform = reader.uint32();
                                    break;
                                }
                            case 20: {
                                    message.transformToDisplayInverse = reader.bool();
                                    break;
                                }
                            case 21: {
                                    message.crop = $root.android.surfaceflinger.RectProto.decode(reader, reader.uint32());
                                    break;
                                }
                            case 22: {
                                    message.bufferData = $root.android.surfaceflinger.proto.LayerState.BufferData.decode(reader, reader.uint32());
                                    break;
                                }
                            case 23: {
                                    message.api = reader.int32();
                                    break;
                                }
                            case 24: {
                                    message.hasSidebandStream = reader.bool();
                                    break;
                                }
                            case 25: {
                                    message.colorTransform = $root.android.surfaceflinger.ColorTransformProto.decode(reader, reader.uint32());
                                    break;
                                }
                            case 26: {
                                    if (!(message.blurRegions && message.blurRegions.length))
                                        message.blurRegions = [];
                                    message.blurRegions.push($root.android.surfaceflinger.BlurRegion.decode(reader, reader.uint32()));
                                    break;
                                }
                            case 27: {
                                    message.windowInfoHandle = $root.android.surfaceflinger.proto.LayerState.WindowInfo.decode(reader, reader.uint32());
                                    break;
                                }
                            case 28: {
                                    message.bgColorAlpha = reader.float();
                                    break;
                                }
                            case 29: {
                                    message.bgColorDataspace = reader.int32();
                                    break;
                                }
                            case 30: {
                                    message.colorSpaceAgnostic = reader.bool();
                                    break;
                                }
                            case 31: {
                                    message.shadowRadius = reader.float();
                                    break;
                                }
                            case 32: {
                                    message.frameRateSelectionPriority = reader.int32();
                                    break;
                                }
                            case 33: {
                                    message.frameRate = reader.float();
                                    break;
                                }
                            case 34: {
                                    message.frameRateCompatibility = reader.int32();
                                    break;
                                }
                            case 35: {
                                    message.changeFrameRateStrategy = reader.int32();
                                    break;
                                }
                            case 36: {
                                    message.fixedTransformHint = reader.uint32();
                                    break;
                                }
                            case 37: {
                                    message.frameNumber = reader.uint64();
                                    break;
                                }
                            case 38: {
                                    message.autoRefresh = reader.bool();
                                    break;
                                }
                            case 39: {
                                    message.isTrustedOverlay = reader.bool();
                                    break;
                                }
                            case 40: {
                                    message.bufferCrop = $root.android.surfaceflinger.RectProto.decode(reader, reader.uint32());
                                    break;
                                }
                            case 41: {
                                    message.destinationFrame = $root.android.surfaceflinger.RectProto.decode(reader, reader.uint32());
                                    break;
                                }
                            case 42: {
                                    message.dropInputMode = reader.int32();
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
                     * Decodes a LayerState message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {android.surfaceflinger.proto.LayerState} LayerState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    LayerState.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a LayerState message.
                     * @function verify
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    LayerState.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.layerId != null && message.hasOwnProperty("layerId"))
                            if (!$util.isInteger(message.layerId))
                                return "layerId: integer expected";
                        if (message.what != null && message.hasOwnProperty("what"))
                            if (!$util.isInteger(message.what) && !(message.what && $util.isInteger(message.what.low) && $util.isInteger(message.what.high)))
                                return "what: integer|Long expected";
                        if (message.x != null && message.hasOwnProperty("x"))
                            if (typeof message.x !== "number")
                                return "x: number expected";
                        if (message.y != null && message.hasOwnProperty("y"))
                            if (typeof message.y !== "number")
                                return "y: number expected";
                        if (message.z != null && message.hasOwnProperty("z"))
                            if (!$util.isInteger(message.z))
                                return "z: integer expected";
                        if (message.w != null && message.hasOwnProperty("w"))
                            if (!$util.isInteger(message.w))
                                return "w: integer expected";
                        if (message.h != null && message.hasOwnProperty("h"))
                            if (!$util.isInteger(message.h))
                                return "h: integer expected";
                        if (message.layerStack != null && message.hasOwnProperty("layerStack"))
                            if (!$util.isInteger(message.layerStack))
                                return "layerStack: integer expected";
                        if (message.flags != null && message.hasOwnProperty("flags"))
                            if (!$util.isInteger(message.flags))
                                return "flags: integer expected";
                        if (message.mask != null && message.hasOwnProperty("mask"))
                            if (!$util.isInteger(message.mask))
                                return "mask: integer expected";
                        if (message.matrix != null && message.hasOwnProperty("matrix")) {
                            var error = $root.android.surfaceflinger.proto.LayerState.Matrix22.verify(message.matrix);
                            if (error)
                                return "matrix." + error;
                        }
                        if (message.cornerRadius != null && message.hasOwnProperty("cornerRadius"))
                            if (typeof message.cornerRadius !== "number")
                                return "cornerRadius: number expected";
                        if (message.backgroundBlurRadius != null && message.hasOwnProperty("backgroundBlurRadius"))
                            if (!$util.isInteger(message.backgroundBlurRadius))
                                return "backgroundBlurRadius: integer expected";
                        if (message.parentId != null && message.hasOwnProperty("parentId"))
                            if (!$util.isInteger(message.parentId))
                                return "parentId: integer expected";
                        if (message.relativeParentId != null && message.hasOwnProperty("relativeParentId"))
                            if (!$util.isInteger(message.relativeParentId))
                                return "relativeParentId: integer expected";
                        if (message.alpha != null && message.hasOwnProperty("alpha"))
                            if (typeof message.alpha !== "number")
                                return "alpha: number expected";
                        if (message.color != null && message.hasOwnProperty("color")) {
                            var error = $root.android.surfaceflinger.proto.LayerState.Color3.verify(message.color);
                            if (error)
                                return "color." + error;
                        }
                        if (message.transparentRegion != null && message.hasOwnProperty("transparentRegion")) {
                            var error = $root.android.surfaceflinger.RegionProto.verify(message.transparentRegion);
                            if (error)
                                return "transparentRegion." + error;
                        }
                        if (message.transform != null && message.hasOwnProperty("transform"))
                            if (!$util.isInteger(message.transform))
                                return "transform: integer expected";
                        if (message.transformToDisplayInverse != null && message.hasOwnProperty("transformToDisplayInverse"))
                            if (typeof message.transformToDisplayInverse !== "boolean")
                                return "transformToDisplayInverse: boolean expected";
                        if (message.crop != null && message.hasOwnProperty("crop")) {
                            var error = $root.android.surfaceflinger.RectProto.verify(message.crop);
                            if (error)
                                return "crop." + error;
                        }
                        if (message.bufferData != null && message.hasOwnProperty("bufferData")) {
                            var error = $root.android.surfaceflinger.proto.LayerState.BufferData.verify(message.bufferData);
                            if (error)
                                return "bufferData." + error;
                        }
                        if (message.api != null && message.hasOwnProperty("api"))
                            if (!$util.isInteger(message.api))
                                return "api: integer expected";
                        if (message.hasSidebandStream != null && message.hasOwnProperty("hasSidebandStream"))
                            if (typeof message.hasSidebandStream !== "boolean")
                                return "hasSidebandStream: boolean expected";
                        if (message.colorTransform != null && message.hasOwnProperty("colorTransform")) {
                            var error = $root.android.surfaceflinger.ColorTransformProto.verify(message.colorTransform);
                            if (error)
                                return "colorTransform." + error;
                        }
                        if (message.blurRegions != null && message.hasOwnProperty("blurRegions")) {
                            if (!Array.isArray(message.blurRegions))
                                return "blurRegions: array expected";
                            for (var i = 0; i < message.blurRegions.length; ++i) {
                                var error = $root.android.surfaceflinger.BlurRegion.verify(message.blurRegions[i]);
                                if (error)
                                    return "blurRegions." + error;
                            }
                        }
                        if (message.windowInfoHandle != null && message.hasOwnProperty("windowInfoHandle")) {
                            var error = $root.android.surfaceflinger.proto.LayerState.WindowInfo.verify(message.windowInfoHandle);
                            if (error)
                                return "windowInfoHandle." + error;
                        }
                        if (message.bgColorAlpha != null && message.hasOwnProperty("bgColorAlpha"))
                            if (typeof message.bgColorAlpha !== "number")
                                return "bgColorAlpha: number expected";
                        if (message.bgColorDataspace != null && message.hasOwnProperty("bgColorDataspace"))
                            if (!$util.isInteger(message.bgColorDataspace))
                                return "bgColorDataspace: integer expected";
                        if (message.colorSpaceAgnostic != null && message.hasOwnProperty("colorSpaceAgnostic"))
                            if (typeof message.colorSpaceAgnostic !== "boolean")
                                return "colorSpaceAgnostic: boolean expected";
                        if (message.shadowRadius != null && message.hasOwnProperty("shadowRadius"))
                            if (typeof message.shadowRadius !== "number")
                                return "shadowRadius: number expected";
                        if (message.frameRateSelectionPriority != null && message.hasOwnProperty("frameRateSelectionPriority"))
                            if (!$util.isInteger(message.frameRateSelectionPriority))
                                return "frameRateSelectionPriority: integer expected";
                        if (message.frameRate != null && message.hasOwnProperty("frameRate"))
                            if (typeof message.frameRate !== "number")
                                return "frameRate: number expected";
                        if (message.frameRateCompatibility != null && message.hasOwnProperty("frameRateCompatibility"))
                            if (!$util.isInteger(message.frameRateCompatibility))
                                return "frameRateCompatibility: integer expected";
                        if (message.changeFrameRateStrategy != null && message.hasOwnProperty("changeFrameRateStrategy"))
                            if (!$util.isInteger(message.changeFrameRateStrategy))
                                return "changeFrameRateStrategy: integer expected";
                        if (message.fixedTransformHint != null && message.hasOwnProperty("fixedTransformHint"))
                            if (!$util.isInteger(message.fixedTransformHint))
                                return "fixedTransformHint: integer expected";
                        if (message.frameNumber != null && message.hasOwnProperty("frameNumber"))
                            if (!$util.isInteger(message.frameNumber) && !(message.frameNumber && $util.isInteger(message.frameNumber.low) && $util.isInteger(message.frameNumber.high)))
                                return "frameNumber: integer|Long expected";
                        if (message.autoRefresh != null && message.hasOwnProperty("autoRefresh"))
                            if (typeof message.autoRefresh !== "boolean")
                                return "autoRefresh: boolean expected";
                        if (message.isTrustedOverlay != null && message.hasOwnProperty("isTrustedOverlay"))
                            if (typeof message.isTrustedOverlay !== "boolean")
                                return "isTrustedOverlay: boolean expected";
                        if (message.bufferCrop != null && message.hasOwnProperty("bufferCrop")) {
                            var error = $root.android.surfaceflinger.RectProto.verify(message.bufferCrop);
                            if (error)
                                return "bufferCrop." + error;
                        }
                        if (message.destinationFrame != null && message.hasOwnProperty("destinationFrame")) {
                            var error = $root.android.surfaceflinger.RectProto.verify(message.destinationFrame);
                            if (error)
                                return "destinationFrame." + error;
                        }
                        if (message.dropInputMode != null && message.hasOwnProperty("dropInputMode"))
                            switch (message.dropInputMode) {
                            default:
                                return "dropInputMode: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                                break;
                            }
                        return null;
                    };
    
                    /**
                     * Creates a LayerState message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {android.surfaceflinger.proto.LayerState} LayerState
                     */
                    LayerState.fromObject = function fromObject(object) {
                        if (object instanceof $root.android.surfaceflinger.proto.LayerState)
                            return object;
                        var message = new $root.android.surfaceflinger.proto.LayerState();
                        if (object.layerId != null)
                            message.layerId = object.layerId >>> 0;
                        if (object.what != null)
                            if ($util.Long)
                                (message.what = $util.Long.fromValue(object.what)).unsigned = true;
                            else if (typeof object.what === "string")
                                message.what = parseInt(object.what, 10);
                            else if (typeof object.what === "number")
                                message.what = object.what;
                            else if (typeof object.what === "object")
                                message.what = new $util.LongBits(object.what.low >>> 0, object.what.high >>> 0).toNumber(true);
                        if (object.x != null)
                            message.x = Number(object.x);
                        if (object.y != null)
                            message.y = Number(object.y);
                        if (object.z != null)
                            message.z = object.z | 0;
                        if (object.w != null)
                            message.w = object.w >>> 0;
                        if (object.h != null)
                            message.h = object.h >>> 0;
                        if (object.layerStack != null)
                            message.layerStack = object.layerStack >>> 0;
                        if (object.flags != null)
                            message.flags = object.flags >>> 0;
                        if (object.mask != null)
                            message.mask = object.mask >>> 0;
                        if (object.matrix != null) {
                            if (typeof object.matrix !== "object")
                                throw TypeError(".android.surfaceflinger.proto.LayerState.matrix: object expected");
                            message.matrix = $root.android.surfaceflinger.proto.LayerState.Matrix22.fromObject(object.matrix);
                        }
                        if (object.cornerRadius != null)
                            message.cornerRadius = Number(object.cornerRadius);
                        if (object.backgroundBlurRadius != null)
                            message.backgroundBlurRadius = object.backgroundBlurRadius >>> 0;
                        if (object.parentId != null)
                            message.parentId = object.parentId >>> 0;
                        if (object.relativeParentId != null)
                            message.relativeParentId = object.relativeParentId >>> 0;
                        if (object.alpha != null)
                            message.alpha = Number(object.alpha);
                        if (object.color != null) {
                            if (typeof object.color !== "object")
                                throw TypeError(".android.surfaceflinger.proto.LayerState.color: object expected");
                            message.color = $root.android.surfaceflinger.proto.LayerState.Color3.fromObject(object.color);
                        }
                        if (object.transparentRegion != null) {
                            if (typeof object.transparentRegion !== "object")
                                throw TypeError(".android.surfaceflinger.proto.LayerState.transparentRegion: object expected");
                            message.transparentRegion = $root.android.surfaceflinger.RegionProto.fromObject(object.transparentRegion);
                        }
                        if (object.transform != null)
                            message.transform = object.transform >>> 0;
                        if (object.transformToDisplayInverse != null)
                            message.transformToDisplayInverse = Boolean(object.transformToDisplayInverse);
                        if (object.crop != null) {
                            if (typeof object.crop !== "object")
                                throw TypeError(".android.surfaceflinger.proto.LayerState.crop: object expected");
                            message.crop = $root.android.surfaceflinger.RectProto.fromObject(object.crop);
                        }
                        if (object.bufferData != null) {
                            if (typeof object.bufferData !== "object")
                                throw TypeError(".android.surfaceflinger.proto.LayerState.bufferData: object expected");
                            message.bufferData = $root.android.surfaceflinger.proto.LayerState.BufferData.fromObject(object.bufferData);
                        }
                        if (object.api != null)
                            message.api = object.api | 0;
                        if (object.hasSidebandStream != null)
                            message.hasSidebandStream = Boolean(object.hasSidebandStream);
                        if (object.colorTransform != null) {
                            if (typeof object.colorTransform !== "object")
                                throw TypeError(".android.surfaceflinger.proto.LayerState.colorTransform: object expected");
                            message.colorTransform = $root.android.surfaceflinger.ColorTransformProto.fromObject(object.colorTransform);
                        }
                        if (object.blurRegions) {
                            if (!Array.isArray(object.blurRegions))
                                throw TypeError(".android.surfaceflinger.proto.LayerState.blurRegions: array expected");
                            message.blurRegions = [];
                            for (var i = 0; i < object.blurRegions.length; ++i) {
                                if (typeof object.blurRegions[i] !== "object")
                                    throw TypeError(".android.surfaceflinger.proto.LayerState.blurRegions: object expected");
                                message.blurRegions[i] = $root.android.surfaceflinger.BlurRegion.fromObject(object.blurRegions[i]);
                            }
                        }
                        if (object.windowInfoHandle != null) {
                            if (typeof object.windowInfoHandle !== "object")
                                throw TypeError(".android.surfaceflinger.proto.LayerState.windowInfoHandle: object expected");
                            message.windowInfoHandle = $root.android.surfaceflinger.proto.LayerState.WindowInfo.fromObject(object.windowInfoHandle);
                        }
                        if (object.bgColorAlpha != null)
                            message.bgColorAlpha = Number(object.bgColorAlpha);
                        if (object.bgColorDataspace != null)
                            message.bgColorDataspace = object.bgColorDataspace | 0;
                        if (object.colorSpaceAgnostic != null)
                            message.colorSpaceAgnostic = Boolean(object.colorSpaceAgnostic);
                        if (object.shadowRadius != null)
                            message.shadowRadius = Number(object.shadowRadius);
                        if (object.frameRateSelectionPriority != null)
                            message.frameRateSelectionPriority = object.frameRateSelectionPriority | 0;
                        if (object.frameRate != null)
                            message.frameRate = Number(object.frameRate);
                        if (object.frameRateCompatibility != null)
                            message.frameRateCompatibility = object.frameRateCompatibility | 0;
                        if (object.changeFrameRateStrategy != null)
                            message.changeFrameRateStrategy = object.changeFrameRateStrategy | 0;
                        if (object.fixedTransformHint != null)
                            message.fixedTransformHint = object.fixedTransformHint >>> 0;
                        if (object.frameNumber != null)
                            if ($util.Long)
                                (message.frameNumber = $util.Long.fromValue(object.frameNumber)).unsigned = true;
                            else if (typeof object.frameNumber === "string")
                                message.frameNumber = parseInt(object.frameNumber, 10);
                            else if (typeof object.frameNumber === "number")
                                message.frameNumber = object.frameNumber;
                            else if (typeof object.frameNumber === "object")
                                message.frameNumber = new $util.LongBits(object.frameNumber.low >>> 0, object.frameNumber.high >>> 0).toNumber(true);
                        if (object.autoRefresh != null)
                            message.autoRefresh = Boolean(object.autoRefresh);
                        if (object.isTrustedOverlay != null)
                            message.isTrustedOverlay = Boolean(object.isTrustedOverlay);
                        if (object.bufferCrop != null) {
                            if (typeof object.bufferCrop !== "object")
                                throw TypeError(".android.surfaceflinger.proto.LayerState.bufferCrop: object expected");
                            message.bufferCrop = $root.android.surfaceflinger.RectProto.fromObject(object.bufferCrop);
                        }
                        if (object.destinationFrame != null) {
                            if (typeof object.destinationFrame !== "object")
                                throw TypeError(".android.surfaceflinger.proto.LayerState.destinationFrame: object expected");
                            message.destinationFrame = $root.android.surfaceflinger.RectProto.fromObject(object.destinationFrame);
                        }
                        switch (object.dropInputMode) {
                        default:
                            if (typeof object.dropInputMode === "number") {
                                message.dropInputMode = object.dropInputMode;
                                break;
                            }
                            break;
                        case "NONE":
                        case 0:
                            message.dropInputMode = 0;
                            break;
                        case "ALL":
                        case 1:
                            message.dropInputMode = 1;
                            break;
                        case "OBSCURED":
                        case 2:
                            message.dropInputMode = 2;
                            break;
                        }
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a LayerState message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @static
                     * @param {android.surfaceflinger.proto.LayerState} message LayerState
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    LayerState.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.arrays || options.defaults)
                            object.blurRegions = [];
                        if (options.defaults) {
                            object.layerId = 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, true);
                                object.what = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.what = options.longs === String ? "0" : 0;
                            object.x = 0;
                            object.y = 0;
                            object.z = 0;
                            object.w = 0;
                            object.h = 0;
                            object.layerStack = 0;
                            object.flags = 0;
                            object.mask = 0;
                            object.matrix = null;
                            object.cornerRadius = 0;
                            object.backgroundBlurRadius = 0;
                            object.parentId = 0;
                            object.relativeParentId = 0;
                            object.alpha = 0;
                            object.color = null;
                            object.transparentRegion = null;
                            object.transform = 0;
                            object.transformToDisplayInverse = false;
                            object.crop = null;
                            object.bufferData = null;
                            object.api = 0;
                            object.hasSidebandStream = false;
                            object.colorTransform = null;
                            object.windowInfoHandle = null;
                            object.bgColorAlpha = 0;
                            object.bgColorDataspace = 0;
                            object.colorSpaceAgnostic = false;
                            object.shadowRadius = 0;
                            object.frameRateSelectionPriority = 0;
                            object.frameRate = 0;
                            object.frameRateCompatibility = 0;
                            object.changeFrameRateStrategy = 0;
                            object.fixedTransformHint = 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, true);
                                object.frameNumber = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.frameNumber = options.longs === String ? "0" : 0;
                            object.autoRefresh = false;
                            object.isTrustedOverlay = false;
                            object.bufferCrop = null;
                            object.destinationFrame = null;
                            object.dropInputMode = options.enums === String ? "NONE" : 0;
                        }
                        if (message.layerId != null && message.hasOwnProperty("layerId"))
                            object.layerId = message.layerId;
                        if (message.what != null && message.hasOwnProperty("what"))
                            if (typeof message.what === "number")
                                object.what = options.longs === String ? String(message.what) : message.what;
                            else
                                object.what = options.longs === String ? $util.Long.prototype.toString.call(message.what) : options.longs === Number ? new $util.LongBits(message.what.low >>> 0, message.what.high >>> 0).toNumber(true) : message.what;
                        if (message.x != null && message.hasOwnProperty("x"))
                            object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
                        if (message.y != null && message.hasOwnProperty("y"))
                            object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
                        if (message.z != null && message.hasOwnProperty("z"))
                            object.z = message.z;
                        if (message.w != null && message.hasOwnProperty("w"))
                            object.w = message.w;
                        if (message.h != null && message.hasOwnProperty("h"))
                            object.h = message.h;
                        if (message.layerStack != null && message.hasOwnProperty("layerStack"))
                            object.layerStack = message.layerStack;
                        if (message.flags != null && message.hasOwnProperty("flags"))
                            object.flags = message.flags;
                        if (message.mask != null && message.hasOwnProperty("mask"))
                            object.mask = message.mask;
                        if (message.matrix != null && message.hasOwnProperty("matrix"))
                            object.matrix = $root.android.surfaceflinger.proto.LayerState.Matrix22.toObject(message.matrix, options);
                        if (message.cornerRadius != null && message.hasOwnProperty("cornerRadius"))
                            object.cornerRadius = options.json && !isFinite(message.cornerRadius) ? String(message.cornerRadius) : message.cornerRadius;
                        if (message.backgroundBlurRadius != null && message.hasOwnProperty("backgroundBlurRadius"))
                            object.backgroundBlurRadius = message.backgroundBlurRadius;
                        if (message.parentId != null && message.hasOwnProperty("parentId"))
                            object.parentId = message.parentId;
                        if (message.relativeParentId != null && message.hasOwnProperty("relativeParentId"))
                            object.relativeParentId = message.relativeParentId;
                        if (message.alpha != null && message.hasOwnProperty("alpha"))
                            object.alpha = options.json && !isFinite(message.alpha) ? String(message.alpha) : message.alpha;
                        if (message.color != null && message.hasOwnProperty("color"))
                            object.color = $root.android.surfaceflinger.proto.LayerState.Color3.toObject(message.color, options);
                        if (message.transparentRegion != null && message.hasOwnProperty("transparentRegion"))
                            object.transparentRegion = $root.android.surfaceflinger.RegionProto.toObject(message.transparentRegion, options);
                        if (message.transform != null && message.hasOwnProperty("transform"))
                            object.transform = message.transform;
                        if (message.transformToDisplayInverse != null && message.hasOwnProperty("transformToDisplayInverse"))
                            object.transformToDisplayInverse = message.transformToDisplayInverse;
                        if (message.crop != null && message.hasOwnProperty("crop"))
                            object.crop = $root.android.surfaceflinger.RectProto.toObject(message.crop, options);
                        if (message.bufferData != null && message.hasOwnProperty("bufferData"))
                            object.bufferData = $root.android.surfaceflinger.proto.LayerState.BufferData.toObject(message.bufferData, options);
                        if (message.api != null && message.hasOwnProperty("api"))
                            object.api = message.api;
                        if (message.hasSidebandStream != null && message.hasOwnProperty("hasSidebandStream"))
                            object.hasSidebandStream = message.hasSidebandStream;
                        if (message.colorTransform != null && message.hasOwnProperty("colorTransform"))
                            object.colorTransform = $root.android.surfaceflinger.ColorTransformProto.toObject(message.colorTransform, options);
                        if (message.blurRegions && message.blurRegions.length) {
                            object.blurRegions = [];
                            for (var j = 0; j < message.blurRegions.length; ++j)
                                object.blurRegions[j] = $root.android.surfaceflinger.BlurRegion.toObject(message.blurRegions[j], options);
                        }
                        if (message.windowInfoHandle != null && message.hasOwnProperty("windowInfoHandle"))
                            object.windowInfoHandle = $root.android.surfaceflinger.proto.LayerState.WindowInfo.toObject(message.windowInfoHandle, options);
                        if (message.bgColorAlpha != null && message.hasOwnProperty("bgColorAlpha"))
                            object.bgColorAlpha = options.json && !isFinite(message.bgColorAlpha) ? String(message.bgColorAlpha) : message.bgColorAlpha;
                        if (message.bgColorDataspace != null && message.hasOwnProperty("bgColorDataspace"))
                            object.bgColorDataspace = message.bgColorDataspace;
                        if (message.colorSpaceAgnostic != null && message.hasOwnProperty("colorSpaceAgnostic"))
                            object.colorSpaceAgnostic = message.colorSpaceAgnostic;
                        if (message.shadowRadius != null && message.hasOwnProperty("shadowRadius"))
                            object.shadowRadius = options.json && !isFinite(message.shadowRadius) ? String(message.shadowRadius) : message.shadowRadius;
                        if (message.frameRateSelectionPriority != null && message.hasOwnProperty("frameRateSelectionPriority"))
                            object.frameRateSelectionPriority = message.frameRateSelectionPriority;
                        if (message.frameRate != null && message.hasOwnProperty("frameRate"))
                            object.frameRate = options.json && !isFinite(message.frameRate) ? String(message.frameRate) : message.frameRate;
                        if (message.frameRateCompatibility != null && message.hasOwnProperty("frameRateCompatibility"))
                            object.frameRateCompatibility = message.frameRateCompatibility;
                        if (message.changeFrameRateStrategy != null && message.hasOwnProperty("changeFrameRateStrategy"))
                            object.changeFrameRateStrategy = message.changeFrameRateStrategy;
                        if (message.fixedTransformHint != null && message.hasOwnProperty("fixedTransformHint"))
                            object.fixedTransformHint = message.fixedTransformHint;
                        if (message.frameNumber != null && message.hasOwnProperty("frameNumber"))
                            if (typeof message.frameNumber === "number")
                                object.frameNumber = options.longs === String ? String(message.frameNumber) : message.frameNumber;
                            else
                                object.frameNumber = options.longs === String ? $util.Long.prototype.toString.call(message.frameNumber) : options.longs === Number ? new $util.LongBits(message.frameNumber.low >>> 0, message.frameNumber.high >>> 0).toNumber(true) : message.frameNumber;
                        if (message.autoRefresh != null && message.hasOwnProperty("autoRefresh"))
                            object.autoRefresh = message.autoRefresh;
                        if (message.isTrustedOverlay != null && message.hasOwnProperty("isTrustedOverlay"))
                            object.isTrustedOverlay = message.isTrustedOverlay;
                        if (message.bufferCrop != null && message.hasOwnProperty("bufferCrop"))
                            object.bufferCrop = $root.android.surfaceflinger.RectProto.toObject(message.bufferCrop, options);
                        if (message.destinationFrame != null && message.hasOwnProperty("destinationFrame"))
                            object.destinationFrame = $root.android.surfaceflinger.RectProto.toObject(message.destinationFrame, options);
                        if (message.dropInputMode != null && message.hasOwnProperty("dropInputMode"))
                            object.dropInputMode = options.enums === String ? $root.android.surfaceflinger.proto.LayerState.DropInputMode[message.dropInputMode] === undefined ? message.dropInputMode : $root.android.surfaceflinger.proto.LayerState.DropInputMode[message.dropInputMode] : message.dropInputMode;
                        return object;
                    };
    
                    /**
                     * Converts this LayerState to JSON.
                     * @function toJSON
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    LayerState.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    /**
                     * Gets the default type url for LayerState
                     * @function getTypeUrl
                     * @memberof android.surfaceflinger.proto.LayerState
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    LayerState.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/android.surfaceflinger.proto.LayerState";
                    };
    
                    /**
                     * ChangesLsb enum.
                     * @name android.surfaceflinger.proto.LayerState.ChangesLsb
                     * @enum {number}
                     * @property {number} eChangesLsbNone=0 eChangesLsbNone value
                     * @property {number} ePositionChanged=1 ePositionChanged value
                     * @property {number} eLayerChanged=2 eLayerChanged value
                     * @property {number} eAlphaChanged=8 eAlphaChanged value
                     * @property {number} eMatrixChanged=16 eMatrixChanged value
                     * @property {number} eTransparentRegionChanged=32 eTransparentRegionChanged value
                     * @property {number} eFlagsChanged=64 eFlagsChanged value
                     * @property {number} eLayerStackChanged=128 eLayerStackChanged value
                     * @property {number} eReleaseBufferListenerChanged=1024 eReleaseBufferListenerChanged value
                     * @property {number} eShadowRadiusChanged=2048 eShadowRadiusChanged value
                     * @property {number} eBufferCropChanged=8192 eBufferCropChanged value
                     * @property {number} eRelativeLayerChanged=16384 eRelativeLayerChanged value
                     * @property {number} eReparent=32768 eReparent value
                     * @property {number} eColorChanged=65536 eColorChanged value
                     * @property {number} eBufferTransformChanged=262144 eBufferTransformChanged value
                     * @property {number} eTransformToDisplayInverseChanged=524288 eTransformToDisplayInverseChanged value
                     * @property {number} eCropChanged=1048576 eCropChanged value
                     * @property {number} eBufferChanged=2097152 eBufferChanged value
                     * @property {number} eAcquireFenceChanged=4194304 eAcquireFenceChanged value
                     * @property {number} eDataspaceChanged=8388608 eDataspaceChanged value
                     * @property {number} eHdrMetadataChanged=16777216 eHdrMetadataChanged value
                     * @property {number} eSurfaceDamageRegionChanged=33554432 eSurfaceDamageRegionChanged value
                     * @property {number} eApiChanged=67108864 eApiChanged value
                     * @property {number} eSidebandStreamChanged=134217728 eSidebandStreamChanged value
                     * @property {number} eColorTransformChanged=268435456 eColorTransformChanged value
                     * @property {number} eHasListenerCallbacksChanged=536870912 eHasListenerCallbacksChanged value
                     * @property {number} eInputInfoChanged=1073741824 eInputInfoChanged value
                     * @property {number} eCornerRadiusChanged=-2147483648 eCornerRadiusChanged value
                     */
                    LayerState.ChangesLsb = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "eChangesLsbNone"] = 0;
                        values[valuesById[1] = "ePositionChanged"] = 1;
                        values[valuesById[2] = "eLayerChanged"] = 2;
                        values[valuesById[8] = "eAlphaChanged"] = 8;
                        values[valuesById[16] = "eMatrixChanged"] = 16;
                        values[valuesById[32] = "eTransparentRegionChanged"] = 32;
                        values[valuesById[64] = "eFlagsChanged"] = 64;
                        values[valuesById[128] = "eLayerStackChanged"] = 128;
                        values[valuesById[1024] = "eReleaseBufferListenerChanged"] = 1024;
                        values[valuesById[2048] = "eShadowRadiusChanged"] = 2048;
                        values[valuesById[8192] = "eBufferCropChanged"] = 8192;
                        values[valuesById[16384] = "eRelativeLayerChanged"] = 16384;
                        values[valuesById[32768] = "eReparent"] = 32768;
                        values[valuesById[65536] = "eColorChanged"] = 65536;
                        values[valuesById[262144] = "eBufferTransformChanged"] = 262144;
                        values[valuesById[524288] = "eTransformToDisplayInverseChanged"] = 524288;
                        values[valuesById[1048576] = "eCropChanged"] = 1048576;
                        values[valuesById[2097152] = "eBufferChanged"] = 2097152;
                        values[valuesById[4194304] = "eAcquireFenceChanged"] = 4194304;
                        values[valuesById[8388608] = "eDataspaceChanged"] = 8388608;
                        values[valuesById[16777216] = "eHdrMetadataChanged"] = 16777216;
                        values[valuesById[33554432] = "eSurfaceDamageRegionChanged"] = 33554432;
                        values[valuesById[67108864] = "eApiChanged"] = 67108864;
                        values[valuesById[134217728] = "eSidebandStreamChanged"] = 134217728;
                        values[valuesById[268435456] = "eColorTransformChanged"] = 268435456;
                        values[valuesById[536870912] = "eHasListenerCallbacksChanged"] = 536870912;
                        values[valuesById[1073741824] = "eInputInfoChanged"] = 1073741824;
                        values[valuesById[-2147483648] = "eCornerRadiusChanged"] = -2147483648;
                        return values;
                    })();
    
                    /**
                     * ChangesMsb enum.
                     * @name android.surfaceflinger.proto.LayerState.ChangesMsb
                     * @enum {number}
                     * @property {number} eChangesMsbNone=0 eChangesMsbNone value
                     * @property {number} eDestinationFrameChanged=1 eDestinationFrameChanged value
                     * @property {number} eCachedBufferChanged=2 eCachedBufferChanged value
                     * @property {number} eBackgroundColorChanged=4 eBackgroundColorChanged value
                     * @property {number} eMetadataChanged=8 eMetadataChanged value
                     * @property {number} eColorSpaceAgnosticChanged=16 eColorSpaceAgnosticChanged value
                     * @property {number} eFrameRateSelectionPriority=32 eFrameRateSelectionPriority value
                     * @property {number} eFrameRateChanged=64 eFrameRateChanged value
                     * @property {number} eBackgroundBlurRadiusChanged=128 eBackgroundBlurRadiusChanged value
                     * @property {number} eProducerDisconnect=256 eProducerDisconnect value
                     * @property {number} eFixedTransformHintChanged=512 eFixedTransformHintChanged value
                     * @property {number} eFrameNumberChanged=1024 eFrameNumberChanged value
                     * @property {number} eBlurRegionsChanged=2048 eBlurRegionsChanged value
                     * @property {number} eAutoRefreshChanged=4096 eAutoRefreshChanged value
                     * @property {number} eStretchChanged=8192 eStretchChanged value
                     * @property {number} eTrustedOverlayChanged=16384 eTrustedOverlayChanged value
                     * @property {number} eDropInputModeChanged=32768 eDropInputModeChanged value
                     */
                    LayerState.ChangesMsb = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "eChangesMsbNone"] = 0;
                        values[valuesById[1] = "eDestinationFrameChanged"] = 1;
                        values[valuesById[2] = "eCachedBufferChanged"] = 2;
                        values[valuesById[4] = "eBackgroundColorChanged"] = 4;
                        values[valuesById[8] = "eMetadataChanged"] = 8;
                        values[valuesById[16] = "eColorSpaceAgnosticChanged"] = 16;
                        values[valuesById[32] = "eFrameRateSelectionPriority"] = 32;
                        values[valuesById[64] = "eFrameRateChanged"] = 64;
                        values[valuesById[128] = "eBackgroundBlurRadiusChanged"] = 128;
                        values[valuesById[256] = "eProducerDisconnect"] = 256;
                        values[valuesById[512] = "eFixedTransformHintChanged"] = 512;
                        values[valuesById[1024] = "eFrameNumberChanged"] = 1024;
                        values[valuesById[2048] = "eBlurRegionsChanged"] = 2048;
                        values[valuesById[4096] = "eAutoRefreshChanged"] = 4096;
                        values[valuesById[8192] = "eStretchChanged"] = 8192;
                        values[valuesById[16384] = "eTrustedOverlayChanged"] = 16384;
                        values[valuesById[32768] = "eDropInputModeChanged"] = 32768;
                        return values;
                    })();
    
                    /**
                     * Flags enum.
                     * @name android.surfaceflinger.proto.LayerState.Flags
                     * @enum {number}
                     * @property {number} eFlagsNone=0 eFlagsNone value
                     * @property {number} eLayerHidden=1 eLayerHidden value
                     * @property {number} eLayerOpaque=2 eLayerOpaque value
                     * @property {number} eLayerSkipScreenshot=64 eLayerSkipScreenshot value
                     * @property {number} eLayerSecure=128 eLayerSecure value
                     * @property {number} eEnableBackpressure=256 eEnableBackpressure value
                     * @property {number} eLayerIsDisplayDecoration=512 eLayerIsDisplayDecoration value
                     */
                    LayerState.Flags = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "eFlagsNone"] = 0;
                        values[valuesById[1] = "eLayerHidden"] = 1;
                        values[valuesById[2] = "eLayerOpaque"] = 2;
                        values[valuesById[64] = "eLayerSkipScreenshot"] = 64;
                        values[valuesById[128] = "eLayerSecure"] = 128;
                        values[valuesById[256] = "eEnableBackpressure"] = 256;
                        values[valuesById[512] = "eLayerIsDisplayDecoration"] = 512;
                        return values;
                    })();
    
                    LayerState.Matrix22 = (function() {
    
                        /**
                         * Properties of a Matrix22.
                         * @memberof android.surfaceflinger.proto.LayerState
                         * @interface IMatrix22
                         * @property {number|null} [dsdx] Matrix22 dsdx
                         * @property {number|null} [dtdx] Matrix22 dtdx
                         * @property {number|null} [dtdy] Matrix22 dtdy
                         * @property {number|null} [dsdy] Matrix22 dsdy
                         */
    
                        /**
                         * Constructs a new Matrix22.
                         * @memberof android.surfaceflinger.proto.LayerState
                         * @classdesc Represents a Matrix22.
                         * @implements IMatrix22
                         * @constructor
                         * @param {android.surfaceflinger.proto.LayerState.IMatrix22=} [properties] Properties to set
                         */
                        function Matrix22(properties) {
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * Matrix22 dsdx.
                         * @member {number} dsdx
                         * @memberof android.surfaceflinger.proto.LayerState.Matrix22
                         * @instance
                         */
                        Matrix22.prototype.dsdx = 0;
    
                        /**
                         * Matrix22 dtdx.
                         * @member {number} dtdx
                         * @memberof android.surfaceflinger.proto.LayerState.Matrix22
                         * @instance
                         */
                        Matrix22.prototype.dtdx = 0;
    
                        /**
                         * Matrix22 dtdy.
                         * @member {number} dtdy
                         * @memberof android.surfaceflinger.proto.LayerState.Matrix22
                         * @instance
                         */
                        Matrix22.prototype.dtdy = 0;
    
                        /**
                         * Matrix22 dsdy.
                         * @member {number} dsdy
                         * @memberof android.surfaceflinger.proto.LayerState.Matrix22
                         * @instance
                         */
                        Matrix22.prototype.dsdy = 0;
    
                        /**
                         * Creates a new Matrix22 instance using the specified properties.
                         * @function create
                         * @memberof android.surfaceflinger.proto.LayerState.Matrix22
                         * @static
                         * @param {android.surfaceflinger.proto.LayerState.IMatrix22=} [properties] Properties to set
                         * @returns {android.surfaceflinger.proto.LayerState.Matrix22} Matrix22 instance
                         */
                        Matrix22.create = function create(properties) {
                            return new Matrix22(properties);
                        };
    
                        /**
                         * Encodes the specified Matrix22 message. Does not implicitly {@link android.surfaceflinger.proto.LayerState.Matrix22.verify|verify} messages.
                         * @function encode
                         * @memberof android.surfaceflinger.proto.LayerState.Matrix22
                         * @static
                         * @param {android.surfaceflinger.proto.LayerState.IMatrix22} message Matrix22 message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Matrix22.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.dsdx != null && Object.hasOwnProperty.call(message, "dsdx"))
                                writer.uint32(/* id 1, wireType 5 =*/13).float(message.dsdx);
                            if (message.dtdx != null && Object.hasOwnProperty.call(message, "dtdx"))
                                writer.uint32(/* id 2, wireType 5 =*/21).float(message.dtdx);
                            if (message.dtdy != null && Object.hasOwnProperty.call(message, "dtdy"))
                                writer.uint32(/* id 3, wireType 5 =*/29).float(message.dtdy);
                            if (message.dsdy != null && Object.hasOwnProperty.call(message, "dsdy"))
                                writer.uint32(/* id 4, wireType 5 =*/37).float(message.dsdy);
                            return writer;
                        };
    
                        /**
                         * Encodes the specified Matrix22 message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.LayerState.Matrix22.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof android.surfaceflinger.proto.LayerState.Matrix22
                         * @static
                         * @param {android.surfaceflinger.proto.LayerState.IMatrix22} message Matrix22 message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Matrix22.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes a Matrix22 message from the specified reader or buffer.
                         * @function decode
                         * @memberof android.surfaceflinger.proto.LayerState.Matrix22
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {android.surfaceflinger.proto.LayerState.Matrix22} Matrix22
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Matrix22.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.proto.LayerState.Matrix22();
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
                                        message.dtdy = reader.float();
                                        break;
                                    }
                                case 4: {
                                        message.dsdy = reader.float();
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
                         * Decodes a Matrix22 message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof android.surfaceflinger.proto.LayerState.Matrix22
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {android.surfaceflinger.proto.LayerState.Matrix22} Matrix22
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Matrix22.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies a Matrix22 message.
                         * @function verify
                         * @memberof android.surfaceflinger.proto.LayerState.Matrix22
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        Matrix22.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.dsdx != null && message.hasOwnProperty("dsdx"))
                                if (typeof message.dsdx !== "number")
                                    return "dsdx: number expected";
                            if (message.dtdx != null && message.hasOwnProperty("dtdx"))
                                if (typeof message.dtdx !== "number")
                                    return "dtdx: number expected";
                            if (message.dtdy != null && message.hasOwnProperty("dtdy"))
                                if (typeof message.dtdy !== "number")
                                    return "dtdy: number expected";
                            if (message.dsdy != null && message.hasOwnProperty("dsdy"))
                                if (typeof message.dsdy !== "number")
                                    return "dsdy: number expected";
                            return null;
                        };
    
                        /**
                         * Creates a Matrix22 message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof android.surfaceflinger.proto.LayerState.Matrix22
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {android.surfaceflinger.proto.LayerState.Matrix22} Matrix22
                         */
                        Matrix22.fromObject = function fromObject(object) {
                            if (object instanceof $root.android.surfaceflinger.proto.LayerState.Matrix22)
                                return object;
                            var message = new $root.android.surfaceflinger.proto.LayerState.Matrix22();
                            if (object.dsdx != null)
                                message.dsdx = Number(object.dsdx);
                            if (object.dtdx != null)
                                message.dtdx = Number(object.dtdx);
                            if (object.dtdy != null)
                                message.dtdy = Number(object.dtdy);
                            if (object.dsdy != null)
                                message.dsdy = Number(object.dsdy);
                            return message;
                        };
    
                        /**
                         * Creates a plain object from a Matrix22 message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof android.surfaceflinger.proto.LayerState.Matrix22
                         * @static
                         * @param {android.surfaceflinger.proto.LayerState.Matrix22} message Matrix22
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        Matrix22.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.defaults) {
                                object.dsdx = 0;
                                object.dtdx = 0;
                                object.dtdy = 0;
                                object.dsdy = 0;
                            }
                            if (message.dsdx != null && message.hasOwnProperty("dsdx"))
                                object.dsdx = options.json && !isFinite(message.dsdx) ? String(message.dsdx) : message.dsdx;
                            if (message.dtdx != null && message.hasOwnProperty("dtdx"))
                                object.dtdx = options.json && !isFinite(message.dtdx) ? String(message.dtdx) : message.dtdx;
                            if (message.dtdy != null && message.hasOwnProperty("dtdy"))
                                object.dtdy = options.json && !isFinite(message.dtdy) ? String(message.dtdy) : message.dtdy;
                            if (message.dsdy != null && message.hasOwnProperty("dsdy"))
                                object.dsdy = options.json && !isFinite(message.dsdy) ? String(message.dsdy) : message.dsdy;
                            return object;
                        };
    
                        /**
                         * Converts this Matrix22 to JSON.
                         * @function toJSON
                         * @memberof android.surfaceflinger.proto.LayerState.Matrix22
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        Matrix22.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        /**
                         * Gets the default type url for Matrix22
                         * @function getTypeUrl
                         * @memberof android.surfaceflinger.proto.LayerState.Matrix22
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        Matrix22.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/android.surfaceflinger.proto.LayerState.Matrix22";
                        };
    
                        return Matrix22;
                    })();
    
                    LayerState.Color3 = (function() {
    
                        /**
                         * Properties of a Color3.
                         * @memberof android.surfaceflinger.proto.LayerState
                         * @interface IColor3
                         * @property {number|null} [r] Color3 r
                         * @property {number|null} [g] Color3 g
                         * @property {number|null} [b] Color3 b
                         */
    
                        /**
                         * Constructs a new Color3.
                         * @memberof android.surfaceflinger.proto.LayerState
                         * @classdesc Represents a Color3.
                         * @implements IColor3
                         * @constructor
                         * @param {android.surfaceflinger.proto.LayerState.IColor3=} [properties] Properties to set
                         */
                        function Color3(properties) {
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * Color3 r.
                         * @member {number} r
                         * @memberof android.surfaceflinger.proto.LayerState.Color3
                         * @instance
                         */
                        Color3.prototype.r = 0;
    
                        /**
                         * Color3 g.
                         * @member {number} g
                         * @memberof android.surfaceflinger.proto.LayerState.Color3
                         * @instance
                         */
                        Color3.prototype.g = 0;
    
                        /**
                         * Color3 b.
                         * @member {number} b
                         * @memberof android.surfaceflinger.proto.LayerState.Color3
                         * @instance
                         */
                        Color3.prototype.b = 0;
    
                        /**
                         * Creates a new Color3 instance using the specified properties.
                         * @function create
                         * @memberof android.surfaceflinger.proto.LayerState.Color3
                         * @static
                         * @param {android.surfaceflinger.proto.LayerState.IColor3=} [properties] Properties to set
                         * @returns {android.surfaceflinger.proto.LayerState.Color3} Color3 instance
                         */
                        Color3.create = function create(properties) {
                            return new Color3(properties);
                        };
    
                        /**
                         * Encodes the specified Color3 message. Does not implicitly {@link android.surfaceflinger.proto.LayerState.Color3.verify|verify} messages.
                         * @function encode
                         * @memberof android.surfaceflinger.proto.LayerState.Color3
                         * @static
                         * @param {android.surfaceflinger.proto.LayerState.IColor3} message Color3 message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Color3.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.r != null && Object.hasOwnProperty.call(message, "r"))
                                writer.uint32(/* id 1, wireType 5 =*/13).float(message.r);
                            if (message.g != null && Object.hasOwnProperty.call(message, "g"))
                                writer.uint32(/* id 2, wireType 5 =*/21).float(message.g);
                            if (message.b != null && Object.hasOwnProperty.call(message, "b"))
                                writer.uint32(/* id 3, wireType 5 =*/29).float(message.b);
                            return writer;
                        };
    
                        /**
                         * Encodes the specified Color3 message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.LayerState.Color3.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof android.surfaceflinger.proto.LayerState.Color3
                         * @static
                         * @param {android.surfaceflinger.proto.LayerState.IColor3} message Color3 message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Color3.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes a Color3 message from the specified reader or buffer.
                         * @function decode
                         * @memberof android.surfaceflinger.proto.LayerState.Color3
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {android.surfaceflinger.proto.LayerState.Color3} Color3
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Color3.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.proto.LayerState.Color3();
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
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Decodes a Color3 message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof android.surfaceflinger.proto.LayerState.Color3
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {android.surfaceflinger.proto.LayerState.Color3} Color3
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Color3.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies a Color3 message.
                         * @function verify
                         * @memberof android.surfaceflinger.proto.LayerState.Color3
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        Color3.verify = function verify(message) {
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
                            return null;
                        };
    
                        /**
                         * Creates a Color3 message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof android.surfaceflinger.proto.LayerState.Color3
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {android.surfaceflinger.proto.LayerState.Color3} Color3
                         */
                        Color3.fromObject = function fromObject(object) {
                            if (object instanceof $root.android.surfaceflinger.proto.LayerState.Color3)
                                return object;
                            var message = new $root.android.surfaceflinger.proto.LayerState.Color3();
                            if (object.r != null)
                                message.r = Number(object.r);
                            if (object.g != null)
                                message.g = Number(object.g);
                            if (object.b != null)
                                message.b = Number(object.b);
                            return message;
                        };
    
                        /**
                         * Creates a plain object from a Color3 message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof android.surfaceflinger.proto.LayerState.Color3
                         * @static
                         * @param {android.surfaceflinger.proto.LayerState.Color3} message Color3
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        Color3.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.defaults) {
                                object.r = 0;
                                object.g = 0;
                                object.b = 0;
                            }
                            if (message.r != null && message.hasOwnProperty("r"))
                                object.r = options.json && !isFinite(message.r) ? String(message.r) : message.r;
                            if (message.g != null && message.hasOwnProperty("g"))
                                object.g = options.json && !isFinite(message.g) ? String(message.g) : message.g;
                            if (message.b != null && message.hasOwnProperty("b"))
                                object.b = options.json && !isFinite(message.b) ? String(message.b) : message.b;
                            return object;
                        };
    
                        /**
                         * Converts this Color3 to JSON.
                         * @function toJSON
                         * @memberof android.surfaceflinger.proto.LayerState.Color3
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        Color3.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        /**
                         * Gets the default type url for Color3
                         * @function getTypeUrl
                         * @memberof android.surfaceflinger.proto.LayerState.Color3
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        Color3.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/android.surfaceflinger.proto.LayerState.Color3";
                        };
    
                        return Color3;
                    })();
    
                    LayerState.BufferData = (function() {
    
                        /**
                         * Properties of a BufferData.
                         * @memberof android.surfaceflinger.proto.LayerState
                         * @interface IBufferData
                         * @property {Long|null} [bufferId] BufferData bufferId
                         * @property {number|null} [width] BufferData width
                         * @property {number|null} [height] BufferData height
                         * @property {Long|null} [frameNumber] BufferData frameNumber
                         * @property {number|null} [flags] BufferData flags
                         * @property {Long|null} [cachedBufferId] BufferData cachedBufferId
                         * @property {android.surfaceflinger.proto.LayerState.BufferData.PixelFormat|null} [pixelFormat] BufferData pixelFormat
                         * @property {Long|null} [usage] BufferData usage
                         */
    
                        /**
                         * Constructs a new BufferData.
                         * @memberof android.surfaceflinger.proto.LayerState
                         * @classdesc Represents a BufferData.
                         * @implements IBufferData
                         * @constructor
                         * @param {android.surfaceflinger.proto.LayerState.IBufferData=} [properties] Properties to set
                         */
                        function BufferData(properties) {
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * BufferData bufferId.
                         * @member {Long} bufferId
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @instance
                         */
                        BufferData.prototype.bufferId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                        /**
                         * BufferData width.
                         * @member {number} width
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @instance
                         */
                        BufferData.prototype.width = 0;
    
                        /**
                         * BufferData height.
                         * @member {number} height
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @instance
                         */
                        BufferData.prototype.height = 0;
    
                        /**
                         * BufferData frameNumber.
                         * @member {Long} frameNumber
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @instance
                         */
                        BufferData.prototype.frameNumber = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                        /**
                         * BufferData flags.
                         * @member {number} flags
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @instance
                         */
                        BufferData.prototype.flags = 0;
    
                        /**
                         * BufferData cachedBufferId.
                         * @member {Long} cachedBufferId
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @instance
                         */
                        BufferData.prototype.cachedBufferId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                        /**
                         * BufferData pixelFormat.
                         * @member {android.surfaceflinger.proto.LayerState.BufferData.PixelFormat} pixelFormat
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @instance
                         */
                        BufferData.prototype.pixelFormat = 0;
    
                        /**
                         * BufferData usage.
                         * @member {Long} usage
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @instance
                         */
                        BufferData.prototype.usage = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                        /**
                         * Creates a new BufferData instance using the specified properties.
                         * @function create
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @static
                         * @param {android.surfaceflinger.proto.LayerState.IBufferData=} [properties] Properties to set
                         * @returns {android.surfaceflinger.proto.LayerState.BufferData} BufferData instance
                         */
                        BufferData.create = function create(properties) {
                            return new BufferData(properties);
                        };
    
                        /**
                         * Encodes the specified BufferData message. Does not implicitly {@link android.surfaceflinger.proto.LayerState.BufferData.verify|verify} messages.
                         * @function encode
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @static
                         * @param {android.surfaceflinger.proto.LayerState.IBufferData} message BufferData message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        BufferData.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.bufferId != null && Object.hasOwnProperty.call(message, "bufferId"))
                                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.bufferId);
                            if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.width);
                            if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.height);
                            if (message.frameNumber != null && Object.hasOwnProperty.call(message, "frameNumber"))
                                writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.frameNumber);
                            if (message.flags != null && Object.hasOwnProperty.call(message, "flags"))
                                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.flags);
                            if (message.cachedBufferId != null && Object.hasOwnProperty.call(message, "cachedBufferId"))
                                writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.cachedBufferId);
                            if (message.pixelFormat != null && Object.hasOwnProperty.call(message, "pixelFormat"))
                                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.pixelFormat);
                            if (message.usage != null && Object.hasOwnProperty.call(message, "usage"))
                                writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.usage);
                            return writer;
                        };
    
                        /**
                         * Encodes the specified BufferData message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.LayerState.BufferData.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @static
                         * @param {android.surfaceflinger.proto.LayerState.IBufferData} message BufferData message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        BufferData.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes a BufferData message from the specified reader or buffer.
                         * @function decode
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {android.surfaceflinger.proto.LayerState.BufferData} BufferData
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        BufferData.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.proto.LayerState.BufferData();
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.bufferId = reader.uint64();
                                        break;
                                    }
                                case 2: {
                                        message.width = reader.uint32();
                                        break;
                                    }
                                case 3: {
                                        message.height = reader.uint32();
                                        break;
                                    }
                                case 4: {
                                        message.frameNumber = reader.uint64();
                                        break;
                                    }
                                case 5: {
                                        message.flags = reader.uint32();
                                        break;
                                    }
                                case 6: {
                                        message.cachedBufferId = reader.uint64();
                                        break;
                                    }
                                case 7: {
                                        message.pixelFormat = reader.int32();
                                        break;
                                    }
                                case 8: {
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
                         * Decodes a BufferData message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {android.surfaceflinger.proto.LayerState.BufferData} BufferData
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        BufferData.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies a BufferData message.
                         * @function verify
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        BufferData.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.bufferId != null && message.hasOwnProperty("bufferId"))
                                if (!$util.isInteger(message.bufferId) && !(message.bufferId && $util.isInteger(message.bufferId.low) && $util.isInteger(message.bufferId.high)))
                                    return "bufferId: integer|Long expected";
                            if (message.width != null && message.hasOwnProperty("width"))
                                if (!$util.isInteger(message.width))
                                    return "width: integer expected";
                            if (message.height != null && message.hasOwnProperty("height"))
                                if (!$util.isInteger(message.height))
                                    return "height: integer expected";
                            if (message.frameNumber != null && message.hasOwnProperty("frameNumber"))
                                if (!$util.isInteger(message.frameNumber) && !(message.frameNumber && $util.isInteger(message.frameNumber.low) && $util.isInteger(message.frameNumber.high)))
                                    return "frameNumber: integer|Long expected";
                            if (message.flags != null && message.hasOwnProperty("flags"))
                                if (!$util.isInteger(message.flags))
                                    return "flags: integer expected";
                            if (message.cachedBufferId != null && message.hasOwnProperty("cachedBufferId"))
                                if (!$util.isInteger(message.cachedBufferId) && !(message.cachedBufferId && $util.isInteger(message.cachedBufferId.low) && $util.isInteger(message.cachedBufferId.high)))
                                    return "cachedBufferId: integer|Long expected";
                            if (message.pixelFormat != null && message.hasOwnProperty("pixelFormat"))
                                switch (message.pixelFormat) {
                                default:
                                    return "pixelFormat: enum value expected";
                                case 0:
                                case -4:
                                case -3:
                                case -2:
                                case -1:
                                case 1:
                                case 2:
                                case 3:
                                case 4:
                                case 5:
                                case 6:
                                case 7:
                                case 22:
                                case 43:
                                case 56:
                                    break;
                                }
                            if (message.usage != null && message.hasOwnProperty("usage"))
                                if (!$util.isInteger(message.usage) && !(message.usage && $util.isInteger(message.usage.low) && $util.isInteger(message.usage.high)))
                                    return "usage: integer|Long expected";
                            return null;
                        };
    
                        /**
                         * Creates a BufferData message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {android.surfaceflinger.proto.LayerState.BufferData} BufferData
                         */
                        BufferData.fromObject = function fromObject(object) {
                            if (object instanceof $root.android.surfaceflinger.proto.LayerState.BufferData)
                                return object;
                            var message = new $root.android.surfaceflinger.proto.LayerState.BufferData();
                            if (object.bufferId != null)
                                if ($util.Long)
                                    (message.bufferId = $util.Long.fromValue(object.bufferId)).unsigned = true;
                                else if (typeof object.bufferId === "string")
                                    message.bufferId = parseInt(object.bufferId, 10);
                                else if (typeof object.bufferId === "number")
                                    message.bufferId = object.bufferId;
                                else if (typeof object.bufferId === "object")
                                    message.bufferId = new $util.LongBits(object.bufferId.low >>> 0, object.bufferId.high >>> 0).toNumber(true);
                            if (object.width != null)
                                message.width = object.width >>> 0;
                            if (object.height != null)
                                message.height = object.height >>> 0;
                            if (object.frameNumber != null)
                                if ($util.Long)
                                    (message.frameNumber = $util.Long.fromValue(object.frameNumber)).unsigned = true;
                                else if (typeof object.frameNumber === "string")
                                    message.frameNumber = parseInt(object.frameNumber, 10);
                                else if (typeof object.frameNumber === "number")
                                    message.frameNumber = object.frameNumber;
                                else if (typeof object.frameNumber === "object")
                                    message.frameNumber = new $util.LongBits(object.frameNumber.low >>> 0, object.frameNumber.high >>> 0).toNumber(true);
                            if (object.flags != null)
                                message.flags = object.flags >>> 0;
                            if (object.cachedBufferId != null)
                                if ($util.Long)
                                    (message.cachedBufferId = $util.Long.fromValue(object.cachedBufferId)).unsigned = true;
                                else if (typeof object.cachedBufferId === "string")
                                    message.cachedBufferId = parseInt(object.cachedBufferId, 10);
                                else if (typeof object.cachedBufferId === "number")
                                    message.cachedBufferId = object.cachedBufferId;
                                else if (typeof object.cachedBufferId === "object")
                                    message.cachedBufferId = new $util.LongBits(object.cachedBufferId.low >>> 0, object.cachedBufferId.high >>> 0).toNumber(true);
                            switch (object.pixelFormat) {
                            default:
                                if (typeof object.pixelFormat === "number") {
                                    message.pixelFormat = object.pixelFormat;
                                    break;
                                }
                                break;
                            case "PIXEL_FORMAT_UNKNOWN":
                            case 0:
                                message.pixelFormat = 0;
                                break;
                            case "PIXEL_FORMAT_CUSTOM":
                            case -4:
                                message.pixelFormat = -4;
                                break;
                            case "PIXEL_FORMAT_TRANSLUCENT":
                            case -3:
                                message.pixelFormat = -3;
                                break;
                            case "PIXEL_FORMAT_TRANSPARENT":
                            case -2:
                                message.pixelFormat = -2;
                                break;
                            case "PIXEL_FORMAT_OPAQUE":
                            case -1:
                                message.pixelFormat = -1;
                                break;
                            case "PIXEL_FORMAT_RGBA_8888":
                            case 1:
                                message.pixelFormat = 1;
                                break;
                            case "PIXEL_FORMAT_RGBX_8888":
                            case 2:
                                message.pixelFormat = 2;
                                break;
                            case "PIXEL_FORMAT_RGB_888":
                            case 3:
                                message.pixelFormat = 3;
                                break;
                            case "PIXEL_FORMAT_RGB_565":
                            case 4:
                                message.pixelFormat = 4;
                                break;
                            case "PIXEL_FORMAT_BGRA_8888":
                            case 5:
                                message.pixelFormat = 5;
                                break;
                            case "PIXEL_FORMAT_RGBA_5551":
                            case 6:
                                message.pixelFormat = 6;
                                break;
                            case "PIXEL_FORMAT_RGBA_4444":
                            case 7:
                                message.pixelFormat = 7;
                                break;
                            case "PIXEL_FORMAT_RGBA_FP16":
                            case 22:
                                message.pixelFormat = 22;
                                break;
                            case "PIXEL_FORMAT_RGBA_1010102":
                            case 43:
                                message.pixelFormat = 43;
                                break;
                            case "PIXEL_FORMAT_R_8":
                            case 56:
                                message.pixelFormat = 56;
                                break;
                            }
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
                         * Creates a plain object from a BufferData message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @static
                         * @param {android.surfaceflinger.proto.LayerState.BufferData} message BufferData
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        BufferData.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.defaults) {
                                if ($util.Long) {
                                    var long = new $util.Long(0, 0, true);
                                    object.bufferId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.bufferId = options.longs === String ? "0" : 0;
                                object.width = 0;
                                object.height = 0;
                                if ($util.Long) {
                                    var long = new $util.Long(0, 0, true);
                                    object.frameNumber = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.frameNumber = options.longs === String ? "0" : 0;
                                object.flags = 0;
                                if ($util.Long) {
                                    var long = new $util.Long(0, 0, true);
                                    object.cachedBufferId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.cachedBufferId = options.longs === String ? "0" : 0;
                                object.pixelFormat = options.enums === String ? "PIXEL_FORMAT_UNKNOWN" : 0;
                                if ($util.Long) {
                                    var long = new $util.Long(0, 0, true);
                                    object.usage = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.usage = options.longs === String ? "0" : 0;
                            }
                            if (message.bufferId != null && message.hasOwnProperty("bufferId"))
                                if (typeof message.bufferId === "number")
                                    object.bufferId = options.longs === String ? String(message.bufferId) : message.bufferId;
                                else
                                    object.bufferId = options.longs === String ? $util.Long.prototype.toString.call(message.bufferId) : options.longs === Number ? new $util.LongBits(message.bufferId.low >>> 0, message.bufferId.high >>> 0).toNumber(true) : message.bufferId;
                            if (message.width != null && message.hasOwnProperty("width"))
                                object.width = message.width;
                            if (message.height != null && message.hasOwnProperty("height"))
                                object.height = message.height;
                            if (message.frameNumber != null && message.hasOwnProperty("frameNumber"))
                                if (typeof message.frameNumber === "number")
                                    object.frameNumber = options.longs === String ? String(message.frameNumber) : message.frameNumber;
                                else
                                    object.frameNumber = options.longs === String ? $util.Long.prototype.toString.call(message.frameNumber) : options.longs === Number ? new $util.LongBits(message.frameNumber.low >>> 0, message.frameNumber.high >>> 0).toNumber(true) : message.frameNumber;
                            if (message.flags != null && message.hasOwnProperty("flags"))
                                object.flags = message.flags;
                            if (message.cachedBufferId != null && message.hasOwnProperty("cachedBufferId"))
                                if (typeof message.cachedBufferId === "number")
                                    object.cachedBufferId = options.longs === String ? String(message.cachedBufferId) : message.cachedBufferId;
                                else
                                    object.cachedBufferId = options.longs === String ? $util.Long.prototype.toString.call(message.cachedBufferId) : options.longs === Number ? new $util.LongBits(message.cachedBufferId.low >>> 0, message.cachedBufferId.high >>> 0).toNumber(true) : message.cachedBufferId;
                            if (message.pixelFormat != null && message.hasOwnProperty("pixelFormat"))
                                object.pixelFormat = options.enums === String ? $root.android.surfaceflinger.proto.LayerState.BufferData.PixelFormat[message.pixelFormat] === undefined ? message.pixelFormat : $root.android.surfaceflinger.proto.LayerState.BufferData.PixelFormat[message.pixelFormat] : message.pixelFormat;
                            if (message.usage != null && message.hasOwnProperty("usage"))
                                if (typeof message.usage === "number")
                                    object.usage = options.longs === String ? String(message.usage) : message.usage;
                                else
                                    object.usage = options.longs === String ? $util.Long.prototype.toString.call(message.usage) : options.longs === Number ? new $util.LongBits(message.usage.low >>> 0, message.usage.high >>> 0).toNumber(true) : message.usage;
                            return object;
                        };
    
                        /**
                         * Converts this BufferData to JSON.
                         * @function toJSON
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        BufferData.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        /**
                         * Gets the default type url for BufferData
                         * @function getTypeUrl
                         * @memberof android.surfaceflinger.proto.LayerState.BufferData
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        BufferData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/android.surfaceflinger.proto.LayerState.BufferData";
                        };
    
                        /**
                         * BufferDataChange enum.
                         * @name android.surfaceflinger.proto.LayerState.BufferData.BufferDataChange
                         * @enum {number}
                         * @property {number} BufferDataChangeNone=0 BufferDataChangeNone value
                         * @property {number} fenceChanged=1 fenceChanged value
                         * @property {number} frameNumberChanged=2 frameNumberChanged value
                         * @property {number} cachedBufferChanged=4 cachedBufferChanged value
                         */
                        BufferData.BufferDataChange = (function() {
                            var valuesById = {}, values = Object.create(valuesById);
                            values[valuesById[0] = "BufferDataChangeNone"] = 0;
                            values[valuesById[1] = "fenceChanged"] = 1;
                            values[valuesById[2] = "frameNumberChanged"] = 2;
                            values[valuesById[4] = "cachedBufferChanged"] = 4;
                            return values;
                        })();
    
                        /**
                         * PixelFormat enum.
                         * @name android.surfaceflinger.proto.LayerState.BufferData.PixelFormat
                         * @enum {number}
                         * @property {number} PIXEL_FORMAT_UNKNOWN=0 PIXEL_FORMAT_UNKNOWN value
                         * @property {number} PIXEL_FORMAT_CUSTOM=-4 PIXEL_FORMAT_CUSTOM value
                         * @property {number} PIXEL_FORMAT_TRANSLUCENT=-3 PIXEL_FORMAT_TRANSLUCENT value
                         * @property {number} PIXEL_FORMAT_TRANSPARENT=-2 PIXEL_FORMAT_TRANSPARENT value
                         * @property {number} PIXEL_FORMAT_OPAQUE=-1 PIXEL_FORMAT_OPAQUE value
                         * @property {number} PIXEL_FORMAT_RGBA_8888=1 PIXEL_FORMAT_RGBA_8888 value
                         * @property {number} PIXEL_FORMAT_RGBX_8888=2 PIXEL_FORMAT_RGBX_8888 value
                         * @property {number} PIXEL_FORMAT_RGB_888=3 PIXEL_FORMAT_RGB_888 value
                         * @property {number} PIXEL_FORMAT_RGB_565=4 PIXEL_FORMAT_RGB_565 value
                         * @property {number} PIXEL_FORMAT_BGRA_8888=5 PIXEL_FORMAT_BGRA_8888 value
                         * @property {number} PIXEL_FORMAT_RGBA_5551=6 PIXEL_FORMAT_RGBA_5551 value
                         * @property {number} PIXEL_FORMAT_RGBA_4444=7 PIXEL_FORMAT_RGBA_4444 value
                         * @property {number} PIXEL_FORMAT_RGBA_FP16=22 PIXEL_FORMAT_RGBA_FP16 value
                         * @property {number} PIXEL_FORMAT_RGBA_1010102=43 PIXEL_FORMAT_RGBA_1010102 value
                         * @property {number} PIXEL_FORMAT_R_8=56 PIXEL_FORMAT_R_8 value
                         */
                        BufferData.PixelFormat = (function() {
                            var valuesById = {}, values = Object.create(valuesById);
                            values[valuesById[0] = "PIXEL_FORMAT_UNKNOWN"] = 0;
                            values[valuesById[-4] = "PIXEL_FORMAT_CUSTOM"] = -4;
                            values[valuesById[-3] = "PIXEL_FORMAT_TRANSLUCENT"] = -3;
                            values[valuesById[-2] = "PIXEL_FORMAT_TRANSPARENT"] = -2;
                            values[valuesById[-1] = "PIXEL_FORMAT_OPAQUE"] = -1;
                            values[valuesById[1] = "PIXEL_FORMAT_RGBA_8888"] = 1;
                            values[valuesById[2] = "PIXEL_FORMAT_RGBX_8888"] = 2;
                            values[valuesById[3] = "PIXEL_FORMAT_RGB_888"] = 3;
                            values[valuesById[4] = "PIXEL_FORMAT_RGB_565"] = 4;
                            values[valuesById[5] = "PIXEL_FORMAT_BGRA_8888"] = 5;
                            values[valuesById[6] = "PIXEL_FORMAT_RGBA_5551"] = 6;
                            values[valuesById[7] = "PIXEL_FORMAT_RGBA_4444"] = 7;
                            values[valuesById[22] = "PIXEL_FORMAT_RGBA_FP16"] = 22;
                            values[valuesById[43] = "PIXEL_FORMAT_RGBA_1010102"] = 43;
                            values[valuesById[56] = "PIXEL_FORMAT_R_8"] = 56;
                            return values;
                        })();
    
                        return BufferData;
                    })();
    
                    LayerState.WindowInfo = (function() {
    
                        /**
                         * Properties of a WindowInfo.
                         * @memberof android.surfaceflinger.proto.LayerState
                         * @interface IWindowInfo
                         * @property {number|null} [layoutParamsFlags] WindowInfo layoutParamsFlags
                         * @property {number|null} [layoutParamsType] WindowInfo layoutParamsType
                         * @property {android.surfaceflinger.IRegionProto|null} [touchableRegion] WindowInfo touchableRegion
                         * @property {number|null} [surfaceInset] WindowInfo surfaceInset
                         * @property {boolean|null} [focusable] WindowInfo focusable
                         * @property {boolean|null} [hasWallpaper] WindowInfo hasWallpaper
                         * @property {number|null} [globalScaleFactor] WindowInfo globalScaleFactor
                         * @property {number|null} [cropLayerId] WindowInfo cropLayerId
                         * @property {boolean|null} [replaceTouchableRegionWithCrop] WindowInfo replaceTouchableRegionWithCrop
                         * @property {android.surfaceflinger.IRectProto|null} [touchableRegionCrop] WindowInfo touchableRegionCrop
                         * @property {android.surfaceflinger.proto.ITransform|null} [transform] WindowInfo transform
                         */
    
                        /**
                         * Constructs a new WindowInfo.
                         * @memberof android.surfaceflinger.proto.LayerState
                         * @classdesc Represents a WindowInfo.
                         * @implements IWindowInfo
                         * @constructor
                         * @param {android.surfaceflinger.proto.LayerState.IWindowInfo=} [properties] Properties to set
                         */
                        function WindowInfo(properties) {
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * WindowInfo layoutParamsFlags.
                         * @member {number} layoutParamsFlags
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @instance
                         */
                        WindowInfo.prototype.layoutParamsFlags = 0;
    
                        /**
                         * WindowInfo layoutParamsType.
                         * @member {number} layoutParamsType
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @instance
                         */
                        WindowInfo.prototype.layoutParamsType = 0;
    
                        /**
                         * WindowInfo touchableRegion.
                         * @member {android.surfaceflinger.IRegionProto|null|undefined} touchableRegion
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @instance
                         */
                        WindowInfo.prototype.touchableRegion = null;
    
                        /**
                         * WindowInfo surfaceInset.
                         * @member {number} surfaceInset
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @instance
                         */
                        WindowInfo.prototype.surfaceInset = 0;
    
                        /**
                         * WindowInfo focusable.
                         * @member {boolean} focusable
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @instance
                         */
                        WindowInfo.prototype.focusable = false;
    
                        /**
                         * WindowInfo hasWallpaper.
                         * @member {boolean} hasWallpaper
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @instance
                         */
                        WindowInfo.prototype.hasWallpaper = false;
    
                        /**
                         * WindowInfo globalScaleFactor.
                         * @member {number} globalScaleFactor
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @instance
                         */
                        WindowInfo.prototype.globalScaleFactor = 0;
    
                        /**
                         * WindowInfo cropLayerId.
                         * @member {number} cropLayerId
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @instance
                         */
                        WindowInfo.prototype.cropLayerId = 0;
    
                        /**
                         * WindowInfo replaceTouchableRegionWithCrop.
                         * @member {boolean} replaceTouchableRegionWithCrop
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @instance
                         */
                        WindowInfo.prototype.replaceTouchableRegionWithCrop = false;
    
                        /**
                         * WindowInfo touchableRegionCrop.
                         * @member {android.surfaceflinger.IRectProto|null|undefined} touchableRegionCrop
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @instance
                         */
                        WindowInfo.prototype.touchableRegionCrop = null;
    
                        /**
                         * WindowInfo transform.
                         * @member {android.surfaceflinger.proto.ITransform|null|undefined} transform
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @instance
                         */
                        WindowInfo.prototype.transform = null;
    
                        /**
                         * Creates a new WindowInfo instance using the specified properties.
                         * @function create
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @static
                         * @param {android.surfaceflinger.proto.LayerState.IWindowInfo=} [properties] Properties to set
                         * @returns {android.surfaceflinger.proto.LayerState.WindowInfo} WindowInfo instance
                         */
                        WindowInfo.create = function create(properties) {
                            return new WindowInfo(properties);
                        };
    
                        /**
                         * Encodes the specified WindowInfo message. Does not implicitly {@link android.surfaceflinger.proto.LayerState.WindowInfo.verify|verify} messages.
                         * @function encode
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @static
                         * @param {android.surfaceflinger.proto.LayerState.IWindowInfo} message WindowInfo message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        WindowInfo.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.layoutParamsFlags != null && Object.hasOwnProperty.call(message, "layoutParamsFlags"))
                                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.layoutParamsFlags);
                            if (message.layoutParamsType != null && Object.hasOwnProperty.call(message, "layoutParamsType"))
                                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.layoutParamsType);
                            if (message.touchableRegion != null && Object.hasOwnProperty.call(message, "touchableRegion"))
                                $root.android.surfaceflinger.RegionProto.encode(message.touchableRegion, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                            if (message.surfaceInset != null && Object.hasOwnProperty.call(message, "surfaceInset"))
                                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.surfaceInset);
                            if (message.focusable != null && Object.hasOwnProperty.call(message, "focusable"))
                                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.focusable);
                            if (message.hasWallpaper != null && Object.hasOwnProperty.call(message, "hasWallpaper"))
                                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.hasWallpaper);
                            if (message.globalScaleFactor != null && Object.hasOwnProperty.call(message, "globalScaleFactor"))
                                writer.uint32(/* id 7, wireType 5 =*/61).float(message.globalScaleFactor);
                            if (message.cropLayerId != null && Object.hasOwnProperty.call(message, "cropLayerId"))
                                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.cropLayerId);
                            if (message.replaceTouchableRegionWithCrop != null && Object.hasOwnProperty.call(message, "replaceTouchableRegionWithCrop"))
                                writer.uint32(/* id 9, wireType 0 =*/72).bool(message.replaceTouchableRegionWithCrop);
                            if (message.touchableRegionCrop != null && Object.hasOwnProperty.call(message, "touchableRegionCrop"))
                                $root.android.surfaceflinger.RectProto.encode(message.touchableRegionCrop, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                            if (message.transform != null && Object.hasOwnProperty.call(message, "transform"))
                                $root.android.surfaceflinger.proto.Transform.encode(message.transform, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                            return writer;
                        };
    
                        /**
                         * Encodes the specified WindowInfo message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.LayerState.WindowInfo.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @static
                         * @param {android.surfaceflinger.proto.LayerState.IWindowInfo} message WindowInfo message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        WindowInfo.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes a WindowInfo message from the specified reader or buffer.
                         * @function decode
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {android.surfaceflinger.proto.LayerState.WindowInfo} WindowInfo
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        WindowInfo.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.proto.LayerState.WindowInfo();
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
                                        message.touchableRegion = $root.android.surfaceflinger.RegionProto.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 4: {
                                        message.surfaceInset = reader.int32();
                                        break;
                                    }
                                case 5: {
                                        message.focusable = reader.bool();
                                        break;
                                    }
                                case 6: {
                                        message.hasWallpaper = reader.bool();
                                        break;
                                    }
                                case 7: {
                                        message.globalScaleFactor = reader.float();
                                        break;
                                    }
                                case 8: {
                                        message.cropLayerId = reader.uint32();
                                        break;
                                    }
                                case 9: {
                                        message.replaceTouchableRegionWithCrop = reader.bool();
                                        break;
                                    }
                                case 10: {
                                        message.touchableRegionCrop = $root.android.surfaceflinger.RectProto.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 11: {
                                        message.transform = $root.android.surfaceflinger.proto.Transform.decode(reader, reader.uint32());
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
                         * Decodes a WindowInfo message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {android.surfaceflinger.proto.LayerState.WindowInfo} WindowInfo
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        WindowInfo.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies a WindowInfo message.
                         * @function verify
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        WindowInfo.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.layoutParamsFlags != null && message.hasOwnProperty("layoutParamsFlags"))
                                if (!$util.isInteger(message.layoutParamsFlags))
                                    return "layoutParamsFlags: integer expected";
                            if (message.layoutParamsType != null && message.hasOwnProperty("layoutParamsType"))
                                if (!$util.isInteger(message.layoutParamsType))
                                    return "layoutParamsType: integer expected";
                            if (message.touchableRegion != null && message.hasOwnProperty("touchableRegion")) {
                                var error = $root.android.surfaceflinger.RegionProto.verify(message.touchableRegion);
                                if (error)
                                    return "touchableRegion." + error;
                            }
                            if (message.surfaceInset != null && message.hasOwnProperty("surfaceInset"))
                                if (!$util.isInteger(message.surfaceInset))
                                    return "surfaceInset: integer expected";
                            if (message.focusable != null && message.hasOwnProperty("focusable"))
                                if (typeof message.focusable !== "boolean")
                                    return "focusable: boolean expected";
                            if (message.hasWallpaper != null && message.hasOwnProperty("hasWallpaper"))
                                if (typeof message.hasWallpaper !== "boolean")
                                    return "hasWallpaper: boolean expected";
                            if (message.globalScaleFactor != null && message.hasOwnProperty("globalScaleFactor"))
                                if (typeof message.globalScaleFactor !== "number")
                                    return "globalScaleFactor: number expected";
                            if (message.cropLayerId != null && message.hasOwnProperty("cropLayerId"))
                                if (!$util.isInteger(message.cropLayerId))
                                    return "cropLayerId: integer expected";
                            if (message.replaceTouchableRegionWithCrop != null && message.hasOwnProperty("replaceTouchableRegionWithCrop"))
                                if (typeof message.replaceTouchableRegionWithCrop !== "boolean")
                                    return "replaceTouchableRegionWithCrop: boolean expected";
                            if (message.touchableRegionCrop != null && message.hasOwnProperty("touchableRegionCrop")) {
                                var error = $root.android.surfaceflinger.RectProto.verify(message.touchableRegionCrop);
                                if (error)
                                    return "touchableRegionCrop." + error;
                            }
                            if (message.transform != null && message.hasOwnProperty("transform")) {
                                var error = $root.android.surfaceflinger.proto.Transform.verify(message.transform);
                                if (error)
                                    return "transform." + error;
                            }
                            return null;
                        };
    
                        /**
                         * Creates a WindowInfo message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {android.surfaceflinger.proto.LayerState.WindowInfo} WindowInfo
                         */
                        WindowInfo.fromObject = function fromObject(object) {
                            if (object instanceof $root.android.surfaceflinger.proto.LayerState.WindowInfo)
                                return object;
                            var message = new $root.android.surfaceflinger.proto.LayerState.WindowInfo();
                            if (object.layoutParamsFlags != null)
                                message.layoutParamsFlags = object.layoutParamsFlags >>> 0;
                            if (object.layoutParamsType != null)
                                message.layoutParamsType = object.layoutParamsType | 0;
                            if (object.touchableRegion != null) {
                                if (typeof object.touchableRegion !== "object")
                                    throw TypeError(".android.surfaceflinger.proto.LayerState.WindowInfo.touchableRegion: object expected");
                                message.touchableRegion = $root.android.surfaceflinger.RegionProto.fromObject(object.touchableRegion);
                            }
                            if (object.surfaceInset != null)
                                message.surfaceInset = object.surfaceInset | 0;
                            if (object.focusable != null)
                                message.focusable = Boolean(object.focusable);
                            if (object.hasWallpaper != null)
                                message.hasWallpaper = Boolean(object.hasWallpaper);
                            if (object.globalScaleFactor != null)
                                message.globalScaleFactor = Number(object.globalScaleFactor);
                            if (object.cropLayerId != null)
                                message.cropLayerId = object.cropLayerId >>> 0;
                            if (object.replaceTouchableRegionWithCrop != null)
                                message.replaceTouchableRegionWithCrop = Boolean(object.replaceTouchableRegionWithCrop);
                            if (object.touchableRegionCrop != null) {
                                if (typeof object.touchableRegionCrop !== "object")
                                    throw TypeError(".android.surfaceflinger.proto.LayerState.WindowInfo.touchableRegionCrop: object expected");
                                message.touchableRegionCrop = $root.android.surfaceflinger.RectProto.fromObject(object.touchableRegionCrop);
                            }
                            if (object.transform != null) {
                                if (typeof object.transform !== "object")
                                    throw TypeError(".android.surfaceflinger.proto.LayerState.WindowInfo.transform: object expected");
                                message.transform = $root.android.surfaceflinger.proto.Transform.fromObject(object.transform);
                            }
                            return message;
                        };
    
                        /**
                         * Creates a plain object from a WindowInfo message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @static
                         * @param {android.surfaceflinger.proto.LayerState.WindowInfo} message WindowInfo
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        WindowInfo.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.defaults) {
                                object.layoutParamsFlags = 0;
                                object.layoutParamsType = 0;
                                object.touchableRegion = null;
                                object.surfaceInset = 0;
                                object.focusable = false;
                                object.hasWallpaper = false;
                                object.globalScaleFactor = 0;
                                object.cropLayerId = 0;
                                object.replaceTouchableRegionWithCrop = false;
                                object.touchableRegionCrop = null;
                                object.transform = null;
                            }
                            if (message.layoutParamsFlags != null && message.hasOwnProperty("layoutParamsFlags"))
                                object.layoutParamsFlags = message.layoutParamsFlags;
                            if (message.layoutParamsType != null && message.hasOwnProperty("layoutParamsType"))
                                object.layoutParamsType = message.layoutParamsType;
                            if (message.touchableRegion != null && message.hasOwnProperty("touchableRegion"))
                                object.touchableRegion = $root.android.surfaceflinger.RegionProto.toObject(message.touchableRegion, options);
                            if (message.surfaceInset != null && message.hasOwnProperty("surfaceInset"))
                                object.surfaceInset = message.surfaceInset;
                            if (message.focusable != null && message.hasOwnProperty("focusable"))
                                object.focusable = message.focusable;
                            if (message.hasWallpaper != null && message.hasOwnProperty("hasWallpaper"))
                                object.hasWallpaper = message.hasWallpaper;
                            if (message.globalScaleFactor != null && message.hasOwnProperty("globalScaleFactor"))
                                object.globalScaleFactor = options.json && !isFinite(message.globalScaleFactor) ? String(message.globalScaleFactor) : message.globalScaleFactor;
                            if (message.cropLayerId != null && message.hasOwnProperty("cropLayerId"))
                                object.cropLayerId = message.cropLayerId;
                            if (message.replaceTouchableRegionWithCrop != null && message.hasOwnProperty("replaceTouchableRegionWithCrop"))
                                object.replaceTouchableRegionWithCrop = message.replaceTouchableRegionWithCrop;
                            if (message.touchableRegionCrop != null && message.hasOwnProperty("touchableRegionCrop"))
                                object.touchableRegionCrop = $root.android.surfaceflinger.RectProto.toObject(message.touchableRegionCrop, options);
                            if (message.transform != null && message.hasOwnProperty("transform"))
                                object.transform = $root.android.surfaceflinger.proto.Transform.toObject(message.transform, options);
                            return object;
                        };
    
                        /**
                         * Converts this WindowInfo to JSON.
                         * @function toJSON
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        WindowInfo.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        /**
                         * Gets the default type url for WindowInfo
                         * @function getTypeUrl
                         * @memberof android.surfaceflinger.proto.LayerState.WindowInfo
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        WindowInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/android.surfaceflinger.proto.LayerState.WindowInfo";
                        };
    
                        return WindowInfo;
                    })();
    
                    /**
                     * DropInputMode enum.
                     * @name android.surfaceflinger.proto.LayerState.DropInputMode
                     * @enum {number}
                     * @property {number} NONE=0 NONE value
                     * @property {number} ALL=1 ALL value
                     * @property {number} OBSCURED=2 OBSCURED value
                     */
                    LayerState.DropInputMode = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "NONE"] = 0;
                        values[valuesById[1] = "ALL"] = 1;
                        values[valuesById[2] = "OBSCURED"] = 2;
                        return values;
                    })();
    
                    return LayerState;
                })();
    
                proto.DisplayState = (function() {
    
                    /**
                     * Properties of a DisplayState.
                     * @memberof android.surfaceflinger.proto
                     * @interface IDisplayState
                     * @property {number|null} [id] DisplayState id
                     * @property {number|null} [what] DisplayState what
                     * @property {number|null} [flags] DisplayState flags
                     * @property {number|null} [layerStack] DisplayState layerStack
                     * @property {number|null} [orientation] DisplayState orientation
                     * @property {android.surfaceflinger.IRectProto|null} [layerStackSpaceRect] DisplayState layerStackSpaceRect
                     * @property {android.surfaceflinger.IRectProto|null} [orientedDisplaySpaceRect] DisplayState orientedDisplaySpaceRect
                     * @property {number|null} [width] DisplayState width
                     * @property {number|null} [height] DisplayState height
                     */
    
                    /**
                     * Constructs a new DisplayState.
                     * @memberof android.surfaceflinger.proto
                     * @classdesc Represents a DisplayState.
                     * @implements IDisplayState
                     * @constructor
                     * @param {android.surfaceflinger.proto.IDisplayState=} [properties] Properties to set
                     */
                    function DisplayState(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * DisplayState id.
                     * @member {number} id
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @instance
                     */
                    DisplayState.prototype.id = 0;
    
                    /**
                     * DisplayState what.
                     * @member {number} what
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @instance
                     */
                    DisplayState.prototype.what = 0;
    
                    /**
                     * DisplayState flags.
                     * @member {number} flags
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @instance
                     */
                    DisplayState.prototype.flags = 0;
    
                    /**
                     * DisplayState layerStack.
                     * @member {number} layerStack
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @instance
                     */
                    DisplayState.prototype.layerStack = 0;
    
                    /**
                     * DisplayState orientation.
                     * @member {number} orientation
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @instance
                     */
                    DisplayState.prototype.orientation = 0;
    
                    /**
                     * DisplayState layerStackSpaceRect.
                     * @member {android.surfaceflinger.IRectProto|null|undefined} layerStackSpaceRect
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @instance
                     */
                    DisplayState.prototype.layerStackSpaceRect = null;
    
                    /**
                     * DisplayState orientedDisplaySpaceRect.
                     * @member {android.surfaceflinger.IRectProto|null|undefined} orientedDisplaySpaceRect
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @instance
                     */
                    DisplayState.prototype.orientedDisplaySpaceRect = null;
    
                    /**
                     * DisplayState width.
                     * @member {number} width
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @instance
                     */
                    DisplayState.prototype.width = 0;
    
                    /**
                     * DisplayState height.
                     * @member {number} height
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @instance
                     */
                    DisplayState.prototype.height = 0;
    
                    /**
                     * Creates a new DisplayState instance using the specified properties.
                     * @function create
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @static
                     * @param {android.surfaceflinger.proto.IDisplayState=} [properties] Properties to set
                     * @returns {android.surfaceflinger.proto.DisplayState} DisplayState instance
                     */
                    DisplayState.create = function create(properties) {
                        return new DisplayState(properties);
                    };
    
                    /**
                     * Encodes the specified DisplayState message. Does not implicitly {@link android.surfaceflinger.proto.DisplayState.verify|verify} messages.
                     * @function encode
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @static
                     * @param {android.surfaceflinger.proto.IDisplayState} message DisplayState message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DisplayState.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
                        if (message.what != null && Object.hasOwnProperty.call(message, "what"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.what);
                        if (message.flags != null && Object.hasOwnProperty.call(message, "flags"))
                            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.flags);
                        if (message.layerStack != null && Object.hasOwnProperty.call(message, "layerStack"))
                            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.layerStack);
                        if (message.orientation != null && Object.hasOwnProperty.call(message, "orientation"))
                            writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.orientation);
                        if (message.layerStackSpaceRect != null && Object.hasOwnProperty.call(message, "layerStackSpaceRect"))
                            $root.android.surfaceflinger.RectProto.encode(message.layerStackSpaceRect, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                        if (message.orientedDisplaySpaceRect != null && Object.hasOwnProperty.call(message, "orientedDisplaySpaceRect"))
                            $root.android.surfaceflinger.RectProto.encode(message.orientedDisplaySpaceRect, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                        if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                            writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.width);
                        if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                            writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.height);
                        return writer;
                    };
    
                    /**
                     * Encodes the specified DisplayState message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.DisplayState.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @static
                     * @param {android.surfaceflinger.proto.IDisplayState} message DisplayState message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DisplayState.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a DisplayState message from the specified reader or buffer.
                     * @function decode
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {android.surfaceflinger.proto.DisplayState} DisplayState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DisplayState.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.proto.DisplayState();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1: {
                                    message.id = reader.int32();
                                    break;
                                }
                            case 2: {
                                    message.what = reader.uint32();
                                    break;
                                }
                            case 3: {
                                    message.flags = reader.uint32();
                                    break;
                                }
                            case 4: {
                                    message.layerStack = reader.uint32();
                                    break;
                                }
                            case 5: {
                                    message.orientation = reader.uint32();
                                    break;
                                }
                            case 6: {
                                    message.layerStackSpaceRect = $root.android.surfaceflinger.RectProto.decode(reader, reader.uint32());
                                    break;
                                }
                            case 7: {
                                    message.orientedDisplaySpaceRect = $root.android.surfaceflinger.RectProto.decode(reader, reader.uint32());
                                    break;
                                }
                            case 8: {
                                    message.width = reader.uint32();
                                    break;
                                }
                            case 9: {
                                    message.height = reader.uint32();
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
                     * Decodes a DisplayState message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {android.surfaceflinger.proto.DisplayState} DisplayState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DisplayState.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a DisplayState message.
                     * @function verify
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    DisplayState.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.id != null && message.hasOwnProperty("id"))
                            if (!$util.isInteger(message.id))
                                return "id: integer expected";
                        if (message.what != null && message.hasOwnProperty("what"))
                            if (!$util.isInteger(message.what))
                                return "what: integer expected";
                        if (message.flags != null && message.hasOwnProperty("flags"))
                            if (!$util.isInteger(message.flags))
                                return "flags: integer expected";
                        if (message.layerStack != null && message.hasOwnProperty("layerStack"))
                            if (!$util.isInteger(message.layerStack))
                                return "layerStack: integer expected";
                        if (message.orientation != null && message.hasOwnProperty("orientation"))
                            if (!$util.isInteger(message.orientation))
                                return "orientation: integer expected";
                        if (message.layerStackSpaceRect != null && message.hasOwnProperty("layerStackSpaceRect")) {
                            var error = $root.android.surfaceflinger.RectProto.verify(message.layerStackSpaceRect);
                            if (error)
                                return "layerStackSpaceRect." + error;
                        }
                        if (message.orientedDisplaySpaceRect != null && message.hasOwnProperty("orientedDisplaySpaceRect")) {
                            var error = $root.android.surfaceflinger.RectProto.verify(message.orientedDisplaySpaceRect);
                            if (error)
                                return "orientedDisplaySpaceRect." + error;
                        }
                        if (message.width != null && message.hasOwnProperty("width"))
                            if (!$util.isInteger(message.width))
                                return "width: integer expected";
                        if (message.height != null && message.hasOwnProperty("height"))
                            if (!$util.isInteger(message.height))
                                return "height: integer expected";
                        return null;
                    };
    
                    /**
                     * Creates a DisplayState message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {android.surfaceflinger.proto.DisplayState} DisplayState
                     */
                    DisplayState.fromObject = function fromObject(object) {
                        if (object instanceof $root.android.surfaceflinger.proto.DisplayState)
                            return object;
                        var message = new $root.android.surfaceflinger.proto.DisplayState();
                        if (object.id != null)
                            message.id = object.id | 0;
                        if (object.what != null)
                            message.what = object.what >>> 0;
                        if (object.flags != null)
                            message.flags = object.flags >>> 0;
                        if (object.layerStack != null)
                            message.layerStack = object.layerStack >>> 0;
                        if (object.orientation != null)
                            message.orientation = object.orientation >>> 0;
                        if (object.layerStackSpaceRect != null) {
                            if (typeof object.layerStackSpaceRect !== "object")
                                throw TypeError(".android.surfaceflinger.proto.DisplayState.layerStackSpaceRect: object expected");
                            message.layerStackSpaceRect = $root.android.surfaceflinger.RectProto.fromObject(object.layerStackSpaceRect);
                        }
                        if (object.orientedDisplaySpaceRect != null) {
                            if (typeof object.orientedDisplaySpaceRect !== "object")
                                throw TypeError(".android.surfaceflinger.proto.DisplayState.orientedDisplaySpaceRect: object expected");
                            message.orientedDisplaySpaceRect = $root.android.surfaceflinger.RectProto.fromObject(object.orientedDisplaySpaceRect);
                        }
                        if (object.width != null)
                            message.width = object.width >>> 0;
                        if (object.height != null)
                            message.height = object.height >>> 0;
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a DisplayState message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @static
                     * @param {android.surfaceflinger.proto.DisplayState} message DisplayState
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    DisplayState.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.id = 0;
                            object.what = 0;
                            object.flags = 0;
                            object.layerStack = 0;
                            object.orientation = 0;
                            object.layerStackSpaceRect = null;
                            object.orientedDisplaySpaceRect = null;
                            object.width = 0;
                            object.height = 0;
                        }
                        if (message.id != null && message.hasOwnProperty("id"))
                            object.id = message.id;
                        if (message.what != null && message.hasOwnProperty("what"))
                            object.what = message.what;
                        if (message.flags != null && message.hasOwnProperty("flags"))
                            object.flags = message.flags;
                        if (message.layerStack != null && message.hasOwnProperty("layerStack"))
                            object.layerStack = message.layerStack;
                        if (message.orientation != null && message.hasOwnProperty("orientation"))
                            object.orientation = message.orientation;
                        if (message.layerStackSpaceRect != null && message.hasOwnProperty("layerStackSpaceRect"))
                            object.layerStackSpaceRect = $root.android.surfaceflinger.RectProto.toObject(message.layerStackSpaceRect, options);
                        if (message.orientedDisplaySpaceRect != null && message.hasOwnProperty("orientedDisplaySpaceRect"))
                            object.orientedDisplaySpaceRect = $root.android.surfaceflinger.RectProto.toObject(message.orientedDisplaySpaceRect, options);
                        if (message.width != null && message.hasOwnProperty("width"))
                            object.width = message.width;
                        if (message.height != null && message.hasOwnProperty("height"))
                            object.height = message.height;
                        return object;
                    };
    
                    /**
                     * Converts this DisplayState to JSON.
                     * @function toJSON
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    DisplayState.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    /**
                     * Gets the default type url for DisplayState
                     * @function getTypeUrl
                     * @memberof android.surfaceflinger.proto.DisplayState
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    DisplayState.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/android.surfaceflinger.proto.DisplayState";
                    };
    
                    /**
                     * Changes enum.
                     * @name android.surfaceflinger.proto.DisplayState.Changes
                     * @enum {number}
                     * @property {number} eChangesNone=0 eChangesNone value
                     * @property {number} eSurfaceChanged=1 eSurfaceChanged value
                     * @property {number} eLayerStackChanged=2 eLayerStackChanged value
                     * @property {number} eDisplayProjectionChanged=4 eDisplayProjectionChanged value
                     * @property {number} eDisplaySizeChanged=8 eDisplaySizeChanged value
                     * @property {number} eFlagsChanged=16 eFlagsChanged value
                     */
                    DisplayState.Changes = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "eChangesNone"] = 0;
                        values[valuesById[1] = "eSurfaceChanged"] = 1;
                        values[valuesById[2] = "eLayerStackChanged"] = 2;
                        values[valuesById[4] = "eDisplayProjectionChanged"] = 4;
                        values[valuesById[8] = "eDisplaySizeChanged"] = 8;
                        values[valuesById[16] = "eFlagsChanged"] = 16;
                        return values;
                    })();
    
                    return DisplayState;
                })();
    
                return proto;
            })();
    
            surfaceflinger.RegionProto = (function() {
    
                /**
                 * Properties of a RegionProto.
                 * @memberof android.surfaceflinger
                 * @interface IRegionProto
                 * @property {Array.<android.surfaceflinger.IRectProto>|null} [rect] RegionProto rect
                 */
    
                /**
                 * Constructs a new RegionProto.
                 * @memberof android.surfaceflinger
                 * @classdesc Represents a RegionProto.
                 * @implements IRegionProto
                 * @constructor
                 * @param {android.surfaceflinger.IRegionProto=} [properties] Properties to set
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
                 * @member {Array.<android.surfaceflinger.IRectProto>} rect
                 * @memberof android.surfaceflinger.RegionProto
                 * @instance
                 */
                RegionProto.prototype.rect = $util.emptyArray;
    
                /**
                 * Creates a new RegionProto instance using the specified properties.
                 * @function create
                 * @memberof android.surfaceflinger.RegionProto
                 * @static
                 * @param {android.surfaceflinger.IRegionProto=} [properties] Properties to set
                 * @returns {android.surfaceflinger.RegionProto} RegionProto instance
                 */
                RegionProto.create = function create(properties) {
                    return new RegionProto(properties);
                };
    
                /**
                 * Encodes the specified RegionProto message. Does not implicitly {@link android.surfaceflinger.RegionProto.verify|verify} messages.
                 * @function encode
                 * @memberof android.surfaceflinger.RegionProto
                 * @static
                 * @param {android.surfaceflinger.IRegionProto} message RegionProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                RegionProto.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.rect != null && message.rect.length)
                        for (var i = 0; i < message.rect.length; ++i)
                            $root.android.surfaceflinger.RectProto.encode(message.rect[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified RegionProto message, length delimited. Does not implicitly {@link android.surfaceflinger.RegionProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof android.surfaceflinger.RegionProto
                 * @static
                 * @param {android.surfaceflinger.IRegionProto} message RegionProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                RegionProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a RegionProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof android.surfaceflinger.RegionProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {android.surfaceflinger.RegionProto} RegionProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                RegionProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.RegionProto();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 2: {
                                if (!(message.rect && message.rect.length))
                                    message.rect = [];
                                message.rect.push($root.android.surfaceflinger.RectProto.decode(reader, reader.uint32()));
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
                 * @memberof android.surfaceflinger.RegionProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {android.surfaceflinger.RegionProto} RegionProto
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
                 * @memberof android.surfaceflinger.RegionProto
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
                            var error = $root.android.surfaceflinger.RectProto.verify(message.rect[i]);
                            if (error)
                                return "rect." + error;
                        }
                    }
                    return null;
                };
    
                /**
                 * Creates a RegionProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof android.surfaceflinger.RegionProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {android.surfaceflinger.RegionProto} RegionProto
                 */
                RegionProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.android.surfaceflinger.RegionProto)
                        return object;
                    var message = new $root.android.surfaceflinger.RegionProto();
                    if (object.rect) {
                        if (!Array.isArray(object.rect))
                            throw TypeError(".android.surfaceflinger.RegionProto.rect: array expected");
                        message.rect = [];
                        for (var i = 0; i < object.rect.length; ++i) {
                            if (typeof object.rect[i] !== "object")
                                throw TypeError(".android.surfaceflinger.RegionProto.rect: object expected");
                            message.rect[i] = $root.android.surfaceflinger.RectProto.fromObject(object.rect[i]);
                        }
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from a RegionProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof android.surfaceflinger.RegionProto
                 * @static
                 * @param {android.surfaceflinger.RegionProto} message RegionProto
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
                            object.rect[j] = $root.android.surfaceflinger.RectProto.toObject(message.rect[j], options);
                    }
                    return object;
                };
    
                /**
                 * Converts this RegionProto to JSON.
                 * @function toJSON
                 * @memberof android.surfaceflinger.RegionProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                RegionProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for RegionProto
                 * @function getTypeUrl
                 * @memberof android.surfaceflinger.RegionProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                RegionProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/android.surfaceflinger.RegionProto";
                };
    
                return RegionProto;
            })();
    
            surfaceflinger.RectProto = (function() {
    
                /**
                 * Properties of a RectProto.
                 * @memberof android.surfaceflinger
                 * @interface IRectProto
                 * @property {number|null} [left] RectProto left
                 * @property {number|null} [top] RectProto top
                 * @property {number|null} [right] RectProto right
                 * @property {number|null} [bottom] RectProto bottom
                 */
    
                /**
                 * Constructs a new RectProto.
                 * @memberof android.surfaceflinger
                 * @classdesc Represents a RectProto.
                 * @implements IRectProto
                 * @constructor
                 * @param {android.surfaceflinger.IRectProto=} [properties] Properties to set
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
                 * @memberof android.surfaceflinger.RectProto
                 * @instance
                 */
                RectProto.prototype.left = 0;
    
                /**
                 * RectProto top.
                 * @member {number} top
                 * @memberof android.surfaceflinger.RectProto
                 * @instance
                 */
                RectProto.prototype.top = 0;
    
                /**
                 * RectProto right.
                 * @member {number} right
                 * @memberof android.surfaceflinger.RectProto
                 * @instance
                 */
                RectProto.prototype.right = 0;
    
                /**
                 * RectProto bottom.
                 * @member {number} bottom
                 * @memberof android.surfaceflinger.RectProto
                 * @instance
                 */
                RectProto.prototype.bottom = 0;
    
                /**
                 * Creates a new RectProto instance using the specified properties.
                 * @function create
                 * @memberof android.surfaceflinger.RectProto
                 * @static
                 * @param {android.surfaceflinger.IRectProto=} [properties] Properties to set
                 * @returns {android.surfaceflinger.RectProto} RectProto instance
                 */
                RectProto.create = function create(properties) {
                    return new RectProto(properties);
                };
    
                /**
                 * Encodes the specified RectProto message. Does not implicitly {@link android.surfaceflinger.RectProto.verify|verify} messages.
                 * @function encode
                 * @memberof android.surfaceflinger.RectProto
                 * @static
                 * @param {android.surfaceflinger.IRectProto} message RectProto message or plain object to encode
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
                 * Encodes the specified RectProto message, length delimited. Does not implicitly {@link android.surfaceflinger.RectProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof android.surfaceflinger.RectProto
                 * @static
                 * @param {android.surfaceflinger.IRectProto} message RectProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                RectProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a RectProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof android.surfaceflinger.RectProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {android.surfaceflinger.RectProto} RectProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                RectProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.RectProto();
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
                 * @memberof android.surfaceflinger.RectProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {android.surfaceflinger.RectProto} RectProto
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
                 * @memberof android.surfaceflinger.RectProto
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
                 * @memberof android.surfaceflinger.RectProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {android.surfaceflinger.RectProto} RectProto
                 */
                RectProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.android.surfaceflinger.RectProto)
                        return object;
                    var message = new $root.android.surfaceflinger.RectProto();
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
                 * @memberof android.surfaceflinger.RectProto
                 * @static
                 * @param {android.surfaceflinger.RectProto} message RectProto
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
                 * @memberof android.surfaceflinger.RectProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                RectProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for RectProto
                 * @function getTypeUrl
                 * @memberof android.surfaceflinger.RectProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                RectProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/android.surfaceflinger.RectProto";
                };
    
                return RectProto;
            })();
    
            surfaceflinger.SizeProto = (function() {
    
                /**
                 * Properties of a SizeProto.
                 * @memberof android.surfaceflinger
                 * @interface ISizeProto
                 * @property {number|null} [w] SizeProto w
                 * @property {number|null} [h] SizeProto h
                 */
    
                /**
                 * Constructs a new SizeProto.
                 * @memberof android.surfaceflinger
                 * @classdesc Represents a SizeProto.
                 * @implements ISizeProto
                 * @constructor
                 * @param {android.surfaceflinger.ISizeProto=} [properties] Properties to set
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
                 * @memberof android.surfaceflinger.SizeProto
                 * @instance
                 */
                SizeProto.prototype.w = 0;
    
                /**
                 * SizeProto h.
                 * @member {number} h
                 * @memberof android.surfaceflinger.SizeProto
                 * @instance
                 */
                SizeProto.prototype.h = 0;
    
                /**
                 * Creates a new SizeProto instance using the specified properties.
                 * @function create
                 * @memberof android.surfaceflinger.SizeProto
                 * @static
                 * @param {android.surfaceflinger.ISizeProto=} [properties] Properties to set
                 * @returns {android.surfaceflinger.SizeProto} SizeProto instance
                 */
                SizeProto.create = function create(properties) {
                    return new SizeProto(properties);
                };
    
                /**
                 * Encodes the specified SizeProto message. Does not implicitly {@link android.surfaceflinger.SizeProto.verify|verify} messages.
                 * @function encode
                 * @memberof android.surfaceflinger.SizeProto
                 * @static
                 * @param {android.surfaceflinger.ISizeProto} message SizeProto message or plain object to encode
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
                 * Encodes the specified SizeProto message, length delimited. Does not implicitly {@link android.surfaceflinger.SizeProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof android.surfaceflinger.SizeProto
                 * @static
                 * @param {android.surfaceflinger.ISizeProto} message SizeProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SizeProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a SizeProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof android.surfaceflinger.SizeProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {android.surfaceflinger.SizeProto} SizeProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                SizeProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.SizeProto();
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
                 * @memberof android.surfaceflinger.SizeProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {android.surfaceflinger.SizeProto} SizeProto
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
                 * @memberof android.surfaceflinger.SizeProto
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
                 * @memberof android.surfaceflinger.SizeProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {android.surfaceflinger.SizeProto} SizeProto
                 */
                SizeProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.android.surfaceflinger.SizeProto)
                        return object;
                    var message = new $root.android.surfaceflinger.SizeProto();
                    if (object.w != null)
                        message.w = object.w | 0;
                    if (object.h != null)
                        message.h = object.h | 0;
                    return message;
                };
    
                /**
                 * Creates a plain object from a SizeProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof android.surfaceflinger.SizeProto
                 * @static
                 * @param {android.surfaceflinger.SizeProto} message SizeProto
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
                 * @memberof android.surfaceflinger.SizeProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                SizeProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for SizeProto
                 * @function getTypeUrl
                 * @memberof android.surfaceflinger.SizeProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                SizeProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/android.surfaceflinger.SizeProto";
                };
    
                return SizeProto;
            })();
    
            surfaceflinger.TransformProto = (function() {
    
                /**
                 * Properties of a TransformProto.
                 * @memberof android.surfaceflinger
                 * @interface ITransformProto
                 * @property {number|null} [dsdx] TransformProto dsdx
                 * @property {number|null} [dtdx] TransformProto dtdx
                 * @property {number|null} [dsdy] TransformProto dsdy
                 * @property {number|null} [dtdy] TransformProto dtdy
                 * @property {number|null} [type] TransformProto type
                 */
    
                /**
                 * Constructs a new TransformProto.
                 * @memberof android.surfaceflinger
                 * @classdesc Represents a TransformProto.
                 * @implements ITransformProto
                 * @constructor
                 * @param {android.surfaceflinger.ITransformProto=} [properties] Properties to set
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
                 * @memberof android.surfaceflinger.TransformProto
                 * @instance
                 */
                TransformProto.prototype.dsdx = 0;
    
                /**
                 * TransformProto dtdx.
                 * @member {number} dtdx
                 * @memberof android.surfaceflinger.TransformProto
                 * @instance
                 */
                TransformProto.prototype.dtdx = 0;
    
                /**
                 * TransformProto dsdy.
                 * @member {number} dsdy
                 * @memberof android.surfaceflinger.TransformProto
                 * @instance
                 */
                TransformProto.prototype.dsdy = 0;
    
                /**
                 * TransformProto dtdy.
                 * @member {number} dtdy
                 * @memberof android.surfaceflinger.TransformProto
                 * @instance
                 */
                TransformProto.prototype.dtdy = 0;
    
                /**
                 * TransformProto type.
                 * @member {number} type
                 * @memberof android.surfaceflinger.TransformProto
                 * @instance
                 */
                TransformProto.prototype.type = 0;
    
                /**
                 * Creates a new TransformProto instance using the specified properties.
                 * @function create
                 * @memberof android.surfaceflinger.TransformProto
                 * @static
                 * @param {android.surfaceflinger.ITransformProto=} [properties] Properties to set
                 * @returns {android.surfaceflinger.TransformProto} TransformProto instance
                 */
                TransformProto.create = function create(properties) {
                    return new TransformProto(properties);
                };
    
                /**
                 * Encodes the specified TransformProto message. Does not implicitly {@link android.surfaceflinger.TransformProto.verify|verify} messages.
                 * @function encode
                 * @memberof android.surfaceflinger.TransformProto
                 * @static
                 * @param {android.surfaceflinger.ITransformProto} message TransformProto message or plain object to encode
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
                 * Encodes the specified TransformProto message, length delimited. Does not implicitly {@link android.surfaceflinger.TransformProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof android.surfaceflinger.TransformProto
                 * @static
                 * @param {android.surfaceflinger.ITransformProto} message TransformProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                TransformProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a TransformProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof android.surfaceflinger.TransformProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {android.surfaceflinger.TransformProto} TransformProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                TransformProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.TransformProto();
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
                 * @memberof android.surfaceflinger.TransformProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {android.surfaceflinger.TransformProto} TransformProto
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
                 * @memberof android.surfaceflinger.TransformProto
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
                 * @memberof android.surfaceflinger.TransformProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {android.surfaceflinger.TransformProto} TransformProto
                 */
                TransformProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.android.surfaceflinger.TransformProto)
                        return object;
                    var message = new $root.android.surfaceflinger.TransformProto();
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
                 * @memberof android.surfaceflinger.TransformProto
                 * @static
                 * @param {android.surfaceflinger.TransformProto} message TransformProto
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
                 * @memberof android.surfaceflinger.TransformProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                TransformProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for TransformProto
                 * @function getTypeUrl
                 * @memberof android.surfaceflinger.TransformProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                TransformProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/android.surfaceflinger.TransformProto";
                };
    
                return TransformProto;
            })();
    
            surfaceflinger.ColorProto = (function() {
    
                /**
                 * Properties of a ColorProto.
                 * @memberof android.surfaceflinger
                 * @interface IColorProto
                 * @property {number|null} [r] ColorProto r
                 * @property {number|null} [g] ColorProto g
                 * @property {number|null} [b] ColorProto b
                 * @property {number|null} [a] ColorProto a
                 */
    
                /**
                 * Constructs a new ColorProto.
                 * @memberof android.surfaceflinger
                 * @classdesc Represents a ColorProto.
                 * @implements IColorProto
                 * @constructor
                 * @param {android.surfaceflinger.IColorProto=} [properties] Properties to set
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
                 * @memberof android.surfaceflinger.ColorProto
                 * @instance
                 */
                ColorProto.prototype.r = 0;
    
                /**
                 * ColorProto g.
                 * @member {number} g
                 * @memberof android.surfaceflinger.ColorProto
                 * @instance
                 */
                ColorProto.prototype.g = 0;
    
                /**
                 * ColorProto b.
                 * @member {number} b
                 * @memberof android.surfaceflinger.ColorProto
                 * @instance
                 */
                ColorProto.prototype.b = 0;
    
                /**
                 * ColorProto a.
                 * @member {number} a
                 * @memberof android.surfaceflinger.ColorProto
                 * @instance
                 */
                ColorProto.prototype.a = 0;
    
                /**
                 * Creates a new ColorProto instance using the specified properties.
                 * @function create
                 * @memberof android.surfaceflinger.ColorProto
                 * @static
                 * @param {android.surfaceflinger.IColorProto=} [properties] Properties to set
                 * @returns {android.surfaceflinger.ColorProto} ColorProto instance
                 */
                ColorProto.create = function create(properties) {
                    return new ColorProto(properties);
                };
    
                /**
                 * Encodes the specified ColorProto message. Does not implicitly {@link android.surfaceflinger.ColorProto.verify|verify} messages.
                 * @function encode
                 * @memberof android.surfaceflinger.ColorProto
                 * @static
                 * @param {android.surfaceflinger.IColorProto} message ColorProto message or plain object to encode
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
                 * Encodes the specified ColorProto message, length delimited. Does not implicitly {@link android.surfaceflinger.ColorProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof android.surfaceflinger.ColorProto
                 * @static
                 * @param {android.surfaceflinger.IColorProto} message ColorProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ColorProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a ColorProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof android.surfaceflinger.ColorProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {android.surfaceflinger.ColorProto} ColorProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ColorProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.ColorProto();
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
                 * @memberof android.surfaceflinger.ColorProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {android.surfaceflinger.ColorProto} ColorProto
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
                 * @memberof android.surfaceflinger.ColorProto
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
                 * @memberof android.surfaceflinger.ColorProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {android.surfaceflinger.ColorProto} ColorProto
                 */
                ColorProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.android.surfaceflinger.ColorProto)
                        return object;
                    var message = new $root.android.surfaceflinger.ColorProto();
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
                 * @memberof android.surfaceflinger.ColorProto
                 * @static
                 * @param {android.surfaceflinger.ColorProto} message ColorProto
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
                 * @memberof android.surfaceflinger.ColorProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ColorProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for ColorProto
                 * @function getTypeUrl
                 * @memberof android.surfaceflinger.ColorProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                ColorProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/android.surfaceflinger.ColorProto";
                };
    
                return ColorProto;
            })();
    
            surfaceflinger.InputWindowInfoProto = (function() {
    
                /**
                 * Properties of an InputWindowInfoProto.
                 * @memberof android.surfaceflinger
                 * @interface IInputWindowInfoProto
                 * @property {number|null} [layoutParamsFlags] InputWindowInfoProto layoutParamsFlags
                 * @property {number|null} [layoutParamsType] InputWindowInfoProto layoutParamsType
                 * @property {android.surfaceflinger.IRectProto|null} [frame] InputWindowInfoProto frame
                 * @property {android.surfaceflinger.IRegionProto|null} [touchableRegion] InputWindowInfoProto touchableRegion
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
                 * @property {android.surfaceflinger.IRectProto|null} [touchableRegionCrop] InputWindowInfoProto touchableRegionCrop
                 * @property {android.surfaceflinger.ITransformProto|null} [transform] InputWindowInfoProto transform
                 */
    
                /**
                 * Constructs a new InputWindowInfoProto.
                 * @memberof android.surfaceflinger
                 * @classdesc Represents an InputWindowInfoProto.
                 * @implements IInputWindowInfoProto
                 * @constructor
                 * @param {android.surfaceflinger.IInputWindowInfoProto=} [properties] Properties to set
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
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.layoutParamsFlags = 0;
    
                /**
                 * InputWindowInfoProto layoutParamsType.
                 * @member {number} layoutParamsType
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.layoutParamsType = 0;
    
                /**
                 * InputWindowInfoProto frame.
                 * @member {android.surfaceflinger.IRectProto|null|undefined} frame
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.frame = null;
    
                /**
                 * InputWindowInfoProto touchableRegion.
                 * @member {android.surfaceflinger.IRegionProto|null|undefined} touchableRegion
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.touchableRegion = null;
    
                /**
                 * InputWindowInfoProto surfaceInset.
                 * @member {number} surfaceInset
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.surfaceInset = 0;
    
                /**
                 * InputWindowInfoProto visible.
                 * @member {boolean} visible
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.visible = false;
    
                /**
                 * InputWindowInfoProto canReceiveKeys.
                 * @member {boolean} canReceiveKeys
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.canReceiveKeys = false;
    
                /**
                 * InputWindowInfoProto focusable.
                 * @member {boolean} focusable
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.focusable = false;
    
                /**
                 * InputWindowInfoProto hasWallpaper.
                 * @member {boolean} hasWallpaper
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.hasWallpaper = false;
    
                /**
                 * InputWindowInfoProto globalScaleFactor.
                 * @member {number} globalScaleFactor
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.globalScaleFactor = 0;
    
                /**
                 * InputWindowInfoProto windowXScale.
                 * @member {number} windowXScale
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.windowXScale = 0;
    
                /**
                 * InputWindowInfoProto windowYScale.
                 * @member {number} windowYScale
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.windowYScale = 0;
    
                /**
                 * InputWindowInfoProto cropLayerId.
                 * @member {number} cropLayerId
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.cropLayerId = 0;
    
                /**
                 * InputWindowInfoProto replaceTouchableRegionWithCrop.
                 * @member {boolean} replaceTouchableRegionWithCrop
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.replaceTouchableRegionWithCrop = false;
    
                /**
                 * InputWindowInfoProto touchableRegionCrop.
                 * @member {android.surfaceflinger.IRectProto|null|undefined} touchableRegionCrop
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.touchableRegionCrop = null;
    
                /**
                 * InputWindowInfoProto transform.
                 * @member {android.surfaceflinger.ITransformProto|null|undefined} transform
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @instance
                 */
                InputWindowInfoProto.prototype.transform = null;
    
                /**
                 * Creates a new InputWindowInfoProto instance using the specified properties.
                 * @function create
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @static
                 * @param {android.surfaceflinger.IInputWindowInfoProto=} [properties] Properties to set
                 * @returns {android.surfaceflinger.InputWindowInfoProto} InputWindowInfoProto instance
                 */
                InputWindowInfoProto.create = function create(properties) {
                    return new InputWindowInfoProto(properties);
                };
    
                /**
                 * Encodes the specified InputWindowInfoProto message. Does not implicitly {@link android.surfaceflinger.InputWindowInfoProto.verify|verify} messages.
                 * @function encode
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @static
                 * @param {android.surfaceflinger.IInputWindowInfoProto} message InputWindowInfoProto message or plain object to encode
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
                        $root.android.surfaceflinger.RectProto.encode(message.frame, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    if (message.touchableRegion != null && Object.hasOwnProperty.call(message, "touchableRegion"))
                        $root.android.surfaceflinger.RegionProto.encode(message.touchableRegion, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
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
                        $root.android.surfaceflinger.RectProto.encode(message.touchableRegionCrop, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
                    if (message.transform != null && Object.hasOwnProperty.call(message, "transform"))
                        $root.android.surfaceflinger.TransformProto.encode(message.transform, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified InputWindowInfoProto message, length delimited. Does not implicitly {@link android.surfaceflinger.InputWindowInfoProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @static
                 * @param {android.surfaceflinger.IInputWindowInfoProto} message InputWindowInfoProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                InputWindowInfoProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an InputWindowInfoProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {android.surfaceflinger.InputWindowInfoProto} InputWindowInfoProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                InputWindowInfoProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.InputWindowInfoProto();
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
                                message.frame = $root.android.surfaceflinger.RectProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 4: {
                                message.touchableRegion = $root.android.surfaceflinger.RegionProto.decode(reader, reader.uint32());
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
                                message.touchableRegionCrop = $root.android.surfaceflinger.RectProto.decode(reader, reader.uint32());
                                break;
                            }
                        case 16: {
                                message.transform = $root.android.surfaceflinger.TransformProto.decode(reader, reader.uint32());
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
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {android.surfaceflinger.InputWindowInfoProto} InputWindowInfoProto
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
                 * @memberof android.surfaceflinger.InputWindowInfoProto
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
                        var error = $root.android.surfaceflinger.RectProto.verify(message.frame);
                        if (error)
                            return "frame." + error;
                    }
                    if (message.touchableRegion != null && message.hasOwnProperty("touchableRegion")) {
                        var error = $root.android.surfaceflinger.RegionProto.verify(message.touchableRegion);
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
                        var error = $root.android.surfaceflinger.RectProto.verify(message.touchableRegionCrop);
                        if (error)
                            return "touchableRegionCrop." + error;
                    }
                    if (message.transform != null && message.hasOwnProperty("transform")) {
                        var error = $root.android.surfaceflinger.TransformProto.verify(message.transform);
                        if (error)
                            return "transform." + error;
                    }
                    return null;
                };
    
                /**
                 * Creates an InputWindowInfoProto message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {android.surfaceflinger.InputWindowInfoProto} InputWindowInfoProto
                 */
                InputWindowInfoProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.android.surfaceflinger.InputWindowInfoProto)
                        return object;
                    var message = new $root.android.surfaceflinger.InputWindowInfoProto();
                    if (object.layoutParamsFlags != null)
                        message.layoutParamsFlags = object.layoutParamsFlags >>> 0;
                    if (object.layoutParamsType != null)
                        message.layoutParamsType = object.layoutParamsType | 0;
                    if (object.frame != null) {
                        if (typeof object.frame !== "object")
                            throw TypeError(".android.surfaceflinger.InputWindowInfoProto.frame: object expected");
                        message.frame = $root.android.surfaceflinger.RectProto.fromObject(object.frame);
                    }
                    if (object.touchableRegion != null) {
                        if (typeof object.touchableRegion !== "object")
                            throw TypeError(".android.surfaceflinger.InputWindowInfoProto.touchableRegion: object expected");
                        message.touchableRegion = $root.android.surfaceflinger.RegionProto.fromObject(object.touchableRegion);
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
                            throw TypeError(".android.surfaceflinger.InputWindowInfoProto.touchableRegionCrop: object expected");
                        message.touchableRegionCrop = $root.android.surfaceflinger.RectProto.fromObject(object.touchableRegionCrop);
                    }
                    if (object.transform != null) {
                        if (typeof object.transform !== "object")
                            throw TypeError(".android.surfaceflinger.InputWindowInfoProto.transform: object expected");
                        message.transform = $root.android.surfaceflinger.TransformProto.fromObject(object.transform);
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from an InputWindowInfoProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @static
                 * @param {android.surfaceflinger.InputWindowInfoProto} message InputWindowInfoProto
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
                    }
                    if (message.layoutParamsFlags != null && message.hasOwnProperty("layoutParamsFlags"))
                        object.layoutParamsFlags = message.layoutParamsFlags;
                    if (message.layoutParamsType != null && message.hasOwnProperty("layoutParamsType"))
                        object.layoutParamsType = message.layoutParamsType;
                    if (message.frame != null && message.hasOwnProperty("frame"))
                        object.frame = $root.android.surfaceflinger.RectProto.toObject(message.frame, options);
                    if (message.touchableRegion != null && message.hasOwnProperty("touchableRegion"))
                        object.touchableRegion = $root.android.surfaceflinger.RegionProto.toObject(message.touchableRegion, options);
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
                        object.touchableRegionCrop = $root.android.surfaceflinger.RectProto.toObject(message.touchableRegionCrop, options);
                    if (message.transform != null && message.hasOwnProperty("transform"))
                        object.transform = $root.android.surfaceflinger.TransformProto.toObject(message.transform, options);
                    return object;
                };
    
                /**
                 * Converts this InputWindowInfoProto to JSON.
                 * @function toJSON
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                InputWindowInfoProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for InputWindowInfoProto
                 * @function getTypeUrl
                 * @memberof android.surfaceflinger.InputWindowInfoProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                InputWindowInfoProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/android.surfaceflinger.InputWindowInfoProto";
                };
    
                return InputWindowInfoProto;
            })();
    
            surfaceflinger.BlurRegion = (function() {
    
                /**
                 * Properties of a BlurRegion.
                 * @memberof android.surfaceflinger
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
                 * @memberof android.surfaceflinger
                 * @classdesc Represents a BlurRegion.
                 * @implements IBlurRegion
                 * @constructor
                 * @param {android.surfaceflinger.IBlurRegion=} [properties] Properties to set
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
                 * @memberof android.surfaceflinger.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.blurRadius = 0;
    
                /**
                 * BlurRegion cornerRadiusTl.
                 * @member {number} cornerRadiusTl
                 * @memberof android.surfaceflinger.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.cornerRadiusTl = 0;
    
                /**
                 * BlurRegion cornerRadiusTr.
                 * @member {number} cornerRadiusTr
                 * @memberof android.surfaceflinger.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.cornerRadiusTr = 0;
    
                /**
                 * BlurRegion cornerRadiusBl.
                 * @member {number} cornerRadiusBl
                 * @memberof android.surfaceflinger.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.cornerRadiusBl = 0;
    
                /**
                 * BlurRegion cornerRadiusBr.
                 * @member {number} cornerRadiusBr
                 * @memberof android.surfaceflinger.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.cornerRadiusBr = 0;
    
                /**
                 * BlurRegion alpha.
                 * @member {number} alpha
                 * @memberof android.surfaceflinger.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.alpha = 0;
    
                /**
                 * BlurRegion left.
                 * @member {number} left
                 * @memberof android.surfaceflinger.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.left = 0;
    
                /**
                 * BlurRegion top.
                 * @member {number} top
                 * @memberof android.surfaceflinger.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.top = 0;
    
                /**
                 * BlurRegion right.
                 * @member {number} right
                 * @memberof android.surfaceflinger.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.right = 0;
    
                /**
                 * BlurRegion bottom.
                 * @member {number} bottom
                 * @memberof android.surfaceflinger.BlurRegion
                 * @instance
                 */
                BlurRegion.prototype.bottom = 0;
    
                /**
                 * Creates a new BlurRegion instance using the specified properties.
                 * @function create
                 * @memberof android.surfaceflinger.BlurRegion
                 * @static
                 * @param {android.surfaceflinger.IBlurRegion=} [properties] Properties to set
                 * @returns {android.surfaceflinger.BlurRegion} BlurRegion instance
                 */
                BlurRegion.create = function create(properties) {
                    return new BlurRegion(properties);
                };
    
                /**
                 * Encodes the specified BlurRegion message. Does not implicitly {@link android.surfaceflinger.BlurRegion.verify|verify} messages.
                 * @function encode
                 * @memberof android.surfaceflinger.BlurRegion
                 * @static
                 * @param {android.surfaceflinger.IBlurRegion} message BlurRegion message or plain object to encode
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
                 * Encodes the specified BlurRegion message, length delimited. Does not implicitly {@link android.surfaceflinger.BlurRegion.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof android.surfaceflinger.BlurRegion
                 * @static
                 * @param {android.surfaceflinger.IBlurRegion} message BlurRegion message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                BlurRegion.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a BlurRegion message from the specified reader or buffer.
                 * @function decode
                 * @memberof android.surfaceflinger.BlurRegion
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {android.surfaceflinger.BlurRegion} BlurRegion
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                BlurRegion.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.BlurRegion();
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
                 * @memberof android.surfaceflinger.BlurRegion
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {android.surfaceflinger.BlurRegion} BlurRegion
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
                 * @memberof android.surfaceflinger.BlurRegion
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
                 * @memberof android.surfaceflinger.BlurRegion
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {android.surfaceflinger.BlurRegion} BlurRegion
                 */
                BlurRegion.fromObject = function fromObject(object) {
                    if (object instanceof $root.android.surfaceflinger.BlurRegion)
                        return object;
                    var message = new $root.android.surfaceflinger.BlurRegion();
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
                 * @memberof android.surfaceflinger.BlurRegion
                 * @static
                 * @param {android.surfaceflinger.BlurRegion} message BlurRegion
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
                 * @memberof android.surfaceflinger.BlurRegion
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                BlurRegion.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for BlurRegion
                 * @function getTypeUrl
                 * @memberof android.surfaceflinger.BlurRegion
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                BlurRegion.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/android.surfaceflinger.BlurRegion";
                };
    
                return BlurRegion;
            })();
    
            surfaceflinger.ColorTransformProto = (function() {
    
                /**
                 * Properties of a ColorTransformProto.
                 * @memberof android.surfaceflinger
                 * @interface IColorTransformProto
                 * @property {Array.<number>|null} [val] ColorTransformProto val
                 */
    
                /**
                 * Constructs a new ColorTransformProto.
                 * @memberof android.surfaceflinger
                 * @classdesc Represents a ColorTransformProto.
                 * @implements IColorTransformProto
                 * @constructor
                 * @param {android.surfaceflinger.IColorTransformProto=} [properties] Properties to set
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
                 * @memberof android.surfaceflinger.ColorTransformProto
                 * @instance
                 */
                ColorTransformProto.prototype.val = $util.emptyArray;
    
                /**
                 * Creates a new ColorTransformProto instance using the specified properties.
                 * @function create
                 * @memberof android.surfaceflinger.ColorTransformProto
                 * @static
                 * @param {android.surfaceflinger.IColorTransformProto=} [properties] Properties to set
                 * @returns {android.surfaceflinger.ColorTransformProto} ColorTransformProto instance
                 */
                ColorTransformProto.create = function create(properties) {
                    return new ColorTransformProto(properties);
                };
    
                /**
                 * Encodes the specified ColorTransformProto message. Does not implicitly {@link android.surfaceflinger.ColorTransformProto.verify|verify} messages.
                 * @function encode
                 * @memberof android.surfaceflinger.ColorTransformProto
                 * @static
                 * @param {android.surfaceflinger.IColorTransformProto} message ColorTransformProto message or plain object to encode
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
                 * Encodes the specified ColorTransformProto message, length delimited. Does not implicitly {@link android.surfaceflinger.ColorTransformProto.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof android.surfaceflinger.ColorTransformProto
                 * @static
                 * @param {android.surfaceflinger.IColorTransformProto} message ColorTransformProto message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ColorTransformProto.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a ColorTransformProto message from the specified reader or buffer.
                 * @function decode
                 * @memberof android.surfaceflinger.ColorTransformProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {android.surfaceflinger.ColorTransformProto} ColorTransformProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ColorTransformProto.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.android.surfaceflinger.ColorTransformProto();
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
                 * @memberof android.surfaceflinger.ColorTransformProto
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {android.surfaceflinger.ColorTransformProto} ColorTransformProto
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
                 * @memberof android.surfaceflinger.ColorTransformProto
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
                 * @memberof android.surfaceflinger.ColorTransformProto
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {android.surfaceflinger.ColorTransformProto} ColorTransformProto
                 */
                ColorTransformProto.fromObject = function fromObject(object) {
                    if (object instanceof $root.android.surfaceflinger.ColorTransformProto)
                        return object;
                    var message = new $root.android.surfaceflinger.ColorTransformProto();
                    if (object.val) {
                        if (!Array.isArray(object.val))
                            throw TypeError(".android.surfaceflinger.ColorTransformProto.val: array expected");
                        message.val = [];
                        for (var i = 0; i < object.val.length; ++i)
                            message.val[i] = Number(object.val[i]);
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from a ColorTransformProto message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof android.surfaceflinger.ColorTransformProto
                 * @static
                 * @param {android.surfaceflinger.ColorTransformProto} message ColorTransformProto
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
                 * @memberof android.surfaceflinger.ColorTransformProto
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ColorTransformProto.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * Gets the default type url for ColorTransformProto
                 * @function getTypeUrl
                 * @memberof android.surfaceflinger.ColorTransformProto
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                ColorTransformProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/android.surfaceflinger.ColorTransformProto";
                };
    
                return ColorTransformProto;
            })();
    
            return surfaceflinger;
        })();
    
        return android;
    })();

    return $root;
});
