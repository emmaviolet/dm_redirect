chrome.storage.local.get(['blockedSites', 'redirectUrl'], function(items) {
  var blockedSites = items['blockedSites'] || ['dailymail.co.uk'];
  var redirectUrl = items['redirectUrl'] || 'https://theguardian.com'

  var inputs = document.getElementsByClassName('blockedSiteInput');
  var redirectInput = document.getElementById('redirectInput');

  for (var i = 0; i < inputs.length; i++) {
    inputs[i].value = blockedSites[i] || "";
  }

  redirectInput.value = redirectUrl.replace("http://", "");
});

var saveButton = document.getElementById('saveSiteInputs');
saveButton.addEventListener('click', function(event) {
    event.stopImmediatePropagation();
    SaveInputs();
}, true);

function SaveInputs() {
  var blockedSites = [];
  var inputs = document.getElementsByClassName('blockedSiteInput');
  var redirectInputValue = document.getElementById('redirectInput').value;

  for (var i = 0; i < inputs.length; i++) {
    var value = inputs[i].value;
    if (value != "") { blockedSites.push(value) }
  }

  var redirectUrl;
  if (redirectInputValue.includes('https://') || redirectInputValue.includes('http://')) {
    redirectUrl = redirectInputValue;
  }
  else {
    redirectUrl = 'http://' + redirectInputValue;
  }

  chrome.storage.local.set({'blockedSites': blockedSites, 'redirectUrl': redirectUrl}, function() {
    window.close();
  });
}
