### React.Js Example ###

__Ad.js Component__:
```js
import React, { Component } from 'react';
import bucket from './AdJsBucketSingleton';
import defaultOptions from './defaultAdOptions';

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
    const styles = {
      background: `repeating-linear-gradient(45deg, white, black 10px, grey 30px)`,
      height: '2000px',
      position: 'absolute'
    };

    return <div style={styles} ref={anchor => { this.anchor = anchor }} />;
  }
}

export default Ad;


```

__AdJsBucketSingleton.js__:
```js
import AdJS from 'adjs';
import DFPNetwork from 'adjs/networks/DFP';
import Debug from 'adjs/plugins/Debug';
import Logging from 'adjs/plugins/Logging';
import Sticky from 'adjs/plugins/Sticky';
import AutoRender from 'adjs/plugins/AutoRender';
import AutoRefresh from 'adjs/plugins/AutoRefresh';
import Responsive from 'adjs/plugins/Responsive';

const bucket = new AdJS.Bucket(DFPNetwork, {
  plugins: [
    AutoRender,
    AutoRefresh,
    Debug,
    Logging,
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
    refreshOnBreakpoint: true,
    autoRender: true,
    refreshRateInSeconds: 1000,
    offset: -100,
    targeting: { example: 'true' },
  }
});

export default bucket;

```

__defaultAdOptions.js__:
```js

export default {
  path: "/sports/12345",
  sizes: {
    mobile: [
      [300, 250],
      [300, 600],
    ],
    tablet: [
      [300, 250],
      [300, 600],
    ],
    desktop: [
      [300, 250],
      [300, 600],
      [360, 360],
      [360, 720],
    ],
    largeDesktop: [
      [300, 250],
      [300, 600],
      [360, 360],
      [360, 720],
    ],
  },
  refreshOnBreakpoint: true,
  targeting: {
    age: 30,
    gender: 'female'
  },
}

```

__parentContainer__:
```js
  <Ad {...this.props} />
```
