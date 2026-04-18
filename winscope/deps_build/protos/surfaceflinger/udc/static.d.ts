import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace android. */
export namespace android {

    /** Namespace surfaceflinger. */
    namespace surfaceflinger {

        /** Properties of a LayersTraceFileProto. */
        interface ILayersTraceFileProto {

            /** LayersTraceFileProto magicNumber */
            magicNumber?: (Long|null);

            /** LayersTraceFileProto entry */
            entry?: (android.surfaceflinger.ILayersTraceProto[]|null);

            /** LayersTraceFileProto realToElapsedTimeOffsetNanos */
            realToElapsedTimeOffsetNanos?: (Long|null);
        }

        /** Represents a LayersTraceFileProto. */
        class LayersTraceFileProto implements ILayersTraceFileProto {

            /**
             * Constructs a new LayersTraceFileProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.surfaceflinger.ILayersTraceFileProto);

            /** LayersTraceFileProto magicNumber. */
            public magicNumber: Long;

            /** LayersTraceFileProto entry. */
            public entry: android.surfaceflinger.ILayersTraceProto[];

            /** LayersTraceFileProto realToElapsedTimeOffsetNanos. */
            public realToElapsedTimeOffsetNanos: Long;

            /**
             * Creates a new LayersTraceFileProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LayersTraceFileProto instance
             */
            public static create(properties?: android.surfaceflinger.ILayersTraceFileProto): android.surfaceflinger.LayersTraceFileProto;

            /**
             * Encodes the specified LayersTraceFileProto message. Does not implicitly {@link android.surfaceflinger.LayersTraceFileProto.verify|verify} messages.
             * @param message LayersTraceFileProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.surfaceflinger.ILayersTraceFileProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LayersTraceFileProto message, length delimited. Does not implicitly {@link android.surfaceflinger.LayersTraceFileProto.verify|verify} messages.
             * @param message LayersTraceFileProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.surfaceflinger.ILayersTraceFileProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LayersTraceFileProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LayersTraceFileProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.LayersTraceFileProto;

            /**
             * Decodes a LayersTraceFileProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LayersTraceFileProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.LayersTraceFileProto;

            /**
             * Verifies a LayersTraceFileProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a LayersTraceFileProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LayersTraceFileProto
             */
            public static fromObject(object: { [k: string]: any }): android.surfaceflinger.LayersTraceFileProto;

            /**
             * Creates a plain object from a LayersTraceFileProto message. Also converts values to other types if specified.
             * @param message LayersTraceFileProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.surfaceflinger.LayersTraceFileProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this LayersTraceFileProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for LayersTraceFileProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace LayersTraceFileProto {

            /** MagicNumber enum. */
            enum MagicNumber {
                INVALID = 0,
                MAGIC_NUMBER_L = 1414682956,
                MAGIC_NUMBER_H = 1162035538
            }
        }

        /** Properties of a LayersTraceProto. */
        interface ILayersTraceProto {

            /** LayersTraceProto elapsedRealtimeNanos */
            elapsedRealtimeNanos?: (Long|null);

            /** LayersTraceProto where */
            where?: (string|null);

            /** LayersTraceProto layers */
            layers?: (android.surfaceflinger.ILayersProto|null);

            /** LayersTraceProto hwcBlob */
            hwcBlob?: (string|null);

            /** LayersTraceProto excludesCompositionState */
            excludesCompositionState?: (boolean|null);

            /** LayersTraceProto missedEntries */
            missedEntries?: (number|null);

            /** LayersTraceProto displays */
            displays?: (android.surfaceflinger.IDisplayProto[]|null);

            /** LayersTraceProto vsyncId */
            vsyncId?: (Long|null);
        }

        /** Represents a LayersTraceProto. */
        class LayersTraceProto implements ILayersTraceProto {

            /**
             * Constructs a new LayersTraceProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.surfaceflinger.ILayersTraceProto);

            /** LayersTraceProto elapsedRealtimeNanos. */
            public elapsedRealtimeNanos: Long;

            /** LayersTraceProto where. */
            public where: string;

            /** LayersTraceProto layers. */
            public layers?: (android.surfaceflinger.ILayersProto|null);

            /** LayersTraceProto hwcBlob. */
            public hwcBlob: string;

