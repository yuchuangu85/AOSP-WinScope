import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace perfetto. */
export namespace perfetto {

    /** Namespace protos. */
    namespace protos {

        /** Properties of a LayersTraceFileProto. */
        interface ILayersTraceFileProto {

            /** LayersTraceFileProto magicNumber */
            magicNumber?: (Long|null);

            /** LayersTraceFileProto entry */
            entry?: (perfetto.protos.ILayersSnapshotProto[]|null);

            /** LayersTraceFileProto realToElapsedTimeOffsetNanos */
            realToElapsedTimeOffsetNanos?: (Long|null);
        }

        /** Represents a LayersTraceFileProto. */
        class LayersTraceFileProto implements ILayersTraceFileProto {

            /**
             * Constructs a new LayersTraceFileProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.ILayersTraceFileProto);

            /** LayersTraceFileProto magicNumber. */
            public magicNumber: Long;

            /** LayersTraceFileProto entry. */
            public entry: perfetto.protos.ILayersSnapshotProto[];

            /** LayersTraceFileProto realToElapsedTimeOffsetNanos. */
            public realToElapsedTimeOffsetNanos: Long;

            /**
             * Creates a new LayersTraceFileProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LayersTraceFileProto instance
             */
            public static create(properties?: perfetto.protos.ILayersTraceFileProto): perfetto.protos.LayersTraceFileProto;

            /**
             * Encodes the specified LayersTraceFileProto message. Does not implicitly {@link perfetto.protos.LayersTraceFileProto.verify|verify} messages.
             * @param message LayersTraceFileProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.ILayersTraceFileProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LayersTraceFileProto message, length delimited. Does not implicitly {@link perfetto.protos.LayersTraceFileProto.verify|verify} messages.
             * @param message LayersTraceFileProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.ILayersTraceFileProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LayersTraceFileProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LayersTraceFileProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.LayersTraceFileProto;

            /**
             * Decodes a LayersTraceFileProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LayersTraceFileProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.LayersTraceFileProto;

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
            public static fromObject(object: { [k: string]: any }): perfetto.protos.LayersTraceFileProto;

            /**
             * Creates a plain object from a LayersTraceFileProto message. Also converts values to other types if specified.
             * @param message LayersTraceFileProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.LayersTraceFileProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

        /** Properties of a LayersSnapshotProto. */
        interface ILayersSnapshotProto {

            /** LayersSnapshotProto elapsedRealtimeNanos */
            elapsedRealtimeNanos?: (Long|null);

            /** LayersSnapshotProto where */
            where?: (string|null);

            /** LayersSnapshotProto layers */
            layers?: (perfetto.protos.ILayersProto|null);

            /** LayersSnapshotProto hwcBlob */
            hwcBlob?: (string|null);

            /** LayersSnapshotProto excludesCompositionState */
            excludesCompositionState?: (boolean|null);

            /** LayersSnapshotProto missedEntries */
            missedEntries?: (number|null);

            /** LayersSnapshotProto displays */
            displays?: (perfetto.protos.IDisplayProto[]|null);

            /** LayersSnapshotProto vsyncId */
            vsyncId?: (Long|null);
        }

        /** Represents a LayersSnapshotProto. */
        class LayersSnapshotProto implements ILayersSnapshotProto {

            /**
             * Constructs a new LayersSnapshotProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.ILayersSnapshotProto);

            /** LayersSnapshotProto elapsedRealtimeNanos. */
            public elapsedRealtimeNanos: Long;

            /** LayersSnapshotProto where. */
            public where: string;

            /** LayersSnapshotProto layers. */
            public layers?: (perfetto.protos.ILayersProto|null);

            /** LayersSnapshotProto hwcBlob. */
            public hwcBlob: string;

            /** LayersSnapshotProto excludesCompositionState. */
            public excludesCompositionState: boolean;

            /** LayersSnapshotProto missedEntries. */
            public missedEntries: number;

            /** LayersSnapshotProto displays. */
            public displays: perfetto.protos.IDisplayProto[];

            /** LayersSnapshotProto vsyncId. */
            public vsyncId: Long;

