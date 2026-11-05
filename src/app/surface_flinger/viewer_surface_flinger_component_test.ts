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
import {RectsComponent} from '@app/shared/rects/rects_component';
import {ResizerComponent} from '@app/shared/resizer/resizer_component';
import {AbstractHierarchyViewerComponentTest} from '@app/shared/testing/abstract_hierarchy_viewer_component_test';
import {assertDefined} from '@common/assert';
import {InMemoryStorage} from '@common/store/in_memory_storage';
import {DOMTestHelper} from '@common/testing/dom_test_helpers';
import {CollapsibleSectionType} from '@ui/shared/collapsible_sections/collapsible_section_type';
import {TraceRectType} from '@ui/shared/rects/rect_spec';
import {UiData} from '@ui/surface_flinger/ui_data';

import {SurfaceFlingerPropertyGroupsComponent} from './surface_flinger_property_groups_component';
import {ViewerSurfaceFlingerComponent} from './viewer_surface_flinger_component';

class ViewerSurfaceFlingerComponentTest extends AbstractHierarchyViewerComponentTest<
  UiData,
  ViewerSurfaceFlingerComponent
> {
  protected override readonly testRects = true;
  protected override readonly canPropagateProperties = true;
  protected override readonly supportsPlayback = true;
  protected override readonly hierarchyTitle = 'HIERARCHY';
  protected override readonly propertiesTitle = 'PROTO DUMP';
  protected override readonly rectsTitle = 'LAYERS';

  protected override executeSpecializedTests() {
    describe('Specialized tests', () => {
      let dom: DOMTestHelper<ViewerSurfaceFlingerComponent>;
      let component: ViewerSurfaceFlingerComponent;

      beforeEach(async () => {
        [dom, component] = await this.setUpTestEnvironment();
      });

      it('creates property groups view', () => {
        expect(dom.find('.property-groups')).toBeDefined();
      });

      it('creates horizontal resizers for the main panes', () => {
        const resizers = dom.findAllByDirective(ResizerComponent);

        expect(resizers.length).toBe(3);
        expect(resizers[0].dragAxis()).toBe('horizontal');
        expect(resizers[0].dependentView()).toBe(
          dom.get('.rects-view').getHTMLElement(),
        );
        expect(resizers[0].storeKey()).toBe('sfLayersWidth');
        expect(resizers[0].lineOnly()).toBeTrue();
        expect(resizers[1].dragAxis()).toBe('horizontal');
        expect(resizers[1].dependentView()).toBe(
          dom.get('.hierarchy-view').getHTMLElement(),
        );
        expect(resizers[1].storeKey()).toBe('sfHierarchyWidth');
        expect(resizers[1].lineOnly()).toBeTrue();
        expect(resizers[2].dragAxis()).toBe('vertical');
      });

      it('joins all main panes with just one-pixel dividers and no card spacing', () => {
        const grid = dom.get('.resizable-grid').getHTMLElement();
        grid.style.width = '1200px';
        grid.style.height = '600px';
        const layers = dom.get('.rects-view').getHTMLElement();
        const hierarchy = dom.get('.hierarchy-view').getHTMLElement();
        const properties = dom.get('.properties').getHTMLElement();
        expect(hierarchy.getBoundingClientRect().left - layers.getBoundingClientRect().right)
          .toBeCloseTo(1, 1);
        expect(properties.getBoundingClientRect().left - hierarchy.getBoundingClientRect().right)
          .toBeCloseTo(1, 1);
        for (const pane of [layers, hierarchy,
          dom.get('.property-groups').getHTMLElement(),
          dom.get('.properties-view').getHTMLElement()]) {
          const style = getComputedStyle(pane);
          expect(style.margin).toBe('0px');
          expect(style.boxShadow).toBe('none');
          expect(style.borderRadius).toBe('0px');
        }
        for (const divider of dom.findAll('.main-resizer')) {
          expect(divider.getHTMLElement().getBoundingClientRect().width).toBe(1);
          expect(divider.find('mat-icon')).toBeUndefined();
        }
      });

      it('drags both main dividers and remembers their exact rendered widths', () => {
        const grid = dom.get('.resizable-grid').getHTMLElement();
        grid.style.width = '1200px';
        grid.style.height = '600px';
        const store = new InMemoryStorage();
        dom.setComponentInput('store', store);
        dom.detectChanges();
        for (const [index, selector, key] of [
          [0, '.rects-view', 'sfLayersWidth'],
          [1, '.hierarchy-view', 'sfHierarchyWidth'],
        ] as const) {
          const pane = dom.get(selector).getHTMLElement();
          const width = pane.offsetWidth;
          dom.findAll('.main-resizer')[index].dragElement(40, 0);
          expect(pane.offsetWidth).toBe(width + 40);
          expect(store.get(key)).toBe(String(pane.offsetWidth));
        }
      });

      it('keeps properties visible when remembered widths exceed a compact viewport', () => {
        const grid = dom.get('.resizable-grid').getHTMLElement();
        grid.style.width = '800px';
        grid.style.height = '600px';
        const store = new InMemoryStorage();
        store.add('sfLayersWidth', '540');
        store.add('sfHierarchyWidth', '490');
        dom.setComponentInput('store', store);
        dom.detectChanges();
        expect(dom.get('.rects-view').getHTMLElement().offsetWidth)
          .toBeGreaterThanOrEqual(180);
        expect(dom.get('.hierarchy-view').getHTMLElement().offsetWidth)
          .toBeGreaterThanOrEqual(220);
        expect(dom.get('.properties').getHTMLElement().offsetWidth)
          .toBeGreaterThanOrEqual(220);
        expect(grid.scrollWidth).toBeLessThanOrEqual(grid.clientWidth);
        dom.findAll('.main-resizer')[0].dragElement(-500, 0);
        expect(dom.get('.rects-view').getHTMLElement().offsetWidth).toBe(180);
        expect(store.get('sfLayersWidth')).toBe('180');
      });

      it('restores pane widths after collapsing and reopening layers', () => {
        const grid = dom.get('.resizable-grid').getHTMLElement();
        grid.style.width = '1200px';
        grid.style.height = '600px';
        const store = new InMemoryStorage();
        store.add('sfLayersWidth', '300');
        store.add('sfHierarchyWidth', '400');
        dom.setComponentInput('store', store);
        dom.detectChanges();
        const layers = dom.get('.rects-view').getHTMLElement();
        expect(layers.offsetWidth).toBe(300);
        expect(dom.get('.hierarchy-view').getHTMLElement().offsetWidth).toBe(400);
        component.sections.onCollapseStateChange(CollapsibleSectionType.RECTS, true);
        dom.detectChanges();
        expect(dom.findAll('.main-resizer').length).toBe(1);
        component.sections.onCollapseStateChange(CollapsibleSectionType.RECTS, false);
        dom.detectChanges();
        expect(layers.offsetWidth).toBe(300);
        expect(dom.findAll('.main-resizer').length).toBe(2);
      });

      it('does not leave main resizers when adjacent panes are collapsed', () => {
        expect(dom.findAll('.main-resizer').length).toBe(2);

        dom.get('.rects-view').findAndClick('collapsible-section-title button');
        expect(dom.findAll('.main-resizer').length).toBe(1);

        dom
          .get('.hierarchy-view')
          .findAndClick('collapsible-section-title button');
        expect(dom.findAll('.main-resizer').length).toBe(0);
      });

      it('handles property groups section collapse/expand', () => {
        dom.checkSectionCollapseAndExpand('.property-groups', 'PROPERTIES');
      });

      it('fits the layers view to the default panel size', () => {
        const rects = assertDefined(dom.findByDirective(RectsComponent));

        expect(rects.zoomFactor()).toBe(2.3);
        expect(
          rects.largeRectsMapper3d.computeScene(false).camera.zoomFactor,
        ).toBeCloseTo(1.26);
      });

      it('binds rects view events to output signals', () => {
        const rects = assertDefined(dom.findByDirective(RectsComponent));

        const rectsDblClickSpy = spyOn(component.onRectsDblClick, 'emit');
        const id = 'test';
        rects.rectsDblClick.emit(id);
        expect(rectsDblClickSpy).toHaveBeenCalledOnceWith(id);

        const rectTypeClickSpy = spyOn(component.onRectTypeButtonClick, 'emit');
        const type = TraceRectType.LAYERS;
        rects.rectTypeButtonClick.emit(type);
        expect(rectTypeClickSpy).toHaveBeenCalledOnceWith(type);
      });

      it('binds highlighted id event to output signal from property groups', () => {
        const propertyGroups = assertDefined(
          dom.findByDirective(SurfaceFlingerPropertyGroupsComponent),
        );
        const spy = spyOn(component.onHighlightedIdChange, 'emit');
        const id = 'test';
        propertyGroups.highlightedIdChange.emit(id);
        expect(spy).toHaveBeenCalledOnceWith(id);
      });

      it('handles rect type change in input', () => {
        let uiData = new UiData(undefined);
        uiData.rectSpec = {
          type: TraceRectType.LAYERS,
          icon: '',
          legend: [],
        };
        dom.setComponentInput('inputData', uiData);
        dom.detectChanges();

        dom.checkSectionCollapseAndExpand(
          '.rects-view',
          TraceRectType.LAYERS.toUpperCase(),
        );

        uiData = new UiData(undefined);
        uiData.rectSpec = {
          type: TraceRectType.INPUT_WINDOWS,
          icon: '',
          legend: [],
        };
        dom.setComponentInput('inputData', uiData);
        dom.detectChanges();
        dom.checkSectionCollapseAndExpand(
          '.rects-view',
          TraceRectType.INPUT_WINDOWS.toUpperCase(),
        );
      });
    });
  }

  protected override async setUpTestEnvironment(): Promise<
    [
      DOMTestHelper<ViewerSurfaceFlingerComponent>,
      ViewerSurfaceFlingerComponent,
    ]
  > {
    return this.initializeTestEnvironment(ViewerSurfaceFlingerComponent, [
      ViewerSurfaceFlingerComponent,
      SurfaceFlingerPropertyGroupsComponent,
    ]);
  }

  protected override getUiDataForPlaybackTests(): UiData {
    return new UiData(undefined);
  }
}

describe('ViewerSurfaceFlingerComponent', () => {
  new ViewerSurfaceFlingerComponentTest().execute();
});