            /** LayersTraceProto excludesCompositionState. */
            public excludesCompositionState: boolean;

            /** LayersTraceProto missedEntries. */
            public missedEntries: number;

            /** LayersTraceProto displays. */
            public displays: android.surfaceflinger.IDisplayProto[];

            /** LayersTraceProto vsyncId. */
            public vsyncId: Long;

            /**
             * Creates a new LayersTraceProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LayersTraceProto instance
             */
            public static create(properties?: android.surfaceflinger.ILayersTraceProto): android.surfaceflinger.LayersTraceProto;

            /**
             * Encodes the specified LayersTraceProto message. Does not implicitly {@link android.surfaceflinger.LayersTraceProto.verify|verify} messages.
             * @param message LayersTraceProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.surfaceflinger.ILayersTraceProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LayersTraceProto message, length delimited. Does not implicitly {@link android.surfaceflinger.LayersTraceProto.verify|verify} messages.
             * @param message LayersTraceProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.surfaceflinger.ILayersTraceProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LayersTraceProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LayersTraceProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.LayersTraceProto;

            /**
             * Decodes a LayersTraceProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LayersTraceProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.LayersTraceProto;

            /**
             * Verifies a LayersTraceProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a LayersTraceProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LayersTraceProto
             */
            public static fromObject(object: { [k: string]: any }): android.surfaceflinger.LayersTraceProto;

            /**
             * Creates a plain object from a LayersTraceProto message. Also converts values to other types if specified.
             * @param message LayersTraceProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.surfaceflinger.LayersTraceProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this LayersTraceProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for LayersTraceProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a LayersProto. */
        interface ILayersProto {

            /** LayersProto layers */
            layers?: (android.surfaceflinger.ILayerProto[]|null);
        }

        /** Represents a LayersProto. */
        class LayersProto implements ILayersProto {

            /**
             * Constructs a new LayersProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.surfaceflinger.ILayersProto);

            /** LayersProto layers. */
            public layers: android.surfaceflinger.ILayerProto[];

            /**
             * Creates a new LayersProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LayersProto instance
             */
            public static create(properties?: android.surfaceflinger.ILayersProto): android.surfaceflinger.LayersProto;

            /**
             * Encodes the specified LayersProto message. Does not implicitly {@link android.surfaceflinger.LayersProto.verify|verify} messages.
             * @param message LayersProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.surfaceflinger.ILayersProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LayersProto message, length delimited. Does not implicitly {@link android.surfaceflinger.LayersProto.verify|verify} messages.
             * @param message LayersProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.surfaceflinger.ILayersProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LayersProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LayersProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.LayersProto;

            /**
             * Decodes a LayersProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LayersProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.LayersProto;

            /**
             * Verifies a LayersProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a LayersProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LayersProto
             */
            public static fromObject(object: { [k: string]: any }): android.surfaceflinger.LayersProto;

            /**
             * Creates a plain object from a LayersProto message. Also converts values to other types if specified.
             * @param message LayersProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.surfaceflinger.LayersProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this LayersProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for LayersProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** HwcCompositionType enum. */
        enum HwcCompositionType {
            INVALID = 0,
            CLIENT = 1,
            DEVICE = 2,
            SOLID_COLOR = 3,
            CURSOR = 4,
            SIDEBAND = 5,
            DISPLAY_DECORATION = 6
        }

        /** Properties of a LayerProto. */
        interface ILayerProto {

            /** LayerProto id */
            id?: (number|null);

            /** LayerProto name */
            name?: (string|null);

            /** LayerProto children */
            children?: (number[]|null);

            /** LayerProto relatives */
            relatives?: (number[]|null);

            /** LayerProto type */
            type?: (string|null);

            /** LayerProto transparentRegion */
            transparentRegion?: (android.surfaceflinger.IRegionProto|null);

            /** LayerProto visibleRegion */
            visibleRegion?: (android.surfaceflinger.IRegionProto|null);

            /** LayerProto damageRegion */
            damageRegion?: (android.surfaceflinger.IRegionProto|null);

            /** LayerProto layerStack */
            layerStack?: (number|null);

            /** LayerProto z */
            z?: (number|null);

            /** LayerProto position */
            position?: (android.surfaceflinger.IPositionProto|null);

