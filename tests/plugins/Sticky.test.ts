import Sticky from '../../src/plugins/Sticky';

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
      unfreeze: () => { }
    };

    // @ts-ignore
    const sticky: any = new Sticky(ad);
    sticky.onCreate();
    expect(ad.container.style.top).toBe('0px');
    expect(ad.container.style.position).toBe('sticky');
  });

  it('applies the correct stickyOffset when provided', () => {
    const dummyContainer: any = document.createElement('div');
    const dummyEl: any = document.createElement('div');

    dummyContainer.appendChild(dummyEl);

    const ad = {
      configuration: {
        breakpoints: {},
        stickyOffset: 3
      },
      container: dummyEl,
      el: {},
      network: 'DFP',
      render: () => { },
      refresh: jest.fn(() => { }),
      clear: () => { },
      destroy: () => { },
      freeze: () => { },
      unfreeze: () => { }
    };

    // @ts-ignore
    const sticky: any = new Sticky(ad);
    sticky.onCreate();
    expect(ad.container.style.top).toBe('3px');
  });

  it('reverts sticky container to original styles when destroyed', () => {
    const dummyParent: any = document.createElement('div');
    const dummyAdContainer: any = document.createElement('div');
    const originalDummyAdContainerPosition = 'relative'
    dummyAdContainer.style.position = originalDummyAdContainerPosition;
    
    dummyParent.appendChild(dummyAdContainer);

    const ad = {
      configuration: {
        breakpoints: {},
        stickyOffset: 3,
        sticky: true
      },
      container: dummyAdContainer,
      el: {},
      network: 'DFP',
      render: () => {},
      refresh: jest.fn(() => {}),
      clear: () => {},
      destroy: () => {},
      freeze: () => {},
      unfreeze: () => {}
    }

    // @ts-ignore
    const sticky: any = new Sticky(ad);

    // Container set to sticky
    sticky.onCreate();
 
    // Ad container styles like position should be overridden
    expect(ad.container.style.position).not.toEqual(originalDummyAdContainerPosition);

    // Clean up should revert styles to original
    sticky.onDestroy();
    
    expect(ad.container.style.position).toEqual(originalDummyAdContainerPosition);
  });
});
