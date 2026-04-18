import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace android. */
export namespace android {

    /** Namespace surfaceflinger. */
    namespace surfaceflinger {

        /** Namespace proto. */
        namespace proto {

            /** Properties of a TransactionTraceFile. */
            interface ITransactionTraceFile {

                /** TransactionTraceFile magicNumber */
                magicNumber?: (Long|null);

                /** TransactionTraceFile entry */
                entry?: (android.surfaceflinger.proto.ITransactionTraceEntry[]|null);

                /** TransactionTraceFile realToElapsedTimeOffsetNanos */
                realToElapsedTimeOffsetNanos?: (Long|null);

                /** TransactionTraceFile version */
                version?: (number|null);
            }

            /** Represents a TransactionTraceFile. */
            class TransactionTraceFile implements ITransactionTraceFile {

                /**
                 * Constructs a new TransactionTraceFile.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.surfaceflinger.proto.ITransactionTraceFile);

                /** TransactionTraceFile magicNumber. */
                public magicNumber: Long;

                /** TransactionTraceFile entry. */
                public entry: android.surfaceflinger.proto.ITransactionTraceEntry[];

                /** TransactionTraceFile realToElapsedTimeOffsetNanos. */
                public realToElapsedTimeOffsetNanos: Long;

                /** TransactionTraceFile version. */
                public version: number;

                /**
                 * Creates a new TransactionTraceFile instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TransactionTraceFile instance
                 */
                public static create(properties?: android.surfaceflinger.proto.ITransactionTraceFile): android.surfaceflinger.proto.TransactionTraceFile;

                /**
                 * Encodes the specified TransactionTraceFile message. Does not implicitly {@link android.surfaceflinger.proto.TransactionTraceFile.verify|verify} messages.
                 * @param message TransactionTraceFile message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.surfaceflinger.proto.ITransactionTraceFile, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TransactionTraceFile message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.TransactionTraceFile.verify|verify} messages.
                 * @param message TransactionTraceFile message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.surfaceflinger.proto.ITransactionTraceFile, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TransactionTraceFile message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TransactionTraceFile
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.proto.TransactionTraceFile;

                /**
                 * Decodes a TransactionTraceFile message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TransactionTraceFile
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.proto.TransactionTraceFile;

                /**
                 * Verifies a TransactionTraceFile message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TransactionTraceFile message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TransactionTraceFile
                 */
                public static fromObject(object: { [k: string]: any }): android.surfaceflinger.proto.TransactionTraceFile;

                /**
                 * Creates a plain object from a TransactionTraceFile message. Also converts values to other types if specified.
                 * @param message TransactionTraceFile
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.surfaceflinger.proto.TransactionTraceFile, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TransactionTraceFile to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TransactionTraceFile
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace TransactionTraceFile {

                /** MagicNumber enum. */
                enum MagicNumber {
                    INVALID = 0,
                    MAGIC_NUMBER_L = 1415073364,
                    MAGIC_NUMBER_H = 1162035538
                }
            }

            /** Properties of a TransactionTraceEntry. */
            interface ITransactionTraceEntry {

                /** TransactionTraceEntry elapsedRealtimeNanos */
                elapsedRealtimeNanos?: (Long|null);

                /** TransactionTraceEntry vsyncId */
                vsyncId?: (Long|null);

                /** TransactionTraceEntry transactions */
                transactions?: (android.surfaceflinger.proto.ITransactionState[]|null);

                /** TransactionTraceEntry addedLayers */
                addedLayers?: (android.surfaceflinger.proto.ILayerCreationArgs[]|null);

                /** TransactionTraceEntry destroyedLayers */
                destroyedLayers?: (number[]|null);

                /** TransactionTraceEntry addedDisplays */
                addedDisplays?: (android.surfaceflinger.proto.IDisplayState[]|null);

                /** TransactionTraceEntry removedDisplays */
                removedDisplays?: (number[]|null);

                /** TransactionTraceEntry destroyedLayerHandles */
                destroyedLayerHandles?: (number[]|null);

                /** TransactionTraceEntry displaysChanged */
                displaysChanged?: (boolean|null);

                /** TransactionTraceEntry displays */
                displays?: (android.surfaceflinger.proto.IDisplayInfo[]|null);
            }

            /** Represents a TransactionTraceEntry. */
            class TransactionTraceEntry implements ITransactionTraceEntry {

                /**
                 * Constructs a new TransactionTraceEntry.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.surfaceflinger.proto.ITransactionTraceEntry);

                /** TransactionTraceEntry elapsedRealtimeNanos. */
                public elapsedRealtimeNanos: Long;

                /** TransactionTraceEntry vsyncId. */
                public vsyncId: Long;

                /** TransactionTraceEntry transactions. */
                public transactions: android.surfaceflinger.proto.ITransactionState[];

                /** TransactionTraceEntry addedLayers. */
                public addedLayers: android.surfaceflinger.proto.ILayerCreationArgs[];

                /** TransactionTraceEntry destroyedLayers. */
                public destroyedLayers: number[];

                /** TransactionTraceEntry addedDisplays. */
                public addedDisplays: android.surfaceflinger.proto.IDisplayState[];

                /** TransactionTraceEntry removedDisplays. */
                public removedDisplays: number[];

                /** TransactionTraceEntry destroyedLayerHandles. */
                public destroyedLayerHandles: number[];

                /** TransactionTraceEntry displaysChanged. */
                public displaysChanged: boolean;

                /** TransactionTraceEntry displays. */
                public displays: android.surfaceflinger.proto.IDisplayInfo[];

                /**
                 * Creates a new TransactionTraceEntry instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TransactionTraceEntry instance
                 */
                public static create(properties?: android.surfaceflinger.proto.ITransactionTraceEntry): android.surfaceflinger.proto.TransactionTraceEntry;

                /**
                 * Encodes the specified TransactionTraceEntry message. Does not implicitly {@link android.surfaceflinger.proto.TransactionTraceEntry.verify|verify} messages.
                 * @param message TransactionTraceEntry message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.surfaceflinger.proto.ITransactionTraceEntry, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TransactionTraceEntry message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.TransactionTraceEntry.verify|verify} messages.
                 * @param message TransactionTraceEntry message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.surfaceflinger.proto.ITransactionTraceEntry, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TransactionTraceEntry message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TransactionTraceEntry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.proto.TransactionTraceEntry;

                /**
                 * Decodes a TransactionTraceEntry message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TransactionTraceEntry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.proto.TransactionTraceEntry;

                /**
                 * Verifies a TransactionTraceEntry message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TransactionTraceEntry message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TransactionTraceEntry
                 */
                public static fromObject(object: { [k: string]: any }): android.surfaceflinger.proto.TransactionTraceEntry;

                /**
                 * Creates a plain object from a TransactionTraceEntry message. Also converts values to other types if specified.
                 * @param message TransactionTraceEntry
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.surfaceflinger.proto.TransactionTraceEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TransactionTraceEntry to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TransactionTraceEntry
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a DisplayInfo. */
            interface IDisplayInfo {

                /** DisplayInfo layerStack */
                layerStack?: (number|null);

                /** DisplayInfo displayId */
                displayId?: (number|null);

                /** DisplayInfo logicalWidth */
                logicalWidth?: (number|null);

                /** DisplayInfo logicalHeight */
                logicalHeight?: (number|null);

                /** DisplayInfo transformInverse */
                transformInverse?: (android.surfaceflinger.proto.ITransform|null);

                /** DisplayInfo transform */
                transform?: (android.surfaceflinger.proto.ITransform|null);

                /** DisplayInfo receivesInput */
                receivesInput?: (boolean|null);

