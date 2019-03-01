import {
  INetwork,
  INetworkInstance,
} from '../../';

const NoopAd: INetworkInstance = {
  async render() {},
  async destroy() {},
  async refresh() {},
  async clear() {},
};

const Noop: INetwork = {
  name: 'The Does Absolutely Nothing Network',

  createAd(el: HTMLElement) {
    return NoopAd;
  },

  async resetCorrelator() {},
};

export default Noop;
