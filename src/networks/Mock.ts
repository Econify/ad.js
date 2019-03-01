import Ad from '../Ad';

import {
  INetwork,
  INetworkInstance,
} from '../../';

const MockAdInstance: INetworkInstance = {
  async render() {
  },

  async destroy() {
  },

  async clear() {
  },
};

const MockAdNetwork: INetwork = {
  name: 'Mock Network',

  createAd(ad: Ad): INetworkInstance {
    return MockAdInstance;
  },

  async resetCorrelator() {
    return Promise.resolve();
  },
};

export default MockAdNetwork;
