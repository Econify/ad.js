// @flow
import type { ProviderInterface } from 'ProviderTypes';
import type { PreprocessorInterface } from 'PreprocessorTypes';

type GlobalConfiguration = {
  provider: ProviderInterface,
  breakpoints: ?Array<number>,
  preprocessors: {
    [string]: {},
  },

  globalAdOptions?: AdConfiguration,
}

type AdConfiguration = {
  adPath: string,
  targeting?: {},
  sizes?: [],
  offset?: number,
  refreshInterval?: number,
  refreshOnBreakpoint?: boolean,
};

// Private Keys
const private: {} = {
  state: Symbol('Ad/state'),
  isReady: Symbol('Ad/isReady'),
  events: Symbol('Ad/events'),
  ad: Symbol('Ad/ad'),
  emit: Symbol('Ad/emit'),
  provider: Symbol('Ad/provider'),

  onInViewport: Symbol('Ad/onInViewport'),
  onBreakpointChange: Symbol('Ad/onBreakpointChange'),
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
  promises.reduce((promise, fn) =>
    promise.then(result =>
      fn().then(Array.prototype.concat.bind(result))),
      Promise.resolve([]))

class Ad {
  static [private.ready]: Promise<void> = Promise.resolve();
  static [private.configuration]: ?GlobalConfiguration;
  static [private.provider]: ?ProviderInterface;

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

  get [private.provider]: ?ProviderInterface = () =>
    this.constructor[private.provider];

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
    await seriallyResolvePromises(this[private.ready]);

    const execution: Promise<void> = Promise.resolve(fn());

    this[private.ready].push(execution);
  }

  element: HTMLElement;
  slot: string;

  constructor(el: HTMLElement, slot: string, options : AdConfiguration = {}) {
    if (!this.isConfigured) {
      throw new Error('Not configured properly. Please see README.md');
    }

    this[private.ready]: Promise<void> = Promise.resolve();

    this.element = el;
    this.slot = slot;

    this.onReady(async () => {
      this[private.ad] = await this[private.provider].createAd();
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
      await this[private.provider].renderAd(this[private.ad]);

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
}
