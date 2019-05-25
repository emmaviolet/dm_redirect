(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*global chrome, window */

const Website = require('./website.js');

/**
 * Iterates through the given items and forms a list with the url name and an 'unblock' button for each one
 */
var listForItems = (items) => {
    'use strict';

    if (!Array.isArray(items) || !items.length) {
        // This shouldn't happen so in the future we probably want to log an issue
        return 'You have no blocked sites';
    }

    var htmlElements = [];

    items.forEach((item, index) => {
        htmlElements.push(
            `<div class="blocked-site row">${item}<a href="#" id="unblock-button-${item}" `,
            `class="unblock-link" style="float: right;">Unblock</a></div>`
        )

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
chrome.storage.local.get(['blockedSites'], (items) => {
    'use strict';

    document.getElementById('blocked-sites-list-content').innerHTML = listForItems(items.blockedSites);

    document.getElementById('blocked-sites-list-content').addEventListener('click', (event) => {
        if (event.target && event.target.matches('a')) {

            var url = event.target.id.replace('unblock-button-', '');
            var website = new Website(url);
            website.unblock(() => {
                window.location.href = '/app/views/status.html';
            });

        }
    });
});

},{"./website.js":2}],2:[function(require,module,exports){
/*global chrome */

class Website {
    constructor(url) {
        // when we have logging - log an error if url does not exist or is unexpected form
        var httpStrippedUrl = url.replace(/^(http\:\/\/)|(https\:\/\/)/, "");
        var wwwStrippedUrl = httpStrippedUrl.replace(/^(www\.)/, "");
        this.url = wwwStrippedUrl;
    }

    /*
     * Adds url to user's blocked list
     */
    block(callback) {
        chrome.storage.local.get('blockedSites', (items) => {
            var blockedSites = items.blockedSites || [];

            if (!blockedSites.includes(this.url)) {
                blockedSites.push(this.url);
            }

            chrome.storage.local.set({blockedSites: blockedSites}, () => {
                if (callback) {
                    callback();
                }
            });
        });
    }

    /*
     * Removes url from user's blocked list
     */
    unblock(callback) {
        chrome.storage.local.get(['blockedSites'], (items) => {
            var blockedSites = items.blockedSites;

            var updatedBlockedSites = blockedSites.filter((value) => {
                return value !== this.url;
            });

            chrome.storage.local.set({blockedSites: updatedBlockedSites}, () => {
                if (callback) {
                    callback();
                }
            });
        });
    }
}

module.exports = Website;
},{}]},{},[1]);
