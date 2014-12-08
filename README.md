# Merry-go-Round!

[![Build Status](https://travis-ci.org/jussi-kalliokoski/merry-go-round.svg)](https://travis-ci.org/jussi-kalliokoski/merry-go-round)
[![Coverage Status](https://img.shields.io/coveralls/jussi-kalliokoski/merry-go-round.svg)](https://coveralls.io/r/jussi-kalliokoski/merry-go-round)

Merry-go-Round is a [React](http://facebook.github.io/react/)-based component library for building amazing carousels!

### Flexibility

Just tried that other carousel component and noticed it just couldn't reach the grandeous design you were going for? The goal of Merry-go-Round is to not be a complete solution, but a highly reusable building block for you to create the carousels you've always dreamed for, so don't let reality get in your way! You go build what you want, Merry-go-Round will provide you the tools.

### Responsiveness

In today's world, your carousels have to work everywhere. No matter if it's a square screen or a device controlled with a pen, Merry-go-Round will work in it. Even IE8 is supported! Because Merry-go-Round promotes using markers instead of page indices for storing carousel states, your users also never have to go back to the page they were on when they rotate the screen, since even if the paging of the content changes in a different layout, the marker still points to the same point in your list of items.

### Performance

Your users have grown to expect a native-like fast experience, and with the power of React and Merry-go-Round, you can give it to them. Merry-go-Round lets you leverage CSS animations and transitions and provides you hooks for telling when these animations are over, so that you can retain a minimal memory and CPU fingerprint. Internally, Merry-go-Round uses ring buffers and occlusion culling to reuse views and render only what's needed at given moment.

## Getting Started

To get started, grab the latest copy of Merry-go-Round:

### npm

```sh
$ npm install --save merry-go-round
```

### bower

```sh
$ bower install --save merry-go-round
```

## Browser Support

Courtesy of the test suite that's run on [BrowserStack](https://www.browserstack.com/), the officially supported browsers are as follows:

* Chrome: Latest stable version.
* Firefox: Latest stable version.
* Opera: Latest stable version.
* Internet Explorer: 8, 9, 10, 11.

## Usage

Merry-go-Round exposes three components, `Carousel`, `Fader`, and `Container`:

### Carousel

This is the core component, featuring a slider and page rendering engine for a full-fledged carousel.

```javascript
var Carousel = require("merry-go-round/Carousel");
```

#### Props

* `pages` (Array): The list of pages to use for rendering.
* `pageView` (React class): The React class to use for rendering the pages.
* `pageIndex` (Integer, optional, defaults to `0`): The current page index.
* `previousPageIndex` (Integer, optional, defaults to `0`): The previous page index. Used for syncing with animations to determine which pages need to be shown during the animation, which will be discarded after and so on.
* `loop` (Boolean, optional, defaults to `false`): Whether to loop the pages so that before first page comes the last page and after last page comes the first page.
* `onSwiped` (Function, optional, defaults to no-op): A callback for when the carousel is swiped. The event object has a `sign` property that tells whether the user swiped left (`-1`) or right (`1`).
* `swipeThreshold` (Number, optional, defaults to 10): The number of pixels the swipe needs to cover before its registered. It is recommended to set this based on the screen dimensions.
* `swipeCancelThreshold` (Number, optional, defaults to 10): The number of pixels the swipe needs to move in crossing direction before it's canceled. It is recommended to set this based on the screen dimensions.
* `baseClass` (String, optional, defaults to `merry-go-round`): The base class to use when rendering components.
* `cacheSize` (Integer, optional, defaults to `1`): The number of pages to render around the pages that must be rendered. This is useful for example if you partially reveal multiple pages at the same time.
* `embedWidth` (Integer, optional, defaults to `0`): The number of pixels to "embed" into the horizontally. Basically reverses the container's padding, so that you can have things such as partially revealed pages that come outside the margin.
* `embedHeight` (Integer, optional, defaults to `0`): The number of pixels to "embed" into the vertically. Basically reverses the container's padding, so that you can have things such as partially revealed pages that come outside the margin.
* `renderEmptyPages` (Boolean, optional, defaults to `false`): Whether to render empty pages. This is useful when you want to have special views for pages that don't have any content.

### Fader

The Fader is otherwise identical to the Carousel component and implements the same API, but instead of vertically sliding the pages, the pages fade in and out.

### Container

The Container is a general purpose mixin for creating containers of the Carousels. It provides some useful functionality such as auto-rotation, marker-based page navigation and passing on the carousel-related events to your controller view.

#### Props

* `marker` (Any, optional): The marker of the current page.
* `previousMarker` (Any, optional): The marker of the previous page. Used for syncing with animations to determine which pages need to be shown during the animation, which will be discarded after as well as determining the quickest path to the next page (jumping over the loop might be closer than going all the way back to the beginning).
* `onPageChanged` (Function): An event called when the page of the carousel needs to change. The `marker` property on the event object determines the page where the carousel wants to move to.
* `autoRotate` (Boolean, optional): If true, the carousel will automatically rotate within specified intervals using `onPageChanged` event.
* `autoRotateInterval` (Integer, optional): The interval between auto-rotation events, in milliseconds.
* `autoRotateDirection` (String, optional): `left` or `right` based on the direction you want to automatically rotate to.
* `loop` (Boolean, optional): Whether to loop the pages so that before first page comes the last page and after last page comes the first page.

#### Expected Methods

These are methods that are expected to be implemented by classes using this mixin:

##### `page()`

Returns the array of pages available for rendering currently. If these pages are objects that have a property `items`, that contains objects that have `id` properties assigned to them, the marker-based paging will work out of the box.

#### Methods

##### `isOnFirstPage()`

Returns true if the current marker is on the first page of the specified pages.

###### Arguments

* `pages` The array of pages.

##### `isOnLastPage()`

Returns true if the current marker is on the last page of the specified pages.

###### Arguments

* `pages` The array of pages.

##### `handleMouseLeave()`

A prebuilt event handler for an onMouseLeave. Re-enables auto-rotation when the user is no longer interacting with the container.

##### `handleMouseEnter()`

A prebuilt event handler for an onMouseEnter. Disables auto-rotation while the user is interacting with the container.

##### `calculatePageState()`

Returns an object containing the current (`index`) and previous (`previousIndex`) page index of the child carousel, based on the markers and given pages. When looping is enabled, this will find the closest path to the current marker from the previous marker.

###### Arguments

* `pages` (Array): The array of pages to use for finding the index.

## Contributing

Contributions are most welcome! If you're having problems and don't know why, search the issues to see if someone's had the same issue. If not, file a new issue so we can solve it together and leave the solution visible to others facing the same problem as well. If you find bugs, file an issue, preferably with good reproduction steps. If you want to be totally awesome, you can make a PR to go with your issue, containing a new test case that fails currently!

### Development

Development is pretty straightforward, it's all JS and the standard node stuff works:

To install dependencies:

```bash
$ npm install
```

To run the tests:

```bash
$ npm test
```

Then just make your awesome feature and a PR for it. Don't forget to file an issue first, or start with an empty PR so others can see what you're doing and discuss it so there's a a minimal amount of wasted effort.

Do note that the test coverage is currently a whopping 100%. Let's keep it that way! Remember: if it's not in the requirements specification (i.e. the tests), it's not needed, and thus unnecessary bloat.
