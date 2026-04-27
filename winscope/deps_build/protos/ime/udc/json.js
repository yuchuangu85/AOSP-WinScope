/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/light";

const $root = ($protobuf.roots.ime_udc || ($protobuf.roots.ime_udc = new $protobuf.Root()))
.setOptions({
  java_outer_classname: "InputMethodEditorTraceProto",
  optimize_for: "LITE_RUNTIME"
})
.addJSON({
  android: {
    nested: {
      view: {
        nested: {
          inputmethod: {
            options: {
              java_multiple_files: true
            },
            nested: {
              InputMethodClientsTraceFileProto: {
                edition: "proto2",
                fields: {
                  magicNumber: {
                    type: "fixed64",
                    id: 1
                  },
                  entry: {
                    rule: "repeated",
                    type: "InputMethodClientsTraceProto",
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
                      MAGIC_NUMBER_L: 1413696841,
                      MAGIC_NUMBER_H: 1162035538
                    }
                  }
                }
              },
              InputMethodClientsTraceProto: {
                edition: "proto2",
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
                        id: 5,
                        options: {
                          deprecated: true
                        }
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
              InputMethodServiceTraceFileProto: {
                edition: "proto2",
                fields: {
                  magicNumber: {
                    type: "fixed64",
                    id: 1
                  },
                  entry: {
                    rule: "repeated",
                    type: "InputMethodServiceTraceProto",
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
                      MAGIC_NUMBER_L: 1414745417,
                      MAGIC_NUMBER_H: 1162035538
                    }
                  }
                }
              },
              InputMethodServiceTraceProto: {
                edition: "proto2",
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
                    type: ".android.inputmethodservice.InputMethodServiceProto",
                    id: 3
                  }
                }
              },
              InputMethodManagerServiceTraceFileProto: {
                edition: "proto2",
                fields: {
                  magicNumber: {
                    type: "fixed64",
                    id: 1
                  },
                  entry: {
                    rule: "repeated",
                    type: "InputMethodManagerServiceTraceProto",
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
                      MAGIC_NUMBER_L: 1414352201,
                      MAGIC_NUMBER_H: 1162035538
                    }
                  }
                }
              },
              InputMethodManagerServiceTraceProto: {
                edition: "proto2",
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
                    type: ".android.server.inputmethod.InputMethodManagerServiceProto",
                    id: 3
                  }
                }
              },
              EditorInfoProto: {
                edition: "proto2",
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
                edition: "proto2",
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
                edition: "proto2",
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
              InputMethodManagerProto: {
                edition: "proto2",
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
              }
            }
          }
        }
      },
      server: {
        nested: {
          inputmethod: {
            options: {
              java_multiple_files: true
            },
            nested: {
              InputMethodManagerServiceProto: {
                edition: "proto2",
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
                    type: ".android.view.inputmethod.EditorInfoProto",
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
                  },
                  concurrentMultiUserModeEnabled: {
                    type: "bool",
                    id: 25
                  },
                  preventImeStartupUnlessTextEditor: {
                    type: "bool",
                    id: 26
                  }
                },
                reserved: [
                  [
                    9,
                    9
                  ],
                  [
                    17,
                    17
                  ]
                ]
              }
            }
          }
        }
      },
      inputmethodservice: {
        options: {
          java_multiple_files: true
        },
        nested: {
          InputMethodServiceProto: {
            edition: "proto2",
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
                type: ".android.view.inputmethod.EditorInfoProto",
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
                type: ".android.view.inputmethod.InputConnectionCallProto",
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
            edition: "proto2",
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
          }
        }
      }
    }
  },
  android_common: {
    options: {
      java_package: "com.android_common.incident",
      java_multiple_files: true
    },
    nested: {
      graphics: {
        nested: {
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
          PointProto: {
            options: {
              "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
            },
            oneofs: {
              _x: {
                oneof: [
                  "x"
                ]
              },
              _y: {
                oneof: [
                  "y"
                ]
              }
            },
            fields: {
              x: {
                type: "int32",
                id: 1,
                options: {
                  proto3_optional: true
                }
              },
              y: {
                type: "int32",
                id: 2,
                options: {
                  proto3_optional: true
                }
              }
            }
          },
          InsetsProto: {
            options: {
              "(android_common.msg_privacy).dest": "DEST_AUTOMATIC"
            },
            oneofs: {
              _left: {
                oneof: [
                  "left"
                ]
              },
              _top: {
                oneof: [
                  "top"
                ]
              },
              _right: {
                oneof: [
                  "right"
                ]
              },
              _bottom: {
                oneof: [
                  "bottom"
                ]
              }
            },
            fields: {
              left: {
                type: "int32",
                id: 1,
                options: {
                  proto3_optional: true
                }
              },
              top: {
                type: "int32",
                id: 2,
                options: {
                  proto3_optional: true
                }
              },
              right: {
                type: "int32",
                id: 3,
                options: {
                  proto3_optional: true
                }
              },
              bottom: {
                type: "int32",
                id: 4,
                options: {
                  proto3_optional: true
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
          }
        }
      },
      typedef: {
        edition: "proto2",
        type: "string",
        id: 60001,
        extend: "google.protobuf.FieldOptions"
      },
      Destination: {
        edition: "proto2",
        values: {
          DEST_LOCAL: 0,
          DEST_EXPLICIT: 100,
          DEST_AUTOMATIC: 200,
          DEST_UNSET: 255
        }
      },
      PrivacyFlags: {
        edition: "proto2",
        fields: {
          dest: {
            type: "Destination",
            id: 1,
            options: {
              "default": "DEST_UNSET"
            }
          },
          patterns: {
            rule: "repeated",
            type: "string",
            id: 2
          }
        }
      },
      privacy: {
        edition: "proto2",
        type: "PrivacyFlags",
        id: 102672883,
        extend: "google.protobuf.FieldOptions"
      },
      msgPrivacy: {
        edition: "proto2",
        type: "PrivacyFlags",
        id: 102672883,
        extend: "google.protobuf.MessageOptions"
      },
      view: {
        options: {
          java_multiple_files: true
        },
        nested: {
          DisplayProto: {
            edition: "proto2",
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
          DisplayCutoutProto: {
            edition: "proto2",
            options: {
              "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
            },
            fields: {
              insets: {
                type: ".android_common.graphics.RectProto",
                id: 1
              },
              boundLeft: {
                type: ".android_common.graphics.RectProto",
                id: 3
              },
              boundTop: {
                type: ".android_common.graphics.RectProto",
                id: 4
              },
              boundRight: {
                type: ".android_common.graphics.RectProto",
                id: 5
              },
              boundBottom: {
                type: ".android_common.graphics.RectProto",
                id: 6
              },
              waterfallInsets: {
                type: ".android_common.graphics.RectProto",
                id: 7
              },
              sideOverrides: {
                rule: "repeated",
                type: "int32",
                id: 8
              }
            },
            reserved: [
              [
                2,
                2
              ]
            ]
          },
          ImeFocusControllerProto: {
            edition: "proto2",
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
          },
          ImeInsetsSourceConsumerProto: {
            edition: "proto2",
            options: {
              deprecated: true
            },
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
          InsetsAnimationControlImplProto: {
            edition: "proto2",
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
          InsetsControllerProto: {
            edition: "proto2",
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
          InsetsSourceProto: {
            edition: "proto2",
            fields: {
              type: {
                type: "string",
                id: 1,
                options: {
                  deprecated: true
                }
              },
              frame: {
                type: ".android_common.graphics.RectProto",
                id: 2
              },
              visibleFrame: {
                type: ".android_common.graphics.RectProto",
                id: 3
              },
              visible: {
                type: "bool",
                id: 4
              },
              typeNumber: {
                type: "int32",
                id: 5
              },
              attachedInsets: {
                type: ".android_common.graphics.InsetsProto",
                id: 6
              }
            }
          },
          InsetsSourceConsumerProto: {
            edition: "proto2",
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
                type: ".android_common.graphics.RectProto",
                id: 5
              },
              pendingVisibleFrame: {
                type: ".android_common.graphics.RectProto",
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
            edition: "proto2",
            fields: {
              type: {
                type: "string",
                id: 1,
                options: {
                  deprecated: true
                }
              },
              position: {
                type: ".android_common.graphics.PointProto",
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
          InsetsStateProto: {
            edition: "proto2",
            fields: {
              sources: {
                rule: "repeated",
                type: "InsetsSourceProto",
                id: 1
              },
              displayFrame: {
                type: ".android_common.graphics.RectProto",
                id: 2
              },
              displayCutout: {
                type: "DisplayCutoutProto",
                id: 3
              }
            }
          },
          SurfaceControlProto: {
            edition: "proto2",
            options: {
              "(android_common.msg_privacy).dest": "DEST_AUTOMATIC"
            },
            fields: {
              hashCode: {
                type: "int32",
                id: 1
              },
              name: {
                type: "string",
                id: 2,
                options: {
                  "(android_common.privacy).dest": "DEST_EXPLICIT"
                }
              },
              layerId: {
                type: "int32",
                id: 3
              }
            }
          },
          ViewRootImplProto: {
            edition: "proto2",
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
                type: ".android_common.graphics.RectProto",
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
                type: ".android_common.graphics.RectProto",
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
                type: ".android_common.view.WindowLayoutParamsProto",
                id: 17
              }
            }
          },
          WindowLayoutParamsProto: {
            edition: "proto2",
            options: {
              "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
            },
            fields: {
              type: {
                type: "int32",
                id: 1,
                options: {
                  "(.android_common.typedef)": "android.view.WindowManager.LayoutParams.WindowType"
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
                  "(.android_common.typedef)": "android.view.Gravity.GravityFlags"
                }
              },
              softInputMode: {
                type: "int32",
                id: 9,
                options: {
                  "(.android_common.typedef)": "android.view.WindowManager.LayoutParams.SoftInputModeFlags"
                }
              },
              format: {
                type: ".android_common.graphics.PixelFormatProto.Format",
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
                  "(.android_common.typedef)": "android.view.WindowManager.LayoutParams.InputFeatureFlags"
                }
              },
              userActivityTimeout: {
                type: "int64",
                id: 20
              },
              colorMode: {
                type: "DisplayProto.ColorMode",
                id: 23
              },
              flags: {
                type: "uint32",
                id: 24,
                options: {
                  "(.android_common.typedef)": "android.view.WindowManager.LayoutParams.Flags"
                }
              },
              privateFlags: {
                type: "uint32",
                id: 26,
                options: {
                  "(.android_common.typedef)": "android.view.WindowManager.LayoutParams.PrivateFlags"
                }
              },
              systemUiVisibilityFlags: {
                type: "uint32",
                id: 27,
                options: {
                  "(.android_common.typedef)": "android.view.WindowManager.LayoutParams.SystemUiVisibilityFlags"
                }
              },
              subtreeSystemUiVisibilityFlags: {
                type: "uint32",
                id: 28,
                options: {
                  "(.android_common.typedef)": "android.view.WindowManager.LayoutParams.SystemUiVisibilityFlags"
                }
              },
              appearance: {
                type: "uint32",
                id: 29,
                options: {
                  "(.android_common.typedef)": "android.view.WindowInsetsController.Appearance"
                }
              },
              behavior: {
                type: "uint32",
                id: 30,
                options: {
                  "(.android_common.typedef)": "android.view.WindowInsetsController.Behavior"
                }
              },
              fitInsetsTypes: {
                type: "uint32",
                id: 31,
                options: {
                  "(.android_common.typedef)": "android.view.WindowInsets.Type.InsetsType"
                }
              },
              fitInsetsSides: {
                type: "uint32",
                id: 32,
                options: {
                  "(.android_common.typedef)": "android.view.WindowInsets.Side.InsetsSide"
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
          }
        }
      }
    }
  },
  google: {
    nested: {
      protobuf: {
        options: {
          go_package: "google.golang.org/protobuf/types/descriptorpb",
          java_package: "com.google.protobuf",
          java_outer_classname: "DescriptorProtos",
          csharp_namespace: "Google.Protobuf.Reflection",
          objc_class_prefix: "GPB",
          cc_enable_arenas: true,
          optimize_for: "SPEED"
        },
        nested: {
          FileDescriptorSet: {
            edition: "proto2",
            fields: {
              file: {
                rule: "repeated",
                type: "FileDescriptorProto",
                id: 1
              }
            },
            extensions: [
              [
                536000000,
                536000000
              ]
            ]
          },
          Edition: {
            edition: "proto2",
            values: {
              EDITION_UNKNOWN: 0,
              EDITION_LEGACY: 900,
              EDITION_PROTO2: 998,
              EDITION_PROTO3: 999,
              EDITION_2023: 1000,
              EDITION_2024: 1001,
              EDITION_1_TEST_ONLY: 1,
              EDITION_2_TEST_ONLY: 2,
              EDITION_99997_TEST_ONLY: 99997,
              EDITION_99998_TEST_ONLY: 99998,
              EDITION_99999_TEST_ONLY: 99999,
              EDITION_MAX: 2147483647
            }
          },
          FileDescriptorProto: {
            edition: "proto2",
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
                id: 10
              },
              weakDependency: {
                rule: "repeated",
                type: "int32",
                id: 11
              },
              optionDependency: {
                rule: "repeated",
                type: "string",
                id: 15
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
              },
              edition: {
                type: "Edition",
                id: 14
              }
            }
          },
          DescriptorProto: {
            edition: "proto2",
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
              },
              visibility: {
                type: "SymbolVisibility",
                id: 11
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
                  },
                  options: {
                    type: "ExtensionRangeOptions",
                    id: 3
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
          ExtensionRangeOptions: {
            edition: "proto2",
            fields: {
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              },
              declaration: {
                rule: "repeated",
                type: "Declaration",
                id: 2,
                options: {
                  retention: "RETENTION_SOURCE"
                }
              },
              features: {
                type: "FeatureSet",
                id: 50
              },
              verification: {
                type: "VerificationState",
                id: 3,
                options: {
                  "default": "UNVERIFIED",
                  retention: "RETENTION_SOURCE"
                }
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ],
            nested: {
              Declaration: {
                fields: {
                  number: {
                    type: "int32",
                    id: 1
                  },
                  fullName: {
                    type: "string",
                    id: 2
                  },
                  type: {
                    type: "string",
                    id: 3
                  },
                  reserved: {
                    type: "bool",
                    id: 5
                  },
                  repeated: {
                    type: "bool",
                    id: 6
                  }
                },
                reserved: [
                  [
                    4,
                    4
                  ]
                ]
              },
              VerificationState: {
                values: {
                  DECLARATION: 0,
                  UNVERIFIED: 1
                }
              }
            }
          },
          FieldDescriptorProto: {
            edition: "proto2",
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
              },
              proto3Optional: {
                type: "bool",
                id: 17
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
                  LABEL_REPEATED: 3,
                  LABEL_REQUIRED: 2
                }
              }
            }
          },
          OneofDescriptorProto: {
            edition: "proto2",
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
            edition: "proto2",
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
              },
              reservedRange: {
                rule: "repeated",
                type: "EnumReservedRange",
                id: 4
              },
              reservedName: {
                rule: "repeated",
                type: "string",
                id: 5
              },
              visibility: {
                type: "SymbolVisibility",
                id: 6
              }
            },
            nested: {
              EnumReservedRange: {
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
          EnumValueDescriptorProto: {
            edition: "proto2",
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
            edition: "proto2",
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
            edition: "proto2",
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
            edition: "proto2",
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
                id: 31,
                options: {
                  "default": true
                }
              },
              objcClassPrefix: {
                type: "string",
                id: 36
              },
              csharpNamespace: {
                type: "string",
                id: 37
              },
              swiftPrefix: {
                type: "string",
                id: 39
              },
              phpClassPrefix: {
                type: "string",
                id: 40
              },
              phpNamespace: {
                type: "string",
                id: 41
              },
              phpMetadataNamespace: {
                type: "string",
                id: 44
              },
              rubyPackage: {
                type: "string",
                id: 45
              },
              features: {
                type: "FeatureSet",
                id: 50
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
                42,
                42
              ],
              [
                38,
                38
              ],
              "php_generic_services"
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
            edition: "proto2",
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
              deprecatedLegacyJsonFieldConflicts: {
                type: "bool",
                id: 11,
                options: {
                  deprecated: true
                }
              },
              features: {
                type: "FeatureSet",
                id: 12
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
              ],
              [
                5,
                5
              ],
              [
                6,
                6
              ],
              [
                8,
                8
              ],
              [
                9,
                9
              ]
            ]
          },
          FieldOptions: {
            edition: "proto2",
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
              unverifiedLazy: {
                type: "bool",
                id: 15
              },
              deprecated: {
                type: "bool",
                id: 3
              },
              weak: {
                type: "bool",
                id: 10,
                options: {
                  deprecated: true
                }
              },
              debugRedact: {
                type: "bool",
                id: 16
              },
              retention: {
                type: "OptionRetention",
                id: 17
              },
              targets: {
                rule: "repeated",
                type: "OptionTargetType",
                id: 19
              },
              editionDefaults: {
                rule: "repeated",
                type: "EditionDefault",
                id: 20
              },
              features: {
                type: "FeatureSet",
                id: 21
              },
              featureSupport: {
                type: "FeatureSupport",
                id: 22
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
              ],
              [
                18,
                18
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
              },
              OptionRetention: {
                values: {
                  RETENTION_UNKNOWN: 0,
                  RETENTION_RUNTIME: 1,
                  RETENTION_SOURCE: 2
                }
              },
              OptionTargetType: {
                values: {
                  TARGET_TYPE_UNKNOWN: 0,
                  TARGET_TYPE_FILE: 1,
                  TARGET_TYPE_EXTENSION_RANGE: 2,
                  TARGET_TYPE_MESSAGE: 3,
                  TARGET_TYPE_FIELD: 4,
                  TARGET_TYPE_ONEOF: 5,
                  TARGET_TYPE_ENUM: 6,
                  TARGET_TYPE_ENUM_ENTRY: 7,
                  TARGET_TYPE_SERVICE: 8,
                  TARGET_TYPE_METHOD: 9
                }
              },
              EditionDefault: {
                fields: {
                  edition: {
                    type: "Edition",
                    id: 3
                  },
                  value: {
                    type: "string",
                    id: 2
                  }
                }
              },
              FeatureSupport: {
                fields: {
                  editionIntroduced: {
                    type: "Edition",
                    id: 1
                  },
                  editionDeprecated: {
                    type: "Edition",
                    id: 2
                  },
                  deprecationWarning: {
                    type: "string",
                    id: 3
                  },
                  editionRemoved: {
                    type: "Edition",
                    id: 4
                  }
                }
              }
            }
          },
          OneofOptions: {
            edition: "proto2",
            fields: {
              features: {
                type: "FeatureSet",
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
          EnumOptions: {
            edition: "proto2",
            fields: {
              allowAlias: {
                type: "bool",
                id: 2
              },
              deprecated: {
                type: "bool",
                id: 3
              },
              deprecatedLegacyJsonFieldConflicts: {
                type: "bool",
                id: 6,
                options: {
                  deprecated: true
                }
              },
              features: {
                type: "FeatureSet",
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
                5,
                5
              ]
            ]
          },
          EnumValueOptions: {
            edition: "proto2",
            fields: {
              deprecated: {
                type: "bool",
                id: 1
              },
              features: {
                type: "FeatureSet",
                id: 2
              },
              debugRedact: {
                type: "bool",
                id: 3
              },
              featureSupport: {
                type: "FieldOptions.FeatureSupport",
                id: 4
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
            edition: "proto2",
            fields: {
              features: {
                type: "FeatureSet",
                id: 34
              },
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
            edition: "proto2",
            fields: {
              deprecated: {
                type: "bool",
                id: 33
              },
              idempotencyLevel: {
                type: "IdempotencyLevel",
                id: 34,
                options: {
                  "default": "IDEMPOTENCY_UNKNOWN"
                }
              },
              features: {
                type: "FeatureSet",
                id: 35
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
            nested: {
              IdempotencyLevel: {
                values: {
                  IDEMPOTENCY_UNKNOWN: 0,
                  NO_SIDE_EFFECTS: 1,
                  IDEMPOTENT: 2
                }
              }
            }
          },
          UninterpretedOption: {
            edition: "proto2",
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
          FeatureSet: {
            edition: "proto2",
            fields: {
              fieldPresence: {
                type: "FieldPresence",
                id: 1,
                options: {
                  retention: "RETENTION_RUNTIME",
                  targets: "TARGET_TYPE_FILE",
                  "feature_support.edition_introduced": "EDITION_2023",
                  "edition_defaults.edition": "EDITION_2023",
                  "edition_defaults.value": "EXPLICIT"
                }
              },
              enumType: {
                type: "EnumType",
                id: 2,
                options: {
                  retention: "RETENTION_RUNTIME",
                  targets: "TARGET_TYPE_FILE",
                  "feature_support.edition_introduced": "EDITION_2023",
                  "edition_defaults.edition": "EDITION_PROTO3",
                  "edition_defaults.value": "OPEN"
                }
              },
              repeatedFieldEncoding: {
                type: "RepeatedFieldEncoding",
                id: 3,
                options: {
                  retention: "RETENTION_RUNTIME",
                  targets: "TARGET_TYPE_FILE",
                  "feature_support.edition_introduced": "EDITION_2023",
                  "edition_defaults.edition": "EDITION_PROTO3",
                  "edition_defaults.value": "PACKED"
                }
              },
              utf8Validation: {
                type: "Utf8Validation",
                id: 4,
                options: {
                  retention: "RETENTION_RUNTIME",
                  targets: "TARGET_TYPE_FILE",
                  "feature_support.edition_introduced": "EDITION_2023",
                  "edition_defaults.edition": "EDITION_PROTO3",
                  "edition_defaults.value": "VERIFY"
                }
              },
              messageEncoding: {
                type: "MessageEncoding",
                id: 5,
                options: {
                  retention: "RETENTION_RUNTIME",
                  targets: "TARGET_TYPE_FILE",
                  "feature_support.edition_introduced": "EDITION_2023",
                  "edition_defaults.edition": "EDITION_LEGACY",
                  "edition_defaults.value": "LENGTH_PREFIXED"
                }
              },
              jsonFormat: {
                type: "JsonFormat",
                id: 6,
                options: {
                  retention: "RETENTION_RUNTIME",
                  targets: "TARGET_TYPE_FILE",
                  "feature_support.edition_introduced": "EDITION_2023",
                  "edition_defaults.edition": "EDITION_PROTO3",
                  "edition_defaults.value": "ALLOW"
                }
              },
              enforceNamingStyle: {
                type: "EnforceNamingStyle",
                id: 7,
                options: {
                  retention: "RETENTION_SOURCE",
                  targets: "TARGET_TYPE_METHOD",
                  "feature_support.edition_introduced": "EDITION_2024",
                  "edition_defaults.edition": "EDITION_2024",
                  "edition_defaults.value": "STYLE2024"
                }
              },
              defaultSymbolVisibility: {
                type: "VisibilityFeature.DefaultSymbolVisibility",
                id: 8,
                options: {
                  retention: "RETENTION_SOURCE",
                  targets: "TARGET_TYPE_FILE",
                  "feature_support.edition_introduced": "EDITION_2024",
                  "edition_defaults.edition": "EDITION_2024",
                  "edition_defaults.value": "EXPORT_TOP_LEVEL"
                }
              }
            },
            extensions: [
              [
                1000,
                9994
              ],
              [
                9995,
                9999
              ],
              [
                10000,
                10000
              ]
            ],
            reserved: [
              [
                999,
                999
              ]
            ],
            nested: {
              FieldPresence: {
                values: {
                  FIELD_PRESENCE_UNKNOWN: 0,
                  EXPLICIT: 1,
                  IMPLICIT: 2,
                  LEGACY_REQUIRED: 3
                }
              },
              EnumType: {
                values: {
                  ENUM_TYPE_UNKNOWN: 0,
                  OPEN: 1,
                  CLOSED: 2
                }
              },
              RepeatedFieldEncoding: {
                values: {
                  REPEATED_FIELD_ENCODING_UNKNOWN: 0,
                  PACKED: 1,
                  EXPANDED: 2
                }
              },
              Utf8Validation: {
                values: {
                  UTF8_VALIDATION_UNKNOWN: 0,
                  VERIFY: 2,
                  NONE: 3
                }
              },
              MessageEncoding: {
                values: {
                  MESSAGE_ENCODING_UNKNOWN: 0,
                  LENGTH_PREFIXED: 1,
                  DELIMITED: 2
                }
              },
              JsonFormat: {
                values: {
                  JSON_FORMAT_UNKNOWN: 0,
                  ALLOW: 1,
                  LEGACY_BEST_EFFORT: 2
                }
              },
              EnforceNamingStyle: {
                values: {
                  ENFORCE_NAMING_STYLE_UNKNOWN: 0,
                  STYLE2024: 1,
                  STYLE_LEGACY: 2
                }
              },
              VisibilityFeature: {
                fields: {},
                reserved: [
                  [
                    1,
                    536870911
                  ]
                ],
                nested: {
                  DefaultSymbolVisibility: {
                    values: {
                      DEFAULT_SYMBOL_VISIBILITY_UNKNOWN: 0,
                      EXPORT_ALL: 1,
                      EXPORT_TOP_LEVEL: 2,
                      LOCAL_ALL: 3,
                      STRICT: 4
                    }
                  }
                }
              }
            }
          },
          FeatureSetDefaults: {
            edition: "proto2",
            fields: {
              defaults: {
                rule: "repeated",
                type: "FeatureSetEditionDefault",
                id: 1
              },
              minimumEdition: {
                type: "Edition",
                id: 4
              },
              maximumEdition: {
                type: "Edition",
                id: 5
              }
            },
            nested: {
              FeatureSetEditionDefault: {
                fields: {
                  edition: {
                    type: "Edition",
                    id: 3
                  },
                  overridableFeatures: {
                    type: "FeatureSet",
                    id: 4
                  },
                  fixedFeatures: {
                    type: "FeatureSet",
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
                  ],
                  "features"
                ]
              }
            }
          },
          SourceCodeInfo: {
            edition: "proto2",
            fields: {
              location: {
                rule: "repeated",
                type: "Location",
                id: 1
              }
            },
            extensions: [
              [
                536000000,
                536000000
              ]
            ],
            nested: {
              Location: {
                fields: {
                  path: {
                    rule: "repeated",
                    type: "int32",
                    id: 1,
                    options: {
                      packed: true
                    }
                  },
                  span: {
                    rule: "repeated",
                    type: "int32",
                    id: 2,
                    options: {
                      packed: true
                    }
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
            edition: "proto2",
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
                    id: 1,
                    options: {
                      packed: true
                    }
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
                  },
                  semantic: {
                    type: "Semantic",
                    id: 5
                  }
                },
                nested: {
                  Semantic: {
                    values: {
                      NONE: 0,
                      SET: 1,
                      ALIAS: 2
                    }
                  }
                }
              }
            }
          },
          SymbolVisibility: {
            edition: "proto2",
            values: {
              VISIBILITY_UNSET: 0,
              VISIBILITY_LOCAL: 1,
              VISIBILITY_EXPORT: 2
            }
          }
        }
      }
    }
  }
});

export { $root as default };