                /** DisplayInfo isSecure */
                isSecure?: (boolean|null);

                /** DisplayInfo isPrimary */
                isPrimary?: (boolean|null);

                /** DisplayInfo isVirtual */
                isVirtual?: (boolean|null);

                /** DisplayInfo rotationFlags */
                rotationFlags?: (number|null);

                /** DisplayInfo transformHint */
                transformHint?: (number|null);
            }

            /** Represents a DisplayInfo. */
            class DisplayInfo implements IDisplayInfo {

                /**
                 * Constructs a new DisplayInfo.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.surfaceflinger.proto.IDisplayInfo);

                /** DisplayInfo layerStack. */
                public layerStack: number;

                /** DisplayInfo displayId. */
                public displayId: number;

                /** DisplayInfo logicalWidth. */
                public logicalWidth: number;

                /** DisplayInfo logicalHeight. */
                public logicalHeight: number;

                /** DisplayInfo transformInverse. */
                public transformInverse?: (android.surfaceflinger.proto.ITransform|null);

                /** DisplayInfo transform. */
                public transform?: (android.surfaceflinger.proto.ITransform|null);

                /** DisplayInfo receivesInput. */
                public receivesInput: boolean;

                /** DisplayInfo isSecure. */
                public isSecure: boolean;

                /** DisplayInfo isPrimary. */
                public isPrimary: boolean;

                /** DisplayInfo isVirtual. */
                public isVirtual: boolean;

                /** DisplayInfo rotationFlags. */
                public rotationFlags: number;

                /** DisplayInfo transformHint. */
                public transformHint: number;

                /**
                 * Creates a new DisplayInfo instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DisplayInfo instance
                 */
                public static create(properties?: android.surfaceflinger.proto.IDisplayInfo): android.surfaceflinger.proto.DisplayInfo;

                /**
                 * Encodes the specified DisplayInfo message. Does not implicitly {@link android.surfaceflinger.proto.DisplayInfo.verify|verify} messages.
                 * @param message DisplayInfo message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.surfaceflinger.proto.IDisplayInfo, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DisplayInfo message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.DisplayInfo.verify|verify} messages.
                 * @param message DisplayInfo message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.surfaceflinger.proto.IDisplayInfo, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DisplayInfo message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DisplayInfo
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.proto.DisplayInfo;

                /**
                 * Decodes a DisplayInfo message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DisplayInfo
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.proto.DisplayInfo;

                /**
                 * Verifies a DisplayInfo message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DisplayInfo message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DisplayInfo
                 */
                public static fromObject(object: { [k: string]: any }): android.surfaceflinger.proto.DisplayInfo;

                /**
                 * Creates a plain object from a DisplayInfo message. Also converts values to other types if specified.
                 * @param message DisplayInfo
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.surfaceflinger.proto.DisplayInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DisplayInfo to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for DisplayInfo
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a LayerCreationArgs. */
            interface ILayerCreationArgs {

                /** LayerCreationArgs layerId */
                layerId?: (number|null);

                /** LayerCreationArgs name */
                name?: (string|null);

                /** LayerCreationArgs flags */
                flags?: (number|null);

                /** LayerCreationArgs parentId */
                parentId?: (number|null);

                /** LayerCreationArgs mirrorFromId */
                mirrorFromId?: (number|null);

                /** LayerCreationArgs addToRoot */
                addToRoot?: (boolean|null);

                /** LayerCreationArgs layerStackToMirror */
                layerStackToMirror?: (number|null);
            }

            /** Represents a LayerCreationArgs. */
            class LayerCreationArgs implements ILayerCreationArgs {

                /**
                 * Constructs a new LayerCreationArgs.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.surfaceflinger.proto.ILayerCreationArgs);

                /** LayerCreationArgs layerId. */
                public layerId: number;

                /** LayerCreationArgs name. */
                public name: string;

                /** LayerCreationArgs flags. */
                public flags: number;

                /** LayerCreationArgs parentId. */
                public parentId: number;

                /** LayerCreationArgs mirrorFromId. */
                public mirrorFromId: number;

                /** LayerCreationArgs addToRoot. */
                public addToRoot: boolean;

                /** LayerCreationArgs layerStackToMirror. */
                public layerStackToMirror: number;

                /**
                 * Creates a new LayerCreationArgs instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns LayerCreationArgs instance
                 */
                public static create(properties?: android.surfaceflinger.proto.ILayerCreationArgs): android.surfaceflinger.proto.LayerCreationArgs;

                /**
                 * Encodes the specified LayerCreationArgs message. Does not implicitly {@link android.surfaceflinger.proto.LayerCreationArgs.verify|verify} messages.
                 * @param message LayerCreationArgs message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.surfaceflinger.proto.ILayerCreationArgs, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified LayerCreationArgs message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.LayerCreationArgs.verify|verify} messages.
                 * @param message LayerCreationArgs message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.surfaceflinger.proto.ILayerCreationArgs, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a LayerCreationArgs message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns LayerCreationArgs
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.proto.LayerCreationArgs;

                /**
                 * Decodes a LayerCreationArgs message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns LayerCreationArgs
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.proto.LayerCreationArgs;

                /**
                 * Verifies a LayerCreationArgs message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a LayerCreationArgs message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns LayerCreationArgs
                 */
                public static fromObject(object: { [k: string]: any }): android.surfaceflinger.proto.LayerCreationArgs;

                /**
                 * Creates a plain object from a LayerCreationArgs message. Also converts values to other types if specified.
                 * @param message LayerCreationArgs
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.surfaceflinger.proto.LayerCreationArgs, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this LayerCreationArgs to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for LayerCreationArgs
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Transform. */
            interface ITransform {

                /** Transform dsdx */
                dsdx?: (number|null);

                /** Transform dtdx */
                dtdx?: (number|null);

                /** Transform dtdy */
                dtdy?: (number|null);

                /** Transform dsdy */
                dsdy?: (number|null);

                /** Transform tx */
                tx?: (number|null);

                /** Transform ty */
                ty?: (number|null);
            }

            /** Represents a Transform. */
            class Transform implements ITransform {

                /**
                 * Constructs a new Transform.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.surfaceflinger.proto.ITransform);

                /** Transform dsdx. */
                public dsdx: number;

                /** Transform dtdx. */
                public dtdx: number;

                /** Transform dtdy. */
                public dtdy: number;

                /** Transform dsdy. */
                public dsdy: number;

                /** Transform tx. */
                public tx: number;

                /** Transform ty. */
                public ty: number;

                /**
                 * Creates a new Transform instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Transform instance
                 */
                public static create(properties?: android.surfaceflinger.proto.ITransform): android.surfaceflinger.proto.Transform;

                /**
                 * Encodes the specified Transform message. Does not implicitly {@link android.surfaceflinger.proto.Transform.verify|verify} messages.
                 * @param message Transform message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.surfaceflinger.proto.ITransform, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Transform message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.Transform.verify|verify} messages.
                 * @param message Transform message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.surfaceflinger.proto.ITransform, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Transform message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Transform
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.proto.Transform;

                /**
                 * Decodes a Transform message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Transform
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.proto.Transform;

                /**
                 * Verifies a Transform message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Transform message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Transform
                 */
                public static fromObject(object: { [k: string]: any }): android.surfaceflinger.proto.Transform;

                /**
                 * Creates a plain object from a Transform message. Also converts values to other types if specified.
                 * @param message Transform
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.surfaceflinger.proto.Transform, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Transform to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Transform
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TransactionState. */
            interface ITransactionState {

                /** TransactionState pid */
                pid?: (number|null);

