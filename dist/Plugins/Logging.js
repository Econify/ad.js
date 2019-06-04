'use strict';

class AdJsError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message;
    }
}

class GenericPlugin {
    get name() {
        return this.constructor.name;
    }
    constructor(ad) {
        if (!ad) {
            throw new AdJsError('Misconfiguration', `
An ad must be passed into the GenericPlugin class. If your Plugin inherits from GenericPlugin
and overrides the constructor make sure you are calling "super" and that you are passing in an
instance of an ad as the first parameter. Alternatively, you can hook into the onCreate method
which gets called by the constructor.

Example:
\`` `js
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
        \`` `	   `);
        }
        this.ad = ad;
    }
}

const BASE_MESSAGE = '[DEBUG]';
let adId = 0;
class LoggingPlugin extends GenericPlugin {
    onCreate() {
        const id = ++adId;
        window[`ad${id}`] = this.ad;
        console.log(BASE_MESSAGE, 'Ad Instantiated and assigned as', `window.ad${adId}`);
    }
    beforeRender() {
        console.log(BASE_MESSAGE, 'Render has been called on ad.');
    }
    onRender() {
        console.log(BASE_MESSAGE, 'Ad actively rendering.');
    }
    afterRender() {
        console.log(BASE_MESSAGE, 'Ad render has completed.');
    }
    beforeRefresh() {
        console.log(BASE_MESSAGE, 'Refresh has been called on ad.');
    }
    onRefresh() {
        console.log(BASE_MESSAGE, 'Ad actively refreshing.');
    }
    afterRefresh() {
        console.log(BASE_MESSAGE, 'Ad refresh has completed.');
    }
    beforeClear() {
        console.log(BASE_MESSAGE, 'Clear has been called on ad.');
    }
    onClear() {
        console.log(BASE_MESSAGE, 'Ad actively clearing.');
    }
    afterClear() {
        console.log(BASE_MESSAGE, 'Ad clear has completed.');
    }
    beforeDestroy() {
        console.log(BASE_MESSAGE, 'Destroy has been called on ad.');
    }
    onDestroy() {
        console.log(BASE_MESSAGE, 'Ad actively destroying.');
    }
    afterDestroy() {
        console.log(BASE_MESSAGE, 'Ad destroy has completed.');
    }
}

module.exports = LoggingPlugin;
