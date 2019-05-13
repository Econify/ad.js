# Creating Responsive Ads with Breakpoints
By default when an ad is loaded your ad network will provide you a creative that fits the sizes requested for your current breakpoint
(e.g. Desktop, Tablet, Mobile). However should a user resize the viewport by changing the size of the browser, the ad will stay the same
size. This is problamatic in scenarios where full width creatives like a banner ad may fit the design on large desktop, but not on small desktop.

Ad.JS's Breakpoints plugin will monitor the browser's viewport as well as the sizes that your ad requests and will request new creatives from your ad network automatically.

## Installation
Depending on your method of implementation, Ad.js packages may be installed via different methods.
Please follow the directions for your relevant method.

### NPM
If you have installed Ad.js via NPM the responsive package is available via an esmodule import.

__Example__:
```js
import AdJS from 'adjs';
import ResponsivePlugin from 'adjs/plugins/Responsive';

const bucket = new AdJS(Network, {
  plugins: [
    ResponsivePlugin,
  ]
});
```

### Script Tag
If you have installed Ad.js via a script tag, you will either need to ensure your bundle already
includes the LazyLoad plugin (preferred) or include the lazy load script in the header.

__Example__:
```html
<html>
  <head>
    <script src="https://cdn.adjs.dev/adjs.base.js"></script>
    <script src="https://cdn.adjs.dev/adjs.responsive.plugin.js"></script>
  </head>
  <body>
    <script>
      const bucket = new AdJS(Network, {
        plugins: [
          AdJSPlugins.Responsive
        ]
      });
    </script>
  </body>
</html>
```

## Options
The Breakpoints Plugin adds two options and adds additional functionality to the `sizes` option

|Option|Default|Description|
|---|---|---|
|breakpoints|{}|A key value pair of name to breakpoint from/to. For Example: { desktop: { from: 0, to: 300 } }|
|sizes|{}|While `sizes` is already a key within the Ad.JS base library, the breakpoints plugin allows you to leverage the named breakpoints from the `breakpoints` key in order to define ad sizes specific to each breakpoint. For Example: { desktop: [[300, 250], [300, 600]] }|
|refreshOnBreakpoint|true|Whether or not to automatically trigger an ad refresh when the viewport crosses a breakpoint|

## Examples

Configuration via Bucket (will affect all ads within the bucket). It is preferred for you to define the breakpoints on the bucket (as
generally the site's breakpoints will not change) and to define the sizes on each ad implementation.
```js
import AdJS from 'adjs';
import Responsive from 'adjs/plugins/Responsive';

const bucket = new AdJS(Network, {
  plugins: [
    Breakpoints,
  ],

  defaults: {
    breakpoints: {
      tablet: { from: 351, to: 780 },
      desktop: { from: 781 },
    }
  }
});

const ad = new bucket.createAd(el, {
  sizes: {
    tablet: [
      [300, 250]
    ],

    desktop: [
      [300, 250], [300, 600]
    ]
  },
});
```

Configuraton on an individual Ad
```js
import AdJS from 'adjs';
import Responsive from 'adjs/plugins/Responsive';

const bucket = new AdJS(Network);

const ad = new bucket.createAd(el, {
  plugins: [
    Responsive
  ],

  breakpoints: {
    mobile: { from: 0, to: 350 },
    tablet: { from: 351, to: 780 },
    desktop: { from: 781 },
  },

  sizes: {
    tablet: [
      [300, 250]
    ],

    desktop: [
      [300, 250], [300, 600]
    ]
  },
});
``` 
