// TODO once we've built a webpage (and we should also do an uninstall feedback one as per Grammarly)
// chrome.runtime.onInstalled.addListener(function() {
//   chrome.tabs.create({"url": "XXXX"}, function(tab) {

//   });
// });

// changing the url of an already active tab
chrome.tabs.onUpdated.addListener(function() {
  chrome.tabs.query({"active": true, "lastFocusedWindow": true}, function (tabs) {
    var tab = tabs[0];

    chrome.storage.local.get(['blockedSites', 'redirectUrl'], function(items) {
      var blockedSites = items['blockedSites'] || ['dailymail.co.uk'];
      var redirectUrl = items['redirectUrl'] || 'http://theguardian.com'

      for (var i = 0; i < blockedSites.length; i++) {
        if (tab.url.includes(blockedSites[i])) {
          chrome.tabs.update(tab.id, {url: redirectUrl}, function(updatedTab) {
            var notificationId = new Date().toLocaleString();

            chrome.notifications.create(notificationId, {
              type: 'basic',
              iconUrl: 'redirect_icon.png',
              title: 'You\'ve been redirected',
              message: 'Site blocked by DM Redirect'
            });
          });
        };
      };
    });
  });
});
