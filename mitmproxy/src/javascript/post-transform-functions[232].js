functions[232] = function () {
    var stateContext = beforeFunctionState("functions[232]", globalState);
    var globalStateWriteIndex = tape[globalState[35]++], globalStateValues = function () {
            for (var globalStateReadIndex, length = tape[globalState[35]++], array = [], i = 0; i < length; i++)
                array.push((globalStateReadIndex = tape[globalState[35]++], globalState[globalStateReadIndex]));
            return array;
        }();
    globalState[globalStateWriteIndex] = globalStateValues;
    afterFunctionState(stateContext, globalState);
}