/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/light";

const $root = ($protobuf.roots.ime_latest || ($protobuf.roots.ime_latest = new $protobuf.Root()))
.addJSON({
  perfetto: {
    nested: {
      protos: {
        nested: {
          Wrapper: {
            fields: {
              inputmethodClients: {
                type: "InputMethodClientsTraceProto",
                id: 1
              },
              inputmethodService: {
                type: "InputMethodServiceTraceProto",
                id: 2
              },
              inputmethodManagerService: {
                type: "InputMethodManagerServiceTraceProto",
                id: 3
              }
            }
          },
          InputMethodClientsTraceProto: {
            fields: {
              elapsedRealtimeNanos: {
                type: "fixed64",
                id: 1
              },
              where: {
                type: "string",
                id: 2
              },
              client: {
                type: "ClientSideProto",
                id: 3
              }
            },
            nested: {
              ClientSideProto: {
                fields: {
                  displayId: {
                    type: "int32",
                    id: 1
                  },
                  inputMethodManager: {
                    type: "InputMethodManagerProto",
                    id: 2
                  },
                  viewRootImpl: {
                    type: "ViewRootImplProto",
                    id: 3
                  },
                  insetsController: {
                    type: "InsetsControllerProto",
                    id: 4
                  },
                  imeInsetsSourceConsumer: {
                    type: "ImeInsetsSourceConsumerProto",
                    id: 5
                  },
                  editorInfo: {
                    type: "EditorInfoProto",
                    id: 6
                  },
                  imeFocusController: {
                    type: "ImeFocusControllerProto",
                    id: 7
                  },
                  inputConnection: {
                    type: "InputConnectionProto",
                    id: 8
                  },
                  inputConnectionCall: {
                    type: "InputConnectionCallProto",
                    id: 9
                  }
                }
              }
            }
          },
          InputMethodServiceTraceProto: {
            fields: {
              elapsedRealtimeNanos: {
                type: "fixed64",
                id: 1
              },
              where: {
                type: "string",
                id: 2
              },
              inputMethodService: {
                type: "InputMethodServiceProto",
                id: 3
              }
            }
          },
          InputMethodManagerServiceTraceProto: {
            fields: {
              elapsedRealtimeNanos: {
                type: "fixed64",
                id: 1
              },
              where: {
                type: "string",
                id: 2
              },
              inputMethodManagerService: {
                type: "InputMethodManagerServiceProto",
                id: 3
              }
            }
          },
          InputMethodServiceProto: {
            fields: {
              softInputWindow: {
                type: "SoftInputWindowProto",
                id: 1
              },
              viewsCreated: {
                type: "bool",
                id: 2
              },
              decorViewVisible: {
                type: "bool",
                id: 3
              },
              decorViewWasVisible: {
                type: "bool",
                id: 4
              },
              windowVisible: {
                type: "bool",
                id: 5
              },
              inShowWindow: {
                type: "bool",
                id: 6
              },
              configuration: {
                type: "string",
                id: 7
              },
              token: {
                type: "string",
                id: 8
              },
              inputBinding: {
                type: "string",
                id: 9
              },
              inputStarted: {
                type: "bool",
                id: 10
              },
              inputViewStarted: {
                type: "bool",
                id: 11
              },
              candidatesViewStarted: {
                type: "bool",
                id: 12
              },
              inputEditorInfo: {
                type: "EditorInfoProto",
                id: 13
              },
              showInputRequested: {
                type: "bool",
                id: 14
              },
              lastShowInputRequested: {
                type: "bool",
                id: 15
              },
              showInputFlags: {
                type: "int32",
                id: 18
              },
              candidatesVisibility: {
                type: "int32",
                id: 19
              },
              fullscreenApplied: {
                type: "bool",
                id: 20
              },
              isFullscreen: {
                type: "bool",
                id: 21
              },
              extractViewHidden: {
                type: "bool",
                id: 22
              },
              extractedToken: {
                type: "int32",
                id: 23
              },
              isInputViewShown: {
                type: "bool",
                id: 24
              },
              statusIcon: {
                type: "int32",
                id: 25
              },
              lastComputedInsets: {
                type: "InsetsProto",
                id: 26
              },
              settingsObserver: {
                type: "string",
                id: 27
              },
              inputConnectionCall: {
                type: "InputConnectionCallProto",
                id: 28
              }
            },
            reserved: [
              [
                16,
                16
              ],
              [
                17,
                17
              ]
            ],
            nested: {
              InsetsProto: {
                fields: {
                  contentTopInsets: {
                    type: "int32",
                    id: 1
                  },
                  visibleTopInsets: {
                    type: "int32",
                    id: 2
                  },
                  touchableInsets: {
                    type: "int32",
                    id: 3
                  },
                  touchableRegion: {
                    type: "string",
                    id: 4
                  }
                }
              }
            }
          },
          SoftInputWindowProto: {
            fields: {
              windowState: {
                type: "int32",
                id: 6
              }
            },
            reserved: [
              [
                1,
                1
              ],
              [
                2,
                2
              ],
              [
                3,
                3
              ],
              [
                4,
                4
              ],
              [
                5,
                5
              ]
            ]
          },
          EditorInfoProto: {
            fields: {
              inputType: {
                type: "int32",
                id: 1
              },
              imeOptions: {
                type: "int32",
                id: 2
              },
              privateImeOptions: {
                type: "string",
                id: 3
              },
              packageName: {
                type: "string",
                id: 4
              },
              fieldId: {
                type: "int32",
                id: 5
              },
              targetInputMethodUserId: {
                type: "int32",
                id: 6
              }
            }
          },
          InputConnectionProto: {
            fields: {
              selectedTextStart: {
                type: "int32",
                id: 3
              },
              selectedTextEnd: {
                type: "int32",
                id: 4
              },
              cursorCapsMode: {
                type: "int32",
                id: 5
              }
            },
            reserved: [
              [
                1,
                1
              ],
              [
                2,
                2
              ]
            ]
          },
          InputConnectionCallProto: {
            oneofs: {
              methodCall: {
                oneof: [
                  "getTextBeforeCursor",
                  "getTextAfterCursor",
                  "getSelectedText",
                  "getSurroundingText",
                  "getCursorCapsMode",
                  "getExtractedText"
                ]
              }
            },
            fields: {
              getTextBeforeCursor: {
                type: "GetTextBeforeCursor",
                id: 1
              },
              getTextAfterCursor: {
                type: "GetTextAfterCursor",
                id: 2
              },
              getSelectedText: {
                type: "GetSelectedText",
                id: 3
              },
              getSurroundingText: {
                type: "GetSurroundingText",
                id: 4
              },
              getCursorCapsMode: {
                type: "GetCursorCapsMode",
                id: 5
              },
              getExtractedText: {
                type: "GetExtractedText",
                id: 6
              }
            },
            nested: {
              GetTextBeforeCursor: {
                fields: {
                  length: {
                    type: "int32",
                    id: 1
                  },
                  flags: {
                    type: "int32",
                    id: 2
                  }
                },
                reserved: [
                  [
                    3,
                    3
                  ]
                ]
              },
              GetTextAfterCursor: {
                fields: {
                  length: {
                    type: "int32",
                    id: 1
                  },
                  flags: {
                    type: "int32",
                    id: 2
                  }
                },
                reserved: [
                  [
                    3,
                    3
                  ]
                ]
              },
              GetSelectedText: {
                fields: {
                  flags: {
                    type: "int32",
                    id: 1
                  }
                },
                reserved: [
                  [
                    2,
                    2
                  ]
                ]
              },
              GetSurroundingText: {
                fields: {
                  beforeLength: {
                    type: "int32",
                    id: 1
                  },
                  afterLength: {
                    type: "int32",
                    id: 2
                  },
                  flags: {
                    type: "int32",
                    id: 3
                  },
                  result: {
                    type: "SurroundingText",
                    id: 4
                  }
                },
                nested: {
                  SurroundingText: {
                    fields: {
                      selectionStart: {
                        type: "int32",
                        id: 2
                      },
                      selectionEnd: {
                        type: "int32",
                        id: 3
                      },
                      offset: {
                        type: "int32",
                        id: 4
                      }
                    },
                    reserved: [
                      [
                        1,
                        1
                      ]
                    ]
                  }
                }
              },
              GetCursorCapsMode: {
                fields: {
                  reqModes: {
                    type: "int32",
                    id: 1
                  },
                  result: {
                    type: "int32",
                    id: 2
                  }
                }
              },
              GetExtractedText: {
                fields: {
                  request: {
                    type: "ExtractedTextRequest",
                    id: 1
                  },
                  flags: {
                    type: "int32",
                    id: 2
                  }
                },
                reserved: [
                  [
                    3,
                    3
                  ]
                ],
                nested: {
                  ExtractedTextRequest: {
                    fields: {
                      token: {
                        type: "int32",
                        id: 1
                      },
                      flags: {
                        type: "int32",
                        id: 2
                      },
                      hintMaxLines: {
                        type: "int32",
                        id: 3
                      },
                      hintMaxChars: {
                        type: "int32",
                        id: 4
                      }
                    }
                  }
                }
              }
            }
          },
          InputMethodManagerServiceProto: {
            fields: {
              curMethodId: {
                type: "string",
                id: 1
              },
              curSeq: {
                type: "int32",
                id: 2
              },
              curClient: {
                type: "string",
                id: 3
              },
              curFocusedWindowName: {
                type: "string",
                id: 4
              },
              lastImeTargetWindowName: {
                type: "string",
                id: 5
              },
              curFocusedWindowSoftInputMode: {
                type: "string",
                id: 6
              },
              curAttribute: {
                type: "EditorInfoProto",
                id: 7
              },
              curId: {
                type: "string",
                id: 8
              },
              showExplicitlyRequested: {
                type: "bool",
                id: 10
              },
              showForced: {
                type: "bool",
                id: 11
              },
              inputShown: {
                type: "bool",
                id: 12
              },
              inFullscreenMode: {
                type: "bool",
                id: 13
              },
              curToken: {
                type: "string",
                id: 14
              },
              curTokenDisplayId: {
                type: "int32",
                id: 15
              },
              systemReady: {
                type: "bool",
                id: 16
              },
              lastSwitchUserId: {
                type: "int32",
                id: 17
              },
              haveConnection: {
                type: "bool",
                id: 18
              },
              boundToMethod: {
                type: "bool",
                id: 19
              },
              isInteractive: {
                type: "bool",
                id: 20
              },
              backDisposition: {
                type: "int32",
                id: 21
              },
              imeWindowVisibility: {
                type: "int32",
                id: 22
              },
              showImeWithHardKeyboard: {
                type: "bool",
                id: 23
              },
              accessibilityRequestingNoSoftKeyboard: {
                type: "bool",
                id: 24
              }
            },
            reserved: [
              [
                9,
                9
              ]
            ]
          },
          InputMethodManagerProto: {
            fields: {
              curId: {
                type: "string",
                id: 1
              },
              fullscreenMode: {
                type: "bool",
                id: 2
              },
              displayId: {
                type: "int32",
                id: 3
              },
              active: {
                type: "bool",
                id: 4
              },
              servedConnecting: {
                type: "bool",
                id: 5
              },
              servedView: {
                type: "string",
                id: 6
              },
              nextServedView: {
                type: "string",
                id: 7
              }
            }
          },
          ViewRootImplProto: {
            fields: {
              view: {
                type: "string",
                id: 1
              },
              displayId: {
                type: "int32",
                id: 2
              },
              appVisible: {
                type: "bool",
                id: 3
              },
              width: {
                type: "int32",
                id: 4
              },
              height: {
                type: "int32",
                id: 5
              },
              isAnimating: {
                type: "bool",
                id: 6
              },
              visibleRect: {
                type: "RectProto",
                id: 7
              },
              isDrawing: {
                type: "bool",
                id: 8
              },
              added: {
                type: "bool",
                id: 9
              },
              winFrame: {
                type: "RectProto",
                id: 10
              },
              pendingDisplayCutout: {
                type: "DisplayCutoutProto",
                id: 11,
                options: {
                  deprecated: true
                }
              },
              lastWindowInsets: {
                type: "string",
                id: 12
              },
              softInputMode: {
                type: "string",
                id: 13
              },
              scrollY: {
                type: "int32",
                id: 14
              },
              curScrollY: {
                type: "int32",
                id: 15
              },
              removed: {
                type: "bool",
                id: 16
              },
              windowAttributes: {
                type: "WindowLayoutParamsProto",
                id: 17
              }
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
          },
          DisplayCutoutProto: {
            fields: {
              insets: {
                type: "RectProto",
                id: 1
              },
              boundLeft: {
                type: "RectProto",
                id: 3
              },
              boundTop: {
                type: "RectProto",
                id: 4
              },
              boundRight: {
                type: "RectProto",
                id: 5
              },
              boundBottom: {
                type: "RectProto",
                id: 6
              },
              waterfallInsets: {
                type: "RectProto",
                id: 7
              },
              sideOverrides: {
                rule: "repeated",
                type: "int32",
                id: 8,
                options: {
                  packed: false
                }
              }
            },
            reserved: [
              [
                2,
                2
              ]
            ]
          },
          WindowLayoutParamsProto: {
            fields: {
              type: {
                type: "int32",
                id: 1,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowManager.LayoutParams.WindowType"
                }
              },
              x: {
                type: "int32",
                id: 2
              },
              y: {
                type: "int32",
                id: 3
              },
              width: {
                type: "int32",
                id: 4
              },
              height: {
                type: "int32",
                id: 5
              },
              horizontalMargin: {
                type: "float",
                id: 6
              },
              verticalMargin: {
                type: "float",
                id: 7
              },
              gravity: {
                type: "int32",
                id: 8,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.Gravity.GravityFlags"
                }
              },
              softInputMode: {
                type: "int32",
                id: 9,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowManager.LayoutParams.SoftInputModeFlags"
                }
              },
              format: {
                type: "PixelFormatProto.Format",
                id: 10
              },
              windowAnimations: {
                type: "int32",
                id: 11
              },
              alpha: {
                type: "float",
                id: 12
              },
              screenBrightness: {
                type: "float",
                id: 13
              },
              buttonBrightness: {
                type: "float",
                id: 14
              },
              rotationAnimation: {
                type: "RotationAnimation",
                id: 15
              },
              preferredRefreshRate: {
                type: "float",
                id: 16
              },
              preferredDisplayModeId: {
                type: "int32",
                id: 17
              },
              hasSystemUiListeners: {
                type: "bool",
                id: 18
              },
              inputFeatureFlags: {
                type: "uint32",
                id: 19,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowManager.LayoutParams.InputFeatureFlags"
                }
              },
              userActivityTimeout: {
                type: "int64",
                id: 20
              },
              colorMode: {
                type: "ViewDisplayProto.ColorMode",
                id: 23
              },
              flags: {
                type: "uint32",
                id: 24,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowManager.LayoutParams.Flags"
                }
              },
              privateFlags: {
                type: "uint32",
                id: 26,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowManager.LayoutParams.PrivateFlags"
                }
              },
              systemUiVisibilityFlags: {
                type: "uint32",
                id: 27,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowManager.LayoutParams.SystemUiVisibilityFlags"
                }
              },
              subtreeSystemUiVisibilityFlags: {
                type: "uint32",
                id: 28,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowManager.LayoutParams.SystemUiVisibilityFlags"
                }
              },
              appearance: {
                type: "uint32",
                id: 29,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowInsetsController.Appearance"
                }
              },
              behavior: {
                type: "uint32",
                id: 30,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowInsetsController.Behavior"
                }
              },
              fitInsetsTypes: {
                type: "uint32",
                id: 31,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowInsets.Type.InsetsType"
                }
              },
              fitInsetsSides: {
                type: "uint32",
                id: 32,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowInsets.Side.InsetsSide"
                }
              },
              fitIgnoreVisibility: {
                type: "bool",
                id: 33
              }
            },
            nested: {
              RotationAnimation: {
                values: {
                  ROTATION_ANIMATION_UNSPECIFIED: -1,
                  ROTATION_ANIMATION_CROSSFADE: 1,
                  ROTATION_ANIMATION_JUMPCUT: 2,
                  ROTATION_ANIMATION_SEAMLESS: 3
                }
              }
            }
          },
          PixelFormatProto: {
            fields: {},
            nested: {
              Format: {
                values: {
                  UNKNOWN: 0,
                  TRANSLUCENT: -3,
                  TRANSPARENT: -2,
                  OPAQUE: -1,
                  RGBA_8888: 1,
                  RGBX_8888: 2,
                  RGB_888: 3,
                  RGB_565: 4,
                  RGBA_F16: 22,
                  RGBA_1010102: 43
                }
              }
            }
          },
          ViewDisplayProto: {
            fields: {},
            nested: {
              ColorMode: {
                values: {
                  COLOR_MODE_INVALID: -1,
                  COLOR_MODE_DEFAULT: 0,
                  COLOR_MODE_BT601_625: 1,
                  COLOR_MODE_BT601_625_UNADJUSTED: 2,
                  COLOR_MODE_BT601_525: 3,
                  COLOR_MODE_BT601_525_UNADJUSTED: 4,
                  COLOR_MODE_BT709: 5,
                  COLOR_MODE_DCI_P3: 6,
                  COLOR_MODE_SRGB: 7,
                  COLOR_MODE_ADOBE_RGB: 8,
                  COLOR_MODE_DISPLAY_P3: 9
                }
              }
            }
          },
          typedef: {
            type: "string",
            id: 60001,
            extend: "google.protobuf.FieldOptions"
          },
          InsetsControllerProto: {
            fields: {
              state: {
                type: "InsetsStateProto",
                id: 1
              },
              control: {
                rule: "repeated",
                type: "InsetsAnimationControlImplProto",
                id: 2
              }
            }
          },
          InsetsStateProto: {
            fields: {
              sources: {
                rule: "repeated",
                type: "InsetsSourceProto",
                id: 1
              },
              displayFrame: {
                type: "RectProto",
                id: 2
              },
              displayCutout: {
                type: "DisplayCutoutProto",
                id: 3
              }
            }
          },
          InsetsSourceProto: {
            fields: {
              type: {
                type: "string",
                id: 1,
                options: {
                  deprecated: true
                }
              },
              frame: {
                type: "RectProto",
                id: 2
              },
              visibleFrame: {
                type: "RectProto",
                id: 3
              },
              visible: {
                type: "bool",
                id: 4
              },
              typeNumber: {
                type: "int32",
                id: 5
              }
            }
          },
          InsetsAnimationControlImplProto: {
            fields: {
              isCancelled: {
                type: "bool",
                id: 1
              },
              isFinished: {
                type: "bool",
                id: 2
              },
              tmpMatrix: {
                type: "string",
                id: 3
              },
              pendingInsets: {
                type: "string",
                id: 4
              },
              pendingFraction: {
                type: "float",
                id: 5
              },
              shownOnFinish: {
                type: "bool",
                id: 6
              },
              currentAlpha: {
                type: "float",
                id: 7
              },
              pendingAlpha: {
                type: "float",
                id: 8
              }
            }
          },
          ImeInsetsSourceConsumerProto: {
            fields: {
              insetsSourceConsumer: {
                type: "InsetsSourceConsumerProto",
                id: 1
              },
              isRequestedVisibleAwaitingControl: {
                type: "bool",
                id: 3
              },
              isHideAnimationRunning: {
                type: "bool",
                id: 4,
                options: {
                  deprecated: true
                }
              },
              isShowRequestedDuringHideAnimation: {
                type: "bool",
                id: 5,
                options: {
                  deprecated: true
                }
              },
              hasPendingRequest: {
                type: "bool",
                id: 6
              }
            },
            reserved: [
              [
                2,
                2
              ]
            ]
          },
          InsetsSourceConsumerProto: {
            fields: {
              internalInsetsType: {
                type: "string",
                id: 1,
                options: {
                  deprecated: true
                }
              },
              hasWindowFocus: {
                type: "bool",
                id: 2
              },
              isRequestedVisible: {
                type: "bool",
                id: 3
              },
              sourceControl: {
                type: "InsetsSourceControlProto",
                id: 4
              },
              pendingFrame: {
                type: "RectProto",
                id: 5
              },
              pendingVisibleFrame: {
                type: "RectProto",
                id: 6
              },
              animationState: {
                type: "int32",
                id: 7
              },
              typeNumber: {
                type: "int32",
                id: 8
              }
            }
          },
          InsetsSourceControlProto: {
            fields: {
              type: {
                type: "string",
                id: 1,
                options: {
                  deprecated: true
                }
              },
              position: {
                type: "PointProto",
                id: 2
              },
              leash: {
                type: "SurfaceControlProto",
                id: 3
              },
              typeNumber: {
                type: "int32",
                id: 4
              }
            }
          },
          PointProto: {
            fields: {
              x: {
                type: "int32",
                id: 1
              },
              y: {
                type: "int32",
                id: 2
              }
            }
          },
          SurfaceControlProto: {
            fields: {
              hashCode: {
                type: "int32",
                id: 1
              },
              name: {
                type: "string",
                id: 2
              },
              layerId: {
                type: "int32",
                id: 3
              }
            }
          },
          ImeFocusControllerProto: {
            fields: {
              hasImeFocus: {
                type: "bool",
                id: 1
              },
              servedView: {
                type: "string",
                id: 2,
                options: {
                  deprecated: true
                }
              },
              nextServedView: {
                type: "string",
                id: 3,
                options: {
                  deprecated: true
                }
              }
            }
          }
        }
      }
    }
  },
  google: {
    nested: {
      protobuf: {
        nested: {
          FileDescriptorSet: {
            fields: {
              file: {
                rule: "repeated",
                type: "FileDescriptorProto",
                id: 1
              }
            }
          },
          FileDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              "package": {
                type: "string",
                id: 2
              },
              dependency: {
                rule: "repeated",
                type: "string",
                id: 3
              },
              publicDependency: {
                rule: "repeated",
                type: "int32",
                id: 10,
                options: {
                  packed: false
                }
              },
              weakDependency: {
                rule: "repeated",
                type: "int32",
                id: 11,
                options: {
                  packed: false
                }
              },
              messageType: {
                rule: "repeated",
                type: "DescriptorProto",
                id: 4
              },
              enumType: {
                rule: "repeated",
                type: "EnumDescriptorProto",
                id: 5
              },
              service: {
                rule: "repeated",
                type: "ServiceDescriptorProto",
                id: 6
              },
              extension: {
                rule: "repeated",
                type: "FieldDescriptorProto",
                id: 7
              },
              options: {
                type: "FileOptions",
                id: 8
              },
              sourceCodeInfo: {
                type: "SourceCodeInfo",
                id: 9
              },
              syntax: {
                type: "string",
                id: 12
              }
            }
          },
          DescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              field: {
                rule: "repeated",
                type: "FieldDescriptorProto",
                id: 2
              },
              extension: {
                rule: "repeated",
                type: "FieldDescriptorProto",
                id: 6
              },
              nestedType: {
                rule: "repeated",
                type: "DescriptorProto",
                id: 3
              },
              enumType: {
                rule: "repeated",
                type: "EnumDescriptorProto",
                id: 4
              },
              extensionRange: {
                rule: "repeated",
                type: "ExtensionRange",
                id: 5
              },
              oneofDecl: {
                rule: "repeated",
                type: "OneofDescriptorProto",
                id: 8
              },
              options: {
                type: "MessageOptions",
                id: 7
              },
              reservedRange: {
                rule: "repeated",
                type: "ReservedRange",
                id: 9
              },
              reservedName: {
                rule: "repeated",
                type: "string",
                id: 10
              }
            },
            nested: {
              ExtensionRange: {
                fields: {
                  start: {
                    type: "int32",
                    id: 1
                  },
                  end: {
                    type: "int32",
                    id: 2
                  }
                }
              },
              ReservedRange: {
                fields: {
                  start: {
                    type: "int32",
                    id: 1
                  },
                  end: {
                    type: "int32",
                    id: 2
                  }
                }
              }
            }
          },
          FieldDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              number: {
                type: "int32",
                id: 3
              },
              label: {
                type: "Label",
                id: 4
              },
              type: {
                type: "Type",
                id: 5
              },
              typeName: {
                type: "string",
                id: 6
              },
              extendee: {
                type: "string",
                id: 2
              },
              defaultValue: {
                type: "string",
                id: 7
              },
              oneofIndex: {
                type: "int32",
                id: 9
              },
              jsonName: {
                type: "string",
                id: 10
              },
              options: {
                type: "FieldOptions",
                id: 8
              }
            },
            nested: {
              Type: {
                values: {
                  TYPE_DOUBLE: 1,
                  TYPE_FLOAT: 2,
                  TYPE_INT64: 3,
                  TYPE_UINT64: 4,
                  TYPE_INT32: 5,
                  TYPE_FIXED64: 6,
                  TYPE_FIXED32: 7,
                  TYPE_BOOL: 8,
                  TYPE_STRING: 9,
                  TYPE_GROUP: 10,
                  TYPE_MESSAGE: 11,
                  TYPE_BYTES: 12,
                  TYPE_UINT32: 13,
                  TYPE_ENUM: 14,
                  TYPE_SFIXED32: 15,
                  TYPE_SFIXED64: 16,
                  TYPE_SINT32: 17,
                  TYPE_SINT64: 18
                }
              },
              Label: {
                values: {
                  LABEL_OPTIONAL: 1,
                  LABEL_REQUIRED: 2,
                  LABEL_REPEATED: 3
                }
              }
            }
          },
          OneofDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              options: {
                type: "OneofOptions",
                id: 2
              }
            }
          },
          EnumDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              value: {
                rule: "repeated",
                type: "EnumValueDescriptorProto",
                id: 2
              },
              options: {
                type: "EnumOptions",
                id: 3
              }
            }
          },
          EnumValueDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              number: {
                type: "int32",
                id: 2
              },
              options: {
                type: "EnumValueOptions",
                id: 3
              }
            }
          },
          ServiceDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              method: {
                rule: "repeated",
                type: "MethodDescriptorProto",
                id: 2
              },
              options: {
                type: "ServiceOptions",
                id: 3
              }
            }
          },
          MethodDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              inputType: {
                type: "string",
                id: 2
              },
              outputType: {
                type: "string",
                id: 3
              },
              options: {
                type: "MethodOptions",
                id: 4
              },
              clientStreaming: {
                type: "bool",
                id: 5
              },
              serverStreaming: {
                type: "bool",
                id: 6
              }
            }
          },
          FileOptions: {
            fields: {
              javaPackage: {
                type: "string",
                id: 1
              },
              javaOuterClassname: {
                type: "string",
                id: 8
              },
              javaMultipleFiles: {
                type: "bool",
                id: 10
              },
              javaGenerateEqualsAndHash: {
                type: "bool",
                id: 20,
                options: {
                  deprecated: true
                }
              },
              javaStringCheckUtf8: {
                type: "bool",
                id: 27
              },
              optimizeFor: {
                type: "OptimizeMode",
                id: 9,
                options: {
                  "default": "SPEED"
                }
              },
              goPackage: {
                type: "string",
                id: 11
              },
              ccGenericServices: {
                type: "bool",
                id: 16
              },
              javaGenericServices: {
                type: "bool",
                id: 17
              },
              pyGenericServices: {
                type: "bool",
                id: 18
              },
              deprecated: {
                type: "bool",
                id: 23
              },
              ccEnableArenas: {
                type: "bool",
                id: 31
              },
              objcClassPrefix: {
                type: "string",
                id: 36
              },
              csharpNamespace: {
                type: "string",
                id: 37
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ],
            reserved: [
              [
                38,
                38
              ]
            ],
            nested: {
              OptimizeMode: {
                values: {
                  SPEED: 1,
                  CODE_SIZE: 2,
                  LITE_RUNTIME: 3
                }
              }
            }
          },
          MessageOptions: {
            fields: {
              messageSetWireFormat: {
                type: "bool",
                id: 1
              },
              noStandardDescriptorAccessor: {
                type: "bool",
                id: 2
              },
              deprecated: {
                type: "bool",
                id: 3
              },
              mapEntry: {
                type: "bool",
                id: 7
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ],
            reserved: [
              [
                8,
                8
              ]
            ]
          },
          FieldOptions: {
            fields: {
              ctype: {
                type: "CType",
                id: 1,
                options: {
                  "default": "STRING"
                }
              },
              packed: {
                type: "bool",
                id: 2
              },
              jstype: {
                type: "JSType",
                id: 6,
                options: {
                  "default": "JS_NORMAL"
                }
              },
              lazy: {
                type: "bool",
                id: 5
              },
              deprecated: {
                type: "bool",
                id: 3
              },
              weak: {
                type: "bool",
                id: 10
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ],
            reserved: [
              [
                4,
                4
              ]
            ],
            nested: {
              CType: {
                values: {
                  STRING: 0,
                  CORD: 1,
                  STRING_PIECE: 2
                }
              },
              JSType: {
                values: {
                  JS_NORMAL: 0,
                  JS_STRING: 1,
                  JS_NUMBER: 2
                }
              }
            }
          },
          OneofOptions: {
            fields: {
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ]
          },
          EnumOptions: {
            fields: {
              allowAlias: {
                type: "bool",
                id: 2
              },
              deprecated: {
                type: "bool",
                id: 3
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ]
          },
          EnumValueOptions: {
            fields: {
              deprecated: {
                type: "bool",
                id: 1
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ]
          },
          ServiceOptions: {
            fields: {
              deprecated: {
                type: "bool",
                id: 33
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ]
          },
          MethodOptions: {
            fields: {
              deprecated: {
                type: "bool",
                id: 33
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ]
          },
          UninterpretedOption: {
            fields: {
              name: {
                rule: "repeated",
                type: "NamePart",
                id: 2
              },
              identifierValue: {
                type: "string",
                id: 3
              },
              positiveIntValue: {
                type: "uint64",
                id: 4
              },
              negativeIntValue: {
                type: "int64",
                id: 5
              },
              doubleValue: {
                type: "double",
                id: 6
              },
              stringValue: {
                type: "bytes",
                id: 7
              },
              aggregateValue: {
                type: "string",
                id: 8
              }
            },
            nested: {
              NamePart: {
                fields: {
                  namePart: {
                    rule: "required",
                    type: "string",
                    id: 1
                  },
                  isExtension: {
                    rule: "required",
                    type: "bool",
                    id: 2
                  }
                }
              }
            }
          },
          SourceCodeInfo: {
            fields: {
              location: {
                rule: "repeated",
                type: "Location",
                id: 1
              }
            },
            nested: {
              Location: {
                fields: {
                  path: {
                    rule: "repeated",
                    type: "int32",
                    id: 1
                  },
                  span: {
                    rule: "repeated",
                    type: "int32",
                    id: 2
                  },
                  leadingComments: {
                    type: "string",
                    id: 3
                  },
                  trailingComments: {
                    type: "string",
                    id: 4
                  },
                  leadingDetachedComments: {
                    rule: "repeated",
                    type: "string",
                    id: 6
                  }
                }
              }
            }
          },
          GeneratedCodeInfo: {
            fields: {
              annotation: {
                rule: "repeated",
                type: "Annotation",
                id: 1
              }
            },
            nested: {
              Annotation: {
                fields: {
                  path: {
                    rule: "repeated",
                    type: "int32",
                    id: 1
                  },
                  sourceFile: {
                    type: "string",
                    id: 2
                  },
                  begin: {
                    type: "int32",
                    id: 3
                  },
                  end: {
                    type: "int32",
                    id: 4
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});

export { $root as default };
