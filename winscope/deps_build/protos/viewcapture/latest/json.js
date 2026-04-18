/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/light";

const $root = ($protobuf.roots.viewcapture_latest || ($protobuf.roots.viewcapture_latest = new $protobuf.Root()))
.addJSON({
  perfetto: {
    nested: {
      protos: {
        nested: {
          Wrapper: {
            fields: {
              viewcapture: {
                type: "ViewCapture",
                id: 1
              }
            }
          },
          ViewCapture: {
            fields: {
              packageNameIid: {
                type: "int32",
                id: 1
              },
              windowNameIid: {
                type: "int32",
                id: 2
              },
              views: {
                rule: "repeated",
                type: "View",
                id: 3
              }
            },
            nested: {
              View: {
                fields: {
                  id: {
                    type: "int32",
                    id: 1
                  },
                  parentId: {
                    type: "int32",
                    id: 2
                  },
                  hashcode: {
                    type: "int32",
                    id: 3
                  },
                  viewIdIid: {
                    type: "int32",
                    id: 4
                  },
                  classNameIid: {
                    type: "int32",
                    id: 5
                  },
                  left: {
                    type: "int32",
                    id: 6
                  },
                  top: {
                    type: "int32",
                    id: 7
                  },
                  width: {
                    type: "int32",
                    id: 8
                  },
                  height: {
                    type: "int32",
                    id: 9
                  },
                  scrollX: {
                    type: "int32",
                    id: 10
                  },
                  scrollY: {
                    type: "int32",
                    id: 11
                  },
                  translationX: {
                    type: "float",
                    id: 12
                  },
                  translationY: {
                    type: "float",
                    id: 13
                  },
                  scaleX: {
                    type: "float",
                    id: 14
                  },
                  scaleY: {
                    type: "float",
                    id: 15
                  },
                  alpha: {
                    type: "float",
                    id: 16
                  },
                  willNotDraw: {
                    type: "bool",
                    id: 17
                  },
                  clipChildren: {
                    type: "bool",
                    id: 18
                  },
                  visibility: {
                    type: "int32",
                    id: 19
                  },
                  elevation: {
                    type: "float",
                    id: 20
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
