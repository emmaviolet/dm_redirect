/*global chrome, window */

/*
 * Populates the input field with the user's current chosen redirect url
 */
var populateRedirectInput = () => {
    'use strict';

    chrome.storage.local.get('redirectUrl', (items) => {
        var redirectUrl = items.redirectUrl || 'theguardian.com';

        var redirectInput = document.getElementById('redirect-url-input');
        redirectInput.value = redirectUrl;
    });
};

/*
 * Changes the user's redirect url to the url in the input field
 */
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

/*
 * Adds a click listener to the save button to change the user's chosen redirect url
 */
document.getElementById('redirect-save-button').addEventListener('click', (event) => {
    'use strict';

    event.stopImmediatePropagation();
    changeRedirect();
}, true);
