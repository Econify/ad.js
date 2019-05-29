"use strict";
function insertElement(tag, attributes, elementToInsertInto, html) {
    if (attributes === void 0) { attributes = {}; }
    var element = document.createElement(tag);
    Object.keys(attributes).forEach(function (key) {
        var value = attributes[key];
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
module.exports = insertElement;
