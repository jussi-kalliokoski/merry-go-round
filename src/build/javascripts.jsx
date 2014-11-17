"use strict";

var webpack = require("webpack");

var MODULE_SETTINGS = {
    loaders: [{
        test: /\.json$/,
        loader: "json",
    }, {
        test: /\.jsx?$/,
        loader: "jsx?insertPragma=React.DOM&harmony!transform?es3ify",
    }, {
        test: /\.styl$/,
        loader: "style!css!stylus",
    }],
};

var RESOLVE_SETTINGS = {
    extensions: [
        "",
        ".js",
        ".jsx",
        ".json",
    ],
};

function buildJavaScripts (callback) {
    return webpack({
        entry: {
            "basic-example": "./src/examples/basic",
            "app": "./src/app.js",
        },

        output: {
            filename: "js/[name]-[hash].js",
            path: "./merry-go-round/assets/",
            publicPath: "/merry-go-round/assets/",
        },

        bail: true,
        module: MODULE_SETTINGS,
        resolve: RESOLVE_SETTINGS,
    }, function (error, stats) {
        if ( error ) {
            return callback(error);
        }

        console.log(stats.toString({
            colors: true,
            hash: false,
            timings: true,
            assets: true,
            chunks: false,
            chunkModules: false,
            modules: false,
            children: true,
        }));

        callback();
    });
}

module.exports = buildJavaScripts;
