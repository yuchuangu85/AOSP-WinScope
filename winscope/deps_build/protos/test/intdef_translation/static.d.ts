import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace winscope. */
export namespace winscope {

    /** Namespace test. */
    namespace test {

        /** Properties of a RootMessage. */
        interface IRootMessage {

            /** RootMessage inputWindowInfo */
            inputWindowInfo?: (winscope.test.IInputWindowInfoProto|null);
        }

        /** Represents a RootMessage. */
        class RootMessage implements IRootMessage {

            /**
             * Constructs a new RootMessage.
             * @param [properties] Properties to set
             */
            constructor(properties?: winscope.test.IRootMessage);

            /** RootMessage inputWindowInfo. */
            public inputWindowInfo?: (winscope.test.IInputWindowInfoProto|null);

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

        /** Properties of an InputWindowInfoProto. */
        interface IInputWindowInfoProto {

            /** InputWindowInfoProto layoutParamsFlags */
            layoutParamsFlags?: (number|null);

            /** InputWindowInfoProto inputConfig */
            inputConfig?: (number|null);

            /** InputWindowInfoProto testAndroidTypedef */
            testAndroidTypedef?: (number|null);

            /** InputWindowInfoProto testAndroidCommonTypedef */
            testAndroidCommonTypedef?: (number|null);
        }

        /** Represents an InputWindowInfoProto. */
        class InputWindowInfoProto implements IInputWindowInfoProto {

            /**
             * Constructs a new InputWindowInfoProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: winscope.test.IInputWindowInfoProto);

            /** InputWindowInfoProto layoutParamsFlags. */
            public layoutParamsFlags: number;

            /** InputWindowInfoProto inputConfig. */
            public inputConfig: number;

            /** InputWindowInfoProto testAndroidTypedef. */
            public testAndroidTypedef: number;

            /** InputWindowInfoProto testAndroidCommonTypedef. */
            public testAndroidCommonTypedef: number;

            /**
             * Creates a new InputWindowInfoProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InputWindowInfoProto instance
             */
            public static create(properties?: winscope.test.IInputWindowInfoProto): winscope.test.InputWindowInfoProto;

            /**
             * Encodes the specified InputWindowInfoProto message. Does not implicitly {@link winscope.test.InputWindowInfoProto.verify|verify} messages.
             * @param message InputWindowInfoProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: winscope.test.IInputWindowInfoProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InputWindowInfoProto message, length delimited. Does not implicitly {@link winscope.test.InputWindowInfoProto.verify|verify} messages.
             * @param message InputWindowInfoProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: winscope.test.IInputWindowInfoProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InputWindowInfoProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InputWindowInfoProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): winscope.test.InputWindowInfoProto;

            /**
             * Decodes an InputWindowInfoProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InputWindowInfoProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): winscope.test.InputWindowInfoProto;

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
            public static fromObject(object: { [k: string]: any }): winscope.test.InputWindowInfoProto;

            /**
             * Creates a plain object from an InputWindowInfoProto message. Also converts values to other types if specified.
             * @param message InputWindowInfoProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: winscope.test.InputWindowInfoProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    }
}
