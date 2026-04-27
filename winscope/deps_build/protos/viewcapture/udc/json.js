/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/light";

const $root = ($protobuf.roots.viewcapture_udc || ($protobuf.roots.viewcapture_udc = new $protobuf.Root()))
.addJSON({
  com: {
    nested: {
      android: {
        nested: {
          app: {
            nested: {
              viewcapture: {
                nested: {
                  data: {
                    options: {
                      java_multiple_files: true
                    },
                    nested: {
                      ExportedData: {
                        edition: "proto2",
                        fields: {
                          magicNumber: {
                            type: "fixed64",
                            id: 1
                          },
                          windowData: {
                            rule: "repeated",
                            type: "WindowData",
                            id: 2
                          },
                          "package": {
                            type: "string",
                            id: 3
                          },
                          classname: {
                            rule: "repeated",
                            type: "string",
                            id: 4
                          },
                          realToElapsedTimeOffsetNanos: {
                            type: "fixed64",
                            id: 5
                          }
                        },
                        nested: {
                          MagicNumber: {
                            values: {
                              INVALID: 0,
                              MAGIC_NUMBER_L: 1703961976,
                              MAGIC_NUMBER_H: 1751482995
                            }
                          }
                        }
                      },
                      WindowData: {
                        edition: "proto2",
                        fields: {
                          frameData: {
                            rule: "repeated",
                            type: "FrameData",
                            id: 1
                          },
                          title: {
                            type: "string",
                            id: 2
                          }
                        }
                      },
                      MotionWindowData: {
                        edition: "proto2",
                        fields: {
                          frameData: {
                            rule: "repeated",
                            type: "FrameData",
                            id: 1
                          },
                          classname: {
                            rule: "repeated",
                            type: "string",
                            id: 2
                          }
                        }
                      },
                      FrameData: {
                        edition: "proto2",
                        fields: {
                          timestamp: {
                            type: "int64",
                            id: 1
                          },
                          node: {
                            type: "ViewNode",
                            id: 2
                          }
                        }
                      },
                      ViewNode: {
                        edition: "proto2",
                        fields: {
                          classnameIndex: {
                            type: "int32",
                            id: 1
                          },
                          hashcode: {
                            type: "int32",
                            id: 2
                          },
                          children: {
                            rule: "repeated",
                            type: "ViewNode",
                            id: 3
                          },
                          id: {
                            type: "string",
                            id: 4
                          },
                          left: {
                            type: "int32",
                            id: 5
                          },
                          top: {
                            type: "int32",
                            id: 6
                          },
                          width: {
                            type: "int32",
                            id: 7
                          },
                          height: {
                            type: "int32",
                            id: 8
                          },
                          scrollX: {
                            type: "int32",
                            id: 9
                          },
                          scrollY: {
                            type: "int32",
                            id: 10
                          },
                          translationX: {
                            type: "float",
                            id: 11
                          },
                          translationY: {
                            type: "float",
                            id: 12
                          },
                          scaleX: {
                            type: "float",
                            id: 13,
                            options: {
                              "default": 1
                            }
                          },
                          scaleY: {
                            type: "float",
                            id: 14,
                            options: {
                              "default": 1
                            }
                          },
                          alpha: {
                            type: "float",
                            id: 15,
                            options: {
                              "default": 1
                            }
                          },
                          willNotDraw: {
                            type: "bool",
                            id: 16
                          },
                          clipChildren: {
                            type: "bool",
                            id: 17
                          },
                          visibility: {
                            type: "int32",
                            id: 18
                          },
                          elevation: {
                            type: "float",
                            id: 19
                          }
                        }
                      }
                    }
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
