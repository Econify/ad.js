import {
  NetworkInterface,
  NetworkArguments,
  NetworkInstance,
} from './NetworkTypes';

import loadScript from './lib/loadScript';

class GPT implements NetworkInterface {
  constructor() {
    loadScript('https://www.googletagservices.com/tag/js/gpt.js');
  }

  async createAd() {}
  async renderAd() {}
  async refreshAd() {}
  async destroyAd() {}
}
