"use strict";

require("./index.styl");

var React = require("react");
var Carousel = require("merry-go-round/Carousel");

var MAX_WIDTH = 1024/*px*/;
var MARGIN = 16/*px*/;
var ANIMATION_DURATION = 400/*ms*/;
var COLORS = [
    "blue",
    "green",
    "red",
    "cyan",
    "magenta",
    "pink",
    "orange",
    "maroon",
    "cornflowerblue",
    "blanchedalmond",
    "chartreuse",
    "olive",
];

var Page = React.createClass({
    render () {
        var boxes = COLORS.map((color, index) => {
            color = COLORS[(index + this.props.index) % COLORS.length];
            return (
                <div
                    className="box"
                    key={"box-" + color}
                    style={{ backgroundColor: color }}
                >
                    { this.props.page.text }
                </div>
            );
        });

        return (
            <div className="page">
                { boxes }
            </div>
        );
    },
});

var MyCarousel = React.createClass({
    getInitialState () {
        return {
            screenWidth: window.innerWidth,
            pageIndex: 0,
            previousPageIndex: 0,
        };
    },

    updateScreenSize () {
        this.setState({
            screenWidth: window.innerWidth,
        });
    },

    componentDidMount () {
        window.addEventListener("resize", this.updateScreenSize, false);
    },

    handleSwipe (event) {
        var pageIndex = this.state.pageIndex + event.sign;
        this.setState({ pageIndex: pageIndex });

        clearTimeout(this.animationTimer);
        this.animationTimer = setTimeout(() => {
            this.setState({ previousPageIndex: pageIndex });
        }, ANIMATION_DURATION);
    },

    render () {
        var pages = [{
            text: "foo",
        }, {
            text: "bar",
        }];

        var width = Math.min(this.state.screenWidth, MAX_WIDTH);
        var pageWidth = width - MARGIN * 2;
        var height = Math.ceil(pageWidth / 21 * 9);

        return (
            <Carousel
                pages={pages}
                pageIndex={this.state.pageIndex}
                previousPageIndex={this.state.previousPageIndex}
                width={width}
                height={height}
                embedWidth={MARGIN}
                embedHeight={0}
                pageView={Page}
                pageWidth={pageWidth}
                pageHeight={height}
                onSwiped={this.handleSwipe}
                loop={true}
            />
        );
    },
});

React.initializeTouchEvents();
React.renderComponent(MyCarousel(), document.getElementById("example"));

// expose for React devtools.
window.React = React;
