import {TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TimelineData} from '@ui/timeline/timeline_data';

import {TimelineComponent} from './timeline_component';

describe('Timeline editing shortcut isolation', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [TimelineComponent, NoopAnimationsModule]})
      .overrideComponent(TimelineComponent, {set: {template: ''}}).compileComponents();
  });

  for (const tag of ['textarea', 'input', 'div'] as const) {
    for (const key of [' ', 'ArrowLeft', 'ArrowRight']) {
      it(`preserves ${JSON.stringify(key)} in ${tag} without relying on focus events`, async () => {
        const fixture = TestBed.createComponent(TimelineComponent);
        const component = fixture.componentInstance;
        const timeline = jasmine.createSpyObj<TimelineData>('TimelineData', ['hasMoreThanOneDistinctTimestamp']);
        timeline.hasMoreThanOneDistinctTimestamp.and.returnValue(true);
        fixture.componentRef.setInput('timelineData', timeline);
        spyOn(component, 'traceSupportsPlayback').and.returnValue(true);
        const playback = spyOn(component, 'onPlaybackStateChange').and.resolveTo();
        const next = spyOn(component, 'moveToNextEntry').and.resolveTo();
        const previous = spyOn(component, 'moveToPreviousEntry').and.resolveTo();
        const target = document.createElement(tag);
        if (tag === 'div') target.contentEditable = 'true';
        document.body.append(target);
        const event = new KeyboardEvent('keydown', {key, code: key === ' ' ? 'Space' : key,
          keyCode: key === ' ' ? 32 : 0, bubbles: true, cancelable: true});
        const handle = (received: KeyboardEvent) => void component.handleKeyboardEvent(received);
        document.addEventListener('keydown', handle);
        try {
          target.dispatchEvent(event);
          expect(event.defaultPrevented).toBeFalse();
          expect(playback).not.toHaveBeenCalled();
          expect(next).not.toHaveBeenCalled();
          expect(previous).not.toHaveBeenCalled();
        } finally {
          document.removeEventListener('keydown', handle);
          target.remove();
          fixture.destroy();
        }
      });
    }
  }

  it('preserves the space playback shortcut on a viewer surface', async () => {
    const fixture = TestBed.createComponent(TimelineComponent);
    const component = fixture.componentInstance;
    const timeline = jasmine.createSpyObj<TimelineData>('TimelineData', ['hasMoreThanOneDistinctTimestamp']);
    timeline.hasMoreThanOneDistinctTimestamp.and.returnValue(true);
    fixture.componentRef.setInput('timelineData', timeline);
    spyOn(component, 'traceSupportsPlayback').and.returnValue(true);
    const playback = spyOn(component, 'onPlaybackStateChange').and.resolveTo();
    const event = new KeyboardEvent('keydown', {key: ' ', keyCode: 32, cancelable: true});
    try {
      await component.handleKeyboardEvent(event);
      expect(event.defaultPrevented).toBeTrue();
      expect(playback).toHaveBeenCalledTimes(1);
    } finally { fixture.destroy(); }
  });
});
