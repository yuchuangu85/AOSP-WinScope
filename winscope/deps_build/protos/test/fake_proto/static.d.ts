import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace winscope. */
export namespace winscope {

    /** Namespace test. */
    namespace test {

        /** Properties of a RootMessage. */
        interface IRootMessage {

            /** RootMessage entry */
            entry?: (winscope.test.IEntry|null);
        }

        /** Represents a RootMessage. */
        class RootMessage implements IRootMessage {

            /**
             * Constructs a new RootMessage.
             * @param [properties] Properties to set
             */
            constructor(properties?: winscope.test.IRootMessage);

            /** RootMessage entry. */
            public entry?: (winscope.test.IEntry|null);

            /**
             * Creates a new RootMessage instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RootMessage instance
             */
            public static create(properties?: winscope.test.IRootMessage): winscope.test.RootMessage;

            /**
             * Encodes the specified RootMessage message. Does not implicitly {@link winscope.test.RootMessage.verify|verify} messages.
             * @param message RootMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: winscope.test.IRootMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RootMessage message, length delimited. Does not implicitly {@link winscope.test.RootMessage.verify|verify} messages.
             * @param message RootMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: winscope.test.IRootMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RootMessage message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RootMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): winscope.test.RootMessage;

            /**
             * Decodes a RootMessage message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RootMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): winscope.test.RootMessage;

            /**
             * Verifies a RootMessage message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RootMessage message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RootMessage
             */
            public static fromObject(object: { [k: string]: any }): winscope.test.RootMessage;

            /**
             * Creates a plain object from a RootMessage message. Also converts values to other types if specified.
             * @param message RootMessage
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: winscope.test.RootMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this RootMessage to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for RootMessage
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Enum0 enum. */
        enum Enum0 {
            ENUM0_VALUE_ZERO = 0,
            ENUM0_VALUE_ONE = 1
        }

        /** Properties of an Entry. */
        interface IEntry {

            /** Entry enum0 */
            enum0?: (winscope.test.Enum0|null);

            /** Entry enum1 */
            enum1?: (winscope.test.Entry.Enum1|null);

            /** Entry array */
            array?: (number[]|null);

            /** Entry number_32bit */
            number_32bit?: (number|null);

            /** Entry number_64bit */
            number_64bit?: (Long|null);

            /** Entry _case_64bit */
            _case_64bit?: (Long|null);

            /** Entry case_64bit */
            case_64bit?: (Long|null);

            /** Entry case_64bitLsb */
            case_64bitLsb?: (Long|null);

            /** Entry case_64Bit */
            case_64Bit?: (Long|null);

            /** Entry case_64BitLsb */
            case_64BitLsb?: (Long|null);

            /** Entry boolValue */
            boolValue?: (boolean|null);
        }

        /** Represents an Entry. */
        class Entry implements IEntry {

            /**
             * Constructs a new Entry.
             * @param [properties] Properties to set
             */
            constructor(properties?: winscope.test.IEntry);

            /** Entry enum0. */
            public enum0: winscope.test.Enum0;

            /** Entry enum1. */
            public enum1: winscope.test.Entry.Enum1;

            /** Entry array. */
            public array: number[];

            /** Entry number_32bit. */
            public number_32bit: number;

            /** Entry number_64bit. */
            public number_64bit: Long;

            /** Entry _case_64bit. */
            public _case_64bit: Long;

            /** Entry case_64bit. */
            public case_64bit: Long;

            /** Entry case_64bitLsb. */
            public case_64bitLsb: Long;

            /** Entry case_64Bit. */
            public case_64Bit: Long;

            /** Entry case_64BitLsb. */
            public case_64BitLsb: Long;

            /** Entry boolValue. */
            public boolValue: boolean;

            /**
             * Creates a new Entry instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Entry instance
             */
            public static create(properties?: winscope.test.IEntry): winscope.test.Entry;

            /**
             * Encodes the specified Entry message. Does not implicitly {@link winscope.test.Entry.verify|verify} messages.
             * @param message Entry message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: winscope.test.IEntry, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Entry message, length delimited. Does not implicitly {@link winscope.test.Entry.verify|verify} messages.
             * @param message Entry message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: winscope.test.IEntry, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Entry message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Entry
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): winscope.test.Entry;

            /**
             * Decodes an Entry message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Entry
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): winscope.test.Entry;

            /**
             * Verifies an Entry message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Entry message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Entry
             */
            public static fromObject(object: { [k: string]: any }): winscope.test.Entry;

            /**
             * Creates a plain object from an Entry message. Also converts values to other types if specified.
             * @param message Entry
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: winscope.test.Entry, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Entry to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Entry
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace Entry {

            /** Enum1 enum. */
            enum Enum1 {
                ENUM1_VALUE_ZERO = 0,
                ENUM1_VALUE_ONE = 1
            }
        }
    }
}
