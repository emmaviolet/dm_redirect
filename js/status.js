/*global chrome */

function configureViewForItems(items) {
    'use strict';

    var blockedSites = items.blockedSites;
    var redirectUrl = items.redirectUrl;

    var defaultRedirectText = 'You have not yet set your redirect site. By default, your blocked sites will redirect to theguardian.com';

    var redirectInfoText = redirectUrl
        ? 'Your blocked sites redirect to ' + redirectUrl
        : defaultRedirectText;

    document.getElementById('empty-redirect-info').innerHTML = redirectInfoText;
    document.getElementById('status-redirect-info').innerHTML = redirectInfoText;

    var blockedInfoText = blockedSites.length === 1
        ? 'You have 1 blocked site'
        : 'You have ' + blockedSites.length + ' blocked sites';

    document.getElementById('blocked-sites-info').innerHTML = blockedInfoText;
}

chrome.storage.local.get(['blockedSites', 'redirectUrl'], function (items) {
    'use strict';

    var blockedSites = items.blockedSites;

    if (!Array.isArray(blockedSites) || !blockedSites.length) {
        document.getElementById('status-view').style.display = 'none';
        document.getElementById('empty-view').style.display = 'block';
    } else {
        configureViewForItems(items);
        document.getElementById('empty-view').style.display = 'none';
        document.getElementById('status-view').style.display = 'block';
    }
});
