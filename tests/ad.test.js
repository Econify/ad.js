import AdJS from '../src';
import insertElement from 'utils/insertElement';
import MockNetwork from 'networks/Mock';

describe('Ad', () => {
  let page;
  let ad;
  const el = insertElement('div', {}, document.body);

  beforeEach(() => {
    global.AdJS = AdJS;
    page = new AdJS.Page(MockNetwork);

    ad = page.createAd(el, { sizes: [], breakpoints: {}, targeting: { existing: true } });
  });

  describe('configuration', () => {
    it('should have the correct key vals', async () => {
      const overrides = {
        someNewKey: 'true',
        targeting: {
          newValues: 'moreTrue',
        },
      };

      const expected = {
        sizes: {},
        breakpoints: {},
        targeting: {
          existing: true,
          newValues: 'moreTrue'
        },
        someNewKey: 'true',
      }

      const ad = page.createAd(el, overrides);
      expect(ad.configuration).toEqual(expected);
    });
  });

  describe('render()', () => {
    it('should render ad & trigger async hooks', async () => {
      let rendered;
      ad.on('render', () => { rendered = true; });
      await ad.render();
      expect(rendered).toEqual(true);
      expect(ad.state.rendering).toEqual(false);
      expect(ad.state.rendered).toEqual(true);
    });
  });

  describe('refresh()', () => {
    it('should refresh ad & trigger async hooks', async () => {
      let refreshed;
      ad.on('refresh', () => { refreshed = true; });
      await ad.refresh();
      expect(refreshed).toEqual(true);
      expect(ad.state.refreshing).toEqual(false);
      expect(ad.state.refreshed).toEqual(true);
    });
  });

  describe('destroy()', () => {
    it('should destroy ad & trigger async hooks', async () => {
      let destroyed;
      ad.after('destroy', () => { destroyed = true; });
      await ad.destroy();
      expect(destroyed).toEqual(true);
      expect(ad.state.destroying).toEqual(false);
      expect(ad.state.destroyed).toEqual(true);
    });
  });

  describe('freeze()', () => {
    it('should freeze ad & trigger async hooks', async () => {
      let frozen;
      ad.on('freeze', () => { frozen = true; });
      await ad.freeze();
      expect(frozen).toEqual(true);
      expect(ad.state.frozen).toEqual(true);
    });
  });

  describe('unfreeze()', () => {
    it('should unfreeze ad', async () => {
      let unfrozen;

      ad.on('unfreeze', () => { unfrozen = true; });
      ad.freeze();
      ad.unfreeze();

      expect(unfrozen).toEqual(true);
      expect(ad.state.frozen).toEqual(false);
    });

    /*
    it('should trigger backlogged events when provided replayEventsWhileFrozen option', async () => {
      let refreshed = false;

      ad.freeze();
      ad.refresh();

      ad.on('refresh', () => {
        refreshed = true;
      });

      await ad.unfreeze({ replayEventsWhileFrozen: true });

      expect(refreshed).toEqual(true);
    });
   */

    it('should not trigger backlogged events when not provided replayEventsWhileFrozen option', async () => {
      let backlogged = true;
      ad.on('refresh', () => { backlogged = false; });
      ad.freeze();
      ad.refresh();
      await ad.unfreeze();
      expect(backlogged).toEqual(true);
    });
  });

  describe('Life cycle methods', () => {
    it('should execute methods in order they were called in', (done) => {
      let count = 0;
      let renderIndex;
      let refreshIndex;
      let clearIndex;
      let destroyIndex;

      ad.on('render', () => {
        renderIndex = ++count;
      });

      ad.on('refresh', () => {
        refreshIndex = ++count;
      });

      ad.on('destroy', () => {
        destroyIndex = ++count;
      });

      ad.on('clear', () => {
        clearIndex = ++count;
      });

      ad.render();
      ad.refresh();
      ad.clear();
      ad.destroy();

      ad.after('destroy', () => {
        expect(renderIndex).toEqual(1);
        expect(refreshIndex).toEqual(2);
        expect(clearIndex).toEqual(3);
        expect(destroyIndex).toEqual(4);

        done();
      });
    });
  });
});
