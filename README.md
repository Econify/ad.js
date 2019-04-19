# Ad.js
Ad.js is an ad library that aims to simplify and optimize client integrations with ad networks such as DFP. Ad.js accomplishes these goals by presenting developers a simple to use and easy to understand DSL with plugins to increase viewability and impressions such as Auto Refresh, Sticky Ads, Lazy Loading of Ads and automatic Breakpoint Refresh.

## Getting Started

To install Ad.js you have two options

- NPM:  `npm install adjs`
- Script include: `<script src=``"``https://cdn.adjs.io/latest.min.js``"``></script>`

Before instantiating an Ad with Ad.js you should globally configure Ad.js otherwise your ad will instantiate with the default provider which is a Noop.

### Configuration Options

| Argument            | Default               | Description                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| network (optional) | AdJs.Provider.Default | The provider argument expects an object that is able to communicate with your ad provider that adheres to Ad.js provider interface (link). Common Ad platforms are already included within Ad.js such as DFP. Custom providers are easily created by inheriting from AdJS.Provider.Default.<br><br>See here (link) for built in providers and required options<br>See here for examples of custom providers (link). |
| plugins (optional)  | None                  | An array of modules that you’d like to leverage from AdJS that adhere to the Plugin Interface. Most features of AdJS are separated into modules/plugins to ensure that the size of your package is as small as possible                                                                                                                                                                                                     |
| vendors (optional)  | None                  | An array of objects that conform to the vendor interface spec. See here (link)                                                                                                                                                                                                                                                                                                                                      |
| defaults (optional) | None                  | An object of default values that you’d like passed into every ad on creation<br><br>See here for ad options (link)                                                                                                                                                                                                                                                                                                  |

Example Configuration

```js
    const homepageAdBucket = new AdJS.Bucket({
      network: AdJS.Network.DFP,
      vendors: [
        new AdJS.Vendors.Krux("KRUX ID"),
        new AdJS.Vendors.AdmantX({
          url: "https://url.com/",
          key: "admantixuserid",
        }),
      ],
      
      
      defaults: {
        breakpoints: [1200, 800, 400],
        refreshRate: 1000,
        offset: -100,
        targeting: { example: 'true' },
      }
    });
```
After configuring Ad.js you can create Ad.js Ad instances targeted to your ad provider via new `AdJs.Ad` instances

```js
    new homepageBucket.Ad(DomElement, ?Options);
```

### Dom Element
The dom element you’d like to place the ad into. You can pass either a DOMElement or a string. Strings will be looked up via document.querySelector. It is suggested that you pass in a DOM Element explicitly as document.querySelector is expensive.

### Slot ID
Ad.js requires you to name each ad instance with a unique slot ID. Some ad providers will leverage this id in their ad calls.

### Ad Options

| Option              | Default | Description                                                                                                                                                                                                                                                                                              |
| ------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| autoRender          | true    | In order to optimize page performance and viewability metrics (link), when this value is set Ad.js will monitor the sum of the browsers scroll position and ad offset option to automatically call render for you. If this is set to false you will be expected to call render() explicitly.             |
| autoRefresh         | true    | In order to optimize ad impressions when an ad is in view beyond the amount of time provided to the ad refreshRate options, Ad.js will automatically refresh the ad slot and give you a new ad. If this value is false you will be expected to call refresh() explicitly if you’d like to refresh an ad. |
| offset              | 0       | The offset of the viewport to consider the ad in view. This will not affect your provider’s internal viewability metrics, however it is used by the autoRefresh and autoRender options                                                                                                                   |
| refreshRate         | 60000   | If autoRefresh has been set to true, this value will be used to determine how long after an ad is in viewport (browsers scroll position + offset) until the ad should be refreshed for another impression.                                                                                               |
| targeting           | {}      | Key value targeting values to be passed to your ad provider                                                                                                                                                                                                                                              |
| breakpoints         | []      | Array of values that correspond to the page breakpoints                                                                                                                                                                                                                                                  |
| refreshOnBreakpoint | true    | Should the ad automatically refresh when passing the values provided in breakpoints                                                                                                                                                                                                                      |
| *provider options*  |         | Sometimes (though discouraged) an ad provider will have additional options that are required or optional. See your provider to see these additional options.                                                                                                                                             |

    

