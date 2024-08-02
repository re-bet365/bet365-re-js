functions[75] = function () {
    var stateContext = beforeFunctionState("functions[75]", globalState);
    var globalStateWriteIndex, value, globalStateWriteIndex = tape[globalState[35]++], functionIndex = tape[globalState[35]++], objectIndex = tape[globalState[35]++], argsArray = function () {
            for (var globalStateReadIndex, length = tape[globalState[35]++], array = [], i = 0; i < length; i++)
                array.push((globalStateReadIndex = tape[globalState[35]++], globalState[globalStateReadIndex]));
            return array;
        }(), functionRef = globalState[functionIndex], thisArg = globalState[objectIndex];
    value = functionRef.apply(thisArg, argsArray), globalState[globalStateWriteIndex] = value;
    afterFunctionState(stateContext, globalState);
}