            /**
             * Creates a new LayersSnapshotProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LayersSnapshotProto instance
             */
            public static create(properties?: perfetto.protos.ILayersSnapshotProto): perfetto.protos.LayersSnapshotProto;

            /**
             * Encodes the specified LayersSnapshotProto message. Does not implicitly {@link perfetto.protos.LayersSnapshotProto.verify|verify} messages.
             * @param message LayersSnapshotProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.ILayersSnapshotProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LayersSnapshotProto message, length delimited. Does not implicitly {@link perfetto.protos.LayersSnapshotProto.verify|verify} messages.
             * @param message LayersSnapshotProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.ILayersSnapshotProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LayersSnapshotProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LayersSnapshotProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.LayersSnapshotProto;

            /**
             * Decodes a LayersSnapshotProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LayersSnapshotProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.LayersSnapshotProto;

            /**
             * Verifies a LayersSnapshotProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a LayersSnapshotProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LayersSnapshotProto
             */
            public static fromObject(object: { [k: string]: any }): perfetto.protos.LayersSnapshotProto;

            /**
             * Creates a plain object from a LayersSnapshotProto message. Also converts values to other types if specified.
             * @param message LayersSnapshotProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.LayersSnapshotProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this LayersSnapshotProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for LayersSnapshotProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a LayersProto. */
        interface ILayersProto {

            /** LayersProto layers */
            layers?: (perfetto.protos.ILayerProto[]|null);
        }

        /** Represents a LayersProto. */
        class LayersProto implements ILayersProto {

            /**
             * Constructs a new LayersProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.ILayersProto);

            /** LayersProto layers. */
            public layers: perfetto.protos.ILayerProto[];

            /**
             * Creates a new LayersProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LayersProto instance
             */
            public static create(properties?: perfetto.protos.ILayersProto): perfetto.protos.LayersProto;

            /**
             * Encodes the specified LayersProto message. Does not implicitly {@link perfetto.protos.LayersProto.verify|verify} messages.
             * @param message LayersProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.ILayersProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LayersProto message, length delimited. Does not implicitly {@link perfetto.protos.LayersProto.verify|verify} messages.
             * @param message LayersProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.ILayersProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LayersProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LayersProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.LayersProto;

            /**
             * Decodes a LayersProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LayersProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.LayersProto;

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
            public static fromObject(object: { [k: string]: any }): perfetto.protos.LayersProto;

            /**
             * Creates a plain object from a LayersProto message. Also converts values to other types if specified.
             * @param message LayersProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.LayersProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

        /** Properties of a DisplayProto. */
        interface IDisplayProto {

            /** DisplayProto id */
            id?: (Long|null);

            /** DisplayProto name */
            name?: (string|null);

            /** DisplayProto layerStack */
            layerStack?: (number|null);

            /** DisplayProto size */
            size?: (perfetto.protos.ISizeProto|null);

            /** DisplayProto layerStackSpaceRect */
            layerStackSpaceRect?: (perfetto.protos.IRectProto|null);

            /** DisplayProto transform */
            transform?: (perfetto.protos.ITransformProto|null);

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
            constructor(properties?: perfetto.protos.IDisplayProto);

            /** DisplayProto id. */
            public id: Long;

            /** DisplayProto name. */
            public name: string;

            /** DisplayProto layerStack. */
            public layerStack: number;

            /** DisplayProto size. */
            public size?: (perfetto.protos.ISizeProto|null);

            /** DisplayProto layerStackSpaceRect. */
            public layerStackSpaceRect?: (perfetto.protos.IRectProto|null);

            /** DisplayProto transform. */
            public transform?: (perfetto.protos.ITransformProto|null);

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
            public static create(properties?: perfetto.protos.IDisplayProto): perfetto.protos.DisplayProto;

