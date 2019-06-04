this._ADJS = this._ADJS || {};
this._ADJS.Networks = this._ADJS.Networks || {};
this._ADJS.Networks.DFP = (function () {
'use strict';

class Error extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message;
    }
}

const loadScript = (url, attributes = {}) => new Promise((resolve) => {
    const scriptTag = document.createElement('script');
    scriptTag.src = url;
    scriptTag.onload = () => resolve();
    Object.keys(attributes).forEach((key) => {
        const value = attributes[key];
        if (typeof value === 'boolean') {
            if (!value) {
                return;
            }
            scriptTag.setAttribute(key, key);
            return;
        }
        scriptTag.setAttribute(key, value);
    });
    document.getElementsByTagName('head')[0].appendChild(scriptTag);
});

class DfpAd {
    constructor(el, path, sizes, breakpoints, targeting) {
        this.el = el;
        DoubleClickForPublishers.prepare();
        const { id } = el;
        if (!id) {
            throw new Error('Malformed Request', 'Ad does not have an id');
        }
        this.id = id;
        googletag.cmd.push(() => {
            const adSizes = Array.isArray(sizes) ? sizes : [];
            this.slot = googletag.defineSlot(path, adSizes, this.id);
            if (targeting) {
                Object.entries(targeting)
                    .forEach(([key, value]) => {
                    this.slot.setTargeting(key, value);
                });
            }
            if (!Array.isArray(sizes) && breakpoints) {
                const sizing = googletag.sizeMapping();
                Object.entries(breakpoints).map(([device, dimensions]) => {
                    sizing.addSize([dimensions.from, 1], sizes[device] || []);
                });
                this.slot.defineSizeMapping(sizing.build());
            }
            this.slot.addService(googletag.pubads());
            googletag.display(this.id);
        });
    }
    render() {
        return new Promise((resolve) => {
            googletag.cmd.push(() => {
                const { slot } = this;
                googletag.pubads().addEventListener('slotRenderEnded', (event) => {
                    if (event.slot === slot) {
                        resolve();
                    }
                });
                googletag.pubads().refresh([slot], { changeCorrelator: false });
                // if no Sizes Set
                if (!slot.getContentUrl()) {
                    resolve();
                }
            });
        });
    }
    clear() {
        return new Promise((resolve) => {
            googletag.cmd.push(() => {
                const { slot } = this;
                googletag.pubads().clear([slot]);
                resolve();
            });
        });
    }
    refresh() {
        return new Promise((resolve) => {
            googletag.cmd.push(() => {
                const { slot } = this;
                googletag.pubads().refresh([slot], { changeCorrelator: false });
                resolve();
            });
        });
    }
    // Cannot undo this action
    destroy() {
        return new Promise((resolve) => {
            googletag.cmd.push(() => {
                const { slot } = this;
                googletag.destroySlots([slot]);
                resolve();
            });
        });
    }
}
function loadGPT() {
    loadScript('https://www.googletagservices.com/tag/js/gpt.js', { async: true });
    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];
    window.googletag.cmd.push(() => {
        googletag.pubads().disableInitialLoad();
        googletag.pubads().enableAsyncRendering();
        googletag.enableServices();
    });
}
const DoubleClickForPublishers = {
    name: 'DoubleClick for Publishers',
    loaded: false,
    createAd(ad) {
        const { el, configuration } = ad;
        const { sizes, targeting, path, breakpoints } = configuration;
        if (!sizes) {
            throw new Error('Malformed Request', 'Sizes must be defined.');
        }
        if (!path) {
            throw new Error('Malformed Request', 'Ad Path must be defined.');
        }
        return new DfpAd(el, path, sizes, breakpoints, targeting);
    },
    async prepare() {
        if (this.loaded) {
            return;
        }
        loadGPT();
        this.loaded = true;
    },
    async resetCorrelator() {
        googletag.pubads().updateCorrelator();
    },
};

return DoubleClickForPublishers;

}());
//# sourceMappingURL=networks.dfp.development.js.map
