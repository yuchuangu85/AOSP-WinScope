import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace com. */
export namespace com {

    /** Namespace android. */
    namespace android {

        /** Namespace server. */
        namespace server {

            /** Namespace wm. */
            namespace wm {

                /** Namespace shell. */
                namespace shell {

                    /** Properties of a TransitionTraceProto. */
                    interface ITransitionTraceProto {

                        /** TransitionTraceProto magicNumber */
                        magicNumber: Long;

                        /** TransitionTraceProto transitions */
                        transitions?: (com.android.server.wm.shell.ITransition[]|null);

                        /** TransitionTraceProto realToElapsedTimeOffsetNanos */
                        realToElapsedTimeOffsetNanos?: (Long|null);
                    }

                    /** Represents a TransitionTraceProto. */
                    class TransitionTraceProto implements ITransitionTraceProto {

                        /**
                         * Constructs a new TransitionTraceProto.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: com.android.server.wm.shell.ITransitionTraceProto);

                        /** TransitionTraceProto magicNumber. */
                        public magicNumber: Long;

                        /** TransitionTraceProto transitions. */
                        public transitions: com.android.server.wm.shell.ITransition[];

                        /** TransitionTraceProto realToElapsedTimeOffsetNanos. */
                        public realToElapsedTimeOffsetNanos: Long;

                        /**
                         * Creates a new TransitionTraceProto instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns TransitionTraceProto instance
                         */
                        public static create(properties?: com.android.server.wm.shell.ITransitionTraceProto): com.android.server.wm.shell.TransitionTraceProto;

                        /**
                         * Encodes the specified TransitionTraceProto message. Does not implicitly {@link com.android.server.wm.shell.TransitionTraceProto.verify|verify} messages.
                         * @param message TransitionTraceProto message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encode(message: com.android.server.wm.shell.ITransitionTraceProto, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified TransitionTraceProto message, length delimited. Does not implicitly {@link com.android.server.wm.shell.TransitionTraceProto.verify|verify} messages.
                         * @param message TransitionTraceProto message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encodeDelimited(message: com.android.server.wm.shell.ITransitionTraceProto, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes a TransitionTraceProto message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns TransitionTraceProto
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.android.server.wm.shell.TransitionTraceProto;

                        /**
                         * Decodes a TransitionTraceProto message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns TransitionTraceProto
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.android.server.wm.shell.TransitionTraceProto;

                        /**
                         * Verifies a TransitionTraceProto message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        public static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates a TransitionTraceProto message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns TransitionTraceProto
                         */
                        public static fromObject(object: { [k: string]: any }): com.android.server.wm.shell.TransitionTraceProto;

                        /**
                         * Creates a plain object from a TransitionTraceProto message. Also converts values to other types if specified.
                         * @param message TransitionTraceProto
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: com.android.server.wm.shell.TransitionTraceProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this TransitionTraceProto to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for TransitionTraceProto
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }

                    namespace TransitionTraceProto {

                        /** MagicNumber enum. */
                        enum MagicNumber {
                            INVALID = 0,
                            MAGIC_NUMBER_L = 1414419028,
                            MAGIC_NUMBER_H = 1162035538
                        }
                    }

                    /** Properties of a Transition. */
                    interface ITransition {

                        /** Transition id */
                        id: number;

                        /** Transition startTransactionId */
                        startTransactionId?: (Long|null);

                        /** Transition finishTransactionId */
                        finishTransactionId?: (Long|null);

                        /** Transition createTimeNs */
                        createTimeNs?: (Long|null);

                        /** Transition sendTimeNs */
                        sendTimeNs?: (Long|null);

                        /** Transition finishTimeNs */
                        finishTimeNs?: (Long|null);

                        /** Transition type */
                        type?: (number|null);

                        /** Transition targets */
                        targets?: (com.android.server.wm.shell.ITarget[]|null);

                        /** Transition flags */
                        flags?: (number|null);

                        /** Transition abortTimeNs */
                        abortTimeNs?: (Long|null);

