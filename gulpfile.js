"use strict";

require("node-jsx").install({
    harmony: true,
    extension: ".jsx",
    additionalTransform: function (src) {
        return "/** @jsx React.DOM */" + src;
    },
});

var gulp = require("gulp");

gulp.task("clean", require("./src/build/clean"));
gulp.task("iconfonts", ["clean"], require("./src/build/iconfonts"));
gulp.task("images", ["iconfonts"], require("./src/build/images"));
gulp.task("stylesheets", ["images"], require("./src/build/stylesheets"));
gulp.task("javascripts", ["stylesheets"], require("./src/build/javascripts"));
gulp.task("pages", ["javascripts"], require("./src/build/pages"));
gulp.task("build", ["pages"]);
