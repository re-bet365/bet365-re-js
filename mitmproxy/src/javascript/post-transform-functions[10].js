functions[10] = function () {
    var stateContext = beforeFunctionState("functions[10]", globalState);
    var globalStateReadIndex = tape[globalState[35]++], nextExecutionIndex = tape[globalState[35]++] << 24 | tape[globalState[35]++] << 16 | tape[globalState[35]++] << 8 | tape[globalState[35]++];
    globalState[globalStateReadIndex] || (globalState[35] = nextExecutionIndex);
    afterFunctionState(stateContext, globalState);
}