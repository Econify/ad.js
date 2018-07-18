import { Ad, AdConfiguration } from './Ad';
import Default from './networks/Default';
import DFP from './networks/DFP';
import GPT from './networks/GPT';
import { NetworkInterface } from './NetworkTypes';
import { PluginInterface } from './PluginTypes';

export interface GlobalConfiguration {
  network: NetworkInterface;
  plugins?: PluginInterface[];
  defaults?: AdConfiguration;
}

export class ADJS {
  public static get isConfigured(): boolean {
    return !!this.configuration;
  }

  private static get network(): NetworkInterface {
    return this.configuration.network;
  }

  public static get defaults(): AdConfiguration {
    return this.configuration.defaults || {};
  }

  public static Ad = Ad;
  public static Plugins = {};
  public static Networks = {
    Default,
    DFP,
    GPT,
  };

  public static configure(configuration: GlobalConfiguration) {
    const {
      network = new ADJS.Networks.Default(),
      plugins = [],
      defaults = {},
    } = configuration;

    this.configuration = { network, plugins, defaults };
  }

  public static find() {}
  public static newPage() {}
  private static plugins: PluginInterface[];
  private static configuration: GlobalConfiguration;
}

export default ADJS;
