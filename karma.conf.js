"use strict";

var useBrowserStack = Boolean(process.env.BROWSERSTACK_KEY) && process.env.TRAVIS_SECURE_ENV_VARS === "true";

var vendorJavascripts = [
    "./bower_components/es5-shim/es5-shim.js",
    "./bower_components/es5-shim/es5-sham.js",
];

module.exports = function (config) {
    config.set({
        basePath: ".",
        frameworks: ["mocha", "sinon", "expect"],
        reporters: ["mocha", "coverage"],
        browserNoActivityTimeout: 30000,

        files: [].concat(
            vendorJavascripts,
            "./.tmp/test.js"
        ),

        coverageReporter: {
            type: "lcov",
            dir: "dist/coverage/",
        },

        browserStack: {
            username: process.env.BROWSERSTACK_USER,
            accessKey: process.env.BROWSERSTACK_KEY,
        },

        customLaunchers: require("./custom-launchers.conf.json"),

        browsers: useBrowserStack ? [
            "bs_firefox_mac",
            "bs_opera_mac",
            "bs_chrome_mac",
            "bs_ie_8",
            "bs_ie_9",
            "bs_ie_10",
            "bs_ie_11",
        ] : ["PhantomJS"],
    });
};
