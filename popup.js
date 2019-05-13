showStatusView();

populateRedirectInput();

linkButtonToView('empty-redirect-change-button', 'redirect-view');
linkButtonToView('status-redirect-change-button', 'redirect-view');
linkButtonToView('block-sites-button', 'block-site-view');
linkButtonToView('block-more-button', 'block-site-view');
linkButtonToView('block-list-button', 'blocked-sites-list-view');
linkButtonToView('block-back-button', 'status-view');
linkButtonToView('redirect-back-button', 'status-view');
linkButtonToView('list-back-button', 'status-view');
linkButtonToView('list-block-more-button', 'block-site-view');

document.getElementById('block-save-button').addEventListener('click', function(event) {
  event.stopImmediatePropagation();
  blockSites();
}, true);

document.getElementById('redirect-save-button').addEventListener('click', function(event) {
  event.stopImmediatePropagation();
  changeRedirect();
}, true);

function changeRedirect() {
  var redirectUrl = document.getElementById('redirect-url-input').value
  var redirectUrlBase = redirectUrl.split('://').slice(-1)[0];

  chrome.storage.local.set({'redirectUrl': redirectUrlBase}, function() {
    showStatusView();
    populateRedirectInput();
  });
}

function blockSites() {
  chrome.storage.local.get('blockedSites', function(items) {
    var blockedSites = items['blockedSites'] || [];
    var inputs = document.getElementsByClassName('block-site-input');

    for (var i = 0; i < inputs.length; i++) {
      var value = inputs[i].value;
      if (value != "") { blockedSites.push(value) }
    }

    chrome.storage.local.set({'blockedSites': blockedSites}, function() {
      showStatusView();
    });
  });
}

function linkButtonToView(buttonId, view) {
  document.getElementById(buttonId).addEventListener('click', function(event) {
    event.stopImmediatePropagation();

    if (view === 'status-view') {
      showStatusView()
    }
    else {
      showView(view);
    }
  }, true);
}

function showStatusView() {
  chrome.storage.local.get(['blockedSites', 'redirectUrl'], function(items) {
    var blockedSites = items['blockedSites'];
    var redirectUrl = items['redirectUrl'];

    if (!Array.isArray(blockedSites) || !blockedSites.length) {
      showView('empty-view');
    }
    else {
      var defaultRedirectText = 'You have not yet set your redirect site. By default, your blocked sites will redirect to theguardian.com';
      var redirectInfoText = redirectUrl ? 'Your blocked sites redirect to ' + redirectUrl : defaultRedirectText
      document.getElementById('empty-redirect-info').innerHTML = redirectInfoText;
      document.getElementById('status-redirect-info').innerHTML = redirectInfoText; 

      var blockedInfoText = blockedSites.length == 1 ? 'You have 1 blocked site' : 'You have ' + blockedSites.length + ' blocked sites';
      document.getElementById('blocked-sites-info').innerHTML = blockedInfoText;

      showView('status-view');
    }
  });
}

function populateRedirectInput() {
  chrome.storage.local.get('redirectUrl', function(items) {
    var redirectUrl = items['redirectUrl'] || 'theguardian.com';

    var redirectInput = document.getElementById('redirect-url-input');
    redirectInput.value = redirectUrl;
  });
}

function showView(viewName) {
  hideAllViews();

  if (viewName === 'blocked-sites-list-view') {
    setupBlockedList();
  }

  var view = document.getElementById(viewName);
  view.style.display = 'block';
}

function setupBlockedList() {
  chrome.storage.local.get(['blockedSites'], function(items) {
    var blockedSites = items['blockedSites'];
    var html = '';

    for (var i = 0; i < blockedSites.length; i++) {
      var htmlString = '<div class="blocked-site row">' + blockedSites[i] + '<a href="#" id="unblock-button-'
      htmlString += blockedSites[i] 
      htmlString += '" class="unblock-link" style="float: right;">Unblock</a></div>'

      if (i != blockedSites.length - 1) { htmlString += '<div class="border-line"></div>' }

      html += htmlString;
    }

    document.getElementById('blocked-sites-list-content').innerHTML = html;

    document.getElementById('blocked-sites-list-content').addEventListener('click',function(event) {
      console.log('click event');

      if (event.target && event.target.matches('a')) {
        unblockSites(event.target);
      }
    });
  });
}

function unblockSites(target) {
  console.log(target);
  var buttonId = target.id;

  chrome.storage.local.get(['blockedSites'], function(items) {
    var blockedSites = items['blockedSites'];
    var siteToUnblock = buttonId.replace('unblock-button-', '');
    var updatedBlockedSites = blockedSites.filter(function(value, index, arr){ return value !== siteToUnblock; });

    chrome.storage.local.set({ 'blockedSites': updatedBlockedSites }, function() { showStatusView(); });
  });
}

function hideAllViews() {
  document.getElementById('empty-view').style.display = 'none';
  document.getElementById('status-view').style.display = 'none';
  document.getElementById('redirect-view').style.display = 'none';
  document.getElementById('block-site-view').style.display = 'none';
  document.getElementById('blocked-sites-list-view').style.display = 'none';
}
