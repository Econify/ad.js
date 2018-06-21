// @flow
import type { NetworkInterface } from 'NetworkTypes';
import type { PluginInterface } from 'PluginTypes';

type GlobalConfiguration = {
  network: NetworkInterface,
  plugins: Array<PluginInterface>,

  defaults?: AdConfiguration,
}

type AdConfiguration = {
  adPath: string,

  targeting?: {},
  sizes?: [],

  offset?: number,

  autoRender?: boolean,

  autoRefresh?: boolean,
  refreshRate?: number,

  refreshOnBreakpoint?: boolean
  breakpoints?: Array<number>,
};

// Private Keys
const private: {} = {
  state: Symbol('@@Ad/state'),
  isReady: Symbol('@@Ad/isReady'),
  events: Symbol('@@Ad/events'),
  ad: Symbol('@@Ad/ad'),
  emit: Symbol('@@Ad/emit'),
  network: Symbol('@@Ad/network'),

  onInViewport: Symbol('@@Ad/onInViewport'),
  onBreakpointChange: Symbol('@@Ad/onBreakpointChange'),

  generateID: Symbol('@@Ad/generateID'),
};

// Event Bus options
export const EVENTS: {} = {
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

const seriallyResolvePromises: (Array<Promise<void>>) => <void> = promises =>
  promises.reduce((promise, fn = Promise.resolve([])) =>
    promise.then(result => fn().then(Array.prototype.concat.bind(result)))
  );

class Ad {
  static [private.ready]: Promise<void> = Promise.resolve();
  static [private.configuration]: ?GlobalConfiguration;
  static [private.network]: ?NetworkInterface;
  static [private.instances]: { [string]: <Ad> } = {};

  static [private.generateID](): string {
    const randomNumber: number = Math.ceil(Math.random() * 100000);

    const suggestedID = `randomId${randomNumber}`;

    if (!this[private.instances][suggestedID]) {
      return suggestedID;
    }

    return this[private.generateID]();
  }

  static breakpoints: Array<number> = [];

  static async onReady(fn: () => void): Promise<void> {
    await this[private.ready];
    await fn();
  }

  static configure: (GlobalConfiguration) => void = (options = {}) => {
    this[private.ready]: Promise<void> = Promise.resolve();

    const {
      breakpoints: Array<number> = [],
    } = options;

    this.breakpoints = breakpoints,

    this.onReady(() => {
      this[private.configuration] = options;
    });
  }

  get [private.isConfigured]: boolean = () =>
    !!this.constructor[private.configuration];

  get [private.network]: ?NetworkInterface = () =>
    this.constructor[private.network];

  [private.ready]: Array<Promise<void>> = [];
  [private.ad]: ?any;

  [private.events]: {} = {
    __cache: {},
  };

  [private.state]: {} = {
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
  async onReady(fn: () => void) : Promise<void> {
    await this.constructor[private.ready];
    await seriallyResolvePromises(this[private.ready]);

    const execution: Promise<void> = Promise.resolve(fn());

    this[private.ready].push(execution);
  }

  element: HTMLElement;
  slot: string;

  declare function constructor(el: HTMLElement, id: string, options : AdConfiguration = {})
  declare function constructor(el: HTMLElement: string, options : AdConfiguration = {})
  constructor(el, idOrOptions = {}, optionsOrNothing = {}) {
    if (!this.isConfigured) {
      throw new Error('Not configured properly. Please see README.md');
    }

    this[private.ready]: Promise<void> = Promise.resolve();

    const id = arguments.length > 2 ? idOrOptions : this[private.generateID]();
    const options = arguments.length > 2 ? optionsOrNothing : idOrOptions;

    this.element = el;
    this.id = id;

    this[private.instances][id] = this;

    this.onReady(async () => {
      this[private.ad] = await this[private.network].createAd();
      console.log('ready to play');
    });
  }

  async render(): Promise<void> {
    if (this[private.state].rendering || this[private.state].rendered) {
      return;
    }

    this[private.state].rendering = true;

    this.emit(EVENTS.RENDER);

    await this.onReady(async () => {
      await this[private.network].renderAd(this[private.ad]);

      this[private.state].rendering = false;
      this[private.state].rendered = true;

      this.emit(EVENTS.RENDERED);
    });
  }

  async refresh(): Promise<void> {
    if (this[private.state].refreshing) {
      return;
    }

    this[private.state].refreshing = true;

    await this.onReady(Function.prototype);
  }

  async destroy(): Promise<void> {
    if (this[private.state].destroying) {
      return;
    }

    this[private.state].destroying = true;

    await this.onReady(Function.prototype);
  }

  on(key: string, fn: () => void): void {
    if (!this[private.events][key]) {
      this[private.events][key]: Array<() => void> = [];
    }

    this[private.events][key].push(fn);
  }

  [private.emit](key: string, event) {
    const events: Array<() => void> = this[private.events][key];

    if (!events) {
      return;
    }

    events.forEach(fn => fn.call(this, event, this));
  }

  [private.onInViewport]() {
  }

  [private.onBreakpointChange]() {
  }

  [private.validateParameters](params: {}) {
    const providedParams = Object.keys(params);
    const { requiredParams, name: networkName } = this.constructor[private.network];

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
