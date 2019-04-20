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
The Ad.js Lazy Load plugin delays the loading of the creative until the creative is in the viewport. This ensures that
the creatives only load when the visitor is ready to see them.

## Installation
Depending on your method of implementation, Ad.js packages may be installed via different methods.
Please follow the directions for your relevant method.

### NPM
If you have installed Ad.js via NPM the lazy load package is available via an esmodule import.

__Example__:
```js
import AdJS from 'adjs';
import LazyLoad from 'adjs/plugins/LazyLoad';

const bucket = new AdJS(Network, {
  plugins: [
    LazyLoad,
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
    <script src="https://cdn.econify.com/adjs.base.js"></script>
    <script src="https://cdn.econify.com/adjs.lazyload.plugin.js"></script>
  </head>
  <body>
    <script>
      const bucket = new AdJS(Network, {
        plugins: [
          AdJSPlugins.LazyLoad
        ]
      });
    </script>
  </body>
</html>
```

## Options
The Lazy Load Plugin adds two options to ad instantiation

|Option|Default|Description|
|---|---|---|
|autoLoad|false|When set to true, Ad.js will automatically load the ad when it enters the viewport (plus the offset provided if any)|
|offset|0|A measurement in pixels or percentage that Ad.js will use to determine how far away from the viewport to load the ad|

## Examples

Configuration via Bucket (will affect all ads within the bucket)
```js
import AdJS from 'adjs';
import LazyLoad from 'adjs/plugins/LazyLoad';

const bucket = new AdJS(Network, {
  plugins: [
    LazyLoad,
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
import LazyLoad from 'adjs/plugins/LazyLoad';

const bucket = new AdJS(Network);

const ad = new bucket.createAd(el, {
  plugins: [
    LazyLoad
  ],

  offset: -100,
  autoLoad: true,
});
``` 
