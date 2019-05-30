(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
/*global chrome */
'use strict';

const SiteBlocker = require('./site_blocker.js');
const Tab = require('./tab.js');

/*
 * Adds the current site host to the user's blocked urls
 */
var blockCurrentSite = async () => {
    try {
        var tab = await Tab.current();
        var hostname = new URL(tab.url).hostname;

        await SiteBlocker.block([hostname]);
        tab.redirectIfBlocked();
        location.reload();
    } catch (error) {
        // Log the error when we have error logging
        // Show a nice error view
    }
};

/*
 * Populates notice box with details of current site
 */
var configureCurrentSiteNotice = async () => {
    try {
        var tab = await Tab.current();

        var hostname = new URL(tab.url).hostname;
        var currentSiteInfoText = `You are currently visiting ${hostname}`;
        document.getElementById('current-site-text').innerHTML = currentSiteInfoText;
        document.getElementById('current-site-notice').display = 'block';
    } catch (error) {
        // And log the error when we have error logging
        document.getElementById('current-site-notice').display = 'none';
    }
};

/*
 * Configures text to reflect the user's blocked items
 */
var setBlockedSitesText = (blockedSites) => {
    var blockedInfoText = blockedSites.length === 1 ? 'You have 1 blocked site' : `You have ${blockedSites.length} blocked sites`;
    document.getElementById('blocked-sites-info').innerHTML = blockedInfoText;
};

/*
 * Configures text to reflect the user's redirect url
 */
var setRedirectInfoText = (redirectUrl) => {
    var defaultRedirectText = 'You have not yet set your redirect site. By default, your blocked sites will redirect to theguardian.com';
    var redirectInfoText = redirectUrl ? `Your blocked sites redirect to ${redirectUrl}` : defaultRedirectText;
    document.getElementById('status-redirect-info').innerHTML = redirectInfoText;
};

/*
 * Chooses which status view to display depending on whether the user has already selected blocked sites
 */
chrome.storage.local.get(['blockedSites', 'redirectUrl'], (items) => {
    var blockedSites = items.blockedSites;

    if (!Array.isArray(blockedSites) || !blockedSites.length) {
        document.getElementById('status-view').style.display = 'none';
        document.getElementById('empty-view').style.display = 'block';
    } else {
        setBlockedSitesText(blockedSites);
        configureCurrentSiteNotice();
        document.getElementById('empty-view').style.display = 'none';
        document.getElementById('status-view').style.display = 'block';
    }

    setRedirectInfoText(items.redirectUrl);
});

document.getElementById('block-current-site-button').addEventListener('click', (event) => {
    event.stopImmediatePropagation();
    blockCurrentSite();
}, true);

},{"./site_blocker.js":1,"./tab.js":3}],3:[function(require,module,exports){
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

},{}]},{},[2]);