            /**
             * Encodes the specified DisplayProto message. Does not implicitly {@link perfetto.protos.DisplayProto.verify|verify} messages.
             * @param message DisplayProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IDisplayProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DisplayProto message, length delimited. Does not implicitly {@link perfetto.protos.DisplayProto.verify|verify} messages.
             * @param message DisplayProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IDisplayProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DisplayProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DisplayProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.DisplayProto;

            /**
             * Decodes a DisplayProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DisplayProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.DisplayProto;

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
            public static fromObject(object: { [k: string]: any }): perfetto.protos.DisplayProto;

            /**
             * Creates a plain object from a DisplayProto message. Also converts values to other types if specified.
             * @param message DisplayProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.DisplayProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

        /** HwcCompositionType enum. */
        enum HwcCompositionType {
            HWC_TYPE_UNSPECIFIED = 0,
            HWC_TYPE_CLIENT = 1,
            HWC_TYPE_DEVICE = 2,
            HWC_TYPE_SOLID_COLOR = 3,
            HWC_TYPE_CURSOR = 4,
            HWC_TYPE_SIDEBAND = 5,
            HWC_TYPE_DISPLAY_DECORATION = 6
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
            transparentRegion?: (perfetto.protos.IRegionProto|null);

            /** LayerProto visibleRegion */
            visibleRegion?: (perfetto.protos.IRegionProto|null);

            /** LayerProto damageRegion */
            damageRegion?: (perfetto.protos.IRegionProto|null);

            /** LayerProto layerStack */
            layerStack?: (number|null);

            /** LayerProto z */
            z?: (number|null);

            /** LayerProto position */
            position?: (perfetto.protos.IPositionProto|null);

            /** LayerProto requestedPosition */
            requestedPosition?: (perfetto.protos.IPositionProto|null);

            /** LayerProto size */
            size?: (perfetto.protos.ISizeProto|null);

            /** LayerProto crop */
            crop?: (perfetto.protos.IRectProto|null);

            /** LayerProto finalCrop */
            finalCrop?: (perfetto.protos.IRectProto|null);

            /** LayerProto isOpaque */
            isOpaque?: (boolean|null);

            /** LayerProto invalidate */
            invalidate?: (boolean|null);

            /** LayerProto dataspace */
            dataspace?: (string|null);

            /** LayerProto pixelFormat */
            pixelFormat?: (string|null);

            /** LayerProto color */
            color?: (perfetto.protos.IColorProto|null);

            /** LayerProto requestedColor */
            requestedColor?: (perfetto.protos.IColorProto|null);

            /** LayerProto flags */
            flags?: (number|null);

            /** LayerProto transform */
            transform?: (perfetto.protos.ITransformProto|null);

            /** LayerProto requestedTransform */
            requestedTransform?: (perfetto.protos.ITransformProto|null);

            /** LayerProto parent */
            parent?: (number|null);

            /** LayerProto zOrderRelativeOf */
            zOrderRelativeOf?: (number|null);

            /** LayerProto activeBuffer */
            activeBuffer?: (perfetto.protos.IActiveBufferProto|null);

            /** LayerProto queuedFrames */
            queuedFrames?: (number|null);

            /** LayerProto refreshPending */
            refreshPending?: (boolean|null);

            /** LayerProto hwcFrame */
            hwcFrame?: (perfetto.protos.IRectProto|null);

            /** LayerProto hwcCrop */
            hwcCrop?: (perfetto.protos.IFloatRectProto|null);

            /** LayerProto hwcTransform */
            hwcTransform?: (number|null);

            /** LayerProto windowType */
            windowType?: (number|null);

            /** LayerProto appId */
            appId?: (number|null);

            /** LayerProto hwcCompositionType */
            hwcCompositionType?: (perfetto.protos.HwcCompositionType|null);

            /** LayerProto isProtected */
            isProtected?: (boolean|null);

            /** LayerProto currFrame */
            currFrame?: (Long|null);

            /** LayerProto barrierLayer */
            barrierLayer?: (perfetto.protos.IBarrierLayerProto[]|null);

            /** LayerProto bufferTransform */
            bufferTransform?: (perfetto.protos.ITransformProto|null);

            /** LayerProto effectiveScalingMode */
            effectiveScalingMode?: (number|null);

            /** LayerProto cornerRadius */
            cornerRadius?: (number|null);

