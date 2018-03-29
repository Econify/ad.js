// @flow
import type { ProviderInterface } from 'Providers';
import type { PreprocessorInterface } from 'Preprocessors';

type GlobalConfiguration = {
  provider : ProviderInterface,
  preprocessors : {
    [string] : {},
  },

  globalAdOptions? : AdConfiguration,
}

type AdConfiguration = {
  adPath : string,
  targeting? : {},
  sizes? : [],
  offset? : number,
  refreshInterval? : number,
  refreshOnBreakpoint? : boolean,
};

// Private Keys
const private : {} = {
  isReady: Symbol('Ad/isReady'),
  events: Symbol('Ad/events'),
  ad: Symbol('Ad/ad'),
  emit: Symbol('Ad/emit'),
  provider: Symbol('Ad/provider'),

  onInViewport: Symbol('Ad/onInViewport'),
  onBreakpointChange: Symbol('Ad/onBreakpointChange'),
};

// Event Bus options
export const EVENTS : {} = {
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

class Ad {
  static [private.ready] : Promise<void> = Promise.resolve();
  static [private.configuration] : ?GlobalConfiguration;
  static [private.provider] : ?ProviderInterface;

  static async onReady(fn : () => void) : Promise<void> {
    await this[private.ready];
    await fn();
  }

  static configure : (GlobalConfiguration) => void = (options = {}) => {
    this[private.ready] : Promise<void> = Promise.resolve();

    this.onReady(() => {
      this[private.configuration] = options;
    });
  }

  get [private.isConfigured] : boolean = () =>
    !!this.constructor[private.configuration];

  get [private.provider] : ?ProviderInterface = () =>
    this.constructor[private.provider];

  [private.ready] : Promise<void> = Promise.resolve();
  [private.ad] : ?any;
  [private.events] : {} = {
    __cache: {},
  };

  element : HTMLElement;
  slot : string;

  constructor(el: HTMLElement, slot: string, options : AdConfiguration = {}) {
    if (!this.isConfigured) {
      throw new Error('Not configured properly. Please see README.md');
    }

    this[private.ready] : Promise<void> = Promise.resolve();

    this.element = el;
    this.slot = slot;

    this.onReady(() => {
      console.log('ready to play');
    });
  }

  async render() : Promise<void> {
    await this.onReady(Function.prototype);
  }

  async refresh() : Promise<void> {
    await this.onReady(Function.prototype);
  }

  async destroy() : Promise<void> {
    await this.onReady(Function.prototype);
  }

  on(key : string, fn : () => void) : void {
    if (!this[private.events][key]) {
      this[private.events][key] : Array<() => void> = [];
    }

    this[private.events][key].push(fn);
  }

  async onReady(fn : () => void) : Promise<void> {
    await this[private.ready];
    await fn();
  }

  [private.emit](key : string, event) {
    const events : Array<() => void> = this[private.events][key];

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
