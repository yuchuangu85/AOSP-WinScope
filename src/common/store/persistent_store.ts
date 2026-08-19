/*
 * Copyright (C) 2022 The Android Open Source Project
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

import {Store} from './store';

const DISPLAY_PREFERENCE_KEYS = new Set(['dark-mode', 'savedSearches']);
let persistenceEnabled =
  typeof window === 'undefined' ||
  !new URLSearchParams(window.location.search).has('no-persistence');

function isAllowedKey(key: string): boolean {
  return (
    DISPLAY_PREFERENCE_KEYS.has(key) ||
    key.endsWith('Options') ||
    key.startsWith('treeView')
  );
}

export function isPersistenceEnabled(): boolean {
  return persistenceEnabled;
}

export function setPersistenceEnabledForTest(enabled: boolean): void {
  persistenceEnabled = enabled;
}

/** Clears only WinScope's allowlisted persistent preferences. */
export function clearPersistentState(): void {
  Object.keys(localStorage).forEach((key) => {
    if (isAllowedKey(key)) localStorage.removeItem(key);
  });
}

/**
 * A persistent store implementation that uses localStorage to store data.
 */
export class PersistentStore implements Store {
  add(key: string, value: string) {
    if (!persistenceEnabled || !isAllowedKey(key)) return;
    localStorage.setItem(key, value);
  }

  get(key: string): string | undefined {
    if (!persistenceEnabled || !isAllowedKey(key)) return undefined;
    return localStorage.getItem(key) ?? undefined;
  }

  clear(keySubstring: string) {
    if (!persistenceEnabled) return;
    Object.keys(localStorage).forEach((key) => {
      if (isAllowedKey(key) && key.includes(keySubstring)) {
        localStorage.removeItem(key);
      }
    });
  }
}
