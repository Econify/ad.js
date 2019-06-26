# Rolling your own Network Interface
If you are interacting with an ad platform that is not part of the official Ad.js library, you can create a custom provider. It is recommended that your custom provider inherit from the Ad.js “default provider” to make sure that you avoid missing any interface methods. Even if you choose not to inherit from `Default` it is beneficial to view the source of `Default` (link) and `DFP` (link) as an example.

Example Custom Provider:

```js
import TestNetwork from 'adjs/Networks/Noop';
import loadScript from 'adjs/utils/loadScript'; // THIS DOESN'T EXIST IN THE BUNDLE

class ExampleCustomProvider extends TestNetwork {
  static optionalParams = [];
  static requiredParams = ['adPath'];
  
  id = null;
  url = null;
  
  constructor({ id, url }) {
    super(true); // Important to pass true
      
    if (!id) {
      throw new Error("ID is a required field");
    }
    
    if (!url) {
      throw new Error("URL is a required field");
    }
    
    this.id = id;
    this.url = url;
    
    loadScript('https://cdn.econify.com/dfp.js');
  }
  
  create(el, props, EventTrigger) {
    super(props); // this will do type checking
    const { adPath } = props;

    const ad = window.exampleLibrary.createAd({ el, adPath })
                .then((id) => {
                  EventTrigger.rendered();
                  return { id, adPath };
                });
                
    Events.requested();
    
    return ad;
  }
  
  async destroy(ad, EventTrigger) {
    EventTrigger.destroying();
    await window.exampleLibrary.destroyAd(ad.id);
    EventTrigger.destroyed();
  }
} 
```

