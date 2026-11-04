/*
 * Copyright (C) 2024 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {InMemoryStorage} from '@common/store/in_memory_storage';
import {TraceType} from '@trace_api/trace_type';
import {UiTraceTarget} from '@trace_collection/ui_trace_target';

import {applyDiagnosticTracePreset, makeDefaultTraceConfigMap, TraceConfigurationMap, updateConfigsFromStore,} from './ui_trace_configuration';

describe('applyDiagnosticTracePreset', () => {
  const presetTargets = [
    UiTraceTarget.SURFACE_FLINGER_TRACE,
    UiTraceTarget.WINDOW_MANAGER_TRACE,
    UiTraceTarget.TRANSACTIONS,
    UiTraceTarget.SCREEN_RECORDING,
    UiTraceTarget.TRANSITIONS,
  ];
  let configMap: TraceConfigurationMap;

  beforeEach(() => {
    configMap = makeDefaultTraceConfigMap();
  });

  it('leaves diagnostic options off in fresh defaults', () => {
    expect(configMap[UiTraceTarget.TRANSITIONS].config.enabled).toBeFalse();
    expect(
      configMap[UiTraceTarget.SURFACE_FLINGER_TRACE].config.checkboxConfigs.find(
        (config) => config.key === 'tracebuffers',
      )?.enabled,
    ).toBeFalse();
  });

  it('enables only the preset targets and returns a new map retaining config references', () => {
    Object.values(configMap).forEach((trace) => (trace.config.enabled = false));
    const updated = applyDiagnosticTracePreset(configMap);

    expect(updated).not.toBe(configMap);
    for (const [key, trace] of Object.entries(updated)) {
      expect(trace).toBe(configMap[key]);
      expect(trace.config.enabled).toBe(presetTargets.includes(Number(key)));
    }
    expect(makeDefaultTraceConfigMap()[UiTraceTarget.TRANSITIONS].config.enabled)
      .toBeFalse();
  });

  it('sets SF composition and tracebuffers and WM frame and verbose only', () => {
    const sf = configMap[UiTraceTarget.SURFACE_FLINGER_TRACE].config;
    sf.checkboxConfigs.forEach((config) => (config.enabled = false));
    const wm = configMap[UiTraceTarget.WINDOW_MANAGER_TRACE].config;
    wm.selectionConfigs.find((config) => config.key === 'tracingtype')!.value =
      'transaction';
    wm.selectionConfigs.find((config) => config.key === 'tracinglevel')!.value =
      'critical';
    wm.selectionConfigs.find((config) => config.key === 'wmbuffersize')!.value =
      '8000';

    applyDiagnosticTracePreset(configMap);

    expect(sf.checkboxConfigs.filter((config) => config.enabled).map((c) => c.key))
      .toEqual(['composition', 'tracebuffers']);
    expect(wm.selectionConfigs.map((config) => config.value)).toEqual([
      '8000', 'frame', 'verbose',
    ]);
  });

  for (const target of presetTargets) {
    it(`does not change unavailable target ${UiTraceTarget[target]}`, () => {
      const trace = configMap[target];
      trace.available = false;
      trace.config.enabled = false;
      const before = structuredClone(trace);

      applyDiagnosticTracePreset(configMap);

      expect(configMap[target]).toEqual(before);
    });
  }

  it('does not add missing targets or advanced configs', () => {
    delete configMap[UiTraceTarget.TRANSITIONS];
    configMap[UiTraceTarget.SURFACE_FLINGER_TRACE].config.checkboxConfigs = [];
    configMap[UiTraceTarget.WINDOW_MANAGER_TRACE].config.selectionConfigs = [];
    const beforeKeys = Object.keys(configMap);

    applyDiagnosticTracePreset(configMap);

    expect(Object.keys(configMap)).toEqual(beforeKeys);
    expect(configMap[UiTraceTarget.SURFACE_FLINGER_TRACE].config.checkboxConfigs)
      .toEqual([]);
    expect(configMap[UiTraceTarget.WINDOW_MANAGER_TRACE].config.selectionConfigs)
      .toEqual([]);
  });

  it('respects disabled checkboxes and unsupported selection options', () => {
    const sf = configMap[UiTraceTarget.SURFACE_FLINGER_TRACE].config;
    sf.checkboxConfigs.forEach((config) => {
      config.enabled = false;
      config.disabled = true;
    });
    const wm = configMap[UiTraceTarget.WINDOW_MANAGER_TRACE].config;
    wm.selectionConfigs.forEach((config) => {
      config.value = 'unsupported';
      config.options = [{value: 'unsupported'}];
    });
    const beforeSf = structuredClone(sf);
    const beforeWm = structuredClone(wm);

    applyDiagnosticTracePreset(configMap);

    expect(sf).toEqual(beforeSf);
    expect(wm).toEqual(beforeWm);
  });

  for (const enabled of [false, true]) {
    it(`preserves ${enabled ? 'enabled' : 'disabled'} metadata and HWC and unrelated config`, () => {
      const sf = configMap[UiTraceTarget.SURFACE_FLINGER_TRACE].config;
      sf.checkboxConfigs.forEach((config) => {
        if (['metadata', 'hwc', 'virtualdisplays', 'input'].includes(config.key)) {
          config.enabled = enabled;
        }
      });
      const recording = configMap[UiTraceTarget.SCREEN_RECORDING].config;
      recording.selectionConfigs[0].value = ['custom-display'];
      recording.selectionConfigs[0].options = [{value: 'custom-display'}];
      recording.checkboxConfigs[0].enabled = false;
      const beforeRecording = structuredClone(recording);
      const beforeSfOptions = structuredClone(sf.selectionConfigs);
      const beforeOtherTargets = Object.entries(configMap)
        .filter(([key]) => !presetTargets.includes(Number(key)))
        .map(([key, trace]): [string, typeof trace] => [key, structuredClone(trace)]);

      applyDiagnosticTracePreset(configMap);

      expect(sf.checkboxConfigs.filter((c) =>
        ['metadata', 'hwc', 'virtualdisplays', 'input'].includes(c.key),
      ).every((c) => c.enabled === enabled)).toBeTrue();
      expect(sf.selectionConfigs).toEqual(beforeSfOptions);
      expect(recording).toEqual(beforeRecording);
      expect(Object.entries(configMap)
        .filter(([key]) => !presetTargets.includes(Number(key))))
        .toEqual(beforeOtherTargets);
    });
  }

  it('persists explicit changes through existing proxies without replacing them', () => {
    const storage = new InMemoryStorage();
    updateConfigsFromStore(configMap, storage, 'TraceSettings.');
    const sf = configMap[UiTraceTarget.SURFACE_FLINGER_TRACE].config;
    const storageSpy = spyOn(storage, 'add').and.callThrough();

    const updated = applyDiagnosticTracePreset(configMap);

    expect(updated[UiTraceTarget.SURFACE_FLINGER_TRACE].config).toBe(sf);
    expect(storageSpy).toHaveBeenCalled();
    const restored = updateConfigsFromStore(
      makeDefaultTraceConfigMap(), storage, 'TraceSettings.',
    );
    expect(restored[UiTraceTarget.TRANSITIONS].config.enabled).toBeTrue();
    expect(restored[UiTraceTarget.SURFACE_FLINGER_TRACE].config).toEqual(sf);
  });
});

describe('updateConfigsFromStore', () => {
  const traceKey = 'test_trace';
  const testKeyPrefix = 'test key';
  const testKey = testKeyPrefix + traceKey;
  let target: TraceConfigurationMap;

  beforeEach(() => {
    target = {
      test_trace: {
        name: 'Test Trace',
        config: {
          enabled: true,
          checkboxConfigs: [{name: 'test1', key: 'test1', enabled: false}],
          selectionConfigs: [
            {name: 'test2', key: 'test2', options: [], value: '1'},
            {name: 'test3', key: 'test3', options: [], value: ['1']},
          ],
        },
        available: true,
        types: [TraceType.TEST_TRACE_NUMBER],
      },
    };
  });

  it('updates target enabled field', () => {
    const sourceConfig = {enabled: false};
    updateConfigs(sourceConfig);
    expect(target[traceKey].config.enabled).toBeFalse();
  });

  it('does not override names or options of advanced config', () => {
    const sourceConfig = {
      checkboxConfigs: [{name: 'new1', key: 'test1', enabled: false}],
      selectionConfigs: [{name: 'new2', key: 'test2', options: ['1']}],
    };
    updateConfigs(sourceConfig);
    expect(target[traceKey].config.checkboxConfigs[0].name).toBe('test1');
    const newSelectionConfig = target[traceKey].config.selectionConfigs[0];
    expect(newSelectionConfig.name).toBe('test2');
    expect(newSelectionConfig.options).toEqual([]);
  });

  it('updates only configs that are present in target already', () => {
    updateSelectionConfigOptions();
    const sourceConfig = {
      checkboxConfigs: [
        {name: 'test1', key: 'test1', enabled: true},
        {name: 'test2', key: 'test2', enabled: false},
      ],
      selectionConfigs: [{name: 'test4', key: 'test4', value: ['1']}],
    };
    updateConfigs(sourceConfig);
    expect(target[traceKey].config).toEqual({
      enabled: true,
      checkboxConfigs: [{name: 'test1', key: 'test1', enabled: true}],
      selectionConfigs: [
        {
          name: 'test2',
          key: 'test2',
          options: [{value: '1'}, {value: '2'}],
          value: '1',
        },
        {
          name: 'test3',
          key: 'test3',
          options: [{value: '1'}, {value: '2'}],
          value: ['1'],
        },
      ],
    });
  });

  it('updates select config values', () => {
    updateSelectionConfigOptions();
    const sourceConfig = {
      selectionConfigs: [
        {name: 'test2', key: 'test2', value: '2'},
        {name: 'test3', key: 'test3', value: ['1', '2']},
      ],
    };
    updateConfigs(sourceConfig);
    expect(target[traceKey].config.selectionConfigs).toEqual([
      {
        name: 'test2',
        key: 'test2',
        options: [{value: '1'}, {value: '2'}],
        value: '2',
      },
      {
        name: 'test3',
        key: 'test3',
        options: [{value: '1'}, {value: '2'}],
        value: ['1', '2'],
      },
    ]);
  });

  it('does not update select config if stored value not in options', () => {
    const sourceConfig = {
      selectionConfigs: [
        {name: 'test2', key: 'test2', value: '2'},
        {name: 'test3', key: 'test3', value: ['1', '2']},
      ],
    };
    updateConfigs(sourceConfig);
    expect(target[traceKey].config.selectionConfigs).toEqual([
      {name: 'test2', key: 'test2', options: [], value: '1'},
      {name: 'test3', key: 'test3', options: [], value: ['1']},
    ]);
  });

  it('does not update select config if stored value different type to default value', () => {
    updateSelectionConfigOptions();
    const sourceConfig = {
      selectionConfigs: [
        {name: 'test2', key: 'test2', value: ['1']},
        {name: 'test3', key: 'test3', value: '1'},
      ],
    };
    updateConfigs(sourceConfig);
    expect(target[traceKey].config.selectionConfigs).toEqual([
      {
        name: 'test2',
        key: 'test2',
        options: [{value: '1'}, {value: '2'}],
        value: '1',
      },
      {
        name: 'test3',
        key: 'test3',
        options: [{value: '1'}, {value: '2'}],
        value: ['1'],
      },
    ]);
  });

  function updateSelectionConfigOptions() {
    target[traceKey].config.selectionConfigs[0].options = [
      {value: '1'},
      {value: '2'},
    ];
    target[traceKey].config.selectionConfigs[1].options = [
      {value: '1'},
      {value: '2'},
    ];
  }

  function updateConfigs(sourceConfig: object) {
    const storage = new InMemoryStorage();
    storage.add(testKey, JSON.stringify(sourceConfig));
    updateConfigsFromStore(target, storage, testKeyPrefix);
  }
});
