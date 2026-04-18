import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace perfetto. */
export namespace perfetto {

    /** Namespace protos. */
    namespace protos {

        /** Properties of a Wrapper. */
        interface IWrapper {

            /** Wrapper windowmanagerTraceEntry */
            windowmanagerTraceEntry?: (perfetto.protos.IWindowManagerTraceEntry|null);
        }

        /** Represents a Wrapper. */
        class Wrapper implements IWrapper {

            /**
             * Constructs a new Wrapper.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWrapper);

            /** Wrapper windowmanagerTraceEntry. */
            public windowmanagerTraceEntry?: (perfetto.protos.IWindowManagerTraceEntry|null);

            /**
             * Creates a new Wrapper instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Wrapper instance
             */
            public static create(properties?: perfetto.protos.IWrapper): perfetto.protos.Wrapper;

            /**
             * Encodes the specified Wrapper message. Does not implicitly {@link perfetto.protos.Wrapper.verify|verify} messages.
             * @param message Wrapper message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IWrapper, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Wrapper message, length delimited. Does not implicitly {@link perfetto.protos.Wrapper.verify|verify} messages.
             * @param message Wrapper message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IWrapper, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Wrapper message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Wrapper
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.Wrapper;

            /**
             * Decodes a Wrapper message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Wrapper
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.Wrapper;

            /**
             * Verifies a Wrapper message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Wrapper message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Wrapper
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.Wrapper;

            /**
             * Creates a plain object from a Wrapper message. Also converts values to other types if specified.
             * @param message Wrapper
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.Wrapper, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Wrapper to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Wrapper
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a WindowManagerTraceFileProto. */
        interface IWindowManagerTraceFileProto {

            /** WindowManagerTraceFileProto magicNumber */
            magicNumber?: (Long|null);

            /** WindowManagerTraceFileProto entry */
            entry?: (perfetto.protos.IWindowManagerTraceEntry[]|null);

            /** WindowManagerTraceFileProto realToElapsedTimeOffsetNanos */
            realToElapsedTimeOffsetNanos?: (Long|null);
        }

        /** Represents a WindowManagerTraceFileProto. */
        class WindowManagerTraceFileProto implements IWindowManagerTraceFileProto {

            /**
             * Constructs a new WindowManagerTraceFileProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWindowManagerTraceFileProto);

            /** WindowManagerTraceFileProto magicNumber. */
            public magicNumber: Long;

            /** WindowManagerTraceFileProto entry. */
            public entry: perfetto.protos.IWindowManagerTraceEntry[];

            /** WindowManagerTraceFileProto realToElapsedTimeOffsetNanos. */
            public realToElapsedTimeOffsetNanos: Long;

            /**
             * Creates a new WindowManagerTraceFileProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WindowManagerTraceFileProto instance
             */
            public static create(properties?: perfetto.protos.IWindowManagerTraceFileProto): perfetto.protos.WindowManagerTraceFileProto;

            /**
             * Encodes the specified WindowManagerTraceFileProto message. Does not implicitly {@link perfetto.protos.WindowManagerTraceFileProto.verify|verify} messages.
             * @param message WindowManagerTraceFileProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IWindowManagerTraceFileProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WindowManagerTraceFileProto message, length delimited. Does not implicitly {@link perfetto.protos.WindowManagerTraceFileProto.verify|verify} messages.
             * @param message WindowManagerTraceFileProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IWindowManagerTraceFileProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WindowManagerTraceFileProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WindowManagerTraceFileProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.WindowManagerTraceFileProto;

            /**
             * Decodes a WindowManagerTraceFileProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WindowManagerTraceFileProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.WindowManagerTraceFileProto;

            /**
             * Verifies a WindowManagerTraceFileProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WindowManagerTraceFileProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WindowManagerTraceFileProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.WindowManagerTraceFileProto;

            /**
             * Creates a plain object from a WindowManagerTraceFileProto message. Also converts values to other types if specified.
             * @param message WindowManagerTraceFileProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.WindowManagerTraceFileProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WindowManagerTraceFileProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WindowManagerTraceFileProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace WindowManagerTraceFileProto {

            /** MagicNumber enum. */
            enum MagicNumber {
                INVALID = 0,
                MAGIC_NUMBER_L = 1414416727,
                MAGIC_NUMBER_H = 1162035538
            }
        }

        /** Properties of a WindowManagerTraceEntry. */
        interface IWindowManagerTraceEntry {

            /** WindowManagerTraceEntry elapsedRealtimeNanos */
            elapsedRealtimeNanos?: (Long|null);

            /** WindowManagerTraceEntry where */
            where?: (string|null);

            /** WindowManagerTraceEntry windowManagerService */
            windowManagerService?: (perfetto.protos.IWindowManagerServiceDumpProto|null);
        }

        /** Represents a WindowManagerTraceEntry. */
        class WindowManagerTraceEntry implements IWindowManagerTraceEntry {

            /**
             * Constructs a new WindowManagerTraceEntry.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWindowManagerTraceEntry);

            /** WindowManagerTraceEntry elapsedRealtimeNanos. */
            public elapsedRealtimeNanos: Long;

            /** WindowManagerTraceEntry where. */
            public where: string;

            /** WindowManagerTraceEntry windowManagerService. */
            public windowManagerService?: (perfetto.protos.IWindowManagerServiceDumpProto|null);

            /**
             * Creates a new WindowManagerTraceEntry instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WindowManagerTraceEntry instance
             */
            public static create(properties?: perfetto.protos.IWindowManagerTraceEntry): perfetto.protos.WindowManagerTraceEntry;

            /**
             * Encodes the specified WindowManagerTraceEntry message. Does not implicitly {@link perfetto.protos.WindowManagerTraceEntry.verify|verify} messages.
             * @param message WindowManagerTraceEntry message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IWindowManagerTraceEntry, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WindowManagerTraceEntry message, length delimited. Does not implicitly {@link perfetto.protos.WindowManagerTraceEntry.verify|verify} messages.
             * @param message WindowManagerTraceEntry message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IWindowManagerTraceEntry, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WindowManagerTraceEntry message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WindowManagerTraceEntry
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.WindowManagerTraceEntry;

            /**
             * Decodes a WindowManagerTraceEntry message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WindowManagerTraceEntry
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.WindowManagerTraceEntry;

            /**
             * Verifies a WindowManagerTraceEntry message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WindowManagerTraceEntry message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WindowManagerTraceEntry
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.WindowManagerTraceEntry;

            /**
             * Creates a plain object from a WindowManagerTraceEntry message. Also converts values to other types if specified.
             * @param message WindowManagerTraceEntry
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.WindowManagerTraceEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WindowManagerTraceEntry to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WindowManagerTraceEntry
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a WindowManagerServiceDumpProto. */
        interface IWindowManagerServiceDumpProto {

            /** WindowManagerServiceDumpProto policy */
            policy?: (perfetto.protos.IWindowManagerPolicyProto|null);

            /** WindowManagerServiceDumpProto rootWindowContainer */
            rootWindowContainer?: (perfetto.protos.IRootWindowContainerProto|null);

            /** WindowManagerServiceDumpProto focusedWindow */
            focusedWindow?: (perfetto.protos.IIdentifierProto|null);

            /** WindowManagerServiceDumpProto focusedApp */
            focusedApp?: (string|null);

            /** WindowManagerServiceDumpProto inputMethodWindow */
            inputMethodWindow?: (perfetto.protos.IIdentifierProto|null);

            /** WindowManagerServiceDumpProto displayFrozen */
            displayFrozen?: (boolean|null);

            /** WindowManagerServiceDumpProto rotation */
            rotation?: (number|null);

            /** WindowManagerServiceDumpProto lastOrientation */
            lastOrientation?: (number|null);

            /** WindowManagerServiceDumpProto focusedDisplayId */
            focusedDisplayId?: (number|null);

            /** WindowManagerServiceDumpProto hardKeyboardAvailable */
            hardKeyboardAvailable?: (boolean|null);

            /** WindowManagerServiceDumpProto windowFramesValid */
            windowFramesValid?: (boolean|null);

            /** WindowManagerServiceDumpProto backNavigation */
            backNavigation?: (perfetto.protos.IBackNavigationProto|null);
        }

        /** Represents a WindowManagerServiceDumpProto. */
        class WindowManagerServiceDumpProto implements IWindowManagerServiceDumpProto {

            /**
             * Constructs a new WindowManagerServiceDumpProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWindowManagerServiceDumpProto);

            /** WindowManagerServiceDumpProto policy. */
            public policy?: (perfetto.protos.IWindowManagerPolicyProto|null);

            /** WindowManagerServiceDumpProto rootWindowContainer. */
            public rootWindowContainer?: (perfetto.protos.IRootWindowContainerProto|null);

            /** WindowManagerServiceDumpProto focusedWindow. */
            public focusedWindow?: (perfetto.protos.IIdentifierProto|null);

            /** WindowManagerServiceDumpProto focusedApp. */
            public focusedApp: string;

            /** WindowManagerServiceDumpProto inputMethodWindow. */
            public inputMethodWindow?: (perfetto.protos.IIdentifierProto|null);

            /** WindowManagerServiceDumpProto displayFrozen. */
            public displayFrozen: boolean;

            /** WindowManagerServiceDumpProto rotation. */
            public rotation: number;

            /** WindowManagerServiceDumpProto lastOrientation. */
            public lastOrientation: number;

            /** WindowManagerServiceDumpProto focusedDisplayId. */
            public focusedDisplayId: number;

            /** WindowManagerServiceDumpProto hardKeyboardAvailable. */
            public hardKeyboardAvailable: boolean;

            /** WindowManagerServiceDumpProto windowFramesValid. */
            public windowFramesValid: boolean;

            /** WindowManagerServiceDumpProto backNavigation. */
            public backNavigation?: (perfetto.protos.IBackNavigationProto|null);

            /**
             * Creates a new WindowManagerServiceDumpProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WindowManagerServiceDumpProto instance
             */
            public static create(properties?: perfetto.protos.IWindowManagerServiceDumpProto): perfetto.protos.WindowManagerServiceDumpProto;

            /**
             * Encodes the specified WindowManagerServiceDumpProto message. Does not implicitly {@link perfetto.protos.WindowManagerServiceDumpProto.verify|verify} messages.
             * @param message WindowManagerServiceDumpProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IWindowManagerServiceDumpProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WindowManagerServiceDumpProto message, length delimited. Does not implicitly {@link perfetto.protos.WindowManagerServiceDumpProto.verify|verify} messages.
             * @param message WindowManagerServiceDumpProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IWindowManagerServiceDumpProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WindowManagerServiceDumpProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WindowManagerServiceDumpProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.WindowManagerServiceDumpProto;

            /**
             * Decodes a WindowManagerServiceDumpProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WindowManagerServiceDumpProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.WindowManagerServiceDumpProto;

            /**
             * Verifies a WindowManagerServiceDumpProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WindowManagerServiceDumpProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WindowManagerServiceDumpProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.WindowManagerServiceDumpProto;

            /**
             * Creates a plain object from a WindowManagerServiceDumpProto message. Also converts values to other types if specified.
             * @param message WindowManagerServiceDumpProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.WindowManagerServiceDumpProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WindowManagerServiceDumpProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WindowManagerServiceDumpProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a RootWindowContainerProto. */
        interface IRootWindowContainerProto {

            /** RootWindowContainerProto windowContainer */
            windowContainer?: (perfetto.protos.IWindowContainerProto|null);

            /** RootWindowContainerProto displays */
            displays?: (perfetto.protos.IDisplayContentProto[]|null);

            /** RootWindowContainerProto windows */
            windows?: (perfetto.protos.IWindowStateProto[]|null);

            /** RootWindowContainerProto keyguardController */
            keyguardController?: (perfetto.protos.IKeyguardControllerProto|null);

            /** RootWindowContainerProto isHomeRecentsComponent */
            isHomeRecentsComponent?: (boolean|null);

            /** RootWindowContainerProto pendingActivities */
            pendingActivities?: (perfetto.protos.IIdentifierProto[]|null);

            /** RootWindowContainerProto defaultMinSizeResizableTask */
            defaultMinSizeResizableTask?: (number|null);
        }

        /** Represents a RootWindowContainerProto. */
        class RootWindowContainerProto implements IRootWindowContainerProto {

            /**
             * Constructs a new RootWindowContainerProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IRootWindowContainerProto);

            /** RootWindowContainerProto windowContainer. */
            public windowContainer?: (perfetto.protos.IWindowContainerProto|null);

            /** RootWindowContainerProto displays. */
            public displays: perfetto.protos.IDisplayContentProto[];

            /** RootWindowContainerProto windows. */
            public windows: perfetto.protos.IWindowStateProto[];

            /** RootWindowContainerProto keyguardController. */
            public keyguardController?: (perfetto.protos.IKeyguardControllerProto|null);

            /** RootWindowContainerProto isHomeRecentsComponent. */
            public isHomeRecentsComponent: boolean;

            /** RootWindowContainerProto pendingActivities. */
            public pendingActivities: perfetto.protos.IIdentifierProto[];

            /** RootWindowContainerProto defaultMinSizeResizableTask. */
            public defaultMinSizeResizableTask: number;

            /**
             * Creates a new RootWindowContainerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RootWindowContainerProto instance
             */
            public static create(properties?: perfetto.protos.IRootWindowContainerProto): perfetto.protos.RootWindowContainerProto;

            /**
             * Encodes the specified RootWindowContainerProto message. Does not implicitly {@link perfetto.protos.RootWindowContainerProto.verify|verify} messages.
             * @param message RootWindowContainerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IRootWindowContainerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RootWindowContainerProto message, length delimited. Does not implicitly {@link perfetto.protos.RootWindowContainerProto.verify|verify} messages.
             * @param message RootWindowContainerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IRootWindowContainerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RootWindowContainerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RootWindowContainerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.RootWindowContainerProto;

            /**
             * Decodes a RootWindowContainerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RootWindowContainerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.RootWindowContainerProto;

            /**
             * Verifies a RootWindowContainerProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RootWindowContainerProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RootWindowContainerProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.RootWindowContainerProto;

            /**
             * Creates a plain object from a RootWindowContainerProto message. Also converts values to other types if specified.
             * @param message RootWindowContainerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.RootWindowContainerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this RootWindowContainerProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for RootWindowContainerProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a BarControllerProto. */
        interface IBarControllerProto {

            /** BarControllerProto state */
            state?: (perfetto.protos.StatusBarManagerProto.WindowState|null);

            /** BarControllerProto transientState */
            transientState?: (perfetto.protos.StatusBarManagerProto.TransientWindowState|null);
        }

        /** Represents a BarControllerProto. */
        class BarControllerProto implements IBarControllerProto {

            /**
             * Constructs a new BarControllerProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IBarControllerProto);

            /** BarControllerProto state. */
            public state: perfetto.protos.StatusBarManagerProto.WindowState;

            /** BarControllerProto transientState. */
            public transientState: perfetto.protos.StatusBarManagerProto.TransientWindowState;

            /**
             * Creates a new BarControllerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BarControllerProto instance
             */
            public static create(properties?: perfetto.protos.IBarControllerProto): perfetto.protos.BarControllerProto;

            /**
             * Encodes the specified BarControllerProto message. Does not implicitly {@link perfetto.protos.BarControllerProto.verify|verify} messages.
             * @param message BarControllerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IBarControllerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BarControllerProto message, length delimited. Does not implicitly {@link perfetto.protos.BarControllerProto.verify|verify} messages.
             * @param message BarControllerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IBarControllerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BarControllerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BarControllerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.BarControllerProto;

            /**
             * Decodes a BarControllerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BarControllerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.BarControllerProto;

            /**
             * Verifies a BarControllerProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BarControllerProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BarControllerProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.BarControllerProto;

            /**
             * Creates a plain object from a BarControllerProto message. Also converts values to other types if specified.
             * @param message BarControllerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.BarControllerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BarControllerProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for BarControllerProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a WindowOrientationListenerProto. */
        interface IWindowOrientationListenerProto {

            /** WindowOrientationListenerProto enabled */
            enabled?: (boolean|null);

            /** WindowOrientationListenerProto rotation */
            rotation?: (perfetto.protos.SurfaceProto.Rotation|null);
        }

        /** Represents a WindowOrientationListenerProto. */
        class WindowOrientationListenerProto implements IWindowOrientationListenerProto {

            /**
             * Constructs a new WindowOrientationListenerProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWindowOrientationListenerProto);

            /** WindowOrientationListenerProto enabled. */
            public enabled: boolean;

            /** WindowOrientationListenerProto rotation. */
            public rotation: perfetto.protos.SurfaceProto.Rotation;

            /**
             * Creates a new WindowOrientationListenerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WindowOrientationListenerProto instance
             */
            public static create(properties?: perfetto.protos.IWindowOrientationListenerProto): perfetto.protos.WindowOrientationListenerProto;

            /**
             * Encodes the specified WindowOrientationListenerProto message. Does not implicitly {@link perfetto.protos.WindowOrientationListenerProto.verify|verify} messages.
             * @param message WindowOrientationListenerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IWindowOrientationListenerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WindowOrientationListenerProto message, length delimited. Does not implicitly {@link perfetto.protos.WindowOrientationListenerProto.verify|verify} messages.
             * @param message WindowOrientationListenerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IWindowOrientationListenerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WindowOrientationListenerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WindowOrientationListenerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.WindowOrientationListenerProto;

            /**
             * Decodes a WindowOrientationListenerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WindowOrientationListenerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.WindowOrientationListenerProto;

            /**
             * Verifies a WindowOrientationListenerProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WindowOrientationListenerProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WindowOrientationListenerProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.WindowOrientationListenerProto;

            /**
             * Creates a plain object from a WindowOrientationListenerProto message. Also converts values to other types if specified.
             * @param message WindowOrientationListenerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.WindowOrientationListenerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WindowOrientationListenerProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WindowOrientationListenerProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a KeyguardServiceDelegateProto. */
        interface IKeyguardServiceDelegateProto {

            /** KeyguardServiceDelegateProto showing */
            showing?: (boolean|null);

            /** KeyguardServiceDelegateProto occluded */
            occluded?: (boolean|null);

            /** KeyguardServiceDelegateProto secure */
            secure?: (boolean|null);

            /** KeyguardServiceDelegateProto screenState */
            screenState?: (perfetto.protos.KeyguardServiceDelegateProto.ScreenState|null);

            /** KeyguardServiceDelegateProto interactiveState */
            interactiveState?: (perfetto.protos.KeyguardServiceDelegateProto.InteractiveState|null);
        }

        /** Represents a KeyguardServiceDelegateProto. */
        class KeyguardServiceDelegateProto implements IKeyguardServiceDelegateProto {

            /**
             * Constructs a new KeyguardServiceDelegateProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IKeyguardServiceDelegateProto);

            /** KeyguardServiceDelegateProto showing. */
            public showing: boolean;

            /** KeyguardServiceDelegateProto occluded. */
            public occluded: boolean;

            /** KeyguardServiceDelegateProto secure. */
            public secure: boolean;

            /** KeyguardServiceDelegateProto screenState. */
            public screenState: perfetto.protos.KeyguardServiceDelegateProto.ScreenState;

            /** KeyguardServiceDelegateProto interactiveState. */
            public interactiveState: perfetto.protos.KeyguardServiceDelegateProto.InteractiveState;

            /**
             * Creates a new KeyguardServiceDelegateProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns KeyguardServiceDelegateProto instance
             */
            public static create(properties?: perfetto.protos.IKeyguardServiceDelegateProto): perfetto.protos.KeyguardServiceDelegateProto;

            /**
             * Encodes the specified KeyguardServiceDelegateProto message. Does not implicitly {@link perfetto.protos.KeyguardServiceDelegateProto.verify|verify} messages.
             * @param message KeyguardServiceDelegateProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IKeyguardServiceDelegateProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified KeyguardServiceDelegateProto message, length delimited. Does not implicitly {@link perfetto.protos.KeyguardServiceDelegateProto.verify|verify} messages.
             * @param message KeyguardServiceDelegateProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IKeyguardServiceDelegateProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a KeyguardServiceDelegateProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns KeyguardServiceDelegateProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.KeyguardServiceDelegateProto;

            /**
             * Decodes a KeyguardServiceDelegateProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns KeyguardServiceDelegateProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.KeyguardServiceDelegateProto;

            /**
             * Verifies a KeyguardServiceDelegateProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a KeyguardServiceDelegateProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns KeyguardServiceDelegateProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.KeyguardServiceDelegateProto;

            /**
             * Creates a plain object from a KeyguardServiceDelegateProto message. Also converts values to other types if specified.
             * @param message KeyguardServiceDelegateProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.KeyguardServiceDelegateProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this KeyguardServiceDelegateProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for KeyguardServiceDelegateProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace KeyguardServiceDelegateProto {

            /** ScreenState enum. */
            enum ScreenState {
                SCREEN_STATE_OFF = 0,
                SCREEN_STATE_TURNING_ON = 1,
                SCREEN_STATE_ON = 2,
                SCREEN_STATE_TURNING_OFF = 3
            }

            /** InteractiveState enum. */
            enum InteractiveState {
                INTERACTIVE_STATE_SLEEP = 0,
                INTERACTIVE_STATE_WAKING = 1,
                INTERACTIVE_STATE_AWAKE = 2,
                INTERACTIVE_STATE_GOING_TO_SLEEP = 3
            }
        }

        /** Properties of a KeyguardControllerProto. */
        interface IKeyguardControllerProto {

            /** KeyguardControllerProto keyguardShowing */
            keyguardShowing?: (boolean|null);

            /** KeyguardControllerProto keyguardOccludedStates */
            keyguardOccludedStates?: (perfetto.protos.IKeyguardOccludedProto[]|null);

            /** KeyguardControllerProto aodShowing */
            aodShowing?: (boolean|null);

            /** KeyguardControllerProto keyguardPerDisplay */
            keyguardPerDisplay?: (perfetto.protos.IKeyguardPerDisplayProto[]|null);

            /** KeyguardControllerProto keyguardGoingAway */
            keyguardGoingAway?: (boolean|null);
        }

        /** Represents a KeyguardControllerProto. */
        class KeyguardControllerProto implements IKeyguardControllerProto {

            /**
             * Constructs a new KeyguardControllerProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IKeyguardControllerProto);

            /** KeyguardControllerProto keyguardShowing. */
            public keyguardShowing: boolean;

            /** KeyguardControllerProto keyguardOccludedStates. */
            public keyguardOccludedStates: perfetto.protos.IKeyguardOccludedProto[];

            /** KeyguardControllerProto aodShowing. */
            public aodShowing: boolean;

            /** KeyguardControllerProto keyguardPerDisplay. */
            public keyguardPerDisplay: perfetto.protos.IKeyguardPerDisplayProto[];

            /** KeyguardControllerProto keyguardGoingAway. */
            public keyguardGoingAway: boolean;

            /**
             * Creates a new KeyguardControllerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns KeyguardControllerProto instance
             */
            public static create(properties?: perfetto.protos.IKeyguardControllerProto): perfetto.protos.KeyguardControllerProto;

            /**
             * Encodes the specified KeyguardControllerProto message. Does not implicitly {@link perfetto.protos.KeyguardControllerProto.verify|verify} messages.
             * @param message KeyguardControllerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IKeyguardControllerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified KeyguardControllerProto message, length delimited. Does not implicitly {@link perfetto.protos.KeyguardControllerProto.verify|verify} messages.
             * @param message KeyguardControllerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IKeyguardControllerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a KeyguardControllerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns KeyguardControllerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.KeyguardControllerProto;

            /**
             * Decodes a KeyguardControllerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns KeyguardControllerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.KeyguardControllerProto;

            /**
             * Verifies a KeyguardControllerProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a KeyguardControllerProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns KeyguardControllerProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.KeyguardControllerProto;

            /**
             * Creates a plain object from a KeyguardControllerProto message. Also converts values to other types if specified.
             * @param message KeyguardControllerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.KeyguardControllerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this KeyguardControllerProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for KeyguardControllerProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a KeyguardOccludedProto. */
        interface IKeyguardOccludedProto {

            /** KeyguardOccludedProto displayId */
            displayId?: (number|null);

            /** KeyguardOccludedProto keyguardOccluded */
            keyguardOccluded?: (boolean|null);
        }

        /** Represents a KeyguardOccludedProto. */
        class KeyguardOccludedProto implements IKeyguardOccludedProto {

            /**
             * Constructs a new KeyguardOccludedProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IKeyguardOccludedProto);

            /** KeyguardOccludedProto displayId. */
            public displayId: number;

            /** KeyguardOccludedProto keyguardOccluded. */
            public keyguardOccluded: boolean;

            /**
             * Creates a new KeyguardOccludedProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns KeyguardOccludedProto instance
             */
            public static create(properties?: perfetto.protos.IKeyguardOccludedProto): perfetto.protos.KeyguardOccludedProto;

            /**
             * Encodes the specified KeyguardOccludedProto message. Does not implicitly {@link perfetto.protos.KeyguardOccludedProto.verify|verify} messages.
             * @param message KeyguardOccludedProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IKeyguardOccludedProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified KeyguardOccludedProto message, length delimited. Does not implicitly {@link perfetto.protos.KeyguardOccludedProto.verify|verify} messages.
             * @param message KeyguardOccludedProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IKeyguardOccludedProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a KeyguardOccludedProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns KeyguardOccludedProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.KeyguardOccludedProto;

            /**
             * Decodes a KeyguardOccludedProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns KeyguardOccludedProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.KeyguardOccludedProto;

            /**
             * Verifies a KeyguardOccludedProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a KeyguardOccludedProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns KeyguardOccludedProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.KeyguardOccludedProto;

            /**
             * Creates a plain object from a KeyguardOccludedProto message. Also converts values to other types if specified.
             * @param message KeyguardOccludedProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.KeyguardOccludedProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this KeyguardOccludedProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for KeyguardOccludedProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a KeyguardPerDisplayProto. */
        interface IKeyguardPerDisplayProto {

            /** KeyguardPerDisplayProto displayId */
            displayId?: (number|null);

            /** KeyguardPerDisplayProto keyguardShowing */
            keyguardShowing?: (boolean|null);

            /** KeyguardPerDisplayProto aodShowing */
            aodShowing?: (boolean|null);

            /** KeyguardPerDisplayProto keyguardOccluded */
            keyguardOccluded?: (boolean|null);

            /** KeyguardPerDisplayProto keyguardGoingAway */
            keyguardGoingAway?: (boolean|null);
        }

        /** Represents a KeyguardPerDisplayProto. */
        class KeyguardPerDisplayProto implements IKeyguardPerDisplayProto {

            /**
             * Constructs a new KeyguardPerDisplayProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IKeyguardPerDisplayProto);

            /** KeyguardPerDisplayProto displayId. */
            public displayId: number;

            /** KeyguardPerDisplayProto keyguardShowing. */
            public keyguardShowing: boolean;

            /** KeyguardPerDisplayProto aodShowing. */
            public aodShowing: boolean;

            /** KeyguardPerDisplayProto keyguardOccluded. */
            public keyguardOccluded: boolean;

            /** KeyguardPerDisplayProto keyguardGoingAway. */
            public keyguardGoingAway: boolean;

            /**
             * Creates a new KeyguardPerDisplayProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns KeyguardPerDisplayProto instance
             */
            public static create(properties?: perfetto.protos.IKeyguardPerDisplayProto): perfetto.protos.KeyguardPerDisplayProto;

            /**
             * Encodes the specified KeyguardPerDisplayProto message. Does not implicitly {@link perfetto.protos.KeyguardPerDisplayProto.verify|verify} messages.
             * @param message KeyguardPerDisplayProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IKeyguardPerDisplayProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified KeyguardPerDisplayProto message, length delimited. Does not implicitly {@link perfetto.protos.KeyguardPerDisplayProto.verify|verify} messages.
             * @param message KeyguardPerDisplayProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IKeyguardPerDisplayProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a KeyguardPerDisplayProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns KeyguardPerDisplayProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.KeyguardPerDisplayProto;

            /**
             * Decodes a KeyguardPerDisplayProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns KeyguardPerDisplayProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.KeyguardPerDisplayProto;

            /**
             * Verifies a KeyguardPerDisplayProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a KeyguardPerDisplayProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns KeyguardPerDisplayProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.KeyguardPerDisplayProto;

            /**
             * Creates a plain object from a KeyguardPerDisplayProto message. Also converts values to other types if specified.
             * @param message KeyguardPerDisplayProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.KeyguardPerDisplayProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this KeyguardPerDisplayProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for KeyguardPerDisplayProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a WindowManagerPolicyProto. */
        interface IWindowManagerPolicyProto {

            /** WindowManagerPolicyProto lastSystemUiFlags */
            lastSystemUiFlags?: (number|null);

            /** WindowManagerPolicyProto rotationMode */
            rotationMode?: (perfetto.protos.WindowManagerPolicyProto.UserRotationMode|null);

            /** WindowManagerPolicyProto rotation */
            rotation?: (perfetto.protos.SurfaceProto.Rotation|null);

            /** WindowManagerPolicyProto orientation */
            orientation?: (perfetto.protos.ActivityInfoProto.ScreenOrientation|null);

            /** WindowManagerPolicyProto screenOnFully */
            screenOnFully?: (boolean|null);

            /** WindowManagerPolicyProto keyguardDrawComplete */
            keyguardDrawComplete?: (boolean|null);

            /** WindowManagerPolicyProto windowManagerDrawComplete */
            windowManagerDrawComplete?: (boolean|null);

            /** WindowManagerPolicyProto focusedAppToken */
            focusedAppToken?: (string|null);

            /** WindowManagerPolicyProto focusedWindow */
            focusedWindow?: (perfetto.protos.IIdentifierProto|null);

            /** WindowManagerPolicyProto topFullscreenOpaqueWindow */
            topFullscreenOpaqueWindow?: (perfetto.protos.IIdentifierProto|null);

            /** WindowManagerPolicyProto topFullscreenOpaqueOrDimmingWindow */
            topFullscreenOpaqueOrDimmingWindow?: (perfetto.protos.IIdentifierProto|null);

            /** WindowManagerPolicyProto keyguardOccluded */
            keyguardOccluded?: (boolean|null);

            /** WindowManagerPolicyProto keyguardOccludedChanged */
            keyguardOccludedChanged?: (boolean|null);

            /** WindowManagerPolicyProto keyguardOccludedPending */
            keyguardOccludedPending?: (boolean|null);

            /** WindowManagerPolicyProto forceStatusBar */
            forceStatusBar?: (boolean|null);

            /** WindowManagerPolicyProto forceStatusBarFromKeyguard */
            forceStatusBarFromKeyguard?: (boolean|null);

            /** WindowManagerPolicyProto statusBar */
            statusBar?: (perfetto.protos.IBarControllerProto|null);

            /** WindowManagerPolicyProto navigationBar */
            navigationBar?: (perfetto.protos.IBarControllerProto|null);

            /** WindowManagerPolicyProto orientationListener */
            orientationListener?: (perfetto.protos.IWindowOrientationListenerProto|null);

            /** WindowManagerPolicyProto keyguardDelegate */
            keyguardDelegate?: (perfetto.protos.IKeyguardServiceDelegateProto|null);
        }

