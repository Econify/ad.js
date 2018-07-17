export type NetworkArguments = {
  el: HTMLElement,
  slot: string,
  adCode: string,
  targeting: {},
}

export type NetworkInstance = {
  id: string,
  el: HTMLElement,
  slot: string,
}

export interface NetworkInterface {
  name?: string,
  requiredParams?: Array<string>,
  createAd(NetworkArguments): Promise<NetworkInstance>,
  renderAd(NetworkInstance): Promise<void>,
  refreshAd(NetworkInstance): Promise<void>,
  destroyAd(NetworkInstance): Promise<void>,
};
