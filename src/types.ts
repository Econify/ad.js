declare global {
  // tslint:disable-next-line
  interface Window {
    _ADJS: ILoadedModulesCache;
  }
}

export type Maybe<T> = T | void;

export type LoadedModules = any;

export interface ILoadedModulesCache {
  Plugins: LoadedModules;
  Networks: LoadedModules;
  Vendors: LoadedModules;
}

export enum LOG_LEVELS {
  DEBUG = 'log',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface IEventType {
  [key: string]: string;
}

export interface IAdEventListener {
  [key: string]: Array<(ad?: IAd) => void>;
}

export interface IAd {
  [key: string]: any;
  id: number;

  isEmpty: boolean;
  configuration: IAdConfiguration;

  container: HTMLElement;
  el: HTMLElement;

  network: INetwork;
  slot: googletag.Slot;

  render(): Promise<void>;
  refresh(): Promise<void>;
  clear(): Promise<void>;
  destroy(): Promise<void>;

  freeze(): void;
  unfreeze(): Promise<void>;
}

export interface IVendor {
  name: string;
}

export interface IPageConfiguration {
  plugins?: IPluginConstructorOrSingleton[];
  vendors?: IVendor[];
  defaults?: {};
}

export type IPluginHook = (ad: IAd) => void;

export type IPluginConstructorOrSingleton = IPluginConstructor | IPlugin;

export type IPluginConstructor = new(ad: IAd) => IPlugin;

export interface IPlugin {
  // this is for prototyping on plugins
  [x: string]: any;

  name: string;

  beforeCreate?: IPluginHook;
  onCreate?: IPluginHook;
  afterCreate?: IPluginHook;

  beforeRender?: IPluginHook;
  onRender?: IPluginHook;
  afterRender?: IPluginHook;

  beforeRefresh?: IPluginHook;
  onRefresh?: IPluginHook;
  afterRefresh?: IPluginHook;

  beforeClear?: IPluginHook;
  onClear?: IPluginHook;
  afterClear?: IPluginHook;

  beforeDestroy?: IPluginHook;
  onDestroy?: IPluginHook;
  afterDestroy?: IPluginHook;

  beforeFreeze?: IPluginHook;
  onFreeze?: IPluginHook;

  beforeUnfreeze?: IPluginHook;
  onUnfreeze?: IPluginHook;
  afterUnfreeze?: IPluginHook;
}

export interface INetworkArguments {
  el: HTMLElement;
  slot: string;
  adCode: string;
  targeting: {};
}

export interface INetworkInstance {
  render: () => Promise<void>;
  refresh?: () => Promise<void>;
  clear: () => Promise<void>;
  destroy: () => Promise<void>;
  [key: string]: any;
}

export interface INetwork {
  name: string;
  requiredParams?: string[];

  createAd(ad: IAd): INetworkInstance;

  resetCorrelator(): Promise<void>;

  [key: string]: any;
}

export interface IAdTargeting {
  [key: string]: string;
}

interface IAdBreakpointDescriptor {
  from: number;
  to: number;
}

export interface IAdBreakpointSizes {
  [key: string]: AdSizesDescriptor;
}

export interface IAdBreakpoints {
  [key: string]: IAdBreakpointDescriptor;
}

export type AdSizesDescriptor = number[];
export type AdSizes = IAdSizes | IAdBreakpointSizes;

export interface IAdSizes {
  [key: string]: AdSizesDescriptor;
}

export interface ICurrentConfines {
  from?: number;
  to?: number;
  breakpoint?: string;
  sizesSpecified?: boolean;
}

export interface IAdConfiguration {
  [key: string]: any;
  autoRefresh?: boolean;
  autoRender?: boolean;
  sticky?: boolean;
  enableByScroll?: boolean;
  collapsible?: boolean;
  clearOnExitViewport?: boolean;
  breakpoints?: IAdBreakpoints;
  offset?: number;
  stickyOffset?: number;
  renderOffset?: number;
  logging?: boolean;
  overlay?: boolean;
  path?: string;
  plugins?: IPluginConstructorOrSingleton[];
  refreshOnBreakpoint?: boolean;
  refreshRateInSeconds?: number;
  refreshLimit?: number;
  sizes?: AdSizes;
  targeting?: IAdTargeting;
}

export interface IScrollMonitorRegisteredAd {
  element: HTMLElement;
  offset: number;
  inView: boolean;
  fullyInView: boolean;
  enableByScroll?: boolean;
  hasViewBeenScrolled: boolean;
  onEnterViewport: any[];
  onFullyEnterViewport: any[];
  onExitViewport: any[];
}
