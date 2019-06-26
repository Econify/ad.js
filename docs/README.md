# Quick Start
Ad.js is an ad library that aims to simplify and optimize client integrations with ad networks such as DFP. Ad.js accomplishes these goals by presenting developers a simple to use and easy to understand DSL with plugins to increase view-ability and impressions such as Auto Refresh, Sticky Ads, Auto Rendering of Ads and automatic Breakpoint Refresh.

## Installation

To install Ad.js you have multiple options

- NPM:  `npm install adjs`

- Script include (Fully Featured): `<script src="https://unpkg.com/adjs@latest/umd/bundle.production.min.js"></script>`

- Script include (With feature specific imports): `<script src="https://unpkg.com/adjs@latest/umd/core.production.min.js"></script>`
Note: Using this import, please make sure to also include the scripts for all plugins you will be using as well. You can find the index of all hosted plugins for script include [here](https://unpkg.com/adjs@latest/umd/)


## Configuration

| Argument            | Default               | Description                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| network (required argument) | None | The network argument expects an object that is able to communicate with your ad provider that adheres to Ad.js network interface. See the Default Network [here](default-network.md). Common Ad platforms are already included within Ad.js such as [DFP](dfp-network.md)<br><br>See [here](README?id=networks-eg-dfp) for built in providers and required options<br>See [here](custom-networks.md) for examples of custom providers |
| plugins (optional)  | None                  | An array of modules that you’d like to leverage from AdJS that adhere to the Plugin Interface. Most features of AdJS are separated into modules/plugins to ensure that the size of your package is as small as possible                                                                                                                                                                                                     |
| vendors (optional)  | None                  | An array of objects that conform to the vendor interface spec.                                                                                                                                                                                                                                                                                                                                  |
| defaults (optional) | None                  | An object of default values that you’d like passed into every ad on creation<br><br>See [IAdConfiguration type](https://github.com/Econify/ad.js/blob/master/src/types.ts) in the declaration file.                                                                                                                                                                                                                                                                                                 |

Example Configuration

```js
const homepageAdPage = new AdJS.Page(AdJS.Networks.DFP, {
  vendors: [
    new AdJS.Vendors.Krux("KRUX ID"),
    new AdJS.Vendors.AdmantX({
      url: "https://url.com/",
      key: "admantixuserid",
    }),
  ],
  
  defaults: {
    breakpoints: {
      mobile: { from: 0, to: 359 },
      tablet: { from: 400, to: 759 },
      laptop: { from: 800, to: 1159 },
      desktop: { from: 1200, to: Infinity },
    },
    refreshRateInSeconds: 1000,
    offset: -100,
    targeting: { example: 'true' },
  }
});
```
Once you've created an Ad.js Page, you can create Ad instances inside of them via `pageName.createAd()`

__Example:__
```js
new homepagePage.Ad(DomElement, Options?);

// or

homepagePage.createAd(DomElement, Options?);
```

__Dom Element__:
The dom element you’d like to place the ad into. You can pass either a DOMElement or a string. Strings will be looked up via document.querySelector. It is suggested that you pass in a DOM Element explicitly as document.querySelector is expensive.

### Ad Options

| Option              | Default | Description                                                                                                                                                                                                                                                                                              |
| ------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| autoRender          | true    | In order to optimize page performance and view-ability metrics (link), when this value is set Ad.js will monitor the sum of the browsers scroll position and ad offset option to automatically call render for you. If this is set to false you will be expected to call render() explicitly.             |
| autoRefresh         | true    | In order to optimize ad impressions when an ad is in view beyond the amount of time provided to the ad refreshRate options, Ad.js will automatically refresh the ad slot and give you a new ad. If this value is false you will be expected to call refresh() explicitly if you’d like to refresh an ad. |
| offset              | 0       | The offset of the viewport to consider the ad in view. This will not affect your provider’s internal view-ability metrics, however it is used by the autoRefresh and autoRender options                                                                                                                   |
| refreshRateInSeconds         | 60   | If autoRefresh has been set to true, this value will be used to determine how long after an ad is in viewport (browsers scroll position + offset) until the ad should be refreshed for another impression.                                                                                               |
| targeting           | {}      | Key value targeting values to be passed to your ad provider                                                                                                                                                                                                                                              |
| breakpoints         | {}      | Key value list of breakpoints. (e.g. { mobile: { from: 0, to: 480 }, desktop: { from: 481, to: Infinity } }) |
| sizes         | []      | Either an array of ad sizes (e.g. [[300, 600], [300, 250]]) or if you have specified breakpoints, a key value mapping to the breakpoints (e.g. { mobile: [[300, 250]], desktop: [[300, 600], [300, 250]] }) |
| refreshOnBreakpoint | true    | Should the ad automatically refresh when passing the values provided in breakpoints                                                                                                                                                                                                                      |
| *provider options*  |         | Sometimes (though discouraged) an ad network will have additional options that are required or optional. See your network to see these additional options.                                                                                                                                             |

    

Example Ad Creation

```js
const el = document.findElementById('example');

const bannerAd = new homepageAdPage.Ad(el, {
  path: '/1234/example/homepage',
  offset: -10,
});
```

## Networks (e.g. DFP)

In Ad.js a network is a module that enables Ad.js to communicate with the ad platform (DFP, etc). Sometimes a network is built upon a low level library that the ad platform itself has provided (e.g. GPT).

By default Ad.js ships with two providers:

1. [Test Network](default-network)
2. [DoubleClick/DFP/GPT](dfp-network)

Please see the individual network documentation for usage and examples.

## Plugins / Additional Functionality
The parsing of javascript is done on the main thread and is blocking. Even if the code is not used, it will still be parsed.
By default Ad.js ships barebones. This is to ensure that only the code you are leveraging in your ad implementation is parsed
resulting in the faster loading ads and higher view-ability metrics.

Available plugins include:
- [Auto Render (recommended)](auto-render-plugin)
- [Responsive Ads](responsive-plugin)
- [Auto Refresh](refresh-plugin)
- [Sticky Ads](sticky-plugin)
- [Developer Tools](tools-plugin)

See each documentation of the respective plugins to understand their purpose and usage.

## Vendor Modules (e.g. Krux, Admantix)

A vendor module allows you to control targeting, slot ids, and run time behavior of an Ad. Examples of vendor modules that ship with AdJS are Krux or Admantix. As vendor modules can potentially be dangerous, you should ensure you only implement modules from trusted sources or roll them in-house.

TODO: Describe vendor interface and hooks

# About
Ad.js was built by the Econify team as a response to the monetization issues media sites routinely face when implementing ads.
Econify is a development shop that works with major media companies in NY, LA, Seattle and London.
To learn more about Econify see the [Econify website](http://www.econify.com).

## License
ISC License (ISC)
Copyright 2019 Econify L.L.C.

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

## Roadmap
The Ad.js roadmap is not yet public, but feature requests can be made by submitting an issue or a pull request directly to the Ad.js open source repo.
