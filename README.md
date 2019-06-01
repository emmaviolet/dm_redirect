# dm_redirect

Source code for Chrome browser extension [DM Redirect](https://chrome.google.com/webstore/detail/pfbdhjecpnbopodopafogoggcbpojdci)

[![CircleCI](https://circleci.com/gh/emmaviolet/dm_redirect.svg?style=svg)](https://circleci.com/gh/emmaviolet/dm_redirect)

### Useful documentation

Things you can do with tabs in chrome extensions: https://developer.chrome.com/extensions/tabs

### Dependencies
You will need npm and browserify-directory to make changes to most of the javascript in this app (working on a better solution).
`npm install browserify-directory -g` should do the trick.
Chrome does not like us when we make browserify a dev dependency because some .pem files are included in a test folder of one of its dependencies.

### Development instructions

1) If making changes to javascript files, run `npm run start` to compile browser-ready files as you go.
1) Go to [chrome://extensions/](chrome://extensions/)
1) Ensure developer mode is turned on
1) Remove any publicly available versions of DM Redirect
1) Select 'Load unpacked' and select the dm_redirect source folder from your local machine

### Deployment instructions

1) Update version number (but not manifest_version number) in manifest.json
1) ~~Create zip file using command `zip -r dm_redirect dm_redirect` from parent folder~~ Temporarily use `zip -r dm_redirect dm_redirect -x dm_redirect/node_modules/\* -x dm_redirect/\.git/\* -x dm_redirect/\.circleci/\* -x dm_redirect/cypress/\* -x dm_redirect/test/\*` to prevent the zip file from getting too huge.
1) Edit the existing extension from the chrome [developer dashboard](https://chrome.google.com/webstore/developer/dashboard)
1) Upload the new zip file and publish
