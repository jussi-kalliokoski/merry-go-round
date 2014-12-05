"use strict";

var React = require("react/addons");

describe("Carousel", function () {
    var Carousel = require("../Carousel");

    var DummyComponent = React.createClass({
        render: function () {
            return React.DOM.div({
                className: "dummy",
            }, this.props.page.index);
        },
    });

    var pages;
    var defaults;
    var element;
    var component;

    function getElementsByClassName (targetElement, targetClassName) {
        if ( targetElement.getElementsByClassName ) {
            return targetElement.getElementsByClassName(targetClassName);
        }

        // (jussi-kalliokoski): naive shiv for IE8, but works for the purposes of this test.
        return [].filter.call(targetElement.getElementsByTagName("div"), function (element) {
            var classList = element.className ? element.className.split(/\s+/g) : [];
            return classList.some(function (className) {
                return targetClassName === className;
            });
        });
    }

    function expectChildByClassName (className) {
        expect(getElementsByClassName(element, className).length).to.be.above(0);
    }

    function expectChildrenByClassName (className, count) {
        expect(getElementsByClassName(element, className).length).to.equal(count);
    }

    function getPages () {
        return [].slice.call(getElementsByClassName(element, "merry-go-round__page"));
    }

    function expectBufferedPageIndicesToMatch (list) {
        expectChildrenByClassName("merry-go-round__page", list.length);
        var actual = getPages().map(function (page) {
            if ( page.childNodes.length === 0 ) {
                return null;
            }

            return getElementsByClassName(page, "dummy")[0].innerHTML;
        });

        expect(actual).to.eql(list);
    }

    function expectSliderPosition (x, y) {
        x += "px";
        y += "px";

        var slider = getElementsByClassName(element, "merry-go-round__slider")[0];
        var style = slider.style;

        var transform = "translate(" + style.marginLeft + ", " + style.marginTop + ")";

        if ( /(translate\(-?\d+px, -?\d+px\))/.test(slider.getAttribute("style")) ) {
            transform = RegExp.$1;
        }

        expect(transform).to.equal("translate(" + x + ", " + y + ")");
    }

    function prepare (options) {
        element = document.createElement("div");
        options = options || {};
        var defaultKeys = Object.keys(defaults);
        defaultKeys.forEach(function (key) {
            if ( !options.hasOwnProperty(key) ) {
                options[key] = defaults[key];
            }
        });
        component = Carousel(options);
        React.renderComponent(component, element);
    }

    beforeEach(function () {
        pages = [{
            index: 0,
        }, {
            index: 1,
        }, {
            index: 2,
        }, {
            index: 3,
        }];

        defaults = {
            pageView: DummyComponent,
            pages: pages,
        };
    });

    it("should exist", function () {
        expect(Carousel).to.be.ok();
    });

    describe("`baseClass`", function () {
        function testBaseClass (baseClass, baseClassProp) {
            prepare({
                baseClass: baseClassProp,
            });

            expectChildByClassName(baseClass);
            expectChildByClassName(baseClass + "__slider");
            expectChildByClassName(baseClass + "__page");
        }

        it("should be used as the base class", function () {
            testBaseClass("foo", "foo");
        });

        it("should default to `merry-go-round`", function () {
            testBaseClass("merry-go-round");
        });
    });

    describe("`cacheSize`", function () {
        it("should determine the number of pages cached around current page", function () {
            prepare({
                cacheSize: 3,
            });

            expectBufferedPageIndicesToMatch([
                null,
                null,
                null,
                0,
                1,
                2,
                3,
            ]);
        });

        it("should default to `1`", function () {
            prepare();

            expectBufferedPageIndicesToMatch([
                null,
                0,
                1,
            ]);
        });
    });

    describe("pages", function () {
        beforeEach(function () {
            defaults.pageWidth = 11;
            defaults.pageHeight = 13;
        });

        function expectPagePositions (expected) {
            var actual = getPages().map(function (page) {
                return parseInt(page.style.left, 10);
            });

            expect(actual).to.eql(expected);
        }

        function expectPageSizes (width, height) {
            getPages().forEach(function (page) {
                expect([page.style.width, page.style.height]).to.eql([width + "px", height + "px"]);
            });
        }

        describe("when on first page", function () {
            beforeEach(function () {
                prepare({
                    pageIndex: 0,
                    previousPageIndex: 0,
                });
            });

            it("the locations should be correct", function () {
                expectPagePositions([
                    -11,
                    0,
                    11,
                ]);
            });

            it("the sizes should match", function () {
                expectPageSizes(11, 13);
            });
        });

        describe("when on third page", function () {
            beforeEach(function () {
                prepare({
                    pageIndex: 2,
                    previousPageIndex: 2,
                });
            });

            it("the locations should be correct", function () {
                expectPagePositions([
                    11,
                    22,
                    33,
                ]);
            });
        });
    });

    describe("slider", function () {
        describe("when moving", function () {
            beforeEach(function () {
                prepare({
                    pageIndex: 3,
                    previousPageIndex: 0,
                });
            });

            it("should have a `--moving` class", function () {
                expectChildByClassName("merry-go-round__slider--moving");
            });

            it("should render all pages between current and previous, plus `cacheSize`", function () {
                expectBufferedPageIndicesToMatch([
                    null,
                    0,
                    1,
                    2,
                    3,
                    null,
                ]);
            });
        });

        describe("when not moving", function () {
            beforeEach(function () {
                prepare({
                    pageIndex: 3,
                    previousPageIndex: 3,
                });
            });

            it("should not have a `--moving` class", function () {
                expectChildrenByClassName("merry-go-round__slider--moving", 0);
            });

            it("should render only pages determined by `cacheSize`", function () {
                expectBufferedPageIndicesToMatch([
                    2,
                    3,
                    null,
                ]);
            });
        });

        describe("when on page `0`", function () {
            beforeEach(function () {
                prepare({
                    pageWidth: 11,
                    pageHeight: 17,
                });
            });

            it("should be in the right place", function () {
                expectSliderPosition(0, 0);
            });
        });

        describe("when on page `5`", function () {
            beforeEach(function () {
                prepare({
                    pageWidth: 11,
                    pageHeight: 17,
                    pageIndex: 5,
                    previousPageIndex: 5,
                });
            });

            it("should be in the right place", function () {
                expectSliderPosition(-55, 0);
            });
        });
    });

    describe("when provided an empty `pages` array", function () {
        it("should render as an empty div", function () {
            var html = React.renderComponentToStaticMarkup(Carousel({
                pages: [],
                pageView: DummyComponent,
            }));

            expect(html).to.equal("<div></div>");
        });
    });

    describe("when `looping` is enabled", function () {
        beforeEach(function () {
            defaults.loop = true;
        });

        describe("when buffers overflow the `pages` array", function () {
            beforeEach(function () {
                prepare({
                    cacheSize: 3,
                    pageIndex: 0,
                    previousPageIndex: 6,
                });
            });

            it("should ring buffer the `pages` array", function () {
                expectBufferedPageIndicesToMatch([
                    1,
                    2,
                    3,
                    0,
                    1,
                    2,
                    3,
                    0,
                    1,
                    2,
                    3,
                    0,
                    1,
                ]);
            });
        });
    });

    describe("when swiped", function () {
        function createTouches () {
            return [].map.call(arguments, function (position, index) {
                return {
                    id: "touch" + index,
                    pageX: position[0],
                    pageY: position[1],
                };
            });
        }

        function swipe (positions, cancel) {
            var carousel = getElementsByClassName(element, "merry-go-round")[0];
            React.addons.TestUtils.Simulate.touchStart(carousel, {
                touches: createTouches(positions.shift()),
            });

            positions.forEach(function (position) {
                React.addons.TestUtils.Simulate.touchMove(carousel, {
                    touches: createTouches(position),
                });
            });

            if ( cancel ) {
                React.addons.TestUtils.Simulate.touchCancel(carousel, {
                    touches: [],
                });
            } else {
                React.addons.TestUtils.Simulate.touchEnd(carousel, {
                    touches: [],
                });
            }
        }

        var onSwiped;
        beforeEach(function () {
            onSwiped = defaults.onSwiped = sinon.spy();
        });

        describe("left", function () {
            beforeEach(function () {
                prepare();
                swipe([
                    [100, 0],
                    [0, 0],
                ]);
            });

            it("should trigger `onSwiped` event, with positive sign", function () {
                expect(onSwiped.lastCall.args[0].sign).to.equal(1);
            });
        });

        describe("right", function () {
            beforeEach(function () {
                prepare();
                swipe([
                    [0, 0],
                    [100, 0],
                ]);
            });

            it("should trigger `onSwiped` event, with negative sign", function () {
                expect(onSwiped.lastCall.args[0].sign).to.equal(-1);
            });
        });

        describe("up", function () {
            beforeEach(function () {
                prepare();
                swipe([
                    [0, 100],
                    [0, 0],
                ]);
            });

            it("should not do anything", function () {
                expect(onSwiped.called).to.not.be.ok();
            });
        });

        describe("up, then left", function () {
            beforeEach(function () {
                prepare();
                swipe([
                    [100, 100],
                    [100, 0],
                    [0, 0],
                ]);
            });

            it("should not do anything", function () {
                expect(onSwiped.called).to.not.be.ok();
            });
        });

        describe("too little", function () {
            beforeEach(function () {
                prepare();
                swipe([
                    [5, 0],
                    [0, 0],
                ]);
            });

            it("should not do anything", function () {
                expect(onSwiped.called).to.not.be.ok();
            });
        });

        describe("without `onSwiped` set", function () {
            beforeEach(function () {
                prepare({ onSwiped: undefined });
                swipe([
                    [100, 0],
                    [0, 0],
                ]);
            });

            it("should not do anything", function () {
                expect(onSwiped.called).to.not.be.ok();
            });
        });

        describe("left and canceled", function () {
            beforeEach(function () {
                prepare();
                swipe([
                    [100, 0],
                    [0, 0],
                ], true);
            });

            it("should not do anything", function () {
                expect(onSwiped.called).to.not.be.ok();
            });
        });

        describe("with multiple fingers", function () {
            beforeEach(function () {
                var carousel = getElementsByClassName(element, "merry-go-round")[0];
                React.addons.TestUtils.Simulate.touchStart(carousel, {
                    touches: createTouches([100, 0]),
                });
                React.addons.TestUtils.Simulate.touchMove(carousel, {
                    touches: createTouches([0, 0]),
                });
                React.addons.TestUtils.Simulate.touchStart(carousel, {
                    touches: createTouches([0, 0], [10, 20]),
                });
                React.addons.TestUtils.Simulate.touchEnd(carousel, {
                    touches: [],
                });
            });

            it("should not do anything", function () {
                expect(onSwiped.called).to.not.be.ok();
            });
        });
    });
});
