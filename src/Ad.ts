// @flow

import { NetworkInterface } from './NetworkTypes';
import { PluginInterface } from './PluginTypes';

type GlobalConfiguration = {
  network: NetworkInterface,
  plugins: Array<PluginInterface>,

  defaults?: AdConfiguration,
}

type AdConfiguration = {
  adPath: string,

  targeting?: object,
  sizes?: Array<any>,

  offset?: number,

  autoRender?: boolean,

  autoRefresh?: boolean,
  refreshRate?: number,

  refreshOnBreakpoint?: boolean,
  breakpoints?: Array<number>,
};

// Private Keys
const PRIVATE = {
  configuration: Symbol('@@Ad/configuration'),
  instances: Symbol('@@Ad/instances'),
  validateParameters: Symbol('@@Ad/validateParameters'),

  state: Symbol('@@Ad/state'),
  ready: Symbol('@@Ad/ready'),
  events: Symbol('@@Ad/events'),
  ad: Symbol('@@Ad/ad'),
  emit: Symbol('@@Ad/emit'),
  network: Symbol('@@Ad/network'),

  onInViewport: Symbol('@@Ad/onInViewport'),
  onBreakpointChange: Symbol('@@Ad/onBreakpointChange'),

  generateID: Symbol('@@Ad/generateID'),

  isReady: Symbol('@@Ad/isReady'),
  isConfigured: Symbol('@@Ad/isConfigured'),
};

// Event Bus Options
export const EVENTS: { [key: string]: string} = {
  CREATED: 'created',

  REQUEST: 'request',
  REQUESTED: 'requested',

  RENDER: 'render',
  RENDERED: 'rendered',

  REFRESH: 'refresh',
  REFRESHED: 'refreshed',

  DESTROY: 'destroy',
  DESTROYED: 'destroyed',
};

const seriallyResolvePromises = (promises: Array<Promise<void>>): Array<Promise<void>> => {
  return promises.reduce((promise, fn = Promise.resolve([])) =>
    promise.then(result => fn().then(Array.prototype.concat.bind(result)))
  );
}

// const seriallyResolvePromises: (Array<Promise<void>>) => <void> = promises => {
//   promises.reduce((promise, fn = Promise.resolve([])) =>
//     promise.then(result => fn().then(Array.prototype.concat.bind(result)))
//   );
// }

class Ad {
  static [PRIVATE.ready]: Promise<void> = Promise.resolve();
  static [PRIVATE.configuration]: GlobalConfiguration;
  static [PRIVATE.network]: NetworkInterface;
  static [PRIVATE.instances]: { [id: string]: Ad } = {};

  static [PRIVATE.generateID](): string {
    const randomNumber: number = Math.ceil(Math.random() * 100000);

    const suggestedID = `randomId${randomNumber}`;

    if (!this[PRIVATE.instances][suggestedID]) {
      return suggestedID;
    }

    return this[PRIVATE.generateID]();
  }

  static breakpoints: Array<number> = [];

  static async onReady(fn: () => void): Promise<void> {
    await this[PRIVATE.ready];
    await fn();
  }

  static configure(GlobalConfiguration, options = { breakpoints: []}): void {
    this[PRIVATE.ready] = Promise.resolve();

    // TODO: fix flow type/destructuring issue (@see https://github.com/facebook/flow/issues/235)
    // const {
    //   breakpoints: Array<number> = [],
    // } = options;

    this.breakpoints = options.breakpoints || [];

    this.onReady(() => {
      this[PRIVATE.configuration] = options;
    });
  }

  get [PRIVATE.isConfigured](): boolean {
    return !!this.constructor[PRIVATE.configuration];
  }

  get [PRIVATE.network](): NetworkInterface | void {
    return this.constructor[PRIVATE.network];
  }

  [PRIVATE.ready]: Array<Promise<void>> = [];
  [PRIVATE.ad]?: any;

  [PRIVATE.events]: {} = {
    __cache: {},
  };

  [PRIVATE.state]: {} = {
    creating: false,
    created: false,
    rendering: false,
    rendered: false,
    refreshing: false,
    destroying: false,
    destroyed: false,
  };

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
  async onReady(fn: () => void): Promise<void> {
    await this.constructor[PRIVATE.ready];
    await seriallyResolvePromises(this[PRIVATE.ready]);

    const execution: Promise<void> = Promise.resolve(fn());

    this[PRIVATE.ready].push(execution);
  }

  element: HTMLElement;
  slot: string;
  id: string;
  name: string;

  constructor(el: HTMLElement, idOrOptions: string | AdConfiguration, optionsOrNothing: AdConfiguration) {
    if (!this[PRIVATE.isConfigured]) {
      throw new Error('Not configured properly. Please see README.md');
    }

    this[PRIVATE.ready] = Promise.resolve();

    const id = arguments.length > 2 ? idOrOptions : this[PRIVATE.generateID]();
    const options = arguments.length > 2 ? optionsOrNothing : idOrOptions;

    this.element = el;
    this.id = id;

    this[PRIVATE.instances][id] = this;

    this.onReady(async () => {
      this[PRIVATE.ad] = await this[PRIVATE.network].createAd();
      console.log('ready to play');
    });
  }

  async render(): Promise<void> {
    if (this[PRIVATE.state].rendering || this[PRIVATE.state].rendered) {
      return;
    }

    this[PRIVATE.state].rendering = true;

    this[PRIVATE.emit](EVENTS.RENDER);

    await this.onReady(async () => {
      await this[PRIVATE.network].renderAd(this[PRIVATE.ad]);

      this[PRIVATE.state].rendering = false;
      this[PRIVATE.state].rendered = true;

      this[PRIVATE.emit](EVENTS.RENDERED);
    });
  }

  async refresh(): Promise<void> {
    if (this[PRIVATE.state].refreshing) {
      return;
    }

    this[PRIVATE.state].refreshing = true;

    await this.onReady(() => {});
  }

  async destroy(): Promise<void> {
    if (this[PRIVATE.state].destroying) {
      return;
    }

    this[PRIVATE.state].destroying = true;

    await this.onReady(() => {});
  }

  on(key: string, fn: () => void): void {
    if (!this[PRIVATE.events][key]) {
      this[PRIVATE.events][key] = [];
    }

    this[PRIVATE.events][key].push(fn);
  }

  [PRIVATE.emit](key: string, event) {
    const events: Array<() => void> = this[PRIVATE.events][key];

    if (!events) {
      return;
    }

    events.forEach(fn => fn.call(this, event, this));
  }

  [PRIVATE.onInViewport]() {
  }

  [PRIVATE.onBreakpointChange]() {
  }

  [PRIVATE.validateParameters](params: {}) {
    const providedParams = Object.keys(params);
    const { requiredParams, name: networkName } = this.constructor[PRIVATE.network];

    if (!params.adPath) {
      throw new Error('adPath is required for all networks');
    }

    requiredParams.forEach(param => {
      if (providedParams.indexOf(param) === -1) {
        throw new Error(`'${param}' is a required parameter in '${networkName}'`);
      }
    });
  }
}
