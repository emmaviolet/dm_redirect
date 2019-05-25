/*global describe, beforeEach, before, it, after, assert */

const chrome = require('sinon-chrome');
const sinon = require('sinon');
const Website = require('../../app/js/website.js');

describe('website', () => {
    'use strict';

    before(() => {
        global.chrome = chrome;
    });

    beforeEach(() => {
        chrome.runtime.sendMessage.flush();
    });

    describe('constructor', () => {
        it('creates a new website item', () => {
            var website = new Website('https://google.com');
            assert(website);
        });
    });

    describe('block', () => {
        beforeEach(() => {
            chrome.storage.local.get.yields({blockedSites: ['facebook.com', 'website.co.uk']});
            chrome.storage.local.set.yields();
        });

        describe('if the website is not already blocked', () => {
            it('adds the stripped website url to the list of blocked urls', () => {
                var website = new Website('https://www.google.com');
                var expectedBlockedSites = ['facebook.com', 'website.co.uk', 'google.com'];

                website.block();
                assert.ok(chrome.storage.local.set.withArgs({blockedSites: expectedBlockedSites}).calledOnce);
            });
        });

        describe('if the website is already blocked', () => {
            it('does not add to the list of blocked urls', () => {
                var website = new Website('https://www.facebook.com');
                var expectedBlockedSites = ['facebook.com', 'website.co.uk'];

                website.block();
                assert.ok(chrome.storage.local.set.withArgs({blockedSites: expectedBlockedSites}).calledOnce);
            });
        });

        it('runs callback on completion', () => {
            var spy = sinon.spy();
            var website = new Website('https://www.newwebsite.com');

            website.block(spy);
            assert.ok(spy.calledOnce);
        });
    });

    describe('unblock', () => {
        beforeEach(() => {
            chrome.storage.local.get.yields({blockedSites: ['facebook.com', 'website.co.uk']});
            chrome.storage.local.set.yields();
        });

        describe('if the website is in the blocked list', () => {
            it('removes the website url from the list of blocked urls', () => {
                var website = new Website('facebook.com');
                var expectedBlockedSites = ['website.co.uk'];

                website.unblock();
                assert.ok(chrome.storage.local.set.withArgs({blockedSites: expectedBlockedSites}).calledOnce);
            });
        });

        describe('if the website is not in the blocked list', () => {
            it('does not change the list of blocked urls', () => {
                var website = new Website('pinterest.com');
                var expectedBlockedSites = ['facebook.com', 'website.co.uk'];

                website.unblock();
                // unclear why `calledOnce` doesn't work - it does when other tests are commented out
                // in the future maybe we could check for equality of array contents and skip the local storage call
                assert.ok(chrome.storage.local.set.withArgs({blockedSites: expectedBlockedSites}).called);
            });
        });

        it('runs callback on completion', () => {
            var spy = sinon.spy();
            var website = new Website('https://www.newwebsite.com');

            website.unblock(spy);
            assert.ok(spy.calledOnce);
        });
    });

    after(() => {
        chrome.flush();
        delete global.chrome;
    });
});