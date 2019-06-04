this._ADJS = this._ADJS || {};
this._ADJS.Plugins = this._ADJS.Plugins || {};
this._ADJS.Plugins.Debug = (function () {
'use strict';

function insertElement(tag, attributes = {}, elementToInsertInto, html) {
    const element = document.createElement(tag);
    Object.keys(attributes).forEach((key) => {
        const value = attributes[key];
        if (typeof value === 'boolean') {
            if (!value) {
                return;
            }
            element.setAttribute(key, key);
            return;
        }
        element.setAttribute(key, value);
    });
    if (typeof html === 'string') {
        element.innerHTML = html;
    }
    elementToInsertInto.appendChild(element);
    return element;
}

function padTime(time) {
    return String(time).padStart(2, '0');
}

class AdJsError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message;
    }
}

class GenericPlugin {
    get name() {
        return this.constructor.name;
    }
    constructor(ad) {
        if (!ad) {
            throw new AdJsError('Misconfiguration', `
An ad must be passed into the GenericPlugin class. If your Plugin inherits from GenericPlugin
and overrides the constructor make sure you are calling "super" and that you are passing in an
instance of an ad as the first parameter. Alternatively, you can hook into the onCreate method
which gets called by the constructor.

Example:
\`` `js
          class ExamplePlugin extends GenericPlugin {
            onCreate() {
              console.log('Example Plugin Started Succesfully');
            }
          }

          // Or

          class ExamplePlugin extends GenericPlugin {
            constructor(ad) {
              super(ad);

              console.log('Example Plugin Started Succesfully');
            }
          }
        \`` `	   `);
        }
        this.ad = ad;
    }
}

const OVERLAY_STYLE = `
position: absolute;
background: rgba(0, 0, 0, 0.7);
color: white;
top: 0;
left: 0;
right: 0;
bottom: 0;
overflow-y: scroll;
padding: 5px;
text-align: left;
color: yellow;
font-size: 12px;
`;
const MESSAGE_STYLE = `
padding: 5px 0;
color: white;
border-bottom: 1px solid grey;
`;
class Debug extends GenericPlugin {
    onCreate() {
        const { container, el: { id }, configuration: { path } } = this.ad;
        const title = `slotId: ${id} <br /> path: ${path} <hr />`;
        this.debugOverlay = insertElement('div', { style: OVERLAY_STYLE }, container, title);
        googletag.cmd.push(() => {
            googletag.pubads().addEventListener('slotRenderEnded', (event) => {
                if (event.slot === this.ad.slot) {
                    this.insertMetadata(event);
                }
            });
        });
    }
    afterCreate() {
        this.insertMessage('created');
    }
    onRender() {
        this.insertMessage('rendered');
    }
    onRefresh() {
        this.insertMessage('refreshed');
    }
    onClear() {
        this.insertMessage('cleared');
    }
    onDestroy() {
        this.insertMessage('destroyed');
    }
    insertMessage(baseMessage) {
        const currentDate = new Date();
        const hour = padTime(currentDate.getHours());
        const minutes = padTime(currentDate.getMinutes());
        const milliseconds = padTime(currentDate.getMilliseconds());
        const message = `[EVENT] ${baseMessage} at ${hour}:${minutes}:${milliseconds}`;
        insertElement('p', { style: MESSAGE_STYLE }, this.debugOverlay, message);
    }
    insertMetadata(metadata) {
        const message = Object.entries(metadata)
            .map(([key, value]) => `${key} = ${value}`)
            .join('<br />');
        insertElement('p', { style: MESSAGE_STYLE }, this.debugOverlay, message);
    }
}

return Debug;

}());
//# sourceMappingURL=plugins.debug.development.js.map
