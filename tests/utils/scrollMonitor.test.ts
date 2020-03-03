import ScrollMonitor from '../../src/utils/scrollMonitor';

describe('.ScrollMonitor Static Class', () => {
  describe('.subscribe', () => {
    it('adds cbs to existing ad if another plugin has already subscribed it', () => {
      const element = document.createElement('div');
      const cb = () => { };

      ScrollMonitor.subscribe('ad1', element, 5, cb);
      ScrollMonitor.subscribe('ad1', element, 5, cb, cb);
      ScrollMonitor.subscribe('ad1', element, 5, cb, cb, cb);

      expect(ScrollMonitor.adCount).toBe(1);
      expect(ScrollMonitor.registeredAds.ad1.onEnterViewport.length).toBe(3);
      expect(ScrollMonitor.registeredAds.ad1.onFullyEnterViewport.length).toBe(2);
      expect(ScrollMonitor.registeredAds.ad1.onExitViewport.length).toBe(1);
    });

    it('adds a new ad to the dict when appropriate', () => {
      const element = document.createElement('div');
      const cb = () => { };

      ScrollMonitor.subscribe('ad1', element, 5, cb);
      ScrollMonitor.subscribe('ad1', element, 5, cb, cb);

      ScrollMonitor.subscribe('ad2', element, 5, cb, cb, cb);

      expect(ScrollMonitor.adCount).toBe(2);
    });
  });

  describe('.unsubscribe', () => {
    it('removes the correct ad from the dict', () => {
      ScrollMonitor.unsubscribe('ad1');
      expect(ScrollMonitor.adCount).toBe(1);
      expect(ScrollMonitor.registeredAds.ad1).toBe(undefined);
      expect(!!ScrollMonitor.registeredAds.ad2).toBe(true);

      ScrollMonitor.unsubscribe('ad2');
      expect(ScrollMonitor.adCount).toBe(0);
      expect(ScrollMonitor.registeredAds.ad2).toBe(undefined);
    });
  });
});