                /** TransactionState uid */
                uid?: (number|null);

                /** TransactionState vsyncId */
                vsyncId?: (Long|null);

                /** TransactionState inputEventId */
                inputEventId?: (number|null);

                /** TransactionState postTime */
                postTime?: (Long|null);

                /** TransactionState transactionId */
                transactionId?: (Long|null);

                /** TransactionState layerChanges */
                layerChanges?: (android.surfaceflinger.proto.ILayerState[]|null);

                /** TransactionState displayChanges */
                displayChanges?: (android.surfaceflinger.proto.IDisplayState[]|null);

                /** TransactionState mergedTransactionIds */
                mergedTransactionIds?: (Long[]|null);
            }

            /** Represents a TransactionState. */
            class TransactionState implements ITransactionState {

                /**
                 * Constructs a new TransactionState.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.surfaceflinger.proto.ITransactionState);

                /** TransactionState pid. */
                public pid: number;

                /** TransactionState uid. */
                public uid: number;

                /** TransactionState vsyncId. */
                public vsyncId: Long;

                /** TransactionState inputEventId. */
                public inputEventId: number;

                /** TransactionState postTime. */
                public postTime: Long;

                /** TransactionState transactionId. */
                public transactionId: Long;

                /** TransactionState layerChanges. */
                public layerChanges: android.surfaceflinger.proto.ILayerState[];

                /** TransactionState displayChanges. */
                public displayChanges: android.surfaceflinger.proto.IDisplayState[];

                /** TransactionState mergedTransactionIds. */
                public mergedTransactionIds: Long[];

                /**
                 * Creates a new TransactionState instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TransactionState instance
                 */
                public static create(properties?: android.surfaceflinger.proto.ITransactionState): android.surfaceflinger.proto.TransactionState;

                /**
                 * Encodes the specified TransactionState message. Does not implicitly {@link android.surfaceflinger.proto.TransactionState.verify|verify} messages.
                 * @param message TransactionState message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.surfaceflinger.proto.ITransactionState, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TransactionState message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.TransactionState.verify|verify} messages.
                 * @param message TransactionState message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.surfaceflinger.proto.ITransactionState, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TransactionState message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TransactionState
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.proto.TransactionState;

                /**
                 * Decodes a TransactionState message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TransactionState
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.proto.TransactionState;

                /**
                 * Verifies a TransactionState message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TransactionState message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TransactionState
                 */
                public static fromObject(object: { [k: string]: any }): android.surfaceflinger.proto.TransactionState;

                /**
                 * Creates a plain object from a TransactionState message. Also converts values to other types if specified.
                 * @param message TransactionState
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.surfaceflinger.proto.TransactionState, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TransactionState to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TransactionState
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a LayerState. */
            interface ILayerState {

                /** LayerState layerId */
                layerId?: (number|null);

                /** LayerState what */
                what?: (Long|null);

                /** LayerState x */
                x?: (number|null);

                /** LayerState y */
                y?: (number|null);

                /** LayerState z */
                z?: (number|null);

                /** LayerState w */
                w?: (number|null);

                /** LayerState h */
                h?: (number|null);

                /** LayerState layerStack */
                layerStack?: (number|null);

                /** LayerState flags */
                flags?: (number|null);

                /** LayerState mask */
                mask?: (number|null);

                /** LayerState matrix */
                matrix?: (android.surfaceflinger.proto.LayerState.IMatrix22|null);

                /** LayerState cornerRadius */
                cornerRadius?: (number|null);

                /** LayerState backgroundBlurRadius */
                backgroundBlurRadius?: (number|null);

                /** LayerState parentId */
                parentId?: (number|null);

                /** LayerState relativeParentId */
                relativeParentId?: (number|null);

                /** LayerState alpha */
                alpha?: (number|null);

                /** LayerState color */
                color?: (android.surfaceflinger.proto.LayerState.IColor3|null);

                /** LayerState transparentRegion */
                transparentRegion?: (android.surfaceflinger.IRegionProto|null);

                /** LayerState transform */
                transform?: (number|null);

                /** LayerState transformToDisplayInverse */
                transformToDisplayInverse?: (boolean|null);

                /** LayerState crop */
                crop?: (android.surfaceflinger.IRectProto|null);

                /** LayerState bufferData */
                bufferData?: (android.surfaceflinger.proto.LayerState.IBufferData|null);

                /** LayerState api */
                api?: (number|null);

                /** LayerState hasSidebandStream */
                hasSidebandStream?: (boolean|null);

                /** LayerState colorTransform */
                colorTransform?: (android.surfaceflinger.IColorTransformProto|null);

                /** LayerState blurRegions */
                blurRegions?: (android.surfaceflinger.IBlurRegion[]|null);

                /** LayerState windowInfoHandle */
                windowInfoHandle?: (android.surfaceflinger.proto.LayerState.IWindowInfo|null);

                /** LayerState bgColorAlpha */
                bgColorAlpha?: (number|null);

                /** LayerState bgColorDataspace */
                bgColorDataspace?: (number|null);

                /** LayerState colorSpaceAgnostic */
                colorSpaceAgnostic?: (boolean|null);

                /** LayerState shadowRadius */
                shadowRadius?: (number|null);

                /** LayerState frameRateSelectionPriority */
                frameRateSelectionPriority?: (number|null);

                /** LayerState frameRate */
                frameRate?: (number|null);

                /** LayerState frameRateCompatibility */
                frameRateCompatibility?: (number|null);

                /** LayerState changeFrameRateStrategy */
                changeFrameRateStrategy?: (number|null);

                /** LayerState fixedTransformHint */
                fixedTransformHint?: (number|null);

                /** LayerState frameNumber */
                frameNumber?: (Long|null);

                /** LayerState autoRefresh */
                autoRefresh?: (boolean|null);

                /** LayerState isTrustedOverlay */
                isTrustedOverlay?: (boolean|null);

                /** LayerState bufferCrop */
                bufferCrop?: (android.surfaceflinger.IRectProto|null);

                /** LayerState destinationFrame */
                destinationFrame?: (android.surfaceflinger.IRectProto|null);

                /** LayerState dropInputMode */
                dropInputMode?: (android.surfaceflinger.proto.LayerState.DropInputMode|null);
            }

            /** Represents a LayerState. */
            class LayerState implements ILayerState {

                /**
                 * Constructs a new LayerState.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.surfaceflinger.proto.ILayerState);

                /** LayerState layerId. */
                public layerId: number;

                /** LayerState what. */
                public what: Long;

                /** LayerState x. */
                public x: number;

                /** LayerState y. */
                public y: number;

                /** LayerState z. */
                public z: number;

                /** LayerState w. */
                public w: number;

                /** LayerState h. */
                public h: number;

                /** LayerState layerStack. */
                public layerStack: number;

                /** LayerState flags. */
                public flags: number;

                /** LayerState mask. */
                public mask: number;

                /** LayerState matrix. */
                public matrix?: (android.surfaceflinger.proto.LayerState.IMatrix22|null);

                /** LayerState cornerRadius. */
                public cornerRadius: number;

                /** LayerState backgroundBlurRadius. */
                public backgroundBlurRadius: number;

                /** LayerState parentId. */
                public parentId: number;

                /** LayerState relativeParentId. */
                public relativeParentId: number;

                /** LayerState alpha. */
                public alpha: number;

                /** LayerState color. */
                public color?: (android.surfaceflinger.proto.LayerState.IColor3|null);

                /** LayerState transparentRegion. */
                public transparentRegion?: (android.surfaceflinger.IRegionProto|null);

                /** LayerState transform. */
                public transform: number;

