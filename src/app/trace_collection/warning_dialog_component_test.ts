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
import {Component, Inject} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef,} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule, NoopAnimationsModule,} from '@angular/platform-browser/animations';
import {language} from '@common/i18n';
import {DOMTestHelper} from '@common/testing/dom_test_helpers';

import {WarningDialogComponent, WarningDialogData, WarningDialogResult,} from './warning_dialog_component';

describe('WarningDialogComponent', () => {
  let component: TestHostComponent;
  let dom: DOMTestHelper<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatIconModule,
        MatDialogModule,
        MatCheckboxModule,
        MatButtonModule,
        BrowserAnimationsModule,
        WarningDialogComponent,
        TestHostComponent,
      ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}},
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    dom = new DOMTestHelper(fixture, fixture.nativeElement);
    dom.detectChanges();
  });

  afterEach(() => language.set('en'));

  it('translates warning actions without changing dialog result identities', async () => {
    const data: WarningDialogData = {
      message: 'No trace targets selected.',
      actions: ['Go back'],
      options: ['Do not show again'],
      closeText: 'Collect traces anyway',
    };
    const ref = component.dialog.open(WarningDialogComponent, {data});
    language.set('zh-CN');
    ref.componentRef?.changeDetectorRef.detectChanges();
    dom.detectChanges();
    const dialog = dom.getInDocument('warning-dialog');
    dialog.get('.warning-message').checkText('未选择跟踪目标。');
    dialog.get('.warning-action-buttons').checkText('返回');
    dialog.get('.warning-action-buttons').checkText('仍然采集跟踪');
    ref.componentInstance.updateSelectedOptions('Do not show again');
    expect(
      ref.componentInstance.getDialogResult('Collect traces anyway'),
    ).toEqual({
      selectedOptions: ['Do not show again'],
      closeActionText: 'Collect traces anyway',
    });
    expect(data.closeText).toBe('Collect traces anyway');
    ref.close();
    await dom.whenStable();
  });

  it('does not translate filename options that happen to match a UI label', async () => {
    const ref = component.dialog.open(WarningDialogComponent, {data: {
      message: 'Multiple Perfetto traces found. Select one to process:',
      actions: [], options: ['Save'], closeText: 'Process selected trace', localizeOptions: false,
    }});
    language.set('zh-CN');
    dom.detectChanges();
    await dom.whenStable();
    const dialog = dom.findInDocument('warning-dialog');
    expect(dialog?.getHTMLElement().querySelector('mat-checkbox')?.textContent?.trim()).toBe('Save');
    ref.close();
    await dom.whenStable();
  });

  it('can be created', () => {
    expect(dom.findInDocument('warning-dialog')).toBeUndefined();
    openAndReturnDialog();
  });

  it('supports a translated confirmation title', async () => {
    const ref = component.dialog.open(WarningDialogComponent, {data: {
      title: 'Reset trace data?',
      message: 'Clear the loaded trace data and return to collection? Original files will not be deleted.',
      actions: ['Cancel'], options: ['Do not ask again'], closeText: 'Reset trace data',
    }});
    language.set('zh-CN');
    ref.componentRef?.changeDetectorRef.detectChanges();
    const dialog = dom.getInDocument('warning-dialog');
    dialog.get('.warning-dialog-title').checkText('确认重置数据？');
    dialog.get('.warning-action-boxes').checkText('不再提示');
    ref.close();
    await dom.whenStable();
  });

  it('renders warning message, action boxes and buttons', () => {
    const dialog = openAndReturnDialog();
    dialog.get('.warning-dialog-title').checkText('Warning');

    const content = dialog.get('.warning-content');
    content.get('.warning-message').checkText('test message');

    const actionBoxContainer = content.get('.warning-action-boxes');
    actionBoxContainer.checkText('option1');
    actionBoxContainer.checkText('option2');

    const actionButtonContainer = content.get('.warning-action-buttons');
    actionButtonContainer.checkText('action1');
    actionButtonContainer.checkText('action2');
    actionButtonContainer.checkText('close message');
  });

  it('provides action text and selected options as dialog result on close', async () => {
    const dialog = openAndReturnDialog();
    await dialog.clickAndWaitStable('.warning-action-buttons button');
    expect(component.dialogResult).toEqual({
      closeActionText: 'action1',
      selectedOptions: [],
    });
  });

  it('provides close text and selected options as dialog result on close', async () => {
    const dialog = openAndReturnDialog();
    await dialog.clickLastAndWaitStable('.warning-action-buttons button');
    expect(component.dialogResult).toEqual({
      closeActionText: 'close message',
      selectedOptions: [],
    });
  });

  it('deselects options', async () => {
    await checkSelection([], [0, 0]);
  });

  it('updates selected options with multiple selection', async () => {
    await checkSelection(['option1', 'option2']);
  });

  it('updates selected options with only single selection', async () => {
    component.singleSelection = true;
    await checkSelection(['option2']);
  });

  function openAndReturnDialog(): DOMTestHelper<TestHostComponent> {
    dom.findAndClick('button');
    return dom.getInDocument('warning-dialog');
  }

  async function checkSelection(
    expectedOptions: string[],
    optionsToSelect = [0, 1],
  ) {
    const dialog = openAndReturnDialog();
    const options = dialog.findAll('.warning-action-boxes mat-checkbox');
    for (const i of optionsToSelect) {
      options[i].dispatchEvent(new Event('change'));
      await dom.whenStable();
    }
    await dialog.clickLastAndWaitStable('.warning-action-buttons button');
    expect(component.dialogResult).toEqual({
      closeActionText: 'close message',
      selectedOptions: expectedOptions,
    });
  }

  @Component({
    selector: 'host-component',
    template: `
      <button (click)="onClick()"></button>
    `,
  })
  class TestHostComponent {
    dialogRef: MatDialogRef<WarningDialogComponent> | undefined;
    dialogResult: WarningDialogResult | undefined;
    singleSelection: boolean | undefined;

    constructor(@Inject(MatDialog) public dialog: MatDialog) {}

    onClick() {
      const data: WarningDialogData = {
        message: 'test message',
        actions: ['action1', 'action2'],
        options: ['option1', 'option2'],
        closeText: 'close message',
        singleSelection: this.singleSelection,
      };
      this.dialogRef = this.dialog.open(WarningDialogComponent, {data});
      this.dialogRef
        .afterClosed()
        .subscribe(async (result: WarningDialogResult) => {
          this.dialogResult = result;
        });
    }
  }
});