            /** LayerProto requestedPosition */
            requestedPosition?: (android.surfaceflinger.IPositionProto|null);

            /** LayerProto size */
            size?: (android.surfaceflinger.ISizeProto|null);

            /** LayerProto crop */
            crop?: (android.surfaceflinger.IRectProto|null);

            /** LayerProto finalCrop */
            finalCrop?: (android.surfaceflinger.IRectProto|null);

            /** LayerProto isOpaque */
            isOpaque?: (boolean|null);

            /** LayerProto invalidate */
            invalidate?: (boolean|null);

            /** LayerProto dataspace */
            dataspace?: (string|null);

            /** LayerProto pixelFormat */
            pixelFormat?: (string|null);

            /** LayerProto color */
            color?: (android.surfaceflinger.IColorProto|null);

            /** LayerProto requestedColor */
            requestedColor?: (android.surfaceflinger.IColorProto|null);

            /** LayerProto flags */
            flags?: (number|null);

            /** LayerProto transform */
            transform?: (android.surfaceflinger.ITransformProto|null);

            /** LayerProto requestedTransform */
            requestedTransform?: (android.surfaceflinger.ITransformProto|null);

            /** LayerProto parent */
            parent?: (number|null);

            /** LayerProto zOrderRelativeOf */
            zOrderRelativeOf?: (number|null);

            /** LayerProto activeBuffer */
            activeBuffer?: (android.surfaceflinger.IActiveBufferProto|null);

            /** LayerProto queuedFrames */
            queuedFrames?: (number|null);

            /** LayerProto refreshPending */
            refreshPending?: (boolean|null);

            /** LayerProto hwcFrame */
            hwcFrame?: (android.surfaceflinger.IRectProto|null);

            /** LayerProto hwcCrop */
            hwcCrop?: (android.surfaceflinger.IFloatRectProto|null);

            /** LayerProto hwcTransform */
            hwcTransform?: (number|null);

            /** LayerProto windowType */
            windowType?: (number|null);

            /** LayerProto appId */
            appId?: (number|null);

            /** LayerProto hwcCompositionType */
            hwcCompositionType?: (android.surfaceflinger.HwcCompositionType|null);

            /** LayerProto isProtected */
            isProtected?: (boolean|null);

            /** LayerProto currFrame */
            currFrame?: (Long|null);

            /** LayerProto barrierLayer */
            barrierLayer?: (android.surfaceflinger.IBarrierLayerProto[]|null);

            /** LayerProto bufferTransform */
            bufferTransform?: (android.surfaceflinger.ITransformProto|null);

            /** LayerProto effectiveScalingMode */
            effectiveScalingMode?: (number|null);

            /** LayerProto cornerRadius */
            cornerRadius?: (number|null);

            /** LayerProto metadata */
            metadata?: ({ [k: string]: Uint8Array }|null);

            /** LayerProto effectiveTransform */
            effectiveTransform?: (android.surfaceflinger.ITransformProto|null);

            /** LayerProto sourceBounds */
            sourceBounds?: (android.surfaceflinger.IFloatRectProto|null);

            /** LayerProto bounds */
            bounds?: (android.surfaceflinger.IFloatRectProto|null);

            /** LayerProto screenBounds */
            screenBounds?: (android.surfaceflinger.IFloatRectProto|null);

            /** LayerProto inputWindowInfo */
            inputWindowInfo?: (android.surfaceflinger.IInputWindowInfoProto|null);

            /** LayerProto cornerRadiusCrop */
            cornerRadiusCrop?: (android.surfaceflinger.IFloatRectProto|null);

            /** LayerProto shadowRadius */
            shadowRadius?: (number|null);

            /** LayerProto colorTransform */
            colorTransform?: (android.surfaceflinger.IColorTransformProto|null);

            /** LayerProto isRelativeOf */
            isRelativeOf?: (boolean|null);

            /** LayerProto backgroundBlurRadius */
            backgroundBlurRadius?: (number|null);

            /** LayerProto ownerUid */
            ownerUid?: (number|null);

            /** LayerProto blurRegions */
            blurRegions?: (android.surfaceflinger.IBlurRegion[]|null);

            /** LayerProto isTrustedOverlay */
            isTrustedOverlay?: (boolean|null);

