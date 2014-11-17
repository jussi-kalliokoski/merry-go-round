"use strict";

var _ = require("lodash");
var path = require("path");
var fs = require("gulp");
var File = require("vinyl");
var through = require("through2");
var consolidate = require("gulp-consolidate");
var rename = require("gulp-rename");
var rev = require("gulp-rev");
var resizeImages = require("gulp-image-resize");
var merge = require("event-stream").merge;
var redirectStream = require("../utils/redirectStream");

var RESOLUTIONS = [
    1.3,
    1.5,
    2,
    3,
];

function getResolutionAsFraction (resolution) {
    var numerator = resolution.toString().replace(/\./, "");
    var denominator = Math.pow(10, numerator.length - 1);
    return numerator + "/" + denominator;
}

function endStream (stream) {
    process.nextTick(function () {
        stream.end();
    });
}

module.exports = function processImages (options) {
    var imagesByName = {};

    return fs.src("./src/components/*/images/*x*_*/**/*.png", { base: "./src/components/" })
        .pipe(through.obj(function collectImage (file, encoding, callback) {
            var size = /\d+x\d+/.exec(file.relative)[0];
            var width = parseInt(size.split("x")[0], 10);
            var height = parseInt(size.split("x")[1], 10);
            var resolution = /\/(\d+(?:\.\d+)?)x\//.test(file.relative) ? RegExp.$1 : "1";
            var basename = path.basename(file.relative);
            var extname = path.extname(file.relative);
            var name = basename.substr(0, basename.length - extname.length);

            imagesByName[name] = imagesByName[name] || {
                selector: "." + name,
                name: name,
                extname: extname,
                width: width,
                height: height,
                sources: [],
                renditions: []
            };

            imagesByName[name].sources.push({
                resolution: resolution,
                contents: file.contents
            });

            callback();
        }, function flush () {
            var resizersBySize = {};
            var images = _.values(imagesByName);

            if ( images.length === 0 ) {
                this.emit("end");
                return;
            }

            function createResizer (width, height) {
                var size = width + "x" + height;
                resizersBySize[size] = resizersBySize[size] || resizeImages({
                    width: width,
                    height: height,
                    crop: false,
                    upscale: true
                });
                return resizersBySize[size];
            }

            images.forEach(function sortSources (image) {
                image.sources.sort(function ascendingByResolution (a, b) {
                    return a.resolution - b.resolution;
                });
            });

            function findBestSource (sources, resolution) {
                var suitableSources = sources.filter(function filterSmaller (source) {
                    return source.resolution >= resolution;
                });

                return _.first(suitableSources);
            }

            function createRendition (image, resolution) {
                var source = findBestSource(image.sources, resolution);

                if ( !source ) { return null; }

                var width = Math.floor(image.width * resolution);
                var height = Math.floor(image.height * resolution);
                var resizer = createResizer(width, height);
                var assetName = image.name + "." + width + "x" + height + image.extname;
                var rendition = new File({
                    path: assetName,
                    contents: source.contents
                });
                rendition.width = width;
                rendition.height = height;
                resizer.push(rendition);
                return rendition;
            }

            images.forEach(function (image) {
                image.assetName = createRendition(image, 1).path;

                RESOLUTIONS.forEach(function (resolution) {
                    var rendition = createRendition(image, resolution);
                    if ( !rendition ) { return false; }

                    image.renditions.push({
                        minResolution: resolution,
                        minResolutionAsFraction: getResolutionAsFraction(resolution),
                        width: rendition.width,
                        height: rendition.height,
                        assetName: rendition.path
                    });
                });
            });

            var stylesheetStream = fs.src(path.join(__dirname, "template.styl"))
                .pipe(consolidate("lodash", {
                    images: images
                }))
                .pipe(rename("images.styl"))
                .pipe(fs.dest("./.tmp"));

            var resizers = _.values(resizersBySize);
            var imageStream = merge.apply(null, resizers)
                .pipe(rev())
                .pipe(fs.dest(path.join(options.assetsFolder, "images")));
            var outputStream = merge(imageStream, stylesheetStream);
            redirectStream(outputStream, this);

            resizers.forEach(endStream);
        }));
};
