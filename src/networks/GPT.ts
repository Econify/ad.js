import DefaultNetwork from './Default';

class GPT extends DefaultNetwork {
  constructor() {
    super();
    this.loadScript('https://www.googletagservices.com/tag/js/gpt.js');
  }

  public async createAd(args) { return super.createAd(args); }
  public async renderAd() {}
  public async refreshAd() {}
  public async destroyAd() {}
}

export default GPT;
