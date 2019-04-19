# Single Page Applications

In a SPA your application may view multiple pages without full refresh. Because of this, your initial configuration of your Ad.js bucket may no longer have valid targeting parameters and some of your plugins that rely on current url may no longer be valid. Ad.js makes this easy by providing you with a page utility. Instead of calling `configure`  during the initial setup, you will use `new AdJS.Bucket` with all the same configuration values and pass the resulting object into an ad. In most providers, calling new page will automatically update your correlator for you and in doing so hide all the complexity regarding refreshing of ads with separate correlators in the background! Example:

```js
    const page1 = new AdJS.Bucket(options) // => page 1
    const ad1 = new page1.Ad(el, { slot: 'ad1', refreshRateInMs: 30000 }) // => using page 1
    
    const page2 = new AdJS.Bucket(options) // => set page 2
    new page2.Ad(el, { slot: 'ad2' }) // => using page 2
    
    const page3 = new AdJS.bucket(options) // set page 3
    new page3.Ad(el, { slot: 'ad3'}) // => using page 3
    new page3.Ad(el, { slot: 'ad4' }) // => explicitly using page 2 even though global is page 3
    
    ad1.render() // => uses the page 1 correlator and targeting it was created with
    
    // Action: Scroll ad 2 into view
    // Result: A new correlator will be created and Ad 2 will render and Ad 1 (as long as it is out of the viewport will remain)
    // Action: Scroll ad 1 back into view and wait for refresh
    // Result: A new correlator will be created and Ad 1 will refresh with the new correlator to ensure it doesn't pick up Ad 2's correlator
```

Implementation Examples:

## Homepage Example

```js
    import AdJS from 'AdJS';
    
    import DFPProvider from 'adjs/providers/DFP';
    
    import Refresh from 'adjs/modules/Refresh';
    import Offset from 'adjs/modules/Offset';
    import Breakpoint from 'adjs/modules/Breakpoint';
    import Sticky from 'adjs/modules/Sticky';
    import Logging from 'adjs/modules/Logging';
    import Debug from 'adjs/modules/Debug';
    import Banner from 'adjs/modules/Banner';
    
    import KruxPlugin from 'adjs/plugins/Krux';
    
    const homepageAdBucket = new AdJS.Bucket({
      provider: new DFPProvider('DFP_BASE_PATH'),
      modules: [
        Breakpoint,
        Refresh,
        Offset,
        Sticky,
        Logging,
        Debug,
      ],
      plugins: [
        new KruxPlugin("KRUX_ID"),
      ]
      defaultOptions: {
        renderWithOffset: true,
        sticky: false,
        refreshTimeInMs: 30000,
      },
    });
    const bannerAd = new homepageAdBucket.Ad('.bannerAd', {
      offset: -10,
      modules: [Banner],
      fixBannerInMs: 100,
    });
    const boxUnitElements = document.getElementsByClass('ad');
    const boxUnitAds = Array.prototype.map.call(boxUnitElements, (el, idx) => {
      const ad = new homepageAdBucket.Ad(el, {
        offset: -50,
        sticky: true,
      });
    });
    bannerAd.render();
    const firstBoxAd = homepageAdBucket.find('.ad');
```

## Infinite Scroll Example
```js
    import AdJS from 'adjs';
    import DFPProvider from 'adjs/providers/DFP';
    import EventBus from 'adjs/utils/EventBus';
    import Refresh from 'adjs/modules/Refresh';
    const initialArticleBucket = new AdJS.Bucket({
      provider: new DFPProvider('DFP_BASE_PATH'),
      modules: [Refresh],
    });
    const { pageId: initialPageId } = document.querySelector('[data-page-id]').dataset;
    const bannerAd = new initialArticleBucket.Ad('[data-ad=banner]', {
      slot: 'banner',
      sizes: [100, 200, 300],
    });
    const boxAdElements = document.querySelectorAll('[data-ad=boxad]');
    Array.prototype.forEach.call(boxAdElements, (el, idx) => {
      new initialArticleBucket.Ad(el, {
        slot: 'box-ad',
        sizes: [100, 300],
      });
    });
    // Vanilla
    document.addEventListener('transport', (e) => {
      const { pageId } = e.detail;
      const newPageBucket = new AdJS.Bucket({
        provider: new DFPProvider(`DFP_BASE_PATH/${pageId}`),
        modules: [Refresh],
        defaults: {
          refreshIntervalInMs: 30000,
        },
      });
      const newPageAdElements = e.currentTarget.querySelectorAll('[data-ad]');
      Array.prototype.forEach(newPageAdElements, (el) => {
        new newPageBucket.Ad({
          slot: el.dataset.slot,
          sizes: el.dataset.sizes,
          refreshIntervalInMs: 15000,
        });
      });
    });
    
    // Built In Event Bus
    EventBus.on('transport', (e) => {});
```

