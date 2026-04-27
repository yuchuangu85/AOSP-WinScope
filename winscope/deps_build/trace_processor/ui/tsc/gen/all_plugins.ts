import comAndroidAndroidbinderviz from '../plugins/com.android.AndroidBinderViz';
import comAndroidAndroidclientserver from '../plugins/com.android.AndroidClientServer';
import comAndroidAndroidcountertracks from '../plugins/com.android.AndroidCounterTracks';
import comAndroidAndroidcujs from '../plugins/com.android.AndroidCujs';
import comAndroidAndroiddesktopmode from '../plugins/com.android.AndroidDesktopMode';
import comAndroidAndroiddmabuf from '../plugins/com.android.AndroidDmabuf';
import comAndroidAndroidlog from '../plugins/com.android.AndroidLog';
import comAndroidAndroidlongbatterytracing from '../plugins/com.android.AndroidLongBatteryTracing';
import comAndroidAndroidnetwork from '../plugins/com.android.AndroidNetwork';
import comAndroidAndroidperf from '../plugins/com.android.AndroidPerf';
import comAndroidAndroidperftracecounters from '../plugins/com.android.AndroidPerfTraceCounters';
import comAndroidAndroidstartup from '../plugins/com.android.AndroidStartup';
import comAndroidAvfvmcputimeline from '../plugins/com.android.AvfVmCpuTimeline';
import comAndroidGpuworkperiod from '../plugins/com.android.GpuWorkPeriod';
import comAndroidInputevents from '../plugins/com.android.InputEvents';
import comAndroidLargescreensperf from '../plugins/com.android.LargeScreensPerf';
import comAndroidPinandroidperfmetrics from '../plugins/com.android.PinAndroidPerfMetrics';
import comAndroidPinsysuitracks from '../plugins/com.android.PinSysUITracks';
import comAndroidSysuiworkspace from '../plugins/com.android.SysUIWorkspace';
import comAndroidTrustyteecputimeline from '../plugins/com.android.TrustyTeeCpuTimeline';
import comExampleCommands from '../plugins/com.example.Commands';
import comExampleSettings from '../plugins/com.example.Settings';
import comExampleSkeleton from '../plugins/com.example.Skeleton';
import comExampleState from '../plugins/com.example.State';
import comExampleTabs from '../plugins/com.example.Tabs';
import comExampleTracks from '../plugins/com.example.Tracks';
import comGooglePerfettomcp from '../plugins/com.google.PerfettoMcp';
import comGooglePixelcpmtrace from '../plugins/com.google.PixelCpmTrace';
import comGooglePixelmemory from '../plugins/com.google.PixelMemory';
import comGoogleYoutubetrace from '../plugins/com.google.YouTubeTrace';
import comGoogleAndroidGooglecamera from '../plugins/com.google.android.GoogleCamera';
import devPerfettoAutopinandexpandtracks from '../plugins/dev.perfetto.AutoPinAndExpandTracks';
import devPerfettoBookmarkletapi from '../plugins/dev.perfetto.BookmarkletApi';
import devPerfettoChaos from '../plugins/dev.perfetto.Chaos';
import devPerfettoCpufreq from '../plugins/dev.perfetto.CpuFreq';
import devPerfettoCpuprofile from '../plugins/dev.perfetto.CpuProfile';
import devPerfettoCpuidletimeinstate from '../plugins/dev.perfetto.CpuidleTimeInState';
import devPerfettoCriticalpath from '../plugins/dev.perfetto.CriticalPath';
import devPerfettoDebugtracks from '../plugins/dev.perfetto.DebugTracks';
import devPerfettoDeeplinkquerystring from '../plugins/dev.perfetto.DeeplinkQuerystring';
import devPerfettoEntitystateresidency from '../plugins/dev.perfetto.EntityStateResidency';
import devPerfettoExplorepage from '../plugins/dev.perfetto.ExplorePage';
import devPerfettoFrames from '../plugins/dev.perfetto.Frames';
import devPerfettoFtrace from '../plugins/dev.perfetto.Ftrace';
import devPerfettoGpubyprocess from '../plugins/dev.perfetto.GpuByProcess';
import devPerfettoGpufreq from '../plugins/dev.perfetto.GpuFreq';
import devPerfettoHeapprofile from '../plugins/dev.perfetto.HeapProfile';
import devPerfettoInsightspage from '../plugins/dev.perfetto.InsightsPage';
import devPerfettoInstrumentssamplesprofile from '../plugins/dev.perfetto.InstrumentsSamplesProfile';
import devPerfettoKerneltrackevent from '../plugins/dev.perfetto.KernelTrackEvent';
import devPerfettoLinuxperf from '../plugins/dev.perfetto.LinuxPerf';
import devPerfettoMetricspage from '../plugins/dev.perfetto.MetricsPage';
import devPerfettoPowerrails from '../plugins/dev.perfetto.PowerRails';
import devPerfettoProcesssummary from '../plugins/dev.perfetto.ProcessSummary';
import devPerfettoProcessthreadgroups from '../plugins/dev.perfetto.ProcessThreadGroups';
import devPerfettoQuerylog from '../plugins/dev.perfetto.QueryLog';
import devPerfettoQuerypage from '../plugins/dev.perfetto.QueryPage';
import devPerfettoRecordtracev2 from '../plugins/dev.perfetto.RecordTraceV2';
import devPerfettoSched from '../plugins/dev.perfetto.Sched';
import devPerfettoScreenshots from '../plugins/dev.perfetto.Screenshots';
import devPerfettoSqlmodules from '../plugins/dev.perfetto.SqlModules';
import devPerfettoStandardgroups from '../plugins/dev.perfetto.StandardGroups';
import devPerfettoThread from '../plugins/dev.perfetto.Thread';
import devPerfettoTimelinesync from '../plugins/dev.perfetto.TimelineSync';
import devPerfettoTraceinfopage from '../plugins/dev.perfetto.TraceInfoPage';
import devPerfettoTracemetadata from '../plugins/dev.perfetto.TraceMetadata';
import devPerfettoTraceprocessortrack from '../plugins/dev.perfetto.TraceProcessorTrack';
import devPerfettoTrackevent from '../plugins/dev.perfetto.TrackEvent';
import devPerfettoWidgetspage from '../plugins/dev.perfetto.WidgetsPage';
import orgChromiumChromecriticaluserinteractions from '../plugins/org.chromium.ChromeCriticalUserInteractions';
import orgChromiumChromenavigation from '../plugins/org.chromium.ChromeNavigation';
import orgChromiumChromescrolljank from '../plugins/org.chromium.ChromeScrollJank';
import orgChromiumChrometasks from '../plugins/org.chromium.ChromeTasks';
import orgChromiumEtm from '../plugins/org.chromium.ETM';
import orgChromiumOpentablecommands from '../plugins/org.chromium.OpenTableCommands';
import orgKernelIo from '../plugins/org.kernel.Io';
import orgKernelLinuxkernelsubsystems from '../plugins/org.kernel.LinuxKernelSubsystems';
import orgKernelSuspendresumelatency from '../plugins/org.kernel.SuspendResumeLatency';
import orgKernelWattson from '../plugins/org.kernel.Wattson';

