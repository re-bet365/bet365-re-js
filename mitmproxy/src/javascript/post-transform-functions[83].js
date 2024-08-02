functions[83] = function () {
    var stateContext = beforeFunctionState("functions[83]", globalState);
    var lteResult, globalStateWriteIndex = tape[globalState[35]++], globalStateReadIndex1 = tape[globalState[35]++], globalStateReadIndex2 = tape[globalState[35]++], input2 = globalState[globalStateReadIndex1], input1 = globalState[globalStateReadIndex2];
    lteResult = input1 <= input2, globalState[globalStateWriteIndex] = lteResult;
    afterFunctionState(stateContext, globalState);
}