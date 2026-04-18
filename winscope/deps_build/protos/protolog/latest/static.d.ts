import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace perfetto. */
export namespace perfetto {

    /** Namespace protos. */
    namespace protos {

        /** Properties of a ProtoLogMessage. */
        interface IProtoLogMessage {

            /** ProtoLogMessage messageId */
            messageId?: (Long|null);

            /** ProtoLogMessage strParamIids */
            strParamIids?: (number[]|null);

            /** ProtoLogMessage sint64Params */
            sint64Params?: (Long[]|null);

            /** ProtoLogMessage doubleParams */
            doubleParams?: (number[]|null);

            /** ProtoLogMessage booleanParams */
            booleanParams?: (number[]|null);

            /** ProtoLogMessage stacktraceIid */
            stacktraceIid?: (number|null);
        }

        /** Represents a ProtoLogMessage. */
        class ProtoLogMessage implements IProtoLogMessage {

            /**
             * Constructs a new ProtoLogMessage.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IProtoLogMessage);

            /** ProtoLogMessage messageId. */
            public messageId: Long;

            /** ProtoLogMessage strParamIids. */
            public strParamIids: number[];

            /** ProtoLogMessage sint64Params. */
            public sint64Params: Long[];

            /** ProtoLogMessage doubleParams. */
            public doubleParams: number[];

            /** ProtoLogMessage booleanParams. */
            public booleanParams: number[];

            /** ProtoLogMessage stacktraceIid. */
            public stacktraceIid: number;

            /**
             * Creates a new ProtoLogMessage instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ProtoLogMessage instance
             */
            public static create(properties?: perfetto.protos.IProtoLogMessage): perfetto.protos.ProtoLogMessage;

            /**
             * Encodes the specified ProtoLogMessage message. Does not implicitly {@link perfetto.protos.ProtoLogMessage.verify|verify} messages.
             * @param message ProtoLogMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IProtoLogMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ProtoLogMessage message, length delimited. Does not implicitly {@link perfetto.protos.ProtoLogMessage.verify|verify} messages.
             * @param message ProtoLogMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IProtoLogMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ProtoLogMessage message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ProtoLogMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ProtoLogMessage;

            /**
             * Decodes a ProtoLogMessage message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ProtoLogMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ProtoLogMessage;

            /**
             * Verifies a ProtoLogMessage message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ProtoLogMessage message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ProtoLogMessage
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.ProtoLogMessage;

            /**
             * Creates a plain object from a ProtoLogMessage message. Also converts values to other types if specified.
             * @param message ProtoLogMessage
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.ProtoLogMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ProtoLogMessage to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ProtoLogMessage
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ProtoLogViewerConfig. */
        interface IProtoLogViewerConfig {

            /** ProtoLogViewerConfig messages */
            messages?: (perfetto.protos.ProtoLogViewerConfig.IMessageData[]|null);

            /** ProtoLogViewerConfig groups */
            groups?: (perfetto.protos.ProtoLogViewerConfig.IGroup[]|null);
        }

        /** Represents a ProtoLogViewerConfig. */
        class ProtoLogViewerConfig implements IProtoLogViewerConfig {

            /**
             * Constructs a new ProtoLogViewerConfig.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IProtoLogViewerConfig);

            /** ProtoLogViewerConfig messages. */
            public messages: perfetto.protos.ProtoLogViewerConfig.IMessageData[];

            /** ProtoLogViewerConfig groups. */
            public groups: perfetto.protos.ProtoLogViewerConfig.IGroup[];

            /**
             * Creates a new ProtoLogViewerConfig instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ProtoLogViewerConfig instance
             */
            public static create(properties?: perfetto.protos.IProtoLogViewerConfig): perfetto.protos.ProtoLogViewerConfig;

            /**
             * Encodes the specified ProtoLogViewerConfig message. Does not implicitly {@link perfetto.protos.ProtoLogViewerConfig.verify|verify} messages.
             * @param message ProtoLogViewerConfig message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IProtoLogViewerConfig, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ProtoLogViewerConfig message, length delimited. Does not implicitly {@link perfetto.protos.ProtoLogViewerConfig.verify|verify} messages.
             * @param message ProtoLogViewerConfig message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IProtoLogViewerConfig, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ProtoLogViewerConfig message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ProtoLogViewerConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ProtoLogViewerConfig;

            /**
             * Decodes a ProtoLogViewerConfig message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ProtoLogViewerConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ProtoLogViewerConfig;

            /**
             * Verifies a ProtoLogViewerConfig message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ProtoLogViewerConfig message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ProtoLogViewerConfig
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.ProtoLogViewerConfig;

            /**
             * Creates a plain object from a ProtoLogViewerConfig message. Also converts values to other types if specified.
             * @param message ProtoLogViewerConfig
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.ProtoLogViewerConfig, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ProtoLogViewerConfig to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ProtoLogViewerConfig
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ProtoLogViewerConfig {

            /** Properties of a MessageData. */
            interface IMessageData {

