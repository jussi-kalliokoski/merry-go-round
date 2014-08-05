"use strict";

var find = require("./find");

module.exports = function pageContainsMarker (page, marker) {
    return Boolean(find(page.items, { id: marker }));
};
