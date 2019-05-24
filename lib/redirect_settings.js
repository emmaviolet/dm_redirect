(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
        window.location.href = '/app/views/status.html';
    });
}

populateRedirectInput();

document.getElementById('redirect-save-button').addEventListener('click', function (event) {
    'use strict';

    event.stopImmediatePropagation();
    changeRedirect();
}, true);

},{}]},{},[1]);
