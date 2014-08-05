"use strict";

module.exports = function getMarkerForPage (page) {
    var middleIndex = Math.floor(page.items.length / 2);
    return page.items[middleIndex].id;
};
