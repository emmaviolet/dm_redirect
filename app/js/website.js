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