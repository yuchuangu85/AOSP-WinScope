import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace android. */
export namespace android {

    /** Namespace view. */
    namespace view {

        /** Namespace inputmethod. */
        namespace inputmethod {

            /** Properties of an InputMethodClientsTraceFileProto. */
            interface IInputMethodClientsTraceFileProto {

                /** InputMethodClientsTraceFileProto magicNumber */
                magicNumber?: (Long|null);

                /** InputMethodClientsTraceFileProto entry */
                entry?: (android.view.inputmethod.IInputMethodClientsTraceProto[]|null);

                /** InputMethodClientsTraceFileProto realToElapsedTimeOffsetNanos */
                realToElapsedTimeOffsetNanos?: (Long|null);
            }

            /**
             * Represents a file full of trace entries for clients that use InputMethod.
             * Encoded, it should start with 0x9 0x49 0x4d 0x43 0x54 0x52 0x41 0x43 0x45 (.IMCTRACE), such
             * that they can be easily identified.
             */
            class InputMethodClientsTraceFileProto implements IInputMethodClientsTraceFileProto {

                /**
                 * Constructs a new InputMethodClientsTraceFileProto.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.view.inputmethod.IInputMethodClientsTraceFileProto);

                /** InputMethodClientsTraceFileProto magicNumber. */
                public magicNumber: Long;

                /** InputMethodClientsTraceFileProto entry. */
                public entry: android.view.inputmethod.IInputMethodClientsTraceProto[];

                /** InputMethodClientsTraceFileProto realToElapsedTimeOffsetNanos. */
                public realToElapsedTimeOffsetNanos: Long;

                /**
                 * Creates a new InputMethodClientsTraceFileProto instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns InputMethodClientsTraceFileProto instance
                 */
                public static create(properties?: android.view.inputmethod.IInputMethodClientsTraceFileProto): android.view.inputmethod.InputMethodClientsTraceFileProto;

                /**
                 * Encodes the specified InputMethodClientsTraceFileProto message. Does not implicitly {@link android.view.inputmethod.InputMethodClientsTraceFileProto.verify|verify} messages.
                 * @param message InputMethodClientsTraceFileProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.view.inputmethod.IInputMethodClientsTraceFileProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified InputMethodClientsTraceFileProto message, length delimited. Does not implicitly {@link android.view.inputmethod.InputMethodClientsTraceFileProto.verify|verify} messages.
                 * @param message InputMethodClientsTraceFileProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.view.inputmethod.IInputMethodClientsTraceFileProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an InputMethodClientsTraceFileProto message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns InputMethodClientsTraceFileProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputMethodClientsTraceFileProto;

                /**
                 * Decodes an InputMethodClientsTraceFileProto message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns InputMethodClientsTraceFileProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputMethodClientsTraceFileProto;

                /**
                 * Verifies an InputMethodClientsTraceFileProto message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an InputMethodClientsTraceFileProto message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns InputMethodClientsTraceFileProto
                 */
                public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputMethodClientsTraceFileProto;

                /**
                 * Creates a plain object from an InputMethodClientsTraceFileProto message. Also converts values to other types if specified.
                 * @param message InputMethodClientsTraceFileProto
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.view.inputmethod.InputMethodClientsTraceFileProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this InputMethodClientsTraceFileProto to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for InputMethodClientsTraceFileProto
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace InputMethodClientsTraceFileProto {

                /** MagicNumber enum. */
                enum MagicNumber {
                    INVALID = 0,
                    MAGIC_NUMBER_L = 1413696841,
                    MAGIC_NUMBER_H = 1162035538
                }
            }

            /** Properties of an InputMethodClientsTraceProto. */
            interface IInputMethodClientsTraceProto {

                /** InputMethodClientsTraceProto elapsedRealtimeNanos */
                elapsedRealtimeNanos?: (Long|null);

                /** InputMethodClientsTraceProto where */
                where?: (string|null);

                /** InputMethodClientsTraceProto client */
                client?: (android.view.inputmethod.InputMethodClientsTraceProto.IClientSideProto|null);
            }

            /** Represents an InputMethodClientsTraceProto. */
            class InputMethodClientsTraceProto implements IInputMethodClientsTraceProto {

                /**
                 * Constructs a new InputMethodClientsTraceProto.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.view.inputmethod.IInputMethodClientsTraceProto);

                /** InputMethodClientsTraceProto elapsedRealtimeNanos. */
                public elapsedRealtimeNanos: Long;

                /** InputMethodClientsTraceProto where. */
                public where: string;

                /** InputMethodClientsTraceProto client. */
                public client?: (android.view.inputmethod.InputMethodClientsTraceProto.IClientSideProto|null);

                /**
                 * Creates a new InputMethodClientsTraceProto instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns InputMethodClientsTraceProto instance
                 */
                public static create(properties?: android.view.inputmethod.IInputMethodClientsTraceProto): android.view.inputmethod.InputMethodClientsTraceProto;

                /**
                 * Encodes the specified InputMethodClientsTraceProto message. Does not implicitly {@link android.view.inputmethod.InputMethodClientsTraceProto.verify|verify} messages.
                 * @param message InputMethodClientsTraceProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.view.inputmethod.IInputMethodClientsTraceProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified InputMethodClientsTraceProto message, length delimited. Does not implicitly {@link android.view.inputmethod.InputMethodClientsTraceProto.verify|verify} messages.
                 * @param message InputMethodClientsTraceProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.view.inputmethod.IInputMethodClientsTraceProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an InputMethodClientsTraceProto message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns InputMethodClientsTraceProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputMethodClientsTraceProto;

                /**
                 * Decodes an InputMethodClientsTraceProto message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns InputMethodClientsTraceProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputMethodClientsTraceProto;

                /**
                 * Verifies an InputMethodClientsTraceProto message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an InputMethodClientsTraceProto message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns InputMethodClientsTraceProto
                 */
                public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputMethodClientsTraceProto;

                /**
                 * Creates a plain object from an InputMethodClientsTraceProto message. Also converts values to other types if specified.
                 * @param message InputMethodClientsTraceProto
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.view.inputmethod.InputMethodClientsTraceProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this InputMethodClientsTraceProto to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for InputMethodClientsTraceProto
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace InputMethodClientsTraceProto {

                /** Properties of a ClientSideProto. */
                interface IClientSideProto {

                    /** ClientSideProto displayId */
                    displayId?: (number|null);

                    /** ClientSideProto inputMethodManager */
                    inputMethodManager?: (android.view.inputmethod.IInputMethodManagerProto|null);

                    /** ClientSideProto viewRootImpl */
                    viewRootImpl?: (android.view.IViewRootImplProto|null);

                    /** ClientSideProto insetsController */
                    insetsController?: (android.view.IInsetsControllerProto|null);

                    /** ClientSideProto imeInsetsSourceConsumer */
                    imeInsetsSourceConsumer?: (android.view.IImeInsetsSourceConsumerProto|null);

                    /** ClientSideProto editorInfo */
                    editorInfo?: (android.view.inputmethod.IEditorInfoProto|null);

                    /** ClientSideProto imeFocusController */
                    imeFocusController?: (android.view.IImeFocusControllerProto|null);

                    /** ClientSideProto inputConnection */
                    inputConnection?: (android.view.inputmethod.IInputConnectionProto|null);

                    /** ClientSideProto inputConnectionCall */
                    inputConnectionCall?: (android.view.inputmethod.IInputConnectionCallProto|null);
                }

                /** Represents a ClientSideProto. */
                class ClientSideProto implements IClientSideProto {

                    /**
                     * Constructs a new ClientSideProto.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: android.view.inputmethod.InputMethodClientsTraceProto.IClientSideProto);

                    /** ClientSideProto displayId. */
                    public displayId: number;

                    /** ClientSideProto inputMethodManager. */
                    public inputMethodManager?: (android.view.inputmethod.IInputMethodManagerProto|null);

                    /** ClientSideProto viewRootImpl. */
                    public viewRootImpl?: (android.view.IViewRootImplProto|null);

                    /** ClientSideProto insetsController. */
                    public insetsController?: (android.view.IInsetsControllerProto|null);

                    /** ClientSideProto imeInsetsSourceConsumer. */
                    public imeInsetsSourceConsumer?: (android.view.IImeInsetsSourceConsumerProto|null);

                    /** ClientSideProto editorInfo. */
                    public editorInfo?: (android.view.inputmethod.IEditorInfoProto|null);

                    /** ClientSideProto imeFocusController. */
                    public imeFocusController?: (android.view.IImeFocusControllerProto|null);

                    /** ClientSideProto inputConnection. */
                    public inputConnection?: (android.view.inputmethod.IInputConnectionProto|null);

                    /** ClientSideProto inputConnectionCall. */
                    public inputConnectionCall?: (android.view.inputmethod.IInputConnectionCallProto|null);

                    /**
                     * Creates a new ClientSideProto instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ClientSideProto instance
                     */
                    public static create(properties?: android.view.inputmethod.InputMethodClientsTraceProto.IClientSideProto): android.view.inputmethod.InputMethodClientsTraceProto.ClientSideProto;

                    /**
                     * Encodes the specified ClientSideProto message. Does not implicitly {@link android.view.inputmethod.InputMethodClientsTraceProto.ClientSideProto.verify|verify} messages.
                     * @param message ClientSideProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: android.view.inputmethod.InputMethodClientsTraceProto.IClientSideProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ClientSideProto message, length delimited. Does not implicitly {@link android.view.inputmethod.InputMethodClientsTraceProto.ClientSideProto.verify|verify} messages.
                     * @param message ClientSideProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: android.view.inputmethod.InputMethodClientsTraceProto.IClientSideProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ClientSideProto message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ClientSideProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputMethodClientsTraceProto.ClientSideProto;

                    /**
                     * Decodes a ClientSideProto message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ClientSideProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputMethodClientsTraceProto.ClientSideProto;

                    /**
                     * Verifies a ClientSideProto message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ClientSideProto message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ClientSideProto
                     */
                    public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputMethodClientsTraceProto.ClientSideProto;

                    /**
                     * Creates a plain object from a ClientSideProto message. Also converts values to other types if specified.
                     * @param message ClientSideProto
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: android.view.inputmethod.InputMethodClientsTraceProto.ClientSideProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ClientSideProto to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ClientSideProto
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }
            }

            /** Properties of an InputMethodServiceTraceFileProto. */
            interface IInputMethodServiceTraceFileProto {

                /** InputMethodServiceTraceFileProto magicNumber */
                magicNumber?: (Long|null);

                /** InputMethodServiceTraceFileProto entry */
                entry?: (android.view.inputmethod.IInputMethodServiceTraceProto[]|null);

                /** InputMethodServiceTraceFileProto realToElapsedTimeOffsetNanos */
                realToElapsedTimeOffsetNanos?: (Long|null);
            }

            /**
             * Represents a file full of InputMethodService trace entries.
             * Encoded, it should start with 0x9 0x49 0x4d 0x53 0x54 0x52 0x41 0x43 0x45 (.IMSTRACE), such
             * that they can be easily identified.
             */
            class InputMethodServiceTraceFileProto implements IInputMethodServiceTraceFileProto {

                /**
                 * Constructs a new InputMethodServiceTraceFileProto.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.view.inputmethod.IInputMethodServiceTraceFileProto);

                /** InputMethodServiceTraceFileProto magicNumber. */
                public magicNumber: Long;

                /** InputMethodServiceTraceFileProto entry. */
                public entry: android.view.inputmethod.IInputMethodServiceTraceProto[];

                /** InputMethodServiceTraceFileProto realToElapsedTimeOffsetNanos. */
                public realToElapsedTimeOffsetNanos: Long;

                /**
                 * Creates a new InputMethodServiceTraceFileProto instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns InputMethodServiceTraceFileProto instance
                 */
                public static create(properties?: android.view.inputmethod.IInputMethodServiceTraceFileProto): android.view.inputmethod.InputMethodServiceTraceFileProto;

                /**
                 * Encodes the specified InputMethodServiceTraceFileProto message. Does not implicitly {@link android.view.inputmethod.InputMethodServiceTraceFileProto.verify|verify} messages.
                 * @param message InputMethodServiceTraceFileProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.view.inputmethod.IInputMethodServiceTraceFileProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified InputMethodServiceTraceFileProto message, length delimited. Does not implicitly {@link android.view.inputmethod.InputMethodServiceTraceFileProto.verify|verify} messages.
                 * @param message InputMethodServiceTraceFileProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.view.inputmethod.IInputMethodServiceTraceFileProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an InputMethodServiceTraceFileProto message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns InputMethodServiceTraceFileProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputMethodServiceTraceFileProto;

                /**
                 * Decodes an InputMethodServiceTraceFileProto message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns InputMethodServiceTraceFileProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputMethodServiceTraceFileProto;

                /**
                 * Verifies an InputMethodServiceTraceFileProto message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an InputMethodServiceTraceFileProto message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns InputMethodServiceTraceFileProto
                 */
                public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputMethodServiceTraceFileProto;

                /**
                 * Creates a plain object from an InputMethodServiceTraceFileProto message. Also converts values to other types if specified.
                 * @param message InputMethodServiceTraceFileProto
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.view.inputmethod.InputMethodServiceTraceFileProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this InputMethodServiceTraceFileProto to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for InputMethodServiceTraceFileProto
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace InputMethodServiceTraceFileProto {

                /** MagicNumber enum. */
                enum MagicNumber {
                    INVALID = 0,
                    MAGIC_NUMBER_L = 1414745417,
                    MAGIC_NUMBER_H = 1162035538
                }
            }

