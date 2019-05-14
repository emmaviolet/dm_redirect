/*global describe, beforeEach, before, it, after, assert */

const chrome = require('sinon-chrome');

describe('background.js', function () {
    'use strict';

    before(function () {
        global.chrome = chrome;
        // this.events = new EventsModule();
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