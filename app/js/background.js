/*global chrome */

var Tab = require('./tab.js');

chrome.tabs.onUpdated.addListener(function () {
    'use strict';

    chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
        var tab = new Tab(tabs[0]);
        tab.redirectIfBlocked();
    });
});
