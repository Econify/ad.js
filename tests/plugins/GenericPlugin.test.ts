import GenericPlugin from '../../src/plugins/GenericPlugin';

describe('GenericPlugin', () => {
  // it('throws MISCONFIGURATION error when no ad provided', () => {
  //   try {
  //     // @ts-ignore
  //     const plugin = new GenericPlugin(null);
  //
  //     return plugin;
  //   } catch (e) {
  //     expect(e.code).toEqual('Misconfiguration');
  //   }
  // });

  it('assigns the provided ad to the plugin', () => {
    const fakeAd = { fakeProperty: 'whatever' };

    // @ts-ignore
    const plugin = new GenericPlugin(fakeAd);

    expect(plugin.ad.fakeProperty).toEqual(fakeAd.fakeProperty);
  });
});