            /** LayerProto metadata */
            metadata?: ({ [k: string]: string }|null);

            /** LayerProto effectiveTransform */
            effectiveTransform?: (perfetto.protos.ITransformProto|null);

            /** LayerProto sourceBounds */
            sourceBounds?: (perfetto.protos.IFloatRectProto|null);

            /** LayerProto bounds */
            bounds?: (perfetto.protos.IFloatRectProto|null);

            /** LayerProto screenBounds */
            screenBounds?: (perfetto.protos.IFloatRectProto|null);

            /** LayerProto inputWindowInfo */
            inputWindowInfo?: (perfetto.protos.IInputWindowInfoProto|null);

            /** LayerProto cornerRadiusCrop */
            cornerRadiusCrop?: (perfetto.protos.IFloatRectProto|null);

            /** LayerProto shadowRadius */
            shadowRadius?: (number|null);

            /** LayerProto colorTransform */
            colorTransform?: (perfetto.protos.IColorTransformProto|null);

            /** LayerProto isRelativeOf */
            isRelativeOf?: (boolean|null);

            /** LayerProto backgroundBlurRadius */
            backgroundBlurRadius?: (number|null);

            /** LayerProto ownerUid */
            ownerUid?: (number|null);

            /** LayerProto blurRegions */
            blurRegions?: (perfetto.protos.IBlurRegion[]|null);

            /** LayerProto isTrustedOverlay */
            isTrustedOverlay?: (boolean|null);

            /** LayerProto requestedCornerRadius */
            requestedCornerRadius?: (number|null);

            /** LayerProto destinationFrame */
            destinationFrame?: (perfetto.protos.IRectProto|null);

            /** LayerProto originalId */
            originalId?: (number|null);

            /** LayerProto trustedOverlay */
            trustedOverlay?: (perfetto.protos.TrustedOverlay|null);
        }

        /** Represents a LayerProto. */
        class LayerProto implements ILayerProto {

            /**
             * Constructs a new LayerProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.ILayerProto);

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
            public transparentRegion?: (perfetto.protos.IRegionProto|null);

            /** LayerProto visibleRegion. */
            public visibleRegion?: (perfetto.protos.IRegionProto|null);

            /** LayerProto damageRegion. */
            public damageRegion?: (perfetto.protos.IRegionProto|null);

            /** LayerProto layerStack. */
            public layerStack: number;

            /** LayerProto z. */
            public z: number;

            /** LayerProto position. */
            public position?: (perfetto.protos.IPositionProto|null);

            /** LayerProto requestedPosition. */
            public requestedPosition?: (perfetto.protos.IPositionProto|null);

            /** LayerProto size. */
            public size?: (perfetto.protos.ISizeProto|null);

            /** LayerProto crop. */
            public crop?: (perfetto.protos.IRectProto|null);

            /** LayerProto finalCrop. */
            public finalCrop?: (perfetto.protos.IRectProto|null);

            /** LayerProto isOpaque. */
            public isOpaque: boolean;

            /** LayerProto invalidate. */
            public invalidate: boolean;

            /** LayerProto dataspace. */
            public dataspace: string;

            /** LayerProto pixelFormat. */
            public pixelFormat: string;

            /** LayerProto color. */
            public color?: (perfetto.protos.IColorProto|null);

            /** LayerProto requestedColor. */
            public requestedColor?: (perfetto.protos.IColorProto|null);

            /** LayerProto flags. */
            public flags: number;

            /** LayerProto transform. */
            public transform?: (perfetto.protos.ITransformProto|null);

            /** LayerProto requestedTransform. */
            public requestedTransform?: (perfetto.protos.ITransformProto|null);

            /** LayerProto parent. */
            public parent: number;

            /** LayerProto zOrderRelativeOf. */
            public zOrderRelativeOf: number;

            /** LayerProto activeBuffer. */
            public activeBuffer?: (perfetto.protos.IActiveBufferProto|null);

            /** LayerProto queuedFrames. */
            public queuedFrames: number;

            /** LayerProto refreshPending. */
            public refreshPending: boolean;

            /** LayerProto hwcFrame. */
            public hwcFrame?: (perfetto.protos.IRectProto|null);

