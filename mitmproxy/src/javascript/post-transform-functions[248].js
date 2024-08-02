functions[248] = function () {
    var stateContext = beforeFunctionState("functions[248]", globalState);
    var divisionResult, globalStateWriteIndex = tape[globalState[35]++], globalStateReadIndex1 = tape[globalState[35]++], globalStateReadIndex2 = tape[globalState[35]++], input1 = globalState[globalStateReadIndex1], input2 = globalState[globalStateReadIndex2];
    divisionResult = input1 / input2, globalState[globalStateWriteIndex] = divisionResult;
    afterFunctionState(stateContext, globalState);
}