            /** LayerProto requestedCornerRadius */
            requestedCornerRadius?: (number|null);

            /** LayerProto destinationFrame */
            destinationFrame?: (android.surfaceflinger.IRectProto|null);

            /** LayerProto originalId */
            originalId?: (number|null);
        }

        /** Represents a LayerProto. */
        class LayerProto implements ILayerProto {

            /**
             * Constructs a new LayerProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.surfaceflinger.ILayerProto);

            /** LayerProto id. */
            public id: number;

            /** LayerProto name. */
            public name: string;

            /** LayerProto children. */
            public children: number[];

            /** LayerProto relatives. */
            public relatives: number[];

            /** LayerProto type. */
            public type: string;

            /** LayerProto transparentRegion. */
            public transparentRegion?: (android.surfaceflinger.IRegionProto|null);

            /** LayerProto visibleRegion. */
            public visibleRegion?: (android.surfaceflinger.IRegionProto|null);

            /** LayerProto damageRegion. */
            public damageRegion?: (android.surfaceflinger.IRegionProto|null);

            /** LayerProto layerStack. */
            public layerStack: number;

            /** LayerProto z. */
            public z: number;

            /** LayerProto position. */
            public position?: (android.surfaceflinger.IPositionProto|null);

            /** LayerProto requestedPosition. */
            public requestedPosition?: (android.surfaceflinger.IPositionProto|null);

            /** LayerProto size. */
            public size?: (android.surfaceflinger.ISizeProto|null);

            /** LayerProto crop. */
            public crop?: (android.surfaceflinger.IRectProto|null);

            /** LayerProto finalCrop. */
            public finalCrop?: (android.surfaceflinger.IRectProto|null);

            /** LayerProto isOpaque. */
            public isOpaque: boolean;

            /** LayerProto invalidate. */
            public invalidate: boolean;

            /** LayerProto dataspace. */
            public dataspace: string;

            /** LayerProto pixelFormat. */
            public pixelFormat: string;

            /** LayerProto color. */
            public color?: (android.surfaceflinger.IColorProto|null);

            /** LayerProto requestedColor. */
            public requestedColor?: (android.surfaceflinger.IColorProto|null);

            /** LayerProto flags. */
            public flags: number;

            /** LayerProto transform. */
            public transform?: (android.surfaceflinger.ITransformProto|null);

            /** LayerProto requestedTransform. */
            public requestedTransform?: (android.surfaceflinger.ITransformProto|null);

            /** LayerProto parent. */
            public parent: number;

            /** LayerProto zOrderRelativeOf. */
            public zOrderRelativeOf: number;

            /** LayerProto activeBuffer. */
            public activeBuffer?: (android.surfaceflinger.IActiveBufferProto|null);

            /** LayerProto queuedFrames. */
            public queuedFrames: number;

            /** LayerProto refreshPending. */
            public refreshPending: boolean;

            /** LayerProto hwcFrame. */
            public hwcFrame?: (android.surfaceflinger.IRectProto|null);

            /** LayerProto hwcCrop. */
            public hwcCrop?: (android.surfaceflinger.IFloatRectProto|null);

            /** LayerProto hwcTransform. */
            public hwcTransform: number;

            /** LayerProto windowType. */
            public windowType: number;

            /** LayerProto appId. */
            public appId: number;

            /** LayerProto hwcCompositionType. */
            public hwcCompositionType: android.surfaceflinger.HwcCompositionType;

            /** LayerProto isProtected. */
            public isProtected: boolean;

            /** LayerProto currFrame. */
            public currFrame: Long;

            /** LayerProto barrierLayer. */
            public barrierLayer: android.surfaceflinger.IBarrierLayerProto[];

            /** LayerProto bufferTransform. */
            public bufferTransform?: (android.surfaceflinger.ITransformProto|null);

            /** LayerProto effectiveScalingMode. */
            public effectiveScalingMode: number;

            /** LayerProto cornerRadius. */
            public cornerRadius: number;

            /** LayerProto metadata. */
            public metadata: { [k: string]: Uint8Array };

            /** LayerProto effectiveTransform. */
            public effectiveTransform?: (android.surfaceflinger.ITransformProto|null);

            /** LayerProto sourceBounds. */
            public sourceBounds?: (android.surfaceflinger.IFloatRectProto|null);

