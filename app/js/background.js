/*global chrome */

/*
    Background
    Listens for url changes
    If the new url is one of the user's blocked sites, updates the tab to redirect to the user's redirect site
*/

const Tab = require('./tab.js');

chrome.tabs.onUpdated.addListener(function () {
    'use strict';

    chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
        var tab = new Tab(tabs[0]);
        tab.redirectIfBlocked();
    });
});
