/*global describe, beforeEach, before, it, after, assert */
'use strict';

const chrome = require('sinon-chrome');
const sinon = require('sinon');
const Tab = require('../../app/js/tab.js');

describe('background', () => {
    var tabSpy;

    before(() => {
        global.chrome = chrome;
        tabSpy = sinon.stub(Tab.prototype, 'redirectIfBlocked').returns({});
        chrome.tabs.query.yields([1, 2]);
        require('../../app/js/background.js');
    });

    beforeEach(() => {
        chrome.runtime.sendMessage.flush();
    });

    it('subscribes to chrome.tabs.onUpdated', () => {
        assert.ok(chrome.tabs.onUpdated.addListener.calledOnce);
    });

    describe('when a tab is updated', () => {
        it('should call redirectIfBlocked on the created tab', () => {
            chrome.tabs.onUpdated.dispatch({url: 'my-url'});
            assert.ok(chrome.tabs.query.withArgs({active: true, lastFocusedWindow: true}).calledOnce);
            assert.ok(tabSpy.calledOnce);
        });
    });

    after(() => {
        chrome.flush();
        delete global.chrome;
    });
});