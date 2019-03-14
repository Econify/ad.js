import { IAd, IPlugin } from '../../';
import insertElement from '../utils/insertElement';

const OVERLAY_STYLE = `
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const MESSAGE_STYLE = `
  color: white;
  text-align: left;
`;

function padTime(time: number): string {
  return String(time).padStart(2, '0');
}

function insertMessage(ad: IAd, baseMessage: string): void {
  const currentDate = new Date();

  const hour = padTime(currentDate.getHours());
  const minutes = padTime(currentDate.getMinutes());
  const milliseconds = padTime(currentDate.getMilliseconds());

  const message = `[EVENT] ${baseMessage} at ${hour}:${minutes}:${milliseconds}`;

  insertElement('p', { style: MESSAGE_STYLE }, ad.pluginStorage.debugOverlay, message);
}

const Debug: IPlugin = {
  name: 'Debug Plugin',

  onCreate(ad: IAd) {
    const { pluginStorage } = ad;

    pluginStorage.debugOverlay = insertElement('div', { style: OVERLAY_STYLE }, ad.container);
  },

  onRender(ad: IAd) {
    insertMessage(ad, 'rendered');
  },

  onRefresh(ad: IAd) {
    insertMessage(ad, 'refreshed');
  },

  onClear(ad: IAd) {
    insertMessage(ad, 'cleared');
  },

  onDestroy(ad: IAd) {
    insertMessage(ad, 'destroyed');
  },
};

export default Debug;
