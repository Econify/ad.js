export type ProviderArguments = {
  el: HTMLElement,
  slot: string,
  adCode: string,
  targeting: {},
}

export type ProviderInstance = {
  id: string,
  el: HTMLElement,
  slot: string,
}

export interface ProviderInterface = {
  createAd(ProviderArguments): Promise<ProviderInstance>,
  renderAd(ProviderInstance): Promise<void>,
  refreshAd(ProviderInstance): Promise<void>,
  destroyAd(ProviderInstance): Promise<void>,
};
