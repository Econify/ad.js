# Maximizing Impressions with AutoRefreshing Ads
Viewability is a binary metric. Your creative will either generate a "viewable impression" or a "non-viewable impression". The standard metric to determine whether an ad was Viewable is whether the ad was in the viewport of the browser for 2 seconds.

The Ad.js refresh plugin helps you maximize your impressions per page by refreshing/fetching a new creative after your Ad has been considered as "viewed". By default the AutoRefresh Plugin will only refresh an Ad after 30 seconds of view time.

## Installation
Depending on your method of implementation, Ad.js packages may be installed via different methods.
Please follow the directions for your relevant method.

### NPM
If you have installed Ad.js via NPM the refresh package is available via an esmodule import.

__Example__:
```js
import AdJS from 'adjs';
import AutoRefreshPlugin from 'adjs/plugins/AutoRefresh';

const bucket = new AdJS.Bucket(Network, {
  plugins: [
    AutoRefreshPlugin,
  ]
});
```

### Script Tag
If you have installed Ad.js via a script tag, you will either need to ensure your bundle already
includes the AutoRefresh plugin (preferred) or include the lazy load script in the header.

__Example__:
```html
<html>
  <head>
    <script src="https://unpkg.com/adjs@2.0.0-alpha.3/umd/core.min.js"></script>
    <script src="https://unpkg.com/adjs@2.0.0-alpha.3/umd/networks.DFP.min.js"></script>

    <script src="https://unpkg.com/adjs@2.0.0-alpha.3/umd/plugins.AutoRefresh.min.js"></script>
  </head>
  <body>
    <script>
      const bucket = new AdJS.Bucket(AdJS.Networks.DFP, {
        plugins: [
          AdJS.Plugins.AutoRefresh
        ]
      });
    </script>
  </body>
</html>
```

## Options
The AutoRefresh Plugin adds two options to ad instantiation

|Option|Default|Description|
|---|---|---|
|refreshInterval|30000|Duration the ad must be in view (in ms) before refreshing the unit. 30 Seconds is recommended. If set to 0, the ad will not refresh|
|refreshLimit|null|Allows you to specify a maximum number of times the ad slot can be refreshed|

## Examples

Configuration via Bucket (will affect all ads within the bucket). It is common to implement refresh on a bucket level as your refresh strategy will usually be the same site wide.
```js
import AdJS from 'adjs';
import AutoRefresh from 'adjs/plugins/AutoRefresh';

const bucket = new AdJS(Network, {
  plugins: [
    AutoRefresh,
  ],

  defaults: {
    refreshInterval: 30000,
    refreshLimit: 3
  }
});
```

Configuraton on an individual Ad
```js
import AdJS from 'adjs';
import DFPNetwork from 'adjs/networks/DFP';

import AutoRefreshPlugin from 'adjs/plugins/AutoRefresh';

const bucket = new AdJS(DFPNetwork);

const ad = new bucket.createAd(el, {
  plugins: [
    AutoRefreshPlugin
  ],

  refreshInterval: 30000,
  refreshLimit: 3
});
``` 
