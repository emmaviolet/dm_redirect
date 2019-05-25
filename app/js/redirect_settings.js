/*global chrome, window */

/**
 * Saves an additional site to the user's list of blocked sites
 * Listens for click action on the save button
 * Pulls the contents of the input field and adds the url from the input field to the user's list of blocked sites
 */
var populateRedirectInput = () => {
    'use strict';

    chrome.storage.local.get('redirectUrl', (items) => {
        var redirectUrl = items.redirectUrl || 'theguardian.com';

        var redirectInput = document.getElementById('redirect-url-input');
        redirectInput.value = redirectUrl;
    });
};

var changeRedirect = () => {
    'use strict';

    var redirectUrl = document.getElementById('redirect-url-input').value;
    var redirectUrlBase = redirectUrl.split('://').slice(-1)[0];

    chrome.storage.local.set({redirectUrl: redirectUrlBase}, () => {
        populateRedirectInput();
        window.location.href = '/app/views/status.html';
    });
};

populateRedirectInput();

document.getElementById('redirect-save-button').addEventListener('click', (event) => {
    'use strict';

    event.stopImmediatePropagation();
    changeRedirect();
}, true);
