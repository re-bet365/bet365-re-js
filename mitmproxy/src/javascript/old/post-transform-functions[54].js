functions[54] = function () {
    var stateContext = beforeFunctionState("functions[54]", globalState);
    var multiplicationResult, globalStateWriteIndex = tape[globalState[35]++], globalStateReadIndex1 = tape[globalState[35]++], globalStateReadIndex2 = tape[globalState[35]++], input1 = globalState[globalStateReadIndex1], input2 = globalState[globalStateReadIndex2];
    multiplicationResult = input1 * input2, globalState[globalStateWriteIndex] = multiplicationResult;
    afterFunctionState(stateContext, globalState);
}