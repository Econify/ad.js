'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var constants = createCommonjsModule(function (module, exports) {
exports.VISIBILITYCHANGE = 'visibilityChange';
exports.ENTERVIEWPORT = 'enterViewport';
exports.FULLYENTERVIEWPORT = 'fullyEnterViewport';
exports.EXITVIEWPORT = 'exitViewport';
exports.PARTIALLYEXITVIEWPORT = 'partiallyExitViewport';
exports.LOCATIONCHANGE = 'locationChange';
exports.STATECHANGE = 'stateChange';

exports.eventTypes = [
	exports.VISIBILITYCHANGE,
	exports.ENTERVIEWPORT,
	exports.FULLYENTERVIEWPORT,
	exports.EXITVIEWPORT,
	exports.PARTIALLYEXITVIEWPORT,
	exports.LOCATIONCHANGE,
	exports.STATECHANGE
];

exports.isOnServer = (typeof window === 'undefined');
exports.isInBrowser = !exports.isOnServer;

exports.defaultOffsets = {top: 0, bottom: 0};
});
var constants_1 = constants.VISIBILITYCHANGE;
var constants_2 = constants.ENTERVIEWPORT;
var constants_3 = constants.FULLYENTERVIEWPORT;
var constants_4 = constants.EXITVIEWPORT;
var constants_5 = constants.PARTIALLYEXITVIEWPORT;
var constants_6 = constants.LOCATIONCHANGE;
var constants_7 = constants.STATECHANGE;
var constants_8 = constants.eventTypes;
var constants_9 = constants.isOnServer;
var constants_10 = constants.isInBrowser;
var constants_11 = constants.defaultOffsets;

var {
	VISIBILITYCHANGE,
	ENTERVIEWPORT,
	FULLYENTERVIEWPORT,
	EXITVIEWPORT,
	PARTIALLYEXITVIEWPORT,
	LOCATIONCHANGE,
	STATECHANGE,
	eventTypes,
	defaultOffsets
} = constants;

function ElementWatcher (containerWatcher, watchItem, offsets) {
	var self = this;

	this.watchItem = watchItem;
	this.container = containerWatcher;

	if (!offsets) {
		this.offsets = defaultOffsets;
	} else if (offsets === +offsets) {
		this.offsets = {top: offsets, bottom: offsets};
	} else {
		this.offsets = {
			top: offsets.top || defaultOffsets.top,
			bottom: offsets.bottom || defaultOffsets.bottom
		};
	}

	this.callbacks = {}; // {callback: function, isOne: true }

	for (var i = 0, j = eventTypes.length; i < j; i++) {
		self.callbacks[eventTypes[i]] = [];
	}

	this.locked = false;

	var wasInViewport;
	var wasFullyInViewport;
	var wasAboveViewport;
	var wasBelowViewport;

	var listenerToTriggerListI;
	var listener;
	function triggerCallbackArray (listeners, event) {
		if (listeners.length === 0) {
			return;
		}
		listenerToTriggerListI = listeners.length;
		while (listenerToTriggerListI--) {
			listener = listeners[listenerToTriggerListI];
			listener.callback.call(self, event, self);
			if (listener.isOne) {
				listeners.splice(listenerToTriggerListI, 1);
			}
		}
	}
	this.triggerCallbacks = function triggerCallbacks (event) {

		if (this.isInViewport && !wasInViewport) {
			triggerCallbackArray( this.callbacks[ENTERVIEWPORT], event );
		}
		if (this.isFullyInViewport && !wasFullyInViewport) {
			triggerCallbackArray( this.callbacks[FULLYENTERVIEWPORT], event );
		}


		if (this.isAboveViewport !== wasAboveViewport &&
			this.isBelowViewport !== wasBelowViewport) {

			triggerCallbackArray( this.callbacks[VISIBILITYCHANGE], event );

			// if you skip completely past this element
			if (!wasFullyInViewport && !this.isFullyInViewport) {
				triggerCallbackArray( this.callbacks[FULLYENTERVIEWPORT], event );
				triggerCallbackArray( this.callbacks[PARTIALLYEXITVIEWPORT], event );
			}
			if (!wasInViewport && !this.isInViewport) {
				triggerCallbackArray( this.callbacks[ENTERVIEWPORT], event );
				triggerCallbackArray( this.callbacks[EXITVIEWPORT], event );
			}
		}

		if (!this.isFullyInViewport && wasFullyInViewport) {
			triggerCallbackArray( this.callbacks[PARTIALLYEXITVIEWPORT], event );
		}
		if (!this.isInViewport && wasInViewport) {
			triggerCallbackArray( this.callbacks[EXITVIEWPORT], event );
		}
		if (this.isInViewport !== wasInViewport) {
			triggerCallbackArray( this.callbacks[VISIBILITYCHANGE], event );
		}
		switch( true ) {
			case wasInViewport !== this.isInViewport:
			case wasFullyInViewport !== this.isFullyInViewport:
			case wasAboveViewport !== this.isAboveViewport:
			case wasBelowViewport !== this.isBelowViewport:
				triggerCallbackArray( this.callbacks[STATECHANGE], event );
		}

		wasInViewport = this.isInViewport;
		wasFullyInViewport = this.isFullyInViewport;
		wasAboveViewport = this.isAboveViewport;
		wasBelowViewport = this.isBelowViewport;

	};

	this.recalculateLocation = function () {
		if (this.locked) {
			return;
		}
		var previousTop = this.top;
		var previousBottom = this.bottom;
		if (this.watchItem.nodeName) { // a dom element
			var cachedDisplay = this.watchItem.style.display;
			if (cachedDisplay === 'none') {
				this.watchItem.style.display = '';
			}

			var containerOffset = 0;
			var container = this.container;
			while (container.containerWatcher) {
				containerOffset += container.containerWatcher.top - container.containerWatcher.container.viewportTop;
				container = container.containerWatcher.container;
			}

			var boundingRect = this.watchItem.getBoundingClientRect();
			this.top = boundingRect.top + this.container.viewportTop - containerOffset;
			this.bottom = boundingRect.bottom + this.container.viewportTop - containerOffset;

			if (cachedDisplay === 'none') {
				this.watchItem.style.display = cachedDisplay;
			}

		} else if (this.watchItem === +this.watchItem) { // number
			if (this.watchItem > 0) {
				this.top = this.bottom = this.watchItem;
			} else {
				this.top = this.bottom = this.container.documentHeight - this.watchItem;
			}

		} else { // an object with a top and bottom property
			this.top = this.watchItem.top;
			this.bottom = this.watchItem.bottom;
		}

		this.top -= this.offsets.top;
		this.bottom += this.offsets.bottom;
		this.height = this.bottom - this.top;

		if ( (previousTop !== undefined || previousBottom !== undefined) && (this.top !== previousTop || this.bottom !== previousBottom) ) {
			triggerCallbackArray( this.callbacks[LOCATIONCHANGE], null );
		}
	};

	this.recalculateLocation();
	this.update();

	wasInViewport = this.isInViewport;
	wasFullyInViewport = this.isFullyInViewport;
	wasAboveViewport = this.isAboveViewport;
	wasBelowViewport = this.isBelowViewport;
}

