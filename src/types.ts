export type Maybe<T> = T | void;

export interface IEventType {
  [key: string]: string;
}

export interface IAdEventListener {
  [key: string]: Array<(ad?: IAd) => void>;
}

export interface IAd {
  configuration: IAdConfiguration;

  container: HTMLElement;
  el: HTMLElement;

  network: INetwork;

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

export enum EventBusOptions {
  CREATE = 'create',
  REQUEST = 'request',
  RENDER = 'render',
  REFRESH = 'refresh',
  DESTROY = 'destroy',
  FREEZE = 'freeze',
  UNFREEZE = 'unfreeze',
  CLEAR = 'clear',
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
