import {DISPLAY_SCALE_OPTIONS, isDisplayScale, parseDisplayScale} from './display_scale';

describe('Display scale', () => {
  it('accepts only the immutable preset list', () => {
    expect(DISPLAY_SCALE_OPTIONS).toEqual([80, 90, 100, 110, 120, 130, 140]);
    expect(Object.isFrozen(DISPLAY_SCALE_OPTIONS)).toBeTrue();
    for (const value of [80, 90, 100, 110, 120, 130, 140]) {
      expect(isDisplayScale(value)).toBeTrue();
      expect(parseDisplayScale(String(value))).toBe(value);
    }
    for (const value of [0, 79, 85, 141, -100, Infinity, NaN, '120', null, undefined]) {
      expect(isDisplayScale(value)).toBeFalse();
    }
  });

  it('restores unsupported or malformed saved values to the default', () => {
    for (const value of [undefined, '', ' ', 'NaN', 'Infinity', '120px', '0', '150', '85']) {
      expect(parseDisplayScale(value)).toBe(100);
    }
    expect(parseDisplayScale(' 120 ')).toBe(120);
  });
});
