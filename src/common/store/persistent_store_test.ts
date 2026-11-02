import {clearPersistentState, isPersistenceEnabled, PersistentStore, setPersistenceEnabledForTest,} from './persistent_store';

describe('PersistentStore privacy boundary', () => {
  beforeEach(() => {
    localStorage.clear();
    setPersistenceEnabledForTest(true);
  });

  afterEach(() => {
    localStorage.clear();
    setPersistenceEnabledForTest(true);
  });

  it('persists only allowlisted display preferences and saved queries', () => {
    const store = new PersistentStore();
    store.add('dark-mode', 'true');
    store.add('theme-mode', 'system');
    store.add('display-scale', '120');
    store.add('savedSearches', '{"searches":[]}');
    store.add('recentSearches', '{"searches":[]}');
    store.add('adb.proxyKey', 'secret');

    expect(localStorage.getItem('dark-mode')).toBe('true');
    expect(localStorage.getItem('theme-mode')).toBe('system');
    expect(localStorage.getItem('display-scale')).toBe('120');
    expect(localStorage.getItem('savedSearches')).toContain('searches');
    expect(localStorage.getItem('recentSearches')).toBeNull();
    expect(localStorage.getItem('adb.proxyKey')).toBeNull();
  });

  it('supports an explicit no-persistence mode and clearing state', () => {
    const store = new PersistentStore();
    store.add('dark-mode', 'true');
    store.add('theme-mode', 'dark');
    store.add('display-scale', '120');
    setPersistenceEnabledForTest(false);
    expect(isPersistenceEnabled()).toBeFalse();
    store.add('dark-mode', 'false');
    store.add('theme-mode', 'light');
    store.add('display-scale', '140');
    expect(store.get('dark-mode')).toBeUndefined();
    expect(store.get('theme-mode')).toBeUndefined();
    expect(store.get('display-scale')).toBeUndefined();
    expect(localStorage.getItem('display-scale')).toBe('120');
    clearPersistentState();
    expect(localStorage.getItem('dark-mode')).toBeNull();
    expect(localStorage.getItem('theme-mode')).toBeNull();
    expect(localStorage.getItem('display-scale')).toBeNull();
  });

  it('round-trips both reset confirmation values using only the exact key', () => {
    const store = new PersistentStore();
    expect(store.get('confirm-trace-reset')).toBeUndefined();
    for (const value of ['false', 'true']) {
      store.add('confirm-trace-reset', value);
      expect(localStorage.getItem('confirm-trace-reset')).toBe(value);
      expect(new PersistentStore().get('confirm-trace-reset')).toBe(value);
    }
    for (const key of [
      'confirm-trace-reset-extra',
      'confirm-trace',
      'confirmTraceReset',
    ]) {
      store.add(key, 'false');
      expect(localStorage.getItem(key)).toBeNull();
      localStorage.setItem(key, 'private');
      expect(store.get(key)).toBeUndefined();
    }
    store.clear('confirm-trace-reset');
    expect(store.get('confirm-trace-reset')).toBeUndefined();
    expect(localStorage.getItem('confirm-trace-reset-extra')).toBe('private');
  });

  it('does not read, write or selectively clear reset confirmation in privacy mode', () => {
    const store = new PersistentStore();
    store.add('confirm-trace-reset', 'false');
    localStorage.setItem('aiPrompts', 'private');
    setPersistenceEnabledForTest(false);
    expect(store.get('confirm-trace-reset')).toBeUndefined();
    store.add('confirm-trace-reset', 'true');
    store.clear('confirm-trace-reset');
    expect(localStorage.getItem('confirm-trace-reset')).toBe('false');
    clearPersistentState();
    expect(localStorage.getItem('confirm-trace-reset')).toBeNull();
    expect(localStorage.getItem('aiPrompts')).toBe('private');
    store.add('confirm-trace-reset', 'true');
    expect(localStorage.getItem('confirm-trace-reset')).toBeNull();
  });
});
