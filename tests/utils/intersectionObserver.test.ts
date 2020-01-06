import ITXObserver from '../../src/utils/intersectionObserver';

describe('.ITXObserver Static Class', async () => {
  beforeEach(() => {
    const bounds = {
      height: 1,
      width: 1,
      top: 1,
      left: 1,
      right: 1,
      bottom: 1,
    };

    const rootElm = document.createElement('div');

    ITXObserver.observer = {
      root: rootElm,
      rootMargin: '',
      observe: (target: Element) => undefined,
      unobserve: (target: Element) => undefined,
      disconnect: () => undefined,
      takeRecords: () => [{
        time: 12,
        rootBounds: bounds,
        boundingClientRect: bounds,
        intersectionRect: bounds,
        intersectionRatio: 12,
        isIntersecting: false,
        target: rootElm,
      },
      ],
    };
  });

  describe('.subscribe', () => {
    it('adds cbs to existing ad if another plugin has already subscribed it', () => {
      const element = document.createElement('div');
      const cb = () => { };

      ITXObserver.subscribe('ad1', element, 5, cb);
      ITXObserver.subscribe('ad1', element, 5, cb, cb);
      ITXObserver.subscribe('ad1', element, 5, cb, cb, cb);

      expect(ITXObserver.adCount).toBe(1);
      expect(ITXObserver.registeredAds.ad1.onEnterViewport.length).toBe(3);
      expect(ITXObserver.registeredAds.ad1.onFullyEnterViewport.length).toBe(2);
      expect(ITXObserver.registeredAds.ad1.onExitViewport.length).toBe(1);
    });

    it('adds a new ad to the dict when appropriate', () => {
      const element = document.createElement('div');
      const cb = () => { };

      ITXObserver.subscribe('ad1', element, 5, cb);
      ITXObserver.subscribe('ad1', element, 5, cb, cb);

      ITXObserver.subscribe('ad2', element, 5, cb, cb, cb);

      expect(ITXObserver.adCount).toBe(2);
    });
  });

  describe('.unsubscribe', () => {
    it('removes the correct ad from the dict', () => {
      ITXObserver.unsubscribe('ad1');
      expect(ITXObserver.adCount).toBe(1);
      expect(ITXObserver.registeredAds.ad1).toBe(undefined);
      expect(!!ITXObserver.registeredAds.ad2).toBe(true);

      ITXObserver.unsubscribe('ad2');
      expect(ITXObserver.adCount).toBe(0);
      expect(ITXObserver.registeredAds.ad2).toBe(undefined);
    });
  });
});
