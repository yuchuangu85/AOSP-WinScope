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

import {TestBed} from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DOMTestHelper} from '@common/testing/dom_test_helpers';

import {CollapsibleSectionTitleComponent} from './collapsible_section_title_component';

describe('CollapsibleSectionTitleComponent', () => {
  let component: CollapsibleSectionTitleComponent;
  let dom: DOMTestHelper<CollapsibleSectionTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CollapsibleSectionTitleComponent,
        MatButtonModule,
        MatIconModule,
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(CollapsibleSectionTitleComponent);
    component = fixture.componentInstance;
    dom = new DOMTestHelper(fixture, fixture.nativeElement);
    dom.setComponentInput('title', 'collapsible section');
    dom.detectChanges();
  });

  it('can be created', () => {
    expect(component).toBeTruthy();
  });

  it('displays button and title', () => {
    expect(dom.find('button')).toBeDefined();
    dom.get('.section-title').checkText('COLLAPSIBLE SECTION');
  });

  it('emits collapseButtonClicked event', () => {
    const spy = spyOn(component.collapseButtonClicked, 'emit');
    dom.findAndClick('button');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('uses compact client-sized title text and icons with centered click targets', () => {
    const title = dom.get('.section-title').getHTMLElement();
    const icon = dom.get('mat-icon').getHTMLElement();
    const button = dom.get('button').getHTMLElement();
    expect(getComputedStyle(title).fontSize).toBe('14px');
    expect(getComputedStyle(title).lineHeight).toBe('20px');
    expect(getComputedStyle(icon).fontSize).toBe('18px');
    expect(getComputedStyle(icon).width).toBe('18px');
    expect(getComputedStyle(icon).height).toBe('18px');
    expect(button.getBoundingClientRect().width).toBe(32);
    expect(button.getBoundingClientRect().height).toBe(32);
    expect(getComputedStyle(button).alignItems).toBe('center');
  });
});
