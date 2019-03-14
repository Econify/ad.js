import { IAd, IPlugin } from '../../';
import insertElement from '../utils/insertElement';

const Debug: IPlugin = {
  name: 'Debug Plugin',

  onCreate(ad: IAd) {
    const { pluginStorage } = ad;

    pluginStorage.debugOverlay = insertElement('div', {
        style: `
          position: absolute;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        `,
      }, ad.container);
  },

  onRender(ad: IAd) {
    insertElement('div', {}, ad.pluginStorage.debugOverlay, 'Rendered!');
  },
};

export default Debug;
