functions[117] = function () {
    var nextExecutionIndex = tape[globalState[35]++] << 24 | tape[globalState[35]++] << 16 | tape[globalState[35]++] << 8 | tape[globalState[35]++];
    globalState[35] = nextExecutionIndex;
}