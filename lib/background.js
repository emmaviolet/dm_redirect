(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./tab.js":2}],2:[function(require,module,exports){
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
                this.url.includes(items.redirectUrl) ? resolve(false) : resolve(true)
            })
        })
    }

    /*
     * Updates tab url to redirect url if current url is within the user's blocked list
     */
    redirectIfBlocked() {
        chrome.storage.local.get(['blockedSites', 'redirectUrl'], (items) => {
            var blockedSites = items.blockedSites || ['dailymail.co.uk']
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
