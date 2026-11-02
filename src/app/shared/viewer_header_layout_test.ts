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

import {Component, ViewEncapsulation} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconTestingModule} from '@angular/material/icon/testing';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {SurfaceFlingerPropertyGroupsComponent} from '@app/surface_flinger/surface_flinger_property_groups_component';
import {setLanguage, translate} from '@common/i18n';
import {makeWarningMissingLayerIds} from '@parsers/helpers/warnings';
import {TraceType} from '@trace_api/trace_type';
import {HierarchyTreeBuilder} from '@tree_node/testing/hierarchy_tree_builder';
import {UiHierarchyTreeNode} from '@ui/shared/hierarchy/ui_hierarchy_tree_node';
import {ShadingMode} from '@ui/shared/rects/shading_mode';
import {FlattenedTreeRow} from '@ui/shared/tree/flattened_tree_row';
import {flattenNodesToRows} from '@ui/shared/tree/ui_tree_node_helpers';
import {VISIBLE_CHIP} from '@ui/shared/user_input/chip';
import {TextFilter} from '@ui/shared/user_input/text_filter';
import {UserOptions} from '@ui/shared/user_input/user_options';

import {HierarchyComponent} from './hierarchy/hierarchy_component';
import {PropertiesComponent} from './properties/properties_component';
import {RectsComponent} from './rects/rects_component';

