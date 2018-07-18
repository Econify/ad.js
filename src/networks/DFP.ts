import DefaultNetwork from './Default';

class DFP extends DefaultNetwork {
  constructor() {
    super();
    this.loadScript('...');
  }

  public async createAd(args) { return super.createAd(args); }
  public async renderAd() {}
  public async refreshAd() {}
  public async destroyAd() {}
}

export default DFP;
