### Example Code ###

Both of these examples will require some sort of transpiler e.g. babel, typescript, etc.
See the [README](README.md) for alternative import solutions.

In this example, we will be using all of the `plugins` available and setting them at the bucket level.
It is important to note that for more granular control over each individual ad, it is recommended
that some of these `plugins` be added at a per ad level (`Sticky`, `AutoRefresh`, etc.).
Please see any of the plugins documentation in the [README](README.md) for ad level inclusion.


Both vanilla javascript and react.js will use this bucket singleton on init of the application:

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
    path: "/sports/12345",
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

### React.Js Example ###

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

__createAd.js__:
```js
  import bucket from './AdJsBucketSingleton';
  import defaultOptions from './defaultAdConfiguration';

  const createAd = (targetElement, options = null) => {
    bucket.createAd(targetElement, { ...defaultOptions, ...options }); 
  }
```

__script.js__ Fired on load:
```js
  import createAd from './pathToCreateAd.js'

  const elm = document.getElementById('my-ad-target-1');
  createAd(elm, {})
```