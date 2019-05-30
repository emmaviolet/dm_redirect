/*global chrome */
'use strict';

class Tab {
    constructor(attributes) {
        this.id = attributes.id;
        this.url = attributes.url;
        // when we have logging - log an error if these do not exist or are unexpected form
    }

    /*
     * Updates tab url to redirect url if current url is within the user's blocked list
     */
    redirectIfBlocked() {
        chrome.storage.local.get(['blockedSites', 'redirectUrl'], (items) => {
            var blockedSites = items.blockedSites || ['dailymail.co.uk'];
            var redirectUrl = items.redirectUrl ? `http://${items.redirectUrl}` : 'http://theguardian.com';

            blockedSites.forEach((item) => {
                if (this.url.includes(item)) {
                    chrome.tabs.update(this.id, {url: redirectUrl});
                }
            });
        });
    }

    static async current() {
        return new Promise((resolve) => {
            chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
                var tab = new Tab(tabs[0]);
                resolve(tab);
            });
        });
    }
}

module.exports = Tab;