@Component({
  standalone: true,
  imports: [
    HierarchyComponent,
    PropertiesComponent,
    RectsComponent,
    SurfaceFlingerPropertyGroupsComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./styles/viewer_card_style.scss'],
  template: `
    <div class="header-layout-panes" style="display: flex; height: 600px">
      <rects-view
        class="rects-view"
        title="LAYERS"
        [rects]="[]"
        [displays]="[]"
        [shadingModes]="shadingModes"
        [userOptions]="options"
        [dependencies]="dependencies"
      ></rects-view>
      <hierarchy-view
        class="hierarchy-view"
        [nodeRows]="hierarchyRows"
        [userOptions]="options"
        [dependencies]="dependencies"
        [textFilter]="filter"
      ></hierarchy-view>
      <surface-flinger-property-groups
        class="property-groups"
      ></surface-flinger-property-groups>
      <properties-view
        class="properties-view with-options"
        title="PROTO DUMP"
        [nodeRows]="[]"
        [userOptions]="options"
        [textFilter]="filter"
      ></properties-view>
      <properties-view
        class="properties-view without-options"
        title="PROTO DUMP"
        [nodeRows]="[]"
        [textFilter]="filter"
      ></properties-view>
    </div>
  `,
})
class ViewerHeaderLayoutFixtureComponent {
  hierarchyRows: Array<FlattenedTreeRow<UiHierarchyTreeNode>> = [];
  dependencies = [TraceType.SURFACE_FLINGER];
  shadingModes = [ShadingMode.WIRE_FRAME, ShadingMode.GRADIENT];
  filter = new TextFilter();
  options: UserOptions = {
    showOnlyVisible: {name: 'Show only', enabled: false, chip: VISIBLE_CHIP},
    showDiff: {name: 'Show diff', enabled: false},
  };
}

describe('Rendered viewer header layout', () => {
  let fixture: ComponentFixture<ViewerHeaderLayoutFixtureComponent>;
  let frame: HTMLIFrameElement;
  let frameDocument: Document;

  beforeEach(async () => {
    setLanguage('en');
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatIconTestingModule,
        ViewerHeaderLayoutFixtureComponent,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ViewerHeaderLayoutFixtureComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    // Real viewports and production Material/component styles, isolated from
    // the runner's zoom and viewport. No mocked control dimensions.
    frame = document.createElement('iframe');
    frame.style.cssText =
      'position: fixed; top: 0; left: 0; border: 0; visibility: hidden; height: 900px';
    document.body.appendChild(frame);
    frameDocument = frame.contentDocument!;
    document.head
      .querySelectorAll('style, link[rel="stylesheet"]')
      .forEach((style) => {
        frameDocument.head.appendChild(style.cloneNode(true));
      });
    frameDocument.body.appendChild(fixture.nativeElement);
  });

  afterEach(() => {
    fixture?.destroy();
    frame?.remove();
    setLanguage('en');
  });

  const rect = (element: Element) => element.getBoundingClientRect();
  const center = (element: Element) => {
    const bounds = rect(element);
    return bounds.top + bounds.height / 2;
  };

  for (const language of ['en', 'zh-CN'] as const) {
    for (const zoom of [0.8, 1, 1.4]) {
      for (const paneWidth of [220, 360, 640]) {
        it(`centers equal title rows at ${paneWidth}px, ${language}, ${zoom * 100}%`, () => {
          setLanguage(language);
          fixture.detectChanges();
          frame.style.width = `${(paneWidth + 8) * 5 * zoom}px`;
          frameDocument.documentElement.style.setProperty('zoom', `${zoom}`);
          const panes = frameDocument.querySelectorAll<HTMLElement>(
            '.header-layout-panes > *',
          );
          panes.forEach((pane) => {
            pane.style.flex = `0 0 ${paneWidth}px`;
            pane.style.minWidth = '0';
          });

          const headers = frameDocument.querySelectorAll('.title-section');
          expect(headers.length).toBe(5);
          ['LAYERS', 'HIERARCHY', 'PROPERTIES'].forEach((title, index) => {
            expect(
              headers[index].querySelector('.section-title')!.textContent,
            ).toBe(translate(title).toUpperCase());
          });
          const displays = frameDocument.querySelector('.displays-section')!;
          const displayLabel = displays.querySelector('span')!;
          expect(frame.contentWindow!.getComputedStyle(displayLabel).whiteSpace)
            .withContext('display labels stay on one line in narrow translated panes')
            .toBe('nowrap');
          expect(Math.abs(center(displayLabel) - center(displays)))
            .withContext('display labels remain vertically centered')
            .toBeLessThan(1);
          headers.forEach((header) => {
            expect(Math.abs(rect(header).height - 40 * zoom))
              .withContext('title rows have one shared height')
              .toBeLessThan(1);
            expect(Math.abs(rect(header).top - rect(headers[0]).top))
              .withContext('pane title rows start together')
              .toBeLessThan(1);
            const title = header.querySelector('.section-title')!;
            expect(Math.abs(center(title) - center(header)))
              .withContext('title text is vertically centered')
              .toBeLessThan(1);
            expect(title.scrollWidth).toBeLessThanOrEqual(
              title.clientWidth + 1,
            );
            const collapse = header.querySelector(
              'collapsible-section-title button',
            )!;
            expect(Math.abs(center(collapse) - center(header)))
              .withContext('collapse button is vertically centered')
              .toBeLessThan(1);
            expect(rect(collapse).left).toBeGreaterThanOrEqual(
              rect(header).left,
            );
            const controls = header.querySelector<HTMLElement>(
              '.right-btn-container, search-box',
            );
            if (!controls) {
              return;
            }
            expect(rect(controls).left).toBeGreaterThanOrEqual(
              rect(title).right - 1,
            );
            expect(rect(controls).right).toBeLessThanOrEqual(
              rect(header).right + 1,
            );
            controls
              .querySelectorAll(
                'button, mat-icon, input, mat-slider, .mdc-slider__track, .mdc-slider__thumb-knob, .mat-mdc-text-field-wrapper',
              )
              .forEach((control) => {
                expect(Math.abs(center(control) - center(header)))
                  .withContext(`${control.tagName} is vertically centered`)
                  .toBeLessThan(1);
              });
            if (controls.scrollWidth > controls.clientWidth) {
              controls.scrollLeft = controls.scrollWidth;
              expect(controls.scrollLeft).toBeGreaterThan(0);
              const last = controls.querySelectorAll('button');
              expect(rect(last[last.length - 1]).right)
                .withContext(
                  'last control is reachable by horizontal scrolling',
                )
                .toBeLessThanOrEqual(rect(controls).right + 1);
            }
          });
          panes.forEach((pane) => {
            expect(Math.abs(rect(pane).bottom - rect(panes[0]).bottom))
              .withContext('pane bodies retain their shared stretch height')
              .toBeLessThan(1);
          });
          frameDocument.querySelectorAll('.view-controls').forEach((row) => {
            row
              .querySelectorAll('.user-option, .displays-section')
              .forEach((control) => {
                expect(Math.abs(center(row) - center(control)))
                  .withContext(
                    'option controls are centered rather than baseline-aligned',
                  )
                  .toBeLessThan(1);
              });
          });
          frameDocument
            .querySelectorAll('.user-option-chip')
            .forEach((chip) => {
              expect(Math.abs(center(chip) - center(chip.parentElement!)))
                .withContext('option chips are centered with their labels')
                .toBeLessThan(1);
            });
        });
      }
    }
  }

  it('allows warnings and tree content to grow outside the fixed title row', () => {
    const hierarchy = frameDocument.querySelector('hierarchy-view')!;
    const viewHeader = hierarchy.querySelector('.view-header')!;
    const originalHeight = rect(viewHeader).height;
    const node = UiHierarchyTreeNode.from(
      new HierarchyTreeBuilder().setId('layer').setName('Surface').build(),
    );
    spyOn(node, 'getWarnings').and.returnValue([
      makeWarningMissingLayerIds(),
      makeWarningMissingLayerIds(),
    ]);
    fixture.componentInstance.hierarchyRows = flattenNodesToRows(
      [node],
      false,
      false,
      '',
    );
    fixture.detectChanges();
    expect(hierarchy.querySelectorAll('.warning').length).toBe(2);
    expect(rect(viewHeader).height).toBeGreaterThan(originalHeight + 40);
    expect(rect(hierarchy.querySelector('.title-section')!).height).toBe(40);
    expect(hierarchy.querySelector('tree-view')).not.toBeNull();
  });

  it('preserves collapse, search, option and slider events', () => {
    const curated = fixture.debugElement.query(
      By.directive(SurfaceFlingerPropertyGroupsComponent),
    );
    const curatedCollapse = jasmine.createSpy('curated collapse');
    curated.componentInstance.collapseButtonClicked.subscribe(curatedCollapse);
    curated.nativeElement
      .querySelector('collapsible-section-title button')
      .click();
    expect(curatedCollapse).toHaveBeenCalled();
    const hierarchy = fixture.debugElement.query(
      By.directive(HierarchyComponent),
    );
    const component = hierarchy.componentInstance as HierarchyComponent;
    const collapse = jasmine.createSpy('collapse');
    const filter = jasmine.createSpy('filter');
    const options = jasmine.createSpy('options');
    component.collapseButtonClicked.subscribe(collapse);
    component.filterChange.subscribe(filter);
    component.optionsChange.subscribe(options);
    hierarchy.nativeElement
      .querySelector('collapsible-section-title button')
      .click();
    expect(collapse).toHaveBeenCalled();
    const input: HTMLInputElement =
      hierarchy.nativeElement.querySelector('search-box input');
    input.value = 'Surface';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(filter).toHaveBeenCalledWith(fixture.componentInstance.filter);
    expect(fixture.componentInstance.filter.filterString).toBe('Surface');
    hierarchy.nativeElement.querySelector('.user-option').click();
    expect(options).toHaveBeenCalledWith(fixture.componentInstance.options);
    expect(
      fixture.componentInstance.options['showOnlyVisible'].enabled,
    ).toBeTrue();
    const layers = fixture.debugElement.query(By.directive(RectsComponent));
    const rotation = spyOn(layers.componentInstance, 'onRotationSliderChange');
    const slider: HTMLInputElement = layers.nativeElement.querySelector(
      '.slider-rotation input',
    );
    slider.value = '0.5';
    slider.dispatchEvent(new Event('input'));
    expect(rotation).toHaveBeenCalledWith('0.5');
  });
});
