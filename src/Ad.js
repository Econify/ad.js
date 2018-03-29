import type { ProviderInterface } from 'Providers';

type AdInstanceOptions = {
  targeting?: {},
  sizes?: [],
  offset?: number,
  refreshInterval?: number,
  refreshOnBreakpoint?: boolean,
};

// Private Keys
const private : {} = {
  emit: Symbol('Ad/emit'),
  provider: Symbol('Ad/provider'),

  onInViewport: Symbol('Ad/onInViewport'),
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
  static [private.provider] : ?ProviderInterface = undefined;
  get [private.provider] = () : ?ProviderInterface =>
    this.constructor[private.provider];

  [private.events] = {
    __cache: {},
  };

  [private.ad] : ?any = undefined;

  constructor(el: HTMLElement, slot: string, options : AdInstanceOptions = {}) {
  }

  render() : void {
  }

  refresh() : void {
  }

  destroy() : void {
  }

  on(key : string, fn : () => void) : void {
    if (!this[private.events][key]) {
      this[private.events][key] : Array<() => void> = [];
    }

    this[private.events][key].push(fn);
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
}
