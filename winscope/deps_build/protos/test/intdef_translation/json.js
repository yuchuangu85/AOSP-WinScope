/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/light";

const $root = ($protobuf.roots.test_intdef_translation || ($protobuf.roots.test_intdef_translation = new $protobuf.Root()))
.addJSON({
  winscope: {
    nested: {
      test: {
        nested: {
          RootMessage: {
            fields: {
              intdefMappingEntry: {
                type: "InputWindowInfoProto",
                id: 1
              },
              windowLayoutParams: {
                type: "WindowLayoutParamsProto",
                id: 2
              }
            }
          },
          InputWindowInfoProto: {
            fields: {
              layoutParamsFlags: {
                type: "int32",
                id: 1
              },
              inputConfig: {
                type: "int32",
                id: 2
              }
            }
          },
          WindowLayoutParamsProto: {
            options: {
              "(.android.msg_privacy).dest": "DEST_AUTOMATIC"
            },
            fields: {
              type: {
                type: "int32",
                id: 1,
                options: {
                  "(.android.typedef)": "android.view.WindowManager.LayoutParams.WindowType"
                }
              },
              gravity: {
                type: "int32",
                id: 8,
                options: {
                  "(.android.typedef)": "android.view.Gravity.GravityFlags"
                }
              },
              softInputMode: {
                type: "int32",
                id: 9,
                options: {
                  "(.android.typedef)": "android.view.WindowManager.LayoutParams.SoftInputModeFlags"
                }
              },
              inputFeatureFlags: {
                type: "uint32",
                id: 19,
                options: {
                  "(.android.typedef)": "android.view.WindowManager.LayoutParams.InputFeatureFlags"
                }
              },
              flags: {
                type: "uint32",
                id: 24,
                options: {
                  "(.android.typedef)": "android.view.WindowManager.LayoutParams.Flags"
                }
              },
              systemUiVisibilityFlags: {
                type: "uint32",
                id: 27,
                options: {
                  "(.android.typedef)": "android.view.WindowManager.LayoutParams.SystemUiVisibilityFlags"
                }
              },
              subtreeSystemUiVisibilityFlags: {
                type: "uint32",
                id: 28,
                options: {
                  "(.android.typedef)": "android.view.WindowManager.LayoutParams.SystemUiVisibilityFlags"
                }
              },
              appearance: {
                type: "uint32",
                id: 29,
                options: {
                  "(.android.typedef)": "android.view.WindowInsetsController.Appearance"
                }
              },
              behavior: {
                type: "uint32",
                id: 30,
                options: {
                  "(.android.typedef)": "android.view.WindowInsetsController.Behavior"
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
