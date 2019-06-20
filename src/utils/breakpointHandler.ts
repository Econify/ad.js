import { IAdBreakpoints, IAdSizes, ICurrentConfines } from '../types';
import isBetween from './isBetween';

/*
  breakpointHandler
  If no breakpoints provided, return truthy value {} (when called by DFP)
  Determine current breakpoint viewport falls within
*/
const breakpointHandler = (sizes: IAdSizes | any, breakpoints?: IAdBreakpoints): ICurrentConfines => {
  let currentConfines: ICurrentConfines = {};

  if (!breakpoints) {
    return {};
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