            /** LayerProto hwcCrop. */
            public hwcCrop?: (perfetto.protos.IFloatRectProto|null);

            /** LayerProto hwcTransform. */
            public hwcTransform: number;

            /** LayerProto windowType. */
            public windowType: number;

            /** LayerProto appId. */
            public appId: number;

            /** LayerProto hwcCompositionType. */
            public hwcCompositionType: perfetto.protos.HwcCompositionType;

            /** LayerProto isProtected. */
            public isProtected: boolean;

            /** LayerProto currFrame. */
            public currFrame: Long;

            /** LayerProto barrierLayer. */
            public barrierLayer: perfetto.protos.IBarrierLayerProto[];

            /** LayerProto bufferTransform. */
            public bufferTransform?: (perfetto.protos.ITransformProto|null);

            /** LayerProto effectiveScalingMode. */
            public effectiveScalingMode: number;

            /** LayerProto cornerRadius. */
            public cornerRadius: number;

            /** LayerProto metadata. */
            public metadata: { [k: string]: string };

            /** LayerProto effectiveTransform. */
            public effectiveTransform?: (perfetto.protos.ITransformProto|null);

            /** LayerProto sourceBounds. */
            public sourceBounds?: (perfetto.protos.IFloatRectProto|null);

            /** LayerProto bounds. */
            public bounds?: (perfetto.protos.IFloatRectProto|null);

            /** LayerProto screenBounds. */
            public screenBounds?: (perfetto.protos.IFloatRectProto|null);

            /** LayerProto inputWindowInfo. */
            public inputWindowInfo?: (perfetto.protos.IInputWindowInfoProto|null);

            /** LayerProto cornerRadiusCrop. */
            public cornerRadiusCrop?: (perfetto.protos.IFloatRectProto|null);

            /** LayerProto shadowRadius. */
            public shadowRadius: number;

            /** LayerProto colorTransform. */
            public colorTransform?: (perfetto.protos.IColorTransformProto|null);

            /** LayerProto isRelativeOf. */
            public isRelativeOf: boolean;

            /** LayerProto backgroundBlurRadius. */
            public backgroundBlurRadius: number;

            /** LayerProto ownerUid. */
            public ownerUid: number;

            /** LayerProto blurRegions. */
            public blurRegions: perfetto.protos.IBlurRegion[];

            /** LayerProto isTrustedOverlay. */
            public isTrustedOverlay: boolean;

            /** LayerProto requestedCornerRadius. */
            public requestedCornerRadius: number;

            /** LayerProto destinationFrame. */
            public destinationFrame?: (perfetto.protos.IRectProto|null);

            /** LayerProto originalId. */
            public originalId: number;

            /** LayerProto trustedOverlay. */
            public trustedOverlay: perfetto.protos.TrustedOverlay;

            /**
             * Creates a new LayerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LayerProto instance
             */
            public static create(properties?: perfetto.protos.ILayerProto): perfetto.protos.LayerProto;

            /**
             * Encodes the specified LayerProto message. Does not implicitly {@link perfetto.protos.LayerProto.verify|verify} messages.
             * @param message LayerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.ILayerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LayerProto message, length delimited. Does not implicitly {@link perfetto.protos.LayerProto.verify|verify} messages.
             * @param message LayerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.ILayerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LayerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LayerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.LayerProto;

            /**
             * Decodes a LayerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LayerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.LayerProto;

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
            public static fromObject(object: { [k: string]: any }): perfetto.protos.LayerProto;

            /**
             * Creates a plain object from a LayerProto message. Also converts values to other types if specified.
             * @param message LayerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.LayerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: perfetto.protos.IPositionProto);

            /** PositionProto x. */
            public x: number;

            /** PositionProto y. */
            public y: number;

            /**
             * Creates a new PositionProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PositionProto instance
             */
            public static create(properties?: perfetto.protos.IPositionProto): perfetto.protos.PositionProto;

