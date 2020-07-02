# DFP Network (GPT Abstraction)
The DFP network is the most commonly used network in production as DFP is the most used ad platform at the time of this being written. Underneath the hood the DFP network utilizes GPT to communicate with DFP.

## Installation
Depending on your method of implementation, AdJS packages may be installed via different methods.
Please follow the directions for your relevant method.

### NPM
If you have installed AdJS via NPM the test network is available via an esmodule import.

__Example__:
```js
import AdJS from 'adjs';
import DFPNetwork from 'adjs/networks/DFP';

const page = new AdJS.Page(DFPNetwork);
```

### Script Tag
If you have installed AdJS via a script tag, you will either need to ensure your bundle already
includes the Noop or Test Network or include the network script in the header.

__Example__:
```html
<html>
  <head>
    <script src="https://unpkg.com/adjs@latest/umd/core.production.min.js"></script>
    <script src="https://unpkg.com/adjs@latest/umd/networks.dfp.production.min.js"></script>
  </head>
  <body>
    <script>
      const page = new AdJS.Page(AdJS.Networks.DFP);
    </script>
  </body>
</html>
```

## Arguments
The DFP network is a singleton and takes no arguments

## Additional Ad Options
The DFP network adds one required argument to Ad Options

- path<String> - ad unit path for ad that will be created. If the optional arugment was provided to the DFP provider during configuration, the value passed here will be prefixed with that value

## Examples

__Using Standard Sizes__
```js
const AdJS = require('adjs');
const DFPNetwork = require('adjs/networks/dfp');

const page = new AdJS.Page(DFPNetwork);

const ad = new page.Ad(el, {
  path: '/example/adunit/path',

  targeting: {
    age: 30,
    gender: 'female'
  },

  sizes: [
    [300, 250],
  ]
});
```

__Using Breakpoints__
```js
const AdJS = require('adjs');
const DFPNetwork = require('adjs/networks/dfp');

const page = new AdJS.Page(DFPNetwork, {
  plugins: [
    require('adjs/plugins/responsive')
  ],

  breakpoints: {
    mobile: { from: 0, to: 575 },
    tablet: { from: 576, to: 768 },
    laptop: { from: 769, to: 991 },
    desktop: { from: 992 },
  }
});

const ad = new page.Ad(el, {
  path: '/example/adunit/path',

  targeting: {
    age: 30,
    gender: 'female'
  },

  sizes: {
    mobile: [],

    tablet: [
      [1, 1]
    ],

    laptop: [
      [300, 250]
    ],

    desktop: [
      [300, 250],
      [300, 600]
    ],
  }
});
```


__Using Collapsible Ads__
```js
const AdJS = require('adjs');
const DFPNetwork = require('adjs/networks/dfp');

const page = new AdJS.Page(DFPNetwork);

const ad = new page.Ad(el, {
  path: '/example/adunit/path',

  targeting: {
    age: 30,
    gender: 'female'
  },

  sizes: [
    [300, 250],
  ],

  collapsible: true,
});
```
