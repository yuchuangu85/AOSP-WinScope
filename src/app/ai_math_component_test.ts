import {ComponentFixture, TestBed} from '@angular/core/testing';
import katex from 'katex';

import {AiMathComponent} from './ai_math_component';

describe('AiMathComponent', () => {
  let fixture: ComponentFixture<AiMathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [AiMathComponent]}).compileComponents();
    fixture = TestBed.createComponent(AiMathComponent);
  });

  afterEach(() => fixture.destroy());

  function render(text: string, display = false): HTMLElement {
    fixture.componentRef.setInput('text', text);
    fixture.componentRef.setInput('display', display);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders accessible inline math with native MathML namespace and original annotation', () => {
    const host = render('x^2 + y^2');
    expect(host.classList.contains('math-inline')).toBeTrue();
    expect(host.querySelector('.katex-display')).toBeNull();
    const math = host.querySelector('math');
    expect(math?.namespaceURI).toBe('http://www.w3.org/1998/Math/MathML');
    expect(host.querySelector('annotation[encoding="application/x-tex"]')?.textContent).toBe('x^2 + y^2');
    expect(host.querySelector('.katex-html')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('switches display math without retaining the previous formula', () => {
    render('a');
    const host = render('\\frac{1}{2}', true);
    expect(host.classList.contains('math-display')).toBeTrue();
    expect(host.getAttribute('data-math-display')).toBe('true');
    expect(host.querySelectorAll('.katex-display').length).toBe(1);
    expect(host.querySelector('math')?.getAttribute('display')).toBe('block');
    expect(host.querySelector('annotation')?.textContent).toBe('\\frac{1}{2}');
  });

  it('does not trust javascript links, HTML extensions or external image commands', () => {
    for (const text of [
      '\\href{javascript:alert(1)}{click}',
      '\\htmlClass{evil}{x}',
      '\\includegraphics{https://example.invalid/secret.png}',
      '<img src=x onerror="alert(1)">',
    ]) {
      const host = render(text);
      expect(host.querySelector('a, img, script, .evil, [onclick], [onerror]')).toBeNull();
    }
  });

  it('keeps invalid source visible as a KaTeX error', () => {
    const text = '\\frac{';
    const host = render(text);
    expect(host.querySelector('.katex-error')?.textContent).toBe(text);
  });

  it('bounds macro expansion and preserves an invalid recursive expression', () => {
    const text = '\\def\\loop{\\loop}\\loop';
    const host = render(text);
    expect(host.textContent).toBe(text);
    expect(host.classList.contains('math-fallback')).toBeTrue();
  });

  it('uses safe full-text fallback after an unexpected renderer exception', () => {
    spyOn(katex, 'renderToString').and.throwError('renderer failure');
    const text = '<img src=x onerror="alert(1)">\\frac{';
    const host = render(text);
    expect(host.textContent).toBe(text);
    expect(host.classList.contains('math-fallback')).toBeTrue();
    expect(host.querySelector('img')).toBeNull();
  });

  it('retains oversized math in full without calling KaTeX', () => {
    const renderer = spyOn(katex, 'renderToString').and.callThrough();
    const text = 'x'.repeat(16 * 1024 + 1);
    const host = render(text, true);
    expect(renderer).not.toHaveBeenCalled();
    expect(host.textContent).toBe(text);
    expect(host.classList.contains('math-fallback')).toBeTrue();
  });

  it('does not carry user macro definitions between renders', () => {
    render('\\gdef\\owned{123}\\owned');
    const host = render('\\owned');
    expect(host.querySelector('annotation')?.textContent).toBe('\\owned');
    expect(host.querySelector('.katex-html')?.textContent).toContain('\\owned');
    expect(host.querySelector('.katex-html')?.textContent).not.toContain('123');
  });

  it('renders Chinese formula text using the reference strict-ignore retry', () => {
    const text = '耗时 = 16.7\\,\\mathrm{ms}';
    const host = render(text);
    expect(host.querySelector('.katex')).not.toBeNull();
    expect(host.querySelector('.katex-error')).toBeNull();
    expect(host.querySelector('annotation')?.textContent).toBe(text);
  });

  it('blocks macro-amplified output before entering KaTeX', () => {
    const renderer = spyOn(katex, 'renderToString').and.callThrough();
    const text = '\\def\\A{' + 'x'.repeat(1000) + '}' + '\\A'.repeat(30);
    const host = render(text);
    expect(renderer).not.toHaveBeenCalled();
    expect(host.textContent).toBe(text);
    expect(host.classList.contains('math-fallback')).toBeTrue();
  });

  it('blocks digit-named macro definitions before entering KaTeX', () => {
    const renderer = spyOn(katex, 'renderToString').and.callThrough();
    const text = '\\def0{' + 'x'.repeat(1800) + '}' + '0'.repeat(45);
    const host = render(text);
    expect(renderer).not.toHaveBeenCalled();
    expect(host.textContent).toBe(text);
    expect(host.classList.contains('math-fallback')).toBeTrue();
  });

  it('preserves raw formula source if generated math exceeds the DOM budget', () => {
    spyOn(katex, 'renderToString').and.returnValue('<span>' + 'x'.repeat(65_537) + '</span>');
    const host = render('x');
    expect(host.textContent).toBe('x');
    expect(host.querySelector('span')).toBeNull();
  });
});
