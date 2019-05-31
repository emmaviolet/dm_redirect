/*global chrome */
'use strict';

const SiteBlocker = require('./site_blocker.js');
const Tab = require('./tab.js');

/*
 * Adds the current site host to the user's blocked urls
 */
var blockCurrentSite = async () => {
    try {
        var tab = await Tab.current();
        var hostname = new URL(tab.url).hostname;

        await SiteBlocker.block([hostname]);
        tab.redirectIfBlocked();
        location.reload();
    } catch (error) {
        // Log the error when we have error logging
        // Show a nice error view
    }
};

/*
 * Populates notice box with details of current site
 */
var configureCurrentSiteNotice = async () => {
    try {
        var tab = await Tab.current();

        var hostname = new URL(tab.url).hostname;
        var currentSiteInfoText = `You are currently visiting ${hostname}`;
        document.getElementById('current-site-text').innerHTML = currentSiteInfoText;
        document.getElementById('review-request-notice').display = 'none';
        document.getElementById('current-site-notice').display = 'block';
    } catch (error) {
        // And log the error when we have error logging
        document.getElementById('current-site-notice').display = 'none';
        document.getElementById('review-request-notice').display = 'block';
    }
};

/*
 * Configures text to reflect the user's blocked items
 */
var setBlockedSitesText = (blockedSites) => {
    var blockedInfoText = blockedSites.length === 1 ? 'You have 1 blocked site' : `You have ${blockedSites.length} blocked sites`;
    document.getElementById('blocked-sites-info').innerHTML = blockedInfoText;
};

/*
 * Configures text to reflect the user's redirect url
 */
var setRedirectInfoText = (view, redirectUrl) => {
    var redirectText = 'You have not yet set your redirect site. By default, your blocked sites will redirect to theguardian.com';

    if (redirectUrl) {
        redirectText = `Your blocked sites redirect to ${redirectUrl}`;
    } else if (view === 'status') {
        redirectText = 'By default, your blocked sites will redirect to theguardian.com';
    }

    document.getElementById(`${view}-redirect-info`).innerHTML = redirectText;
};

/*
 * Chooses which status view to display depending on whether the user has already selected blocked sites
 */
chrome.storage.local.get(['blockedSites', 'redirectUrl'], (items) => {
    var isEmpty = (!Array.isArray(items.blockedSites) || !items.blockedSites.length);
    var viewToShow = isEmpty ? 'empty' : 'status';

    document.getElementById('status-view').style.display = 'none';
    document.getElementById('empty-view').style.display = 'none';
    document.getElementById(`${viewToShow}-view`).style.display = 'block';

    if (viewToShow == 'status') {
        setBlockedSitesText(items.blockedSites);
        configureCurrentSiteNotice();
    } 

    setRedirectInfoText(viewToShow, items.redirectUrl);
});

document.getElementById('block-current-site-button').addEventListener('click', (event) => {
    event.stopImmediatePropagation();
    blockCurrentSite();
}, true);