ElementWatcher.prototype = {
	on: function (event, callback, isOne) {

		// trigger the event if it applies to the element right now.
		switch( true ) {
			case event === VISIBILITYCHANGE && !this.isInViewport && this.isAboveViewport:
			case event === ENTERVIEWPORT && this.isInViewport:
			case event === FULLYENTERVIEWPORT && this.isFullyInViewport:
			case event === EXITVIEWPORT && this.isAboveViewport && !this.isInViewport:
			case event === PARTIALLYEXITVIEWPORT && this.isInViewport && this.isAboveViewport:
				callback.call(this, this.container.latestEvent, this);
				if (isOne) {
					return;
				}
		}

		if (this.callbacks[event]) {
			this.callbacks[event].push({callback: callback, isOne: isOne||false});
		} else {
			throw new Error('Tried to add a scroll monitor listener of type '+event+'. Your options are: '+eventTypes.join(', '));
		}
	},
	off: function( event, callback ) {
		if (this.callbacks[event]) {
			for (var i = 0, item; item = this.callbacks[event][i]; i++) {
				if (item.callback === callback) {
					this.callbacks[event].splice(i, 1);
					break;
				}
			}
		} else {
			throw new Error('Tried to remove a scroll monitor listener of type '+event+'. Your options are: '+eventTypes.join(', '));
		}
	},
	one: function( event, callback ) {
		this.on( event, callback, true);
	},
	recalculateSize: function() {
		this.height = this.watchItem.offsetHeight + this.offsets.top + this.offsets.bottom;
		this.bottom = this.top + this.height;
	},
	update: function() {
		this.isAboveViewport = this.top < this.container.viewportTop;
		this.isBelowViewport = this.bottom > this.container.viewportBottom;

		this.isInViewport = (this.top < this.container.viewportBottom && this.bottom > this.container.viewportTop);
		this.isFullyInViewport = (this.top >= this.container.viewportTop && this.bottom <= this.container.viewportBottom) || (this.isAboveViewport && this.isBelowViewport);

	},
	destroy: function() {
		var index = this.container.watchers.indexOf(this),
			self  = this;
		this.container.watchers.splice(index, 1);
		for (var i = 0, j = eventTypes.length; i < j; i++) {
			self.callbacks[eventTypes[i]].length = 0;
		}
	},
	// prevent recalculating the element location
	lock: function() {
		this.locked = true;
	},
	unlock: function() {
		this.locked = false;
	}
};