        /** Represents a WindowManagerPolicyProto. */
        class WindowManagerPolicyProto implements IWindowManagerPolicyProto {

            /**
             * Constructs a new WindowManagerPolicyProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWindowManagerPolicyProto);

            /** WindowManagerPolicyProto lastSystemUiFlags. */
            public lastSystemUiFlags: number;

            /** WindowManagerPolicyProto rotationMode. */
            public rotationMode: perfetto.protos.WindowManagerPolicyProto.UserRotationMode;

            /** WindowManagerPolicyProto rotation. */
            public rotation: perfetto.protos.SurfaceProto.Rotation;

            /** WindowManagerPolicyProto orientation. */
            public orientation: perfetto.protos.ActivityInfoProto.ScreenOrientation;

            /** WindowManagerPolicyProto screenOnFully. */
            public screenOnFully: boolean;

            /** WindowManagerPolicyProto keyguardDrawComplete. */
            public keyguardDrawComplete: boolean;

            /** WindowManagerPolicyProto windowManagerDrawComplete. */
            public windowManagerDrawComplete: boolean;

            /** WindowManagerPolicyProto focusedAppToken. */
            public focusedAppToken: string;

            /** WindowManagerPolicyProto focusedWindow. */
            public focusedWindow?: (perfetto.protos.IIdentifierProto|null);

            /** WindowManagerPolicyProto topFullscreenOpaqueWindow. */
            public topFullscreenOpaqueWindow?: (perfetto.protos.IIdentifierProto|null);

            /** WindowManagerPolicyProto topFullscreenOpaqueOrDimmingWindow. */
            public topFullscreenOpaqueOrDimmingWindow?: (perfetto.protos.IIdentifierProto|null);

            /** WindowManagerPolicyProto keyguardOccluded. */
            public keyguardOccluded: boolean;

            /** WindowManagerPolicyProto keyguardOccludedChanged. */
            public keyguardOccludedChanged: boolean;

            /** WindowManagerPolicyProto keyguardOccludedPending. */
            public keyguardOccludedPending: boolean;

            /** WindowManagerPolicyProto forceStatusBar. */
            public forceStatusBar: boolean;

            /** WindowManagerPolicyProto forceStatusBarFromKeyguard. */
            public forceStatusBarFromKeyguard: boolean;

            /** WindowManagerPolicyProto statusBar. */
            public statusBar?: (perfetto.protos.IBarControllerProto|null);

            /** WindowManagerPolicyProto navigationBar. */
            public navigationBar?: (perfetto.protos.IBarControllerProto|null);

            /** WindowManagerPolicyProto orientationListener. */
            public orientationListener?: (perfetto.protos.IWindowOrientationListenerProto|null);

            /** WindowManagerPolicyProto keyguardDelegate. */
            public keyguardDelegate?: (perfetto.protos.IKeyguardServiceDelegateProto|null);

            /**
             * Creates a new WindowManagerPolicyProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WindowManagerPolicyProto instance
             */
            public static create(properties?: perfetto.protos.IWindowManagerPolicyProto): perfetto.protos.WindowManagerPolicyProto;

            /**
             * Encodes the specified WindowManagerPolicyProto message. Does not implicitly {@link perfetto.protos.WindowManagerPolicyProto.verify|verify} messages.
             * @param message WindowManagerPolicyProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IWindowManagerPolicyProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WindowManagerPolicyProto message, length delimited. Does not implicitly {@link perfetto.protos.WindowManagerPolicyProto.verify|verify} messages.
             * @param message WindowManagerPolicyProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IWindowManagerPolicyProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WindowManagerPolicyProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WindowManagerPolicyProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.WindowManagerPolicyProto;

            /**
             * Decodes a WindowManagerPolicyProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WindowManagerPolicyProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.WindowManagerPolicyProto;

            /**
             * Verifies a WindowManagerPolicyProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WindowManagerPolicyProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WindowManagerPolicyProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.WindowManagerPolicyProto;

            /**
             * Creates a plain object from a WindowManagerPolicyProto message. Also converts values to other types if specified.
             * @param message WindowManagerPolicyProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.WindowManagerPolicyProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WindowManagerPolicyProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WindowManagerPolicyProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace WindowManagerPolicyProto {

            /** UserRotationMode enum. */
            enum UserRotationMode {
                USER_ROTATION_FREE = 0,
                USER_ROTATION_LOCKED = 1
            }
        }

        /** Properties of an AppTransitionProto. */
        interface IAppTransitionProto {

            /** AppTransitionProto appTransitionState */
            appTransitionState?: (perfetto.protos.AppTransitionProto.AppState|null);

            /** AppTransitionProto lastUsedAppTransition */
            lastUsedAppTransition?: (perfetto.protos.TransitionTypeEnum|null);
        }

        /** Represents an AppTransitionProto. */
        class AppTransitionProto implements IAppTransitionProto {

            /**
             * Constructs a new AppTransitionProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IAppTransitionProto);

            /** AppTransitionProto appTransitionState. */
            public appTransitionState: perfetto.protos.AppTransitionProto.AppState;

            /** AppTransitionProto lastUsedAppTransition. */
            public lastUsedAppTransition: perfetto.protos.TransitionTypeEnum;

            /**
             * Creates a new AppTransitionProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AppTransitionProto instance
             */
            public static create(properties?: perfetto.protos.IAppTransitionProto): perfetto.protos.AppTransitionProto;

            /**
             * Encodes the specified AppTransitionProto message. Does not implicitly {@link perfetto.protos.AppTransitionProto.verify|verify} messages.
             * @param message AppTransitionProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IAppTransitionProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AppTransitionProto message, length delimited. Does not implicitly {@link perfetto.protos.AppTransitionProto.verify|verify} messages.
             * @param message AppTransitionProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IAppTransitionProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AppTransitionProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AppTransitionProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.AppTransitionProto;

            /**
             * Decodes an AppTransitionProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AppTransitionProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.AppTransitionProto;

            /**
             * Verifies an AppTransitionProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AppTransitionProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AppTransitionProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.AppTransitionProto;

            /**
             * Creates a plain object from an AppTransitionProto message. Also converts values to other types if specified.
             * @param message AppTransitionProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.AppTransitionProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AppTransitionProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for AppTransitionProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace AppTransitionProto {

            /** AppState enum. */
            enum AppState {
                APP_STATE_IDLE = 0,
                APP_STATE_READY = 1,
                APP_STATE_RUNNING = 2,
                APP_STATE_TIMEOUT = 3
            }
        }

        /** Properties of a DisplayContentProto. */
        interface IDisplayContentProto {

            /** DisplayContentProto windowContainer */
            windowContainer?: (perfetto.protos.IWindowContainerProto|null);

            /** DisplayContentProto id */
            id?: (number|null);

            /** DisplayContentProto dockedTaskDividerController */
            dockedTaskDividerController?: (perfetto.protos.IDockedTaskDividerControllerProto|null);

            /** DisplayContentProto pinnedTaskController */
            pinnedTaskController?: (perfetto.protos.IPinnedTaskControllerProto|null);

            /** DisplayContentProto aboveAppWindows */
            aboveAppWindows?: (perfetto.protos.IWindowTokenProto[]|null);

            /** DisplayContentProto belowAppWindows */
            belowAppWindows?: (perfetto.protos.IWindowTokenProto[]|null);

            /** DisplayContentProto imeWindows */
            imeWindows?: (perfetto.protos.IWindowTokenProto[]|null);

            /** DisplayContentProto dpi */
            dpi?: (number|null);

            /** DisplayContentProto displayInfo */
            displayInfo?: (perfetto.protos.IDisplayInfoProto|null);

            /** DisplayContentProto rotation */
            rotation?: (number|null);

            /** DisplayContentProto screenRotationAnimation */
            screenRotationAnimation?: (perfetto.protos.IScreenRotationAnimationProto|null);

            /** DisplayContentProto displayFrames */
            displayFrames?: (perfetto.protos.IDisplayFramesProto|null);

            /** DisplayContentProto surfaceSize */
            surfaceSize?: (number|null);

            /** DisplayContentProto focusedApp */
            focusedApp?: (string|null);

            /** DisplayContentProto appTransition */
            appTransition?: (perfetto.protos.IAppTransitionProto|null);

            /** DisplayContentProto openingApps */
            openingApps?: (perfetto.protos.IIdentifierProto[]|null);

            /** DisplayContentProto closingApps */
            closingApps?: (perfetto.protos.IIdentifierProto[]|null);

            /** DisplayContentProto changingApps */
            changingApps?: (perfetto.protos.IIdentifierProto[]|null);

            /** DisplayContentProto overlayWindows */
            overlayWindows?: (perfetto.protos.IWindowTokenProto[]|null);

            /** DisplayContentProto rootDisplayArea */
            rootDisplayArea?: (perfetto.protos.IDisplayAreaProto|null);

            /** DisplayContentProto singleTaskInstance */
            singleTaskInstance?: (boolean|null);

            /** DisplayContentProto focusedRootTaskId */
            focusedRootTaskId?: (number|null);

            /** DisplayContentProto resumedActivity */
            resumedActivity?: (perfetto.protos.IIdentifierProto|null);

            /** DisplayContentProto tasks */
            tasks?: (perfetto.protos.ITaskProto[]|null);

            /** DisplayContentProto displayReady */
            displayReady?: (boolean|null);

            /** DisplayContentProto inputMethodTarget */
            inputMethodTarget?: (perfetto.protos.IWindowStateProto|null);

            /** DisplayContentProto inputMethodInputTarget */
            inputMethodInputTarget?: (perfetto.protos.IWindowStateProto|null);

            /** DisplayContentProto inputMethodControlTarget */
            inputMethodControlTarget?: (perfetto.protos.IWindowStateProto|null);

            /** DisplayContentProto currentFocus */
            currentFocus?: (perfetto.protos.IWindowStateProto|null);

            /** DisplayContentProto imeInsetsSourceProvider */
            imeInsetsSourceProvider?: (perfetto.protos.IImeInsetsSourceProviderProto|null);

            /** DisplayContentProto canShowIme */
            canShowIme?: (boolean|null);

            /** DisplayContentProto displayRotation */
            displayRotation?: (perfetto.protos.IDisplayRotationProto|null);

            /** DisplayContentProto imePolicy */
            imePolicy?: (number|null);

            /** DisplayContentProto insetsSourceProviders */
            insetsSourceProviders?: (perfetto.protos.IInsetsSourceProviderProto[]|null);

            /** DisplayContentProto isSleeping */
            isSleeping?: (boolean|null);

            /** DisplayContentProto sleepTokens */
            sleepTokens?: (string[]|null);

            /** DisplayContentProto keepClearAreas */
            keepClearAreas?: (perfetto.protos.IRectProto[]|null);

            /** DisplayContentProto minSizeOfResizeableTaskDp */
            minSizeOfResizeableTaskDp?: (number|null);

            /** DisplayContentProto inputMethodLayeringTargetIdentifier */
            inputMethodLayeringTargetIdentifier?: (perfetto.protos.IIdentifierProto|null);

            /** DisplayContentProto inputMethodInputTargetIdentifier */
            inputMethodInputTargetIdentifier?: (perfetto.protos.IIdentifierProto|null);

            /** DisplayContentProto inputMethodControlTargetIdentifier */
            inputMethodControlTargetIdentifier?: (perfetto.protos.IIdentifierProto|null);

            /** DisplayContentProto currentFocusIdentifier */
            currentFocusIdentifier?: (perfetto.protos.IIdentifierProto|null);
        }

        /** Represents a DisplayContentProto. */
        class DisplayContentProto implements IDisplayContentProto {

            /**
             * Constructs a new DisplayContentProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IDisplayContentProto);

            /** DisplayContentProto windowContainer. */
            public windowContainer?: (perfetto.protos.IWindowContainerProto|null);

            /** DisplayContentProto id. */
            public id: number;

            /** DisplayContentProto dockedTaskDividerController. */
            public dockedTaskDividerController?: (perfetto.protos.IDockedTaskDividerControllerProto|null);

            /** DisplayContentProto pinnedTaskController. */
            public pinnedTaskController?: (perfetto.protos.IPinnedTaskControllerProto|null);

            /** DisplayContentProto aboveAppWindows. */
            public aboveAppWindows: perfetto.protos.IWindowTokenProto[];

            /** DisplayContentProto belowAppWindows. */
            public belowAppWindows: perfetto.protos.IWindowTokenProto[];

            /** DisplayContentProto imeWindows. */
            public imeWindows: perfetto.protos.IWindowTokenProto[];

            /** DisplayContentProto dpi. */
            public dpi: number;

            /** DisplayContentProto displayInfo. */
            public displayInfo?: (perfetto.protos.IDisplayInfoProto|null);

            /** DisplayContentProto rotation. */
            public rotation: number;

            /** DisplayContentProto screenRotationAnimation. */
            public screenRotationAnimation?: (perfetto.protos.IScreenRotationAnimationProto|null);

            /** DisplayContentProto displayFrames. */
            public displayFrames?: (perfetto.protos.IDisplayFramesProto|null);

            /** DisplayContentProto surfaceSize. */
            public surfaceSize: number;

            /** DisplayContentProto focusedApp. */
            public focusedApp: string;

            /** DisplayContentProto appTransition. */
            public appTransition?: (perfetto.protos.IAppTransitionProto|null);

            /** DisplayContentProto openingApps. */
            public openingApps: perfetto.protos.IIdentifierProto[];

            /** DisplayContentProto closingApps. */
            public closingApps: perfetto.protos.IIdentifierProto[];

            /** DisplayContentProto changingApps. */
            public changingApps: perfetto.protos.IIdentifierProto[];

            /** DisplayContentProto overlayWindows. */
            public overlayWindows: perfetto.protos.IWindowTokenProto[];

            /** DisplayContentProto rootDisplayArea. */
            public rootDisplayArea?: (perfetto.protos.IDisplayAreaProto|null);

            /** DisplayContentProto singleTaskInstance. */
            public singleTaskInstance: boolean;

            /** DisplayContentProto focusedRootTaskId. */
            public focusedRootTaskId: number;

            /** DisplayContentProto resumedActivity. */
            public resumedActivity?: (perfetto.protos.IIdentifierProto|null);

            /** DisplayContentProto tasks. */
            public tasks: perfetto.protos.ITaskProto[];

            /** DisplayContentProto displayReady. */
            public displayReady: boolean;

            /** DisplayContentProto inputMethodTarget. */
            public inputMethodTarget?: (perfetto.protos.IWindowStateProto|null);

            /** DisplayContentProto inputMethodInputTarget. */
            public inputMethodInputTarget?: (perfetto.protos.IWindowStateProto|null);

            /** DisplayContentProto inputMethodControlTarget. */
            public inputMethodControlTarget?: (perfetto.protos.IWindowStateProto|null);

            /** DisplayContentProto currentFocus. */
            public currentFocus?: (perfetto.protos.IWindowStateProto|null);

            /** DisplayContentProto imeInsetsSourceProvider. */
            public imeInsetsSourceProvider?: (perfetto.protos.IImeInsetsSourceProviderProto|null);

            /** DisplayContentProto canShowIme. */
            public canShowIme: boolean;

            /** DisplayContentProto displayRotation. */
            public displayRotation?: (perfetto.protos.IDisplayRotationProto|null);

            /** DisplayContentProto imePolicy. */
            public imePolicy: number;

            /** DisplayContentProto insetsSourceProviders. */
            public insetsSourceProviders: perfetto.protos.IInsetsSourceProviderProto[];

            /** DisplayContentProto isSleeping. */
            public isSleeping: boolean;

            /** DisplayContentProto sleepTokens. */
            public sleepTokens: string[];

            /** DisplayContentProto keepClearAreas. */
            public keepClearAreas: perfetto.protos.IRectProto[];

            /** DisplayContentProto minSizeOfResizeableTaskDp. */
            public minSizeOfResizeableTaskDp: number;

            /** DisplayContentProto inputMethodLayeringTargetIdentifier. */
            public inputMethodLayeringTargetIdentifier?: (perfetto.protos.IIdentifierProto|null);

            /** DisplayContentProto inputMethodInputTargetIdentifier. */
            public inputMethodInputTargetIdentifier?: (perfetto.protos.IIdentifierProto|null);

            /** DisplayContentProto inputMethodControlTargetIdentifier. */
            public inputMethodControlTargetIdentifier?: (perfetto.protos.IIdentifierProto|null);

            /** DisplayContentProto currentFocusIdentifier. */
            public currentFocusIdentifier?: (perfetto.protos.IIdentifierProto|null);

            /**
             * Creates a new DisplayContentProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DisplayContentProto instance
             */
            public static create(properties?: perfetto.protos.IDisplayContentProto): perfetto.protos.DisplayContentProto;

            /**
             * Encodes the specified DisplayContentProto message. Does not implicitly {@link perfetto.protos.DisplayContentProto.verify|verify} messages.
             * @param message DisplayContentProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IDisplayContentProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DisplayContentProto message, length delimited. Does not implicitly {@link perfetto.protos.DisplayContentProto.verify|verify} messages.
             * @param message DisplayContentProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IDisplayContentProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DisplayContentProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DisplayContentProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.DisplayContentProto;

            /**
             * Decodes a DisplayContentProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DisplayContentProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.DisplayContentProto;

            /**
             * Verifies a DisplayContentProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DisplayContentProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DisplayContentProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.DisplayContentProto;

            /**
             * Creates a plain object from a DisplayContentProto message. Also converts values to other types if specified.
             * @param message DisplayContentProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.DisplayContentProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DisplayContentProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DisplayContentProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a DisplayAreaProto. */
        interface IDisplayAreaProto {

            /** DisplayAreaProto windowContainer */
            windowContainer?: (perfetto.protos.IWindowContainerProto|null);

            /** DisplayAreaProto name */
            name?: (string|null);

            /** DisplayAreaProto children */
            children?: (perfetto.protos.IDisplayAreaChildProto[]|null);

            /** DisplayAreaProto isTaskDisplayArea */
            isTaskDisplayArea?: (boolean|null);

            /** DisplayAreaProto isRootDisplayArea */
            isRootDisplayArea?: (boolean|null);

            /** DisplayAreaProto featureId */
            featureId?: (number|null);

            /** DisplayAreaProto isOrganized */
            isOrganized?: (boolean|null);

            /** DisplayAreaProto isIgnoringOrientationRequest */
            isIgnoringOrientationRequest?: (boolean|null);
        }

        /** Represents a DisplayAreaProto. */
        class DisplayAreaProto implements IDisplayAreaProto {

            /**
             * Constructs a new DisplayAreaProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IDisplayAreaProto);

            /** DisplayAreaProto windowContainer. */
            public windowContainer?: (perfetto.protos.IWindowContainerProto|null);

            /** DisplayAreaProto name. */
            public name: string;

            /** DisplayAreaProto children. */
            public children: perfetto.protos.IDisplayAreaChildProto[];

            /** DisplayAreaProto isTaskDisplayArea. */
            public isTaskDisplayArea: boolean;

            /** DisplayAreaProto isRootDisplayArea. */
            public isRootDisplayArea: boolean;

            /** DisplayAreaProto featureId. */
            public featureId: number;

            /** DisplayAreaProto isOrganized. */
            public isOrganized: boolean;

            /** DisplayAreaProto isIgnoringOrientationRequest. */
            public isIgnoringOrientationRequest: boolean;

            /**
             * Creates a new DisplayAreaProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DisplayAreaProto instance
             */
            public static create(properties?: perfetto.protos.IDisplayAreaProto): perfetto.protos.DisplayAreaProto;

            /**
             * Encodes the specified DisplayAreaProto message. Does not implicitly {@link perfetto.protos.DisplayAreaProto.verify|verify} messages.
             * @param message DisplayAreaProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IDisplayAreaProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DisplayAreaProto message, length delimited. Does not implicitly {@link perfetto.protos.DisplayAreaProto.verify|verify} messages.
             * @param message DisplayAreaProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IDisplayAreaProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DisplayAreaProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DisplayAreaProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.DisplayAreaProto;

            /**
             * Decodes a DisplayAreaProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DisplayAreaProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.DisplayAreaProto;

            /**
             * Verifies a DisplayAreaProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DisplayAreaProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DisplayAreaProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.DisplayAreaProto;

            /**
             * Creates a plain object from a DisplayAreaProto message. Also converts values to other types if specified.
             * @param message DisplayAreaProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.DisplayAreaProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DisplayAreaProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DisplayAreaProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a DisplayAreaChildProto. */
        interface IDisplayAreaChildProto {

            /** DisplayAreaChildProto displayArea */
            displayArea?: (perfetto.protos.IDisplayAreaProto|null);

            /** DisplayAreaChildProto window */
            window?: (perfetto.protos.IWindowTokenProto|null);

            /** DisplayAreaChildProto unknown */
            unknown?: (string[]|null);
        }

        /** Represents a DisplayAreaChildProto. */
        class DisplayAreaChildProto implements IDisplayAreaChildProto {

            /**
             * Constructs a new DisplayAreaChildProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IDisplayAreaChildProto);

            /** DisplayAreaChildProto displayArea. */
            public displayArea?: (perfetto.protos.IDisplayAreaProto|null);

            /** DisplayAreaChildProto window. */
            public window?: (perfetto.protos.IWindowTokenProto|null);

            /** DisplayAreaChildProto unknown. */
            public unknown: string[];

            /**
             * Creates a new DisplayAreaChildProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DisplayAreaChildProto instance
             */
            public static create(properties?: perfetto.protos.IDisplayAreaChildProto): perfetto.protos.DisplayAreaChildProto;

            /**
             * Encodes the specified DisplayAreaChildProto message. Does not implicitly {@link perfetto.protos.DisplayAreaChildProto.verify|verify} messages.
             * @param message DisplayAreaChildProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IDisplayAreaChildProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DisplayAreaChildProto message, length delimited. Does not implicitly {@link perfetto.protos.DisplayAreaChildProto.verify|verify} messages.
             * @param message DisplayAreaChildProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IDisplayAreaChildProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DisplayAreaChildProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DisplayAreaChildProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.DisplayAreaChildProto;

            /**
             * Decodes a DisplayAreaChildProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DisplayAreaChildProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.DisplayAreaChildProto;

            /**
             * Verifies a DisplayAreaChildProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DisplayAreaChildProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DisplayAreaChildProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.DisplayAreaChildProto;

            /**
             * Creates a plain object from a DisplayAreaChildProto message. Also converts values to other types if specified.
             * @param message DisplayAreaChildProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.DisplayAreaChildProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DisplayAreaChildProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DisplayAreaChildProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a DisplayFramesProto. */
        interface IDisplayFramesProto {

            /** DisplayFramesProto stableBounds */
            stableBounds?: (perfetto.protos.IRectProto|null);

            /** DisplayFramesProto dock */
            dock?: (perfetto.protos.IRectProto|null);

            /** DisplayFramesProto current */
            current?: (perfetto.protos.IRectProto|null);
        }

        /** Represents a DisplayFramesProto. */
        class DisplayFramesProto implements IDisplayFramesProto {

            /**
             * Constructs a new DisplayFramesProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IDisplayFramesProto);

            /** DisplayFramesProto stableBounds. */
            public stableBounds?: (perfetto.protos.IRectProto|null);

            /** DisplayFramesProto dock. */
            public dock?: (perfetto.protos.IRectProto|null);

            /** DisplayFramesProto current. */
            public current?: (perfetto.protos.IRectProto|null);

            /**
             * Creates a new DisplayFramesProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DisplayFramesProto instance
             */
            public static create(properties?: perfetto.protos.IDisplayFramesProto): perfetto.protos.DisplayFramesProto;

            /**
             * Encodes the specified DisplayFramesProto message. Does not implicitly {@link perfetto.protos.DisplayFramesProto.verify|verify} messages.
             * @param message DisplayFramesProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IDisplayFramesProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DisplayFramesProto message, length delimited. Does not implicitly {@link perfetto.protos.DisplayFramesProto.verify|verify} messages.
             * @param message DisplayFramesProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IDisplayFramesProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DisplayFramesProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DisplayFramesProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.DisplayFramesProto;

            /**
             * Decodes a DisplayFramesProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DisplayFramesProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.DisplayFramesProto;

            /**
             * Verifies a DisplayFramesProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DisplayFramesProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DisplayFramesProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.DisplayFramesProto;

            /**
             * Creates a plain object from a DisplayFramesProto message. Also converts values to other types if specified.
             * @param message DisplayFramesProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.DisplayFramesProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DisplayFramesProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DisplayFramesProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a DisplayRotationProto. */
        interface IDisplayRotationProto {

            /** DisplayRotationProto rotation */
            rotation?: (number|null);

            /** DisplayRotationProto frozenToUserRotation */
            frozenToUserRotation?: (boolean|null);

            /** DisplayRotationProto userRotation */
            userRotation?: (number|null);

            /** DisplayRotationProto fixedToUserRotationMode */
            fixedToUserRotationMode?: (number|null);

            /** DisplayRotationProto lastOrientation */
            lastOrientation?: (number|null);

            /** DisplayRotationProto isFixedToUserRotation */
            isFixedToUserRotation?: (boolean|null);
        }

        /** Represents a DisplayRotationProto. */
        class DisplayRotationProto implements IDisplayRotationProto {

            /**
             * Constructs a new DisplayRotationProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IDisplayRotationProto);

            /** DisplayRotationProto rotation. */
            public rotation: number;

            /** DisplayRotationProto frozenToUserRotation. */
            public frozenToUserRotation: boolean;

            /** DisplayRotationProto userRotation. */
            public userRotation: number;

            /** DisplayRotationProto fixedToUserRotationMode. */
            public fixedToUserRotationMode: number;

            /** DisplayRotationProto lastOrientation. */
            public lastOrientation: number;

            /** DisplayRotationProto isFixedToUserRotation. */
            public isFixedToUserRotation: boolean;

            /**
             * Creates a new DisplayRotationProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DisplayRotationProto instance
             */
            public static create(properties?: perfetto.protos.IDisplayRotationProto): perfetto.protos.DisplayRotationProto;

            /**
             * Encodes the specified DisplayRotationProto message. Does not implicitly {@link perfetto.protos.DisplayRotationProto.verify|verify} messages.
             * @param message DisplayRotationProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IDisplayRotationProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DisplayRotationProto message, length delimited. Does not implicitly {@link perfetto.protos.DisplayRotationProto.verify|verify} messages.
             * @param message DisplayRotationProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IDisplayRotationProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DisplayRotationProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DisplayRotationProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.DisplayRotationProto;

            /**
             * Decodes a DisplayRotationProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DisplayRotationProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.DisplayRotationProto;

            /**
             * Verifies a DisplayRotationProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DisplayRotationProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DisplayRotationProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.DisplayRotationProto;

            /**
             * Creates a plain object from a DisplayRotationProto message. Also converts values to other types if specified.
             * @param message DisplayRotationProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.DisplayRotationProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DisplayRotationProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DisplayRotationProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a DockedTaskDividerControllerProto. */
        interface IDockedTaskDividerControllerProto {

            /** DockedTaskDividerControllerProto minimizedDock */
            minimizedDock?: (boolean|null);
        }

        /** Represents a DockedTaskDividerControllerProto. */
        class DockedTaskDividerControllerProto implements IDockedTaskDividerControllerProto {

            /**
             * Constructs a new DockedTaskDividerControllerProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IDockedTaskDividerControllerProto);

            /** DockedTaskDividerControllerProto minimizedDock. */
            public minimizedDock: boolean;

            /**
             * Creates a new DockedTaskDividerControllerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DockedTaskDividerControllerProto instance
             */
            public static create(properties?: perfetto.protos.IDockedTaskDividerControllerProto): perfetto.protos.DockedTaskDividerControllerProto;

            /**
             * Encodes the specified DockedTaskDividerControllerProto message. Does not implicitly {@link perfetto.protos.DockedTaskDividerControllerProto.verify|verify} messages.
             * @param message DockedTaskDividerControllerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IDockedTaskDividerControllerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DockedTaskDividerControllerProto message, length delimited. Does not implicitly {@link perfetto.protos.DockedTaskDividerControllerProto.verify|verify} messages.
             * @param message DockedTaskDividerControllerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IDockedTaskDividerControllerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DockedTaskDividerControllerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DockedTaskDividerControllerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.DockedTaskDividerControllerProto;

            /**
             * Decodes a DockedTaskDividerControllerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DockedTaskDividerControllerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.DockedTaskDividerControllerProto;

            /**
             * Verifies a DockedTaskDividerControllerProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DockedTaskDividerControllerProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DockedTaskDividerControllerProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.DockedTaskDividerControllerProto;

            /**
             * Creates a plain object from a DockedTaskDividerControllerProto message. Also converts values to other types if specified.
             * @param message DockedTaskDividerControllerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.DockedTaskDividerControllerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DockedTaskDividerControllerProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DockedTaskDividerControllerProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a PinnedTaskControllerProto. */
        interface IPinnedTaskControllerProto {

            /** PinnedTaskControllerProto defaultBounds */
            defaultBounds?: (perfetto.protos.IRectProto|null);

            /** PinnedTaskControllerProto movementBounds */
            movementBounds?: (perfetto.protos.IRectProto|null);
        }

        /** Represents a PinnedTaskControllerProto. */
        class PinnedTaskControllerProto implements IPinnedTaskControllerProto {

            /**
             * Constructs a new PinnedTaskControllerProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IPinnedTaskControllerProto);

            /** PinnedTaskControllerProto defaultBounds. */
            public defaultBounds?: (perfetto.protos.IRectProto|null);

            /** PinnedTaskControllerProto movementBounds. */
            public movementBounds?: (perfetto.protos.IRectProto|null);

            /**
             * Creates a new PinnedTaskControllerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PinnedTaskControllerProto instance
             */
            public static create(properties?: perfetto.protos.IPinnedTaskControllerProto): perfetto.protos.PinnedTaskControllerProto;

            /**
             * Encodes the specified PinnedTaskControllerProto message. Does not implicitly {@link perfetto.protos.PinnedTaskControllerProto.verify|verify} messages.
             * @param message PinnedTaskControllerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IPinnedTaskControllerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PinnedTaskControllerProto message, length delimited. Does not implicitly {@link perfetto.protos.PinnedTaskControllerProto.verify|verify} messages.
             * @param message PinnedTaskControllerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IPinnedTaskControllerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PinnedTaskControllerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PinnedTaskControllerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.PinnedTaskControllerProto;

            /**
             * Decodes a PinnedTaskControllerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PinnedTaskControllerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.PinnedTaskControllerProto;

            /**
             * Verifies a PinnedTaskControllerProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PinnedTaskControllerProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PinnedTaskControllerProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.PinnedTaskControllerProto;

            /**
             * Creates a plain object from a PinnedTaskControllerProto message. Also converts values to other types if specified.
             * @param message PinnedTaskControllerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.PinnedTaskControllerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PinnedTaskControllerProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for PinnedTaskControllerProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a TaskProto. */
        interface ITaskProto {

            /** TaskProto windowContainer */
            windowContainer?: (perfetto.protos.IWindowContainerProto|null);

            /** TaskProto id */
            id?: (number|null);

            /** TaskProto fillsParent */
            fillsParent?: (boolean|null);

