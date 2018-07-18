import ADJS from './index';
import { NetworkInterface } from './NetworkTypes';
import { PluginInterface } from './PluginTypes';
import { Maybe } from './types/maybe';

export interface AdConfiguration {
  adPath?: string;

  targeting?: object;
  sizes?: any[];

  offset?: number;

  autoRender?: boolean;

  autoRefresh?: boolean;
  refreshRate?: number;

  refreshOnBreakpoint?: boolean;
  breakpoints?: number[];

  page?: Maybe<string>;
}

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

  FREEZE: 'freeze',
  FROZEN: 'frozen',
  UNFREEZE: 'unfreeze',
  UNFROZEN: 'unfrozen',
};

const seriallyResolvePromises = (thunks: Array<() => any>): Promise<any[]> => {
  return thunks.reduce(async (accumulator: Promise<any[]>, currentThunk: () => any): Promise<any[]> => {
    (await accumulator).push(await currentThunk());
    return accumulator;
  }, Promise.resolve([]));
};

export class Ad {
  get isConfigured(): boolean {
    return !!this.configuration;
  }

  get network(): NetworkInterface {
    return (this.constructor as typeof Ad).network;
  }

  public static breakpoints: number[] = [];

  public static generateID(): string {
    const randomNumber: number = Math.ceil(Math.random() * 100000);

    const suggestedID = `randomId${randomNumber}`;

    if (!this.instances[suggestedID]) {
      return suggestedID;
    }

    return this.generateID();
  }

  public static async onReady(fn: () => void): Promise<void> {
    await this.ready;
    await fn();
  }
  private static ready: Promise<void> = Promise.resolve();
  private static network: NetworkInterface;
  private static instances: { [id: string]: Ad } = {};

  public ready: Array<() => Promise<any>> = [];
  public ad?: any;

  // Event Queue
  public events: {} = {
    __cache: {},
  };

  public state: { [key: string]: boolean } = {
    creating: false,
    created: false,
    rendering: false,
    rendered: false,
    refreshing: false,
    destroying: false,
    destroyed: false,
    freezing: false,
    frozen: false,
    unfreezing: false,
    unfrozen: false,
  };

  public element: HTMLElement;
  public slot: string;
  public id: string;
  public name: string;

  private configuration: AdConfiguration;

  constructor(el: HTMLElement, idOrOptions: string | AdConfiguration, optionsOrNothing: Maybe<AdConfiguration>) {
    if (!ADJS.isConfigured) {
      throw new Error('Not configured properly. Please see README.md');
    }

    this.ready = [];

    const id = typeof(idOrOptions) === 'string' ? idOrOptions : (this.constructor as typeof Ad).generateID();

    let options = arguments.length > 2 ? optionsOrNothing : idOrOptions;
    options = typeof(options) === 'object' ? options : {};
    this.configure(options);

    this.element = el;
    this.id = id;

    (this.constructor as typeof Ad).instances[id] = this;

    this.onReady(async () => {
      this.ad = await this.network.createAd(this);
      console.log('ready to play');
    });
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
  public async onReady(fn: () => void): Promise<void> {
    await (this.constructor as typeof Ad).ready;
    await seriallyResolvePromises(this.ready);

    const executionThunk: () => Promise<void> = () => Promise.resolve(fn());

    // TODO: should we reset 'this.ready' before pushing to? and/or move above seriallyResolvePromises?
    this.ready.push(executionThunk);
  }

  public async render(): Promise<void> {
    if (this.state.rendering || this.state.rendered) {
      return;
    }

    this.state.rendering = true;

    this.emit(EVENTS.RENDER);

    await this.onReady(async () => {
      await this.network.renderAd(this);

      this.state.rendering = false;
      this.state.rendered = true;

      this.emit(EVENTS.RENDERED);
    });
  }

  public async refresh(): Promise<void> {
    if (this.state.refreshing) {
      return;
    }

    this.state.refreshing = true;

    await this.onReady(() => {});
  }

  public async destroy(): Promise<void> {
    if (this.state.destroying) {
      return;
    }

    this.state.destroying = true;

    await this.onReady(() => {});
  }

  public async freeze(): Promise<void> {
    if (this.state.freezing) {
      return;
    }

    this.state.freezing = true;
  }

  public async unfreeze(): Promise<void> {
    if (this.state.unfreezing) {
      return;
    }

    this.state.unfreezing = true;

    await this.onReady(() => {});
  }

  public on(key: string, fn: () => void): void {
    if (!this.events[key]) {
      this.events[key] = [];
    }

    this.events[key].push(fn);
  }

  public emit(key: string, event? /* TODO: resolve event (currently optional for tsc) */) {
    const events: Array<() => void> = this.events[key];

    if (!events) {
      return;
    }

    events.forEach((fn) => fn.call(this, event, this));
  }

  public onInViewport() {
  }

  public onBreakpointChange() {
  }

  public validateParameters(params: { adPath?: string }) {
    const providedParams = Object.keys(params);
    const { requiredParams = [], name: networkName } = (this.constructor as typeof Ad).network;

    if (!params.adPath) {
      throw new Error('adPath is required for all networks');
    }

    requiredParams.forEach((param) => {
      if (providedParams.indexOf(param) === -1) {
        throw new Error(`'${param}' is a required parameter in '${networkName}'`);
      }
    });
  }

  private configure(configuration: AdConfiguration) {
    this.configuration = {
      // Lib Defaults
      autoRender: true,
      autoRefresh: true,
      offset: 0,
      refreshRate: 60000,
      targeting: {},
      breakpoints: [],
      refreshOnBreakpoint: true,
      page: undefined,

      // Global Defaults (set by ADJS.configure)
      ...ADJS.defaults,

      // Constructor Overrides
      ...configuration,
    };
  }
}
