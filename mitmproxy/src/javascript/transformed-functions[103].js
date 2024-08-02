functions[103] = function () {
    var globalStateValue, globalStateWriteIndex = tape[globalState[35]++], globalStateReadIndex = tape[globalState[35]++];
    globalStateValue = globalState[globalStateReadIndex], globalState[globalStateWriteIndex] = globalStateValue;
}