            /** TaskProto bounds */
            bounds?: (perfetto.protos.IRectProto|null);

            /** TaskProto displayedBounds */
            displayedBounds?: (perfetto.protos.IRectProto|null);

            /** TaskProto deferRemoval */
            deferRemoval?: (boolean|null);

            /** TaskProto surfaceWidth */
            surfaceWidth?: (number|null);

            /** TaskProto surfaceHeight */
            surfaceHeight?: (number|null);

            /** TaskProto tasks */
            tasks?: (perfetto.protos.ITaskProto[]|null);

            /** TaskProto activities */
            activities?: (perfetto.protos.IActivityRecordProto[]|null);

            /** TaskProto resumedActivity */
            resumedActivity?: (perfetto.protos.IIdentifierProto|null);

            /** TaskProto realActivity */
            realActivity?: (string|null);

            /** TaskProto origActivity */
            origActivity?: (string|null);

            /** TaskProto displayId */
            displayId?: (number|null);

            /** TaskProto rootTaskId */
            rootTaskId?: (number|null);

            /** TaskProto activityType */
            activityType?: (number|null);

            /** TaskProto resizeMode */
            resizeMode?: (number|null);

            /** TaskProto minWidth */
            minWidth?: (number|null);

            /** TaskProto minHeight */
            minHeight?: (number|null);

            /** TaskProto adjustedBounds */
            adjustedBounds?: (perfetto.protos.IRectProto|null);

            /** TaskProto lastNonFullscreenBounds */
            lastNonFullscreenBounds?: (perfetto.protos.IRectProto|null);

            /** TaskProto adjustedForIme */
            adjustedForIme?: (boolean|null);

            /** TaskProto adjustImeAmount */
            adjustImeAmount?: (number|null);

            /** TaskProto adjustDividerAmount */
            adjustDividerAmount?: (number|null);

            /** TaskProto animatingBounds */
            animatingBounds?: (boolean|null);

            /** TaskProto minimizeAmount */
            minimizeAmount?: (number|null);

            /** TaskProto createdByOrganizer */
            createdByOrganizer?: (boolean|null);

            /** TaskProto affinity */
            affinity?: (string|null);

            /** TaskProto hasChildPipActivity */
            hasChildPipActivity?: (boolean|null);

            /** TaskProto taskFragment */
            taskFragment?: (perfetto.protos.ITaskFragmentProto|null);
        }

        /** Represents a TaskProto. */
        class TaskProto implements ITaskProto {

            /**
             * Constructs a new TaskProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.ITaskProto);

            /** TaskProto windowContainer. */
            public windowContainer?: (perfetto.protos.IWindowContainerProto|null);

            /** TaskProto id. */
            public id: number;

            /** TaskProto fillsParent. */
            public fillsParent: boolean;

            /** TaskProto bounds. */
            public bounds?: (perfetto.protos.IRectProto|null);

            /** TaskProto displayedBounds. */
            public displayedBounds?: (perfetto.protos.IRectProto|null);

            /** TaskProto deferRemoval. */
            public deferRemoval: boolean;

            /** TaskProto surfaceWidth. */
            public surfaceWidth: number;

            /** TaskProto surfaceHeight. */
            public surfaceHeight: number;

            /** TaskProto tasks. */
            public tasks: perfetto.protos.ITaskProto[];

            /** TaskProto activities. */
            public activities: perfetto.protos.IActivityRecordProto[];

            /** TaskProto resumedActivity. */
            public resumedActivity?: (perfetto.protos.IIdentifierProto|null);

            /** TaskProto realActivity. */
            public realActivity: string;

            /** TaskProto origActivity. */
            public origActivity: string;

            /** TaskProto displayId. */
            public displayId: number;

            /** TaskProto rootTaskId. */
            public rootTaskId: number;

            /** TaskProto activityType. */
            public activityType: number;

            /** TaskProto resizeMode. */
            public resizeMode: number;

            /** TaskProto minWidth. */
            public minWidth: number;

            /** TaskProto minHeight. */
            public minHeight: number;

            /** TaskProto adjustedBounds. */
            public adjustedBounds?: (perfetto.protos.IRectProto|null);

            /** TaskProto lastNonFullscreenBounds. */
            public lastNonFullscreenBounds?: (perfetto.protos.IRectProto|null);

            /** TaskProto adjustedForIme. */
            public adjustedForIme: boolean;

            /** TaskProto adjustImeAmount. */
            public adjustImeAmount: number;

            /** TaskProto adjustDividerAmount. */
            public adjustDividerAmount: number;

            /** TaskProto animatingBounds. */
            public animatingBounds: boolean;

            /** TaskProto minimizeAmount. */
            public minimizeAmount: number;

            /** TaskProto createdByOrganizer. */
            public createdByOrganizer: boolean;

            /** TaskProto affinity. */
            public affinity: string;

            /** TaskProto hasChildPipActivity. */
            public hasChildPipActivity: boolean;

            /** TaskProto taskFragment. */
            public taskFragment?: (perfetto.protos.ITaskFragmentProto|null);

            /**
             * Creates a new TaskProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns TaskProto instance
             */
            public static create(properties?: perfetto.protos.ITaskProto): perfetto.protos.TaskProto;

            /**
             * Encodes the specified TaskProto message. Does not implicitly {@link perfetto.protos.TaskProto.verify|verify} messages.
             * @param message TaskProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.ITaskProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified TaskProto message, length delimited. Does not implicitly {@link perfetto.protos.TaskProto.verify|verify} messages.
             * @param message TaskProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.ITaskProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a TaskProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns TaskProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.TaskProto;

            /**
             * Decodes a TaskProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns TaskProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.TaskProto;

            /**
             * Verifies a TaskProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a TaskProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns TaskProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.TaskProto;

            /**
             * Creates a plain object from a TaskProto message. Also converts values to other types if specified.
             * @param message TaskProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.TaskProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this TaskProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for TaskProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a TaskFragmentProto. */
        interface ITaskFragmentProto {

            /** TaskFragmentProto windowContainer */
            windowContainer?: (perfetto.protos.IWindowContainerProto|null);

            /** TaskFragmentProto displayId */
            displayId?: (number|null);

            /** TaskFragmentProto activityType */
            activityType?: (number|null);

            /** TaskFragmentProto minWidth */
            minWidth?: (number|null);

            /** TaskFragmentProto minHeight */
            minHeight?: (number|null);
        }

        /** Represents a TaskFragmentProto. */
        class TaskFragmentProto implements ITaskFragmentProto {

            /**
             * Constructs a new TaskFragmentProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.ITaskFragmentProto);

            /** TaskFragmentProto windowContainer. */
            public windowContainer?: (perfetto.protos.IWindowContainerProto|null);

            /** TaskFragmentProto displayId. */
            public displayId: number;

            /** TaskFragmentProto activityType. */
            public activityType: number;

            /** TaskFragmentProto minWidth. */
            public minWidth: number;

            /** TaskFragmentProto minHeight. */
            public minHeight: number;

            /**
             * Creates a new TaskFragmentProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns TaskFragmentProto instance
             */
            public static create(properties?: perfetto.protos.ITaskFragmentProto): perfetto.protos.TaskFragmentProto;

            /**
             * Encodes the specified TaskFragmentProto message. Does not implicitly {@link perfetto.protos.TaskFragmentProto.verify|verify} messages.
             * @param message TaskFragmentProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.ITaskFragmentProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified TaskFragmentProto message, length delimited. Does not implicitly {@link perfetto.protos.TaskFragmentProto.verify|verify} messages.
             * @param message TaskFragmentProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.ITaskFragmentProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a TaskFragmentProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns TaskFragmentProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.TaskFragmentProto;

            /**
             * Decodes a TaskFragmentProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns TaskFragmentProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.TaskFragmentProto;

            /**
             * Verifies a TaskFragmentProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a TaskFragmentProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns TaskFragmentProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.TaskFragmentProto;

            /**
             * Creates a plain object from a TaskFragmentProto message. Also converts values to other types if specified.
             * @param message TaskFragmentProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.TaskFragmentProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this TaskFragmentProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for TaskFragmentProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an ActivityRecordProto. */
        interface IActivityRecordProto {

            /** ActivityRecordProto name */
            name?: (string|null);

            /** ActivityRecordProto windowToken */
            windowToken?: (perfetto.protos.IWindowTokenProto|null);

            /** ActivityRecordProto lastSurfaceShowing */
            lastSurfaceShowing?: (boolean|null);

            /** ActivityRecordProto isWaitingForTransitionStart */
            isWaitingForTransitionStart?: (boolean|null);

            /** ActivityRecordProto isAnimating */
            isAnimating?: (boolean|null);

            /** ActivityRecordProto thumbnail */
            thumbnail?: (perfetto.protos.IWindowContainerThumbnailProto|null);

            /** ActivityRecordProto fillsParent */
            fillsParent?: (boolean|null);

            /** ActivityRecordProto appStopped */
            appStopped?: (boolean|null);

            /** ActivityRecordProto visibleRequested */
            visibleRequested?: (boolean|null);

            /** ActivityRecordProto clientVisible */
            clientVisible?: (boolean|null);

            /** ActivityRecordProto deferHidingClient */
            deferHidingClient?: (boolean|null);

            /** ActivityRecordProto reportedDrawn */
            reportedDrawn?: (boolean|null);

            /** ActivityRecordProto reportedVisible */
            reportedVisible?: (boolean|null);

            /** ActivityRecordProto numInterestingWindows */
            numInterestingWindows?: (number|null);

            /** ActivityRecordProto numDrawnWindows */
            numDrawnWindows?: (number|null);

            /** ActivityRecordProto allDrawn */
            allDrawn?: (boolean|null);

            /** ActivityRecordProto lastAllDrawn */
            lastAllDrawn?: (boolean|null);

            /** ActivityRecordProto startingWindow */
            startingWindow?: (perfetto.protos.IIdentifierProto|null);

            /** ActivityRecordProto startingDisplayed */
            startingDisplayed?: (boolean|null);

            /** ActivityRecordProto startingMoved */
            startingMoved?: (boolean|null);

            /** ActivityRecordProto visibleSetFromTransferredStartingWindow */
            visibleSetFromTransferredStartingWindow?: (boolean|null);

            /** ActivityRecordProto frozenBounds */
            frozenBounds?: (perfetto.protos.IRectProto[]|null);

            /** ActivityRecordProto visible */
            visible?: (boolean|null);

            /** ActivityRecordProto identifier */
            identifier?: (perfetto.protos.IIdentifierProto|null);

            /** ActivityRecordProto state */
            state?: (string|null);

            /** ActivityRecordProto frontOfTask */
            frontOfTask?: (boolean|null);

            /** ActivityRecordProto procId */
            procId?: (number|null);

            /** ActivityRecordProto translucent */
            translucent?: (boolean|null);

            /** ActivityRecordProto pipAutoEnterEnabled */
            pipAutoEnterEnabled?: (boolean|null);

            /** ActivityRecordProto inSizeCompatMode */
            inSizeCompatMode?: (boolean|null);

            /** ActivityRecordProto minAspectRatio */
            minAspectRatio?: (number|null);

            /** ActivityRecordProto providesMaxBounds */
            providesMaxBounds?: (boolean|null);

            /** ActivityRecordProto enableRecentsScreenshot */
            enableRecentsScreenshot?: (boolean|null);

            /** ActivityRecordProto lastDropInputMode */
            lastDropInputMode?: (number|null);

            /** ActivityRecordProto overrideOrientation */
            overrideOrientation?: (number|null);

            /** ActivityRecordProto shouldSendCompatFakeFocus */
            shouldSendCompatFakeFocus?: (boolean|null);

            /** ActivityRecordProto shouldForceRotateForCameraCompat */
            shouldForceRotateForCameraCompat?: (boolean|null);

            /** ActivityRecordProto shouldRefreshActivityForCameraCompat */
            shouldRefreshActivityForCameraCompat?: (boolean|null);

            /** ActivityRecordProto shouldRefreshActivityViaPauseForCameraCompat */
            shouldRefreshActivityViaPauseForCameraCompat?: (boolean|null);

            /** ActivityRecordProto shouldOverrideMinAspectRatio */
            shouldOverrideMinAspectRatio?: (boolean|null);

            /** ActivityRecordProto shouldIgnoreOrientationRequestLoop */
            shouldIgnoreOrientationRequestLoop?: (boolean|null);

            /** ActivityRecordProto shouldOverrideForceResizeApp */
            shouldOverrideForceResizeApp?: (boolean|null);

            /** ActivityRecordProto shouldEnableUserAspectRatioSettings */
            shouldEnableUserAspectRatioSettings?: (boolean|null);

            /** ActivityRecordProto isUserFullscreenOverrideEnabled */
            isUserFullscreenOverrideEnabled?: (boolean|null);
        }

        /** Represents an ActivityRecordProto. */
        class ActivityRecordProto implements IActivityRecordProto {

            /**
             * Constructs a new ActivityRecordProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IActivityRecordProto);

            /** ActivityRecordProto name. */
            public name: string;

            /** ActivityRecordProto windowToken. */
            public windowToken?: (perfetto.protos.IWindowTokenProto|null);

            /** ActivityRecordProto lastSurfaceShowing. */
            public lastSurfaceShowing: boolean;

            /** ActivityRecordProto isWaitingForTransitionStart. */
            public isWaitingForTransitionStart: boolean;

            /** ActivityRecordProto isAnimating. */
            public isAnimating: boolean;

            /** ActivityRecordProto thumbnail. */
            public thumbnail?: (perfetto.protos.IWindowContainerThumbnailProto|null);

            /** ActivityRecordProto fillsParent. */
            public fillsParent: boolean;

            /** ActivityRecordProto appStopped. */
            public appStopped: boolean;

            /** ActivityRecordProto visibleRequested. */
            public visibleRequested: boolean;

            /** ActivityRecordProto clientVisible. */
            public clientVisible: boolean;

            /** ActivityRecordProto deferHidingClient. */
            public deferHidingClient: boolean;

            /** ActivityRecordProto reportedDrawn. */
            public reportedDrawn: boolean;

            /** ActivityRecordProto reportedVisible. */
            public reportedVisible: boolean;

            /** ActivityRecordProto numInterestingWindows. */
            public numInterestingWindows: number;

            /** ActivityRecordProto numDrawnWindows. */
            public numDrawnWindows: number;

            /** ActivityRecordProto allDrawn. */
            public allDrawn: boolean;

            /** ActivityRecordProto lastAllDrawn. */
            public lastAllDrawn: boolean;

            /** ActivityRecordProto startingWindow. */
            public startingWindow?: (perfetto.protos.IIdentifierProto|null);

            /** ActivityRecordProto startingDisplayed. */
            public startingDisplayed: boolean;

            /** ActivityRecordProto startingMoved. */
            public startingMoved: boolean;

            /** ActivityRecordProto visibleSetFromTransferredStartingWindow. */
            public visibleSetFromTransferredStartingWindow: boolean;

            /** ActivityRecordProto frozenBounds. */
            public frozenBounds: perfetto.protos.IRectProto[];

            /** ActivityRecordProto visible. */
            public visible: boolean;

            /** ActivityRecordProto identifier. */
            public identifier?: (perfetto.protos.IIdentifierProto|null);

            /** ActivityRecordProto state. */
            public state: string;

            /** ActivityRecordProto frontOfTask. */
            public frontOfTask: boolean;

            /** ActivityRecordProto procId. */
            public procId: number;

            /** ActivityRecordProto translucent. */
            public translucent: boolean;

            /** ActivityRecordProto pipAutoEnterEnabled. */
            public pipAutoEnterEnabled: boolean;

            /** ActivityRecordProto inSizeCompatMode. */
            public inSizeCompatMode: boolean;

            /** ActivityRecordProto minAspectRatio. */
            public minAspectRatio: number;

            /** ActivityRecordProto providesMaxBounds. */
            public providesMaxBounds: boolean;

            /** ActivityRecordProto enableRecentsScreenshot. */
            public enableRecentsScreenshot: boolean;

            /** ActivityRecordProto lastDropInputMode. */
            public lastDropInputMode: number;

            /** ActivityRecordProto overrideOrientation. */
            public overrideOrientation: number;

            /** ActivityRecordProto shouldSendCompatFakeFocus. */
            public shouldSendCompatFakeFocus: boolean;

            /** ActivityRecordProto shouldForceRotateForCameraCompat. */
            public shouldForceRotateForCameraCompat: boolean;

            /** ActivityRecordProto shouldRefreshActivityForCameraCompat. */
            public shouldRefreshActivityForCameraCompat: boolean;

            /** ActivityRecordProto shouldRefreshActivityViaPauseForCameraCompat. */
            public shouldRefreshActivityViaPauseForCameraCompat: boolean;

            /** ActivityRecordProto shouldOverrideMinAspectRatio. */
            public shouldOverrideMinAspectRatio: boolean;

            /** ActivityRecordProto shouldIgnoreOrientationRequestLoop. */
            public shouldIgnoreOrientationRequestLoop: boolean;

            /** ActivityRecordProto shouldOverrideForceResizeApp. */
            public shouldOverrideForceResizeApp: boolean;

            /** ActivityRecordProto shouldEnableUserAspectRatioSettings. */
            public shouldEnableUserAspectRatioSettings: boolean;

            /** ActivityRecordProto isUserFullscreenOverrideEnabled. */
            public isUserFullscreenOverrideEnabled: boolean;

            /**
             * Creates a new ActivityRecordProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ActivityRecordProto instance
             */
            public static create(properties?: perfetto.protos.IActivityRecordProto): perfetto.protos.ActivityRecordProto;

            /**
             * Encodes the specified ActivityRecordProto message. Does not implicitly {@link perfetto.protos.ActivityRecordProto.verify|verify} messages.
             * @param message ActivityRecordProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IActivityRecordProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ActivityRecordProto message, length delimited. Does not implicitly {@link perfetto.protos.ActivityRecordProto.verify|verify} messages.
             * @param message ActivityRecordProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IActivityRecordProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ActivityRecordProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ActivityRecordProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ActivityRecordProto;

            /**
             * Decodes an ActivityRecordProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ActivityRecordProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ActivityRecordProto;

            /**
             * Verifies an ActivityRecordProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ActivityRecordProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ActivityRecordProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.ActivityRecordProto;

            /**
             * Creates a plain object from an ActivityRecordProto message. Also converts values to other types if specified.
             * @param message ActivityRecordProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.ActivityRecordProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ActivityRecordProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ActivityRecordProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a WindowTokenProto. */
        interface IWindowTokenProto {

            /** WindowTokenProto windowContainer */
            windowContainer?: (perfetto.protos.IWindowContainerProto|null);

            /** WindowTokenProto hashCode */
            hashCode?: (number|null);

            /** WindowTokenProto windows */
            windows?: (perfetto.protos.IWindowStateProto[]|null);

            /** WindowTokenProto waitingToShow */
            waitingToShow?: (boolean|null);

            /** WindowTokenProto paused */
            paused?: (boolean|null);
        }

        /** Represents a WindowTokenProto. */
        class WindowTokenProto implements IWindowTokenProto {

            /**
             * Constructs a new WindowTokenProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWindowTokenProto);

            /** WindowTokenProto windowContainer. */
            public windowContainer?: (perfetto.protos.IWindowContainerProto|null);

            /** WindowTokenProto hashCode. */
            public hashCode: number;

            /** WindowTokenProto windows. */
            public windows: perfetto.protos.IWindowStateProto[];

            /** WindowTokenProto waitingToShow. */
            public waitingToShow: boolean;

            /** WindowTokenProto paused. */
            public paused: boolean;

            /**
             * Creates a new WindowTokenProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WindowTokenProto instance
             */
            public static create(properties?: perfetto.protos.IWindowTokenProto): perfetto.protos.WindowTokenProto;

            /**
             * Encodes the specified WindowTokenProto message. Does not implicitly {@link perfetto.protos.WindowTokenProto.verify|verify} messages.
             * @param message WindowTokenProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IWindowTokenProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WindowTokenProto message, length delimited. Does not implicitly {@link perfetto.protos.WindowTokenProto.verify|verify} messages.
             * @param message WindowTokenProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IWindowTokenProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WindowTokenProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WindowTokenProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.WindowTokenProto;

            /**
             * Decodes a WindowTokenProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WindowTokenProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.WindowTokenProto;

            /**
             * Verifies a WindowTokenProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WindowTokenProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WindowTokenProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.WindowTokenProto;

            /**
             * Creates a plain object from a WindowTokenProto message. Also converts values to other types if specified.
             * @param message WindowTokenProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.WindowTokenProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WindowTokenProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WindowTokenProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a WindowStateProto. */
        interface IWindowStateProto {

            /** WindowStateProto windowContainer */
            windowContainer?: (perfetto.protos.IWindowContainerProto|null);

            /** WindowStateProto identifier */
            identifier?: (perfetto.protos.IIdentifierProto|null);

            /** WindowStateProto displayId */
            displayId?: (number|null);

            /** WindowStateProto stackId */
            stackId?: (number|null);

            /** WindowStateProto attributes */
            attributes?: (perfetto.protos.IWindowLayoutParamsProto|null);

            /** WindowStateProto givenContentInsets */
            givenContentInsets?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto frame */
            frame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto containingFrame */
            containingFrame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto parentFrame */
            parentFrame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto contentFrame */
            contentFrame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto contentInsets */
            contentInsets?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto surfaceInsets */
            surfaceInsets?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto animator */
            animator?: (perfetto.protos.IWindowStateAnimatorProto|null);

            /** WindowStateProto animatingExit */
            animatingExit?: (boolean|null);

            /** WindowStateProto childWindows */
            childWindows?: (perfetto.protos.IWindowStateProto[]|null);

            /** WindowStateProto surfacePosition */
            surfacePosition?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto requestedWidth */
            requestedWidth?: (number|null);

            /** WindowStateProto requestedHeight */
            requestedHeight?: (number|null);

            /** WindowStateProto viewVisibility */
            viewVisibility?: (number|null);

            /** WindowStateProto systemUiVisibility */
            systemUiVisibility?: (number|null);

            /** WindowStateProto hasSurface */
            hasSurface?: (boolean|null);

            /** WindowStateProto isReadyForDisplay */
            isReadyForDisplay?: (boolean|null);

            /** WindowStateProto displayFrame */
            displayFrame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto overscanFrame */
            overscanFrame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto visibleFrame */
            visibleFrame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto decorFrame */
            decorFrame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto outsetFrame */
            outsetFrame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto overscanInsets */
            overscanInsets?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto visibleInsets */
            visibleInsets?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto stableInsets */
            stableInsets?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto outsets */
            outsets?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto cutout */
            cutout?: (perfetto.protos.IDisplayCutoutProto|null);

            /** WindowStateProto removeOnExit */
            removeOnExit?: (boolean|null);

            /** WindowStateProto destroying */
            destroying?: (boolean|null);

            /** WindowStateProto removed */
            removed?: (boolean|null);

            /** WindowStateProto isOnScreen */
            isOnScreen?: (boolean|null);

            /** WindowStateProto isVisible */
            isVisible?: (boolean|null);

            /** WindowStateProto pendingSeamlessRotation */
            pendingSeamlessRotation?: (boolean|null);

            /** WindowStateProto finishedSeamlessRotationFrame */
            finishedSeamlessRotationFrame?: (Long|null);

            /** WindowStateProto windowFrames */
            windowFrames?: (perfetto.protos.IWindowFramesProto|null);

            /** WindowStateProto forceSeamlessRotation */
            forceSeamlessRotation?: (boolean|null);

            /** WindowStateProto hasCompatScale */
            hasCompatScale?: (boolean|null);

            /** WindowStateProto globalScale */
            globalScale?: (number|null);

            /** WindowStateProto keepClearAreas */
            keepClearAreas?: (perfetto.protos.IRectProto[]|null);

            /** WindowStateProto unrestrictedKeepClearAreas */
            unrestrictedKeepClearAreas?: (perfetto.protos.IRectProto[]|null);

            /** WindowStateProto mergedLocalInsetsSources */
            mergedLocalInsetsSources?: (perfetto.protos.IInsetsSourceProto[]|null);

            /** WindowStateProto requestedVisibleTypes */
            requestedVisibleTypes?: (number|null);

            /** WindowStateProto dimBounds */
            dimBounds?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto prepareSyncSeqId */
            prepareSyncSeqId?: (number|null);

            /** WindowStateProto syncSeqId */
            syncSeqId?: (number|null);
        }

        /** Represents a WindowStateProto. */
        class WindowStateProto implements IWindowStateProto {

            /**
             * Constructs a new WindowStateProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWindowStateProto);

            /** WindowStateProto windowContainer. */
            public windowContainer?: (perfetto.protos.IWindowContainerProto|null);

            /** WindowStateProto identifier. */
            public identifier?: (perfetto.protos.IIdentifierProto|null);

            /** WindowStateProto displayId. */
            public displayId: number;

            /** WindowStateProto stackId. */
            public stackId: number;

            /** WindowStateProto attributes. */
            public attributes?: (perfetto.protos.IWindowLayoutParamsProto|null);

            /** WindowStateProto givenContentInsets. */
            public givenContentInsets?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto frame. */
            public frame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto containingFrame. */
            public containingFrame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto parentFrame. */
            public parentFrame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto contentFrame. */
            public contentFrame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto contentInsets. */
            public contentInsets?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto surfaceInsets. */
            public surfaceInsets?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto animator. */
            public animator?: (perfetto.protos.IWindowStateAnimatorProto|null);

            /** WindowStateProto animatingExit. */
            public animatingExit: boolean;

            /** WindowStateProto childWindows. */
            public childWindows: perfetto.protos.IWindowStateProto[];

            /** WindowStateProto surfacePosition. */
            public surfacePosition?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto requestedWidth. */
            public requestedWidth: number;

            /** WindowStateProto requestedHeight. */
            public requestedHeight: number;

            /** WindowStateProto viewVisibility. */
            public viewVisibility: number;

            /** WindowStateProto systemUiVisibility. */
            public systemUiVisibility: number;

            /** WindowStateProto hasSurface. */
            public hasSurface: boolean;

            /** WindowStateProto isReadyForDisplay. */
            public isReadyForDisplay: boolean;

            /** WindowStateProto displayFrame. */
            public displayFrame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto overscanFrame. */
            public overscanFrame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto visibleFrame. */
            public visibleFrame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto decorFrame. */
            public decorFrame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto outsetFrame. */
            public outsetFrame?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto overscanInsets. */
            public overscanInsets?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto visibleInsets. */
            public visibleInsets?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto stableInsets. */
            public stableInsets?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto outsets. */
            public outsets?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto cutout. */
            public cutout?: (perfetto.protos.IDisplayCutoutProto|null);

            /** WindowStateProto removeOnExit. */
            public removeOnExit: boolean;

            /** WindowStateProto destroying. */
            public destroying: boolean;

            /** WindowStateProto removed. */
            public removed: boolean;

            /** WindowStateProto isOnScreen. */
            public isOnScreen: boolean;

            /** WindowStateProto isVisible. */
            public isVisible: boolean;

            /** WindowStateProto pendingSeamlessRotation. */
            public pendingSeamlessRotation: boolean;

            /** WindowStateProto finishedSeamlessRotationFrame. */
            public finishedSeamlessRotationFrame: Long;

            /** WindowStateProto windowFrames. */
            public windowFrames?: (perfetto.protos.IWindowFramesProto|null);

            /** WindowStateProto forceSeamlessRotation. */
            public forceSeamlessRotation: boolean;

            /** WindowStateProto hasCompatScale. */
            public hasCompatScale: boolean;

            /** WindowStateProto globalScale. */
            public globalScale: number;

            /** WindowStateProto keepClearAreas. */
            public keepClearAreas: perfetto.protos.IRectProto[];

            /** WindowStateProto unrestrictedKeepClearAreas. */
            public unrestrictedKeepClearAreas: perfetto.protos.IRectProto[];

            /** WindowStateProto mergedLocalInsetsSources. */
            public mergedLocalInsetsSources: perfetto.protos.IInsetsSourceProto[];

            /** WindowStateProto requestedVisibleTypes. */
            public requestedVisibleTypes: number;

            /** WindowStateProto dimBounds. */
            public dimBounds?: (perfetto.protos.IRectProto|null);

            /** WindowStateProto prepareSyncSeqId. */
            public prepareSyncSeqId: number;

            /** WindowStateProto syncSeqId. */
            public syncSeqId: number;

            /**
             * Creates a new WindowStateProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WindowStateProto instance
             */
            public static create(properties?: perfetto.protos.IWindowStateProto): perfetto.protos.WindowStateProto;

            /**
             * Encodes the specified WindowStateProto message. Does not implicitly {@link perfetto.protos.WindowStateProto.verify|verify} messages.
             * @param message WindowStateProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IWindowStateProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WindowStateProto message, length delimited. Does not implicitly {@link perfetto.protos.WindowStateProto.verify|verify} messages.
             * @param message WindowStateProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IWindowStateProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WindowStateProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WindowStateProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.WindowStateProto;

            /**
             * Decodes a WindowStateProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WindowStateProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.WindowStateProto;

            /**
             * Verifies a WindowStateProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WindowStateProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WindowStateProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.WindowStateProto;

            /**
             * Creates a plain object from a WindowStateProto message. Also converts values to other types if specified.
             * @param message WindowStateProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.WindowStateProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WindowStateProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WindowStateProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an IdentifierProto. */
        interface IIdentifierProto {

            /** IdentifierProto hashCode */
            hashCode?: (number|null);

            /** IdentifierProto userId */
            userId?: (number|null);

            /** IdentifierProto title */
            title?: (string|null);
        }

        /** Represents an IdentifierProto. */
        class IdentifierProto implements IIdentifierProto {

            /**
             * Constructs a new IdentifierProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IIdentifierProto);

            /** IdentifierProto hashCode. */
            public hashCode: number;

            /** IdentifierProto userId. */
            public userId: number;

            /** IdentifierProto title. */
            public title: string;

            /**
             * Creates a new IdentifierProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns IdentifierProto instance
             */
            public static create(properties?: perfetto.protos.IIdentifierProto): perfetto.protos.IdentifierProto;

            /**
             * Encodes the specified IdentifierProto message. Does not implicitly {@link perfetto.protos.IdentifierProto.verify|verify} messages.
             * @param message IdentifierProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IIdentifierProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified IdentifierProto message, length delimited. Does not implicitly {@link perfetto.protos.IdentifierProto.verify|verify} messages.
             * @param message IdentifierProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IIdentifierProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an IdentifierProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns IdentifierProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.IdentifierProto;

            /**
             * Decodes an IdentifierProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns IdentifierProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.IdentifierProto;

            /**
             * Verifies an IdentifierProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an IdentifierProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns IdentifierProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.IdentifierProto;

            /**
             * Creates a plain object from an IdentifierProto message. Also converts values to other types if specified.
             * @param message IdentifierProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.IdentifierProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this IdentifierProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for IdentifierProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a WindowStateAnimatorProto. */
        interface IWindowStateAnimatorProto {

            /** WindowStateAnimatorProto lastClipRect */
            lastClipRect?: (perfetto.protos.IRectProto|null);

