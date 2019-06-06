# Creating Responsive Ads with Breakpoints
By default when an ad is loaded your ad network will provide you a creative that fits the sizes requested for your current breakpoint
(e.g. Desktop, Tablet, Mobile). However should a user resize the viewport by changing the size of the browser, the ad will stay the same
size. This is problematic in scenarios where full width creatives like a banner ad may fit the design on large desktop, but not on small desktop.

Ad.js's Responsive plugin will monitor the browser's viewport as well as the sizes that your ad requests and will request new creatives from your ad network automatically.

## Installation
Depending on your method of implementation, Ad.js packages may be installed via different methods.
Please follow the directions for your relevant method.

### NPM
If you have installed Ad.js via NPM the responsive package is available via an esmodule import.

__Example__:
```js
import AdJS from 'adjs';
import DFP from 'adjs/networks/DFP';
import Responsive from 'adjs/plugins/Responsive';

const page = new AdJS.Page(DFP, {
  plugins: [
    Responsive,
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
    <script src="https://unpkg.com/adjs@latest/umd/core.production.min.js"></script>
    <script src="https://unpkg.com/adjs@latest/umd/networks.dfp.production.min.js"></script>
    <script src="https://unpkg.com/adjs@latest/umd/plugins.responsive.production.min.js"></script>
  </head>
  <body>
    <script>
      const page = new AdJS.Page(AdJS.Networks.DFP, {
        plugins: [
          AdJS.Plugins.Responsive
        ]
      });
    </script>
  </body>
</html>
```

## Options
The Responsive Plugin adds one option to Ad configuration.

|Option|Default|Description|
|---|---|---|
|refreshOnBreakpoint|true|Whether or not to automatically trigger an ad refresh when the viewport crosses a breakpoint|

## Examples

Configuration via Page (will affect all ads within the page). It is preferred for you to define the breakpoints on the page (as
generally the site's breakpoints will not change) and to define the sizes on each ad implementation.
```js
import AdJS from 'adjs';
import DFP from 'adjs/networks/DFP';

import Responsive from 'adjs/plugins/Responsive';

const page = new AdJS.Page(DFP, {
  plugins: [
    Responsive,
  ],

  defaults: {
    breakpoints: {
      tablet: { from: 351, to: 780 },
      desktop: { from: 781 },
    }
  }
});

const ad = new page.createAd(el, {
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
import DFP from 'adjs/networks/DFP';
import Responsive from 'adjs/plugins/Responsive';

const page = new AdJS.Page(DFP);

const ad = new page.createAd(el, {
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
