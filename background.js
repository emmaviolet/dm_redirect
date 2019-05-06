// switching to a new or different tab
// var currentSite;
// var currentSiteSecs;
var isNewInstall;
// setInterval(increase, 1000);

// Is this the install function?
chrome.runtime.onInstalled.addListener(function() {
  isNewInstall = true;
  console.log("setNewInstall");
  console.log(isNewInstall);


  // var newURL = "http://www.youtube.com/watch?v=oHg5SJYRHA0";
  // chrome.tabs.create({ url: newURL });


  // chrome.tabs.insertCSS({"code": 'document.body.style.backgroundColor="orange"'}, function(items) {
  //   console.log("Inserted css.");
  // });


  // chrome.storage.sync.set({color: '#3aa757'}, function() {
  //   console.log("The color is green.");
  // });
});

// Do we need this?
chrome.tabs.onActivated.addListener(function() {
  if (isNewInstall) {
    console.log('New install');
    isNewInstall = false;
  };


  // chrome.tabs.query({"active": true, "lastFocusedWindow": true}, function (tabs) {
  //   var tab = tabs[0];
  //   currentSite = tab.url;
  //   currentSiteSecs = 0;
  // });
});

// changing the url of an already active tab
chrome.tabs.onUpdated.addListener(function() {
  chrome.tabs.query({"active": true, "lastFocusedWindow": true}, function (tabs) {
    var tab = tabs[0];
    // currentSite = tab.url;
    // currentSiteSecs = 0;

    chrome.storage.local.get(['blockedSites', 'redirectUrl'], function(items) {
      var blockedSites = items['blockedSites'] || ['dailymail.co.uk'];
      var redirectUrl = items['redirectUrl'] || 'http://theguardian.com'

      for (var i = 0; i < blockedSites.length; i++) {
        if (tab.url.includes(blockedSites[i])) {
          chrome.tabs.update(tab.id, {url: redirectUrl});
        };
      };
    });
  });
});

// What was the intention here?
// function increase() {
//   currentSiteSecs++;
// }

// when tab is selected, get root url and set timer
// when tab is closed or another tab is selected, end timer
// add total time in seconds to root url entry in db
