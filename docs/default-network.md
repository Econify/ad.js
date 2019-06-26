# Test Network
The default provider in Ad.js is what most providers inherit from. At its core it is an [interface of noops](https://github.com/Econify/ad.js/blob/master/src/networks/Noop.ts). Use the default provider while you’re in development mode or on an environment that should not make requests to your actual ad platform.

## Installation
Depending on your method of implementation, Ad.js packages may be installed via different methods.
Please follow the directions for your relevant method.

### NPM
If you have installed Ad.js via NPM the test network is available via an esmodule import.

__Example__:
```js
import AdJS from 'adjs';
import TestNetwork from 'adjs/Networks/Noop';

const page = new AdJS.Page(TestNetwork);
```

### Script Tag
If you have installed Ad.js via a script tag, you will either need to ensure your bundle already
includes the Noop or Test Network or include the network script in the header.

__Example__:
```html
<html>
  <head>
    <script src="https://unpkg.com/adjs@latest/umd/core.production.min.js"></script>
    <script src="https://unpkg.com/adjs@latest/umd/networks.noop.production.min.js"></script>
  </head>
  <body>
    <script>
      const page = new AdJS.Page(AdJS.Networks.Noop);
    </script>
  </body>
</html>
```

## Arguments
The test network is a singleton and as such does not accept arguments or instatiation.

## Additional Options
The default network does not add any configuration options to Ad Options.