                /** LayerState transformToDisplayInverse. */
                public transformToDisplayInverse: boolean;

                /** LayerState crop. */
                public crop?: (android.surfaceflinger.IRectProto|null);

                /** LayerState bufferData. */
                public bufferData?: (android.surfaceflinger.proto.LayerState.IBufferData|null);

                /** LayerState api. */
                public api: number;

                /** LayerState hasSidebandStream. */
                public hasSidebandStream: boolean;

                /** LayerState colorTransform. */
                public colorTransform?: (android.surfaceflinger.IColorTransformProto|null);

                /** LayerState blurRegions. */
                public blurRegions: android.surfaceflinger.IBlurRegion[];

                /** LayerState windowInfoHandle. */
                public windowInfoHandle?: (android.surfaceflinger.proto.LayerState.IWindowInfo|null);

                /** LayerState bgColorAlpha. */
                public bgColorAlpha: number;

                /** LayerState bgColorDataspace. */
                public bgColorDataspace: number;

                /** LayerState colorSpaceAgnostic. */
                public colorSpaceAgnostic: boolean;

                /** LayerState shadowRadius. */
                public shadowRadius: number;

                /** LayerState frameRateSelectionPriority. */
                public frameRateSelectionPriority: number;

                /** LayerState frameRate. */
                public frameRate: number;

                /** LayerState frameRateCompatibility. */
                public frameRateCompatibility: number;

                /** LayerState changeFrameRateStrategy. */
                public changeFrameRateStrategy: number;

                /** LayerState fixedTransformHint. */
                public fixedTransformHint: number;

                /** LayerState frameNumber. */
                public frameNumber: Long;

                /** LayerState autoRefresh. */
                public autoRefresh: boolean;

                /** LayerState isTrustedOverlay. */
                public isTrustedOverlay: boolean;

                /** LayerState bufferCrop. */
                public bufferCrop?: (android.surfaceflinger.IRectProto|null);

                /** LayerState destinationFrame. */
                public destinationFrame?: (android.surfaceflinger.IRectProto|null);

                /** LayerState dropInputMode. */
                public dropInputMode: android.surfaceflinger.proto.LayerState.DropInputMode;

                /**
                 * Creates a new LayerState instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns LayerState instance
                 */
                public static create(properties?: android.surfaceflinger.proto.ILayerState): android.surfaceflinger.proto.LayerState;

                /**
                 * Encodes the specified LayerState message. Does not implicitly {@link android.surfaceflinger.proto.LayerState.verify|verify} messages.
                 * @param message LayerState message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.surfaceflinger.proto.ILayerState, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified LayerState message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.LayerState.verify|verify} messages.
                 * @param message LayerState message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.surfaceflinger.proto.ILayerState, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a LayerState message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns LayerState
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.proto.LayerState;

                /**
                 * Decodes a LayerState message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns LayerState
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.proto.LayerState;

                /**
                 * Verifies a LayerState message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a LayerState message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns LayerState
                 */
                public static fromObject(object: { [k: string]: any }): android.surfaceflinger.proto.LayerState;

                /**
                 * Creates a plain object from a LayerState message. Also converts values to other types if specified.
                 * @param message LayerState
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.surfaceflinger.proto.LayerState, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this LayerState to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for LayerState
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace LayerState {

                /** ChangesLsb enum. */
                enum ChangesLsb {
                    eChangesLsbNone = 0,
                    ePositionChanged = 1,
                    eLayerChanged = 2,
                    eAlphaChanged = 8,
                    eMatrixChanged = 16,
                    eTransparentRegionChanged = 32,
                    eFlagsChanged = 64,
                    eLayerStackChanged = 128,
                    eReleaseBufferListenerChanged = 1024,
                    eShadowRadiusChanged = 2048,
                    eBufferCropChanged = 8192,
                    eRelativeLayerChanged = 16384,
                    eReparent = 32768,
                    eColorChanged = 65536,
                    eBufferTransformChanged = 262144,
                    eTransformToDisplayInverseChanged = 524288,
                    eCropChanged = 1048576,
                    eBufferChanged = 2097152,
                    eAcquireFenceChanged = 4194304,
                    eDataspaceChanged = 8388608,
                    eHdrMetadataChanged = 16777216,
                    eSurfaceDamageRegionChanged = 33554432,
                    eApiChanged = 67108864,
                    eSidebandStreamChanged = 134217728,
                    eColorTransformChanged = 268435456,
                    eHasListenerCallbacksChanged = 536870912,
                    eInputInfoChanged = 1073741824,
                    eCornerRadiusChanged = -2147483648
                }

                /** ChangesMsb enum. */
                enum ChangesMsb {
                    eChangesMsbNone = 0,
                    eDestinationFrameChanged = 1,
                    eCachedBufferChanged = 2,
                    eBackgroundColorChanged = 4,
                    eMetadataChanged = 8,
                    eColorSpaceAgnosticChanged = 16,
                    eFrameRateSelectionPriority = 32,
                    eFrameRateChanged = 64,
                    eBackgroundBlurRadiusChanged = 128,
                    eProducerDisconnect = 256,
                    eFixedTransformHintChanged = 512,
                    eFrameNumberChanged = 1024,
                    eBlurRegionsChanged = 2048,
                    eAutoRefreshChanged = 4096,
                    eStretchChanged = 8192,
                    eTrustedOverlayChanged = 16384,
                    eDropInputModeChanged = 32768
                }

                /** Flags enum. */
                enum Flags {
                    eFlagsNone = 0,
                    eLayerHidden = 1,
                    eLayerOpaque = 2,
                    eLayerSkipScreenshot = 64,
                    eLayerSecure = 128,
                    eEnableBackpressure = 256,
                    eLayerIsDisplayDecoration = 512
                }

                /** Properties of a Matrix22. */
                interface IMatrix22 {

                    /** Matrix22 dsdx */
                    dsdx?: (number|null);

                    /** Matrix22 dtdx */
                    dtdx?: (number|null);

                    /** Matrix22 dtdy */
                    dtdy?: (number|null);

                    /** Matrix22 dsdy */
                    dsdy?: (number|null);
                }

                /** Represents a Matrix22. */
                class Matrix22 implements IMatrix22 {

                    /**
                     * Constructs a new Matrix22.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: android.surfaceflinger.proto.LayerState.IMatrix22);

                    /** Matrix22 dsdx. */
                    public dsdx: number;

                    /** Matrix22 dtdx. */
                    public dtdx: number;

                    /** Matrix22 dtdy. */
                    public dtdy: number;

                    /** Matrix22 dsdy. */
                    public dsdy: number;

                    /**
                     * Creates a new Matrix22 instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Matrix22 instance
                     */
                    public static create(properties?: android.surfaceflinger.proto.LayerState.IMatrix22): android.surfaceflinger.proto.LayerState.Matrix22;

                    /**
                     * Encodes the specified Matrix22 message. Does not implicitly {@link android.surfaceflinger.proto.LayerState.Matrix22.verify|verify} messages.
                     * @param message Matrix22 message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: android.surfaceflinger.proto.LayerState.IMatrix22, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Matrix22 message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.LayerState.Matrix22.verify|verify} messages.
                     * @param message Matrix22 message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: android.surfaceflinger.proto.LayerState.IMatrix22, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Matrix22 message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Matrix22
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.proto.LayerState.Matrix22;

                    /**
                     * Decodes a Matrix22 message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Matrix22
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.proto.LayerState.Matrix22;

                    /**
                     * Verifies a Matrix22 message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Matrix22 message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Matrix22
                     */
                    public static fromObject(object: { [k: string]: any }): android.surfaceflinger.proto.LayerState.Matrix22;

