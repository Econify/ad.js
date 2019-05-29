"use strict";
var isServer = function () { return typeof window === 'undefined'; };
module.exports = isServer;
