functions[143] = function () {
    var stateContext = beforeFunctionState("functions[143]", globalState);
    var looseEqualityResult, globalStateWriteIndex = tape[globalState[35]++], globalStateReadIndex1 = tape[globalState[35]++], globalStateReadIndex2 = tape[globalState[35]++], input1 = globalState[globalStateReadIndex1], input2 = globalState[globalStateReadIndex2];
    looseEqualityResult = input1 == input2, globalState[globalStateWriteIndex] = looseEqualityResult;
    afterFunctionState(stateContext, globalState);
}