"use strict";
var seriallyResolvePromises = function (promises) {
    return promises.reduce(function (promiseChain, fn) { return (promiseChain.then(function () { return fn(); })); }, Promise.resolve());
};
module.exports = seriallyResolvePromises;
