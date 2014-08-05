"use strict";

var find = require("./find");

module.exports = function getPageIndexByMarker (pages, marker) {
    if ( !marker ) { return 0; }

    for ( var i = 0; i < pages.length; i++ ) {
        var page = pages[i];
        if ( find(page.items, { id: marker }) ) { return i; }
    }

    return 0;
};
