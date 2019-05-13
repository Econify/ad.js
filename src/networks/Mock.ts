import {
  IAd,
  INetwork,
  INetworkInstance,
} from '../types';

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

  createAd(ad: IAd): INetworkInstance {
    return MockAdInstance;
  },

  async resetCorrelator() {
    return Promise.resolve();
  },
};

export = MockAdNetwork;
