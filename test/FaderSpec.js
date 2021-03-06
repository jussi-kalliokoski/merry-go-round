"use strict";

var React = require("react/addons");

describe("Fader", function () {
    var Fader = require("../Fader");

    var DummyComponent = React.createClass({
        render: function () {
            return React.createElement("div", {
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

    function prepare (options) {
        element = document.createElement("div");
        options = options || {};
        var defaultKeys = Object.keys(defaults);
        defaultKeys.forEach(function (key) {
            if ( !options.hasOwnProperty(key) ) {
                options[key] = defaults[key];
            }
        });
        component = React.createElement(Fader, options);
        React.render(component, element);
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
        expect(Fader).to.be.ok();
    });

    describe("`baseClass`", function () {
        function testBaseClass (baseClass, baseClassProp) {
            prepare({
                baseClass: baseClassProp,
            });

            expectChildByClassName(baseClass);
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

        function expectPageOpacities (expected) {
            var actual = getPages().map(function (page) {
                return parseFloat(page.style.opacity);
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

            it("the opacities should be correct", function () {
                expectPageOpacities([
                    0.0,
                    1.0,
                    0.0,
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

            it("the opacities should be correct", function () {
                expectPageOpacities([
                    0.0,
                    1.0,
                    0.0,
                ]);
            });
        });
    });

    describe("when provided an empty `pages` array", function () {
        it("should render as an empty div", function () {
            var html = React.renderToStaticMarkup(React.createElement(Fader, {
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
                expect(onSwiped.called).to.equal(false);
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
                expect(onSwiped.called).to.equal(false);
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
                expect(onSwiped.called).to.equal(false);
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
                expect(onSwiped.called).to.equal(false);
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
                expect(onSwiped.called).to.equal(false);
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
                expect(onSwiped.called).to.equal(false);
            });
        });
    });
});