            /** Properties of an InputMethodServiceTraceProto. */
            interface IInputMethodServiceTraceProto {

                /** InputMethodServiceTraceProto elapsedRealtimeNanos */
                elapsedRealtimeNanos?: (Long|null);

                /** InputMethodServiceTraceProto where */
                where?: (string|null);

                /** InputMethodServiceTraceProto inputMethodService */
                inputMethodService?: (android.inputmethodservice.IInputMethodServiceProto|null);
            }

            /** Represents an InputMethodServiceTraceProto. */
            class InputMethodServiceTraceProto implements IInputMethodServiceTraceProto {

                /**
                 * Constructs a new InputMethodServiceTraceProto.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.view.inputmethod.IInputMethodServiceTraceProto);

                /** InputMethodServiceTraceProto elapsedRealtimeNanos. */
                public elapsedRealtimeNanos: Long;

                /** InputMethodServiceTraceProto where. */
                public where: string;

                /** InputMethodServiceTraceProto inputMethodService. */
                public inputMethodService?: (android.inputmethodservice.IInputMethodServiceProto|null);

                /**
                 * Creates a new InputMethodServiceTraceProto instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns InputMethodServiceTraceProto instance
                 */
                public static create(properties?: android.view.inputmethod.IInputMethodServiceTraceProto): android.view.inputmethod.InputMethodServiceTraceProto;

                /**
                 * Encodes the specified InputMethodServiceTraceProto message. Does not implicitly {@link android.view.inputmethod.InputMethodServiceTraceProto.verify|verify} messages.
                 * @param message InputMethodServiceTraceProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.view.inputmethod.IInputMethodServiceTraceProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified InputMethodServiceTraceProto message, length delimited. Does not implicitly {@link android.view.inputmethod.InputMethodServiceTraceProto.verify|verify} messages.
                 * @param message InputMethodServiceTraceProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.view.inputmethod.IInputMethodServiceTraceProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an InputMethodServiceTraceProto message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns InputMethodServiceTraceProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputMethodServiceTraceProto;

                /**
                 * Decodes an InputMethodServiceTraceProto message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns InputMethodServiceTraceProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputMethodServiceTraceProto;

                /**
                 * Verifies an InputMethodServiceTraceProto message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an InputMethodServiceTraceProto message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns InputMethodServiceTraceProto
                 */
                public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputMethodServiceTraceProto;

                /**
                 * Creates a plain object from an InputMethodServiceTraceProto message. Also converts values to other types if specified.
                 * @param message InputMethodServiceTraceProto
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.view.inputmethod.InputMethodServiceTraceProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this InputMethodServiceTraceProto to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for InputMethodServiceTraceProto
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an InputMethodManagerServiceTraceFileProto. */
            interface IInputMethodManagerServiceTraceFileProto {

                /** InputMethodManagerServiceTraceFileProto magicNumber */
                magicNumber?: (Long|null);

                /** InputMethodManagerServiceTraceFileProto entry */
                entry?: (android.view.inputmethod.IInputMethodManagerServiceTraceProto[]|null);

                /** InputMethodManagerServiceTraceFileProto realToElapsedTimeOffsetNanos */
                realToElapsedTimeOffsetNanos?: (Long|null);
            }

            /**
             * Represents a file full of InputMethodManagerService trace entries.
             * Encoded, it should start with 0x9 0x49 0x4d 0x4d 0x54 0x52 0x41 0x43 0x45 (.IMMTRACE), such
             * that they can be easily identified.
             */
            class InputMethodManagerServiceTraceFileProto implements IInputMethodManagerServiceTraceFileProto {

                /**
                 * Constructs a new InputMethodManagerServiceTraceFileProto.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.view.inputmethod.IInputMethodManagerServiceTraceFileProto);

                /** InputMethodManagerServiceTraceFileProto magicNumber. */
                public magicNumber: Long;

                /** InputMethodManagerServiceTraceFileProto entry. */
                public entry: android.view.inputmethod.IInputMethodManagerServiceTraceProto[];

                /** InputMethodManagerServiceTraceFileProto realToElapsedTimeOffsetNanos. */
                public realToElapsedTimeOffsetNanos: Long;

                /**
                 * Creates a new InputMethodManagerServiceTraceFileProto instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns InputMethodManagerServiceTraceFileProto instance
                 */
                public static create(properties?: android.view.inputmethod.IInputMethodManagerServiceTraceFileProto): android.view.inputmethod.InputMethodManagerServiceTraceFileProto;

                /**
                 * Encodes the specified InputMethodManagerServiceTraceFileProto message. Does not implicitly {@link android.view.inputmethod.InputMethodManagerServiceTraceFileProto.verify|verify} messages.
                 * @param message InputMethodManagerServiceTraceFileProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.view.inputmethod.IInputMethodManagerServiceTraceFileProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified InputMethodManagerServiceTraceFileProto message, length delimited. Does not implicitly {@link android.view.inputmethod.InputMethodManagerServiceTraceFileProto.verify|verify} messages.
                 * @param message InputMethodManagerServiceTraceFileProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.view.inputmethod.IInputMethodManagerServiceTraceFileProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an InputMethodManagerServiceTraceFileProto message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns InputMethodManagerServiceTraceFileProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputMethodManagerServiceTraceFileProto;

                /**
                 * Decodes an InputMethodManagerServiceTraceFileProto message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns InputMethodManagerServiceTraceFileProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputMethodManagerServiceTraceFileProto;

                /**
                 * Verifies an InputMethodManagerServiceTraceFileProto message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an InputMethodManagerServiceTraceFileProto message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns InputMethodManagerServiceTraceFileProto
                 */
                public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputMethodManagerServiceTraceFileProto;

                /**
                 * Creates a plain object from an InputMethodManagerServiceTraceFileProto message. Also converts values to other types if specified.
                 * @param message InputMethodManagerServiceTraceFileProto
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.view.inputmethod.InputMethodManagerServiceTraceFileProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this InputMethodManagerServiceTraceFileProto to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for InputMethodManagerServiceTraceFileProto
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace InputMethodManagerServiceTraceFileProto {

                /** MagicNumber enum. */
                enum MagicNumber {
                    INVALID = 0,
                    MAGIC_NUMBER_L = 1414352201,
                    MAGIC_NUMBER_H = 1162035538
                }
            }

            /** Properties of an InputMethodManagerServiceTraceProto. */
            interface IInputMethodManagerServiceTraceProto {

                /** InputMethodManagerServiceTraceProto elapsedRealtimeNanos */
                elapsedRealtimeNanos?: (Long|null);

                /** InputMethodManagerServiceTraceProto where */
                where?: (string|null);

                /** InputMethodManagerServiceTraceProto inputMethodManagerService */
                inputMethodManagerService?: (android.server.inputmethod.IInputMethodManagerServiceProto|null);
            }

            /** Represents an InputMethodManagerServiceTraceProto. */
            class InputMethodManagerServiceTraceProto implements IInputMethodManagerServiceTraceProto {

                /**
                 * Constructs a new InputMethodManagerServiceTraceProto.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.view.inputmethod.IInputMethodManagerServiceTraceProto);

                /** InputMethodManagerServiceTraceProto elapsedRealtimeNanos. */
                public elapsedRealtimeNanos: Long;

                /** InputMethodManagerServiceTraceProto where. */
                public where: string;

                /** InputMethodManagerServiceTraceProto inputMethodManagerService. */
                public inputMethodManagerService?: (android.server.inputmethod.IInputMethodManagerServiceProto|null);

                /**
                 * Creates a new InputMethodManagerServiceTraceProto instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns InputMethodManagerServiceTraceProto instance
                 */
                public static create(properties?: android.view.inputmethod.IInputMethodManagerServiceTraceProto): android.view.inputmethod.InputMethodManagerServiceTraceProto;

                /**
                 * Encodes the specified InputMethodManagerServiceTraceProto message. Does not implicitly {@link android.view.inputmethod.InputMethodManagerServiceTraceProto.verify|verify} messages.
                 * @param message InputMethodManagerServiceTraceProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.view.inputmethod.IInputMethodManagerServiceTraceProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified InputMethodManagerServiceTraceProto message, length delimited. Does not implicitly {@link android.view.inputmethod.InputMethodManagerServiceTraceProto.verify|verify} messages.
                 * @param message InputMethodManagerServiceTraceProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.view.inputmethod.IInputMethodManagerServiceTraceProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an InputMethodManagerServiceTraceProto message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns InputMethodManagerServiceTraceProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputMethodManagerServiceTraceProto;

                /**
                 * Decodes an InputMethodManagerServiceTraceProto message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns InputMethodManagerServiceTraceProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputMethodManagerServiceTraceProto;

                /**
                 * Verifies an InputMethodManagerServiceTraceProto message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an InputMethodManagerServiceTraceProto message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns InputMethodManagerServiceTraceProto
                 */
                public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputMethodManagerServiceTraceProto;

                /**
                 * Creates a plain object from an InputMethodManagerServiceTraceProto message. Also converts values to other types if specified.
                 * @param message InputMethodManagerServiceTraceProto
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.view.inputmethod.InputMethodManagerServiceTraceProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this InputMethodManagerServiceTraceProto to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for InputMethodManagerServiceTraceProto
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an InputMethodManagerProto. */
            interface IInputMethodManagerProto {

                /** InputMethodManagerProto curId */
                curId?: (string|null);

                /** InputMethodManagerProto fullscreenMode */
                fullscreenMode?: (boolean|null);

                /** InputMethodManagerProto displayId */
                displayId?: (number|null);

                /** InputMethodManagerProto active */
                active?: (boolean|null);

                /** InputMethodManagerProto servedConnecting */
                servedConnecting?: (boolean|null);

                /** InputMethodManagerProto servedView */
                servedView?: (string|null);

                /** InputMethodManagerProto nextServedView */
                nextServedView?: (string|null);
            }

            /** Represents a {@link android.view.inputmethod.InputMethodManager} object. */
            class InputMethodManagerProto implements IInputMethodManagerProto {

                /**
                 * Constructs a new InputMethodManagerProto.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.view.inputmethod.IInputMethodManagerProto);

                /** InputMethodManagerProto curId. */
                public curId: string;

                /** InputMethodManagerProto fullscreenMode. */
                public fullscreenMode: boolean;

                /** InputMethodManagerProto displayId. */
                public displayId: number;

                /** InputMethodManagerProto active. */
                public active: boolean;

                /** InputMethodManagerProto servedConnecting. */
                public servedConnecting: boolean;

                /** InputMethodManagerProto servedView. */
                public servedView: string;

                /** InputMethodManagerProto nextServedView. */
                public nextServedView: string;

                /**
                 * Creates a new InputMethodManagerProto instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns InputMethodManagerProto instance
                 */
                public static create(properties?: android.view.inputmethod.IInputMethodManagerProto): android.view.inputmethod.InputMethodManagerProto;

                /**
                 * Encodes the specified InputMethodManagerProto message. Does not implicitly {@link android.view.inputmethod.InputMethodManagerProto.verify|verify} messages.
                 * @param message InputMethodManagerProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.view.inputmethod.IInputMethodManagerProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified InputMethodManagerProto message, length delimited. Does not implicitly {@link android.view.inputmethod.InputMethodManagerProto.verify|verify} messages.
                 * @param message InputMethodManagerProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.view.inputmethod.IInputMethodManagerProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an InputMethodManagerProto message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns InputMethodManagerProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputMethodManagerProto;

                /**
                 * Decodes an InputMethodManagerProto message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns InputMethodManagerProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputMethodManagerProto;

                /**
                 * Verifies an InputMethodManagerProto message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an InputMethodManagerProto message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns InputMethodManagerProto
                 */
                public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputMethodManagerProto;

                /**
                 * Creates a plain object from an InputMethodManagerProto message. Also converts values to other types if specified.
                 * @param message InputMethodManagerProto
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.view.inputmethod.InputMethodManagerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this InputMethodManagerProto to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for InputMethodManagerProto
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an EditorInfoProto. */
            interface IEditorInfoProto {

                /** EditorInfoProto inputType */
                inputType?: (number|null);

                /** EditorInfoProto imeOptions */
                imeOptions?: (number|null);

                /** EditorInfoProto privateImeOptions */
                privateImeOptions?: (string|null);

                /** EditorInfoProto packageName */
                packageName?: (string|null);

                /** EditorInfoProto fieldId */
                fieldId?: (number|null);

                /** EditorInfoProto targetInputMethodUserId */
                targetInputMethodUserId?: (number|null);
            }

            /** Represents a {@link android.view.inputmethod.EditorInfo} object. */
            class EditorInfoProto implements IEditorInfoProto {

                /**
                 * Constructs a new EditorInfoProto.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.view.inputmethod.IEditorInfoProto);

                /** EditorInfoProto inputType. */
                public inputType: number;

                /** EditorInfoProto imeOptions. */
                public imeOptions: number;

                /** EditorInfoProto privateImeOptions. */
                public privateImeOptions: string;

                /** EditorInfoProto packageName. */
                public packageName: string;

                /** EditorInfoProto fieldId. */
                public fieldId: number;

                /** EditorInfoProto targetInputMethodUserId. */
                public targetInputMethodUserId: number;

                /**
                 * Creates a new EditorInfoProto instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns EditorInfoProto instance
                 */
                public static create(properties?: android.view.inputmethod.IEditorInfoProto): android.view.inputmethod.EditorInfoProto;

