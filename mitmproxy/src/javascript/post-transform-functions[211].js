functions[211] = function () {
    var stateContext = beforeFunctionState("functions[211]", globalState);
    var globalStateWriteIndex = tape[globalState[35]++], value = tape[globalState[35]++] << 24 | tape[globalState[35]++] << 16 | tape[globalState[35]++] << 8 | tape[globalState[35]++];
    globalState[globalStateWriteIndex] = value;
    afterFunctionState(stateContext, globalState);
}