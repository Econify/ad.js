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

const seriallyResolvePromises = (thunks: Array<() => any>, removeAfterResolve: boolean): Promise<any[]> => {
  return thunks.reduce(async (accumulator: Promise<any[]>, currentThunk: () => any): Promise<any[]> => {
    (await accumulator).push(await currentThunk());
    if (removeAfterResolve) { thunks.shift(); } // empties item from queue
    return accumulator;
  }, Promise.resolve([]));
};

export class Ad {
  get isConfigured(): boolean {
    return !!this.configuration;
  }

  get network(): NetworkInterface {
    return ADJS.network;
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
    processing: false, // ready queue status
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

    const executionThunk: () => Promise<void> = () => Promise.resolve(fn());
    this.ready.push(executionThunk);

    if (!this.state.frozen && !this.state.processing) {
      this.state.processing = true;
      await seriallyResolvePromises(this.ready, true);
      this.state.processing = false;
    }
  }

  public async render(): Promise<void> {
    if (this.state.rendering || this.state.rendered) {
      return;
    }

    await this.onReady(async () => {
      await this.emit(EVENTS.RENDER, () => {
        this.state.rendering = true;
      });

      await this.network.renderAd(this);

      await this.emit(EVENTS.RENDERED, () => {
        this.state.rendering = false;
        this.state.rendered = true;
      });
    });
  }

  public async refresh(): Promise<void> {
    if (this.state.refreshing) {
      return;
    }

    await this.onReady(async () => {
      await this.emit(EVENTS.REFRESH, () => {
        this.state.refreshing = true;
      });

      await this.emit(EVENTS.REFRESHED, () => {
        this.state.refreshing = false;
        this.state.refreshed = true;
      });
    });
  }

  public async destroy(): Promise<void> {
    if (this.state.destroying || this.state.destroyed) {
      return;
    }

    await this.onReady(async () => {
      await this.emit(EVENTS.DESTROY, () => {
        this.state.destroying = true;
        this.state.destroying = false;
      });

      await this.emit(EVENTS.DESTROYED, () => {
        this.state.destroyed = true;
      });
    });
  }

  public async freeze(): Promise<void> {
    if (this.state.freezing || this.state.frozen) {
      return;
    }

    await this.onReady(async () => {
      await this.emit(EVENTS.FREEZE, () => {
        this.state.freezing = true;
      });

      await this.emit(EVENTS.FROZEN, () => {
        this.state.freezing = false;
        this.state.frozen = true;
      });
    });
  }

  public async unfreeze(): Promise<void> {
    if (this.state.unfreezing || !this.state.frozen) {
      return;
    }

    // unfreeze is the exception to the evented workflow because if it were
    // enqueued, it would be pushed to the end of the queue (after backlogged
    // events). Thus, leaving the ad in a limbo state. As such, we must bypass
    // the queue for this event.
    await this.emit(EVENTS.UNFREEZE, () => {
      this.state.unfreezing = true;
    });

    await this.emit(EVENTS.UNFROZEN, () => {
      this.state.frozen = false;
      this.state.unfreezing = false;
    });
  }

  public on(key: string, fn: () => void): void {
    if (!this.events[key]) {
      this.events[key] = [];
    }

    this.events[key].push(fn);
  }

  public async emit(key: string, callback?: () => any) {
    const events: Array<() => void> = this.events[key];

    // trigger callback (typically associated state changes)
    if (callback) {
      await callback.call(this);
    }

    if (!events) {
      return;
    }

    // trigger on('event') hooks
    await seriallyResolvePromises(events, false);
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
