import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace perfetto. */
export namespace perfetto {

    /** Namespace protos. */
    namespace protos {

        /** Properties of a ShellTransition. */
        interface IShellTransition {

            /** ShellTransition id */
            id?: (number|null);

            /** ShellTransition createTimeNs */
            createTimeNs?: (Long|null);

            /** ShellTransition sendTimeNs */
            sendTimeNs?: (Long|null);

            /** ShellTransition dispatchTimeNs */
            dispatchTimeNs?: (Long|null);

            /** ShellTransition mergeTimeNs */
            mergeTimeNs?: (Long|null);

            /** ShellTransition mergeRequestTimeNs */
            mergeRequestTimeNs?: (Long|null);

            /** ShellTransition shellAbortTimeNs */
            shellAbortTimeNs?: (Long|null);

            /** ShellTransition wmAbortTimeNs */
            wmAbortTimeNs?: (Long|null);

            /** ShellTransition finishTimeNs */
            finishTimeNs?: (Long|null);

            /** ShellTransition startTransactionId */
            startTransactionId?: (Long|null);

            /** ShellTransition finishTransactionId */
            finishTransactionId?: (Long|null);

            /** ShellTransition handler */
            handler?: (number|null);

            /** ShellTransition type */
            type?: (number|null);

            /** ShellTransition targets */
            targets?: (perfetto.protos.ShellTransition.ITarget[]|null);

            /** ShellTransition mergeTarget */
            mergeTarget?: (number|null);

            /** ShellTransition flags */
            flags?: (number|null);

            /** ShellTransition startingWindowRemoveTimeNs */
            startingWindowRemoveTimeNs?: (Long|null);
        }

        /** Represents a ShellTransition. */
        class ShellTransition implements IShellTransition {

            /**
             * Constructs a new ShellTransition.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IShellTransition);

            /** ShellTransition id. */
            public id: number;

            /** ShellTransition createTimeNs. */
            public createTimeNs: Long;

            /** ShellTransition sendTimeNs. */
            public sendTimeNs: Long;

            /** ShellTransition dispatchTimeNs. */
            public dispatchTimeNs: Long;

            /** ShellTransition mergeTimeNs. */
            public mergeTimeNs: Long;

            /** ShellTransition mergeRequestTimeNs. */
            public mergeRequestTimeNs: Long;

            /** ShellTransition shellAbortTimeNs. */
            public shellAbortTimeNs: Long;

            /** ShellTransition wmAbortTimeNs. */
            public wmAbortTimeNs: Long;

            /** ShellTransition finishTimeNs. */
            public finishTimeNs: Long;

            /** ShellTransition startTransactionId. */
            public startTransactionId: Long;

            /** ShellTransition finishTransactionId. */
            public finishTransactionId: Long;

            /** ShellTransition handler. */
            public handler: number;

            /** ShellTransition type. */
            public type: number;

            /** ShellTransition targets. */
            public targets: perfetto.protos.ShellTransition.ITarget[];

            /** ShellTransition mergeTarget. */
            public mergeTarget: number;

            /** ShellTransition flags. */
            public flags: number;

            /** ShellTransition startingWindowRemoveTimeNs. */
            public startingWindowRemoveTimeNs: Long;

            /**
             * Creates a new ShellTransition instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ShellTransition instance
             */
            public static create(properties?: perfetto.protos.IShellTransition): perfetto.protos.ShellTransition;

            /**
             * Encodes the specified ShellTransition message. Does not implicitly {@link perfetto.protos.ShellTransition.verify|verify} messages.
             * @param message ShellTransition message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IShellTransition, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ShellTransition message, length delimited. Does not implicitly {@link perfetto.protos.ShellTransition.verify|verify} messages.
             * @param message ShellTransition message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IShellTransition, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ShellTransition message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ShellTransition
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ShellTransition;

            /**
             * Decodes a ShellTransition message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ShellTransition
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ShellTransition;

            /**
             * Verifies a ShellTransition message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ShellTransition message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ShellTransition
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.ShellTransition;

            /**
             * Creates a plain object from a ShellTransition message. Also converts values to other types if specified.
             * @param message ShellTransition
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.ShellTransition, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ShellTransition to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ShellTransition
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ShellTransition {

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
                constructor(properties?: perfetto.protos.ShellTransition.ITarget);

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
                public static create(properties?: perfetto.protos.ShellTransition.ITarget): perfetto.protos.ShellTransition.Target;

                /**
                 * Encodes the specified Target message. Does not implicitly {@link perfetto.protos.ShellTransition.Target.verify|verify} messages.
                 * @param message Target message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: perfetto.protos.ShellTransition.ITarget, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Target message, length delimited. Does not implicitly {@link perfetto.protos.ShellTransition.Target.verify|verify} messages.
                 * @param message Target message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: perfetto.protos.ShellTransition.ITarget, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Target message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Target
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ShellTransition.Target;

                /**
                 * Decodes a Target message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Target
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ShellTransition.Target;

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
                public static fromObject(object: { [k: string]: any }): perfetto.protos.ShellTransition.Target;

                /**
                 * Creates a plain object from a Target message. Also converts values to other types if specified.
                 * @param message Target
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: perfetto.protos.ShellTransition.Target, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

        /** Properties of a ShellHandlerMappings. */
        interface IShellHandlerMappings {

