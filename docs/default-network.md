# Default Network
The default provider in Ad.js is what most providers inherit from. At its core it is an interface of noops (link). Use the default provider while you’re in development mode or on an environment that should not make requests to your actual ad platform.

## Arguments
No arguments are required for the default network.

## Additional Options
The default network does not add any configuration options to Ad Options.

## Examples

```js
    const bucket = new AdJS.Bucket({
      network: AdJS.Networks.Default,
    });
```
