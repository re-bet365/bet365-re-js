functions[90] = function () {
    var globalStateWriteIndex = tape[globalState[35]++], errorFunctionIndex = tape[globalState[35]++] << 24 | tape[globalState[35]++] << 16 | tape[globalState[35]++] << 8 | tape[globalState[35]++], finallyFunctionIndex = tape[globalState[35]++] << 24 | tape[globalState[35]++] << 16 | tape[globalState[35]++] << 8 | tape[globalState[35]++], nextExecutionIndex = tape[globalState[35]++] << 24 | tape[globalState[35]++] << 16 | tape[globalState[35]++] << 8 | tape[globalState[35]++], globalStateContextsLength = globalStateContexts.length;
    try {
        executeFunctionAtExecutionIndex(true);
    } catch (error) {
        0 < globalStateContexts.length && globalStateContextsLength !== globalStateContexts.length && (globalState = globalStateContexts.pop()[0]), globalState[globalStateWriteIndex] = error, executeFunction(errorFunctionIndex);
    } finally {
        executeFunction(finallyFunctionIndex);
    }
    globalState[35] = nextExecutionIndex;
}