                /**
                 * Encodes the specified EditorInfoProto message. Does not implicitly {@link android.view.inputmethod.EditorInfoProto.verify|verify} messages.
                 * @param message EditorInfoProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.view.inputmethod.IEditorInfoProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified EditorInfoProto message, length delimited. Does not implicitly {@link android.view.inputmethod.EditorInfoProto.verify|verify} messages.
                 * @param message EditorInfoProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.view.inputmethod.IEditorInfoProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an EditorInfoProto message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns EditorInfoProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.EditorInfoProto;

                /**
                 * Decodes an EditorInfoProto message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns EditorInfoProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.EditorInfoProto;

                /**
                 * Verifies an EditorInfoProto message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an EditorInfoProto message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns EditorInfoProto
                 */
                public static fromObject(object: { [k: string]: any }): android.view.inputmethod.EditorInfoProto;

                /**
                 * Creates a plain object from an EditorInfoProto message. Also converts values to other types if specified.
                 * @param message EditorInfoProto
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.view.inputmethod.EditorInfoProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this EditorInfoProto to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for EditorInfoProto
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an InputConnectionProto. */
            interface IInputConnectionProto {

                /** InputConnectionProto selectedTextStart */
                selectedTextStart?: (number|null);

                /** InputConnectionProto selectedTextEnd */
                selectedTextEnd?: (number|null);

                /** InputConnectionProto cursorCapsMode */
                cursorCapsMode?: (number|null);
            }

            /** Represents a {@link android.view.inputmethod.InputConnection} object. */
            class InputConnectionProto implements IInputConnectionProto {

                /**
                 * Constructs a new InputConnectionProto.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.view.inputmethod.IInputConnectionProto);

                /** InputConnectionProto selectedTextStart. */
                public selectedTextStart: number;

                /** InputConnectionProto selectedTextEnd. */
                public selectedTextEnd: number;

                /** InputConnectionProto cursorCapsMode. */
                public cursorCapsMode: number;

                /**
                 * Creates a new InputConnectionProto instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns InputConnectionProto instance
                 */
                public static create(properties?: android.view.inputmethod.IInputConnectionProto): android.view.inputmethod.InputConnectionProto;

                /**
                 * Encodes the specified InputConnectionProto message. Does not implicitly {@link android.view.inputmethod.InputConnectionProto.verify|verify} messages.
                 * @param message InputConnectionProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.view.inputmethod.IInputConnectionProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified InputConnectionProto message, length delimited. Does not implicitly {@link android.view.inputmethod.InputConnectionProto.verify|verify} messages.
                 * @param message InputConnectionProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.view.inputmethod.IInputConnectionProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an InputConnectionProto message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns InputConnectionProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputConnectionProto;

                /**
                 * Decodes an InputConnectionProto message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns InputConnectionProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputConnectionProto;

                /**
                 * Verifies an InputConnectionProto message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an InputConnectionProto message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns InputConnectionProto
                 */
                public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputConnectionProto;

                /**
                 * Creates a plain object from an InputConnectionProto message. Also converts values to other types if specified.
                 * @param message InputConnectionProto
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.view.inputmethod.InputConnectionProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this InputConnectionProto to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for InputConnectionProto
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an InputConnectionCallProto. */
            interface IInputConnectionCallProto {

                /** InputConnectionCallProto getTextBeforeCursor */
                getTextBeforeCursor?: (android.view.inputmethod.InputConnectionCallProto.IGetTextBeforeCursor|null);

                /** InputConnectionCallProto getTextAfterCursor */
                getTextAfterCursor?: (android.view.inputmethod.InputConnectionCallProto.IGetTextAfterCursor|null);

                /** InputConnectionCallProto getSelectedText */
                getSelectedText?: (android.view.inputmethod.InputConnectionCallProto.IGetSelectedText|null);

                /** InputConnectionCallProto getSurroundingText */
                getSurroundingText?: (android.view.inputmethod.InputConnectionCallProto.IGetSurroundingText|null);

                /** InputConnectionCallProto getCursorCapsMode */
                getCursorCapsMode?: (android.view.inputmethod.InputConnectionCallProto.IGetCursorCapsMode|null);

                /** InputConnectionCallProto getExtractedText */
                getExtractedText?: (android.view.inputmethod.InputConnectionCallProto.IGetExtractedText|null);
            }

            /**
             * Shows information about parameters and result for method calls to
             * {@link android.view.inputmethod.InputConnection}.
             */
            class InputConnectionCallProto implements IInputConnectionCallProto {

                /**
                 * Constructs a new InputConnectionCallProto.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.view.inputmethod.IInputConnectionCallProto);

                /** InputConnectionCallProto getTextBeforeCursor. */
                public getTextBeforeCursor?: (android.view.inputmethod.InputConnectionCallProto.IGetTextBeforeCursor|null);

                /** InputConnectionCallProto getTextAfterCursor. */
                public getTextAfterCursor?: (android.view.inputmethod.InputConnectionCallProto.IGetTextAfterCursor|null);

                /** InputConnectionCallProto getSelectedText. */
                public getSelectedText?: (android.view.inputmethod.InputConnectionCallProto.IGetSelectedText|null);

                /** InputConnectionCallProto getSurroundingText. */
                public getSurroundingText?: (android.view.inputmethod.InputConnectionCallProto.IGetSurroundingText|null);

                /** InputConnectionCallProto getCursorCapsMode. */
                public getCursorCapsMode?: (android.view.inputmethod.InputConnectionCallProto.IGetCursorCapsMode|null);

                /** InputConnectionCallProto getExtractedText. */
                public getExtractedText?: (android.view.inputmethod.InputConnectionCallProto.IGetExtractedText|null);

                /** InputConnectionCallProto methodCall. */
                public methodCall?: ("getTextBeforeCursor"|"getTextAfterCursor"|"getSelectedText"|"getSurroundingText"|"getCursorCapsMode"|"getExtractedText");

                /**
                 * Creates a new InputConnectionCallProto instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns InputConnectionCallProto instance
                 */
                public static create(properties?: android.view.inputmethod.IInputConnectionCallProto): android.view.inputmethod.InputConnectionCallProto;

                /**
                 * Encodes the specified InputConnectionCallProto message. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.verify|verify} messages.
                 * @param message InputConnectionCallProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.view.inputmethod.IInputConnectionCallProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified InputConnectionCallProto message, length delimited. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.verify|verify} messages.
                 * @param message InputConnectionCallProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.view.inputmethod.IInputConnectionCallProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an InputConnectionCallProto message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns InputConnectionCallProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputConnectionCallProto;

                /**
                 * Decodes an InputConnectionCallProto message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns InputConnectionCallProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputConnectionCallProto;

                /**
                 * Verifies an InputConnectionCallProto message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an InputConnectionCallProto message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns InputConnectionCallProto
                 */
                public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputConnectionCallProto;

                /**
                 * Creates a plain object from an InputConnectionCallProto message. Also converts values to other types if specified.
                 * @param message InputConnectionCallProto
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.view.inputmethod.InputConnectionCallProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this InputConnectionCallProto to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for InputConnectionCallProto
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace InputConnectionCallProto {

                /** Properties of a GetTextBeforeCursor. */
                interface IGetTextBeforeCursor {

                    /** GetTextBeforeCursor length */
                    length?: (number|null);

                    /** GetTextBeforeCursor flags */
                    flags?: (number|null);
                }

                /** Represents a GetTextBeforeCursor. */
                class GetTextBeforeCursor implements IGetTextBeforeCursor {

                    /**
                     * Constructs a new GetTextBeforeCursor.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: android.view.inputmethod.InputConnectionCallProto.IGetTextBeforeCursor);

                    /** GetTextBeforeCursor length. */
                    public length: number;

                    /** GetTextBeforeCursor flags. */
                    public flags: number;

                    /**
                     * Creates a new GetTextBeforeCursor instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetTextBeforeCursor instance
                     */
                    public static create(properties?: android.view.inputmethod.InputConnectionCallProto.IGetTextBeforeCursor): android.view.inputmethod.InputConnectionCallProto.GetTextBeforeCursor;

                    /**
                     * Encodes the specified GetTextBeforeCursor message. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.GetTextBeforeCursor.verify|verify} messages.
                     * @param message GetTextBeforeCursor message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: android.view.inputmethod.InputConnectionCallProto.IGetTextBeforeCursor, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetTextBeforeCursor message, length delimited. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.GetTextBeforeCursor.verify|verify} messages.
                     * @param message GetTextBeforeCursor message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: android.view.inputmethod.InputConnectionCallProto.IGetTextBeforeCursor, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetTextBeforeCursor message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetTextBeforeCursor
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputConnectionCallProto.GetTextBeforeCursor;

                    /**
                     * Decodes a GetTextBeforeCursor message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetTextBeforeCursor
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputConnectionCallProto.GetTextBeforeCursor;

                    /**
                     * Verifies a GetTextBeforeCursor message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetTextBeforeCursor message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetTextBeforeCursor
                     */
                    public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputConnectionCallProto.GetTextBeforeCursor;

                    /**
                     * Creates a plain object from a GetTextBeforeCursor message. Also converts values to other types if specified.
                     * @param message GetTextBeforeCursor
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: android.view.inputmethod.InputConnectionCallProto.GetTextBeforeCursor, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetTextBeforeCursor to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for GetTextBeforeCursor
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a GetTextAfterCursor. */
                interface IGetTextAfterCursor {

                    /** GetTextAfterCursor length */
                    length?: (number|null);

                    /** GetTextAfterCursor flags */
                    flags?: (number|null);
                }

                /** Represents a GetTextAfterCursor. */
                class GetTextAfterCursor implements IGetTextAfterCursor {

                    /**
                     * Constructs a new GetTextAfterCursor.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: android.view.inputmethod.InputConnectionCallProto.IGetTextAfterCursor);

                    /** GetTextAfterCursor length. */
                    public length: number;

                    /** GetTextAfterCursor flags. */
                    public flags: number;

                    /**
                     * Creates a new GetTextAfterCursor instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetTextAfterCursor instance
                     */
                    public static create(properties?: android.view.inputmethod.InputConnectionCallProto.IGetTextAfterCursor): android.view.inputmethod.InputConnectionCallProto.GetTextAfterCursor;

                    /**
                     * Encodes the specified GetTextAfterCursor message. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.GetTextAfterCursor.verify|verify} messages.
                     * @param message GetTextAfterCursor message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: android.view.inputmethod.InputConnectionCallProto.IGetTextAfterCursor, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetTextAfterCursor message, length delimited. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.GetTextAfterCursor.verify|verify} messages.
                     * @param message GetTextAfterCursor message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: android.view.inputmethod.InputConnectionCallProto.IGetTextAfterCursor, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetTextAfterCursor message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetTextAfterCursor
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputConnectionCallProto.GetTextAfterCursor;

                    /**
                     * Decodes a GetTextAfterCursor message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetTextAfterCursor
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputConnectionCallProto.GetTextAfterCursor;

                    /**
                     * Verifies a GetTextAfterCursor message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetTextAfterCursor message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetTextAfterCursor
                     */
                    public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputConnectionCallProto.GetTextAfterCursor;

                    /**
                     * Creates a plain object from a GetTextAfterCursor message. Also converts values to other types if specified.
                     * @param message GetTextAfterCursor
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: android.view.inputmethod.InputConnectionCallProto.GetTextAfterCursor, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetTextAfterCursor to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for GetTextAfterCursor
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a GetSelectedText. */
                interface IGetSelectedText {

                    /** GetSelectedText flags */
                    flags?: (number|null);
                }

                /** Represents a GetSelectedText. */
                class GetSelectedText implements IGetSelectedText {

                    /**
                     * Constructs a new GetSelectedText.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: android.view.inputmethod.InputConnectionCallProto.IGetSelectedText);

                    /** GetSelectedText flags. */
                    public flags: number;

                    /**
                     * Creates a new GetSelectedText instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetSelectedText instance
                     */
                    public static create(properties?: android.view.inputmethod.InputConnectionCallProto.IGetSelectedText): android.view.inputmethod.InputConnectionCallProto.GetSelectedText;

                    /**
                     * Encodes the specified GetSelectedText message. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.GetSelectedText.verify|verify} messages.
                     * @param message GetSelectedText message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: android.view.inputmethod.InputConnectionCallProto.IGetSelectedText, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetSelectedText message, length delimited. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.GetSelectedText.verify|verify} messages.
                     * @param message GetSelectedText message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: android.view.inputmethod.InputConnectionCallProto.IGetSelectedText, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetSelectedText message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetSelectedText
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputConnectionCallProto.GetSelectedText;

                    /**
                     * Decodes a GetSelectedText message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetSelectedText
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputConnectionCallProto.GetSelectedText;

                    /**
                     * Verifies a GetSelectedText message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetSelectedText message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetSelectedText
                     */
                    public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputConnectionCallProto.GetSelectedText;

                    /**
                     * Creates a plain object from a GetSelectedText message. Also converts values to other types if specified.
                     * @param message GetSelectedText
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: android.view.inputmethod.InputConnectionCallProto.GetSelectedText, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetSelectedText to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for GetSelectedText
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a GetSurroundingText. */
                interface IGetSurroundingText {

                    /** GetSurroundingText beforeLength */
                    beforeLength?: (number|null);

                    /** GetSurroundingText afterLength */
                    afterLength?: (number|null);

                    /** GetSurroundingText flags */
                    flags?: (number|null);

