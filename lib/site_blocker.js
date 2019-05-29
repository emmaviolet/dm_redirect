(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*global chrome */
'use strict';

class SiteBlocker {
    /*
     * Adds urls to user's blocked list
     */
    static block(urls, callback) {
        // check urls is array
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
