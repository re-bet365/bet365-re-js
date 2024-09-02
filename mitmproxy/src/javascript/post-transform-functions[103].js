functions[103] = function () {
    var stateContext = beforeFunctionState("functions[103]", globalState);
    var globalStateValue, globalStateWriteIndex = tape[globalState[35]++], globalStateReadIndex = tape[globalState[35]++];
    globalStateValue = globalState[globalStateReadIndex], globalState[globalStateWriteIndex] = globalStateValue;
    afterFunctionState(stateContext, globalState);
}