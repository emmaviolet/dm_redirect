(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*global chrome, window */

const Website = require('./website.js');

function unblockSite(targetId) {
    'use strict';

    var url = targetId.replace('unblock-button-', '');
    var website = new Website(url);
    website.unblock(function () {
        window.location.href = '/app/views/status.html';
    });
}

function constructHTMLforBlockedSites(sites) {
    'use strict';

    var htmlString = '';

    sites.forEach(function (item, index) {
        htmlString += '<div class="blocked-site row">' + item + '<a href="#" id="unblock-button-';
        htmlString += item;
        htmlString += '" class="unblock-link" style="float: right;">Unblock</a></div>';

        if (index !== sites.length - 1) {
            htmlString += '<div class="border-line"></div>';
        }
    });

    return htmlString;
}

chrome.storage.local.get(['blockedSites'], function (items) {
    'use strict';

    var blockedSites = items.blockedSites;
    var html;

    if (!Array.isArray(blockedSites) || !blockedSites.length) {
        // This shouldn't happen so in the future we probably want to log an issue
        html = 'You have no blocked sites';
    } else {
        html = constructHTMLforBlockedSites(blockedSites);
    }

    document.getElementById('blocked-sites-list-content').innerHTML = html;

    document.getElementById('blocked-sites-list-content').addEventListener('click', function (event) {
        if (event.target && event.target.matches('a')) {
            unblockSite(event.target.id);
        }
    });
});

},{"./website.js":2}],2:[function(require,module,exports){
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
