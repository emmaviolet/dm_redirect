/*global chrome */

function Tab(attributes) {
    'use strict';

    this.id = attributes.id;
    this.url = attributes.url;
    // when we have logging - log an error if these do not exist or are unexpected form
}

Tab.prototype.redirectIfBlocked = function () {
    'use strict';

    var tabUrl = this.url;
    var tabId = this.id;

    chrome.storage.local.get(['blockedSites', 'redirectUrl'], function (items) {
        var blockedSites = items.blockedSites || ['dailymail.co.uk'];
        var redirectUrl = items.redirectUrl
            ? 'http://' + items.redirectUrl
            : 'http://theguardian.com';

        blockedSites.forEach(function (item) {
            if (tabUrl.includes(item)) {
                chrome.tabs.update(tabId, {url: redirectUrl});
            }
        });
    });
};

module.exports = Tab;
