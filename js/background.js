/*global chrome */

chrome.tabs.onUpdated.addListener(function () {
    'use strict';

    chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
        var tab = tabs[0];

        chrome.storage.local.get(['blockedSites', 'redirectUrl'], function (items) {
            var blockedSites = items.blockedSites || ['dailymail.co.uk'];
            var redirectUrl = items.redirectUrl
                ? 'http://' + items.redirectUrl
                : 'http://theguardian.com';

            blockedSites.forEach(function (item) {
                if (tab.url.includes(item)) {
                    chrome.tabs.update(tab.id, {url: redirectUrl});
                }
            });
        });
    });
});
