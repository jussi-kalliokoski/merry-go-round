"use strict";

var gulp = require("gulp");
var jshint = require("gulp-jshint");
var jscs = require("gulp-jscs");
var browserify = require("browserify");
var istanbul = require("browserify-istanbul");
var es3ify = require("es3ify");
var source = require("vinyl-source-stream");
var spawn = require("child_process").spawn;

var files = [
    "./Carousel/index.js",
    "./CarouselMixin/index.js",
    "./Container/index.js",
    "./utils/*.js",
    "./gulpfile.js",
    "./karma.conf.js",
    "./test/**/*Spec.js",
];

function handleError (error) {
    throw error;
}

gulp.task("jscs", function jscsTask () {
    return gulp.src(files)
        .pipe(jscs("./.jscs.json"))
        .on("error", handleError);
});

gulp.task("jshint", function jshintTask () {
    return gulp.src(files)
        .pipe(jshint())
        .pipe(jshint.reporter("default"))
        .pipe(jshint.reporter("fail"))
        .on("error", handleError);
});

gulp.task("build", function buildTask () {
    var globStream = gulp.src("./test/**/*Spec.js", { read: false });
    var files = [];

    globStream.on("data", files.push.bind(files));

    globStream.on("end", function prepareBundle () {
        var bundler = browserify({
            entries: files.map(function (file) {
                return file.path;
            }),
            extensions: ["jsx"],
        });

        bundler.transform(es3ify);

        bundler.transform(istanbul({
            ignore: ["**/*Spec.js"],
        }));

        bundler.bundle()
            .pipe(source("test.js"))
            .pipe(outputStream);
    });

    var outputStream = gulp.dest("./.tmp");

    return outputStream;
});

gulp.task("karma", ["build"], function karmaTask (callback) {
    var child = spawn("./node_modules/.bin/karma", ["start", "./karma.conf.js", "--single-run"], {
        stdio: "inherit",
    });

    child.on("close", function (exitCode) {
        if ( exitCode !== 0 ) {
            handleError(new Error("Tests failed"));
            return;
        }

        callback();
    });
});

gulp.task("test", ["jscs", "jshint", "karma"]);
