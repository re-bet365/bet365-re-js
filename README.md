# bet365 RE JS
## Purpose
This repo aims to reverse engineer the obfuscated javascript in bet365.com.

## Terms & Licenses
This repo is for educational purposes only.
This repo is to be distributed as is with no warranty expressed or implied, and no guarantee for accuracy or applicability to any purpose.
There is no licence at this point although applying GPL or MIT license in the future might be a possibility.

## Privacy
The owner(s) of this repo wish to remain anonymous at this stage and support for this repo will be on a best efforts basis.

## Prerequisites
* miniforge/miniconda (python)
* nvm (nodejs)

## Aim
The aim of this repo is to reverse engineer `bet365.com` obfuscated javascript.
The process of setting up the environment should be:
* simple
* easy
* complete

## Getting started
Using miniforge to set up a fresh python environment is recommended but if you wish to use your current python environment that is also fine.
With a fresh environment you are free to experiment with the dependencies and delete the environment if there are dependencies issues and won't affect the existing python environment.

### Create a new python 3.11 env
```
source new-conda-environment.sh
```

### Install python dependencies
Creating a new conda environment should have already installed the pip dependencies.
If you skipped the step of creating a new conda environment you can install the pip dependencies with
```
./python-dependencies.sh
```

### node.js
Make sure node is available 
```
node --version
```

If not installed node or use nvm to install and use it.
```
nvm install v20.16.0 && nvm use v20.16.0
```
At the time of writing the latest LTS version of node is `v20.16.0`.

### Install node dependencies
```
npm install
```

### Intercept browser request!
Start the `mitmproxy` with
```
./mitmproxy.sh
```
Start the browser with the proxy setting pointing to `mitmproxy`.

For mac
```
open -a "Google Chrome" --args --proxy-server=http://localhost:8080 --enable-logging --v=1 --user-data-dir=<user-data-dir>
```
For linux
```
# TODO
```
For windows
```
# TODO
```

The output of the intercepted response files are in `/output` directory.
The obfuscated javascript is deobfuscated on the fly (at runtime) so even if bet365 changes the obfuscation implementation it should be pretty quick to get it up and running again.

### Recommendations
For starting the browser, the recommendation is to create a new chrome profile just for `mitmproxy` request/response interception.
In the future use of `obfuscated-code-logger.js` might add a lot of noise to console debugging log.
`Clear Cache` extension is useful for clearing the cache from the toolbar or binding keyboard shortcut.

## Development
For ease of develop you can put the obfuscated javascript in `mitmproxy/src/javascript/obfuscated-original.js` and compile `refactor-obfuscated-code-jscodeshift.js` each time there is change.
```
watchexec -e js "touch mitmproxy/src/python/download-payload.py && \
node mitmproxy/src/javascript/refactor-obfuscated-code-jscodeshift.js \
mitmproxy/src/javascript/obfuscated-original.js \
mitmproxy/src/javascript/deobfuscated.js"
```
This will look for any changes in any `*.js` files (apart from `obfuscated-original.js` and `deobfuscated.js`) and recompile the deobfuscation transform.

### Debugging state
If you started the chrome browser with `--enable-logging --v=1` flag then you don't need open you browser to see the console output.
The console output can be viewed in `<user-data-dir>/chrome_debug.log`.


### Current and future work
The current implementation only reverse engineers the javascript component but the control flow javascript is dictated by the `tape`.
We will need to reverse engineer the `tape` for the complete reverse engineering.

*Important:* Even if we find out how the javascript detects webdriver/playwright, please don't start scraping solely using those solution.
Scraping data using websocket is much faster and efficient it should be the go-to solution for scraping data.

*Future Work*
* find out how the javascript detects devtool being open
* find out how the javascript detects webdriver/playwright being open
* reverse engineer the websocket so webdriver/playwright doesn't need to used for scraping data

