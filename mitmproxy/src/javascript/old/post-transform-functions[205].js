functions[205] = function () {
    var stateContext = beforeFunctionState("functions[205]", globalState);
    var minusResult, globalStateWriteIndex = tape[globalState[35]++], globalStateReadIndex1 = tape[globalState[35]++], globalStateReadIndex2 = tape[globalState[35]++], input1 = globalState[globalStateReadIndex1], input2 = globalState[globalStateReadIndex2];
    minusResult = input1 - input2, globalState[globalStateWriteIndex] = minusResult;
    afterFunctionState(stateContext, globalState);
}