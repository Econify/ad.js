# Deferred Loading of Ads
The creatives (ads) provided by the ad network are notorious for being non-performant. When non-performant
creatives are loaded when the page initially loads, the page speed is impacted. Google Page Speed Score
is used to help deterimine ranking in search enging rankings. Sites with higher scores are rewarded while sites
with lower scores are penalized.

Additionally, loading creatives that are not in the viewport (or are not within view)
can result in a lower viewability score of ads and creatives that are further down the page. Viewability
can be summarized as "when an ad is within the view of the visitor of the site for 2 seconds". When a creative
is located further down the page and the visitor bounces (or leaves) before the visitor gets to that section of the page,
the ad is considered a "non-viewable impression". This in result ends up affecting the CPM of the ad unit.

In order to avoid the penalties imposed by loading slow creatives at load time, as well as low viewability scores,
The Ad.js Auto Render plugin delays the loading of the creative until the creative is in the viewport. This ensures that
the creatives only load when the visitor is ready to see them.

## Installation
Depending on your method of implementation, Ad.js packages may be installed via different methods.
Please follow the directions for your relevant method.

### NPM
If you have installed Ad.js via NPM the auto render package is available via an esmodule import.

__Example__:
```js
import AdJS from 'adjs';
import DFPNetwork from 'adjs/networks/DFP';

import AutoRender from 'adjs/plugins/AutoRender';

const page = new AdJS.Page(DFPNetwork, {
  plugins: [
    AutoRender,
  ]
});
```

### Script Tag
If you have installed Ad.js via a script tag, you will either need to ensure your bundle already
includes the Auto Render plugin (preferred) or include the auto render script in the header.

__Example__:
```html
<html>
  <head>
    <script src="https://unpkg.com/adjs@2.0.0-beta.2/umd/core.min.js"></script>
    <script src="https://unpkg.com/adjs@2.0.0-beta.2/umd/networks.DFP.min.js"></script>

    <script src="https://unpkg.com/adjs@2.0.0-beta.2/umd/plugins.AutoRender.js"></script>
  </head>
  <body>
    <script>
      const page = new AdJS.Page(AdJS.Networks.DFP, {
        plugins: [
          AdJS.Plugins.AutoRender
        ]
      });
    </script>
  </body>
</html>
```

## Options
The Auto Render Plugin adds two options to ad instantiation

|Option|Default|Description|
|---|---|---|
|autoRender|false|When set to true, Ad.js will automatically render the ad when it enters the viewport (plus the offset provided if any)|
|offset|0|A measurement in pixels or percentage that Ad.js will use to determine how far away from the viewport to load the ad|

## Examples

Configuration via Page (will affect all ads within the page)
```js
import AdJS from 'adjs';
import AutoRender from 'adjs/plugins/AutoRender';

const page = new AdJS.Page(Network, {
  plugins: [
    AutoRender,
  ],

  defaults: {
    autoLoad: true,
    offset: 0,
  }
});
```

Configuraton on an individual Ad
```js
import AdJS from 'adjs';
import AutoRender from 'adjs/plugins/AutoRender';

const page = new AdJS.Page(Network);

const ad = new page.createAd(el, {
  plugins: [
    AutoRender
  ],

  offset: -100,
  autoLoad: true,
});
``` 
