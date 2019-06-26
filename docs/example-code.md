### Example Code ###

This react example requires some sort of transpiler e.g. babel, typescript, etc.
See the [README](README.md) for alternative import solutions.

In this example, we will be using all of the `plugins` available and setting them at the bucket level.
It is important to note that for more granular control over each individual ad, it is recommended
that some of these `plugins` be added at a per ad level (`Sticky`, `AutoRefresh`, etc.).
Please see any of the plugins documentation in the [README](README.md) for ad level inclusion.


React.js will use this bucket singleton on init of the application:

__AdJsBucketSingleton.js__:
```js
import AdJS from 'adjs';
import DFPNetwork from 'adjs/Networks/DFP';
import DeveloperTools from 'adjs/Plugins/DeveloperTools';
import Sticky from 'adjs/Plugins/Sticky';
import AutoRender from 'adjs/Plugins/AutoRender';
import AutoRefresh from 'adjs/Plugins/AutoRefresh';
import Responsive from 'adjs/Plugins/Responsive';

const bucket = new AdJS.Bucket(DFPNetwork, {
  plugins: [
    AutoRender,
    AutoRefresh,
    DeveloperTools,
    Responsive,
    Sticky,
  ],
  defaults: {
    breakpoints: {
      mobile: { from: 0, to: 767 },
      tablet: { from: 768, to: 991 },
      desktop: { from: 992, to: 1199 },
      largeDesktop: { from: 1200, to: Infinity },
    },
    logging: true,
    overlay: true,
    refreshOnBreakpoint: true,
    autoRender: true,
    refreshRateInSeconds: 1000,
    offset: -100,
    targeting: { example: 'true' },
  }
});

export default bucket;

```

As well as a default ad configuration file:

__defaultAdConfiguration.js__:
```js
  export default {
    path: "/123456/sports",
    sizes: {
      mobile: [[300, 250], [300, 600]],
      tablet: [[300, 250], [300, 600]],
      desktop: [[300, 250], [300, 600], [360, 360], [360, 720]],
      largeDesktop: [[300, 250], [300, 600], [360, 360], [360, 720]],
    },
    refreshOnBreakpoint: true,
    targeting: { age: 30, gender: 'female' },
  }
```

Creating ads using the `AdJsBucketSingleton` and `defaultAdConfiguration`

__Ad.js Class Component__:
```js
import React, { Component } from 'react';
import bucket from './AdJsBucketSingleton';
import defaultOptions from './defaultAdConfiguration';

class Ad extends Component {
  constructor(props) {
    super(props);
    this.anchor = null;
  }

  componentDidMount() {
    this.createAd();
  }

  createAd = () => {
    const { options: optionOverrides } = this.props;
    const options = { ...defaultOptions, ...optionOverrides };
    bucket.createAd(this.anchor, options);
  }

  render() {
    // position and height required for ${StickyPlugin}
    const styles = { position: 'absolute', height: '2000px' };

    return <div style={styles} ref={anchor => { this.anchor = anchor }} />;
  }
}

export default Ad;

```

OR

__Ad.js Functional Component__:
```js
import React, { useRef, useLayoutEffect } from 'react';
import bucket from './AdJsBucketSingleton';
import defaultOptions from './defaultAdConfiguration';

const Ad = (props) => {
  const anchor = useRef(null);

  useLayoutEffect(() => {
    const options = { ...defaultOptions, ...props.options };

    bucket.createAd(anchor.current, options);
  });

  // position and height required for ${StickyPlugin}
  const styles = { height: '2000px', position: 'absolute' };

  return <div style={styles} ref={anchor} />;
}

export default Ad;


```

And then just create a new instance of the component

__parentContainer__:
```js
  import Ad from 'pathToComponent/Ad';

  <Ad {...this.props} />
```

### Vanilla Javascript Example ###
As long as your HTML elements exist on page load (SSR), this script at the root of your application
will fire and execute the ad creations.

This implemenation will fetch and execute without blocking
the render of your application. It also removes the requirement of 
bundling `ad.js` with your project -- relieving the need to redeploy with updates
to the npm package.

__src/ads.js__
```js
/*
  in markup
  
  <div data-ad-slot></div>
  <div data-ad-slot="banner"></div>
  <div data-ad-slot="sidebar"></div>

  Using values for ad-slot can allow you to customize overrides
  per ad type
*/

const script = document.createElement('script');
script.src = 'https://unpkg.com/adjs@latest/umd/bundle.development.js';
script.async = true;
script.defer = true;
script.onload = () => {
  const { DFP } = window._ADJS.Networks;
  const { AutoRender, AutoRefresh, Responsive, DeveloperTools, Sticky } = window[`_ADJS`].Plugins;

  const adContainers = document.querySelectorAll('[data-ad-slot]');

  const page = new window.AdJS.Page(DFP, {
    plugins: [AutoRender, AutoRefresh, DeveloperTools, Responsive],
    defaults: {
      breakpoints: {
        mobile: { from: 0, to: 767 },
        tablet: { from: 768, to: 1039 },
        desktop: { from: 1040, to: 1359 },
        largeDesktop: { from: 1360, to: Infinity },
      },
      autoRender: true,
      refreshRateInSeconds: 5000,
    },
  });

  Array.prototype.forEach.call(adContainers, elm => {
    /*
      this is where you can check for values in the ad-slot
      const { adType } = elm.dataset;
      page.createAd(elm, yourConfigurationFile.adConfigurationPerType[adType]);
    */

    page.createAd(elm, {
      path: '/123456/sports',
      plugins: [Sticky],
      sizes: {
        mobile: [],
        tablet: [],
        desktop: [[300, 250], [300, 600]],
        largeDesktop: [[300, 250], [300, 600]],
      },
    });
  });
}

document.head.appendChild(script);
```