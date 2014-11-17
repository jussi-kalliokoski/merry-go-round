"use strict";

var fs = require("gulp");
var clean = require("gulp-clean");

module.exports = function cleanArtifacts () {
    return fs.src([
        "merry-go-round",
        ".tmp",
    ], { read: false })
        .pipe(clean());
};
