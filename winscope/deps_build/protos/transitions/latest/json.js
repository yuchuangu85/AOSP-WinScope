/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/light";

const $root = ($protobuf.roots.transitions_latest || ($protobuf.roots.transitions_latest = new $protobuf.Root()))
.addJSON({
  perfetto: {
    nested: {
      protos: {
        nested: {
          ShellTransition: {
            fields: {
              id: {
                type: "int32",
                id: 1
              },
              createTimeNs: {
                type: "int64",
                id: 2
              },
              sendTimeNs: {
                type: "int64",
                id: 3
              },
              dispatchTimeNs: {
                type: "int64",
                id: 4
              },
              mergeTimeNs: {
                type: "int64",
                id: 5
              },
              mergeRequestTimeNs: {
                type: "int64",
                id: 6
              },
              shellAbortTimeNs: {
                type: "int64",
                id: 7
              },
              wmAbortTimeNs: {
                type: "int64",
                id: 8
              },
              finishTimeNs: {
                type: "int64",
                id: 9
              },
              startTransactionId: {
                type: "uint64",
                id: 10
              },
              finishTransactionId: {
                type: "uint64",
                id: 11
              },
              handler: {
                type: "int32",
                id: 12
              },
              type: {
                type: "int32",
                id: 13
              },
              targets: {
                rule: "repeated",
                type: "Target",
                id: 14
              },
              mergeTarget: {
                type: "int32",
                id: 15
              },
              flags: {
                type: "int32",
                id: 16
              },
              startingWindowRemoveTimeNs: {
                type: "int64",
                id: 17
              }
            },
            nested: {
              Target: {
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
          },
          ShellHandlerMappings: {
            fields: {
              mapping: {
                rule: "repeated",
                type: "ShellHandlerMapping",
                id: 1
              }
            }
          },
          ShellHandlerMapping: {
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
});

export { $root as default };
