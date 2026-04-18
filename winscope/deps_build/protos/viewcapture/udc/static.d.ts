import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace com. */
export namespace com {

    /** Namespace android. */
    namespace android {

        /** Namespace app. */
        namespace app {

            /** Namespace viewcapture. */
            namespace viewcapture {

                /** Namespace data. */
                namespace data {

                    /** Properties of an ExportedData. */
                    interface IExportedData {

                        /** ExportedData magicNumber */
                        magicNumber?: (Long|null);

                        /** ExportedData windowData */
                        windowData?: (com.android.app.viewcapture.data.IWindowData[]|null);

                        /** ExportedData package */
                        "package"?: (string|null);

                        /** ExportedData classname */
                        classname?: (string[]|null);

                        /** ExportedData realToElapsedTimeOffsetNanos */
                        realToElapsedTimeOffsetNanos?: (Long|null);
                    }

                    /** Represents an ExportedData. */
                    class ExportedData implements IExportedData {

                        /**
                         * Constructs a new ExportedData.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: com.android.app.viewcapture.data.IExportedData);

                        /** ExportedData magicNumber. */
                        public magicNumber: Long;

                        /** ExportedData windowData. */
                        public windowData: com.android.app.viewcapture.data.IWindowData[];

                        /** ExportedData package. */
                        public package: string;

                        /** ExportedData classname. */
                        public classname: string[];

                        /** ExportedData realToElapsedTimeOffsetNanos. */
                        public realToElapsedTimeOffsetNanos: Long;

                        /**
                         * Creates a new ExportedData instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns ExportedData instance
                         */
                        public static create(properties?: com.android.app.viewcapture.data.IExportedData): com.android.app.viewcapture.data.ExportedData;

                        /**
                         * Encodes the specified ExportedData message. Does not implicitly {@link com.android.app.viewcapture.data.ExportedData.verify|verify} messages.
                         * @param message ExportedData message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encode(message: com.android.app.viewcapture.data.IExportedData, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified ExportedData message, length delimited. Does not implicitly {@link com.android.app.viewcapture.data.ExportedData.verify|verify} messages.
                         * @param message ExportedData message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encodeDelimited(message: com.android.app.viewcapture.data.IExportedData, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes an ExportedData message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns ExportedData
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.android.app.viewcapture.data.ExportedData;

                        /**
                         * Decodes an ExportedData message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns ExportedData
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.android.app.viewcapture.data.ExportedData;

                        /**
                         * Verifies an ExportedData message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        public static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates an ExportedData message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns ExportedData
                         */
                        public static fromObject(object: { [k: string]: any }): com.android.app.viewcapture.data.ExportedData;

                        /**
                         * Creates a plain object from an ExportedData message. Also converts values to other types if specified.
                         * @param message ExportedData
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: com.android.app.viewcapture.data.ExportedData, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this ExportedData to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for ExportedData
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }

                    namespace ExportedData {

                        /** MagicNumber enum. */
                        enum MagicNumber {
                            INVALID = 0,
                            MAGIC_NUMBER_L = 1703961976,
                            MAGIC_NUMBER_H = 1751482995
                        }
                    }

                    /** Properties of a WindowData. */
                    interface IWindowData {

                        /** WindowData frameData */
                        frameData?: (com.android.app.viewcapture.data.IFrameData[]|null);

                        /** WindowData title */
                        title?: (string|null);
                    }

                    /** Represents a WindowData. */
                    class WindowData implements IWindowData {

                        /**
                         * Constructs a new WindowData.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: com.android.app.viewcapture.data.IWindowData);

                        /** WindowData frameData. */
                        public frameData: com.android.app.viewcapture.data.IFrameData[];

                        /** WindowData title. */
                        public title: string;

                        /**
                         * Creates a new WindowData instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns WindowData instance
                         */
                        public static create(properties?: com.android.app.viewcapture.data.IWindowData): com.android.app.viewcapture.data.WindowData;

                        /**
                         * Encodes the specified WindowData message. Does not implicitly {@link com.android.app.viewcapture.data.WindowData.verify|verify} messages.
                         * @param message WindowData message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encode(message: com.android.app.viewcapture.data.IWindowData, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified WindowData message, length delimited. Does not implicitly {@link com.android.app.viewcapture.data.WindowData.verify|verify} messages.
                         * @param message WindowData message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encodeDelimited(message: com.android.app.viewcapture.data.IWindowData, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes a WindowData message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns WindowData
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.android.app.viewcapture.data.WindowData;

                        /**
                         * Decodes a WindowData message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns WindowData
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.android.app.viewcapture.data.WindowData;

                        /**
                         * Verifies a WindowData message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        public static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates a WindowData message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns WindowData
                         */
                        public static fromObject(object: { [k: string]: any }): com.android.app.viewcapture.data.WindowData;

