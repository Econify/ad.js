import {
  IAd, IAdConfiguration, IAdEventListener,
  INetwork, INetworkInstance, IPlugin, IPluginConstructorOrSingleton,
  IVendor,
  Maybe,
} from './types';

import EVENTS from './Events';
import Page from './Page';
import insertElement from './utils/insertElement';
import seriallyResolvePromises from './utils/seriallyResolvePromises';
import uppercaseFirstLetter from './utils/uppercaseFirstLetter';

let adId = 0;

function nextId(): number {
  return ++adId;
}

function validateSizes(configuration: IAdConfiguration): void {
  const { sizes, breakpoints } = configuration;

  if (!Array.isArray(sizes) && !breakpoints) {
    throw new Error('Sizes must be of type `Array` unless breakpoints have been specified');
  }
}

// Define LifeCycle Method will automatically wrap each
// lifecycle with important items such as "queue" when frozen,
// awaiting page queues and implementing vendors
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

      this.actionsReceivedWhileFrozen.push(boundReplayFn);

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
     * Queue up the lifecycle method's execution to ensure all page async tasks
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
    return this.page.network;
  }

  get slot(): googletag.Slot {
    return this.networkInstance.slot;
  }

  private get vendors() {
    return [
      ...this.page.vendors,
      ...this.localVendors,
    ];
  }

  // TODO: Rethink
  public correlatorId?: string;
  public id: number;
  public isEmpty: boolean = true;

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

  private networkInstance!: INetworkInstance;

  private actionsReceivedWhileFrozen: any = [];

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

  constructor(private page: Page, el: HTMLElement, localConfiguration: Maybe<IAdConfiguration>) {
    /*
     * Add the parent pages promise chain onto each Ad instance's
     * promise chain to ensure that any async actions the parent page
     * makes (e.g. Krux) are completed before allowing a lifecycle
     * method (e.g. render) to execute
     */
    this.promiseStack = this.promiseStack.then(() => this.page.promiseStack);

    this.configuration = {
      ...this.page.defaults,
      ...localConfiguration,

      // Targeting is the only value that should merge
      targeting: {
        ...(this.page.defaults && this.page.defaults.targeting),
        ...(localConfiguration && localConfiguration.targeting),
      },
    };

    this.id = nextId();
    this.container = insertElement('div', { style: 'position: relative;' }, el);
    // change this back to temp literal after rollup fix
    this.el = insertElement('div', { id: 'adjs-ad-container-' + this.id }, this.container);

    validateSizes(this.configuration);

    // Merge Locally Provided Plugins for this ad with Plugins that are specified on the Page
    const plugins: IPluginConstructorOrSingleton[] = [...this.page.plugins];
    if (localConfiguration && localConfiguration.plugins) {
      plugins.push(...localConfiguration.plugins);
    }

    // Instantiate all class based plugins and reference them
    this.attachPlugins(plugins);

    const executionOfPlugins = this.callPlugins('beforeCreate');

    this.onReady(
      async () => {
        await executionOfPlugins;

        await Promise.all(
          [
            this.networkInstance = this.network.createAd(this),
            this.callPlugins('onCreate'),
          ],
        );

        await this.callPlugins('afterCreate');
      },
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
  public onReady(fn: () => void): Promise<any> {
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
    await this.page.setAsActive();
    await this.networkInstance.render();
  }

  @attachAsLifecycleMethod
  public async refresh(): Promise<void> {
    await this.page.setAsActive();

    if (typeof this.networkInstance.refresh !== 'undefined') {
      await this.networkInstance.refresh();
    } else {
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

    const actions = this.actionsReceivedWhileFrozen;

    this.actionsReceivedWhileFrozen = [];

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
}

export default Ad;
