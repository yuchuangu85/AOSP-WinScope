/*
 * Copyright (C) 2023 The Android Open Source Project
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

import {CdkDragEnd, CdkDragMove, CdkDragStart, DragDropModule,} from '@angular/cdk/drag-drop';
import {ChangeDetectorRef, Component, effect, ElementRef, HostListener, Inject, input, output, viewChild,} from '@angular/core';
import {assertDefined} from '@common/assert';
import {Point} from '@common/geometry/point';
import {TimeRange, Timestamp} from '@common/time/time';
import {ComponentTimestampConverter} from '@common/time/timestamp_converter';
import {TracePosition} from '@trace_api/trace_position';

import {Transformer} from './drawer/transformer';

/**
 * A component for displaying a slider to control the zoom level of the timeline.
 */
@Component({
  selector: 'slider',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './slider_component.ng.html',
  styleUrls: ['slider_component.scss'],
})
export class SliderComponent {
  fullRange = input.required<TimeRange>();
  zoomRange = input.required<TimeRange>();
  currentPosition = input.required<TracePosition>();
  timestampConverter = input.required<ComponentTimestampConverter>();

  readonly onZoomChanged = output<TimeRange>();

  readonly sliderBox = viewChild.required<ElementRef<HTMLElement>>('sliderBox');

  dragging = false;
  sliderWidth = 0;
  dragPosition: Point = {x: 0, y: 0};
  viewInitialized = false;
  cursorOffset = 0;
  slideStartX: number | undefined = undefined;

  constructor(@Inject(ChangeDetectorRef) private cdr: ChangeDetectorRef) {
    effect(() => {
      const zoomRange = this.zoomRange();
      if (zoomRange !== undefined && !this.dragging) {
        this.syncDragPositionTo(zoomRange);
      }
    });

    effect(() => {
      const currentPosition = this.currentPosition();
      if (currentPosition !== undefined) {
        this.syncCursorPositionTo(currentPosition.timestamp);
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.syncCursorPositionTo(this.currentPosition().timestamp);
  }

  ngAfterViewChecked() {
    if (!this.dragging) {
      this.syncDragPositionTo(this.zoomRange());
    }
    this.cdr.detectChanges();
  }

  @HostListener('window:resize', ['$event'])
  onResize(_: Event) {
    this.syncDragPositionTo(this.zoomRange());
    this.syncCursorPositionTo(this.currentPosition().timestamp);
  }

  onSlideStart(e: CdkDragStart) {
    this.dragging = true;
    this.slideStartX = e.source.freeDragPosition.x / this.getDragScale();
    document.body.classList.add('inheritCursors');
    document.body.style.cursor = 'grabbing';
  }

  onSlideEnd(_: CdkDragEnd) {
    this.dragging = false;
    this.slideStartX = undefined;
    this.syncDragPositionTo(this.zoomRange());
    document.body.classList.remove('inheritCursors');
    document.body.style.cursor = 'unset';
  }

  onSliderMove(e: CdkDragMove) {
    const zoomRange = this.zoomRange();
    const newX = assertDefined(this.slideStartX) + e.distance.x / this.getDragScale();

    // Calculation to adjust for min width slider
    let from = this.getTransformer()
      .untransform(newX + this.sliderWidth / 2)
      .minus(zoomRange.to.minus(zoomRange.from).div(2n));
    const fullRange = this.fullRange();
    const latestFrom = fullRange.to.minus(zoomRange.to.minus(zoomRange.from));
    if (from.getValueNs() < fullRange.startNs) {
      from = fullRange.from;
    }
    if (from.getValueNs() > latestFrom.getValueNs()) {
      from = latestFrom;
    }

    const to = this.timestampConverter().makeTimestampFromNs(
      from.getValueNs() + zoomRange.endNs - zoomRange.startNs,
    );

    this.onZoomChanged.emit(new TimeRange(from, to));
  }

  startMoveLeft(e: MouseEvent) {
    e.preventDefault();

    const startPos = e.clientX;
    const startOffset = this.getTransformer().transform(this.zoomRange().from);

    const listener = (event: MouseEvent) => {
      const movedX = (event.clientX - startPos) / this.getDragScale();
      let from = this.getTransformer().untransform(startOffset + movedX);
      const fullRange = this.fullRange();
      const zoomRange = this.zoomRange();
      if (from.getValueNs() < fullRange.startNs) {
        from = fullRange.from;
      }
      if (from.getValueNs() > zoomRange.endNs) {
        from = zoomRange.to;
      }
      const to = zoomRange.to;

      this.onZoomChanged.emit(new TimeRange(from, to));
    };
    addEventListener('mousemove', listener);

    const mouseUpListener = () => {
      removeEventListener('mousemove', listener);
      removeEventListener('mouseup', mouseUpListener);
    };
    addEventListener('mouseup', mouseUpListener);
  }

  startMoveRight(e: MouseEvent) {
    e.preventDefault();

    const startPos = e.clientX;
    const startOffset = this.getTransformer().transform(this.zoomRange().to);

    const listener = (event: MouseEvent) => {
      const movedX = (event.clientX - startPos) / this.getDragScale();
      const fullRange = this.fullRange();
      const zoomRange = this.zoomRange();
      const from = zoomRange.from;
      let to = this.getTransformer().untransform(startOffset + movedX);
      if (to.getValueNs() > fullRange.endNs) {
        to = fullRange.to;
      }
      if (to.getValueNs() < zoomRange.startNs) {
        to = zoomRange.from;
      }

      this.onZoomChanged.emit(new TimeRange(from, to));
    };
    addEventListener('mousemove', listener);

    const mouseUpListener = () => {
      removeEventListener('mousemove', listener);
      removeEventListener('mouseup', mouseUpListener);
    };
    addEventListener('mouseup', mouseUpListener);
  }

  getDragScale(): number {
    if (!this.viewInitialized) {
      return 1;
    }
    const box = this.sliderBox().nativeElement;
    const width = box.getBoundingClientRect().width;
    return box.offsetWidth > 0 && width > 0 ? width / box.offsetWidth : 1;
  }

  private syncDragPositionTo(zoomRange: TimeRange) {
    this.sliderWidth = this.computeSliderWidth();
    const middleOfZoomRange = zoomRange.from.add(
      zoomRange.to.minus(zoomRange.from).div(2n).getValueNs(),
    );

    this.dragPosition = {
      // CDK applies the inverse scale to both the initial position and drag deltas.
      x:
        (this.getTransformer().transform(middleOfZoomRange) -
          this.sliderWidth / 2) * this.getDragScale(),
      y: 0,
    };
  }

  private syncCursorPositionTo(timestamp: Timestamp) {
    this.cursorOffset = this.getTransformer().transform(timestamp);
  }

  private getTransformer(): Transformer {
    const width = this.viewInitialized
      ? this.sliderBox().nativeElement.offsetWidth
      : 0;
    return new Transformer(
      this.fullRange(),
      {from: 0, to: width},
      this.timestampConverter(),
    );
  }

  private computeSliderWidth() {
    const transformer = this.getTransformer();
    const zoomRange = this.zoomRange();
    let width =
      transformer.transform(zoomRange.to) -
      transformer.transform(zoomRange.from);
    if (width < MIN_SLIDER_WIDTH) {
      width = MIN_SLIDER_WIDTH;
    }

    return width;
  }
}

/**
 * The minimum width of the slider in pixels.
 */
export const MIN_SLIDER_WIDTH = 30;
