import {averageLuma, averagePixelDifference} from './display_evidence_builder';

describe('Display evidence builder', () => {
  it('computes normalized luminance from RGBA pixels', () => {
    expect(averageLuma(new Uint8ClampedArray([0, 0, 0, 255]))).toBe(0);
    expect(
      averageLuma(new Uint8ClampedArray([255, 255, 255, 255, 255])),
    ).toBeCloseTo(1, 10);
  });

  it('computes normalized RGB frame difference', () => {
    expect(
      averagePixelDifference(
        new Uint8ClampedArray([0, 0, 0, 255]),
        new Uint8ClampedArray([255, 255, 255, 255]),
      ),
    ).toBe(1);
  });
});