Example Ad Creation

```js
    const el = document.findElementById('example');
    
    const bannerAd = new homepageAdBucket.Ad(el, {
      slot: 'banner',
      offset: -10,
    });
```

## Ad Lifecycle Controls

Once your ad has been created, Ad.js provides you a functional interface to interact and control your ads.

A typical ad lifecycle goes:

1. Create
2. Request
3. Render
4. Complete
5. Destroy

If your ad is refreshed (and your provider supports ad refresh), a typical lifecycle may look more like:

1. Create
2. Request
3. Render
4. Complete
5. Refresh
6. Request
7. Render
8. Complete

There are three methods for you to get a reference to your ad for interaction with the methods below.

1. Assigning to variable:  `const bannerAd = new bucket.Ad(el, 'banner');`
2. Lookup via SlotID:  `bucket.find('banner')`
3. Lookup via Element:`bucket.find(DOMElement)`
4. Lookup via instances array:`bucket.instances[0]`

Even though most Ad lifecycle actions require network requests and are therefore asynchronous, Ad.js interfaces are synchronous. When async methods are still pending, Ad.js will automatically queue up your action and replay them in the order received. Because of this code like this is safe!

```js
    const ad = bucket.find('banner');
    
    ad.on('render', () => {
      console.log('render');
    });
    
    ad.on('destroy', () => {
      console.log('destroy');
    });
    
    ad.on('refresh', () => {
      console.log('refresh');
    });
    
    ad.render();
    ad.refresh();
    ad.destroy();
    
    // console.log 'render'
    // console.log 'refresh'
    // console.log 'destroy'
```

However should you want to link into the completion of the action you invoke, the actions return their promise in the chain. Example:

```js
    const ad = new bucket.Ad(el, bucket: { 'slot1' });
    
    ad.render()
      .then(() => console.log('rendered'));
```

### Render
Whether you have set autoRender to false or you need to explicitly render at a specific point Ad.js provides you with a render method. Simply call render() to force render an ad that has not yet been rendered. Note: Calling render on an already rendered Ad is a noop, however calling render on an ad that has been cleared will render a new ad.

```js
    const ad = new bucket.Ad(el, { slot: 'ad1' });
    
    ad.render();
```

### Refresh
Similar to Render, refresh can explicitly be called at any time regardless of you setting “autoRefresh”. Refresh can even be called if an ad hasn’t been rendered yet and will act as the initial render. This makes refresh a safe option to use if you want to put a new ad in regardless of whether or not an ad already has been rendered in a slot.

### Clear
Clear will remove the ad from the screen, clear out any existing timers and pause all life cycle events. You can call render or refresh to have the ad render again.

### Destroy
Destroy will remove all listeners, events and actions from the ad including disassociating the slot id. Once destroy is called all history of the ad existing is removed and marked for garbage collection. You must create a brand new ad if you’d like to render an ad in that position.

### Freeze
Freeze will hold all actions to an ad and pause all timers for refresh. Calling any action while an ad is frozen will go into a queue. You can decide whether to replay this queue upon unfreeze or to disregard it. If an ad has been rendered it will remain rendered upon freeze.

### Unfreeze
Unfreeze will remove an ad from a frozen state and resume timers. Unfreeze takes a single parameter instructing Ad.js whether to play all actions the ad has received while paused. The default for this param is false. Example:

```js
    const ad = new bucket.Ad(el, { slot: 'adtobefrozen' });
    
    ad.freeze();
    ad.render(); // does nothing
    ad.unfreeze(); // ad still does not have a render
    
    ad.freeze();
    ad.render(); // does nothing
    ad.unfreeze({ replayEventsWhileFrozen: true }); // calls render 
```

### Event Bus
Every ad in enigma contains an event bus for you to monitor and interact with the ad specifically. TODO @Stephen B fill out event bus meanings. Example:

