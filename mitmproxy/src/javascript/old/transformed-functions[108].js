functions[108] = function () {
    var globalStateWriteIndex = tape[globalState[35]++], tapeValue = tape[globalState[35]++];
    globalState[globalStateWriteIndex] = tapeValue;
}