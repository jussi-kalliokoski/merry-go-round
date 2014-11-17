"use strict";

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