                    /** GetSurroundingText result */
                    result?: (android.view.inputmethod.InputConnectionCallProto.GetSurroundingText.ISurroundingText|null);
                }

                /** Represents a GetSurroundingText. */
                class GetSurroundingText implements IGetSurroundingText {

                    /**
                     * Constructs a new GetSurroundingText.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: android.view.inputmethod.InputConnectionCallProto.IGetSurroundingText);

                    /** GetSurroundingText beforeLength. */
                    public beforeLength: number;

                    /** GetSurroundingText afterLength. */
                    public afterLength: number;

                    /** GetSurroundingText flags. */
                    public flags: number;

                    /** GetSurroundingText result. */
                    public result?: (android.view.inputmethod.InputConnectionCallProto.GetSurroundingText.ISurroundingText|null);

                    /**
                     * Creates a new GetSurroundingText instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetSurroundingText instance
                     */
                    public static create(properties?: android.view.inputmethod.InputConnectionCallProto.IGetSurroundingText): android.view.inputmethod.InputConnectionCallProto.GetSurroundingText;

                    /**
                     * Encodes the specified GetSurroundingText message. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.GetSurroundingText.verify|verify} messages.
                     * @param message GetSurroundingText message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: android.view.inputmethod.InputConnectionCallProto.IGetSurroundingText, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetSurroundingText message, length delimited. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.GetSurroundingText.verify|verify} messages.
                     * @param message GetSurroundingText message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: android.view.inputmethod.InputConnectionCallProto.IGetSurroundingText, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetSurroundingText message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetSurroundingText
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputConnectionCallProto.GetSurroundingText;

                    /**
                     * Decodes a GetSurroundingText message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetSurroundingText
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputConnectionCallProto.GetSurroundingText;

                    /**
                     * Verifies a GetSurroundingText message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetSurroundingText message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetSurroundingText
                     */
                    public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputConnectionCallProto.GetSurroundingText;

                    /**
                     * Creates a plain object from a GetSurroundingText message. Also converts values to other types if specified.
                     * @param message GetSurroundingText
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: android.view.inputmethod.InputConnectionCallProto.GetSurroundingText, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetSurroundingText to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for GetSurroundingText
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                namespace GetSurroundingText {

                    /** Properties of a SurroundingText. */
                    interface ISurroundingText {

                        /** SurroundingText selectionStart */
                        selectionStart?: (number|null);

                        /** SurroundingText selectionEnd */
                        selectionEnd?: (number|null);

                        /** SurroundingText offset */
                        offset?: (number|null);
                    }

                    /** Represents a SurroundingText. */
                    class SurroundingText implements ISurroundingText {

                        /**
                         * Constructs a new SurroundingText.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: android.view.inputmethod.InputConnectionCallProto.GetSurroundingText.ISurroundingText);

                        /** SurroundingText selectionStart. */
                        public selectionStart: number;

                        /** SurroundingText selectionEnd. */
                        public selectionEnd: number;

                        /** SurroundingText offset. */
                        public offset: number;

                        /**
                         * Creates a new SurroundingText instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns SurroundingText instance
                         */
                        public static create(properties?: android.view.inputmethod.InputConnectionCallProto.GetSurroundingText.ISurroundingText): android.view.inputmethod.InputConnectionCallProto.GetSurroundingText.SurroundingText;

                        /**
                         * Encodes the specified SurroundingText message. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.GetSurroundingText.SurroundingText.verify|verify} messages.
                         * @param message SurroundingText message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encode(message: android.view.inputmethod.InputConnectionCallProto.GetSurroundingText.ISurroundingText, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified SurroundingText message, length delimited. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.GetSurroundingText.SurroundingText.verify|verify} messages.
                         * @param message SurroundingText message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encodeDelimited(message: android.view.inputmethod.InputConnectionCallProto.GetSurroundingText.ISurroundingText, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes a SurroundingText message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns SurroundingText
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputConnectionCallProto.GetSurroundingText.SurroundingText;

                        /**
                         * Decodes a SurroundingText message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns SurroundingText
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputConnectionCallProto.GetSurroundingText.SurroundingText;

                        /**
                         * Verifies a SurroundingText message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        public static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates a SurroundingText message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns SurroundingText
                         */
                        public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputConnectionCallProto.GetSurroundingText.SurroundingText;

                        /**
                         * Creates a plain object from a SurroundingText message. Also converts values to other types if specified.
                         * @param message SurroundingText
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: android.view.inputmethod.InputConnectionCallProto.GetSurroundingText.SurroundingText, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this SurroundingText to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for SurroundingText
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }
                }

                /** Properties of a GetCursorCapsMode. */
                interface IGetCursorCapsMode {

                    /** GetCursorCapsMode reqModes */
                    reqModes?: (number|null);

                    /** GetCursorCapsMode result */
                    result?: (number|null);
                }

                /** Represents a GetCursorCapsMode. */
                class GetCursorCapsMode implements IGetCursorCapsMode {

                    /**
                     * Constructs a new GetCursorCapsMode.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: android.view.inputmethod.InputConnectionCallProto.IGetCursorCapsMode);

                    /** GetCursorCapsMode reqModes. */
                    public reqModes: number;

                    /** GetCursorCapsMode result. */
                    public result: number;

                    /**
                     * Creates a new GetCursorCapsMode instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetCursorCapsMode instance
                     */
                    public static create(properties?: android.view.inputmethod.InputConnectionCallProto.IGetCursorCapsMode): android.view.inputmethod.InputConnectionCallProto.GetCursorCapsMode;

                    /**
                     * Encodes the specified GetCursorCapsMode message. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.GetCursorCapsMode.verify|verify} messages.
                     * @param message GetCursorCapsMode message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: android.view.inputmethod.InputConnectionCallProto.IGetCursorCapsMode, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetCursorCapsMode message, length delimited. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.GetCursorCapsMode.verify|verify} messages.
                     * @param message GetCursorCapsMode message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: android.view.inputmethod.InputConnectionCallProto.IGetCursorCapsMode, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetCursorCapsMode message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetCursorCapsMode
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputConnectionCallProto.GetCursorCapsMode;

                    /**
                     * Decodes a GetCursorCapsMode message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetCursorCapsMode
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputConnectionCallProto.GetCursorCapsMode;

                    /**
                     * Verifies a GetCursorCapsMode message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetCursorCapsMode message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetCursorCapsMode
                     */
                    public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputConnectionCallProto.GetCursorCapsMode;

                    /**
                     * Creates a plain object from a GetCursorCapsMode message. Also converts values to other types if specified.
                     * @param message GetCursorCapsMode
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: android.view.inputmethod.InputConnectionCallProto.GetCursorCapsMode, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetCursorCapsMode to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for GetCursorCapsMode
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a GetExtractedText. */
                interface IGetExtractedText {

                    /** GetExtractedText request */
                    request?: (android.view.inputmethod.InputConnectionCallProto.GetExtractedText.IExtractedTextRequest|null);

                    /** GetExtractedText flags */
                    flags?: (number|null);
                }

                /** Represents a GetExtractedText. */
                class GetExtractedText implements IGetExtractedText {

                    /**
                     * Constructs a new GetExtractedText.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: android.view.inputmethod.InputConnectionCallProto.IGetExtractedText);

                    /** GetExtractedText request. */
                    public request?: (android.view.inputmethod.InputConnectionCallProto.GetExtractedText.IExtractedTextRequest|null);

                    /** GetExtractedText flags. */
                    public flags: number;

                    /**
                     * Creates a new GetExtractedText instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GetExtractedText instance
                     */
                    public static create(properties?: android.view.inputmethod.InputConnectionCallProto.IGetExtractedText): android.view.inputmethod.InputConnectionCallProto.GetExtractedText;

                    /**
                     * Encodes the specified GetExtractedText message. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.GetExtractedText.verify|verify} messages.
                     * @param message GetExtractedText message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: android.view.inputmethod.InputConnectionCallProto.IGetExtractedText, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GetExtractedText message, length delimited. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.GetExtractedText.verify|verify} messages.
                     * @param message GetExtractedText message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: android.view.inputmethod.InputConnectionCallProto.IGetExtractedText, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GetExtractedText message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GetExtractedText
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputConnectionCallProto.GetExtractedText;

                    /**
                     * Decodes a GetExtractedText message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GetExtractedText
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputConnectionCallProto.GetExtractedText;

                    /**
                     * Verifies a GetExtractedText message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GetExtractedText message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GetExtractedText
                     */
                    public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputConnectionCallProto.GetExtractedText;

                    /**
                     * Creates a plain object from a GetExtractedText message. Also converts values to other types if specified.
                     * @param message GetExtractedText
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: android.view.inputmethod.InputConnectionCallProto.GetExtractedText, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GetExtractedText to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for GetExtractedText
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                namespace GetExtractedText {

                    /** Properties of an ExtractedTextRequest. */
                    interface IExtractedTextRequest {

                        /** ExtractedTextRequest token */
                        token?: (number|null);

                        /** ExtractedTextRequest flags */
                        flags?: (number|null);

                        /** ExtractedTextRequest hintMaxLines */
                        hintMaxLines?: (number|null);

                        /** ExtractedTextRequest hintMaxChars */
                        hintMaxChars?: (number|null);
                    }

                    /** Represents an ExtractedTextRequest. */
                    class ExtractedTextRequest implements IExtractedTextRequest {

                        /**
                         * Constructs a new ExtractedTextRequest.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: android.view.inputmethod.InputConnectionCallProto.GetExtractedText.IExtractedTextRequest);

                        /** ExtractedTextRequest token. */
                        public token: number;

                        /** ExtractedTextRequest flags. */
                        public flags: number;

                        /** ExtractedTextRequest hintMaxLines. */
                        public hintMaxLines: number;

                        /** ExtractedTextRequest hintMaxChars. */
                        public hintMaxChars: number;

                        /**
                         * Creates a new ExtractedTextRequest instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns ExtractedTextRequest instance
                         */
                        public static create(properties?: android.view.inputmethod.InputConnectionCallProto.GetExtractedText.IExtractedTextRequest): android.view.inputmethod.InputConnectionCallProto.GetExtractedText.ExtractedTextRequest;

                        /**
                         * Encodes the specified ExtractedTextRequest message. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.GetExtractedText.ExtractedTextRequest.verify|verify} messages.
                         * @param message ExtractedTextRequest message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encode(message: android.view.inputmethod.InputConnectionCallProto.GetExtractedText.IExtractedTextRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified ExtractedTextRequest message, length delimited. Does not implicitly {@link android.view.inputmethod.InputConnectionCallProto.GetExtractedText.ExtractedTextRequest.verify|verify} messages.
                         * @param message ExtractedTextRequest message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encodeDelimited(message: android.view.inputmethod.InputConnectionCallProto.GetExtractedText.IExtractedTextRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes an ExtractedTextRequest message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns ExtractedTextRequest
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.inputmethod.InputConnectionCallProto.GetExtractedText.ExtractedTextRequest;

                        /**
                         * Decodes an ExtractedTextRequest message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns ExtractedTextRequest
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.inputmethod.InputConnectionCallProto.GetExtractedText.ExtractedTextRequest;

                        /**
                         * Verifies an ExtractedTextRequest message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        public static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates an ExtractedTextRequest message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns ExtractedTextRequest
                         */
                        public static fromObject(object: { [k: string]: any }): android.view.inputmethod.InputConnectionCallProto.GetExtractedText.ExtractedTextRequest;

                        /**
                         * Creates a plain object from an ExtractedTextRequest message. Also converts values to other types if specified.
                         * @param message ExtractedTextRequest
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: android.view.inputmethod.InputConnectionCallProto.GetExtractedText.ExtractedTextRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this ExtractedTextRequest to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for ExtractedTextRequest
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }
                }
            }
        }

        /** Properties of a ViewRootImplProto. */
        interface IViewRootImplProto {

            /** ViewRootImplProto view */
            view?: (string|null);

            /** ViewRootImplProto displayId */
            displayId?: (number|null);

            /** ViewRootImplProto appVisible */
            appVisible?: (boolean|null);

            /** ViewRootImplProto width */
            width?: (number|null);

            /** ViewRootImplProto height */
            height?: (number|null);

            /** ViewRootImplProto isAnimating */
            isAnimating?: (boolean|null);

            /** ViewRootImplProto visibleRect */
            visibleRect?: (android.graphics.IRectProto|null);

            /** ViewRootImplProto isDrawing */
            isDrawing?: (boolean|null);

            /** ViewRootImplProto added */
            added?: (boolean|null);

            /** ViewRootImplProto winFrame */
            winFrame?: (android.graphics.IRectProto|null);

            /** ViewRootImplProto pendingDisplayCutout */
            pendingDisplayCutout?: (android.view.IDisplayCutoutProto|null);

            /** ViewRootImplProto lastWindowInsets */
            lastWindowInsets?: (string|null);

            /** ViewRootImplProto softInputMode */
            softInputMode?: (string|null);

            /** ViewRootImplProto scrollY */
            scrollY?: (number|null);

            /** ViewRootImplProto curScrollY */
            curScrollY?: (number|null);

            /** ViewRootImplProto removed */
            removed?: (boolean|null);

            /** ViewRootImplProto windowAttributes */
            windowAttributes?: (android.view.IWindowLayoutParamsProto|null);
        }

        /** Represents a {@link android.view.ViewRootImpl} object. */
        class ViewRootImplProto implements IViewRootImplProto {

            /**
             * Constructs a new ViewRootImplProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.view.IViewRootImplProto);

            /** ViewRootImplProto view. */
            public view: string;

