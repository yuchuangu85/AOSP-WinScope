import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {setLanguage} from '@common/i18n';

import {AiMarkdownComponent} from './ai_markdown_component';

describe('AiMarkdownComponent', () => {
  let fixture: ComponentFixture<AiMarkdownComponent>;
  let root: HTMLElement;

  beforeEach(async () => {
    setLanguage('en');
    await TestBed.configureTestingModule({imports: [AiMarkdownComponent, NoopAnimationsModule]}).compileComponents();
    fixture = TestBed.createComponent(AiMarkdownComponent);
    root = fixture.nativeElement;
  });
  afterEach(() => {fixture.destroy(); setLanguage('en');});

  function render(text: string): void {
    fixture.componentRef.setInput('text', text);
    fixture.detectChanges();
  }

  it('renders semantic Markdown rather than escaped formatting markers', () => {
    render('# 黑屏分析\n\n**Observed** *evidence* ~~old~~ `alpha`\n\n> No buffer\n\n- [x] Matched\n- [ ] Missing\n\n3. Check\n4. Verify');
    expect(root.querySelector('h1')?.textContent?.trim()).toBe('黑屏分析');
    expect(root.querySelector('strong')?.textContent?.trim()).toBe('Observed');
    expect(root.querySelector('em')?.textContent?.trim()).toBe('evidence');
    expect(root.querySelector('del')?.textContent?.trim()).toBe('old');
    expect(root.querySelector('blockquote')).not.toBeNull();
    expect(root.querySelector('ol')?.getAttribute('start')).toBe('3');
    const tasks = root.querySelectorAll<HTMLInputElement>('input[type=checkbox]');
    expect(tasks.length).toBe(2);
    expect(tasks[0].checked).toBeTrue();
    expect(tasks[1].checked).toBeFalse();
    expect(tasks[0].disabled).toBeTrue();
  });

  it('keeps ordinary response text verbatim without introducing template whitespace', () => {
    render('Privacy');
    expect(root.textContent).toBe('Privacy');
    render('Words **bold** next words.');
    expect(root.textContent).toBe('Words bold next words.');
  });

  it('renders aligned table headers and wraps the table in its own keyboard scrollport', () => {
    render('| Layer | Alpha |\n| :--- | ---: |\n| app | 0 |');
    expect(root.querySelector('table')).not.toBeNull();
    expect(root.querySelector('.table-scroll')?.getAttribute('tabindex')).toBe('0');
    expect(root.querySelectorAll('th').length).toBe(2);
    expect(root.querySelectorAll('td').length).toBe(2);
    expect(root.querySelectorAll('th')[1].style.textAlign).toBe('right');
  });

  it('treats raw HTML, unsafe links and remote images as inert content', () => {
    render('<img src=x onerror=alert(1)>\n\n<script>alert(2)</script>\n\n[bad](javascript:alert%283%29) [file](file:///tmp/trace) ![private](https://example.com/pixel.png)');
    expect(root.querySelector('script,img,iframe,object,svg')).toBeNull();
    expect(root.querySelector('a')).toBeNull();
    expect(root.textContent).toContain('<img src=x onerror=alert(1)>');
    expect(root.textContent).toContain('private');
  });

  it('only gives safe external links their own navigation target', () => {
    render('[AOSP](https://source.android.com/docs) and `https://example.com/api`');
    const links = root.querySelectorAll('a');
    expect(links.length).toBe(2);
    expect(links[0].target).toBe('_blank');
    expect(links[0].rel).toBe('noopener noreferrer');
  });

  it('renders references and localized footnote chrome without translating source content', () => {
    render('Observation[^a]\n\n[^a]: Original evidence.');
    expect(root.querySelector('sup')?.textContent).toBe('1');
    expect(root.querySelector('.footnotes')).not.toBeNull();
    setLanguage('zh-CN');
    fixture.detectChanges();
    expect(root.querySelector('.footnotes h2')?.textContent).toBe('脚注');
    expect(root.textContent).toContain('Original evidence.');
  });

  it('updates changed responses and removes markup left by the previous answer', () => {
    render('# Old answer\n\n| a | b |\n|---|---|\n|1|2|');
    expect(root.querySelector('table')).not.toBeNull();
    render('New **answer**');
    expect(root.querySelector('table,h1')).toBeNull();
    expect(root.querySelector('strong')?.textContent?.trim()).toBe('answer');
  });
});
