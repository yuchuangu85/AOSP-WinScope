import {isInputTextField} from './dom';

describe('Editable keyboard targets', () => {
  it('recognizes textareas and every text-entry input type', () => {
    expect(isInputTextField(document.createElement('textarea'))).toBeTrue();
    for (const type of ['text', 'search', 'email', 'password', 'tel', 'url', 'number']) {
      const input = document.createElement('input');
      input.type = type;
      expect(isInputTextField(input)).withContext(type).toBeTrue();
    }
  });

  it('recognizes inherited contenteditable targets but not a disabled editing island', () => {
    const editor = document.createElement('div');
    editor.contentEditable = 'true';
    const nested = document.createElement('span');
    editor.append(nested);
    document.body.append(editor);
    try {
      expect(isInputTextField(editor)).toBeTrue();
      expect(isInputTextField(nested)).toBeTrue();
      nested.contentEditable = 'false';
      expect(isInputTextField(nested)).toBeFalse();
    } finally { editor.remove(); }
  });

  it('leaves non-editing controls and viewer surfaces eligible for shortcuts', () => {
    for (const element of [document.createElement('button'), document.createElement('div')]) {
      expect(isInputTextField(element)).toBeFalse();
    }
    for (const type of ['checkbox', 'radio', 'button', 'range', 'file']) {
      const input = document.createElement('input');
      input.type = type;
      expect(isInputTextField(input)).withContext(type).toBeFalse();
    }
  });
});
