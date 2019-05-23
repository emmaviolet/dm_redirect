/*global chrome, window */

function blockSites() {
    'use strict';

    chrome.storage.local.get('blockedSites', function (items) {
        var blockedSites = items.blockedSites || [];
        var input = document.getElementById('block-site-input');
        var value = input.value;
        if (value !== '') {
            blockedSites.push(value);
        }

        chrome.storage.local.set({blockedSites: blockedSites}, function () {
            input.value = '';
            window.location.href = '/app/views/status.html';
        });
    });
}

document.getElementById('block-save-button').addEventListener('click', function (event) {
    'use strict';

    event.stopImmediatePropagation();
    blockSites();
}, true);
