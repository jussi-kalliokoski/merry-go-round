"use strict";

var last = require("./last");
var pageContainsMarker = require("./pageContainsMarker");

module.exports = function isMarkerOnLastPage (marker, pages) {
    if ( !marker ) { return pages.length <= 1; }
    var lastPage = last(pages);
    return pageContainsMarker(lastPage, marker);
};
