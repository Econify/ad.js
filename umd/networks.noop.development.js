this._ADJS = this._ADJS || {};
this._ADJS.Networks = this._ADJS.Networks || {};
this._ADJS.Networks.Noop = (function () {
'use strict';

const NoopAd = {
    async render() { },
    async destroy() { },
    async refresh() { },
    async clear() { },
};
const Noop = {
    name: 'The Does Absolutely Nothing Network',
    createAd(ad) {
        return NoopAd;
    },
    async resetCorrelator() { },
};

return Noop;

}());
//# sourceMappingURL=networks.noop.development.js.map