            /** WindowStateAnimatorProto surface */
            surface?: (perfetto.protos.IWindowSurfaceControllerProto|null);

            /** WindowStateAnimatorProto drawState */
            drawState?: (perfetto.protos.WindowStateAnimatorProto.DrawState|null);

            /** WindowStateAnimatorProto systemDecorRect */
            systemDecorRect?: (perfetto.protos.IRectProto|null);
        }

        /** Represents a WindowStateAnimatorProto. */
        class WindowStateAnimatorProto implements IWindowStateAnimatorProto {

            /**
             * Constructs a new WindowStateAnimatorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWindowStateAnimatorProto);

            /** WindowStateAnimatorProto lastClipRect. */
            public lastClipRect?: (perfetto.protos.IRectProto|null);

            /** WindowStateAnimatorProto surface. */
            public surface?: (perfetto.protos.IWindowSurfaceControllerProto|null);

            /** WindowStateAnimatorProto drawState. */
            public drawState: perfetto.protos.WindowStateAnimatorProto.DrawState;

            /** WindowStateAnimatorProto systemDecorRect. */
            public systemDecorRect?: (perfetto.protos.IRectProto|null);

            /**
             * Creates a new WindowStateAnimatorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WindowStateAnimatorProto instance
             */
            public static create(properties?: perfetto.protos.IWindowStateAnimatorProto): perfetto.protos.WindowStateAnimatorProto;

            /**
             * Encodes the specified WindowStateAnimatorProto message. Does not implicitly {@link perfetto.protos.WindowStateAnimatorProto.verify|verify} messages.
             * @param message WindowStateAnimatorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IWindowStateAnimatorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WindowStateAnimatorProto message, length delimited. Does not implicitly {@link perfetto.protos.WindowStateAnimatorProto.verify|verify} messages.
             * @param message WindowStateAnimatorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IWindowStateAnimatorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WindowStateAnimatorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WindowStateAnimatorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.WindowStateAnimatorProto;

            /**
             * Decodes a WindowStateAnimatorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WindowStateAnimatorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.WindowStateAnimatorProto;

            /**
             * Verifies a WindowStateAnimatorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WindowStateAnimatorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WindowStateAnimatorProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.WindowStateAnimatorProto;

            /**
             * Creates a plain object from a WindowStateAnimatorProto message. Also converts values to other types if specified.
             * @param message WindowStateAnimatorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.WindowStateAnimatorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WindowStateAnimatorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WindowStateAnimatorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace WindowStateAnimatorProto {

            /** DrawState enum. */
            enum DrawState {
                NO_SURFACE = 0,
                DRAW_PENDING = 1,
                COMMIT_DRAW_PENDING = 2,
                READY_TO_SHOW = 3,
                HAS_DRAWN = 4
            }
        }

        /** Properties of a WindowSurfaceControllerProto. */
        interface IWindowSurfaceControllerProto {

            /** WindowSurfaceControllerProto shown */
            shown?: (boolean|null);

            /** WindowSurfaceControllerProto layer */
            layer?: (number|null);
        }

        /** Represents a WindowSurfaceControllerProto. */
        class WindowSurfaceControllerProto implements IWindowSurfaceControllerProto {

            /**
             * Constructs a new WindowSurfaceControllerProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWindowSurfaceControllerProto);

            /** WindowSurfaceControllerProto shown. */
            public shown: boolean;

            /** WindowSurfaceControllerProto layer. */
            public layer: number;

            /**
             * Creates a new WindowSurfaceControllerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WindowSurfaceControllerProto instance
             */
            public static create(properties?: perfetto.protos.IWindowSurfaceControllerProto): perfetto.protos.WindowSurfaceControllerProto;

            /**
             * Encodes the specified WindowSurfaceControllerProto message. Does not implicitly {@link perfetto.protos.WindowSurfaceControllerProto.verify|verify} messages.
             * @param message WindowSurfaceControllerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IWindowSurfaceControllerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WindowSurfaceControllerProto message, length delimited. Does not implicitly {@link perfetto.protos.WindowSurfaceControllerProto.verify|verify} messages.
             * @param message WindowSurfaceControllerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IWindowSurfaceControllerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WindowSurfaceControllerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WindowSurfaceControllerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.WindowSurfaceControllerProto;

            /**
             * Decodes a WindowSurfaceControllerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WindowSurfaceControllerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.WindowSurfaceControllerProto;

            /**
             * Verifies a WindowSurfaceControllerProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WindowSurfaceControllerProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WindowSurfaceControllerProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.WindowSurfaceControllerProto;

            /**
             * Creates a plain object from a WindowSurfaceControllerProto message. Also converts values to other types if specified.
             * @param message WindowSurfaceControllerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.WindowSurfaceControllerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WindowSurfaceControllerProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WindowSurfaceControllerProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ScreenRotationAnimationProto. */
        interface IScreenRotationAnimationProto {

            /** ScreenRotationAnimationProto started */
            started?: (boolean|null);

            /** ScreenRotationAnimationProto animationRunning */
            animationRunning?: (boolean|null);
        }

        /** Represents a ScreenRotationAnimationProto. */
        class ScreenRotationAnimationProto implements IScreenRotationAnimationProto {

            /**
             * Constructs a new ScreenRotationAnimationProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IScreenRotationAnimationProto);

            /** ScreenRotationAnimationProto started. */
            public started: boolean;

            /** ScreenRotationAnimationProto animationRunning. */
            public animationRunning: boolean;

            /**
             * Creates a new ScreenRotationAnimationProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ScreenRotationAnimationProto instance
             */
            public static create(properties?: perfetto.protos.IScreenRotationAnimationProto): perfetto.protos.ScreenRotationAnimationProto;

            /**
             * Encodes the specified ScreenRotationAnimationProto message. Does not implicitly {@link perfetto.protos.ScreenRotationAnimationProto.verify|verify} messages.
             * @param message ScreenRotationAnimationProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IScreenRotationAnimationProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ScreenRotationAnimationProto message, length delimited. Does not implicitly {@link perfetto.protos.ScreenRotationAnimationProto.verify|verify} messages.
             * @param message ScreenRotationAnimationProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IScreenRotationAnimationProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ScreenRotationAnimationProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ScreenRotationAnimationProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ScreenRotationAnimationProto;

            /**
             * Decodes a ScreenRotationAnimationProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ScreenRotationAnimationProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ScreenRotationAnimationProto;

            /**
             * Verifies a ScreenRotationAnimationProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ScreenRotationAnimationProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ScreenRotationAnimationProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.ScreenRotationAnimationProto;

            /**
             * Creates a plain object from a ScreenRotationAnimationProto message. Also converts values to other types if specified.
             * @param message ScreenRotationAnimationProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.ScreenRotationAnimationProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ScreenRotationAnimationProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ScreenRotationAnimationProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a WindowContainerProto. */
        interface IWindowContainerProto {

            /** WindowContainerProto configurationContainer */
            configurationContainer?: (perfetto.protos.IConfigurationContainerProto|null);

            /** WindowContainerProto orientation */
            orientation?: (number|null);

            /** WindowContainerProto visible */
            visible?: (boolean|null);

            /** WindowContainerProto surfaceAnimator */
            surfaceAnimator?: (perfetto.protos.ISurfaceAnimatorProto|null);

            /** WindowContainerProto children */
            children?: (perfetto.protos.IWindowContainerChildProto[]|null);

            /** WindowContainerProto identifier */
            identifier?: (perfetto.protos.IIdentifierProto|null);

            /** WindowContainerProto surfaceControl */
            surfaceControl?: (perfetto.protos.ISurfaceControlProto|null);
        }

        /** Represents a WindowContainerProto. */
        class WindowContainerProto implements IWindowContainerProto {

            /**
             * Constructs a new WindowContainerProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWindowContainerProto);

            /** WindowContainerProto configurationContainer. */
            public configurationContainer?: (perfetto.protos.IConfigurationContainerProto|null);

            /** WindowContainerProto orientation. */
            public orientation: number;

            /** WindowContainerProto visible. */
            public visible: boolean;

            /** WindowContainerProto surfaceAnimator. */
            public surfaceAnimator?: (perfetto.protos.ISurfaceAnimatorProto|null);

            /** WindowContainerProto children. */
            public children: perfetto.protos.IWindowContainerChildProto[];

            /** WindowContainerProto identifier. */
            public identifier?: (perfetto.protos.IIdentifierProto|null);

            /** WindowContainerProto surfaceControl. */
            public surfaceControl?: (perfetto.protos.ISurfaceControlProto|null);

            /**
             * Creates a new WindowContainerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WindowContainerProto instance
             */
            public static create(properties?: perfetto.protos.IWindowContainerProto): perfetto.protos.WindowContainerProto;

            /**
             * Encodes the specified WindowContainerProto message. Does not implicitly {@link perfetto.protos.WindowContainerProto.verify|verify} messages.
             * @param message WindowContainerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IWindowContainerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WindowContainerProto message, length delimited. Does not implicitly {@link perfetto.protos.WindowContainerProto.verify|verify} messages.
             * @param message WindowContainerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IWindowContainerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WindowContainerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WindowContainerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.WindowContainerProto;

            /**
             * Decodes a WindowContainerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WindowContainerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.WindowContainerProto;

            /**
             * Verifies a WindowContainerProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WindowContainerProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WindowContainerProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.WindowContainerProto;

            /**
             * Creates a plain object from a WindowContainerProto message. Also converts values to other types if specified.
             * @param message WindowContainerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.WindowContainerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WindowContainerProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WindowContainerProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a WindowContainerChildProto. */
        interface IWindowContainerChildProto {

            /** WindowContainerChildProto windowContainer */
            windowContainer?: (perfetto.protos.IWindowContainerProto|null);

            /** WindowContainerChildProto displayContent */
            displayContent?: (perfetto.protos.IDisplayContentProto|null);

            /** WindowContainerChildProto displayArea */
            displayArea?: (perfetto.protos.IDisplayAreaProto|null);

            /** WindowContainerChildProto task */
            task?: (perfetto.protos.ITaskProto|null);

            /** WindowContainerChildProto activity */
            activity?: (perfetto.protos.IActivityRecordProto|null);

            /** WindowContainerChildProto windowToken */
            windowToken?: (perfetto.protos.IWindowTokenProto|null);

            /** WindowContainerChildProto window */
            window?: (perfetto.protos.IWindowStateProto|null);

            /** WindowContainerChildProto taskFragment */
            taskFragment?: (perfetto.protos.ITaskFragmentProto|null);
        }

        /** Represents a WindowContainerChildProto. */
        class WindowContainerChildProto implements IWindowContainerChildProto {

            /**
             * Constructs a new WindowContainerChildProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWindowContainerChildProto);

            /** WindowContainerChildProto windowContainer. */
            public windowContainer?: (perfetto.protos.IWindowContainerProto|null);

            /** WindowContainerChildProto displayContent. */
            public displayContent?: (perfetto.protos.IDisplayContentProto|null);

            /** WindowContainerChildProto displayArea. */
            public displayArea?: (perfetto.protos.IDisplayAreaProto|null);

            /** WindowContainerChildProto task. */
            public task?: (perfetto.protos.ITaskProto|null);

            /** WindowContainerChildProto activity. */
            public activity?: (perfetto.protos.IActivityRecordProto|null);

            /** WindowContainerChildProto windowToken. */
            public windowToken?: (perfetto.protos.IWindowTokenProto|null);

            /** WindowContainerChildProto window. */
            public window?: (perfetto.protos.IWindowStateProto|null);

            /** WindowContainerChildProto taskFragment. */
            public taskFragment?: (perfetto.protos.ITaskFragmentProto|null);

            /**
             * Creates a new WindowContainerChildProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WindowContainerChildProto instance
             */
            public static create(properties?: perfetto.protos.IWindowContainerChildProto): perfetto.protos.WindowContainerChildProto;

            /**
             * Encodes the specified WindowContainerChildProto message. Does not implicitly {@link perfetto.protos.WindowContainerChildProto.verify|verify} messages.
             * @param message WindowContainerChildProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IWindowContainerChildProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WindowContainerChildProto message, length delimited. Does not implicitly {@link perfetto.protos.WindowContainerChildProto.verify|verify} messages.
             * @param message WindowContainerChildProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IWindowContainerChildProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WindowContainerChildProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WindowContainerChildProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.WindowContainerChildProto;

            /**
             * Decodes a WindowContainerChildProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WindowContainerChildProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.WindowContainerChildProto;

            /**
             * Verifies a WindowContainerChildProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WindowContainerChildProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WindowContainerChildProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.WindowContainerChildProto;

            /**
             * Creates a plain object from a WindowContainerChildProto message. Also converts values to other types if specified.
             * @param message WindowContainerChildProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.WindowContainerChildProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WindowContainerChildProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WindowContainerChildProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ConfigurationContainerProto. */
        interface IConfigurationContainerProto {

            /** ConfigurationContainerProto overrideConfiguration */
            overrideConfiguration?: (perfetto.protos.IConfigurationProto|null);

            /** ConfigurationContainerProto fullConfiguration */
            fullConfiguration?: (perfetto.protos.IConfigurationProto|null);

            /** ConfigurationContainerProto mergedOverrideConfiguration */
            mergedOverrideConfiguration?: (perfetto.protos.IConfigurationProto|null);
        }

        /** Represents a ConfigurationContainerProto. */
        class ConfigurationContainerProto implements IConfigurationContainerProto {

            /**
             * Constructs a new ConfigurationContainerProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IConfigurationContainerProto);

            /** ConfigurationContainerProto overrideConfiguration. */
            public overrideConfiguration?: (perfetto.protos.IConfigurationProto|null);

            /** ConfigurationContainerProto fullConfiguration. */
            public fullConfiguration?: (perfetto.protos.IConfigurationProto|null);

            /** ConfigurationContainerProto mergedOverrideConfiguration. */
            public mergedOverrideConfiguration?: (perfetto.protos.IConfigurationProto|null);

            /**
             * Creates a new ConfigurationContainerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ConfigurationContainerProto instance
             */
            public static create(properties?: perfetto.protos.IConfigurationContainerProto): perfetto.protos.ConfigurationContainerProto;

            /**
             * Encodes the specified ConfigurationContainerProto message. Does not implicitly {@link perfetto.protos.ConfigurationContainerProto.verify|verify} messages.
             * @param message ConfigurationContainerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IConfigurationContainerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ConfigurationContainerProto message, length delimited. Does not implicitly {@link perfetto.protos.ConfigurationContainerProto.verify|verify} messages.
             * @param message ConfigurationContainerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IConfigurationContainerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ConfigurationContainerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ConfigurationContainerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ConfigurationContainerProto;

            /**
             * Decodes a ConfigurationContainerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ConfigurationContainerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ConfigurationContainerProto;

            /**
             * Verifies a ConfigurationContainerProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ConfigurationContainerProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ConfigurationContainerProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.ConfigurationContainerProto;

            /**
             * Creates a plain object from a ConfigurationContainerProto message. Also converts values to other types if specified.
             * @param message ConfigurationContainerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.ConfigurationContainerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ConfigurationContainerProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ConfigurationContainerProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a WindowFramesProto. */
        interface IWindowFramesProto {

            /** WindowFramesProto containingFrame */
            containingFrame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto contentFrame */
            contentFrame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto decorFrame */
            decorFrame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto displayFrame */
            displayFrame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto frame */
            frame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto outsetFrame */
            outsetFrame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto overscanFrame */
            overscanFrame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto parentFrame */
            parentFrame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto visibleFrame */
            visibleFrame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto cutout */
            cutout?: (perfetto.protos.IDisplayCutoutProto|null);

            /** WindowFramesProto contentInsets */
            contentInsets?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto overscanInsets */
            overscanInsets?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto visibleInsets */
            visibleInsets?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto stableInsets */
            stableInsets?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto outsets */
            outsets?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto compatFrame */
            compatFrame?: (perfetto.protos.IRectProto|null);
        }

        /** Represents a WindowFramesProto. */
        class WindowFramesProto implements IWindowFramesProto {

            /**
             * Constructs a new WindowFramesProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWindowFramesProto);

            /** WindowFramesProto containingFrame. */
            public containingFrame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto contentFrame. */
            public contentFrame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto decorFrame. */
            public decorFrame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto displayFrame. */
            public displayFrame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto frame. */
            public frame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto outsetFrame. */
            public outsetFrame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto overscanFrame. */
            public overscanFrame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto parentFrame. */
            public parentFrame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto visibleFrame. */
            public visibleFrame?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto cutout. */
            public cutout?: (perfetto.protos.IDisplayCutoutProto|null);

            /** WindowFramesProto contentInsets. */
            public contentInsets?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto overscanInsets. */
            public overscanInsets?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto visibleInsets. */
            public visibleInsets?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto stableInsets. */
            public stableInsets?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto outsets. */
            public outsets?: (perfetto.protos.IRectProto|null);

            /** WindowFramesProto compatFrame. */
            public compatFrame?: (perfetto.protos.IRectProto|null);

            /**
             * Creates a new WindowFramesProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WindowFramesProto instance
             */
            public static create(properties?: perfetto.protos.IWindowFramesProto): perfetto.protos.WindowFramesProto;

            /**
             * Encodes the specified WindowFramesProto message. Does not implicitly {@link perfetto.protos.WindowFramesProto.verify|verify} messages.
             * @param message WindowFramesProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IWindowFramesProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WindowFramesProto message, length delimited. Does not implicitly {@link perfetto.protos.WindowFramesProto.verify|verify} messages.
             * @param message WindowFramesProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IWindowFramesProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WindowFramesProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WindowFramesProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.WindowFramesProto;

            /**
             * Decodes a WindowFramesProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WindowFramesProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.WindowFramesProto;

            /**
             * Verifies a WindowFramesProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WindowFramesProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WindowFramesProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.WindowFramesProto;

            /**
             * Creates a plain object from a WindowFramesProto message. Also converts values to other types if specified.
             * @param message WindowFramesProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.WindowFramesProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WindowFramesProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WindowFramesProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an InsetsSourceProviderProto. */
        interface IInsetsSourceProviderProto {

            /** InsetsSourceProviderProto source */
            source?: (perfetto.protos.IInsetsSourceProto|null);

            /** InsetsSourceProviderProto frame */
            frame?: (perfetto.protos.IRectProto|null);

            /** InsetsSourceProviderProto fakeControl */
            fakeControl?: (perfetto.protos.IInsetsSourceControlProto|null);

            /** InsetsSourceProviderProto control */
            control?: (perfetto.protos.IInsetsSourceControlProto|null);

            /** InsetsSourceProviderProto controlTarget */
            controlTarget?: (perfetto.protos.IWindowStateProto|null);

            /** InsetsSourceProviderProto pendingControlTarget */
            pendingControlTarget?: (perfetto.protos.IWindowStateProto|null);

            /** InsetsSourceProviderProto fakeControlTarget */
            fakeControlTarget?: (perfetto.protos.IWindowStateProto|null);

            /** InsetsSourceProviderProto capturedLeash */
            capturedLeash?: (perfetto.protos.ISurfaceControlProto|null);

            /** InsetsSourceProviderProto imeOverriddenFrame */
            imeOverriddenFrame?: (perfetto.protos.IRectProto|null);

            /** InsetsSourceProviderProto isLeashReadyForDispatching */
            isLeashReadyForDispatching?: (boolean|null);

            /** InsetsSourceProviderProto clientVisible */
            clientVisible?: (boolean|null);

            /** InsetsSourceProviderProto serverVisible */
            serverVisible?: (boolean|null);

            /** InsetsSourceProviderProto seamlessRotating */
            seamlessRotating?: (boolean|null);

            /** InsetsSourceProviderProto finishSeamlessRotateFrameNumber */
            finishSeamlessRotateFrameNumber?: (Long|null);

            /** InsetsSourceProviderProto controllable */
            controllable?: (boolean|null);

            /** InsetsSourceProviderProto sourceWindowState */
            sourceWindowState?: (perfetto.protos.IWindowStateProto|null);

            /** InsetsSourceProviderProto controlTargetIdentifier */
            controlTargetIdentifier?: (perfetto.protos.IIdentifierProto|null);

            /** InsetsSourceProviderProto pendingControlTargetIdentifier */
            pendingControlTargetIdentifier?: (perfetto.protos.IIdentifierProto|null);

            /** InsetsSourceProviderProto fakeControlTargetIdentifier */
            fakeControlTargetIdentifier?: (perfetto.protos.IIdentifierProto|null);

            /** InsetsSourceProviderProto sourceWindowStateIdentifier */
            sourceWindowStateIdentifier?: (perfetto.protos.IIdentifierProto|null);
        }

        /** Represents an InsetsSourceProviderProto. */
        class InsetsSourceProviderProto implements IInsetsSourceProviderProto {

            /**
             * Constructs a new InsetsSourceProviderProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IInsetsSourceProviderProto);

            /** InsetsSourceProviderProto source. */
            public source?: (perfetto.protos.IInsetsSourceProto|null);

            /** InsetsSourceProviderProto frame. */
            public frame?: (perfetto.protos.IRectProto|null);

            /** InsetsSourceProviderProto fakeControl. */
            public fakeControl?: (perfetto.protos.IInsetsSourceControlProto|null);

            /** InsetsSourceProviderProto control. */
            public control?: (perfetto.protos.IInsetsSourceControlProto|null);

            /** InsetsSourceProviderProto controlTarget. */
            public controlTarget?: (perfetto.protos.IWindowStateProto|null);

            /** InsetsSourceProviderProto pendingControlTarget. */
            public pendingControlTarget?: (perfetto.protos.IWindowStateProto|null);

            /** InsetsSourceProviderProto fakeControlTarget. */
            public fakeControlTarget?: (perfetto.protos.IWindowStateProto|null);

            /** InsetsSourceProviderProto capturedLeash. */
            public capturedLeash?: (perfetto.protos.ISurfaceControlProto|null);

            /** InsetsSourceProviderProto imeOverriddenFrame. */
            public imeOverriddenFrame?: (perfetto.protos.IRectProto|null);

            /** InsetsSourceProviderProto isLeashReadyForDispatching. */
            public isLeashReadyForDispatching: boolean;

            /** InsetsSourceProviderProto clientVisible. */
            public clientVisible: boolean;

            /** InsetsSourceProviderProto serverVisible. */
            public serverVisible: boolean;

            /** InsetsSourceProviderProto seamlessRotating. */
            public seamlessRotating: boolean;

            /** InsetsSourceProviderProto finishSeamlessRotateFrameNumber. */
            public finishSeamlessRotateFrameNumber: Long;

            /** InsetsSourceProviderProto controllable. */
            public controllable: boolean;

            /** InsetsSourceProviderProto sourceWindowState. */
            public sourceWindowState?: (perfetto.protos.IWindowStateProto|null);

            /** InsetsSourceProviderProto controlTargetIdentifier. */
            public controlTargetIdentifier?: (perfetto.protos.IIdentifierProto|null);

            /** InsetsSourceProviderProto pendingControlTargetIdentifier. */
            public pendingControlTargetIdentifier?: (perfetto.protos.IIdentifierProto|null);

            /** InsetsSourceProviderProto fakeControlTargetIdentifier. */
            public fakeControlTargetIdentifier?: (perfetto.protos.IIdentifierProto|null);

            /** InsetsSourceProviderProto sourceWindowStateIdentifier. */
            public sourceWindowStateIdentifier?: (perfetto.protos.IIdentifierProto|null);

            /**
             * Creates a new InsetsSourceProviderProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InsetsSourceProviderProto instance
             */
            public static create(properties?: perfetto.protos.IInsetsSourceProviderProto): perfetto.protos.InsetsSourceProviderProto;

            /**
             * Encodes the specified InsetsSourceProviderProto message. Does not implicitly {@link perfetto.protos.InsetsSourceProviderProto.verify|verify} messages.
             * @param message InsetsSourceProviderProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IInsetsSourceProviderProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InsetsSourceProviderProto message, length delimited. Does not implicitly {@link perfetto.protos.InsetsSourceProviderProto.verify|verify} messages.
             * @param message InsetsSourceProviderProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IInsetsSourceProviderProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InsetsSourceProviderProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InsetsSourceProviderProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.InsetsSourceProviderProto;

            /**
             * Decodes an InsetsSourceProviderProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InsetsSourceProviderProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.InsetsSourceProviderProto;

            /**
             * Verifies an InsetsSourceProviderProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an InsetsSourceProviderProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InsetsSourceProviderProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.InsetsSourceProviderProto;

            /**
             * Creates a plain object from an InsetsSourceProviderProto message. Also converts values to other types if specified.
             * @param message InsetsSourceProviderProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.InsetsSourceProviderProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InsetsSourceProviderProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for InsetsSourceProviderProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an ImeInsetsSourceProviderProto. */
        interface IImeInsetsSourceProviderProto {

            /** ImeInsetsSourceProviderProto insetsSourceProvider */
            insetsSourceProvider?: (perfetto.protos.IInsetsSourceProviderProto|null);

            /** ImeInsetsSourceProviderProto imeTargetFromIme */
            imeTargetFromIme?: (perfetto.protos.IWindowStateProto|null);

            /** ImeInsetsSourceProviderProto isImeLayoutDrawn */
            isImeLayoutDrawn?: (boolean|null);

            /** ImeInsetsSourceProviderProto imeTargetFromImeIdentifier */
            imeTargetFromImeIdentifier?: (perfetto.protos.IIdentifierProto|null);
        }

        /** Represents an ImeInsetsSourceProviderProto. */
        class ImeInsetsSourceProviderProto implements IImeInsetsSourceProviderProto {

            /**
             * Constructs a new ImeInsetsSourceProviderProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IImeInsetsSourceProviderProto);

            /** ImeInsetsSourceProviderProto insetsSourceProvider. */
            public insetsSourceProvider?: (perfetto.protos.IInsetsSourceProviderProto|null);

            /** ImeInsetsSourceProviderProto imeTargetFromIme. */
            public imeTargetFromIme?: (perfetto.protos.IWindowStateProto|null);

            /** ImeInsetsSourceProviderProto isImeLayoutDrawn. */
            public isImeLayoutDrawn: boolean;

            /** ImeInsetsSourceProviderProto imeTargetFromImeIdentifier. */
            public imeTargetFromImeIdentifier?: (perfetto.protos.IIdentifierProto|null);

            /**
             * Creates a new ImeInsetsSourceProviderProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ImeInsetsSourceProviderProto instance
             */
            public static create(properties?: perfetto.protos.IImeInsetsSourceProviderProto): perfetto.protos.ImeInsetsSourceProviderProto;

            /**
             * Encodes the specified ImeInsetsSourceProviderProto message. Does not implicitly {@link perfetto.protos.ImeInsetsSourceProviderProto.verify|verify} messages.
             * @param message ImeInsetsSourceProviderProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IImeInsetsSourceProviderProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ImeInsetsSourceProviderProto message, length delimited. Does not implicitly {@link perfetto.protos.ImeInsetsSourceProviderProto.verify|verify} messages.
             * @param message ImeInsetsSourceProviderProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IImeInsetsSourceProviderProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ImeInsetsSourceProviderProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ImeInsetsSourceProviderProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ImeInsetsSourceProviderProto;

            /**
             * Decodes an ImeInsetsSourceProviderProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ImeInsetsSourceProviderProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ImeInsetsSourceProviderProto;

            /**
             * Verifies an ImeInsetsSourceProviderProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ImeInsetsSourceProviderProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ImeInsetsSourceProviderProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.ImeInsetsSourceProviderProto;

            /**
             * Creates a plain object from an ImeInsetsSourceProviderProto message. Also converts values to other types if specified.
             * @param message ImeInsetsSourceProviderProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.ImeInsetsSourceProviderProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ImeInsetsSourceProviderProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ImeInsetsSourceProviderProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a BackNavigationProto. */
        interface IBackNavigationProto {

            /** BackNavigationProto animationInProgress */
            animationInProgress?: (boolean|null);

            /** BackNavigationProto lastBackType */
            lastBackType?: (number|null);

            /** BackNavigationProto showWallpaper */
            showWallpaper?: (boolean|null);

            /** BackNavigationProto mainOpenActivity */
            mainOpenActivity?: (string|null);

            /** BackNavigationProto animationRunning */
            animationRunning?: (boolean|null);
        }

        /** Represents a BackNavigationProto. */
        class BackNavigationProto implements IBackNavigationProto {

            /**
             * Constructs a new BackNavigationProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IBackNavigationProto);

            /** BackNavigationProto animationInProgress. */
            public animationInProgress: boolean;

            /** BackNavigationProto lastBackType. */
            public lastBackType: number;

            /** BackNavigationProto showWallpaper. */
            public showWallpaper: boolean;

            /** BackNavigationProto mainOpenActivity. */
            public mainOpenActivity: string;

            /** BackNavigationProto animationRunning. */
            public animationRunning: boolean;

            /**
             * Creates a new BackNavigationProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BackNavigationProto instance
             */
            public static create(properties?: perfetto.protos.IBackNavigationProto): perfetto.protos.BackNavigationProto;

            /**
             * Encodes the specified BackNavigationProto message. Does not implicitly {@link perfetto.protos.BackNavigationProto.verify|verify} messages.
             * @param message BackNavigationProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IBackNavigationProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BackNavigationProto message, length delimited. Does not implicitly {@link perfetto.protos.BackNavigationProto.verify|verify} messages.
             * @param message BackNavigationProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IBackNavigationProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BackNavigationProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BackNavigationProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.BackNavigationProto;

            /**
             * Decodes a BackNavigationProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BackNavigationProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.BackNavigationProto;

            /**
             * Verifies a BackNavigationProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BackNavigationProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BackNavigationProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.BackNavigationProto;

            /**
             * Creates a plain object from a BackNavigationProto message. Also converts values to other types if specified.
             * @param message BackNavigationProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.BackNavigationProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BackNavigationProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for BackNavigationProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a StatusBarManagerProto. */
        interface IStatusBarManagerProto {
        }

        /** Represents a StatusBarManagerProto. */
        class StatusBarManagerProto implements IStatusBarManagerProto {

            /**
             * Constructs a new StatusBarManagerProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IStatusBarManagerProto);

            /**
             * Creates a new StatusBarManagerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns StatusBarManagerProto instance
             */
            public static create(properties?: perfetto.protos.IStatusBarManagerProto): perfetto.protos.StatusBarManagerProto;

            /**
             * Encodes the specified StatusBarManagerProto message. Does not implicitly {@link perfetto.protos.StatusBarManagerProto.verify|verify} messages.
             * @param message StatusBarManagerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IStatusBarManagerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified StatusBarManagerProto message, length delimited. Does not implicitly {@link perfetto.protos.StatusBarManagerProto.verify|verify} messages.
             * @param message StatusBarManagerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IStatusBarManagerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a StatusBarManagerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns StatusBarManagerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.StatusBarManagerProto;

            /**
             * Decodes a StatusBarManagerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns StatusBarManagerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.StatusBarManagerProto;

            /**
             * Verifies a StatusBarManagerProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a StatusBarManagerProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns StatusBarManagerProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.StatusBarManagerProto;

            /**
             * Creates a plain object from a StatusBarManagerProto message. Also converts values to other types if specified.
             * @param message StatusBarManagerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.StatusBarManagerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this StatusBarManagerProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for StatusBarManagerProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace StatusBarManagerProto {

            /** WindowState enum. */
            enum WindowState {
                WINDOW_STATE_SHOWING = 0,
                WINDOW_STATE_HIDING = 1,
                WINDOW_STATE_HIDDEN = 2
            }