            /** ViewRootImplProto displayId. */
            public displayId: number;

            /** ViewRootImplProto appVisible. */
            public appVisible: boolean;

            /** ViewRootImplProto width. */
            public width: number;

            /** ViewRootImplProto height. */
            public height: number;

            /** ViewRootImplProto isAnimating. */
            public isAnimating: boolean;

            /** ViewRootImplProto visibleRect. */
            public visibleRect?: (android.graphics.IRectProto|null);

            /** ViewRootImplProto isDrawing. */
            public isDrawing: boolean;

            /** ViewRootImplProto added. */
            public added: boolean;

            /** ViewRootImplProto winFrame. */
            public winFrame?: (android.graphics.IRectProto|null);

            /** ViewRootImplProto pendingDisplayCutout. */
            public pendingDisplayCutout?: (android.view.IDisplayCutoutProto|null);

            /** ViewRootImplProto lastWindowInsets. */
            public lastWindowInsets: string;

            /** ViewRootImplProto softInputMode. */
            public softInputMode: string;

            /** ViewRootImplProto scrollY. */
            public scrollY: number;

            /** ViewRootImplProto curScrollY. */
            public curScrollY: number;

            /** ViewRootImplProto removed. */
            public removed: boolean;

            /** ViewRootImplProto windowAttributes. */
            public windowAttributes?: (android.view.IWindowLayoutParamsProto|null);

            /**
             * Creates a new ViewRootImplProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ViewRootImplProto instance
             */
            public static create(properties?: android.view.IViewRootImplProto): android.view.ViewRootImplProto;

            /**
             * Encodes the specified ViewRootImplProto message. Does not implicitly {@link android.view.ViewRootImplProto.verify|verify} messages.
             * @param message ViewRootImplProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.view.IViewRootImplProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ViewRootImplProto message, length delimited. Does not implicitly {@link android.view.ViewRootImplProto.verify|verify} messages.
             * @param message ViewRootImplProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.view.IViewRootImplProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ViewRootImplProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ViewRootImplProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.ViewRootImplProto;

            /**
             * Decodes a ViewRootImplProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ViewRootImplProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.ViewRootImplProto;

            /**
             * Verifies a ViewRootImplProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ViewRootImplProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ViewRootImplProto
             */
            public static fromObject(object: { [k: string]: any }): android.view.ViewRootImplProto;

            /**
             * Creates a plain object from a ViewRootImplProto message. Also converts values to other types if specified.
             * @param message ViewRootImplProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.view.ViewRootImplProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ViewRootImplProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ViewRootImplProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a DisplayCutoutProto. */
        interface IDisplayCutoutProto {

            /** DisplayCutoutProto insets */
            insets?: (android.graphics.IRectProto|null);

            /** DisplayCutoutProto boundLeft */
            boundLeft?: (android.graphics.IRectProto|null);

            /** DisplayCutoutProto boundTop */
            boundTop?: (android.graphics.IRectProto|null);

            /** DisplayCutoutProto boundRight */
            boundRight?: (android.graphics.IRectProto|null);

            /** DisplayCutoutProto boundBottom */
            boundBottom?: (android.graphics.IRectProto|null);

            /** DisplayCutoutProto waterfallInsets */
            waterfallInsets?: (android.graphics.IRectProto|null);

            /** DisplayCutoutProto sideOverrides */
            sideOverrides?: (number[]|null);
        }

        /** Represents a DisplayCutoutProto. */
        class DisplayCutoutProto implements IDisplayCutoutProto {

            /**
             * Constructs a new DisplayCutoutProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.view.IDisplayCutoutProto);

            /** DisplayCutoutProto insets. */
            public insets?: (android.graphics.IRectProto|null);

            /** DisplayCutoutProto boundLeft. */
            public boundLeft?: (android.graphics.IRectProto|null);

            /** DisplayCutoutProto boundTop. */
            public boundTop?: (android.graphics.IRectProto|null);

            /** DisplayCutoutProto boundRight. */
            public boundRight?: (android.graphics.IRectProto|null);

            /** DisplayCutoutProto boundBottom. */
            public boundBottom?: (android.graphics.IRectProto|null);

            /** DisplayCutoutProto waterfallInsets. */
            public waterfallInsets?: (android.graphics.IRectProto|null);

            /** DisplayCutoutProto sideOverrides. */
            public sideOverrides: number[];

            /**
             * Creates a new DisplayCutoutProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DisplayCutoutProto instance
             */
            public static create(properties?: android.view.IDisplayCutoutProto): android.view.DisplayCutoutProto;

            /**
             * Encodes the specified DisplayCutoutProto message. Does not implicitly {@link android.view.DisplayCutoutProto.verify|verify} messages.
             * @param message DisplayCutoutProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.view.IDisplayCutoutProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DisplayCutoutProto message, length delimited. Does not implicitly {@link android.view.DisplayCutoutProto.verify|verify} messages.
             * @param message DisplayCutoutProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.view.IDisplayCutoutProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DisplayCutoutProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DisplayCutoutProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.DisplayCutoutProto;

            /**
             * Decodes a DisplayCutoutProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DisplayCutoutProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.DisplayCutoutProto;

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
            public static fromObject(object: { [k: string]: any }): android.view.DisplayCutoutProto;

            /**
             * Creates a plain object from a DisplayCutoutProto message. Also converts values to other types if specified.
             * @param message DisplayCutoutProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.view.DisplayCutoutProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            format?: (android.graphics.PixelFormatProto.Format|null);

            /** WindowLayoutParamsProto windowAnimations */
            windowAnimations?: (number|null);

            /** WindowLayoutParamsProto alpha */
            alpha?: (number|null);

            /** WindowLayoutParamsProto screenBrightness */
            screenBrightness?: (number|null);

            /** WindowLayoutParamsProto buttonBrightness */
            buttonBrightness?: (number|null);

            /** WindowLayoutParamsProto rotationAnimation */
            rotationAnimation?: (android.view.WindowLayoutParamsProto.RotationAnimation|null);

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
            colorMode?: (android.view.DisplayProto.ColorMode|null);

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
            constructor(properties?: android.view.IWindowLayoutParamsProto);

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
            public format: android.graphics.PixelFormatProto.Format;

            /** WindowLayoutParamsProto windowAnimations. */
            public windowAnimations: number;

            /** WindowLayoutParamsProto alpha. */
            public alpha: number;

            /** WindowLayoutParamsProto screenBrightness. */
            public screenBrightness: number;

            /** WindowLayoutParamsProto buttonBrightness. */
            public buttonBrightness: number;

            /** WindowLayoutParamsProto rotationAnimation. */
            public rotationAnimation: android.view.WindowLayoutParamsProto.RotationAnimation;

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
            public colorMode: android.view.DisplayProto.ColorMode;

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
            public static create(properties?: android.view.IWindowLayoutParamsProto): android.view.WindowLayoutParamsProto;

            /**
             * Encodes the specified WindowLayoutParamsProto message. Does not implicitly {@link android.view.WindowLayoutParamsProto.verify|verify} messages.
             * @param message WindowLayoutParamsProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.view.IWindowLayoutParamsProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WindowLayoutParamsProto message, length delimited. Does not implicitly {@link android.view.WindowLayoutParamsProto.verify|verify} messages.
             * @param message WindowLayoutParamsProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.view.IWindowLayoutParamsProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WindowLayoutParamsProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WindowLayoutParamsProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.WindowLayoutParamsProto;

            /**
             * Decodes a WindowLayoutParamsProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WindowLayoutParamsProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.WindowLayoutParamsProto;

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
            public static fromObject(object: { [k: string]: any }): android.view.WindowLayoutParamsProto;

            /**
             * Creates a plain object from a WindowLayoutParamsProto message. Also converts values to other types if specified.
             * @param message WindowLayoutParamsProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.view.WindowLayoutParamsProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

        /** Properties of a DisplayProto. */
        interface IDisplayProto {
        }

        /** Represents a DisplayProto. */
        class DisplayProto implements IDisplayProto {

            /**
             * Constructs a new DisplayProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.view.IDisplayProto);

            /**
             * Creates a new DisplayProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DisplayProto instance
             */
            public static create(properties?: android.view.IDisplayProto): android.view.DisplayProto;

            /**
             * Encodes the specified DisplayProto message. Does not implicitly {@link android.view.DisplayProto.verify|verify} messages.
             * @param message DisplayProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.view.IDisplayProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DisplayProto message, length delimited. Does not implicitly {@link android.view.DisplayProto.verify|verify} messages.
             * @param message DisplayProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.view.IDisplayProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DisplayProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DisplayProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.DisplayProto;

            /**
             * Decodes a DisplayProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DisplayProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.DisplayProto;

            /**
             * Verifies a DisplayProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DisplayProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DisplayProto
             */
            public static fromObject(object: { [k: string]: any }): android.view.DisplayProto;

            /**
             * Creates a plain object from a DisplayProto message. Also converts values to other types if specified.
             * @param message DisplayProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.view.DisplayProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DisplayProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DisplayProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace DisplayProto {

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

        /** Properties of an InsetsControllerProto. */
        interface IInsetsControllerProto {

            /** InsetsControllerProto state */
            state?: (android.view.IInsetsStateProto|null);

            /** InsetsControllerProto control */
            control?: (android.view.IInsetsAnimationControlImplProto[]|null);
        }

        /** Represents a {@link android.view.InsetsController} object. */
        class InsetsControllerProto implements IInsetsControllerProto {

            /**
             * Constructs a new InsetsControllerProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.view.IInsetsControllerProto);

            /** InsetsControllerProto state. */
            public state?: (android.view.IInsetsStateProto|null);

            /** InsetsControllerProto control. */
            public control: android.view.IInsetsAnimationControlImplProto[];

            /**
             * Creates a new InsetsControllerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InsetsControllerProto instance
             */
            public static create(properties?: android.view.IInsetsControllerProto): android.view.InsetsControllerProto;

            /**
             * Encodes the specified InsetsControllerProto message. Does not implicitly {@link android.view.InsetsControllerProto.verify|verify} messages.
             * @param message InsetsControllerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.view.IInsetsControllerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InsetsControllerProto message, length delimited. Does not implicitly {@link android.view.InsetsControllerProto.verify|verify} messages.
             * @param message InsetsControllerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.view.IInsetsControllerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InsetsControllerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InsetsControllerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.InsetsControllerProto;

            /**
             * Decodes an InsetsControllerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InsetsControllerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.InsetsControllerProto;

            /**
             * Verifies an InsetsControllerProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an InsetsControllerProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InsetsControllerProto
             */
            public static fromObject(object: { [k: string]: any }): android.view.InsetsControllerProto;

            /**
             * Creates a plain object from an InsetsControllerProto message. Also converts values to other types if specified.
             * @param message InsetsControllerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.view.InsetsControllerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InsetsControllerProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for InsetsControllerProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an InsetsStateProto. */
        interface IInsetsStateProto {

            /** InsetsStateProto sources */
            sources?: (android.view.IInsetsSourceProto[]|null);

            /** InsetsStateProto displayFrame */
            displayFrame?: (android.graphics.IRectProto|null);

            /** InsetsStateProto displayCutout */
            displayCutout?: (android.view.IDisplayCutoutProto|null);
        }

        /** Represents a {@link android.view.InsetsState} object. */
        class InsetsStateProto implements IInsetsStateProto {

            /**
             * Constructs a new InsetsStateProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.view.IInsetsStateProto);

            /** InsetsStateProto sources. */
            public sources: android.view.IInsetsSourceProto[];

            /** InsetsStateProto displayFrame. */
            public displayFrame?: (android.graphics.IRectProto|null);

            /** InsetsStateProto displayCutout. */
            public displayCutout?: (android.view.IDisplayCutoutProto|null);

            /**
             * Creates a new InsetsStateProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InsetsStateProto instance
             */
            public static create(properties?: android.view.IInsetsStateProto): android.view.InsetsStateProto;

            /**
             * Encodes the specified InsetsStateProto message. Does not implicitly {@link android.view.InsetsStateProto.verify|verify} messages.
             * @param message InsetsStateProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.view.IInsetsStateProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InsetsStateProto message, length delimited. Does not implicitly {@link android.view.InsetsStateProto.verify|verify} messages.
             * @param message InsetsStateProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.view.IInsetsStateProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InsetsStateProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InsetsStateProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.InsetsStateProto;

            /**
             * Decodes an InsetsStateProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InsetsStateProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.InsetsStateProto;

            /**
             * Verifies an InsetsStateProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an InsetsStateProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InsetsStateProto
             */
            public static fromObject(object: { [k: string]: any }): android.view.InsetsStateProto;

            /**
             * Creates a plain object from an InsetsStateProto message. Also converts values to other types if specified.
             * @param message InsetsStateProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.view.InsetsStateProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InsetsStateProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for InsetsStateProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an InsetsSourceProto. */
        interface IInsetsSourceProto {

            /** InsetsSourceProto type */
            type?: (string|null);

            /** InsetsSourceProto frame */
            frame?: (android.graphics.IRectProto|null);

            /** InsetsSourceProto visibleFrame */
            visibleFrame?: (android.graphics.IRectProto|null);

            /** InsetsSourceProto visible */
            visible?: (boolean|null);

            /** InsetsSourceProto typeNumber */
            typeNumber?: (number|null);
        }

        /** Represents a {@link android.view.InsetsSource} object. */
        class InsetsSourceProto implements IInsetsSourceProto {

