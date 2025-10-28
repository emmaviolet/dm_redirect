/*global chrome */
'use strict';

const { DEFAULT_REDIRECT_URL } = require('./constants.js');

class Tab {
    constructor(attributes) {
        this.id = attributes.id
        this.url = attributes.url
        // when we have logging - log an error if these do not exist or are unexpected form
    }

    /*
     * Checks if tab is blockable (ie. not a chrome page or the user's redirectUrl)
     */
    async isBlockable() {
        if (!this.url.includes('.')) {
            return false
        }

        return new Promise((resolve) => {
            chrome.storage.local.get(['redirectUrl'], (items) => {
                var redirectUrl = items.redirectUrl || DEFAULT_REDIRECT_URL
                this.url.includes(redirectUrl) ? resolve(false) : resolve(true)
            })
        })
    }

    /*
     * Updates tab url to redirect url if current url is within the user's blocked list
     */
    redirectIfBlocked() {
        chrome.storage.local.get(['blockedSites', 'redirectUrl'], (items) => {
            var blockedSites = items.blockedSites || []
            var redirectUrl = items.redirectUrl ? `http://${items.redirectUrl}` : `http://${DEFAULT_REDIRECT_URL}`

            blockedSites.forEach((item) => {
                if (this.url.includes(item)) {
                    chrome.tabs.update(this.id, {url: redirectUrl})
                }
            });
        });
    }

    static async current() {
        return new Promise((resolve) => {
            chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
                var tab = new Tab(tabs[0])
                resolve(tab)
            });
        });
    }
}

module.exports = Tab;
