/*global chrome */

class Tab {
    constructor(attributes) {
        this.id = attributes.id;
        this.url = attributes.url;
        // when we have logging - log an error if these do not exist or are unexpected form
    }

    redirectIfBlocked() {
        chrome.storage.local.get(['blockedSites', 'redirectUrl'], (items) => {
            var blockedSites = items.blockedSites || ['dailymail.co.uk'];
            var redirectUrl = items.redirectUrl ? 'http://' + items.redirectUrl : 'http://theguardian.com';

            blockedSites.forEach((item) => {
                if (this.url.includes(item)) {
                    chrome.tabs.update(this.id, {url: redirectUrl});
                }
            });
        });
    }
}

module.exports = Tab;