            /**
             * Constructs a new InsetsSourceProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.view.IInsetsSourceProto);

            /** InsetsSourceProto type. */
            public type: string;

            /** InsetsSourceProto frame. */
            public frame?: (android.graphics.IRectProto|null);

            /** InsetsSourceProto visibleFrame. */
            public visibleFrame?: (android.graphics.IRectProto|null);

            /** InsetsSourceProto visible. */
            public visible: boolean;

            /** InsetsSourceProto typeNumber. */
            public typeNumber: number;

            /**
             * Creates a new InsetsSourceProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InsetsSourceProto instance
             */
            public static create(properties?: android.view.IInsetsSourceProto): android.view.InsetsSourceProto;

            /**
             * Encodes the specified InsetsSourceProto message. Does not implicitly {@link android.view.InsetsSourceProto.verify|verify} messages.
             * @param message InsetsSourceProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.view.IInsetsSourceProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InsetsSourceProto message, length delimited. Does not implicitly {@link android.view.InsetsSourceProto.verify|verify} messages.
             * @param message InsetsSourceProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.view.IInsetsSourceProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InsetsSourceProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InsetsSourceProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.InsetsSourceProto;

            /**
             * Decodes an InsetsSourceProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InsetsSourceProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.InsetsSourceProto;

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
            public static fromObject(object: { [k: string]: any }): android.view.InsetsSourceProto;

            /**
             * Creates a plain object from an InsetsSourceProto message. Also converts values to other types if specified.
             * @param message InsetsSourceProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.view.InsetsSourceProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

        /** Properties of an InsetsAnimationControlImplProto. */
        interface IInsetsAnimationControlImplProto {

            /** InsetsAnimationControlImplProto isCancelled */
            isCancelled?: (boolean|null);

            /** InsetsAnimationControlImplProto isFinished */
            isFinished?: (boolean|null);

            /** InsetsAnimationControlImplProto tmpMatrix */
            tmpMatrix?: (string|null);

            /** InsetsAnimationControlImplProto pendingInsets */
            pendingInsets?: (string|null);

            /** InsetsAnimationControlImplProto pendingFraction */
            pendingFraction?: (number|null);

            /** InsetsAnimationControlImplProto shownOnFinish */
            shownOnFinish?: (boolean|null);

            /** InsetsAnimationControlImplProto currentAlpha */
            currentAlpha?: (number|null);

            /** InsetsAnimationControlImplProto pendingAlpha */
            pendingAlpha?: (number|null);
        }

        /** Represents a {@link android.view.InsetsAnimationControlImpl} object. */
        class InsetsAnimationControlImplProto implements IInsetsAnimationControlImplProto {

            /**
             * Constructs a new InsetsAnimationControlImplProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.view.IInsetsAnimationControlImplProto);

            /** InsetsAnimationControlImplProto isCancelled. */
            public isCancelled: boolean;

            /** InsetsAnimationControlImplProto isFinished. */
            public isFinished: boolean;

            /** InsetsAnimationControlImplProto tmpMatrix. */
            public tmpMatrix: string;

            /** InsetsAnimationControlImplProto pendingInsets. */
            public pendingInsets: string;

            /** InsetsAnimationControlImplProto pendingFraction. */
            public pendingFraction: number;

            /** InsetsAnimationControlImplProto shownOnFinish. */
            public shownOnFinish: boolean;

            /** InsetsAnimationControlImplProto currentAlpha. */
            public currentAlpha: number;

            /** InsetsAnimationControlImplProto pendingAlpha. */
            public pendingAlpha: number;

            /**
             * Creates a new InsetsAnimationControlImplProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InsetsAnimationControlImplProto instance
             */
            public static create(properties?: android.view.IInsetsAnimationControlImplProto): android.view.InsetsAnimationControlImplProto;

            /**
             * Encodes the specified InsetsAnimationControlImplProto message. Does not implicitly {@link android.view.InsetsAnimationControlImplProto.verify|verify} messages.
             * @param message InsetsAnimationControlImplProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.view.IInsetsAnimationControlImplProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InsetsAnimationControlImplProto message, length delimited. Does not implicitly {@link android.view.InsetsAnimationControlImplProto.verify|verify} messages.
             * @param message InsetsAnimationControlImplProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.view.IInsetsAnimationControlImplProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InsetsAnimationControlImplProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InsetsAnimationControlImplProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.InsetsAnimationControlImplProto;

            /**
             * Decodes an InsetsAnimationControlImplProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InsetsAnimationControlImplProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.InsetsAnimationControlImplProto;

            /**
             * Verifies an InsetsAnimationControlImplProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an InsetsAnimationControlImplProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InsetsAnimationControlImplProto
             */
            public static fromObject(object: { [k: string]: any }): android.view.InsetsAnimationControlImplProto;

            /**
             * Creates a plain object from an InsetsAnimationControlImplProto message. Also converts values to other types if specified.
             * @param message InsetsAnimationControlImplProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.view.InsetsAnimationControlImplProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InsetsAnimationControlImplProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for InsetsAnimationControlImplProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an ImeInsetsSourceConsumerProto. */
        interface IImeInsetsSourceConsumerProto {

            /** ImeInsetsSourceConsumerProto insetsSourceConsumer */
            insetsSourceConsumer?: (android.view.IInsetsSourceConsumerProto|null);

            /** ImeInsetsSourceConsumerProto isRequestedVisibleAwaitingControl */
            isRequestedVisibleAwaitingControl?: (boolean|null);

            /** ImeInsetsSourceConsumerProto isHideAnimationRunning */
            isHideAnimationRunning?: (boolean|null);

            /** ImeInsetsSourceConsumerProto isShowRequestedDuringHideAnimation */
            isShowRequestedDuringHideAnimation?: (boolean|null);

            /** ImeInsetsSourceConsumerProto hasPendingRequest */
            hasPendingRequest?: (boolean|null);
        }

        /** Represents a {@link android.view.ImeInsetsSourceConsumer} object. */
        class ImeInsetsSourceConsumerProto implements IImeInsetsSourceConsumerProto {

            /**
             * Constructs a new ImeInsetsSourceConsumerProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.view.IImeInsetsSourceConsumerProto);

            /** ImeInsetsSourceConsumerProto insetsSourceConsumer. */
            public insetsSourceConsumer?: (android.view.IInsetsSourceConsumerProto|null);

            /** ImeInsetsSourceConsumerProto isRequestedVisibleAwaitingControl. */
            public isRequestedVisibleAwaitingControl: boolean;

            /** ImeInsetsSourceConsumerProto isHideAnimationRunning. */
            public isHideAnimationRunning: boolean;

            /** ImeInsetsSourceConsumerProto isShowRequestedDuringHideAnimation. */
            public isShowRequestedDuringHideAnimation: boolean;

            /** ImeInsetsSourceConsumerProto hasPendingRequest. */
            public hasPendingRequest: boolean;

            /**
             * Creates a new ImeInsetsSourceConsumerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ImeInsetsSourceConsumerProto instance
             */
            public static create(properties?: android.view.IImeInsetsSourceConsumerProto): android.view.ImeInsetsSourceConsumerProto;

            /**
             * Encodes the specified ImeInsetsSourceConsumerProto message. Does not implicitly {@link android.view.ImeInsetsSourceConsumerProto.verify|verify} messages.
             * @param message ImeInsetsSourceConsumerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.view.IImeInsetsSourceConsumerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ImeInsetsSourceConsumerProto message, length delimited. Does not implicitly {@link android.view.ImeInsetsSourceConsumerProto.verify|verify} messages.
             * @param message ImeInsetsSourceConsumerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.view.IImeInsetsSourceConsumerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ImeInsetsSourceConsumerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ImeInsetsSourceConsumerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.ImeInsetsSourceConsumerProto;

            /**
             * Decodes an ImeInsetsSourceConsumerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ImeInsetsSourceConsumerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.ImeInsetsSourceConsumerProto;

            /**
             * Verifies an ImeInsetsSourceConsumerProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ImeInsetsSourceConsumerProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ImeInsetsSourceConsumerProto
             */
            public static fromObject(object: { [k: string]: any }): android.view.ImeInsetsSourceConsumerProto;

            /**
             * Creates a plain object from an ImeInsetsSourceConsumerProto message. Also converts values to other types if specified.
             * @param message ImeInsetsSourceConsumerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.view.ImeInsetsSourceConsumerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ImeInsetsSourceConsumerProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ImeInsetsSourceConsumerProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an InsetsSourceConsumerProto. */
        interface IInsetsSourceConsumerProto {

            /** InsetsSourceConsumerProto internalInsetsType */
            internalInsetsType?: (string|null);

            /** InsetsSourceConsumerProto hasWindowFocus */
            hasWindowFocus?: (boolean|null);

            /** InsetsSourceConsumerProto isRequestedVisible */
            isRequestedVisible?: (boolean|null);

            /** InsetsSourceConsumerProto sourceControl */
            sourceControl?: (android.view.IInsetsSourceControlProto|null);

            /** InsetsSourceConsumerProto pendingFrame */
            pendingFrame?: (android.graphics.IRectProto|null);

            /** InsetsSourceConsumerProto pendingVisibleFrame */
            pendingVisibleFrame?: (android.graphics.IRectProto|null);

            /** InsetsSourceConsumerProto animationState */
            animationState?: (number|null);

            /** InsetsSourceConsumerProto typeNumber */
            typeNumber?: (number|null);
        }

        /** Represents a {@link android.view.InsetsSourceConsumer} object. */
        class InsetsSourceConsumerProto implements IInsetsSourceConsumerProto {

            /**
             * Constructs a new InsetsSourceConsumerProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.view.IInsetsSourceConsumerProto);

            /** InsetsSourceConsumerProto internalInsetsType. */
            public internalInsetsType: string;

            /** InsetsSourceConsumerProto hasWindowFocus. */
            public hasWindowFocus: boolean;

            /** InsetsSourceConsumerProto isRequestedVisible. */
            public isRequestedVisible: boolean;

            /** InsetsSourceConsumerProto sourceControl. */
            public sourceControl?: (android.view.IInsetsSourceControlProto|null);

            /** InsetsSourceConsumerProto pendingFrame. */
            public pendingFrame?: (android.graphics.IRectProto|null);

            /** InsetsSourceConsumerProto pendingVisibleFrame. */
            public pendingVisibleFrame?: (android.graphics.IRectProto|null);

            /** InsetsSourceConsumerProto animationState. */
            public animationState: number;

            /** InsetsSourceConsumerProto typeNumber. */
            public typeNumber: number;

            /**
             * Creates a new InsetsSourceConsumerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InsetsSourceConsumerProto instance
             */
            public static create(properties?: android.view.IInsetsSourceConsumerProto): android.view.InsetsSourceConsumerProto;

            /**
             * Encodes the specified InsetsSourceConsumerProto message. Does not implicitly {@link android.view.InsetsSourceConsumerProto.verify|verify} messages.
             * @param message InsetsSourceConsumerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.view.IInsetsSourceConsumerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InsetsSourceConsumerProto message, length delimited. Does not implicitly {@link android.view.InsetsSourceConsumerProto.verify|verify} messages.
             * @param message InsetsSourceConsumerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.view.IInsetsSourceConsumerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InsetsSourceConsumerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InsetsSourceConsumerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.InsetsSourceConsumerProto;

            /**
             * Decodes an InsetsSourceConsumerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InsetsSourceConsumerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.InsetsSourceConsumerProto;

            /**
             * Verifies an InsetsSourceConsumerProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an InsetsSourceConsumerProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InsetsSourceConsumerProto
             */
            public static fromObject(object: { [k: string]: any }): android.view.InsetsSourceConsumerProto;

            /**
             * Creates a plain object from an InsetsSourceConsumerProto message. Also converts values to other types if specified.
             * @param message InsetsSourceConsumerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.view.InsetsSourceConsumerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InsetsSourceConsumerProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for InsetsSourceConsumerProto
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
            position?: (android.graphics.IPointProto|null);

            /** InsetsSourceControlProto leash */
            leash?: (android.view.ISurfaceControlProto|null);

            /** InsetsSourceControlProto typeNumber */
            typeNumber?: (number|null);
        }

        /** Represents a {@link android.view.InsetsSourceControl} object. */
        class InsetsSourceControlProto implements IInsetsSourceControlProto {

            /**
             * Constructs a new InsetsSourceControlProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.view.IInsetsSourceControlProto);

            /** InsetsSourceControlProto type. */
            public type: string;

            /** InsetsSourceControlProto position. */
            public position?: (android.graphics.IPointProto|null);

            /** InsetsSourceControlProto leash. */
            public leash?: (android.view.ISurfaceControlProto|null);

            /** InsetsSourceControlProto typeNumber. */
            public typeNumber: number;

            /**
             * Creates a new InsetsSourceControlProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InsetsSourceControlProto instance
             */
            public static create(properties?: android.view.IInsetsSourceControlProto): android.view.InsetsSourceControlProto;

            /**
             * Encodes the specified InsetsSourceControlProto message. Does not implicitly {@link android.view.InsetsSourceControlProto.verify|verify} messages.
             * @param message InsetsSourceControlProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.view.IInsetsSourceControlProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InsetsSourceControlProto message, length delimited. Does not implicitly {@link android.view.InsetsSourceControlProto.verify|verify} messages.
             * @param message InsetsSourceControlProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.view.IInsetsSourceControlProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InsetsSourceControlProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InsetsSourceControlProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.InsetsSourceControlProto;

            /**
             * Decodes an InsetsSourceControlProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InsetsSourceControlProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.InsetsSourceControlProto;

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
            public static fromObject(object: { [k: string]: any }): android.view.InsetsSourceControlProto;

            /**
             * Creates a plain object from an InsetsSourceControlProto message. Also converts values to other types if specified.
             * @param message InsetsSourceControlProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.view.InsetsSourceControlProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

        /** Properties of a SurfaceControlProto. */
        interface ISurfaceControlProto {