var eventHandlerFactory = function (type) {
	return function( callback, isOne ) {
		this.on.call(this, type, callback, isOne);
	};
};

for (var i = 0, j = eventTypes.length; i < j; i++) {
	var type =  eventTypes[i];
	ElementWatcher.prototype[type] = eventHandlerFactory(type);
}

var watcher = ElementWatcher;

var { isOnServer, isInBrowser, eventTypes: eventTypes$1 } = constants;


function getViewportHeight (element) {
	if (isOnServer) {
		return 0;
	}
	if (element === document.body) {
		return window.innerHeight || document.documentElement.clientHeight;
	} else {
		return element.clientHeight;
	}
}

function getContentHeight (element) {
	if (isOnServer) {
		return 0;
	}

	if (element === document.body) {
		// jQuery approach
		// whichever is greatest
		return Math.max(
			document.body.scrollHeight, document.documentElement.scrollHeight,
			document.body.offsetHeight, document.documentElement.offsetHeight,
			document.documentElement.clientHeight
		);
	} else {
		return element.scrollHeight;
	}
}

function scrollTop (element) {
	if (isOnServer) {
		return 0;
	}
	if (element === document.body) {
		return window.pageYOffset ||
			(document.documentElement && document.documentElement.scrollTop) ||
			document.body.scrollTop;
	} else {
		return element.scrollTop;
	}
}

var browserSupportsPassive = false;
if (isInBrowser) {
	try {
		var opts = Object.defineProperty({}, 'passive', {
			get: function() {
				browserSupportsPassive = true;
			}
		});
		window.addEventListener('test', null, opts);
	} catch (e) {}
}
const useCapture = browserSupportsPassive ? {capture: false, passive: true} : false;


class ScrollMonitorContainer {
	constructor (item, parentWatcher) {
		var self = this;

		this.item = item;
		this.watchers = [];
		this.viewportTop = null;
		this.viewportBottom = null;
		this.documentHeight = getContentHeight(item);
		this.viewportHeight = getViewportHeight(item);
		this.DOMListener = function () {
			ScrollMonitorContainer.prototype.DOMListener.apply(self, arguments);
		};
		this.eventTypes = eventTypes$1;

		if (parentWatcher) {
			this.containerWatcher = parentWatcher.create(item);
		}

		var previousDocumentHeight;

		var calculateViewportI;
		function calculateViewport() {
			self.viewportTop = scrollTop(item);
			self.viewportBottom = self.viewportTop + self.viewportHeight;
			self.documentHeight = getContentHeight(item);
			if (self.documentHeight !== previousDocumentHeight) {
				calculateViewportI = self.watchers.length;
				while( calculateViewportI-- ) {
					self.watchers[calculateViewportI].recalculateLocation();
				}
				previousDocumentHeight = self.documentHeight;
			}
		}

		var updateAndTriggerWatchersI;
		function updateAndTriggerWatchers() {
			// update all watchers then trigger the events so one can rely on another being up to date.
			updateAndTriggerWatchersI = self.watchers.length;
			while( updateAndTriggerWatchersI-- ) {
				self.watchers[updateAndTriggerWatchersI].update();
			}

			updateAndTriggerWatchersI = self.watchers.length;
			while( updateAndTriggerWatchersI-- ) {
				self.watchers[updateAndTriggerWatchersI].triggerCallbacks();
			}

		}

		this.update = function() {
			calculateViewport();
			updateAndTriggerWatchers();
		};
		this.recalculateLocations = function() {
			this.documentHeight = 0;
			this.update();
		};

	}

	listenToDOM () {
		if (isInBrowser) {
			if (window.addEventListener) {
				if (this.item === document.body) {
					window.addEventListener('scroll', this.DOMListener, useCapture);
				} else {
					this.item.addEventListener('scroll', this.DOMListener, useCapture);
				}
				window.addEventListener('resize', this.DOMListener);
			} else {
				// Old IE support
				if (this.item === document.body) {
					window.attachEvent('onscroll', this.DOMListener);
				} else {
					this.item.attachEvent('onscroll', this.DOMListener);
				}
				window.attachEvent('onresize', this.DOMListener);
			}
			this.destroy = function () {
				if (window.addEventListener) {
					if (this.item === document.body) {
						window.removeEventListener('scroll', this.DOMListener, useCapture);
						this.containerWatcher.destroy();
					} else {
						this.item.removeEventListener('scroll', this.DOMListener, useCapture);
					}
					window.removeEventListener('resize', this.DOMListener);
				} else {
					// Old IE support
					if (this.item === document.body) {
						window.detachEvent('onscroll', this.DOMListener);
						this.containerWatcher.destroy();
					} else {
						this.item.detachEvent('onscroll', this.DOMListener);
					}
					window.detachEvent('onresize', this.DOMListener);
				}
			};
		}
	}

