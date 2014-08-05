"use strict";

var React = require("react");
var isMarkerOnLastPage = require("../utils/isMarkerOnLastPage");
var isMarkerOnFirstPage = require("../utils/isMarkerOnFirstPage");
var getMarkerForPage = require("../utils/getMarkerForPage");
var getPageIndexByMarker = require("../utils/getPageIndexByMarker");

module.exports = {
    calculatePageState: function (pages) {
        var pageIndex = getPageIndexByMarker(pages, this.props.marker);
        var previousPageIndex = getPageIndexByMarker(pages, this.props.previousMarker);

        if ( !this.props.loop ) {
            return {
                index: pageIndex,
                previousIndex: previousPageIndex,
            };
        }

        var forwardFlippedIndex = pageIndex + pages.length;
        var backFlippedIndex = pageIndex - pages.length;
        var distanceToActualPage = Math.abs(pageIndex - previousPageIndex);
        var distanceToForwardFlippedPage = Math.abs(forwardFlippedIndex - previousPageIndex);
        var distanceToBackFlippedPage = Math.abs(backFlippedIndex - previousPageIndex);
        var closest = Math.min(distanceToActualPage, distanceToForwardFlippedPage, distanceToBackFlippedPage);

        if ( closest === distanceToActualPage ) {
            // no-op
        } else if ( closest === distanceToForwardFlippedPage ) {
            pageIndex = forwardFlippedIndex;
        } else /* if ( closest === distanceToBackFlippedPage ) */ {
            pageIndex = backFlippedIndex;
        }

        return {
            index: pageIndex,
            previousIndex: previousPageIndex,
        };
    },

    normalizeIndex: function (index, pageCount) {
        while ( index < 0 ) {
            index += pageCount;
        }

        return index % pageCount;
    },

    setPageIndex: function (index) {
        var pages = this.page();

        if ( pages.length < 1 ) { return; }

        if ( this.props.loop ) {
            index = this.normalizeIndex(index, pages.length);
        }

        var page = pages[index];

        if ( !page ) { return; }

        var marker = getMarkerForPage(page);
        this.props.onPageChange({
            marker: marker,
        });
    },

    incrementPageIndex: function (increment) {
        var pages = this.page();
        var index = getPageIndexByMarker(pages, this.props.marker) + increment;
        this.setPageIndex(index);
    },

    handleSwipe: function (event) {
        this.incrementPageIndex(event.sign);
    },

    handlePageChange: function (event) {
        this.setPageIndex(event.pageIndex);
    },

    stopAutoRotate: function () {
        clearInterval(this.autoRotateTimer);
    },

    handleMouseEnter: function () {
        this.stopAutoRotate();
    },

    componentWillUnmount: function () {
        this.stopAutoRotate();
    },

    selectPageOnSide: function (side) {
        var increment = side === "left" ? -1 : 1;
        this.incrementPageIndex(increment);
    },

    rotate: function () {
        this.selectPageOnSide(this.props.autoRotateDirection);
    },

    startAutoRotate: function () {
        this.stopAutoRotate();

        if ( this.props.autoRotate ) {
            this.autoRotateTimer = setInterval(this.rotate, this.props.autoRotateInterval);
        }
    },

    handleMouseLeave: function () {
        this.startAutoRotate();
    },

    componentDidMount: function () {
        this.startAutoRotate();
    },

    isOnLastPage: function (pages) {
        return isMarkerOnLastPage(this.props.marker, pages);
    },

    isOnFirstPage: function (pages) {
        return isMarkerOnFirstPage(this.props.marker, pages);
    },
};
