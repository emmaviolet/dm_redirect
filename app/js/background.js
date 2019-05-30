/*global chrome */
'use strict';

/**
 * Background file - listens for url changes to tabs
 * If the new url is one of the user's blocked sites, updates the tab to redirect to the user's redirect site
 */
const Tab = require('./tab.js');

chrome.tabs.onUpdated.addListener(async () => {
    try {
        var tab = await Tab.current();
        tab.redirectIfBlocked();
    } catch (error) {
        // Log error when we have error logging, for now do nothing
    }
});