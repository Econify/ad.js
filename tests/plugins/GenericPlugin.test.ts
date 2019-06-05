import GenericPlugin from '../../src/plugins/GenericPlugin';

describe('GenericPlugin', () => {
  it('assigns the provided ad to the plugin', () => {
    const fakeAd = { fakeProperty: 'whatever' };

    // @ts-ignore
    const plugin = new GenericPlugin(fakeAd);

    expect(plugin.ad.fakeProperty).toEqual(fakeAd.fakeProperty);
  });
});
