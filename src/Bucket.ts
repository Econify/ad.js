import MainSingleton from '.';
import { IAdConfiguration, IBucketConfiguration, IExtension, INetwork, IPlugin } from '../';
import Ad from './Ad';

class Bucket {
  public ads: Ad[] = [];

  public promiseStack: Promise<void> = Promise.resolve();
  public plugins: IPlugin[] = [];
  public extensions: IExtension[] = [];
  public defaults: IAdConfiguration = {};

  constructor(public network: INetwork, providedConfiguration: IBucketConfiguration = {}) {
    const { defaults, plugins, extensions } = providedConfiguration;

    if (defaults) {
      this.defaults = defaults;
    }

    if (plugins) {
      this.plugins = plugins;
    }

    if (extensions) {
      this.extensions = extensions;
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

export default Bucket;
