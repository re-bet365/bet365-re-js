functions[100] = function () {
    var value, globalStateWriteIndex = tape[globalState[35]++], globalStateReadIndex1 = tape[globalState[35]++], globalStateReadIndex2 = tape[globalState[35]++], object = globalState[globalStateReadIndex1], objectKey = globalState[globalStateReadIndex2];
    value = object[objectKey], globalState[globalStateWriteIndex] = value;
}