export type Maybe<T> = T | void;

export interface IEventType {
  [key: string]: string;
}

export interface IAdEventListener {
  [key: string]: Array<(ad?: Ad) => void>;
}

export interface IAd {
  public configuration: IAdConfiguration;
  public container: HTMLElement;
  public network: INetwork;

  public render(): Promise<void>;
  public refresh(): Promise<void>;
  public clear(): Promise<void>;
  public destroy(): Promise<void>;

  public freeze(): void;
  public unfreeze(): Promise<void>;
}

export interface IVendor {
  name: string;
}

export interface IBucketConfiguration {
  plugins?: IPlugin[];
  vendors?: IVendor[];
  defaults?: {};
}

export type IPluginHook = (IAd) => void;

export interface IPlugin {
  name: string;

  onCreate?: IPluginHook;

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

  createAd(HTMLElement): INetworkInstance;

  resetCorrelator(): Promise<void>;

  [key: string]: any;
}

export interface IAdConfiguration {
  adPath?: string;

  targeting?: object;
  sizes?: any[];

  offset?: number;

  autoRender?: boolean;

  autoRefresh?: boolean;
  refreshRate?: number;

  refreshOnBreakpoint?: boolean;
  breakpoints?: number[];
}


