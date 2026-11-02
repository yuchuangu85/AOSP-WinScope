// English display text only; identifiers and runtime device/file values stay untouched.
export const CAPTURE_TRANSLATIONS: Record<string, string> = {
  'Collect Traces': '采集跟踪',
  'Upload Traces': '上传跟踪',
  'Refresh connection': '刷新连接',
  'Changing connection...': '正在切换连接…',
  'No devices detected': '未检测到设备',
  'Select a device:': '选择设备：',
  'Change device': '切换设备',
  'Fetch traces from last session': '获取上次会话的跟踪',
  'Permanently delete the Recovery Capture retained on this device':
    '永久删除此设备上保留的恢复采集数据',
  'Delete recovery capture': '删除恢复采集数据',
  'Trace': '跟踪',
  'Dump': '状态快照',
  'Trace targets': '跟踪目标',
  'Dump targets': '快照目标',
  'Start trace': '开始跟踪',
  'End trace': '结束跟踪',
  'Dump state': '获取状态快照',
  'Error:': '错误：',
  'Retry': '重试',
  'Device capture requires the standalone launcher.':
    '设备采集需要使用独立启动器。',
  'Only the standalone launcher capture provider is supported.':
    '仅支持独立启动器采集提供方。',
  'Unavailable on the selected device': '所选设备不支持',
  '{name} configuration': '{name} 配置',
  'Advanced settings': '高级设置',
  'Filter options': '筛选选项',
  'All': '全部',
  'None': '无',
  'Warning': '警告',
  'Connecting...': '正在连接…',
  "Failed to connect. Web Device Proxy doesn't seem to be running.":
    '连接失败，Web Device Proxy 似乎未运行。',
  'Please check you have Web Device Proxy installed.':
    '请确认已安装 Web Device Proxy。',
  'Install (Non-Google users)': '安装（非 Google 用户）',
  'Install (Google employees only)': '安装（仅限 Google 员工）',
  'Web Device Proxy not yet authorized. Enable popups and try again.':
    'Web Device Proxy 尚未获得授权。请允许弹出窗口后重试。',
  'Connecting to the launcher-managed capture session...':
    '正在连接启动器管理的采集会话…',
  'The launcher-managed capture session is unavailable. Restart Winscope with device capture enabled after confirming that Python 3.10+ and ADB are available.':
    '启动器管理的采集会话不可用。请确认 Python 3.10+ 和 ADB 可用，然后启用设备采集并重新启动 Winscope。',
  'The launcher-managed capture session is incompatible.':
    '启动器管理的采集会话不兼容。',
  'Restart Winscope from a matching distribution.':
    '请使用匹配的发行包重新启动 Winscope。',
  'The launcher-managed capture session rejected this browser request.':
    '启动器管理的采集会话拒绝了此浏览器请求。',
  'Restart Winscope to create a fresh local capture session.':
    '请重新启动 Winscope，以创建新的本地采集会话。',
  'Clear all': '全部清除',
  'Download all': '全部下载',
  'Upload another file': '上传其他文件',
  'Upload trace with an associated viewer to visualize':
    '请上传具有对应查看器的跟踪以进行可视化',
  'View traces': '查看跟踪',
  'Legacy traces are converted to Perfetto by default. Select this only to omit them.':
    '旧版跟踪默认会转换为 Perfetto。仅在希望忽略旧版跟踪时选择此项。',
  'Discard legacy traces': '忽略旧版跟踪',
  'Dismiss warning: {message}': '关闭警告：{message}',
  'Remove trace': '移除跟踪',
  'Drag your Winscope file(s) or click to upload':
    '拖放 Winscope 文件，或点击上传',
  'This trace has a legacy format. It will be converted to a Perfetto trace when you click "View traces" unless you explicitly select "Discard legacy traces".':
    '此跟踪采用旧版格式。点击“查看跟踪”时会转换为 Perfetto，除非明确选择“忽略旧版跟踪”。',
  'Must also upload a shell transitions trace to visualize transitions.':
    '还需要上传 Shell 过渡跟踪，才能查看过渡。',
  'Must also upload a wm transitions trace to visualize transitions.':
    '还需要上传 WM 过渡跟踪，才能查看过渡。',
  'Visualization for this trace is not supported in Winscope.':
    'Winscope 尚不支持此跟踪的可视化。',
  'Fetching...': '正在获取…',
  'Loading...': '正在加载…',
  'Opened from external tool. Waiting for files...':
    '已从外部工具打开，正在等待文件…',
  'Downloading files...': '正在下载文件…',
  'Initializing UI...': '正在初始化界面…',
  'Starting trace...': '正在开始跟踪…',
  'Tracing...': '正在跟踪…',
  'Ending trace...': '正在结束跟踪…',
  'Dumping state...': '正在获取状态快照…',
  'Fetching files...': '正在获取文件…',
  'Moving files...': '正在移动文件…',
  'Building traces...': '正在构建跟踪…',
  'Unzipping files...': '正在解压文件…',
  'Converting legacy files to perfetto...': '正在将旧版文件转换为 Perfetto…',
  'Parsing non-proto files': '正在解析非 proto 文件',
  'Parsing proto files': '正在解析 proto 文件',
  'Reading from trace processor...': '正在读取跟踪处理器数据…',
  'Loading perfetto trace...': '正在加载 Perfetto 跟踪…',
  'Collect traces anyway': '仍然采集跟踪',
  'Do not show again': '不再显示',
  'Go back': '返回',
  'Cannot build frame mapping for IME with selected traces - some Winscope features may not work properly. Consider the following selection for valid frame mapping: Surface Flinger, Transactions, Window Manager, IME':
    '无法使用所选跟踪为 IME 构建帧映射，部分 Winscope 功能可能无法正常工作。要获得有效的帧映射，请选择：Surface Flinger、事务、Window Manager 和 IME。',
  'Winscope Proxy': 'Winscope 代理',
  'You can also use CTRL+A to toggle all options':
    '也可以使用 CTRL+A 切换所有选项',
  'groups': '分组',
  'collect stacktrace': '采集堆栈',
  'buffer size (KB)': '缓冲区大小（KB）',
  'tracing type': '跟踪类型',
  'tracing level': '跟踪级别',
  'input': '输入',
  'composition': '合成',
  'metadata (with offscreen layers)': '元数据（包括屏幕外图层）',
  'hwc': 'HWC',
  'trace buffers': '跟踪缓冲区',
  'virtual displays': '虚拟显示屏',
  'displays': '显示屏',
  'pointer location and touches': '指针位置和触摸',
  'Leave empty to track and capture display that is on':
    '留空以跟踪并采集当前开启的显示屏',
  'Leave empty to capture all log groups without stacktrace':
    '留空以采集所有日志分组，不含堆栈',
  'All flags enabled - minimal performance implications':
    '所有标志均已启用，性能影响极小',
  'Leave empty to capture active display': '留空以采集活动显示屏',
  'Window Manager': '窗口管理器',
  'Surface Flinger': 'Surface Flinger',
  'Screen Recording': '屏幕录制',
  'Screenshot': '屏幕截图',
  'Transactions': '事务',
  'View Capture': '视图采集',
  'Input': '输入',
  'WM Transitions': 'WM 过渡',
  'Shell Transitions': 'Shell 过渡',
  'Transitions': '过渡',
  'IME Clients': 'IME 客户端',
  'IME Service': 'IME 服务',
  'IME system_server': 'IME system_server',
  'Motion Events': '运动事件',
  'Key Events': '按键事件',
  'Wayland Dump': 'Wayland 快照',
  'Cannot parse all transitions. Some may be missing in Transitions viewer.':
    '无法解析所有过渡，过渡查看器中可能缺少部分内容。',
  'Cannot visualize all traces: Failed to initialize timeline data. Try removing some traces.':
    '无法显示所有跟踪：时间轴数据初始化失败。请尝试移除部分跟踪。',
  'No trace targets selected.': '未选择跟踪目标。',
  'Errors occurred during tracing: trace timed out':
    '跟踪过程中发生错误：跟踪超时',
  'No valid trace files found': '未找到有效的跟踪文件',
};
