import {Component, ElementRef, inject, Input, OnChanges} from '@angular/core';
import katex from 'katex';

@Component({
  selector: 'ai-math',
  standalone: true,
  template: '',
  host: {
    'class': 'md-math',
    '[class.math-display]': 'display',
    '[class.math-inline]': '!display',
    '[attr.data-math-display]': 'display',
  },
})
export class AiMathComponent implements OnChanges {
  @Input() text = '';
  @Input() display = false;
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  ngOnChanges(): void {
    const host = this.element.nativeElement;
    host.textContent = this.text;
    host.classList.remove('math-fallback');
    const commands = this.text.match(/\\[a-zA-Z]+/g) ?? [];
    let depth = 0;
    let tooDeep = false;
    for (const character of this.text) {
      if (character === '{') depth++;
      if (character === '}') depth--;
      if (depth > 24) tooDeep = true;
    }
    // User-defined macros can amplify a short formula into an enormous tree.
    const definesMacro = /\\(?:def|gdef|edef|xdef|newcommand|renewcommand|providecommand|let|futurelet)(?![a-zA-Z])/.test(this.text);
    if (this.text.length > 2048 || commands.length > 96 || definesMacro || tooDeep) {
      host.classList.add('math-fallback');
      return;
    }
    try {
      // Only KaTeX writes DOM here; model-authored HTML never reaches a sink.
      const options: katex.KatexOptions = {
        displayMode: this.display,
        output: 'htmlAndMathml',
        trust: false,
        strict: 'error',
        throwOnError: true,
        maxExpand: 50,
        maxSize: 10,
        macros: {},
      };
      let html: string;
      try {
        html = katex.renderToString(this.text, options);
      } catch {
        html = katex.renderToString(this.text, {...options, strict: 'ignore', throwOnError: false});
      }
      if (html.length > 64 * 1024) throw new Error('Formula output limit');
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      host.replaceChildren(...Array.from(parsed.body.childNodes));
    } catch {
      host.textContent = this.text;
      host.classList.add('math-fallback');
    }
  }
}
