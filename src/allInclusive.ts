import networkList from './networks/index';
import Page from './Page';
import pluginList from './plugins/index';
import { ILoadedModulesCache, LoadedModules } from './types';
import isServer from './utils/isServer';

const LOADED_MODULES: ILoadedModulesCache = {
  Plugins: pluginList,
  Networks: networkList,
  Vendors: {},
};

const _ADJS: ILoadedModulesCache = isServer() ? LOADED_MODULES : window._ADJS = window._ADJS || LOADED_MODULES;

_ADJS.Plugins = LOADED_MODULES.Plugins;
_ADJS.Vendors = _ADJS.Vendors || LOADED_MODULES.Vendors;
_ADJS.Networks = LOADED_MODULES.Networks;

const PluginsHandler = {
  get(plugins: LoadedModules, property: string | symbol): any {
    const cleanedProperty: string = String(property);

    if (isServer()) {
      if (typeof property === 'symbol') {
        return {};
      }

      throw new Error(`
        Using the Networks or Plugins property on AdJS is only available when installing via script.
        If you are compiling the AdJS library locally within your project, use require to
        specify the plugin directly.

        Example:
          import DFP from 'adjs/networks/DFP';
          import AutoRender from 'adjs/plugins/AutoRender';

          new AdJS.Page(DFP, {
            plugins: [
              AutoRender,
            ],
          });
      `);
    }

    return plugins[cleanedProperty];
  },
};

const Plugins = new Proxy(_ADJS.Plugins, PluginsHandler);
const Networks = new Proxy(_ADJS.Networks, PluginsHandler);
const Vendors = new Proxy(_ADJS.Vendors, PluginsHandler);

const AdJS = {
  Page,
  Bucket: Page,
  Plugins,
  Networks,
  Vendors,

  activeCorrelatorId: null,
};

/*
 * TODO:
 *  Allow a user to queue up commands before
 *  AdJS has loaded
 *
 * Example:

  if (!isServer()) {
    AdJS.cmd = window._AdJS.cmd || [];

    AdJS.cmd.forEach((fn) => {
      fn();
    });

    AdJS.cmd = [];

    AdJS.cmd.push = (fn) => {
      fn();
    }
  }
*/

export default AdJS;
