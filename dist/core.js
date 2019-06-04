'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

// Event Bus Options
var Events;
(function (Events) {
    Events["CREATE"] = "create";
    Events["REQUEST"] = "request";
    Events["RENDER"] = "render";
    Events["REFRESH"] = "refresh";
    Events["DESTROY"] = "destroy";
    Events["FREEZE"] = "freeze";
    Events["UNFREEZE"] = "unfreeze";
    Events["CLEAR"] = "clear";
})(Events || (Events = {}));
var EVENTS = Events;

class AdJsError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message;
    }
}

function insertElement(tag, attributes = {}, elementToInsertInto, html) {
    const element = document.createElement(tag);
    Object.keys(attributes).forEach((key) => {
        const value = attributes[key];
        if (typeof value === 'boolean') {
            if (!value) {
                return;
            }
            element.setAttribute(key, key);
            return;
        }
        element.setAttribute(key, value);
    });
    if (typeof html === 'string') {
        element.innerHTML = html;
    }
    elementToInsertInto.appendChild(element);
    return element;
}

const seriallyResolvePromises = (promises) => promises.reduce((promiseChain, fn) => (promiseChain.then(() => fn())), Promise.resolve());

function uppercaseFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function nextId() {
    return `adjs-ad-container-`;
}
function validateSizes(configuration) {
    const { sizes, breakpoints } = configuration;
    if (!Array.isArray(sizes) && !breakpoints) {
        throw new AdJsError('Misconfiguration', 'Sizes must be of type `Array` unless breakpoints have been specified');
    }
}
// Define LifeCycle Method will automatically wrap each
// lifecycle with important items such as "queue" when frozen,
// awaiting bucket queues and implementing vendors
function attachAsLifecycleMethod(target, propertyName, propertyDescriptor) {
    const fn = propertyDescriptor.value;
    propertyDescriptor.value = async function (...args) {
        /*
         * If the ad unit is frozen push the call into a queue that
         * can be executed later
         */
        if (this.state.frozen) {
            const boundReplayFn = this[propertyName].bind(this, ...args);
            this.actionsReceivedWhileFrozen.push(boundReplayFn);
            return;
        }
        const hookName = uppercaseFirstLetter(propertyName);
        // e.g. beforeRender, onRender, afterRender, beforeRefresh
        const beforeHookName = `before${hookName}`;
        const onHookName = `on${hookName}`;
        const afterHookName = `after${hookName}`;
        // e.g. rendering, rendered
        const executingState = `${propertyName}ing`;
        const executedState = `${propertyName}ed`;
        // Has event already been called and currently executing?
        if (this.state[executingState]) {
            return;
        }
        /*
         * Has this render method already completed succesfully? Should we
         * allow for it to be executed again?
         */
        if (this.state[executedState] && propertyName !== 'refresh') {
            return;
        }
        /*
         * Lifecycle methods are not idempotent, make sure that multiple
         * calls to a method do not execute multiple times
         */
        this.state[executingState] = true;
        /*
         * Queue up the lifecycle method's execution to ensure all bucket async tasks
         * have completed and that it executes in order.
         *
         * e.g. if ad.render() is called before ad.destroy(), ensure ad.render()
         *      completes before executing ad.destroy().
         */
        await this.onReady(async () => {
            this.emit(propertyName, 'before');
            await this.callPlugins(beforeHookName);
            const executionOfFn = fn.apply(this, args);
            const executionOfPlugins = this.callPlugins(onHookName);
            this.emit(propertyName, 'on');
            await Promise.all([executionOfFn, executionOfPlugins]);
            await this.callPlugins(afterHookName);
            this.state[executingState] = false;
            this.state[executedState] = true;
            this.emit(propertyName, 'after');
        });
    };
    return propertyDescriptor;
}
class Ad {
    constructor(bucket, el, localConfiguration) {
        this.bucket = bucket;
        this.state = {
            creating: false,
            created: false,
            rendering: false,
            rendered: false,
            refreshing: false,
            refreshed: false,
            clearing: false,
            cleared: false,
            destroying: false,
            destroyed: false,
            frozen: false,
        };
        this.actionsReceivedWhileFrozen = [];
        this.plugins = [];
        this.localVendors = [];
        this.promiseStack = Promise.resolve();
        // Event Queue
        this.events = {
            before: {},
            on: {},
            after: {},
        };
        /*
         * Add the parent buckets promise chain onto each Ad instance's
         * promise chain to ensure that any async actions the parent bucket
         * makes (e.g. Krux) are completed before allowing a lifecycle
         * method (e.g. render) to execute
         */
        this.promiseStack = this.promiseStack.then(() => this.bucket.promiseStack);
        this.configuration = Object.assign({}, this.bucket.defaults, localConfiguration);
        this.container = insertElement('div', { style: 'position: relative; display: inline-block;' }, el);
        this.el = insertElement('div', { id: nextId() }, this.container);
        validateSizes(this.configuration);
        // Merge Locally Provided Plugins for this ad with Plugins that are specified on the Bucket
        const plugins = [...this.bucket.plugins];
        if (localConfiguration && localConfiguration.plugins) {
            plugins.push(...localConfiguration.plugins);
        }
        // Instantiate all class based plugins and reference them
        this.attachPlugins(plugins);
        const executionOfPlugins = this.callPlugins('beforeCreate');
        this.onReady(async () => {
            await executionOfPlugins;
            await Promise.all([
                this.networkInstance = this.network.createAd(this),
                this.callPlugins('onCreate'),
            ]);
            await this.callPlugins('afterCreate');
        });
    }
    get network() {
        return this.bucket.network;
    }
    get slot() {
        return this.networkInstance.slot;
    }
    get vendors() {
        return [
            ...this.bucket.vendors,
            ...this.localVendors,
        ];
    }
    // onReady will queue up additional execution calls to onReady
    // ensuring that commands called in sequence will in fact be executed
    // in sequence.
    //
    // Example:
    // ---
    //  ad.render();
    //  ad.destroy();
    //
    //  destroy must always happen after render has completed.
    //
    onReady(fn) {
        let externalResolve;
        let externalReject;
        const promiseMonitor = new Promise((resolve, reject) => {
            externalResolve = resolve;
            externalReject = reject;
        });
        this.promiseStack = this.promiseStack.then(async () => {
            try {
                await fn();
                externalResolve();
            }
            catch (e) {
                externalReject(e);
            }
        });
        return promiseMonitor;
    }
    async render() {
        await this.bucket.setAsActive();
        await this.networkInstance.render();
    }
    async refresh() {
        await this.bucket.setAsActive();
        if (typeof this.networkInstance.refresh !== 'undefined') {
            await this.networkInstance.refresh();
        }
        else {
            console.warn(`
 Network does not support ad refreshing natively.
Destroying and Recreating the ad. Make sure this is what you intended.
      `);
            await this.networkInstance.destroy();
            this.networkInstance = this.network.createAd(this);
            await this.networkInstance.render();
        }
        this.state.rendered = true;
    }
    async clear() {
        await this.networkInstance.clear();
        this.state.rendered = false;
    }
    async destroy() {
        await this.networkInstance.destroy();
    }
    freeze() {
        if (this.state.frozen) {
            return;
        }
        this.emit(EVENTS.FREEZE, 'before');
        this.state.frozen = true;
        this.emit(EVENTS.FREEZE, 'on');
        this.emit(EVENTS.FREEZE, 'after');
    }
    async unfreeze(options = {}) {
        if (!this.state.frozen) {
            return;
        }
        this.emit(EVENTS.UNFREEZE, 'before');
        // unfreeze is the exception to the evented workflow because if it were
        // enqueued, it would be pushed to the end of the queue (after backlogged
        // events). Thus, leaving the ad in a limbo state. As such, we must bypass
        // the queue for this event.
        this.state.frozen = false;
        const actions = this.actionsReceivedWhileFrozen;
        this.actionsReceivedWhileFrozen = [];
        // processes backlogged events in queue on('unfreeze')
        if (options.replayEventsWhileFrozen) {
            // TODO
            this.onReady(() => seriallyResolvePromises(actions));
        }
        this.emit(EVENTS.UNFREEZE, 'on');
        this.emit(EVENTS.UNFREEZE, 'after');
    }
    on(key, fn) {
        this.attachEvent(key, fn, 'on');
    }
    before(key, fn) {
        this.attachEvent(key, fn, 'before');
    }
    after(key, fn) {
        this.attachEvent(key, fn, 'after');
    }
    // You really shouldn't await this, but it's useful to know
    // when all of the binded events have fired
    async emit(key, lifecycleTiming = 'on') {
        const events = this.events[lifecycleTiming][key];
        if (!events) {
            return;
        }
        await Promise.all(events.map((event) => event(this)));
    }
    attachEvent(key, fn, event = 'on') {
        if (!this.events[event][key]) {
            this.events[event][key] = [];
        }
        this.events[event][key].push(fn);
    }
    attachPlugins(plugins) {
        this.plugins = plugins.map((Plugin) => {
            if (typeof Plugin === 'function') {
                return new Plugin(this);
            }
            return Plugin;
        });
    }
    // TODO Figure out type
    callPlugins(hook) {
        return Promise.all(this.plugins.map(async (plugin) => {
            const hookFn = plugin[hook];
            if (typeof hookFn === 'function') {
                await hookFn.call(plugin, this);
            }
        }));
    }
}
__decorate([
    attachAsLifecycleMethod
], Ad.prototype, "render", null);
__decorate([
    attachAsLifecycleMethod
], Ad.prototype, "refresh", null);
__decorate([
    attachAsLifecycleMethod
], Ad.prototype, "clear", null);
__decorate([
    attachAsLifecycleMethod
], Ad.prototype, "destroy", null);

