functions[71] = function () {
    var stateContext = beforeFunctionState("functions[71]", globalState);
    var globalStateReadObjectIndex = tape[globalState[35]++], globalStateReadObjectKeyIndex = tape[globalState[35]++], globalStateReadValueIndex = tape[globalState[35]++], object = globalState[globalStateReadObjectIndex], objectKey = globalState[globalStateReadObjectKeyIndex], value = globalState[globalStateReadValueIndex];
    object[objectKey] = value;
    afterFunctionState(stateContext, globalState);
}