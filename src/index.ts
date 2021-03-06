import { ILoadedModulesCache, IPageConfiguration, LoadedModules } from './types';
import loadScript from './utils/loadScript';

import Page from './Page';
import isServer from './utils/isServer';

const LOADED_MODULES: ILoadedModulesCache = {
  Plugins: {},
  Networks: {},
  Vendors: {},
};

const _ADJS: ILoadedModulesCache = isServer() ? LOADED_MODULES : window._ADJS = window._ADJS || LOADED_MODULES;

_ADJS.Plugins = _ADJS.Plugins || LOADED_MODULES.Plugins;
_ADJS.Vendors = _ADJS.Vendors || LOADED_MODULES.Vendors;
_ADJS.Networks = _ADJS.Networks || LOADED_MODULES.Networks;

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

    if (!plugins[cleanedProperty]) {
      throw new Error(`
        The Plugin or Network has not been included in your bundle.
        Please manually include the script tag associated with this plugin or network.

        Example:
          <script src="https://cdn.adjs.dev/core.min.js"></script>
          <script src="https://cdn.adjs.dev/DFP.min.js"></script>
          <script src="https://cdn.adjs.dev/AutoRender.min.js"></script>

          <script>
            new AdJS.Page(AdJS.Networks.DFP, {
              plugins: [
                AdJS.Plugins.AutoRender,
              ],
            });
          </script>
      `);
    }

    return plugins[cleanedProperty];
  },
};

const Plugins = new Proxy(_ADJS.Plugins, PluginsHandler);
const Networks = new Proxy(_ADJS.Networks, PluginsHandler);
const Vendors = new Proxy(_ADJS.Vendors, PluginsHandler);
const pages: IPageConfiguration[] = [];
const Debug = () => {
  loadScript('https://unpkg.com/adjs@latest/umd/debug.production.min.js', { async: true, defer: true });
  return 'Loading developer tools...';
};

const AdJS = {
  Page,
  pages,
  Bucket: Page,
  Plugins,
  Networks,
  Vendors,
  DEBUG: Debug,
  activeCorrelatorId: null,
  VERSION: '__VERSION__',
};

if (!isServer()) {
  (window as any)[`AdJS`] = AdJS;
}

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
