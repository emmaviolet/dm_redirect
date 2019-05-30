/*global describe, beforeEach, it, after, assert */
'use strict';

const chrome = require('sinon-chrome');
const SiteBlocker = require('../../app/js/site_blocker.js');

describe('SiteBlocker', () => {
    beforeEach(() => {
        chrome.flush();
        delete global.chrome;
        global.chrome = chrome;
        chrome.runtime.sendMessage.flush();
    });

    describe('block', () => {
        beforeEach(() => {
            chrome.storage.local.get.yields({blockedSites: ['facebook.com', 'website.co.uk']});
            chrome.storage.local.set.yields();
        });

        describe('if the websites are not already blocked', () => {
            it('adds the stripped website url to the list of blocked urls', async () => {
                var expectedBlockedSites = ['facebook.com', 'website.co.uk', 'google.com'];

                await SiteBlocker.block(['https://www.google.com']);
                assert.ok(chrome.storage.local.set.withArgs({blockedSites: expectedBlockedSites}).calledOnce);
            });
        });

        describe('if the websites are already blocked', () => {
            it('does not add to the list of blocked urls', async () => {
                var expectedBlockedSites = ['facebook.com', 'website.co.uk'];

                await SiteBlocker.block(['https://www.facebook.com']);
                assert.ok(chrome.storage.local.set.withArgs({blockedSites: expectedBlockedSites}).calledOnce);
            });
        });

        describe('if some of the websites are blocked', () => {
            it('adds only the not-yet-blocked urls to the list of blocked urls', async () => {
                var expectedBlockedSites = ['facebook.com', 'website.co.uk', 'anotherwebsite.com'];

                await SiteBlocker.block(['https://www.facebook.com', 'https://www.anotherwebsite.com']);
                assert.ok(chrome.storage.local.set.withArgs({blockedSites: expectedBlockedSites}).calledOnce);
            });
        });

        describe('if an empty array is passed', () => {
            it('does not change the list of blocked urls', async () => {
                await SiteBlocker.block([]);
                assert.ok(chrome.storage.local.set.notCalled);
            });
        });

        describe('if something other than an array is passed', () => {
            it('throws an error', async () => {
                var didThrow = false;

                try {
                    await SiteBlocker.block('i am not an array');
                } catch (error) {
                    didThrow = true;
                }

                assert.equal(didThrow, true);
            });
        });
    });

    describe('unblock', () => {
        beforeEach(() => {
            chrome.storage.local.get.yields({blockedSites: ['facebook.com', 'website.co.uk']});
            chrome.storage.local.set.yields();
        });

        describe('if the websites are in the blocked list', () => {
            it('removes the website url from the list of blocked urls', async () => {
                var expectedBlockedSites = ['website.co.uk'];

                await SiteBlocker.unblock(['facebook.com']);
                assert.ok(chrome.storage.local.set.withArgs({blockedSites: expectedBlockedSites}).calledOnce);
            });
        });

        describe('if the websites are not in the blocked list', () => {
            it('does not change the list of blocked urls', async () => {
                var expectedBlockedSites = ['facebook.com', 'website.co.uk'];

                await SiteBlocker.unblock(['pinterest.com']);

                assert.ok(chrome.storage.local.set.withArgs({blockedSites: expectedBlockedSites}).calledOnce);
            });
        });

        describe('if some of the websites are in the blocked list', () => {
            it('does not change the list of blocked urls', async () => {
                var expectedBlockedSites = ['website.co.uk'];

                await SiteBlocker.unblock(['pinterest.com', 'facebook.com']);

                assert.ok(chrome.storage.local.set.withArgs({blockedSites: expectedBlockedSites}).calledOnce);
            });
        });

        describe('if an empty array is passed', () => {
            it('does not change the list of blocked urls', async () => {
                await SiteBlocker.unblock([]);
                assert.ok(chrome.storage.local.set.notCalled);
            });
        });

        describe('if something other than an array is passed', () => {
            it('throws an error', async () => {
                var didThrow = false;

                try {
                    await SiteBlocker.unblock('i am not an array');
                } catch (error) {
                    didThrow = true;
                }

                assert.equal(didThrow, true);
            });
        });
    });

    after(() => {
        chrome.flush();
        delete global.chrome;
    });
});