class Bucket {
    constructor(network, providedConfiguration = {}) {
        this.network = network;
        this.ads = [];
        this.promiseStack = Promise.resolve();
        this.plugins = [];
        this.vendors = [];
        this.defaults = {};
        const { defaults, plugins, vendors } = providedConfiguration;
        if (defaults) {
            this.defaults = defaults;
        }
        if (plugins) {
            this.plugins = plugins;
        }
        if (vendors) {
            this.vendors = vendors;
        }
    }
    Ad(el, options) {
        return this.createAd(el, options);
    }
    createAd(el, options) {
        const ad = new Ad(this, el, options);
        this.ads.push(ad);
        return ad;
    }
    get correlatorId() {
        const { correlatorId } = this.ads[0];
        return correlatorId;
    }
    async setAsActive() {
        if (!this.correlatorId || AdJS.activeCorrelatorId === this.correlatorId) {
            return;
        }
        this.ads.forEach((ad) => {
            ad.clear();
        });
        await this.network.resetCorrelator();
    }
}

const isServer = () => typeof window === 'undefined';

const LOADED_MODULES = {
    Plugins: {},
    Networks: {},
    Vendors: {},
};
const _ADJS = isServer() ? LOADED_MODULES : window._ADJS = window._ADJS || LOADED_MODULES;
_ADJS.Plugins = _ADJS.Plugins || LOADED_MODULES.Plugins;
_ADJS.Vendors = _ADJS.Vendors || LOADED_MODULES.Vendors;
_ADJS.Networks = _ADJS.Networks || LOADED_MODULES.Networks;
const PluginsHandler = {
    get(plugins, property) {
        const cleanedProperty = String(property);
        if (isServer()) {
            if (typeof property === 'symbol') {
                return {};
            }
            throw new Error(`
Using the Networks or Plugins property on AdJS is only available when installing via script.
If you are compiling the AdJS library locally within your project, use require to
specify the plugin directly.

Example:
  import DFP from 'adjs/networks/DFP';
  import AutoRender from 'adjs/plugins/AutoRender';

  new AdJS.Bucket(DFP, {
    plugins: [
      AutoRender,
    ],
  });
      `);
        }
        if (!plugins[cleanedProperty]) {
            throw new Error(`
The ${cleanedProperty} Plugin or Network has not been included in your bundle. Please
manually include the script tag associated with this plugin or network. You can see
documentation on https://adjs.dev.

Example:
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
      `);
        }
        return plugins[cleanedProperty];
    },
};
const Plugins = new Proxy(_ADJS.Plugins, PluginsHandler);
const Networks = new Proxy(_ADJS.Networks, PluginsHandler);
const Vendors = new Proxy(_ADJS.Vendors, PluginsHandler);
const AdJS = {
    Bucket,
    Plugins,
    Networks,
    Vendors,
    activeCorrelatorId: null,
};

module.exports = AdJS;
