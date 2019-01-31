import {
  NetworkArguments,
  NetworkInstance,
  NetworkInterface,
} from '../NetworkTypes';

import loadScript from '../lib/loadScript';

class Default implements NetworkInterface {
  public loadScript = loadScript;

  constructor() {}

  public async createAd({ id, el, slot }) { return { id, el, slot }; }
  public async renderAd() {}
  public async refreshAd() {}
  public async destroyAd() {}
}

export default Default;
