# Sticky Ads
It is common to have your ad creatives in the "gutter" or the "rail" of your application.
This will maximize the time that each ad is visible in the viewport.

## Installation
Depending on your method of implementation, AdJS packages may be installed via different methods.
Please follow the directions for your relevant method.

### Usage
The element which the ad will be bound to must have a set height along with `position: absolute;` or `position: fixed;`.

### NPM
If you have installed AdJS via NPM the Sticky package is available via an esmodule import.

### Script Tag
If you have installed AdJS via a script tag, you will either need to ensure your bundle already
includes the Sticky plugin (preferred) or include the Sticky script in the header.

__Example__:
```html
<html>
  <head>
    <script src="https://unpkg.com/adjs@latest/umd/core.production.min.js"></script>
    <script src="https://unpkg.com/adjs@latest/umd/networks.DFP.min.js"></script>

    <script src="https://unpkg.com/adjs@latest/umd/plugins.Sticky.js"></script>
  </head>
  <body>
    <script>
      const page = new AdJS.Page(AdJS.Networks.DFP, {
        plugins: [
          AdJS.Plugins.Sticky
        ]
      });
    </script>
  </body>
</html>
```

## Options
The Sticky plugin adds one option to ad instantiation:

|Option|Default|Description|
|---|---|---|
|stickyOffset|0|Sticky ads will stick to the top of the window by default with the offset applying to the CSS `top` property to offset ad's fixed position.|

## Examples

Configuration via Page (will affect all ads within the page)
```js
import AdJS from 'adjs';
import Sticky from 'adjs/Plugins/Sticky';

const page = new AdJS.Page(Network, {
  plugins: [
    Sticky,
  ]
});
```

Configuration on an individual Ad
```js
import AdJS from 'adjs';
import Sticky from 'adjs/Plugins/Sticky';

const page = new AdJS.Page(Network);

const ad = new page.createAd(el, {
  plugins: [
    Sticky
  ],

  stickyOffset: 10
});
```