            /** LayerProto bounds. */
            public bounds?: (android.surfaceflinger.IFloatRectProto|null);

            /** LayerProto screenBounds. */
            public screenBounds?: (android.surfaceflinger.IFloatRectProto|null);

            /** LayerProto inputWindowInfo. */
            public inputWindowInfo?: (android.surfaceflinger.IInputWindowInfoProto|null);

            /** LayerProto cornerRadiusCrop. */
            public cornerRadiusCrop?: (android.surfaceflinger.IFloatRectProto|null);

            /** LayerProto shadowRadius. */
            public shadowRadius: number;

            /** LayerProto colorTransform. */
            public colorTransform?: (android.surfaceflinger.IColorTransformProto|null);

            /** LayerProto isRelativeOf. */
            public isRelativeOf: boolean;

            /** LayerProto backgroundBlurRadius. */
            public backgroundBlurRadius: number;

            /** LayerProto ownerUid. */
            public ownerUid: number;

            /** LayerProto blurRegions. */
            public blurRegions: android.surfaceflinger.IBlurRegion[];

            /** LayerProto isTrustedOverlay. */
            public isTrustedOverlay: boolean;

            /** LayerProto requestedCornerRadius. */
            public requestedCornerRadius: number;

            /** LayerProto destinationFrame. */
            public destinationFrame?: (android.surfaceflinger.IRectProto|null);

            /** LayerProto originalId. */
            public originalId: number;

            /**
             * Creates a new LayerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LayerProto instance
             */
            public static create(properties?: android.surfaceflinger.ILayerProto): android.surfaceflinger.LayerProto;

            /**
             * Encodes the specified LayerProto message. Does not implicitly {@link android.surfaceflinger.LayerProto.verify|verify} messages.
             * @param message LayerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.surfaceflinger.ILayerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LayerProto message, length delimited. Does not implicitly {@link android.surfaceflinger.LayerProto.verify|verify} messages.
             * @param message LayerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.surfaceflinger.ILayerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LayerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LayerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.LayerProto;

            /**
             * Decodes a LayerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LayerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.LayerProto;

            /**
             * Verifies a LayerProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a LayerProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LayerProto
             */
            public static fromObject(object: { [k: string]: any }): android.surfaceflinger.LayerProto;

            /**
             * Creates a plain object from a LayerProto message. Also converts values to other types if specified.
             * @param message LayerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.surfaceflinger.LayerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this LayerProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for LayerProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a PositionProto. */
        interface IPositionProto {

            /** PositionProto x */
            x?: (number|null);

            /** PositionProto y */
            y?: (number|null);
        }

        /** Represents a PositionProto. */
        class PositionProto implements IPositionProto {

            /**
             * Constructs a new PositionProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.surfaceflinger.IPositionProto);

            /** PositionProto x. */
            public x: number;

            /** PositionProto y. */
            public y: number;

            /**
             * Creates a new PositionProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PositionProto instance
             */
            public static create(properties?: android.surfaceflinger.IPositionProto): android.surfaceflinger.PositionProto;

            /**
             * Encodes the specified PositionProto message. Does not implicitly {@link android.surfaceflinger.PositionProto.verify|verify} messages.
             * @param message PositionProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.surfaceflinger.IPositionProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PositionProto message, length delimited. Does not implicitly {@link android.surfaceflinger.PositionProto.verify|verify} messages.
             * @param message PositionProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.surfaceflinger.IPositionProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PositionProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PositionProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.PositionProto;

            /**
             * Decodes a PositionProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PositionProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.PositionProto;

            /**
             * Verifies a PositionProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PositionProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PositionProto
             */
            public static fromObject(object: { [k: string]: any }): android.surfaceflinger.PositionProto;

            /**
             * Creates a plain object from a PositionProto message. Also converts values to other types if specified.
             * @param message PositionProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.surfaceflinger.PositionProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PositionProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for PositionProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a FloatRectProto. */
        interface IFloatRectProto {

            /** FloatRectProto left */
            left?: (number|null);

            /** FloatRectProto top */
            top?: (number|null);

            /** FloatRectProto right */
            right?: (number|null);

            /** FloatRectProto bottom */
            bottom?: (number|null);
        }

