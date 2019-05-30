/*global chrome */
'use strict';

const SiteBlocker = require('./site_blocker.js');

/**
 * Iterates through the given items and forms a list with the url name and an 'unblock' button for each one
 */
var listForItems = (items) => {
    if (!Array.isArray(items) || !items.length) {
        return 'You have no blocked sites';
    }

    var htmlElements = [];

    items.forEach((item, index) => {
        htmlElements.push(
            `<div class="blocked-site row">${item}<a href="#" id="unblock-button-${item}" `,
            `class="unblock-link" style="float: right;">Unblock</a></div>`
        );

        if (index !== items.length - 1) {
            htmlElements.push('<div class="border-line"></div>');
        }
    });

    return htmlElements.join('');
};

/**
 * Constructs an html list of all the user's blocked sites and adds an event listener to each button,
 * to unblock the corresponding site if the button is clicked.
 */
var populateView = () => {
    chrome.storage.local.get(['blockedSites'], (items) => {
        document.getElementById('blocked-sites-list-content').innerHTML = listForItems(items.blockedSites);

        document.getElementById('blocked-sites-list-content').addEventListener('click', async (event) => {
            if (event.target && event.target.matches('a')) {

                var url = event.target.id.replace('unblock-button-', '');
                try {
                    await SiteBlocker.unblock([url]);
                    populateView();
                } catch (error) {
                    // log error and show error notice
                }
            }
        });
    });
};

populateView();
