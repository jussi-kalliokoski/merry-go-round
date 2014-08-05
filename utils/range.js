"use strict";

module.exports = function range (start, end) {
    var values = [];

    for ( var i = start; i < end; i++ ) {
        values.push(i);
    }

    return values;
};