            /**
             * Encodes the specified PositionProto message. Does not implicitly {@link perfetto.protos.PositionProto.verify|verify} messages.
             * @param message PositionProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IPositionProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PositionProto message, length delimited. Does not implicitly {@link perfetto.protos.PositionProto.verify|verify} messages.
             * @param message PositionProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IPositionProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PositionProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PositionProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.PositionProto;

            /**
             * Decodes a PositionProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PositionProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.PositionProto;

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
            public static fromObject(object: { [k: string]: any }): perfetto.protos.PositionProto;

            /**
             * Creates a plain object from a PositionProto message. Also converts values to other types if specified.
             * @param message PositionProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.PositionProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: perfetto.protos.IFloatRectProto);

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
            public static create(properties?: perfetto.protos.IFloatRectProto): perfetto.protos.FloatRectProto;

            /**
             * Encodes the specified FloatRectProto message. Does not implicitly {@link perfetto.protos.FloatRectProto.verify|verify} messages.
             * @param message FloatRectProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IFloatRectProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FloatRectProto message, length delimited. Does not implicitly {@link perfetto.protos.FloatRectProto.verify|verify} messages.
             * @param message FloatRectProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IFloatRectProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FloatRectProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FloatRectProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.FloatRectProto;

            /**
             * Decodes a FloatRectProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FloatRectProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.FloatRectProto;

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
            public static fromObject(object: { [k: string]: any }): perfetto.protos.FloatRectProto;

            /**
             * Creates a plain object from a FloatRectProto message. Also converts values to other types if specified.
             * @param message FloatRectProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.FloatRectProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: perfetto.protos.IActiveBufferProto);

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
            public static create(properties?: perfetto.protos.IActiveBufferProto): perfetto.protos.ActiveBufferProto;

            /**
             * Encodes the specified ActiveBufferProto message. Does not implicitly {@link perfetto.protos.ActiveBufferProto.verify|verify} messages.
             * @param message ActiveBufferProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IActiveBufferProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ActiveBufferProto message, length delimited. Does not implicitly {@link perfetto.protos.ActiveBufferProto.verify|verify} messages.
             * @param message ActiveBufferProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IActiveBufferProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ActiveBufferProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ActiveBufferProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ActiveBufferProto;

            /**
             * Decodes an ActiveBufferProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ActiveBufferProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ActiveBufferProto;

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
            public static fromObject(object: { [k: string]: any }): perfetto.protos.ActiveBufferProto;

            /**
             * Creates a plain object from an ActiveBufferProto message. Also converts values to other types if specified.
             * @param message ActiveBufferProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.ActiveBufferProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: perfetto.protos.IBarrierLayerProto);

            /** BarrierLayerProto id. */
            public id: number;

            /** BarrierLayerProto frameNumber. */
            public frameNumber: Long;

            /**
             * Creates a new BarrierLayerProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BarrierLayerProto instance
             */
            public static create(properties?: perfetto.protos.IBarrierLayerProto): perfetto.protos.BarrierLayerProto;

            /**
             * Encodes the specified BarrierLayerProto message. Does not implicitly {@link perfetto.protos.BarrierLayerProto.verify|verify} messages.
             * @param message BarrierLayerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IBarrierLayerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BarrierLayerProto message, length delimited. Does not implicitly {@link perfetto.protos.BarrierLayerProto.verify|verify} messages.
             * @param message BarrierLayerProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IBarrierLayerProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BarrierLayerProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BarrierLayerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.BarrierLayerProto;

            /**
             * Decodes a BarrierLayerProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BarrierLayerProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.BarrierLayerProto;

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
            public static fromObject(object: { [k: string]: any }): perfetto.protos.BarrierLayerProto;

            /**
             * Creates a plain object from a BarrierLayerProto message. Also converts values to other types if specified.
             * @param message BarrierLayerProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.BarrierLayerProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            rect?: (perfetto.protos.IRectProto[]|null);
        }

        /** Represents a RegionProto. */
        class RegionProto implements IRegionProto {

            /**
             * Constructs a new RegionProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IRegionProto);

            /** RegionProto rect. */
            public rect: perfetto.protos.IRectProto[];

