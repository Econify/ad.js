'use strict';

// Determine whether number is inbetween a set of numbers
const isBetween = (value, a, b) => value >= Math.min(a, b) && value <= Math.max(a, b);

/**
 * @param {function} cb Callback to be executed post timed throttle
 * @param {number} customDelay Time in Milliseconds
 */
let previousCall = 0;
var throttle = (cb, customDelay) => {
    const delay = customDelay || 200;
    const currentTime = new Date().getTime();
    if (currentTime - previousCall <= delay) {
        return;
    }
    previousCall = currentTime;
    return cb();
};

class Error extends Error {
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
            throw new Error('Misconfiguration', `
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

class ResponsivePlugin extends GenericPlugin {
    constructor() {
        super(...arguments);
        this.currentConfines = {};
        this.EVENT_KEY = 'resize';
        this.THROTTLE_DURATION = 250;
    }
    beforeCreate() {
        if (this.isRefreshDisabled()) {
            return;
        }
        this.determineCurrentBreakpoint();
        this.listener = () => {
            throttle(() => {
                const { from = 0, to = 1 } = this.currentConfines;
                if (isBetween(window.innerWidth, from, to)) {
                    return;
                }
                this.determineCurrentBreakpoint();
                this.ad.refresh();
            }, this.THROTTLE_DURATION);
        };
        window.addEventListener(this.EVENT_KEY, this.listener);
    }
    beforeClear() {
        window.removeEventListener(this.EVENT_KEY, this.listener);
    }
    beforeDestroy() {
        window.removeEventListener(this.EVENT_KEY, this.listener);
    }
    determineCurrentBreakpoint() {
        const { breakpoints } = this.ad.configuration;
        let breakpointSpecifiedForViewWidth = false;
        if (!breakpoints) {
            return;
        }
        Object.keys(breakpoints).forEach((key) => {
            const { from, to } = breakpoints[key];
            if (isBetween(window.innerWidth, from, to)) {
                breakpointSpecifiedForViewWidth = true;
                this.currentConfines = { from, to };
            }
        });
        if (!breakpointSpecifiedForViewWidth) {
            this.currentConfines = {};
        }
    }
    isRefreshDisabled() {
        const { configuration } = this.ad;
        return (configuration.hasOwnProperty('refreshOnBreakpoint') && !configuration.refreshOnBreakpoint);
    }
}

module.exports = ResponsivePlugin;
