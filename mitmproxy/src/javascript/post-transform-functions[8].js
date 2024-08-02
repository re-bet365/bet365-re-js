functions[8] = function () {
    var stateContext = beforeFunctionState("functions[8]", globalState);
    var tapeIndex = globalState[35];
    var globalStateWriteIndex = tape[globalState[35]++], globalStateWriteStringValue = function () {
            for (var length = tape[globalState[35]++] << 8 | tape[globalState[35]++], stringFromTape = '', i = 0; i < length; i++)
                stringFromTape += String.fromCharCode(114 ^ tape[globalState[35]++]);
            return stringFromTape;
        }();
    globalState[globalStateWriteIndex] = globalStateWriteStringValue;
    tapeKeywords[tapeIndex] = globalStateWriteStringValue;
    afterFunctionState(stateContext, globalState);
}