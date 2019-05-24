(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*global chrome */

const Tab = require('./tab.js');

chrome.tabs.onUpdated.addListener(function () {
    'use strict';

    chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
        var tab = new Tab(tabs[0]);
        tab.redirectIfBlocked();
    });
});

},{"./tab.js":2}],2:[function(require,module,exports){
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
