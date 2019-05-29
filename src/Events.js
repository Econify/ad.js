"use strict";
// Event Bus Options
var Events;
(function (Events) {
    Events["CREATE"] = "create";
    Events["REQUEST"] = "request";
    Events["RENDER"] = "render";
    Events["REFRESH"] = "refresh";
    Events["DESTROY"] = "destroy";
    Events["FREEZE"] = "freeze";
    Events["UNFREEZE"] = "unfreeze";
    Events["CLEAR"] = "clear";
})(Events || (Events = {}));
module.exports = Events;
