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
  id?: number;

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

export interface IBucketConfiguration {
  plugins?: IPluginConstructorOrSingleton[];
  vendors?: IVendor[];
  defaults?: {};
}

export type IPluginHook = (ad: IAd) => void;

export type IPluginConstructorOrSingleton = IPluginConstructor | IPlugin;

export type IPluginConstructor = new(ad: IAd) => IPlugin;

export interface IPlugin {
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
}

export interface IAdConfiguration {
  autoRefresh?: boolean;
  autoRender?: boolean;
  breakpoints?: IAdBreakpoints;
  offset?: number;
  path?: string;
  plugins?: IPluginConstructorOrSingleton[];
  refreshOnBreakpoint?: boolean;
  refreshRateInSeconds?: number;
  sizes?: AdSizes;
  targeting?: IAdTargeting;
}
