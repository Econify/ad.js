import AdJS from '.';
import Ad from './Ad';

import { IBucketConfiguration } from '../';

const DEFAULT_CONFIGURATION: IBucketConfiguration = {
  plugins: [],
  extensions: [],
};

class Bucket {
  public ads: Ad[] = [];
  private plugins: IPlugin[] = [];
  private extensions: IExtension[] = [];
  private defaults: IAdConfiguration;

  constructor(private network: INetwork, providedConfiguration: IBucketConfiguration) {
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

  public Ad(el: HTMLElement, options: IAdConfiguration): Ad {
    const ad = new Ad(this, el, options);

    this.ads.push(ad);

    return ad;
  }

  public async setAsActive() {
    const { correlatorId: bucketCorrelatorId } = this.ads[0];

    if (AdJS.activeCorrelatorId === bucketCorrelatorId) {
      return;
    }

    this.ads.forEach(
      (ad) => {
        ad.clear();
      }
    )

    await this.network.resetCorrelator();
  }
}

export default Bucket;
