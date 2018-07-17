import {
  NetworkArguments,
  NetworkInstance,
  NetworkInterface,
} from './NetworkTypes';

import loadScript from './lib/loadScript';

class GPT implements NetworkInterface {
  constructor() {
    loadScript('https://www.googletagservices.com/tag/js/gpt.js');
  }

  public async createAd({ id, el, slot }) { return { id, el, slot }; }
  public async renderAd() {}
  public async refreshAd() {}
  public async destroyAd() {}
}
