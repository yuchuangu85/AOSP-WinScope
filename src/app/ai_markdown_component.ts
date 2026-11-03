import {NgTemplateOutlet} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {TranslatePipe} from '@common/i18n';
import {AiMarkdownDocument, parseAiMarkdown} from '@services/ai_markdown';

import {AiCodeBlockComponent} from './ai_code_block_component';
import {AiMathComponent} from './ai_math_component';

@Component({
  selector: 'ai-markdown',
  standalone: true,
  imports: [NgTemplateOutlet, TranslatePipe, AiCodeBlockComponent, AiMathComponent],
  templateUrl: './ai_markdown_component.ng.html',
  host: {'class': 'ai-markdown'},
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiMarkdownComponent implements OnChanges {
  @Input() text = '';
  @Output() readonly layoutChanged = new EventEmitter<void>();
  document: AiMarkdownDocument = {nodes: [], footnotes: []};

  ngOnChanges(): void {
    this.document = parseAiMarkdown(this.text);
  }
}
