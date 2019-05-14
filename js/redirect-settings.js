/*global chrome, window */

function populateRedirectInput() {
    'use strict';

    chrome.storage.local.get('redirectUrl', function (items) {
        var redirectUrl = items.redirectUrl || 'theguardian.com';

        var redirectInput = document.getElementById('redirect-url-input');
        redirectInput.value = redirectUrl;
    });
}

function changeRedirect() {
    'use strict';

    var redirectUrl = document.getElementById('redirect-url-input').value;
    var redirectUrlBase = redirectUrl.split('://').slice(-1)[0];

    chrome.storage.local.set({redirectUrl: redirectUrlBase}, function () {
        populateRedirectInput();
        window.location.href = '/views/status.html';
    });
}

populateRedirectInput();

document.getElementById('redirect-save-button').addEventListener('click', function (event) {
    'use strict';

    event.stopImmediatePropagation();
    changeRedirect();
}, true);
