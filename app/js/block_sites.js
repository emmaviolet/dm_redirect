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
