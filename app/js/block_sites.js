/*global chrome, window */

const Website = require('./website.js');

function blockSites() {
    'use strict';

    var url = document.getElementById('block-site-input').value;
    if (url !== '') {
        var website = new Website(url);
        website.block(function () {
            url = '';
            window.location.href = '/app/views/status.html';
        });
    }
}

document.getElementById('block-save-button').addEventListener('click', function (event) {
    'use strict';

    event.stopImmediatePropagation();
    blockSites();
}, true);
