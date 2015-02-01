"use strict";

var React = require("react");
var Swipable = require("../Swipable");
var CarouselMixin = require("../CarouselMixin");
var getClassName = require("../utils/getClassName");

module.exports = React.createClass({
    displayName: "Carousel",

    mixins: [Swipable, CarouselMixin],

    calculatePageStyle: function (index) {
        return {
            width: this.props.pageWidth + "px",
            height: this.props.pageHeight + "px",
            opacity: index === this.props.pageIndex ? "1.0" : "0.0",
            zIndex: this.props.zIndexMax - Math.abs(index - this.props.pageIndex),
        };
    },

    renderPage: function (buffer, pageView) {
        return React.createElement("div", {
            className: this.props.baseClass + "__page",
            key: buffer.index,
            style: this.calculatePageStyle(buffer.index),
        }, pageView);
    },

    calculateStyle: function () {
        return {
            width: (this.props.width) + "px",
            height: (this.props.height) + "px",
            left: (-this.props.embedWidth) + "px",
            top: (-this.props.embedHeight) + "px",
        };
    },

    render: function () {
        if ( this.props.pages.length === 0 ) {
            // (jussi-kalliokoski): Nothing to render. Avoids infinite loop in calculateBuffers().
            return React.createElement("div");
        }

        return React.createElement("div", {
            className: this.props.baseClass,
            onTouchStart: this.handleTouchStart,
            onTouchMove: this.handleTouchMove,
            onTouchEnd: this.handleTouchEnd,
            onTouchCancel: this.handleTouchCancel,
            style: this.calculateStyle(),
        },
            this.renderPages()
        );
    },
});
