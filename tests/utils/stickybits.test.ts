import Stickybits from '../../src/utils/stickybits';

describe('stickybits', () => {
  it('applies the correct style to an element', () => {
    const el = document.createElement('div');
    const stickybit = new Stickybits(el);

    console.log(el);
  })
})
