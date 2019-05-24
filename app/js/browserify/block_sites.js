(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*global chrome, window */

const Website = require('./website.js');

function blockSites() {
    'use strict';

    var url = document.getElementById('block-site-input').value;
    if (url !== '') {
        var website = new Website(url);
        website.block(function () {
            url = '';
            window.location.href = '/app/views/status.html';
        });
    }
}

document.getElementById('block-save-button').addEventListener('click', function (event) {
    'use strict';

    event.stopImmediatePropagation();
    blockSites();
}, true);

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
