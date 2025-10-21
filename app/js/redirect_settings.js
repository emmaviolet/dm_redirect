/*global chrome */
'use strict';

const UrlValidator = require('./url_validator.js');

/**
 * Shows an error message to the user
 */
var showError = (message) => {
    var errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    document.getElementById('success-message').style.display = 'none';
    document.getElementById('redirect-url-input').classList.add('error');
};

/**
 * Hides error messages
 */
var hideError = () => {
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('redirect-url-input').classList.remove('error');
};

/**
 * Shows a success message to the user
 */
var showSuccess = () => {
    document.getElementById('success-message').style.display = 'block';
    hideError();
    
    setTimeout(() => {
        window.location.href = '/app/views/status.html';
    }, 1000);
};

/*
 * Populates the input field with the user's current chosen redirect url
 */
var populateRedirectInput = () => {
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
    hideError();
    
    var redirectUrl = document.getElementById('redirect-url-input').value;
    
    // Validate the redirect URL
    const validationResult = UrlValidator.validate(redirectUrl);
    
    if (!validationResult.valid) {
        showError(validationResult.error);
        return;
    }
    
    var redirectUrlNormalized = validationResult.normalized;
    
    // Check if the redirect URL is in the blocked sites list (circular redirect)
    chrome.storage.local.get(['blockedSites'], (items) => {
        var blockedSites = items.blockedSites || [];
        
        var isCircular = blockedSites.some((blockedSite) => {
            return redirectUrlNormalized.includes(blockedSite) || blockedSite.includes(redirectUrlNormalized);
        });
        
        if (isCircular) {
            showError('Cannot redirect to a blocked site. Please choose a different URL.');
            return;
        }
        
        // Save the validated redirect URL
        chrome.storage.local.set({redirectUrl: redirectUrlNormalized}, () => {
            showSuccess();
        });
    });
};

populateRedirectInput();

/*
 * Adds a click listener to the save button to change the user's chosen redirect url
 */
document.getElementById('redirect-save-button').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    changeRedirect();
}, true);
