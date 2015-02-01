"use strict";

var React = require("react");
var range = require("../utils/range");
var noop = require("../utils/noop");

var CarouselMixin = {
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
                pageView = React.createElement(PageView, {
                    page: this.props.pages[buffer.pageIndex],
                    index: buffer.pageIndex,
                    willBeDiscarded: buffer.willBeDiscarded,
                    isNew: buffer.isNew,
                });
            }

            return this.renderPage(buffer, pageView);
        }.bind(this));
    },
};

module.exports = CarouselMixin;
