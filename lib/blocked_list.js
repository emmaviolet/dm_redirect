(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*global chrome */
'use strict';

const SiteBlocker = require('./site_blocker.js');

/**
 * Iterates through the given items and forms a list with the url name and an 'unblock' button for each one
 */
var listForItems = (items) => {
    if (!Array.isArray(items) || !items.length) {
        return 'You have no blocked sites';
    }

    var htmlElements = [];

    items.forEach((item, index) => {
        htmlElements.push(
            `<div class="blocked-site row">${item}<a href="#" id="unblock-button-${item}" `,
            `class="unblock-link" style="float: right;">Unblock</a></div>`
        );

        if (index !== items.length - 1) {
            htmlElements.push('<div class="border-line"></div>');
        }
    });

    return htmlElements.join('');
};

/**
 * Constructs an html list of all the user's blocked sites and adds an event listener to each button,
 * to unblock the corresponding site if the button is clicked.
 */
var populateView = () => {
    chrome.storage.local.get(['blockedSites'], (items) => {
        document.getElementById('blocked-sites-list-content').innerHTML = listForItems(items.blockedSites);

        document.getElementById('blocked-sites-list-content').addEventListener('click', async (event) => {
            if (event.target && event.target.matches('a')) {

                var url = event.target.id.replace('unblock-button-', '');
                try {
                    await SiteBlocker.unblock([url]);
                    populateView();
                } catch (error) {
                    // log error and show error notice
                }
            }
        });
    });
};

populateView();

},{"./site_blocker.js":2}],2:[function(require,module,exports){
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
},{}]},{},[1]);
