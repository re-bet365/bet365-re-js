functions[133] = function () {
    var stateContext = beforeFunctionState("functions[133]", globalState);
    var nextExecutionIndex = tape[globalState[35]++] << 24 | tape[globalState[35]++] << 16 | tape[globalState[35]++] << 8 | tape[globalState[35]++], currentExecutionIndex = tape[globalState[35]++], globalStateValues = function () {
            for (var length = tape[globalState[35]++], array = [], i = 0; i < length; i++)
                array.push(tape[globalState[35]++]);
            return array;
        }(), tempGlobalState = globalState.slice();
    globalStateContexts.push([
        tempGlobalState,
        currentExecutionIndex
    ]);
    for (var globalStateWriteIndex, tempGlobalStateValue, i = 0; i < globalStateValues.length; i += 2)
        globalStateWriteIndex = globalStateValues[i], tempGlobalStateValue = tempGlobalState[globalStateValues[i + 1]], globalState[globalStateWriteIndex] = tempGlobalStateValue;
    globalState[35] = nextExecutionIndex;
    afterFunctionState(stateContext, globalState);
}