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

import {Component, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatToolbarModule} from '@angular/material/toolbar';

// Exercise the production sizing chain and card styles without collection I/O.
@Component({
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatToolbarModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../styles/styles.scss',
    './app_component.scss',
    './shared/bottomnav/bottom_drawer_component.scss',
    './trace_collection/collect_traces_component.scss',
    './trace_loading/upload_traces_component.scss',
  ],
  template: `
    <app-root>
      <mat-toolbar class="toolbar">Winscope</mat-toolbar>
      <mat-divider></mat-divider>
      <mat-drawer-container class="mat-drawer-container">
        <mat-drawer-content class="mat-drawer-content">
          <div class="center">
            <div class="landing-content">
              <div class="card-grid landing-grid">
                <collect-traces class="collect-traces-card homepage-card">
                  <mat-card class="collect-card">
                    <mat-card-header>
                      <mat-card-title>Collect Traces</mat-card-title>
                    </mat-card-header>
                    <mat-card-content>Connect a device</mat-card-content>
                  </mat-card>
                </collect-traces>
                <upload-traces class="upload-traces-card homepage-card">
                  <mat-card class="upload-card">
                    <mat-card-header>
                      <mat-card-title>Upload Traces</mat-card-title>
                    </mat-card-header>
                    <mat-card-content>Drop trace files</mat-card-content>
                  </mat-card>
                </upload-traces>
              </div>
              <footer class="landing-status-bar">
                <h1 class="welcome-info mat-body-1">
                  Welcome to Winscope. Please select source to view traces.
                </h1>
              </footer>
            </div>
          </div>
        </mat-drawer-content>
      </mat-drawer-container>
    </app-root>
  `,
})
class LandingLayoutFixtureComponent {}

describe('Landing layout at document zoom', () => {
  let fixture: ComponentFixture<LandingLayoutFixtureComponent>;
  let frame: HTMLIFrameElement;
  let frameDocument: Document;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingLayoutFixtureComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LandingLayoutFixtureComponent);
    fixture.detectChanges();

    // A same-origin iframe provides real, independently sized viewports without
    // changing the test runner's document zoom or depending on its window size.
    frame = document.createElement('iframe');
    frame.style.cssText =
      'position: fixed; top: 0; left: 0; border: 0; visibility: hidden';
    document.body.appendChild(frame);
    frameDocument = frame.contentDocument!;
    document.head
      .querySelectorAll('style, link[rel="stylesheet"]')
      .forEach((style) => {
        frameDocument.head.appendChild(style.cloneNode(true));
      });
    fixture.nativeElement.style.height = '100%';
    frameDocument.body.appendChild(fixture.nativeElement);
  });

  afterEach(() => {
    fixture?.destroy();
    frame?.remove();
  });

  for (const [width, height] of [
    [1440, 960],
    [1280, 800],
    [1920, 1080],
    [2560, 1440],
    [390, 844],
  ]) {
    for (const zoom of [0.8, 1, 1.4]) {
      for (const desktop of [false, true]) {
        it(`fills ${width}x${height} at ${zoom * 100}% (${desktop ? 'desktop' : 'browser'})`, () => {
          frame.style.width = `${width}px`;
          frame.style.height = `${height}px`;
          frameDocument.documentElement.style.setProperty('zoom', `${zoom}`);
          if (desktop) {
            frameDocument.documentElement.setAttribute(
              'data-winscope-desktop',
              'darwin',
            );
          }

          const rect = (selector: string) =>
            frameDocument.querySelector(selector)!.getBoundingClientRect();
          const grid = rect('.landing-grid');
          const footer = rect('.landing-status-bar');

          expect(Math.abs(footer.bottom - height)).toBeLessThan(1);
          expect(Math.abs(grid.bottom - footer.top)).toBeLessThan(1);
          for (const selector of ['.collect-card', '.upload-card']) {
            const card = rect(selector);
            expect(card.height).toBeGreaterThan(0);
            expect(Math.abs(card.top - grid.top - 10 * zoom))
              .withContext(`${selector} retains its top margin`)
              .toBeLessThan(1);
            expect(Math.abs(footer.top - card.bottom - 10 * zoom))
              .withContext(
                `${selector} fills the grid and retains its bottom margin`,
              )
              .toBeLessThan(1);
          }
        });
      }
    }
  }
});
