/*global after, assert, before, boot, browser, describe, extensionID, page, it, tester */
'use strict';

describe('Block Sites View', function () { // cannot use this.timeout inside arrow functions
    this.timeout(40000); // default is 2 seconds and that may not be enough to boot browsers and pages.
    before(async () => {
        await boot();
        page.goto(`chrome-extension://${extensionID}/app/views/block_sites.html`);
    })

    it('looks as expected', async () => {
        const result = await tester(page, 'screenshots/block-sites-view')

        assert.equal(result, true);
    })

    after(async () => {
        await browser.close();
    });
});