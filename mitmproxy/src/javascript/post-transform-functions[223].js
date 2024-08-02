functions[223] = function () {
    var stateContext = beforeFunctionState("functions[223]", globalState);
    var globalStateWriteIndex, functionResult, globalStateWriteIndex = tape[globalState[35]++], globalStateReadIndex = tape[globalState[35]++], globalStateValues = function () {
            for (var globalStateReadIndex, length = tape[globalState[35]++], array = [], i = 0; i < length; i++)
                array.push((globalStateReadIndex = tape[globalState[35]++], globalState[globalStateReadIndex]));
            return array;
        }(), functionRef = globalState[globalStateReadIndex];
    functionResult = new (functionRef.bind.apply(functionRef, flattenArrays([undefined], globalStateValues)))(), globalState[globalStateWriteIndex] = functionResult;
    afterFunctionState(stateContext, globalState);
}