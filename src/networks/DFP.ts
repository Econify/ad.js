import { INetwork, INetworkInstance } from '../../';
import loadScript from '../utils/loadScript';

declare global {
  // tslint:disable-next-line
  interface Window { googletag: any; }
}

class DfpAd implements INetworkInstance {
  private id: string;
  private slot!: googletag.Slot;

  constructor(private el: HTMLElement) {
    DoubleClickForPublishers.prepare();

    const { id } = el;

    if (!id) {
      throw new Error('Ad does not have an id');
    }

    this.id = id;

    googletag.cmd.push(() => {
      // const sizes = [[468, 60], [728, 90], [300, 250]];
      const sizes = [[300, 250], [300, 600], [300, 300]];
      this.slot =
        googletag.defineSlot('/7231/nbcnews/politics', sizes, this.id)
          .addService(googletag.pubads())
          .setTargeting('gender', 'male')
          .setTargeting('age', '20-30');

      googletag.display(this.id);
    });
  }

  public render(): Promise<void> {
    return new Promise(
      (resolve) => {
        googletag.cmd.push(() => {
          const { slot } = this;

          googletag.pubads().addEventListener(
            'slotRenderEnded',

            (event: any) => {
              if (event.slot === slot) {
                resolve();
              }
            },
          );

          /*
          googletag.pubads().addEventListener(
            'slotOnload',

            (event: any) => {
              if (event.slot === slot) {
                console.log('SLOT LOADED');
              }
            },
          );
           */

          googletag.pubads().refresh([slot], { changeCorrelator: false });
        });
      },
    );
  }

  public clear(): Promise<void> {
    return new Promise((resolve) => {
      googletag.cmd.push(() => {
        const { slot } = this;

        googletag.pubads().clear([slot]);

        resolve();
      });
    });
  }

  public refresh(): Promise<void> {
    return new Promise((resolve) => {
      googletag.cmd.push(() => {
        const { slot } = this;

        googletag.pubads().refresh([slot], { changeCorrelator: false });

        resolve();
      });
    });
  }

  // Cannot undo this action
  public destroy(): Promise<void> {
    return new Promise((resolve) => {
      googletag.cmd.push(() => {
        const { slot } = this;

        googletag.destroySlots([slot]);

        resolve();
      });
    });
  }
}

function loadGPT() {
  loadScript('https://www.googletagservices.com/tag/js/gpt.js', { async: true });

  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];

  window.googletag.cmd.push(() => {
    googletag.pubads().disableInitialLoad();
    googletag.pubads().enableAsyncRendering();
    googletag.enableServices();
  });
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
