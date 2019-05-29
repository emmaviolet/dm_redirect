/*global chrome */
'use strict';

class SiteBlocker {

    // any way to make this private?
    static _strippedUrls(urls) {
        return urls.map((item) => {
            var httpStrippedUrl = item.replace(/^(http\:\/\/)|(https\:\/\/)/, "");
            var wwwStrippedUrl = httpStrippedUrl.replace(/^(www\.)/, "");
            return wwwStrippedUrl;
        });
    }

    /*
     * Adds urls to user's blocked list
     */
    static block(urls, callback) {
        // check urls is array
        var sitesToBlock = this._strippedUrls(urls);

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
        var sitesToUnblock = this._strippedUrls(urls);

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