/*global chrome, window */

const Website = require('./website.js');

/**
 * Saves an additional site to the user's list of blocked sites
 * Listens for click action on the save button
 * Pulls the contents of the input field and adds the url from the input field to the user's list of blocked sites
 */
document.getElementById('block-save-button').addEventListener('click', (event) => {
    'use strict';
    event.stopImmediatePropagation();

    var url = document.getElementById('block-site-input').value;
    if (url !== '') {
        var website = new Website(url);
        website.block(() => {
            url = '';
            window.location.href = '/app/views/status.html';
        });
    }
}, true);
