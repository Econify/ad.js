# Interacting with Ad.js
There are four methods for you to get a reference to your ad for interaction with the methods below.

1. Assigning to variable:  `const bannerAd = new page.Ad(el, 'banner');`
2. Lookup via SlotID:  `page.find('banner')`
3. Lookup via Element:`page.find(DOMElement)`
4. Lookup via instances array:`page.instances[0]`

## Lifecycle
Once your ad has been created, Ad.js provides you a functional interface to interact and control your ads.

A typical ad lifecycle goes:

1. Create
2. Request
3. Render
4. Complete
5. Destroy

If your ad is refreshed (and your provider supports ad refresh), a typical lifecycle may look more like:

1. Create
2. Request
3. Render
4. Complete
5. Refresh
6. Request
7. Render
8. Complete

## Actions
Even though most Ad lifecycle actions require network requests and are therefore asynchronous, Ad.js interfaces are synchronous. When async methods are still pending, Ad.js will automatically queue up your action and replay them in the order received. Because of this code like this is safe!

```js
    const ad = page.find('banner');
    
    ad.on('render', () => {
      console.log('render');
    });
    
    ad.on('destroy', () => {
      console.log('destroy');
    });
    
    ad.on('refresh', () => {
      console.log('refresh');
    });
    
    ad.render();
    ad.refresh();
    ad.destroy();
    
    // console.log 'render'
    // console.log 'refresh'
    // console.log 'destroy'
```

However should you want to link into the completion of the action you invoke, the actions return their promise in the chain. Example:

```js
    const ad = new page.Ad(el, page: { 'slot1' });
    
    ad.render()
      .then(() => console.log('rendered'));
```

### Render
Whether you have set autoRender to false or you need to explicitly render at a specific point Ad.js provides you with a render method. Simply call render() to force render an ad that has not yet been rendered. Note: Calling render on an already rendered Ad is a noop, however calling render on an ad that has been cleared will render a new ad.

```js
    const ad = new page.Ad(el, { slot: 'ad1' });
    
    ad.render();
```

### Refresh
Similar to Render, refresh can explicitly be called at any time regardless of you setting “autoRefresh”. Refresh can even be called if an ad hasn’t been rendered yet and will act as the initial render. This makes refresh a safe option to use if you want to put a new ad in regardless of whether or not an ad already has been rendered in a slot.

### Clear
Clear will remove the ad from the screen, clear out any existing timers and pause all life cycle events. You can call render or refresh to have the ad render again.

### Destroy
Destroy will remove all listeners, events and actions from the ad including disassociating the slot id. Once destroy is called all history of the ad existing is removed and marked for garbage collection. You must create a brand new ad if you’d like to render an ad in that position.

### Freeze
Freeze will hold all actions to an ad and pause all timers for refresh. Calling any action while an ad is frozen will go into a queue. You can decide whether to replay this queue upon unfreeze or to disregard it. If an ad has been rendered it will remain rendered upon freeze.

### Unfreeze
Unfreeze will remove an ad from a frozen state and resume timers. Unfreeze takes a single parameter instructing Ad.js whether to play all actions the ad has received while paused. The default for this param is false. Example:

```js
    const ad = new page.Ad(el, { slot: 'adtobefrozen' });
    
    ad.freeze();
    ad.render(); // does nothing
    ad.unfreeze(); // ad still does not have a render
    
    ad.freeze();
    ad.render(); // does nothing
    ad.unfreeze({ replayEventsWhileFrozen: true }); // calls render 
```

## Subscribing to Events
Every ad in enigma contains an event bus for you to monitor and interact with the ad specifically. TODO @Stephen B fill out event bus meanings. Example:

```js
    import EVENTS from 'adjs/Events';
    
    const ad = new page.Ad(el, options);
    ad.on(EVENTS.RENDER, function (event) {
     console.log('rendered into', this, 'because of', event);
    });
```

In addition to all of the events in the lifecycle being subscribable, the following events are subscribable as well:

- Breakpoint Change (`on('breakpoint', () => {})`)

