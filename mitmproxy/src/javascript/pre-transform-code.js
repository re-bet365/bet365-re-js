var consoleLogger = function(string) {
    if(console) {
        console.log(string);
    }
};

var print = function(label, input) {
    if(Array.isArray(input)) {
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
    "pointerProcessor"
]);

var circularObjectReferenceToString = function(key, value) {
    if((value && value === value.window) || circularObjectReferences.has(key)) {
        return value.toString();
    }
    return value;
};

var stateBuilder = function() {
    return {
        states: [],
        add: function(stateContext) {
            this.states.push(stateContext);
            return this;
        },
        watch: function(globalState) {
            this.add({
                "globalState[35]": globalState[35], // byte stream index
                "globalState[85]": globalState[85], // global state
                "globalState[86]": globalState[86], // global state argument
                "globalState[38]": globalState[38], //
                "globalState[105]": !!globalState[105] ? globalState[105].toString() : null, // function to perform on user agent
                "globalState[105]": !!globalState[106] ? globalState[106].toString() : null, // related to globalState[105]
                "globalState[105]": !!globalState[107] ? globalState[107].toString() : null, // related to globalState[105]
                "globalState[105]": !!globalState[108] ? globalState[108].toString() : null, // related to globalState[105]
                "globalState[131]": globalState[131], //
                "globalState[156]": globalState[156], //
                "globalState[157]": globalState[157] //
            });
            return this;
        },
        build: function() {
            return this.states;
        }
    };
};

var printFunctions = new Set([
//    "functions[0x0]",
//    "functions[0x13]",
//    "functions[0x26]",
//    "functions[0x31]",
//    "functions[0x36]",
//    "functions[0x47]",
//    "functions[0x4b]",
//    "functions[0x52]",
//    "functions[0x53]",
//    "functions[0x57]",
//    "functions[0x5a]",
//    "functions[0x5b]",
//    "functions[0x5e]",
//    "functions[0x64]",
//    "functions[0x67]",
//    "functions[0x6c]",
//    "functions[0x73]",
//    "functions[0x75]",
//    "functions[0x7c]",
//    "functions[0x83]",
//    "functions[0x85]",
//    "functions[0x8]",
//    "functions[0x8f]",
//    "functions[0x96]",
//    "functions[0xa6]",
//    "functions[0xa]",
//    "functions[0xaa]",
//    "functions[0xab]",
//    "functions[0xc4]",
//    "functions[0xc6]",
//    "functions[0xc]",
//    "functions[0xcd]",
//    "functions[0xd3]",
//    "functions[0xdf]",
    "functions[0xe3]",
//    "functions[0xe8]",
//    "functions[0xea]",
//    "functions[0xee]",
//    "functions[0xf8]",
]);

// additionalPredicates array of functions that take in states and returns a boolean
// there is no reliable way to get the function name, as the caller function might be an anonymous function. Better to explicitly pass in the function name
var printStates = function(functionName, states, additionalPredicates, changeProperty) {
    if(states && states.length != 0 && printFunctions.has(functionName)) {
        var firstResultState = undefined == changeProperty ? undefined : states[0][changeProperty];
        var lastResultState = undefined == changeProperty ? undefined : states[states.length - 1][changeProperty];
//        var shouldPrint = (undefined == additionalPredicates || !additionalPredicates || additionalPredicates.every(additionalPredicate => additionalPredicate(states)));
        var shouldPrint =
//            50705 == states[0]["globalState[35]"]
//            typeof states[0]["globalState[85]"] == "string" && states[0]["globalState[85]"].startsWith("Mozilla")
            !Array.isArray(states[0]["globalState[85]"])
            && Array.isArray(states[states.length - 1]["globalState[85]"]) && states[states.length - 1]["globalState[85]"].length > 600 && states[states.length - 1]["globalState[85]"].length < 1000
            ;
        if(shouldPrint) {
            var changes = undefined != firstResultState && undefined != lastResultState ? [firstResultState, lastResultState] : undefined;
            var printInput = {
                "functionName": functionName,
                "states": states,
                "changes": changes
            }
            print(`inside ${functionName}`, printInput);
        }
    }
};

var stateChanged = function(states) {
    var firstResultState = states[0]["globalState[85]"];
    var lastResultState = states[states.length - 1]["globalState[85]"];
    return firstResultState !== lastResultState;
};

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
    if(a.size !== b.size) {
        return false;
    }
    var newSet = new Set([...a]).union(b);
    return newSet.size === a.size;
};

var tapeKeywords = {};