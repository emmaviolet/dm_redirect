/*global describe, beforeEach, before, it, after, assert */

const chrome = require('sinon-chrome');



describe('background', function () {
    'use strict';

    before(function () {
        global.chrome = chrome;
        require('../../js/background.js');
    });

    beforeEach(function () {
        chrome.runtime.sendMessage.flush();
    });

    it('should subscribe to chrome.tabs.onUpdated', function () {
        assert.ok(chrome.tabs.onUpdated.addListener.calledOnce);
    });

    after(function () {
        chrome.flush();
        delete global.chrome;
    });
});