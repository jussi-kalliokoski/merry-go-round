"use strict";

var fs = require("gulp");
var stylus = require("gulp-stylus");
var autoprefixer = require("gulp-autoprefixer");
var minifyCss = require("gulp-minify-css");
var concat = require("gulp-concat");
var resolver = require("gulp-resolver");
var rev = require("gulp-rev");

function createStylesheets () {
    return fs.src([
        "./src/stylesheets/reset.styl",
        "./src/stylesheets/mixins/*.styl",
        "./.tmp/*.styl",
        "./src/components/*/*.styl",
    ])
        .pipe(concat("app.styl"))
        .pipe(stylus())
        .pipe(resolver.css({
            assetsDir: "./merry-go-round/",
        }))
        .pipe(autoprefixer())
        .pipe(minifyCss({
            compatibility: "ie8",
        }))
        .pipe(rev())
        .pipe(fs.dest("./merry-go-round/assets/css"));
}

module.exports = createStylesheets;
