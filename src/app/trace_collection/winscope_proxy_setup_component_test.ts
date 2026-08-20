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
import {CommonModule} from '@angular/common';
import {TestBed} from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {DOMTestHelper} from '@common/testing/dom_test_helpers';
import {ConnectionState} from '@trace_collection/connection_state';

import {WinscopeProxySetupComponent} from './winscope_proxy_setup_component';

describe('WinscopeProxySetupComponent', () => {
  let component: WinscopeProxySetupComponent;
  let dom: DOMTestHelper<WinscopeProxySetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        CommonModule,
        MatIconModule,
        MatButtonModule,
        WinscopeProxySetupComponent,
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(WinscopeProxySetupComponent);
    component = fixture.componentInstance;
    dom = new DOMTestHelper(fixture, fixture.nativeElement);
    dom.setComponentInput('state', ConnectionState.CONNECTING);
  });

  it('shows the launcher-managed connecting state', () => {
    dom.detectChanges();
    dom
      .get('.connecting-message')
      .checkText('Connecting to the launcher-managed capture session...');
    expect(dom.find('.retry')).toBeUndefined();
  });

  it('offers retry when the launcher-managed session is unavailable', () => {
    dom.setComponentInput('state', ConnectionState.NOT_FOUND);
    dom.detectChanges();
    dom
      .get('.further-adb-info-text')
      .checkText('The launcher-managed capture session is unavailable.');

    const spy = spyOn(component.retryConnection, 'emit');
    dom.findAndClick('.retry');
    expect(spy).toHaveBeenCalledWith();
  });

  it('shows matching-distribution guidance for an incompatible session', () => {
    dom.setComponentInput('state', ConnectionState.INVALID_VERSION);
    dom.detectChanges();
    dom
      .get('.further-adb-info-text')
      .checkText('Restart Winscope from a matching distribution.');
    dom.get('.adb-icon').checkTextExact('error');
    expect(dom.find('.retry')).toBeUndefined();
  });

  it('shows restart guidance when the browser request is rejected', () => {
    dom.setComponentInput('state', ConnectionState.UNAUTH);
    dom.detectChanges();
    dom
      .get('.adb-info')
      .checkTextExact(
        'The launcher-managed capture session rejected this browser request.',
      );
    dom.get('.adb-icon').checkTextExact('lock');
    expect(dom.find('.retry')).toBeUndefined();
  });
});
