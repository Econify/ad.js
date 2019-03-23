import { IAd, IPlugin } from '../types';

import stickybits from 'stickybits';

const StickyPlugin: IPlugin = {
  name: 'Sticky Ads',

  onCreate(ad: IAd) {
    const stickybit = stickybits(ad.container);

    ad.pluginStorage.stickybit = stickybit;
  },

  onDestroy(ad: IAd) {
    ad.pluginStorage.stickybit.cleanup();

    delete ad.pluginStorage.stickybit;
  },
};

export default StickyPlugin;
