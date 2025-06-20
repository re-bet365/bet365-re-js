functions[38] = function () {
    var stateContext = beforeFunctionState("functions[38]", globalState);
    var globalStateWriteIndex = tape[globalState[35]++], functionIndex = tape[globalState[35]++] << 24 | tape[globalState[35]++] << 16 | tape[globalState[35]++] << 8 | tape[globalState[35]++], globalStateValues = function () {
            for (var length = tape[globalState[35]++], array = [], i = 0; i < length; i++)
                array.push(tape[globalState[35]++]);
            return array;
        }();
    globalState[globalStateWriteIndex] = function () {
        (function (globalStateWriteIndex, value) {
            globalState[globalStateWriteIndex] = value;
        }(215, this), globalStateContexts.push([
            globalState.slice(),
            125
        ]));
        for (var i = 0; i < globalStateValues.length; ++i) {
            (function (globalStateWriteIndex, value) {
                globalState[globalStateWriteIndex] = value;
            }(globalStateValues[i], arguments[i]));
        }
        var functionResult = executeFunction(functionIndex);
        return delete globalState[125], functionResult;
    };
    afterFunctionState(stateContext, globalState);
}