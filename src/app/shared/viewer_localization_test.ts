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

import {TestBed} from '@angular/core/testing';
import {MatTooltip} from '@angular/material/tooltip';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {HierarchyComponent} from '@app/shared/hierarchy/hierarchy_component';
import {HierarchyTreeNodeDataViewComponent} from '@app/shared/hierarchy/hierarchy_tree_node_data_view_component';
import {LogComponent} from '@app/shared/log_view/log_component';
import {SelectWithFilterComponent} from '@app/shared/log_view/select_with_filter_component';
import {PropertyTreeNodeDataViewComponent} from '@app/shared/properties/property_tree_node_data_view_component';
import {UserOptionsComponent} from '@app/shared/user_options/user_options_component';
import {setLanguage} from '@common/i18n';
import {TraceType} from '@trace_api/trace_type';
import {DEFAULT_PROPERTY_FORMATTER} from '@trace/formatters';
import {HierarchyTreeBuilder} from '@tree_node/testing/hierarchy_tree_builder';
import {UiHierarchyTreeNode} from '@ui/shared/hierarchy/ui_hierarchy_tree_node';
import {LogSelectFilter, LogTextFilter} from '@ui/shared/log/log_filters';
import {LogHeader} from '@ui/shared/log/ui_data_log';
import {makeUiPropertyNode} from '@ui/shared/properties/testing/ui_property_tree_node_test_helpers';
import {VISIBLE_CHIP} from '@ui/shared/user_input/chip';
import {TextFilter} from '@ui/shared/user_input/text_filter';
import {UserOptions} from '@ui/shared/user_input/user_options';

