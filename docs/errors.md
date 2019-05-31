# Common Errors

## <div id="1">Networks/Plugins Used Without Script Installation</div>

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

## <div id="2">Missing Plugin/Network</div>

The Plugin or Network has not been included in your bundle. Please manually include the script tag associated with this plugin or network.

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

## <div id="3">No Ad Passed Into Generic Plugin</div>

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

      console.log('Example Plugin Started Successfully');
    }
  }
```

## Codes 4-7: Ad Configuration Errors

### <div id="4">No ID</div>

The ad does not have an id.

### <div id="5">No Size</div>

The ad does not have any sizes. Sizes must be defined.

### <div id="6">No Path</div>

The ad does not have a path. An ad's path must be defined.

## <div id="7">Wrong Size type</div>

Unless breakpoints are specified, ad sizes must be of type "Array."