                        /** Transition startingWindowRemoveTimeNs */
                        startingWindowRemoveTimeNs?: (Long|null);
                    }

                    /** Represents a Transition. */
                    class Transition implements ITransition {

                        /**
                         * Constructs a new Transition.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: com.android.server.wm.shell.ITransition);

                        /** Transition id. */
                        public id: number;

                        /** Transition startTransactionId. */
                        public startTransactionId: Long;

                        /** Transition finishTransactionId. */
                        public finishTransactionId: Long;

                        /** Transition createTimeNs. */
                        public createTimeNs: Long;

                        /** Transition sendTimeNs. */
                        public sendTimeNs: Long;

                        /** Transition finishTimeNs. */
                        public finishTimeNs: Long;

                        /** Transition type. */
                        public type: number;

                        /** Transition targets. */
                        public targets: com.android.server.wm.shell.ITarget[];

                        /** Transition flags. */
                        public flags: number;

                        /** Transition abortTimeNs. */
                        public abortTimeNs: Long;

                        /** Transition startingWindowRemoveTimeNs. */
                        public startingWindowRemoveTimeNs: Long;

                        /**
                         * Creates a new Transition instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns Transition instance
                         */
                        public static create(properties?: com.android.server.wm.shell.ITransition): com.android.server.wm.shell.Transition;

                        /**
                         * Encodes the specified Transition message. Does not implicitly {@link com.android.server.wm.shell.Transition.verify|verify} messages.
                         * @param message Transition message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encode(message: com.android.server.wm.shell.ITransition, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified Transition message, length delimited. Does not implicitly {@link com.android.server.wm.shell.Transition.verify|verify} messages.
                         * @param message Transition message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encodeDelimited(message: com.android.server.wm.shell.ITransition, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes a Transition message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns Transition
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.android.server.wm.shell.Transition;

                        /**
                         * Decodes a Transition message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns Transition
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.android.server.wm.shell.Transition;

                        /**
                         * Verifies a Transition message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        public static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates a Transition message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns Transition
                         */
                        public static fromObject(object: { [k: string]: any }): com.android.server.wm.shell.Transition;

                        /**
                         * Creates a plain object from a Transition message. Also converts values to other types if specified.
                         * @param message Transition
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: com.android.server.wm.shell.Transition, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this Transition to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for Transition
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }

                    /** Properties of a Target. */
                    interface ITarget {

                        /** Target mode */
                        mode?: (number|null);

                        /** Target layerId */
                        layerId?: (number|null);

                        /** Target windowId */
                        windowId?: (number|null);

                        /** Target flags */
                        flags?: (number|null);
                    }

                    /** Represents a Target. */
                    class Target implements ITarget {

                        /**
                         * Constructs a new Target.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: com.android.server.wm.shell.ITarget);

                        /** Target mode. */
                        public mode: number;

                        /** Target layerId. */
                        public layerId: number;

                        /** Target windowId. */
                        public windowId: number;

                        /** Target flags. */
                        public flags: number;

                        /**
                         * Creates a new Target instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns Target instance
                         */
                        public static create(properties?: com.android.server.wm.shell.ITarget): com.android.server.wm.shell.Target;

                        /**
                         * Encodes the specified Target message. Does not implicitly {@link com.android.server.wm.shell.Target.verify|verify} messages.
                         * @param message Target message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encode(message: com.android.server.wm.shell.ITarget, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified Target message, length delimited. Does not implicitly {@link com.android.server.wm.shell.Target.verify|verify} messages.
                         * @param message Target message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encodeDelimited(message: com.android.server.wm.shell.ITarget, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes a Target message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns Target
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.android.server.wm.shell.Target;

                        /**
                         * Decodes a Target message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns Target
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.android.server.wm.shell.Target;

                        /**
                         * Verifies a Target message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        public static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates a Target message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns Target
                         */
                        public static fromObject(object: { [k: string]: any }): com.android.server.wm.shell.Target;

