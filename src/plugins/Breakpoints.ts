import { IAd, IAdBreakpoints } from '../types';
import AdJsError from '../utils/AdJsError';
import isBetween from '../utils/isBetween';
import throttle from '../utils/throttle';
import GenericPlugin from './GenericPlugin';

class BreakpointsPlugin extends GenericPlugin {
  public currentConfines: number[] = [];
  private EVENT_KEY: string = 'resize';
  private THROTTLE_DURATION: number = 200;

  public beforeCreate(ad: IAd) {
    const { breakpoints } = ad.configuration;

    if (!breakpoints) {
      throw new AdJsError('MISCONFIGURATION', 'Breakpoints must be provided for BreakpointsPlugin use.');
    }

    this.determineCurrentBreakpoint(breakpoints);

    window.addEventListener(this.EVENT_KEY, throttle(this.THROTTLE_DURATION, () => {
      if (isBetween(window.innerWidth, this.currentConfines[0], this.currentConfines[1])) {
        return;
      }

      console.log('Entered new breakpoint. refreshing ad...');
      this.determineCurrentBreakpoint(breakpoints);
      ad.refresh();
    }));
  }

  public determineCurrentBreakpoint(breakpoints: IAdBreakpoints) {
    const viewWidth = window.innerWidth;
    Object.keys(breakpoints).forEach((key) => {
      const { from, to } = breakpoints[key];
      if (isBetween(viewWidth, from, to)) {
        this.currentConfines = [from, to];
      }
    });
  }
}

export default BreakpointsPlugin;
