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
