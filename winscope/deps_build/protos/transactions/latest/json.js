/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/light";

const $root = ($protobuf.roots.transactions_latest || ($protobuf.roots.transactions_latest = new $protobuf.Root()))
.addJSON({
  perfetto: {
    nested: {
      protos: {
        nested: {
          TransactionTraceFile: {
            fields: {
              magicNumber: {
                type: "fixed64",
                id: 1
              },
              entry: {
                rule: "repeated",
                type: "TransactionTraceEntry",
                id: 2
              },
              realToElapsedTimeOffsetNanos: {
                type: "fixed64",
                id: 3
              },
              version: {
                type: "uint32",
                id: 4
              }
            },
            nested: {
              MagicNumber: {
                values: {
                  INVALID: 0,
                  MAGIC_NUMBER_L: 1415073364,
                  MAGIC_NUMBER_H: 1162035538
                }
              }
            }
          },
          TransactionTraceEntry: {
            fields: {
              elapsedRealtimeNanos: {
                type: "int64",
                id: 1
              },
              vsyncId: {
                type: "int64",
                id: 2
              },
              transactions: {
                rule: "repeated",
                type: "TransactionState",
                id: 3
              },
              addedLayers: {
                rule: "repeated",
                type: "LayerCreationArgs",
                id: 4
              },
              destroyedLayers: {
                rule: "repeated",
                type: "uint32",
                id: 5,
                options: {
                  packed: false
                }
              },
              addedDisplays: {
                rule: "repeated",
                type: "DisplayState",
                id: 6
              },
              removedDisplays: {
                rule: "repeated",
                type: "int32",
                id: 7,
                options: {
                  packed: false
                }
              },
              destroyedLayerHandles: {
                rule: "repeated",
                type: "uint32",
                id: 8,
                options: {
                  packed: false
                }
              },
              displaysChanged: {
                type: "bool",
                id: 9
              },
              displays: {
                rule: "repeated",
                type: "DisplayInfo",
                id: 10
              }
            }
          },
          DisplayInfo: {
            fields: {
              layerStack: {
                type: "uint32",
                id: 1
              },
              displayId: {
                type: "int32",
                id: 2
              },
              logicalWidth: {
                type: "int32",
                id: 3
              },
              logicalHeight: {
                type: "int32",
                id: 4
              },
              transformInverse: {
                type: "Transform",
                id: 5
              },
              transform: {
                type: "Transform",
                id: 6
              },
              receivesInput: {
                type: "bool",
                id: 7
              },
              isSecure: {
                type: "bool",
                id: 8
              },
              isPrimary: {
                type: "bool",
                id: 9
              },
              isVirtual: {
                type: "bool",
                id: 10
              },
              rotationFlags: {
                type: "int32",
                id: 11
              },
              transformHint: {
                type: "int32",
                id: 12
              }
            }
          },
          LayerCreationArgs: {
            fields: {
              layerId: {
                type: "uint32",
                id: 1
              },
              name: {
                type: "string",
                id: 2
              },
              flags: {
                type: "uint32",
                id: 3
              },
              parentId: {
                type: "uint32",
                id: 4
              },
              mirrorFromId: {
                type: "uint32",
                id: 5
              },
              addToRoot: {
                type: "bool",
                id: 6
              },
              layerStackToMirror: {
                type: "uint32",
                id: 7
              }
            }
          },
          Transform: {
            fields: {
              dsdx: {
                type: "float",
                id: 1
              },
              dtdx: {
                type: "float",
                id: 2
              },
              dtdy: {
                type: "float",
                id: 3
              },
              dsdy: {
                type: "float",
                id: 4
              },
              tx: {
                type: "float",
                id: 5
              },
              ty: {
                type: "float",
                id: 6
              }
            }
          },
          TransactionState: {
            fields: {
              pid: {
                type: "int32",
                id: 1
              },
              uid: {
                type: "int32",
                id: 2
              },
              vsyncId: {
                type: "int64",
                id: 3
              },
              inputEventId: {
                type: "int32",
                id: 4
              },
              postTime: {
                type: "int64",
                id: 5
              },
              transactionId: {
                type: "uint64",
                id: 6
              },
              layerChanges: {
                rule: "repeated",
                type: "LayerState",
                id: 7
              },
              displayChanges: {
                rule: "repeated",
                type: "DisplayState",
                id: 8
              },
              mergedTransactionIds: {
                rule: "repeated",
                type: "uint64",
                id: 9,
                options: {
                  packed: false
                }
              }
            }
          },
          LayerState: {
            fields: {
              layerId: {
                type: "uint32",
                id: 1
              },
              what: {
                type: "uint64",
                id: 2
              },
              x: {
                type: "float",
                id: 3
              },
              y: {
                type: "float",
                id: 4
              },
              z: {
                type: "int32",
                id: 5
              },
              w: {
                type: "uint32",
                id: 6
              },
              h: {
                type: "uint32",
                id: 7
              },
              layerStack: {
                type: "uint32",
                id: 8
              },
              flags: {
                type: "uint32",
                id: 9
              },
              mask: {
                type: "uint32",
                id: 10
              },
              matrix: {
                type: "Matrix22",
                id: 11
              },
              cornerRadius: {
                type: "float",
                id: 12
              },
              backgroundBlurRadius: {
                type: "uint32",
                id: 13
              },
              parentId: {
                type: "uint32",
                id: 14
              },
              relativeParentId: {
                type: "uint32",
                id: 15
              },
              alpha: {
                type: "float",
                id: 16
              },
              color: {
                type: "Color3",
                id: 17
              },
              transparentRegion: {
                type: "RegionProto",
                id: 18
              },
              transform: {
                type: "uint32",
                id: 19
              },
              transformToDisplayInverse: {
                type: "bool",
                id: 20
              },
              crop: {
                type: "RectProto",
                id: 21
              },
              bufferData: {
                type: "BufferData",
                id: 22
              },
              api: {
                type: "int32",
                id: 23
              },
              hasSidebandStream: {
                type: "bool",
                id: 24
              },
              colorTransform: {
                type: "ColorTransformProto",
                id: 25
              },
              blurRegions: {
                rule: "repeated",
                type: "BlurRegion",
                id: 26
              },
              windowInfoHandle: {
                type: "WindowInfo",
                id: 27
              },
              bgColorAlpha: {
                type: "float",
                id: 28
              },
              bgColorDataspace: {
                type: "int32",
                id: 29
              },
              colorSpaceAgnostic: {
                type: "bool",
                id: 30
              },
              shadowRadius: {
                type: "float",
                id: 31
              },
              frameRateSelectionPriority: {
                type: "int32",
                id: 32
              },
              frameRate: {
                type: "float",
                id: 33
              },
              frameRateCompatibility: {
                type: "int32",
                id: 34
              },
              changeFrameRateStrategy: {
                type: "int32",
                id: 35
              },
              fixedTransformHint: {
                type: "uint32",
                id: 36
              },
              frameNumber: {
                type: "uint64",
                id: 37
              },
              autoRefresh: {
                type: "bool",
                id: 38
              },
              isTrustedOverlay: {
                type: "bool",
                id: 39
              },
              bufferCrop: {
                type: "RectProto",
                id: 40
              },
              destinationFrame: {
                type: "RectProto",
                id: 41
              },
              dropInputMode: {
                type: "DropInputMode",
                id: 42
              },
              trustedOverlay: {
                type: "TrustedOverlay",
                id: 43
              }
            },
            nested: {
              ChangesLsb: {
                values: {
                  eChangesLsbNone: 0,
                  ePositionChanged: 1,
                  eLayerChanged: 2,
                  eAlphaChanged: 8,
                  eMatrixChanged: 16,
                  eTransparentRegionChanged: 32,
                  eFlagsChanged: 64,
                  eLayerStackChanged: 128,
                  eReleaseBufferListenerChanged: 1024,
                  eShadowRadiusChanged: 2048,
                  eBufferCropChanged: 8192,
                  eRelativeLayerChanged: 16384,
                  eReparent: 32768,
                  eColorChanged: 65536,
                  eBufferTransformChanged: 262144,
                  eTransformToDisplayInverseChanged: 524288,
                  eCropChanged: 1048576,
                  eBufferChanged: 2097152,
                  eAcquireFenceChanged: 4194304,
                  eDataspaceChanged: 8388608,
                  eHdrMetadataChanged: 16777216,
                  eSurfaceDamageRegionChanged: 33554432,
                  eApiChanged: 67108864,
                  eSidebandStreamChanged: 134217728,
                  eColorTransformChanged: 268435456,
                  eHasListenerCallbacksChanged: 536870912,
                  eInputInfoChanged: 1073741824,
                  eCornerRadiusChanged: -2147483648
                }
              },
              ChangesMsb: {
                values: {
                  eChangesMsbNone: 0,
                  eDestinationFrameChanged: 1,
                  eCachedBufferChanged: 2,
                  eBackgroundColorChanged: 4,
                  eMetadataChanged: 8,
                  eColorSpaceAgnosticChanged: 16,
                  eFrameRateSelectionPriority: 32,
                  eFrameRateChanged: 64,
                  eBackgroundBlurRadiusChanged: 128,
                  eProducerDisconnect: 256,
                  eFixedTransformHintChanged: 512,
                  eFrameNumberChanged: 1024,
                  eBlurRegionsChanged: 2048,
                  eAutoRefreshChanged: 4096,
                  eStretchChanged: 8192,
                  eTrustedOverlayChanged: 16384,
                  eDropInputModeChanged: 32768
                }
              },
              Flags: {
                values: {
                  eFlagsNone: 0,
                  eLayerHidden: 1,
                  eLayerOpaque: 2,
                  eLayerSkipScreenshot: 64,
                  eLayerSecure: 128,
                  eEnableBackpressure: 256,
                  eLayerIsDisplayDecoration: 512
                }
              },
              Matrix22: {
                fields: {
                  dsdx: {
                    type: "float",
                    id: 1
                  },
                  dtdx: {
                    type: "float",
                    id: 2
                  },
                  dtdy: {
                    type: "float",
                    id: 3
                  },
                  dsdy: {
                    type: "float",
                    id: 4
                  }
                }
              },
              Color3: {
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
                  }
                }
              },
              BufferData: {
                fields: {
                  bufferId: {
                    type: "uint64",
                    id: 1
                  },
                  width: {
                    type: "uint32",
                    id: 2
                  },
                  height: {
                    type: "uint32",
                    id: 3
                  },
                  frameNumber: {
                    type: "uint64",
                    id: 4
                  },
                  flags: {
                    type: "uint32",
                    id: 5
                  },
                  cachedBufferId: {
                    type: "uint64",
                    id: 6
                  },
                  pixelFormat: {
                    type: "PixelFormat",
                    id: 7
                  },
                  usage: {
                    type: "uint64",
                    id: 8
                  }
                },
                nested: {
                  BufferDataChange: {
                    values: {
                      BufferDataChangeNone: 0,
                      fenceChanged: 1,
                      frameNumberChanged: 2,
                      cachedBufferChanged: 4
                    }
                  },
                  PixelFormat: {
                    values: {
                      PIXEL_FORMAT_UNKNOWN: 0,
                      PIXEL_FORMAT_CUSTOM: -4,
                      PIXEL_FORMAT_TRANSLUCENT: -3,
                      PIXEL_FORMAT_TRANSPARENT: -2,
                      PIXEL_FORMAT_OPAQUE: -1,
                      PIXEL_FORMAT_RGBA_8888: 1,
                      PIXEL_FORMAT_RGBX_8888: 2,
                      PIXEL_FORMAT_RGB_888: 3,
                      PIXEL_FORMAT_RGB_565: 4,
                      PIXEL_FORMAT_BGRA_8888: 5,
                      PIXEL_FORMAT_RGBA_5551: 6,
                      PIXEL_FORMAT_RGBA_4444: 7,
                      PIXEL_FORMAT_RGBA_FP16: 22,
                      PIXEL_FORMAT_RGBA_1010102: 43,
                      PIXEL_FORMAT_R_8: 56
                    }
                  }
                }
              },
              WindowInfo: {
                fields: {
                  layoutParamsFlags: {
                    type: "uint32",
                    id: 1
                  },
                  layoutParamsType: {
                    type: "int32",
                    id: 2
                  },
                  touchableRegion: {
                    type: "RegionProto",
                    id: 3
                  },
                  surfaceInset: {
                    type: "int32",
                    id: 4
                  },
                  focusable: {
                    type: "bool",
                    id: 5
                  },
                  hasWallpaper: {
                    type: "bool",
                    id: 6
                  },
                  globalScaleFactor: {
                    type: "float",
                    id: 7
                  },
                  cropLayerId: {
                    type: "uint32",
                    id: 8
                  },
                  replaceTouchableRegionWithCrop: {
                    type: "bool",
                    id: 9
                  },
                  touchableRegionCrop: {
                    type: "RectProto",
                    id: 10
                  },
                  transform: {
                    type: "Transform",
                    id: 11
                  },
                  inputConfig: {
                    type: "uint32",
                    id: 12
                  }
                }
              },
              DropInputMode: {
                values: {
                  NONE: 0,
                  ALL: 1,
                  OBSCURED: 2
                }
              }
            }
          },
          DisplayState: {
            fields: {
              id: {
                type: "int32",
                id: 1
              },
              what: {
                type: "uint32",
                id: 2
              },
              flags: {
                type: "uint32",
                id: 3
              },
              layerStack: {
                type: "uint32",
                id: 4
              },
              orientation: {
                type: "uint32",
                id: 5
              },
              layerStackSpaceRect: {
                type: "RectProto",
                id: 6
              },
              orientedDisplaySpaceRect: {
                type: "RectProto",
                id: 7
              },
              width: {
                type: "uint32",
                id: 8
              },
              height: {
                type: "uint32",
                id: 9
              }
            },
            nested: {
              Changes: {
                values: {
                  eChangesNone: 0,
                  eSurfaceChanged: 1,
                  eLayerStackChanged: 2,
                  eDisplayProjectionChanged: 4,
                  eDisplaySizeChanged: 8,
                  eFlagsChanged: 16
                }
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
