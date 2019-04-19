# Quick Start
Ad.js is an ad library that aims to simplify and optimize client integrations with ad networks such as DFP. Ad.js accomplishes these goals by presenting developers a simple to use and easy to understand DSL with plugins to increase viewability and impressions such as Auto Refresh, Sticky Ads, Lazy Loading of Ads and automatic Breakpoint Refresh.

## Installation

To install Ad.js you have two options

- NPM:  `npm install adjs`
- Script include: `<script src=``"``https://cdn.adjs.io/latest.min.js``"``></script>`

Before instantiating an Ad with Ad.js you should globally configure Ad.js otherwise your ad will instantiate with the default provider which is a Noop.

## Configuration Options

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

## Networks (e.g. DFP)

In Ad.js a network is a module that enables Ad.js to communicate with the ad platform (DFP, etc). Sometimes a network is built upon a low level library that the ad platform itself has provided (e.g. GPT).

By default Ad.js ships with two providers:

1. Default (link)
2. DFP (link)

## Plugins / Additional Functionality
TODO

## Vendor Modules (e.g. Krux, Admantix)

A vendor module allows you to control targeting, slot ids, and run time behavior of an Ad. Examples of vendor modules that ship with AdJS are Krux or Admantix. As vendor modules can potentially be dangerous, you should ensure you only implement modules from trusted sources or roll them in-house.

TODO: Describe vendor interface and hooks