            /**
             * Creates a new RegionProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RegionProto instance
             */
            public static create(properties?: perfetto.protos.IRegionProto): perfetto.protos.RegionProto;

            /**
             * Encodes the specified RegionProto message. Does not implicitly {@link perfetto.protos.RegionProto.verify|verify} messages.
             * @param message RegionProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IRegionProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RegionProto message, length delimited. Does not implicitly {@link perfetto.protos.RegionProto.verify|verify} messages.
             * @param message RegionProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IRegionProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RegionProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RegionProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.RegionProto;

            /**
             * Decodes a RegionProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RegionProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.RegionProto;

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
            public static fromObject(object: { [k: string]: any }): perfetto.protos.RegionProto;

            /**
             * Creates a plain object from a RegionProto message. Also converts values to other types if specified.
             * @param message RegionProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.RegionProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: perfetto.protos.ISizeProto);

            /** SizeProto w. */
            public w: number;

            /** SizeProto h. */
            public h: number;

            /**
             * Creates a new SizeProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SizeProto instance
             */
            public static create(properties?: perfetto.protos.ISizeProto): perfetto.protos.SizeProto;

            /**
             * Encodes the specified SizeProto message. Does not implicitly {@link perfetto.protos.SizeProto.verify|verify} messages.
             * @param message SizeProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.ISizeProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SizeProto message, length delimited. Does not implicitly {@link perfetto.protos.SizeProto.verify|verify} messages.
             * @param message SizeProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.ISizeProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SizeProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SizeProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.SizeProto;

            /**
             * Decodes a SizeProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SizeProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.SizeProto;

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
            public static fromObject(object: { [k: string]: any }): perfetto.protos.SizeProto;

            /**
             * Creates a plain object from a SizeProto message. Also converts values to other types if specified.
             * @param message SizeProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.SizeProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: perfetto.protos.ITransformProto);

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
            public static create(properties?: perfetto.protos.ITransformProto): perfetto.protos.TransformProto;

            /**
             * Encodes the specified TransformProto message. Does not implicitly {@link perfetto.protos.TransformProto.verify|verify} messages.
             * @param message TransformProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.ITransformProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified TransformProto message, length delimited. Does not implicitly {@link perfetto.protos.TransformProto.verify|verify} messages.
             * @param message TransformProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.ITransformProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a TransformProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns TransformProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.TransformProto;

            /**
             * Decodes a TransformProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns TransformProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.TransformProto;

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
            public static fromObject(object: { [k: string]: any }): perfetto.protos.TransformProto;

            /**
             * Creates a plain object from a TransformProto message. Also converts values to other types if specified.
             * @param message TransformProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.TransformProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: perfetto.protos.IColorProto);

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
            public static create(properties?: perfetto.protos.IColorProto): perfetto.protos.ColorProto;

            /**
             * Encodes the specified ColorProto message. Does not implicitly {@link perfetto.protos.ColorProto.verify|verify} messages.
             * @param message ColorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IColorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ColorProto message, length delimited. Does not implicitly {@link perfetto.protos.ColorProto.verify|verify} messages.
             * @param message ColorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IColorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ColorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ColorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ColorProto;

            /**
             * Decodes a ColorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ColorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ColorProto;

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
            public static fromObject(object: { [k: string]: any }): perfetto.protos.ColorProto;

            /**
             * Creates a plain object from a ColorProto message. Also converts values to other types if specified.
             * @param message ColorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.ColorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            frame?: (perfetto.protos.IRectProto|null);

            /** InputWindowInfoProto touchableRegion */
            touchableRegion?: (perfetto.protos.IRegionProto|null);

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
            touchableRegionCrop?: (perfetto.protos.IRectProto|null);

            /** InputWindowInfoProto transform */
            transform?: (perfetto.protos.ITransformProto|null);

            /** InputWindowInfoProto inputConfig */
            inputConfig?: (number|null);
        }

        /** Represents an InputWindowInfoProto. */
        class InputWindowInfoProto implements IInputWindowInfoProto {

            /**
             * Constructs a new InputWindowInfoProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: perfetto.protos.IInputWindowInfoProto);

            /** InputWindowInfoProto layoutParamsFlags. */
            public layoutParamsFlags: number;

