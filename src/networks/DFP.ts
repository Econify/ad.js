import { AdSizes, IAd, IAdBreakpoints, IAdTargeting, INetwork, INetworkInstance, LOG_LEVELS } from '../types';
import breakpointHandler from '../utils/breakpointHandler';
import dispatchEvent from '../utils/dispatchEvent';
import loadScript from '../utils/loadScript';

declare global {
  // tslint:disable-next-line
  interface Window { googletag: any; }
}

class DfpAd implements INetworkInstance {
  private id: string;
  private slot!: googletag.Slot;
  private sizes: AdSizes;
  private breakpoints?: IAdBreakpoints;

  constructor(private ad: IAd) {
    DoubleClickForPublishers.prepare();

    const {
      el: { id },
      configuration: { sizes, targeting, path, breakpoints, fluid },
    } = ad;

    if (!id) {
      throw new Error('Ad does not have an id');
    }

    if (!sizes) {
      throw new Error('Sizes must be defined.');
    }

    if (!path) {
      throw new Error('Ad Path must be defined.');
    }

    this.id = id;
    this.sizes = sizes;
    this.breakpoints = breakpoints;

    googletag.cmd.push(() => {
      this.slot = googletag.defineSlot(path,  Array.isArray(sizes) ? sizes : [0, 0], this.id);

      if (targeting) {
        Object.entries(targeting)
          .forEach(([key, value]) => {
            this.slot.setTargeting(key, value);
          });

        dispatchEvent(
          Number(this.id.substring(this.id.length, this.id.length - 1)),
          LOG_LEVELS.INFO,
          'DFP Network',
          'Targeting detected for ad. Adding to configuration.',
        );
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
    return this.refresh();
  }

  public clear(): Promise<void> {
    return new Promise((resolve) => {
      googletag.cmd.push(() => {
        const { slot } = this;

        googletag.pubads().clear([slot]);

        this.ad.isEmpty = true;
        resolve();
      });
    });
  }

  // TODO: Clean up event listeners
  public refresh(): Promise<void> {
    return new Promise(
      (resolve) => {
        if (!breakpointHandler(this.sizes, this.breakpoints).sizesSpecified) {
          // console.log(' LINE 100  ()()()()()((');
          this.clear().then(resolve);

          return;
        }

        googletag.cmd.push(() => {
          const { slot } = this;

          googletag.pubads().addEventListener(
            'slotRenderEnded',

            (event: googletag.events.SlotRenderEndedEvent) => {
              // console.log(' LINE 113  ()()()()()((');
              if (event.slot === slot) {
                // console.log(' LINE 115  ()()()()()((');
                this.ad.isEmpty = event.isEmpty;

                dispatchEvent(
                  Number(this.id.substring(this.id.length, this.id.length - 1)),
                  LOG_LEVELS.INFO,
                  'DFP Network',
                  'Ad slot has been rendered.',
                );

                // googletag.pubads().refresh([slot], { changeCorrelator: false });
                resolve();
              }
            },
          );

          googletag.pubads().refresh([slot], { changeCorrelator: false });

          // console.log(' LINE 133  ()()()()()((', slot.getContentUrl());
          if (!slot.getContentUrl()) {
            // console.log(' LINE 135  ()()()()()((', slot);
            this.ad.isEmpty = true;

            dispatchEvent(
              Number(this.id.substring(this.id.length, this.id.length - 1)),
              LOG_LEVELS.WARN,
              'DFP Network',
              'Ad sizes missing. Bypassing ad.',
            );
            resolve();
          }
        });
      },
    );
  }

  // Cannot undo this action
  public destroy(): Promise<void> {
    return new Promise((resolve) => {
      googletag.cmd.push(() => {
        const { slot } = this;

        googletag.destroySlots([slot]);

        this.ad.isEmpty = true;
        resolve();
      });
    });
  }
}

function loadGPT() {
  if (window.googletag && window.googletag.apiReady) {
    return;
  }

  loadScript('https://securepubads.g.doubleclick.net/tag/js/gpt.js', { async: true });

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
    return new DfpAd(ad);
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
