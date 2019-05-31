import {
  IAd,
  INetwork,
  INetworkInstance,
} from '../types';

const NoopAd: INetworkInstance = {
  async render() {},
  async destroy() {},
  async refresh() {},
  async clear() {},
};

const Noop: INetwork = {
  name: 'The Does Absolutely Nothing Network',

  createAd(ad: IAd) {
    return NoopAd;
  },

  async resetCorrelator() {},
};

export default Noop;
