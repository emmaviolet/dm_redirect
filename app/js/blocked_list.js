/*global chrome, window */

const Website = require('./website.js');

/**
 * Iterates through the given items and forms a list with the url name and an 'unblock' button for each one
 */
function listForItems(items) {
    'use strict';

    if (!Array.isArray(items) || !items.length) {
        // This shouldn't happen so in the future we probably want to log an issue
        return 'You have no blocked sites';
    }

    var htmlString = '';

    items.forEach(function (item, index) {
        htmlString += '<div class="blocked-site row">' + item + '<a href="#" id="unblock-button-';
        htmlString += item;
        htmlString += '" class="unblock-link" style="float: right;">Unblock</a></div>';

        if (index !== items.length - 1) {
            htmlString += '<div class="border-line"></div>';
        }
    });

    return htmlString;
}

/**
 * Constructs an html list of all the user's blocked sites and adds an event listener to each button,
 * to unblock the corresponding site if the button is clicked.
 */
chrome.storage.local.get(['blockedSites'], function (items) {
    'use strict';

    document.getElementById('blocked-sites-list-content').innerHTML = listForItems(items.blockedSites);

    document.getElementById('blocked-sites-list-content').addEventListener('click', function (event) {
        if (event.target && event.target.matches('a')) {

            var url = event.target.id.replace('unblock-button-', '');
            var website = new Website(url);
            website.unblock(function () {
                window.location.href = '/app/views/status.html';
            });

        }
    });
});
