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
