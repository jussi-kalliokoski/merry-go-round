/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/merry-go-round/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */"use strict";

	var ACTIVE_SUFFIX = "--active";
	var BASE_CLASS_NAME = "code-examples";
	var TAB_CLASS_NAME = BASE_CLASS_NAME + "__tab";
	var CODE_CLASS_NAME = BASE_CLASS_NAME + "__code";

	function find (parent, className) {
	    return [].slice.call(parent.getElementsByClassName(className));
	}

	function activate (items, baseClassName, activeIndex) {
	    items.forEach(function (item, index) {
	        item.classList.remove(baseClassName + ACTIVE_SUFFIX);

	        if ( index === activeIndex ) {
	            item.classList.add(baseClassName + ACTIVE_SUFFIX);
	        }
	    });
	}

	function createActivator (element, baseClassName) {
	    var items = find(element, baseClassName);

	    return function (activeIndex) {
	        activate(items, baseClassName, activeIndex);
	    };
	}

	find(document, BASE_CLASS_NAME).forEach(function (element) {
	    var activateTab = createActivator(element, TAB_CLASS_NAME);
	    var activateCode = createActivator(element, CODE_CLASS_NAME);
	    var tabs = find(element, TAB_CLASS_NAME);

	    tabs.forEach(function (tab, index) {
	        tab.onclick = function () {
	            activateTab(index);
	            activateCode(index);
	        };
	    });
	});


/***/ }
/******/ ])