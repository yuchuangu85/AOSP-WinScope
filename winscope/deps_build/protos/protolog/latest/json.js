/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/light";

const $root = ($protobuf.roots.protolog_latest || ($protobuf.roots.protolog_latest = new $protobuf.Root()))
.addJSON({
  perfetto: {
    nested: {
      protos: {
        nested: {
          ProtoLogMessage: {
            fields: {
              messageId: {
                type: "fixed64",
                id: 1
              },
              strParamIids: {
                rule: "repeated",
                type: "uint32",
                id: 2,
                options: {
                  packed: false
                }
              },
              sint64Params: {
                rule: "repeated",
                type: "sint64",
                id: 3,
                options: {
                  packed: false
                }
              },
              doubleParams: {
                rule: "repeated",
                type: "double",
                id: 4,
                options: {
                  packed: false
                }
              },
              booleanParams: {
                rule: "repeated",
                type: "int32",
                id: 5,
                options: {
                  packed: false
                }
              },
              stacktraceIid: {
                type: "uint32",
                id: 6
              }
            }
          },
          ProtoLogViewerConfig: {
            fields: {
              messages: {
                rule: "repeated",
                type: "MessageData",
                id: 1
              },
              groups: {
                rule: "repeated",
                type: "Group",
                id: 2
              }
            },
            nested: {
              MessageData: {
                fields: {
                  messageId: {
                    type: "fixed64",
                    id: 1
                  },
                  message: {
                    type: "string",
                    id: 2
                  },
                  level: {
                    type: "ProtoLogLevel",
                    id: 3
                  },
                  groupId: {
                    type: "uint32",
                    id: 4
                  },
                  location: {
                    type: "string",
                    id: 5
                  }
                }
              },
              Group: {
                fields: {
                  id: {
                    type: "uint32",
                    id: 1
                  },
                  name: {
                    type: "string",
                    id: 2
                  },
                  tag: {
                    type: "string",
                    id: 3
                  }
                }
              }
            }
          },
          ProtoLogLevel: {
            values: {
              PROTOLOG_LEVEL_UNDEFINED: 0,
              PROTOLOG_LEVEL_DEBUG: 1,
              PROTOLOG_LEVEL_VERBOSE: 2,
              PROTOLOG_LEVEL_INFO: 3,
              PROTOLOG_LEVEL_WARN: 4,
              PROTOLOG_LEVEL_ERROR: 5,
              PROTOLOG_LEVEL_WTF: 6
            }
          }
        }
      }
    }
  }
});

export { $root as default };
