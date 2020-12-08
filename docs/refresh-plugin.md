# Maximizing Impressions with AutoRefreshing Ads
Viewability is a binary metric. Your creative will either generate a "viewable impression" or a "non-viewable impression". The standard metric to determine whether an ad was Viewable is whether the ad was in the viewport of the browser for 2 seconds.

The AdJS refresh plugin helps you maximize your impressions per page by refreshing/fetching a new creative after your Ad has been considered as "viewed". By default the AutoRefresh Plugin will only refresh an Ad after 30 seconds of view time.

## Installation
Depending on your method of implementation, AdJS packages may be installed via different methods.
Please follow the directions for your relevant method.

### NPM
If you have installed AdJS via NPM the refresh package is available via an esmodule import.

__Example__:
```js
import AdJS from 'adjs';
import DFP from 'adjs/networks/DFP';

import AutoRefresh from 'adjs/plugins/AutoRefresh';

const page = new AdJS.Page(DFP, {
  plugins: [
    AutoRefresh,
  ]
});
```

### Script Tag
If you have installed AdJS via a script tag, you will either need to ensure your bundle already
includes the AutoRefresh plugin (preferred) or include the lazy load script in the header.

__Example__:
```html
<html>
  <head>
    <script src="https://unpkg.com/adjs@latest/umd/core.production.min.js"></script>
    <script src="https://unpkg.com/adjs@latest/umd/networks.dfp.production.min.js"></script>

    <script src="https://unpkg.com/adjs@latest/umd/plugins.autorefresh.production.min.js"></script>
  </head>
  <body>
    <script>
      const page = new AdJS.Page(AdJS.Networks.DFP, {
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
|refreshRateInSeconds|30|Duration the ad must be in view (in seconds) before refreshing the unit. 30 Seconds is recommended. If set to 0, the ad will not refresh|
|refreshLimit|null|Allows you to specify a maximum number of times the ad slot can be refreshed|
|refreshResetsCorrelator|false|If true, requests the network to reset the correlator when refreshing|

## Examples

Configuration via Page (will affect all ads within the page). It is common to implement refresh on a page level as your refresh strategy will usually be the same site wide.
```js
import AdJS from 'adjs';
import AutoRefresh from 'adjs/plugins/AutoRefresh';

const page = new AdJS.Page(Network, {
  plugins: [
    AutoRefresh,
  ],

  defaults: {
    refreshRateInSeconds: 30,
    refreshLimit: 3,
    refreshResetsCorrelator: false
  }
});
```

Configuraton on an individual Ad
```js
import AdJS from 'adjs';
import DFPNetwork from 'adjs/networks/DFP';

import AutoRefresh from 'adjs/plugins/AutoRefresh';

const page = new AdJS.Page(DFPNetwork);

const ad = new page.createAd(el, {
  plugins: [
    AutoRefresh
  ],

  refreshRateInSeconds: 30,
  refreshLimit: 3,
  refreshResetsCorrelator: false
});
``` 