            /** TransientWindowState enum. */
            enum TransientWindowState {
                TRANSIENT_BAR_NONE = 0,
                TRANSIENT_BAR_SHOW_REQUESTED = 1,
                TRANSIENT_BAR_SHOWING = 2,
                TRANSIENT_BAR_HIDING = 3
            }
        }

        /** Properties of an ActivityInfoProto. */
        interface IActivityInfoProto {
        }

        /** Represents an ActivityInfoProto. */
        class ActivityInfoProto implements IActivityInfoProto {

            /**
             * Constructs a new ActivityInfoProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IActivityInfoProto);

            /**
             * Creates a new ActivityInfoProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ActivityInfoProto instance
             */
            public static create(properties?: perfetto.protos.IActivityInfoProto): perfetto.protos.ActivityInfoProto;

            /**
             * Encodes the specified ActivityInfoProto message. Does not implicitly {@link perfetto.protos.ActivityInfoProto.verify|verify} messages.
             * @param message ActivityInfoProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IActivityInfoProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ActivityInfoProto message, length delimited. Does not implicitly {@link perfetto.protos.ActivityInfoProto.verify|verify} messages.
             * @param message ActivityInfoProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IActivityInfoProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ActivityInfoProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ActivityInfoProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ActivityInfoProto;

            /**
             * Decodes an ActivityInfoProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ActivityInfoProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ActivityInfoProto;

            /**
             * Verifies an ActivityInfoProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ActivityInfoProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ActivityInfoProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.ActivityInfoProto;

            /**
             * Creates a plain object from an ActivityInfoProto message. Also converts values to other types if specified.
             * @param message ActivityInfoProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.ActivityInfoProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ActivityInfoProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ActivityInfoProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ActivityInfoProto {

            /** ScreenOrientation enum. */
            enum ScreenOrientation {
                SCREEN_ORIENTATION_UNSET = -2,
                SCREEN_ORIENTATION_UNSPECIFIED = -1,
                SCREEN_ORIENTATION_LANDSCAPE = 0,
                SCREEN_ORIENTATION_PORTRAIT = 1,
                SCREEN_ORIENTATION_USER = 2,
                SCREEN_ORIENTATION_BEHIND = 3,
                SCREEN_ORIENTATION_SENSOR = 4,
                SCREEN_ORIENTATION_NOSENSOR = 5,
                SCREEN_ORIENTATION_SENSOR_LANDSCAPE = 6,
                SCREEN_ORIENTATION_SENSOR_PORTRAIT = 7,
                SCREEN_ORIENTATION_REVERSE_LANDSCAPE = 8,
                SCREEN_ORIENTATION_REVERSE_PORTRAIT = 9,
                SCREEN_ORIENTATION_FULL_SENSOR = 10,
                SCREEN_ORIENTATION_USER_LANDSCAPE = 11,
                SCREEN_ORIENTATION_USER_PORTRAIT = 12,
                SCREEN_ORIENTATION_FULL_USER = 13,
                SCREEN_ORIENTATION_LOCKED = 14
            }
        }

        /** Properties of a ConfigurationProto. */
        interface IConfigurationProto {

            /** ConfigurationProto fontScale */
            fontScale?: (number|null);

            /** ConfigurationProto mcc */
            mcc?: (number|null);

            /** ConfigurationProto mnc */
            mnc?: (number|null);

            /** ConfigurationProto locales */
            locales?: (perfetto.protos.ILocaleProto[]|null);

            /** ConfigurationProto screenLayout */
            screenLayout?: (number|null);

            /** ConfigurationProto colorMode */
            colorMode?: (number|null);

            /** ConfigurationProto touchscreen */
            touchscreen?: (number|null);

            /** ConfigurationProto keyboard */
            keyboard?: (number|null);

            /** ConfigurationProto keyboardHidden */
            keyboardHidden?: (number|null);

            /** ConfigurationProto hardKeyboardHidden */
            hardKeyboardHidden?: (number|null);

            /** ConfigurationProto navigation */
            navigation?: (number|null);

            /** ConfigurationProto navigationHidden */
            navigationHidden?: (number|null);

            /** ConfigurationProto orientation */
            orientation?: (number|null);

            /** ConfigurationProto uiMode */
            uiMode?: (number|null);

            /** ConfigurationProto screenWidthDp */
            screenWidthDp?: (number|null);

            /** ConfigurationProto screenHeightDp */
            screenHeightDp?: (number|null);

            /** ConfigurationProto smallestScreenWidthDp */
            smallestScreenWidthDp?: (number|null);

            /** ConfigurationProto densityDpi */
            densityDpi?: (number|null);

            /** ConfigurationProto windowConfiguration */
            windowConfiguration?: (perfetto.protos.IWindowConfigurationProto|null);

            /** ConfigurationProto localeList */
            localeList?: (string|null);

            /** ConfigurationProto fontWeightAdjustment */
            fontWeightAdjustment?: (number|null);

            /** ConfigurationProto grammaticalGender */
            grammaticalGender?: (number|null);
        }

        /** Represents a ConfigurationProto. */
        class ConfigurationProto implements IConfigurationProto {

            /**
             * Constructs a new ConfigurationProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IConfigurationProto);

            /** ConfigurationProto fontScale. */
            public fontScale: number;

            /** ConfigurationProto mcc. */
            public mcc: number;

            /** ConfigurationProto mnc. */
            public mnc: number;

            /** ConfigurationProto locales. */
            public locales: perfetto.protos.ILocaleProto[];

            /** ConfigurationProto screenLayout. */
            public screenLayout: number;

            /** ConfigurationProto colorMode. */
            public colorMode: number;

            /** ConfigurationProto touchscreen. */
            public touchscreen: number;

            /** ConfigurationProto keyboard. */
            public keyboard: number;

            /** ConfigurationProto keyboardHidden. */
            public keyboardHidden: number;

            /** ConfigurationProto hardKeyboardHidden. */
            public hardKeyboardHidden: number;

            /** ConfigurationProto navigation. */
            public navigation: number;

            /** ConfigurationProto navigationHidden. */
            public navigationHidden: number;

            /** ConfigurationProto orientation. */
            public orientation: number;

            /** ConfigurationProto uiMode. */
            public uiMode: number;

            /** ConfigurationProto screenWidthDp. */
            public screenWidthDp: number;

            /** ConfigurationProto screenHeightDp. */
            public screenHeightDp: number;

            /** ConfigurationProto smallestScreenWidthDp. */
            public smallestScreenWidthDp: number;

            /** ConfigurationProto densityDpi. */
            public densityDpi: number;

            /** ConfigurationProto windowConfiguration. */
            public windowConfiguration?: (perfetto.protos.IWindowConfigurationProto|null);

            /** ConfigurationProto localeList. */
            public localeList: string;

            /** ConfigurationProto fontWeightAdjustment. */
            public fontWeightAdjustment: number;

            /** ConfigurationProto grammaticalGender. */
            public grammaticalGender: number;

            /**
             * Creates a new ConfigurationProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ConfigurationProto instance
             */
            public static create(properties?: perfetto.protos.IConfigurationProto): perfetto.protos.ConfigurationProto;

            /**
             * Encodes the specified ConfigurationProto message. Does not implicitly {@link perfetto.protos.ConfigurationProto.verify|verify} messages.
             * @param message ConfigurationProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IConfigurationProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ConfigurationProto message, length delimited. Does not implicitly {@link perfetto.protos.ConfigurationProto.verify|verify} messages.
             * @param message ConfigurationProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IConfigurationProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ConfigurationProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ConfigurationProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ConfigurationProto;

            /**
             * Decodes a ConfigurationProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ConfigurationProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ConfigurationProto;

            /**
             * Verifies a ConfigurationProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ConfigurationProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ConfigurationProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.ConfigurationProto;

            /**
             * Creates a plain object from a ConfigurationProto message. Also converts values to other types if specified.
             * @param message ConfigurationProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.ConfigurationProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ConfigurationProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ConfigurationProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ResourcesConfigurationProto. */
        interface IResourcesConfigurationProto {

            /** ResourcesConfigurationProto configuration */
            configuration?: (perfetto.protos.IConfigurationProto|null);

            /** ResourcesConfigurationProto sdkVersion */
            sdkVersion?: (number|null);

            /** ResourcesConfigurationProto screenWidthPx */
            screenWidthPx?: (number|null);

            /** ResourcesConfigurationProto screenHeightPx */
            screenHeightPx?: (number|null);
        }

        /** Represents a ResourcesConfigurationProto. */
        class ResourcesConfigurationProto implements IResourcesConfigurationProto {

            /**
             * Constructs a new ResourcesConfigurationProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IResourcesConfigurationProto);

            /** ResourcesConfigurationProto configuration. */
            public configuration?: (perfetto.protos.IConfigurationProto|null);

            /** ResourcesConfigurationProto sdkVersion. */
            public sdkVersion: number;

            /** ResourcesConfigurationProto screenWidthPx. */
            public screenWidthPx: number;

            /** ResourcesConfigurationProto screenHeightPx. */
            public screenHeightPx: number;

            /**
             * Creates a new ResourcesConfigurationProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ResourcesConfigurationProto instance
             */
            public static create(properties?: perfetto.protos.IResourcesConfigurationProto): perfetto.protos.ResourcesConfigurationProto;

            /**
             * Encodes the specified ResourcesConfigurationProto message. Does not implicitly {@link perfetto.protos.ResourcesConfigurationProto.verify|verify} messages.
             * @param message ResourcesConfigurationProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IResourcesConfigurationProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ResourcesConfigurationProto message, length delimited. Does not implicitly {@link perfetto.protos.ResourcesConfigurationProto.verify|verify} messages.
             * @param message ResourcesConfigurationProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IResourcesConfigurationProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ResourcesConfigurationProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ResourcesConfigurationProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ResourcesConfigurationProto;

            /**
             * Decodes a ResourcesConfigurationProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ResourcesConfigurationProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ResourcesConfigurationProto;

            /**
             * Verifies a ResourcesConfigurationProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ResourcesConfigurationProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ResourcesConfigurationProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.ResourcesConfigurationProto;

            /**
             * Creates a plain object from a ResourcesConfigurationProto message. Also converts values to other types if specified.
             * @param message ResourcesConfigurationProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.ResourcesConfigurationProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ResourcesConfigurationProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ResourcesConfigurationProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a DeviceConfigurationProto. */
        interface IDeviceConfigurationProto {

            /** DeviceConfigurationProto stableScreenWidthPx */
            stableScreenWidthPx?: (number|null);

            /** DeviceConfigurationProto stableScreenHeightPx */
            stableScreenHeightPx?: (number|null);

            /** DeviceConfigurationProto stableDensityDpi */
            stableDensityDpi?: (number|null);

            /** DeviceConfigurationProto totalRam */
            totalRam?: (Long|null);

            /** DeviceConfigurationProto lowRam */
            lowRam?: (boolean|null);

            /** DeviceConfigurationProto maxCores */
            maxCores?: (number|null);

            /** DeviceConfigurationProto hasSecureScreenLock */
            hasSecureScreenLock?: (boolean|null);

            /** DeviceConfigurationProto openglVersion */
            openglVersion?: (number|null);

            /** DeviceConfigurationProto openglExtensions */
            openglExtensions?: (string[]|null);

            /** DeviceConfigurationProto sharedLibraries */
            sharedLibraries?: (string[]|null);

            /** DeviceConfigurationProto features */
            features?: (string[]|null);

            /** DeviceConfigurationProto cpuArchitectures */
            cpuArchitectures?: (string[]|null);
        }

        /** Represents a DeviceConfigurationProto. */
        class DeviceConfigurationProto implements IDeviceConfigurationProto {

            /**
             * Constructs a new DeviceConfigurationProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IDeviceConfigurationProto);

            /** DeviceConfigurationProto stableScreenWidthPx. */
            public stableScreenWidthPx: number;

            /** DeviceConfigurationProto stableScreenHeightPx. */
            public stableScreenHeightPx: number;

            /** DeviceConfigurationProto stableDensityDpi. */
            public stableDensityDpi: number;

            /** DeviceConfigurationProto totalRam. */
            public totalRam: Long;

            /** DeviceConfigurationProto lowRam. */
            public lowRam: boolean;

            /** DeviceConfigurationProto maxCores. */
            public maxCores: number;

            /** DeviceConfigurationProto hasSecureScreenLock. */
            public hasSecureScreenLock: boolean;

            /** DeviceConfigurationProto openglVersion. */
            public openglVersion: number;

            /** DeviceConfigurationProto openglExtensions. */
            public openglExtensions: string[];

            /** DeviceConfigurationProto sharedLibraries. */
            public sharedLibraries: string[];

            /** DeviceConfigurationProto features. */
            public features: string[];

            /** DeviceConfigurationProto cpuArchitectures. */
            public cpuArchitectures: string[];

            /**
             * Creates a new DeviceConfigurationProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DeviceConfigurationProto instance
             */
            public static create(properties?: perfetto.protos.IDeviceConfigurationProto): perfetto.protos.DeviceConfigurationProto;

            /**
             * Encodes the specified DeviceConfigurationProto message. Does not implicitly {@link perfetto.protos.DeviceConfigurationProto.verify|verify} messages.
             * @param message DeviceConfigurationProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IDeviceConfigurationProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DeviceConfigurationProto message, length delimited. Does not implicitly {@link perfetto.protos.DeviceConfigurationProto.verify|verify} messages.
             * @param message DeviceConfigurationProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IDeviceConfigurationProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DeviceConfigurationProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DeviceConfigurationProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.DeviceConfigurationProto;

            /**
             * Decodes a DeviceConfigurationProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DeviceConfigurationProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.DeviceConfigurationProto;

            /**
             * Verifies a DeviceConfigurationProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DeviceConfigurationProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DeviceConfigurationProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.DeviceConfigurationProto;

            /**
             * Creates a plain object from a DeviceConfigurationProto message. Also converts values to other types if specified.
             * @param message DeviceConfigurationProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.DeviceConfigurationProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DeviceConfigurationProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DeviceConfigurationProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a GlobalConfigurationProto. */
        interface IGlobalConfigurationProto {

            /** GlobalConfigurationProto resources */
            resources?: (perfetto.protos.IResourcesConfigurationProto|null);

            /** GlobalConfigurationProto device */
            device?: (perfetto.protos.IDeviceConfigurationProto|null);
        }

        /** Represents a GlobalConfigurationProto. */
        class GlobalConfigurationProto implements IGlobalConfigurationProto {

            /**
             * Constructs a new GlobalConfigurationProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IGlobalConfigurationProto);

            /** GlobalConfigurationProto resources. */
            public resources?: (perfetto.protos.IResourcesConfigurationProto|null);

            /** GlobalConfigurationProto device. */
            public device?: (perfetto.protos.IDeviceConfigurationProto|null);

            /**
             * Creates a new GlobalConfigurationProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns GlobalConfigurationProto instance
             */
            public static create(properties?: perfetto.protos.IGlobalConfigurationProto): perfetto.protos.GlobalConfigurationProto;

            /**
             * Encodes the specified GlobalConfigurationProto message. Does not implicitly {@link perfetto.protos.GlobalConfigurationProto.verify|verify} messages.
             * @param message GlobalConfigurationProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IGlobalConfigurationProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GlobalConfigurationProto message, length delimited. Does not implicitly {@link perfetto.protos.GlobalConfigurationProto.verify|verify} messages.
             * @param message GlobalConfigurationProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IGlobalConfigurationProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GlobalConfigurationProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GlobalConfigurationProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.GlobalConfigurationProto;

            /**
             * Decodes a GlobalConfigurationProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GlobalConfigurationProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.GlobalConfigurationProto;

            /**
             * Verifies a GlobalConfigurationProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a GlobalConfigurationProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns GlobalConfigurationProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.GlobalConfigurationProto;

            /**
             * Creates a plain object from a GlobalConfigurationProto message. Also converts values to other types if specified.
             * @param message GlobalConfigurationProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.GlobalConfigurationProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this GlobalConfigurationProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for GlobalConfigurationProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a WindowConfigurationProto. */
        interface IWindowConfigurationProto {

            /** WindowConfigurationProto appBounds */
            appBounds?: (perfetto.protos.IRectProto|null);

            /** WindowConfigurationProto windowingMode */
            windowingMode?: (number|null);

            /** WindowConfigurationProto activityType */
            activityType?: (number|null);

            /** WindowConfigurationProto bounds */
            bounds?: (perfetto.protos.IRectProto|null);

            /** WindowConfigurationProto maxBounds */
            maxBounds?: (perfetto.protos.IRectProto|null);
        }

        /** Represents a WindowConfigurationProto. */
        class WindowConfigurationProto implements IWindowConfigurationProto {

            /**
             * Constructs a new WindowConfigurationProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWindowConfigurationProto);

            /** WindowConfigurationProto appBounds. */
            public appBounds?: (perfetto.protos.IRectProto|null);

            /** WindowConfigurationProto windowingMode. */
            public windowingMode: number;

            /** WindowConfigurationProto activityType. */
            public activityType: number;

            /** WindowConfigurationProto bounds. */
            public bounds?: (perfetto.protos.IRectProto|null);

            /** WindowConfigurationProto maxBounds. */
            public maxBounds?: (perfetto.protos.IRectProto|null);

            /**
             * Creates a new WindowConfigurationProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WindowConfigurationProto instance
             */
            public static create(properties?: perfetto.protos.IWindowConfigurationProto): perfetto.protos.WindowConfigurationProto;

            /**
             * Encodes the specified WindowConfigurationProto message. Does not implicitly {@link perfetto.protos.WindowConfigurationProto.verify|verify} messages.
             * @param message WindowConfigurationProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IWindowConfigurationProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WindowConfigurationProto message, length delimited. Does not implicitly {@link perfetto.protos.WindowConfigurationProto.verify|verify} messages.
             * @param message WindowConfigurationProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IWindowConfigurationProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WindowConfigurationProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WindowConfigurationProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.WindowConfigurationProto;

            /**
             * Decodes a WindowConfigurationProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WindowConfigurationProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.WindowConfigurationProto;

            /**
             * Verifies a WindowConfigurationProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WindowConfigurationProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WindowConfigurationProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.WindowConfigurationProto;

            /**
             * Creates a plain object from a WindowConfigurationProto message. Also converts values to other types if specified.
             * @param message WindowConfigurationProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.WindowConfigurationProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WindowConfigurationProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WindowConfigurationProto
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
            constructor(properties?: perfetto.protos.IRectProto);

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
            public static create(properties?: perfetto.protos.IRectProto): perfetto.protos.RectProto;

            /**
             * Encodes the specified RectProto message. Does not implicitly {@link perfetto.protos.RectProto.verify|verify} messages.
             * @param message RectProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IRectProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RectProto message, length delimited. Does not implicitly {@link perfetto.protos.RectProto.verify|verify} messages.
             * @param message RectProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IRectProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RectProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RectProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.RectProto;

            /**
             * Decodes a RectProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RectProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.RectProto;

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
            public static fromObject(object: { [k: string]: any }): perfetto.protos.RectProto;

            /**
             * Creates a plain object from a RectProto message. Also converts values to other types if specified.
             * @param message RectProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.RectProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

        /** Properties of a LocaleProto. */
        interface ILocaleProto {

            /** LocaleProto language */
            language?: (string|null);

            /** LocaleProto country */
            country?: (string|null);

            /** LocaleProto variant */
            variant?: (string|null);

            /** LocaleProto script */
            script?: (string|null);
        }

        /** Represents a LocaleProto. */
        class LocaleProto implements ILocaleProto {

            /**
             * Constructs a new LocaleProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.ILocaleProto);

            /** LocaleProto language. */
            public language: string;

            /** LocaleProto country. */
            public country: string;

            /** LocaleProto variant. */
            public variant: string;

            /** LocaleProto script. */
            public script: string;

            /**
             * Creates a new LocaleProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LocaleProto instance
             */
            public static create(properties?: perfetto.protos.ILocaleProto): perfetto.protos.LocaleProto;

            /**
             * Encodes the specified LocaleProto message. Does not implicitly {@link perfetto.protos.LocaleProto.verify|verify} messages.
             * @param message LocaleProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.ILocaleProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LocaleProto message, length delimited. Does not implicitly {@link perfetto.protos.LocaleProto.verify|verify} messages.
             * @param message LocaleProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.ILocaleProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LocaleProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LocaleProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.LocaleProto;

            /**
             * Decodes a LocaleProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LocaleProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.LocaleProto;

            /**
             * Verifies a LocaleProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a LocaleProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LocaleProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.LocaleProto;

            /**
             * Creates a plain object from a LocaleProto message. Also converts values to other types if specified.
             * @param message LocaleProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.LocaleProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this LocaleProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for LocaleProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Destination enum. */
        enum Destination {
            DEST_LOCAL = 0,
            DEST_EXPLICIT = 100,
            DEST_AUTOMATIC = 200,
            DEST_UNSET = 255
        }

        /** Properties of a PrivacyFlags. */
        interface IPrivacyFlags {

            /** PrivacyFlags dest */
            dest?: (perfetto.protos.Destination|null);

            /** PrivacyFlags patterns */
            patterns?: (string[]|null);
        }

        /** Represents a PrivacyFlags. */
        class PrivacyFlags implements IPrivacyFlags {

            /**
             * Constructs a new PrivacyFlags.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IPrivacyFlags);

            /** PrivacyFlags dest. */
            public dest: perfetto.protos.Destination;

            /** PrivacyFlags patterns. */
            public patterns: string[];

            /**
             * Creates a new PrivacyFlags instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PrivacyFlags instance
             */
            public static create(properties?: perfetto.protos.IPrivacyFlags): perfetto.protos.PrivacyFlags;

            /**
             * Encodes the specified PrivacyFlags message. Does not implicitly {@link perfetto.protos.PrivacyFlags.verify|verify} messages.
             * @param message PrivacyFlags message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IPrivacyFlags, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PrivacyFlags message, length delimited. Does not implicitly {@link perfetto.protos.PrivacyFlags.verify|verify} messages.
             * @param message PrivacyFlags message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IPrivacyFlags, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PrivacyFlags message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PrivacyFlags
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.PrivacyFlags;

            /**
             * Decodes a PrivacyFlags message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PrivacyFlags
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.PrivacyFlags;

            /**
             * Verifies a PrivacyFlags message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PrivacyFlags message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PrivacyFlags
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.PrivacyFlags;

            /**
             * Creates a plain object from a PrivacyFlags message. Also converts values to other types if specified.
             * @param message PrivacyFlags
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.PrivacyFlags, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PrivacyFlags to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for PrivacyFlags
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a WindowContainerThumbnailProto. */
        interface IWindowContainerThumbnailProto {

            /** WindowContainerThumbnailProto width */
            width?: (number|null);

            /** WindowContainerThumbnailProto height */
            height?: (number|null);

            /** WindowContainerThumbnailProto surfaceAnimator */
            surfaceAnimator?: (perfetto.protos.ISurfaceAnimatorProto|null);
        }

        /** Represents a WindowContainerThumbnailProto. */
        class WindowContainerThumbnailProto implements IWindowContainerThumbnailProto {

            /**
             * Constructs a new WindowContainerThumbnailProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWindowContainerThumbnailProto);

            /** WindowContainerThumbnailProto width. */
            public width: number;

            /** WindowContainerThumbnailProto height. */
            public height: number;

            /** WindowContainerThumbnailProto surfaceAnimator. */
            public surfaceAnimator?: (perfetto.protos.ISurfaceAnimatorProto|null);

            /**
             * Creates a new WindowContainerThumbnailProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WindowContainerThumbnailProto instance
             */
            public static create(properties?: perfetto.protos.IWindowContainerThumbnailProto): perfetto.protos.WindowContainerThumbnailProto;

            /**
             * Encodes the specified WindowContainerThumbnailProto message. Does not implicitly {@link perfetto.protos.WindowContainerThumbnailProto.verify|verify} messages.
             * @param message WindowContainerThumbnailProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IWindowContainerThumbnailProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WindowContainerThumbnailProto message, length delimited. Does not implicitly {@link perfetto.protos.WindowContainerThumbnailProto.verify|verify} messages.
             * @param message WindowContainerThumbnailProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IWindowContainerThumbnailProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WindowContainerThumbnailProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WindowContainerThumbnailProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.WindowContainerThumbnailProto;

            /**
             * Decodes a WindowContainerThumbnailProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WindowContainerThumbnailProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.WindowContainerThumbnailProto;

            /**
             * Verifies a WindowContainerThumbnailProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WindowContainerThumbnailProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WindowContainerThumbnailProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.WindowContainerThumbnailProto;

            /**
             * Creates a plain object from a WindowContainerThumbnailProto message. Also converts values to other types if specified.
             * @param message WindowContainerThumbnailProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.WindowContainerThumbnailProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WindowContainerThumbnailProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WindowContainerThumbnailProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SurfaceAnimatorProto. */
        interface ISurfaceAnimatorProto {

            /** SurfaceAnimatorProto leash */
            leash?: (perfetto.protos.ISurfaceControlProto|null);

            /** SurfaceAnimatorProto animationStartDelayed */
            animationStartDelayed?: (boolean|null);

            /** SurfaceAnimatorProto animationAdapter */
            animationAdapter?: (perfetto.protos.IAnimationAdapterProto|null);
        }

        /** Represents a SurfaceAnimatorProto. */
        class SurfaceAnimatorProto implements ISurfaceAnimatorProto {

            /**
             * Constructs a new SurfaceAnimatorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.ISurfaceAnimatorProto);

            /** SurfaceAnimatorProto leash. */
            public leash?: (perfetto.protos.ISurfaceControlProto|null);

            /** SurfaceAnimatorProto animationStartDelayed. */
            public animationStartDelayed: boolean;

            /** SurfaceAnimatorProto animationAdapter. */
            public animationAdapter?: (perfetto.protos.IAnimationAdapterProto|null);

            /**
             * Creates a new SurfaceAnimatorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SurfaceAnimatorProto instance
             */
            public static create(properties?: perfetto.protos.ISurfaceAnimatorProto): perfetto.protos.SurfaceAnimatorProto;

            /**
             * Encodes the specified SurfaceAnimatorProto message. Does not implicitly {@link perfetto.protos.SurfaceAnimatorProto.verify|verify} messages.
             * @param message SurfaceAnimatorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.ISurfaceAnimatorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SurfaceAnimatorProto message, length delimited. Does not implicitly {@link perfetto.protos.SurfaceAnimatorProto.verify|verify} messages.
             * @param message SurfaceAnimatorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.ISurfaceAnimatorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SurfaceAnimatorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SurfaceAnimatorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.SurfaceAnimatorProto;

            /**
             * Decodes a SurfaceAnimatorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SurfaceAnimatorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.SurfaceAnimatorProto;

            /**
             * Verifies a SurfaceAnimatorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SurfaceAnimatorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SurfaceAnimatorProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.SurfaceAnimatorProto;

            /**
             * Creates a plain object from a SurfaceAnimatorProto message. Also converts values to other types if specified.
             * @param message SurfaceAnimatorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.SurfaceAnimatorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SurfaceAnimatorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SurfaceAnimatorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an AnimationAdapterProto. */
        interface IAnimationAdapterProto {

            /** AnimationAdapterProto local */
            local?: (perfetto.protos.ILocalAnimationAdapterProto|null);

            /** AnimationAdapterProto remote */
            remote?: (perfetto.protos.IRemoteAnimationAdapterWrapperProto|null);
        }

        /** Represents an AnimationAdapterProto. */
        class AnimationAdapterProto implements IAnimationAdapterProto {

            /**
             * Constructs a new AnimationAdapterProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IAnimationAdapterProto);

            /** AnimationAdapterProto local. */
            public local?: (perfetto.protos.ILocalAnimationAdapterProto|null);

            /** AnimationAdapterProto remote. */
            public remote?: (perfetto.protos.IRemoteAnimationAdapterWrapperProto|null);

            /**
             * Creates a new AnimationAdapterProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AnimationAdapterProto instance
             */
            public static create(properties?: perfetto.protos.IAnimationAdapterProto): perfetto.protos.AnimationAdapterProto;

            /**
             * Encodes the specified AnimationAdapterProto message. Does not implicitly {@link perfetto.protos.AnimationAdapterProto.verify|verify} messages.
             * @param message AnimationAdapterProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IAnimationAdapterProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AnimationAdapterProto message, length delimited. Does not implicitly {@link perfetto.protos.AnimationAdapterProto.verify|verify} messages.
             * @param message AnimationAdapterProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IAnimationAdapterProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AnimationAdapterProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AnimationAdapterProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.AnimationAdapterProto;

            /**
             * Decodes an AnimationAdapterProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AnimationAdapterProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.AnimationAdapterProto;

            /**
             * Verifies an AnimationAdapterProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AnimationAdapterProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AnimationAdapterProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.AnimationAdapterProto;

            /**
             * Creates a plain object from an AnimationAdapterProto message. Also converts values to other types if specified.
             * @param message AnimationAdapterProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.AnimationAdapterProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AnimationAdapterProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for AnimationAdapterProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a RemoteAnimationAdapterWrapperProto. */
        interface IRemoteAnimationAdapterWrapperProto {

            /** RemoteAnimationAdapterWrapperProto target */
            target?: (perfetto.protos.IRemoteAnimationTargetProto|null);
        }

        /** Represents a RemoteAnimationAdapterWrapperProto. */
        class RemoteAnimationAdapterWrapperProto implements IRemoteAnimationAdapterWrapperProto {

            /**
             * Constructs a new RemoteAnimationAdapterWrapperProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IRemoteAnimationAdapterWrapperProto);

            /** RemoteAnimationAdapterWrapperProto target. */
            public target?: (perfetto.protos.IRemoteAnimationTargetProto|null);

            /**
             * Creates a new RemoteAnimationAdapterWrapperProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RemoteAnimationAdapterWrapperProto instance
             */
            public static create(properties?: perfetto.protos.IRemoteAnimationAdapterWrapperProto): perfetto.protos.RemoteAnimationAdapterWrapperProto;

            /**
             * Encodes the specified RemoteAnimationAdapterWrapperProto message. Does not implicitly {@link perfetto.protos.RemoteAnimationAdapterWrapperProto.verify|verify} messages.
             * @param message RemoteAnimationAdapterWrapperProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IRemoteAnimationAdapterWrapperProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RemoteAnimationAdapterWrapperProto message, length delimited. Does not implicitly {@link perfetto.protos.RemoteAnimationAdapterWrapperProto.verify|verify} messages.
             * @param message RemoteAnimationAdapterWrapperProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IRemoteAnimationAdapterWrapperProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RemoteAnimationAdapterWrapperProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RemoteAnimationAdapterWrapperProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.RemoteAnimationAdapterWrapperProto;

            /**
             * Decodes a RemoteAnimationAdapterWrapperProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RemoteAnimationAdapterWrapperProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.RemoteAnimationAdapterWrapperProto;

            /**
             * Verifies a RemoteAnimationAdapterWrapperProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RemoteAnimationAdapterWrapperProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RemoteAnimationAdapterWrapperProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.RemoteAnimationAdapterWrapperProto;

            /**
             * Creates a plain object from a RemoteAnimationAdapterWrapperProto message. Also converts values to other types if specified.
             * @param message RemoteAnimationAdapterWrapperProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.RemoteAnimationAdapterWrapperProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this RemoteAnimationAdapterWrapperProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for RemoteAnimationAdapterWrapperProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a LocalAnimationAdapterProto. */
        interface ILocalAnimationAdapterProto {

