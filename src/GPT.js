import type {
  ProviderInterface,
  ProviderArguments,
  ProviderInstance,
} from './ProviderTypes';

import loadScript from 'lib/loadScript';

class GPT implements ProviderInterface {
  constructor() {
    loadScript('https://www.googletagservices.com/tag/js/gpt.js');
  }

  async createAd() {}
  async refreshAd() {}
  async destroyAd() {}
}
