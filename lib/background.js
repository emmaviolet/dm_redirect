(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*global chrome */
'use strict';

/**
 * Background file - listens for url changes to tabs
 * If the new url is one of the user's blocked sites, updates the tab to redirect to the user's redirect site
 */
const SiteBlocker = require('./site_blocker.js');
const Tab = require('./tab.js');

chrome.tabs.onUpdated.addListener(async () => {
    try {
        var tab = await Tab.current();
        tab.redirectIfBlocked();
    } catch (error) {
        // Log error when we have error logging, for now do nothing
    }
});

chrome.runtime.onInstalled.addListener( () => {
    chrome.storage.local.get(['blockedSites'], (items) => {
        if (!items.blockedSites) {
            SiteBlocker.block(['dailymail.co.uk'])
        }
    });
});

},{"./site_blocker.js":2,"./tab.js":3}],2:[function(require,module,exports){
/*global chrome */
'use strict';

class SiteBlocker {
    static _validParameters(parameters, resolve, reject) {
        if (!Array.isArray(parameters)) {
            reject(new Error('Expected array'));
            return false
        } else if (!parameters.length) {
            resolve();
            return false
        } else {
            return true
        }
    }

    /*
     * Adds urls to user's blocked list
     */
    static async block(urls) {
        return new Promise((resolve, reject) => {
            if (!this._validParameters(urls, resolve, reject)) { return }

            var sitesToBlock = urls.map((item) => {
                var httpStrippedUrl = item.replace(/^(http:\/\/)|(https:\/\/)/, "");
                var wwwStrippedUrl = httpStrippedUrl.replace(/^(www\.)/, "");
                return wwwStrippedUrl;
            });

            chrome.storage.local.get('blockedSites', (items) => {
                var blockedSites = items.blockedSites || [];

                sitesToBlock.forEach((item) => {
                    if (!blockedSites.includes(item)) {
                        blockedSites.push(item);
                    }
                });

                chrome.storage.local.set({blockedSites: blockedSites}, () => {
                    resolve();
                });
            });
        });
    }

    /*
     * Removes urls from user's blocked list
     */
    static async unblock(urls) {
        return new Promise((resolve, reject) => {
            if (!this._validParameters(urls, resolve, reject)) { return }

            chrome.storage.local.get(['blockedSites'], (items) => {
                var blockedSites = items.blockedSites;

                var updatedBlockedSites = blockedSites.filter((value) => {
                    return !urls.includes(value);
                });

                chrome.storage.local.set({blockedSites: updatedBlockedSites}, () => {
                    resolve();
                });
            });
        });
    }
}

module.exports = SiteBlocker;
},{}],3:[function(require,module,exports){
/*global chrome */
'use strict';

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
                var redirectUrl = items.redirectUrl || 'theguardian.com'
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
            var redirectUrl = items.redirectUrl ? `http://${items.redirectUrl}` : 'http://theguardian.com'

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

},{}]},{},[1]);
