functions[115] = function () {
    var stateContext = beforeFunctionState("functions[115]", globalState);
    var looseInequalityResult, globalStateWriteIndex = tape[globalState[35]++], globalStateReadIndex1 = tape[globalState[35]++], globalStateReadIndex2 = tape[globalState[35]++], input1 = globalState[globalStateReadIndex1], input2 = globalState[globalStateReadIndex2];
    looseInequalityResult = input1 != input2, globalState[globalStateWriteIndex] = looseInequalityResult;
    afterFunctionState(stateContext, globalState);
}