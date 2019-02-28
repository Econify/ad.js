export type Maybe<T> = T | void;

export interface IEventType {
  [key: string]: string;
}

export interface IAd {
  public network: INetwork;

  public render(): Promise<void>;
  public refresh(): Promise<void>;
  public clear(): Promise<void>;
  public destroy(): Promise<void>;

  public freeze(): void;
  public unfreeze(): Promise<void>;
}

export interface IExtension {
  name: string;

  [key: string]: (IAd) => Promise<void>;
}

export interface IBucketConfiguration {
  plugins?: IPlugin[];
  extensions?: IExtension[];
  defaults?: {};
}

export interface IPlugin {
  name: string;
  prepare: () => Maybe<Promise>;
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


