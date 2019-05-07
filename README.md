# dm_redirect

Source code for Chrome browser extension [DM Redirect](https://chrome.google.com/webstore/detail/pfbdhjecpnbopodopafogoggcbpojdci)

### Useful documentation

Things you can do with tabs in chrome extensions: https://developer.chrome.com/extensions/tabs

### Development instructions

1) Go to [chrome://extensions/](chrome://extensions/)
2) Ensure developer mode is turned on
3) Remove any publicly available versions of DM Redirect
4) Select 'Load unpacked' and select the dm_redirect source folder from your local machine

### Deployment instructions

1) Update version number (but not manifest_version number) in manifest.json
2) Create zip file using command `zip -r dm_redirect dm_redirect` from parent folder
3) Edit the existing extension from the chrome [developer dashboard](https://chrome.google.com/webstore/developer/dashboard)
4) Upload the new zip file and publish
