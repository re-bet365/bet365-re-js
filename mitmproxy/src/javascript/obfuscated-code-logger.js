var console_logger = function(string) {
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
                console_logger(exception)
            }
        });
        console_logger(label + ": " + toJsonString(object));
    } else if(typeof input === "object") {
        console_logger(label + ": " + toJsonString(input));
    } else {
        console_logger(label + ": " + input);
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
        watch: function(_0x588211) {
            this.add({
                "_0x588211[35]": _0x588211[35], // byte stream index
                "_0x588211[85]": _0x588211[85], // global state
                "_0x588211[86]": _0x588211[86], // global state argument
                "_0x588211[38]": _0x588211[38], //
                "_0x588211[105]": !!_0x588211[105] ? _0x588211[105].toString() : null, // function to perform on user agent
                "_0x588211[105]": !!_0x588211[106] ? _0x588211[106].toString() : null, // related to globalState[105]
                "_0x588211[105]": !!_0x588211[107] ? _0x588211[107].toString() : null, // related to globalState[105]
                "_0x588211[105]": !!_0x588211[108] ? _0x588211[108].toString() : null, // related to globalState[105]
                "_0x588211[131]": _0x588211[131], //
                "_0x588211[156]": _0x588211[156], //
                "_0x588211[157]": _0x588211[157] //
            });
            return this;
        },
        build: function() {
            return this.states;
        }
    };
};

var printFunctions = new Set([
//    "_0x4951e9[0x0]",
//    "_0x4951e9[0x13]",
//    "_0x4951e9[0x26]",
//    "_0x4951e9[0x31]",
//    "_0x4951e9[0x36]",
//    "_0x4951e9[0x47]",
//    "_0x4951e9[0x4b]",
//    "_0x4951e9[0x52]",
//    "_0x4951e9[0x53]",
//    "_0x4951e9[0x57]",
//    "_0x4951e9[0x5a]",
//    "_0x4951e9[0x5b]",
//    "_0x4951e9[0x5e]",
//    "_0x4951e9[0x64]",
//    "_0x4951e9[0x67]",
//    "_0x4951e9[0x6c]",
//    "_0x4951e9[0x73]",
//    "_0x4951e9[0x75]",
//    "_0x4951e9[0x7c]",
//    "_0x4951e9[0x83]",
//    "_0x4951e9[0x85]",
//    "_0x4951e9[0x8]",
//    "_0x4951e9[0x8f]",
//    "_0x4951e9[0x96]",
//    "_0x4951e9[0xa6]",
//    "_0x4951e9[0xa]",
//    "_0x4951e9[0xaa]",
//    "_0x4951e9[0xab]",
//    "_0x4951e9[0xc4]",
//    "_0x4951e9[0xc6]",
//    "_0x4951e9[0xc]",
//    "_0x4951e9[0xcd]",
//    "_0x4951e9[0xd3]",
//    "_0x4951e9[0xdf]",
    "_0x4951e9[0xe3]",
//    "_0x4951e9[0xe8]",
//    "_0x4951e9[0xea]",
//    "_0x4951e9[0xee]",
//    "_0x4951e9[0xf8]",
//    "_0x4fdfce(_0x19519d)",
//    "_0x50ee92(_0x58916a)",
//    "_0x68e20a(_0x3af2c4)"
]);

// additionalPredicates array of functions that take in states and returns a boolean
// there is no reliable way to get the function name, as the caller function might be an anonymous function. Better to explicitly pass in the function name
var printStates = function(functionName, states, additionalPredicates, changeProperty) {
    if(states && states.length != 0 && printFunctions.has(functionName)) {
        var firstResultState = undefined == changeProperty ? undefined : states[0][changeProperty];
        var lastResultState = undefined == changeProperty ? undefined : states[states.length - 1][changeProperty];
//        var shouldPrint = (undefined == additionalPredicates || !additionalPredicates || additionalPredicates.every(additionalPredicate => additionalPredicate(states)));
        var shouldPrint =
//            50705 == states[0]["_0x588211[35]"]
//            typeof states[0]["_0x588211[85]"] == "string" && states[0]["_0x588211[85]"].startsWith("Mozilla")
            !Array.isArray(states[0]["_0x588211[85]"])
            && Array.isArray(states[states.length - 1]["_0x588211[85]"]) && states[states.length - 1]["_0x588211[85]"].length > 600 && states[states.length - 1]["_0x588211[85]"].length < 1000
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
    var firstResultState = states[0]["_0x588211[85]"];
    var lastResultState = states[states.length - 1]["_0x588211[85]"];
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