                    /**
                     * Creates a plain object from a Matrix22 message. Also converts values to other types if specified.
                     * @param message Matrix22
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: android.surfaceflinger.proto.LayerState.Matrix22, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Matrix22 to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for Matrix22
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a Color3. */
                interface IColor3 {

                    /** Color3 r */
                    r?: (number|null);

                    /** Color3 g */
                    g?: (number|null);

                    /** Color3 b */
                    b?: (number|null);
                }

                /** Represents a Color3. */
                class Color3 implements IColor3 {

                    /**
                     * Constructs a new Color3.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: android.surfaceflinger.proto.LayerState.IColor3);

                    /** Color3 r. */
                    public r: number;

                    /** Color3 g. */
                    public g: number;

                    /** Color3 b. */
                    public b: number;

                    /**
                     * Creates a new Color3 instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Color3 instance
                     */
                    public static create(properties?: android.surfaceflinger.proto.LayerState.IColor3): android.surfaceflinger.proto.LayerState.Color3;

                    /**
                     * Encodes the specified Color3 message. Does not implicitly {@link android.surfaceflinger.proto.LayerState.Color3.verify|verify} messages.
                     * @param message Color3 message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: android.surfaceflinger.proto.LayerState.IColor3, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Color3 message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.LayerState.Color3.verify|verify} messages.
                     * @param message Color3 message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: android.surfaceflinger.proto.LayerState.IColor3, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Color3 message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Color3
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.proto.LayerState.Color3;

                    /**
                     * Decodes a Color3 message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Color3
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.proto.LayerState.Color3;

                    /**
                     * Verifies a Color3 message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Color3 message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Color3
                     */
                    public static fromObject(object: { [k: string]: any }): android.surfaceflinger.proto.LayerState.Color3;

                    /**
                     * Creates a plain object from a Color3 message. Also converts values to other types if specified.
                     * @param message Color3
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: android.surfaceflinger.proto.LayerState.Color3, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Color3 to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for Color3
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BufferData. */
                interface IBufferData {

                    /** BufferData bufferId */
                    bufferId?: (Long|null);

                    /** BufferData width */
                    width?: (number|null);

                    /** BufferData height */
                    height?: (number|null);

                    /** BufferData frameNumber */
                    frameNumber?: (Long|null);

                    /** BufferData flags */
                    flags?: (number|null);

                    /** BufferData cachedBufferId */
                    cachedBufferId?: (Long|null);

                    /** BufferData pixelFormat */
                    pixelFormat?: (android.surfaceflinger.proto.LayerState.BufferData.PixelFormat|null);

                    /** BufferData usage */
                    usage?: (Long|null);
                }

                /** Represents a BufferData. */
                class BufferData implements IBufferData {

                    /**
                     * Constructs a new BufferData.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: android.surfaceflinger.proto.LayerState.IBufferData);

                    /** BufferData bufferId. */
                    public bufferId: Long;

                    /** BufferData width. */
                    public width: number;

                    /** BufferData height. */
                    public height: number;

                    /** BufferData frameNumber. */
                    public frameNumber: Long;

                    /** BufferData flags. */
                    public flags: number;

                    /** BufferData cachedBufferId. */
                    public cachedBufferId: Long;

                    /** BufferData pixelFormat. */
                    public pixelFormat: android.surfaceflinger.proto.LayerState.BufferData.PixelFormat;

                    /** BufferData usage. */
                    public usage: Long;

                    /**
                     * Creates a new BufferData instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BufferData instance
                     */
                    public static create(properties?: android.surfaceflinger.proto.LayerState.IBufferData): android.surfaceflinger.proto.LayerState.BufferData;

                    /**
                     * Encodes the specified BufferData message. Does not implicitly {@link android.surfaceflinger.proto.LayerState.BufferData.verify|verify} messages.
                     * @param message BufferData message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: android.surfaceflinger.proto.LayerState.IBufferData, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BufferData message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.LayerState.BufferData.verify|verify} messages.
                     * @param message BufferData message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: android.surfaceflinger.proto.LayerState.IBufferData, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BufferData message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BufferData
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.proto.LayerState.BufferData;

                    /**
                     * Decodes a BufferData message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BufferData
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.proto.LayerState.BufferData;

                    /**
                     * Verifies a BufferData message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BufferData message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BufferData
                     */
                    public static fromObject(object: { [k: string]: any }): android.surfaceflinger.proto.LayerState.BufferData;

                    /**
                     * Creates a plain object from a BufferData message. Also converts values to other types if specified.
                     * @param message BufferData
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: android.surfaceflinger.proto.LayerState.BufferData, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BufferData to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BufferData
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                namespace BufferData {

                    /** BufferDataChange enum. */
                    enum BufferDataChange {
                        BufferDataChangeNone = 0,
                        fenceChanged = 1,
                        frameNumberChanged = 2,
                        cachedBufferChanged = 4
                    }

                    /** PixelFormat enum. */
                    enum PixelFormat {
                        PIXEL_FORMAT_UNKNOWN = 0,
                        PIXEL_FORMAT_CUSTOM = -4,
                        PIXEL_FORMAT_TRANSLUCENT = -3,
                        PIXEL_FORMAT_TRANSPARENT = -2,
                        PIXEL_FORMAT_OPAQUE = -1,
                        PIXEL_FORMAT_RGBA_8888 = 1,
                        PIXEL_FORMAT_RGBX_8888 = 2,
                        PIXEL_FORMAT_RGB_888 = 3,
                        PIXEL_FORMAT_RGB_565 = 4,
                        PIXEL_FORMAT_BGRA_8888 = 5,
                        PIXEL_FORMAT_RGBA_5551 = 6,
                        PIXEL_FORMAT_RGBA_4444 = 7,
                        PIXEL_FORMAT_RGBA_FP16 = 22,
                        PIXEL_FORMAT_RGBA_1010102 = 43,
                        PIXEL_FORMAT_R_8 = 56
                    }
                }

                /** Properties of a WindowInfo. */
                interface IWindowInfo {

                    /** WindowInfo layoutParamsFlags */
                    layoutParamsFlags?: (number|null);

                    /** WindowInfo layoutParamsType */
                    layoutParamsType?: (number|null);

                    /** WindowInfo touchableRegion */
                    touchableRegion?: (android.surfaceflinger.IRegionProto|null);

                    /** WindowInfo surfaceInset */
                    surfaceInset?: (number|null);

                    /** WindowInfo focusable */
                    focusable?: (boolean|null);

                    /** WindowInfo hasWallpaper */
                    hasWallpaper?: (boolean|null);

                    /** WindowInfo globalScaleFactor */
                    globalScaleFactor?: (number|null);

                    /** WindowInfo cropLayerId */
                    cropLayerId?: (number|null);

                    /** WindowInfo replaceTouchableRegionWithCrop */
                    replaceTouchableRegionWithCrop?: (boolean|null);

                    /** WindowInfo touchableRegionCrop */
                    touchableRegionCrop?: (android.surfaceflinger.IRectProto|null);

                    /** WindowInfo transform */
                    transform?: (android.surfaceflinger.proto.ITransform|null);
                }

                /** Represents a WindowInfo. */
                class WindowInfo implements IWindowInfo {

                    /**
                     * Constructs a new WindowInfo.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: android.surfaceflinger.proto.LayerState.IWindowInfo);

                    /** WindowInfo layoutParamsFlags. */
                    public layoutParamsFlags: number;

                    /** WindowInfo layoutParamsType. */
                    public layoutParamsType: number;

                    /** WindowInfo touchableRegion. */
                    public touchableRegion?: (android.surfaceflinger.IRegionProto|null);

