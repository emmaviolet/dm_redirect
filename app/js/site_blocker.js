/*global chrome */
'use strict';

class SiteBlocker {
    static _validParameters(parameters, resolve, reject) {
        if (!Array.isArray(parameters)) {
            reject(new Error('Expected array'));
            return false
        } else if (!parameters.length) {
            resolve();
            return false
        } else {
            return true
        }
    }

    /*
     * Adds urls to user's blocked list
     */
    static async block(urls) {
        return new Promise((resolve, reject) => {
            if (!this._validParameters(urls, resolve, reject)) { return }

            var sitesToBlock = urls.map((item) => {
                var httpStrippedUrl = item.replace(/^(http:\/\/)|(https:\/\/)/, "");
                var wwwStrippedUrl = httpStrippedUrl.replace(/^(www\.)/, "");
                return wwwStrippedUrl;
            });

            chrome.storage.local.get(['blockedSites', 'redirectUrl'], (items) => {
                var blockedSites = items.blockedSites || [];
                var redirectUrl = items.redirectUrl || 'theguardian.com';

                // Check if any of the sites to block match the redirect URL (circular redirect)
                var hasCircular = sitesToBlock.some((site) => {
                    return redirectUrl.includes(site) || site.includes(redirectUrl);
                });

                if (hasCircular) {
                    reject(new Error('Cannot block the redirect URL. Please change your redirect settings first.'));
                    return;
                }

                sitesToBlock.forEach((item) => {
                    if (!blockedSites.includes(item)) {
                        blockedSites.push(item);
                    }
                });

                chrome.storage.local.set({blockedSites: blockedSites}, () => {
                    resolve();
                });
            });
        });
    }

    /*
     * Removes urls from user's blocked list
     */
    static async unblock(urls) {
        return new Promise((resolve, reject) => {
            if (!this._validParameters(urls, resolve, reject)) { return }

            chrome.storage.local.get(['blockedSites'], (items) => {
                var blockedSites = items.blockedSites;

                var updatedBlockedSites = blockedSites.filter((value) => {
                    return !urls.includes(value);
                });

                chrome.storage.local.set({blockedSites: updatedBlockedSites}, () => {
                    resolve();
                });
            });
        });
    }
}

module.exports = SiteBlocker;