            /** SurfaceControlProto hashCode */
            hashCode?: (number|null);

            /** SurfaceControlProto name */
            name?: (string|null);

            /** SurfaceControlProto layerId */
            layerId?: (number|null);
        }

        /** Represents a {@link android.view.SurfaceControl} object. */
        class SurfaceControlProto implements ISurfaceControlProto {

            /**
             * Constructs a new SurfaceControlProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.view.ISurfaceControlProto);

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
            public static create(properties?: android.view.ISurfaceControlProto): android.view.SurfaceControlProto;

            /**
             * Encodes the specified SurfaceControlProto message. Does not implicitly {@link android.view.SurfaceControlProto.verify|verify} messages.
             * @param message SurfaceControlProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.view.ISurfaceControlProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SurfaceControlProto message, length delimited. Does not implicitly {@link android.view.SurfaceControlProto.verify|verify} messages.
             * @param message SurfaceControlProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.view.ISurfaceControlProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SurfaceControlProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SurfaceControlProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.SurfaceControlProto;

            /**
             * Decodes a SurfaceControlProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SurfaceControlProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.SurfaceControlProto;

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
            public static fromObject(object: { [k: string]: any }): android.view.SurfaceControlProto;

            /**
             * Creates a plain object from a SurfaceControlProto message. Also converts values to other types if specified.
             * @param message SurfaceControlProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.view.SurfaceControlProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

        /** Properties of an ImeFocusControllerProto. */
        interface IImeFocusControllerProto {

            /** ImeFocusControllerProto hasImeFocus */
            hasImeFocus?: (boolean|null);

            /** ImeFocusControllerProto servedView */
            servedView?: (string|null);

            /** ImeFocusControllerProto nextServedView */
            nextServedView?: (string|null);
        }

        /** Represents a {@link android.view.ImeFocusController} object. */
        class ImeFocusControllerProto implements IImeFocusControllerProto {

            /**
             * Constructs a new ImeFocusControllerProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.view.IImeFocusControllerProto);

            /** ImeFocusControllerProto hasImeFocus. */
            public hasImeFocus: boolean;

            /** ImeFocusControllerProto servedView. */
            public servedView: string;

            /** ImeFocusControllerProto nextServedView. */
            public nextServedView: string;

            /**
             * Creates a new ImeFocusControllerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ImeFocusControllerProto instance
             */
            public static create(properties?: android.view.IImeFocusControllerProto): android.view.ImeFocusControllerProto;

            /**
             * Encodes the specified ImeFocusControllerProto message. Does not implicitly {@link android.view.ImeFocusControllerProto.verify|verify} messages.
             * @param message ImeFocusControllerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.view.IImeFocusControllerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ImeFocusControllerProto message, length delimited. Does not implicitly {@link android.view.ImeFocusControllerProto.verify|verify} messages.
             * @param message ImeFocusControllerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.view.IImeFocusControllerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ImeFocusControllerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ImeFocusControllerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.view.ImeFocusControllerProto;

            /**
             * Decodes an ImeFocusControllerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ImeFocusControllerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.view.ImeFocusControllerProto;

            /**
             * Verifies an ImeFocusControllerProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ImeFocusControllerProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ImeFocusControllerProto
             */
            public static fromObject(object: { [k: string]: any }): android.view.ImeFocusControllerProto;

            /**
             * Creates a plain object from an ImeFocusControllerProto message. Also converts values to other types if specified.
             * @param message ImeFocusControllerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.view.ImeFocusControllerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ImeFocusControllerProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ImeFocusControllerProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    /** Namespace graphics. */
    namespace graphics {

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
            constructor(properties?: android.graphics.IRectProto);

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
            public static create(properties?: android.graphics.IRectProto): android.graphics.RectProto;

            /**
             * Encodes the specified RectProto message. Does not implicitly {@link android.graphics.RectProto.verify|verify} messages.
             * @param message RectProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.graphics.IRectProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RectProto message, length delimited. Does not implicitly {@link android.graphics.RectProto.verify|verify} messages.
             * @param message RectProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.graphics.IRectProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RectProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RectProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.graphics.RectProto;

            /**
             * Decodes a RectProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RectProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.graphics.RectProto;

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
            public static fromObject(object: { [k: string]: any }): android.graphics.RectProto;

            /**
             * Creates a plain object from a RectProto message. Also converts values to other types if specified.
             * @param message RectProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.graphics.RectProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

        /** Properties of a PixelFormatProto. */
        interface IPixelFormatProto {
        }

        /** Represents a PixelFormatProto. */
        class PixelFormatProto implements IPixelFormatProto {

            /**
             * Constructs a new PixelFormatProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.graphics.IPixelFormatProto);

            /**
             * Creates a new PixelFormatProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PixelFormatProto instance
             */
            public static create(properties?: android.graphics.IPixelFormatProto): android.graphics.PixelFormatProto;

            /**
             * Encodes the specified PixelFormatProto message. Does not implicitly {@link android.graphics.PixelFormatProto.verify|verify} messages.
             * @param message PixelFormatProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.graphics.IPixelFormatProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PixelFormatProto message, length delimited. Does not implicitly {@link android.graphics.PixelFormatProto.verify|verify} messages.
             * @param message PixelFormatProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.graphics.IPixelFormatProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PixelFormatProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PixelFormatProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.graphics.PixelFormatProto;

            /**
             * Decodes a PixelFormatProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PixelFormatProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.graphics.PixelFormatProto;

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
            public static fromObject(object: { [k: string]: any }): android.graphics.PixelFormatProto;

            /**
             * Creates a plain object from a PixelFormatProto message. Also converts values to other types if specified.
             * @param message PixelFormatProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.graphics.PixelFormatProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: android.graphics.IPointProto);

            /** PointProto x. */
            public x: number;

            /** PointProto y. */
            public y: number;

            /**
             * Creates a new PointProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PointProto instance
             */
            public static create(properties?: android.graphics.IPointProto): android.graphics.PointProto;

            /**
             * Encodes the specified PointProto message. Does not implicitly {@link android.graphics.PointProto.verify|verify} messages.
             * @param message PointProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.graphics.IPointProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PointProto message, length delimited. Does not implicitly {@link android.graphics.PointProto.verify|verify} messages.
             * @param message PointProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.graphics.IPointProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PointProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PointProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.graphics.PointProto;

            /**
             * Decodes a PointProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PointProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.graphics.PointProto;

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
            public static fromObject(object: { [k: string]: any }): android.graphics.PointProto;

            /**
             * Creates a plain object from a PointProto message. Also converts values to other types if specified.
             * @param message PointProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.graphics.PointProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
        dest?: (android.Destination|null);

        /** PrivacyFlags patterns */
        patterns?: (string[]|null);
    }

    /** Represents a PrivacyFlags. */
    class PrivacyFlags implements IPrivacyFlags {

        /**
         * Constructs a new PrivacyFlags.
         * @param [properties] Properties to set
         */
        constructor(properties?: android.IPrivacyFlags);

        /** PrivacyFlags dest. */
        public dest: android.Destination;

        /** PrivacyFlags patterns. */
        public patterns: string[];

        /**
         * Creates a new PrivacyFlags instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PrivacyFlags instance
         */
        public static create(properties?: android.IPrivacyFlags): android.PrivacyFlags;

        /**
         * Encodes the specified PrivacyFlags message. Does not implicitly {@link android.PrivacyFlags.verify|verify} messages.
         * @param message PrivacyFlags message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: android.IPrivacyFlags, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PrivacyFlags message, length delimited. Does not implicitly {@link android.PrivacyFlags.verify|verify} messages.
         * @param message PrivacyFlags message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: android.IPrivacyFlags, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PrivacyFlags message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PrivacyFlags
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.PrivacyFlags;

        /**
         * Decodes a PrivacyFlags message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PrivacyFlags
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.PrivacyFlags;

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
        public static fromObject(object: { [k: string]: any }): android.PrivacyFlags;

        /**
         * Creates a plain object from a PrivacyFlags message. Also converts values to other types if specified.
         * @param message PrivacyFlags
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: android.PrivacyFlags, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

    /** Namespace server. */
    namespace server {

        /** Namespace inputmethod. */
        namespace inputmethod {

            /** Properties of an InputMethodManagerServiceProto. */
            interface IInputMethodManagerServiceProto {

                /** InputMethodManagerServiceProto curMethodId */
                curMethodId?: (string|null);

                /** InputMethodManagerServiceProto curSeq */
                curSeq?: (number|null);

                /** InputMethodManagerServiceProto curClient */
                curClient?: (string|null);

                /** InputMethodManagerServiceProto curFocusedWindowName */
                curFocusedWindowName?: (string|null);

                /** InputMethodManagerServiceProto lastImeTargetWindowName */
                lastImeTargetWindowName?: (string|null);

                /** InputMethodManagerServiceProto curFocusedWindowSoftInputMode */
                curFocusedWindowSoftInputMode?: (string|null);

                /** InputMethodManagerServiceProto curAttribute */
                curAttribute?: (android.view.inputmethod.IEditorInfoProto|null);

                /** InputMethodManagerServiceProto curId */
                curId?: (string|null);

                /** InputMethodManagerServiceProto showExplicitlyRequested */
                showExplicitlyRequested?: (boolean|null);

                /** InputMethodManagerServiceProto showForced */
                showForced?: (boolean|null);

                /** InputMethodManagerServiceProto inputShown */
                inputShown?: (boolean|null);

                /** InputMethodManagerServiceProto inFullscreenMode */
                inFullscreenMode?: (boolean|null);

                /** InputMethodManagerServiceProto curToken */
                curToken?: (string|null);

                /** InputMethodManagerServiceProto curTokenDisplayId */
                curTokenDisplayId?: (number|null);

                /** InputMethodManagerServiceProto systemReady */
                systemReady?: (boolean|null);

                /** InputMethodManagerServiceProto haveConnection */
                haveConnection?: (boolean|null);

                /** InputMethodManagerServiceProto boundToMethod */
                boundToMethod?: (boolean|null);

                /** InputMethodManagerServiceProto isInteractive */
                isInteractive?: (boolean|null);

                /** InputMethodManagerServiceProto backDisposition */
                backDisposition?: (number|null);

                /** InputMethodManagerServiceProto imeWindowVisibility */
                imeWindowVisibility?: (number|null);

                /** InputMethodManagerServiceProto showImeWithHardKeyboard */
                showImeWithHardKeyboard?: (boolean|null);

                /** InputMethodManagerServiceProto accessibilityRequestingNoSoftKeyboard */
                accessibilityRequestingNoSoftKeyboard?: (boolean|null);

                /** InputMethodManagerServiceProto concurrentMultiUserModeEnabled */
                concurrentMultiUserModeEnabled?: (boolean|null);
            }

            /** Represents an InputMethodManagerServiceProto. */
            class InputMethodManagerServiceProto implements IInputMethodManagerServiceProto {

                /**
                 * Constructs a new InputMethodManagerServiceProto.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.server.inputmethod.IInputMethodManagerServiceProto);

                /** InputMethodManagerServiceProto curMethodId. */
                public curMethodId: string;

                /** InputMethodManagerServiceProto curSeq. */
                public curSeq: number;

                /** InputMethodManagerServiceProto curClient. */
                public curClient: string;

                /** InputMethodManagerServiceProto curFocusedWindowName. */
                public curFocusedWindowName: string;

                /** InputMethodManagerServiceProto lastImeTargetWindowName. */
                public lastImeTargetWindowName: string;

                /** InputMethodManagerServiceProto curFocusedWindowSoftInputMode. */
                public curFocusedWindowSoftInputMode: string;

                /** InputMethodManagerServiceProto curAttribute. */
                public curAttribute?: (android.view.inputmethod.IEditorInfoProto|null);

                /** InputMethodManagerServiceProto curId. */
                public curId: string;

                /** InputMethodManagerServiceProto showExplicitlyRequested. */
                public showExplicitlyRequested: boolean;

                /** InputMethodManagerServiceProto showForced. */
                public showForced: boolean;

                /** InputMethodManagerServiceProto inputShown. */
                public inputShown: boolean;

                /** InputMethodManagerServiceProto inFullscreenMode. */
                public inFullscreenMode: boolean;

                /** InputMethodManagerServiceProto curToken. */
                public curToken: string;

                /** InputMethodManagerServiceProto curTokenDisplayId. */
                public curTokenDisplayId: number;

                /** InputMethodManagerServiceProto systemReady. */
                public systemReady: boolean;

                /** InputMethodManagerServiceProto haveConnection. */
                public haveConnection: boolean;

                /** InputMethodManagerServiceProto boundToMethod. */
                public boundToMethod: boolean;

                /** InputMethodManagerServiceProto isInteractive. */
                public isInteractive: boolean;

                /** InputMethodManagerServiceProto backDisposition. */
                public backDisposition: number;

                /** InputMethodManagerServiceProto imeWindowVisibility. */
                public imeWindowVisibility: number;

                /** InputMethodManagerServiceProto showImeWithHardKeyboard. */
                public showImeWithHardKeyboard: boolean;

