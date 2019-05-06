import {
  IAd,
  IAdConfiguration, IAdEventListener, IEventType,
  INetwork, INetworkInstance, IPlugin, IPluginConstructorOrSingleton, IPluginHook, IVendor,
  Maybe,
} from './types';

import AdJS from '.';
import Bucket from './Bucket';
import insertElement from './utils/insertElement';
import seriallyResolvePromises from './utils/seriallyResolvePromises';
import uppercaseFirstLetter from './utils/uppercaseFirstLetter';

let adId = 0;

function nextId(): string {
  return `adjs-ad-container-${++adId}`;
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
  CREATE: 'create',
  REQUEST: 'request',
  RENDER: 'render',
  REFRESH: 'refresh',
  DESTROY: 'destroy',
  FREEZE: 'freeze',
  UNFREEZE: 'unfreeze',
  CLEAR: 'clear',
};

// Define LifeCycle Method will automatically wrap each
// lifecycle with important items such as "queue" when frozen,
// awaiting bucket queues and implementing vendors
function attachAsLifecycleMethod(
  target: any,
  propertyName: string,
  propertyDescriptor: any, // Must be any as typescript can't determine
                           // "this" on an unbound function
): any {
  const fn = propertyDescriptor.value;

  propertyDescriptor.value = async function(...args: any[]) {
    /*
     * If the ad unit is frozen push the call into a queue that
     * can be executed later
     */
    if (this.state.frozen) {
      const boundReplayFn = this[propertyName].bind(this, ...args);

      this.actionsReceievedWhileFrozen.push(boundReplayFn);

      return;
    }

    const hookName = uppercaseFirstLetter(propertyName);

    // e.g. beforeRender, onRender, afterRender, beforeRefresh
    const beforeHookName = `before${hookName}`;
    const onHookName = `on${hookName}`;
    const afterHookName = `after${hookName}`;

    // e.g. rendering, rendered
    const executingState = `${propertyName}ing`;
    const executedState = `${propertyName}ed`;

    // Has event already been called and currently executing?
    if (this.state[executingState]) {
      return;
    }

    /*
     * Has this render method already completed succesfully? Should we
     * allow for it to be executed again?
     */
    if (this.state[executedState] && propertyName !== 'refresh') {
      return;
    }

    /*
     * Lifecycle methods are not idempotent, make sure that multiple
     * calls to a method do not execute multiple times
     */
    this.state[executingState] = true;

    /*
     * Queue up the lifecycle method's execution to ensure all bucket async tasks
     * have completed and that it executes in order.
     *
     * e.g. if ad.render() is called before ad.destroy(), ensure ad.render()
     *      completes before executing ad.destroy().
     */
    await this.onReady(async () => {
      this.emit(propertyName, 'before');

      await this.callPlugins(beforeHookName);

      const executionOfFn = fn.apply(this, args);
      const executionOfPlugins = this.callPlugins(onHookName);

      this.emit(propertyName, 'on');

      await Promise.all([executionOfFn, executionOfPlugins]);

      await this.callPlugins(afterHookName);

      this.state[executingState] = false;
      this.state[executedState] = true;

      this.emit(propertyName, 'after');
    });
  };

  return propertyDescriptor;
}

class Ad implements IAd {
  get network(): INetwork {
    return this.bucket.network;
  }

  private get vendors() {
    return [
      ...this.bucket.vendors,
      ...this.localVendors,
    ];
  }

  // TODO: Rethink
  public correlatorId?: string;

  public breakpoints: number[] = [];

  public state: { [key: string]: boolean } = {
    creating: false,
    created: false,

    rendering: false,
    rendered: false,

    refreshing: false,
    refreshed: false,

    clearing: false,
    cleared: false,

    destroying: false,
    destroyed: false,

    frozen: false,
  };

  public container: HTMLElement;
  public el: HTMLElement;

  public configuration: IAdConfiguration;

  private networkInstance: INetworkInstance;

  private actionsReceievedWhileFrozen: any = [];

  private plugins: IPlugin[] = [];

  private localVendors: IVendor[] = [];

  private promiseStack: Promise<void> = Promise.resolve();

  // Event Queue
  private events: {
    [key: string]: IAdEventListener;
  } = {
    before: {},
    on: {},
    after: {},
  };

