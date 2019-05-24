(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*global chrome */

function configureViewForItems(items) {
    'use strict';

    var blockedSites = items.blockedSites;
    var redirectUrl = items.redirectUrl;

    var defaultRedirectText = 'You have not yet set your redirect site. By default, your blocked sites will redirect to theguardian.com';

    var redirectInfoText = redirectUrl
        ? 'Your blocked sites redirect to ' + redirectUrl
        : defaultRedirectText;

    document.getElementById('empty-redirect-info').innerHTML = redirectInfoText;
    document.getElementById('status-redirect-info').innerHTML = redirectInfoText;

    var blockedInfoText = blockedSites.length === 1
        ? 'You have 1 blocked site'
        : 'You have ' + blockedSites.length + ' blocked sites';

    document.getElementById('blocked-sites-info').innerHTML = blockedInfoText;
}

chrome.storage.local.get(['blockedSites', 'redirectUrl'], function (items) {
    'use strict';

    var blockedSites = items.blockedSites;

    if (!Array.isArray(blockedSites) || !blockedSites.length) {
        document.getElementById('status-view').style.display = 'none';
        document.getElementById('empty-view').style.display = 'block';
    } else {
        configureViewForItems(items);
        document.getElementById('empty-view').style.display = 'none';
        document.getElementById('status-view').style.display = 'block';
    }
});

},{}]},{},[1]);
