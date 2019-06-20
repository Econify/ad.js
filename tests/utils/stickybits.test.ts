import Stickybits from '../../src/utils/stickybits';

describe('stickybits', () => {
  it('applies the correct style to an element', () => {
    const el = document.createElement('div');
    const stickybit = new Stickybits(el);

    expect(el.style.top).toBe('0px');
    expect(el.style.position)
          .toBe('sticky -o-sticky -webkit-sticky -moz-sticky -ms-sticky' || 'fixed')
  })
});
