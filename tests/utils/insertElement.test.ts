import insertElement from '../../src/utils/insertElement';

describe('insertElement', () => {
  const parentElement = document.createElement('div');
  const htmlString = 'Banana';

  it('initializes attributes parameter as empty object when undefined', () => {
    const value = insertElement('div', undefined, parentElement);
    // @ts-ignore
    const value2 = insertElement('div', !!null, parentElement);

    expect(value.hasAttributes()).toEqual(false);
    expect(value2.hasAttributes()).toEqual(false);
  });

  it('returns element with attributes inside correct parent', () => {
    const attributes = { onblur: 'andItsValue' };
    const value = insertElement('div', attributes, parentElement, htmlString);

    expect(value.getAttribute('onblur')).toEqual(attributes.onblur);
    expect(value.innerHTML).toEqual('Banana');
  });

  it('sets attribute as a string if not type boolean', () => {
    const attributes = {
      onblur: null,
      onfocus: 'thisValue',
    };

    // @ts-ignore
    const value = insertElement('div', attributes, parentElement);

    expect(value.getAttribute('onblur')).toEqual('null');
    expect(value.getAttribute('onfocus')).toEqual(attributes.onfocus);
  });

  it('sets the value of attribute with the key when type boolean and truthy', () => {
    const attributes = { onkeydown: true };

    const value = insertElement('div', attributes, parentElement);

    expect(value.getAttribute('onkeydown')).toEqual('onkeydown');
  });

  it('does not attach attribute at all if value is type boolean and false', () => {
    const attributes = { onkeyup: false };
    const value = insertElement('div', attributes, parentElement);

    expect(value.getAttribute('onkeyup')).toEqual(null);
  });

  it('does not insert html if parameter undefined', () => {
    const value = insertElement('div', {}, parentElement);

    expect(value.innerHTML).toEqual('');
  });
});
