/*global fixture, test */
import { Selector } from 'testcafe'

fixture('Block Site').page('../../app/views/status.html')

test('Block sites', async t => {
    await t
        // .expect(Selector('#empty-view').visible).ok()
        .expect(Selector('#status-view').visible).notOk()

        // .typeText('#developer-name', 'John Smith')
        // .click('#submit-button')

        // // Use the assertion to check if the actual header text is equal to the expected one
        // .expect(Selector('#article-header').innerText).eql('Thank you, John Smith!');
});