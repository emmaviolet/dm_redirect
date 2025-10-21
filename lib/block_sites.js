(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

const SiteBlocker = require('./site_blocker.js');
const UrlValidator = require('./url_validator.js');

/**
 * Shows an error message to the user
 */
var showError = (message) => {
    var errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    document.getElementById('success-message').style.display = 'none';
};

/**
 * Hides error messages
 */
var hideError = () => {
    document.getElementById('error-message').style.display = 'none';
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

/**
 * Clears error styling from all inputs
 */
var clearInputErrors = () => {
    var inputs = Array.from(document.getElementsByClassName('block-site-input'));
    inputs.forEach(input => input.classList.remove('error'));
};

/**
 * Saves an additional site to the user's list of blocked sites
 * Listens for click action on the save button
 * Pulls the contents of the input field and adds the url from the input field to the user's list of blocked sites
 */
document.getElementById('block-save-button').addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    hideError();
    clearInputErrors();

    var inputs = Array.from(document.getElementsByClassName('block-site-input'));
    var urlValues = inputs.map((item) => {
        return item.value;
    }).filter((item) => {
        return item !== null && item !== '';
    });

    // Check if at least one URL was entered
    if (urlValues.length === 0) {
        showError('Please enter at least one URL to block');
        return;
    }

    // Validate all URLs
    var validatedUrls = [];
    var hasErrors = false;

    for (let i = 0; i < urlValues.length; i++) {
        const result = UrlValidator.validate(urlValues[i]);
        
        if (!result.valid) {
            inputs[i].classList.add('error');
            showError(result.error);
            hasErrors = true;
            break;
        } else {
            validatedUrls.push(result.normalized);
        }
    }

    if (hasErrors) {
        return;
    }

    try {
        await SiteBlocker.block(validatedUrls);
        showSuccess();
    } catch (error) {
        if (error.message && error.message.includes('redirect URL')) {
            showError(error.message);
        } else {
            showError('Failed to block sites. Please try again.');
        }
    }
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

},{"./site_blocker.js":2,"./url_validator.js":3}],2:[function(require,module,exports){
/*global chrome */
'use strict';

class SiteBlocker {
    static _validParameters(parameters, resolve, reject) {
        if (!Array.isArray(parameters)) {
            reject(new Error('Expected array'));
            return false
        } else if (!parameters.length) {
            resolve();
            return false
        } else {
            return true
        }
    }

    /*
     * Adds urls to user's blocked list
     */
    static async block(urls) {
        return new Promise((resolve, reject) => {
            if (!this._validParameters(urls, resolve, reject)) { return }

            var sitesToBlock = urls.map((item) => {
                var httpStrippedUrl = item.replace(/^(http:\/\/)|(https:\/\/)/, "");
                var wwwStrippedUrl = httpStrippedUrl.replace(/^(www\.)/, "");
                return wwwStrippedUrl;
            });

            chrome.storage.local.get(['blockedSites', 'redirectUrl'], (items) => {
                var blockedSites = items.blockedSites || [];
                var redirectUrl = items.redirectUrl || 'theguardian.com';

                // Check if any of the sites to block match the redirect URL (circular redirect)
                var hasCircular = sitesToBlock.some((site) => {
                    return redirectUrl.includes(site) || site.includes(redirectUrl);
                });

                if (hasCircular) {
                    reject(new Error('Cannot block the redirect URL. Please change your redirect settings first.'));
                    return;
                }

                sitesToBlock.forEach((item) => {
                    if (!blockedSites.includes(item)) {
                        blockedSites.push(item);
                    }
                });

                chrome.storage.local.set({blockedSites: blockedSites}, () => {
                    resolve();
                });
            });
        });
    }

    /*
     * Removes urls from user's blocked list
     */
    static async unblock(urls) {
        return new Promise((resolve, reject) => {
            if (!this._validParameters(urls, resolve, reject)) { return }

            chrome.storage.local.get(['blockedSites'], (items) => {
                var blockedSites = items.blockedSites;

                var updatedBlockedSites = blockedSites.filter((value) => {
                    return !urls.includes(value);
                });

                chrome.storage.local.set({blockedSites: updatedBlockedSites}, () => {
                    resolve();
                });
            });
        });
    }
}

module.exports = SiteBlocker;
},{}],3:[function(require,module,exports){
'use strict';

/**
 * Validates and normalizes URLs/domains for the extension
 */
class UrlValidator {
    /**
     * Validates if a string is a valid domain or URL
     * @param {string} input - The URL or domain to validate
     * @returns {Object} - {valid: boolean, error: string|null, normalized: string|null}
     */
    static validate(input) {
        if (!input || typeof input !== 'string') {
            return {valid: false, error: 'Please enter a URL', normalized: null};
        }

        // Trim whitespace
        const trimmed = input.trim();
        
        if (trimmed === '') {
            return {valid: false, error: 'Please enter a URL', normalized: null};
        }

        // Check for chrome:// or extension:// URLs
        if (trimmed.match(/^(chrome|chrome-extension|edge|about):/i)) {
            return {valid: false, error: 'Cannot block browser internal pages', normalized: null};
        }

        // Strip protocol and www
        let normalized = trimmed.replace(/^(https?:\/\/)?(www\.)?/i, '');
        
        // Remove trailing slashes and paths
        normalized = normalized.split('/')[0];
        
        // Remove port if present
        normalized = normalized.split(':')[0];

        // Basic domain validation
        // Must contain at least one dot and be reasonable length
        if (!normalized.includes('.')) {
            return {valid: false, error: 'Please enter a valid domain (e.g., example.com)', normalized: null};
        }

        // Check for valid domain format
        // Allow letters, numbers, hyphens, dots, and basic internationalized domains
        const domainPattern = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
        
        if (!domainPattern.test(normalized)) {
            return {valid: false, error: 'Please enter a valid domain format', normalized: null};
        }

        // Check if it's too short (likely invalid)
        if (normalized.length < 4) {
            return {valid: false, error: 'Domain name is too short', normalized: null};
        }

        return {valid: true, error: null, normalized: normalized};
    }

    /**
     * Validates multiple URLs at once
     * @param {Array<string>} inputs - Array of URLs to validate
     * @returns {Object} - {valid: boolean, errors: Array<string>, normalized: Array<string>}
     */
    static validateMultiple(inputs) {
        const results = inputs.map(input => this.validate(input));
        const errors = results
            .filter(r => !r.valid)
            .map(r => r.error);
        const normalized = results
            .filter(r => r.valid)
            .map(r => r.normalized);
        
        return {
            valid: results.every(r => r.valid),
            errors: errors,
            normalized: normalized
        };
    }
}

module.exports = UrlValidator;

},{}]},{},[1]);