        /** Represents a FloatRectProto. */
        class FloatRectProto implements IFloatRectProto {

            /**
             * Constructs a new FloatRectProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.surfaceflinger.IFloatRectProto);

            /** FloatRectProto left. */
            public left: number;

            /** FloatRectProto top. */
            public top: number;

            /** FloatRectProto right. */
            public right: number;

            /** FloatRectProto bottom. */
            public bottom: number;

            /**
             * Creates a new FloatRectProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FloatRectProto instance
             */
            public static create(properties?: android.surfaceflinger.IFloatRectProto): android.surfaceflinger.FloatRectProto;

            /**
             * Encodes the specified FloatRectProto message. Does not implicitly {@link android.surfaceflinger.FloatRectProto.verify|verify} messages.
             * @param message FloatRectProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.surfaceflinger.IFloatRectProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FloatRectProto message, length delimited. Does not implicitly {@link android.surfaceflinger.FloatRectProto.verify|verify} messages.
             * @param message FloatRectProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.surfaceflinger.IFloatRectProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FloatRectProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FloatRectProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.FloatRectProto;

            /**
             * Decodes a FloatRectProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FloatRectProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.FloatRectProto;

            /**
             * Verifies a FloatRectProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FloatRectProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FloatRectProto
             */
            public static fromObject(object: { [k: string]: any }): android.surfaceflinger.FloatRectProto;

            /**
             * Creates a plain object from a FloatRectProto message. Also converts values to other types if specified.
             * @param message FloatRectProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.surfaceflinger.FloatRectProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FloatRectProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for FloatRectProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an ActiveBufferProto. */
        interface IActiveBufferProto {

            /** ActiveBufferProto width */
            width?: (number|null);

            /** ActiveBufferProto height */
            height?: (number|null);

            /** ActiveBufferProto stride */
            stride?: (number|null);

            /** ActiveBufferProto format */
            format?: (number|null);

            /** ActiveBufferProto usage */
            usage?: (Long|null);
        }

        /** Represents an ActiveBufferProto. */
        class ActiveBufferProto implements IActiveBufferProto {

            /**
             * Constructs a new ActiveBufferProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.surfaceflinger.IActiveBufferProto);

            /** ActiveBufferProto width. */
            public width: number;

            /** ActiveBufferProto height. */
            public height: number;

            /** ActiveBufferProto stride. */
            public stride: number;

            /** ActiveBufferProto format. */
            public format: number;

            /** ActiveBufferProto usage. */
            public usage: Long;

            /**
             * Creates a new ActiveBufferProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ActiveBufferProto instance
             */
            public static create(properties?: android.surfaceflinger.IActiveBufferProto): android.surfaceflinger.ActiveBufferProto;

            /**
             * Encodes the specified ActiveBufferProto message. Does not implicitly {@link android.surfaceflinger.ActiveBufferProto.verify|verify} messages.
             * @param message ActiveBufferProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.surfaceflinger.IActiveBufferProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ActiveBufferProto message, length delimited. Does not implicitly {@link android.surfaceflinger.ActiveBufferProto.verify|verify} messages.
             * @param message ActiveBufferProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.surfaceflinger.IActiveBufferProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ActiveBufferProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ActiveBufferProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.ActiveBufferProto;

            /**
             * Decodes an ActiveBufferProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ActiveBufferProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.ActiveBufferProto;

            /**
             * Verifies an ActiveBufferProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ActiveBufferProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ActiveBufferProto
             */
            public static fromObject(object: { [k: string]: any }): android.surfaceflinger.ActiveBufferProto;

            /**
             * Creates a plain object from an ActiveBufferProto message. Also converts values to other types if specified.
             * @param message ActiveBufferProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.surfaceflinger.ActiveBufferProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ActiveBufferProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ActiveBufferProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a BarrierLayerProto. */
        interface IBarrierLayerProto {

            /** BarrierLayerProto id */
            id?: (number|null);

            /** BarrierLayerProto frameNumber */
            frameNumber?: (Long|null);
        }

        /** Represents a BarrierLayerProto. */
        class BarrierLayerProto implements IBarrierLayerProto {

