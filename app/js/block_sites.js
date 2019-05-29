'use strict';

const SiteBlocker = require('./site_blocker.js');

/**
 * Saves an additional site to the user's list of blocked sites
 * Listens for click action on the save button
 * Pulls the contents of the input field and adds the url from the input field to the user's list of blocked sites
 */
document.getElementById('block-save-button').addEventListener('click', (event) => {
    event.stopImmediatePropagation();

    var inputs = Array.from(document.getElementsByClassName('block-site-input'));
    var urls = inputs.map((item) => {
        return item.value;
    }).filter((item) => {
        return item !== null && item !== '';
    });

    SiteBlocker.block(urls, () => {
        window.location.href = '/app/views/status.html';
    });
}, true);

document.getElementById('add-another-button').addEventListener('click', (event) => {
    event.stopImmediatePropagation();

    var inputBox = document.getElementById('url-inputs');
    var input = document.createElement("input");
    input.className = "block-site-input u-full-width";
    input.type = "text";
    input.placeholder = "Web address to block, eg. dailymail.co.uk";

    inputBox.appendChild(input);
    inputBox.scrollTop = inputBox.scrollHeight;
}, true);
