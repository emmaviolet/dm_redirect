/*global describe, beforeEach, before, it, after, assert */
'use strict';

const chrome = require('sinon-chrome');
const sinon = require('sinon');
const Tab = require('../../app/js/tab.js');

describe('background', () => {
    var tabRedirectSpy;
    var tab = new Tab({id: 123, url: 'google.com'});

    before(() => {
        global.chrome = chrome;
        tabRedirectSpy = sinon.stub(Tab.prototype, 'redirectIfBlocked');
        require('../../app/js/background.js');
    });

    beforeEach(() => {
        chrome.runtime.sendMessage.flush();
    });

    it('subscribes to chrome.tabs.onUpdated', () => {
        assert.ok(chrome.tabs.onUpdated.addListener.calledOnce);
    });

    describe('when a tab is updated', () => {
        it('should call redirectIfBlocked on the created tab', async () => {
            sinon.stub(Tab, 'current').returns(tab);

            await chrome.tabs.onUpdated.dispatch({url: 'my-url'});

            assert.calledOn(tabRedirectSpy, tab);
        });
    });

    after(() => {
        chrome.flush();
        delete global.chrome;
    });
});