"use strict";

var React = require("react");
var Swipable = require("../Swipable");
var range = require("../utils/range");
var getClassName = require("../utils/getClassName");
var setPosition = require("../utils/setPosition").setPosition;
var noop = require("../utils/noop");

module.exports = React.createClass({
    displayName: "Carousel",

    mixins: [Swipable],

    propTypes: {
        baseClass: React.PropTypes.string,
        cacheSize: React.PropTypes.number,
        embedWidth: React.PropTypes.number,
        embedHeight: React.PropTypes.number,
        pageIndex: React.PropTypes.number,
        previousPageIndex: React.PropTypes.number,
        loop: React.PropTypes.bool,
        renderEmptyPages: React.PropTypes.bool,
        pages: React.PropTypes.arrayOf(React.PropTypes.any).isRequired,
        pageView: React.PropTypes.func.isRequired,
        onSwiped: React.PropTypes.func,
        swipeThreshold: React.PropTypes.number,
        swipeCancelThreshold: React.PropTypes.number,
    },

    getDefaultProps: function () {
        return {
            baseClass: "merry-go-round",
            cacheSize: 1,
            embedWidth: 0,
            embedHeight: 0,
            pageIndex: 0,
            previousPageIndex: 0,
            loop: false,
            renderEmptyPages: false,
            onSwiped: noop,
            swipeThreshold: 10,
            swipeCancelThreshold: 10,
        };
    },

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

    isIndexWithinBounds: function (index) {
        return index >= 0 && index < this.props.pages.length;
    },

    normalizeIndex: function (index) {
        if ( !this.props.loop ) { return index; }

        while ( index < 0 ) {
            index += this.props.pages.length;
        }

        return index % this.props.pages.length;
    },

    isIndexInView: function (index, viewIndex) {
        return Math.abs(index - viewIndex) <= this.props.cacheSize;
    },

    calculateBuffers: function () {
        var first = Math.min(this.props.previousPageIndex, this.props.pageIndex) - this.props.cacheSize;
        var last = Math.max(this.props.previousPageIndex, this.props.pageIndex) + this.props.cacheSize;
        var indices = range(first, last + 1);

        return indices.map(function calculateBuffer (index) {
            return {
                index: index,
                pageIndex: this.normalizeIndex(index),
                willBeDiscarded: !this.isIndexInView(this.props.pageIndex, index),
                isNew: !this.isIndexInView(this.props.previousPageIndex, index),
            };
        }.bind(this));
    },

    renderPages: function () {

        var PageView = this.props.pageView;
        var buffers = this.calculateBuffers();

        return buffers.map(function renderBuffer (buffer) {
            var pageView;

            if ( this.props.renderEmptyPages || this.isIndexWithinBounds(buffer.pageIndex) ) {
                pageView = PageView({
                    page: this.props.pages[buffer.pageIndex],
                    index: buffer.pageIndex,
                    willBeDiscarded: buffer.willBeDiscarded,
                    isNew: buffer.isNew,
                });
            }

            return React.DOM.div({
                className: this.props.baseClass + "__page",
                key: buffer.index,
                style: this.calculatePageStyle(buffer.index),
            }, pageView);
        }.bind(this));
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
