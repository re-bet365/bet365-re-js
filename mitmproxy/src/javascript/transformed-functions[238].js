functions[238] = function () {
    var globalStateReadIndex = tape[globalState[35]++], nextExecutionIndex = tape[globalState[35]++] << 24 | tape[globalState[35]++] << 16 | tape[globalState[35]++] << 8 | tape[globalState[35]++];
    globalState[globalStateReadIndex] && (globalState[35] = nextExecutionIndex);
}