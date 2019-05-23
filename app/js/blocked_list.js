/*global chrome, window */

function unblockSites(target) {
    'use strict';

    var buttonId = target.id;

    chrome.storage.local.get(['blockedSites'], function (items) {
        var blockedSites = items.blockedSites;
        var siteToUnblock = buttonId.replace('unblock-button-', '');
        var updatedBlockedSites = blockedSites.filter(function (value) {
            return value !== siteToUnblock;
        });

        chrome.storage.local.set({blockedSites: updatedBlockedSites}, function () {
            window.location.href = '/views/status.html';
        });
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
        // This shouldn't happen so we probably want to raise an error
        html = 'You have no blocked sites';
    } else {
        html = constructHTMLforBlockedSites(blockedSites);
    }

    document.getElementById('blocked-sites-list-content').innerHTML = html;

    document.getElementById('blocked-sites-list-content').addEventListener('click', function (event) {
        if (event.target && event.target.matches('a')) {
            unblockSites(event.target);
        }
    });
});
