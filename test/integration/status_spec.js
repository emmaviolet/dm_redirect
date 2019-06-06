/*global after, assert, before, boot, browser, describe, extensionPage, it */
'use strict';

describe('Status View', function() {
    this.timeout(20000); // default is 2 seconds and that may not be enough to boot browsers and pages.
    before(async function() {
        await boot();
    });

    describe('When the user has not previously loaded the extension', async function() {
        it('shows the empty view', async function() {
            const emptyView = await extensionPage.$('div#empty-view');
            assert.ok(emptyView);

            const display = await extensionPage.evaluate(() =>
                getComputedStyle(document.querySelector('div#empty-view')).display
            );

            assert.equal(display, 'block');
        })

        it('does not show the status view', async function() {
            const statusView = await extensionPage.$('div#status-view');
            assert.ok(statusView);

            const display = await extensionPage.evaluate(() =>
                getComputedStyle(document.querySelector('div#status-view')).display
            );

            assert.equal(display, 'none');
        })
    });

    after(async function() {
        await browser.close();
    });
});
