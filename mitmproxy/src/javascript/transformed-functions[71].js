functions[71] = function () {
    var globalStateReadObjectIndex = tape[globalState[35]++], globalStateReadObjectKeyIndex = tape[globalState[35]++], globalStateReadValueIndex = tape[globalState[35]++], object = globalState[globalStateReadObjectIndex], objectKey = globalState[globalStateReadObjectKeyIndex], value = globalState[globalStateReadValueIndex];
    object[objectKey] = value;
}