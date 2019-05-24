(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1]);
