/*global describe, beforeEach, before, it, after, assert */
'use strict';

const chrome = require('sinon-chrome');
const sinon = require('sinon');
const Tab = require('../../app/js/tab.js');

describe('Tab', () => {
    before(() => {
        global.chrome = chrome;
    });

    beforeEach(() => {
        chrome.runtime.sendMessage.flush();
    });

    describe('.constructor', () => {
        it('sets the tab id from the provided attributes', () => {
            var tab = new Tab({id: 389, url: 'https://google.com'});

            assert.match(tab.id, 389);
        });

        it('sets the tab url from the provided attributes', () => {
            var tab = new Tab({id: 389, url: 'https://google.com'});

            assert.match(tab.url, 'https://google.com');
        });

        it('does not set additional attributes', () => {
            var tab = new Tab({id: 389, url: 'https://google.com', index: 3});

            assert.match(tab.index, undefined);
        });
    });

    describe('#redirectIfBlocked', () => {

        describe('if neither blocked sites nor redirect url has been set', () => {
            beforeEach(() => {
                chrome.storage.local.get.yields({});
            });

            describe('and tab url is the default blocked site dailymail.co.uk', () => {
                it('redirects to the default redirect url theguardian.com', () => {
                    var tab = new Tab({id: 400, url: 'https://dailymail.co.uk'});
                    tab.redirectIfBlocked();
                    assert.ok(chrome.tabs.update.withArgs(400, {url: 'http://theguardian.com'}).calledOnce);
                });
            });

            describe('and tab url is not the default blocked site dailymail.co.uk', () => {
                it('does not redirect', () => {
                    var tab = new Tab({id: 444, url: 'https://google.com'});
                    tab.redirectIfBlocked();
                    assert.ok(chrome.tabs.update.withArgs(444, {url: 'http://theguardian.com'}).notCalled);
                });
            });
        });

        describe('if blocked sites have been set but redirect url has not been set', () => {
            beforeEach(() => {
                chrome.storage.local.get.yields({blockedSites: ['facebook.com', 'website.co.uk']});
            });

            describe('and tab url is one of the blocked sites set', () => {
                it('redirects to the default redirect url theguardian.com', () => {
                    var tab = new Tab({id: 200, url: 'https://website.co.uk'});
                    tab.redirectIfBlocked();
                    assert.ok(chrome.tabs.update.withArgs(200, {url: 'http://theguardian.com'}).calledOnce);
                });
            });

            describe('and tab url is not among the blocked sites set', () => {
                it('does not redirect', () => {
                    var tab = new Tab({id: 250, url: 'https://dailymail.co.uk'});
                    tab.redirectIfBlocked();
                    assert.ok(chrome.tabs.update.withArgs(250, {url: 'http://theguardian.com'}).notCalled);
                });
            });
        });

        describe('if redirect url has been set but blocked sites have not been set', () => {
            beforeEach(() => {
                chrome.storage.local.get.yields({redirectUrl: 'ft.com'});
            });

            describe('and tab url is the default blocked site dailymail.co.uk', () => {
                it('redirects to the http version of the redirect url set', () => {
                    var tab = new Tab({id: 199, url: 'https://dailymail.co.uk'});
                    tab.redirectIfBlocked();
                    assert.ok(chrome.tabs.update.withArgs(199, {url: 'http://ft.com'}).calledOnce);
                });
            });

            describe('and tab url is not the default blocked site dailymail.co.uk', () => {
                it('does not redirect', () => {
                    var tab = new Tab({id: 197, url: 'https://facebook.com'});
                    tab.redirectIfBlocked();
                    assert.ok(chrome.tabs.update.withArgs(197, {url: 'http://ft.com'}).notCalled);
                });
            });
        });

        describe('if both the redirect url and the blocked sites have been set', () => {
            beforeEach(() => {
                chrome.storage.local.get.yields({blockedSites: ['facebook.com', 'google.com'], redirectUrl: 'ft.com'});
            });

            describe('and tab url is one of the blocked sites set', () => {
                it('redirects to the http version of the redirect url set', () => {
                    var tab = new Tab({id: 180, url: 'https://facebook.com'});
                    tab.redirectIfBlocked();
                    assert.ok(chrome.tabs.update.withArgs(180, {url: 'http://ft.com'}).calledOnce);
                });
            });

            describe('and tab url is not one of the blocked sites set', () => {
                it('does not redirect', () => {
                    var tab = new Tab({id: 185, url: 'https://pinterest.com'});
                    tab.redirectIfBlocked();
                    assert.ok(chrome.tabs.update.withArgs(185, {url: 'http://ft.com'}).notCalled);
                });
            });
        });
    });

    describe('.current', () => {
        beforeEach(() => {
            chrome.tabs.query.yields([{id: 234, url: 'https://pinterest.com'}, {id: 456, url: 'https://google.com'}]);
        });

        it('runs the callback with the current tab', () => {
            var tab = new Tab({id: 234, url: 'https://pinterest.com'});
            var spy = sinon.spy();

            Tab.current(spy);

            assert.ok(spy.withArgs(tab).called);
        });
    });

    after(() => {
        chrome.flush();
        delete global.chrome;
    });
});