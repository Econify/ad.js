import loadScript from '../../src/utils/loadScript';

describe('loadScript', () => {
  const domHead: any = document.querySelector('head');
  const url: string = 'https://unpkg.com/adjs@latest/umd/debug.production.min.js';

  const attributes: { [key: string]: any } = {
    id: 'scriptId',
    class: 'scriptClass',
  };

  it('Injects the script into the header of the dom tree with all attributes', () => {
    const expected: any = document.createElement('script');
    expected.src = url;
    expected.classList = [attributes.class];
    expected.id = attributes.id;

    const thisDoesntExistYet: HTMLElement | null = document.getElementById(attributes.id);

    loadScript(url, attributes);

    const thisExistsNow: HTMLElement | null = document.getElementById(attributes.id);

    expect(thisDoesntExistYet).toEqual(null);
    expect(thisExistsNow).toEqual(expected);
    domHead.removeChild(thisExistsNow);
  });

  it('does not attach attributes with boolean falsey values', () => {
    attributes.defer = false;

    loadScript(url, attributes);

    const injectedScript: any = document.getElementById(attributes.id);

    expect(injectedScript.hasAttribute('defer')).toEqual(false);
    delete attributes.defer;
    domHead.removeChild(injectedScript);
  });

  it('sets attribute flag when boolean and true', () => {
    attributes.async = true;

    loadScript(url, attributes);

    const injectedScript: any = document.getElementById(attributes.id);

    expect(injectedScript.hasAttribute('async')).toEqual(true);
    delete attributes.async;
    domHead.removeChild(injectedScript);
  });
});
