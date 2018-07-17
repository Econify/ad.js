import { NetworkInterface } from './NetworkTypes';
import { PluginInterface } from './PluginTypes';
import { Maybe } from './types/maybe'

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

// Event Bus Options
export const EVENTS: { [key: string]: string } = {
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

const seriallyResolvePromises = (thunks: Array<() => any>): Promise<Array<any>> => {
  return thunks.reduce(async (accumulator: Promise<Array<any>>, currentThunk: () => any): Promise<Array<any>> => {
    (await accumulator).push(await currentThunk());
    return accumulator;
  }, new Promise(resolve => resolve([])));
}

export class Ad {
  private static ready: Promise<void> = Promise.resolve();
  private static configuration: GlobalConfiguration
  private static network: NetworkInterface;
  private static instances: { [id: string]: Ad } = {};

  static generateID(): string {
    const randomNumber: number = Math.ceil(Math.random() * 100000);

    const suggestedID = `randomId${randomNumber}`;

    if (!this.instances[suggestedID]) {
      return suggestedID;
    }

    return this.generateID();
  }

  static breakpoints: Array<number> = [];

  static async onReady(fn: () => void): Promise<void> {
    await this.ready;
    await fn();
  }

  static configure(GlobalConfiguration, options: any = {}): void {
    this.ready = Promise.resolve();

    const { breakpoints = [] } : { breakpoints?: Array<number> } = options;

    this.breakpoints = breakpoints;

    this.onReady(() => {
      this.configuration = options;
    });
  }

  get isConfigured(): boolean {
    return !!(this.constructor as typeof Ad).configuration;
  }

  get network(): Maybe<NetworkInterface> {
    return (this.constructor as typeof Ad).network;
  }

  ready: Array<() => Promise<any>> = [];
  ad?: any;

  events: {} = {
    __cache: {},
  };

  state: { [key: string]: boolean } = {
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
    await (this.constructor as typeof Ad).ready;
    await seriallyResolvePromises(this.ready);

    const executionThunk: () => Promise<void> = () => Promise.resolve(fn());

    // TODO: should we reset 'this.ready' before pushing to? and/or move above seriallyResolvePromises?
    this.ready.push(executionThunk);
  }

  element: HTMLElement;
  slot: string;
  id: string;
  name: string;

  constructor(el: HTMLElement, idOrOptions: string | AdConfiguration, optionsOrNothing: Maybe<AdConfiguration>) {
    if (!this.isConfigured) {
      throw new Error('Not configured properly. Please see README.md');
    }

    this.ready = [];

    const id = typeof(idOrOptions) === 'string' ? idOrOptions : (this.constructor as typeof Ad).generateID();
    const options = arguments.length > 2 ? optionsOrNothing : idOrOptions;

    this.element = el;
    this.id = id;

    (this.constructor as typeof Ad).instances[id] = this;

    this.onReady(async () => {
      if (!this.network) throw new Error('Misconfigured network.'); // for typescript
      this.ad = await this.network.createAd(this);
      console.log('ready to play');
    });
  }

  async render(): Promise<void> {
    if (this.state.rendering || this.state.rendered) {
      return;
    }

    this.state.rendering = true;

    this.emit(EVENTS.RENDER);

    await this.onReady(async () => {
      if (!this.network) throw new Error('Misconfigured network.'); // for typescript
      await this.network.renderAd(this);

      this.state.rendering = false;
      this.state.rendered = true;

      this.emit(EVENTS.RENDERED);
    });
  }

  async refresh(): Promise<void> {
    if (this.state.refreshing) {
      return;
    }

    this.state.refreshing = true;

    await this.onReady(() => {});
  }

  async destroy(): Promise<void> {
    if (this.state.destroying) {
      return;
    }

    this.state.destroying = true;

    await this.onReady(() => {});
  }

  on(key: string, fn: () => void): void {
    if (!this.events[key]) {
      this.events[key] = [];
    }

    this.events[key].push(fn);
  }

  emit(key: string, event? /* TODO: resolve event (currently optional for tsc) */) {
    const events: Array<() => void> = this.events[key];

    if (!events) {
      return;
    }

    events.forEach(fn => fn.call(this, event, this));
  }

  onInViewport() {
  }

  onBreakpointChange() {
  }

  validateParameters(params: { adPath?: string }) {
    const providedParams = Object.keys(params);
    const { requiredParams = [], name: networkName } = (this.constructor as typeof Ad).network;

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