            /** ShellHandlerMappings mapping */
            mapping?: (perfetto.protos.IShellHandlerMapping[]|null);
        }

        /** Represents a ShellHandlerMappings. */
        class ShellHandlerMappings implements IShellHandlerMappings {

            /**
             * Constructs a new ShellHandlerMappings.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IShellHandlerMappings);

            /** ShellHandlerMappings mapping. */
            public mapping: perfetto.protos.IShellHandlerMapping[];

            /**
             * Creates a new ShellHandlerMappings instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ShellHandlerMappings instance
             */
            public static create(properties?: perfetto.protos.IShellHandlerMappings): perfetto.protos.ShellHandlerMappings;

            /**
             * Encodes the specified ShellHandlerMappings message. Does not implicitly {@link perfetto.protos.ShellHandlerMappings.verify|verify} messages.
             * @param message ShellHandlerMappings message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IShellHandlerMappings, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ShellHandlerMappings message, length delimited. Does not implicitly {@link perfetto.protos.ShellHandlerMappings.verify|verify} messages.
             * @param message ShellHandlerMappings message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IShellHandlerMappings, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ShellHandlerMappings message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ShellHandlerMappings
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ShellHandlerMappings;

            /**
             * Decodes a ShellHandlerMappings message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ShellHandlerMappings
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ShellHandlerMappings;

            /**
             * Verifies a ShellHandlerMappings message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ShellHandlerMappings message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ShellHandlerMappings
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.ShellHandlerMappings;

            /**
             * Creates a plain object from a ShellHandlerMappings message. Also converts values to other types if specified.
             * @param message ShellHandlerMappings
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.ShellHandlerMappings, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ShellHandlerMappings to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ShellHandlerMappings
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ShellHandlerMapping. */
        interface IShellHandlerMapping {

            /** ShellHandlerMapping id */
            id?: (number|null);

            /** ShellHandlerMapping name */
            name?: (string|null);
        }

        /** Represents a ShellHandlerMapping. */
        class ShellHandlerMapping implements IShellHandlerMapping {

            /**
             * Constructs a new ShellHandlerMapping.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IShellHandlerMapping);

            /** ShellHandlerMapping id. */
            public id: number;

            /** ShellHandlerMapping name. */
            public name: string;

            /**
             * Creates a new ShellHandlerMapping instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ShellHandlerMapping instance
             */
            public static create(properties?: perfetto.protos.IShellHandlerMapping): perfetto.protos.ShellHandlerMapping;

            /**
             * Encodes the specified ShellHandlerMapping message. Does not implicitly {@link perfetto.protos.ShellHandlerMapping.verify|verify} messages.
             * @param message ShellHandlerMapping message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IShellHandlerMapping, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ShellHandlerMapping message, length delimited. Does not implicitly {@link perfetto.protos.ShellHandlerMapping.verify|verify} messages.
             * @param message ShellHandlerMapping message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IShellHandlerMapping, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ShellHandlerMapping message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ShellHandlerMapping
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ShellHandlerMapping;

            /**
             * Decodes a ShellHandlerMapping message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ShellHandlerMapping
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ShellHandlerMapping;

            /**
             * Verifies a ShellHandlerMapping message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ShellHandlerMapping message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ShellHandlerMapping
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.ShellHandlerMapping;

            /**
             * Creates a plain object from a ShellHandlerMapping message. Also converts values to other types if specified.
             * @param message ShellHandlerMapping
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.ShellHandlerMapping, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ShellHandlerMapping to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ShellHandlerMapping
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
