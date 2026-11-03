import {ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick} from '@angular/core/testing';
import {setLanguage} from '@common/i18n';
import {AiCodeHighlighter, AiCodeLine} from '@services/ai_code_highlighter';

import {AiCodeBlockComponent} from './ai_code_block_component';

describe('AiCodeBlockComponent', () => {
  let fixture: ComponentFixture<AiCodeBlockComponent>;
  let component: AiCodeBlockComponent;
  let highlight: jasmine.Spy;

  beforeEach(async () => {
    setLanguage('en');
    highlight = jasmine.createSpy('highlight').and.resolveTo(undefined);
    await TestBed.configureTestingModule({
      imports: [AiCodeBlockComponent],
      providers: [{provide: AiCodeHighlighter, useValue: {highlight}}],
    }).compileComponents();
    fixture = TestBed.createComponent(AiCodeBlockComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    setLanguage('en');
  });

  function element<T extends HTMLElement>(selector: string): T {
    return fixture.nativeElement.querySelector(selector) as T;
  }

  function render(code: string, language = 'ts'): void {
    fixture.componentRef.setInput('code', code);
    fixture.componentRef.setInput('language', language);
    fixture.detectChanges();
  }

  it('renders the actual header, full source, keyboard focus and wrap command', () => {
    render('const answer = 42;\n\n');
    expect(element('.code-banner[data-code-block-banner]')).toBeTruthy();
    expect(element('.code-language').textContent).toBe('ts');
    expect(element('.code-content[data-code-block-content] > pre').tabIndex).toBe(0);
    expect(element('code').textContent).toBe('const answer = 42;\n\n');
    expect(fixture.nativeElement.querySelectorAll('code > .line').length).toBe(3);
    expect(element('.md-code-block').getAttribute('data-code-wrap')).toBe('true');
    const changed = spyOn(component.layoutChanged, 'emit');
    element<HTMLButtonElement>('.code-wrap').click();
    fixture.detectChanges();
    expect(element('.md-code-block').getAttribute('data-code-wrap')).toBe('false');
    expect(element('.code-wrap').getAttribute('aria-pressed')).toBe('false');
    expect(changed).toHaveBeenCalledTimes(1);
  });

  it('renders oversized or excessive-line code as one text node without losing source', () => {
    for (const source of ['x'.repeat(65_537), 'x\n'.repeat(50_000)]) {
      render(source);
      expect(element('code').textContent).toBe(source);
      expect(fixture.nativeElement.querySelectorAll('code span').length).toBe(0);
      expect(highlight).not.toHaveBeenCalled();
    }
  });

  it('copies original trailing blank lines from the header and resets feedback after two seconds', fakeAsync(() => {
    const write = spyOn(navigator.clipboard, 'writeText').and.resolveTo();
    render('const value = 1;\n\n');
    element<HTMLButtonElement>('.code-copy').click();
    flushMicrotasks();
    fixture.detectChanges();
    expect(write).toHaveBeenCalledOnceWith('const value = 1;\n\n');
    expect(component.copied).toBeTrue();
    expect(element('.code-copy').getAttribute('aria-label')).toBe('Copied to clipboard.');
    expect(element('[role="status"]').textContent).toBe('Copied to clipboard.');
    tick(1999);
    expect(component.copied).toBeTrue();
    tick(1);
    fixture.detectChanges();
    expect(element('.code-copy').getAttribute('aria-label')).toBe('Copy');
    expect(element('[role="status"]').textContent).toBe('');
  }));

  it('does not invent a newline for copied source', fakeAsync(() => {
    const write = spyOn(navigator.clipboard, 'writeText').and.resolveTo();
    render('value');
    element<HTMLButtonElement>('.code-copy').click();
    flushMicrotasks();
    expect(write).toHaveBeenCalledOnceWith('value');
    tick(2000);
  }));

  it('announces clipboard errors locally and leaves raw source selectable', fakeAsync(() => {
    spyOn(navigator.clipboard, 'writeText').and.rejectWith(new Error('denied'));
    render('keep me\n');
    element<HTMLButtonElement>('.code-copy').click();
    flushMicrotasks();
    fixture.detectChanges();
    expect(element('[role="status"]').textContent).toContain('Clipboard is unavailable.');
    expect(element('code').textContent).toBe('keep me\n');
    expect(component.copying).toBeFalse();
  }));

  it('keeps HTML-shaped source inert before and after token highlighting', fakeAsync(() => {
    const source = '<img src=x onerror="alert(1)"><script>alert(1)</script>';
    highlight.and.resolveTo([[{text: source, color: 'var(--shiki-token-string)'}]]);
    render(source);
    expect(element('code').textContent).toBe(source);
    flushMicrotasks();
    fixture.detectChanges();
    expect(element('code').textContent).toBe(source);
    expect(fixture.nativeElement.querySelector('img, script')).toBeNull();
    expect(element('.line > span').style.color).toBe('var(--shiki-token-string)');
  }));

  it('keeps raw fallback for unknown languages and rejected highlighting', fakeAsync(() => {
    render('plain\n\n', '__proto__');
    flushMicrotasks();
    fixture.detectChanges();
    expect(element('code').textContent).toBe('plain\n\n');
    highlight.and.rejectWith(new Error('highlight unavailable'));
    render('new source\n', 'python');
    flushMicrotasks();
    fixture.detectChanges();
    expect(element('code').textContent).toBe('new source\n');
  }));

  it('does not truncate rendered source above the highlighting limit', fakeAsync(() => {
    const source = 'a'.repeat(64 * 1024 + 1) + '\n\n';
    render(source);
    flushMicrotasks();
    fixture.detectChanges();
    expect(element('code').textContent).toBe(source);
  }));

  it('ignores stale async results when code or grammar changes', fakeAsync(() => {
    let resolveOld!: (lines: AiCodeLine[]) => void;
    highlight.and.returnValue(new Promise<AiCodeLine[]>((resolve) => { resolveOld = resolve; }));
    render('old', 'python');
    highlight.and.resolveTo([[{text: 'new', color: 'var(--shiki-token-keyword)'}]]);
    render('new', 'ts');
    flushMicrotasks();
    fixture.detectChanges();
    resolveOld([[{text: 'old'}]]);
    flushMicrotasks();
    fixture.detectChanges();
    expect(element('code').textContent).toBe('new');
    expect(element('.code-language').textContent).toBe('ts');
  }));

  it('updates translated controls without changing code or re-highlighting', () => {
    render('const 原始内容 = "unchanged";');
    const calls = highlight.calls.count();
    setLanguage('zh-CN');
    fixture.detectChanges();
    expect(element('.code-copy').getAttribute('aria-label')).toBe('复制');
    expect(element('code').textContent).toBe('const 原始内容 = "unchanged";');
    expect(highlight.calls.count()).toBe(calls);
  });

  it('ignores pending work after destruction and disposes copy timers', fakeAsync(() => {
    let resolveHighlight!: (lines: AiCodeLine[]) => void;
    highlight.and.returnValue(new Promise<AiCodeLine[]>((resolve) => { resolveHighlight = resolve; }));
    spyOn(navigator.clipboard, 'writeText').and.resolveTo();
    render('source');
    void component.copy();
    flushMicrotasks();
    const changed = spyOn(component.layoutChanged, 'emit');
    fixture.destroy();
    resolveHighlight([[{text: 'stale'}]]);
    flushMicrotasks();
    tick(2000);
    expect(changed).not.toHaveBeenCalled();
    expect(component.copied).toBeFalse();
    expect(component.lines).toEqual([[{text: 'source'}]]);
  }));
});

describe('AiCodeHighlighter', () => {
  it('uses CSS-variable tokens for the boot grammars without changing source', async () => {
    const highlighter = new AiCodeHighlighter();
    for (const [code, language] of [
      ['const value: number = 42;\n\n', 'ts'],
      ['echo "$HOME"\n', 'bash'],
      ['{"ready": true}', 'json'],
    ]) {
      const lines = await highlighter.highlight(code, language);
      expect(lines).toBeDefined();
      expect(lines?.map((line) => line.map((token) => token.text).join('')).join('\n')).toBe(code);
      expect(lines?.flat().some((token) => token.color?.startsWith('var(--shiki-'))).toBeTrue();
    }
  });

  it('loads a bounded lazy grammar once for concurrent callers', async () => {
    const highlighter = new AiCodeHighlighter();
    const results = await Promise.all([
      highlighter.highlight('print("hello")', 'python'),
      highlighter.highlight('print("hello")', 'py'),
    ]);
    expect(results[0]).toBeDefined();
    expect(results[0]).toEqual(results[1]);
  });

  it('can load every allowed non-boot grammar with the JavaScript engine', async () => {
    const highlighter = new AiCodeHighlighter();
    for (const language of ['python', 'java', 'kotlin', 'cpp', 'c', 'xml', 'yaml', 'sql', 'log', 'diff']) {
      expect(await highlighter.highlight('example', language)).withContext(language).toBeDefined();
    }
  });

  it('preserves long lines and CRLF source, with plain fallback if normalization is required', async () => {
    const highlighter = new AiCodeHighlighter();
    for (const code of ['a'.repeat(3000), 'const value = 1;\r\n\r\n']) {
      const lines = await highlighter.highlight(code, 'ts');
      if (lines) {
        expect(lines.map((line) => line.map((token) => token.text).join('')).join('\n')).toBe(code);
      }
    }
  });

  it('leaves unknown, inherited-property names, Go and oversized code plain', async () => {
    const highlighter = new AiCodeHighlighter();
    for (const language of ['unknown', '__proto__', 'constructor', 'go', '']) {
      expect(await highlighter.highlight('source', language)).toBeUndefined();
    }
    expect(await highlighter.highlight('a'.repeat(64 * 1024 + 1), 'ts')).toBeUndefined();
    expect(await highlighter.highlight('\u4e2d'.repeat(22 * 1024), 'ts')).toBeUndefined();
  });
});
