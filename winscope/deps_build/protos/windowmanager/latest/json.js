/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/light";

const $root = ($protobuf.roots.windowmanager_latest || ($protobuf.roots.windowmanager_latest = new $protobuf.Root()))
.addJSON({
  perfetto: {
    nested: {
      protos: {
        nested: {
          Wrapper: {
            fields: {
              windowmanagerTraceEntry: {
                type: "WindowManagerTraceEntry",
                id: 1
              }
            }
          },
          WindowManagerTraceFileProto: {
            fields: {
              magicNumber: {
                type: "fixed64",
                id: 1
              },
              entry: {
                rule: "repeated",
                type: "WindowManagerTraceEntry",
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
          WindowManagerTraceEntry: {
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
                  "(.perfetto.protos.typedef)": "android.view.Surface.Rotation",
                  deprecated: true
                }
              },
              lastOrientation: {
                type: "int32",
                id: 8,
                options: {
                  "(.perfetto.protos.typedef)": "android.content.pm.ActivityInfo.ScreenOrientation",
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
            fields: {
              state: {
                type: "StatusBarManagerProto.WindowState",
                id: 1
              },
              transientState: {
                type: "StatusBarManagerProto.TransientWindowState",
                id: 2
              }
            }
          },
          WindowOrientationListenerProto: {
            fields: {
              enabled: {
                type: "bool",
                id: 1
              },
              rotation: {
                type: "SurfaceProto.Rotation",
                id: 2
              }
            }
          },
          KeyguardServiceDelegateProto: {
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
                type: "SurfaceProto.Rotation",
                id: 3
              },
              orientation: {
                type: "ActivityInfoProto.ScreenOrientation",
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
            fields: {
              appTransitionState: {
                type: "AppState",
                id: 1
              },
              lastUsedAppTransition: {
                type: "TransitionTypeEnum",
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
                type: "DisplayInfoProto",
                id: 10
              },
              rotation: {
                type: "int32",
                id: 11,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.Surface.Rotation",
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
                type: "IdentifierProto",
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
                type: "RectProto",
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
            fields: {
              windowContainer: {
                type: "WindowContainerProto",
                id: 1
              },
              name: {
                type: "string",
                id: 2,
                options: {
                  "(.perfetto.protos.privacy).dest": "DEST_EXPLICIT"
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
            fields: {
              stableBounds: {
                type: "RectProto",
                id: 1,
                options: {
                  deprecated: true
                }
              },
              dock: {
                type: "RectProto",
                id: 2,
                options: {
                  deprecated: true
                }
              },
              current: {
                type: "RectProto",
                id: 3,
                options: {
                  deprecated: true
                }
              }
            }
          },
          DisplayRotationProto: {
            fields: {
              rotation: {
                type: "int32",
                id: 1,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.Surface.Rotation"
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
                  "(.perfetto.protos.typedef)": "android.view.Surface.Rotation"
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
                  "(.perfetto.protos.typedef)": "android.content.pm.ActivityInfo.ScreenOrientation"
                }
              },
              isFixedToUserRotation: {
                type: "bool",
                id: 6
              }
            }
          },
          DockedTaskDividerControllerProto: {
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
            fields: {
              defaultBounds: {
                type: "RectProto",
                id: 1,
                options: {
                  deprecated: true
                }
              },
              movementBounds: {
                type: "RectProto",
                id: 2,
                options: {
                  deprecated: true
                }
              }
            }
          },
          TaskProto: {
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
                type: "RectProto",
                id: 5
              },
              displayedBounds: {
                type: "RectProto",
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
                type: "IdentifierProto",
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
                  "(.perfetto.protos.typedef)": "android.app.WindowConfiguration.ActivityType",
                  deprecated: true
                }
              },
              resizeMode: {
                type: "int32",
                id: 18,
                options: {
                  "(.perfetto.protos.typedef)": "android.appwidget.AppWidgetProviderInfo.ResizeModeFlags"
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
                type: "RectProto",
                id: 21
              },
              lastNonFullscreenBounds: {
                type: "RectProto",
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
                  "(.perfetto.protos.typedef)": "android.app.WindowConfiguration.ActivityType"
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
            fields: {
              name: {
                type: "string",
                id: 1,
                options: {
                  "(.perfetto.protos.privacy).dest": "DEST_EXPLICIT"
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
                type: "RectProto",
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
                  "(.perfetto.protos.privacy).dest": "DEST_EXPLICIT"
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
                  "(.perfetto.protos.typedef)": "android.content.pm.ActivityInfo.ScreenOrientation"
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
                type: "WindowLayoutParamsProto",
                id: 5
              },
              givenContentInsets: {
                type: "RectProto",
                id: 6
              },
              frame: {
                type: "RectProto",
                id: 7,
                options: {
                  deprecated: true
                }
              },
              containingFrame: {
                type: "RectProto",
                id: 8,
                options: {
                  deprecated: true
                }
              },
              parentFrame: {
                type: "RectProto",
                id: 9,
                options: {
                  deprecated: true
                }
              },
              contentFrame: {
                type: "RectProto",
                id: 10,
                options: {
                  deprecated: true
                }
              },
              contentInsets: {
                type: "RectProto",
                id: 11,
                options: {
                  deprecated: true
                }
              },
              surfaceInsets: {
                type: "RectProto",
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
                type: "RectProto",
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
                  "(.perfetto.protos.typedef)": "android.view.View.Visibility"
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
                type: "RectProto",
                id: 24,
                options: {
                  deprecated: true
                }
              },
              overscanFrame: {
                type: "RectProto",
                id: 25,
                options: {
                  deprecated: true
                }
              },
              visibleFrame: {
                type: "RectProto",
                id: 26,
                options: {
                  deprecated: true
                }
              },
              decorFrame: {
                type: "RectProto",
                id: 27,
                options: {
                  deprecated: true
                }
              },
              outsetFrame: {
                type: "RectProto",
                id: 28,
                options: {
                  deprecated: true
                }
              },
              overscanInsets: {
                type: "RectProto",
                id: 29,
                options: {
                  deprecated: true
                }
              },
              visibleInsets: {
                type: "RectProto",
                id: 30,
                options: {
                  deprecated: true
                }
              },
              stableInsets: {
                type: "RectProto",
                id: 31,
                options: {
                  deprecated: true
                }
              },
              outsets: {
                type: "RectProto",
                id: 32,
                options: {
                  deprecated: true
                }
              },
              cutout: {
                type: "DisplayCutoutProto",
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
                type: "RectProto",
                id: 45
              },
              unrestrictedKeepClearAreas: {
                rule: "repeated",
                type: "RectProto",
                id: 46
              },
              mergedLocalInsetsSources: {
                rule: "repeated",
                type: "InsetsSourceProto",
                id: 47
              },
              requestedVisibleTypes: {
                type: "int32",
                id: 48
              },
              dimBounds: {
                type: "RectProto",
                id: 49
              },
              prepareSyncSeqId: {
                type: "int32",
                id: 50
              },
              syncSeqId: {
                type: "int32",
                id: 51
              }
            }
          },
          IdentifierProto: {
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
                  "(.perfetto.protos.privacy).dest": "DEST_EXPLICIT"
                }
              }
            }
          },
          WindowStateAnimatorProto: {
            fields: {
              lastClipRect: {
                type: "RectProto",
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
                type: "RectProto",
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
            fields: {
              configurationContainer: {
                type: "ConfigurationContainerProto",
                id: 1
              },
              orientation: {
                type: "int32",
                id: 2,
                options: {
                  "(.perfetto.protos.typedef)": "android.content.pm.ActivityInfo.ScreenOrientation"
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
                type: "SurfaceControlProto",
                id: 7
              }
            }
          },
          WindowContainerChildProto: {
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
            fields: {
              overrideConfiguration: {
                type: "ConfigurationProto",
                id: 1
              },
              fullConfiguration: {
                type: "ConfigurationProto",
                id: 2
              },
              mergedOverrideConfiguration: {
                type: "ConfigurationProto",
                id: 3
              }
            }
          },
          WindowFramesProto: {
            fields: {
              containingFrame: {
                type: "RectProto",
                id: 1,
                options: {
                  deprecated: true
                }
              },
              contentFrame: {
                type: "RectProto",
                id: 2,
                options: {
                  deprecated: true
                }
              },
              decorFrame: {
                type: "RectProto",
                id: 3,
                options: {
                  deprecated: true
                }
              },
              displayFrame: {
                type: "RectProto",
                id: 4
              },
              frame: {
                type: "RectProto",
                id: 5
              },
              outsetFrame: {
                type: "RectProto",
                id: 6
              },
              overscanFrame: {
                type: "RectProto",
                id: 7,
                options: {
                  deprecated: true
                }
              },
              parentFrame: {
                type: "RectProto",
                id: 8
              },
              visibleFrame: {
                type: "RectProto",
                id: 9,
                options: {
                  deprecated: true
                }
              },
              cutout: {
                type: "DisplayCutoutProto",
                id: 10,
                options: {
                  deprecated: true
                }
              },
              contentInsets: {
                type: "RectProto",
                id: 11,
                options: {
                  deprecated: true
                }
              },
              overscanInsets: {
                type: "RectProto",
                id: 12,
                options: {
                  deprecated: true
                }
              },
              visibleInsets: {
                type: "RectProto",
                id: 13,
                options: {
                  deprecated: true
                }
              },
              stableInsets: {
                type: "RectProto",
                id: 14,
                options: {
                  deprecated: true
                }
              },
              outsets: {
                type: "RectProto",
                id: 15
              },
              compatFrame: {
                type: "RectProto",
                id: 16
              }
            }
          },
          InsetsSourceProviderProto: {
            fields: {
              source: {
                type: "InsetsSourceProto",
                id: 1
              },
              frame: {
                type: "RectProto",
                id: 2
              },
              fakeControl: {
                type: "InsetsSourceControlProto",
                id: 3
              },
              control: {
                type: "InsetsSourceControlProto",
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
                type: "SurfaceControlProto",
                id: 8
              },
              imeOverriddenFrame: {
                type: "RectProto",
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
                id: 4
              }
            }
          },
          BackNavigationProto: {
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
          StatusBarManagerProto: {
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
          ActivityInfoProto: {
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
                  "(.perfetto.protos.privacy).dest": "DEST_EXPLICIT"
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
                type: "WindowConfigurationProto",
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
            fields: {
              configuration: {
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
          WindowConfigurationProto: {
            fields: {
              appBounds: {
                type: "RectProto",
                id: 1
              },
              windowingMode: {
                type: "int32",
                id: 2,
                options: {
                  "(.perfetto.protos.typedef)": "android.app.WindowConfiguration.WindowingMode"
                }
              },
              activityType: {
                type: "int32",
                id: 3,
                options: {
                  "(.perfetto.protos.typedef)": "android.app.WindowConfiguration.ActivityType"
                }
              },
              bounds: {
                type: "RectProto",
                id: 4
              },
              maxBounds: {
                type: "RectProto",
                id: 5
              }
            }
          },
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
          typedef: {
            type: "string",
            id: 60001,
            extend: "google.protobuf.FieldOptions"
          },
          LocaleProto: {
            options: {
              deprecated: true
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
          },
          Destination: {
            values: {
              DEST_LOCAL: 0,
              DEST_EXPLICIT: 100,
              DEST_AUTOMATIC: 200,
              DEST_UNSET: 255
            }
          },
          PrivacyFlags: {
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
            type: "PrivacyFlags",
            id: 102672883,
            extend: "google.protobuf.FieldOptions"
          },
          msgPrivacy: {
            type: "PrivacyFlags",
            id: 102672883,
            extend: "google.protobuf.MessageOptions"
          },
          WindowContainerThumbnailProto: {
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
          },
          SurfaceAnimatorProto: {
            fields: {
              leash: {
                type: "SurfaceControlProto",
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
            fields: {
              target: {
                type: "RemoteAnimationTargetProto",
                id: 1
              }
            }
          },
          LocalAnimationAdapterProto: {
            fields: {
              animationSpec: {
                type: "AnimationSpecProto",
                id: 1
              }
            }
          },
          AnimationSpecProto: {
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
            fields: {
              animation: {
                type: "string",
                id: 1
              }
            }
          },
          MoveAnimationSpecProto: {
            fields: {
              from: {
                type: "PointProto",
                id: 1
              },
              to: {
                type: "PointProto",
                id: 2
              },
              durationMs: {
                type: "int64",
                id: 3
              }
            }
          },
          AlphaAnimationSpecProto: {
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
          PointProto: {
            fields: {
              x: {
                type: "int32",
                id: 1
              },
              y: {
                type: "int32",
                id: 2
              }
            }
          },
          RemoteAnimationTargetProto: {
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
                type: "SurfaceControlProto",
                id: 3
              },
              isTranslucent: {
                type: "bool",
                id: 4
              },
              clipRect: {
                type: "RectProto",
                id: 5
              },
              contentInsets: {
                type: "RectProto",
                id: 6
              },
              prefixOrderIndex: {
                type: "int32",
                id: 7
              },
              position: {
                type: "PointProto",
                id: 8
              },
              sourceContainerBounds: {
                type: "RectProto",
                id: 9
              },
              windowConfiguration: {
                type: "WindowConfigurationProto",
                id: 10
              },
              startLeash: {
                type: "SurfaceControlProto",
                id: 11
              },
              startBounds: {
                type: "RectProto",
                id: 12
              },
              localBounds: {
                type: "RectProto",
                id: 13
              },
              screenSpaceBounds: {
                type: "RectProto",
                id: 14
              }
            }
          },
          SurfaceControlProto: {
            fields: {
              hashCode: {
                type: "int32",
                id: 1
              },
              name: {
                type: "string",
                id: 2
              },
              layerId: {
                type: "int32",
                id: 3
              }
            }
          },
          DisplayCutoutProto: {
            fields: {
              insets: {
                type: "RectProto",
                id: 1
              },
              boundLeft: {
                type: "RectProto",
                id: 3
              },
              boundTop: {
                type: "RectProto",
                id: 4
              },
              boundRight: {
                type: "RectProto",
                id: 5
              },
              boundBottom: {
                type: "RectProto",
                id: 6
              },
              waterfallInsets: {
                type: "RectProto",
                id: 7
              },
              sideOverrides: {
                rule: "repeated",
                type: "int32",
                id: 8,
                options: {
                  packed: false
                }
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
              }
            }
          },
          SurfaceProto: {
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
          WindowLayoutParamsProto: {
            fields: {
              type: {
                type: "int32",
                id: 1,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowManager.LayoutParams.WindowType"
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
                  "(.perfetto.protos.typedef)": "android.view.Gravity.GravityFlags"
                }
              },
              softInputMode: {
                type: "int32",
                id: 9,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowManager.LayoutParams.SoftInputModeFlags"
                }
              },
              format: {
                type: "PixelFormatProto.Format",
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
                  "(.perfetto.protos.typedef)": "android.view.WindowManager.LayoutParams.InputFeatureFlags"
                }
              },
              userActivityTimeout: {
                type: "int64",
                id: 20
              },
              colorMode: {
                type: "ViewDisplayProto.ColorMode",
                id: 23
              },
              flags: {
                type: "uint32",
                id: 24,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowManager.LayoutParams.Flags"
                }
              },
              privateFlags: {
                type: "uint32",
                id: 26,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowManager.LayoutParams.PrivateFlags"
                }
              },
              systemUiVisibilityFlags: {
                type: "uint32",
                id: 27,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowManager.LayoutParams.SystemUiVisibilityFlags"
                }
              },
              subtreeSystemUiVisibilityFlags: {
                type: "uint32",
                id: 28,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowManager.LayoutParams.SystemUiVisibilityFlags"
                }
              },
              appearance: {
                type: "uint32",
                id: 29,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowInsetsController.Appearance"
                }
              },
              behavior: {
                type: "uint32",
                id: 30,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowInsetsController.Behavior"
                }
              },
              fitInsetsTypes: {
                type: "uint32",
                id: 31,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowInsets.Type.InsetsType"
                }
              },
              fitInsetsSides: {
                type: "uint32",
                id: 32,
                options: {
                  "(.perfetto.protos.typedef)": "android.view.WindowInsets.Side.InsetsSide"
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
          },
          ViewDisplayProto: {
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
          InsetsSourceProto: {
            fields: {
              type: {
                type: "string",
                id: 1,
                options: {
                  deprecated: true
                }
              },
              frame: {
                type: "RectProto",
                id: 2
              },
              visibleFrame: {
                type: "RectProto",
                id: 3
              },
              visible: {
                type: "bool",
                id: 4
              },
              typeNumber: {
                type: "int32",
                id: 5
              }
            }
          },
          InsetsSourceControlProto: {
            fields: {
              type: {
                type: "string",
                id: 1,
                options: {
                  deprecated: true
                }
              },
              position: {
                type: "PointProto",
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
          DisplayStateEnum: {
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
          }
        }
      }
    }
  },
  google: {
    nested: {
      protobuf: {
        nested: {
          FileDescriptorSet: {
            fields: {
              file: {
                rule: "repeated",
                type: "FileDescriptorProto",
                id: 1
              }
            }
          },
          FileDescriptorProto: {
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
                id: 10,
                options: {
                  packed: false
                }
              },
              weakDependency: {
                rule: "repeated",
                type: "int32",
                id: 11,
                options: {
                  packed: false
                }
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
              }
            }
          },
          DescriptorProto: {
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
          FieldDescriptorProto: {
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
                  LABEL_REQUIRED: 2,
                  LABEL_REPEATED: 3
                }
              }
            }
          },
          OneofDescriptorProto: {
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
              }
            }
          },
          EnumValueDescriptorProto: {
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
                id: 31
              },
              objcClassPrefix: {
                type: "string",
                id: 36
              },
              csharpNamespace: {
                type: "string",
                id: 37
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
                38,
                38
              ]
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
                8,
                8
              ]
            ]
          },
          FieldOptions: {
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
              deprecated: {
                type: "bool",
                id: 3
              },
              weak: {
                type: "bool",
                id: 10
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
              }
            }
          },
          OneofOptions: {
            fields: {
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
            fields: {
              allowAlias: {
                type: "bool",
                id: 2
              },
              deprecated: {
                type: "bool",
                id: 3
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
          EnumValueOptions: {
            fields: {
              deprecated: {
                type: "bool",
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
          ServiceOptions: {
            fields: {
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
            fields: {
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
          UninterpretedOption: {
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
          SourceCodeInfo: {
            fields: {
              location: {
                rule: "repeated",
                type: "Location",
                id: 1
              }
            },
            nested: {
              Location: {
                fields: {
                  path: {
                    rule: "repeated",
                    type: "int32",
                    id: 1
                  },
                  span: {
                    rule: "repeated",
                    type: "int32",
                    id: 2
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
                    id: 1
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
