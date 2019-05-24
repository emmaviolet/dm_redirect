(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*global chrome */

function Website(url) {
    'use strict';

    // when we have logging - log an error if url does not exist or is unexpected form
    var httpStrippedUrl = url.replace(/^(http\:\/\/)|(https\:\/\/)/, "");
    var wwwStrippedUrl = httpStrippedUrl.replace(/^(www\.)/, "");

    this.url = wwwStrippedUrl;
}

Website.prototype.block = function (callback) {
    'use strict';
    var websiteUrl = this.url;

    chrome.storage.local.get('blockedSites', function (items) {
        var blockedSites = items.blockedSites || [];

        if (!blockedSites.includes(websiteUrl)) {
            blockedSites.push(websiteUrl);
        }

        chrome.storage.local.set({blockedSites: blockedSites}, function () {
            if (callback) {
                callback();
            }
        });
    });
};

Website.prototype.unblock = function (callback) {
    'use strict';
    var websiteUrl = this.url;

    chrome.storage.local.get(['blockedSites'], function (items) {
        var blockedSites = items.blockedSites;

        var updatedBlockedSites = blockedSites.filter(function (value) {
            return value !== websiteUrl;
        });

        chrome.storage.local.set({blockedSites: updatedBlockedSites}, function () {
            if (callback) {
                callback();
            }
        });
    });
};

module.exports = Website;
},{}]},{},[1]);
