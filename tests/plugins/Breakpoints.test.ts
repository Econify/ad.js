import BreakpointsPlugin from '../../src/plugins/Breakpoints';

describe('Breakpoints', async () => {
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
    const breakpointsPlugin = new BreakpointsPlugin(ad);
    // @ts-ignore
    const breakpointsPlugin2 = new BreakpointsPlugin(ad);
    expect(breakpointsPlugin).toEqual(breakpointsPlugin2);
  });

  describe('#beforeCreate', () => {
    it('throws AdJs error when breakpoints not provided', () => {
      try {
        // @ts-ignore
        const breakpointsPlugin = new BreakpointsPlugin(ad);
        delete ad.configuration.breakpoints;
        breakpointsPlugin.beforeCreate(ad);
      } catch (e) {
        expect(e.code).toEqual('MISCONFIGURATION');
        ad.configuration.breakpoints = {};
      }
    });

    it('sets currentConfines correctly for all three screen sizes', () => {
      // @ts-ignore
      const breakpointsPlugin = new BreakpointsPlugin(ad);
      ad.configuration.breakpoints = {
        mobile: { from: 0, to: 767 },
        tablet: { from: 768, to: 999 },
        desktop: { from: 1000, to: Infinity },
      };

      // @ts-ignore
      global.innerWidth = 500;
      breakpointsPlugin.beforeCreate(ad);
      expect(breakpointsPlugin.currentConfines).toEqual([0, 767]);

      // @ts-ignore
      global.innerWidth = 980;
      breakpointsPlugin.beforeCreate(ad);
      expect(breakpointsPlugin.currentConfines).toEqual([768, 999]);

      // @ts-ignore
      global.innerWidth = 1240;
      breakpointsPlugin.beforeCreate(ad);
      expect(breakpointsPlugin.currentConfines).toEqual([1000, Infinity]);
    });
  });
});