  constructor(private bucket: Bucket, el: HTMLElement, localConfiguration: Maybe<IAdConfiguration>) {
    /*
     * Add the parent buckets promise chain onto each Ad instance's
     * promise chain to ensure that any async actions the parent bucket
     * makes (e.g. Krux) are completed before allowing a lifecycle
     * method (e.g. render) to execute
     */
    this.promiseStack = this.promiseStack.then(() => this.bucket.promiseStack);

    this.configuration = {
      // Bucket Defaults
      ...this.bucket.defaults,

      // Constructor Overrides
      ...localConfiguration,
    };

    this.container = insertElement('div', { style: 'position: relative; display: inline-block;' }, el);
    this.el = insertElement('div', { id: nextId() }, this.container);

    this.networkInstance = this.network.createAd(this);

    // Merge Locally Provided Plugins for this ad with Plugins that are specified on the Bucket
    const plugins: IPluginConstructorOrSingleton[] = [...this.bucket.plugins];
    if (localConfiguration && localConfiguration.plugins) {
      this.plugins.push(...localConfiguration.plugins);
    }

    // Instantiate all class based plugins and reference them
    this.attachPlugins(plugins);

    this.callPlugins('onCreate');

    this.onReady(
      () => this.callPlugins('afterCreate'),
    );
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
  public async onReady(fn: () => void): Promise<any> {
    let externalResolve: () => void;
    let externalReject: (e: any) => void;

    const promiseMonitor = new Promise((resolve, reject) => {
      externalResolve = resolve;
      externalReject = reject;
    });

    this.promiseStack = this.promiseStack.then(async () => {
      try {
        await fn();

        externalResolve();
      } catch (e) {
        externalReject(e);
      }
    });

    return promiseMonitor;
  }

  @attachAsLifecycleMethod
  public async render(): Promise<void> {
    await this.bucket.setAsActive();
    await this.networkInstance.render();
  }

  @attachAsLifecycleMethod
  public async refresh(): Promise<void> {
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
      await this.networkInstance.render();
    }

    this.state.rendered = true;
  }

  @attachAsLifecycleMethod
  public async clear(): Promise<void> {
    await this.networkInstance.clear();
    this.state.rendered = false;
  }

  @attachAsLifecycleMethod
  public async destroy(): Promise<void> {
    await this.networkInstance.destroy();
  }

  public freeze(): void {
    if (this.state.frozen) {
      return;
    }

    this.emit(EVENTS.FREEZE, 'before');

    this.state.frozen = true;

    this.emit(EVENTS.FREEZE, 'on');
    this.emit(EVENTS.FREEZE, 'after');
  }

  public async unfreeze(options: { replayEventsWhileFrozen?: boolean } = {}): Promise<void> {
    if (!this.state.frozen) {
      return;
    }

    this.emit(EVENTS.UNFREEZE, 'before');

    // unfreeze is the exception to the evented workflow because if it were
    // enqueued, it would be pushed to the end of the queue (after backlogged
    // events). Thus, leaving the ad in a limbo state. As such, we must bypass
    // the queue for this event.
    this.state.frozen = false;

    const actions = this.actionsReceievedWhileFrozen;

    this.actionsReceievedWhileFrozen = [];

    // processes backlogged events in queue on('unfreeze')
    if (options.replayEventsWhileFrozen) {
      // TODO
      this.onReady(() =>
        seriallyResolvePromises(actions),
      );
    }

    this.emit(EVENTS.UNFREEZE, 'on');
    this.emit(EVENTS.UNFREEZE, 'after');
  }

  public on(key: string, fn: () => void): void {
    this.attachEvent(key, fn, 'on');
  }

  public before(key: string, fn: () => void): void {
    this.attachEvent(key, fn, 'before');
  }

  public after(key: string, fn: () => void): void {
    this.attachEvent(key, fn, 'after');
  }

  // You really shouldn't await this, but it's useful to know
  // when all of the binded events have fired
  public async emit(key: string, lifecycleTiming: string = 'on') {
    const events = this.events[lifecycleTiming][key];

    if (!events) {
      return;
    }

    await Promise.all(
      events.map(
        (event) => event(this),
      ),
    );
  }

  private attachEvent(key: string, fn: () => void, event: string = 'on'): void {
    if (!this.events[event][key]) {
      this.events[event][key] = [];
    }

    this.events[event][key].push(fn);
  }

  private attachPlugins(plugins: IPluginConstructorOrSingleton[]): void {
    this.plugins = plugins.map(
      (Plugin) => {
        if (typeof Plugin === 'function') {
          return new Plugin(this);
        }

        return Plugin;
      },
    );
  }

  // TODO Figure out type
  private callPlugins(hook: keyof IPlugin): Promise<void[]> {
    return Promise.all(
      this.plugins.map(
        async (plugin) => {
          const hookFn = plugin[hook];

          if (typeof hookFn === 'function') {
            await hookFn.call(plugin, this);
          }
        },
      ),
    );
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

export default Ad;
