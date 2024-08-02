functions[227] = function () {
    var stateContext = beforeFunctionState("functions[227]", globalState);
    var globalStateReadIndex = tape[globalState[35]++], globalStateValues = function () {
            for (var length = tape[globalState[35]++], array = [], i = 0; i < length; i++)
                array.push(tape[globalState[35]++]);
            return array;
        }(), latestGlobalStateContext = globalStateContexts.pop(), newGlobalState = latestGlobalStateContext[0], newGlobalStateWriteIndex = latestGlobalStateContext[1];
    globalStateContextValues = Array.from(new Set(flattenArrays(globalStateContextValues, globalStateValues))), newGlobalState[newGlobalStateWriteIndex] = globalState[globalStateReadIndex];
    for (var i = 0; i < globalStateContextValues.length; i++) {
        var globalStateWriteIndex = globalStateContextValues[i];
        newGlobalState[globalStateWriteIndex] = globalState[globalStateWriteIndex];
    }
    globalStateContexts.length || (globalStateContextValues = []), globalState = newGlobalState;
    afterFunctionState(stateContext, globalState);
}