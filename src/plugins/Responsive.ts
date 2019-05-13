import { ICurrentConfines } from '../types';
import isBetween from '../utils/isBetween';
import throttle from '../utils/throttle';
import GenericPlugin from './GenericPlugin';

class ResponsivePlugin extends GenericPlugin {
  public currentConfines: ICurrentConfines = {};
  private EVENT_KEY: string = 'resize';
  private THROTTLE_DURATION: number = 200;
  private listener?: any;

  public beforeCreate() {
    if (this.isRefreshDisabled()) {
      return;
    }

    this.determineCurrentBreakpoint();

    this.listener = throttle(this.THROTTLE_DURATION, () => {
      const { from = 0, to = 1 } = this.currentConfines;

      if (isBetween(window.innerWidth, from, to)) {
        return;
      }

      this.determineCurrentBreakpoint();
      this.ad.refresh();
    });

    window.addEventListener(this.EVENT_KEY, this.listener);
  }

  public beforeClear() {
    window.removeEventListener(this.EVENT_KEY, this.listener);
  }

  public beforeDestroy() {
    window.removeEventListener(this.EVENT_KEY, this.listener);
  }

  public determineCurrentBreakpoint() {
    const { breakpoints } = this.ad.configuration;
    let breakpointSpecifiedForViewWidth: boolean = false;

    if (!breakpoints) {
      return;
    }

    Object.keys(breakpoints).forEach((key) => {
      const { from, to } = breakpoints[key];

      if (isBetween(window.innerWidth, from, to)) {
        breakpointSpecifiedForViewWidth = true;
        this.currentConfines = { from, to };
      }

      if (!breakpointSpecifiedForViewWidth) {
        this.currentConfines = {};
      }
    });
  }

  public isRefreshDisabled() {
    const { configuration } = this.ad;
    return (configuration.hasOwnProperty('refreshOnBreakpoint') && !configuration.refreshOnBreakpoint);
  }
}

export default ResponsivePlugin;
