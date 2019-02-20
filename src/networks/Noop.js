import {
  INetwork,
} from '../';

const Noop: INetwork = {
  public async createAd() {}

  public async renderAd() {}

  public async refreshAd() {}

  public async destroyAd() {}
}

export default Noop;
