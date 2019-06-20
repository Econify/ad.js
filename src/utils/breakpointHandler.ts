import { IAdBreakpoints, IAdSizes, ICurrentConfines } from '../types';
import isBetween from './isBetween';

const breakpointHandler = (sizes: IAdSizes | any, breakpoints?: IAdBreakpoints): ICurrentConfines => {
  let currentConfines: ICurrentConfines = {};

  if (!breakpoints) {
    // Ad is not using responsive plugin
    return { sizesSpecified: true };
  }

  Object.keys(breakpoints).forEach((key) => {
    const { from, to } = breakpoints[key];

    if (isBetween(window.innerWidth, from, to)) {
      currentConfines = {
        from,
        to,
        breakpoint: key,
        sizesSpecified: !!(sizes[key] && sizes[key].length > 0),
      };
    }
  });

  return currentConfines;
};

export default breakpointHandler;
