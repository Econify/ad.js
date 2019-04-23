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

  pluginStorage: { [key: string]: any };

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
  plugins?: IPlugin[];
  vendors?: IVendor[];
  defaults?: {};
}

export type IPluginHook = (ad: IAd) => void;

export interface IPlugin {
  name: string;

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

export type IAdSizes = number[][];

export interface IAdConfiguration {
  path?: string;
  targeting?: IAdTargeting;
  sizes?: IAdSizes;

  offset?: number;

  autoRender?: boolean;

  autoRefresh?: boolean;
  refreshRate?: number;

  refreshOnBreakpoint?: boolean;
  breakpoints?: number[];
}
