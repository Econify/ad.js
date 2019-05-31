import { AdSizes, IAd, IAdBreakpoints, IAdTargeting, INetwork, INetworkInstance } from '../types';
import AdJsError from '../utils/AdJsError';
import loadScript from '../utils/loadScript';

declare global {
  // tslint:disable-next-line
  interface Window { googletag: any; }
}

class DfpAd implements INetworkInstance {
  private id: string;
  private slot!: googletag.Slot;

  constructor(
    private el: HTMLElement,
    path: string,
    sizes: AdSizes,
    breakpoints?: IAdBreakpoints,
    targeting?: IAdTargeting,
  ) {
    DoubleClickForPublishers.prepare();

    const { id } = el;

    if (!id) {
      throw new AdJsError('MALFORMED_REQUEST', 'Ad does not have an id');
    }

    this.id = id;

    googletag.cmd.push(() => {
      const adSizes = Array.isArray(sizes) ? sizes : [];
      this.slot = googletag.defineSlot(path, adSizes, this.id);

      if (targeting) {
        Object.entries(targeting)
          .forEach(([key, value]) => {
            this.slot.setTargeting(key, value);
          });
      }

      if (!Array.isArray(sizes) && breakpoints) {
        const sizing = googletag.sizeMapping();

        Object.entries(breakpoints).map(([device, dimensions]) => {
          sizing.addSize([dimensions.from, 1], sizes[device] || []);
        });

        this.slot.defineSizeMapping(sizing.build());
      }

      this.slot.addService(googletag.pubads());

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

            (event: googletag.events.SlotRenderEndedEvent) => {
              if (event.slot === slot) {
                resolve();
              }
            },
          );

          googletag.pubads().refresh([slot], { changeCorrelator: false });

          // if no Sizes Set
          if (!slot.getContentUrl()) {
            resolve();
          }
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

        googletag.pubads().addEventListener(
          'slotRenderEnded',

          (event: googletag.events.SlotRenderEndedEvent) => {
            if (event.slot === slot) {
              resolve();
            }
          },
        );

        // if no Sizes Set
        if (!slot.getContentUrl()) {
          resolve();
        }
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

  createAd(ad: IAd): DfpAd {
    const { el, configuration } = ad;
    const { sizes, targeting, path, breakpoints } = configuration;

    if (!sizes) {
      throw new AdJsError('MALFORMED_REQUEST', 'Sizes must be defined.');
    }

    if (!path) {
      throw new AdJsError('MALFORMED_REQUEST', 'Ad Path must be defined.');
    }

    return new DfpAd(el, path, sizes, breakpoints, targeting);
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

export = DoubleClickForPublishers;