                        /**
                         * Creates a plain object from a Target message. Also converts values to other types if specified.
                         * @param message Target
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: com.android.server.wm.shell.Target, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this Target to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for Target
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }
                }
            }
        }

        /** Namespace wm. */
        namespace wm {

            /** Namespace shell. */
            namespace shell {

                /** Properties of a WmShellTransitionTraceProto. */
                interface IWmShellTransitionTraceProto {

                    /** WmShellTransitionTraceProto magicNumber */
                    magicNumber: Long;

                    /** WmShellTransitionTraceProto transitions */
                    transitions?: (com.android.wm.shell.ITransition[]|null);

                    /** WmShellTransitionTraceProto handlerMappings */
                    handlerMappings?: (com.android.wm.shell.IHandlerMapping[]|null);

                    /** WmShellTransitionTraceProto realToElapsedTimeOffsetNanos */
                    realToElapsedTimeOffsetNanos?: (Long|null);
                }

                /** Represents a WmShellTransitionTraceProto. */
                class WmShellTransitionTraceProto implements IWmShellTransitionTraceProto {

                    /**
                     * Constructs a new WmShellTransitionTraceProto.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.android.wm.shell.IWmShellTransitionTraceProto);

                    /** WmShellTransitionTraceProto magicNumber. */
                    public magicNumber: Long;

                    /** WmShellTransitionTraceProto transitions. */
                    public transitions: com.android.wm.shell.ITransition[];

                    /** WmShellTransitionTraceProto handlerMappings. */
                    public handlerMappings: com.android.wm.shell.IHandlerMapping[];

                    /** WmShellTransitionTraceProto realToElapsedTimeOffsetNanos. */
                    public realToElapsedTimeOffsetNanos: Long;

                    /**
                     * Creates a new WmShellTransitionTraceProto instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns WmShellTransitionTraceProto instance
                     */
                    public static create(properties?: com.android.wm.shell.IWmShellTransitionTraceProto): com.android.wm.shell.WmShellTransitionTraceProto;

                    /**
                     * Encodes the specified WmShellTransitionTraceProto message. Does not implicitly {@link com.android.wm.shell.WmShellTransitionTraceProto.verify|verify} messages.
                     * @param message WmShellTransitionTraceProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.android.wm.shell.IWmShellTransitionTraceProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified WmShellTransitionTraceProto message, length delimited. Does not implicitly {@link com.android.wm.shell.WmShellTransitionTraceProto.verify|verify} messages.
                     * @param message WmShellTransitionTraceProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.android.wm.shell.IWmShellTransitionTraceProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a WmShellTransitionTraceProto message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns WmShellTransitionTraceProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.android.wm.shell.WmShellTransitionTraceProto;

                    /**
                     * Decodes a WmShellTransitionTraceProto message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns WmShellTransitionTraceProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.android.wm.shell.WmShellTransitionTraceProto;

                    /**
                     * Verifies a WmShellTransitionTraceProto message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a WmShellTransitionTraceProto message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns WmShellTransitionTraceProto
                     */
                    public static fromObject(object: { [k: string]: any }): com.android.wm.shell.WmShellTransitionTraceProto;

                    /**
                     * Creates a plain object from a WmShellTransitionTraceProto message. Also converts values to other types if specified.
                     * @param message WmShellTransitionTraceProto
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.android.wm.shell.WmShellTransitionTraceProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this WmShellTransitionTraceProto to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for WmShellTransitionTraceProto
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                namespace WmShellTransitionTraceProto {

                    /** MagicNumber enum. */
                    enum MagicNumber {
                        INVALID = 0,
                        MAGIC_NUMBER_L = 1414745431,
                        MAGIC_NUMBER_H = 1162035538
                    }
                }

                /** Properties of a Transition. */
                interface ITransition {

                    /** Transition id */
                    id: number;

                    /** Transition dispatchTimeNs */
                    dispatchTimeNs?: (Long|null);

                    /** Transition handler */
                    handler?: (number|null);

