(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1]);