                /** MessageData messageId */
                messageId?: (Long|null);

                /** MessageData message */
                message?: (string|null);

                /** MessageData level */
                level?: (perfetto.protos.ProtoLogLevel|null);

                /** MessageData groupId */
                groupId?: (number|null);

                /** MessageData location */
                location?: (string|null);
            }

            /** Represents a MessageData. */
            class MessageData implements IMessageData {

                /**
                 * Constructs a new MessageData.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: perfetto.protos.ProtoLogViewerConfig.IMessageData);

                /** MessageData messageId. */
                public messageId: Long;

                /** MessageData message. */
                public message: string;

                /** MessageData level. */
                public level: perfetto.protos.ProtoLogLevel;

                /** MessageData groupId. */
                public groupId: number;

                /** MessageData location. */
                public location: string;

                /**
                 * Creates a new MessageData instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns MessageData instance
                 */
                public static create(properties?: perfetto.protos.ProtoLogViewerConfig.IMessageData): perfetto.protos.ProtoLogViewerConfig.MessageData;

                /**
                 * Encodes the specified MessageData message. Does not implicitly {@link perfetto.protos.ProtoLogViewerConfig.MessageData.verify|verify} messages.
                 * @param message MessageData message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: perfetto.protos.ProtoLogViewerConfig.IMessageData, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified MessageData message, length delimited. Does not implicitly {@link perfetto.protos.ProtoLogViewerConfig.MessageData.verify|verify} messages.
                 * @param message MessageData message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: perfetto.protos.ProtoLogViewerConfig.IMessageData, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a MessageData message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns MessageData
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ProtoLogViewerConfig.MessageData;

                /**
                 * Decodes a MessageData message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns MessageData
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ProtoLogViewerConfig.MessageData;

                /**
                 * Verifies a MessageData message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a MessageData message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns MessageData
                 */
                public static fromObject(object: { [k: string]: any }): perfetto.protos.ProtoLogViewerConfig.MessageData;

                /**
                 * Creates a plain object from a MessageData message. Also converts values to other types if specified.
                 * @param message MessageData
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: perfetto.protos.ProtoLogViewerConfig.MessageData, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this MessageData to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for MessageData
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Group. */
            interface IGroup {

                /** Group id */
                id?: (number|null);

                /** Group name */
                name?: (string|null);

                /** Group tag */
                tag?: (string|null);
            }

            /** Represents a Group. */
            class Group implements IGroup {

                /**
                 * Constructs a new Group.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: perfetto.protos.ProtoLogViewerConfig.IGroup);

                /** Group id. */
                public id: number;

                /** Group name. */
                public name: string;

                /** Group tag. */
                public tag: string;

                /**
                 * Creates a new Group instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Group instance
                 */
                public static create(properties?: perfetto.protos.ProtoLogViewerConfig.IGroup): perfetto.protos.ProtoLogViewerConfig.Group;

                /**
                 * Encodes the specified Group message. Does not implicitly {@link perfetto.protos.ProtoLogViewerConfig.Group.verify|verify} messages.
                 * @param message Group message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: perfetto.protos.ProtoLogViewerConfig.IGroup, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Group message, length delimited. Does not implicitly {@link perfetto.protos.ProtoLogViewerConfig.Group.verify|verify} messages.
                 * @param message Group message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: perfetto.protos.ProtoLogViewerConfig.IGroup, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Group message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Group
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ProtoLogViewerConfig.Group;

                /**
                 * Decodes a Group message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Group
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ProtoLogViewerConfig.Group;

                /**
                 * Verifies a Group message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Group message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Group
                 */
                public static fromObject(object: { [k: string]: any }): perfetto.protos.ProtoLogViewerConfig.Group;

                /**
                 * Creates a plain object from a Group message. Also converts values to other types if specified.
                 * @param message Group
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: perfetto.protos.ProtoLogViewerConfig.Group, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Group to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Group
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** ProtoLogLevel enum. */
        enum ProtoLogLevel {
            PROTOLOG_LEVEL_UNDEFINED = 0,
            PROTOLOG_LEVEL_DEBUG = 1,
            PROTOLOG_LEVEL_VERBOSE = 2,
            PROTOLOG_LEVEL_INFO = 3,
            PROTOLOG_LEVEL_WARN = 4,
            PROTOLOG_LEVEL_ERROR = 5,
            PROTOLOG_LEVEL_WTF = 6
        }
    }
}
