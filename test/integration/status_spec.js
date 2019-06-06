/*global after, assert, before, boot, browser, describe, page, it, tester */
'use strict';

describe('Status View', function () { // cannot use this.timeout inside arrow functions
    this.timeout(40000); // default is 2 seconds and that may not be enough to boot browsers and pages.
    before(async () => {
        await boot();
    })

    describe('On first load', async () => {
        it('looks as expected', async () => {
            const result = await tester(page, 'screenshots/empty-view')

            assert.equal(result, true);
        })

        it('links to block sites view', async () => {
            const blockSitesButton = await page.evaluate(() =>
                document.querySelector("a[href='block_sites.html']")
            )

            // ideally would check if these are visible and enabled
            // but need to implement a method for that
            assert.ok(blockSitesButton)
        })

        it('links to redirect_settings', async () => {
            const redirectButton = await page.evaluate(() =>
                document.querySelector("a[href='redirect_settings.html']")
            )

            assert.ok(redirectButton)
        })
    })

    after(async () => {
        await browser.close();
    });
});
