/** Application-owned diagnostic prose, never provider/device error payloads. */
export const NOTIFICATION_TRANSLATIONS: Record<string, string> = {
  'Trace collection errors: {errors}': '跟踪采集错误：{errors}',
  'Trace collection warning: {warnings}': '跟踪采集警告：{warnings}',
  "... (cropped {count} '{descriptor}' message)":
    "…（已省略 {count} 条 '{descriptor}' 消息）",
  "... (cropped {count} '{descriptor}' messages)":
    "…（已省略 {count} 条 '{descriptor}' 消息）",
  'Export diagnostics? Files: - diagnostics.json Includes product/runtime mode, loaded trace type names, parser status, and packet-loss count. Excludes trace bytes, filenames, paths, tokens, commands, device serials, and device identity.':
    '是否导出诊断信息？\n\n文件：\n- diagnostics.json\n\n包含产品/运行模式、已加载跟踪的类型、解析状态和丢包数量。\n不包含原始跟踪数据、文件名、路径、令牌、命令、设备序列号或设备身份信息。',
  'No trace targets selected.': '未选择跟踪目标。',
  'No valid trace files found': '未找到有效的跟踪文件',
  'No results to export': '没有可导出的结果',
  '{filename}: corrupted archive': '{filename}：压缩包已损坏',
  'Error occurred in frame mapping: {error}': '帧映射出错：{error}',
  'Trace processor errors were identified on the following traces: {traces}':
    '以下跟踪中发现了跟踪处理器错误：{traces}',
  'No valid trace files found for {traces}':
    '未找到以下类型的有效跟踪文件：{traces}',
  '{descriptor}: trace contains only elapsed timestamps so many not be accurately synced with other real-time traces.':
    '{descriptor}：跟踪只包含相对时间戳，可能无法与其他实时时间戳跟踪准确同步。',
  '{descriptors}: discarded because data is old':
    '{descriptors}：数据过旧，已丢弃',
  '{descriptors}: discarded because data is older than {duration}':
    '{descriptors}：数据早于 {duration}，已丢弃',
  '{descriptor}: overridden by another trace of type {type}':
    '{descriptor}：已被另一个 {type} 类型的跟踪替代',
  '{descriptor}: overridden by another trace of same type':
    '{descriptor}：已被另一个同类型跟踪替代',
  '{descriptor}: file format was not recognized as a supported Winscope trace':
    '{descriptor}：文件格式不是受支持的 Winscope 跟踪',
  'Result set is too large for CSV export (max {maxRows} rows). Try narrowing your query.':
    '结果集过大，无法导出为 CSV（最多 {maxRows} 行）。请缩小查询范围。',
  'No Winscope Perfetto trace found in bug report.':
    '错误报告中未找到 Winscope Perfetto 跟踪。',
  "No Winscope Perfetto trace found in bug report. This is expected on 'user' builds. Persistent tracing usually requires a 'userdebug' or 'eng' build, or root access.":
    "错误报告中未找到 Winscope Perfetto 跟踪。这在 'user' 构建中属于预期行为。持续跟踪通常需要 'userdebug' 或 'eng' 构建，或 root 权限。",
  "No Winscope Perfetto trace found in bug report. The persistent tracing property ('{property}') seems to be disabled. You can try enabling it via: '{command}' Then, reproduce the issue and capture a new bug report.":
    "错误报告中未找到 Winscope Perfetto 跟踪。持续跟踪属性（'{property}'）可能尚未启用。可尝试运行以下命令：\n'{command}'\n然后复现问题并重新采集错误报告。",
  "No Winscope Perfetto trace found in bug report. Ensure the bugreport comes from a device where persistent tracing is enabled (e.g., dogfood devices or using '{command}').":
    "错误报告中未找到 Winscope Perfetto 跟踪。请确认报告来自已启用持续跟踪的设备（例如 dogfood 设备，或已运行 '{command}' 的设备）。",
};
