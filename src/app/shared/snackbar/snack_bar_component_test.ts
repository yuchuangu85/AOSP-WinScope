/*
 * Copyright (C) 2025 The Android Open Source Project
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

import {Clipboard, ClipboardModule} from '@angular/cdk/clipboard';
import {TestBed} from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {setLanguage} from '@common/i18n';
import {DOMTestHelper} from '@common/testing/dom_test_helpers';

import {SnackBarComponent} from './snack_bar_component';

describe('SnackBarComponent', () => {
  const messages = ['test message 1', 'test message 2'];
  let component: SnackBarComponent;
  let dom: DOMTestHelper<SnackBarComponent>;
  let mockCopyText: jasmine.Spy;
  let mockSnackbarRef: jasmine.SpyObj<MatSnackBarRef<SnackBarComponent>>;

  beforeEach(async () => {
    setLanguage('en');
    mockCopyText = jasmine.createSpy();
    mockSnackbarRef = jasmine.createSpyObj('snackBarRef', ['dismiss']);
    await TestBed.configureTestingModule({
      providers: [
        {provide: MatSnackBarRef, useValue: mockSnackbarRef},
        {provide: MAT_SNACK_BAR_DATA, useValue: messages},
        {provide: Clipboard, useValue: {copy: mockCopyText}},
      ],
      imports: [
        NoopAnimationsModule,
        ClipboardModule,
        MatButtonModule,
        SnackBarComponent,
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(SnackBarComponent);
    component = fixture.componentInstance;
    dom = new DOMTestHelper(fixture, fixture.nativeElement);
    dom.detectChanges();
  });

  afterEach(() => setLanguage('en'));

  it('shows all messages', () => {
    const messageElements = dom.findAll('.message');
    expect(messageElements.length).toBe(2);
    messageElements[0].checkTextExact(messages[0]);
    messageElements[1].checkTextExact(messages[1]);
  });

  it('dismisses snackbar on close button click', () => {
    dom.findAndClick('.snack-bar-actions .close-button');
    expect(mockSnackbarRef.dismiss).toHaveBeenCalledTimes(1);
  });

  it('copies messages on copy button click', () => {
    dom.findAndClick('.snack-bar-actions .copy-button');
    expect(mockCopyText).toHaveBeenCalledOnceWith(messages.join('\n\n'));
  });

  it('switches existing localized messages and copies the displayed text without translating diagnostic parameters', () => {
    const metadata = {
      source: '{filename}: corrupted archive',
      params: {filename: 'Save <script>.zip'},
    };
    component.messages = [metadata, 'external error: Save'];
    setLanguage('zh-CN');
    dom.detectChanges();
    const messageElements = dom.findAll('.message');
    messageElements[0].checkTextExact('Save <script>.zip：压缩包已损坏');
    messageElements[1].checkTextExact('external error: Save');
    dom.findAndClick('.snack-bar-actions .copy-button');
    expect(mockCopyText).toHaveBeenCalledWith(
      'Save <script>.zip：压缩包已损坏\n\nexternal error: Save',
    );
    expect(dom.getHTMLElement().querySelector('script')).toBeNull();
    expect(metadata.params.filename).toBe('Save <script>.zip');
    setLanguage('en');
    dom.detectChanges();
    messageElements[0].checkTextExact('Save <script>.zip: corrupted archive');
  });

  it('localizes cropped counts while preserving the diagnostic descriptor and English format', () => {
    component.messages = [{
      source: "... (cropped {count} '{descriptor}' messages)",
      params: {count: 2, descriptor: 'Save'},
    }];
    expect(component.formatMessages()).toBe("... (cropped 2 'Save' messages)");
    setLanguage('zh-CN');
    dom.detectChanges();
    dom.get('.message').checkTextExact("…（已省略 2 条 'Save' 消息）");
    expect(component.formatMessages()).toBe("…（已省略 2 条 'Save' 消息）");
  });
});
