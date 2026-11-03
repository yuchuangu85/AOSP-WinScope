import {AiMarkdownNode, parseAiMarkdown, safeMarkdownLink} from './ai_markdown';

describe('AI Markdown parser', () => {
  function all(nodes: AiMarkdownNode[]): AiMarkdownNode[] {
    return nodes.flatMap((node) => [node, ...all(node.children ?? [])]);
  }

  it('parses reference-compatible headings, emphasis, lists, quotes, tables and code', () => {
    const source = '# Heading\n\n**bold** *italic* ~~removed~~ `code`\n\n> quote\n\n- one\n- two\n\n3. third\n4. fourth\n\n| Layer | Alpha |\n| :--- | ---: |\n| app | 0 |\n\n```json\n{"alpha":0}\n```';
    const result = parseAiMarkdown(source);
    const nodes = all(result.nodes);
    for (const type of ['heading', 'strong', 'emphasis', 'delete', 'inlineCode', 'blockquote', 'list', 'table', 'code']) {
      expect(nodes.some((node) => node.type === type)).withContext(type).toBeTrue();
    }
    expect(nodes.find((node) => node.ordered)?.start).toBe(3);
    expect(nodes.find((node) => node.type === 'code')?.value).toBe('{"alpha":0}');
    expect(nodes.filter((node) => node.type === 'tableCell').map((node) => node.align)).toEqual(['left', 'right', 'left', 'right']);
  });

  it('uses the reference CJK strong-emphasis extension without interpreting single tildes as deletion', () => {
    const result = parseAiMarkdown('**黑屏：**分析，范围 10~20；~~删除~~。');
    const nodes = all(result.nodes);
    expect(nodes.filter((node) => node.type === 'strong').length).toBe(1);
    expect(nodes.filter((node) => node.type === 'delete').length).toBe(1);
    expect(nodes.filter((node) => node.type === 'text').map((node) => node.value).join('')).toContain('10~20');
  });

  for (const source of ['$x^2$', '\\(x^2\\)', '$$x^2$$', '\\[x^2\\]', '```math\nx^2\n```']) {
    it(`uses reference math delimiters for ${source}`, () => {
      const nodes = all(parseAiMarkdown(source).nodes);
      expect(nodes.some((node) => ['math', 'inlineMath'].includes(node.type) && node.value?.includes('x^2'))).toBeTrue();
    });
  }

  it('preserves literal HTML and code as data and never returns an HTML sink', () => {
    const source = '<img src=x onerror=alert(1)>\n\n```html\n<script>alert(1)</script>\n```';
    const nodes = all(parseAiMarkdown(source).nodes);
    expect(nodes.some((node) => node.type === 'text' && node.value?.includes('onerror'))).toBeTrue();
    expect(nodes.find((node) => node.type === 'code')?.value).toBe('<script>alert(1)</script>');
    expect(nodes.some((node) => node.type === 'html')).toBeFalse();
  });

  it('resolves reference links and disables local, executable, encoded and credential-bearing destinations', () => {
    const source = '[safe][doc] [local](file:///private/trace) [bad](javascript:alert%281%29) [embedded](data:text/html,test)\n\n[doc]: https://example.com/trace "Trace docs"';
    const links = all(parseAiMarkdown(source).nodes).filter((node) => node.type === 'link');
    expect(links[0].href).toBe('https://example.com/trace');
    expect(links[0].title).toBe('Trace docs');
    expect(links.slice(1).every((node) => node.href === undefined)).toBeTrue();
    for (const url of ['javascript:alert(1)', 'java\nscript:alert(1)', 'data:text/html,test', 'blob:https://example.com/a', 'file:///tmp/a', '/ai/api/analyze', '//example.com', 'https://user:secret@example.com']) {
      expect(safeMarkdownLink(url)).withContext(url).toBeUndefined();
    }
    expect(safeMarkdownLink('mailto:dev@example.com')).toBe('mailto:dev@example.com');
  });

  it('promotes a full HTTP URL inside inline code but not commands or nested links', () => {
    const nodes = all(parseAiMarkdown('`https://example.com/api?a=1` `curl https://example.com` [`https://example.com`](https://example.org)').nodes)
      .filter((node) => node.type === 'inlineCode');
    expect(nodes[0].href).toBe('https://example.com/api?a=1');
    expect(nodes[1].href).toBeUndefined();
    expect(nodes[2].href).toBeUndefined();
  });

  it('preserves exact code including real trailing blank lines and unknown language identifiers', () => {
    const node = all(parseAiMarkdown('```mystery\na\n\n\n```').nodes).find((item) => item.type === 'code')!;
    expect(node.language).toBe('mystery');
    expect(node.value).toBe('a\n\n');
  });

  it('renders task items and footnotes in reference order without raw image requests', () => {
    const source = '- [x] done\n- [ ] pending\n\nSecond[^b] then first[^a] and second[^b].\n\n[^a]: Footnote A\n[^b]: Footnote B\n\n![private](https://example.com/tracking.png)';
    const result = parseAiMarkdown(source);
    const nodes = all(result.nodes);
    expect(nodes.filter((node) => node.type === 'listItem').map((node) => node.checked)).toEqual([true, false]);
    expect(nodes.filter((node) => node.type === 'footnoteReference').map((node) => node.number)).toEqual([1, 2, 1]);
    expect(all(result.footnotes[0].nodes).some((node) => node.value === 'Footnote B')).toBeTrue();
    const image = nodes.find((node) => node.type === 'image')!;
    expect(image.value).toBe('private');
    expect(image.href).toBeUndefined();
  });

  it('does not recursively repeat cyclic footnote definitions', () => {
    const result = parseAiMarkdown('Read[^a].\n\n[^a]: A references B[^b]\n[^b]: B references A[^a]');
    expect(result.footnotes.length).toBe(2);
  });

  it('keeps four-column tables wide except inside blockquotes', () => {
    const table = '| a | b | c | d |\n|---|---|---|---|\n|1|2|3|4|';
    expect(all(parseAiMarkdown(table).nodes).find((node) => node.type === 'table')?.wide).toBeTrue();
    expect(all(parseAiMarkdown(table.split('\n').map((line) => '> ' + line).join('\n')).nodes)
      .find((node) => node.type === 'table')?.wide).toBeFalse();
  });

  it('preserves oversized or excessively nested replies as literal text rather than losing data', () => {
    for (const source of ['x'.repeat(1_048_577), '> '.repeat(80) + 'deep']) {
      const result = parseAiMarkdown(source);
      expect(result.nodes[0].type).toBe('plain');
      expect(result.nodes[0].value).toBe(source);
    }
  });

  it('charges padded sparse table cells to the output budget before allocating them', () => {
    const source = '|' + 'x|'.repeat(500) + '\n|' + '---|'.repeat(500) + '\n' + '|x|\n'.repeat(500);
    const result = parseAiMarkdown(source);
    expect(result.nodes.length).toBe(1);
    expect(result.nodes[0].type).toBe('plain');
    expect(result.nodes[0].value).toBe(source);
  });

  it('falls back before parsing many references and multiline pathological inputs', () => {
    for (const source of [
      Array.from({length: 20_000}, (_, index) => `[^${index}]: note`).join('\n'),
      '[x](https://example.com) '.repeat(513),
      'line\n'.repeat(2049),
    ]) {
      const result = parseAiMarkdown(source);
      expect(result.nodes.length).toBe(1);
      expect(result.nodes[0].type).toBe('plain');
      expect(result.nodes[0].value).toBe(source);
    }
  });

  it('caps live formula components per reply without dropping formula text', () => {
    const nodes = all(parseAiMarkdown(Array.from({length: 70}, () => '$x^2$').join('\n\n')).nodes);
    expect(nodes.filter((node) => node.type === 'inlineMath').length).toBe(64);
    expect(nodes.filter((node) => node.type === 'inlineCode').length).toBe(6);
    expect(nodes.filter((node) => node.value === 'x^2').length).toBe(70);
  });
});
