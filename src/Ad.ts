import {
  IAdConfiguration, IEventType,
  IExtension, INetwork, INetworkInstance, IPlugin,
  Maybe,
} from '../';

import AdJS from '.';
import Bucket from './Bucket';
import insertElement from './utils/insertElement';
import seriallyResolvePromises from './utils/seriallyResolvePromises';

interface IDefineLifeCycleOptions {
  allowDuplicateExecution: boolean;
}

let adId = 0;

function nextId(): string {
  return `adjs-ad-container-${++adId}`;
}

function ucFirst(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
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
  UNFREEZE: 'unfreeze',

  CLEARED: 'cleared',
};


class Ad {
  // TODO: Rethink
  public correlatorId?: string;

  get network(): INetwork {
    return this.bucket.network;
  }

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

  public breakpoints: number[] = [];

  public defineLifeCycleMethod(methodName, () => {
  });

  public state: { [key: string]: boolean } = {
    creating: false,
    created: false,
    rendering: false,
    rendered: false,
    destroying: false,
    destroyed: false,

    frozen: false,
  };

  public container: HTMLElement;

  private networkInstance!: INetworkInstance;

  private localExtensions: IExtension[] = [];
  private localPlugins: IPlugin[] = [];

  private promiseStack: Promise<void> = Promise.resolve();

  // Event Queue
  private events: {
    [key: string]: Array<(ad?: Ad) => void>;
  } = {
    __cache: [],
  };

  private configuration: IAdConfiguration;

  private callExtensions(hook: string): Promise<void>[] {
    return this.extensions.forEach(
      async (extension) => {
        if (!extension[hook]) {
          return;
        }

        return extension[hook](this);
      }
    );
  }

  // Define LifeCycle Method will automatically wrap each
  // lifecycle with important items such as "queue" when frozen,
  // awaiting bucket queues and implementing extensions
  static defineLifeCycleMethod(methodName, fn, options?: IDefineLifeCycleOptions) {
    this.prototype[methodName] = async function () {
      if (this.state.frozen) {
        this.cache.push(this.prototype[methodName]);

        return;
      }

      const hookName = ucFirst(methodName);

      const beforeHookName = `before${hookName}`;
      const onHookName = `on${hookName}`;
      const afterHookName = `after${hookName}`;

      const executingState = `${methodName}ing`;
      const executedState = `${methodName}ed`;

      // Has event already been called and currently executing?
      if (this.state[executingState]) {
        return;
      }

      // Has this render method already completed succesfully? Should we allow for it
      // to be executed again?
      if ((!options || !options.allowDuplicateExecution) && this.state[executedState]) {
        return;
      }

      this.state[executingState] = true;

      this.onReady(() => {
        this.emit(executingState);

        this.callExtensions(beforeHookName);

        const executionOfFn = fn.call(this);

        this.callExtensions(onHookName);

        await executionOfFn;

        this.callExtensions(afterHookName)

        this.state[executingState] = false;
        this.state[executedState] = true;

        this.emit(executedState);
      });
    }
  }

  constructor(private bucket: Bucket, el: HTMLElement, localConfiguration: Maybe<IAdConfiguration>) {
    this.container = insertElement('div', { id: nextId() }, el);

    this.promiseStack = this.promiseStack.then(() => this.bucket.promiseStack);

    this.configuration = {
      // Bucket Defaults
      ...this.bucket.defaults,

      // Constructor Overrides
      ...localConfiguration,
    };

    this.onReady(() => {
      this.networkInstance = this.network.createAd(this.container);

      // TODO INCLUDE A DEBUGGER
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
    this.promiseStack = this.promiseStack.then(() => fn());
  }

  public freeze(): void {
    if (this.state.frozen) {
      return;
    }

    this.state.frozen = true;
    this.emit(EVENTS.FREEZE);
  }

  public async unfreeze(options: { replayEventsWhileFrozen?: boolean } = {}): Promise<void> {
    if (!this.state.frozen) {
      return;
    }

    // unfreeze is the exception to the evented workflow because if it were
    // enqueued, it would be pushed to the end of the queue (after backlogged
    // events). Thus, leaving the ad in a limbo state. As such, we must bypass
    // the queue for this event.
    this.state.frozen = false;

    // processes backlogged events in queue on('unfreeze')
    if (options.replayEventsWhileFrozen) {
      const events = this.getCachedEventsAndEmptyCache();

      /*
      this.addToPromiseStack(
        () => seriallyResolvePromises(events),
      );
       */
    }

    this.emit(EVENTS.UNFREEZE);
  }

  public on(key: string, fn: () => void): void {
    if (!this.events[key]) {
      this.events[key] = [];
    }

    this.events[key].push(fn);
  }

  // You really shouldn't await this, but it's useful to know
  // when all of the binded events have fired
  public async emit(key: string, callback?: (ad: this) => void) {
    const events = this.events[key];

    if (!events) {
      return;
    }

    await Promise.all(
      events.map(
        (event) => event(this),
      ),
    );
  }

  private getCachedEventsAndEmptyCache() {
    const events = this.events.__cache;

    this.events.__cache = [];
  }

  private validateParameters(params: { adPath?: string }) {
    const providedParams = Object.keys(params);
    const { requiredParams = [], name: networkName } = this.network;

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

Ad.defineLifeCycleMethod('render', async function () {
  await this.bucket.setAsActive();

  await this.networkInstance.render();
});

Ad.defineLifeCycleMethod('refresh', async function () {
  await this.bucket.setAsActive();

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
});

Ad.defineLifeCycleMethod('clear', async function () {
  await this.networkInstance.clear();
  this.state.rendered = false;
});

Ad.defineLifeCycleMethod('destroy', async function () {
  await this.networkInstance.destroy();
});
