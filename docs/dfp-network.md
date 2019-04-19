# DFP Network (GPT Abstraction)
The DFP network is the most commonly used network in production as DFP is the most used ad platform at the time of this being written. Underneath the hood the DFP network utilizes GPT to communicate with DFP.

## Arguments
The DFP network has one optional argument
- string? - base path for `adUnitPath`  arguments to append to. For example if your site is bucketing all ads under an ad unit segment, you can save the repetition of passing that ad path in to all ad units.

## Additional Options
The DFP network adds one required argument to Ad Options

- adUnitPath<String> - ad unit path for ad that will be created. If the optional arugment was provided to the DFP provider during configuration, the value passed here will be prefixed with that value

## Examples

```js
    new AdJS.Bucket({
      provider: AdJS.Networks.DFP,
    });
    
    const ad = new bucket.Ad(el, {
      slot: "exampleAd",
      adUnitPath: "/banner",
    });
```


