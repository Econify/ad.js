"use strict";
var _a = require('./Page'), Page = _a.Page, Bucket = _a.Bucket;
var isServer_1 = require("./utils/isServer");
var LOADED_MODULES = {
    Plugins: {},
    Networks: {},
    Vendors: {}
};
var _ADJS = isServer_1["default"]() ? LOADED_MODULES : window._ADJS = window._ADJS || LOADED_MODULES;
_ADJS.Plugins = _ADJS.Plugins || LOADED_MODULES.Plugins;
_ADJS.Vendors = _ADJS.Vendors || LOADED_MODULES.Vendors;
_ADJS.Networks = _ADJS.Networks || LOADED_MODULES.Networks;
var PluginsHandler = {
    get: function (plugins, property) {
        var cleanedProperty = String(property);
        if (isServer_1["default"]()) {
            if (typeof property === 'symbol') {
                return {};
            }
            throw new Error("\n        Using the Networks or Plugins property on AdJS is only available when installing via script.\n        If you are compiling the AdJS library locally within your project, use require to\n        specify the plugin directly.\n\n        Example:\n          import DFP from 'adjs/networks/DFP';\n          import AutoRender from 'adjs/plugins/AutoRender';\n\n          new AdJS.Page(DFP, {\n            plugins: [\n              AutoRender,\n            ],\n          });\n      ");
        }
        if (!plugins[cleanedProperty]) {
            throw new Error("\n        The " + cleanedProperty + " Plugin or Network has not been included in your bundle. Please\n        manually include the script tag associated with this plugin or network. You can see\n        documentation on https://adjs.dev.\n\n        Example:\n          <script src=\"https://cdn.adjs.dev/core.min.js\"></script>\n          <script src=\"https://cdn.adjs.dev/DFP.min.js\"></script>\n          <script src=\"https://cdn.adjs.dev/AutoRender.min.js\"></script>\n\n          <script>\n            new AdJS.Page(AdJS.Networks.DFP, {\n              plugins: [\n                AdJS.Plugins.AutoRender,\n              ],\n            });\n          </script>\n      ");
        }
        return plugins[cleanedProperty];
    }
};
var Plugins = new Proxy(_ADJS.Plugins, PluginsHandler);
var Networks = new Proxy(_ADJS.Networks, PluginsHandler);
var Vendors = new Proxy(_ADJS.Vendors, PluginsHandler);
var AdJS = {
    Page: Page,
    Bucket: Bucket,
    Plugins: Plugins,
    Networks: Networks,
    Vendors: Vendors,
    activeCorrelatorId: null
};
module.exports = AdJS;
