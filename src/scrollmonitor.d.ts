declare module 'scrollmonitor' {
  export const scrollMonitor: ScrollMonitorContainer;
  export default scrollMonitor;

  export class ScrollMonitorContainer {
    public viewportTop: number;
    public viewportBottom: number;
    public viewportHeight: number;
    public documentHeight: number;

    public create: (
      watchItem: HTMLElement | object | number | NodeList | any[] | string,
      offsets?: IOffsets | number,
    ) => IWatcher;

    public update: () => void;
    public recalculateLocations: () => void;

    public createContainer: (containerEl: HTMLElement) => ScrollMonitorContainer;

    constructor(containerEl: HTMLElement);
  }

  export interface IWatcher {
    isInViewport: boolean;
    isFullyInViewport: boolean;
    isAboveViewport: boolean;
    isBelowViewport: boolean;
    top: number;
    bottom: number;
    height: number;
    watchItem: HTMLElement | object | number;
    offsets: IOffsets;

    // Events
    visibilityChange: (callback: () => void) => void;
    stateChange: (callback: () => void) => void;
    enterViewport: (callback: () => void) => void;
    fullyEnterViewport: (callback: () => void) => void;
    exitViewport: (callback: () => void) => void;
    partiallyExitViewport: (callback: () => void) => void;

    // Functions
    on: () => void;
    off: () => void;
    one: () => void;
    recalculateLocation: () => void;
    destroy: () => void;
    lock: () => void;
    unlock: () => void;
    update: () => void;
    triggerCallbacks: () => void;
  }

  export interface IOffsets {
    top?: number;
    bottom?: number;
  }
}
