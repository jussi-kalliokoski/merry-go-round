"use strict";

var first = require("./first");
var pageContainsMarker = require("./pageContainsMarker");

module.exports = function isMarkerOnFirstPage (marker, pages) {
    if ( !marker ) { return true; }
    var firstPage = first(pages);
    return pageContainsMarker(firstPage, marker);
};
