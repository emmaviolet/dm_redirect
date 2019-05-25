/*global chrome, window */

const Website = require('./website.js');

/**
 * Iterates through the given items and forms a list with the url name and an 'unblock' button for each one
 */
var listForItems = (items) => {
    'use strict';

    if (!Array.isArray(items) || !items.length) {
        // This shouldn't happen so in the future we probably want to log an issue
        return 'You have no blocked sites';
    }

    var htmlElements = [];

    items.forEach((item, index) => {
        htmlElements.push(
            `<div class="blocked-site row">${item}<a href="#" id="unblock-button-${item}" `,
            `class="unblock-link" style="float: right;">Unblock</a></div>`
        )

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
chrome.storage.local.get(['blockedSites'], (items) => {
    'use strict';

    document.getElementById('blocked-sites-list-content').innerHTML = listForItems(items.blockedSites);

    document.getElementById('blocked-sites-list-content').addEventListener('click', (event) => {
        if (event.target && event.target.matches('a')) {

            var url = event.target.id.replace('unblock-button-', '');
            var website = new Website(url);
            website.unblock(() => {
                window.location.href = '/app/views/status.html';
            });

        }
    });
});
