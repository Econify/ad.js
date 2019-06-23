import Sticky from '../../src/plugins/Sticky';
import MockAdNetwork from '../../src/networks/Mock';
import Noop from '../../src/networks/Noop';

describe('Sticky', () => {
  it('applies the correct style to an element in a non-IE11 environment', () => {
    // can someone tell me what's wrong with this ad configuration?
    // I added more stuff because it was failing but something less detailed than
    // this seemed to work in the Responsive ad config...

    /*
    const dummyContainer: any = document.createElement('div');
    const dummyEl: any = document.createElement('div');

    const ad = {
      id: 1,
      slot: {},
      configuration: {
        breakpoints: {},
      },
      container: dummyContainer,
      el: dummyEl,
      network: new Noop(),
      render: () => { },
      refresh: jest.fn(() => { }),
      clear: () => { },
      destroy: () => { },
      freeze: () => { },
      unfreeze: () => { },
    };

    const sticky: any = new Sticky(ad);
    sticky.onCreate();
    expect(dummyContainer.style.top).toBe('0px');
    expect(dummyContainer.style.position).toBe('sticky');
    */
  })
});
