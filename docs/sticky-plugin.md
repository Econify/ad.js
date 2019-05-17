# Sticky Ads
It is common to have your ad creatives in the "gutter" or the "rail" of your application.
This will maximize the time that each ad is visible in the viewport.

## Installation
Depending on your method of implementation, Ad.js packages may be installed via different methods.
Please follow the directions for your relevant method.

### Usage
The element which the ad will be bound to must have a set height along with `postion: absolute;` or `postion: fixed;`.

### NPM
If you have installed Ad.js via NPM the Sticky package is available via an esmodule import.

### Script Tag
If you have installed Ad.js via a script tag, you will either need to ensure your bundle already
includes the Sticky plugin (preferred) or include the Sticky script in the header.

__Example__:
```html
<html>
  <head>
    <script src="https://unpkg.com/adjs@2.0.0-beta.2/umd/core.min.js"></script>
    <script src="https://unpkg.com/adjs@2.0.0-beta.2/umd/networks.DFP.min.js"></script>

    <script src="https://unpkg.com/adjs@2.0.0-beta.2/umd/plugins.Sticky.js"></script>
  </head>
  <body>
    <script>
      const bucket = new AdJS.Bucket(AdJS.Networks.DFP, {
        plugins: [
          AdJS.Plugins.Sticky
        ]
      });
    </script>
  </body>
</html>
```

<!-- ## Options -->

## Examples

Configuration via Bucket (will affect all ads within the bucket)
```js
import AdJS from 'adjs';
import Sticky from 'adjs/plugins/Sticky';

const bucket = new AdJS.Bucket(Network, {
  plugins: [
    Sticky,
  ]
});
```

Configuraton on an individual Ad
```js
import AdJS from 'adjs';
import Sticky from 'adjs/plugins/Sticky';

const bucket = new AdJS.Bucket(Network);

const ad = new bucket.createAd(el, {
  plugins: [
    Sticky
  ]
});
``` 

