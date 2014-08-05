"use strict";

module.exports = function getClassName (baseClass, states) {
    var stateNames = Object.keys(states);

    var classList = [baseClass].concat(stateNames.filter(function isStateActive (stateName) {
        return Boolean(states[stateName]);
    }).map(function getClassNameForStateName (stateName) {
        return baseClass + "--" + stateName;
    }));

    return classList.join(" ");
};