            /** LocalAnimationAdapterProto animationSpec */
            animationSpec?: (perfetto.protos.IAnimationSpecProto|null);
        }

        /** Represents a LocalAnimationAdapterProto. */
        class LocalAnimationAdapterProto implements ILocalAnimationAdapterProto {

            /**
             * Constructs a new LocalAnimationAdapterProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.ILocalAnimationAdapterProto);

            /** LocalAnimationAdapterProto animationSpec. */
            public animationSpec?: (perfetto.protos.IAnimationSpecProto|null);

            /**
             * Creates a new LocalAnimationAdapterProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LocalAnimationAdapterProto instance
             */
            public static create(properties?: perfetto.protos.ILocalAnimationAdapterProto): perfetto.protos.LocalAnimationAdapterProto;

            /**
             * Encodes the specified LocalAnimationAdapterProto message. Does not implicitly {@link perfetto.protos.LocalAnimationAdapterProto.verify|verify} messages.
             * @param message LocalAnimationAdapterProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.ILocalAnimationAdapterProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LocalAnimationAdapterProto message, length delimited. Does not implicitly {@link perfetto.protos.LocalAnimationAdapterProto.verify|verify} messages.
             * @param message LocalAnimationAdapterProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.ILocalAnimationAdapterProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LocalAnimationAdapterProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LocalAnimationAdapterProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.LocalAnimationAdapterProto;

            /**
             * Decodes a LocalAnimationAdapterProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LocalAnimationAdapterProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.LocalAnimationAdapterProto;

            /**
             * Verifies a LocalAnimationAdapterProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a LocalAnimationAdapterProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LocalAnimationAdapterProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.LocalAnimationAdapterProto;

            /**
             * Creates a plain object from a LocalAnimationAdapterProto message. Also converts values to other types if specified.
             * @param message LocalAnimationAdapterProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.LocalAnimationAdapterProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this LocalAnimationAdapterProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for LocalAnimationAdapterProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an AnimationSpecProto. */
        interface IAnimationSpecProto {

            /** AnimationSpecProto window */
            window?: (perfetto.protos.IWindowAnimationSpecProto|null);

            /** AnimationSpecProto move */
            move?: (perfetto.protos.IMoveAnimationSpecProto|null);

            /** AnimationSpecProto alpha */
            alpha?: (perfetto.protos.IAlphaAnimationSpecProto|null);

            /** AnimationSpecProto rotate */
            rotate?: (perfetto.protos.IRotationAnimationSpecProto|null);
        }

        /** Represents an AnimationSpecProto. */
        class AnimationSpecProto implements IAnimationSpecProto {

            /**
             * Constructs a new AnimationSpecProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IAnimationSpecProto);

            /** AnimationSpecProto window. */
            public window?: (perfetto.protos.IWindowAnimationSpecProto|null);

            /** AnimationSpecProto move. */
            public move?: (perfetto.protos.IMoveAnimationSpecProto|null);

            /** AnimationSpecProto alpha. */
            public alpha?: (perfetto.protos.IAlphaAnimationSpecProto|null);

            /** AnimationSpecProto rotate. */
            public rotate?: (perfetto.protos.IRotationAnimationSpecProto|null);

            /**
             * Creates a new AnimationSpecProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AnimationSpecProto instance
             */
            public static create(properties?: perfetto.protos.IAnimationSpecProto): perfetto.protos.AnimationSpecProto;

            /**
             * Encodes the specified AnimationSpecProto message. Does not implicitly {@link perfetto.protos.AnimationSpecProto.verify|verify} messages.
             * @param message AnimationSpecProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IAnimationSpecProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AnimationSpecProto message, length delimited. Does not implicitly {@link perfetto.protos.AnimationSpecProto.verify|verify} messages.
             * @param message AnimationSpecProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IAnimationSpecProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AnimationSpecProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AnimationSpecProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.AnimationSpecProto;

            /**
             * Decodes an AnimationSpecProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AnimationSpecProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.AnimationSpecProto;

            /**
             * Verifies an AnimationSpecProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AnimationSpecProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AnimationSpecProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.AnimationSpecProto;

            /**
             * Creates a plain object from an AnimationSpecProto message. Also converts values to other types if specified.
             * @param message AnimationSpecProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.AnimationSpecProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AnimationSpecProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for AnimationSpecProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a WindowAnimationSpecProto. */
        interface IWindowAnimationSpecProto {

            /** WindowAnimationSpecProto animation */
            animation?: (string|null);
        }

        /** Represents a WindowAnimationSpecProto. */
        class WindowAnimationSpecProto implements IWindowAnimationSpecProto {

            /**
             * Constructs a new WindowAnimationSpecProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWindowAnimationSpecProto);

            /** WindowAnimationSpecProto animation. */
            public animation: string;

            /**
             * Creates a new WindowAnimationSpecProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WindowAnimationSpecProto instance
             */
            public static create(properties?: perfetto.protos.IWindowAnimationSpecProto): perfetto.protos.WindowAnimationSpecProto;

            /**
             * Encodes the specified WindowAnimationSpecProto message. Does not implicitly {@link perfetto.protos.WindowAnimationSpecProto.verify|verify} messages.
             * @param message WindowAnimationSpecProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IWindowAnimationSpecProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WindowAnimationSpecProto message, length delimited. Does not implicitly {@link perfetto.protos.WindowAnimationSpecProto.verify|verify} messages.
             * @param message WindowAnimationSpecProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IWindowAnimationSpecProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WindowAnimationSpecProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WindowAnimationSpecProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.WindowAnimationSpecProto;

            /**
             * Decodes a WindowAnimationSpecProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WindowAnimationSpecProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.WindowAnimationSpecProto;

            /**
             * Verifies a WindowAnimationSpecProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WindowAnimationSpecProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WindowAnimationSpecProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.WindowAnimationSpecProto;

            /**
             * Creates a plain object from a WindowAnimationSpecProto message. Also converts values to other types if specified.
             * @param message WindowAnimationSpecProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.WindowAnimationSpecProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WindowAnimationSpecProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WindowAnimationSpecProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a MoveAnimationSpecProto. */
        interface IMoveAnimationSpecProto {

            /** MoveAnimationSpecProto from */
            from?: (perfetto.protos.IPointProto|null);

            /** MoveAnimationSpecProto to */
            to?: (perfetto.protos.IPointProto|null);

            /** MoveAnimationSpecProto durationMs */
            durationMs?: (Long|null);
        }

        /** Represents a MoveAnimationSpecProto. */
        class MoveAnimationSpecProto implements IMoveAnimationSpecProto {

            /**
             * Constructs a new MoveAnimationSpecProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IMoveAnimationSpecProto);

            /** MoveAnimationSpecProto from. */
            public from?: (perfetto.protos.IPointProto|null);

            /** MoveAnimationSpecProto to. */
            public to?: (perfetto.protos.IPointProto|null);

            /** MoveAnimationSpecProto durationMs. */
            public durationMs: Long;

            /**
             * Creates a new MoveAnimationSpecProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MoveAnimationSpecProto instance
             */
            public static create(properties?: perfetto.protos.IMoveAnimationSpecProto): perfetto.protos.MoveAnimationSpecProto;

            /**
             * Encodes the specified MoveAnimationSpecProto message. Does not implicitly {@link perfetto.protos.MoveAnimationSpecProto.verify|verify} messages.
             * @param message MoveAnimationSpecProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IMoveAnimationSpecProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MoveAnimationSpecProto message, length delimited. Does not implicitly {@link perfetto.protos.MoveAnimationSpecProto.verify|verify} messages.
             * @param message MoveAnimationSpecProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IMoveAnimationSpecProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MoveAnimationSpecProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MoveAnimationSpecProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.MoveAnimationSpecProto;

            /**
             * Decodes a MoveAnimationSpecProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MoveAnimationSpecProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.MoveAnimationSpecProto;

            /**
             * Verifies a MoveAnimationSpecProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MoveAnimationSpecProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MoveAnimationSpecProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.MoveAnimationSpecProto;

            /**
             * Creates a plain object from a MoveAnimationSpecProto message. Also converts values to other types if specified.
             * @param message MoveAnimationSpecProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.MoveAnimationSpecProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MoveAnimationSpecProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for MoveAnimationSpecProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an AlphaAnimationSpecProto. */
        interface IAlphaAnimationSpecProto {

            /** AlphaAnimationSpecProto from */
            from?: (number|null);

            /** AlphaAnimationSpecProto to */
            to?: (number|null);

            /** AlphaAnimationSpecProto durationMs */
            durationMs?: (Long|null);
        }

        /** Represents an AlphaAnimationSpecProto. */
        class AlphaAnimationSpecProto implements IAlphaAnimationSpecProto {

            /**
             * Constructs a new AlphaAnimationSpecProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IAlphaAnimationSpecProto);

            /** AlphaAnimationSpecProto from. */
            public from: number;

            /** AlphaAnimationSpecProto to. */
            public to: number;

            /** AlphaAnimationSpecProto durationMs. */
            public durationMs: Long;

            /**
             * Creates a new AlphaAnimationSpecProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AlphaAnimationSpecProto instance
             */
            public static create(properties?: perfetto.protos.IAlphaAnimationSpecProto): perfetto.protos.AlphaAnimationSpecProto;

            /**
             * Encodes the specified AlphaAnimationSpecProto message. Does not implicitly {@link perfetto.protos.AlphaAnimationSpecProto.verify|verify} messages.
             * @param message AlphaAnimationSpecProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IAlphaAnimationSpecProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AlphaAnimationSpecProto message, length delimited. Does not implicitly {@link perfetto.protos.AlphaAnimationSpecProto.verify|verify} messages.
             * @param message AlphaAnimationSpecProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IAlphaAnimationSpecProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AlphaAnimationSpecProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AlphaAnimationSpecProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.AlphaAnimationSpecProto;

            /**
             * Decodes an AlphaAnimationSpecProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AlphaAnimationSpecProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.AlphaAnimationSpecProto;

            /**
             * Verifies an AlphaAnimationSpecProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AlphaAnimationSpecProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AlphaAnimationSpecProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.AlphaAnimationSpecProto;

            /**
             * Creates a plain object from an AlphaAnimationSpecProto message. Also converts values to other types if specified.
             * @param message AlphaAnimationSpecProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.AlphaAnimationSpecProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AlphaAnimationSpecProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for AlphaAnimationSpecProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a RotationAnimationSpecProto. */
        interface IRotationAnimationSpecProto {

            /** RotationAnimationSpecProto startLuma */
            startLuma?: (number|null);

            /** RotationAnimationSpecProto endLuma */
            endLuma?: (number|null);

            /** RotationAnimationSpecProto durationMs */
            durationMs?: (Long|null);
        }

        /** Represents a RotationAnimationSpecProto. */
        class RotationAnimationSpecProto implements IRotationAnimationSpecProto {

            /**
             * Constructs a new RotationAnimationSpecProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IRotationAnimationSpecProto);

            /** RotationAnimationSpecProto startLuma. */
            public startLuma: number;

            /** RotationAnimationSpecProto endLuma. */
            public endLuma: number;

            /** RotationAnimationSpecProto durationMs. */
            public durationMs: Long;

            /**
             * Creates a new RotationAnimationSpecProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RotationAnimationSpecProto instance
             */
            public static create(properties?: perfetto.protos.IRotationAnimationSpecProto): perfetto.protos.RotationAnimationSpecProto;

            /**
             * Encodes the specified RotationAnimationSpecProto message. Does not implicitly {@link perfetto.protos.RotationAnimationSpecProto.verify|verify} messages.
             * @param message RotationAnimationSpecProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IRotationAnimationSpecProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RotationAnimationSpecProto message, length delimited. Does not implicitly {@link perfetto.protos.RotationAnimationSpecProto.verify|verify} messages.
             * @param message RotationAnimationSpecProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IRotationAnimationSpecProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RotationAnimationSpecProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RotationAnimationSpecProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.RotationAnimationSpecProto;

            /**
             * Decodes a RotationAnimationSpecProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RotationAnimationSpecProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.RotationAnimationSpecProto;

            /**
             * Verifies a RotationAnimationSpecProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RotationAnimationSpecProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RotationAnimationSpecProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.RotationAnimationSpecProto;

            /**
             * Creates a plain object from a RotationAnimationSpecProto message. Also converts values to other types if specified.
             * @param message RotationAnimationSpecProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.RotationAnimationSpecProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this RotationAnimationSpecProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for RotationAnimationSpecProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a PointProto. */
        interface IPointProto {

            /** PointProto x */
            x?: (number|null);

            /** PointProto y */
            y?: (number|null);
        }

        /** Represents a PointProto. */
        class PointProto implements IPointProto {

            /**
             * Constructs a new PointProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IPointProto);

            /** PointProto x. */
            public x: number;

            /** PointProto y. */
            public y: number;

            /**
             * Creates a new PointProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PointProto instance
             */
            public static create(properties?: perfetto.protos.IPointProto): perfetto.protos.PointProto;

            /**
             * Encodes the specified PointProto message. Does not implicitly {@link perfetto.protos.PointProto.verify|verify} messages.
             * @param message PointProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IPointProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PointProto message, length delimited. Does not implicitly {@link perfetto.protos.PointProto.verify|verify} messages.
             * @param message PointProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IPointProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PointProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PointProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.PointProto;

            /**
             * Decodes a PointProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PointProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.PointProto;

            /**
             * Verifies a PointProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PointProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PointProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.PointProto;

            /**
             * Creates a plain object from a PointProto message. Also converts values to other types if specified.
             * @param message PointProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.PointProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PointProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for PointProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a RemoteAnimationTargetProto. */
        interface IRemoteAnimationTargetProto {

            /** RemoteAnimationTargetProto taskId */
            taskId?: (number|null);

            /** RemoteAnimationTargetProto mode */
            mode?: (number|null);

            /** RemoteAnimationTargetProto leash */
            leash?: (perfetto.protos.ISurfaceControlProto|null);

            /** RemoteAnimationTargetProto isTranslucent */
            isTranslucent?: (boolean|null);

            /** RemoteAnimationTargetProto clipRect */
            clipRect?: (perfetto.protos.IRectProto|null);

            /** RemoteAnimationTargetProto contentInsets */
            contentInsets?: (perfetto.protos.IRectProto|null);

            /** RemoteAnimationTargetProto prefixOrderIndex */
            prefixOrderIndex?: (number|null);

            /** RemoteAnimationTargetProto position */
            position?: (perfetto.protos.IPointProto|null);

            /** RemoteAnimationTargetProto sourceContainerBounds */
            sourceContainerBounds?: (perfetto.protos.IRectProto|null);

            /** RemoteAnimationTargetProto windowConfiguration */
            windowConfiguration?: (perfetto.protos.IWindowConfigurationProto|null);

            /** RemoteAnimationTargetProto startLeash */
            startLeash?: (perfetto.protos.ISurfaceControlProto|null);

            /** RemoteAnimationTargetProto startBounds */
            startBounds?: (perfetto.protos.IRectProto|null);

            /** RemoteAnimationTargetProto localBounds */
            localBounds?: (perfetto.protos.IRectProto|null);

            /** RemoteAnimationTargetProto screenSpaceBounds */
            screenSpaceBounds?: (perfetto.protos.IRectProto|null);
        }

        /** Represents a RemoteAnimationTargetProto. */
        class RemoteAnimationTargetProto implements IRemoteAnimationTargetProto {

            /**
             * Constructs a new RemoteAnimationTargetProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IRemoteAnimationTargetProto);

            /** RemoteAnimationTargetProto taskId. */
            public taskId: number;

            /** RemoteAnimationTargetProto mode. */
            public mode: number;

            /** RemoteAnimationTargetProto leash. */
            public leash?: (perfetto.protos.ISurfaceControlProto|null);

            /** RemoteAnimationTargetProto isTranslucent. */
            public isTranslucent: boolean;

            /** RemoteAnimationTargetProto clipRect. */
            public clipRect?: (perfetto.protos.IRectProto|null);

            /** RemoteAnimationTargetProto contentInsets. */
            public contentInsets?: (perfetto.protos.IRectProto|null);

            /** RemoteAnimationTargetProto prefixOrderIndex. */
            public prefixOrderIndex: number;

            /** RemoteAnimationTargetProto position. */
            public position?: (perfetto.protos.IPointProto|null);

            /** RemoteAnimationTargetProto sourceContainerBounds. */
            public sourceContainerBounds?: (perfetto.protos.IRectProto|null);

            /** RemoteAnimationTargetProto windowConfiguration. */
            public windowConfiguration?: (perfetto.protos.IWindowConfigurationProto|null);

            /** RemoteAnimationTargetProto startLeash. */
            public startLeash?: (perfetto.protos.ISurfaceControlProto|null);

            /** RemoteAnimationTargetProto startBounds. */
            public startBounds?: (perfetto.protos.IRectProto|null);

            /** RemoteAnimationTargetProto localBounds. */
            public localBounds?: (perfetto.protos.IRectProto|null);

            /** RemoteAnimationTargetProto screenSpaceBounds. */
            public screenSpaceBounds?: (perfetto.protos.IRectProto|null);

            /**
             * Creates a new RemoteAnimationTargetProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RemoteAnimationTargetProto instance
             */
            public static create(properties?: perfetto.protos.IRemoteAnimationTargetProto): perfetto.protos.RemoteAnimationTargetProto;

            /**
             * Encodes the specified RemoteAnimationTargetProto message. Does not implicitly {@link perfetto.protos.RemoteAnimationTargetProto.verify|verify} messages.
             * @param message RemoteAnimationTargetProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IRemoteAnimationTargetProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RemoteAnimationTargetProto message, length delimited. Does not implicitly {@link perfetto.protos.RemoteAnimationTargetProto.verify|verify} messages.
             * @param message RemoteAnimationTargetProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IRemoteAnimationTargetProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RemoteAnimationTargetProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RemoteAnimationTargetProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.RemoteAnimationTargetProto;

            /**
             * Decodes a RemoteAnimationTargetProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RemoteAnimationTargetProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.RemoteAnimationTargetProto;

            /**
             * Verifies a RemoteAnimationTargetProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RemoteAnimationTargetProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RemoteAnimationTargetProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.RemoteAnimationTargetProto;

            /**
             * Creates a plain object from a RemoteAnimationTargetProto message. Also converts values to other types if specified.
             * @param message RemoteAnimationTargetProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.RemoteAnimationTargetProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this RemoteAnimationTargetProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for RemoteAnimationTargetProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SurfaceControlProto. */
        interface ISurfaceControlProto {

            /** SurfaceControlProto hashCode */
            hashCode?: (number|null);

            /** SurfaceControlProto name */
            name?: (string|null);

            /** SurfaceControlProto layerId */
            layerId?: (number|null);
        }

        /** Represents a SurfaceControlProto. */
        class SurfaceControlProto implements ISurfaceControlProto {

            /**
             * Constructs a new SurfaceControlProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.ISurfaceControlProto);

            /** SurfaceControlProto hashCode. */
            public hashCode: number;

            /** SurfaceControlProto name. */
            public name: string;

            /** SurfaceControlProto layerId. */
            public layerId: number;

            /**
             * Creates a new SurfaceControlProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SurfaceControlProto instance
             */
            public static create(properties?: perfetto.protos.ISurfaceControlProto): perfetto.protos.SurfaceControlProto;

            /**
             * Encodes the specified SurfaceControlProto message. Does not implicitly {@link perfetto.protos.SurfaceControlProto.verify|verify} messages.
             * @param message SurfaceControlProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.ISurfaceControlProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SurfaceControlProto message, length delimited. Does not implicitly {@link perfetto.protos.SurfaceControlProto.verify|verify} messages.
             * @param message SurfaceControlProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.ISurfaceControlProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SurfaceControlProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SurfaceControlProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.SurfaceControlProto;

            /**
             * Decodes a SurfaceControlProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SurfaceControlProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.SurfaceControlProto;

            /**
             * Verifies a SurfaceControlProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SurfaceControlProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SurfaceControlProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.SurfaceControlProto;

            /**
             * Creates a plain object from a SurfaceControlProto message. Also converts values to other types if specified.
             * @param message SurfaceControlProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.SurfaceControlProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SurfaceControlProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SurfaceControlProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a DisplayCutoutProto. */
        interface IDisplayCutoutProto {

            /** DisplayCutoutProto insets */
            insets?: (perfetto.protos.IRectProto|null);

            /** DisplayCutoutProto boundLeft */
            boundLeft?: (perfetto.protos.IRectProto|null);

            /** DisplayCutoutProto boundTop */
            boundTop?: (perfetto.protos.IRectProto|null);

            /** DisplayCutoutProto boundRight */
            boundRight?: (perfetto.protos.IRectProto|null);

            /** DisplayCutoutProto boundBottom */
            boundBottom?: (perfetto.protos.IRectProto|null);

            /** DisplayCutoutProto waterfallInsets */
            waterfallInsets?: (perfetto.protos.IRectProto|null);

            /** DisplayCutoutProto sideOverrides */
            sideOverrides?: (number[]|null);
        }

        /** Represents a DisplayCutoutProto. */
        class DisplayCutoutProto implements IDisplayCutoutProto {

            /**
             * Constructs a new DisplayCutoutProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IDisplayCutoutProto);

            /** DisplayCutoutProto insets. */
            public insets?: (perfetto.protos.IRectProto|null);

            /** DisplayCutoutProto boundLeft. */
            public boundLeft?: (perfetto.protos.IRectProto|null);

            /** DisplayCutoutProto boundTop. */
            public boundTop?: (perfetto.protos.IRectProto|null);

            /** DisplayCutoutProto boundRight. */
            public boundRight?: (perfetto.protos.IRectProto|null);

            /** DisplayCutoutProto boundBottom. */
            public boundBottom?: (perfetto.protos.IRectProto|null);

            /** DisplayCutoutProto waterfallInsets. */
            public waterfallInsets?: (perfetto.protos.IRectProto|null);

            /** DisplayCutoutProto sideOverrides. */
            public sideOverrides: number[];

            /**
             * Creates a new DisplayCutoutProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DisplayCutoutProto instance
             */
            public static create(properties?: perfetto.protos.IDisplayCutoutProto): perfetto.protos.DisplayCutoutProto;

            /**
             * Encodes the specified DisplayCutoutProto message. Does not implicitly {@link perfetto.protos.DisplayCutoutProto.verify|verify} messages.
             * @param message DisplayCutoutProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IDisplayCutoutProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DisplayCutoutProto message, length delimited. Does not implicitly {@link perfetto.protos.DisplayCutoutProto.verify|verify} messages.
             * @param message DisplayCutoutProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IDisplayCutoutProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DisplayCutoutProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DisplayCutoutProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.DisplayCutoutProto;

            /**
             * Decodes a DisplayCutoutProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DisplayCutoutProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.DisplayCutoutProto;

            /**
             * Verifies a DisplayCutoutProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DisplayCutoutProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DisplayCutoutProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.DisplayCutoutProto;

            /**
             * Creates a plain object from a DisplayCutoutProto message. Also converts values to other types if specified.
             * @param message DisplayCutoutProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.DisplayCutoutProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DisplayCutoutProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DisplayCutoutProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a DisplayInfoProto. */
        interface IDisplayInfoProto {

            /** DisplayInfoProto logicalWidth */
            logicalWidth?: (number|null);

            /** DisplayInfoProto logicalHeight */
            logicalHeight?: (number|null);

            /** DisplayInfoProto appWidth */
            appWidth?: (number|null);

            /** DisplayInfoProto appHeight */
            appHeight?: (number|null);

            /** DisplayInfoProto name */
            name?: (string|null);

            /** DisplayInfoProto flags */
            flags?: (number|null);

            /** DisplayInfoProto cutout */
            cutout?: (perfetto.protos.IDisplayCutoutProto|null);
        }

        /** Represents a DisplayInfoProto. */
        class DisplayInfoProto implements IDisplayInfoProto {

            /**
             * Constructs a new DisplayInfoProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IDisplayInfoProto);

            /** DisplayInfoProto logicalWidth. */
            public logicalWidth: number;

            /** DisplayInfoProto logicalHeight. */
            public logicalHeight: number;

            /** DisplayInfoProto appWidth. */
            public appWidth: number;

            /** DisplayInfoProto appHeight. */
            public appHeight: number;

            /** DisplayInfoProto name. */
            public name: string;

            /** DisplayInfoProto flags. */
            public flags: number;

            /** DisplayInfoProto cutout. */
            public cutout?: (perfetto.protos.IDisplayCutoutProto|null);

            /**
             * Creates a new DisplayInfoProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DisplayInfoProto instance
             */
            public static create(properties?: perfetto.protos.IDisplayInfoProto): perfetto.protos.DisplayInfoProto;

            /**
             * Encodes the specified DisplayInfoProto message. Does not implicitly {@link perfetto.protos.DisplayInfoProto.verify|verify} messages.
             * @param message DisplayInfoProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IDisplayInfoProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DisplayInfoProto message, length delimited. Does not implicitly {@link perfetto.protos.DisplayInfoProto.verify|verify} messages.
             * @param message DisplayInfoProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IDisplayInfoProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DisplayInfoProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DisplayInfoProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.DisplayInfoProto;

            /**
             * Decodes a DisplayInfoProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DisplayInfoProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.DisplayInfoProto;

            /**
             * Verifies a DisplayInfoProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DisplayInfoProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DisplayInfoProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.DisplayInfoProto;

            /**
             * Creates a plain object from a DisplayInfoProto message. Also converts values to other types if specified.
             * @param message DisplayInfoProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.DisplayInfoProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DisplayInfoProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DisplayInfoProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SurfaceProto. */
        interface ISurfaceProto {
        }

        /** Represents a SurfaceProto. */
        class SurfaceProto implements ISurfaceProto {

            /**
             * Constructs a new SurfaceProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.ISurfaceProto);

            /**
             * Creates a new SurfaceProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SurfaceProto instance
             */
            public static create(properties?: perfetto.protos.ISurfaceProto): perfetto.protos.SurfaceProto;

            /**
             * Encodes the specified SurfaceProto message. Does not implicitly {@link perfetto.protos.SurfaceProto.verify|verify} messages.
             * @param message SurfaceProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.ISurfaceProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SurfaceProto message, length delimited. Does not implicitly {@link perfetto.protos.SurfaceProto.verify|verify} messages.
             * @param message SurfaceProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.ISurfaceProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SurfaceProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SurfaceProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.SurfaceProto;

            /**
             * Decodes a SurfaceProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SurfaceProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.SurfaceProto;

            /**
             * Verifies a SurfaceProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SurfaceProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SurfaceProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.SurfaceProto;

            /**
             * Creates a plain object from a SurfaceProto message. Also converts values to other types if specified.
             * @param message SurfaceProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.SurfaceProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SurfaceProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SurfaceProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace SurfaceProto {

            /** Rotation enum. */
            enum Rotation {
                ROTATION_0 = 0,
                ROTATION_90 = 1,
                ROTATION_180 = 2,
                ROTATION_270 = 3
            }
        }

        /** Properties of a WindowLayoutParamsProto. */
        interface IWindowLayoutParamsProto {

            /** WindowLayoutParamsProto type */
            type?: (number|null);

            /** WindowLayoutParamsProto x */
            x?: (number|null);

            /** WindowLayoutParamsProto y */
            y?: (number|null);

            /** WindowLayoutParamsProto width */
            width?: (number|null);

            /** WindowLayoutParamsProto height */
            height?: (number|null);

            /** WindowLayoutParamsProto horizontalMargin */
            horizontalMargin?: (number|null);

            /** WindowLayoutParamsProto verticalMargin */
            verticalMargin?: (number|null);

            /** WindowLayoutParamsProto gravity */
            gravity?: (number|null);

            /** WindowLayoutParamsProto softInputMode */
            softInputMode?: (number|null);

            /** WindowLayoutParamsProto format */
            format?: (perfetto.protos.PixelFormatProto.Format|null);

            /** WindowLayoutParamsProto windowAnimations */
            windowAnimations?: (number|null);

            /** WindowLayoutParamsProto alpha */
            alpha?: (number|null);

            /** WindowLayoutParamsProto screenBrightness */
            screenBrightness?: (number|null);

            /** WindowLayoutParamsProto buttonBrightness */
            buttonBrightness?: (number|null);

            /** WindowLayoutParamsProto rotationAnimation */
            rotationAnimation?: (perfetto.protos.WindowLayoutParamsProto.RotationAnimation|null);

            /** WindowLayoutParamsProto preferredRefreshRate */
            preferredRefreshRate?: (number|null);

            /** WindowLayoutParamsProto preferredDisplayModeId */
            preferredDisplayModeId?: (number|null);

            /** WindowLayoutParamsProto hasSystemUiListeners */
            hasSystemUiListeners?: (boolean|null);

            /** WindowLayoutParamsProto inputFeatureFlags */
            inputFeatureFlags?: (number|null);

            /** WindowLayoutParamsProto userActivityTimeout */
            userActivityTimeout?: (Long|null);

            /** WindowLayoutParamsProto colorMode */
            colorMode?: (perfetto.protos.ViewDisplayProto.ColorMode|null);

            /** WindowLayoutParamsProto flags */
            flags?: (number|null);

            /** WindowLayoutParamsProto privateFlags */
            privateFlags?: (number|null);

            /** WindowLayoutParamsProto systemUiVisibilityFlags */
            systemUiVisibilityFlags?: (number|null);

            /** WindowLayoutParamsProto subtreeSystemUiVisibilityFlags */
            subtreeSystemUiVisibilityFlags?: (number|null);

            /** WindowLayoutParamsProto appearance */
            appearance?: (number|null);

            /** WindowLayoutParamsProto behavior */
            behavior?: (number|null);

            /** WindowLayoutParamsProto fitInsetsTypes */
            fitInsetsTypes?: (number|null);

            /** WindowLayoutParamsProto fitInsetsSides */
            fitInsetsSides?: (number|null);

            /** WindowLayoutParamsProto fitIgnoreVisibility */
            fitIgnoreVisibility?: (boolean|null);
        }

        /** Represents a WindowLayoutParamsProto. */
        class WindowLayoutParamsProto implements IWindowLayoutParamsProto {

            /**
             * Constructs a new WindowLayoutParamsProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWindowLayoutParamsProto);

            /** WindowLayoutParamsProto type. */
            public type: number;

