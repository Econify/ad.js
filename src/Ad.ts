import {
  IAdConfiguration, IExtension, INetwork,
  IPlugin, IEventType, Maybe, IBucket,
} from '../';

import AdJS from '.';
import insertElement from './utils/insertElement';

let adId = 1;

function nextId(): number {
  return ++adId;
}

const DEFAULT_CONFIGURATION: IAdConfiguration = {
  autoRender: true,
  autoRefresh: true,
  offset: 0,
  refreshRate: 60000,
  targeting: {},
  breakpoints: [],
  refreshOnBreakpoint: true,
};

// Event Bus Options
export const EVENTS: IEventType = {
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

  CLEARED: 'cleared',
};

const seriallyResolvePromises = (thunks: Array<() => any>): Promise<any[]> => {
  return thunks.reduce(async (accumulator: Promise<any[]>, currentThunk: () => any): Promise<any[]> => {
    (await accumulator).push(await currentThunk());
    // if (removeAfterResolve) { thunks.shift(); } // empties item from queue
    return accumulator;
  }, Promise.resolve([]));
};

export class Ad {
  get network(): INetwork {
    return this.bucket.network;
  }
  
  this.networkInstance: INetworkInstance;

  public breakpoints: number[] = [];

  private localExtensions: IExtension[] = [];
  private localPlugins: IPlugin[] = [];

  private get extensions() {
    return [
      ...this.bucket.extensions,
      ...this.localExtensions,
    ];
  }

  private get plugins() {
    return [
      ...this.bucket.plugins,
      ...this.localPlugins,
    ];
  }

  /*
  public generateID(): string {
    const randomNumber: number = Math.ceil(Math.random() * 100000);

    const suggestedID = `randomId${randomNumber}`;

    if (!this.instances[suggestedID]) {
      return suggestedID;
    }

    return this.generateID();
  }
   */

  private ready: Array<() => Promise<any>> = [];

  // Event Queue
  private events: {} = {
    __cache: {},
  };

  public state: { [key: string]: boolean } = {
    creating: false,
    created: false,
    rendering: false,
    rendered: false,
    destroying: false,
    destroyed: false,
    freezing: false,
    frozen: false,
    unfreezing: false,
    unfrozen: false,
  };

  public container: HTMLElement;

  private configuration: IAdConfiguration;

  constructor(private bucket: IBucket, el: HTMLElement, localConfiguration: Maybe<IAdConfiguration>) {
    this.bucket = bucket;
    this.container = insertElement('div', { 'data-ad-id': nextId() }, el);
    this.configuration: IAdConfiguration = {
      // Bucket Defaults
      ...this.bucket.defaults,

      // Constructor Overrides
      ...localConfiguration,
    };

    this.onReady(() => {
      this.networkInstance = this.network.createAd(this);

      console.log('ready to play with', this.networkInstance);
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
    await this.bucket.prepare();

    const executionThunk: () => Promise<void> = () => Promise.resolve(fn(this));
    this.ready.push(executionThunk);

    // FIXME: the processing logic/flow below may not scale (not as-is anyway).
    // However we needed something to tie us over because if you don't stop or
    // pause processing between calls, duplicate processing can occur (it's a
    // side effect of these calls being queued up and javascript's async
    // nature). To reproduce, chain a bunch of ad events and comment out
    // `&& !this.state.processing`. The demo will print 'ready to play' for
    // every emit/onReady event call.
    //
    // We'll see Sky-Sky, we'll see...
    await seriallyResolvePromises(this.ready);
  }

  public async render(): Promise<void> {
    if (this.state.rendering || this.state.rendered) {
      return;
    }
    
    this.state.rendering = true;

    await this.onReady(async () => {
      this.bucket.setAsActive();

      this.emit(EVENTS.RENDER);

      await this.network.renderAd(this.ad);

      this.state.rendering = false;
      this.state.rendered = true;
      this.emit(EVENTS.RENDERED);
    });
  }

  public async refresh(forceRender: boolean = true): Promise<void> {
    if (this.state.refreshing) {
      return;
    }

    this.state.refreshing = true;

    await this.onReady(async () => {
      this.bucket.setAsActive();

      this.emit(EVENTS.REFRESH);

      if (typeof this.networkInstance.refresh !== 'undefined') {
        await this.networkInstance.refresh();
      } else {
        console.warn(`
          ${this.network.name} Network does not support ad refreshing natively.
          Destroying and Recreating the ad. Make sure this is what you intended.
        `);

        await this.networkInstance.destroy();
        this.networkInstance = this.network.createAd(this);

        if (forceRender) {
          this.networkInstance.render();
        }
      }

      this.state.refreshing = false;
      this.state.refreshed = true;
      this.emit(EVENTS.REFRESHED);
    });
  }

  public async clear(): Promise<void> {
    if (this.state.clearing || !this.state.rendered) {
      return;
    }

    this.state.clearing = true;

    await this.onReady(async () => {
      await this.networkInstance.clear();

      this.state.clearing = true;
      this.state.rendered = false;
      this.emit(EVENTS.CLEARED);
    });
  }

  public async destroy(): Promise<void> {
    if (this.state.destroying || this.state.destroyed) {
      return;
    }

    await this.onReady(async () => {
      this.state.destroying = true;
      this.emit(EVENTS.DESTROY);

      await this.networkInstance.destroy();

      this.state.destroyed = true;
      this.emit(EVENTS.DESTROYED);
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

  public async unfreeze(options: { replayEventsWhileFrozen?: boolean } = {}): Promise<void> {
    if (this.state.unfreezing || !this.state.frozen) {
      return;
    }

    // unfreeze is the exception to the evented workflow because if it were
    // enqueued, it would be pushed to the end of the queue (after backlogged
    // events). Thus, leaving the ad in a limbo state. As such, we must bypass
    // the queue for this event.
    this.state.unfreezing = true;
    this.emit(EVENTS.UNFREEZE);

    this.state.frozen = false;
    this.state.unfreezing = false;
    this.emit(EVENTS.UNFROZEN);

    // processes backlogged events in queue on('unfreeze')
    if (options.replayEventsWhileFrozen) {
      await this.events.__cache
    }
  }

  public on(key: string, fn: () => void): void {
    if (!this.events[key]) {
      this.events[key] = [];
    }

    this.events[key].push(fn);
  }

  public async emit(key: string, callback?: (ad: this) => void) {
    const events: Array<() => void> = this.events[key];
    
    if (!events) {
      return;
    }

    await Promise.all(
      events.map(
        (event) => event(this)
      )
    );
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
}

export default Ad;
