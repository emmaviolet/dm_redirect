(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

const SiteBlocker = require('./site_blocker.js');

/**
 * Saves an additional site to the user's list of blocked sites
 * Listens for click action on the save button
 * Pulls the contents of the input field and adds the url from the input field to the user's list of blocked sites
 */
document.getElementById('block-save-button').addEventListener('click', (event) => {
    event.stopImmediatePropagation();

    var inputs = Array.from(document.getElementsByClassName('block-site-input'));
    var urls = inputs.map((item) => {
        return item.value;
    }).filter((item) => {
        return item !== null && item !== '';
    });

    SiteBlocker.block(urls, () => {
        window.location.href = '/app/views/status.html';
    });
}, true);

document.getElementById('add-another-button').addEventListener('click', (event) => {
    event.stopImmediatePropagation();

    var inputBox = document.getElementById('url-inputs');
    var input = document.createElement("input");
    input.className = "block-site-input u-full-width";
    input.type = "text";
    input.placeholder = "Web address to block, eg. dailymail.co.uk";

    inputBox.appendChild(input);
    inputBox.scrollTop = inputBox.scrollHeight;
}, true);

},{"./site_blocker.js":2}],2:[function(require,module,exports){
/*global chrome */
'use strict';

class SiteBlocker {
    /*
     * Adds urls to user's blocked list
     */
    static block(urls, callback) {
        // check urls is array
        var sitesToBlock = urls.map((item) => {
            var httpStrippedUrl = item.replace(/^(http\:\/\/)|(https\:\/\/)/, "");
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
                if (callback) {
                    callback();
                }
            });
        });
    }

    /*
     * Removes urls from user's blocked list
     */
    static unblock(urls, callback) {
        var sitesToUnblock = urls;

        chrome.storage.local.get(['blockedSites'], (items) => {
            var blockedSites = items.blockedSites;

            var updatedBlockedSites = blockedSites.filter((value) => {
                return !sitesToUnblock.includes(value);
            });

            chrome.storage.local.set({blockedSites: updatedBlockedSites}, () => {
                if (callback) {
                    callback();
                }
            });
        });
    }
}

module.exports = SiteBlocker;
},{}]},{},[1]);
