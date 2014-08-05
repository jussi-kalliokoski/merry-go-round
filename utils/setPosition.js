"use strict";

function getDummyStyle () {
    try {
        return document.createElement("div").style;
    } catch (error) {
        return {};
    }
}

function setMargin (style, x, y) {
    style.marginLeft = x + "px";
    style.marginTop = y + "px";
}

function selectImplementation (dummyStyle) {
    dummyStyle = dummyStyle || getDummyStyle();

    var transformProperty = function getTransformProperty () {
        var property = "transform";

        if ( property in dummyStyle ) {
            return property;
        }

        var vendors = ["webkit", "Moz", "O"];

        for ( var i = 0; i < vendors.length; i++ ) {
            var prefixedProperty = vendors[i] + property[0].toUpperCase() + property.substr(1);

            if ( prefixedProperty in dummyStyle ) {
                return prefixedProperty;
            }
        }

        return "";
    }();

    if ( !transformProperty ) {
        return setMargin;
    }

    return function setTransform (style, x, y) {
        style[transformProperty] = "translate(" + x + "px, " + y + "px)";
    };
}

module.exports.selectImplementation = selectImplementation;
module.exports.setPosition = selectImplementation();