            /** InputWindowInfoProto layoutParamsType. */
            public layoutParamsType: number;

            /** InputWindowInfoProto frame. */
            public frame?: (perfetto.protos.IRectProto|null);

            /** InputWindowInfoProto touchableRegion. */
            public touchableRegion?: (perfetto.protos.IRegionProto|null);

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
            public touchableRegionCrop?: (perfetto.protos.IRectProto|null);

            /** InputWindowInfoProto transform. */
            public transform?: (perfetto.protos.ITransformProto|null);

            /** InputWindowInfoProto inputConfig. */
            public inputConfig: number;

            /**
             * Creates a new InputWindowInfoProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InputWindowInfoProto instance
             */
            public static create(properties?: perfetto.protos.IInputWindowInfoProto): perfetto.protos.InputWindowInfoProto;

            /**
             * Encodes the specified InputWindowInfoProto message. Does not implicitly {@link perfetto.protos.InputWindowInfoProto.verify|verify} messages.
             * @param message InputWindowInfoProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IInputWindowInfoProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InputWindowInfoProto message, length delimited. Does not implicitly {@link perfetto.protos.InputWindowInfoProto.verify|verify} messages.
             * @param message InputWindowInfoProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IInputWindowInfoProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InputWindowInfoProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InputWindowInfoProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.InputWindowInfoProto;

            /**
             * Decodes an InputWindowInfoProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InputWindowInfoProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.InputWindowInfoProto;

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
            public static fromObject(object: { [k: string]: any }): perfetto.protos.InputWindowInfoProto;

            /**
             * Creates a plain object from an InputWindowInfoProto message. Also converts values to other types if specified.
             * @param message InputWindowInfoProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.InputWindowInfoProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: perfetto.protos.IBlurRegion);

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
            public static create(properties?: perfetto.protos.IBlurRegion): perfetto.protos.BlurRegion;

            /**
             * Encodes the specified BlurRegion message. Does not implicitly {@link perfetto.protos.BlurRegion.verify|verify} messages.
             * @param message BlurRegion message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IBlurRegion, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BlurRegion message, length delimited. Does not implicitly {@link perfetto.protos.BlurRegion.verify|verify} messages.
             * @param message BlurRegion message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IBlurRegion, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BlurRegion message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BlurRegion
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.BlurRegion;

            /**
             * Decodes a BlurRegion message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BlurRegion
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.BlurRegion;

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
            public static fromObject(object: { [k: string]: any }): perfetto.protos.BlurRegion;

            /**
             * Creates a plain object from a BlurRegion message. Also converts values to other types if specified.
             * @param message BlurRegion
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.BlurRegion, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: perfetto.protos.IColorTransformProto);

            /** ColorTransformProto val. */
            public val: number[];

            /**
             * Creates a new ColorTransformProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ColorTransformProto instance
             */
            public static create(properties?: perfetto.protos.IColorTransformProto): perfetto.protos.ColorTransformProto;

            /**
             * Encodes the specified ColorTransformProto message. Does not implicitly {@link perfetto.protos.ColorTransformProto.verify|verify} messages.
             * @param message ColorTransformProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: perfetto.protos.IColorTransformProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ColorTransformProto message, length delimited. Does not implicitly {@link perfetto.protos.ColorTransformProto.verify|verify} messages.
             * @param message ColorTransformProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: perfetto.protos.IColorTransformProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ColorTransformProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ColorTransformProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): perfetto.protos.ColorTransformProto;

            /**
             * Decodes a ColorTransformProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ColorTransformProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): perfetto.protos.ColorTransformProto;

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
            public static fromObject(object: { [k: string]: any }): perfetto.protos.ColorTransformProto;

            /**
             * Creates a plain object from a ColorTransformProto message. Also converts values to other types if specified.
             * @param message ColorTransformProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: perfetto.protos.ColorTransformProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

        /** TrustedOverlay enum. */
        enum TrustedOverlay {
            UNSET = 0,
            DISABLED = 1,
            ENABLED = 2
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
    }
}
