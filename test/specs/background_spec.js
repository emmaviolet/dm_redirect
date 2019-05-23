/*global describe, beforeEach, before, it, after, assert */

const chrome = require('sinon-chrome');
const Tab = require('../../js/tab.js');
var sinon = require('sinon');

describe('background', function () {
    'use strict';
    var tabSpy;

    before(function () {
        global.chrome = chrome;
        tabSpy = sinon.stub(Tab.prototype, 'redirectIfBlocked').returns({});
        chrome.tabs.query.yields([1, 2]);
        require('../../js/background.js');
    });

    beforeEach(function () {
        chrome.runtime.sendMessage.flush();
    });

    it('should subscribe to chrome.tabs.onUpdated', function () {
        assert.ok(chrome.tabs.onUpdated.addListener.calledOnce);
    });

    describe('when a tab is updated', function () {
        beforeEach(function () {
            chrome.tabs.onUpdated.dispatch({url: 'my-url'});
        });

        it('should call redirectIfBlocked on the created tab', function () {
            assert.ok(chrome.tabs.query.withArgs({active: true, lastFocusedWindow: true}).calledOnce);
            assert.ok(tabSpy.calledOnce);
        });
    });

    after(function () {
        chrome.flush();
        delete global.chrome;
    });
});