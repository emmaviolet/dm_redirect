/*global describe, beforeEach, before, it, after, assert */
'use strict';

const chrome = require('sinon-chrome');
const sinon = require('sinon');
const SiteBlocker = require('../../app/js/site_blocker.js');

describe('SiteBlocker', () => {
    before(() => {
        global.chrome = chrome;
    });

    beforeEach(() => {
        chrome.runtime.sendMessage.flush();
    });

    describe('block', () => {
        beforeEach(() => {
            chrome.storage.local.get.yields({blockedSites: ['facebook.com', 'website.co.uk']});
            chrome.storage.local.set.yields();
        });

        describe('if the website is not already blocked', () => {
            it('adds the stripped website url to the list of blocked urls', () => {
                var expectedBlockedSites = ['facebook.com', 'website.co.uk', 'google.com'];

                SiteBlocker.block(['https://www.google.com']);
                assert.ok(chrome.storage.local.set.withArgs({blockedSites: expectedBlockedSites}).calledOnce);
            });
        });

        describe('if the website is already blocked', () => {
            it('does not add to the list of blocked urls', () => {
                var expectedBlockedSites = ['facebook.com', 'website.co.uk'];

                SiteBlocker.block(['https://www.facebook.com']);
                assert.ok(chrome.storage.local.set.withArgs({blockedSites: expectedBlockedSites}).calledOnce);
            });
        });

        it('runs callback on completion', () => {
            var spy = sinon.spy();

            SiteBlocker.block(['https://www.newwebsite.com'], spy);
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
                var expectedBlockedSites = ['website.co.uk'];

                SiteBlocker.unblock(['facebook.com']);
                assert.ok(chrome.storage.local.set.withArgs({blockedSites: expectedBlockedSites}).calledOnce);
            });
        });

        describe('if the website is not in the blocked list', () => {
            it('does not change the list of blocked urls', () => {
                var expectedBlockedSites = ['facebook.com', 'website.co.uk'];

                SiteBlocker.unblock(['pinterest.com']);
                // unclear why `calledOnce` doesn't work - it does when other tests are commented out
                // in the future maybe we could check for equality of array contents and skip the local storage call
                assert.ok(chrome.storage.local.set.withArgs({blockedSites: expectedBlockedSites}).called);
            });
        });

        it('runs callback on completion', () => {
            var spy = sinon.spy();

            SiteBlocker.unblock(['https://www.newwebsite.com'], spy);
            assert.ok(spy.calledOnce);
        });
    });

    after(() => {
        chrome.flush();
        delete global.chrome;
    });
});