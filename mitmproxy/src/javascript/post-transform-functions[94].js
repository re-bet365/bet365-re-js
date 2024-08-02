functions[94] = function () {
    var stateContext = beforeFunctionState("functions[94]", globalState);
    var ltResult, globalStateWriteIndex = tape[globalState[35]++], globalStateReadIndex1 = tape[globalState[35]++], globalStateReadIndex2 = tape[globalState[35]++], input2 = globalState[globalStateReadIndex1], input1 = globalState[globalStateReadIndex2];
    ltResult = input1 < input2, globalState[globalStateWriteIndex] = ltResult;
    afterFunctionState(stateContext, globalState);
}