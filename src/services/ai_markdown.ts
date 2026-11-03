// eslint-disable-next-line @typescript-eslint/triple-slash-reference -- Legacy node resolution needs this ambient declaration in production's explicit file graph.
/// <reference path="../micromark_symbol.d.ts" />
import {Definition, FootnoteDefinition, RootContent} from 'mdast';
import {fromMarkdown} from 'mdast-util-from-markdown';
import {gfmFromMarkdown} from 'mdast-util-gfm';
import {mathFromMarkdown} from 'mdast-util-math';
import {gfm} from 'micromark-extension-gfm';
import {math} from 'micromark-extension-math';
import {cjkFriendlyStrong} from 'third_party/deepseek_markdown/cjkFriendlyStrong';
import {mathCompatibility} from 'third_party/deepseek_markdown/mathCompatibility';

export interface AiMarkdownNode {
  type: string;
  value?: string;
  children?: AiMarkdownNode[];
  depth?: number;
  href?: string;
  title?: string;
  language?: string;
  ordered?: boolean;
  start?: number;
  checked?: boolean;
  align?: 'left' | 'center' | 'right';
  wide?: boolean;
  number?: number;
}

export interface AiMarkdownDocument {
  nodes: AiMarkdownNode[];
  footnotes: Array<{number: number; nodes: AiMarkdownNode[]}>;
}

/** Only explicit external links are actionable; local paths need a host-owned opener. */
export function safeMarkdownLink(value: string): string | undefined {
  try {
    const url = new URL(value);
    if (!['https:', 'http:', 'mailto:'].includes(url.protocol) || url.username || url.password) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}

/** Same GFM/CJK/math extensions as the read-only DeepSeek Harness reference. */
export function parseAiMarkdown(source: string): AiMarkdownDocument {
  const plain = (): AiMarkdownDocument => ({nodes: [{type: 'plain', value: source}], footnotes: []});
  // Gate expensive grammar work before parsing, not only the resulting AST.
  // Oversized/pathological replies remain one exact-source selectable text node.
  if (source.length > 128 * 1024 || new TextEncoder().encode(source).byteLength > 128 * 1024) return plain();
  let lines = 0;
  let references = 0;
  let delimiters = 0;
  for (const character of source) {
    if (character === '\n' && ++lines > 2048) return plain();
    if (character === '[' && ++references > 512) return plain();
    if ('*_~$'.includes(character) && ++delimiters > 4096) return plain();
  }
  try {
    const root = fromMarkdown(source, {
      extensions: [gfm({singleTilde: false}), cjkFriendlyStrong(), math(), mathCompatibility()],
      mdastExtensions: [gfmFromMarkdown(), mathFromMarkdown()],
    });
    const definitions = new Map<string, Definition>();
    const footnotes = new Map<string, FootnoteDefinition>();
    let budget = 20_000;
    const collect = (nodes: RootContent[], depth = 0) => {
      if (depth > 64 || (budget -= nodes.length) < 0) throw new Error('Markdown limit');
      for (const node of nodes) {
        if (node.type === 'definition' && !definitions.has(node.identifier)) definitions.set(node.identifier, node);
        if (node.type === 'footnoteDefinition' && !footnotes.has(node.identifier)) footnotes.set(node.identifier, node);
        if ('children' in node) collect(node.children, depth + 1);
      }
    };
    collect(root.children);
    const footnoteOrder: string[] = [];
    let formulaCount = 0;
    const literal = (node: RootContent): AiMarkdownNode => ({type: 'text', value:
      source.slice(node.position?.start.offset ?? 0, node.position?.end.offset ?? 0)});
    const mapNodes = (nodes: RootContent[], quoted = false, linked = false): AiMarkdownNode[] =>
      nodes.flatMap((node): AiMarkdownNode[] => {
        const children = () => 'children' in node ? mapNodes(node.children, quoted, linked) : [];
        switch (node.type) {
          case 'definition':
          case 'footnoteDefinition': return [];
          case 'text':
          case 'html': return [{type: 'text', value: node.value}];
          case 'inlineCode': {
            const value = node.value.replace(/\r?\n|\r/g, ' ');
            const href = !linked && /^https?:\/\//i.test(value) ? safeMarkdownLink(value) : undefined;
            return [{type: 'inlineCode', value, href}];
          }
          case 'code': {
            const formula = node.lang === 'math' && ++formulaCount <= 64;
            return [{type: formula ? 'math' : 'code', value: node.value, language: node.lang ?? undefined}];
          }
          case 'math':
          case 'inlineMath': return [{type: ++formulaCount <= 64 ? node.type : 'inlineCode', value: node.value}];
          case 'heading': return [{type: 'heading', depth: node.depth, children: children()}];
          case 'blockquote': return [{type: 'blockquote', children: mapNodes(node.children, true, linked)}];
          case 'paragraph':
          case 'strong':
          case 'emphasis':
          case 'delete': return [{type: node.type, children: children()}];
          case 'break':
          case 'thematicBreak': return [{type: node.type}];
          case 'list': {
            const loose = !!node.spread || node.children.some((item) => item.spread ?? item.children.length > 1);
            return [{type: 'list', ordered: node.ordered ?? false, start: node.start ?? 1,
              children: node.children.map((item) => ({type: 'listItem', checked: item.checked ?? undefined,
                children: mapNodes(item.children, quoted, linked).map((child) => !loose && child.type === 'paragraph'
                  ? {...child, type: 'group'} : child)}))}];
          }
          case 'listItem': return [{type: 'listItem', children: children()}];
          case 'table': {
            const columns = node.align?.length ?? node.children[0]?.children.length ?? 0;
            if ((budget -= columns * node.children.length) < 0) throw new Error('Markdown table limit');
            return [{type: 'table', wide: columns >= 4 && !quoted,
            children: node.children.map((row) => ({type: 'tableRow', children: Array.from(
              {length: node.align?.length ?? row.children.length}, (_, index) => ({type: 'tableCell',
                align: node.align?.[index] ?? undefined, children: mapNodes(row.children[index]?.children ?? [], quoted, linked)}))}))}];
          }
          case 'link': return [{type: 'link', href: safeMarkdownLink(node.url), title: node.title ?? undefined,
            children: mapNodes(node.children, quoted, true)}];
          case 'linkReference': {
            const target = definitions.get(node.identifier);
            return target ? [{type: 'link', href: safeMarkdownLink(target.url), title: target.title ?? undefined,
              children: mapNodes(node.children, quoted, true)}] : [literal(node)];
          }
          case 'image': return [{type: 'image', value: node.alt ?? ''}];
          case 'imageReference': return definitions.has(node.identifier)
            ? [{type: 'image', value: node.alt ?? ''}] : [literal(node)];
          case 'footnoteReference': {
            if (!footnotes.has(node.identifier)) return [literal(node)];
            if (!footnoteOrder.includes(node.identifier)) footnoteOrder.push(node.identifier);
            return [{type: 'footnoteReference', number: footnoteOrder.indexOf(node.identifier) + 1}];
          }
          default: return [];
        }
      });
    const nodes = mapNodes(root.children);
    const renderedFootnotes: AiMarkdownDocument['footnotes'] = [];
    // Definitions can refer to other footnotes; each identifier is rendered at most once.
    for (let index = 0; index < footnoteOrder.length; index++) {
      renderedFootnotes.push({number: index + 1, nodes: mapNodes(footnotes.get(footnoteOrder[index])!.children)});
    }
    return {nodes, footnotes: renderedFootnotes};
  } catch {
    return plain();
  }
}
