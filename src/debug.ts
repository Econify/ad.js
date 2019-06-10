/*
  TODO:
  import DFP from './networks/DFP';
*/

import Ad from './Ad';
import Page from './Page';
import AutoRefresh from './plugins/AutoRefresh';
import AutoRender from './plugins/AutoRender';
import DeveloperTools from './plugins/DeveloperTools';
import Responsive from './plugins/Responsive';
import Sticky from './plugins/Sticky';
import { IPlugin } from './types';

const plugins: { [key: string]: IPlugin } = {
  AutoRefresh,
  AutoRender,
  DeveloperTools,
  Responsive,
  Sticky,
};

const pluginKeys = Object.keys(plugins);

pluginKeys.forEach((plugin) => {
  if (!(window as any)[`_ADJS`].Plugins[plugin]) {

    // If user doesn't include plugin in configuration, we add it here.
    if (plugin === 'DeveloperTools') {
      (window as any)[`_ADJS`].Plugins.DeveloperTools = DeveloperTools;
    }

    return;
  }

  Object.getOwnPropertyNames(plugins[plugin].prototype).forEach((method) => {
    const value = plugins[plugin].prototype[method];

    if (typeof value === 'function') {
      (window as any)[`_ADJS`].Plugins[plugin].prototype[method] = value;
    }
  });
});

(window as any).AdJS.pages.forEach((page: Page) => {
  page.plugins.push((window as any)[`_ADJS`].Plugins.DeveloperTools);

  page.ads.forEach((ad: Ad) => {
    new (window as any)[`_ADJS`].Plugins.DeveloperTools(ad).onCreate();
  });
});
