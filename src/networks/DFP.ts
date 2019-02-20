import { googletag } from '@types/doubleclick-gpt';
import { INetwork, INetworkInstance } from '../../';
import loadScript from '../utils/loadScript';

declare global {
  // tslint:disable-next-line
  interface Window { googletag: any; }
}

class DfpAd implements INetworkInstance {
  private slot: googletag.Slot;

  constructor(private el: HTMLElement) {
    DoubleClickForPublishers.prepare();

    const id: string = el.getAttribute('data-ad-id');

    this.slot =
      googletag.defineSlot('/1234567/sports', [160, 600], id);
  }

  public render() {
    return new Promise(
      (resolve) => {
        const { slot } = this;

        googletag.pubads().addEventListener(
          googletag.events.SlotRenderEndedEvent,

          (event) => {
            if (event.slot === slot) {
              console.log('SLOT RENDERED');
            }
          },
        );

        googletag.pubads().addEventListener(
          googletag.events.SlotOnloadEvent,

          (event) => {
            if (event.slot === slot) {
              console.log('SLOT LOADED');
            }
          },
        );

        slot.display();

        // TODO
        resolve();
    });
  }

  public clear() {
    const { slot } = this;

    googletag.pubads().clear([slot]);
  }

  public refresh() {
    const { slot } = this;

    googletag.pubads().refresh([slot], { changeCorrelator: false });
  }

  // Cannot undo this action
  public destroy() {
    const { slot } = this;

    googletag.destroySlots([slot]);
  }
}

function loadGPT() {
  loadScript('https://www.googletagservices.com/tag/js/gpt.js', { async: true });

  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
}

const DoubleClickForPublishers: INetwork = {
  loaded: false,

  createAd(el: HTMLElement): DfpAd {
    return new DfpAd(el);
  },

  async prepare() {
    if (this.loaded) {
      return;
    }

    loadGPT();
    this.loaded = true;
  },

  async resetCorrelator() {
    googletag.pubads().updateCorrelator();
  },
};

export default DoubleClickForPublishers;