                    /** WindowInfo surfaceInset. */
                    public surfaceInset: number;

                    /** WindowInfo focusable. */
                    public focusable: boolean;

                    /** WindowInfo hasWallpaper. */
                    public hasWallpaper: boolean;

                    /** WindowInfo globalScaleFactor. */
                    public globalScaleFactor: number;

                    /** WindowInfo cropLayerId. */
                    public cropLayerId: number;

                    /** WindowInfo replaceTouchableRegionWithCrop. */
                    public replaceTouchableRegionWithCrop: boolean;

                    /** WindowInfo touchableRegionCrop. */
                    public touchableRegionCrop?: (android.surfaceflinger.IRectProto|null);

                    /** WindowInfo transform. */
                    public transform?: (android.surfaceflinger.proto.ITransform|null);

                    /**
                     * Creates a new WindowInfo instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns WindowInfo instance
                     */
                    public static create(properties?: android.surfaceflinger.proto.LayerState.IWindowInfo): android.surfaceflinger.proto.LayerState.WindowInfo;

                    /**
                     * Encodes the specified WindowInfo message. Does not implicitly {@link android.surfaceflinger.proto.LayerState.WindowInfo.verify|verify} messages.
                     * @param message WindowInfo message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: android.surfaceflinger.proto.LayerState.IWindowInfo, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified WindowInfo message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.LayerState.WindowInfo.verify|verify} messages.
                     * @param message WindowInfo message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: android.surfaceflinger.proto.LayerState.IWindowInfo, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a WindowInfo message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns WindowInfo
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.proto.LayerState.WindowInfo;

                    /**
                     * Decodes a WindowInfo message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns WindowInfo
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.proto.LayerState.WindowInfo;

                    /**
                     * Verifies a WindowInfo message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a WindowInfo message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns WindowInfo
                     */
                    public static fromObject(object: { [k: string]: any }): android.surfaceflinger.proto.LayerState.WindowInfo;

                    /**
                     * Creates a plain object from a WindowInfo message. Also converts values to other types if specified.
                     * @param message WindowInfo
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: android.surfaceflinger.proto.LayerState.WindowInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this WindowInfo to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for WindowInfo
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** DropInputMode enum. */
                enum DropInputMode {
                    NONE = 0,
                    ALL = 1,
                    OBSCURED = 2
                }
            }

            /** Properties of a DisplayState. */
            interface IDisplayState {

                /** DisplayState id */
                id?: (number|null);

                /** DisplayState what */
                what?: (number|null);

                /** DisplayState flags */
                flags?: (number|null);

                /** DisplayState layerStack */
                layerStack?: (number|null);

                /** DisplayState orientation */
                orientation?: (number|null);

                /** DisplayState layerStackSpaceRect */
                layerStackSpaceRect?: (android.surfaceflinger.IRectProto|null);

                /** DisplayState orientedDisplaySpaceRect */
                orientedDisplaySpaceRect?: (android.surfaceflinger.IRectProto|null);

                /** DisplayState width */
                width?: (number|null);

                /** DisplayState height */
                height?: (number|null);
            }

            /** Represents a DisplayState. */
            class DisplayState implements IDisplayState {

                /**
                 * Constructs a new DisplayState.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.surfaceflinger.proto.IDisplayState);

                /** DisplayState id. */
                public id: number;

                /** DisplayState what. */
                public what: number;

                /** DisplayState flags. */
                public flags: number;

                /** DisplayState layerStack. */
                public layerStack: number;

                /** DisplayState orientation. */
                public orientation: number;

                /** DisplayState layerStackSpaceRect. */
                public layerStackSpaceRect?: (android.surfaceflinger.IRectProto|null);

                /** DisplayState orientedDisplaySpaceRect. */
                public orientedDisplaySpaceRect?: (android.surfaceflinger.IRectProto|null);

                /** DisplayState width. */
                public width: number;

                /** DisplayState height. */
                public height: number;

                /**
                 * Creates a new DisplayState instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DisplayState instance
                 */
                public static create(properties?: android.surfaceflinger.proto.IDisplayState): android.surfaceflinger.proto.DisplayState;

                /**
                 * Encodes the specified DisplayState message. Does not implicitly {@link android.surfaceflinger.proto.DisplayState.verify|verify} messages.
                 * @param message DisplayState message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.surfaceflinger.proto.IDisplayState, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DisplayState message, length delimited. Does not implicitly {@link android.surfaceflinger.proto.DisplayState.verify|verify} messages.
                 * @param message DisplayState message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.surfaceflinger.proto.IDisplayState, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DisplayState message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DisplayState
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.proto.DisplayState;

                /**
                 * Decodes a DisplayState message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DisplayState
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.proto.DisplayState;

                /**
                 * Verifies a DisplayState message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DisplayState message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DisplayState
                 */
                public static fromObject(object: { [k: string]: any }): android.surfaceflinger.proto.DisplayState;

                /**
                 * Creates a plain object from a DisplayState message. Also converts values to other types if specified.
                 * @param message DisplayState
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.surfaceflinger.proto.DisplayState, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DisplayState to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for DisplayState
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace DisplayState {

                /** Changes enum. */
                enum Changes {
                    eChangesNone = 0,
                    eSurfaceChanged = 1,
                    eLayerStackChanged = 2,
                    eDisplayProjectionChanged = 4,
                    eDisplaySizeChanged = 8,
                    eFlagsChanged = 16
                }
            }
        }

        /** Properties of a RegionProto. */
        interface IRegionProto {

            /** RegionProto rect */
            rect?: (android.surfaceflinger.IRectProto[]|null);
        }

        /** Represents a RegionProto. */
        class RegionProto implements IRegionProto {

            /**
             * Constructs a new RegionProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.surfaceflinger.IRegionProto);

            /** RegionProto rect. */
            public rect: android.surfaceflinger.IRectProto[];

            /**
             * Creates a new RegionProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RegionProto instance
             */
            public static create(properties?: android.surfaceflinger.IRegionProto): android.surfaceflinger.RegionProto;

            /**
             * Encodes the specified RegionProto message. Does not implicitly {@link android.surfaceflinger.RegionProto.verify|verify} messages.
             * @param message RegionProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.surfaceflinger.IRegionProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RegionProto message, length delimited. Does not implicitly {@link android.surfaceflinger.RegionProto.verify|verify} messages.
             * @param message RegionProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.surfaceflinger.IRegionProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RegionProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RegionProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.RegionProto;

            /**
             * Decodes a RegionProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RegionProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.RegionProto;

            /**
             * Verifies a RegionProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RegionProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RegionProto
             */
            public static fromObject(object: { [k: string]: any }): android.surfaceflinger.RegionProto;

            /**
             * Creates a plain object from a RegionProto message. Also converts values to other types if specified.
             * @param message RegionProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.surfaceflinger.RegionProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this RegionProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for RegionProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a RectProto. */
        interface IRectProto {

            /** RectProto left */
            left?: (number|null);

            /** RectProto top */
            top?: (number|null);

            /** RectProto right */
            right?: (number|null);

            /** RectProto bottom */
            bottom?: (number|null);
        }

        /** Represents a RectProto. */
        class RectProto implements IRectProto {

            /**
             * Constructs a new RectProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.surfaceflinger.IRectProto);

            /** RectProto left. */
            public left: number;

            /** RectProto top. */
            public top: number;

            /** RectProto right. */
            public right: number;

            /** RectProto bottom. */
            public bottom: number;

