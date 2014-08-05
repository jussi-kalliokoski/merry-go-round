"use strict";

var React = require("react/addons");

describe("Container", function () {
    var Container = require("../Container");

    var container;
    var pages;
    var result;
    var props;

    beforeEach(function () {
        container = Object.create(Container);

        props = container.props = {};

        pages = [{
            items: [{
                id: "foo0",
            }, {
                id: "foo1",
            }, {
                id: "foo2",
            }],
        }, {
            items: [{
                id: "foo3",
            }, {
                id: "foo4",
            }, {
                id: "foo5",
            }],
        }, {
            items: [{
                id: "foo6",
            }, {
                id: "foo7",
            }, {
                id: "foo8",
            }],
        }];

        container.page = function () {
            return pages;
        };
    });

    describe(".calculatePageState()", function () {
        function prepare () {
            result = container.calculatePageState(pages);
        }

        describe("when marker and previous marker are not defined", function () {
            beforeEach(prepare);

            it("should return current and previous index as zero", function () {
                expect(result.index).to.equal(0);
                expect(result.previousIndex).to.equal(0);
            });
        });

        describe("when previous marker is not defined and marker is on second page", function () {
            beforeEach(function () {
                props.marker = "foo5";
                prepare();
            });

            it("should return current index as 1 and previous index as 0", function () {
                expect(result.index).to.equal(1);
                expect(result.previousIndex).to.equal(0);
            });
        });

        describe("when previous marker is not defined and marker is not found", function () {
            beforeEach(function () {
                props.marker = "bar2";
                prepare();
            });

            it("should return current and previous index as zero", function () {
                expect(result.index).to.equal(0);
                expect(result.previousIndex).to.equal(0);
            });
        });

        describe("when looping is enabled", function () {
            beforeEach(function () {
                props.loop = true;
            });

            describe("when marker and previous marker are not defined", function () {
                beforeEach(function () {
                    prepare();
                });

                it("should return current and previous index as zero", function () {
                    expect(result.index).to.equal(0);
                    expect(result.previousIndex).to.equal(0);
                });
            });

            describe("when previous marker is not defined and marker is on second page", function () {
                beforeEach(function () {
                    props.marker = "foo5";
                    prepare();
                });

                it("should return current index as 1 and previous index as 0", function () {
                    expect(result.index).to.equal(1);
                    expect(result.previousIndex).to.equal(0);
                });
            });

            describe("when current marker is closer to the next page than the page of the previous marker", function () {
                beforeEach(function () {
                    props.marker = "foo8";
                    props.previousMarker = "foo0";
                    prepare();
                });

                it("should return current index as -1 and previous index as 3", function () {
                    expect(result.index).to.equal(-1);
                    expect(result.previousIndex).to.equal(0);
                });
            });

            describe("when current marker is closer to the previous page than the page of the previous marker", function () {
                beforeEach(function () {
                    props.marker = "foo0";
                    props.previousMarker = "foo8";
                    prepare();
                });

                it("should return current index as 3 and previous index as 2", function () {
                    expect(result.index).to.equal(3);
                    expect(result.previousIndex).to.equal(2);
                });
            });
        });
    });

    describe(".setPageIndex()", function () {
        beforeEach(function () {
            props.onPageChange = sinon.spy();
        });

        describe("when pages list is empty", function () {
            beforeEach(function () {
                pages = [];
                container.setPageIndex(0);
            });

            it("shouldn't do anything", function () {
                expect(props.onPageChange.called).to.not.be.ok();
            });
        });

        describe("when not looping", function () {
            describe("when set above bounds", function () {
                beforeEach(function () {
                    container.setPageIndex(4);
                });

                it("shouldn't do anything", function () {
                    expect(props.onPageChange.called).to.not.be.ok();
                });
            });

            describe("when set below bounds", function () {
                beforeEach(function () {
                    container.setPageIndex(-1);
                });

                it("shouldn't do anything", function () {
                    expect(props.onPageChange.called).to.not.be.ok();
                });
            });
        });

        describe("when looping", function () {
            beforeEach(function () {
                props.loop = true;
            });

            describe("when set above bounds", function () {
                beforeEach(function () {
                    container.setPageIndex(4);
                });

                it("should normalize the index and find the correct marker", function () {
                    expect(props.onPageChange.lastCall.args[0].marker).to.equal("foo4");
                });
            });

            describe("when set below bounds", function () {
                beforeEach(function () {
                    container.setPageIndex(-1);
                });

                it("should normalize the index and find the correct marker", function () {
                    expect(props.onPageChange.lastCall.args[0].marker).to.equal("foo7");
                });
            });
        });
    });

    describe(".isOnFirstPage()", function () {
        describe("when marker is undefined", function () {
            beforeEach(function () {
                result = container.isOnFirstPage(pages);
            });

            it("should return true", function () {
                expect(result).to.be.ok();
            });
        });

        describe("when on first page", function () {
            beforeEach(function () {
                props.marker = "foo1";
                result = container.isOnFirstPage(pages);
            });

            it("should return true", function () {
                expect(result).to.be.ok();
            });
        });

        describe("when on second page", function () {
            beforeEach(function () {
                props.marker = "foo3";
                result = container.isOnFirstPage(pages);
            });

            it("should return true", function () {
                expect(result).to.not.be.ok();
            });
        });
    });

    describe(".isOnLastPage()", function () {
        describe("when marker is undefined", function () {
            beforeEach(function () {
                result = container.isOnLastPage(pages);
            });

            it("should return false", function () {
                expect(result).to.not.be.ok();
            });
        });

        describe("when on last page", function () {
            beforeEach(function () {
                props.marker = "foo8";
                result = container.isOnLastPage(pages);
            });

            it("should return true", function () {
                expect(result).to.be.ok();
            });
        });

        describe("when on second page", function () {
            beforeEach(function () {
                props.marker = "foo3";
                result = container.isOnLastPage(pages);
            });

            it("should return false", function () {
                expect(result).to.not.be.ok();
            });
        });
    });

    describe("auto rotation", function () {
        describe("when the component has mounted", function () {
            beforeEach(function () {
                container.startAutoRotate = sinon.spy();
                container.componentDidMount();
            });

            it("should be started", function () {
                expect(container.startAutoRotate.called).to.be.ok();
            });
        });

        describe("when the component will unmount", function () {
            beforeEach(function () {
                container.stopAutoRotate = sinon.spy();
                container.componentWillUnmount();
            });

            it("should be stopped", function () {
                expect(container.stopAutoRotate.called).to.be.ok();
            });
        });

        describe("when mouse leaves the container", function () {
            beforeEach(function () {
                container.startAutoRotate = sinon.spy();
                container.handleMouseLeave();
            });

            it("should be started", function () {
                expect(container.startAutoRotate.called).to.be.ok();
            });
        });

        describe("when mouse enters the container", function () {
            beforeEach(function () {
                container.stopAutoRotate = sinon.spy();
                container.handleMouseEnter();
            });

            it("should be stopped", function () {
                expect(container.stopAutoRotate.called).to.be.ok();
            });
        });

        describe("when started", function () {
            var delta;
            beforeEach(function (callback) {
                props.autoRotate = true;
                props.autoRotateInterval = 10;

                var calledTimes = 0;
                var start;

                container.rotate = function () {
                    if ( ++calledTimes === 3 ) {
                        delta = Date.now() - start;
                        container.stopAutoRotate();
                        callback();
                    } else if ( calledTimes > 3 ) {
                        throw new Error("autorotation didn't stop!");
                    }
                };

                start = Date.now();
                container.startAutoRotate();
            });

            it("should be called regularly", function () {
                expect(delta).to.be.above(25);
                // XXX (jussi-kalliokoski): the intervals can be anything on BrowserStack. :/
                expect(delta).to.be.below(1000);
            });
        });

        describe("when disabled", function () {
            beforeEach(function (callback) {
                props.autoRotate = false;
                props.autoRotateInterval = 1;

                container.rotate = sinon.spy();

                container.startAutoRotate();

                setTimeout(function () {
                    callback();
                }, 10);
            });

            it("should not start", function () {
                expect(container.rotate.called).to.not.be.ok();
            });
        });

        describe("when rotated", function () {
            beforeEach(function () {
                props.marker = "foo4";
                props.onPageChange = sinon.spy();
            });

            describe("left", function () {
                beforeEach(function () {
                    props.autoRotateDirection = "left";
                    container.rotate();
                });

                it("should select the previous page", function () {
                    expect(props.onPageChange.lastCall.args[0].marker).to.equal("foo1");
                });
            });

            describe("right", function () {
                beforeEach(function () {
                    props.autoRotateDirection = "right";
                    container.rotate();
                });

                it("should select the previous page", function () {
                    expect(props.onPageChange.lastCall.args[0].marker).to.equal("foo7");
                });
            });
        });

        describe("on page changed event from carousel", function () {
            beforeEach(function () {
                props.marker = "foo4";
                props.onPageChange = sinon.spy();
                container.handlePageChange({
                    pageIndex: 0,
                });
            });

            it("should trigger the onPageChange event", function () {
                expect(props.onPageChange.lastCall.args[0].marker).to.equal("foo1");
            });
        });

        describe("when swiped", function () {
            beforeEach(function () {
                props.marker = "foo4";
                props.onPageChange = sinon.spy();
            });

            describe("left", function () {
                beforeEach(function () {
                    container.handleSwipe({
                        sign: -1,
                    });
                });

                it("should select the previous page", function () {
                    expect(props.onPageChange.lastCall.args[0].marker).to.equal("foo1");
                });
            });

            describe("right", function () {
                beforeEach(function () {
                    container.handleSwipe({
                        sign: 1,
                    });
                });

                it("should select the previous page", function () {
                    expect(props.onPageChange.lastCall.args[0].marker).to.equal("foo7");
                });
            });
        });
    });
});
