import Sticky from '../../src/plugins/Sticky';
import MockAdNetwork from '../../src/networks/Mock';
import Noop from '../../src/networks/Noop';

describe('Sticky', () => {
  it('applies the correct style to an element in a non-IE11 environment', () => {
    const dummyContainer: any = document.createElement('div');
    const dummyEl: any = document.createElement('div');

    dummyContainer.appendChild(dummyEl);

    const ad = {
      configuration: {
        breakpoints: {},
      },
      container: dummyEl,
      el: {},
      network: 'DFP',
      render: () => { },
      refresh: jest.fn(() => { }),
      clear: () => { },
      destroy: () => { },
      freeze: () => { },
      unfreeze: () => { },
    };

    // @ts-ignore
    const sticky: any = new Sticky(ad);
    sticky.onCreate();
    expect(sticky.sticky.style.top).toBe('0px');
    expect(sticky.sticky.style.position).toBe('sticky');
  })
});
