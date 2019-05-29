import Page from './Page';
import { INetwork, IPageConfiguration } from './types';

export default class Bucket extends Page {
  constructor(public network: INetwork, providedConfiguration: IPageConfiguration = {}) {
    super(network, providedConfiguration);
  }
}
