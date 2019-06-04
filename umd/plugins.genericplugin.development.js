this._ADJS = this._ADJS || {};
this._ADJS.Plugins = this._ADJS.Plugins || {};
this._ADJS.Plugins.GenericPlugin = (function () {
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

return GenericPlugin;

}());
//# sourceMappingURL=plugins.genericplugin.development.js.map