                        /**
                         * Creates a plain object from a WindowData message. Also converts values to other types if specified.
                         * @param message WindowData
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: com.android.app.viewcapture.data.WindowData, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this WindowData to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for WindowData
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }

                    /** Properties of a MotionWindowData. */
                    interface IMotionWindowData {

                        /** MotionWindowData frameData */
                        frameData?: (com.android.app.viewcapture.data.IFrameData[]|null);

                        /** MotionWindowData classname */
                        classname?: (string[]|null);
                    }

                    /** Represents a MotionWindowData. */
                    class MotionWindowData implements IMotionWindowData {

                        /**
                         * Constructs a new MotionWindowData.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: com.android.app.viewcapture.data.IMotionWindowData);

                        /** MotionWindowData frameData. */
                        public frameData: com.android.app.viewcapture.data.IFrameData[];

                        /** MotionWindowData classname. */
                        public classname: string[];

                        /**
                         * Creates a new MotionWindowData instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns MotionWindowData instance
                         */
                        public static create(properties?: com.android.app.viewcapture.data.IMotionWindowData): com.android.app.viewcapture.data.MotionWindowData;

                        /**
                         * Encodes the specified MotionWindowData message. Does not implicitly {@link com.android.app.viewcapture.data.MotionWindowData.verify|verify} messages.
                         * @param message MotionWindowData message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encode(message: com.android.app.viewcapture.data.IMotionWindowData, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified MotionWindowData message, length delimited. Does not implicitly {@link com.android.app.viewcapture.data.MotionWindowData.verify|verify} messages.
                         * @param message MotionWindowData message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encodeDelimited(message: com.android.app.viewcapture.data.IMotionWindowData, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes a MotionWindowData message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns MotionWindowData
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.android.app.viewcapture.data.MotionWindowData;

                        /**
                         * Decodes a MotionWindowData message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns MotionWindowData
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.android.app.viewcapture.data.MotionWindowData;

                        /**
                         * Verifies a MotionWindowData message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        public static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates a MotionWindowData message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns MotionWindowData
                         */
                        public static fromObject(object: { [k: string]: any }): com.android.app.viewcapture.data.MotionWindowData;

                        /**
                         * Creates a plain object from a MotionWindowData message. Also converts values to other types if specified.
                         * @param message MotionWindowData
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: com.android.app.viewcapture.data.MotionWindowData, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this MotionWindowData to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for MotionWindowData
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }

                    /** Properties of a FrameData. */
                    interface IFrameData {

                        /** FrameData timestamp */
                        timestamp?: (Long|null);

                        /** FrameData node */
                        node?: (com.android.app.viewcapture.data.IViewNode|null);
                    }

                    /** Represents a FrameData. */
                    class FrameData implements IFrameData {

                        /**
                         * Constructs a new FrameData.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: com.android.app.viewcapture.data.IFrameData);

                        /** FrameData timestamp. */
                        public timestamp: Long;

                        /** FrameData node. */
                        public node?: (com.android.app.viewcapture.data.IViewNode|null);

                        /**
                         * Creates a new FrameData instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns FrameData instance
                         */
                        public static create(properties?: com.android.app.viewcapture.data.IFrameData): com.android.app.viewcapture.data.FrameData;

                        /**
                         * Encodes the specified FrameData message. Does not implicitly {@link com.android.app.viewcapture.data.FrameData.verify|verify} messages.
                         * @param message FrameData message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encode(message: com.android.app.viewcapture.data.IFrameData, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified FrameData message, length delimited. Does not implicitly {@link com.android.app.viewcapture.data.FrameData.verify|verify} messages.
                         * @param message FrameData message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encodeDelimited(message: com.android.app.viewcapture.data.IFrameData, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes a FrameData message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns FrameData
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.android.app.viewcapture.data.FrameData;

                        /**
                         * Decodes a FrameData message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns FrameData
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.android.app.viewcapture.data.FrameData;

                        /**
                         * Verifies a FrameData message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        public static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates a FrameData message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns FrameData
                         */
                        public static fromObject(object: { [k: string]: any }): com.android.app.viewcapture.data.FrameData;

