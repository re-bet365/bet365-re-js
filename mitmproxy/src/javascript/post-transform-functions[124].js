functions[124] = function () {
    var stateContext = beforeFunctionState("functions[124]", globalState);
    var bitwiseXorResult, globalStateWriteIndex = tape[globalState[35]++], globalStateReadIndex1 = tape[globalState[35]++], globalStateReadIndex2 = tape[globalState[35]++], input1 = globalState[globalStateReadIndex1], input2 = globalState[globalStateReadIndex2];
    bitwiseXorResult = input1 ^ input2, globalState[globalStateWriteIndex] = bitwiseXorResult;
    afterFunctionState(stateContext, globalState);
}