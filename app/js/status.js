/*global chrome */
'use strict';

const SiteBlocker = require('./site_blocker.js');
const Tab = require('./tab.js');

/*
 * Adds the current site host to the user's blocked urls
 */
var blockCurrentSite = () => {
    Tab.current((tab) => {
        var hostname = new URL(tab.url).hostname;
        SiteBlocker.block([hostname], () => {
            tab.redirectIfBlocked();
            location.reload();
        });
    });
};

/*
 * Configures text to reflect the user's blocked items and redirect url
 */
var configureViewForItems = (items) => {
    var blockedSites = items.blockedSites;
    var redirectUrl = items.redirectUrl;

    var defaultRedirectText = 'You have not yet set your redirect site. By default, your blocked sites will redirect to theguardian.com';
    var redirectInfoText = redirectUrl ? `Your blocked sites redirect to ${redirectUrl}` : defaultRedirectText;
    document.getElementById('status-redirect-info').innerHTML = redirectInfoText;

    var blockedInfoText = blockedSites.length === 1 ? 'You have 1 blocked site' : `You have ${blockedSites.length} blocked sites`;
    document.getElementById('blocked-sites-info').innerHTML = blockedInfoText;

    Tab.current((tab) => {
        var hostname = new URL(tab.url).hostname;
        var currentSiteInfoText = `You are currently visiting ${hostname}`;
        document.getElementById('current-site-text').innerHTML = currentSiteInfoText;
    });
};

/*
 * Chooses which status view to display depending on whether the user has already selected blocked sites
 */
chrome.storage.local.get(['blockedSites', 'redirectUrl'], (items) => {
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

document.getElementById('block-current-site-button').addEventListener('click', (event) => {
    event.stopImmediatePropagation();
    blockCurrentSite();
}, true);
