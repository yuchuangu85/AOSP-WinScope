import {TestBed} from '@angular/core/testing';
import {language} from '@common/i18n';

import {LoadProgressComponent} from './load_progress_component';

describe('LoadProgressComponent localization', () => {
  afterEach(() => language.set('en'));

  for (const [source, translated] of [
    [
      'Opened from external tool. Waiting for files...',
      '已从外部工具打开，正在等待文件…',
    ],
    ['Downloading files...', '正在下载文件…'],
    ['Initializing UI...', '正在初始化界面…'],
    ['Parsing proto files', '正在解析 proto 文件'],
  ]) {
    it(`translates ${source} in place without changing the progress input`, async () => {
      await TestBed.configureTestingModule({
        imports: [LoadProgressComponent],
      }).compileComponents();
      const fixture = TestBed.createComponent(LoadProgressComponent);
      language.set('en');
      fixture.componentRef.setInput('message', source);
      fixture.componentRef.setInput('progressPercentage', 42);
      fixture.detectChanges();
      const message = fixture.nativeElement.querySelector('.progress-message');
      expect(message.textContent.trim()).toBe(source);

      language.set('zh-CN');
      fixture.detectChanges();
      expect(message.textContent.trim()).toBe(translated);
      expect(fixture.componentInstance.message()).toBe(source);
      expect(fixture.componentInstance.progressPercentage()).toBe(42);

      language.set('en');
      fixture.detectChanges();
      expect(message.textContent.trim()).toBe(source);
      expect(fixture.nativeElement.querySelector('.progress-message')).toBe(
        message,
      );
    });
  }

  it('updates progress labels in place without changing input or technical values', async () => {
    await TestBed.configureTestingModule({
      imports: [LoadProgressComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(LoadProgressComponent);
    fixture.componentRef.setInput('message', 'Fetching files...');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Fetching files...');

    language.set('zh-CN');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('正在获取文件…');
    expect(fixture.componentInstance.message()).toBe('Fetching files...');

    fixture.componentRef.setInput(
      'message',
      'device:/data/local/tmp/trace.winscope',
    );
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'device:/data/local/tmp/trace.winscope',
    );
    language.set('en');
    fixture.componentRef.setInput('message', 'Fetching files...');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Fetching files...');
  });
});
