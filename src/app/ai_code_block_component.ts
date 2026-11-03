import {CommonModule} from '@angular/common';
import {ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslatePipe} from '@common/i18n';
import {AiCodeHighlighter, AiCodeLine} from '@services/ai_code_highlighter';

@Component({
  selector: 'ai-code-block',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, TranslatePipe],
  template: `
    <div class="md-code-block" [attr.data-code-wrap]="wrapped">
      <div class="code-banner" data-code-block-banner>
        <span class="code-language">{{language || ''}}</span>
        <div class="code-actions">
          <button mat-icon-button type="button" class="code-copy"
            [attr.aria-label]="copyLabel | tr" [matTooltip]="copyLabel | tr"
            [disabled]="copying" (click)="copy()">
            <mat-icon>{{copied ? 'check' : 'content_copy'}}</mat-icon>
          </button>
          <button mat-icon-button type="button" class="code-wrap"
            [attr.aria-label]="(wrapped ? 'Disable code wrapping' : 'Enable code wrapping') | tr"
            [matTooltip]="(wrapped ? 'Disable code wrapping' : 'Enable code wrapping') | tr"
            [attr.aria-pressed]="wrapped" (click)="toggleWrap()">
            <mat-icon>wrap_text</mat-icon>
          </button>
        </div>
      </div>
      <div class="code-status" role="status" aria-live="polite">{{status | tr}}</div>
      <div class="code-content" data-code-block-content>
        <pre class="shiki css-variables" tabindex="0"><code>@if (plain) {<ng-container>{{code}}</ng-container>} @else {<ng-container *ngFor="let line of lines; let index = index">{{index ? '\\n' : ''}}<span class="line"><span *ngFor="let token of line" [style.color]="token.color" [style.font-style]="hasFontStyle(token.fontStyle, 1) ? 'italic' : null" [style.font-weight]="hasFontStyle(token.fontStyle, 2) ? 'bold' : null" [style.text-decoration]="hasFontStyle(token.fontStyle, 4) ? 'underline' : null">{{token.text}}</span></span></ng-container>}</code></pre>
      </div>
    </div>
  `,
})
export class AiCodeBlockComponent implements OnChanges, OnDestroy {
  @Input() code = '';
  @Input() language?: string;
  @Output() readonly layoutChanged = new EventEmitter<void>();

  wrapped = true;
  copied = false;
  copying = false;
  status = '';
  lines: AiCodeLine[] = [[{text: ''}]];
  plain = false;
  private readonly highlighter = inject(AiCodeHighlighter);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private generation = 0;
  private copyRevision = 0;
  private copyTimer?: ReturnType<typeof setTimeout>;

  get copyLabel(): string {
    return this.copied ? 'Copied to clipboard.' : 'Copy';
  }

  hasFontStyle(style: number | undefined, mask: number): boolean {
    return ((style ?? 0) & mask) !== 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['code'] && !changes['language']) return;
    if (changes['code']) this.resetCopy();
    const generation = ++this.generation;
    const lines = this.code.length <= 64 * 1024 ? this.code.split('\n', 1001) : [];
    this.plain = this.code.length > 64 * 1024 || lines.length > 1000;
    this.lines = this.plain ? [] : lines.map((text) => [{text}]);
    if (this.plain) return;
    void this.highlight(generation);
  }

  ngOnDestroy(): void {
    this.generation++;
    this.resetCopy();
  }

  toggleWrap(): void {
    this.wrapped = !this.wrapped;
    this.layoutChanged.emit();
  }

  async copy(): Promise<void> {
    const revision = ++this.copyRevision;
    clearTimeout(this.copyTimer);
    this.copying = true;
    this.copied = false;
    this.status = '';
    try {
      await navigator.clipboard.writeText(this.code);
      if (revision !== this.copyRevision) return;
      this.copied = true;
      this.status = 'Copied to clipboard.';
      this.copyTimer = setTimeout(() => {
        this.copied = false;
        this.status = '';
        this.changeDetector.markForCheck();
      }, 2000);
    } catch {
      if (revision !== this.copyRevision) return;
      this.status = 'Clipboard is unavailable. Select and copy the text directly.';
    } finally {
      if (revision === this.copyRevision) {
        this.copying = false;
        this.changeDetector.markForCheck();
      }
    }
  }

  private async highlight(generation: number): Promise<void> {
    try {
      const lines = await this.highlighter.highlight(this.code, this.language);
      if (generation !== this.generation || !lines) return;
      this.lines = lines;
      this.changeDetector.markForCheck();
      this.layoutChanged.emit();
    } catch {
      // The interpolated source already in the view remains the fallback.
    }
  }

  private resetCopy(): void {
    this.copyRevision++;
    clearTimeout(this.copyTimer);
    this.copyTimer = undefined;
    this.copying = false;
    this.copied = false;
    this.status = '';
  }
}
