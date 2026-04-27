/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/light";

const $root = ($protobuf.roots.windowmanager_udc || ($protobuf.roots.windowmanager_udc = new $protobuf.Root()))
.setOptions({
  optimize_for: "LITE_RUNTIME"
})
.addJSON({
  com: {
    nested: {
      android: {
        nested: {
          server: {
            nested: {
              wm: {
                options: {
                  java_multiple_files: true
                },
                nested: {
                  WindowManagerTraceFileProto: {
                    edition: "proto2",
                    fields: {
                      magicNumber: {
                        type: "fixed64",
                        id: 1
                      },
                      entry: {
                        rule: "repeated",
                        type: "WindowManagerTraceProto",
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
                          MAGIC_NUMBER_L: 1414416727,
                          MAGIC_NUMBER_H: 1162035538
                        }
                      }
                    }
                  },
                  WindowManagerTraceProto: {
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
                      windowManagerService: {
                        type: "WindowManagerServiceDumpProto",
                        id: 3
                      }
                    }
                  },
                  WindowManagerServiceDumpProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      policy: {
                        type: "WindowManagerPolicyProto",
                        id: 1
                      },
                      rootWindowContainer: {
                        type: "RootWindowContainerProto",
                        id: 2
                      },
                      focusedWindow: {
                        type: "IdentifierProto",
                        id: 3
                      },
                      focusedApp: {
                        type: "string",
                        id: 4
                      },
                      inputMethodWindow: {
                        type: "IdentifierProto",
                        id: 5
                      },
                      displayFrozen: {
                        type: "bool",
                        id: 6
                      },
                      rotation: {
                        type: "int32",
                        id: 7,
                        options: {
                          "(.android_common.typedef)": "android.view.Surface.Rotation",
                          deprecated: true
                        }
                      },
                      lastOrientation: {
                        type: "int32",
                        id: 8,
                        options: {
                          "(.android_common.typedef)": "android.content.pm.ActivityInfo.ScreenOrientation",
                          deprecated: true
                        }
                      },
                      focusedDisplayId: {
                        type: "int32",
                        id: 9
                      },
                      hardKeyboardAvailable: {
                        type: "bool",
                        id: 10
                      },
                      windowFramesValid: {
                        type: "bool",
                        id: 11
                      },
                      backNavigation: {
                        type: "BackNavigationProto",
                        id: 12
                      }
                    }
                  },
                  RootWindowContainerProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      windowContainer: {
                        type: "WindowContainerProto",
                        id: 1
                      },
                      displays: {
                        rule: "repeated",
                        type: "DisplayContentProto",
                        id: 2,
                        options: {
                          deprecated: true
                        }
                      },
                      windows: {
                        rule: "repeated",
                        type: "WindowStateProto",
                        id: 4,
                        options: {
                          deprecated: true
                        }
                      },
                      keyguardController: {
                        type: "KeyguardControllerProto",
                        id: 5
                      },
                      isHomeRecentsComponent: {
                        type: "bool",
                        id: 6
                      },
                      pendingActivities: {
                        rule: "repeated",
                        type: "IdentifierProto",
                        id: 7,
                        options: {
                          deprecated: true
                        }
                      },
                      defaultMinSizeResizableTask: {
                        type: "int32",
                        id: 8,
                        options: {
                          deprecated: true
                        }
                      }
                    },
                    reserved: [
                      [
                        3,
                        3
                      ]
                    ]
                  },
                  BarControllerProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      state: {
                        type: ".android_common.app.StatusBarManagerProto.WindowState",
                        id: 1
                      },
                      transientState: {
                        type: ".android_common.app.StatusBarManagerProto.TransientWindowState",
                        id: 2
                      }
                    }
                  },
                  WindowOrientationListenerProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      enabled: {
                        type: "bool",
                        id: 1
                      },
                      rotation: {
                        type: ".android_common.view.SurfaceProto.Rotation",
                        id: 2
                      }
                    }
                  },
                  KeyguardServiceDelegateProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      showing: {
                        type: "bool",
                        id: 1
                      },
                      occluded: {
                        type: "bool",
                        id: 2
                      },
                      secure: {
                        type: "bool",
                        id: 3
                      },
                      screenState: {
                        type: "ScreenState",
                        id: 4
                      },
                      interactiveState: {
                        type: "InteractiveState",
                        id: 5
                      }
                    },
                    nested: {
                      ScreenState: {
                        values: {
                          SCREEN_STATE_OFF: 0,
                          SCREEN_STATE_TURNING_ON: 1,
                          SCREEN_STATE_ON: 2,
                          SCREEN_STATE_TURNING_OFF: 3
                        }
                      },
                      InteractiveState: {
                        values: {
                          INTERACTIVE_STATE_SLEEP: 0,
                          INTERACTIVE_STATE_WAKING: 1,
                          INTERACTIVE_STATE_AWAKE: 2,
                          INTERACTIVE_STATE_GOING_TO_SLEEP: 3
                        }
                      }
                    }
                  },
                  KeyguardControllerProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      keyguardShowing: {
                        type: "bool",
                        id: 1
                      },
                      keyguardOccludedStates: {
                        rule: "repeated",
                        type: "KeyguardOccludedProto",
                        id: 2,
                        options: {
                          deprecated: true
                        }
                      },
                      aodShowing: {
                        type: "bool",
                        id: 3
                      },
                      keyguardPerDisplay: {
                        rule: "repeated",
                        type: "KeyguardPerDisplayProto",
                        id: 4
                      },
                      keyguardGoingAway: {
                        type: "bool",
                        id: 5
                      }
                    }
                  },
                  KeyguardOccludedProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      displayId: {
                        type: "int32",
                        id: 1
                      },
                      keyguardOccluded: {
                        type: "bool",
                        id: 2
                      }
                    }
                  },
                  KeyguardPerDisplayProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      displayId: {
                        type: "int32",
                        id: 1
                      },
                      keyguardShowing: {
                        type: "bool",
                        id: 2
                      },
                      aodShowing: {
                        type: "bool",
                        id: 3
                      },
                      keyguardOccluded: {
                        type: "bool",
                        id: 4
                      },
                      keyguardGoingAway: {
                        type: "bool",
                        id: 5
                      }
                    }
                  },
                  WindowManagerPolicyProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      lastSystemUiFlags: {
                        type: "int32",
                        id: 1,
                        options: {
                          deprecated: true
                        }
                      },
                      rotationMode: {
                        type: "UserRotationMode",
                        id: 2
                      },
                      rotation: {
                        type: ".android_common.view.SurfaceProto.Rotation",
                        id: 3
                      },
                      orientation: {
                        type: ".android_common.content.ActivityInfoProto.ScreenOrientation",
                        id: 4
                      },
                      screenOnFully: {
                        type: "bool",
                        id: 5
                      },
                      keyguardDrawComplete: {
                        type: "bool",
                        id: 6
                      },
                      windowManagerDrawComplete: {
                        type: "bool",
                        id: 7
                      },
                      focusedAppToken: {
                        type: "string",
                        id: 8,
                        options: {
                          deprecated: true
                        }
                      },
                      focusedWindow: {
                        type: "IdentifierProto",
                        id: 9,
                        options: {
                          deprecated: true
                        }
                      },
                      topFullscreenOpaqueWindow: {
                        type: "IdentifierProto",
                        id: 10,
                        options: {
                          deprecated: true
                        }
                      },
                      topFullscreenOpaqueOrDimmingWindow: {
                        type: "IdentifierProto",
                        id: 11,
                        options: {
                          deprecated: true
                        }
                      },
                      keyguardOccluded: {
                        type: "bool",
                        id: 12
                      },
                      keyguardOccludedChanged: {
                        type: "bool",
                        id: 13
                      },
                      keyguardOccludedPending: {
                        type: "bool",
                        id: 14
                      },
                      forceStatusBar: {
                        type: "bool",
                        id: 15,
                        options: {
                          deprecated: true
                        }
                      },
                      forceStatusBarFromKeyguard: {
                        type: "bool",
                        id: 16,
                        options: {
                          deprecated: true
                        }
                      },
                      statusBar: {
                        type: "BarControllerProto",
                        id: 17,
                        options: {
                          deprecated: true
                        }
                      },
                      navigationBar: {
                        type: "BarControllerProto",
                        id: 18,
                        options: {
                          deprecated: true
                        }
                      },
                      orientationListener: {
                        type: "WindowOrientationListenerProto",
                        id: 19,
                        options: {
                          deprecated: true
                        }
                      },
                      keyguardDelegate: {
                        type: "KeyguardServiceDelegateProto",
                        id: 20
                      }
                    },
                    nested: {
                      UserRotationMode: {
                        values: {
                          USER_ROTATION_FREE: 0,
                          USER_ROTATION_LOCKED: 1
                        }
                      }
                    }
                  },
                  AppTransitionProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      appTransitionState: {
                        type: "AppState",
                        id: 1
                      },
                      lastUsedAppTransition: {
                        type: ".android_common.view.TransitionTypeEnum",
                        id: 2
                      }
                    },
                    nested: {
                      AppState: {
                        values: {
                          APP_STATE_IDLE: 0,
                          APP_STATE_READY: 1,
                          APP_STATE_RUNNING: 2,
                          APP_STATE_TIMEOUT: 3
                        }
                      }
                    }
                  },
                  DisplayContentProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      windowContainer: {
                        type: "WindowContainerProto",
                        id: 1,
                        options: {
                          deprecated: true
                        }
                      },
                      id: {
                        type: "int32",
                        id: 2
                      },
                      dockedTaskDividerController: {
                        type: "DockedTaskDividerControllerProto",
                        id: 4,
                        options: {
                          deprecated: true
                        }
                      },
                      pinnedTaskController: {
                        type: "PinnedTaskControllerProto",
                        id: 5,
                        options: {
                          deprecated: true
                        }
                      },
                      aboveAppWindows: {
                        rule: "repeated",
                        type: "WindowTokenProto",
                        id: 6,
                        options: {
                          deprecated: true
                        }
                      },
                      belowAppWindows: {
                        rule: "repeated",
                        type: "WindowTokenProto",
                        id: 7,
                        options: {
                          deprecated: true
                        }
                      },
                      imeWindows: {
                        rule: "repeated",
                        type: "WindowTokenProto",
                        id: 8,
                        options: {
                          deprecated: true
                        }
                      },
                      dpi: {
                        type: "int32",
                        id: 9
                      },
                      displayInfo: {
                        type: ".android_common.view.DisplayInfoProto",
                        id: 10
                      },
                      rotation: {
                        type: "int32",
                        id: 11,
                        options: {
                          "(.android_common.typedef)": "android.view.Surface.Rotation",
                          deprecated: true
                        }
                      },
                      screenRotationAnimation: {
                        type: "ScreenRotationAnimationProto",
                        id: 12
                      },
                      displayFrames: {
                        type: "DisplayFramesProto",
                        id: 13
                      },
                      surfaceSize: {
                        type: "int32",
                        id: 14,
                        options: {
                          deprecated: true
                        }
                      },
                      focusedApp: {
                        type: "string",
                        id: 15
                      },
                      appTransition: {
                        type: "AppTransitionProto",
                        id: 16
                      },
                      openingApps: {
                        rule: "repeated",
                        type: "IdentifierProto",
                        id: 17
                      },
                      closingApps: {
                        rule: "repeated",
                        type: "IdentifierProto",
                        id: 18
                      },
                      changingApps: {
                        rule: "repeated",
                        type: "IdentifierProto",
                        id: 19
                      },
                      overlayWindows: {
                        rule: "repeated",
                        type: "WindowTokenProto",
                        id: 20,
                        options: {
                          deprecated: true
                        }
                      },
                      rootDisplayArea: {
                        type: "DisplayAreaProto",
                        id: 21
                      },
                      singleTaskInstance: {
                        type: "bool",
                        id: 22,
                        options: {
                          deprecated: true
                        }
                      },
                      focusedRootTaskId: {
                        type: "int32",
                        id: 23
                      },
                      resumedActivity: {
                        type: ".com.android.server.wm.IdentifierProto",
                        id: 24
                      },
                      tasks: {
                        rule: "repeated",
                        type: "TaskProto",
                        id: 25,
                        options: {
                          deprecated: true
                        }
                      },
                      displayReady: {
                        type: "bool",
                        id: 26
                      },
                      inputMethodTarget: {
                        type: "WindowStateProto",
                        id: 27,
                        options: {
                          deprecated: true
                        }
                      },
                      inputMethodInputTarget: {
                        type: "WindowStateProto",
                        id: 28,
                        options: {
                          deprecated: true
                        }
                      },
                      inputMethodControlTarget: {
                        type: "WindowStateProto",
                        id: 29,
                        options: {
                          deprecated: true
                        }
                      },
                      currentFocus: {
                        type: "WindowStateProto",
                        id: 30,
                        options: {
                          deprecated: true
                        }
                      },
                      imeInsetsSourceProvider: {
                        type: "ImeInsetsSourceProviderProto",
                        id: 31
                      },
                      canShowIme: {
                        type: "bool",
                        id: 32,
                        options: {
                          deprecated: true
                        }
                      },
                      displayRotation: {
                        type: "DisplayRotationProto",
                        id: 33
                      },
                      imePolicy: {
                        type: "int32",
                        id: 34
                      },
                      insetsSourceProviders: {
                        rule: "repeated",
                        type: "InsetsSourceProviderProto",
                        id: 35
                      },
                      isSleeping: {
                        type: "bool",
                        id: 36
                      },
                      sleepTokens: {
                        rule: "repeated",
                        type: "string",
                        id: 37
                      },
                      keepClearAreas: {
                        rule: "repeated",
                        type: ".android_common.graphics.RectProto",
                        id: 38
                      },
                      minSizeOfResizeableTaskDp: {
                        type: "int32",
                        id: 39
                      },
                      inputMethodLayeringTargetIdentifier: {
                        type: "IdentifierProto",
                        id: 40
                      },
                      inputMethodInputTargetIdentifier: {
                        type: "IdentifierProto",
                        id: 41
                      },
                      inputMethodControlTargetIdentifier: {
                        type: "IdentifierProto",
                        id: 42
                      },
                      currentFocusIdentifier: {
                        type: "IdentifierProto",
                        id: 43
                      },
                      remoteInsetsControlTarget: {
                        type: "RemoteInsetsControlTargetProto",
                        id: 44
                      }
                    },
                    reserved: [
                      [
                        3,
                        3
                      ]
                    ]
                  },
                  DisplayAreaProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      windowContainer: {
                        type: "WindowContainerProto",
                        id: 1
                      },
                      name: {
                        type: "string",
                        id: 2,
                        options: {
                          "(.android_common.privacy).dest": "DEST_EXPLICIT"
                        }
                      },
                      children: {
                        rule: "repeated",
                        type: "DisplayAreaChildProto",
                        id: 3,
                        options: {
                          deprecated: true
                        }
                      },
                      isTaskDisplayArea: {
                        type: "bool",
                        id: 4
                      },
                      isRootDisplayArea: {
                        type: "bool",
                        id: 5
                      },
                      featureId: {
                        type: "int32",
                        id: 6
                      },
                      isOrganized: {
                        type: "bool",
                        id: 7
                      },
                      isIgnoringOrientationRequest: {
                        type: "bool",
                        id: 8
                      }
                    }
                  },
                  DisplayAreaChildProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      displayArea: {
                        type: "DisplayAreaProto",
                        id: 1
                      },
                      window: {
                        type: "WindowTokenProto",
                        id: 2
                      },
                      unknown: {
                        rule: "repeated",
                        type: "string",
                        id: 3
                      }
                    }
                  },
                  DisplayFramesProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      stableBounds: {
                        type: ".android_common.graphics.RectProto",
                        id: 1,
                        options: {
                          deprecated: true
                        }
                      },
                      dock: {
                        type: ".android_common.graphics.RectProto",
                        id: 2,
                        options: {
                          deprecated: true
                        }
                      },
                      current: {
                        type: ".android_common.graphics.RectProto",
                        id: 3,
                        options: {
                          deprecated: true
                        }
                      }
                    }
                  },
                  DisplayRotationProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      rotation: {
                        type: "int32",
                        id: 1,
                        options: {
                          "(.android_common.typedef)": "android.view.Surface.Rotation"
                        }
                      },
                      frozenToUserRotation: {
                        type: "bool",
                        id: 2
                      },
                      userRotation: {
                        type: "int32",
                        id: 3,
                        options: {
                          "(.android_common.typedef)": "android.view.Surface.Rotation"
                        }
                      },
                      fixedToUserRotationMode: {
                        type: "int32",
                        id: 4
                      },
                      lastOrientation: {
                        type: "int32",
                        id: 5,
                        options: {
                          "(.android_common.typedef)": "android.content.pm.ActivityInfo.ScreenOrientation"
                        }
                      },
                      isFixedToUserRotation: {
                        type: "bool",
                        id: 6
                      }
                    }
                  },
                  DockedTaskDividerControllerProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      minimizedDock: {
                        type: "bool",
                        id: 1,
                        options: {
                          deprecated: true
                        }
                      }
                    }
                  },
                  PinnedTaskControllerProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      defaultBounds: {
                        type: ".android_common.graphics.RectProto",
                        id: 1,
                        options: {
                          deprecated: true
                        }
                      },
                      movementBounds: {
                        type: ".android_common.graphics.RectProto",
                        id: 2,
                        options: {
                          deprecated: true
                        }
                      }
                    }
                  },
                  TaskProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      windowContainer: {
                        type: "WindowContainerProto",
                        id: 1,
                        options: {
                          deprecated: true
                        }
                      },
                      id: {
                        type: "int32",
                        id: 2
                      },
                      fillsParent: {
                        type: "bool",
                        id: 4
                      },
                      bounds: {
                        type: ".android_common.graphics.RectProto",
                        id: 5
                      },
                      displayedBounds: {
                        type: ".android_common.graphics.RectProto",
                        id: 6,
                        options: {
                          deprecated: true
                        }
                      },
                      deferRemoval: {
                        type: "bool",
                        id: 7
                      },
                      surfaceWidth: {
                        type: "int32",
                        id: 8
                      },
                      surfaceHeight: {
                        type: "int32",
                        id: 9
                      },
                      tasks: {
                        rule: "repeated",
                        type: "TaskProto",
                        id: 10,
                        options: {
                          deprecated: true
                        }
                      },
                      activities: {
                        rule: "repeated",
                        type: "ActivityRecordProto",
                        id: 11,
                        options: {
                          deprecated: true
                        }
                      },
                      resumedActivity: {
                        type: ".com.android.server.wm.IdentifierProto",
                        id: 12
                      },
                      realActivity: {
                        type: "string",
                        id: 13
                      },
                      origActivity: {
                        type: "string",
                        id: 14
                      },
                      displayId: {
                        type: "int32",
                        id: 15,
                        options: {
                          deprecated: true
                        }
                      },
                      rootTaskId: {
                        type: "int32",
                        id: 16
                      },
                      activityType: {
                        type: "int32",
                        id: 17,
                        options: {
                          "(.android_common.typedef)": "android.app.WindowConfiguration.ActivityType",
                          deprecated: true
                        }
                      },
                      resizeMode: {
                        type: "int32",
                        id: 18,
                        options: {
                          "(.android_common.typedef)": "android.appwidget.AppWidgetProviderInfo.ResizeModeFlags"
                        }
                      },
                      minWidth: {
                        type: "int32",
                        id: 19,
                        options: {
                          deprecated: true
                        }
                      },
                      minHeight: {
                        type: "int32",
                        id: 20,
                        options: {
                          deprecated: true
                        }
                      },
                      adjustedBounds: {
                        type: ".android_common.graphics.RectProto",
                        id: 21
                      },
                      lastNonFullscreenBounds: {
                        type: ".android_common.graphics.RectProto",
                        id: 22
                      },
                      adjustedForIme: {
                        type: "bool",
                        id: 23
                      },
                      adjustImeAmount: {
                        type: "float",
                        id: 24
                      },
                      adjustDividerAmount: {
                        type: "float",
                        id: 25
                      },
                      animatingBounds: {
                        type: "bool",
                        id: 26,
                        options: {
                          deprecated: true
                        }
                      },
                      minimizeAmount: {
                        type: "float",
                        id: 27
                      },
                      createdByOrganizer: {
                        type: "bool",
                        id: 28
                      },
                      affinity: {
                        type: "string",
                        id: 29
                      },
                      hasChildPipActivity: {
                        type: "bool",
                        id: 30
                      },
                      taskFragment: {
                        type: "TaskFragmentProto",
                        id: 31
                      },
                      taskName: {
                        type: "string",
                        id: 32
                      }
                    },
                    reserved: [
                      [
                        3,
                        3
                      ]
                    ]
                  },
                  TaskFragmentProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      windowContainer: {
                        type: "WindowContainerProto",
                        id: 1
                      },
                      displayId: {
                        type: "int32",
                        id: 2
                      },
                      activityType: {
                        type: "int32",
                        id: 3,
                        options: {
                          "(.android_common.typedef)": "android.app.WindowConfiguration.ActivityType"
                        }
                      },
                      minWidth: {
                        type: "int32",
                        id: 4
                      },
                      minHeight: {
                        type: "int32",
                        id: 5
                      }
                    }
                  },
                  ActivityRecordProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      name: {
                        type: "string",
                        id: 1,
                        options: {
                          "(.android_common.privacy).dest": "DEST_EXPLICIT"
                        }
                      },
                      windowToken: {
                        type: "WindowTokenProto",
                        id: 2
                      },
                      lastSurfaceShowing: {
                        type: "bool",
                        id: 3
                      },
                      isWaitingForTransitionStart: {
                        type: "bool",
                        id: 4
                      },
                      isAnimating: {
                        type: "bool",
                        id: 5
                      },
                      thumbnail: {
                        type: "WindowContainerThumbnailProto",
                        id: 6
                      },
                      fillsParent: {
                        type: "bool",
                        id: 7
                      },
                      appStopped: {
                        type: "bool",
                        id: 8
                      },
                      visibleRequested: {
                        type: "bool",
                        id: 9
                      },
                      clientVisible: {
                        type: "bool",
                        id: 10
                      },
                      deferHidingClient: {
                        type: "bool",
                        id: 11
                      },
                      reportedDrawn: {
                        type: "bool",
                        id: 12
                      },
                      reportedVisible: {
                        type: "bool",
                        id: 13
                      },
                      numInterestingWindows: {
                        type: "int32",
                        id: 14
                      },
                      numDrawnWindows: {
                        type: "int32",
                        id: 15
                      },
                      allDrawn: {
                        type: "bool",
                        id: 16
                      },
                      lastAllDrawn: {
                        type: "bool",
                        id: 17
                      },
                      startingWindow: {
                        type: "IdentifierProto",
                        id: 19
                      },
                      startingDisplayed: {
                        type: "bool",
                        id: 20
                      },
                      startingMoved: {
                        type: "bool",
                        id: 201
                      },
                      visibleSetFromTransferredStartingWindow: {
                        type: "bool",
                        id: 22
                      },
                      frozenBounds: {
                        rule: "repeated",
                        type: ".android_common.graphics.RectProto",
                        id: 23,
                        options: {
                          deprecated: true
                        }
                      },
                      visible: {
                        type: "bool",
                        id: 24
                      },
                      identifier: {
                        type: "IdentifierProto",
                        id: 26,
                        options: {
                          deprecated: true
                        }
                      },
                      state: {
                        type: "string",
                        id: 27,
                        options: {
                          "(.android_common.privacy).dest": "DEST_EXPLICIT"
                        }
                      },
                      frontOfTask: {
                        type: "bool",
                        id: 28
                      },
                      procId: {
                        type: "int32",
                        id: 29
                      },
                      translucent: {
                        type: "bool",
                        id: 30
                      },
                      pipAutoEnterEnabled: {
                        type: "bool",
                        id: 31
                      },
                      inSizeCompatMode: {
                        type: "bool",
                        id: 32
                      },
                      minAspectRatio: {
                        type: "float",
                        id: 33
                      },
                      providesMaxBounds: {
                        type: "bool",
                        id: 34
                      },
                      enableRecentsScreenshot: {
                        type: "bool",
                        id: 35
                      },
                      lastDropInputMode: {
                        type: "int32",
                        id: 36
                      },
                      overrideOrientation: {
                        type: "int32",
                        id: 37,
                        options: {
                          "(.android_common.typedef)": "android.content.pm.ActivityInfo.ScreenOrientation"
                        }
                      },
                      shouldSendCompatFakeFocus: {
                        type: "bool",
                        id: 38
                      },
                      shouldForceRotateForCameraCompat: {
                        type: "bool",
                        id: 39
                      },
                      shouldRefreshActivityForCameraCompat: {
                        type: "bool",
                        id: 40
                      },
                      shouldRefreshActivityViaPauseForCameraCompat: {
                        type: "bool",
                        id: 41
                      },
                      shouldOverrideMinAspectRatio: {
                        type: "bool",
                        id: 42
                      },
                      shouldIgnoreOrientationRequestLoop: {
                        type: "bool",
                        id: 43
                      },
                      shouldOverrideForceResizeApp: {
                        type: "bool",
                        id: 44
                      },
                      shouldEnableUserAspectRatioSettings: {
                        type: "bool",
                        id: 45
                      },
                      isUserFullscreenOverrideEnabled: {
                        type: "bool",
                        id: 46
                      },
                      requestOpenInBrowserEducationTimestamp: {
                        type: "int64",
                        id: 47
                      },
                      shouldAllowSimulateRequestedOrientationForCameraCompat: {
                        type: "bool",
                        id: 48
                      },
                      safeRegionBounds: {
                        type: ".android_common.graphics.RectProto",
                        id: 49
                      }
                    },
                    reserved: [
                      [
                        18,
                        18
                      ],
                      [
                        25,
                        25
                      ]
                    ]
                  },
                  WindowTokenProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      windowContainer: {
                        type: "WindowContainerProto",
                        id: 1
                      },
                      hashCode: {
                        type: "int32",
                        id: 2
                      },
                      windows: {
                        rule: "repeated",
                        type: "WindowStateProto",
                        id: 3,
                        options: {
                          deprecated: true
                        }
                      },
                      waitingToShow: {
                        type: "bool",
                        id: 5,
                        options: {
                          deprecated: true
                        }
                      },
                      paused: {
                        type: "bool",
                        id: 6
                      }
                    }
                  },
                  WindowStateProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      windowContainer: {
                        type: "WindowContainerProto",
                        id: 1
                      },
                      identifier: {
                        type: "IdentifierProto",
                        id: 2,
                        options: {
                          deprecated: true
                        }
                      },
                      displayId: {
                        type: "int32",
                        id: 3
                      },
                      stackId: {
                        type: "int32",
                        id: 4
                      },
                      attributes: {
                        type: ".android_common.view.WindowLayoutParamsProto",
                        id: 5
                      },
                      givenContentInsets: {
                        type: ".android_common.graphics.RectProto",
                        id: 6
                      },
                      frame: {
                        type: ".android_common.graphics.RectProto",
                        id: 7,
                        options: {
                          deprecated: true
                        }
                      },
                      containingFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 8,
                        options: {
                          deprecated: true
                        }
                      },
                      parentFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 9,
                        options: {
                          deprecated: true
                        }
                      },
                      contentFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 10,
                        options: {
                          deprecated: true
                        }
                      },
                      contentInsets: {
                        type: ".android_common.graphics.RectProto",
                        id: 11,
                        options: {
                          deprecated: true
                        }
                      },
                      surfaceInsets: {
                        type: ".android_common.graphics.RectProto",
                        id: 12
                      },
                      animator: {
                        type: "WindowStateAnimatorProto",
                        id: 13
                      },
                      animatingExit: {
                        type: "bool",
                        id: 14
                      },
                      childWindows: {
                        rule: "repeated",
                        type: "WindowStateProto",
                        id: 15,
                        options: {
                          deprecated: true
                        }
                      },
                      surfacePosition: {
                        type: ".android_common.graphics.RectProto",
                        id: 16
                      },
                      requestedWidth: {
                        type: "int32",
                        id: 18
                      },
                      requestedHeight: {
                        type: "int32",
                        id: 19
                      },
                      viewVisibility: {
                        type: "int32",
                        id: 20,
                        options: {
                          "(.android_common.typedef)": "android.view.View.Visibility"
                        }
                      },
                      systemUiVisibility: {
                        type: "int32",
                        id: 21,
                        options: {
                          deprecated: true
                        }
                      },
                      hasSurface: {
                        type: "bool",
                        id: 22
                      },
                      isReadyForDisplay: {
                        type: "bool",
                        id: 23
                      },
                      displayFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 24,
                        options: {
                          deprecated: true
                        }
                      },
                      overscanFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 25,
                        options: {
                          deprecated: true
                        }
                      },
                      visibleFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 26,
                        options: {
                          deprecated: true
                        }
                      },
                      decorFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 27,
                        options: {
                          deprecated: true
                        }
                      },
                      outsetFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 28,
                        options: {
                          deprecated: true
                        }
                      },
                      overscanInsets: {
                        type: ".android_common.graphics.RectProto",
                        id: 29,
                        options: {
                          deprecated: true
                        }
                      },
                      visibleInsets: {
                        type: ".android_common.graphics.RectProto",
                        id: 30,
                        options: {
                          deprecated: true
                        }
                      },
                      stableInsets: {
                        type: ".android_common.graphics.RectProto",
                        id: 31,
                        options: {
                          deprecated: true
                        }
                      },
                      outsets: {
                        type: ".android_common.graphics.RectProto",
                        id: 32,
                        options: {
                          deprecated: true
                        }
                      },
                      cutout: {
                        type: ".android_common.view.DisplayCutoutProto",
                        id: 33,
                        options: {
                          deprecated: true
                        }
                      },
                      removeOnExit: {
                        type: "bool",
                        id: 34
                      },
                      destroying: {
                        type: "bool",
                        id: 35
                      },
                      removed: {
                        type: "bool",
                        id: 36
                      },
                      isOnScreen: {
                        type: "bool",
                        id: 37
                      },
                      isVisible: {
                        type: "bool",
                        id: 38
                      },
                      pendingSeamlessRotation: {
                        type: "bool",
                        id: 39
                      },
                      finishedSeamlessRotationFrame: {
                        type: "int64",
                        id: 40,
                        options: {
                          deprecated: true
                        }
                      },
                      windowFrames: {
                        type: "WindowFramesProto",
                        id: 41
                      },
                      forceSeamlessRotation: {
                        type: "bool",
                        id: 42
                      },
                      hasCompatScale: {
                        type: "bool",
                        id: 43
                      },
                      globalScale: {
                        type: "float",
                        id: 44
                      },
                      keepClearAreas: {
                        rule: "repeated",
                        type: ".android_common.graphics.RectProto",
                        id: 45
                      },
                      unrestrictedKeepClearAreas: {
                        rule: "repeated",
                        type: ".android_common.graphics.RectProto",
                        id: 46
                      },
                      mergedLocalInsetsSources: {
                        rule: "repeated",
                        type: ".android_common.view.InsetsSourceProto",
                        id: 47
                      },
                      requestedVisibleTypes: {
                        type: "int32",
                        id: 48
                      },
                      dimBounds: {
                        type: ".android_common.graphics.RectProto",
                        id: 49
                      },
                      bufferSeqId: {
                        type: "int32",
                        id: 50
                      },
                      syncSeqId: {
                        type: "int32",
                        id: 51
                      }
                    }
                  },
                  RemoteInsetsControlTargetProto: {
                    edition: "proto2",
                    fields: {
                      identifier: {
                        type: "IdentifierProto",
                        id: 1
                      },
                      requestedVisibleTypes: {
                        type: "int32",
                        id: 2
                      },
                      animatingTypes: {
                        type: "int32",
                        id: 3
                      }
                    }
                  },
                  IdentifierProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      hashCode: {
                        type: "int32",
                        id: 1
                      },
                      userId: {
                        type: "int32",
                        id: 2
                      },
                      title: {
                        type: "string",
                        id: 3,
                        options: {
                          "(.android_common.privacy).dest": "DEST_EXPLICIT"
                        }
                      }
                    }
                  },
                  WindowStateAnimatorProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      lastClipRect: {
                        type: ".android_common.graphics.RectProto",
                        id: 1
                      },
                      surface: {
                        type: "WindowSurfaceControllerProto",
                        id: 2
                      },
                      drawState: {
                        type: "DrawState",
                        id: 3
                      },
                      systemDecorRect: {
                        type: ".android_common.graphics.RectProto",
                        id: 4
                      }
                    },
                    nested: {
                      DrawState: {
                        values: {
                          NO_SURFACE: 0,
                          DRAW_PENDING: 1,
                          COMMIT_DRAW_PENDING: 2,
                          READY_TO_SHOW: 3,
                          HAS_DRAWN: 4
                        }
                      }
                    }
                  },
                  WindowSurfaceControllerProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      shown: {
                        type: "bool",
                        id: 1
                      },
                      layer: {
                        type: "int32",
                        id: 2
                      }
                    }
                  },
                  ScreenRotationAnimationProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      started: {
                        type: "bool",
                        id: 1
                      },
                      animationRunning: {
                        type: "bool",
                        id: 2
                      }
                    }
                  },
                  WindowContainerProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      configurationContainer: {
                        type: "ConfigurationContainerProto",
                        id: 1
                      },
                      orientation: {
                        type: "int32",
                        id: 2,
                        options: {
                          "(.android_common.typedef)": "android.content.pm.ActivityInfo.ScreenOrientation"
                        }
                      },
                      visible: {
                        type: "bool",
                        id: 3
                      },
                      surfaceAnimator: {
                        type: "SurfaceAnimatorProto",
                        id: 4
                      },
                      children: {
                        rule: "repeated",
                        type: "WindowContainerChildProto",
                        id: 5
                      },
                      identifier: {
                        type: "IdentifierProto",
                        id: 6
                      },
                      surfaceControl: {
                        type: ".android_common.view.SurfaceControlProto",
                        id: 7
                      }
                    }
                  },
                  WindowContainerChildProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      windowContainer: {
                        type: "WindowContainerProto",
                        id: 2
                      },
                      displayContent: {
                        type: "DisplayContentProto",
                        id: 3
                      },
                      displayArea: {
                        type: "DisplayAreaProto",
                        id: 4
                      },
                      task: {
                        type: "TaskProto",
                        id: 5
                      },
                      activity: {
                        type: "ActivityRecordProto",
                        id: 6
                      },
                      windowToken: {
                        type: "WindowTokenProto",
                        id: 7
                      },
                      window: {
                        type: "WindowStateProto",
                        id: 8
                      },
                      taskFragment: {
                        type: "TaskFragmentProto",
                        id: 9
                      }
                    }
                  },
                  ConfigurationContainerProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      overrideConfiguration: {
                        type: ".android_common.content.ConfigurationProto",
                        id: 1
                      },
                      fullConfiguration: {
                        type: ".android_common.content.ConfigurationProto",
                        id: 2
                      },
                      mergedOverrideConfiguration: {
                        type: ".android_common.content.ConfigurationProto",
                        id: 3
                      }
                    }
                  },
                  WindowFramesProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      containingFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 1,
                        options: {
                          deprecated: true
                        }
                      },
                      contentFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 2,
                        options: {
                          deprecated: true
                        }
                      },
                      decorFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 3,
                        options: {
                          deprecated: true
                        }
                      },
                      displayFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 4
                      },
                      frame: {
                        type: ".android_common.graphics.RectProto",
                        id: 5
                      },
                      outsetFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 6
                      },
                      overscanFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 7,
                        options: {
                          deprecated: true
                        }
                      },
                      parentFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 8
                      },
                      visibleFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 9,
                        options: {
                          deprecated: true
                        }
                      },
                      cutout: {
                        type: ".android_common.view.DisplayCutoutProto",
                        id: 10,
                        options: {
                          deprecated: true
                        }
                      },
                      contentInsets: {
                        type: ".android_common.graphics.RectProto",
                        id: 11,
                        options: {
                          deprecated: true
                        }
                      },
                      overscanInsets: {
                        type: ".android_common.graphics.RectProto",
                        id: 12,
                        options: {
                          deprecated: true
                        }
                      },
                      visibleInsets: {
                        type: ".android_common.graphics.RectProto",
                        id: 13,
                        options: {
                          deprecated: true
                        }
                      },
                      stableInsets: {
                        type: ".android_common.graphics.RectProto",
                        id: 14,
                        options: {
                          deprecated: true
                        }
                      },
                      outsets: {
                        type: ".android_common.graphics.RectProto",
                        id: 15
                      },
                      compatFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 16
                      }
                    }
                  },
                  InsetsSourceProviderProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      source: {
                        type: ".android_common.view.InsetsSourceProto",
                        id: 1
                      },
                      frame: {
                        type: ".android_common.graphics.RectProto",
                        id: 2
                      },
                      fakeControl: {
                        type: ".android_common.view.InsetsSourceControlProto",
                        id: 3
                      },
                      control: {
                        type: ".android_common.view.InsetsSourceControlProto",
                        id: 4
                      },
                      controlTarget: {
                        type: "WindowStateProto",
                        id: 5,
                        options: {
                          deprecated: true
                        }
                      },
                      pendingControlTarget: {
                        type: "WindowStateProto",
                        id: 6,
                        options: {
                          deprecated: true
                        }
                      },
                      fakeControlTarget: {
                        type: "WindowStateProto",
                        id: 7,
                        options: {
                          deprecated: true
                        }
                      },
                      capturedLeash: {
                        type: ".android_common.view.SurfaceControlProto",
                        id: 8
                      },
                      imeOverriddenFrame: {
                        type: ".android_common.graphics.RectProto",
                        id: 9,
                        options: {
                          deprecated: true
                        }
                      },
                      isLeashReadyForDispatching: {
                        type: "bool",
                        id: 10
                      },
                      clientVisible: {
                        type: "bool",
                        id: 11
                      },
                      serverVisible: {
                        type: "bool",
                        id: 12
                      },
                      seamlessRotating: {
                        type: "bool",
                        id: 13
                      },
                      finishSeamlessRotateFrameNumber: {
                        type: "int64",
                        id: 14
                      },
                      controllable: {
                        type: "bool",
                        id: 15
                      },
                      sourceWindowState: {
                        type: "WindowStateProto",
                        id: 16,
                        options: {
                          deprecated: true
                        }
                      },
                      controlTargetIdentifier: {
                        type: "IdentifierProto",
                        id: 17
                      },
                      pendingControlTargetIdentifier: {
                        type: "IdentifierProto",
                        id: 18
                      },
                      fakeControlTargetIdentifier: {
                        type: "IdentifierProto",
                        id: 19
                      },
                      sourceWindowStateIdentifier: {
                        type: "IdentifierProto",
                        id: 20
                      }
                    }
                  },
                  ImeInsetsSourceProviderProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      insetsSourceProvider: {
                        type: "InsetsSourceProviderProto",
                        id: 1
                      },
                      imeTargetFromIme: {
                        type: "WindowStateProto",
                        id: 2,
                        options: {
                          deprecated: true
                        }
                      },
                      isImeLayoutDrawn: {
                        type: "bool",
                        id: 3,
                        options: {
                          deprecated: true
                        }
                      },
                      imeTargetFromImeIdentifier: {
                        type: "IdentifierProto",
                        id: 4,
                        options: {
                          deprecated: true
                        }
                      }
                    }
                  },
                  BackNavigationProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      animationInProgress: {
                        type: "bool",
                        id: 1
                      },
                      lastBackType: {
                        type: "int32",
                        id: 2
                      },
                      showWallpaper: {
                        type: "bool",
                        id: 3
                      },
                      mainOpenActivity: {
                        type: "string",
                        id: 4
                      },
                      animationRunning: {
                        type: "bool",
                        id: 5
                      }
                    }
                  },
                  SurfaceAnimatorProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      leash: {
                        type: ".android_common.view.SurfaceControlProto",
                        id: 1
                      },
                      animationStartDelayed: {
                        type: "bool",
                        id: 2
                      },
                      animationAdapter: {
                        type: "AnimationAdapterProto",
                        id: 3
                      }
                    }
                  },
                  AnimationAdapterProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      local: {
                        type: "LocalAnimationAdapterProto",
                        id: 1
                      },
                      remote: {
                        type: "RemoteAnimationAdapterWrapperProto",
                        id: 2
                      }
                    }
                  },
                  RemoteAnimationAdapterWrapperProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      target: {
                        type: ".android_common.view.RemoteAnimationTargetProto",
                        id: 1
                      }
                    }
                  },
                  LocalAnimationAdapterProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      animationSpec: {
                        type: "AnimationSpecProto",
                        id: 1
                      }
                    }
                  },
                  AnimationSpecProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      window: {
                        type: "WindowAnimationSpecProto",
                        id: 1
                      },
                      move: {
                        type: "MoveAnimationSpecProto",
                        id: 2
                      },
                      alpha: {
                        type: "AlphaAnimationSpecProto",
                        id: 3
                      },
                      rotate: {
                        type: "RotationAnimationSpecProto",
                        id: 4
                      }
                    }
                  },
                  WindowAnimationSpecProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      animation: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  MoveAnimationSpecProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      from: {
                        type: ".android_common.graphics.PointProto",
                        id: 1
                      },
                      to: {
                        type: ".android_common.graphics.PointProto",
                        id: 2
                      },
                      durationMs: {
                        type: "int64",
                        id: 3
                      }
                    }
                  },
                  AlphaAnimationSpecProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      from: {
                        type: "float",
                        id: 1
                      },
                      to: {
                        type: "float",
                        id: 2
                      },
                      durationMs: {
                        type: "int64",
                        id: 3
                      }
                    }
                  },
                  RotationAnimationSpecProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      startLuma: {
                        type: "float",
                        id: 1
                      },
                      endLuma: {
                        type: "float",
                        id: 2
                      },
                      durationMs: {
                        type: "int64",
                        id: 3
                      }
                    }
                  },
                  WindowContainerThumbnailProto: {
                    edition: "proto2",
                    options: {
                      "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
                    },
                    fields: {
                      width: {
                        type: "int32",
                        id: 1
                      },
                      height: {
                        type: "int32",
                        id: 2
                      },
                      surfaceAnimator: {
                        type: "SurfaceAnimatorProto",
                        id: 3
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
  },
  android_common: {
    options: {
      java_package: "com.android_common.incident",
      java_multiple_files: true
    },
    nested: {
      app: {
        options: {
          java_multiple_files: true
        },
        nested: {
          StatusBarManagerProto: {
            edition: "proto2",
            fields: {},
            nested: {
              WindowState: {
                values: {
                  WINDOW_STATE_SHOWING: 0,
                  WINDOW_STATE_HIDING: 1,
                  WINDOW_STATE_HIDDEN: 2
                }
              },
              TransientWindowState: {
                values: {
                  TRANSIENT_BAR_NONE: 0,
                  TRANSIENT_BAR_SHOW_REQUESTED: 1,
                  TRANSIENT_BAR_SHOWING: 2,
                  TRANSIENT_BAR_HIDING: 3
                }
              }
            }
          },
          WindowConfigurationProto: {
            edition: "proto2",
            options: {
              "(android.msg_privacy).dest": "DEST_AUTOMATIC"
            },
            fields: {
              appBounds: {
                type: ".android_common.graphics.RectProto",
                id: 1
              },
              windowingMode: {
                type: "int32",
                id: 2,
                options: {
                  "(.android_common.typedef)": "android.app.WindowConfiguration.WindowingMode"
                }
              },
              activityType: {
                type: "int32",
                id: 3,
                options: {
                  "(.android_common.typedef)": "android.app.WindowConfiguration.ActivityType"
                }
              },
              bounds: {
                type: ".android_common.graphics.RectProto",
                id: 4
              },
              maxBounds: {
                type: ".android_common.graphics.RectProto",
                id: 5
              }
            }
          }
        }
      },
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
              "(android.msg_privacy).dest": "DEST_AUTOMATIC"
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
      content: {
        options: {
          java_multiple_files: true
        },
        nested: {
          ActivityInfoProto: {
            edition: "proto2",
            fields: {},
            nested: {
              ScreenOrientation: {
                values: {
                  SCREEN_ORIENTATION_UNSET: -2,
                  SCREEN_ORIENTATION_UNSPECIFIED: -1,
                  SCREEN_ORIENTATION_LANDSCAPE: 0,
                  SCREEN_ORIENTATION_PORTRAIT: 1,
                  SCREEN_ORIENTATION_USER: 2,
                  SCREEN_ORIENTATION_BEHIND: 3,
                  SCREEN_ORIENTATION_SENSOR: 4,
                  SCREEN_ORIENTATION_NOSENSOR: 5,
                  SCREEN_ORIENTATION_SENSOR_LANDSCAPE: 6,
                  SCREEN_ORIENTATION_SENSOR_PORTRAIT: 7,
                  SCREEN_ORIENTATION_REVERSE_LANDSCAPE: 8,
                  SCREEN_ORIENTATION_REVERSE_PORTRAIT: 9,
                  SCREEN_ORIENTATION_FULL_SENSOR: 10,
                  SCREEN_ORIENTATION_USER_LANDSCAPE: 11,
                  SCREEN_ORIENTATION_USER_PORTRAIT: 12,
                  SCREEN_ORIENTATION_FULL_USER: 13,
                  SCREEN_ORIENTATION_LOCKED: 14
                }
              }
            }
          },
          ConfigurationProto: {
            edition: "proto2",
            options: {
              "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
            },
            fields: {
              fontScale: {
                type: "float",
                id: 1
              },
              mcc: {
                type: "uint32",
                id: 2
              },
              mnc: {
                type: "uint32",
                id: 3,
                options: {
                  "(.android_common.privacy).dest": "DEST_EXPLICIT"
                }
              },
              locales: {
                rule: "repeated",
                type: "LocaleProto",
                id: 4,
                options: {
                  deprecated: true
                }
              },
              screenLayout: {
                type: "uint32",
                id: 5
              },
              colorMode: {
                type: "uint32",
                id: 6
              },
              touchscreen: {
                type: "uint32",
                id: 7
              },
              keyboard: {
                type: "uint32",
                id: 8
              },
              keyboardHidden: {
                type: "uint32",
                id: 9
              },
              hardKeyboardHidden: {
                type: "uint32",
                id: 10
              },
              navigation: {
                type: "uint32",
                id: 11
              },
              navigationHidden: {
                type: "uint32",
                id: 12
              },
              orientation: {
                type: "uint32",
                id: 13
              },
              uiMode: {
                type: "uint32",
                id: 14
              },
              screenWidthDp: {
                type: "uint32",
                id: 15
              },
              screenHeightDp: {
                type: "uint32",
                id: 16
              },
              smallestScreenWidthDp: {
                type: "uint32",
                id: 17
              },
              densityDpi: {
                type: "uint32",
                id: 18
              },
              windowConfiguration: {
                type: ".android_common.app.WindowConfigurationProto",
                id: 19
              },
              localeList: {
                type: "string",
                id: 20
              },
              fontWeightAdjustment: {
                type: "uint32",
                id: 21
              },
              grammaticalGender: {
                type: "uint32",
                id: 22
              }
            }
          },
          ResourcesConfigurationProto: {
            edition: "proto2",
            options: {
              "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
            },
            fields: {
              configuration: {
                rule: "required",
                type: "ConfigurationProto",
                id: 1
              },
              sdkVersion: {
                type: "uint32",
                id: 2
              },
              screenWidthPx: {
                type: "uint32",
                id: 3
              },
              screenHeightPx: {
                type: "uint32",
                id: 4
              }
            }
          },
          DeviceConfigurationProto: {
            edition: "proto2",
            options: {
              "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
            },
            fields: {
              stableScreenWidthPx: {
                type: "uint32",
                id: 1
              },
              stableScreenHeightPx: {
                type: "uint32",
                id: 2
              },
              stableDensityDpi: {
                type: "uint32",
                id: 3
              },
              totalRam: {
                type: "uint64",
                id: 4
              },
              lowRam: {
                type: "bool",
                id: 5
              },
              maxCores: {
                type: "uint32",
                id: 6
              },
              hasSecureScreenLock: {
                type: "bool",
                id: 7
              },
              openglVersion: {
                type: "uint32",
                id: 8
              },
              openglExtensions: {
                rule: "repeated",
                type: "string",
                id: 9
              },
              sharedLibraries: {
                rule: "repeated",
                type: "string",
                id: 10
              },
              features: {
                rule: "repeated",
                type: "string",
                id: 11
              },
              cpuArchitectures: {
                rule: "repeated",
                type: "string",
                id: 12
              }
            }
          },
          GlobalConfigurationProto: {
            edition: "proto2",
            options: {
              "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
            },
            fields: {
              resources: {
                type: "ResourcesConfigurationProto",
                id: 1
              },
              device: {
                type: "DeviceConfigurationProto",
                id: 2
              }
            }
          },
          LocaleProto: {
            edition: "proto2",
            options: {
              deprecated: true,
              "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
            },
            fields: {
              language: {
                type: "string",
                id: 1
              },
              country: {
                type: "string",
                id: 2
              },
              variant: {
                type: "string",
                id: 3
              },
              script: {
                type: "string",
                id: 4
              }
            }
          }
        }
      },
      view: {
        options: {
          java_outer_classname: "ViewProtoEnums",
          java_multiple_files: true
        },
        nested: {
          DisplayStateEnum: {
            edition: "proto2",
            values: {
              DISPLAY_STATE_UNKNOWN: 0,
              DISPLAY_STATE_OFF: 1,
              DISPLAY_STATE_ON: 2,
              DISPLAY_STATE_DOZE: 3,
              DISPLAY_STATE_DOZE_SUSPEND: 4,
              DISPLAY_STATE_VR: 5,
              DISPLAY_STATE_ON_SUSPEND: 6
            }
          },
          DisplayStateReason: {
            edition: "proto2",
            values: {
              DISPLAY_STATE_REASON_UNKNOWN: 0,
              DISPLAY_STATE_REASON_DEFAULT_POLICY: 1,
              DISPLAY_STATE_REASON_DRAW_WAKE_LOCK: 2,
              DISPLAY_STATE_REASON_OFFLOAD: 3,
              DISPLAY_STATE_REASON_TILT: 4,
              DISPLAY_STATE_REASON_DREAM_MANAGER: 5,
              DISPLAY_STATE_REASON_KEY: 6,
              DISPLAY_STATE_REASON_MOTION: 7
            }
          },
          TransitionTypeEnum: {
            edition: "proto2",
            valuesOptions: {
              TRANSIT_DOCK_TASK_FROM_RECENTS: {
                deprecated: true
              }
            },
            values: {
              TRANSIT_NONE: 0,
              TRANSIT_UNSET: -1,
              TRANSIT_ACTIVITY_OPEN: 6,
              TRANSIT_ACTIVITY_CLOSE: 7,
              TRANSIT_TASK_OPEN: 8,
              TRANSIT_TASK_CLOSE: 9,
              TRANSIT_TASK_TO_FRONT: 10,
              TRANSIT_TASK_TO_BACK: 11,
              TRANSIT_WALLPAPER_CLOSE: 12,
              TRANSIT_WALLPAPER_OPEN: 13,
              TRANSIT_WALLPAPER_INTRA_OPEN: 14,
              TRANSIT_WALLPAPER_INTRA_CLOSE: 15,
              TRANSIT_TASK_OPEN_BEHIND: 16,
              TRANSIT_TASK_IN_PLACE: 17,
              TRANSIT_ACTIVITY_RELAUNCH: 18,
              TRANSIT_DOCK_TASK_FROM_RECENTS: 19,
              TRANSIT_KEYGUARD_GOING_AWAY: 20,
              TRANSIT_KEYGUARD_GOING_AWAY_ON_WALLPAPER: 21,
              TRANSIT_KEYGUARD_OCCLUDE: 22,
              TRANSIT_KEYGUARD_UNOCCLUDE: 23,
              TRANSIT_TRANSLUCENT_ACTIVITY_OPEN: 24,
              TRANSIT_TRANSLUCENT_ACTIVITY_CLOSE: 25,
              TRANSIT_CRASHING_ACTIVITY_CLOSE: 26
            }
          },
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
          DisplayInfoProto: {
            edition: "proto2",
            options: {
              "(.android_common.msg_privacy).dest": "DEST_AUTOMATIC"
            },
            fields: {
              logicalWidth: {
                type: "int32",
                id: 1
              },
              logicalHeight: {
                type: "int32",
                id: 2
              },
              appWidth: {
                type: "int32",
                id: 3
              },
              appHeight: {
                type: "int32",
                id: 4
              },
              name: {
                type: "string",
                id: 5
              },
              flags: {
                type: "int32",
                id: 6
              },
              cutout: {
                type: "DisplayCutoutProto",
                id: 7
              },
              type: {
                type: "int32",
                id: 8
              }
            }
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
          SurfaceProto: {
            edition: "proto2",
            fields: {},
            nested: {
              Rotation: {
                values: {
                  ROTATION_0: 0,
                  ROTATION_90: 1,
                  ROTATION_180: 2,
                  ROTATION_270: 3
                }
              }
            }
          },
          SurfaceControlProto: {
            edition: "proto2",
            options: {
              "(android.msg_privacy).dest": "DEST_AUTOMATIC"
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
                  "(android.privacy).dest": "DEST_EXPLICIT"
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
          },
          RemoteAnimationTargetProto: {
            edition: "proto2",
            options: {
              "(android.msg_privacy).dest": "DEST_AUTOMATIC"
            },
            fields: {
              taskId: {
                type: "int32",
                id: 1
              },
              mode: {
                type: "int32",
                id: 2
              },
              leash: {
                type: ".android_common.view.SurfaceControlProto",
                id: 3
              },
              isTranslucent: {
                type: "bool",
                id: 4
              },
              clipRect: {
                type: ".android_common.graphics.RectProto",
                id: 5
              },
              contentInsets: {
                type: ".android_common.graphics.RectProto",
                id: 6
              },
              prefixOrderIndex: {
                type: "int32",
                id: 7
              },
              position: {
                type: ".android_common.graphics.PointProto",
                id: 8
              },
              sourceContainerBounds: {
                type: ".android_common.graphics.RectProto",
                id: 9
              },
              windowConfiguration: {
                type: ".android_common.app.WindowConfigurationProto",
                id: 10
              },
              startLeash: {
                type: ".android_common.view.SurfaceControlProto",
                id: 11
              },
              startBounds: {
                type: ".android_common.graphics.RectProto",
                id: 12
              },
              localBounds: {
                type: ".android_common.graphics.RectProto",
                id: 13
              },
              screenSpaceBounds: {
                type: ".android_common.graphics.RectProto",
                id: 14
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