            /**
             * Creates a new RectProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RectProto instance
             */
            public static create(properties?: android.surfaceflinger.IRectProto): android.surfaceflinger.RectProto;

            /**
             * Encodes the specified RectProto message. Does not implicitly {@link android.surfaceflinger.RectProto.verify|verify} messages.
             * @param message RectProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.surfaceflinger.IRectProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RectProto message, length delimited. Does not implicitly {@link android.surfaceflinger.RectProto.verify|verify} messages.
             * @param message RectProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.surfaceflinger.IRectProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RectProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RectProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.RectProto;

            /**
             * Decodes a RectProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RectProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.RectProto;

            /**
             * Verifies a RectProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RectProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RectProto
             */
            public static fromObject(object: { [k: string]: any }): android.surfaceflinger.RectProto;

            /**
             * Creates a plain object from a RectProto message. Also converts values to other types if specified.
             * @param message RectProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.surfaceflinger.RectProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this RectProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for RectProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SizeProto. */
        interface ISizeProto {

            /** SizeProto w */
            w?: (number|null);

            /** SizeProto h */
            h?: (number|null);
        }

        /** Represents a SizeProto. */
        class SizeProto implements ISizeProto {

            /**
             * Constructs a new SizeProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.surfaceflinger.ISizeProto);

            /** SizeProto w. */
            public w: number;

            /** SizeProto h. */
            public h: number;

            /**
             * Creates a new SizeProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SizeProto instance
             */
            public static create(properties?: android.surfaceflinger.ISizeProto): android.surfaceflinger.SizeProto;

            /**
             * Encodes the specified SizeProto message. Does not implicitly {@link android.surfaceflinger.SizeProto.verify|verify} messages.
             * @param message SizeProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.surfaceflinger.ISizeProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SizeProto message, length delimited. Does not implicitly {@link android.surfaceflinger.SizeProto.verify|verify} messages.
             * @param message SizeProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.surfaceflinger.ISizeProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SizeProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SizeProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.SizeProto;

            /**
             * Decodes a SizeProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SizeProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.SizeProto;

            /**
             * Verifies a SizeProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SizeProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SizeProto
             */
            public static fromObject(object: { [k: string]: any }): android.surfaceflinger.SizeProto;

            /**
             * Creates a plain object from a SizeProto message. Also converts values to other types if specified.
             * @param message SizeProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.surfaceflinger.SizeProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SizeProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SizeProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a TransformProto. */
        interface ITransformProto {

            /** TransformProto dsdx */
            dsdx?: (number|null);

            /** TransformProto dtdx */
            dtdx?: (number|null);

            /** TransformProto dsdy */
            dsdy?: (number|null);

            /** TransformProto dtdy */
            dtdy?: (number|null);

            /** TransformProto type */
            type?: (number|null);
        }

        /** Represents a TransformProto. */
        class TransformProto implements ITransformProto {

            /**
             * Constructs a new TransformProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.surfaceflinger.ITransformProto);

            /** TransformProto dsdx. */
            public dsdx: number;

            /** TransformProto dtdx. */
            public dtdx: number;

            /** TransformProto dsdy. */
            public dsdy: number;

            /** TransformProto dtdy. */
            public dtdy: number;

            /** TransformProto type. */
            public type: number;

            /**
             * Creates a new TransformProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns TransformProto instance
             */
            public static create(properties?: android.surfaceflinger.ITransformProto): android.surfaceflinger.TransformProto;

            /**
             * Encodes the specified TransformProto message. Does not implicitly {@link android.surfaceflinger.TransformProto.verify|verify} messages.
             * @param message TransformProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.surfaceflinger.ITransformProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified TransformProto message, length delimited. Does not implicitly {@link android.surfaceflinger.TransformProto.verify|verify} messages.
             * @param message TransformProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.surfaceflinger.ITransformProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a TransformProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns TransformProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.TransformProto;

            /**
             * Decodes a TransformProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns TransformProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.TransformProto;

            /**
             * Verifies a TransformProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a TransformProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns TransformProto
             */
            public static fromObject(object: { [k: string]: any }): android.surfaceflinger.TransformProto;

            /**
             * Creates a plain object from a TransformProto message. Also converts values to other types if specified.
             * @param message TransformProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.surfaceflinger.TransformProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this TransformProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for TransformProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ColorProto. */
        interface IColorProto {

            /** ColorProto r */
            r?: (number|null);

            /** ColorProto g */
            g?: (number|null);

            /** ColorProto b */
            b?: (number|null);

            /** ColorProto a */
            a?: (number|null);
        }

        /** Represents a ColorProto. */
        class ColorProto implements IColorProto {

            /**
             * Constructs a new ColorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.surfaceflinger.IColorProto);

            /** ColorProto r. */
            public r: number;

            /** ColorProto g. */
            public g: number;

            /** ColorProto b. */
            public b: number;

            /** ColorProto a. */
            public a: number;

            /**
             * Creates a new ColorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ColorProto instance
             */
            public static create(properties?: android.surfaceflinger.IColorProto): android.surfaceflinger.ColorProto;

            /**
             * Encodes the specified ColorProto message. Does not implicitly {@link android.surfaceflinger.ColorProto.verify|verify} messages.
             * @param message ColorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.surfaceflinger.IColorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ColorProto message, length delimited. Does not implicitly {@link android.surfaceflinger.ColorProto.verify|verify} messages.
             * @param message ColorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.surfaceflinger.IColorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ColorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ColorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.ColorProto;

            /**
             * Decodes a ColorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ColorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.ColorProto;

            /**
             * Verifies a ColorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ColorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ColorProto
             */
            public static fromObject(object: { [k: string]: any }): android.surfaceflinger.ColorProto;

            /**
             * Creates a plain object from a ColorProto message. Also converts values to other types if specified.
             * @param message ColorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.surfaceflinger.ColorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ColorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ColorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an InputWindowInfoProto. */
        interface IInputWindowInfoProto {

            /** InputWindowInfoProto layoutParamsFlags */
            layoutParamsFlags?: (number|null);

            /** InputWindowInfoProto layoutParamsType */
            layoutParamsType?: (number|null);

            /** InputWindowInfoProto frame */
            frame?: (android.surfaceflinger.IRectProto|null);

            /** InputWindowInfoProto touchableRegion */
            touchableRegion?: (android.surfaceflinger.IRegionProto|null);

            /** InputWindowInfoProto surfaceInset */
            surfaceInset?: (number|null);

            /** InputWindowInfoProto visible */
            visible?: (boolean|null);

            /** InputWindowInfoProto canReceiveKeys */
            canReceiveKeys?: (boolean|null);

            /** InputWindowInfoProto focusable */
            focusable?: (boolean|null);

            /** InputWindowInfoProto hasWallpaper */
            hasWallpaper?: (boolean|null);

            /** InputWindowInfoProto globalScaleFactor */
            globalScaleFactor?: (number|null);

            /** InputWindowInfoProto windowXScale */
            windowXScale?: (number|null);

            /** InputWindowInfoProto windowYScale */
            windowYScale?: (number|null);

            /** InputWindowInfoProto cropLayerId */
            cropLayerId?: (number|null);

            /** InputWindowInfoProto replaceTouchableRegionWithCrop */
            replaceTouchableRegionWithCrop?: (boolean|null);

            /** InputWindowInfoProto touchableRegionCrop */
            touchableRegionCrop?: (android.surfaceflinger.IRectProto|null);

            /** InputWindowInfoProto transform */
            transform?: (android.surfaceflinger.ITransformProto|null);
        }

        /** Represents an InputWindowInfoProto. */
        class InputWindowInfoProto implements IInputWindowInfoProto {