            /** WindowLayoutParamsProto x. */
            public x: number;

            /** WindowLayoutParamsProto y. */
            public y: number;

            /** WindowLayoutParamsProto width. */
            public width: number;

            /** WindowLayoutParamsProto height. */
            public height: number;

            /** WindowLayoutParamsProto horizontalMargin. */
            public horizontalMargin: number;

            /** WindowLayoutParamsProto verticalMargin. */
            public verticalMargin: number;

            /** WindowLayoutParamsProto gravity. */
            public gravity: number;

            /** WindowLayoutParamsProto softInputMode. */
            public softInputMode: number;

            /** WindowLayoutParamsProto format. */
            public format: perfetto.protos.PixelFormatProto.Format;

            /** WindowLayoutParamsProto windowAnimations. */
            public windowAnimations: number;

            /** WindowLayoutParamsProto alpha. */
            public alpha: number;

            /** WindowLayoutParamsProto screenBrightness. */
            public screenBrightness: number;

            /** WindowLayoutParamsProto buttonBrightness. */
            public buttonBrightness: number;

            /** WindowLayoutParamsProto rotationAnimation. */
            public rotationAnimation: perfetto.protos.WindowLayoutParamsProto.RotationAnimation;

            /** WindowLayoutParamsProto preferredRefreshRate. */
            public preferredRefreshRate: number;

            /** WindowLayoutParamsProto preferredDisplayModeId. */
            public preferredDisplayModeId: number;

            /** WindowLayoutParamsProto hasSystemUiListeners. */
            public hasSystemUiListeners: boolean;

            /** WindowLayoutParamsProto inputFeatureFlags. */
            public inputFeatureFlags: number;

            /** WindowLayoutParamsProto userActivityTimeout. */
            public userActivityTimeout: Long;

            /** WindowLayoutParamsProto colorMode. */
            public colorMode: perfetto.protos.ViewDisplayProto.ColorMode;

            /** WindowLayoutParamsProto flags. */
            public flags: number;

            /** WindowLayoutParamsProto privateFlags. */
            public privateFlags: number;

            /** WindowLayoutParamsProto systemUiVisibilityFlags. */
            public systemUiVisibilityFlags: number;

            /** WindowLayoutParamsProto subtreeSystemUiVisibilityFlags. */
            public subtreeSystemUiVisibilityFlags: number;

            /** WindowLayoutParamsProto appearance. */
            public appearance: number;

            /** WindowLayoutParamsProto behavior. */
            public behavior: number;

            /** WindowLayoutParamsProto fitInsetsTypes. */
            public fitInsetsTypes: number;

            /** WindowLayoutParamsProto fitInsetsSides. */
            public fitInsetsSides: number;

            /** WindowLayoutParamsProto fitIgnoreVisibility. */
            public fitIgnoreVisibility: boolean;

            /**
             * Creates a new WindowLayoutParamsProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WindowLayoutParamsProto instance
             */
            public static create(properties?: perfetto.protos.IWindowLayoutParamsProto): perfetto.protos.WindowLayoutParamsProto;

            /**
             * Encodes the specified WindowLayoutParamsProto message. Does not implicitly {@link perfetto.protos.WindowLayoutParamsProto.verify|verify} messages.
             * @param message WindowLayoutParamsProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IWindowLayoutParamsProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WindowLayoutParamsProto message, length delimited. Does not implicitly {@link perfetto.protos.WindowLayoutParamsProto.verify|verify} messages.
             * @param message WindowLayoutParamsProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IWindowLayoutParamsProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WindowLayoutParamsProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WindowLayoutParamsProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.WindowLayoutParamsProto;

            /**
             * Decodes a WindowLayoutParamsProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WindowLayoutParamsProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.WindowLayoutParamsProto;

            /**
             * Verifies a WindowLayoutParamsProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WindowLayoutParamsProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WindowLayoutParamsProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.WindowLayoutParamsProto;

            /**
             * Creates a plain object from a WindowLayoutParamsProto message. Also converts values to other types if specified.
             * @param message WindowLayoutParamsProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.WindowLayoutParamsProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WindowLayoutParamsProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WindowLayoutParamsProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace WindowLayoutParamsProto {

            /** RotationAnimation enum. */
            enum RotationAnimation {
                ROTATION_ANIMATION_UNSPECIFIED = -1,
                ROTATION_ANIMATION_CROSSFADE = 1,
                ROTATION_ANIMATION_JUMPCUT = 2,
                ROTATION_ANIMATION_SEAMLESS = 3
            }
        }

        /** Properties of a PixelFormatProto. */
        interface IPixelFormatProto {
        }

        /** Represents a PixelFormatProto. */
        class PixelFormatProto implements IPixelFormatProto {

            /**
             * Constructs a new PixelFormatProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IPixelFormatProto);

            /**
             * Creates a new PixelFormatProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PixelFormatProto instance
             */
            public static create(properties?: perfetto.protos.IPixelFormatProto): perfetto.protos.PixelFormatProto;

            /**
             * Encodes the specified PixelFormatProto message. Does not implicitly {@link perfetto.protos.PixelFormatProto.verify|verify} messages.
             * @param message PixelFormatProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IPixelFormatProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PixelFormatProto message, length delimited. Does not implicitly {@link perfetto.protos.PixelFormatProto.verify|verify} messages.
             * @param message PixelFormatProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IPixelFormatProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PixelFormatProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PixelFormatProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.PixelFormatProto;

            /**
             * Decodes a PixelFormatProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PixelFormatProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.PixelFormatProto;

            /**
             * Verifies a PixelFormatProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PixelFormatProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PixelFormatProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.PixelFormatProto;

            /**
             * Creates a plain object from a PixelFormatProto message. Also converts values to other types if specified.
             * @param message PixelFormatProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.PixelFormatProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PixelFormatProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for PixelFormatProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace PixelFormatProto {

            /** Format enum. */
            enum Format {
                UNKNOWN = 0,
                TRANSLUCENT = -3,
                TRANSPARENT = -2,
                OPAQUE = -1,
                RGBA_8888 = 1,
                RGBX_8888 = 2,
                RGB_888 = 3,
                RGB_565 = 4,
                RGBA_F16 = 22,
                RGBA_1010102 = 43
            }
        }

        /** Properties of a ViewDisplayProto. */
        interface IViewDisplayProto {
        }

        /** Represents a ViewDisplayProto. */
        class ViewDisplayProto implements IViewDisplayProto {

            /**
             * Constructs a new ViewDisplayProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IViewDisplayProto);

            /**
             * Creates a new ViewDisplayProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ViewDisplayProto instance
             */
            public static create(properties?: perfetto.protos.IViewDisplayProto): perfetto.protos.ViewDisplayProto;

            /**
             * Encodes the specified ViewDisplayProto message. Does not implicitly {@link perfetto.protos.ViewDisplayProto.verify|verify} messages.
             * @param message ViewDisplayProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IViewDisplayProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ViewDisplayProto message, length delimited. Does not implicitly {@link perfetto.protos.ViewDisplayProto.verify|verify} messages.
             * @param message ViewDisplayProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IViewDisplayProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ViewDisplayProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ViewDisplayProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ViewDisplayProto;

            /**
             * Decodes a ViewDisplayProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ViewDisplayProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ViewDisplayProto;

            /**
             * Verifies a ViewDisplayProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ViewDisplayProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ViewDisplayProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.ViewDisplayProto;

            /**
             * Creates a plain object from a ViewDisplayProto message. Also converts values to other types if specified.
             * @param message ViewDisplayProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.ViewDisplayProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ViewDisplayProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ViewDisplayProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ViewDisplayProto {

            /** ColorMode enum. */
            enum ColorMode {
                COLOR_MODE_INVALID = -1,
                COLOR_MODE_DEFAULT = 0,
                COLOR_MODE_BT601_625 = 1,
                COLOR_MODE_BT601_625_UNADJUSTED = 2,
                COLOR_MODE_BT601_525 = 3,
                COLOR_MODE_BT601_525_UNADJUSTED = 4,
                COLOR_MODE_BT709 = 5,
                COLOR_MODE_DCI_P3 = 6,
                COLOR_MODE_SRGB = 7,
                COLOR_MODE_ADOBE_RGB = 8,
                COLOR_MODE_DISPLAY_P3 = 9
            }
        }

        /** Properties of an InsetsSourceProto. */
        interface IInsetsSourceProto {

            /** InsetsSourceProto type */
            type?: (string|null);

            /** InsetsSourceProto frame */
            frame?: (perfetto.protos.IRectProto|null);

            /** InsetsSourceProto visibleFrame */
            visibleFrame?: (perfetto.protos.IRectProto|null);

            /** InsetsSourceProto visible */
            visible?: (boolean|null);

            /** InsetsSourceProto typeNumber */
            typeNumber?: (number|null);
        }

        /** Represents an InsetsSourceProto. */
        class InsetsSourceProto implements IInsetsSourceProto {

            /**
             * Constructs a new InsetsSourceProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IInsetsSourceProto);

            /** InsetsSourceProto type. */
            public type: string;

            /** InsetsSourceProto frame. */
            public frame?: (perfetto.protos.IRectProto|null);

            /** InsetsSourceProto visibleFrame. */
            public visibleFrame?: (perfetto.protos.IRectProto|null);

            /** InsetsSourceProto visible. */
            public visible: boolean;

            /** InsetsSourceProto typeNumber. */
            public typeNumber: number;

            /**
             * Creates a new InsetsSourceProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InsetsSourceProto instance
             */
            public static create(properties?: perfetto.protos.IInsetsSourceProto): perfetto.protos.InsetsSourceProto;

            /**
             * Encodes the specified InsetsSourceProto message. Does not implicitly {@link perfetto.protos.InsetsSourceProto.verify|verify} messages.
             * @param message InsetsSourceProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IInsetsSourceProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InsetsSourceProto message, length delimited. Does not implicitly {@link perfetto.protos.InsetsSourceProto.verify|verify} messages.
             * @param message InsetsSourceProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IInsetsSourceProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InsetsSourceProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InsetsSourceProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.InsetsSourceProto;

            /**
             * Decodes an InsetsSourceProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InsetsSourceProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.InsetsSourceProto;

            /**
             * Verifies an InsetsSourceProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an InsetsSourceProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InsetsSourceProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.InsetsSourceProto;

            /**
             * Creates a plain object from an InsetsSourceProto message. Also converts values to other types if specified.
             * @param message InsetsSourceProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.InsetsSourceProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InsetsSourceProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for InsetsSourceProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an InsetsSourceControlProto. */
        interface IInsetsSourceControlProto {

            /** InsetsSourceControlProto type */
            type?: (string|null);

            /** InsetsSourceControlProto position */
            position?: (perfetto.protos.IPointProto|null);

            /** InsetsSourceControlProto leash */
            leash?: (perfetto.protos.ISurfaceControlProto|null);

            /** InsetsSourceControlProto typeNumber */
            typeNumber?: (number|null);
        }

        /** Represents an InsetsSourceControlProto. */
        class InsetsSourceControlProto implements IInsetsSourceControlProto {

            /**
             * Constructs a new InsetsSourceControlProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IInsetsSourceControlProto);

            /** InsetsSourceControlProto type. */
            public type: string;

            /** InsetsSourceControlProto position. */
            public position?: (perfetto.protos.IPointProto|null);

            /** InsetsSourceControlProto leash. */
            public leash?: (perfetto.protos.ISurfaceControlProto|null);

            /** InsetsSourceControlProto typeNumber. */
            public typeNumber: number;

            /**
             * Creates a new InsetsSourceControlProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InsetsSourceControlProto instance
             */
            public static create(properties?: perfetto.protos.IInsetsSourceControlProto): perfetto.protos.InsetsSourceControlProto;

            /**
             * Encodes the specified InsetsSourceControlProto message. Does not implicitly {@link perfetto.protos.InsetsSourceControlProto.verify|verify} messages.
             * @param message InsetsSourceControlProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IInsetsSourceControlProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InsetsSourceControlProto message, length delimited. Does not implicitly {@link perfetto.protos.InsetsSourceControlProto.verify|verify} messages.
             * @param message InsetsSourceControlProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IInsetsSourceControlProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InsetsSourceControlProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InsetsSourceControlProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.InsetsSourceControlProto;

            /**
             * Decodes an InsetsSourceControlProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InsetsSourceControlProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.InsetsSourceControlProto;

            /**
             * Verifies an InsetsSourceControlProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an InsetsSourceControlProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InsetsSourceControlProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.InsetsSourceControlProto;

            /**
             * Creates a plain object from an InsetsSourceControlProto message. Also converts values to other types if specified.
             * @param message InsetsSourceControlProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.InsetsSourceControlProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InsetsSourceControlProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for InsetsSourceControlProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** DisplayStateEnum enum. */
        enum DisplayStateEnum {
            DISPLAY_STATE_UNKNOWN = 0,
            DISPLAY_STATE_OFF = 1,
            DISPLAY_STATE_ON = 2,
            DISPLAY_STATE_DOZE = 3,
            DISPLAY_STATE_DOZE_SUSPEND = 4,
            DISPLAY_STATE_VR = 5,
            DISPLAY_STATE_ON_SUSPEND = 6
        }

        /** DisplayStateReason enum. */
        enum DisplayStateReason {
            DISPLAY_STATE_REASON_UNKNOWN = 0,
            DISPLAY_STATE_REASON_DEFAULT_POLICY = 1,
            DISPLAY_STATE_REASON_DRAW_WAKE_LOCK = 2,
            DISPLAY_STATE_REASON_OFFLOAD = 3,
            DISPLAY_STATE_REASON_TILT = 4,
            DISPLAY_STATE_REASON_DREAM_MANAGER = 5,
            DISPLAY_STATE_REASON_KEY = 6,
            DISPLAY_STATE_REASON_MOTION = 7
        }

        /** TransitionTypeEnum enum. */
        enum TransitionTypeEnum {
            TRANSIT_NONE = 0,
            TRANSIT_UNSET = -1,
            TRANSIT_ACTIVITY_OPEN = 6,
            TRANSIT_ACTIVITY_CLOSE = 7,
            TRANSIT_TASK_OPEN = 8,
            TRANSIT_TASK_CLOSE = 9,
            TRANSIT_TASK_TO_FRONT = 10,
            TRANSIT_TASK_TO_BACK = 11,
            TRANSIT_WALLPAPER_CLOSE = 12,
            TRANSIT_WALLPAPER_OPEN = 13,
            TRANSIT_WALLPAPER_INTRA_OPEN = 14,
            TRANSIT_WALLPAPER_INTRA_CLOSE = 15,
            TRANSIT_TASK_OPEN_BEHIND = 16,
            TRANSIT_TASK_IN_PLACE = 17,
            TRANSIT_ACTIVITY_RELAUNCH = 18,
            TRANSIT_DOCK_TASK_FROM_RECENTS = 19,
            TRANSIT_KEYGUARD_GOING_AWAY = 20,
            TRANSIT_KEYGUARD_GOING_AWAY_ON_WALLPAPER = 21,
            TRANSIT_KEYGUARD_OCCLUDE = 22,
            TRANSIT_KEYGUARD_UNOCCLUDE = 23,
            TRANSIT_TRANSLUCENT_ACTIVITY_OPEN = 24,
            TRANSIT_TRANSLUCENT_ACTIVITY_CLOSE = 25,
            TRANSIT_CRASHING_ACTIVITY_CLOSE = 26
        }
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a FileDescriptorSet. */
        interface IFileDescriptorSet {

            /** FileDescriptorSet file */
            file?: (google.protobuf.IFileDescriptorProto[]|null);
        }

        /** Represents a FileDescriptorSet. */
        class FileDescriptorSet implements IFileDescriptorSet {

            /**
             * Constructs a new FileDescriptorSet.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFileDescriptorSet);

            /** FileDescriptorSet file. */
            public file: google.protobuf.IFileDescriptorProto[];

            /**
             * Creates a new FileDescriptorSet instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FileDescriptorSet instance
             */
            public static create(properties?: google.protobuf.IFileDescriptorSet): google.protobuf.FileDescriptorSet;

            /**
             * Encodes the specified FileDescriptorSet message. Does not implicitly {@link google.protobuf.FileDescriptorSet.verify|verify} messages.
             * @param message FileDescriptorSet message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFileDescriptorSet, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FileDescriptorSet message, length delimited. Does not implicitly {@link google.protobuf.FileDescriptorSet.verify|verify} messages.
             * @param message FileDescriptorSet message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFileDescriptorSet, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FileDescriptorSet message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FileDescriptorSet
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FileDescriptorSet;

            /**
             * Decodes a FileDescriptorSet message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FileDescriptorSet
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FileDescriptorSet;

            /**
             * Verifies a FileDescriptorSet message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FileDescriptorSet message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FileDescriptorSet
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FileDescriptorSet;

            /**
             * Creates a plain object from a FileDescriptorSet message. Also converts values to other types if specified.
             * @param message FileDescriptorSet
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FileDescriptorSet, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FileDescriptorSet to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for FileDescriptorSet
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a FileDescriptorProto. */
        interface IFileDescriptorProto {

            /** FileDescriptorProto name */
            name?: (string|null);

            /** FileDescriptorProto package */
            "package"?: (string|null);

            /** FileDescriptorProto dependency */
            dependency?: (string[]|null);

            /** FileDescriptorProto publicDependency */
            publicDependency?: (number[]|null);

            /** FileDescriptorProto weakDependency */
            weakDependency?: (number[]|null);

            /** FileDescriptorProto messageType */
            messageType?: (google.protobuf.IDescriptorProto[]|null);

            /** FileDescriptorProto enumType */
            enumType?: (google.protobuf.IEnumDescriptorProto[]|null);

            /** FileDescriptorProto service */
            service?: (google.protobuf.IServiceDescriptorProto[]|null);

            /** FileDescriptorProto extension */
            extension?: (google.protobuf.IFieldDescriptorProto[]|null);

            /** FileDescriptorProto options */
            options?: (google.protobuf.IFileOptions|null);

            /** FileDescriptorProto sourceCodeInfo */
            sourceCodeInfo?: (google.protobuf.ISourceCodeInfo|null);

            /** FileDescriptorProto syntax */
            syntax?: (string|null);
        }

        /** Represents a FileDescriptorProto. */
        class FileDescriptorProto implements IFileDescriptorProto {

            /**
             * Constructs a new FileDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFileDescriptorProto);

            /** FileDescriptorProto name. */
            public name: string;

            /** FileDescriptorProto package. */
            public package: string;

            /** FileDescriptorProto dependency. */
            public dependency: string[];

            /** FileDescriptorProto publicDependency. */
            public publicDependency: number[];

            /** FileDescriptorProto weakDependency. */
            public weakDependency: number[];

            /** FileDescriptorProto messageType. */
            public messageType: google.protobuf.IDescriptorProto[];

            /** FileDescriptorProto enumType. */
            public enumType: google.protobuf.IEnumDescriptorProto[];

            /** FileDescriptorProto service. */
            public service: google.protobuf.IServiceDescriptorProto[];

            /** FileDescriptorProto extension. */
            public extension: google.protobuf.IFieldDescriptorProto[];

            /** FileDescriptorProto options. */
            public options?: (google.protobuf.IFileOptions|null);

            /** FileDescriptorProto sourceCodeInfo. */
            public sourceCodeInfo?: (google.protobuf.ISourceCodeInfo|null);

            /** FileDescriptorProto syntax. */
            public syntax: string;

            /**
             * Creates a new FileDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FileDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IFileDescriptorProto): google.protobuf.FileDescriptorProto;

            /**
             * Encodes the specified FileDescriptorProto message. Does not implicitly {@link google.protobuf.FileDescriptorProto.verify|verify} messages.
             * @param message FileDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFileDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FileDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.FileDescriptorProto.verify|verify} messages.
             * @param message FileDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFileDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FileDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FileDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FileDescriptorProto;

            /**
             * Decodes a FileDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FileDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FileDescriptorProto;

            /**
             * Verifies a FileDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FileDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FileDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FileDescriptorProto;

            /**
             * Creates a plain object from a FileDescriptorProto message. Also converts values to other types if specified.
             * @param message FileDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FileDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FileDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for FileDescriptorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a DescriptorProto. */
        interface IDescriptorProto {

            /** DescriptorProto name */
            name?: (string|null);

            /** DescriptorProto field */
            field?: (google.protobuf.IFieldDescriptorProto[]|null);

            /** DescriptorProto extension */
            extension?: (google.protobuf.IFieldDescriptorProto[]|null);

            /** DescriptorProto nestedType */
            nestedType?: (google.protobuf.IDescriptorProto[]|null);

            /** DescriptorProto enumType */
            enumType?: (google.protobuf.IEnumDescriptorProto[]|null);

            /** DescriptorProto extensionRange */
            extensionRange?: (google.protobuf.DescriptorProto.IExtensionRange[]|null);

            /** DescriptorProto oneofDecl */
            oneofDecl?: (google.protobuf.IOneofDescriptorProto[]|null);

            /** DescriptorProto options */
            options?: (google.protobuf.IMessageOptions|null);

            /** DescriptorProto reservedRange */
            reservedRange?: (google.protobuf.DescriptorProto.IReservedRange[]|null);

            /** DescriptorProto reservedName */
            reservedName?: (string[]|null);
        }

        /** Represents a DescriptorProto. */
        class DescriptorProto implements IDescriptorProto {

            /**
             * Constructs a new DescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IDescriptorProto);

            /** DescriptorProto name. */
            public name: string;

            /** DescriptorProto field. */
            public field: google.protobuf.IFieldDescriptorProto[];

            /** DescriptorProto extension. */
            public extension: google.protobuf.IFieldDescriptorProto[];

            /** DescriptorProto nestedType. */
            public nestedType: google.protobuf.IDescriptorProto[];

            /** DescriptorProto enumType. */
            public enumType: google.protobuf.IEnumDescriptorProto[];

            /** DescriptorProto extensionRange. */
            public extensionRange: google.protobuf.DescriptorProto.IExtensionRange[];

            /** DescriptorProto oneofDecl. */
            public oneofDecl: google.protobuf.IOneofDescriptorProto[];

            /** DescriptorProto options. */
            public options?: (google.protobuf.IMessageOptions|null);

            /** DescriptorProto reservedRange. */
            public reservedRange: google.protobuf.DescriptorProto.IReservedRange[];

            /** DescriptorProto reservedName. */
            public reservedName: string[];

            /**
             * Creates a new DescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DescriptorProto instance
             */
            public static create(properties?: google.protobuf.IDescriptorProto): google.protobuf.DescriptorProto;

            /**
             * Encodes the specified DescriptorProto message. Does not implicitly {@link google.protobuf.DescriptorProto.verify|verify} messages.
             * @param message DescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.DescriptorProto.verify|verify} messages.
             * @param message DescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DescriptorProto;

            /**
             * Decodes a DescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DescriptorProto;

            /**
             * Verifies a DescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.DescriptorProto;

            /**
             * Creates a plain object from a DescriptorProto message. Also converts values to other types if specified.
             * @param message DescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.DescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DescriptorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace DescriptorProto {

            /** Properties of an ExtensionRange. */
            interface IExtensionRange {

                /** ExtensionRange start */
                start?: (number|null);

                /** ExtensionRange end */
                end?: (number|null);
            }

            /** Represents an ExtensionRange. */
            class ExtensionRange implements IExtensionRange {

                /**
                 * Constructs a new ExtensionRange.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.DescriptorProto.IExtensionRange);

                /** ExtensionRange start. */
                public start: number;

                /** ExtensionRange end. */
                public end: number;

                /**
                 * Creates a new ExtensionRange instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ExtensionRange instance
                 */
                public static create(properties?: google.protobuf.DescriptorProto.IExtensionRange): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Encodes the specified ExtensionRange message. Does not implicitly {@link google.protobuf.DescriptorProto.ExtensionRange.verify|verify} messages.
                 * @param message ExtensionRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.DescriptorProto.IExtensionRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ExtensionRange message, length delimited. Does not implicitly {@link google.protobuf.DescriptorProto.ExtensionRange.verify|verify} messages.
                 * @param message ExtensionRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.DescriptorProto.IExtensionRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ExtensionRange message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ExtensionRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Decodes an ExtensionRange message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ExtensionRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Verifies an ExtensionRange message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an ExtensionRange message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ExtensionRange
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Creates a plain object from an ExtensionRange message. Also converts values to other types if specified.
                 * @param message ExtensionRange
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.DescriptorProto.ExtensionRange, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ExtensionRange to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ExtensionRange
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a ReservedRange. */
            interface IReservedRange {

                /** ReservedRange start */
                start?: (number|null);

                /** ReservedRange end */
                end?: (number|null);
            }

            /** Represents a ReservedRange. */
            class ReservedRange implements IReservedRange {

                /**
                 * Constructs a new ReservedRange.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.DescriptorProto.IReservedRange);

                /** ReservedRange start. */
                public start: number;

                /** ReservedRange end. */
                public end: number;

                /**
                 * Creates a new ReservedRange instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ReservedRange instance
                 */
                public static create(properties?: google.protobuf.DescriptorProto.IReservedRange): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Encodes the specified ReservedRange message. Does not implicitly {@link google.protobuf.DescriptorProto.ReservedRange.verify|verify} messages.
                 * @param message ReservedRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.DescriptorProto.IReservedRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ReservedRange message, length delimited. Does not implicitly {@link google.protobuf.DescriptorProto.ReservedRange.verify|verify} messages.
                 * @param message ReservedRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.DescriptorProto.IReservedRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ReservedRange message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ReservedRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Decodes a ReservedRange message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ReservedRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Verifies a ReservedRange message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ReservedRange message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ReservedRange
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Creates a plain object from a ReservedRange message. Also converts values to other types if specified.
                 * @param message ReservedRange
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.DescriptorProto.ReservedRange, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ReservedRange to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ReservedRange
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a FieldDescriptorProto. */
        interface IFieldDescriptorProto {

            /** FieldDescriptorProto name */
            name?: (string|null);

            /** FieldDescriptorProto number */
            number?: (number|null);

            /** FieldDescriptorProto label */
            label?: (google.protobuf.FieldDescriptorProto.Label|null);

            /** FieldDescriptorProto type */
            type?: (google.protobuf.FieldDescriptorProto.Type|null);

            /** FieldDescriptorProto typeName */
            typeName?: (string|null);

            /** FieldDescriptorProto extendee */
            extendee?: (string|null);

            /** FieldDescriptorProto defaultValue */
            defaultValue?: (string|null);

            /** FieldDescriptorProto oneofIndex */
            oneofIndex?: (number|null);

            /** FieldDescriptorProto jsonName */
            jsonName?: (string|null);

            /** FieldDescriptorProto options */
            options?: (google.protobuf.IFieldOptions|null);
        }

        /** Represents a FieldDescriptorProto. */
        class FieldDescriptorProto implements IFieldDescriptorProto {

            /**
             * Constructs a new FieldDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFieldDescriptorProto);

            /** FieldDescriptorProto name. */
            public name: string;

            /** FieldDescriptorProto number. */
            public number: number;

            /** FieldDescriptorProto label. */
            public label: google.protobuf.FieldDescriptorProto.Label;

            /** FieldDescriptorProto type. */
            public type: google.protobuf.FieldDescriptorProto.Type;

            /** FieldDescriptorProto typeName. */
            public typeName: string;

            /** FieldDescriptorProto extendee. */
            public extendee: string;

            /** FieldDescriptorProto defaultValue. */
            public defaultValue: string;

            /** FieldDescriptorProto oneofIndex. */
            public oneofIndex: number;

            /** FieldDescriptorProto jsonName. */
            public jsonName: string;

            /** FieldDescriptorProto options. */
            public options?: (google.protobuf.IFieldOptions|null);

            /**
             * Creates a new FieldDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FieldDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IFieldDescriptorProto): google.protobuf.FieldDescriptorProto;

            /**
             * Encodes the specified FieldDescriptorProto message. Does not implicitly {@link google.protobuf.FieldDescriptorProto.verify|verify} messages.
             * @param message FieldDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFieldDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FieldDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.FieldDescriptorProto.verify|verify} messages.
             * @param message FieldDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFieldDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FieldDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FieldDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FieldDescriptorProto;

            /**
             * Decodes a FieldDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FieldDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FieldDescriptorProto;

            /**
             * Verifies a FieldDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FieldDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FieldDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FieldDescriptorProto;

            /**
             * Creates a plain object from a FieldDescriptorProto message. Also converts values to other types if specified.
             * @param message FieldDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FieldDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FieldDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for FieldDescriptorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace FieldDescriptorProto {

            /** Type enum. */
            enum Type {
                TYPE_DOUBLE = 1,
                TYPE_FLOAT = 2,
                TYPE_INT64 = 3,
                TYPE_UINT64 = 4,
                TYPE_INT32 = 5,
                TYPE_FIXED64 = 6,
                TYPE_FIXED32 = 7,
                TYPE_BOOL = 8,
                TYPE_STRING = 9,
                TYPE_GROUP = 10,
                TYPE_MESSAGE = 11,
                TYPE_BYTES = 12,
                TYPE_UINT32 = 13,
                TYPE_ENUM = 14,
                TYPE_SFIXED32 = 15,
                TYPE_SFIXED64 = 16,
                TYPE_SINT32 = 17,
                TYPE_SINT64 = 18
            }

            /** Label enum. */
            enum Label {
                LABEL_OPTIONAL = 1,
                LABEL_REQUIRED = 2,
                LABEL_REPEATED = 3
            }
        }

        /** Properties of an OneofDescriptorProto. */
        interface IOneofDescriptorProto {

            /** OneofDescriptorProto name */
            name?: (string|null);

            /** OneofDescriptorProto options */
            options?: (google.protobuf.IOneofOptions|null);
        }

        /** Represents an OneofDescriptorProto. */
        class OneofDescriptorProto implements IOneofDescriptorProto {

            /**
             * Constructs a new OneofDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IOneofDescriptorProto);

            /** OneofDescriptorProto name. */
            public name: string;

            /** OneofDescriptorProto options. */
            public options?: (google.protobuf.IOneofOptions|null);

            /**
             * Creates a new OneofDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OneofDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IOneofDescriptorProto): google.protobuf.OneofDescriptorProto;

            /**
             * Encodes the specified OneofDescriptorProto message. Does not implicitly {@link google.protobuf.OneofDescriptorProto.verify|verify} messages.
             * @param message OneofDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IOneofDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified OneofDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.OneofDescriptorProto.verify|verify} messages.
             * @param message OneofDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IOneofDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an OneofDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns OneofDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.OneofDescriptorProto;

            /**
             * Decodes an OneofDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns OneofDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.OneofDescriptorProto;

            /**
             * Verifies an OneofDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an OneofDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns OneofDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.OneofDescriptorProto;

            /**
             * Creates a plain object from an OneofDescriptorProto message. Also converts values to other types if specified.
             * @param message OneofDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.OneofDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this OneofDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for OneofDescriptorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnumDescriptorProto. */
        interface IEnumDescriptorProto {

            /** EnumDescriptorProto name */
            name?: (string|null);

            /** EnumDescriptorProto value */
            value?: (google.protobuf.IEnumValueDescriptorProto[]|null);

