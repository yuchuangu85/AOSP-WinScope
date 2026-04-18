import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace perfetto. */
export namespace perfetto {

    /** Namespace protos. */
    namespace protos {

        /** Properties of a Wrapper. */
        interface IWrapper {

            /** Wrapper viewcapture */
            viewcapture?: (perfetto.protos.IViewCapture|null);
        }

        /** Represents a Wrapper. */
        class Wrapper implements IWrapper {

            /**
             * Constructs a new Wrapper.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IWrapper);

            /** Wrapper viewcapture. */
            public viewcapture?: (perfetto.protos.IViewCapture|null);

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

        /** Properties of a ViewCapture. */
        interface IViewCapture {

            /** ViewCapture packageNameIid */
            packageNameIid?: (number|null);

            /** ViewCapture windowNameIid */
            windowNameIid?: (number|null);

            /** ViewCapture views */
            views?: (perfetto.protos.ViewCapture.IView[]|null);
        }

        /** Represents a ViewCapture. */
        class ViewCapture implements IViewCapture {

            /**
             * Constructs a new ViewCapture.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IViewCapture);

            /** ViewCapture packageNameIid. */
            public packageNameIid: number;

            /** ViewCapture windowNameIid. */
            public windowNameIid: number;

            /** ViewCapture views. */
            public views: perfetto.protos.ViewCapture.IView[];

            /**
             * Creates a new ViewCapture instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ViewCapture instance
             */
            public static create(properties?: perfetto.protos.IViewCapture): perfetto.protos.ViewCapture;

            /**
             * Encodes the specified ViewCapture message. Does not implicitly {@link perfetto.protos.ViewCapture.verify|verify} messages.
             * @param message ViewCapture message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IViewCapture, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ViewCapture message, length delimited. Does not implicitly {@link perfetto.protos.ViewCapture.verify|verify} messages.
             * @param message ViewCapture message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IViewCapture, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ViewCapture message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ViewCapture
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ViewCapture;

            /**
             * Decodes a ViewCapture message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ViewCapture
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ViewCapture;

            /**
             * Verifies a ViewCapture message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ViewCapture message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ViewCapture
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.ViewCapture;

            /**
             * Creates a plain object from a ViewCapture message. Also converts values to other types if specified.
             * @param message ViewCapture
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.ViewCapture, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ViewCapture to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ViewCapture
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ViewCapture {

            /** Properties of a View. */
            interface IView {

                /** View id */
                id?: (number|null);

                /** View parentId */
                parentId?: (number|null);

                /** View hashcode */
                hashcode?: (number|null);

                /** View viewIdIid */
                viewIdIid?: (number|null);

                /** View classNameIid */
                classNameIid?: (number|null);

                /** View left */
                left?: (number|null);

                /** View top */
                top?: (number|null);

                /** View width */
                width?: (number|null);

                /** View height */
                height?: (number|null);

                /** View scrollX */
                scrollX?: (number|null);

                /** View scrollY */
                scrollY?: (number|null);

                /** View translationX */
                translationX?: (number|null);

                /** View translationY */
                translationY?: (number|null);

                /** View scaleX */
                scaleX?: (number|null);

                /** View scaleY */
                scaleY?: (number|null);

                /** View alpha */
                alpha?: (number|null);

                /** View willNotDraw */
                willNotDraw?: (boolean|null);

                /** View clipChildren */
                clipChildren?: (boolean|null);

                /** View visibility */
                visibility?: (number|null);

                /** View elevation */
                elevation?: (number|null);
            }

            /** Represents a View. */
            class View implements IView {

                /**
                 * Constructs a new View.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: perfetto.protos.ViewCapture.IView);

                /** View id. */
                public id: number;

                /** View parentId. */
                public parentId: number;

                /** View hashcode. */
                public hashcode: number;

                /** View viewIdIid. */
                public viewIdIid: number;

                /** View classNameIid. */
                public classNameIid: number;

                /** View left. */
                public left: number;

                /** View top. */
                public top: number;

                /** View width. */
                public width: number;

                /** View height. */
                public height: number;

                /** View scrollX. */
                public scrollX: number;

                /** View scrollY. */
                public scrollY: number;

                /** View translationX. */
                public translationX: number;

                /** View translationY. */
                public translationY: number;

                /** View scaleX. */
                public scaleX: number;

                /** View scaleY. */
                public scaleY: number;

                /** View alpha. */
                public alpha: number;

                /** View willNotDraw. */
                public willNotDraw: boolean;

                /** View clipChildren. */
                public clipChildren: boolean;

                /** View visibility. */
                public visibility: number;

                /** View elevation. */
                public elevation: number;

                /**
                 * Creates a new View instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns View instance
                 */
                public static create(properties?: perfetto.protos.ViewCapture.IView): perfetto.protos.ViewCapture.View;

                /**
                 * Encodes the specified View message. Does not implicitly {@link perfetto.protos.ViewCapture.View.verify|verify} messages.
                 * @param message View message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: perfetto.protos.ViewCapture.IView, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified View message, length delimited. Does not implicitly {@link perfetto.protos.ViewCapture.View.verify|verify} messages.
                 * @param message View message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: perfetto.protos.ViewCapture.IView, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a View message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns View
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ViewCapture.View;

                /**
                 * Decodes a View message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns View
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ViewCapture.View;

                /**
                 * Verifies a View message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a View message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns View
                 */
                public static fromObject(object: { [k: string]: any }): perfetto.protos.ViewCapture.View;

                /**
                 * Creates a plain object from a View message. Also converts values to other types if specified.
                 * @param message View
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: perfetto.protos.ViewCapture.View, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this View to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for View
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }
}