	destroy () {
		// noop, override for your own purposes.
		// in listenToDOM, for example.
	}

	DOMListener (event) {
		//alert('got scroll');
		this.setStateFromDOM(event);
	}

	setStateFromDOM (event) {
		var viewportTop = scrollTop(this.item);
		var viewportHeight = getViewportHeight(this.item);
		var contentHeight = getContentHeight(this.item);

		this.setState(viewportTop, viewportHeight, contentHeight, event);
	}

	setState (newViewportTop, newViewportHeight, newContentHeight, event) {
		var needsRecalcuate = (newViewportHeight !== this.viewportHeight || newContentHeight !== this.contentHeight);

		this.latestEvent = event;
		this.viewportTop = newViewportTop;
		this.viewportHeight = newViewportHeight;
		this.viewportBottom = newViewportTop + newViewportHeight;
		this.contentHeight = newContentHeight;

		if (needsRecalcuate) {
			let i = this.watchers.length;
			while (i--) {
				this.watchers[i].recalculateLocation();
			}
		}
		this.updateAndTriggerWatchers(event);
	}

	updateAndTriggerWatchers (event) {
		let i = this.watchers.length;
		while (i--) {
			this.watchers[i].update();
		}

		i = this.watchers.length;
		while (i--) {
			this.watchers[i].triggerCallbacks(event);
		}
	}

	createCustomContainer () {
		return new ScrollMonitorContainer();
	}

	createContainer (item) {
		if (typeof item === 'string') {
			item = document.querySelector(item);
		} else if (item && item.length > 0) {
			item = item[0];
		}
		var container = new ScrollMonitorContainer(item, this);
		container.setStateFromDOM();
		container.listenToDOM();
		return container;
	}

	create (item, offsets) {
		if (typeof item === 'string') {
			item = document.querySelector(item);
		} else if (item && item.length > 0) {
			item = item[0];
		}
		var watcher$1 = new watcher(this, item, offsets);
		this.watchers.push(watcher$1);
		return watcher$1;
	}

	beget (item, offsets) {
		return this.create(item, offsets);
	}
}

var container = ScrollMonitorContainer;

var { isInBrowser: isInBrowser$1 } = constants;



var scrollMonitor = new container(isInBrowser$1 ? document.body : null);
scrollMonitor.setStateFromDOM(null);
scrollMonitor.listenToDOM();

if (isInBrowser$1) {
	window.scrollMonitor = scrollMonitor;
}

var scrollmonitor = scrollMonitor;

class Error extends Error {
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
            throw new Error('Misconfiguration', `
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

const ONE_SECOND = 1000;
class AutoRefreshPlugin extends GenericPlugin {
    constructor() {
        super(...arguments);
        this.timeInView = 0;
        this.isRefreshing = false;
    }
    afterRender() {
        this.startMonitoringViewability();
    }
    beforeClear() {
        this.stopMonitoringViewability();
    }
    beforeDestroy() {
        this.stopMonitoringViewability();
    }
    startMonitoringViewability() {
        if (this.watcher) {
            return;
        }
        const { container } = this.ad;
        this.watcher = scrollmonitor.create(container);
        this.timeInView = 0;
        this.watcher.fullyEnterViewport(() => {
            this.markAsInView();
        });
    }
    stopMonitoringViewability() {
        if (!this.watcher) {
            return;
        }
        this.watcher.exitViewport(() => {
            this.markAsOutOfView();
            this.watcher = undefined;
        });
    }
    markAsInView() {
        if (this.timerReference) {
            return;
        }
        const { refreshRateInSeconds = 30 } = this.ad.configuration;
        this.timerReference = window.setInterval(async () => {
            this.timeInView += 1;
            // Determine whether the ad should refresh
            if (!this.isRefreshing && this.timeInView >= refreshRateInSeconds) {
                this.isRefreshing = true;
                await this.ad.refresh();
                this.timeInView = 0;
                this.isRefreshing = false;
            }
        }, ONE_SECOND);
    }
    markAsOutOfView() {
        if (!this.timerReference) {
            return;
        }
        clearInterval(this.timerReference);
        this.timerReference = undefined;
    }
}

module.exports = AutoRefreshPlugin;
