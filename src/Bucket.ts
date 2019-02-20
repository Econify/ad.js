import MainSingleton from '.';
import { IAdConfiguration, IBucketConfiguration, IExtension, INetwork, IPlugin } from '../';
import Ad from './Ad';

const DEFAULT_CONFIGURATION: IBucketConfiguration = {
  plugins: [],
  extensions: [],
};

class Bucket {
  public ads: Ad[] = [];

  public promiseStack: Promise<void> = Promise.resolve();
  private plugins: IPlugin[] = [];
  private extensions: IExtension[] = [];
  private defaults: IAdConfiguration;

  constructor(public network: INetwork, providedConfiguration: IBucketConfiguration) {
    const configuration = {
      ...DEFAULT_CONFIGURATION,
      ...providedConfiguration,
    };

    this.defaults = configuration.defaults;
    this.plugins = configuration.plugins;
    this.extensions = configuration.extensions;
  }

  /*
  private tasksForReady: Promise<void>;

  public async onReady(fn: () => void): Promise<void> {
    if (this.tasksForReady) {
      await this.tasksForReady;

      fn();
    }

    this.tasksForReady = Promise.all(
      this.plugins.map(
        (plugin) => plugin.prepare()
      )
    );

    await this.tasksForReady;

    fn();
  }
  */

  public Ad(el: HTMLElement, options?: IAdConfiguration): Ad {
    return this.createAd(el, options);
  }

  public createAd(el: HTMLElement, options?: IAdConfiguration): Ad {
    const ad = new Ad(this, el, options);

    this.ads.push(ad);

    return ad;
  }

  public async setAsActive() {
    const { correlatorId: bucketCorrelatorId } = this.ads[0];

    if (MainSingleton.activeCorrelatorId === bucketCorrelatorId) {
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
