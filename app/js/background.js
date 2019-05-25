/*global chrome */

/**
 * Background file - listens for url changes to tabs
 * If the new url is one of the user's blocked sites, updates the tab to redirect to the user's redirect site
 */
const Tab = require('./tab.js');

chrome.tabs.onUpdated.addListener(() => {
    'use strict';

    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
        var tab = new Tab(tabs[0]);
        tab.redirectIfBlocked();
    });
});