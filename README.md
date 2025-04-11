# bet365 RE JS
## Purpose
This repo aims to reverse engineer the obfuscated JavaScript in `bet365.com`.

## Updates from bet365
We understand that bet365 frequently updates their obfuscated code.
To address this, we will:
* Establish a CI/CD pipeline to identify precisely when changes are made.
* Maintain a functional backup script to ensure the deobfuscation process continues to work, even when bet365 updates their code.

## Terms & Licenses
This repo is for educational purposes only.
This repo is to be distributed as is with no warranty expressed or implied, and no guarantee for accuracy or applicability to any purpose.
There is no licence at this point although applying GPL or MIT license in the future might be a possibility.

## Privacy
The owner(s) of this repo wish to remain anonymous at this stage and support for this repo will be on a best efforts basis.

## Prerequisites
* miniforge/miniconda (python)
* nvm (nodejs)

## Goal
The goal of this repo is to reverse-engineer the obfuscated JavaScript from `bet365.com`.

Setting up the environment should be:
* Simple
* Straightforward
* Complete

To keep things accessible, no TypeScript is used - just pure JavaScript as the common baseline.

## Getting started
Using miniforge to set up a fresh python environment is recommended but if you wish to use your current python environment that is also fine.
With a fresh environment you are free to experiment with the dependencies and delete the environment if there are dependencies issues and won't affect the existing python environment.

### Create a new python 3.12 env
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

If not node is not installed then use nvm to install the version in `.nvmrc`

```
nvm install $(cat .nvmrc) && nvm use
```

At the time of writing the latest LTS version of node is `v22.13.0`.

### Install node dependencies
Update npm if you were previously using npm
```
npm update -g npm
```

and install npm dependencies
```
npm install
```

### Intercept browser request!
Start the `mitmproxy` with
```
./mitmproxy.sh
```
Start the browser with the proxy setting pointing to `mitmproxy`.

The `project-dir` must be absolute path to this project directory.
For mac
```
open -a "Google Chrome" --args --proxy-server=http://localhost:8080 --enable-logging --v=1 --user-data-dir=$(pwd)/output/tmp/chrome
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
Bet365 has started to change the variable names frequently and it has been unviable to deobfuscated the JavaScript on the fly as the variable keep on changing.
The new approach is the replace the obfuscated code the deobfuscated code.

### Recommendations
For starting the browser, the recommendation is to create a new chrome profile just for `mitmproxy` request/response interception.
In the future, use of `obfuscated-code-logger.js` might add a lot of noise to console debugging log.
`Clear Cache` extension is useful for clearing the cache from the toolbar or binding keyboard shortcut.

## Development
For ease of develop you can put the obfuscated JavaScript in `mitmproxy/src/javascript/obfuscated-original.js` and compile `refactor-obfuscated-code-jscodeshift.js` each time there is change.
```
watchexec -e js "touch mitmproxy/src/python/download-payload.py && \
node mitmproxy/src/javascript/refactor-obfuscated-code-jscodeshift.js \
mitmproxy/src/javascript/obfuscated-original.js \
mitmproxy/src/javascript/deobfuscated-output.js && \
node mitmproxy/src/javascript/pre-transform-code.js"
```
This will look for any changes in any `*.js` files (apart from `obfuscated-original.js` and `deobfuscated.js`) and recompile the deobfuscation transform.

### Javascript AST manipulation
For manipulating JavaScript AST https://astexplorer.net/ is a useful tool.

### Debugging state
If you started the chrome browser with `--enable-logging --v=1` flag then you don't need open you browser to see the console output.
The console output can be viewed in `<user-data-dir>/chrome_debug.log`.

To view just the json part of the log you can perform
```
tail -f <user-data-dir>/chrome_debug.log | sed -En "s/.*inside.*\\]: (.*)\", source\:  \(3\)/\1/p"
```

## Global state
* `globalState[35]`: is the execution context of the tape. This may contain the `globalStateWriteIndex`, `globalStateReadIndex`, bits for manipulation, length of the array, etc... basically
all sorts of things that point to the tape for the current execution context.

## Blocked
### Devtool
When the devtool is open the `tapeKeywords[27269]: ""` is added. 

### Current and future work
The current implementation only reverse engineers the JavaScript component but the control flow JavaScript is dictated by the `tape`.
We will need to reverse engineer the `tape` for the complete reverse engineering.

*Important:* Even if we find out how the JavaScript detects webdriver/playwright, please don't start scraping solely using those solution.
Scraping data using websocket is much faster and efficient it should be the go-to solution for scraping data.

*Future Work*
* find out how the JavaScript detects devtool being open
* find out how the JavaScript detects webdriver/playwright being open
* reverse engineer the websocket so webdriver/playwright doesn't need to be used for scraping data
