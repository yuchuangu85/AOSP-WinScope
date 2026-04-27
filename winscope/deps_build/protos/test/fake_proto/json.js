/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/light";

const $root = ($protobuf.roots.test_fake_proto || ($protobuf.roots.test_fake_proto = new $protobuf.Root()))
.addJSON({
  winscope: {
    nested: {
      test: {
        nested: {
          RootMessage: {
            edition: "proto2",
            fields: {
              entry: {
                type: "Entry",
                id: 1
              }
            }
          },
          Enum0: {
            edition: "proto2",
            values: {
              ENUM0_VALUE_ZERO: 0,
              ENUM0_VALUE_ONE: 1
            }
          },
          Entry: {
            edition: "proto2",
            fields: {
              enum0: {
                type: "Enum0",
                id: 1
              },
              enum1: {
                type: "Enum1",
                id: 2
              },
              array: {
                rule: "repeated",
                type: "int32",
                id: 3
              },
              number_32bit: {
                type: "int32",
                id: 4
              },
              number_64bit: {
                type: "int64",
                id: 5
              },
              _case_64bit: {
                type: "int64",
                id: 6
              },
              case_64bit: {
                type: "int64",
                id: 7
              },
              case_64bitLsb: {
                type: "int64",
                id: 8
              },
              case_64Bit: {
                type: "int64",
                id: 9
              },
              case_64BitLsb: {
                type: "int64",
                id: 10
              },
              boolValue: {
                type: "bool",
                id: 11
              }
            },
            nested: {
              Enum1: {
                values: {
                  ENUM1_VALUE_ZERO: 0,
                  ENUM1_VALUE_ONE: 1
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
