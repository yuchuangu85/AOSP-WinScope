/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/light";

const $root = ($protobuf.roots.surfaceflinger_latest || ($protobuf.roots.surfaceflinger_latest = new $protobuf.Root()))
.addJSON({
  perfetto: {
    nested: {
      protos: {
        nested: {
          LayersTraceFileProto: {
            fields: {
              magicNumber: {
                type: "fixed64",
                id: 1
              },
              entry: {
                rule: "repeated",
                type: "LayersSnapshotProto",
                id: 2
              },
              realToElapsedTimeOffsetNanos: {
                type: "fixed64",
                id: 3
              }
            },
            nested: {
              MagicNumber: {
                values: {
                  INVALID: 0,
                  MAGIC_NUMBER_L: 1414682956,
                  MAGIC_NUMBER_H: 1162035538
                }
              }
            }
          },
          LayersSnapshotProto: {
            fields: {
              elapsedRealtimeNanos: {
                type: "sfixed64",
                id: 1
              },
              where: {
                type: "string",
                id: 2
              },
              layers: {
                type: "LayersProto",
                id: 3
              },
              hwcBlob: {
                type: "string",
                id: 4
              },
              excludesCompositionState: {
                type: "bool",
                id: 5
              },
              missedEntries: {
                type: "uint32",
                id: 6
              },
              displays: {
                rule: "repeated",
                type: "DisplayProto",
                id: 7
              },
              vsyncId: {
                type: "int64",
                id: 8
              }
            }
          },
          LayersProto: {
            fields: {
              layers: {
                rule: "repeated",
                type: "LayerProto",
                id: 1
              }
            }
          },
          DisplayProto: {
            fields: {
              id: {
                type: "uint64",
                id: 1
              },
              name: {
                type: "string",
                id: 2
              },
              layerStack: {
                type: "uint32",
                id: 3
              },
              size: {
                type: "SizeProto",
                id: 4
              },
              layerStackSpaceRect: {
                type: "RectProto",
                id: 5
              },
              transform: {
                type: "TransformProto",
                id: 6
              },
              isVirtual: {
                type: "bool",
                id: 7
              },
              dpiX: {
                type: "double",
                id: 8
              },
              dpiY: {
                type: "double",
                id: 9
              }
            }
          },
          HwcCompositionType: {
            values: {
              HWC_TYPE_UNSPECIFIED: 0,
              HWC_TYPE_CLIENT: 1,
              HWC_TYPE_DEVICE: 2,
              HWC_TYPE_SOLID_COLOR: 3,
              HWC_TYPE_CURSOR: 4,
              HWC_TYPE_SIDEBAND: 5,
              HWC_TYPE_DISPLAY_DECORATION: 6
            }
          },
          LayerProto: {
            fields: {
              id: {
                type: "int32",
                id: 1
              },
              name: {
                type: "string",
                id: 2
              },
              children: {
                rule: "repeated",
                type: "int32",
                id: 3
              },
              relatives: {
                rule: "repeated",
                type: "int32",
                id: 4
              },
              type: {
                type: "string",
                id: 5
              },
              transparentRegion: {
                type: "RegionProto",
                id: 6
              },
              visibleRegion: {
                type: "RegionProto",
                id: 7
              },
              damageRegion: {
                type: "RegionProto",
                id: 8
              },
              layerStack: {
                type: "uint32",
                id: 9
              },
              z: {
                type: "int32",
                id: 10
              },
              position: {
                type: "PositionProto",
                id: 11
              },
              requestedPosition: {
                type: "PositionProto",
                id: 12
              },
              size: {
                type: "SizeProto",
                id: 13
              },
              crop: {
                type: "RectProto",
                id: 14
              },
              finalCrop: {
                type: "RectProto",
                id: 15,
                options: {
                  deprecated: true
                }
              },
              isOpaque: {
                type: "bool",
                id: 16
              },
              invalidate: {
                type: "bool",
                id: 17
              },
              dataspace: {
                type: "string",
                id: 18
              },
              pixelFormat: {
                type: "string",
                id: 19
              },
              color: {
                type: "ColorProto",
                id: 20
              },
              requestedColor: {
                type: "ColorProto",
                id: 21
              },
              flags: {
                type: "uint32",
                id: 22
              },
              transform: {
                type: "TransformProto",
                id: 23
              },
              requestedTransform: {
                type: "TransformProto",
                id: 24
              },
              parent: {
                type: "int32",
                id: 25
              },
              zOrderRelativeOf: {
                type: "int32",
                id: 26
              },
              activeBuffer: {
                type: "ActiveBufferProto",
                id: 27
              },
              queuedFrames: {
                type: "int32",
                id: 28
              },
              refreshPending: {
                type: "bool",
                id: 29
              },
              hwcFrame: {
                type: "RectProto",
                id: 30
              },
              hwcCrop: {
                type: "FloatRectProto",
                id: 31
              },
              hwcTransform: {
                type: "int32",
                id: 32
              },
              windowType: {
                type: "int32",
                id: 33,
                options: {
                  deprecated: true
                }
              },
              appId: {
                type: "int32",
                id: 34,
                options: {
                  deprecated: true
                }
              },
              hwcCompositionType: {
                type: "HwcCompositionType",
                id: 35
              },
              isProtected: {
                type: "bool",
                id: 36
              },
              currFrame: {
                type: "uint64",
                id: 37
              },
              barrierLayer: {
                rule: "repeated",
                type: "BarrierLayerProto",
                id: 38
              },
              bufferTransform: {
                type: "TransformProto",
                id: 39
              },
              effectiveScalingMode: {
                type: "int32",
                id: 40
              },
              cornerRadius: {
                type: "float",
                id: 41
              },
              metadata: {
                keyType: "int32",
                type: "string",
                id: 42
              },
              effectiveTransform: {
                type: "TransformProto",
                id: 43
              },
              sourceBounds: {
                type: "FloatRectProto",
                id: 44
              },
              bounds: {
                type: "FloatRectProto",
                id: 45
              },
              screenBounds: {
                type: "FloatRectProto",
                id: 46
              },
              inputWindowInfo: {
                type: "InputWindowInfoProto",
                id: 47
              },
              cornerRadiusCrop: {
                type: "FloatRectProto",
                id: 48
              },
              shadowRadius: {
                type: "float",
                id: 49
              },
              colorTransform: {
                type: "ColorTransformProto",
                id: 50
              },
              isRelativeOf: {
                type: "bool",
                id: 51
              },
              backgroundBlurRadius: {
                type: "int32",
                id: 52
              },
              ownerUid: {
                type: "uint32",
                id: 53
              },
              blurRegions: {
                rule: "repeated",
                type: "BlurRegion",
                id: 54
              },
              isTrustedOverlay: {
                type: "bool",
                id: 55
              },
              requestedCornerRadius: {
                type: "float",
                id: 56
              },
              destinationFrame: {
                type: "RectProto",
                id: 57
              },
              originalId: {
                type: "uint32",
                id: 58
              },
              trustedOverlay: {
                type: "TrustedOverlay",
                id: 59
              }
            }
          },
          PositionProto: {
            fields: {
              x: {
                type: "float",
                id: 1
              },
              y: {
                type: "float",
                id: 2
              }
            }
          },
          FloatRectProto: {
            fields: {
              left: {
                type: "float",
                id: 1
              },
              top: {
                type: "float",
                id: 2
              },
              right: {
                type: "float",
                id: 3
              },
              bottom: {
                type: "float",
                id: 4
              }
            }
          },
          ActiveBufferProto: {
            fields: {
              width: {
                type: "uint32",
                id: 1
              },
              height: {
                type: "uint32",
                id: 2
              },
              stride: {
                type: "uint32",
                id: 3
              },
              format: {
                type: "int32",
                id: 4
              },
              usage: {
                type: "uint64",
                id: 5
              }
            }
          },
          BarrierLayerProto: {
            fields: {
              id: {
                type: "int32",
                id: 1
              },
              frameNumber: {
                type: "uint64",
                id: 2
              }
            }
          },
          RegionProto: {
            fields: {
              rect: {
                rule: "repeated",
                type: "RectProto",
                id: 2
              }
            },
            reserved: [
              [
                1,
                1
              ]
            ]
          },
          SizeProto: {
            fields: {
              w: {
                type: "int32",
                id: 1
              },
              h: {
                type: "int32",
                id: 2
              }
            }
          },
          TransformProto: {
            fields: {
              dsdx: {
                type: "float",
                id: 1
              },
              dtdx: {
                type: "float",
                id: 2
              },
              dsdy: {
                type: "float",
                id: 3
              },
              dtdy: {
                type: "float",
                id: 4
              },
              type: {
                type: "int32",
                id: 5
              }
            }
          },
          ColorProto: {
            fields: {
              r: {
                type: "float",
                id: 1
              },
              g: {
                type: "float",
                id: 2
              },
              b: {
                type: "float",
                id: 3
              },
              a: {
                type: "float",
                id: 4
              }
            }
          },
          InputWindowInfoProto: {
            fields: {
              layoutParamsFlags: {
                type: "uint32",
                id: 1
              },
              layoutParamsType: {
                type: "int32",
                id: 2
              },
              frame: {
                type: "RectProto",
                id: 3
              },
              touchableRegion: {
                type: "RegionProto",
                id: 4
              },
              surfaceInset: {
                type: "int32",
                id: 5
              },
              visible: {
                type: "bool",
                id: 6
              },
              canReceiveKeys: {
                type: "bool",
                id: 7,
                options: {
                  deprecated: true
                }
              },
              focusable: {
                type: "bool",
                id: 8
              },
              hasWallpaper: {
                type: "bool",
                id: 9
              },
              globalScaleFactor: {
                type: "float",
                id: 10
              },
              windowXScale: {
                type: "float",
                id: 11,
                options: {
                  deprecated: true
                }
              },
              windowYScale: {
                type: "float",
                id: 12,
                options: {
                  deprecated: true
                }
              },
              cropLayerId: {
                type: "int32",
                id: 13
              },
              replaceTouchableRegionWithCrop: {
                type: "bool",
                id: 14
              },
              touchableRegionCrop: {
                type: "RectProto",
                id: 15
              },
              transform: {
                type: "TransformProto",
                id: 16
              },
              inputConfig: {
                type: "uint32",
                id: 17
              }
            }
          },
          BlurRegion: {
            fields: {
              blurRadius: {
                type: "uint32",
                id: 1
              },
              cornerRadiusTl: {
                type: "uint32",
                id: 2
              },
              cornerRadiusTr: {
                type: "uint32",
                id: 3
              },
              cornerRadiusBl: {
                type: "uint32",
                id: 4
              },
              cornerRadiusBr: {
                type: "float",
                id: 5
              },
              alpha: {
                type: "float",
                id: 6
              },
              left: {
                type: "int32",
                id: 7
              },
              top: {
                type: "int32",
                id: 8
              },
              right: {
                type: "int32",
                id: 9
              },
              bottom: {
                type: "int32",
                id: 10
              }
            }
          },
          ColorTransformProto: {
            fields: {
              val: {
                rule: "repeated",
                type: "float",
                id: 1
              }
            }
          },
          TrustedOverlay: {
            values: {
              UNSET: 0,
              DISABLED: 1,
              ENABLED: 2
            }
          },
          RectProto: {
            fields: {
              left: {
                type: "int32",
                id: 1
              },
              top: {
                type: "int32",
                id: 2
              },
              right: {
                type: "int32",
                id: 3
              },
              bottom: {
                type: "int32",
                id: 4
              }
            }
          }
        }
      }
    }
  }
});

export { $root as default };
