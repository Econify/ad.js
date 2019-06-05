'use strict';

const MockAdInstance = {
    async render() {
        return new Promise((resolve) => {
            setTimeout(resolve, 400);
        });
    },
    async destroy() {
    },
    async clear() {
    },
};
const MockAdNetwork = {
    name: 'Mock Network',
    createAd(ad) {
        return MockAdInstance;
    },
    async resetCorrelator() {
        return Promise.resolve();
    },
};

module.exports = MockAdNetwork;
