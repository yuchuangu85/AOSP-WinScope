import {makeWarningProxyTracingErrors, makeWarningProxyTracingWarnings,} from '@trace_collection/warnings';
import {BugreportData, BuildType} from '@ui/trace_loading/bugreport_data';
import {makeWarningCorruptedArchive, makeWarningExportTooLarge, makeWarningMissingPersistentTrace, makeWarningTraceOverridden,} from '@ui/trace_loading/warnings';

import {setLanguage, translate} from './i18n';

describe('Localized diagnostics boundary', () => {
  afterEach(() => setLanguage('en'));

  for (const [makeWarning, source, translated] of [
    [
      makeWarningProxyTracingErrors,
      'Trace collection errors: ',
      '跟踪采集错误：',
    ],
    [
      makeWarningProxyTracingWarnings,
      'Trace collection warning: ',
      '跟踪采集警告：',
    ],
  ] as const) {
    it(`localizes ${source} without changing external diagnostic text`, () => {
      const payload = ['Save', 'device:<b>{errors}</b> /data/local/tmp/trace'];
      const warning = makeWarning([...payload]);
      const params = payload.join(', ');
      setLanguage('zh-CN');
      expect(warning.message).toBe(source + params);
      expect(
        translate(warning.localization!.source, warning.localization!.params),
      ).toBe(translated + params);
      setLanguage('en');
      expect(
        translate(warning.localization!.source, warning.localization!.params),
      ).toBe(source + params);
    });
  }

  it('keeps raw diagnostics in English and interpolates filename data verbatim for display', () => {
    const warning = makeWarningCorruptedArchive(new File([], 'Save <b>.zip'));
    setLanguage('zh-CN');
    expect(warning.message).toBe('Save <b>.zip: corrupted archive');
    expect(
      translate(warning.localization!.source, warning.localization!.params),
    ).toBe('Save <b>.zip：压缩包已损坏');
    const overridden = makeWarningTraceOverridden('Status');
    expect(
      translate(
        overridden.localization!.source,
        overridden.localization!.params,
      ),
    ).toBe('Status：已被另一个同类型跟踪替代');
  });

  it('preserves count and command parameters without translating or executing them', () => {
    setLanguage('zh-CN');
    const large = makeWarningExportTooLarge(1000);
    expect(
      translate(large.localization!.source, large.localization!.params),
    ).toContain('1000');
    const bugreport = {
      buildType: BuildType.USERDEBUG,
      isPersistentTracingEnabled: false,
    } as BugreportData;
    const warning = makeWarningMissingPersistentTrace(
      bugreport,
      'persist.wm.trace.enabled',
    );
    const displayed = translate(
      warning.localization!.source,
      warning.localization!.params,
    );
    expect(displayed).toContain(
      'adb shell setprop persist.wm.trace.enabled 1 && adb reboot',
    );
    expect(displayed).toContain('持续跟踪属性');
    expect(warning.message).toContain('No Winscope Perfetto trace found');
  });
});
