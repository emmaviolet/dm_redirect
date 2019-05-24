# dm_redirect

Source code for Chrome browser extension [DM Redirect](https://chrome.google.com/webstore/detail/pfbdhjecpnbopodopafogoggcbpojdci)

### Useful documentation

Things you can do with tabs in chrome extensions: https://developer.chrome.com/extensions/tabs

### Dependencies
You will need npm and browserify to make changes to most of the javascript in this app (working on a better solution).
`npm install browserify` should do the trick.
Chrome does not like us when we make it a dev dependency because some .pem files are included in a test folder of one of its dependencies.

### Development instructions

1) If making changes to javascript files, `npm run build` will create browser-ready files wherever node files are required (note to self: there must be a better solution)
1) Go to [chrome://extensions/](chrome://extensions/)
1) Ensure developer mode is turned on
1) Remove any publicly available versions of DM Redirect
1) Select 'Load unpacked' and select the dm_redirect source folder from your local machine

### Deployment instructions

1) Update version number (but not manifest_version number) in manifest.json
1) Create zip file using command `zip -r dm_redirect dm_redirect` from parent folder
1) Edit the existing extension from the chrome [developer dashboard](https://chrome.google.com/webstore/developer/dashboard)
1) Upload the new zip file and publish
