/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/light";

const $root = ($protobuf.roots.test_intdef_translation || ($protobuf.roots.test_intdef_translation = new $protobuf.Root()))
.addJSON({
  winscope: {
    nested: {
      test: {
        nested: {
          RootMessage: {
            edition: "proto2",
            fields: {
              inputWindowInfo: {
                type: "InputWindowInfoProto",
                id: 1
              }
            }
          },
          InputWindowInfoProto: {
            edition: "proto2",
            fields: {
              layoutParamsFlags: {
                type: "int32",
                id: 1
              },
              inputConfig: {
                type: "int32",
                id: 2,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowInsets.Side.InsetsSide"
                }
              },
              testAndroidTypedef: {
                type: "int32",
                id: 3,
                options: {
                  "(.android.typedef)": "android.content.pm.ActivityInfo.ScreenOrientation"
                }
              },
              testAndroidCommonTypedef: {
                type: "int32",
                id: 4,
                options: {
                  "(.android_common.typedef)": "android.view.WindowManager.TransitionFlags"
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
