"use strict";

module.exports = function redirectStream (stream, target) {
    stream.on("data", target.push.bind(target));
    stream.on("error", target.emit.bind(target, "error"));
    stream.on("end", target.emit.bind(target, "end"));
};