describe('Viewer UI localization boundaries', () => {
  beforeEach(async () => {
    setLanguage('en');
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HierarchyComponent,
        HierarchyTreeNodeDataViewComponent,
        LogComponent,
        PropertyTreeNodeDataViewComponent,
        SelectWithFilterComponent,
        UserOptionsComponent,
      ],
    }).compileComponents();
  });

  afterEach(() => setLanguage('en'));

  it('updates computed hierarchy placeholders in place on both language changes', () => {
    const fixture = TestBed.createComponent(HierarchyComponent);
    fixture.componentRef.setInput('nodeRows', []);
    fixture.componentRef.setInput('dependencies', [TraceType.WINDOW_MANAGER]);
    fixture.detectChanges();
    const placeholder = fixture.nativeElement.querySelector('.placeholder-text');
    expect(placeholder.textContent).toContain('Window Manager state');
    setLanguage('zh-CN');
    fixture.detectChanges();
    expect(placeholder.textContent).toContain('窗口管理器 状态');
    expect(fixture.nativeElement.querySelector('.section-title').textContent).toBe('层级结构');
    setLanguage('en');
    fixture.detectChanges();
    expect(placeholder.textContent).toContain('Window Manager state');
    expect(fixture.nativeElement.querySelector('.placeholder-text')).toBe(placeholder);
  });

  it('translates chip help but preserves matching trace layer names and technical chip identifiers', () => {
    const node = UiHierarchyTreeNode.from(
      new HierarchyTreeBuilder().setId('123').setName('Visibility').build(),
    );
    node.addChip(VISIBLE_CHIP);
    const fixture = TestBed.createComponent(HierarchyTreeNodeDataViewComponent);
    fixture.componentRef.setInput('node', node);
    fixture.detectChanges();
    setLanguage('zh-CN');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.display-name').textContent).toBe('Visibility');
    const chip = fixture.debugElement.query(By.css('.tree-view-chip'));
    expect(chip.nativeElement.textContent).toBe('V');
    expect(chip.injector.get(MatTooltip).message).toBe('可见');
    expect(node.name).toBe('Visibility');
    expect(VISIBLE_CHIP.long).toBe('visible');
  });

  it('keeps raw property keys and values verbatim even when both match catalog entries', () => {
    const node = makeUiPropertyNode('layer', 'Visibility', 'Save');
    node.setFormatter(DEFAULT_PROPERTY_FORMATTER);
    const fixture = TestBed.createComponent(PropertyTreeNodeDataViewComponent);
    fixture.componentRef.setInput('node', node);
    fixture.detectChanges();
    setLanguage('zh-CN');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.property-key').textContent.trim()).toBe('Visibility:');
    expect(fixture.nativeElement.querySelector('.value').textContent).toBe('Save');
    expect(node.getValue()).toBe('Save');
  });

  it('updates OnPush filter labels while preserving trace options, selection and filter text', async () => {
    const fixture = TestBed.createComponent(SelectWithFilterComponent);
    fixture.componentRef.setInput('label', 'Source');
    fixture.componentRef.setInput('options', ['Visibility', 'Save']);
    fixture.componentRef.setInput('value', ['Save']);
    fixture.componentInstance.filterString.set('Save');
    fixture.detectChanges();
    setLanguage('zh-CN');
    fixture.detectChanges();
    fixture.componentInstance.select().open();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-label').textContent).toBe('来源');
    expect(document.querySelector('.selected-option .mat-option-text')?.textContent).toBe('Save');
    expect(fixture.componentInstance.value()).toEqual(['Save']);
    expect(fixture.componentInstance.filterString()).toBe('Save');
    expect(fixture.componentInstance.options()).toEqual(['Visibility', 'Save']);
    fixture.componentInstance.select().close();
  });

  it('translates option labels without changing option identities, emitted state or analytics names', () => {
    const options: UserOptions = {
      showDiff: {name: 'Show diff', enabled: false},
    };
    const fixture = TestBed.createComponent(UserOptionsComponent);
    const log = jasmine.createSpy('log');
    fixture.componentRef.setInput('userOptions', options);
    fixture.componentRef.setInput('traceType', TraceType.SURFACE_FLINGER);
    fixture.componentRef.setInput('logCallback', log);
    const emitted = jasmine.createSpy('optionsChange');
    fixture.componentInstance.optionsChange.subscribe(emitted);
    fixture.detectChanges();
    setLanguage('zh-CN');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent.trim()).toBe('显示差异');
    button.click();
    expect(options['showDiff'].name).toBe('Show diff');
    expect(options['showDiff'].enabled).toBeTrue();
    expect(emitted).toHaveBeenCalledWith(options);
    expect(log).toHaveBeenCalledWith('Show diff', true, 'Surface Flinger');
  });

  it('preserves SQL column aliases across unfiltered, text-filtered and select-filtered headers', () => {
    const fixture = TestBed.createComponent(LogComponent);
    const headers = [
      new LogHeader({name: 'Type', cssClass: 'type'}),
      new LogHeader(
        {name: 'Save', cssClass: 'save'},
        new LogTextFilter(new TextFilter()),
      ),
      new LogHeader(
        {name: 'Source', cssClass: 'source'},
        new LogSelectFilter(['Visibility', 'Save']),
      ),
    ];
    fixture.componentRef.setInput('headers', headers);
    fixture.componentRef.setInput('entries', []);
    fixture.componentRef.setInput('localizeLabels', false);
    fixture.detectChanges();
    setLanguage('zh-CN');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.header').textContent.trim()).toBe('Type');
    const labels = [...fixture.nativeElement.querySelectorAll('mat-label')]
      .map((label: HTMLElement) => label.textContent);
    expect(labels).toEqual(['Save', 'Source']);
    expect(headers.map((header) => header.spec.name)).toEqual(['Type', 'Save', 'Source']);
    fixture.componentRef.setInput('localizeLabels', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.header').textContent.trim()).toBe('类型');
    expect([...fixture.nativeElement.querySelectorAll('mat-label')]
      .map((label: HTMLElement) => label.textContent)).toEqual(['保存', '来源']);
  });
});
