import Responsive from '../../src/plugins/Responsive';
import { ICurrentConfines } from '../../src/types';

describe('ResponsivePlugin', () => {
  const ad = {
    configuration: {
      breakpoints: {},
      sizes: {},
    },
    container: {},
    el: {},
    network: 'DFP',
    render: () => { },
    refresh: jest.fn(() => { }),
    clear: () => { },
    destroy: () => { },
    freeze: () => { },
    unfreeze: () => { },
  };

  it('creates two identical instances', () => {
    // @ts-ignore
    const responsivePlugin = new Responsive(ad);
    // @ts-ignore
    const responsivePlugin2 = new Responsive(ad);
    expect(responsivePlugin).toEqual(responsivePlugin2);
  });

  describe('#beforeCreate', () => {
    it('throws AdJs error when breakpoints not provided', () => {
      try {
        // @ts-ignore
        const responsivePlugin = new Responsive(ad);
        delete ad.configuration.breakpoints;
        responsivePlugin.beforeCreate(ad);
      } catch (e) {
        expect(e.code).toEqual('MISCONFIGURATION');
        ad.configuration.breakpoints = {};
      }
    });

    it('sets currentConfines correctly', () => {
      // @ts-ignore
      const responsivePlugin = new Responsive(ad);
      let expected: ICurrentConfines = {};

      ad.configuration.sizes = {
        mobile: [],
      };

      ad.configuration.breakpoints = {
        mobile: { from: 0, to: 767 },
        tablet: { from: 768, to: 999 },
        desktop: { from: 1000, to: Infinity },
      };

      // @ts-ignore
      global.innerWidth = 500;
      responsivePlugin.beforeCreate(ad);
      expected = { from: 0, to: 767, breakpoint: 'mobile', sizesSpecified: false };
      expect(responsivePlugin.currentConfines).toEqual(expected);
    });
  });

  describe('#isRefreshDisabled', () => {
    it('returns false if refreshOnBreakpoint not specified', () => {
      // @ts-ignore
      const responsivePlugin = new Responsive(ad);
      const value = responsivePlugin.isRefreshDisabled();
      expect(value).toEqual(false);
    });

    it('returns true if refreshOnBreakpoint specified and false', () => {
      // @ts-ignore
      ad.configuration.refreshOnBreakpoint = false;
      // @ts-ignore
      const responsivePlugin = new Responsive(ad);
      const value = responsivePlugin.isRefreshDisabled();
      expect(value).toEqual(true);
    });
  });
});
