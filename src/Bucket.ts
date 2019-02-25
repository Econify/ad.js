import MainSingleton from '.';
import { IAdConfiguration, IBucketConfiguration, IExtension, INetwork, IPlugin } from '../';
import Ad from './Ad';

const DEFAULT_CONFIGURATION: IBucketConfiguration = {
  plugins: [],
  extensions: [],
  defaults: {},
};

class Bucket {
  public ads: Ad[] = [];

  public promiseStack: Promise<void> = Promise.resolve();
  public plugins: IPlugin[] = [];
  public extensions: IExtension[] = [];
  public defaults: IAdConfiguration;

  constructor(public network: INetwork, providedConfiguration: IBucketConfiguration) {
    this.defaults =
      providedConfiguration.defaults || DEFAULT_CONFIGURATION.defaults;

    this.plugins =
      providedConfiguration.plugins || DEFAULT_CONFIGURATION.plugins;

    this.extensions =
      providedConfiguration.extensions || DEFAULT_CONFIGURATION.extensions;
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
