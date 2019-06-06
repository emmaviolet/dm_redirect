const chai = require('chai');
const puppeteer = require('puppeteer');
const sinon = require('sinon');

global.assert = chai.assert;
global.sinon = sinon;
global.sinon.assert.expose(global.assert, {prefix: ''});

global.extensionPage = null;
global.browser = null;

global.boot = async () => {
    const extensionID = 'lfoeajgcchlidpicbabpmckkejpckcfb';
    const extensionPopupHtml = 'app/views/status.html';

    global.browser = await puppeteer.launch({
        headless: false,
        args: [
        `--disable-extensions-except=.`,
        `--load-extension=.`
    ]})
    global.extensionPage = await global.browser.newPage()
    await global.extensionPage.goto(`chrome-extension://${extensionID}/${extensionPopupHtml}`);
};
