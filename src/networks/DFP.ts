import { INetwork, INetworkInstance } from '../../';
import loadScript from '../utils/loadScript';

declare global {
  // tslint:disable-next-line
  interface Window { googletag: any; }
}

class DfpAd implements INetworkInstance {
  private id: string;
  private slot: googletag.Slot;

  constructor(private el: HTMLElement) {
    DoubleClickForPublishers.prepare();

    const id = el.getAttribute('data-ad-id');

    if (!id) {
      throw new Error('Ad does not have an id');
    }

    this.id = id;

    this.slot = googletag.defineSlot('/1234567/sports', [160, 600], this.id);

    this.slot.addService(googletag.pubads());
  }

  public render(): Promise<void> {
    return new Promise(
      (resolve) => {
        const { slot } = this;

        googletag.pubads().addEventListener(
          'slotRenderEnded',

          (event: any) => {
            if (event.slot === slot) {
              console.log('SLOT RENDERED');
            }
          },
        );

        googletag.pubads().addEventListener(
          'slotOnloadEvent',

          (event: any) => {
            if (event.slot === slot) {
              console.log('SLOT LOADED');
            }
          },
        );

        googletag.display(this.id);

        resolve();
    });
  }

  public clear(): Promise<void> {
    const { slot } = this;

    googletag.pubads().clear([slot]);

    return Promise.resolve();
  }

  public refresh(): Promise<void> {
    const { slot } = this;

    googletag.pubads().refresh([slot], { changeCorrelator: false });

    return Promise.resolve();
  }

  // Cannot undo this action
  public destroy(): Promise<void> {
    const { slot } = this;

    googletag.destroySlots([slot]);

    return Promise.resolve();
  }
}

function loadGPT() {
  loadScript('https://www.googletagservices.com/tag/js/gpt.js', { async: true });

  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
}

const DoubleClickForPublishers: INetwork = {
  name: 'DoubleClick for Publishers',
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
