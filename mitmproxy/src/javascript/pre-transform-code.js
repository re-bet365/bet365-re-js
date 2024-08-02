var consoleLogger = function(string) {
    if (console) {
        console.log(string);
    }
};

var print = function(label, input) {
    if (Array.isArray(input)) {
        var object = Object.assign({}, input);
        Object.keys(object).forEach((key, value) => {
            try {
                object[key] = object[key];
            } catch (exception) {
                consoleLogger(exception)
            }
        });
        consoleLogger(label + ": " + toJsonString(object));
    } else if(typeof input === "object") {
        consoleLogger(label + ": " + toJsonString(input));
    } else {
        consoleLogger(label + ": " + input);
    }
};

var toJsonString = function(input) {
    return JSON.stringify(input, circularObjectReferenceToString);
};

var circularObjectReferences = new Set([
    "_subscriptionsInitializedDelegate",
    "_pushBalanceReceivedDelegate",
    "_currentTransportMethod",
    "delegate_transportConnectedHandler",
    "document",
    "_active_element",
    "delegate_transportConnectionFailedHandler",
    "scope",
    "rules",
    "_element",
    "_module",
    "_delegateList",
    "_actualChildren",
    "parent",
    "widthStateWatcher",
    "pointerProcessor",
    "favouritesMechanics"
]);

var circularObjectReferenceToString = function(key, value) {
    if((value && value === value.window) || circularObjectReferences.has(key)) {
        return value.toString();
    }
    return value;
};

var states = [];

var beforeFunctionState = function(functionName, globalState) {
    var stateContext = new Map([
        ["functionName", functionName],
        ["before", globalState.slice()]
    ]);
    return stateContext;
};

var afterFunctionState = function(stateContext, globalState) {
    var beforeFunctionGlobalState = stateContext.get("before");
    var changes = getGlobalStateChanges(beforeFunctionGlobalState, globalState);
    if (changes) {
        stateContext.delete("before");
        stateContext.set("change", changes);
        states.push(stateContext);
    }
};


// additionalPredicates array of functions that take in states and returns a boolean
// there is no reliable way to get the function name, as the caller function might be an anonymous function. Better to explicitly pass in the function name
var printStates = function(functionName, states, additionalPredicates) {
    if(states && states.length != 0 && printFunctions.has(functionName)) {
        var firstGlobalState = states[0];
        var lastGlobalState = states[states.length - 1];
        var shouldPrint = true;
        if (shouldPrint) {
            var changes = getGlobalStateChanges(firstGlobalState, lastGlobalState);
            var printInput = {
                "functionName": functionName,
                "states": states,
                "changes": changes
            }
            print(`inside ${functionName}`, printInput);
        }
    }
};

var getGlobalStateChanges = function(globalState1, globalState2) {
    if (globalState1 === undefined || globalState2 === undefined) return undefined;
    var globalStateKeys = new Set();
    var changed = new Map();
    globalState1.forEach((value, i) => globalStateKeys.add(i));
    globalState2.forEach((value, i) => globalStateKeys.add(i));
    for (key of globalStateKeys) {
        var globalStateValue1 = globalState1[key];
        var globalStateValue2 = globalState2[key];
        if (globalStateValue1 !== globalStateValue2) {
            changed.set(key, [globalStateValue1, globalStateValue2]);
        }
    }
    return isChangeMapEmpty(changed) ? undefined : changed;
};

var isObjectEmpty = function(object) {
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};

function isChangeMapEmpty(map) {
    if (map.size === 1 && map.get(35)) return true;
    return false;
}

var arrayEquals = function(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

var setEquals = function(a, b) {
    if(a.size !== b.size) return false;
    var newSet = new Set([...a]).union(b);
    return newSet.size === a.size;
};

var tapeKeywords = {};