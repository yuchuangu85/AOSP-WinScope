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
    store.add('savedSearches', '{"searches":[]}');
    store.add('recentSearches', '{"searches":[]}');
    store.add('adb.proxyKey', 'secret');

    expect(localStorage.getItem('dark-mode')).toBe('true');
    expect(localStorage.getItem('savedSearches')).toContain('searches');
    expect(localStorage.getItem('recentSearches')).toBeNull();
    expect(localStorage.getItem('adb.proxyKey')).toBeNull();
  });

  it('supports an explicit no-persistence mode and clearing state', () => {
    const store = new PersistentStore();
    store.add('dark-mode', 'true');
    setPersistenceEnabledForTest(false);
    expect(isPersistenceEnabled()).toBeFalse();
    store.add('dark-mode', 'false');
    expect(store.get('dark-mode')).toBeUndefined();
    clearPersistentState();
    expect(localStorage.getItem('dark-mode')).toBeNull();
  });
});