export default [
  comAndroidAndroidbinderviz,
  comAndroidAndroidclientserver,
  comAndroidAndroidcountertracks,
  comAndroidAndroidcujs,
  comAndroidAndroiddesktopmode,
  comAndroidAndroiddmabuf,
  comAndroidAndroidlog,
  comAndroidAndroidlongbatterytracing,
  comAndroidAndroidnetwork,
  comAndroidAndroidperf,
  comAndroidAndroidperftracecounters,
  comAndroidAndroidstartup,
  comAndroidAvfvmcputimeline,
  comAndroidGpuworkperiod,
  comAndroidInputevents,
  comAndroidLargescreensperf,
  comAndroidPinandroidperfmetrics,
  comAndroidPinsysuitracks,
  comAndroidSysuiworkspace,
  comAndroidTrustyteecputimeline,
  comExampleCommands,
  comExampleSettings,
  comExampleSkeleton,
  comExampleState,
  comExampleTabs,
  comExampleTracks,
  comGooglePerfettomcp,
  comGooglePixelcpmtrace,
  comGooglePixelmemory,
  comGoogleYoutubetrace,
  comGoogleAndroidGooglecamera,
  devPerfettoAutopinandexpandtracks,
  devPerfettoBookmarkletapi,
  devPerfettoChaos,
  devPerfettoCpufreq,
  devPerfettoCpuprofile,
  devPerfettoCpuidletimeinstate,
  devPerfettoCriticalpath,
  devPerfettoDebugtracks,
  devPerfettoDeeplinkquerystring,
  devPerfettoEntitystateresidency,
  devPerfettoExplorepage,
  devPerfettoFrames,
  devPerfettoFtrace,
  devPerfettoGpubyprocess,
  devPerfettoGpufreq,
  devPerfettoHeapprofile,
  devPerfettoInsightspage,
  devPerfettoInstrumentssamplesprofile,
  devPerfettoKerneltrackevent,
  devPerfettoLinuxperf,
  devPerfettoMetricspage,
  devPerfettoPowerrails,
  devPerfettoProcesssummary,
  devPerfettoProcessthreadgroups,
  devPerfettoQuerylog,
  devPerfettoQuerypage,
  devPerfettoRecordtracev2,
  devPerfettoSched,
  devPerfettoScreenshots,
  devPerfettoSqlmodules,
  devPerfettoStandardgroups,
  devPerfettoThread,
  devPerfettoTimelinesync,
  devPerfettoTraceinfopage,
  devPerfettoTracemetadata,
  devPerfettoTraceprocessortrack,
  devPerfettoTrackevent,
  devPerfettoWidgetspage,
  orgChromiumChromecriticaluserinteractions,
  orgChromiumChromenavigation,
  orgChromiumChromescrolljank,
  orgChromiumChrometasks,
  orgChromiumEtm,
  orgChromiumOpentablecommands,
  orgKernelIo,
  orgKernelLinuxkernelsubsystems,
  orgKernelSuspendresumelatency,
  orgKernelWattson,
];