                /** InputMethodManagerServiceProto accessibilityRequestingNoSoftKeyboard. */
                public accessibilityRequestingNoSoftKeyboard: boolean;

                /** InputMethodManagerServiceProto concurrentMultiUserModeEnabled. */
                public concurrentMultiUserModeEnabled: boolean;

                /**
                 * Creates a new InputMethodManagerServiceProto instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns InputMethodManagerServiceProto instance
                 */
                public static create(properties?: android.server.inputmethod.IInputMethodManagerServiceProto): android.server.inputmethod.InputMethodManagerServiceProto;

                /**
                 * Encodes the specified InputMethodManagerServiceProto message. Does not implicitly {@link android.server.inputmethod.InputMethodManagerServiceProto.verify|verify} messages.
                 * @param message InputMethodManagerServiceProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.server.inputmethod.IInputMethodManagerServiceProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified InputMethodManagerServiceProto message, length delimited. Does not implicitly {@link android.server.inputmethod.InputMethodManagerServiceProto.verify|verify} messages.
                 * @param message InputMethodManagerServiceProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.server.inputmethod.IInputMethodManagerServiceProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an InputMethodManagerServiceProto message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns InputMethodManagerServiceProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.server.inputmethod.InputMethodManagerServiceProto;

                /**
                 * Decodes an InputMethodManagerServiceProto message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns InputMethodManagerServiceProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.server.inputmethod.InputMethodManagerServiceProto;

                /**
                 * Verifies an InputMethodManagerServiceProto message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an InputMethodManagerServiceProto message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns InputMethodManagerServiceProto
                 */
                public static fromObject(object: { [k: string]: any }): android.server.inputmethod.InputMethodManagerServiceProto;

                /**
                 * Creates a plain object from an InputMethodManagerServiceProto message. Also converts values to other types if specified.
                 * @param message InputMethodManagerServiceProto
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.server.inputmethod.InputMethodManagerServiceProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this InputMethodManagerServiceProto to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for InputMethodManagerServiceProto
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }

    /** Namespace inputmethodservice. */
    namespace inputmethodservice {

        /** Properties of an InputMethodServiceProto. */
        interface IInputMethodServiceProto {

            /** InputMethodServiceProto softInputWindow */
            softInputWindow?: (android.inputmethodservice.ISoftInputWindowProto|null);

            /** InputMethodServiceProto viewsCreated */
            viewsCreated?: (boolean|null);

            /** InputMethodServiceProto decorViewVisible */
            decorViewVisible?: (boolean|null);

            /** InputMethodServiceProto decorViewWasVisible */
            decorViewWasVisible?: (boolean|null);

            /** InputMethodServiceProto windowVisible */
            windowVisible?: (boolean|null);

            /** InputMethodServiceProto inShowWindow */
            inShowWindow?: (boolean|null);

            /** InputMethodServiceProto configuration */
            configuration?: (string|null);

            /** InputMethodServiceProto token */
            token?: (string|null);

            /** InputMethodServiceProto inputBinding */
            inputBinding?: (string|null);

            /** InputMethodServiceProto inputStarted */
            inputStarted?: (boolean|null);

            /** InputMethodServiceProto inputViewStarted */
            inputViewStarted?: (boolean|null);

            /** InputMethodServiceProto candidatesViewStarted */
            candidatesViewStarted?: (boolean|null);

            /** InputMethodServiceProto inputEditorInfo */
            inputEditorInfo?: (android.view.inputmethod.IEditorInfoProto|null);

            /** InputMethodServiceProto showInputRequested */
            showInputRequested?: (boolean|null);

            /** InputMethodServiceProto lastShowInputRequested */
            lastShowInputRequested?: (boolean|null);

            /** InputMethodServiceProto showInputFlags */
            showInputFlags?: (number|null);

            /** InputMethodServiceProto candidatesVisibility */
            candidatesVisibility?: (number|null);

            /** InputMethodServiceProto fullscreenApplied */
            fullscreenApplied?: (boolean|null);

            /** InputMethodServiceProto isFullscreen */
            isFullscreen?: (boolean|null);

            /** InputMethodServiceProto extractViewHidden */
            extractViewHidden?: (boolean|null);

            /** InputMethodServiceProto extractedToken */
            extractedToken?: (number|null);

            /** InputMethodServiceProto isInputViewShown */
            isInputViewShown?: (boolean|null);

            /** InputMethodServiceProto statusIcon */
            statusIcon?: (number|null);

            /** InputMethodServiceProto lastComputedInsets */
            lastComputedInsets?: (android.inputmethodservice.InputMethodServiceProto.IInsetsProto|null);

            /** InputMethodServiceProto settingsObserver */
            settingsObserver?: (string|null);

            /** InputMethodServiceProto inputConnectionCall */
            inputConnectionCall?: (android.view.inputmethod.IInputConnectionCallProto|null);
        }

        /** Represents an InputMethodServiceProto. */
        class InputMethodServiceProto implements IInputMethodServiceProto {

            /**
             * Constructs a new InputMethodServiceProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.inputmethodservice.IInputMethodServiceProto);

            /** InputMethodServiceProto softInputWindow. */
            public softInputWindow?: (android.inputmethodservice.ISoftInputWindowProto|null);

            /** InputMethodServiceProto viewsCreated. */
            public viewsCreated: boolean;

            /** InputMethodServiceProto decorViewVisible. */
            public decorViewVisible: boolean;

            /** InputMethodServiceProto decorViewWasVisible. */
            public decorViewWasVisible: boolean;

            /** InputMethodServiceProto windowVisible. */
            public windowVisible: boolean;

            /** InputMethodServiceProto inShowWindow. */
            public inShowWindow: boolean;

            /** InputMethodServiceProto configuration. */
            public configuration: string;

            /** InputMethodServiceProto token. */
            public token: string;

            /** InputMethodServiceProto inputBinding. */
            public inputBinding: string;

            /** InputMethodServiceProto inputStarted. */
            public inputStarted: boolean;

            /** InputMethodServiceProto inputViewStarted. */
            public inputViewStarted: boolean;

            /** InputMethodServiceProto candidatesViewStarted. */
            public candidatesViewStarted: boolean;

            /** InputMethodServiceProto inputEditorInfo. */
            public inputEditorInfo?: (android.view.inputmethod.IEditorInfoProto|null);

            /** InputMethodServiceProto showInputRequested. */
            public showInputRequested: boolean;

            /** InputMethodServiceProto lastShowInputRequested. */
            public lastShowInputRequested: boolean;

            /** InputMethodServiceProto showInputFlags. */
            public showInputFlags: number;

            /** InputMethodServiceProto candidatesVisibility. */
            public candidatesVisibility: number;

            /** InputMethodServiceProto fullscreenApplied. */
            public fullscreenApplied: boolean;

            /** InputMethodServiceProto isFullscreen. */
            public isFullscreen: boolean;

            /** InputMethodServiceProto extractViewHidden. */
            public extractViewHidden: boolean;

            /** InputMethodServiceProto extractedToken. */
            public extractedToken: number;

            /** InputMethodServiceProto isInputViewShown. */
            public isInputViewShown: boolean;

            /** InputMethodServiceProto statusIcon. */
            public statusIcon: number;

            /** InputMethodServiceProto lastComputedInsets. */
            public lastComputedInsets?: (android.inputmethodservice.InputMethodServiceProto.IInsetsProto|null);

            /** InputMethodServiceProto settingsObserver. */
            public settingsObserver: string;

            /** InputMethodServiceProto inputConnectionCall. */
            public inputConnectionCall?: (android.view.inputmethod.IInputConnectionCallProto|null);

            /**
             * Creates a new InputMethodServiceProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InputMethodServiceProto instance
             */
            public static create(properties?: android.inputmethodservice.IInputMethodServiceProto): android.inputmethodservice.InputMethodServiceProto;

            /**
             * Encodes the specified InputMethodServiceProto message. Does not implicitly {@link android.inputmethodservice.InputMethodServiceProto.verify|verify} messages.
             * @param message InputMethodServiceProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.inputmethodservice.IInputMethodServiceProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InputMethodServiceProto message, length delimited. Does not implicitly {@link android.inputmethodservice.InputMethodServiceProto.verify|verify} messages.
             * @param message InputMethodServiceProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.inputmethodservice.IInputMethodServiceProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InputMethodServiceProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InputMethodServiceProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.inputmethodservice.InputMethodServiceProto;

            /**
             * Decodes an InputMethodServiceProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InputMethodServiceProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.inputmethodservice.InputMethodServiceProto;

            /**
             * Verifies an InputMethodServiceProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an InputMethodServiceProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InputMethodServiceProto
             */
            public static fromObject(object: { [k: string]: any }): android.inputmethodservice.InputMethodServiceProto;

            /**
             * Creates a plain object from an InputMethodServiceProto message. Also converts values to other types if specified.
             * @param message InputMethodServiceProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.inputmethodservice.InputMethodServiceProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InputMethodServiceProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for InputMethodServiceProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace InputMethodServiceProto {

            /** Properties of an InsetsProto. */
            interface IInsetsProto {

                /** InsetsProto contentTopInsets */
                contentTopInsets?: (number|null);

                /** InsetsProto visibleTopInsets */
                visibleTopInsets?: (number|null);

                /** InsetsProto touchableInsets */
                touchableInsets?: (number|null);

                /** InsetsProto touchableRegion */
                touchableRegion?: (string|null);
            }

            /** Represents an InsetsProto. */
            class InsetsProto implements IInsetsProto {

                /**
                 * Constructs a new InsetsProto.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: android.inputmethodservice.InputMethodServiceProto.IInsetsProto);

                /** InsetsProto contentTopInsets. */
                public contentTopInsets: number;

                /** InsetsProto visibleTopInsets. */
                public visibleTopInsets: number;

                /** InsetsProto touchableInsets. */
                public touchableInsets: number;

                /** InsetsProto touchableRegion. */
                public touchableRegion: string;

                /**
                 * Creates a new InsetsProto instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns InsetsProto instance
                 */
                public static create(properties?: android.inputmethodservice.InputMethodServiceProto.IInsetsProto): android.inputmethodservice.InputMethodServiceProto.InsetsProto;

                /**
                 * Encodes the specified InsetsProto message. Does not implicitly {@link android.inputmethodservice.InputMethodServiceProto.InsetsProto.verify|verify} messages.
                 * @param message InsetsProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: android.inputmethodservice.InputMethodServiceProto.IInsetsProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified InsetsProto message, length delimited. Does not implicitly {@link android.inputmethodservice.InputMethodServiceProto.InsetsProto.verify|verify} messages.
                 * @param message InsetsProto message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: android.inputmethodservice.InputMethodServiceProto.IInsetsProto, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an InsetsProto message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns InsetsProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.inputmethodservice.InputMethodServiceProto.InsetsProto;

                /**
                 * Decodes an InsetsProto message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns InsetsProto
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.inputmethodservice.InputMethodServiceProto.InsetsProto;

                /**
                 * Verifies an InsetsProto message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an InsetsProto message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns InsetsProto
                 */
                public static fromObject(object: { [k: string]: any }): android.inputmethodservice.InputMethodServiceProto.InsetsProto;

                /**
                 * Creates a plain object from an InsetsProto message. Also converts values to other types if specified.
                 * @param message InsetsProto
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: android.inputmethodservice.InputMethodServiceProto.InsetsProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this InsetsProto to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for InsetsProto
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a SoftInputWindowProto. */
        interface ISoftInputWindowProto {

            /** SoftInputWindowProto windowState */
            windowState?: (number|null);
        }

        /** Represents a SoftInputWindowProto. */
        class SoftInputWindowProto implements ISoftInputWindowProto {

            /**
             * Constructs a new SoftInputWindowProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.inputmethodservice.ISoftInputWindowProto);

            /** SoftInputWindowProto windowState. */
            public windowState: number;

            /**
             * Creates a new SoftInputWindowProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SoftInputWindowProto instance
             */
            public static create(properties?: android.inputmethodservice.ISoftInputWindowProto): android.inputmethodservice.SoftInputWindowProto;

            /**
             * Encodes the specified SoftInputWindowProto message. Does not implicitly {@link android.inputmethodservice.SoftInputWindowProto.verify|verify} messages.
             * @param message SoftInputWindowProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.inputmethodservice.ISoftInputWindowProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SoftInputWindowProto message, length delimited. Does not implicitly {@link android.inputmethodservice.SoftInputWindowProto.verify|verify} messages.
             * @param message SoftInputWindowProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.inputmethodservice.ISoftInputWindowProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SoftInputWindowProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SoftInputWindowProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.inputmethodservice.SoftInputWindowProto;

            /**
             * Decodes a SoftInputWindowProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SoftInputWindowProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.inputmethodservice.SoftInputWindowProto;

            /**
             * Verifies a SoftInputWindowProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SoftInputWindowProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SoftInputWindowProto
             */
            public static fromObject(object: { [k: string]: any }): android.inputmethodservice.SoftInputWindowProto;

            /**
             * Creates a plain object from a SoftInputWindowProto message. Also converts values to other types if specified.
             * @param message SoftInputWindowProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.inputmethodservice.SoftInputWindowProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SoftInputWindowProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SoftInputWindowProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
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

            /** MessageOptions .android.msgPrivacy */
            ".android.msgPrivacy"?: (android.IPrivacyFlags|null);
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

            /** FieldOptions .android.privacy */
            ".android.privacy"?: (android.IPrivacyFlags|null);

            /** FieldOptions .android.typedef */
            ".android.typedef"?: (string|null);
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