```js
    import EVENTS from 'adjs/Events';
    
    const ad = new bucket.Ad(el, options);
    ad.on(EVENTS.RENDER, function (event) {
     console.log('rendered into', this, 'because of', event);
    });
```

In addition to all of the events in the lifecycle being subscribable, the following events are subscribable as well:

- Breakpoint Change (`on(``'``breakpoint``'``, () => {})`)

## Providers

In Ad.js a network is a module that enables Ad.js to communicate with the ad platform (DFP, etc). Sometimes a network is built upon a low level library that the ad platform itself has provided (e.g. GPT).

By default Ad.js ships with two providers:

1. Default (link)
2. DFP (link)

### Default Networks
The default provider in Ad.js is what most providers inherit from. At its core it is an interface of noops (link). Use the default provider while you’re in development mode or on an environment that should not make requests to your actual ad platform.

- No arguments are required for the default network.
- The default network does not add any configuration options to Ad Options.

Example Code:

```js
    const bucket = new AdJS.Bucket({
      network: AdJS.Networks.Default,
    });
```

### DFP Network (GPT Abstraction)
The DFP network is the most commonly used network in production as DFP is the most used ad platform at the time of this being written. Underneath the hood the DFP network utilizes GPT to communicate with DFP.


- The DFP network has one optional argument
    - string? - base path for `adUnitPath`  arguments to append to. For example if your site is bucketing all ads under an ad unit segment, you can save the repetition of passing that ad path in to all ad units.
- The DFP network adds one required argument to Ad Options
    - adUnitPath<String> - ad unit path for ad that will be created. If the optional arugment was provided to the DFP provider during configuration, the value passed here will be prefixed with that value

Example Code:

```js
    new AdJS.Bucket({
      provider: AdJS.Networks.DFP,
    });
    
    const ad = new bucket.Ad(el, {
      slot: "exampleAd",
      adUnitPath: "/banner",
    });
```

### Custom Providers
If you are interacting with an ad platform that is not part of the official Ad.js library, you can create a custom provider. It is recommended that your custom provider inherit from the Ad.js “default provider” to make sure that you avoid missing any interface methods. Even if you choose not to inherit from `Default` it is beneficial to view the source of `Default` (link) and `DFP` (link) as an example.

Example Custom Provider:

```js
    import DefaultProvider from 'adjs/DefaultProvider';
    import loadScript from './loadScript';
    
    class ExampleCustomProvider extends DefaultProvider {
      static optionalParams = [];
      static requiredParams = ['adPath'];
      
      id = null;
      url = null;
      
      constructor({ id, url }) {
        super(true); // Important to pass true
          
        if (!id) {
          throw new Error("ID is a required field");
        }
        
        if (!url) {
          throw new Error("URL is a required field");
        }
        
        this.id = id;
        this.url = url;
        
        loadScript('https://cdn.econify.com/dfp.js');
      }
      
      create(el, props, EventTrigger) {
        super(props); // this will do type checking
        const { adPath } = props;
    
        const ad = window.exampleLibrary.createAd({ el, adPath })
                    .then((id) => {
                      EventTrigger.rendered();
                      return { id, adPath };
                    });
                    
        Events.requested();
        
        return ad;
      }
      
      async destroy(ad, EventTrigger) {
        EventTrigger.destroying();
        await window.exampleLibrary.destroyAd(ad.id);
        EventTrigger.destroyed();
      }
    } 
```

## Vendor Modules

A vendor module allows you to control targeting, slot ids, and run time behavior of an Ad. Examples of vendor modules that ship with AdJS are Krux or Admantix. As vendor modules can potentially be dangerous, you should ensure you only implement modules from trusted sources or roll them in-house.

TODO: Describe vendor interface and hooks

## Debugging

An advantage with using Ad.js is the debug interface. At any point you may call AdJS.DEBUG() in the console and as long as your bucket includes the Debug module, information on all details of the ad calls/code/etc will appear on screen where the ad would normally render. TODO: elaborate and screenshots

## Single Page Application (Or Recirculation)

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

### Homepage Recirculation:

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

### Article Recirculation:
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
