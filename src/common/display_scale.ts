export const DEFAULT_DISPLAY_SCALE = 100;
export const DISPLAY_SCALE_OPTIONS: readonly number[] = Object.freeze([80, 90, 100, 110, 120, 130, 140]);
export const DISPLAY_SCALE_PREFERENCE_KEY = 'display-scale';

export function isDisplayScale(value: unknown): value is number {
  return typeof value === 'number' && DISPLAY_SCALE_OPTIONS.includes(value);
}

export function parseDisplayScale(value: string | undefined): number {
  const scale = value === undefined || !value.trim() ? NaN : Number(value);
  return isDisplayScale(scale) ? scale : DEFAULT_DISPLAY_SCALE;
}
