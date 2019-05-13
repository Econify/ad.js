import ResponsivePlugin from '../../src/plugins/Responsive';

describe('ResponsivePlugin', async () => {
  const ad = {
    configuration: {
      breakpoints: {},
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
    const responsivePlugin = new ResponsivePlugin(ad);
    // @ts-ignore
    const responsivePlugin2 = new ResponsivePlugin(ad);
    expect(responsivePlugin).toEqual(responsivePlugin2);
  });

  describe('#beforeCreate', () => {
    it('throws AdJs error when breakpoints not provided', () => {
      try {
        // @ts-ignore
        const responsivePlugin = new ResponsivePlugin(ad);
        delete ad.configuration.breakpoints;
        responsivePlugin.beforeCreate(ad);
      } catch (e) {
        expect(e.code).toEqual('MISCONFIGURATION');
        ad.configuration.breakpoints = {};
      }
    });

    it('sets currentConfines correctly for all three screen sizes', () => {
      // @ts-ignore
      const responsivePlugin = new ResponsivePlugin(ad);
      ad.configuration.breakpoints = {
        mobile: { from: 0, to: 767 },
        tablet: { from: 768, to: 999 },
        desktop: { from: 1000, to: Infinity },
      };

      // @ts-ignore
      global.innerWidth = 500;
      responsivePlugin.beforeCreate(ad);
      expect(responsivePlugin.currentConfines).toEqual({ from: 0, to: 767 });

      // @ts-ignore
      global.innerWidth = 980;
      responsivePlugin.beforeCreate(ad);
      expect(responsivePlugin.currentConfines).toEqual({ from: 768, to: 999 });

      // @ts-ignore
      global.innerWidth = 1240;
      responsivePlugin.beforeCreate(ad);
      expect(responsivePlugin.currentConfines).toEqual({ from: 1000, to: Infinity });
    });
  });

  describe('#isRefreshDisabled', () => {
    it('returns false if refreshOnBreakpoint not specified', () => {
      // @ts-ignore
      const responsivePlugin = new ResponsivePlugin(ad);
      const value = responsivePlugin.isRefreshDisabled();
      expect(value).toEqual(false);
    });

    it('returns true if refreshOnBreakpoint specified and false', () => {
      // @ts-ignore
      ad.configuration.refreshOnBreakpoint = false;
      // @ts-ignore
      const responsivePlugin = new ResponsivePlugin(ad);
      const value = responsivePlugin.isRefreshDisabled();
      expect(value).toEqual(true);
    });
  });
});