            /** EnumDescriptorProto options */
            options?: (google.protobuf.IEnumOptions|null);
        }

        /** Represents an EnumDescriptorProto. */
        class EnumDescriptorProto implements IEnumDescriptorProto {

            /**
             * Constructs a new EnumDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEnumDescriptorProto);

            /** EnumDescriptorProto name. */
            public name: string;

            /** EnumDescriptorProto value. */
            public value: google.protobuf.IEnumValueDescriptorProto[];

            /** EnumDescriptorProto options. */
            public options?: (google.protobuf.IEnumOptions|null);

            /**
             * Creates a new EnumDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnumDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IEnumDescriptorProto): google.protobuf.EnumDescriptorProto;

            /**
             * Encodes the specified EnumDescriptorProto message. Does not implicitly {@link google.protobuf.EnumDescriptorProto.verify|verify} messages.
             * @param message EnumDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEnumDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.EnumDescriptorProto.verify|verify} messages.
             * @param message EnumDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEnumDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnumDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumDescriptorProto;

            /**
             * Decodes an EnumDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnumDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumDescriptorProto;

            /**
             * Verifies an EnumDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnumDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnumDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.EnumDescriptorProto;

            /**
             * Creates a plain object from an EnumDescriptorProto message. Also converts values to other types if specified.
             * @param message EnumDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.EnumDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnumDescriptorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnumValueDescriptorProto. */
        interface IEnumValueDescriptorProto {

            /** EnumValueDescriptorProto name */
            name?: (string|null);

            /** EnumValueDescriptorProto number */
            number?: (number|null);

            /** EnumValueDescriptorProto options */
            options?: (google.protobuf.IEnumValueOptions|null);
        }

        /** Represents an EnumValueDescriptorProto. */
        class EnumValueDescriptorProto implements IEnumValueDescriptorProto {

            /**
             * Constructs a new EnumValueDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEnumValueDescriptorProto);

            /** EnumValueDescriptorProto name. */
            public name: string;

            /** EnumValueDescriptorProto number. */
            public number: number;

            /** EnumValueDescriptorProto options. */
            public options?: (google.protobuf.IEnumValueOptions|null);

            /**
             * Creates a new EnumValueDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnumValueDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IEnumValueDescriptorProto): google.protobuf.EnumValueDescriptorProto;

            /**
             * Encodes the specified EnumValueDescriptorProto message. Does not implicitly {@link google.protobuf.EnumValueDescriptorProto.verify|verify} messages.
             * @param message EnumValueDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEnumValueDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumValueDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.EnumValueDescriptorProto.verify|verify} messages.
             * @param message EnumValueDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEnumValueDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumValueDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnumValueDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumValueDescriptorProto;

            /**
             * Decodes an EnumValueDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnumValueDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumValueDescriptorProto;

            /**
             * Verifies an EnumValueDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnumValueDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnumValueDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.EnumValueDescriptorProto;

            /**
             * Creates a plain object from an EnumValueDescriptorProto message. Also converts values to other types if specified.
             * @param message EnumValueDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.EnumValueDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumValueDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnumValueDescriptorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ServiceDescriptorProto. */
        interface IServiceDescriptorProto {

            /** ServiceDescriptorProto name */
            name?: (string|null);

            /** ServiceDescriptorProto method */
            method?: (google.protobuf.IMethodDescriptorProto[]|null);

            /** ServiceDescriptorProto options */
            options?: (google.protobuf.IServiceOptions|null);
        }

        /** Represents a ServiceDescriptorProto. */
        class ServiceDescriptorProto implements IServiceDescriptorProto {

            /**
             * Constructs a new ServiceDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IServiceDescriptorProto);

            /** ServiceDescriptorProto name. */
            public name: string;

            /** ServiceDescriptorProto method. */
            public method: google.protobuf.IMethodDescriptorProto[];

            /** ServiceDescriptorProto options. */
            public options?: (google.protobuf.IServiceOptions|null);

            /**
             * Creates a new ServiceDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ServiceDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IServiceDescriptorProto): google.protobuf.ServiceDescriptorProto;

            /**
             * Encodes the specified ServiceDescriptorProto message. Does not implicitly {@link google.protobuf.ServiceDescriptorProto.verify|verify} messages.
             * @param message ServiceDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IServiceDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ServiceDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.ServiceDescriptorProto.verify|verify} messages.
             * @param message ServiceDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IServiceDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ServiceDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ServiceDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.ServiceDescriptorProto;

            /**
             * Decodes a ServiceDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ServiceDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.ServiceDescriptorProto;

            /**
             * Verifies a ServiceDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ServiceDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ServiceDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.ServiceDescriptorProto;

            /**
             * Creates a plain object from a ServiceDescriptorProto message. Also converts values to other types if specified.
             * @param message ServiceDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.ServiceDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ServiceDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ServiceDescriptorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a MethodDescriptorProto. */
        interface IMethodDescriptorProto {

            /** MethodDescriptorProto name */
            name?: (string|null);

            /** MethodDescriptorProto inputType */
            inputType?: (string|null);

            /** MethodDescriptorProto outputType */
            outputType?: (string|null);

            /** MethodDescriptorProto options */
            options?: (google.protobuf.IMethodOptions|null);

            /** MethodDescriptorProto clientStreaming */
            clientStreaming?: (boolean|null);

            /** MethodDescriptorProto serverStreaming */
            serverStreaming?: (boolean|null);
        }

        /** Represents a MethodDescriptorProto. */
        class MethodDescriptorProto implements IMethodDescriptorProto {

            /**
             * Constructs a new MethodDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IMethodDescriptorProto);

            /** MethodDescriptorProto name. */
            public name: string;

            /** MethodDescriptorProto inputType. */
            public inputType: string;

            /** MethodDescriptorProto outputType. */
            public outputType: string;

            /** MethodDescriptorProto options. */
            public options?: (google.protobuf.IMethodOptions|null);

            /** MethodDescriptorProto clientStreaming. */
            public clientStreaming: boolean;

            /** MethodDescriptorProto serverStreaming. */
            public serverStreaming: boolean;

            /**
             * Creates a new MethodDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MethodDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IMethodDescriptorProto): google.protobuf.MethodDescriptorProto;

            /**
             * Encodes the specified MethodDescriptorProto message. Does not implicitly {@link google.protobuf.MethodDescriptorProto.verify|verify} messages.
             * @param message MethodDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IMethodDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MethodDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.MethodDescriptorProto.verify|verify} messages.
             * @param message MethodDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IMethodDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MethodDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MethodDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.MethodDescriptorProto;

            /**
             * Decodes a MethodDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MethodDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.MethodDescriptorProto;

            /**
             * Verifies a MethodDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MethodDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MethodDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.MethodDescriptorProto;

            /**
             * Creates a plain object from a MethodDescriptorProto message. Also converts values to other types if specified.
             * @param message MethodDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.MethodDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MethodDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for MethodDescriptorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a FileOptions. */
        interface IFileOptions {

            /** FileOptions javaPackage */
            javaPackage?: (string|null);

            /** FileOptions javaOuterClassname */
            javaOuterClassname?: (string|null);

            /** FileOptions javaMultipleFiles */
            javaMultipleFiles?: (boolean|null);

            /** FileOptions javaGenerateEqualsAndHash */
            javaGenerateEqualsAndHash?: (boolean|null);

            /** FileOptions javaStringCheckUtf8 */
            javaStringCheckUtf8?: (boolean|null);

            /** FileOptions optimizeFor */
            optimizeFor?: (google.protobuf.FileOptions.OptimizeMode|null);

            /** FileOptions goPackage */
            goPackage?: (string|null);

            /** FileOptions ccGenericServices */
            ccGenericServices?: (boolean|null);

            /** FileOptions javaGenericServices */
            javaGenericServices?: (boolean|null);

            /** FileOptions pyGenericServices */
            pyGenericServices?: (boolean|null);

            /** FileOptions deprecated */
            deprecated?: (boolean|null);

            /** FileOptions ccEnableArenas */
            ccEnableArenas?: (boolean|null);

            /** FileOptions objcClassPrefix */
            objcClassPrefix?: (string|null);

            /** FileOptions csharpNamespace */
            csharpNamespace?: (string|null);

            /** FileOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents a FileOptions. */
        class FileOptions implements IFileOptions {

            /**
             * Constructs a new FileOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFileOptions);

            /** FileOptions javaPackage. */
            public javaPackage: string;

            /** FileOptions javaOuterClassname. */
            public javaOuterClassname: string;

            /** FileOptions javaMultipleFiles. */
            public javaMultipleFiles: boolean;

            /** FileOptions javaGenerateEqualsAndHash. */
            public javaGenerateEqualsAndHash: boolean;

            /** FileOptions javaStringCheckUtf8. */
            public javaStringCheckUtf8: boolean;

            /** FileOptions optimizeFor. */
            public optimizeFor: google.protobuf.FileOptions.OptimizeMode;

            /** FileOptions goPackage. */
            public goPackage: string;

            /** FileOptions ccGenericServices. */
            public ccGenericServices: boolean;

            /** FileOptions javaGenericServices. */
            public javaGenericServices: boolean;

            /** FileOptions pyGenericServices. */
            public pyGenericServices: boolean;

            /** FileOptions deprecated. */
            public deprecated: boolean;

            /** FileOptions ccEnableArenas. */
            public ccEnableArenas: boolean;

            /** FileOptions objcClassPrefix. */
            public objcClassPrefix: string;

            /** FileOptions csharpNamespace. */
            public csharpNamespace: string;

            /** FileOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new FileOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FileOptions instance
             */
            public static create(properties?: google.protobuf.IFileOptions): google.protobuf.FileOptions;

            /**
             * Encodes the specified FileOptions message. Does not implicitly {@link google.protobuf.FileOptions.verify|verify} messages.
             * @param message FileOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFileOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FileOptions message, length delimited. Does not implicitly {@link google.protobuf.FileOptions.verify|verify} messages.
             * @param message FileOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFileOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FileOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FileOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FileOptions;

            /**
             * Decodes a FileOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FileOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FileOptions;

            /**
             * Verifies a FileOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FileOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FileOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FileOptions;

            /**
             * Creates a plain object from a FileOptions message. Also converts values to other types if specified.
             * @param message FileOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FileOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FileOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for FileOptions
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace FileOptions {

            /** OptimizeMode enum. */
            enum OptimizeMode {
                SPEED = 1,
                CODE_SIZE = 2,
                LITE_RUNTIME = 3
            }
        }

        /** Properties of a MessageOptions. */
        interface IMessageOptions {

            /** MessageOptions messageSetWireFormat */
            messageSetWireFormat?: (boolean|null);

            /** MessageOptions noStandardDescriptorAccessor */
            noStandardDescriptorAccessor?: (boolean|null);

            /** MessageOptions deprecated */
            deprecated?: (boolean|null);

            /** MessageOptions mapEntry */
            mapEntry?: (boolean|null);

            /** MessageOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);

            /** MessageOptions .perfetto.protos.msgPrivacy */
            ".perfetto.protos.msgPrivacy"?: (perfetto.protos.IPrivacyFlags|null);
        }

        /** Represents a MessageOptions. */
        class MessageOptions implements IMessageOptions {

            /**
             * Constructs a new MessageOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IMessageOptions);

            /** MessageOptions messageSetWireFormat. */
            public messageSetWireFormat: boolean;

            /** MessageOptions noStandardDescriptorAccessor. */
            public noStandardDescriptorAccessor: boolean;

            /** MessageOptions deprecated. */
            public deprecated: boolean;

            /** MessageOptions mapEntry. */
            public mapEntry: boolean;

            /** MessageOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new MessageOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MessageOptions instance
             */
            public static create(properties?: google.protobuf.IMessageOptions): google.protobuf.MessageOptions;

            /**
             * Encodes the specified MessageOptions message. Does not implicitly {@link google.protobuf.MessageOptions.verify|verify} messages.
             * @param message MessageOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IMessageOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MessageOptions message, length delimited. Does not implicitly {@link google.protobuf.MessageOptions.verify|verify} messages.
             * @param message MessageOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IMessageOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MessageOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MessageOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.MessageOptions;

            /**
             * Decodes a MessageOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MessageOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.MessageOptions;

            /**
             * Verifies a MessageOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MessageOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MessageOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.MessageOptions;

            /**
             * Creates a plain object from a MessageOptions message. Also converts values to other types if specified.
             * @param message MessageOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.MessageOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MessageOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for MessageOptions
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a FieldOptions. */
        interface IFieldOptions {

            /** FieldOptions ctype */
            ctype?: (google.protobuf.FieldOptions.CType|null);

            /** FieldOptions packed */
            packed?: (boolean|null);

            /** FieldOptions jstype */
            jstype?: (google.protobuf.FieldOptions.JSType|null);

            /** FieldOptions lazy */
            lazy?: (boolean|null);

            /** FieldOptions deprecated */
            deprecated?: (boolean|null);

            /** FieldOptions weak */
            weak?: (boolean|null);

            /** FieldOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);

            /** FieldOptions .perfetto.protos.typedef */
            ".perfetto.protos.typedef"?: (string|null);

            /** FieldOptions .perfetto.protos.privacy */
            ".perfetto.protos.privacy"?: (perfetto.protos.IPrivacyFlags|null);
        }

        /** Represents a FieldOptions. */
        class FieldOptions implements IFieldOptions {

            /**
             * Constructs a new FieldOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFieldOptions);

            /** FieldOptions ctype. */
            public ctype: google.protobuf.FieldOptions.CType;

            /** FieldOptions packed. */
            public packed: boolean;

            /** FieldOptions jstype. */
            public jstype: google.protobuf.FieldOptions.JSType;

            /** FieldOptions lazy. */
            public lazy: boolean;

            /** FieldOptions deprecated. */
            public deprecated: boolean;

            /** FieldOptions weak. */
            public weak: boolean;

            /** FieldOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new FieldOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FieldOptions instance
             */
            public static create(properties?: google.protobuf.IFieldOptions): google.protobuf.FieldOptions;

            /**
             * Encodes the specified FieldOptions message. Does not implicitly {@link google.protobuf.FieldOptions.verify|verify} messages.
             * @param message FieldOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFieldOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FieldOptions message, length delimited. Does not implicitly {@link google.protobuf.FieldOptions.verify|verify} messages.
             * @param message FieldOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFieldOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FieldOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FieldOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FieldOptions;

            /**
             * Decodes a FieldOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FieldOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FieldOptions;

            /**
             * Verifies a FieldOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FieldOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FieldOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FieldOptions;

            /**
             * Creates a plain object from a FieldOptions message. Also converts values to other types if specified.
             * @param message FieldOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FieldOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FieldOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for FieldOptions
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace FieldOptions {

            /** CType enum. */
            enum CType {
                STRING = 0,
                CORD = 1,
                STRING_PIECE = 2
            }

            /** JSType enum. */
            enum JSType {
                JS_NORMAL = 0,
                JS_STRING = 1,
                JS_NUMBER = 2
            }
        }

        /** Properties of an OneofOptions. */
        interface IOneofOptions {

            /** OneofOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents an OneofOptions. */
        class OneofOptions implements IOneofOptions {

            /**
             * Constructs a new OneofOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IOneofOptions);

            /** OneofOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new OneofOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OneofOptions instance
             */
            public static create(properties?: google.protobuf.IOneofOptions): google.protobuf.OneofOptions;

            /**
             * Encodes the specified OneofOptions message. Does not implicitly {@link google.protobuf.OneofOptions.verify|verify} messages.
             * @param message OneofOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IOneofOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified OneofOptions message, length delimited. Does not implicitly {@link google.protobuf.OneofOptions.verify|verify} messages.
             * @param message OneofOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IOneofOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an OneofOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns OneofOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.OneofOptions;

            /**
             * Decodes an OneofOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns OneofOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.OneofOptions;

            /**
             * Verifies an OneofOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an OneofOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns OneofOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.OneofOptions;

            /**
             * Creates a plain object from an OneofOptions message. Also converts values to other types if specified.
             * @param message OneofOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.OneofOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this OneofOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for OneofOptions
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnumOptions. */
        interface IEnumOptions {

            /** EnumOptions allowAlias */
            allowAlias?: (boolean|null);

            /** EnumOptions deprecated */
            deprecated?: (boolean|null);

            /** EnumOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents an EnumOptions. */
        class EnumOptions implements IEnumOptions {

            /**
             * Constructs a new EnumOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEnumOptions);

            /** EnumOptions allowAlias. */
            public allowAlias: boolean;

            /** EnumOptions deprecated. */
            public deprecated: boolean;

            /** EnumOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new EnumOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnumOptions instance
             */
            public static create(properties?: google.protobuf.IEnumOptions): google.protobuf.EnumOptions;

            /**
             * Encodes the specified EnumOptions message. Does not implicitly {@link google.protobuf.EnumOptions.verify|verify} messages.
             * @param message EnumOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEnumOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumOptions message, length delimited. Does not implicitly {@link google.protobuf.EnumOptions.verify|verify} messages.
             * @param message EnumOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEnumOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnumOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumOptions;

            /**
             * Decodes an EnumOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnumOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumOptions;

            /**
             * Verifies an EnumOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnumOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnumOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.EnumOptions;

            /**
             * Creates a plain object from an EnumOptions message. Also converts values to other types if specified.
             * @param message EnumOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.EnumOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnumOptions
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnumValueOptions. */
        interface IEnumValueOptions {

            /** EnumValueOptions deprecated */
            deprecated?: (boolean|null);

            /** EnumValueOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents an EnumValueOptions. */
        class EnumValueOptions implements IEnumValueOptions {

            /**
             * Constructs a new EnumValueOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEnumValueOptions);

            /** EnumValueOptions deprecated. */
            public deprecated: boolean;

            /** EnumValueOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new EnumValueOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnumValueOptions instance
             */
            public static create(properties?: google.protobuf.IEnumValueOptions): google.protobuf.EnumValueOptions;

            /**
             * Encodes the specified EnumValueOptions message. Does not implicitly {@link google.protobuf.EnumValueOptions.verify|verify} messages.
             * @param message EnumValueOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEnumValueOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumValueOptions message, length delimited. Does not implicitly {@link google.protobuf.EnumValueOptions.verify|verify} messages.
             * @param message EnumValueOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEnumValueOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumValueOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnumValueOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumValueOptions;

            /**
             * Decodes an EnumValueOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnumValueOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumValueOptions;

            /**
             * Verifies an EnumValueOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnumValueOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnumValueOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.EnumValueOptions;

            /**
             * Creates a plain object from an EnumValueOptions message. Also converts values to other types if specified.
             * @param message EnumValueOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.EnumValueOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumValueOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnumValueOptions
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ServiceOptions. */
        interface IServiceOptions {

            /** ServiceOptions deprecated */
            deprecated?: (boolean|null);

            /** ServiceOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents a ServiceOptions. */
        class ServiceOptions implements IServiceOptions {

            /**
             * Constructs a new ServiceOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IServiceOptions);

            /** ServiceOptions deprecated. */
            public deprecated: boolean;

            /** ServiceOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new ServiceOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ServiceOptions instance
             */
            public static create(properties?: google.protobuf.IServiceOptions): google.protobuf.ServiceOptions;

            /**
             * Encodes the specified ServiceOptions message. Does not implicitly {@link google.protobuf.ServiceOptions.verify|verify} messages.
             * @param message ServiceOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IServiceOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ServiceOptions message, length delimited. Does not implicitly {@link google.protobuf.ServiceOptions.verify|verify} messages.
             * @param message ServiceOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IServiceOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ServiceOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ServiceOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.ServiceOptions;

            /**
             * Decodes a ServiceOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ServiceOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.ServiceOptions;

            /**
             * Verifies a ServiceOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ServiceOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ServiceOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.ServiceOptions;

            /**
             * Creates a plain object from a ServiceOptions message. Also converts values to other types if specified.
             * @param message ServiceOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.ServiceOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ServiceOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ServiceOptions
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a MethodOptions. */
        interface IMethodOptions {

            /** MethodOptions deprecated */
            deprecated?: (boolean|null);

            /** MethodOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents a MethodOptions. */
        class MethodOptions implements IMethodOptions {

            /**
             * Constructs a new MethodOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IMethodOptions);

            /** MethodOptions deprecated. */
            public deprecated: boolean;

            /** MethodOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new MethodOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MethodOptions instance
             */
            public static create(properties?: google.protobuf.IMethodOptions): google.protobuf.MethodOptions;

            /**
             * Encodes the specified MethodOptions message. Does not implicitly {@link google.protobuf.MethodOptions.verify|verify} messages.
             * @param message MethodOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IMethodOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MethodOptions message, length delimited. Does not implicitly {@link google.protobuf.MethodOptions.verify|verify} messages.
             * @param message MethodOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IMethodOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MethodOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MethodOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.MethodOptions;

            /**
             * Decodes a MethodOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MethodOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.MethodOptions;

            /**
             * Verifies a MethodOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MethodOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MethodOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.MethodOptions;

            /**
             * Creates a plain object from a MethodOptions message. Also converts values to other types if specified.
             * @param message MethodOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.MethodOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MethodOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for MethodOptions
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an UninterpretedOption. */
        interface IUninterpretedOption {

            /** UninterpretedOption name */
            name?: (google.protobuf.UninterpretedOption.INamePart[]|null);

            /** UninterpretedOption identifierValue */
            identifierValue?: (string|null);

            /** UninterpretedOption positiveIntValue */
            positiveIntValue?: (Long|null);

            /** UninterpretedOption negativeIntValue */
            negativeIntValue?: (Long|null);

            /** UninterpretedOption doubleValue */
            doubleValue?: (number|null);

            /** UninterpretedOption stringValue */
            stringValue?: (Uint8Array|null);

            /** UninterpretedOption aggregateValue */
            aggregateValue?: (string|null);
        }

        /** Represents an UninterpretedOption. */
        class UninterpretedOption implements IUninterpretedOption {

            /**
             * Constructs a new UninterpretedOption.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IUninterpretedOption);

            /** UninterpretedOption name. */
            public name: google.protobuf.UninterpretedOption.INamePart[];

            /** UninterpretedOption identifierValue. */
            public identifierValue: string;

            /** UninterpretedOption positiveIntValue. */
            public positiveIntValue: Long;

            /** UninterpretedOption negativeIntValue. */
            public negativeIntValue: Long;

            /** UninterpretedOption doubleValue. */
            public doubleValue: number;

            /** UninterpretedOption stringValue. */
            public stringValue: Uint8Array;

            /** UninterpretedOption aggregateValue. */
            public aggregateValue: string;

            /**
             * Creates a new UninterpretedOption instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UninterpretedOption instance
             */
            public static create(properties?: google.protobuf.IUninterpretedOption): google.protobuf.UninterpretedOption;

            /**
             * Encodes the specified UninterpretedOption message. Does not implicitly {@link google.protobuf.UninterpretedOption.verify|verify} messages.
             * @param message UninterpretedOption message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IUninterpretedOption, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UninterpretedOption message, length delimited. Does not implicitly {@link google.protobuf.UninterpretedOption.verify|verify} messages.
             * @param message UninterpretedOption message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IUninterpretedOption, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an UninterpretedOption message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UninterpretedOption
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UninterpretedOption;

            /**
             * Decodes an UninterpretedOption message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UninterpretedOption
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UninterpretedOption;

            /**
             * Verifies an UninterpretedOption message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an UninterpretedOption message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UninterpretedOption
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.UninterpretedOption;

            /**
             * Creates a plain object from an UninterpretedOption message. Also converts values to other types if specified.
             * @param message UninterpretedOption
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.UninterpretedOption, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UninterpretedOption to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for UninterpretedOption
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace UninterpretedOption {

            /** Properties of a NamePart. */
            interface INamePart {

                /** NamePart namePart */
                namePart: string;

                /** NamePart isExtension */
                isExtension: boolean;
            }

            /** Represents a NamePart. */
            class NamePart implements INamePart {

                /**
                 * Constructs a new NamePart.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.UninterpretedOption.INamePart);

                /** NamePart namePart. */
                public namePart: string;

                /** NamePart isExtension. */
                public isExtension: boolean;

                /**
                 * Creates a new NamePart instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns NamePart instance
                 */
                public static create(properties?: google.protobuf.UninterpretedOption.INamePart): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Encodes the specified NamePart message. Does not implicitly {@link google.protobuf.UninterpretedOption.NamePart.verify|verify} messages.
                 * @param message NamePart message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.UninterpretedOption.INamePart, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified NamePart message, length delimited. Does not implicitly {@link google.protobuf.UninterpretedOption.NamePart.verify|verify} messages.
                 * @param message NamePart message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.UninterpretedOption.INamePart, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a NamePart message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns NamePart
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Decodes a NamePart message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns NamePart
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Verifies a NamePart message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a NamePart message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns NamePart
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Creates a plain object from a NamePart message. Also converts values to other types if specified.
                 * @param message NamePart
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.UninterpretedOption.NamePart, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this NamePart to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for NamePart
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a SourceCodeInfo. */
        interface ISourceCodeInfo {

            /** SourceCodeInfo location */
            location?: (google.protobuf.SourceCodeInfo.ILocation[]|null);
        }

        /** Represents a SourceCodeInfo. */
        class SourceCodeInfo implements ISourceCodeInfo {

            /**
             * Constructs a new SourceCodeInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.ISourceCodeInfo);

            /** SourceCodeInfo location. */
            public location: google.protobuf.SourceCodeInfo.ILocation[];

            /**
             * Creates a new SourceCodeInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SourceCodeInfo instance
             */
            public static create(properties?: google.protobuf.ISourceCodeInfo): google.protobuf.SourceCodeInfo;

            /**
             * Encodes the specified SourceCodeInfo message. Does not implicitly {@link google.protobuf.SourceCodeInfo.verify|verify} messages.
             * @param message SourceCodeInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.ISourceCodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SourceCodeInfo message, length delimited. Does not implicitly {@link google.protobuf.SourceCodeInfo.verify|verify} messages.
             * @param message SourceCodeInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.ISourceCodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SourceCodeInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SourceCodeInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.SourceCodeInfo;

            /**
             * Decodes a SourceCodeInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SourceCodeInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.SourceCodeInfo;

            /**
             * Verifies a SourceCodeInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SourceCodeInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SourceCodeInfo
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.SourceCodeInfo;

            /**
             * Creates a plain object from a SourceCodeInfo message. Also converts values to other types if specified.
             * @param message SourceCodeInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.SourceCodeInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SourceCodeInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SourceCodeInfo
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace SourceCodeInfo {

            /** Properties of a Location. */
            interface ILocation {

                /** Location path */
                path?: (number[]|null);

                /** Location span */
                span?: (number[]|null);

                /** Location leadingComments */
                leadingComments?: (string|null);

                /** Location trailingComments */
                trailingComments?: (string|null);

                /** Location leadingDetachedComments */
                leadingDetachedComments?: (string[]|null);
            }

            /** Represents a Location. */
            class Location implements ILocation {

                /**
                 * Constructs a new Location.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.SourceCodeInfo.ILocation);

                /** Location path. */
                public path: number[];

                /** Location span. */
                public span: number[];

                /** Location leadingComments. */
                public leadingComments: string;

                /** Location trailingComments. */
                public trailingComments: string;

                /** Location leadingDetachedComments. */
                public leadingDetachedComments: string[];

                /**
                 * Creates a new Location instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Location instance
                 */
                public static create(properties?: google.protobuf.SourceCodeInfo.ILocation): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Encodes the specified Location message. Does not implicitly {@link google.protobuf.SourceCodeInfo.Location.verify|verify} messages.
                 * @param message Location message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.SourceCodeInfo.ILocation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Location message, length delimited. Does not implicitly {@link google.protobuf.SourceCodeInfo.Location.verify|verify} messages.
                 * @param message Location message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.SourceCodeInfo.ILocation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Location message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Location
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Decodes a Location message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Location
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Verifies a Location message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Location message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Location
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Creates a plain object from a Location message. Also converts values to other types if specified.
                 * @param message Location
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.SourceCodeInfo.Location, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Location to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Location
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a GeneratedCodeInfo. */
        interface IGeneratedCodeInfo {

            /** GeneratedCodeInfo annotation */
            annotation?: (google.protobuf.GeneratedCodeInfo.IAnnotation[]|null);
        }

        /** Represents a GeneratedCodeInfo. */
        class GeneratedCodeInfo implements IGeneratedCodeInfo {

            /**
             * Constructs a new GeneratedCodeInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IGeneratedCodeInfo);

            /** GeneratedCodeInfo annotation. */
            public annotation: google.protobuf.GeneratedCodeInfo.IAnnotation[];

            /**
             * Creates a new GeneratedCodeInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns GeneratedCodeInfo instance
             */
            public static create(properties?: google.protobuf.IGeneratedCodeInfo): google.protobuf.GeneratedCodeInfo;

            /**
             * Encodes the specified GeneratedCodeInfo message. Does not implicitly {@link google.protobuf.GeneratedCodeInfo.verify|verify} messages.
             * @param message GeneratedCodeInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IGeneratedCodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GeneratedCodeInfo message, length delimited. Does not implicitly {@link google.protobuf.GeneratedCodeInfo.verify|verify} messages.
             * @param message GeneratedCodeInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IGeneratedCodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GeneratedCodeInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GeneratedCodeInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.GeneratedCodeInfo;

            /**
             * Decodes a GeneratedCodeInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GeneratedCodeInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.GeneratedCodeInfo;

            /**
             * Verifies a GeneratedCodeInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a GeneratedCodeInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns GeneratedCodeInfo
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.GeneratedCodeInfo;

            /**
             * Creates a plain object from a GeneratedCodeInfo message. Also converts values to other types if specified.
             * @param message GeneratedCodeInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.GeneratedCodeInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this GeneratedCodeInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for GeneratedCodeInfo
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace GeneratedCodeInfo {

            /** Properties of an Annotation. */
            interface IAnnotation {

                /** Annotation path */
                path?: (number[]|null);

                /** Annotation sourceFile */
                sourceFile?: (string|null);

                /** Annotation begin */
                begin?: (number|null);

                /** Annotation end */
                end?: (number|null);
            }

            /** Represents an Annotation. */
            class Annotation implements IAnnotation {

                /**
                 * Constructs a new Annotation.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.GeneratedCodeInfo.IAnnotation);

                /** Annotation path. */
                public path: number[];

                /** Annotation sourceFile. */
                public sourceFile: string;

                /** Annotation begin. */
                public begin: number;

                /** Annotation end. */
                public end: number;

                /**
                 * Creates a new Annotation instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Annotation instance
                 */
                public static create(properties?: google.protobuf.GeneratedCodeInfo.IAnnotation): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Encodes the specified Annotation message. Does not implicitly {@link google.protobuf.GeneratedCodeInfo.Annotation.verify|verify} messages.
                 * @param message Annotation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.GeneratedCodeInfo.IAnnotation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Annotation message, length delimited. Does not implicitly {@link google.protobuf.GeneratedCodeInfo.Annotation.verify|verify} messages.
                 * @param message Annotation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.GeneratedCodeInfo.IAnnotation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Annotation message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Annotation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Decodes an Annotation message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Annotation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Verifies an Annotation message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Annotation message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Annotation
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Creates a plain object from an Annotation message. Also converts values to other types if specified.
                 * @param message Annotation
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.GeneratedCodeInfo.Annotation, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Annotation to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Annotation
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }
}
