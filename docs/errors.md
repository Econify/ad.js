# Common Errors

## Code 1: Networks/Plugins Used Without Script Installation

Using the Networks or Plugins property on AdJS is only available when installing via script. If you are compiling the AdJS library locally within your project, use `require` to specify the plugin directly.

Example:

```js
  import DFP from 'adjs/networks/DFP';
  import AutoRender from 'adjs/plugins/AutoRender';

  new AdJS.Bucket(DFP, {
    plugins: [
      AutoRender,
    ],
  });
```

## Code 2: Missing Plugin/Network

The Plugin or Network has not been included in your bundle. Please manually include the script tag associated with this plugin or network. You can see documentation on https://adjs.dev.

Example:

```html
  <script src="https://cdn.adjs.dev/core.min.js"></script>
  <script src="https://cdn.adjs.dev/DFP.min.js"></script>
  <script src="https://cdn.adjs.dev/AutoRender.min.js"></script>

  <script>
    new AdJS.Bucket(AdJS.Networks.DFP, {
      plugins: [
        AdJS.Plugins.AutoRender,
      ],
    });
  </script>
```

## Code 3: No Ad Passed Into Generic Plugin

An ad must be passed into the GenericPlugin class. If your Plugin inherits from GenericPlugin and overrides the constructor, make sure you are calling `super` and that you are passing in an instance of an ad as the first parameter. Alternatively, you can hook into the `onCreate` method which gets called by the constructor.

Example:

```js
  class ExamplePlugin extends GenericPlugin {
    onCreate() {
      console.log('Example Plugin Started Succesfully');
    }
  }

  // Or

  class ExamplePlugin extends GenericPlugin {
    constructor(ad) {
      super(ad);

      console.log('Example Plugin Started Succesfully');
    }
  }
```

## Codes 4-7: Ad Configuration Errors

### No ID

The ad does not have an id.

### No Size

The ad does not have any sizes. Sizes must be defined.

### No Path

The ad does not have a path. An ad's path must be defined.

## Wrong Size type

Unless breakpoints are specified, ad sizes must be of type "Array."
