/*
 * Copyright (C) 2026 The Android Open Source Project
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

import {convertHexToRgb, getCanvasMousePosition} from './timeline_drawer_helpers';

describe('timeline_drawer_helpers', () => {
  describe('getCanvasMousePosition', () => {
    for (const zoom of [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4]) {
      it(`converts rendered mouse offsets to drawing coordinates at ${zoom * 100}%`, () => {
        const canvas = document.createElement('canvas');
        canvas.style.width = '400px';
        canvas.style.height = '100px';
        canvas.style.zoom = String(zoom);
        canvas.width = 800;
        canvas.height = 200;
        document.body.appendChild(canvas);
        try {
          const event = new MouseEvent('mousedown');
          Object.defineProperties(event, {offsetX: {value: 240 * zoom}, offsetY: {value: 60 * zoom}});
          const point = getCanvasMousePosition(canvas, event);
          expect(point.x).toBeCloseTo(240, 0);
          expect(point.y).toBeCloseTo(60, 0);
          expect(getCanvasMousePosition(canvas, new MouseEvent('mousemove'))).toEqual({x: 0, y: 0});
        } finally {
          canvas.remove();
        }
      });
    }

    it('does not produce invalid coordinates when the canvas has no rendered bounds', () => {
      const event = new MouseEvent('mousemove');
      Object.defineProperties(event, {offsetX: {value: 20}, offsetY: {value: 5}});
      expect(getCanvasMousePosition(document.createElement('canvas'), event)).toEqual({x: 20, y: 5});
    });
  });

  describe('convertHexToRgb', () => {
    it('handles full regex', () => {
      expect(convertHexToRgb('0135AF')).toEqual({r: 1, g: 53, b: 175});
    });

    it('handles full regex with # prefix', () => {
      expect(convertHexToRgb('#0135AF')).toEqual({r: 1, g: 53, b: 175});
    });

    it('handles shorthand regex', () => {
      expect(convertHexToRgb('13F')).toEqual({r: 17, g: 51, b: 255});
    });

    it('handles shorthand regex with #', () => {
      expect(convertHexToRgb('#13F')).toEqual({r: 17, g: 51, b: 255});
    });

    it('robust to invalid hex string', () => {
      expect(convertHexToRgb('#1')).toBeUndefined();
    });
  });
});