            /**
             * Constructs a new InputWindowInfoProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.surfaceflinger.IInputWindowInfoProto);

            /** InputWindowInfoProto layoutParamsFlags. */
            public layoutParamsFlags: number;

            /** InputWindowInfoProto layoutParamsType. */
            public layoutParamsType: number;

            /** InputWindowInfoProto frame. */
            public frame?: (android.surfaceflinger.IRectProto|null);

            /** InputWindowInfoProto touchableRegion. */
            public touchableRegion?: (android.surfaceflinger.IRegionProto|null);

            /** InputWindowInfoProto surfaceInset. */
            public surfaceInset: number;

            /** InputWindowInfoProto visible. */
            public visible: boolean;

            /** InputWindowInfoProto canReceiveKeys. */
            public canReceiveKeys: boolean;

            /** InputWindowInfoProto focusable. */
            public focusable: boolean;

            /** InputWindowInfoProto hasWallpaper. */
            public hasWallpaper: boolean;

            /** InputWindowInfoProto globalScaleFactor. */
            public globalScaleFactor: number;

            /** InputWindowInfoProto windowXScale. */
            public windowXScale: number;

            /** InputWindowInfoProto windowYScale. */
            public windowYScale: number;

            /** InputWindowInfoProto cropLayerId. */
            public cropLayerId: number;

            /** InputWindowInfoProto replaceTouchableRegionWithCrop. */
            public replaceTouchableRegionWithCrop: boolean;

            /** InputWindowInfoProto touchableRegionCrop. */
            public touchableRegionCrop?: (android.surfaceflinger.IRectProto|null);

            /** InputWindowInfoProto transform. */
            public transform?: (android.surfaceflinger.ITransformProto|null);

            /**
             * Creates a new InputWindowInfoProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InputWindowInfoProto instance
             */
            public static create(properties?: android.surfaceflinger.IInputWindowInfoProto): android.surfaceflinger.InputWindowInfoProto;

            /**
             * Encodes the specified InputWindowInfoProto message. Does not implicitly {@link android.surfaceflinger.InputWindowInfoProto.verify|verify} messages.
             * @param message InputWindowInfoProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.surfaceflinger.IInputWindowInfoProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InputWindowInfoProto message, length delimited. Does not implicitly {@link android.surfaceflinger.InputWindowInfoProto.verify|verify} messages.
             * @param message InputWindowInfoProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.surfaceflinger.IInputWindowInfoProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InputWindowInfoProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InputWindowInfoProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.InputWindowInfoProto;

            /**
             * Decodes an InputWindowInfoProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InputWindowInfoProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.InputWindowInfoProto;

            /**
             * Verifies an InputWindowInfoProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an InputWindowInfoProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InputWindowInfoProto
             */
            public static fromObject(object: { [k: string]: any }): android.surfaceflinger.InputWindowInfoProto;

            /**
             * Creates a plain object from an InputWindowInfoProto message. Also converts values to other types if specified.
             * @param message InputWindowInfoProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.surfaceflinger.InputWindowInfoProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InputWindowInfoProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for InputWindowInfoProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a BlurRegion. */
        interface IBlurRegion {

            /** BlurRegion blurRadius */
            blurRadius?: (number|null);

            /** BlurRegion cornerRadiusTl */
            cornerRadiusTl?: (number|null);

            /** BlurRegion cornerRadiusTr */
            cornerRadiusTr?: (number|null);

            /** BlurRegion cornerRadiusBl */
            cornerRadiusBl?: (number|null);

            /** BlurRegion cornerRadiusBr */
            cornerRadiusBr?: (number|null);

            /** BlurRegion alpha */
            alpha?: (number|null);

            /** BlurRegion left */
            left?: (number|null);

            /** BlurRegion top */
            top?: (number|null);

            /** BlurRegion right */
            right?: (number|null);

            /** BlurRegion bottom */
            bottom?: (number|null);
        }

        /** Represents a BlurRegion. */
        class BlurRegion implements IBlurRegion {

            /**
             * Constructs a new BlurRegion.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.surfaceflinger.IBlurRegion);

            /** BlurRegion blurRadius. */
            public blurRadius: number;

            /** BlurRegion cornerRadiusTl. */
            public cornerRadiusTl: number;

            /** BlurRegion cornerRadiusTr. */
            public cornerRadiusTr: number;

            /** BlurRegion cornerRadiusBl. */
            public cornerRadiusBl: number;

            /** BlurRegion cornerRadiusBr. */
            public cornerRadiusBr: number;

            /** BlurRegion alpha. */
            public alpha: number;

            /** BlurRegion left. */
            public left: number;

            /** BlurRegion top. */
            public top: number;

            /** BlurRegion right. */
            public right: number;

            /** BlurRegion bottom. */
            public bottom: number;

            /**
             * Creates a new BlurRegion instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BlurRegion instance
             */
            public static create(properties?: android.surfaceflinger.IBlurRegion): android.surfaceflinger.BlurRegion;

            /**
             * Encodes the specified BlurRegion message. Does not implicitly {@link android.surfaceflinger.BlurRegion.verify|verify} messages.
             * @param message BlurRegion message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.surfaceflinger.IBlurRegion, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BlurRegion message, length delimited. Does not implicitly {@link android.surfaceflinger.BlurRegion.verify|verify} messages.
             * @param message BlurRegion message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.surfaceflinger.IBlurRegion, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BlurRegion message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BlurRegion
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.BlurRegion;

            /**
             * Decodes a BlurRegion message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BlurRegion
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.BlurRegion;

            /**
             * Verifies a BlurRegion message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BlurRegion message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BlurRegion
             */
            public static fromObject(object: { [k: string]: any }): android.surfaceflinger.BlurRegion;

            /**
             * Creates a plain object from a BlurRegion message. Also converts values to other types if specified.
             * @param message BlurRegion
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.surfaceflinger.BlurRegion, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BlurRegion to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for BlurRegion
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ColorTransformProto. */
        interface IColorTransformProto {

            /** ColorTransformProto val */
            val?: (number[]|null);
        }

        /** Represents a ColorTransformProto. */
        class ColorTransformProto implements IColorTransformProto {

            /**
             * Constructs a new ColorTransformProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.surfaceflinger.IColorTransformProto);

            /** ColorTransformProto val. */
            public val: number[];

            /**
             * Creates a new ColorTransformProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ColorTransformProto instance
             */
            public static create(properties?: android.surfaceflinger.IColorTransformProto): android.surfaceflinger.ColorTransformProto;

            /**
             * Encodes the specified ColorTransformProto message. Does not implicitly {@link android.surfaceflinger.ColorTransformProto.verify|verify} messages.
             * @param message ColorTransformProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.surfaceflinger.IColorTransformProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ColorTransformProto message, length delimited. Does not implicitly {@link android.surfaceflinger.ColorTransformProto.verify|verify} messages.
             * @param message ColorTransformProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.surfaceflinger.IColorTransformProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ColorTransformProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ColorTransformProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.ColorTransformProto;

            /**
             * Decodes a ColorTransformProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ColorTransformProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.ColorTransformProto;

            /**
             * Verifies a ColorTransformProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ColorTransformProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ColorTransformProto
             */
            public static fromObject(object: { [k: string]: any }): android.surfaceflinger.ColorTransformProto;

            /**
             * Creates a plain object from a ColorTransformProto message. Also converts values to other types if specified.
             * @param message ColorTransformProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.surfaceflinger.ColorTransformProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ColorTransformProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ColorTransformProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
