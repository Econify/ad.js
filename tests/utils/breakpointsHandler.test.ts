import { ICurrentConfines } from '../../src/types';
import breakpointHandler from '../../src/utils/breakpointHandler';

describe('breakpointHandler', async () => {
  let expected: ICurrentConfines = {};
  const configuration: any = {
    breakpoints: {
      mobile: { from: 0, to: 767 },
      tablet: { from: 768, to: 999 },
      desktop: { from: 1000, to: Infinity },
    },
    sizes: {},
  };

  it('returns correct results per screen size', () => {
    // @ts-ignore
    global.innerWidth = 500;
    const mobile = breakpointHandler(configuration.sizes, configuration.breakpoints);
    expected = { from: 0, to: 767, breakpoint: 'mobile', sizesSpecified: false };
    expect(mobile).toEqual(expected);

    // @ts-ignore
    global.innerWidth = 980;
    const tablet = breakpointHandler(configuration.sizes, configuration.breakpoints);
    expected = { from: 768, to: 999, breakpoint: 'tablet', sizesSpecified: false };
    expect(tablet).toEqual(expected);

    // @ts-ignore
    global.innerWidth = 1001;
    const desktop = breakpointHandler(configuration.sizes, configuration.breakpoints);
    expected = { from: 1000, to: Infinity, breakpoint: 'desktop', sizesSpecified: false };
    expect(desktop).toEqual(expected);
  });

  it('returns sizesSpecified=true when appropriate', () => {
    configuration.sizes.mobile = [[250, 250]];
    configuration.sizes.tablet = [];
    configuration.sizes.desktop = [[500, 500]];

    // @ts-ignore
    global.innerWidth = 500;
    const mobile = breakpointHandler(configuration.sizes, configuration.breakpoints);
    expected = { from: 0, to: 767, breakpoint: 'mobile', sizesSpecified: true };
    expect(mobile).toEqual(expected);

    // @ts-ignore
    global.innerWidth = 980;
    const tablet = breakpointHandler(configuration.sizes, configuration.breakpoints);
    expected = { from: 768, to: 999, breakpoint: 'tablet', sizesSpecified: false };
    expect(tablet).toEqual(expected);

    // @ts-ignore
    global.innerWidth = 1001;
    const desktop = breakpointHandler(configuration.sizes, configuration.breakpoints);
    expected = { from: 1000, to: Infinity, breakpoint: 'desktop', sizesSpecified: true };
    expect(desktop).toEqual(expected);
  });

  it('returns { sizesSpecified: true } when breakpoints not provided', () => {
    delete configuration.breakpoints;

    // @ts-ignore
    global.innerWidth = 500;
    const mobile = breakpointHandler(configuration.sizes, configuration.breakpoints);
    expected = { sizesSpecified: true };
    expect(mobile).toEqual(expected);
  });
});
