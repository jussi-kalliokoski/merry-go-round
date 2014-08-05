"use strict";

module.exports = {
    handleTouchStart: function (event) {
        this.touchActive = false;

        if ( event.touches.length !== 1 ) { return; }

        this.touchActive = true;
        this.touchId = event.touches[0].id;
        this.touchStartX = event.touches[0].pageX;
        this.touchStartY = event.touches[0].pageY;
        this.touchPreviousX = this.touchStartX;
    },

    handleTouchMove: function (event) {
        if ( !this.touchActive ) { return; }
        var touch = event.touches[0];

        var scrollingVertically = Math.abs(this.touchStartY - touch.pageY) > this.props.swipeCancelThreshold;
        if ( scrollingVertically ) {
            this.touchActive = false;
            return;
        }

        this.touchPreviousX = touch.pageX;
    },

    handleTouchEnd: function (event) {
        if ( !this.touchActive ) { return; }
        var touch = event.touches[0];
        this.touchActive = false;
        var swipeAmount = Math.floor((this.touchStartX - this.touchPreviousX) / this.props.swipeThreshold);

        var sign = swipeAmount / Math.abs(swipeAmount);
        if ( swipeAmount !== 0 && sign !== 0 && this.props.onSwiped ) {
            this.props.onSwiped({
                target: this,
                sign: sign,
            });
        }
    },

    handleTouchCancel: function (event) {
        this.touchActive = false;
    },
};
