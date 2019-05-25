/*global chrome */

class Website {
    constructor(url) {
        // when we have logging - log an error if url does not exist or is unexpected form
        var httpStrippedUrl = url.replace(/^(http\:\/\/)|(https\:\/\/)/, "");
        var wwwStrippedUrl = httpStrippedUrl.replace(/^(www\.)/, "");
        this.url = wwwStrippedUrl;
    }

    /*
     * Adds url to user's blocked list
     */
    block(callback) {
        chrome.storage.local.get('blockedSites', (items) => {
            var blockedSites = items.blockedSites || [];

            if (!blockedSites.includes(this.url)) {
                blockedSites.push(this.url);
            }

            chrome.storage.local.set({blockedSites: blockedSites}, () => {
                if (callback) {
                    callback();
                }
            });
        });
    }

    /*
     * Removes url from user's blocked list
     */
    unblock(callback) {
        chrome.storage.local.get(['blockedSites'], (items) => {
            var blockedSites = items.blockedSites;

            var updatedBlockedSites = blockedSites.filter((value) => {
                return value !== this.url;
            });

            chrome.storage.local.set({blockedSites: updatedBlockedSites}, () => {
                if (callback) {
                    callback();
                }
            });
        });
    }
}

module.exports = Website;