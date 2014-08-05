"use strict";

module.exports = function find (list, signature) {
    var keys = Object.keys(signature);

    outer: for ( var i = 0; i < list.length; i++ ) {
        var item = list[i];

        for ( var n = 0; n < keys.length; n++ ) {
            var key = keys[n];
            if ( signature[key] !== item[key] ) {
                continue outer;
            }
        }

        return item;
    }

    return null;
};
