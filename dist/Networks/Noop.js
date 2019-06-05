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

module.exports = Noop;
