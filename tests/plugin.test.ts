import AdJS from '../src';
import insertElement from 'utils/insertElement';
import MockNetwork from 'networks/Mock';
import uppercaseFirstLetter from 'utils/uppercaseFirstLetter';

const RENDER_METHODS = ['render', 'refresh', 'clear', 'destroy'];
const TEST_PLUGIN = {
  onCreate() {},
  beforeRender() {},
  onRender() {},
  afterRender() {},
  beforeRefresh() {},
  onRefresh() {},
  afterRefresh() {},
  beforeClear() {},
  onClear() {},
  afterClear() {},
  beforeDestroy() {},
  onDestroy() {},
  afterDestroy() {},
};

describe('Plugin', () => {
  describe('hooks', () => {
    let ad;
    let plugin;

    beforeEach(() => {
      const el = insertElement('div', {}, document.body);
      const bucket = new AdJS.Bucket(MockNetwork, {
        plugins: [TEST_PLUGIN],
      });

      ad = bucket.createAd(el);

      jest.spyOn(TEST_PLUGIN, 'onCreate');
      jest.spyOn(TEST_PLUGIN, 'beforeRender');
      jest.spyOn(TEST_PLUGIN, 'onRender');
      jest.spyOn(TEST_PLUGIN, 'afterRender');
      jest.spyOn(TEST_PLUGIN, 'beforeRefresh');
      jest.spyOn(TEST_PLUGIN, 'onRefresh');
      jest.spyOn(TEST_PLUGIN, 'afterRefresh');
      jest.spyOn(TEST_PLUGIN, 'beforeClear');
      jest.spyOn(TEST_PLUGIN, 'onClear');
      jest.spyOn(TEST_PLUGIN, 'afterClear');
      jest.spyOn(TEST_PLUGIN, 'beforeDestroy');
      jest.spyOn(TEST_PLUGIN, 'onDestroy');
      jest.spyOn(TEST_PLUGIN, 'afterDestroy');
    });

    afterEach(() => {
      TEST_PLUGIN.onCreate.mockRestore();
      TEST_PLUGIN.beforeRender.mockRestore();
      TEST_PLUGIN.onRender.mockRestore();
      TEST_PLUGIN.afterRender.mockRestore();
      TEST_PLUGIN.beforeRefresh.mockRestore();
      TEST_PLUGIN.onRefresh.mockRestore();
      TEST_PLUGIN.afterRefresh.mockRestore();
      TEST_PLUGIN.beforeClear.mockRestore();
      TEST_PLUGIN.onClear.mockRestore();
      TEST_PLUGIN.afterClear.mockRestore();
      TEST_PLUGIN.beforeDestroy.mockRestore();
      TEST_PLUGIN.onDestroy.mockRestore();
      TEST_PLUGIN.afterDestroy.mockRestore();
    });

    /*
    it('should have called onCreate', () => {
      expect(TEST_PLUGIN.onCreate).toHaveBeenCalled();
    });
     */

    RENDER_METHODS.forEach((method) => {
      it(`should call before${uppercaseFirstLetter(method)} before the network ${method}s the ad`, async () => {
        await ad[method]();

        expect(TEST_PLUGIN[`before${uppercaseFirstLetter(method)}`]).toHaveBeenCalled();
      });

      it(`should call on${uppercaseFirstLetter(method)} while the network is ${method}ing the ad`, async () => {
        await ad[method]();

        expect(TEST_PLUGIN[`on${uppercaseFirstLetter(method)}`]).toHaveBeenCalled();
      });

      it(`should call after${uppercaseFirstLetter(method)} after the network has finished ${method}ing the ad`, async () => {
        await ad[method]();

        expect(TEST_PLUGIN[`after${uppercaseFirstLetter(method)}`]).toHaveBeenCalled();
      });
    });
  });
});
