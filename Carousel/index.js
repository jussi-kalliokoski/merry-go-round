"use strict";

var React = require("react");
var Swipable = require("../Swipable");
var CarouselMixin = require("../CarouselMixin");
var getClassName = require("../utils/getClassName");
var setPosition = require("../utils/setPosition").setPosition;

module.exports = React.createClass({
    displayName: "Carousel",

    mixins: [Swipable, CarouselMixin],

    isMoving: function () {
        return this.props.pageIndex !== this.props.previousPageIndex;
    },

    calculatePageStyle: function (index) {
        return {
            width: this.props.pageWidth + "px",
            height: this.props.pageHeight + "px",
            left: (this.props.pageWidth * index) + "px",
        };
    },

    renderPage: function (buffer, pageView) {
        return React.DOM.div({
            className: this.props.baseClass + "__page",
            key: buffer.index,
            style: this.calculatePageStyle(buffer.index),
        }, pageView);
    },

    calculateSliderStyle: function () {
        var style = {
            height: (this.props.pageHeight) + "px",
            left: Math.floor((this.props.width - this.props.pageWidth) / 2) + "px",
            top: Math.floor((this.props.height - this.props.pageHeight) / 2) + "px",
        };

        var x = this.props.pageIndex * -this.props.pageWidth;
        var y = 0;

        setPosition(style, x, y);

        return style;
    },

    getSliderClassName: function () {
        return getClassName(this.props.baseClass + "__slider", {
            moving: this.isMoving(),
        });
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
            return React.DOM.div();
        }

        return React.DOM.div({
            className: this.props.baseClass,
            onTouchStart: this.handleTouchStart,
            onTouchMove: this.handleTouchMove,
            onTouchEnd: this.handleTouchEnd,
            onTouchCancel: this.handleTouchCancel,
            style: this.calculateStyle(),
        },
            React.DOM.div({
                className: this.getSliderClassName(),
                style: this.calculateSliderStyle(),
            }, this.renderPages())
        );
    },
});