                    /** Transition mergeTimeNs */
                    mergeTimeNs?: (Long|null);

                    /** Transition mergeRequestTimeNs */
                    mergeRequestTimeNs?: (Long|null);

                    /** Transition mergeTarget */
                    mergeTarget?: (number|null);

                    /** Transition abortTimeNs */
                    abortTimeNs?: (Long|null);
                }

                /** Represents a Transition. */
                class Transition implements ITransition {

                    /**
                     * Constructs a new Transition.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.android.wm.shell.ITransition);

                    /** Transition id. */
                    public id: number;

                    /** Transition dispatchTimeNs. */
                    public dispatchTimeNs: Long;

                    /** Transition handler. */
                    public handler: number;

                    /** Transition mergeTimeNs. */
                    public mergeTimeNs: Long;

                    /** Transition mergeRequestTimeNs. */
                    public mergeRequestTimeNs: Long;

                    /** Transition mergeTarget. */
                    public mergeTarget: number;

                    /** Transition abortTimeNs. */
                    public abortTimeNs: Long;

                    /**
                     * Creates a new Transition instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Transition instance
                     */
                    public static create(properties?: com.android.wm.shell.ITransition): com.android.wm.shell.Transition;

                    /**
                     * Encodes the specified Transition message. Does not implicitly {@link com.android.wm.shell.Transition.verify|verify} messages.
                     * @param message Transition message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.android.wm.shell.ITransition, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Transition message, length delimited. Does not implicitly {@link com.android.wm.shell.Transition.verify|verify} messages.
                     * @param message Transition message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.android.wm.shell.ITransition, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Transition message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Transition
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.android.wm.shell.Transition;

                    /**
                     * Decodes a Transition message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Transition
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.android.wm.shell.Transition;

                    /**
                     * Verifies a Transition message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Transition message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Transition
                     */
                    public static fromObject(object: { [k: string]: any }): com.android.wm.shell.Transition;

                    /**
                     * Creates a plain object from a Transition message. Also converts values to other types if specified.
                     * @param message Transition
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.android.wm.shell.Transition, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Transition to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for Transition
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a HandlerMapping. */
                interface IHandlerMapping {

                    /** HandlerMapping id */
                    id: number;

                    /** HandlerMapping name */
                    name: string;
                }

                /** Represents a HandlerMapping. */
                class HandlerMapping implements IHandlerMapping {

                    /**
                     * Constructs a new HandlerMapping.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.android.wm.shell.IHandlerMapping);

                    /** HandlerMapping id. */
                    public id: number;

                    /** HandlerMapping name. */
                    public name: string;

                    /**
                     * Creates a new HandlerMapping instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns HandlerMapping instance
                     */
                    public static create(properties?: com.android.wm.shell.IHandlerMapping): com.android.wm.shell.HandlerMapping;

                    /**
                     * Encodes the specified HandlerMapping message. Does not implicitly {@link com.android.wm.shell.HandlerMapping.verify|verify} messages.
                     * @param message HandlerMapping message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.android.wm.shell.IHandlerMapping, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified HandlerMapping message, length delimited. Does not implicitly {@link com.android.wm.shell.HandlerMapping.verify|verify} messages.
                     * @param message HandlerMapping message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.android.wm.shell.IHandlerMapping, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a HandlerMapping message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns HandlerMapping
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.android.wm.shell.HandlerMapping;

                    /**
                     * Decodes a HandlerMapping message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns HandlerMapping
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.android.wm.shell.HandlerMapping;

                    /**
                     * Verifies a HandlerMapping message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a HandlerMapping message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns HandlerMapping
                     */
                    public static fromObject(object: { [k: string]: any }): com.android.wm.shell.HandlerMapping;

                    /**
                     * Creates a plain object from a HandlerMapping message. Also converts values to other types if specified.
                     * @param message HandlerMapping
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.android.wm.shell.HandlerMapping, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this HandlerMapping to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for HandlerMapping
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }
            }
        }
    }
}
