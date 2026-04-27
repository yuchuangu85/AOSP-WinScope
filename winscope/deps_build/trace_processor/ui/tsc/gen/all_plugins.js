"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const com_android_AndroidBinderViz_1 = tslib_1.__importDefault(require("../plugins/com.android.AndroidBinderViz"));
const com_android_AndroidClientServer_1 = tslib_1.__importDefault(require("../plugins/com.android.AndroidClientServer"));
const com_android_AndroidCounterTracks_1 = tslib_1.__importDefault(require("../plugins/com.android.AndroidCounterTracks"));
const com_android_AndroidCujs_1 = tslib_1.__importDefault(require("../plugins/com.android.AndroidCujs"));
const com_android_AndroidDesktopMode_1 = tslib_1.__importDefault(require("../plugins/com.android.AndroidDesktopMode"));
const com_android_AndroidDmabuf_1 = tslib_1.__importDefault(require("../plugins/com.android.AndroidDmabuf"));
const com_android_AndroidLog_1 = tslib_1.__importDefault(require("../plugins/com.android.AndroidLog"));
const com_android_AndroidLongBatteryTracing_1 = tslib_1.__importDefault(require("../plugins/com.android.AndroidLongBatteryTracing"));
const com_android_AndroidNetwork_1 = tslib_1.__importDefault(require("../plugins/com.android.AndroidNetwork"));
const com_android_AndroidPerf_1 = tslib_1.__importDefault(require("../plugins/com.android.AndroidPerf"));
const com_android_AndroidPerfTraceCounters_1 = tslib_1.__importDefault(require("../plugins/com.android.AndroidPerfTraceCounters"));
const com_android_AndroidStartup_1 = tslib_1.__importDefault(require("../plugins/com.android.AndroidStartup"));
const com_android_AvfVmCpuTimeline_1 = tslib_1.__importDefault(require("../plugins/com.android.AvfVmCpuTimeline"));
const com_android_GpuWorkPeriod_1 = tslib_1.__importDefault(require("../plugins/com.android.GpuWorkPeriod"));
const com_android_InputEvents_1 = tslib_1.__importDefault(require("../plugins/com.android.InputEvents"));
const com_android_LargeScreensPerf_1 = tslib_1.__importDefault(require("../plugins/com.android.LargeScreensPerf"));
const com_android_PinAndroidPerfMetrics_1 = tslib_1.__importDefault(require("../plugins/com.android.PinAndroidPerfMetrics"));
const com_android_PinSysUITracks_1 = tslib_1.__importDefault(require("../plugins/com.android.PinSysUITracks"));
const com_android_SysUIWorkspace_1 = tslib_1.__importDefault(require("../plugins/com.android.SysUIWorkspace"));
const com_android_TrustyTeeCpuTimeline_1 = tslib_1.__importDefault(require("../plugins/com.android.TrustyTeeCpuTimeline"));
const com_example_Commands_1 = tslib_1.__importDefault(require("../plugins/com.example.Commands"));
const com_example_Settings_1 = tslib_1.__importDefault(require("../plugins/com.example.Settings"));
const com_example_Skeleton_1 = tslib_1.__importDefault(require("../plugins/com.example.Skeleton"));
const com_example_State_1 = tslib_1.__importDefault(require("../plugins/com.example.State"));
const com_example_Tabs_1 = tslib_1.__importDefault(require("../plugins/com.example.Tabs"));
const com_example_Tracks_1 = tslib_1.__importDefault(require("../plugins/com.example.Tracks"));
const com_google_PerfettoMcp_1 = tslib_1.__importDefault(require("../plugins/com.google.PerfettoMcp"));
const com_google_PixelCpmTrace_1 = tslib_1.__importDefault(require("../plugins/com.google.PixelCpmTrace"));
const com_google_PixelMemory_1 = tslib_1.__importDefault(require("../plugins/com.google.PixelMemory"));
const com_google_YouTubeTrace_1 = tslib_1.__importDefault(require("../plugins/com.google.YouTubeTrace"));
const com_google_android_GoogleCamera_1 = tslib_1.__importDefault(require("../plugins/com.google.android.GoogleCamera"));
const dev_perfetto_AutoPinAndExpandTracks_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.AutoPinAndExpandTracks"));
const dev_perfetto_BookmarkletApi_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.BookmarkletApi"));
const dev_perfetto_Chaos_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.Chaos"));
const dev_perfetto_CpuFreq_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.CpuFreq"));
const dev_perfetto_CpuProfile_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.CpuProfile"));
const dev_perfetto_CpuidleTimeInState_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.CpuidleTimeInState"));
const dev_perfetto_CriticalPath_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.CriticalPath"));
const dev_perfetto_DebugTracks_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.DebugTracks"));
const dev_perfetto_DeeplinkQuerystring_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.DeeplinkQuerystring"));
const dev_perfetto_EntityStateResidency_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.EntityStateResidency"));
const dev_perfetto_ExplorePage_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.ExplorePage"));
const dev_perfetto_Frames_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.Frames"));
const dev_perfetto_Ftrace_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.Ftrace"));
const dev_perfetto_GpuByProcess_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.GpuByProcess"));
const dev_perfetto_GpuFreq_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.GpuFreq"));
const dev_perfetto_HeapProfile_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.HeapProfile"));
const dev_perfetto_InsightsPage_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.InsightsPage"));
const dev_perfetto_InstrumentsSamplesProfile_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.InstrumentsSamplesProfile"));
const dev_perfetto_KernelTrackEvent_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.KernelTrackEvent"));
const dev_perfetto_LinuxPerf_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.LinuxPerf"));
const dev_perfetto_MetricsPage_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.MetricsPage"));
const dev_perfetto_PowerRails_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.PowerRails"));
const dev_perfetto_ProcessSummary_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.ProcessSummary"));
const dev_perfetto_ProcessThreadGroups_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.ProcessThreadGroups"));
const dev_perfetto_QueryLog_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.QueryLog"));
const dev_perfetto_QueryPage_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.QueryPage"));
const dev_perfetto_RecordTraceV2_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.RecordTraceV2"));
const dev_perfetto_Sched_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.Sched"));
const dev_perfetto_Screenshots_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.Screenshots"));
const dev_perfetto_SqlModules_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.SqlModules"));
const dev_perfetto_StandardGroups_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.StandardGroups"));
const dev_perfetto_Thread_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.Thread"));
const dev_perfetto_TimelineSync_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.TimelineSync"));
const dev_perfetto_TraceInfoPage_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.TraceInfoPage"));
const dev_perfetto_TraceMetadata_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.TraceMetadata"));
const dev_perfetto_TraceProcessorTrack_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.TraceProcessorTrack"));
const dev_perfetto_TrackEvent_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.TrackEvent"));
const dev_perfetto_WidgetsPage_1 = tslib_1.__importDefault(require("../plugins/dev.perfetto.WidgetsPage"));
const org_chromium_ChromeCriticalUserInteractions_1 = tslib_1.__importDefault(require("../plugins/org.chromium.ChromeCriticalUserInteractions"));
const org_chromium_ChromeNavigation_1 = tslib_1.__importDefault(require("../plugins/org.chromium.ChromeNavigation"));
const org_chromium_ChromeScrollJank_1 = tslib_1.__importDefault(require("../plugins/org.chromium.ChromeScrollJank"));
const org_chromium_ChromeTasks_1 = tslib_1.__importDefault(require("../plugins/org.chromium.ChromeTasks"));
const org_chromium_ETM_1 = tslib_1.__importDefault(require("../plugins/org.chromium.ETM"));
const org_chromium_OpenTableCommands_1 = tslib_1.__importDefault(require("../plugins/org.chromium.OpenTableCommands"));
const org_kernel_Io_1 = tslib_1.__importDefault(require("../plugins/org.kernel.Io"));
const org_kernel_LinuxKernelSubsystems_1 = tslib_1.__importDefault(require("../plugins/org.kernel.LinuxKernelSubsystems"));
const org_kernel_SuspendResumeLatency_1 = tslib_1.__importDefault(require("../plugins/org.kernel.SuspendResumeLatency"));
const org_kernel_Wattson_1 = tslib_1.__importDefault(require("../plugins/org.kernel.Wattson"));
exports.default = [
    com_android_AndroidBinderViz_1.default,
    com_android_AndroidClientServer_1.default,
    com_android_AndroidCounterTracks_1.default,
    com_android_AndroidCujs_1.default,
    com_android_AndroidDesktopMode_1.default,
    com_android_AndroidDmabuf_1.default,
    com_android_AndroidLog_1.default,
    com_android_AndroidLongBatteryTracing_1.default,
    com_android_AndroidNetwork_1.default,
    com_android_AndroidPerf_1.default,
    com_android_AndroidPerfTraceCounters_1.default,
    com_android_AndroidStartup_1.default,
    com_android_AvfVmCpuTimeline_1.default,
    com_android_GpuWorkPeriod_1.default,
    com_android_InputEvents_1.default,
    com_android_LargeScreensPerf_1.default,
    com_android_PinAndroidPerfMetrics_1.default,
    com_android_PinSysUITracks_1.default,
    com_android_SysUIWorkspace_1.default,
    com_android_TrustyTeeCpuTimeline_1.default,
    com_example_Commands_1.default,
    com_example_Settings_1.default,
    com_example_Skeleton_1.default,
    com_example_State_1.default,
    com_example_Tabs_1.default,
    com_example_Tracks_1.default,
    com_google_PerfettoMcp_1.default,
    com_google_PixelCpmTrace_1.default,
    com_google_PixelMemory_1.default,
    com_google_YouTubeTrace_1.default,
    com_google_android_GoogleCamera_1.default,
    dev_perfetto_AutoPinAndExpandTracks_1.default,
    dev_perfetto_BookmarkletApi_1.default,
    dev_perfetto_Chaos_1.default,
    dev_perfetto_CpuFreq_1.default,
    dev_perfetto_CpuProfile_1.default,
    dev_perfetto_CpuidleTimeInState_1.default,
    dev_perfetto_CriticalPath_1.default,
    dev_perfetto_DebugTracks_1.default,
    dev_perfetto_DeeplinkQuerystring_1.default,
    dev_perfetto_EntityStateResidency_1.default,
    dev_perfetto_ExplorePage_1.default,
    dev_perfetto_Frames_1.default,
    dev_perfetto_Ftrace_1.default,
    dev_perfetto_GpuByProcess_1.default,
    dev_perfetto_GpuFreq_1.default,
    dev_perfetto_HeapProfile_1.default,
    dev_perfetto_InsightsPage_1.default,
    dev_perfetto_InstrumentsSamplesProfile_1.default,
    dev_perfetto_KernelTrackEvent_1.default,
    dev_perfetto_LinuxPerf_1.default,
    dev_perfetto_MetricsPage_1.default,
    dev_perfetto_PowerRails_1.default,
    dev_perfetto_ProcessSummary_1.default,
    dev_perfetto_ProcessThreadGroups_1.default,
    dev_perfetto_QueryLog_1.default,
    dev_perfetto_QueryPage_1.default,
    dev_perfetto_RecordTraceV2_1.default,
    dev_perfetto_Sched_1.default,
    dev_perfetto_Screenshots_1.default,
    dev_perfetto_SqlModules_1.default,
    dev_perfetto_StandardGroups_1.default,
    dev_perfetto_Thread_1.default,
    dev_perfetto_TimelineSync_1.default,
    dev_perfetto_TraceInfoPage_1.default,
    dev_perfetto_TraceMetadata_1.default,
    dev_perfetto_TraceProcessorTrack_1.default,
    dev_perfetto_TrackEvent_1.default,
    dev_perfetto_WidgetsPage_1.default,
    org_chromium_ChromeCriticalUserInteractions_1.default,
    org_chromium_ChromeNavigation_1.default,
    org_chromium_ChromeScrollJank_1.default,
    org_chromium_ChromeTasks_1.default,
    org_chromium_ETM_1.default,
    org_chromium_OpenTableCommands_1.default,
    org_kernel_Io_1.default,
    org_kernel_LinuxKernelSubsystems_1.default,
    org_kernel_SuspendResumeLatency_1.default,
    org_kernel_Wattson_1.default,
];
//# sourceMappingURL=all_plugins.js.map