const chai = require('chai')
const puppeteer = require('puppeteer')
const sinon = require('sinon')
const ScreenshotTester = require('puppeteer-screenshot-tester')

global.assert = chai.assert
global.sinon = sinon
global.sinon.assert.expose(global.assert, {prefix: ''})

global.browser = null
global.extensionID = 'lfoeajgcchlidpicbabpmckkejpckcfb'
global.page = null
global.tester = null

global.boot = async () => {
    global.browser = await puppeteer.launch({
        headless: false,
        slowMo: 2000,
        args: [
        `--disable-extensions-except=.`,
        `--load-extension=.`
    ]})
    global.page = await global.browser.newPage()
    global.tester = await ScreenshotTester()

    await global.page.goto(`chrome-extension://${global.extensionID}/app/views/status.html`)
};
