/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/light";

const $root = ($protobuf.roots.transitions_udc || ($protobuf.roots.transitions_udc = new $protobuf.Root()))
.addJSON({
  com: {
    nested: {
      android: {
        nested: {
          server: {
            nested: {
              wm: {
                nested: {
                  shell: {
                    options: {
                      java_multiple_files: true
                    },
                    nested: {
                      TransitionTraceProto: {
                        edition: "proto2",
                        fields: {
                          magicNumber: {
                            type: "fixed64",
                            id: 1
                          },
                          transitions: {
                            rule: "repeated",
                            type: "Transition",
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
                              MAGIC_NUMBER_L: 1414419028,
                              MAGIC_NUMBER_H: 1162035538
                            }
                          }
                        }
                      },
                      Transition: {
                        edition: "proto2",
                        fields: {
                          id: {
                            type: "int32",
                            id: 1
                          },
                          startTransactionId: {
                            type: "uint64",
                            id: 2
                          },
                          finishTransactionId: {
                            type: "uint64",
                            id: 3
                          },
                          createTimeNs: {
                            type: "int64",
                            id: 4
                          },
                          sendTimeNs: {
                            type: "int64",
                            id: 5
                          },
                          finishTimeNs: {
                            type: "int64",
                            id: 6
                          },
                          type: {
                            type: "int32",
                            id: 7
                          },
                          targets: {
                            rule: "repeated",
                            type: "Target",
                            id: 8
                          },
                          flags: {
                            type: "int32",
                            id: 9
                          },
                          abortTimeNs: {
                            type: "int64",
                            id: 10
                          },
                          startingWindowRemoveTimeNs: {
                            type: "int64",
                            id: 11
                          }
                        }
                      },
                      Target: {
                        edition: "proto2",
                        fields: {
                          mode: {
                            type: "int32",
                            id: 1
                          },
                          layerId: {
                            type: "int32",
                            id: 2
                          },
                          windowId: {
                            type: "int32",
                            id: 3
                          },
                          flags: {
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
          },
          wm: {
            nested: {
              shell: {
                options: {
                  java_multiple_files: true
                },
                nested: {
                  WmShellTransitionTraceProto: {
                    edition: "proto2",
                    fields: {
                      magicNumber: {
                        type: "fixed64",
                        id: 1
                      },
                      transitions: {
                        rule: "repeated",
                        type: "Transition",
                        id: 2
                      },
                      handlerMappings: {
                        rule: "repeated",
                        type: "HandlerMapping",
                        id: 3
                      },
                      realToElapsedTimeOffsetNanos: {
                        type: "fixed64",
                        id: 4
                      }
                    },
                    nested: {
                      MagicNumber: {
                        values: {
                          INVALID: 0,
                          MAGIC_NUMBER_L: 1414745431,
                          MAGIC_NUMBER_H: 1162035538
                        }
                      }
                    }
                  },
                  Transition: {
                    edition: "proto2",
                    fields: {
                      id: {
                        type: "int32",
                        id: 1
                      },
                      dispatchTimeNs: {
                        type: "int64",
                        id: 2
                      },
                      handler: {
                        type: "int32",
                        id: 3
                      },
                      mergeTimeNs: {
                        type: "int64",
                        id: 4
                      },
                      mergeRequestTimeNs: {
                        type: "int64",
                        id: 5
                      },
                      mergeTarget: {
                        type: "int32",
                        id: 6
                      },
                      abortTimeNs: {
                        type: "int64",
                        id: 7
                      }
                    }
                  },
                  HandlerMapping: {
                    edition: "proto2",
                    fields: {
                      id: {
                        type: "int32",
                        id: 1
                      },
                      name: {
                        type: "string",
                        id: 2
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
