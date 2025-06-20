functions[234] = function () {
    var stateContext = beforeFunctionState("functions[234]", globalState);
    var bitwiseOrResult, globalStateWriteIndex = tape[globalState[35]++], globalStateReadIndex1 = tape[globalState[35]++], globalStateReadIndex2 = tape[globalState[35]++], input1 = globalState[globalStateReadIndex1], input2 = globalState[globalStateReadIndex2];
    bitwiseOrResult = input1 | input2, globalState[globalStateWriteIndex] = bitwiseOrResult;
    afterFunctionState(stateContext, globalState);
}