            /**
             * Constructs a new BarrierLayerProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.surfaceflinger.IBarrierLayerProto);

            /** BarrierLayerProto id. */
            public id: number;

            /** BarrierLayerProto frameNumber. */
            public frameNumber: Long;

            /**
             * Creates a new BarrierLayerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BarrierLayerProto instance
             */
            public static create(properties?: android.surfaceflinger.IBarrierLayerProto): android.surfaceflinger.BarrierLayerProto;

            /**
             * Encodes the specified BarrierLayerProto message. Does not implicitly {@link android.surfaceflinger.BarrierLayerProto.verify|verify} messages.
             * @param message BarrierLayerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.surfaceflinger.IBarrierLayerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BarrierLayerProto message, length delimited. Does not implicitly {@link android.surfaceflinger.BarrierLayerProto.verify|verify} messages.
             * @param message BarrierLayerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.surfaceflinger.IBarrierLayerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BarrierLayerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BarrierLayerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.BarrierLayerProto;

            /**
             * Decodes a BarrierLayerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BarrierLayerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.BarrierLayerProto;

            /**
             * Verifies a BarrierLayerProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BarrierLayerProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BarrierLayerProto
             */
            public static fromObject(object: { [k: string]: any }): android.surfaceflinger.BarrierLayerProto;

            /**
             * Creates a plain object from a BarrierLayerProto message. Also converts values to other types if specified.
             * @param message BarrierLayerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.surfaceflinger.BarrierLayerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BarrierLayerProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for BarrierLayerProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
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

        /** Properties of a DisplayProto. */
        interface IDisplayProto {

            /** DisplayProto id */
            id?: (Long|null);

            /** DisplayProto name */
            name?: (string|null);

            /** DisplayProto layerStack */
            layerStack?: (number|null);

            /** DisplayProto size */
            size?: (android.surfaceflinger.ISizeProto|null);

            /** DisplayProto layerStackSpaceRect */
            layerStackSpaceRect?: (android.surfaceflinger.IRectProto|null);

            /** DisplayProto transform */
            transform?: (android.surfaceflinger.ITransformProto|null);

            /** DisplayProto isVirtual */
            isVirtual?: (boolean|null);

            /** DisplayProto dpiX */
            dpiX?: (number|null);

            /** DisplayProto dpiY */
            dpiY?: (number|null);
        }

        /** Represents a DisplayProto. */
        class DisplayProto implements IDisplayProto {

            /**
             * Constructs a new DisplayProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: android.surfaceflinger.IDisplayProto);

            /** DisplayProto id. */
            public id: Long;

            /** DisplayProto name. */
            public name: string;

            /** DisplayProto layerStack. */
            public layerStack: number;

            /** DisplayProto size. */
            public size?: (android.surfaceflinger.ISizeProto|null);

            /** DisplayProto layerStackSpaceRect. */
            public layerStackSpaceRect?: (android.surfaceflinger.IRectProto|null);

            /** DisplayProto transform. */
            public transform?: (android.surfaceflinger.ITransformProto|null);

            /** DisplayProto isVirtual. */
            public isVirtual: boolean;

            /** DisplayProto dpiX. */
            public dpiX: number;

            /** DisplayProto dpiY. */
            public dpiY: number;

            /**
             * Creates a new DisplayProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DisplayProto instance
             */
            public static create(properties?: android.surfaceflinger.IDisplayProto): android.surfaceflinger.DisplayProto;

            /**
             * Encodes the specified DisplayProto message. Does not implicitly {@link android.surfaceflinger.DisplayProto.verify|verify} messages.
             * @param message DisplayProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: android.surfaceflinger.IDisplayProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DisplayProto message, length delimited. Does not implicitly {@link android.surfaceflinger.DisplayProto.verify|verify} messages.
             * @param message DisplayProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: android.surfaceflinger.IDisplayProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DisplayProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DisplayProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): android.surfaceflinger.DisplayProto;

            /**
             * Decodes a DisplayProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DisplayProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): android.surfaceflinger.DisplayProto;

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
            public static fromObject(object: { [k: string]: any }): android.surfaceflinger.DisplayProto;

            /**
             * Creates a plain object from a DisplayProto message. Also converts values to other types if specified.
             * @param message DisplayProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: android.surfaceflinger.DisplayProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    }
}
