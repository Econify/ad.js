import GenericPlugin from '../../src/plugins/GenericPlugin';

describe('GenericPlugin', () => {
  it('throws MISCONFIGURATION error when no ad provided', () => {
    try {
      // @ts-ignore
      const banana = new GenericPlugin(null);

      return banana;
    } catch (e) {
      expect(e.code).toEqual('MISCONFIGURATION');
    }
  });

  it('throws MISCONFIGURATION error when no ad provided', () => {
    const fakeAd = { fakeProperty: 'whatever' };

    // @ts-ignore
    const plugin = new GenericPlugin(fakeAd);

    expect(plugin.ad.fakeProperty).toEqual(fakeAd.fakeProperty);
  });
});
