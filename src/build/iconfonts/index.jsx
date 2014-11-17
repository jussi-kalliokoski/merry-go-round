"use strict";

var fs = require("gulp");
var iconfont = require("gulp-iconfont");
var consolidate = require("gulp-consolidate");
var rename = require("gulp-rename");
var rev = require("gulp-rev");
var through = require("through2");
var path = require("path");
var merge = require("event-stream").merge;

function generateStylesheets (fontName, stream) {
    var output = through.obj();

    stream.on("codepoints", function (codepoints) {
        fs.src(path.join(__dirname, "template.styl"))
            .pipe(consolidate("lodash", {
                glyphs: codepoints,
                fontName: fontName
            }))
            .pipe(rename(fontName + ".styl"))
            .pipe(output);
    });

    return output;
}

module.exports = function buildIconFonts (options) {
    var FONT_NAME = "icons";

    var fonts = fs.src("./src/components/*/icons/*.svg")
        .pipe(iconfont({
            fontName: FONT_NAME,
            normalize: true
        }));

    var stylesheets = generateStylesheets(FONT_NAME, fonts)
        .pipe(fs.dest("./.tmp"));

    fonts = fonts
        .pipe(rev())
        .pipe(fs.dest("./merry-go-round/assets/fonts/"));

    return merge(fonts, stylesheets);
};