                        /**
                         * Creates a plain object from a FrameData message. Also converts values to other types if specified.
                         * @param message FrameData
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: com.android.app.viewcapture.data.FrameData, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this FrameData to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for FrameData
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }

                    /** Properties of a ViewNode. */
                    interface IViewNode {

                        /** ViewNode classnameIndex */
                        classnameIndex?: (number|null);

                        /** ViewNode hashcode */
                        hashcode?: (number|null);

                        /** ViewNode children */
                        children?: (com.android.app.viewcapture.data.IViewNode[]|null);

                        /** ViewNode id */
                        id?: (string|null);

                        /** ViewNode left */
                        left?: (number|null);

                        /** ViewNode top */
                        top?: (number|null);

                        /** ViewNode width */
                        width?: (number|null);

                        /** ViewNode height */
                        height?: (number|null);

                        /** ViewNode scrollX */
                        scrollX?: (number|null);

                        /** ViewNode scrollY */
                        scrollY?: (number|null);

                        /** ViewNode translationX */
                        translationX?: (number|null);

                        /** ViewNode translationY */
                        translationY?: (number|null);

                        /** ViewNode scaleX */
                        scaleX?: (number|null);

                        /** ViewNode scaleY */
                        scaleY?: (number|null);

                        /** ViewNode alpha */
                        alpha?: (number|null);

                        /** ViewNode willNotDraw */
                        willNotDraw?: (boolean|null);

                        /** ViewNode clipChildren */
                        clipChildren?: (boolean|null);

                        /** ViewNode visibility */
                        visibility?: (number|null);

                        /** ViewNode elevation */
                        elevation?: (number|null);
                    }

                    /** Represents a ViewNode. */
                    class ViewNode implements IViewNode {

                        /**
                         * Constructs a new ViewNode.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: com.android.app.viewcapture.data.IViewNode);

                        /** ViewNode classnameIndex. */
                        public classnameIndex: number;

                        /** ViewNode hashcode. */
                        public hashcode: number;

                        /** ViewNode children. */
                        public children: com.android.app.viewcapture.data.IViewNode[];

                        /** ViewNode id. */
                        public id: string;

                        /** ViewNode left. */
                        public left: number;

                        /** ViewNode top. */
                        public top: number;

                        /** ViewNode width. */
                        public width: number;

                        /** ViewNode height. */
                        public height: number;

                        /** ViewNode scrollX. */
                        public scrollX: number;

                        /** ViewNode scrollY. */
                        public scrollY: number;

                        /** ViewNode translationX. */
                        public translationX: number;

                        /** ViewNode translationY. */
                        public translationY: number;

                        /** ViewNode scaleX. */
                        public scaleX: number;

                        /** ViewNode scaleY. */
                        public scaleY: number;

                        /** ViewNode alpha. */
                        public alpha: number;

                        /** ViewNode willNotDraw. */
                        public willNotDraw: boolean;

                        /** ViewNode clipChildren. */
                        public clipChildren: boolean;

                        /** ViewNode visibility. */
                        public visibility: number;

                        /** ViewNode elevation. */
                        public elevation: number;

                        /**
                         * Creates a new ViewNode instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns ViewNode instance
                         */
                        public static create(properties?: com.android.app.viewcapture.data.IViewNode): com.android.app.viewcapture.data.ViewNode;

                        /**
                         * Encodes the specified ViewNode message. Does not implicitly {@link com.android.app.viewcapture.data.ViewNode.verify|verify} messages.
                         * @param message ViewNode message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encode(message: com.android.app.viewcapture.data.IViewNode, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified ViewNode message, length delimited. Does not implicitly {@link com.android.app.viewcapture.data.ViewNode.verify|verify} messages.
                         * @param message ViewNode message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encodeDelimited(message: com.android.app.viewcapture.data.IViewNode, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes a ViewNode message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns ViewNode
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.android.app.viewcapture.data.ViewNode;

                        /**
                         * Decodes a ViewNode message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns ViewNode
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.android.app.viewcapture.data.ViewNode;

                        /**
                         * Verifies a ViewNode message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        public static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates a ViewNode message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns ViewNode
                         */
                        public static fromObject(object: { [k: string]: any }): com.android.app.viewcapture.data.ViewNode;

                        /**
                         * Creates a plain object from a ViewNode message. Also converts values to other types if specified.
                         * @param message ViewNode
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: com.android.app.viewcapture.data.ViewNode, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this ViewNode to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };

                        /**
                         * Gets the default type url for ViewNode
                         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns The default type url
                         */
                        public static getTypeUrl(typeUrlPrefix?: string): string;
                    }
                }
            }
        }
    }
}
