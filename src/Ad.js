"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Page = require('./Page').Page;
var Events_1 = require("./Events");
var AdJsError_1 = require("./utils/AdJsError");
var insertElement_1 = require("./utils/insertElement");
var seriallyResolvePromises_1 = require("./utils/seriallyResolvePromises");
var uppercaseFirstLetter_1 = require("./utils/uppercaseFirstLetter");
console.log(Page);
var adId = 0;
function nextId() {
    return "adjs-ad-container-" + ++adId;
}
function validateSizes(configuration) {
    var sizes = configuration.sizes, breakpoints = configuration.breakpoints;
    if (!Array.isArray(sizes) && !breakpoints) {
        throw new AdJsError_1["default"]('MISCONFIGURATION', 'Sizes must be of type `Array` unless breakpoints have been specified');
    }
}
var DEFAULT_CONFIGURATION = {
    autoRender: true,
    autoRefresh: true,
    offset: 0,
    refreshRateInSeconds: 30,
    targeting: {},
    breakpoints: {},
    refreshOnBreakpoint: true
};
// Define LifeCycle Method will automatically wrap each
// lifecycle with important items such as "queue" when frozen,
// awaiting page queues and implementing vendors
function attachAsLifecycleMethod(target, propertyName, propertyDescriptor) {
    var fn = propertyDescriptor.value;
    propertyDescriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var boundReplayFn, hookName, beforeHookName, onHookName, afterHookName, executingState, executedState;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        /*
                         * If the ad unit is frozen push the call into a queue that
                         * can be executed later
                         */
                        if (this.state.frozen) {
                            boundReplayFn = (_a = this[propertyName]).bind.apply(_a, [this].concat(args));
                            this.actionsReceivedWhileFrozen.push(boundReplayFn);
                            return [2 /*return*/];
                        }
                        hookName = uppercaseFirstLetter_1["default"](propertyName);
                        beforeHookName = "before" + hookName;
                        onHookName = "on" + hookName;
                        afterHookName = "after" + hookName;
                        executingState = propertyName + "ing";
                        executedState = propertyName + "ed";
                        // Has event already been called and currently executing?
                        if (this.state[executingState]) {
                            return [2 /*return*/];
                        }
                        /*
                         * Has this render method already completed succesfully? Should we
                         * allow for it to be executed again?
                         */
                        if (this.state[executedState] && propertyName !== 'refresh') {
                            return [2 /*return*/];
                        }
                        /*
                         * Lifecycle methods are not idempotent, make sure that multiple
                         * calls to a method do not execute multiple times
                         */
                        this.state[executingState] = true;
                        /*
                         * Queue up the lifecycle method's execution to ensure all page async tasks
                         * have completed and that it executes in order.
                         *
                         * e.g. if ad.render() is called before ad.destroy(), ensure ad.render()
                         *      completes before executing ad.destroy().
                         */
                        return [4 /*yield*/, this.onReady(function () { return __awaiter(_this, void 0, void 0, function () {
                                var executionOfFn, executionOfPlugins;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            this.emit(propertyName, 'before');
                                            return [4 /*yield*/, this.callPlugins(beforeHookName)];
                                        case 1:
                                            _a.sent();
                                            executionOfFn = fn.apply(this, args);
                                            executionOfPlugins = this.callPlugins(onHookName);
                                            this.emit(propertyName, 'on');
                                            return [4 /*yield*/, Promise.all([executionOfFn, executionOfPlugins])];
                                        case 2:
                                            _a.sent();
                                            return [4 /*yield*/, this.callPlugins(afterHookName)];
                                        case 3:
                                            _a.sent();
                                            this.state[executingState] = false;
                                            this.state[executedState] = true;
                                            this.emit(propertyName, 'after');
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        /*
                         * Queue up the lifecycle method's execution to ensure all page async tasks
                         * have completed and that it executes in order.
                         *
                         * e.g. if ad.render() is called before ad.destroy(), ensure ad.render()
                         *      completes before executing ad.destroy().
                         */
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return propertyDescriptor;
}
var Ad = /** @class */ (function () {
    function Ad(page, el, localConfiguration) {
        var _this = this;
        this.page = page;
        this.state = {
            creating: false,
            created: false,
            rendering: false,
            rendered: false,
            refreshing: false,
            refreshed: false,
            clearing: false,
            cleared: false,
            destroying: false,
            destroyed: false,
            frozen: false
        };
        this.actionsReceivedWhileFrozen = [];
        this.plugins = [];
        this.localVendors = [];
        this.promiseStack = Promise.resolve();
        // Event Queue
        this.events = {
            before: {},
            on: {},
            after: {}
        };
        /*
         * Add the parent pages promise chain onto each Ad instance's
         * promise chain to ensure that any async actions the parent page
         * makes (e.g. Krux) are completed before allowing a lifecycle
         * method (e.g. render) to execute
         */
        this.promiseStack = this.promiseStack.then(function () { return _this.page.promiseStack; });
        this.configuration = __assign({}, this.page.defaults, localConfiguration);
        this.container = insertElement_1["default"]('div', { style: 'position: relative; display: inline-block;' }, el);
        this.el = insertElement_1["default"]('div', { id: nextId() }, this.container);
        validateSizes(this.configuration);
        // Merge Locally Provided Plugins for this ad with Plugins that are specified on the Page
        var plugins = this.page.plugins.slice();
        if (localConfiguration && localConfiguration.plugins) {
            plugins.push.apply(plugins, localConfiguration.plugins);
        }
        // Instantiate all class based plugins and reference them
        this.attachPlugins(plugins);
        var executionOfPlugins = this.callPlugins('beforeCreate');
        this.onReady(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, executionOfPlugins];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Promise.all([
                                this.networkInstance = this.network.createAd(this),
                                this.callPlugins('onCreate'),
                            ])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.callPlugins('afterCreate')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    }
    Object.defineProperty(Ad.prototype, "network", {
        get: function () {
            return this.page.network;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ad.prototype, "slot", {
        get: function () {
            return this.networkInstance.slot;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ad.prototype, "vendors", {
        get: function () {
            return this.page.vendors.concat(this.localVendors);
        },
        enumerable: true,
        configurable: true
    });
    // onReady will queue up additional execution calls to onReady
    // ensuring that commands called in sequence will in fact be executed
    // in sequence.
    //
    // Example:
    // ---
    //  ad.render();
    //  ad.destroy();
    //
    //  destroy must always happen after render has completed.
    //
    Ad.prototype.onReady = function (fn) {
        var _this = this;
        var externalResolve;
        var externalReject;
        var promiseMonitor = new Promise(function (resolve, reject) {
            externalResolve = resolve;
            externalReject = reject;
        });
        this.promiseStack = this.promiseStack.then(function () { return __awaiter(_this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fn()];
                    case 1:
                        _a.sent();
                        externalResolve();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        externalReject(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        return promiseMonitor;
    };
    Ad.prototype.render = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.setAsActive()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.networkInstance.render()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Ad.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.setAsActive()];
                    case 1:
                        _a.sent();
                        if (!(typeof this.networkInstance.refresh !== 'undefined')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.networkInstance.refresh()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        console.warn("\n        " + this.network.name + " Network does not support ad refreshing natively.\n        Destroying and Recreating the ad. Make sure this is what you intended.\n      ");
                        return [4 /*yield*/, this.networkInstance.destroy()];
                    case 4:
                        _a.sent();
                        this.networkInstance = this.network.createAd(this);
                        return [4 /*yield*/, this.networkInstance.render()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        this.state.rendered = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    Ad.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.networkInstance.clear()];
                    case 1:
                        _a.sent();
                        this.state.rendered = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    Ad.prototype.destroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.networkInstance.destroy()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Ad.prototype.freeze = function () {
        if (this.state.frozen) {
            return;
        }
        this.emit(Events_1["default"].FREEZE, 'before');
        this.state.frozen = true;
        this.emit(Events_1["default"].FREEZE, 'on');
        this.emit(Events_1["default"].FREEZE, 'after');
    };
    Ad.prototype.unfreeze = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var actions;
            return __generator(this, function (_a) {
                if (!this.state.frozen) {
                    return [2 /*return*/];
                }
                this.emit(Events_1["default"].UNFREEZE, 'before');
                // unfreeze is the exception to the evented workflow because if it were
                // enqueued, it would be pushed to the end of the queue (after backlogged
                // events). Thus, leaving the ad in a limbo state. As such, we must bypass
                // the queue for this event.
                this.state.frozen = false;
                actions = this.actionsReceivedWhileFrozen;
                this.actionsReceivedWhileFrozen = [];
                // processes backlogged events in queue on('unfreeze')
                if (options.replayEventsWhileFrozen) {
                    // TODO
                    this.onReady(function () {
                        return seriallyResolvePromises_1["default"](actions);
                    });
                }
                this.emit(Events_1["default"].UNFREEZE, 'on');
                this.emit(Events_1["default"].UNFREEZE, 'after');
                return [2 /*return*/];
            });
        });
    };
    Ad.prototype.on = function (key, fn) {
        this.attachEvent(key, fn, 'on');
    };
    Ad.prototype.before = function (key, fn) {
        this.attachEvent(key, fn, 'before');
    };
    Ad.prototype.after = function (key, fn) {
        this.attachEvent(key, fn, 'after');
    };
    // You really shouldn't await this, but it's useful to know
    // when all of the binded events have fired
    Ad.prototype.emit = function (key, lifecycleTiming) {
        if (lifecycleTiming === void 0) { lifecycleTiming = 'on'; }
        return __awaiter(this, void 0, void 0, function () {
            var events;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        events = this.events[lifecycleTiming][key];
                        if (!events) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, Promise.all(events.map(function (event) { return event(_this); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Ad.prototype.attachEvent = function (key, fn, event) {
        if (event === void 0) { event = 'on'; }
        if (!this.events[event][key]) {
            this.events[event][key] = [];
        }
        this.events[event][key].push(fn);
    };
    Ad.prototype.attachPlugins = function (plugins) {
        var _this = this;
        this.plugins = plugins.map(function (Plugin) {
            if (typeof Plugin === 'function') {
                return new Plugin(_this);
            }
            return Plugin;
        });
    };
    // TODO Figure out type
    Ad.prototype.callPlugins = function (hook) {
        var _this = this;
        return Promise.all(this.plugins.map(function (plugin) { return __awaiter(_this, void 0, void 0, function () {
            var hookFn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hookFn = plugin[hook];
                        if (!(typeof hookFn === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, hookFn.call(plugin, this)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); }));
    };
    __decorate([
        attachAsLifecycleMethod
    ], Ad.prototype, "render");
    __decorate([
        attachAsLifecycleMethod
    ], Ad.prototype, "refresh");
    __decorate([
        attachAsLifecycleMethod
    ], Ad.prototype, "clear");
    __decorate([
        attachAsLifecycleMethod
    ], Ad.prototype, "destroy");
    return Ad;
}());
module.exports = Ad;
