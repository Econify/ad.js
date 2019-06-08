import Ad from './Ad';
import MainSingleton from './index';
import { IAdConfiguration, INetwork, IPageConfiguration, IPlugin, IVendor } from './types';

export default class Page {
  public ads: Ad[] = [];

  public promiseStack: Promise<void> = Promise.resolve();
  public plugins: IPlugin[] = [];
  public vendors: IVendor[] = [];
  public defaults: IAdConfiguration = {};

  constructor(public network: INetwork, providedConfiguration: IPageConfiguration = {}) {
    const { defaults, plugins, vendors } = providedConfiguration;
    const globalAdJS = (window as any).AdJS;

    if (defaults) {
      this.defaults = defaults;
    }

    if (plugins) {
      this.plugins = plugins;
    }

    if (vendors) {
      this.vendors = vendors;
    }

    // This should be pushed to the AdJS.cmd once enabled
    if (globalAdJS) {
      if (!globalAdJS.pages) {
        globalAdJS.pages = [];
      }

      globalAdJS.pages.push(this);
    }
  }

  public Ad(el: HTMLElement, options?: IAdConfiguration): Ad {
    return this.createAd(el, options);
  }

  public createAd(el: HTMLElement, options?: IAdConfiguration): Ad {
    const ad = new Ad(this, el, options);

    this.ads.push(ad);

    return ad;
  }

  private get correlatorId(): void | string {
    const { correlatorId } = this.ads[0];

    return correlatorId;
  }

  public async setAsActive() {
    if (!this.correlatorId || MainSingleton.activeCorrelatorId === this.correlatorId) {
      return;
    }

    this.ads.forEach(
      (ad: Ad) => {
        ad.clear();
      },
    );

    await this.network.resetCorrelator();
  }
}
